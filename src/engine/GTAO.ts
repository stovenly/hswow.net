import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import type { PixelEffect, EffectContext } from './PixelStage';

/**
 * Ground-truth ambient occlusion, at chunky resolution. For a flat-shaded world AO
 * is the missing ingredient rather than a refinement: Lambert under a hemisphere
 * light produces no contact darkening, so props sit on the ground rather than in
 * it. GTAO over classic SSAO because at equal cost it is better — horizon marching
 * with an analytic cosine-weighted integral instead of a noisy kernel.
 *
 * Three sub-passes. A horizon march of 4 slices × 6 steps each way, rotated per
 * chunky pixel by interleaved gradient noise, which gives neighbouring pixels
 * complementary rotations so a small blur can average a full direction set. Then
 * two 3×3 depth-aware blurs, both one texel apart, so the pair is a triangle
 * rather than a flat box. Then a composite, faded by the same linear fog the
 * materials apply, so distant AO does not paint grime onto the haze.
 *
 * The sky never occludes and is never occluded: sky pixels return full visibility,
 * and a marched sample landing on sky attenuates to nothing, which is what keeps
 * swaying foliage from wearing a dark halo against it.
 */

export class GTAOEffect implements PixelEffect {
  readonly label = 'ao';
  enabled = true;
  /** 0..1 — how dark full occlusion is allowed to get. The one taste knob. */
  strength = 1;
  /** World-space radius in metres. */
  radius = 0.8;

  private readonly aoTarget: THREE.WebGLRenderTarget;
  private readonly blurTarget: THREE.WebGLRenderTarget;
  private readonly aoMaterial: THREE.ShaderMaterial;
  private readonly blurMaterial: THREE.ShaderMaterial;
  private readonly compositeMaterial: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;

  private fogNear = 25;
  private fogFar = 140;
  private fogRamp = 1.5;

  constructor() {
    // One byte per pixel: the visibility is a scalar, and nothing reads a depth here.
    const target = (): THREE.WebGLRenderTarget => {
      const t = new THREE.WebGLRenderTarget(1, 1, {
        format: THREE.RedFormat,
        type: THREE.UnsignedByteType,
        depthBuffer: false,
      });
      t.texture.minFilter = THREE.NearestFilter;
      t.texture.magFilter = THREE.NearestFilter;
      return t;
    };
    this.aoTarget = target();
    this.blurTarget = target();

    this.aoMaterial = createAoMaterial();
    this.blurMaterial = createBlurMaterial();
    this.compositeMaterial = createCompositeMaterial();
    this.quad = new FullScreenQuad(this.aoMaterial);
  }

  /** The fog the composite fades against. Pushed from `PostFX.apply`. */
  setFog(near: number, far: number, ramp: number): void {
    this.fogNear = near;
    this.fogFar = far;
    this.fogRamp = ramp;
  }

  setSize(width: number, height: number): void {
    this.aoTarget.setSize(width, height);
    this.blurTarget.setSize(width, height);
  }

  render(renderer: THREE.WebGLRenderer, context: EffectContext): void {
    const { camera } = context;

    // --- 1: the horizon march ----------------------------------------------
    const ao = this.aoMaterial.uniforms;
    ao.tDepth.value = context.depth;
    ao.tNormal.value = context.normal;
    ao.uProjInverse.value = camera.projectionMatrixInverse;
    // projectionMatrix[0][0] and [1][1]: view-space metres to NDC at unit
    // distance. Both, because they differ by the aspect ratio — see `radiusUv`.
    ao.uProjScale.value.set(
      camera.projectionMatrix.elements[0],
      camera.projectionMatrix.elements[5],
    );
    ao.uRadius.value = this.radius;
    ao.uResolution.value.set(
      context.size.x,
      context.size.y,
      1 / context.size.x,
      1 / context.size.y,
    );
    renderer.setRenderTarget(this.aoTarget);
    this.quad.material = this.aoMaterial;
    this.quad.render(renderer);

    // --- 2: the blur, twice -------------------------------------------------
    // Ping-ponged through the two AO targets, so the second pass costs no extra
    // memory. Both passes one texel apart, which makes the pair a triangle across
    // five texels; spacing the second wider makes it a flat box, which bands.
    const blur = this.blurMaterial.uniforms;
    blur.tDepth.value = context.depth;
    blur.uNear.value = camera.near;
    blur.uFar.value = camera.far;
    blur.uTexel.value.set(1 / context.size.x, 1 / context.size.y);
    this.quad.material = this.blurMaterial;

    blur.tAO.value = this.aoTarget.texture;
    renderer.setRenderTarget(this.blurTarget);
    this.quad.render(renderer);

    blur.tAO.value = this.blurTarget.texture;
    renderer.setRenderTarget(this.aoTarget);
    this.quad.render(renderer);

    // --- 3: the composite ---------------------------------------------------
    const composite = this.compositeMaterial.uniforms;
    composite.tDiffuse.value = context.colour;
    composite.tAO.value = this.aoTarget.texture;
    composite.tDepth.value = context.depth;
    composite.uProjInverse.value = camera.projectionMatrixInverse;
    composite.uFogNear.value = this.fogNear;
    composite.uFogFar.value = this.fogFar;
    composite.uFogRamp.value = this.fogRamp;
    composite.uStrength.value = this.strength;
    renderer.setRenderTarget(context.write);
    this.quad.material = this.compositeMaterial;
    this.quad.render(renderer);
  }

  dispose(): void {
    this.aoTarget.dispose();
    this.blurTarget.dispose();
    this.aoMaterial.dispose();
    this.blurMaterial.dispose();
    this.compositeMaterial.dispose();
    this.quad.dispose();
  }
}

const FULLSCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function createAoMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDepth: { value: null },
      tNormal: { value: null },
      uProjInverse: { value: new THREE.Matrix4() },
      uProjScale: { value: new THREE.Vector2(1, 1) },
      uRadius: { value: 0.8 },
      uResolution: { value: new THREE.Vector4(1, 1, 1, 1) },
    },
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDepth;
      uniform sampler2D tNormal;
      uniform mat4 uProjInverse;
      uniform vec2 uProjScale;
      uniform float uRadius;
      uniform vec4 uResolution;
      varying vec2 vUv;

      #define SLICES 4
      #define STEPS 6
      #define PI 3.14159265
      #define HALF_PI 1.5707963
      // How far off a surface's own plane a sample has to stand before it
      // counts as standing on it. A sine, so about 6 degrees.
      #define TANGENT_BIAS 0.1

      // Interleaved gradient noise (Jimenez), not a hash: neighbouring pixels land
      // on maximally different values, which is what lets the 3x3 blurs downstream
      // average a complete rotation set out of a small neighbourhood.
      float gradientNoise(vec2 p) {
        return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
      }

      vec3 viewPosition(vec2 uv, float depth) {
        vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
        vec4 p = uProjInverse * ndc;
        return p.xyz / p.w;
      }

      /**
       * How high one sample raises the horizon, as a cosine about V. -1 is a sample
       * that raises it not at all.
       *
       * Read the texel, not the point between texels: the depth fetch is nearest,
       * so reconstructing with the un-snapped uv builds a point on no surface at
       * all. And a sample on this surface's own plane is not an occluder — the
       * horizon is a maximum, so noise in a near-tangent reading can only push it
       * up, and a floor at a grazing angle collects a shimmering band without the
       * tangent-plane weight.
       */
      float horizon(vec2 uv, vec3 P, vec3 N, vec3 V) {
        vec2 texel = (floor(uv * uResolution.xy) + 0.5) * uResolution.zw;
        vec3 D = viewPosition(texel, texture2D(tDepth, texel).r) - P;
        float dist2 = dot(D, D);
        float reach = inversesqrt(max(dist2, 1e-6));
        // The quadratic falloff blends a distant sample toward the open
        // horizon, so the radius is a soft reach rather than a hard window —
        // and a sample on the sky attenuates to nothing, the no-halo rule.
        float weight = clamp(1.0 - dist2 / (uRadius * uRadius), 0.0, 1.0);
        weight *= smoothstep(0.0, TANGENT_BIAS, dot(D, N) * reach);
        return mix(-1.0, dot(D, V) * reach, weight);
      }

      void main() {
        float depth = texture2D(tDepth, vUv).r;
        // Sky: nothing to occlude, and returning early keeps the far plane
        // out of every later calculation.
        if (depth >= 0.9999) {
          gl_FragColor = vec4(1.0);
          return;
        }

        vec3 P = viewPosition(vUv, depth);
        vec3 N = normalize(texture2D(tNormal, vUv).rgb * 2.0 - 1.0);
        vec3 V = normalize(-P);

        // The world radius on screen, and it is two numbers: UV is not isotropic, so
        // one radius for both marches an ellipse in the world, reaching the aspect
        // ratio further sideways than up. Clamped on both axes together, so a wall
        // against the camera does not march most of the frame for information the
        // falloff will throw away.
        vec2 radiusUv = uRadius * uProjScale * 0.5 / max(-P.z, 0.05);
        radiusUv *= min(1.0, 0.35 / max(radiusUv.x, radiusUv.y));

        float noise = gradientNoise(floor(gl_FragCoord.xy));
        float baseAngle = noise * PI;
        // The golden-ratio scramble decorrelates the step offset from the
        // rotation, so the two patterns do not reinforce into visible bands.
        float stepJitter = fract(noise * 61.803);

        float visibility = 0.0;
        // What the slices below would integrate to with nothing occluding
        // them. Accumulated alongside, because it is the denominator — see
        // the normalisation note after the loop.
        float open = 0.0;

        for (int slice = 0; slice < SLICES; slice++) {
          float angle = baseAngle + float(slice) * (PI / float(SLICES));
          vec2 dir2 = vec2(cos(angle), sin(angle));

          // The slice plane contains V and the screen direction. T is the
          // in-plane tangent, pointing the way +dir2 moves on screen.
          vec3 planeN = normalize(cross(vec3(dir2, 0.0), V));
          vec3 T = cross(V, planeN);

          // The surface normal projected into the slice plane, and its
          // signed angle from V — the GTAO reference frame.
          vec3 projected = N - planeN * dot(N, planeN);
          float projLen = length(projected);
          if (projLen < 1e-4) continue;
          vec3 pn = projected / projLen;
          float cosN = clamp(dot(pn, V), -1.0, 1.0);
          float n = sign(dot(pn, T)) * acos(cosN);

          // March both ways, tracking the highest horizon each way.
          float maxCos1 = -1.0;
          float maxCos2 = -1.0;
          for (int s = 0; s < STEPS; s++) {
            // Squared, so the steps crowd toward the centre. Evenly spread, six taps
            // over 50 to 190 texels leave gaps of tens of texels, and an occluder
            // thinner than a gap is caught or missed on this pixel's jitter alone.
            // Squared, they sit at roughly 1, 6, 17, 34, 56 and 84 percent of reach.
            float t = (float(s) + stepJitter + 0.5) / float(STEPS);
            vec2 offset = dir2 * radiusUv * t * t;
            maxCos2 = max(maxCos2, horizon(vUv + offset, P, N, V));
            maxCos1 = max(maxCos1, horizon(vUv - offset, P, N, V));
          }

          // Horizon angles about V, clamped to the hemisphere around the
          // projected normal, then the analytic cosine-weighted arc.
          float h1 = n + max(-acos(clamp(maxCos1, -1.0, 1.0)) - n, -HALF_PI);
          float h2 = n + min(acos(clamp(maxCos2, -1.0, 1.0)) - n, HALF_PI);
          float arc1 = -cos(2.0 * h1 - n) + cosN + 2.0 * h1 * sin(n);
          float arc2 = -cos(2.0 * h2 - n) + cosN + 2.0 * h2 * sin(n);
          visibility += projLen * 0.25 * (arc1 + arc2);
          // The same integral with both horizons on the tangent plane, which
          // is what h1 and h2 collapse to when nothing occludes: substituting
          // n ± HALF_PI above reduces the whole expression to this.
          open += projLen * (cosN + n * sin(n));
        }

        // Normalised against the unoccluded response, not the slice count. An open
        // slice integrates to cos(n) + n sin(n), which is 1 only when the surface
        // faces the camera squarely, so dividing by SLICES discards visibility in
        // proportion to obliquity — 3% at 40 degrees, whose contours are circles
        // about the optical axis and which a 16-level quantizer turns into one hard
        // ring. Dividing by the accumulated open response is exact at any angle, and
        // drops the skipped slices out of the denominator.
        visibility = open > 1e-4 ? clamp(visibility / open, 0.0, 1.0) : 1.0;
        gl_FragColor = vec4(vec3(visibility), 1.0);
      }
    `,
  });
}

function createBlurMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tAO: { value: null },
      tDepth: { value: null },
      uNear: { value: 0.1 },
      uFar: { value: 500 },
      uTexel: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: /* glsl */ `
      uniform sampler2D tAO;
      uniform sampler2D tDepth;
      uniform float uNear;
      uniform float uFar;
      uniform vec2 uTexel;
      varying vec2 vUv;

      float viewDepth(vec2 uv) {
        float d = texture2D(tDepth, uv).r;
        // perspectiveDepthToViewZ, negated to metres in front of the camera.
        return -(uNear * uFar) / ((uFar - uNear) * d - uFar);
      }

      void main() {
        float centre = viewDepth(vUv);
        // The tolerance is a fraction of distance, not a fixed number of metres. An
        // absolute threshold fails exactly where it is needed most: a floor at a
        // grazing angle changes depth fast from pixel to pixel, so every neighbour
        // reads as across a silhouette and the raw noise stands untouched.
        float tolerance = max(centre * 0.03, 0.02);
        float total = 0.0;
        float weightSum = 0.0;
        for (int x = -1; x <= 1; x++) {
          for (int y = -1; y <= 1; y++) {
            vec2 uv = vUv + vec2(x, y) * uTexel;
            // Still depth-aware: a neighbour genuinely across a silhouette
            // contributes nothing, so the blur softens noise without bleeding
            // a wall's darkness onto the sky behind it.
            float weight = exp(-abs(viewDepth(uv) - centre) / tolerance);
            total += texture2D(tAO, uv).r * weight;
            weightSum += weight;
          }
        }
        gl_FragColor = vec4(vec3(total / max(weightSum, 1e-4)), 1.0);
      }
    `,
  });
}

function createCompositeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      tAO: { value: null },
      tDepth: { value: null },
      uProjInverse: { value: new THREE.Matrix4() },
      uFogNear: { value: 25 },
      uFogFar: { value: 140 },
      uFogRamp: { value: 1.5 },
      uStrength: { value: 1 },
    },
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform sampler2D tAO;
      uniform sampler2D tDepth;
      uniform mat4 uProjInverse;
      uniform float uFogNear;
      uniform float uFogFar;
      uniform float uFogRamp;
      uniform float uStrength;
      varying vec2 vUv;

      void main() {
        vec4 colour = texture2D(tDiffuse, vUv);
        float ao = texture2D(tAO, vUv).r;

        // The same fog the materials applied: radial from the eye, and on the
        // same ramp, or AO outlives the haze at the sides of the frame.
        float d = texture2D(tDepth, vUv).r;
        vec4 p = uProjInverse * vec4(vUv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
        float dist = length(p.xyz / p.w);
        float fogAmount = pow(smoothstep(uFogNear, uFogFar, dist), max(uFogRamp, 0.1));

        colour.rgb *= mix(1.0, ao, uStrength * (1.0 - fogAmount));
        gl_FragColor = colour;
      }
    `,
  });
}
