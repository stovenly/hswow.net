import * as THREE from 'three';
import { windUniforms } from './sway';
import { STRIDE } from './sparkle-sites';
import { particleUniforms } from './particles';
import { PARTICLE_LAYER, GLOW_LAYER } from '../layers';

/**
 * Star sparkles as camera-facing quads, lifted off the surface that made them.
 * The finish stage can only shade a material's own pixels, so a glint drawn there
 * is cropped at the silhouette and rotated by the face it sits on. These are
 * geometry instead: `assemble` scatters sites over star-carrying triangles and
 * `buildZoneSparkles` merges every prop's into one instanced draw per zone.
 * Drawn in the particle pass, whose hand depth test runs once at the quad's
 * centre — so a star shows whole or not at all.
 */

/** The star core's radius in metres. Arms reach five of these, the quad six. */
const STAR_UNIT = 0.013;
const QUAD_UNITS = 6;
/** Cycles per second of a site's clock. The flash keeps its old half-second. */
const RATE = 0.128;

export const sparkleUniforms = {
  /** Global scale on every star's brightness. Zero removes them. */
  uSparkle: { value: 1 },
};

const SPARKLE_VERTEX = /* glsl */ `
attribute vec3 iPos;
attribute vec3 iNormal;
attribute vec3 iColour;
// clock seed, brightness seed, star strength, sprite
attribute vec4 iSpark;

uniform float swayTime;
uniform float uPixelsPerRadian;
uniform float uSparkle;
// Metres toward the eye, for the pass that depth-tests in hardware: a star lies
// on the surface that scatters it and would fail the test against it.
uniform float uDepthLift;

varying vec2 vCorner;
varying vec3 vColour;
varying float vAlpha;
varying vec2 vCentreUV;
varying float vCentreDepth;
varying float vSprite;
varying float vAngle;

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
  // Slivers cycle a little faster than the stars.
  float phase = fract(iSpark.x + swayTime * ${RATE.toFixed(3)} * mix(1.0, 1.45, iSpark.w));
  float live = smoothstep(0.0, 0.012, phase) * (1.0 - smoothstep(0.012, 0.068, phase));
  float bright = 0.44 + 1.56 * iSpark.y * iSpark.y;
  vAlpha = live * bright * facing * iSpark.z * uSparkle;

  // World-sized, clamped in pixels: it shrinks with distance, but never below
  // legibility and never swamping a close surface.
  float unitPx = clamp(${STAR_UNIT.toFixed(3)} * uPixelsPerRadian / dist, 0.7, 5.0);
  float halfWidth = ${QUAD_UNITS.toFixed(1)} * unitPx * dist / max(uPixelsPerRadian, 1.0);
  // Slivers sit smaller than the stars.
  halfWidth *= mix(1.0, 0.6, iSpark.w);
  vSprite = iSpark.w;
  vAngle = iSpark.y * 37.7;
  // A dark sparkle covers no pixels at all.
  float on = vAlpha > 0.004 ? 1.0 : 0.0;

  // Camera axes off the view matrix rows: the quad faces the eye, upright.
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vCorner = position.xy * 2.0;
  vec3 placed = world + (right * position.x + up * position.y) * (2.0 * halfWidth * on)
    + (toCam / dist) * uDepthLift;

  // The centre's screen position and depth, for the all-or-nothing test.
  vec4 mvCentre = viewMatrix * vec4(world, 1.0);
  vCentreDepth = -mvCentre.z;
  vec4 clip = projectionMatrix * mvCentre;
  vCentreUV = clip.xy / max(clip.w, 1e-4) * 0.5 + 0.5;

  vColour = mix(iColour, vec3(1.0), 0.6);
  gl_Position = projectionMatrix * viewMatrix * vec4(placed, 1.0);
}
`;

const SPARKLE_DEPTH_TEST = /* glsl */ `
uniform sampler2D tDepth;
uniform float uNear;
uniform float uFar;

float sceneDistance(vec2 uv) {
  float d = texture2D(tDepth, uv).x;
  float ndc = d * 2.0 - 1.0;
  return (2.0 * uNear * uFar) / (uFar + uNear - ndc * (uFar - uNear));
}
`;

/**
 * `sampled` is the particle pass, which draws into a target carrying a depth
 * renderbuffer nothing fills and so tests the scene's depth by hand. The glow
 * pass draws into the bloom target, which has the scene's depth *attached* — a
 * mesh on `GLOW_LAYER` may not sample `tDepth`, or the draw is a feedback loop.
 */
const sparkleFragment = (sampled: boolean): string => /* glsl */ `
${sampled ? SPARKLE_DEPTH_TEST : ''}

varying vec2 vCorner;
varying vec3 vColour;
varying float vAlpha;
varying vec2 vCentreUV;
varying float vCentreDepth;
varying float vSprite;
varying float vAngle;

void main() {
  // Tested once, at the centre, so the star reaches the eye whole or not at
  // all. The margin keeps the site's own surface from swallowing it.
  ${
    sampled
      ? /* glsl */ `float sceneZ = sceneDistance(clamp(vCentreUV, 0.0, 1.0));
  if (sceneZ < vCentreDepth - 0.08) discard;`
      : ''
  }

  // A bright core, four arms along the screen axes, a soft halo.
  vec2 s = vCorner * ${QUAD_UNITS.toFixed(1)};
  float d = length(s);
  float core = 1.0 - smoothstep(0.0, 1.0, d);
  float arms = (1.0 - smoothstep(0.0, 0.25, min(abs(s.x), abs(s.y))))
    * (1.0 - smoothstep(0.6, 5.0, d));
  float halo = (1.0 - smoothstep(0.0, 3.2, d)) * 0.18;
  float star = max(max(core, arms), halo);

  // The sliver: one thin line at the site's own angle, with a small core.
  float cA = cos(vAngle);
  float sA = sin(vAngle);
  vec2 r = vec2(cA * s.x + sA * s.y, cA * s.y - sA * s.x);
  float sliver = (1.0 - smoothstep(0.0, 3.4, abs(r.x)))
    * (1.0 - smoothstep(0.0, 0.32, abs(r.y)));
  float thin = max(sliver, (1.0 - smoothstep(0.0, 0.8, d)) * 0.5);

  float shape = mix(star, thin, vSprite);

  float glow = shape * vAlpha;
  if (glow <= 0.002) discard;
  gl_FragColor = vec4(vColour * glow, 1.0);
}
`;

/**
 * Additive and unlit, like every glow; its own depth test, like every particle.
 * The uniforms are the particle pass's own objects, shared by reference, so the
 * depth texture and the pixel scale arrive without per-frame code here. Built on
 * first use rather than at import: this module sits on the cycle
 * `particles → sway → assemble → sparkle`.
 */
const materials: Partial<Record<Pass, THREE.ShaderMaterial>> = {};

type Pass = 'particle' | 'glow';

/** Metres a hardware-tested star is lifted off the surface it scatters from. */
const DEPTH_LIFT = 0.08;

function material(pass: Pass): THREE.ShaderMaterial {
  const sampled = pass === 'particle';
  materials[pass] ??= new THREE.ShaderMaterial({
    uniforms: {
      swayTime: windUniforms.swayTime,
      tDepth: particleUniforms.tDepth,
      uNear: particleUniforms.uNear,
      uFar: particleUniforms.uFar,
      uPixelsPerRadian: particleUniforms.uPixelsPerRadian,
      uSparkle: sparkleUniforms.uSparkle,
      uDepthLift: { value: sampled ? 0 : DEPTH_LIFT },
    },
    vertexShader: SPARKLE_VERTEX,
    fragmentShader: sparkleFragment(sampled),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: !sampled,
    depthWrite: false,
  });
  return materials[pass];
}

/**
 * The quad every star is drawn on, and each zone gets its own copy of its four
 * vertices. `Zone.dispose` calls `dispose()` on the sparkle geometry, and three
 * answers by deleting the GPU buffer behind every attribute it holds — so a
 * shared quad would be torn out from under every other zone's sparkles. Six
 * indices and twelve floats a zone is not a cost worth sharing to avoid.
 */
const QUAD = new THREE.PlaneGeometry(1, 1);

/** A private index and position pair, so disposing one zone frees only its own. */
function quadCopy(): { index: THREE.BufferAttribute; position: THREE.BufferAttribute } {
  const index = QUAD.getIndex() as THREE.BufferAttribute;
  const position = QUAD.getAttribute('position') as THREE.BufferAttribute;
  return { index: index.clone(), position: position.clone() };
}

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
  const spark = new Float32Array(total * 4);

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
      spark[at * 4] = (s[i + 9] + shift - Math.floor(shift)) % 1;
      spark[at * 4 + 1] = s[i + 10];
      spark[at * 4 + 2] = s[i + 11];
      spark[at * 4 + 3] = s[i + 12];
    }
  }

  const geometry = new THREE.InstancedBufferGeometry();
  const quad = quadCopy();
  geometry.setIndex(quad.index);
  geometry.setAttribute('position', quad.position);
  geometry.instanceCount = total;
  geometry.setAttribute('iPos', new THREE.InstancedBufferAttribute(pos, 3));
  geometry.setAttribute('iNormal', new THREE.InstancedBufferAttribute(nor, 3));
  geometry.setAttribute('iColour', new THREE.InstancedBufferAttribute(col, 3));
  geometry.setAttribute('iSpark', new THREE.InstancedBufferAttribute(spark, 4));

  const mesh = new THREE.Mesh(geometry, material('particle'));
  mesh.name = 'sparkles';
  // Particle layer only: no outline, no shadow. See `src/layers.ts`.
  mesh.layers.set(PARTICLE_LAYER);
  mesh.frustumCulled = false;
  mesh.userData.noCollide = true;

  // The bloom pass draws the same stars again so the cores glow, through a
  // material that samples no depth. One geometry, and this one borrows it.
  const glow = new THREE.Mesh(geometry, material('glow'));
  glow.name = 'sparkles-glow';
  glow.layers.set(GLOW_LAYER);
  glow.frustumCulled = false;
  glow.userData.noCollide = true;
  glow.userData.borrowedGeometry = true;
  mesh.add(glow);
  return mesh;
}
