import * as THREE from 'three';
import { PARTICLE_LAYER, GLOW_LAYER } from '../layers';
import { windUniforms } from './sway';
import { createRng } from './random';

/**
 * Snow, rain, smoke, sparks — everything the air is doing. PARTICLES.md.
 *
 * **A particle's position is a closed-form function of its index and the
 * clock.** There is no per-frame update, no state buffer, no integration: the
 * CPU writes the time — and it does not even do that, because the wind block
 * already carries it — and the vertex shader works out where every particle is.
 *
 * That is the whole design, and everything else follows from it. A zone
 * crossing has nothing to reset. A pause is free. A frame hitch cannot blow the
 * field apart by integrating a giant `dt`. Two machines at the same clock draw
 * the same frame. What it costs is collision, accumulation and events: snow does
 * not settle, and nothing here can be *fired* — see PARTICLES.md §1 and §10,
 * which record exactly what a burst would take for the day something asks.
 *
 * Four motions cover the ten systems below, and adding one means deriving a new
 * closed form rather than calling into a different physics.
 *
 * The lighting is not hand-rolled. This is a patched `MeshLambertMaterial`,
 * exactly as `ART_MATERIAL` is, so particles take the scene's real lights, its
 * fog and its palette for free — and an ember drifting past a forge is lit by
 * the forge. The emissive variant is the additive `MeshBasicMaterial` the glow
 * kit uses, on `GLOW_LAYER` as well, which puts sparks through bloom's emitters
 * pass with no code in `Bloom.ts`.
 */

/** Which closed form a system moves by. See the table in PARTICLES.md §1. */
export type ParticleMotion = 'fall' | 'ballistic' | 'rise' | 'tumble';

/**
 * Where a system's particles live.
 *
 * - `follow` is a box carried by the camera and wrapped into — ambient weather,
 *   with no position of its own, so a few thousand particles follow the player
 *   forever and the box never has to be told they moved.
 * - `field` is the same box standing still where the mesh does. Weather over
 *   one part of a room rather than over the player, which is what lets a
 *   showcase put snow and rain side by side and walk between them.
 * - `emitter` is the mesh's own position with a spread, which is what a prop's
 *   plume is.
 */
export type ParticleVolume =
  | { kind: 'follow'; size: THREE.Vector3 }
  | { kind: 'field'; size: THREE.Vector3 }
  | { kind: 'emitter'; spread: number };

/** One particle system: what it is made of, how it moves, and how many. */
export interface ParticleSpec {
  /** How many, before the density scale in `RenderSettings`. */
  count: number;
  /**
   * A camera-facing billboard, or real geometry drawn per instance.
   *
   * There is no separate `streak`. A streak is a shutter time rather than a
   * shape — the quad stretches along its own screen-projected velocity by
   * `speed × shutter` — so rain streaks because it is fast and snow does not,
   * from one formula with nothing switched off. See PARTICLES.md §3.
   */
  shape: 'billboard' | THREE.BufferGeometry;
  motion: ParticleMotion;
  volume: ParticleVolume;
  /** Metres, rolled per instance between the two. */
  size: readonly [number, number];
  /** sRGB hex, or two to roll between. Palette names, like everything else. */
  colour: number | readonly [number, number];
  opacity: number;
  /** Metres per second, rolled per instance. */
  speed: readonly [number, number];
  /** Seconds. `fall` and `tumble` derive their own from the box and the speed. */
  life?: number;
  /** Metres per second squared. Downward for `ballistic`, upward for `rise`. */
  gravity?: number;
  /** How much of the air's motion it takes, 0..1. See §4. */
  windDrag?: number;
  /** Additive, on `GLOW_LAYER`, and it blooms. */
  emissive?: boolean;
  /** Small per-instance wander, in metres. A plume that is not a fountain. */
  turbulence?: number;
  /** How much a `rise` particle grows over its life, as a multiple of `size`. */
  growth?: number;
  /** Radians per second about a per-instance axis. `tumble` and solids. */
  spin?: number;
  /**
   * Whether the precipitation switch removes this one.
   *
   * True for weather, false for a fire's sparks. There is no still version of
   * falling snow — snow that holds still is snow hanging in the air — so the
   * accessibility option is an honest removal rather than a freeze, and what it
   * removes is the thing that fills the frame. See PARTICLES.md §8.
   */
  weather?: boolean;
}

/**
 * Metres per second of air at full gust strength.
 *
 * The gust field is a normalised 0..1 strength shared with the audio, so it
 * cannot carry a speed of its own; this is the one number that turns it into
 * one. Tuned against snow at 0.8 drag looking like it is being blown rather
 * than nudged.
 */
const WIND_CARRY = 5;

/** Texels in the gust tables. Must match `FIELD_SIZE` in `sway.ts`. */
const FIELD_SIZE = 256;

/**
 * How far a `follow` box is lifted above the camera, as a fraction of its own
 * height. Snow is mostly overhead; a box centred on the eye spends half of
 * itself underground.
 */
const FOLLOW_LIFT = 0.3;

/** The billboard, shared by every system that draws one. Four vertices. */
const BILLBOARD = new THREE.PlaneGeometry(1, 1);

/** Motion codes, as the shader reads them off the instance attribute. */
const MOTION_CODE: Record<ParticleMotion, number> = { fall: 0, ballistic: 1, rise: 2, tumble: 3 };

/** Volume codes, likewise. */
const VOLUME_CODE = { emitter: 0, follow: 1, field: 2 } as const;

export const particleUniforms = {
  /** The scene's depth, for the hand-rolled test and the soft fade off it. */
  tDepth: { value: null as THREE.Texture | null },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uNear: { value: 0.1 },
  uFar: { value: 500 },
  /** Chunky pixels per radian. What makes a flake one pixel at ten metres. */
  uPixelsPerRadian: { value: 400 },
  /** The exposure a streak is integrated over. One number for the whole game. */
  uShutter: { value: 1 / 60 },
  /** Metres over which a particle fades into the geometry behind it. */
  uSoftFade: { value: 0.4 },
  /** The render preset's size multiplier. */
  uParticleScale: { value: 1 },
  /** The accessibility switch. Zero collapses every weather system. */
  uPrecipitation: { value: 1 },
  uWindCarry: { value: WIND_CARRY },
};

/**
 * The shared vertex code: where a particle is, and how big it is on screen.
 *
 * Written in **world space**, which is why it replaces `project_vertex` as well
 * as `begin_vertex` — a camera-carried box is defined against `cameraPosition`,
 * and running that through the model matrix a second time would put the snow
 * wherever the mesh happened to be parented. The model matrix is read for what
 * it is worth (an emitter's origin, a field box's centre) and applied once.
 */
const PARTICLE_COMMON = /* glsl */ `
attribute vec3 iOrigin;
attribute vec3 iDir;
// size, speed, phase; w is life for ballistic and rise, turbulence for the rest
attribute vec4 iShape;
// fall/tumble: the box. ballistic: gravity. rise: rise, swirl, growth.
// w is the volume code in every case.
attribute vec4 iField;
// motion code, wind drag, wander phase, flags (1 weather, 2 solid)
attribute vec4 iVary;
// rgb, and the spec's own opacity in w
attribute vec4 iColour;
attribute float iSpin;

uniform sampler2D gustIntegral;
uniform vec2 windDir;
uniform float windLagScale;
uniform float windHalfSpan;
uniform float windAgeScale;
uniform float swayTime;
uniform float swayAmount;

uniform float uPixelsPerRadian;
uniform float uShutter;
uniform float uParticleScale;
uniform float uPrecipitation;
uniform float uWindCarry;

varying vec4 vParticle;
varying float vParticleDepth;

// The integral table is sampled NEAREST, so the interpolation is here — a
// linear-filtered float texture is an extension and this is not. Two texels
// and a mix, twice, is four taps for the whole of the wind.
float gustSum(float u) {
  float x = clamp(u, 0.0, 1.0) * ${(FIELD_SIZE - 1).toFixed(1)};
  float i = floor(x);
  float f = x - i;
  float a = texture2D(gustIntegral, vec2((i + 0.5) / ${FIELD_SIZE.toFixed(1)}, 0.5)).r;
  float b = texture2D(gustIntegral, vec2((i + 1.5) / ${FIELD_SIZE.toFixed(1)}, 0.5)).r;
  return mix(a, b, f);
}

/** Rodrigues, for the one thing that needs a general axis: a tumbling leaf. */
vec3 spinAbout(vec3 p, vec3 axis, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return p * c + cross(axis, p) * s + axis * dot(axis, p) * (1.0 - c);
}
`;

/**
 * The motion itself, replacing `begin_vertex`.
 *
 * Everything a particle is is worked out here and written into `transformed`
 * as a world position, plus a colour and an alpha into a varying. The fragment
 * side does the depth test and the soft fade and nothing else.
 */
const PARTICLE_VERTEX = /* glsl */ `
  // Declared here because this replaces <begin_vertex>, which is where three
  // would otherwise have declared it.
  vec3 transformed = vec3(position);

  float motion = iVary.x;
  float volume = iField.w;
  float flags = iVary.w;
  bool solid = flags >= 2.0;
  bool weather = mod(flags, 2.0) >= 0.5;

  float t = swayTime;
  vec3 box = iField.xyz;
  float alpha = 1.0;

  // The box a wrapped system lives in: carried by the camera, or standing
  // where the mesh stands. Lifted, because snow is mostly overhead.
  vec3 centre = volume > 1.5
    ? modelMatrix[3].xyz
    : cameraPosition + vec3(0.0, box.y * ${FOLLOW_LIFT.toFixed(2)}, 0.0);
  vec3 home = (modelMatrix * vec4(iOrigin, 1.0)).xyz;

  // --- age, which is what the wind is integrated over ----------------------
  float age;
  if (motion < 0.5 || motion > 2.5) {
    // Metres fallen since it entered the top of the box. The modulo is the
    // whole of the wrap: nothing is ever respawned, it simply re-enters.
    float fallen = mod(iOrigin.y + t * iShape.y, max(box.y, 0.01));
    age = fallen / max(iShape.y, 0.0001);
  } else {
    age = mod(t + iShape.z, max(iShape.w, 0.01));
  }

  // --- the wind, integrated over that age ----------------------------------
  // Sampled where the particle is *now* rather than along its path: over a
  // flake's few metres of drift, against a front crossing the world at nine
  // metres a second, that is a fraction of a texel. PARTICLES.md §4.
  vec2 at = volume > 0.5 ? centre.xz + iOrigin.xz : home.xz;
  float lag = dot(at, windDir) * windLagScale;
  float uNow = clamp(0.5 - lag / (2.0 * windHalfSpan), 0.0, 1.0);
  float uThen = clamp(uNow - age * windAgeScale, 0.0, 1.0);
  float carried = (gustSum(uNow) - gustSum(uThen)) * uWindCarry * iVary.y * swayAmount;
  vec3 drift = vec3(windDir.x, 0.0, windDir.y) * carried;

  // A small wander on top, so ash does not fall like snow and a plume is not a
  // fountain. Continuous in time, and its phase comes off the instance.
  float wander = motion < 0.5 || motion > 2.5 ? iShape.w : iField.y;
  float ph = iVary.z;
  drift += vec3(sin(t * 0.6 + ph), sin(t * 0.47 + ph * 1.7) * 0.4, cos(t * 0.53 + ph * 2.3))
    * wander;

  // --- the closed forms ------------------------------------------------------
  vec3 pos;
  vec3 vel;
  float grow = 1.0;

  if (motion < 0.5 || motion > 2.5) {
    // fall, and tumble, which is fall with a spin on it.
    float top = centre.y + box.y * 0.5;
    pos.y = top - mod(iOrigin.y + t * iShape.y, max(box.y, 0.01));
    // Wrapped *after* the drift, so a gust carries the field rather than
    // sliding it out of its own box.
    vec2 xz = iOrigin.xz + drift.xz;
    vec2 half2 = box.xz * 0.5;
    pos.xz = centre.xz + mod(xz + half2, max(box.xz, vec2(0.01))) - half2;
    pos.y += drift.y;
    vel = vec3(0.0, -iShape.y, 0.0);

    // The seam, faded out. A flake that wraps in mid-air while you are looking
    // up is the one visible tell a camera-carried box has.
    vec3 q = abs(pos - centre) / max(box * 0.5, vec3(0.01));
    alpha *= 1.0 - smoothstep(0.82, 1.0, max(max(q.x, q.y), q.z));
  } else if (motion < 1.5) {
    // ballistic: a spark leaving an anvil, spray off a weir.
    vec3 g = vec3(0.0, -iField.x, 0.0);
    pos = home + iDir * (iShape.y * age) + 0.5 * g * age * age + drift;
    vel = iDir * iShape.y + g * age;
    float life = max(iShape.w, 0.01);
    alpha *= smoothstep(0.0, 0.12 * life, age) * (1.0 - smoothstep(0.55 * life, life, age));
  } else {
    // rise: smoke and steam, accelerating away and growing as they go.
    float climb = iShape.y * age + 0.5 * iField.x * age * age;
    vec3 across = normalize(cross(iDir, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
    pos = home
      + vec3(0.0, climb, 0.0)
      + iDir * (iField.y * sin(age * 1.7 + ph))
      + across * (iField.y * 0.7 * sin(age * 1.1 + ph * 1.7))
      + drift;
    vel = vec3(0.0, iShape.y + iField.x * age, 0.0);
    float life = max(iShape.w, 0.01);
    grow = 1.0 + iField.z * (age / life);
    alpha *= smoothstep(0.0, 0.15 * life, age) * (1.0 - smoothstep(0.35 * life, life, age));
  }

  // The accessibility switch. A collapsed instance covers no pixels; the
  // vertex still runs, which is the cost of one shared material.
  if (weather && uPrecipitation < 0.5) alpha = 0.0;

  // Carried through the size *and* the clamp below, because the clamp's whole
  // job is to floor a small thing at one pixel — including, without this, a
  // thing that was switched off.
  float live = alpha > 0.0 ? 1.0 : 0.0;
  float size = iShape.x * uParticleScale * grow * live;

  // --- how big it is on screen ----------------------------------------------
  vec3 toCam = pos - cameraPosition;
  float dist = max(length(toCam), 0.01);

  if (solid) {
    vec3 local = position * size;
    if (iSpin != 0.0) local = spinAbout(local, iDir, iSpin * t);
    transformed = pos + local;
  } else {
    // **Nothing is drawn under one chunky pixel.** A 0.39-pixel primitive
    // rasterises to one pixel or to none depending where its centre lands,
    // which changes every frame — a snowfield past ten metres is otherwise
    // static in the television sense. Clamped to a pixel and dimmed by the
    // square of the clamping, so the energy is preserved. PARTICLES.md §3.
    float wanted = size / dist * uPixelsPerRadian;
    float drawn = max(wanted, 1.0);
    float ratio = wanted / drawn;
    alpha *= ratio * ratio;
    float halfW = 0.5 * dist * drawn / max(uPixelsPerRadian, 1.0) * live;

    // Rows of the view matrix, which are the camera's world axes. Written out
    // rather than as mat3(viewMatrix), which is a GLSL ES 3.00 constructor and
    // this shader is otherwise 1.00-compatible like the rest of the kit.
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    vec3 back = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
    vec3 velView = vec3(dot(right, vel), dot(up, vel), dot(back, vel));

    // **A streak is the travel you can see, not the travel there is.** The
    // length comes off the velocity's *on-screen* component, which is the only
    // part a shutter integrates into a smear — so it shortens as the motion
    // turns along the view and reaches zero looking straight up a fall, where
    // the drop becomes the dot it should be. Stretched by the world speed
    // instead, a drop falling at the camera keeps its full length while its
    // direction degenerates, and rain read as sticks lying on their sides.
    float speedOnScreen = length(velView.xy);
    vec2 along = vec2(0.0, 1.0);
    if (speedOnScreen > 0.0001) along = velView.xy / speedOnScreen;
    float halfL = max(halfW, 0.5 * speedOnScreen * uShutter * live);
    vec2 across2 = vec2(-along.y, along.x);
    vec2 offset = across2 * (position.x * 2.0 * halfW) + along * (position.y * 2.0 * halfL);
    transformed = pos + right * offset.x + up * offset.y;
  }

  vParticle = vec4(iColour.rgb, alpha * iColour.a);
`;

/**
 * The fragment side: the depth test, done by hand, and the fade that is the
 * same subtraction.
 *
 * The ping-pong targets carry a depth renderbuffer nothing fills, so hardware
 * depth testing cannot be used here — the test samples the scene's depth
 * texture and discards. Which brings the free part: **the depth difference the
 * test just computed is the one a soft particle needs.** One subtract and a
 * smoothstep removes the hard straight line a billboard draws where it
 * intersects the ground, which is the main visual tell of the technique.
 */
const PARTICLE_FRAGMENT = /* glsl */ `
uniform sampler2D tDepth;
uniform vec2 uResolution;
uniform float uNear;
uniform float uFar;
uniform float uSoftFade;

varying vec4 vParticle;
varying float vParticleDepth;

float sceneDistance(vec2 uv) {
  float d = texture2D(tDepth, uv).x;
  float ndc = d * 2.0 - 1.0;
  return (2.0 * uNear * uFar) / (uFar + uNear - ndc * (uFar - uNear));
}
`;

const PARTICLE_FRAGMENT_BODY = /* glsl */ `
  float sceneZ = sceneDistance(gl_FragCoord.xy / uResolution);
  if (sceneZ < vParticleDepth) discard;
  float soft = smoothstep(0.0, uSoftFade, sceneZ - vParticleDepth);
  diffuseColor.rgb *= vParticle.rgb;
  diffuseColor.a *= vParticle.a * soft;
  if (diffuseColor.a <= 0.0) discard;
`;

/** The one place the two materials are patched, so they cannot drift apart. */
function patchParticles(shader: {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, unknown>;
}): void {
  Object.assign(shader.uniforms, windUniforms, particleUniforms);

  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>\n${PARTICLE_COMMON}`)
    .replace('#include <begin_vertex>', PARTICLE_VERTEX)
    // Replaced rather than added to: `transformed` is already in world space,
    // so the model matrix must not be applied to it a second time.
    .replace(
      '#include <project_vertex>',
      /* glsl */ `
      vec4 mvPosition = viewMatrix * vec4(transformed, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      vParticleDepth = -mvPosition.z;
      `,
    );

  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>\n${PARTICLE_FRAGMENT}`)
    .replace('#include <color_fragment>', `#include <color_fragment>\n${PARTICLE_FRAGMENT_BODY}`);
}

/**
 * The lit material. Flat-shaded, exactly as the art kit is.
 *
 * **`depthTest` and `depthWrite` are both off, and neither is an oversight** —
 * the same setting `WATER_MATERIAL` carries, for the same reason and then one
 * more. The ping-pong targets an effect draws into have a depth renderbuffer
 * that nothing in this pipeline fills meaningfully, so there is nothing there
 * to test against; the shader does its own test against the scene's depth
 * texture instead, which is the only buffer that knows where the world is.
 *
 * It shipped with `depthTest: true` on the reasoning that the target's depth is
 * cleared to the far plane and so the test would always pass. That was wrong,
 * and invisibly so: **the blit that opens the pass is a full-screen quad, and a
 * `ShaderMaterial` writes depth by default** — so it stamped the near plane
 * across every pixel of the target a moment before the particles were drawn
 * against it, and every fragment of every system failed. The draw calls, the
 * instance counts and the shader were all perfectly correct, and the room was
 * empty.
 *
 * Off, nothing about occlusion is lost: the shader's own test runs in bloom's
 * emitters pass too — `tDepth` is still bound and that target is at the same
 * resolution — so a spark behind a wall still does not bloom through it.
 */
export const PARTICLE_MATERIAL = new THREE.MeshLambertMaterial({
  flatShading: true,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  side: THREE.DoubleSide,
});
PARTICLE_MATERIAL.onBeforeCompile = patchParticles;
PARTICLE_MATERIAL.customProgramCacheKey = () => 'particles-lit';

/**
 * The emissive one: unlit and additive, like every other glow in the game.
 *
 * Fog is off for `GLOW_MATERIAL`'s reason — mixing an additive surface toward a
 * pale sky adds that sky on top of everything behind it, so a distant spark
 * would sit in a rectangle of haze.
 */
export const PARTICLE_GLOW_MATERIAL = new THREE.MeshBasicMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  depthWrite: false,
  side: THREE.DoubleSide,
  fog: false,
});
PARTICLE_GLOW_MATERIAL.onBeforeCompile = patchParticles;
PARTICLE_GLOW_MATERIAL.customProgramCacheKey = () => 'particles-glow';

/** Every system currently standing, so the density scale can reach them. */
const live = new Set<THREE.Mesh>();
let drawOn = true;
let drawDensity = 1;

/**
 * The player's switch and the preset's density.
 *
 * Density is a *prefix* of the instance buffer, which is an even sample because
 * every instance's position was rolled independently — the same trick the
 * groundcover uses, with none of the shuffling, since there is no spatial order
 * to preserve here in the first place.
 */
export function setParticleDraw(on: boolean, density: number, scale: number): void {
  drawOn = on;
  drawDensity = Math.min(Math.max(density, 0), 1);
  particleUniforms.uParticleScale.value = scale;
  for (const mesh of live) refreshDraw(mesh);
}

/** The accessibility switch. See `ParticleSpec.weather`. */
export function setPrecipitation(on: boolean): void {
  particleUniforms.uPrecipitation.value = on ? 1 : 0;
}

function refreshDraw(mesh: THREE.Mesh): void {
  const geometry = mesh.geometry as THREE.InstancedBufferGeometry;
  const full = geometry.userData.count as number;
  geometry.instanceCount = Math.max(1, Math.round(full * drawDensity));
  mesh.visible = drawOn;
}

/**
 * What the sub-pixel clamp leaves of a particle's alpha, on the CPU.
 *
 * The mirror of the four lines in the vertex shader above, kept beside them so
 * the two cannot drift far apart. It exists because the clamp is the reason a
 * particle can be perfectly placed, perfectly lit, and *invisible*: alpha falls
 * with the square of the distance once a thing is under a pixel wide, and the
 * pipeline quantizes to sixteen levels — so anything under 1/16 is not dim, it
 * is not drawn.
 *
 * `check:world` uses it to assert that a showcase actually shows something. The
 * first version of that room did not, and nothing else in the suite noticed.
 */
export function drawnAlpha(size: number, distance: number, opacity: number): number {
  const wanted = (size / Math.max(distance, 0.01)) * particleUniforms.uPixelsPerRadian.value;
  const ratio = wanted / Math.max(wanted, 1);
  return ratio * ratio * opacity;
}

/** One over `RenderSettings.levels`: the dimmest thing the pipeline can draw. */
export const QUANTIZE_FLOOR = 1 / 16;

/**
 * Per frame: what one chunky pixel is worth, and where the camera clips.
 *
 * Four uniforms, called beside `updateCover` for the same reason it is — the
 * sub-pixel clamp is measured in art pixels, and the art pixel changes with the
 * window and with the pixel-size setting.
 */
export function updateParticles(camera: THREE.PerspectiveCamera, artHeight: number): void {
  // Chunky pixels per radian at the centre of the frame. `projectionMatrix[5]`
  // is `1 / tan(fov/2)`, so this is the same quantity the cover width clamp
  // works from, the other way up.
  particleUniforms.uPixelsPerRadian.value =
    (camera.projectionMatrix.elements[5] * Math.max(artHeight, 1)) / 2;
  particleUniforms.uNear.value = camera.near;
  particleUniforms.uFar.value = camera.far;
}

/**
 * One instanced mesh, one draw call, deterministic from the seed.
 *
 * The per-instance data is **baked rather than hashed off `gl_InstanceID`**,
 * even though hashing is free and would let every system of the same shape
 * share one geometry. Sharing is the trap: `Zone.dispose` walks the graph
 * freeing geometry, and a shared buffer freed by one zone is missing from the
 * next. Materials are already an exception there, and one exception is a rule
 * with a footnote while two is a rule nobody trusts.
 */
export function createParticles(spec: ParticleSpec, seed = 1): THREE.Mesh {
  const rng = createRng(seed);
  const count = Math.max(1, Math.round(spec.count));
  const solid = spec.shape !== 'billboard';
  const base = solid ? (spec.shape as THREE.BufferGeometry) : BILLBOARD;

  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = base.index;
  geometry.setAttribute('position', base.getAttribute('position'));
  if (base.getAttribute('normal')) geometry.setAttribute('normal', base.getAttribute('normal'));
  if (base.getAttribute('uv')) geometry.setAttribute('uv', base.getAttribute('uv'));
  geometry.instanceCount = count;
  geometry.userData.count = count;

  const origin = new Float32Array(count * 3);
  const dir = new Float32Array(count * 3);
  const shape = new Float32Array(count * 4);
  const field = new Float32Array(count * 4);
  const vary = new Float32Array(count * 4);
  const colour = new Float32Array(count * 4);
  const spin = new Float32Array(count);

  const motion = MOTION_CODE[spec.motion];
  const volume = VOLUME_CODE[spec.volume.kind];
  const box = spec.volume.kind === 'emitter' ? null : spec.volume.size;
  const spread = spec.volume.kind === 'emitter' ? spec.volume.spread : 0;
  const wrapped = box !== null;
  const flags = (spec.weather ? 1 : 0) + (solid ? 2 : 0);
  const life = spec.life ?? 1;
  const drag = spec.windDrag ?? 0.5;
  const tint = new THREE.Color();
  const first = new THREE.Color(Array.isArray(spec.colour) ? spec.colour[0] : spec.colour);
  const second = new THREE.Color(
    Array.isArray(spec.colour) ? (spec.colour[1] ?? spec.colour[0]) : spec.colour,
  );

  for (let i = 0; i < count; i++) {
    const speed = rng.range(spec.speed[0], spec.speed[1]);

    if (box) {
      // Box-local, and the height is measured *downward from the top* — it is
      // how far this one has already fallen, so the modulo in the shader is
      // the whole of the wrap and there is no spawn anywhere.
      origin[i * 3] = rng.range(-box.x / 2, box.x / 2);
      origin[i * 3 + 1] = rng.range(0, box.y);
      origin[i * 3 + 2] = rng.range(-box.z / 2, box.z / 2);
    } else {
      origin[i * 3] = rng.range(-spread, spread);
      origin[i * 3 + 1] = rng.range(-spread, spread) * 0.4;
      origin[i * 3 + 2] = rng.range(-spread, spread);
    }

    // A direction on the unit sphere, biased upward: it is a spark's launch,
    // a plume's swirl axis and a leaf's tumble axis, and every one of those
    // wants more up than down.
    const theta = rng.range(0, Math.PI * 2);
    const y = spec.motion === 'ballistic' ? rng.range(0.35, 1) : rng.range(-1, 1);
    const r = Math.sqrt(Math.max(1 - y * y, 0));
    dir[i * 3] = Math.cos(theta) * r;
    dir[i * 3 + 1] = y;
    dir[i * 3 + 2] = Math.sin(theta) * r;

    shape[i * 4] = rng.range(spec.size[0], spec.size[1]);
    shape[i * 4 + 1] = speed;
    // Evenly staggered rather than rolled. A hundred and twenty sparks sharing
    // one cycle at even offsets is a continuous shower; rolled phases clump,
    // and a clump reads as a pulse.
    shape[i * 4 + 2] = (i / count) * life;
    shape[i * 4 + 3] = wrapped ? (spec.turbulence ?? 0) : life;

    if (box) {
      field[i * 4] = box.x;
      field[i * 4 + 1] = box.y;
      field[i * 4 + 2] = box.z;
    } else if (spec.motion === 'rise') {
      field[i * 4] = spec.gravity ?? 0.4;
      field[i * 4 + 1] = spec.turbulence ?? 0;
      field[i * 4 + 2] = spec.growth ?? 1;
    } else {
      field[i * 4] = spec.gravity ?? 9.8;
      field[i * 4 + 1] = spec.turbulence ?? 0;
    }
    field[i * 4 + 3] = volume;

    vary[i * 4] = motion;
    // Jittered per instance, so a field does not answer the gust in one body.
    vary[i * 4 + 1] = drag * rng.range(0.82, 1.18);
    vary[i * 4 + 2] = rng.range(0, Math.PI * 2);
    vary[i * 4 + 3] = flags;

    tint.copy(first).lerp(second, rng());
    colour[i * 4] = tint.r;
    colour[i * 4 + 1] = tint.g;
    colour[i * 4 + 2] = tint.b;
    colour[i * 4 + 3] = spec.opacity;

    spin[i] = spec.spin ? rng.range(-spec.spin, spec.spin) : 0;
  }

  geometry.setAttribute('iOrigin', new THREE.InstancedBufferAttribute(origin, 3));
  geometry.setAttribute('iDir', new THREE.InstancedBufferAttribute(dir, 3));
  geometry.setAttribute('iShape', new THREE.InstancedBufferAttribute(shape, 4));
  geometry.setAttribute('iField', new THREE.InstancedBufferAttribute(field, 4));
  geometry.setAttribute('iVary', new THREE.InstancedBufferAttribute(vary, 4));
  geometry.setAttribute('iColour', new THREE.InstancedBufferAttribute(colour, 4));
  geometry.setAttribute('iSpin', new THREE.InstancedBufferAttribute(spin, 1));

  const material = spec.emissive ? PARTICLE_GLOW_MATERIAL : PARTICLE_MATERIAL;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'particles';
  // **Set, not enabled.** Layer 0 is cleared, which is what buys no outline, no
  // hole in anything else's outline, and no shadow. See `src/layers.ts`.
  mesh.layers.set(PARTICLE_LAYER);
  if (spec.emissive) mesh.layers.enable(GLOW_LAYER);
  // Three computes the bounding sphere from the base quad at the origin and
  // knows nothing about where the instances are, so it would drop the entire
  // system the moment that origin left the frustum — a snowfield that vanishes
  // when you look away from an arbitrary point in the world.
  mesh.frustumCulled = false;
  // A builder returns one object and the caller marks the whole thing solid;
  // without this the player walks into the smoke and stops. It is also what
  // `ZoneManager.prepare` reads to keep this out of the shadow pass.
  mesh.userData.noCollide = true;
  mesh.userData.particles = true;

  live.add(mesh);
  geometry.addEventListener('dispose', () => live.delete(mesh));
  refreshDraw(mesh);
  return mesh;
}
