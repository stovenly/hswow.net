import * as THREE from 'three';
import { GLINT_ATTRIBUTE } from './finish';
import { windUniforms } from './sway';
import { particleUniforms } from './particles';
import { PARTICLE_LAYER, GLOW_LAYER } from '../layers';

/**
 * Star sparkles as camera-facing quads, lifted off the surface that made them.
 *
 * The finish stage can only shade a material's own pixels, so a glint drawn
 * there is cropped at the silhouette and rotated by the face it sits on. These
 * are geometry instead: `assemble` scatters sites over star-carrying
 * triangles, `buildZoneSparkles` merges every prop's sites into one instanced
 * draw per zone, and the shader flashes a few at a time — whole, upright,
 * facing the eye.
 *
 * Drawn in the particle pass, which already owns the problem this needs
 * solved: a hand depth test against the scene's depth texture. Here the test
 * runs once, at the quad's centre, so a star shows in its entirety or not at
 * all — an occluder whose edge crosses the centre swallows it rather than
 * cropping it.
 */

/** Sites per square metre of star-carrying surface. */
const SITE_DENSITY = 50;
/** The star core's radius in metres. Arms reach five of these, the quad six. */
const STAR_UNIT = 0.013;
const QUAD_UNITS = 6;
/** Cycles per second of a site's clock. The flash keeps its old half-second. */
const RATE = 0.128;
/** Floats per site: position, normal, colour, clock seed, bright seed, star. */
const STRIDE = 12;

export const sparkleUniforms = {
  /** Global scale on every star's brightness. Zero removes them. */
  uSparkle: { value: 1 },
};

/**
 * Scatters sites over a merged geometry's star-carrying triangles, area
 * weighted, reading the same baked lane the shader does — so a gilt band on a
 * stone prop seeds the band and nothing else. Deterministic per geometry;
 * stored on `userData` for the zone build to collect.
 */
export function collectSparkleSites(geometry: THREE.BufferGeometry): void {
  const glint = geometry.getAttribute(GLINT_ATTRIBUTE);
  if (!glint) return;
  const lanes = glint.array as Uint8Array;
  let starred = false;
  for (let i = 1; i < lanes.length; i += 2) {
    if (lanes[i] > 0) {
      starred = true;
      break;
    }
  }
  if (!starred) return;

  const position = geometry.getAttribute('position');
  const colour = geometry.getAttribute('color');
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const n = new THREE.Vector3();
  const sites: number[] = [];

  for (let i = 0; i < position.count; i += 3) {
    const star = lanes[i * 2 + 1] / 255;
    if (star <= 0) continue;
    a.fromBufferAttribute(position, i);
    b.fromBufferAttribute(position, i + 1);
    c.fromBufferAttribute(position, i + 2);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    n.crossVectors(ab, ac);
    const twice = n.length();
    if (twice <= 0) continue;
    n.divideScalar(twice);

    // xorshift over the triangle index, so a rebuilt prop seeds the same spots.
    let h = (Math.imul(i / 3 + 1, 2654435761) ^ 0x9e3779b9) >>> 0;
    const roll = (): number => {
      h ^= h << 13;
      h ^= h >>> 17;
      h ^= h << 5;
      h >>>= 0;
      return h / 4294967296;
    };

    const expected = (twice / 2) * SITE_DENSITY;
    let count = Math.floor(expected);
    if (roll() < expected - count) count += 1;
    for (let s = 0; s < count; s++) {
      let u = roll();
      let v = roll();
      if (u + v > 1) {
        u = 1 - u;
        v = 1 - v;
      }
      sites.push(
        a.x + ab.x * u + ac.x * v,
        a.y + ab.y * u + ac.y * v,
        a.z + ab.z * u + ac.z * v,
        n.x,
        n.y,
        n.z,
        colour.getX(i),
        colour.getY(i),
        colour.getZ(i),
        roll(),
        roll(),
        star,
      );
    }
  }
  if (sites.length) geometry.userData.sparkleSites = new Float32Array(sites);
}

const SPARKLE_VERTEX = /* glsl */ `
attribute vec3 iPos;
attribute vec3 iNormal;
attribute vec3 iColour;
// clock seed, brightness seed, star strength
attribute vec3 iSpark;

uniform float swayTime;
uniform float uPixelsPerRadian;
uniform float uSparkle;

varying vec2 vCorner;
varying vec3 vColour;
varying float vAlpha;
varying vec2 vCentreUV;
varying float vCentreDepth;

void main() {
  vec3 world = (modelMatrix * vec4(iPos, 1.0)).xyz;
  // The upper-left 3x3 by hand — mat3(mat4) is a GLSL ES 3.00 constructor.
  vec3 normal = normalize(
    modelMatrix[0].xyz * iNormal.x + modelMatrix[1].xyz * iNormal.y
      + modelMatrix[2].xyz * iNormal.z);
  vec3 toCam = cameraPosition - world;
  float dist = max(length(toCam), 0.01);
  // A site on the far side is scattering away from the eye.
  float facing = smoothstep(0.05, 0.3, dot(normal, toCam / dist));

  // The surface version's envelope: a fast rise, a slower fall, most sites
  // faint and a few bright.
  float phase = fract(iSpark.x + swayTime * ${RATE.toFixed(3)});
  float live = smoothstep(0.0, 0.012, phase) * (1.0 - smoothstep(0.012, 0.068, phase));
  float bright = 0.44 + 1.56 * iSpark.y * iSpark.y;
  vAlpha = live * bright * facing * iSpark.z * uSparkle;

  // World-sized, clamped in pixels: it shrinks with distance, but never below
  // legibility and never swamping a close surface.
  float unitPx = clamp(${STAR_UNIT.toFixed(3)} * uPixelsPerRadian / dist, 0.7, 5.0);
  float halfWidth = ${QUAD_UNITS.toFixed(1)} * unitPx * dist / max(uPixelsPerRadian, 1.0);
  // A dark sparkle covers no pixels at all.
  float on = vAlpha > 0.004 ? 1.0 : 0.0;

  // Camera axes off the view matrix rows: the quad faces the eye, upright.
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vCorner = position.xy * 2.0;
  vec3 placed = world + (right * position.x + up * position.y) * (2.0 * halfWidth * on);

  // The centre's screen position and depth, for the all-or-nothing test.
  vec4 mvCentre = viewMatrix * vec4(world, 1.0);
  vCentreDepth = -mvCentre.z;
  vec4 clip = projectionMatrix * mvCentre;
  vCentreUV = clip.xy / max(clip.w, 1e-4) * 0.5 + 0.5;

  vColour = mix(iColour, vec3(1.0), 0.6);
  gl_Position = projectionMatrix * viewMatrix * vec4(placed, 1.0);
}
`;

const SPARKLE_FRAGMENT = /* glsl */ `
uniform sampler2D tDepth;
uniform float uNear;
uniform float uFar;

varying vec2 vCorner;
varying vec3 vColour;
varying float vAlpha;
varying vec2 vCentreUV;
varying float vCentreDepth;

float sceneDistance(vec2 uv) {
  float d = texture2D(tDepth, uv).x;
  float ndc = d * 2.0 - 1.0;
  return (2.0 * uNear * uFar) / (uFar + uNear - ndc * (uFar - uNear));
}

void main() {
  // Tested once, at the centre, so the star reaches the eye whole or not at
  // all. The margin keeps the site's own surface from swallowing it.
  float sceneZ = sceneDistance(clamp(vCentreUV, 0.0, 1.0));
  if (sceneZ < vCentreDepth - 0.08) discard;

  // A bright core, four arms along the screen axes, a soft halo.
  vec2 s = vCorner * ${QUAD_UNITS.toFixed(1)};
  float d = length(s);
  float core = 1.0 - smoothstep(0.0, 1.0, d);
  float arms = (1.0 - smoothstep(0.0, 0.25, min(abs(s.x), abs(s.y))))
    * (1.0 - smoothstep(0.6, 5.0, d));
  float halo = (1.0 - smoothstep(0.0, 3.2, d)) * 0.18;
  float shape = max(max(core, arms), halo);

  float glow = shape * vAlpha;
  if (glow <= 0.002) discard;
  gl_FragColor = vec4(vColour * glow, 1.0);
}
`;

/**
 * Additive and unlit, like every glow; its own depth test, like every
 * particle. The uniforms are the particle pass's own objects, shared by
 * reference, so the depth texture and the pixel scale arrive without a line of
 * per-frame code here.
 *
 * Built on first use, not at import: this module sits on the cycle
 * `particles → sway → assemble → sparkle`, so at import time the shared
 * uniform objects may not exist yet.
 */
let sparkleMaterial: THREE.ShaderMaterial | null = null;

function material(): THREE.ShaderMaterial {
  sparkleMaterial ??= new THREE.ShaderMaterial({
    uniforms: {
      swayTime: windUniforms.swayTime,
      tDepth: particleUniforms.tDepth,
      uNear: particleUniforms.uNear,
      uFar: particleUniforms.uFar,
      uPixelsPerRadian: particleUniforms.uPixelsPerRadian,
      uSparkle: sparkleUniforms.uSparkle,
    },
    vertexShader: SPARKLE_VERTEX,
    fragmentShader: SPARKLE_FRAGMENT,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  return sparkleMaterial;
}

/** The quad every star is drawn on. Four vertices, shared by every zone. */
const QUAD = new THREE.PlaneGeometry(1, 1);

/**
 * Every site in the zone as one instanced mesh. Called by `ZoneManager.prepare`
 * once the graph is standing, so placements are final.
 */
export function buildZoneSparkles(root: THREE.Object3D): THREE.Mesh | null {
  const entries: { sites: Float32Array; matrix: THREE.Matrix4 }[] = [];
  root.updateWorldMatrix(false, true);
  const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const sites = (object.geometry as THREE.BufferGeometry).userData.sparkleSites as
      | Float32Array
      | undefined;
    if (!sites) return;
    entries.push({
      sites,
      matrix: new THREE.Matrix4().multiplyMatrices(toRoot, object.matrixWorld),
    });
  });
  if (entries.length === 0) return null;

  let total = 0;
  for (const entry of entries) total += entry.sites.length / STRIDE;
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const col = new Float32Array(total * 3);
  const spark = new Float32Array(total * 3);

  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const rotation = new THREE.Matrix3();
  let at = 0;
  for (const entry of entries) {
    rotation.getNormalMatrix(entry.matrix);
    const s = entry.sites;
    for (let i = 0; i < s.length; i += STRIDE, at++) {
      p.set(s[i], s[i + 1], s[i + 2]).applyMatrix4(entry.matrix);
      n.set(s[i + 3], s[i + 4], s[i + 5]).applyMatrix3(rotation).normalize();
      pos[at * 3] = p.x;
      pos[at * 3 + 1] = p.y;
      pos[at * 3 + 2] = p.z;
      nor[at * 3] = n.x;
      nor[at * 3 + 1] = n.y;
      nor[at * 3 + 2] = n.z;
      col[at * 3] = s[i + 6];
      col[at * 3 + 1] = s[i + 7];
      col[at * 3 + 2] = s[i + 8];
      // The clock seed takes where the site stands, so two copies of one prop
      // never flash together.
      const shift = Math.sin(p.x * 12.9898 + p.z * 78.233) * 43758.5453;
      spark[at * 3] = (s[i + 9] + shift - Math.floor(shift)) % 1;
      spark[at * 3 + 1] = s[i + 10];
      spark[at * 3 + 2] = s[i + 11];
    }
  }

  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = QUAD.index;
  geometry.setAttribute('position', QUAD.getAttribute('position'));
  geometry.instanceCount = total;
  geometry.setAttribute('iPos', new THREE.InstancedBufferAttribute(pos, 3));
  geometry.setAttribute('iNormal', new THREE.InstancedBufferAttribute(nor, 3));
  geometry.setAttribute('iColour', new THREE.InstancedBufferAttribute(col, 3));
  geometry.setAttribute('iSpark', new THREE.InstancedBufferAttribute(spark, 3));

  const mesh = new THREE.Mesh(geometry, material());
  mesh.name = 'sparkles';
  // Particle layer only — no outline, no shadow — plus the glow layer, so the
  // core blooms like any other emitter.
  mesh.layers.set(PARTICLE_LAYER);
  mesh.layers.enable(GLOW_LAYER);
  mesh.frustumCulled = false;
  mesh.userData.noCollide = true;
  return mesh;
}
