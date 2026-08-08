import * as THREE from 'three';
import { NOISE_GLSL } from '../engine/noise';
import { SKY_GLSL, skyUniforms } from '../engine/Sky';
/**
 * The finish stage: specular, metal, cloth and film terms on the shared art
 * material. Parameters are per-vertex attributes baked from `Part.finish`.
 * Patches the lighting chunks, after the colour chain.
 */

/** metallic, roughness, sheen, iridescence. */
export const FINISH_ATTRIBUTE = 'aFinish';
/** grain axis x and z (biased to 0..1), anisotropy, translucency. */
export const GRAIN_ATTRIBUTE = 'aGrain';
/** glint, star. */
export const GLINT_ATTRIBUTE = 'aGlint';
/**
 * A random 0..1 per triangle, the same on all three of its vertices. Baked in
 * `assemble`, where the geometry is un-indexed. Gives the sweep a per-face
 * phase without reading it off derivatives, which are wrong on any pixel quad
 * straddling two triangles.
 */
export const FACE_ATTRIBUTE = 'aFace';

/** Glint cells per metre. */
const GLINT_DENSITY = 140;

export interface Finish {
  /** 0 dielectric, 1 metal: tints the highlight, dims the diffuse. */
  metallic: number;
  /** Highlight width and environment blur. Under 0.05 reads as no finish. */
  roughness: number;
  /** Velvet and worn cloth: an inverted-fresnel rim in the surface's colour. */
  sheen?: number;
  /** Thin film: the highlight walks the hue wheel toward grazing angles. */
  iridescence?: number;
  /** How far the highlight stretches along `Part.grain`, 0..1. */
  anisotropy?: number;
  /** Wax and marble: light wraps past the terminator and through. */
  translucency?: number;
  /** Micro-facets that flash one at a time. */
  glint?: number;
  /** An occasional star sparkle, 0..1 — drawn as its own quad by `art/sparkle`. */
  star?: number;
}

/** Named finishes. Names are placeholders. */
export const FINISHES = {
  gilt: { metallic: 1, roughness: 0.25, glint: 0, star: 0.9 },
  polished: { metallic: 0.9, roughness: 0.15 },
  chrome: { metallic: 1, roughness: 0.05 },
  marble: { metallic: 0.15, roughness: 0.2 },
  brushed: { metallic: 0.9, roughness: 0.4, anisotropy: 0.85 },
  silk: { metallic: 0, roughness: 0.4, anisotropy: 0.8, sheen: 0.35 },
  velvet: { metallic: 0, roughness: 0.9, sheen: 1 },
  shell: { metallic: 0.6, roughness: 0.3, iridescence: 0.8 },
  waxen: { metallic: 0, roughness: 0.5, translucency: 0.8 },
  frost: { metallic: 0.25, roughness: 0.5, glint: 1 },
} as const satisfies Record<string, Finish>;

export type FinishName = keyof typeof FINISHES;

/** A grain axis in object space. Defaults to up. */
export type Grain = readonly [number, number, number];

export interface FinishLanes {
  /** metallic, roughness, sheen, iridescence. */
  finish: [number, number, number, number];
  /** axis x, axis z (both biased), anisotropy, translucency. */
  grain: [number, number, number, number];
  /** glint, star. */
  glint: [number, number];
}

/** A `Part.finish` and `Part.grain` as the lanes the shader reads. */
export function resolveFinish(finish: FinishName | Finish, grain?: Grain): FinishLanes {
  const f: Finish = typeof finish === 'string' ? FINISHES[finish] : finish;
  const clamp = (v: number): number => (v > 0 ? (v < 1 ? v : 1) : 0);

  // Flipped to the upper hemisphere: the shader recovers Y from x and z, which
  // only works one way up. Sign carries no information on an axis.
  let [gx, gy, gz] = grain ?? [0, 1, 0];
  const length = Math.hypot(gx, gy, gz) || 1;
  gx /= length;
  gy /= length;
  gz /= length;
  if (gy < 0) {
    gx = -gx;
    gy = -gy;
    gz = -gz;
  }

  return {
    finish: [clamp(f.metallic), clamp(f.roughness), clamp(f.sheen ?? 0), clamp(f.iridescence ?? 0)],
    grain: [
      clamp(gx * 0.5 + 0.5),
      clamp(gz * 0.5 + 0.5),
      clamp(f.anisotropy ?? 0),
      clamp(f.translucency ?? 0),
    ],
    glint: [clamp(f.glint ?? 0), clamp(f.star ?? 0)],
  };
}

export const finishUniforms = {
  /** The dev toggle. Zero is bit-identical to Lambert. */
  uFinishOn: { value: 1 },
  /** Global scale on the direct highlight. */
  uFinishSpecular: { value: 1 },
  /** Global scale on the reflection term. */
  uFinishEnv: { value: 1 },
  /** 1 where the zone has a sky, 0 indoors. */
  uFinishSky: { value: 1 },
};

/**
 * Adds the finish stage to a material already carrying the sway, wear and
 * detail patches. Surface material only.
 *
 * Reads `finishWorn`, `vWearPos` and `vDetailView` from those earlier patches.
 */
export function applyFinish(material: THREE.Material): void {
  const prior = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prior?.call(material, shader, renderer);

    Object.assign(shader.uniforms, finishUniforms, skyUniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        attribute vec4 ${FINISH_ATTRIBUTE};
        attribute vec4 ${GRAIN_ATTRIBUTE};
        attribute vec2 ${GLINT_ATTRIBUTE};
        attribute float ${FACE_ATTRIBUTE};
        varying vec4 vFinish;
        /** The grain axis in view space. */
        varying vec3 vGrainAxis;
        /** anisotropy, translucency, glint, star. */
        varying vec4 vFinishExtra;
        /** This triangle's random draw, constant across the face. */
        varying float vFace;
        /** A phase per placed object, from where it stands. */
        varying float vObjectPhase;
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `#include <begin_vertex>
        vFinish = ${FINISH_ATTRIBUTE};
        {
          // Y recovered rather than stored: this is an axis, so it was flipped
          // to the upper hemisphere on the way in. See resolveFinish.
          vec2 flat2 = ${GRAIN_ATTRIBUTE}.xy * 2.0 - 1.0;
          float up = sqrt(max(1.0 - dot(flat2, flat2), 0.0));
          // Through the normal matrix, which sway never touches — so the grain
          // is welded to the cloth however the cloth moves.
          vGrainAxis = normalMatrix * vec3(flat2.x, up, flat2.y);
        }
        vFinishExtra = vec4(${GRAIN_ATTRIBUTE}.zw, ${GLINT_ATTRIBUTE});
        vFace = ${FACE_ATTRIBUTE};
        // Two copies of a prop share object space, so anything keyed to it
        // alone fires on every copy at once. Where it stands is what differs.
        vObjectPhase = fract(sin(dot(modelMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453);
        `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        varying vec4 vFinish;
        varying vec3 vGrainAxis;
        varying vec4 vFinishExtra;
        varying float vFace;
        varying float vObjectPhase;
        // The clock the wind and the water already run on. Sway declares this
        // in its vertex stage only, so the fragment side is ours to declare.
        uniform float swayTime;
        uniform float uFinishOn;
        uniform float uFinishSpecular;
        uniform float uFinishEnv;
        uniform float uFinishSky;
        `,
      )
      .replace(
        // The lighting hook. The lights loop folds the shadow factor into
        // directLight.color before calling RE_Direct, so every lobe below is
        // shadowed for free.
        '#include <lights_lambert_pars_fragment>',
        /* glsl */ `#include <lights_lambert_pars_fragment>
        ${NOISE_GLSL}
        ${SKY_GLSL}

        // Written in main once the colour chain has run; read by the lobes.
        // All zero everywhere a vertex declared no finish, which is nearly
        // everywhere, and the whole stage is gated on the first of them.
        float finishStrength = 0.0;
        float finishRough = 1.0;
        float finishSheen = 0.0;
        float finishTrans = 0.0;
        float finishGlint = 0.0;
        float finishAniso = 0.0;
        vec3 finishF0 = vec3(0.0);
        vec3 finishSheenColour = vec3(0.0);
        /** How strongly this surface colours what it reflects, 0..1. */
        float finishTintDepth = 0.0;
        vec3 finishTangent = vec3(1.0, 0.0, 0.0);
        vec3 finishBitangent = vec3(0.0, 1.0, 0.0);

        /**
         * The normal distribution, stretched along the grain when asked.
         *
         * Isotropic is the same GGX it always was — the anisotropic form
         * reduces to it exactly at anisotropy zero, so the branch is for the
         * arithmetic and not for the answer.
         *
         * **The lobe has a floor, and flat shading is why.** A facet on a
         * prop in this kit turns ten or twenty degrees from its neighbour, and
         * a lobe narrower than that falls between facets: the highlight is not
         * dim, it is *absent*, and then present for one frame when a facet
         * happens to swing through the mirror angle. A metal ball came back
         * looking like painted clay for exactly this reason. Smooth finishes
         * still read as smooth, because what makes them read is the
         * environment term below, which keeps its true roughness.
         */
        float finishD(vec3 N, vec3 H) {
          float lobe = max(finishRough, 0.16);
          float a = max(lobe * lobe, 0.002);
          if (finishAniso <= 0.0) {
            float d = pow2(dot(N, H)) * (a * a - 1.0) + 1.0;
            return (a * a) / (PI * d * d);
          }
          float at = max(a * (1.0 + finishAniso), 0.002);
          float ab = max(a * (1.0 - finishAniso), 0.002);
          float ht = dot(H, finishTangent) / at;
          float hb = dot(H, finishBitangent) / ab;
          float hn = dot(H, N);
          float w = ht * ht + hb * hb + hn * hn;
          return 1.0 / (PI * at * ab * w * w);
        }

        /**
         * Smith height-correlated visibility — how much of the micro-surface
         * shadows itself.
         *
         * **This is what stops cloth looking like cling film.** A constant
         * stood here at first, and a constant is exactly right head-on and
         * badly wrong at a grazing angle, where Fresnel is climbing to white
         * and nothing is left to hold it down: every hem and every edge in the
         * world came back with a hard pale line drawn along it. The honest
         * term costs two square roots and is *identical* to that constant at
         * normal incidence — at dotNL = dotNV = 1 it evaluates to 0.25 — so
         * nothing that was tuned head-on moved, and only the blow-out went.
         */
        float finishV(float dotNL, float dotNV) {
          float lobe = max(finishRough, 0.16);
          float a2 = pow2(lobe * lobe);
          float gv = dotNL * sqrt(dotNV * dotNV * (1.0 - a2) + a2);
          float gl = dotNV * sqrt(dotNL * dotNL * (1.0 - a2) + a2);
          return 0.5 / max(gv + gl, 1e-5);
        }

        vec3 finishHash3(vec3 p) {
          p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                   dot(p, vec3(269.5, 183.3, 246.1)),
                   dot(p, vec3(113.5, 271.9, 124.6)));
          return fract(sin(p) * 43758.5453);
        }

        /**
         * What a grain of ice does to the light it passes.
         *
         * Ice disperses far less than water, so its optics are pale rather than
         * spectral — a sun dog runs red nearest the sun through orange to a
         * white-blue tail, and iridescent cirrus is pastel pink and cyan. So
         * this is a light ramp, never a rainbow: rose to peach to cream to a
         * cold cyan, with a little violet at the far end. Every stop is high
         * value on purpose; the moment one of them darkens it stops reading as
         * ice and starts reading as painted glass.
         */
        vec3 finishIceTint(float h) {
          vec3 c = mix(vec3(1.00, 0.44, 0.66), vec3(1.00, 0.68, 0.42), smoothstep(0.0, 0.30, h));
          c = mix(c, vec3(1.00, 0.95, 0.84), smoothstep(0.28, 0.55, h));
          c = mix(c, vec3(0.42, 0.80, 1.00), smoothstep(0.55, 0.80, h));
          return mix(c, vec3(0.66, 0.52, 1.00), smoothstep(0.80, 1.0, h));
        }

        /**
         * One depth of the speck field.
         *
         * Depth is 0 at the surface and rises going into the material:
         * deeper grains are dimmer, softer edged and a little smaller, which is
         * what a crystal seen *through* frost looks like against one sitting on
         * top of it. Their grid is offset by a fraction of a cell rather than
         * by a whole one, so the layers land near each other and clump instead
         * of reading as three separate fields laid over one another.
         *
         * (No backticks in this shader source: it is a template literal.)
         */
        vec3 finishSpeckLayer(float dotNH, float gate, float depth, float density) {
          // A grain in the cell: small, hard-edged, and a different size in
          // every cell. Filling the cell gives squares, smoothing it gives
          // blobs, and one size everywhere gives a field of discs.
          vec3 p = vWearPos * density + vec3(0.37, 0.61, 0.19) * depth;
          vec3 cell = floor(p);
          vec3 seed = finishHash3(cell + depth * 11.3);
          vec3 alt = finishHash3(cell + depth * 11.3 + 19.7);
          float radius = (0.16 + 0.16 * alt.x) * (1.0 - depth * 0.14);
          // Kept off the cell walls so a grain is never clipped by one.
          float away = length(fract(p) - (seed * 0.5 + 0.25));
          // Softer the deeper it sits: light reaching it has been through frost.
          float speck = 1.0 - smoothstep(radius * (0.6 - depth * 0.2), radius, away);
          if (speck <= 0.0) return vec3(0.0);

          // **The animation layer.** Each grain breathes on its own phase and
          // rate, and a slow wave crosses the surface deciding which part of
          // the field is up at all — so the frost glides rather than sitting
          // still. A clock, not a history: nothing is accumulated per frame.
          float twinkle = 0.06 + 0.94 * (0.5 + 0.5 * sin(
            swayTime * (4.5 + alt.z * 6.0) + seed.x * 6.2831853));
          // **A wave that goes round the object rather than through it.** A
          // plane wave sweeps one way and the whole surface breathes with it;
          // measured as an *angle* about the object's axis it travels round
          // instead, and rising with height it climbs as it goes, so the field
          // turns rather than pulses. The noise term breaks the wavefront up so
          // it reads as weather over the surface and not as a rotating bar.
          // **Several crests on the object at once, or it breathes as one.**
          // At about a wavelength across the whole orb every grain peaks
          // together and the surface flashes; at a few wavelengths some regions
          // are coming up while others are going down, which is the thing that
          // reads as weather crossing it. The noise is weighted heavily for the
          // same reason — it is what keeps the crests from being a clean spiral.
          // The wide noise term kills long-range order: on a surface much
          // bigger than the orb the linear terms alone draw diagonal stripes.
          float swirl = atan(vWearPos.z, vWearPos.x) * 3.5 + vWearPos.y * 11.0
            + wearNoise(vWearPos * 1.3) * 14.0;
          float glide = 0.22 + 0.78 * (0.5 + 0.5 * sin(
            swirl + wearNoise(vWearPos * 4.5) * 7.5 - swayTime * 2.2));
          speck *= twinkle * glide;

          // **The gate is the sun's share, and it is not all of it.** A frosted
          // surface is rough in every direction at once, so its grains catch
          // whatever light is going and scatter it everywhere — they are not
          // only visible where they happen to line up with the sun. Gated, this
          // is the hard pop along the highlight; ungated, it is the field that
          // covers the whole object.
          float jitter = alt.y * 2.0 - 1.0;
          float lit = smoothstep(0.972, 1.0, dotNH + jitter * 0.08);
          // Skewed toward the rose end, which is where ice shows most of its
          // colour and where the pinks are.
          return finishIceTint(pow(seed.y, 1.35)) * (mix(1.0, lit, gate) * speck);
        }

        /** Three depths of grain, overlapping, at one scale. */
        vec3 finishSpeckStack(float dotNH, float gate, float density) {
          return finishSpeckLayer(dotNH, gate, 0.0, density)
            + finishSpeckLayer(dotNH, gate, 1.0, density) * 0.45
            + finishSpeckLayer(dotNH, gate, 2.0, density) * 0.22;
        }

        /**
         * The field, at a grain size that holds up wherever it is seen from.
         *
         * Fixed in world size, a grain falls under one chunky pixel a few
         * metres out: the field stops being sampleable, turns to boiling noise,
         * and then vanishes. So it coarsens with distance instead — in octaves,
         * crossfading between two, which is what trilinear filtering does
         * between mip levels and for the same reason. A grain stays about a
         * pixel and a half whatever the range, and the frost reads as frost
         * across the room instead of only up close.
         *
         * Capped at three octaves: past that the grains would be bigger than
         * the props carrying them.
         */
        vec3 finishSparkle(float dotNH, float gate) {
          float base = ${(1 / GLINT_DENSITY).toFixed(5)};
          float footprint = length(fwidth(vDetailView));
          float steps = clamp(log2(max(footprint * 1.5, base) / base), 0.0, 3.0);
          float coarse = floor(steps);
          float density = ${GLINT_DENSITY.toFixed(1)};
          return mix(
            finishSpeckStack(dotNH, gate, density / exp2(coarse)),
            finishSpeckStack(dotNH, gate, density / exp2(coarse + 1.0)),
            steps - coarse
          );
        }

        /**
         * Thin film, as a hue walk rather than a spectral integral.
         *
         * Quantization is per channel, so it keeps differences in hue and
         * collapses differences in brightness — and this is entirely hue.
         *
         * **The film varies in thickness across the surface.** View angle alone
         * is radially symmetric on a sphere, so it draws concentric rings of
         * repeating colour. A real film is not laid to an even depth, and that
         * unevenness is most of what an oil slick or a shell looks like.
         */
        vec3 finishFilm(float dotNV) {
          float thickness = 0.72 + 0.56 * wearNoise(vWearPos * 13.0);
          float phase = (1.0 - dotNV) * 2.4 * thickness;
          return max(vec3(0.0), 0.75 + cos(6.2831853 * (phase + vec3(0.0, 0.33, 0.67))));
        }

        void RE_Direct_Finish(
          const in IncidentLight directLight,
          const in vec3 geometryPosition,
          const in vec3 geometryNormal,
          const in vec3 geometryViewDir,
          const in vec3 geometryClearcoatNormal,
          const in LambertMaterial material,
          inout ReflectedLight reflectedLight
        ) {
          RE_Direct_Lambert(directLight, geometryPosition, geometryNormal, geometryViewDir,
            geometryClearcoatNormal, material, reflectedLight);
          if (finishStrength <= 0.0) return;

          vec3 halfDir = normalize(directLight.direction + geometryViewDir);
          float dotNL = saturate(dot(geometryNormal, directLight.direction));
          float dotNH = saturate(dot(geometryNormal, halfDir));
          float dotVH = saturate(dot(geometryViewDir, halfDir));
          float dotNV = saturate(dot(geometryNormal, geometryViewDir));
          vec3 F = F_Schlick(finishF0, 1.0, dotVH);

          // **Sheen replaces this lobe rather than standing on top of it.**
          // Cloth scatters in its fibres; it does not also carry a dielectric
          // mirror. Velvet asks for all of the sheen and therefore none of
          // this, which is the difference between fabric and a wrapped
          // surface — and silk keeps most of its lobe, stretched, which is
          // the difference between silk and velvet.
          float lobe = 1.0 - finishSheen;

          reflectedLight.directSpecular += directLight.color * F
            * (finishD(geometryNormal, halfDir) * finishV(dotNL, dotNV) * dotNL * lobe * uFinishSpecular);

          if (finishGlint > 0.0) {
            // Pushed most of the way to white and hard: a grain is a fraction
            // of a chunky pixel, so what makes it read is how bright it is,
            // not how big. Tinted by F alone it stays the colour of the
            // surface and disappears into it.
            // Less white and less hot than it was. Both were washing the grain
            // colour out: whitening dilutes it, and a grain driven hard enough
            // to clip has no hue left at all — every channel pinned at 1 is the
            // same colour whatever it started as.
            vec3 spark = mix(F, vec3(1.0), 0.35) * 2.1;
            reflectedLight.directSpecular +=
              directLight.color * spark * (finishSparkle(dotNH, 1.0) * finishGlint * dotNL * uFinishSpecular);
          }


          // Velvet: bright where the surface turns away from the eye. Tinted by
          // the cloth's own colour, because this is fibre scatter rather than a
          // reflection off anything.
          if (finishSheen > 0.0) {
            float rim = pow(1.0 - dotNV, 3.0);
            reflectedLight.directSpecular +=
              directLight.color * finishSheenColour * (finishSheen * rim * dotNL * uFinishSpecular);
          }

          if (finishTrans > 0.0) {
            // Wrap: the terminator softens instead of cutting at ninety
            // degrees. Added as the *difference* over Lambert, so the term is
            // purely additive and vanishes exactly at translucency zero.
            float wrapped = saturate(
              (dot(geometryNormal, directLight.direction) + finishTrans) / (1.0 + finishTrans)
            );
            reflectedLight.directDiffuse +=
              directLight.color * BRDF_Lambert(material.diffuseColor) * max(wrapped - dotNL, 0.0);
            // And what comes through from behind. Note the shadow factor is
            // already in directLight.color, so a thick closed solid shadows its
            // own back — this reads on thin geometry and edges, which is where
            // light actually gets through.
            float through = pow(saturate(dot(geometryViewDir, -directLight.direction)), 3.0);
            reflectedLight.directDiffuse +=
              directLight.color * material.diffuseColor * (through * finishTrans * 0.35);
          }
        }

        #undef RE_Direct
        #define RE_Direct RE_Direct_Finish
        `,
      )
      .replace(
        // After the colour chain has decided what the surface is: metals tint
        // their highlight with their own colour and give up their diffuse.
        // finishWorn is the weathering hand-off — where rust won, gilt is matte.
        '#include <lights_lambert_fragment>',
        /* glsl */ `#include <lights_lambert_fragment>
        finishStrength = uFinishOn * step(0.001, vFinish.y) * (1.0 - finishWorn);
        if (finishStrength > 0.0) {
          float finishMetal = vFinish.x * finishStrength;
          finishRough = clamp(vFinish.y, 0.05, 1.0);
          finishSheen = vFinish.z * finishStrength;
          finishSheenColour = material.diffuseColor;
          finishAniso = clamp(vFinishExtra.x, 0.0, 0.95) * finishStrength;
          finishTrans = vFinishExtra.y * finishStrength;
          finishGlint = vFinishExtra.z * finishStrength;

          // The tangent falls out of the axis and the *facet* normal, which is
          // what lets one axis per part serve a whole turned or folded surface.
          // Where the axis stands along the normal there is no grain direction
          // to speak of — the pole of a lathe — so it fades out rather than
          // snapping to whatever the cross product rounded to.
          vec3 across = cross(vGrainAxis, normal);
          float spread = length(across);
          finishAniso *= smoothstep(0.0, 0.2, spread);
          if (finishAniso > 0.0) {
            finishTangent = across / max(spread, 1e-4);
            finishBitangent = cross(normal, finishTangent);
          }

          float filmNV = saturate(dot(normal, normalize(vViewPosition)));
          vec3 tint = mix(vec3(1.0), finishFilm(filmNV), vFinish.w * finishStrength);
          finishF0 = mix(vec3(0.05), material.diffuseColor, finishMetal) * finishStrength * tint;
          finishTintDepth = max(max(finishF0.r, finishF0.g), finishF0.b)
            - min(min(finishF0.r, finishF0.g), finishF0.b);
          material.diffuseColor *= 1.0 - finishMetal;
        }
        `,
      )
      .replace(
        // The reflection: analytic sky outdoors, the hemisphere pair indoors —
        // a dim interior honestly reflects a two-colour gradient. Roughness
        // blurs the sky toward its own average.
        '#include <lights_fragment_end>',
        /* glsl */ `#include <lights_fragment_end>
        if (finishStrength > 0.0) {
          vec3 finishBounce = reflect(-geometryViewDir, geometryNormal);
          vec3 finishEnv = vec3(0.0);
          #if NUM_HEMI_LIGHTS > 0
            finishEnv = getHemisphereLightIrradiance(hemisphereLights[0], finishBounce);
          #endif
          if (uFinishSky > 0.5) {
            vec3 finishSky = skyColour(inverseTransformDirection(finishBounce, viewMatrix));
            finishEnv = mix(finishSky, mix(uHorizon, uZenith, 0.4),
              smoothstep(0.15, 0.85, finishRough));
          }
          // **A tinted metal cannot reflect only the sky and come back right.**
          // Gold has almost no blue in it and the sky has almost nothing else,
          // so a gilded ball outdoors renders olive-green — which is what a
          // gold mirror in an empty blue room would genuinely do, and nothing
          // like gilding, because real gilding stands in a landscape that
          // bounces its own light back at it. With one analytic sky and no
          // probes, pulling the environment toward its own brightness is the
          // stand-in for that bounce.
          //
          // Keyed to how much the surface *colours* what it reflects, not to
          // how metallic it is: chrome is a metal too, and chrome reflecting a
          // grey sky would be the same mistake in the other direction. Gold
          // neutralises most of the way, chrome almost not at all, and no
          // dielectric is touched.
          float envLuma = dot(finishEnv, vec3(0.2126, 0.7152, 0.0722));
          finishEnv = mix(finishEnv, vec3(envLuma), saturate(finishTintDepth) * 0.8);

          float finishNV = saturate(dot(geometryNormal, geometryViewDir));
          // **A rough surface does not turn into a mirror at its silhouette.**
          // Plain Schlick climbs to 1 at a grazing angle whatever the surface
          // is, so every rounded object wore a pale blue rim of reflected sky —
          // right for chrome, wrong for wax and frost, and worst on exactly the
          // matte things where the rim was the brightest part of them. The
          // grazing value is capped by the roughness instead, so a mirror keeps
          // its rim and a rough surface barely has one.
          vec3 f90 = max(vec3(1.0 - finishRough), finishF0);
          vec3 envF = finishF0 + (f90 - finishF0) * pow(1.0 - finishNV, 5.0);
          // Scaled by the same (1 − sheen) the direct lobe is: a velvet that
          // reflected the sky off its surface would be a velvet-coloured
          // mirror, which is the plastic look arriving by the other door.
          reflectedLight.indirectSpecular +=
            finishEnv * envF * ((1.0 - finishSheen) * uFinishEnv);

          // **Frost scatters what it is given, in every direction.** The gated
          // half of this lives in the direct lobe and is the hard pop along the
          // sun's highlight; this is the same grains catching the ambient, so
          // the whole object is frosted rather than only the lit side of it.
          if (finishGlint > 0.0) {
            // **Against the sky's brightness, not its colour.** Multiplied by
            // the sky itself, every grain came out blue whatever tint it drew —
            // which is why a field of rose and cyan and violet read as white
            // sand and blue. The ambient decides how *lit* a grain is; the ice
            // decides what colour it is.
            reflectedLight.indirectSpecular += mix(finishEnv, vec3(envLuma), 0.8)
              * finishSparkle(0.0, 0.0) * (finishGlint * 1.5 * uFinishEnv);
          }

          // Velvet's rim survives into shade, which is most of why velvet reads
          // as velvet in a room rather than only in a sunbeam.
          if (finishSheen > 0.0) {
            reflectedLight.indirectSpecular += finishEnv * finishSheenColour
              * (finishSheen * pow(1.0 - finishNV, 3.0) * 0.6 * uFinishEnv);
          }
        }
        `,
      )
      .replace(
        // Lambert's outgoing light has no specular terms; hand them back.
        // With no finish both are exactly vec3(0), so adding them is identity.
        'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
        'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;',
      );
  };

  // The lesson every patch here records: a missing attribute reads as whatever
  // the last draw left in the slot. Zero means matte.
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    ...(material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues,
    [FINISH_ATTRIBUTE]: [0, 0, 0, 0],
    [GRAIN_ATTRIBUTE]: [0, 0, 0, 0],
    [GLINT_ATTRIBUTE]: [0, 0],
    [FACE_ATTRIBUTE]: [0],
  };

  material.customProgramCacheKey = () => 'sway-wear-detail-finish';
  material.needsUpdate = true;
}
