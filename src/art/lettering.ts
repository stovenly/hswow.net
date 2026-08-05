import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assemble, finish } from './assemble';
import { FLAME_DECAY } from './flame';
import { finishGlow, TEXT_GLOW_ADDITIVE, TEXT_GLOW_MATERIAL } from './glow';
import { PALETTE } from './palette';

/**
 * Lettering built from geometry, so the world can carry text.
 *
 * For a long time this project said "there are no fonts here", and the reason
 * was real: the render pipeline chunks to two-CSS-pixel blocks, quantizes and
 * dithers, and anything *written on a surface* — texture-scale writing — comes
 * out as noise. But that argument is about feature size, not about text. A
 * letter whose stroke covers two or three chunky pixels on screen survives the
 * pipeline the way a fence post does, and the edge-outline pass draws it the
 * way it draws everything else. Signs, banners and tutorial text are built at
 * that scale; fine print stays where it always was, in the tooltip layer.
 *
 * So: a single-stroke vector font, authored here as polylines on a small grid
 * and rendered as merged boxes. It follows every rule the kit lives by — no
 * textures, no downloaded assets, everything generated at boot, one geometry
 * with vertex colours. A "font file" would be the largest asset in a game that
 * has none; this is a page of coordinates.
 *
 * ## What a style is
 *
 * Weight, slant, depth and size are transforms of one glyph set, which is how
 * a page of coordinates gets to act like a type family. A second *face* — a
 * genuinely different alphabet — is a second table, whenever one is wanted.
 *
 * ## How big is readable
 *
 * A stroke needs about two chunky pixels on screen. At the default look
 * (pixelSize 2, FOV 70°, a ~700 px viewport) that works out near
 * `stroke ≥ distance / 100`, and at the default weight the usable rule of
 * thumb is **cap height ≈ reading distance / 16** — see `readableCapHeight`.
 * Text meant to be read from three metres wants ~20 cm capitals; across a
 * clearing, half a metre. Smaller than that is *deliberately* below the
 * pipeline's floor and reads as marks, which is sometimes the point.
 *
 * Caps only. Lowercase is folded up rather than drawn, because a good
 * lowercase needs curves this grid cannot give it, and a bad one is worse
 * than none. Anything the font cannot say draws as an empty frame rather
 * than vanishing — a missing glyph should be seen and reported.
 */

export interface LetteringStyle {
  /** Height of a capital, in metres. The size knob. Default 0.15. */
  capHeight?: number;
  /** Stroke width as a fraction of cap height. 0.08 hairline, 0.16 regular, 0.3 black. */
  weight?: number;
  /** Horizontal shear, as run over rise. 0 upright; ~0.2 reads as italic. */
  slant?: number;
  /**
   * Relief depth as a fraction of the stroke width.
   *
   * Shallow (~0.2) reads as paint on the surface behind it; around 1 as
   * raised slab lettering; deeper for letters that stand free in the air with
   * no board at all. Never zero — flat geometry has no back faces, and the
   * kit's watertight rule applies to letters too.
   */
  depth?: number;
  /** Baseline-to-baseline spacing, in cap heights. Default 1.5. */
  lineHeight?: number;
  /** Per-line alignment within the block. Default 'center'. */
  align?: 'left' | 'center';
  /**
   * Fit-to-width, in metres: if the widest line would run past this, the cap
   * height shrinks until it does not. What a sign uses to take arbitrary text
   * without overrunning its board.
   */
  fitWidth?: number;
}

export interface Lettering {
  /** Facing +Z, centred on the origin in X and Y, depth centred on z = 0. */
  geometry: THREE.BufferGeometry;
  /** Metres, of the widest line. */
  width: number;
  /** Metres, cap of the first line to baseline of the last. */
  height: number;
  /** The cap height actually used, after `fitWidth` has had its say. */
  capHeight: number;
}

/**
 * Cap height ≈ distance / 16: the smallest capital comfortably readable from
 * `distance` metres at the default weight, through the default render look.
 * Derived, not tuned: two chunky pixels of stroke at 70° FOV on a ~700 px
 * viewport. A conservative figure — bigger viewports read further.
 */
export function readableCapHeight(distance: number): number {
  return distance / 16;
}

/** Glyph grid: x 0..w, baseline y = 0, capitals reach y = 6. */
const CAP = 6;
/** Grid units between glyphs. */
const TRACK = 1.3;
/** Advance of a word space. */
const SPACE = 2.6;

interface Glyph {
  readonly w: number;
  /** Polylines as flat x,y pairs. A single pair is a dot. */
  readonly strokes: readonly (readonly number[])[];
}

/**
 * The glyph set. Hand-authored, and angular on purpose — every curve is an
 * octagonal cut, which is what a chisel or a sign-writer's flat brush would
 * do, and what the flat-shaded kit already looks like.
 */
const GLYPHS: Record<string, Glyph> = {
  A: { w: 4, strokes: [[0, 0, 2, 6, 4, 0], [0.7, 2, 3.3, 2]] },
  B: {
    w: 4,
    strokes: [
      [0, 0, 0, 6],
      [0, 6, 2.8, 6, 4, 5, 4, 3.8, 2.8, 3, 0, 3],
      [2.8, 3, 4, 2.2, 4, 1, 2.8, 0, 0, 0],
    ],
  },
  C: { w: 4, strokes: [[4, 5, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0, 3, 0, 4, 1]] },
  D: { w: 4, strokes: [[0, 0, 0, 6, 2.4, 6, 4, 4.4, 4, 1.6, 2.4, 0, 0, 0]] },
  E: { w: 4, strokes: [[4, 6, 0, 6, 0, 0, 4, 0], [0, 3, 2.8, 3]] },
  F: { w: 4, strokes: [[4, 6, 0, 6, 0, 0], [0, 3, 2.8, 3]] },
  G: { w: 4, strokes: [[4, 5, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.6, 2.2, 2.6]] },
  H: { w: 4, strokes: [[0, 0, 0, 6], [4, 0, 4, 6], [0, 3, 4, 3]] },
  I: { w: 2, strokes: [[0, 6, 2, 6], [1, 6, 1, 0], [0, 0, 2, 0]] },
  J: { w: 4, strokes: [[4, 6, 4, 1, 3, 0, 1, 0, 0, 1]] },
  K: { w: 4, strokes: [[0, 0, 0, 6], [4, 6, 0, 2.6], [1.5, 3.6, 4, 0]] },
  L: { w: 4, strokes: [[0, 6, 0, 0, 4, 0]] },
  M: { w: 4, strokes: [[0, 0, 0, 6, 2, 2.6, 4, 6, 4, 0]] },
  N: { w: 4, strokes: [[0, 0, 0, 6, 4, 0, 4, 6]] },
  O: { w: 4, strokes: [[1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5, 4, 1, 3, 0, 1, 0]] },
  P: { w: 4, strokes: [[0, 0, 0, 6, 2.8, 6, 4, 5, 4, 3.6, 2.8, 2.8, 0, 2.8]] },
  Q: {
    w: 4,
    strokes: [
      [1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5, 4, 1, 3, 0, 1, 0],
      [2.4, 1.6, 4.4, -0.4],
    ],
  },
  R: { w: 4, strokes: [[0, 0, 0, 6, 2.8, 6, 4, 5, 4, 3.6, 2.8, 2.8, 0, 2.8], [2, 2.8, 4, 0]] },
  S: {
    w: 4,
    strokes: [[4, 5, 3, 6, 1, 6, 0, 5, 0, 4.2, 1, 3.4, 3, 3, 4, 2.2, 4, 1, 3, 0, 1, 0, 0, 1]],
  },
  T: { w: 4, strokes: [[0, 6, 4, 6], [2, 6, 2, 0]] },
  U: { w: 4, strokes: [[0, 6, 0, 1, 1, 0, 3, 0, 4, 1, 4, 6]] },
  V: { w: 4, strokes: [[0, 6, 2, 0, 4, 6]] },
  W: { w: 4, strokes: [[0, 6, 1, 0, 2, 3.4, 3, 0, 4, 6]] },
  X: { w: 4, strokes: [[0, 0, 4, 6], [0, 6, 4, 0]] },
  Y: { w: 4, strokes: [[0, 6, 2, 3.2, 4, 6], [2, 3.2, 2, 0]] },
  Z: { w: 4, strokes: [[0, 6, 4, 6, 0, 0, 4, 0]] },

  '0': {
    w: 4,
    strokes: [
      [1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5, 4, 1, 3, 0, 1, 0],
      [1, 1.2, 3, 4.8],
    ],
  },
  '1': { w: 4, strokes: [[0.8, 4.8, 2, 6, 2, 0], [0.8, 0, 3.2, 0]] },
  '2': { w: 4, strokes: [[0, 5, 1, 6, 3, 6, 4, 5, 4, 3.8, 0, 0, 4, 0]] },
  '3': {
    w: 4,
    strokes: [
      [0, 5, 1, 6, 3, 6, 4, 5, 4, 4, 3, 3.2, 1.6, 3.2],
      [3, 3.2, 4, 2.4, 4, 1, 3, 0, 1, 0, 0, 1],
    ],
  },
  '4': { w: 4, strokes: [[3, 0, 3, 6, 0, 2, 4, 2]] },
  '5': { w: 4, strokes: [[4, 6, 0, 6, 0, 3.4, 2.8, 3.4, 4, 2.4, 4, 1, 3, 0, 1, 0, 0, 1]] },
  '6': { w: 4, strokes: [[4, 5, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2, 3, 3, 0, 3]] },
  '7': { w: 4, strokes: [[0, 6, 4, 6, 1.6, 0]] },
  '8': {
    w: 4,
    strokes: [
      [1, 3.2, 0.4, 4, 0.4, 5, 1.4, 6, 2.6, 6, 3.6, 5, 3.6, 4, 3, 3.2, 1, 3.2],
      [1, 3.2, 0, 2.4, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2.4, 3, 3.2],
    ],
  },
  '9': { w: 4, strokes: [[0, 1, 1, 0, 3, 0, 4, 1, 4, 5, 3, 6, 1, 6, 0, 5, 0, 4, 1, 3, 4, 3]] },

  '.': { w: 1, strokes: [[0.5, 0]] },
  ',': { w: 1, strokes: [[0.7, 0.6, 0.2, -0.9]] },
  ':': { w: 1, strokes: [[0.5, 4], [0.5, 1]] },
  ';': { w: 1, strokes: [[0.5, 4], [0.7, 0.6, 0.2, -0.9]] },
  '!': { w: 1, strokes: [[0.5, 6, 0.5, 2], [0.5, 0]] },
  '?': { w: 4, strokes: [[0, 5, 1, 6, 3, 6, 4, 5, 4, 3.8, 2, 2.6, 2, 1.8], [2, 0]] },
  "'": { w: 0.8, strokes: [[0.4, 6, 0.4, 4.6]] },
  '"': { w: 1.8, strokes: [[0.4, 6, 0.4, 4.6], [1.4, 6, 1.4, 4.6]] },
  '-': { w: 2.6, strokes: [[0, 2.8, 2.6, 2.8]] },
  '+': { w: 2.6, strokes: [[0, 2.8, 2.6, 2.8], [1.3, 1.5, 1.3, 4.1]] },
  '/': { w: 3, strokes: [[0, 0, 3, 6]] },
  '(': { w: 1.4, strokes: [[1.4, 6.5, 0, 4.5, 0, 1.5, 1.4, -0.5]] },
  ')': { w: 1.4, strokes: [[0, 6.5, 1.4, 4.5, 1.4, 1.5, 0, -0.5]] },
  '&': {
    w: 4.4,
    strokes: [
      [4.4, 0, 1, 3.6, 0.6, 4.4, 0.6, 5.2, 1.4, 6, 2.2, 6, 3, 5.2, 3, 4.4, 0, 1.8, 0, 1, 1, 0,
        2.6, 0, 4.4, 1.8],
    ],
  },
};

/**
 * What an unknown character draws as: an empty frame, the classic tofu.
 * Deliberately visible — a glyph this font cannot say should be seen on the
 * sign and added to the table, not silently swallowed.
 */
const TOFU: Glyph = { w: 4, strokes: [[0, 0, 4, 0, 4, 6, 0, 6, 0, 0]] };

interface PlacedGlyph {
  glyph: Glyph;
  /** Pen position in grid units, block-relative. */
  x: number;
  y: number;
}

/**
 * Lays the text out in grid units: which glyph goes where, and how big the
 * block is. Separated from the geometry so `fitWidth` can measure before a
 * single triangle exists.
 */
function layout(
  text: string,
  lineHeightCaps: number,
  align: 'left' | 'center',
  strokeUnits: number,
): { placed: PlacedGlyph[]; unitWidth: number; unitHeight: number } {
  const lines = text.toUpperCase().split('\n');
  const leading = lineHeightCaps * CAP;

  // Measure each line first, so centring knows the widths.
  //
  // A glyph's cell is its skeleton width **plus one stroke**, because ink
  // spreads half a stroke either side of the centreline. This is what makes
  // the bold cuts set wider, and it is not a nicety: advances measured
  // skeleton-to-skeleton keep a fixed gap between skeletons while the ink
  // fattens into it, so by a weight of 0.24 neighbouring letters were
  // touching and black was one connected smear. Sized off the ink, the gap
  // between letters is the same at every weight.
  const rows = lines.map((line) => {
    const glyphs: { glyph: Glyph | null; advance: number }[] = [];
    for (const ch of line) {
      if (ch === ' ') {
        glyphs.push({ glyph: null, advance: SPACE + strokeUnits });
      } else {
        const glyph = GLYPHS[ch] ?? TOFU;
        glyphs.push({ glyph, advance: glyph.w + strokeUnits + TRACK });
      }
    }
    // The trailing track after the last glyph is not part of the line.
    const width = glyphs.reduce((sum, g) => sum + g.advance, 0) - (glyphs.length ? TRACK : 0);
    return { glyphs, width: Math.max(width, 0) };
  });

  const unitWidth = Math.max(...rows.map((row) => row.width), 1);
  const unitHeight = CAP + (lines.length - 1) * leading;

  const placed: PlacedGlyph[] = [];
  for (let i = 0; i < rows.length; i++) {
    // Cap of the first line at +H/2, baseline of the last at -H/2, so the
    // block is centred on the origin and a caller positions its middle.
    const baseline = unitHeight / 2 - CAP - i * leading;
    let pen = align === 'center' ? -rows[i].width / 2 : -unitWidth / 2;
    for (const { glyph, advance } of rows[i].glyphs) {
      // Skeleton origin half a stroke in from the cell's edge, so the ink
      // begins at the pen rather than overhanging it.
      if (glyph) placed.push({ glyph, x: pen + strokeUnits / 2, y: baseline });
      pen += advance;
    }
  }

  return { placed, unitWidth, unitHeight };
}

/**
 * Builds the text as one merged geometry of closed solids: a box per polyline
 * segment, cut to exact length, and an octagonal knuckle at every vertex.
 *
 * The knuckle is the whole corner story. The first version extended each box
 * past its endpoint to cover the wedge that opens at a bend, and at every
 * corner the two extended ends poked past each other's silhouette — a pair of
 * triangles sticking out of each elbow, everywhere. A disc at the vertex
 * covers the same wedge from *any* meeting angle without overshooting either
 * stroke, rounds the corner, and caps the terminals to match: a round-joined
 * stroke, which is what a brush or a router would leave anyway.
 *
 * Two details are for the kit's watertight check, whose edge accounting
 * merges vertices that quantize together. Knuckles are deduplicated by
 * position, because glyph strokes share endpoints ('B' alone has three
 * meeting at two points) and two coincident discs would double every edge.
 * And the octagon is phased 22.5° off the axes, so its vertices cannot land
 * on the corner vertices of the axis-aligned strokes that meet it.
 */
export function lettering(text: string, style: LetteringStyle = {}): Lettering {
  const {
    weight = 0.16,
    slant = 0,
    depth = 0.55,
    lineHeight = 1.5,
    align = 'center',
    fitWidth,
  } = style;

  const strokeUnits = weight * CAP;
  const { placed, unitWidth, unitHeight } = layout(text, lineHeight, align, strokeUnits);
  if (placed.length === 0) throw new Error('lettering: nothing to draw');

  // Grid units to metres, shrunk if the widest line would overrun the fit.
  let unit = (style.capHeight ?? 0.15) / CAP;
  if (fitWidth !== undefined) unit = Math.min(unit, fitWidth / unitWidth);

  const capHeight = unit * CAP;
  const stroke = weight * capHeight;
  const relief = Math.max(depth * stroke, 0.004);

  const solids: THREE.BufferGeometry[] = [];
  const box = (
    length: number,
    angle: number,
    x: number,
    y: number,
  ): void => {
    const geometry = new THREE.BoxGeometry(length, stroke, relief);
    if (angle !== 0) geometry.rotateZ(angle);
    geometry.translate(x, y, 0);
    solids.push(geometry);
  };

  // Circumscribed rather than inscribed, so the octagon's flats sit flush
  // with the stroke's sides and a joint mid-run does not waist in.
  const knuckleRadius = stroke / 2 / Math.cos(Math.PI / 8);
  const seen = new Set<string>();
  const knuckle = (x: number, y: number, radius = knuckleRadius): void => {
    // Deduplicated by position — see the note above the function.
    const key = `${Math.round(x * 8192)},${Math.round(y * 8192)}`;
    if (seen.has(key)) return;
    seen.add(key);
    const disc = new THREE.CylinderGeometry(radius, radius, relief, 8, 1, false, Math.PI / 8);
    disc.rotateX(Math.PI / 2);
    disc.translate(x, y, 0);
    solids.push(disc);
  };

  for (const { glyph, x, y } of placed) {
    for (const points of glyph.strokes) {
      if (points.length === 2) {
        // A dot: an oversized knuckle on its own, so full stops read at
        // distance and match the round terminals everything else has.
        knuckle((x + points[0] + slant * points[1]) * unit, (y + points[1]) * unit, stroke * 0.75);
        continue;
      }
      for (let i = 0; i + 3 < points.length; i += 2) {
        // Shear the centreline, not the boxes: the strokes lean and stay
        // rectangular in section, which is how slanted stone-cut letters look.
        const ax = (x + points[i] + slant * points[i + 1]) * unit;
        const ay = (y + points[i + 1]) * unit;
        const bx = (x + points[i + 2] + slant * points[i + 3]) * unit;
        const by = (y + points[i + 3]) * unit;
        knuckle(ax, ay);
        knuckle(bx, by);
        const length = Math.hypot(bx - ax, by - ay);
        if (length < 1e-6) continue;
        box(length, Math.atan2(by - ay, bx - ax), (ax + bx) / 2, (ay + by) / 2);
      }
    }
  }

  const merged = mergeGeometries(solids, false);
  for (const geometry of solids) geometry.dispose();
  if (!merged) throw new Error('lettering: merge failed');

  return {
    geometry: merged,
    width: unitWidth * unit,
    height: unitHeight * unit,
    capHeight,
  };
}

/**
 * Lettering as a finished kit mesh, for text that stands on its own — a
 * floating tutorial line, a word hung in the air of a zone. Rigid, on the
 * shared art material, one draw call, like any other prop.
 *
 * Flagged `noCollide`, always. Lettering is thousands of small triangles in
 * a hand-span of space, and letting a caller's `markCollidable` sweep them
 * into the octree makes walking into a word cost whole milliseconds a frame
 * — the street lamp's light beam has the same opt-out for the same reason.
 * Text you can lean on is not a thing this module sells; an object that
 * carries text keeps its own solid geometry for the collider and hangs the
 * lettering off it as a mesh like this one.
 */
export function letteringMesh(
  text: string,
  color: number = PALETTE.INK,
  style: LetteringStyle = {},
): THREE.Mesh {
  const { geometry } = lettering(text, style);
  const mesh = finish(assemble([{ geometry, color, sway: 0 }]), 'lettering', 0);
  mesh.userData.noCollide = true;
  return mesh;
}

export interface LetteringGlowStyle extends LetteringStyle {
  /** Draw as light over the world rather than as a bright surface in it. Off by default. */
  additive?: boolean;
  /**
   * How far past full brightness the colour is pushed. Default 1.
   *
   * Bloom's halo is made of the light above the top of the picture, and a hex
   * tops out at exactly 1 — so at an intensity of 1 there is nothing to spread.
   */
  intensity?: number;
  /**
   * A light thrown by the word itself, in the text's own colour. Off by
   * default — a caption used in a corridor must not add a light to every zone
   * it appears in.
   *
   * Uses `FLAME_DECAY` rather than the physical exponent, for the reason given
   * there: inverse-square at arm's length blows out to a flat blob under this
   * pipeline.
   */
  light?: { intensity?: number; range?: number };
}

/**
 * Lettering that emits: a line of text as a light rather than as paint. The
 * counterpart to `letteringMesh`, and the same object but for the material.
 *
 * `color` has no default. A glowing word is not ink and there is no one colour
 * it should be.
 */
export function letteringGlow(
  text: string,
  color: number,
  style: LetteringGlowStyle = {},
): THREE.Mesh {
  const { geometry } = lettering(text, style);
  const assembled = assemble([{ geometry, color, sway: 0 }]);

  // After assembly, not folded into the colour: a hex cannot express a value
  // over 1 and this needs to.
  const intensity = style.intensity ?? 1;
  if (intensity !== 1) {
    const colors = assembled.getAttribute('color');
    const array = colors.array as Float32Array;
    for (let i = 0; i < array.length; i++) array[i] *= intensity;
    colors.needsUpdate = true;
  }

  const mesh = finishGlow(
    assembled,
    'lettering:glow',
    style.additive ? TEXT_GLOW_ADDITIVE : TEXT_GLOW_MATERIAL,
  );

  if (style.light) {
    // At the block's centre, which is where the letters are — a word lights a
    // room from where it hangs, the way a lantern does.
    const lamp = new THREE.PointLight(
      color,
      style.light.intensity ?? 6,
      style.light.range ?? 8,
      FLAME_DECAY,
    );
    lamp.castShadow = false;
    mesh.add(lamp);
  }

  return mesh;
}
