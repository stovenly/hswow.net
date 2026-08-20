import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { noiseTexture, VOLUME_NOISE_GLSL } from './noise';
import { windUniforms } from '../art/sway';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * Placed fog volumes, at chunky resolution. No global height fog: a zone-wide mist
 * layer is weather the whole place wears whether it suits or not, and what is
 * wanted is fog as set dressing — authored volumes placed where they mean
 * something. The distance fog is untouched and does a different job: one says how
 * far away something is, this says what is in the air between you and it.
 *
 * Per chunky pixel: reconstruct the world ray from depth and the inverse
 * view-projection; test each volume analytically, so a miss costs the test and
 * nothing else; on a hit, march the interior in 8 steps with density feathered
 * toward the shell; accumulate front-to-back with a running transmittance, and
 * early out. The ray start is offset by a per-pixel hash, or eight steps land on
 * eight visible shells through the middle of the mist.
 *
 * Two deliberate limits: the media are unlit, so a torch does not illuminate the
 * mist, and overlaps composite in array order rather than by depth.
 */

export type FogShape = 'ellipsoid' | 'box';

/**
 * One placed volume of fog. Authored data, not a scene object: no geometry, no
 * shadow, no collision, and pushed to the pass as uniforms when its zone is
 * entered — so it belongs with the zone's other positional facts.
 */
export interface FogVolume {
  shape: FogShape;
  /** Centre, in the zone's world space. */
  center: THREE.Vector3;
  /** Radii for an ellipsoid, half-extents for a box. Metres. */
  size: THREE.Vector3;
  /** Optical density at the core, per metre: how much of what is behind it one metre of the thickest part takes away. 0.1 is a haze, 1 is a wall of cloud. */
  density: number;
  /** What colour the media is. Unlit — see the note about torches above. */
  tint: string;
  /** How far in from the shell the density feathers up, 0..1 of the radius. Never zero: a volume with a hard edge shows its own geometry. */
  softness: number;
  /** Size of one billow, in metres. Larger is a smoother, vaguer volume. */
  noiseScale: number;
  /** How much the noise modulates density, 0..1. Zero is a smooth fill. */
  turbulence: number;
  /**
   * Drift, in metres per second. Omitted, the volume answers the wind — the same
   * `windDir` that bends the trees, so an outdoor bank and the grass under it are
   * weather together. A dungeon pool sets its own slow drift, because indoors has
   * no wind to answer.
   */
  drift?: THREE.Vector2;
}

/** How many volumes are live at once. Eight is enough for any room and keeps the uniform arrays well inside the guaranteed minimum. */
const MAX_VOLUMES = 8;

/** Steps through a volume's interior. See the header on why the start is offset. */
const STEPS = 8;

export class FogVolumesEffect implements PixelEffect {
  readonly label = 'fog';
  enabled = false;

  private volumes: readonly FogVolume[] = [];
  private readonly material: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  /** Scratch, so a per-frame uniform push allocates nothing. */
  private readonly tint = new THREE.Color();
  private readonly inverseProjectionView = new THREE.Matrix4();

  constructor() {
    this.material = createFogMaterial();
    this.quad = new FullScreenQuad(this.material);
  }

  /** Sets the volumes for the zone being entered. Applied immediately, because this is called at full black during a crossing. */
  setVolumes(volumes: readonly FogVolume[]): void {
    this.volumes = volumes.slice(0, MAX_VOLUMES);
    const u = this.material.uniforms;
    u.uCount.value = this.volumes.length;

    for (let i = 0; i < this.volumes.length; i++) {
      const volume = this.volumes[i];
      // Packed four floats at a time. Eight volumes of six fields each would
      // otherwise be a lot of separate uniform arrays, and a vec4 is what the
      // hardware hands out anyway.
      (u.uCentre.value[i] as THREE.Vector4).set(
        volume.center.x,
        volume.center.y,
        volume.center.z,
        volume.density,
      );
      (u.uSize.value[i] as THREE.Vector4).set(
        Math.max(volume.size.x, 1e-3),
        Math.max(volume.size.y, 1e-3),
        Math.max(volume.size.z, 1e-3),
        // Floored just above zero: the shader feathers with
        // smoothstep(1 - softness, 1, edge), and a softness of exactly 0 makes those
        // two edges equal, which smoothstep leaves undefined.
        THREE.MathUtils.clamp(volume.softness, 0.01, 1),
      );
      this.tint.set(volume.tint);
      (u.uTint.value[i] as THREE.Vector4).set(
        this.tint.r,
        this.tint.g,
        this.tint.b,
        Math.max(volume.noiseScale, 0.01),
      );
      // `xy` is filled per frame in `render`, since a volume with no authored drift
      // takes the wind and the wind changes. Shape rides along as a number, because
      // a branch on a uniform is cheaper than two shaders and the two intersection
      // tests share most of their arithmetic.
      (u.uDrift.value[i] as THREE.Vector4).set(
        0,
        0,
        THREE.MathUtils.clamp(volume.turbulence, 0, 1),
        volume.shape === 'box' ? 1 : 0,
      );
    }
  }

  /** True when there is anything to draw. `PostFX` layers its toggle over this. */
  get hasVolumes(): boolean {
    return this.volumes.length > 0;
  }

  setSize(): void {
    // Nothing of its own to resize: the march writes straight into the chain's
    // next link and reads the depth it is given.
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera } = context;
    const u = this.material.uniforms;

    u.tDiffuse.value = context.colour;
    u.tDepth.value = context.depth;
    u.uTime.value = context.time;

    // World ray per pixel, from clip space back out. Recomputed each frame
    // because the camera moves every frame; `camera.matrixWorld` is current by
    // the time a pass runs.
    this.inverseProjectionView
      .copy(camera.projectionMatrix)
      .multiply(camera.matrixWorldInverse)
      .invert();
    u.uInverseProjectionView.value.copy(this.inverseProjectionView);
    u.uCameraPosition.value.setFromMatrixPosition(camera.matrixWorld);
    u.uFar.value = camera.far;

    // The default drift is resolved here, not in the shader. The obvious encoding
    // is a NaN sentinel in the uniform, and GLSL ES makes no promise about NaN
    // behaviour — so `x != x` is a test that works on the machine it was written
    // on. Read per frame rather than captured at registration, because the weather
    // changes and a bank that kept its authored direction would part company with
    // the grass beneath it.
    const wind = windUniforms.windDir.value;
    for (let i = 0; i < this.volumes.length; i++) {
      const drift = this.volumes[i].drift;
      const packed = u.uDrift.value[i] as THREE.Vector4;
      packed.x = drift?.x ?? wind.x;
      packed.y = drift?.y ?? wind.y;
    }

    renderer.setRenderTarget(context.write);
    this.quad.render(renderer);
  }

  dispose(): void {
    this.material.dispose();
    this.quad.dispose();
  }
}

function vec4Array(length: number): THREE.Vector4[] {
  return Array.from({ length }, () => new THREE.Vector4());
}

function createFogMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tDepth: { value: null },
      uNoise: { value: noiseTexture() },
      uCount: { value: 0 },
      uCentre: { value: vec4Array(MAX_VOLUMES) },
      uSize: { value: vec4Array(MAX_VOLUMES) },
      uTint: { value: vec4Array(MAX_VOLUMES) },
      uDrift: { value: vec4Array(MAX_VOLUMES) },
      uInverseProjectionView: { value: new THREE.Matrix4() },
      uCameraPosition: { value: new THREE.Vector3() },
      uFar: { value: 500 },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform sampler2D tDepth;
      uniform int uCount;
      uniform vec4 uCentre[${MAX_VOLUMES}];
      uniform vec4 uSize[${MAX_VOLUMES}];
      uniform vec4 uTint[${MAX_VOLUMES}];
      uniform vec4 uDrift[${MAX_VOLUMES}];
      uniform mat4 uInverseProjectionView;
      uniform vec3 uCameraPosition;
      uniform float uFar;
      uniform float uTime;
      varying vec2 vUv;

      ${VOLUME_NOISE_GLSL}

      // Interleaved gradient noise, the same one GTAO rotates its slices by:
      // neighbouring pixels get maximally different offsets, so one pixel's eight
      // steps interleave with its neighbours' rather than lining up into shells.
      float gradientNoise(vec2 p) {
        return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
      }

      // Nudged off zero, keeping its sign. The slab test below divides by the ray
      // direction, and a ray parallel to one of a box's axes has a zero component;
      // relying on the infinities cancelling in the min/max is undefined in GLSL ES.
      float nonzero(float v) {
        return v >= 0.0 ? max(v, 1e-6) : min(v, -1e-6);
      }

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        if (uCount == 0) {
          gl_FragColor = colour;
          return;
        }

        // The world ray, and where the scene stops it, both by unprojecting clip
        // space rather than reconstructing a direction from the field of view. It is
        // correct by construction: tScene comes out as a distance along the ray
        // already, being the length of a difference of two world points.
        vec2 ndc = vUv * 2.0 - 1.0;
        vec3 origin = uCameraPosition;
        vec4 farPoint = uInverseProjectionView * vec4(ndc, 1.0, 1.0);
        vec3 direction = normalize(farPoint.xyz / farPoint.w - origin);

        float depth = texture2D(tDepth, vUv).r;
        float tScene;
        if (depth >= 0.9999) {
          // Sky: nothing stops the ray. The far plane rather than infinity, so
          // a bank standing against the horizon still has a back to it.
          tScene = uFar;
        } else {
          vec4 hit = uInverseProjectionView * vec4(ndc, depth * 2.0 - 1.0, 1.0);
          tScene = length(hit.xyz / hit.w - origin);
        }

        float jitter = gradientNoise(floor(gl_FragCoord.xy));

        vec3 scattered = vec3(0.0);
        float transmittance = 1.0;

        for (int i = 0; i < ${MAX_VOLUMES}; i++) {
          if (i >= uCount) break;
          if (transmittance < 0.01) break;

          vec3 centre = uCentre[i].xyz;
          float density = uCentre[i].w;
          vec3 size = uSize[i].xyz;
          float softness = uSize[i].w;
          vec3 tint = uTint[i].rgb;
          float noiseScale = uTint[i].w;
          float turbulence = uDrift[i].z;
          bool isBox = uDrift[i].w > 0.5;

          // Into the volume's own space, where an ellipsoid is a unit sphere
          // and a box is a unit cube. Scaling the direction by the same
          // extents leaves t in world metres, which is what the density and
          // the step length are authored in.
          vec3 p = (origin - centre) / size;
          vec3 d = direction / size;

          float t0;
          float t1;
          if (isBox) {
            // Slab test, over a direction guaranteed to have no zero component
            // — see nonzero above for why that is not paranoia.
            vec3 inv = 1.0 / vec3(nonzero(d.x), nonzero(d.y), nonzero(d.z));
            vec3 a = (-1.0 - p) * inv;
            vec3 b = (1.0 - p) * inv;
            vec3 lo = min(a, b);
            vec3 hi = max(a, b);
            t0 = max(max(lo.x, lo.y), lo.z);
            t1 = min(min(hi.x, hi.y), hi.z);
          } else {
            float A = dot(d, d);
            float B = 2.0 * dot(p, d);
            float C = dot(p, p) - 1.0;
            float disc = B * B - 4.0 * A * C;
            if (disc < 0.0) continue;
            float root = sqrt(disc);
            t0 = (-B - root) / (2.0 * A);
            t1 = (-B + root) / (2.0 * A);
          }

          // Clipped to the camera in front and the scene behind, which is what
          // puts a pillar *in* the mist and lets the player walk *into* the
          // bank rather than either being a backdrop.
          t0 = max(t0, 0.0);
          t1 = min(t1, tScene);
          if (t1 <= t0) continue;

          float span = t1 - t0;
          float dt = span / float(${STEPS});
          // Already resolved on the way in: a volume with no authored drift
          // arrives carrying the wind. See the render method above.
          vec2 drift = uDrift[i].xy;
          vec3 flow = vec3(drift.x, 0.0, drift.y) * uTime;

          for (int s = 0; s < ${STEPS}; s++) {
            vec3 world = origin + direction * (t0 + (float(s) + jitter) * dt);
            vec3 local = (world - centre) / size;

            // Distance to the shell, in the volume's own units: 1 at the
            // surface, 0 at the centre. A box measures it on its longest axis,
            // which is what feathers its corners rather than its faces.
            float edge = isBox
              ? max(max(abs(local.x), abs(local.y)), abs(local.z))
              : length(local);
            // Feathered inward from the shell so no volume ever shows its own
            // geometric edge.
            float fade = 1.0 - smoothstep(1.0 - softness, 1.0, edge);
            if (fade <= 0.0) continue;

            float shaped = mix(
              1.0,
              volumeFbm((world + flow) / noiseScale),
              turbulence
            );

            // Beer-Lambert over the step. Emission is the tint, weighted by
            // how much of the step is actually absorbing.
            float alpha = 1.0 - exp(-density * fade * shaped * dt);
            scattered += tint * alpha * transmittance;
            transmittance *= 1.0 - alpha;
            if (transmittance < 0.01) break;
          }
        }

        gl_FragColor = vec4(colour.rgb * transmittance + scattered, colour.a);
      }
    `,
  });
}
