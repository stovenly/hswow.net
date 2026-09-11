import * as THREE from 'three';
import { CANOPY_LAYER } from '../layers';
import { withStaticHidden } from '../engine/statics';
import { applyAerialFog } from '../engine/fog';
import { windUniforms, WIND_GLSL } from './sway';
import { coverUniforms } from './cover';
import { SHEET_COLUMNS, SHEET_ROWS, branchSheetUniforms } from './branchSheet';


// The canopy material: cluster cards turned to the eye about their roots,
// drawn as one soft mass on borrowed normals, dissolved at the rim by the tuft
// stipple, lit through from behind against a low sun. One material for every
// crown; its normal twin for the edge detector and its depth twin, in which
// the cards turn to the light and cast, and static fins cast nothing.

/**
 * Per vertex: solidity, thinness, rank (0 on a lobe), and a packed kind:
 * `deciduous + 2 · mode + flag`, mode 0 a fin or solid mass, 1 a card that
 * turns to the eye, 2 a static plane that shrinks edge-on, 3 a branch card
 * off the sheet turning about its own axis, 4 a branch card off the sheet
 * pinned where it was built.
 */
export const CANOPY_ATTRIBUTE = 'aCanopy';
export const CANOPY_MODE = { fixed: 0, card: 2, plane: 4, branch: 6, pinned: 8 } as const;
/** Per vertex: height weight, branch phase, flutter weight. */
export const WIND_ATTRIBUTE = 'aWind';
/** Per vertex: the card's or fin's root, or the lobe's centre. Object space. */
export const ROOT_ATTRIBUTE = 'aRoot';
/** Per vertex of a card: its offset from the root in the card's own plane, metres, and for a branch card its sheet tile. Zero on anything that is not a card. */
export const CARD_ATTRIBUTE = 'aCard';
/** Per vertex of a leaf: the species' shade colour, linear; `color` is the lit one. */
export const SHADE_ATTRIBUTE = 'aShade';
/** Per vertex of a leaf: the crown ellipsoid's centre and x radius in object space, the field every pixel is coloured from. Zero on anything that is not a leaf. */
export const CROWN_ATTRIBUTE = 'aCrown';
/** Per vertex of a leaf: the crown ellipsoid's y and z radii. */
export const AXES_ATTRIBUTE = 'aCrownAxes';

/** The fractional part of `aCanopy.w`: what a fin is, for the seasons. */
export const FIN_FLAG = { leaf: 0, evergreenBlossom: 0.25, blossom: 0.5, fruit: 0.75 } as const;

/** The season, as the crowns read it. Written once a frame by the weather rig. */
export const canopyUniforms = {
  /** bare, autumn, spring, winter darkening: each 0..1. */
  uSeasonA: { value: new THREE.Vector4(0, 0, 0, 0) },
  /** blossom on, fruit on, unused, unused. */
  uSeasonB: { value: new THREE.Vector4(0, 0, 0, 0) },
  /** How deep the snow is, 0..1. The same number the ground and the grass read; the cards share this object. */
  uSnow: { value: 0 },
};

/** From the climate's season phase: 0 midwinter, 0.25 spring, 0.5 midsummer, 0.75 autumn. */
export function setCanopySeason(phase: number): void {
  const p = ((phase % 1) + 1) % 1;
  const smooth = (a: number, b: number, x: number): number => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const bare = p > 0.5 ? smooth(0.82, 0.92, p) : 1 - smooth(0.16, 0.27, p);
  const autumn = smooth(0.68, 0.84, p) * (1 - smooth(0.86, 0.94, p));
  const spring = smooth(0.18, 0.28, p) * (1 - smooth(0.33, 0.45, p));
  const blossom = smooth(0.25, 0.3, p) * (1 - smooth(0.36, 0.41, p));
  const fruit = smooth(0.6, 0.66, p) * (1 - smooth(0.82, 0.88, p));
  (canopyUniforms.uSeasonA.value as THREE.Vector4).set(bare, autumn, spring, bare * 0.15);
  const b = canopyUniforms.uSeasonB.value as THREE.Vector4;
  b.x = blossom;
  b.y = fruit;
}

const VERTEX_DECLS = /* glsl */ `
  attribute vec4 ${CANOPY_ATTRIBUTE};
  attribute vec4 ${WIND_ATTRIBUTE};
  attribute vec3 ${ROOT_ATTRIBUTE};
  attribute vec3 ${CARD_ATTRIBUTE};
  attribute vec3 ${SHADE_ATTRIBUTE};
  attribute vec4 ${CROWN_ATTRIBUTE};
  attribute vec2 ${AXES_ATTRIBUTE};
  ${WIND_GLSL}
  uniform vec4 uSeasonA;
  uniform vec4 uSeasonB;
  varying vec4 vCanopy;
  varying vec3 vCanopyWorld;
  varying vec4 vCard;
  varying vec4 vField;
  varying vec3 vShade;
  varying vec3 vGrain;
  varying vec3 vSheet;
  uniform float uSheetAspect[${SHEET_ROWS}];

  // The crown's normal at an object-space point: the ellipsoid's, never pointing far down.
  vec3 crownNormal(vec3 at) {
    vec3 radii = vec3(${CROWN_ATTRIBUTE}.w, ${AXES_ATTRIBUTE});
    vec3 q = (at - ${CROWN_ATTRIBUTE}.xyz) / radii;
    vec3 n = normalize(q / radii);
    if (n.y < -0.15) {
      n.y = -0.15;
      n = normalize(n);
    }
    return n;
  }

  float canopyHash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  // A smooth triangle wave in -1..1 with period 1.
  float canopyTri(float x) {
    float f = abs(fract(x) * 2.0 - 1.0);
    return (f * f * (3.0 - 2.0 * f)) * 2.0 - 1.0;
  }
`;

/**
 * The vertex body every twin shares. `collapse` is the depth twin's: static
 * fins fall back to their root and cast nothing; cards face the light and cast.
 * `lit` is for the twins that carry a normal to the fragment.
 */
function vertexBody(collapse: boolean, lit: boolean): string {
  return /* glsl */ `
  vec3 transformed = vec3(position);
  {
    #ifdef USE_INSTANCING
      mat4 placed = modelMatrix * instanceMatrix;
    #else
      mat4 placed = modelMatrix;
    #endif
    float fringe = ${CANOPY_ATTRIBUTE}.z > 0.0 ? 1.0 : 0.0;
    float whole = floor(${CANOPY_ATTRIBUTE}.w + 0.001);
    float flag = ${CANOPY_ATTRIBUTE}.w - whole;
    float deciduous = mod(whole, 2.0);
    float mode = floor(whole / 2.0);
    float card = mode > 0.5 && mode < 1.5 ? 1.0 : 0.0;
    float plane = mode > 1.5 && mode < 2.5 ? 1.0 : 0.0;
    float branch = mode > 2.5 && mode < 3.5 ? 1.0 : 0.0;
    float pinned = mode > 3.5 ? 1.0 : 0.0;
    float sheetCard = max(branch, pinned);
    float sprite = max(card, sheetCard);
    vec3 worldRoot = (placed * vec4(${ROOT_ATTRIBUTE}, 1.0)).xyz;
    float away = distance(cameraPosition, worldRoot);
    float hash = canopyHash(floor(placed[3].xz * 4.0));
    vec3 c0 = placed[0].xyz;
    vec3 c1 = placed[1].xyz;
    vec3 c2 = placed[2].xyz;

    // Rank shrink-and-grow: a leaf whose rank exceeds the LOD shrinks to its
    // root over a band of ranks, never as a switch, and the survivors grow by
    // up to half. Nothing thins inside thirty metres, and a branch card never
    // thins at all: it is the crown itself, with only wood behind it.
    float thins = fringe * (1.0 - sheetCard);
    float lod = 0.1 + 0.9 * (1.0 - smoothstep(30.0, 90.0, away));
    float survive = thins > 0.5 ? 1.0 - smoothstep(lod, lod + 0.12, ${CANOPY_ATTRIBUTE}.z) : 1.0;
    float grow = 1.0 + 0.5 * (1.0 - lod) * thins;
    float scaleTo = survive * grow;
    // Winter: a deciduous lobe and a leaf shrink to nothing; a static fin dissolves below.
    // A leaf never dissolves: a stipple hole seen against the sky is a white pixel.
    float bare = uSeasonA.x * deciduous;
    scaleTo *= 1.0 - bare * max(1.0 - fringe, sprite);
    ${collapse ? 'if (fringe > 0.5 && sprite < 0.5 && plane < 0.5) scaleTo = 0.0;' : ''}
    // A card turns to the eye about its root by the least rotation taking its
    // resting normal to the eye direction, so its leaves keep their bearing in
    // the world and do not spin when the eye turns under it. Rodrigues with
    // k = n x t and c = n . t; the case c = -1 (seen from behind) is clamped.
    vec3 rest = position - ${ROOT_ATTRIBUTE};
    vec3 toEyeW = normalize(cameraPosition - worldRoot);
    // A static plane seen near edge-on is a sliver: it shrinks to its root instead.
    vec3 planeW = normalize(c0 * normal.x + c1 * normal.y + c2 * normal.z + vec3(1e-6, 0.0, 0.0));
    scaleTo *= mix(1.0, smoothstep(0.12, 0.42, abs(dot(planeW, toEyeW))), plane);
    vec3 toEye = normalize(vec3(dot(c0, toEyeW), dot(c1, toEyeW), dot(c2, toEyeW)));
    vec3 k = cross(normal, toEye);
    float c = max(dot(normal, toEye), -0.95);
    vec3 turned = rest * c + cross(k, rest) + k * (dot(k, rest) / (1.0 + c)) + toEye * ${CARD_ATTRIBUTE}.z;
    vec3 reach = mix(rest, turned, card);
    // A branch card holds its axis (the normal lane) and swings about it to face the eye.
    vec3 axis = normalize(normal);
    vec3 swing = cross(axis, toEye);
    if (dot(swing, swing) < 1e-6) swing = cross(axis, vec3(0.0, 0.0, 1.0));
    swing = normalize(swing);
    reach = mix(reach, axis * ${CARD_ATTRIBUTE}.y + swing * ${CARD_ATTRIBUTE}.x, branch);
    transformed = ${ROOT_ATTRIBUTE} + reach * scaleTo;

    // The same gust the trunk bends to, at the same lag, with the same weight
    // function and the same limbs: the crown and the wood must agree where a twig is.
    float weight = ${WIND_ATTRIBUTE}.x * swayAmount;
    float u = gustU(worldRoot);
    float strength = gustRow(u, 0.0);
    vec3 windObj = windIn(placed);
    float offset = hash * 6.2831;
    float tall = transformed.y;
    transformed += windTrunk(weight, tall, u, hash, windObj);
    float packed = ${WIND_ATTRIBUTE}.w;
    transformed += windLimbs(packed, u, windObj, swayAmount);

    // A lobe or a fin, with no limb of its own, rocks on its lobe's phase instead.
    float loose = packed < 0.5 ? 1.0 : 0.0;
    float rock = canopyTri(swayTime * 0.375 + ${WIND_ATTRIBUTE}.y) * 0.6 + canopyTri(swayTime * 0.193 + ${WIND_ATTRIBUTE}.y * 1.7 + hash) * 0.4;
    transformed += windObj * (rock * strength * swayAmount * 0.07 * ${WIND_ATTRIBUTE}.x * loose);
    // Flutter: fin tips tremble along the borrowed normal, so the crown's edge shimmers outward. Not a leaf: it would churn the order of overlapping leaves.
    float flut = canopyTri(swayTime * 1.975 + offset + ${WIND_ATTRIBUTE}.y * 3.1) * 0.6 + canopyTri(swayTime * 0.793 + hash * 2.0) * 0.4;
    transformed += normal * (flut * 0.035 * ${WIND_ATTRIBUTE}.z * (0.3 + 0.7 * strength) * swayAmount * (1.0 - sprite));

    vCanopy = ${CANOPY_ATTRIBUTE};
    float solidity = ${CANOPY_ATTRIBUTE}.x;
    solidity *= 1.0 - bare * fringe * (1.0 - sprite);
    // Blossom and fruit fins show only in their weeks; evergreen blossom always.
    if (flag > 0.4 && flag < 0.6) solidity *= uSeasonB.x;
    else if (flag > 0.65) solidity *= uSeasonB.y;
    vCanopy.x = solidity;
    // Every card dissolves on its own lattice, held still on the card as it turns.
    vCard = vec4(${CARD_ATTRIBUTE}.xy, max(sprite, plane), hash * 37.0 + sprite * canopyHash(floor(${ROOT_ATTRIBUTE}.xz * 16.0 + ${ROOT_ATTRIBUTE}.y)) * 23.0);
    // Where on the sheet a branch card's vertex reads: its tile, then its place in the card.
    float tile = ${CARD_ATTRIBUTE}.z;
    vec2 tileAt = vec2(mod(tile, ${SHEET_COLUMNS}.0), floor(tile / ${SHEET_COLUMNS}.0));
    float cardLength = max(${WIND_ATTRIBUTE}.z, 1e-3);
    float aspect = uSheetAspect[int(clamp(tileAt.y, 0.0, ${SHEET_ROWS}.0 - 1.0))];
    vec2 local = vec2(clamp(0.5 + ${CARD_ATTRIBUTE}.x / (cardLength * aspect), 0.0, 1.0), clamp(${CARD_ATTRIBUTE}.y / cardLength, 0.0, 1.0));
    vSheet = vec3((tileAt + local) / vec2(${SHEET_COLUMNS}.0, ${SHEET_ROWS}.0), sheetCard);
    // The field: where this vertex lies in the crown ellipsoid, and the ellipsoid's
    // normal there. Affine in position, so it interpolates exactly across a leaf and
    // two leaves at one pixel read the same value whichever is in front.
    float hasField = ${CROWN_ATTRIBUTE}.w > 0.0 ? 1.0 : 0.0;
    vec3 crownRadii = vec3(max(${CROWN_ATTRIBUTE}.w, 1e-3), max(${AXES_ATTRIBUTE}, vec2(1e-3)));
    vec3 fieldN = crownNormal(transformed);
    // w carries the flag and the normal's height together: 0 for no field, else height + 2.
    vField = vec4((transformed - ${CROWN_ATTRIBUTE}.xyz) / crownRadii, hasField > 0.5 ? fieldN.y + 2.0 : 0.0);
    ${
      lit
        ? `// A card or plane is lit by the crown's normal where its pixels land, not
    // where it rests, so two leaves overlapping are lit alike. A solid mass keeps its own.
    #ifndef FLAT_SHADED
    if (hasField > 0.5 && max(sprite, plane) > 0.5) {
      vec3 fieldNormal = fieldN;
      #ifdef USE_INSTANCING
        mat3 im = mat3(instanceMatrix);
        fieldNormal /= vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
        fieldNormal = im * fieldNormal;
      #endif
      vNormal = normalize(normalMatrix * fieldNormal);
    }
    #endif`
        : ''
    }
    vShade = ${SHADE_ATTRIBUTE};
    vGrain = transformed * 0.5 + vec3(hash * 40.0, hash * 17.0, hash * 29.0);
    vCanopyWorld = (placed * vec4(transformed, 1.0)).xyz;
  }
  `;
}

const STIPPLE_DECLS = /* glsl */ `
  varying vec4 vCanopy;
  varying vec3 vCanopyWorld;
  varying vec4 vCard;
  varying vec4 vField;
  varying vec3 vShade;
  varying vec3 vGrain;
  varying vec3 vSheet;
  uniform sampler2D tBranch;
  uniform vec3 uBark;
  // The cut-out's alpha, sharpened by its own screen-space slope so the edge
  // stays a pixel wide at every mip: a far mip's averaged alpha neither
  // swells a card into its square nor thins its leaves away, and handed to
  // the multisampling as coverage it draws an antialiased edge.
  float canopySheetAlpha(vec2 uv) {
    float a = texture2D(tBranch, uv).a;
    return clamp((a - 0.5) / max(fwidth(a), 1e-4) + 0.5, 0.0, 1.0);
  }
  float canopyStippleHash(vec2 p) {
    vec3 q = fract(vec3(p.x, p.y, p.x) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
`;

// The lattice lies on the card for a card and in the world for a fin, and
// doubles its cell whenever a pixel would span more than one, so the dissolve
// stays a pixel wide at any distance.
/** The lit twin discards only what is fully clear, and passes the rest as coverage; the others cut at half. */
const COVERAGE_CUT = '0.02';
const HARD_CUT = '0.5';

const stippleTest = (cut: string): string => /* glsl */ `
  // A branch card is cut out by its picture; the lit twin keeps the soft rim as coverage.
  if (vSheet.z > 0.5 && canopySheetAlpha(vSheet.xy) < ${cut}) discard;
  if (vCanopy.x < 1.0) {
    vec2 field = vCard.z > 0.5 && dot(abs(vCard.xy), vec2(1.0)) > 0.0 ? vCard.xy : vCanopyWorld.xz + vCanopyWorld.y * 0.7;
    float span = max(fwidth(field.x) + fwidth(field.y), 1e-4);
    float cells = 32.0 / exp2(floor(log2(max(span * 32.0, 1.0))));
    vec2 lattice = floor(field * cells + vCard.w);
    if (canopyStippleHash(lattice) > vCanopy.x) discard;
  }
`;

// A branch card's pixel: the field colour by the picture's tone, or bark where the picture is wood.
const SHEET_COLOUR = /* glsl */ `
  if (vSheet.z > 0.5) {
    diffuseColor.a = canopySheetAlpha(vSheet.xy);
    // Un-premultiplied: the empty texels round a leaf are black, and a far mip has averaged them in.
    vec4 sheet = texture2D(tBranch, vSheet.xy);
    float tone = sheet.r / max(sheet.a, 0.05);
    float wood = sheet.g / max(sheet.a, 0.05);
    vec3 bark = uBark;
    if (vCanopy.y > 0.5) {
      vec3 packed = vec3(floor(vCanopy.y / 16384.0), floor(mod(vCanopy.y, 16384.0) / 128.0), mod(vCanopy.y, 128.0)) / 127.0;
      bark = mix(pow((packed + 0.055) / 1.055, vec3(2.4)), packed / 12.92, step(packed, vec3(0.04045)));
    }
    diffuseColor.rgb = mix(diffuseColor.rgb * (0.5 + 0.65 * tone), bark * (0.45 + 0.65 * tone), clamp(wood, 0.0, 1.0));
  }
`;

// The crown's colour at a pixel, from where it lies in the crown ellipsoid: top
// light from the ellipsoid's normal, less of it and darker deeper in, and a slow
// grain. A leaf brings only the lit and shade pair, so two leaves at one pixel
// are the same colour whichever is in front.
const FIELD_COLOUR = /* glsl */ `
  float canopyGrainHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float canopyGrain(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(canopyGrainHash(i), canopyGrainHash(i + vec3(1, 0, 0)), f.x), mix(canopyGrainHash(i + vec3(0, 1, 0)), canopyGrainHash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(canopyGrainHash(i + vec3(0, 0, 1)), canopyGrainHash(i + vec3(1, 0, 1)), f.x), mix(canopyGrainHash(i + vec3(0, 1, 1)), canopyGrainHash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  vec3 canopyField(vec3 lit) {
    float d = length(vField.xyz);
    float deep = smoothstep(0.2, 1.0, d);
    // Gently: a strong sweep from dark below to light above reads as a gradient, not a tree.
    float light = 0.75 + 0.25 * deep;
    float ao = 0.8 + 0.2 * deep;
    float top = clamp(((vField.w - 2.0) * light - (1.0 - light) * 0.5) * 0.25 + 0.6, 0.0, 1.0);
    float grain = 1.0 + (canopyGrain(vGrain) - 0.5) * 0.14;
    return mix(vShade, lit, top) * ao * grain;
  }
`;

// Snow lies on what is exposed, and a card has no per-pixel up-face to test. The
// crown ellipsoid's normal where the pixel lands is the handle: full at the top
// of the envelope, a third of it underneath, because a laden tree is pale all
// over and one white only on top is a green tree in a hat.
const SNOW_COLOUR = /* glsl */ `
  uniform float uSnow;
  vec3 canopySnow(vec3 colour) {
    if (uSnow <= 0.0) return colour;
    float up = vField.w > 0.5 ? vField.w - 2.0 : 0.0;
    float lie = mix(0.34, 1.0, smoothstep(-0.15, 0.9, up));
    return mix(colour, vec3(0.86, 0.9, 0.96), clamp(uSnow, 0.0, 1.0) * 0.62 * lie);
  }
`;

const SEASON_COLOUR = /* glsl */ `
  uniform vec4 uSeasonA;
  vec3 canopySeason(vec3 colour, float w) {
    float whole = floor(w + 0.001);
    float flag = w - whole;
    float deciduous = mod(whole, 2.0);
    if (flag > 0.2) return colour;
    vec3 autumn = colour * vec3(1.55, 0.95, 0.42);
    vec3 spring = colour * vec3(1.02, 1.14, 0.78);
    colour = mix(colour, autumn, uSeasonA.y * deciduous);
    colour = mix(colour, spring, uSeasonA.z * deciduous);
    return colour * (1.0 - uSeasonA.w * (1.0 - deciduous));
  }
`;

function patchVertex(shader: { vertexShader: string; uniforms: Record<string, unknown> }, collapse: boolean, lit: boolean): void {
  Object.assign(shader.uniforms, windUniforms, canopyUniforms, branchSheetUniforms);
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>\n${VERTEX_DECLS}`)
    .replace('#include <begin_vertex>', vertexBody(collapse, lit));
}

export const CANOPY_MATERIAL = new THREE.MeshLambertMaterial({
  name: 'Canopy',
  vertexColors: true,
  side: THREE.DoubleSide,
  alphaToCoverage: true,
});

CANOPY_MATERIAL.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, coverUniforms);
  patchVertex(shader, false, true);
  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      /* glsl */ `#include <common>
      uniform vec3 coverSunDir;
      ${STIPPLE_DECLS}
      ${FIELD_COLOUR}
      ${SEASON_COLOUR}
      ${SNOW_COLOUR}
      `,
    )
    .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n${stippleTest(COVERAGE_CUT)}`)
    .replace(
      '#include <normal_fragment_begin>',
      // The borrowed normal, never flipped for the back face, bent a little toward
      // the sun so the terminator wraps round the mass instead of cutting it.
      /* glsl */ `#include <normal_fragment_begin>
      normal = normalize(vNormal);
      normal = normalize(normal + coverSunDir * 0.22);
      `,
    )
    .replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
      if (vField.w > 0.5) diffuseColor.rgb = canopyField(diffuseColor.rgb);
      ${SHEET_COLOUR}
      diffuseColor.rgb = canopySeason(diffuseColor.rgb, vCanopy.w);
      diffuseColor.rgb = canopySnow(diffuseColor.rgb);
      `,
    )
    ;
};
applyAerialFog(CANOPY_MATERIAL);
CANOPY_MATERIAL.customProgramCacheKey = () => 'canopy';

/**
 * The normal buffer's twin: the same build and the same discard, so the two
 * buffers agree per pixel. It writes alpha 0, which is the mark the screen-space
 * passes read as "leaf here, leave it alone": a crown gets no ambient occlusion,
 * because hundreds of leaves at hundreds of depths would speckle it black.
 */
export const CANOPY_NORMAL_MATERIAL = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, blending: THREE.NoBlending });
CANOPY_NORMAL_MATERIAL.onBeforeCompile = (shader) => {
  patchVertex(shader, false, true);
  // The normal material's fragment stage has no <common>; its first include is <packing>.
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <packing>', `#include <packing>\n${STIPPLE_DECLS}`)
    .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n${stippleTest(HARD_CUT)}`)
    .replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>\n      normal = normalize(vNormal);\n`)
    .replace('gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );', 'gl_FragColor = vec4( packNormalToRGB( normal ), 0.0 );')
    .replace('gl_FragColor.a = 1.0;', 'gl_FragColor.a = 0.0;');
};
CANOPY_NORMAL_MATERIAL.customProgramCacheKey = () => 'canopy-normal';

/** The sun's twin: lobes cast, the fringe collapses to its roots and casts nothing. */
export const CANOPY_DEPTH_MATERIAL = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
CANOPY_DEPTH_MATERIAL.onBeforeCompile = (shader) => {
  patchVertex(shader, true, false);
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>\n${STIPPLE_DECLS}`)
    .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n  if (vSheet.z > 0.5 && canopySheetAlpha(vSheet.xy) < ${HARD_CUT}) discard;\n`);
};
CANOPY_DEPTH_MATERIAL.customProgramCacheKey = () => 'canopy-depth';

/** Unlit vertex colour with the same build and discard, for the card atlas's albedo tile. */
export const CANOPY_FLAT_MATERIAL = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
CANOPY_FLAT_MATERIAL.onBeforeCompile = (shader) => {
  patchVertex(shader, false, false);
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>\n${STIPPLE_DECLS}\n${FIELD_COLOUR}\n${SEASON_COLOUR}`)
    .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n${stippleTest(HARD_CUT)}`)
    .replace('#include <color_fragment>', `#include <color_fragment>\n      if (vField.w > 0.5) diffuseColor.rgb = canopyField(diffuseColor.rgb);\n      ${SHEET_COLOUR}\n      diffuseColor.rgb = canopySeason(diffuseColor.rgb, vCanopy.w);\n`);
};
CANOPY_FLAT_MATERIAL.customProgramCacheKey = () => 'canopy-flat';

for (const material of [CANOPY_MATERIAL, CANOPY_NORMAL_MATERIAL, CANOPY_DEPTH_MATERIAL, CANOPY_FLAT_MATERIAL]) {
  (material as { defaultAttributeValues?: Record<string, number[]> }).defaultAttributeValues = {
    [CANOPY_ATTRIBUTE]: [1, 0, 0, 0],
    [WIND_ATTRIBUTE]: [0, 0, 0],
    [ROOT_ATTRIBUTE]: [0, 0, 0],
    [CARD_ATTRIBUTE]: [0, 0, 0],
    [SHADE_ATTRIBUTE]: [0, 0, 0],
    [CROWN_ATTRIBUTE]: [0, 0, 0, 0],
    [AXES_ATTRIBUTE]: [0, 0],
  };
}

/** A crown as a mesh: on the canopy layer for the normal pass, never collidable, casting through its depth twin. */
export function canopyMesh(geometry: THREE.BufferGeometry, count?: number): THREE.Mesh {
  const mesh = count !== undefined ? new THREE.InstancedMesh(geometry, CANOPY_MATERIAL, count) : new THREE.Mesh(geometry, CANOPY_MATERIAL);
  mesh.name = 'canopy';
  mesh.layers.enable(CANOPY_LAYER);
  mesh.userData.canopy = true;
  mesh.userData.noCollide = true;
  mesh.customDepthMaterial = CANOPY_DEPTH_MATERIAL;
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  return mesh;
}

/**
 * Draws every crown into the normal buffer after the scene-wide override pass,
 * which cannot know the stipple. Called by `PixelStage` with the normal target
 * still bound; the canopy material is hidden during the override pass.
 */
export function drawCanopyNormals(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): void {
  const mask = camera.layers.mask;
  const autoClear = renderer.autoClear;
  const priorOverride = scene.overrideMaterial;
  camera.layers.set(CANOPY_LAYER);
  renderer.autoClear = false;
  scene.overrideMaterial = CANOPY_NORMAL_MATERIAL;
  withStaticHidden(() => renderer.render(scene, camera));
  scene.overrideMaterial = priorOverride;
  renderer.autoClear = autoClear;
  camera.layers.mask = mask;
}
