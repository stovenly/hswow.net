import { createRng, type Rng } from '../../art/random';
import type { VibeChoice, VibeName } from '../../audio/vibes';
import { kernel, ROAD, sample, woodland, type Continent, type Site } from './continent';
import { PALETTE } from './paint';
import type { ChartView } from './view';

/**
 * The pen over the paint: mountains, hills, trees, fields, marsh and the
 * marks of industry, placed once from the continent and drawn every frame in
 * window pixels so they are crisp at every zoom.
 *
 * The vibe already says what kind of place a zone is — it is what the music
 * and the air are chosen from — so the map asks it rather than making a second
 * declaration nobody would keep in step with the first.
 */

export type Family =
  | 'village'
  | 'farm'
  | 'forest'
  | 'riverside'
  | 'cave'
  | 'factory'
  | 'sewer'
  | 'scrapyard'
  | 'substation'
  | 'beach'
  | 'plains';

const FAMILIES: Record<VibeName, Family> = {
  'village 1': 'village',
  'village 2': 'village',
  'village interior 1': 'village',
  'village interior 2': 'village',
  farm: 'farm',
  'forest a': 'forest',
  'forest b': 'forest',
  'forest path a': 'forest',
  'forest path b': 'forest',
  riverside: 'riverside',
  cave: 'cave',
  'cave 2': 'cave',
  'cave dark': 'cave',
  'factory 1': 'factory',
  'factory 2': 'factory',
  'sewer 1': 'sewer',
  'sewer 2': 'sewer',
  scrapyard: 'scrapyard',
  'substation 1': 'substation',
  'substation 2': 'substation',
  beach: 'beach',
  'beach path': 'beach',
  'plains 1': 'plains',
  'plains 2': 'plains',
};

/**
 * Which family a zone's country belongs to. The **ambience** half of a split
 * choice, since that is what the place sounds like when nothing is playing; a
 * rotation takes its first entry, because a map cannot change with the day.
 */
export function familyOf(choice: VibeChoice | undefined): Family | null {
  if (choice === undefined) return null;
  if (typeof choice === 'string') return FAMILIES[choice];
  const named = choice.ambience ?? choice.music;
  if (!named) return null;
  const name = typeof named === 'string' ? named : named[0];
  return name ? FAMILIES[name] : null;
}

export type Kind =
  | 'mountain'
  | 'hill'
  | 'tree'
  | 'field'
  | 'marsh'
  | 'tuft'
  | 'chimney'
  | 'pylon'
  | 'heap'
  | 'grate';

export interface Mark {
  kind: Kind;
  x: number;
  y: number;
  /** Half-width, in map units. */
  size: number;
  /** 0..1, drawn first when the view is too far out to draw them all. */
  rank: number;
  seed: number;
}

/** How far a mark keeps from a river's centreline beyond its own size, in roads. */
const RIVER_CLEAR = 0.03;

/** Spacing of each kind's lattice, in roads. */
const SPACING: Record<Kind, number> = {
  mountain: 0.068,
  hill: 0.09,
  tree: 0.042,
  field: 0.07,
  marsh: 0.065,
  tuft: 0.1,
  chimney: 0.085,
  pylon: 0.09,
  heap: 0.08,
  grate: 0.085,
};

export function placeRelief(c: Continent, sites: readonly Site[], seed: number): Mark[] {
  const marks: Mark[] = [];
  const rng = createRng(seed ^ 0x5e11ef);
  const lattice = (kind: Kind, keep: (i: number, x: number, y: number, r: Rng) => number): void => {
    const gap = SPACING[kind] * ROAD;
    const across = Math.ceil(c.span.w / gap);
    const down = Math.ceil(c.span.h / gap);
    for (let row = 0; row < down; row++) {
      for (let col = 0; col < across; col++) {
        const x = c.span.x + (col + 0.2 + rng() * 0.6) * gap;
        const y = c.span.y + (row + 0.2 + rng() * 0.6) * gap;
        const i = sample(c, x, y);
        if (i < 0 || !c.land[i] || c.lake[i]) continue;
        const size = keep(i, x, y, rng);
        if (size <= 0) continue;
        // Nothing stands in a river.
        if (c.fresh[i] * c.cell < size * 1.6 + RIVER_CLEAR * ROAD) continue;
        marks.push({ kind, x, y, size, rank: rng(), seed: rng.int(0, 1e9) });
      }
    }
  };

  const near = (family: Family, x: number, y: number, reach: number): number => {
    let most = 0;
    for (const site of sites) {
      if (site.family !== family) continue;
      most = Math.max(most, kernel(Math.hypot(x - site.x, y - site.y), reach * ROAD));
    }
    return most;
  };

  lattice('mountain', (i) => {
    const h = c.height[i];
    if (h < 0.62) return 0;
    return (0.03 + 0.05 * ((h - 0.62) / 0.38)) * ROAD;
  });
  lattice('hill', (i, _x, _y, r) => {
    const h = c.height[i];
    if (h < 0.4 || h >= 0.62 || c.wet[i] > 0.6) return 0;
    return r.chance(0.7) ? 0.022 * ROAD : 0;
  });
  lattice('tree', (i, x, y, r) => {
    const wood = Math.max(woodland(c, i), near('forest', x, y, 0.7) * 0.9);
    if (wood < 0.35 || c.height[i] > 0.62) return 0;
    return r() < wood ? r.range(0.016, 0.022) * ROAD : 0;
  });
  lattice('field', (i, x, y, r) => {
    const tilled = Math.max(near('farm', x, y, 0.7), near('village', x, y, 0.55));
    if (tilled < 0.3 || c.height[i] > 0.5 || woodland(c, i) > 0.5) return 0;
    return r.chance(0.8) ? 0.03 * ROAD : 0;
  });
  lattice('marsh', (i, x, y, r) => {
    if (near('riverside', x, y, 0.6) < 0.25 || c.height[i] > 0.2 || c.wet[i] < 0.5) return 0;
    return r.chance(0.6) ? 0.024 * ROAD : 0;
  });
  lattice('tuft', (i, x, y, r) => {
    if (c.height[i] > 0.4 || c.wet[i] > 0.4 || c.blight[i] > 0.2) return 0;
    const open = Math.max(0.25, near('plains', x, y, 1.0));
    return r() < open * 0.5 ? 0.02 * ROAD : 0;
  });
  const industry: [Kind, Family][] = [
    ['chimney', 'factory'],
    ['pylon', 'substation'],
    ['heap', 'scrapyard'],
    ['grate', 'sewer'],
  ];
  for (const [kind, family] of industry) {
    lattice(kind, (i, x, y, r) => {
      if (near(family, x, y, 0.5) < 0.3 || c.height[i] > 0.6) return 0;
      return r.chance(0.65) ? 0.026 * ROAD : 0;
    });
  }

  // North first, so a mark in front is drawn over the one behind it.
  marks.sort((a, b) => a.y - b.y);
  return marks;
}

export function drawRelief(
  context: CanvasRenderingContext2D,
  marks: readonly Mark[],
  view: ChartView,
  w: number,
  h: number,
  shown: (x: number, y: number) => boolean,
): void {
  const point: [number, number] = [0, 0];
  context.lineJoin = 'round';
  context.lineCap = 'round';
  // One drawing at every zoom: every mark, at its own size, whatever the scale.
  // Names are drawn over the marks with a halo rather than the marks giving way.
  for (const mark of marks) {
    const size = mark.size * view.scale;
    view.project(mark.x, mark.y, w, h, point);
    const [px, py] = point;
    if (px < -size * 2 || py < -size * 2 || px > w + size * 2 || py > h + size * 2) continue;
    if (!shown(mark.x, mark.y)) continue;
    GLYPHS[mark.kind](context, px, py, size, mark.seed);
  }
}

type Glyph = (context: CanvasRenderingContext2D, x: number, y: number, s: number, seed: number) => void;

/**
 * A range in pen and wash: a main peak with a shoulder or two, the left flank
 * a clean line and the right in shade — a fill and hatching that follow the
 * slope — a snow cap on the tall ones, and foothills at the skirts. The base
 * is left open, as engraved mountains are, so the range sits on the paint.
 */
const mountain: Glyph = (context, x, y, s, seed) => {
  const rng = createRng(seed);
  const lean = rng.range(-0.2, 0.2) * s;
  const height = s * rng.range(1.1, 1.45);
  const top = y - height;
  const foot = y + s * 0.4;
  // The ridge line, left foot to right foot, over the peak and its shoulders.
  const ridge: [number, number][] = [[x - s, foot]];
  if (rng.chance(0.6)) ridge.push([x - s * rng.range(0.45, 0.7), y - height * rng.range(0.3, 0.55)]);
  if (rng.chance(0.5)) ridge.push([x - s * rng.range(0.15, 0.3), y - height * rng.range(0.55, 0.8)]);
  ridge.push([x + lean, top]);
  if (rng.chance(0.55)) ridge.push([x + s * rng.range(0.25, 0.45), y - height * rng.range(0.45, 0.7)]);
  if (rng.chance(0.5)) ridge.push([x + s * rng.range(0.6, 0.8), y - height * rng.range(0.15, 0.4)]);
  ridge.push([x + s, foot]);
  const peak = ridge.findIndex(([px]) => px === x + lean);

  // The body, washed, and the shaded face away from the north-west light.
  context.beginPath();
  ridge.forEach(([px, py], i) => (i === 0 ? context.moveTo(px, py) : context.lineTo(px, py)));
  context.closePath();
  context.fillStyle = PALETTE.mountainLight;
  context.fill();
  context.beginPath();
  context.moveTo(x + lean, top);
  for (let i = peak + 1; i < ridge.length; i++) context.lineTo(ridge[i][0], ridge[i][1]);
  context.lineTo(x + lean * 0.5 + s * 0.08, foot);
  context.closePath();
  context.fillStyle = PALETTE.ink;
  context.globalAlpha = 0.22;
  context.fill();
  context.globalAlpha = 1;

  // Hatching down the shaded face, following the fall of the slope.
  context.save();
  context.clip();
  context.strokeStyle = PALETTE.ink;
  context.globalAlpha = 0.4;
  context.lineWidth = Math.max(0.5, s * 0.055);
  const strokes = 3 + Math.floor(s / 6);
  for (let i = 0; i < strokes; i++) {
    const t = (i + 0.5) / strokes;
    const sx = x + lean + (s - lean) * t;
    context.beginPath();
    context.moveTo(sx, top + (foot - top) * t * 0.85);
    context.lineTo(sx - s * 0.32, foot + s * 0.1);
    context.stroke();
  }
  context.restore();

  // The ridge itself, heavier at the peak, and a shadow line under the right foot.
  context.beginPath();
  ridge.forEach(([px, py], i) => (i === 0 ? context.moveTo(px, py) : context.lineTo(px, py)));
  context.strokeStyle = PALETTE.ink;
  context.lineWidth = Math.max(0.8, s * 0.12);
  context.stroke();

  // Foothills at either skirt, lighter.
  context.globalAlpha = 0.55;
  context.lineWidth = Math.max(0.6, s * 0.08);
  context.beginPath();
  context.moveTo(x - s * 1.25, foot);
  context.quadraticCurveTo(x - s * 1.0, foot - s * 0.35, x - s * 0.72, foot);
  context.moveTo(x + s * 0.7, foot);
  context.quadraticCurveTo(x + s * 1.02, foot - s * 0.3, x + s * 1.28, foot);
  context.stroke();
  context.globalAlpha = 1;

  // Snow on the tall ones: a jagged cap over the peak, filled, edged in ink.
  if (s > 7) {
    const cap = height * rng.range(0.2, 0.3);
    context.beginPath();
    context.moveTo(x + lean - s * 0.26 * (cap / height) * 3, top + cap);
    context.lineTo(x + lean - s * 0.1, top + cap * 0.55);
    context.lineTo(x + lean - s * 0.02, top + cap * 0.85);
    context.lineTo(x + lean + s * 0.08, top + cap * 0.5);
    context.lineTo(x + lean + s * 0.18, top + cap * 0.9);
    context.lineTo(x + lean + s * 0.26 * (cap / height) * 3, top + cap);
    context.lineTo(x + lean, top);
    context.closePath();
    context.fillStyle = PALETTE.peak;
    context.fill();
    context.strokeStyle = PALETTE.ink;
    context.globalAlpha = 0.6;
    context.lineWidth = Math.max(0.5, s * 0.06);
    context.stroke();
    context.globalAlpha = 1;
  }
};

/** A rounded rise with its shaded side hatched twice and a foot line that fades. */
const hill: Glyph = (context, x, y, s, seed) => {
  const rng = createRng(seed);
  const lean = rng.range(-0.15, 0.15) * s;
  const crest = y - s * rng.range(0.8, 1.05);
  context.beginPath();
  context.moveTo(x - s, y + s * 0.3);
  context.quadraticCurveTo(x + lean - s * 0.35, crest - s * 0.15, x + lean, crest);
  context.quadraticCurveTo(x + lean + s * 0.45, crest + s * 0.05, x + s, y + s * 0.3);
  context.fillStyle = PALETTE.mountainLight;
  context.globalAlpha = 0.6;
  context.fill();
  context.globalAlpha = 1;
  context.strokeStyle = PALETTE.ink;
  context.lineWidth = Math.max(0.7, s * 0.1);
  context.stroke();
  context.globalAlpha = 0.45;
  context.lineWidth = Math.max(0.5, s * 0.07);
  for (const [f, t] of [
    [0.1, 0.7],
    [0.35, 0.85],
  ]) {
    context.beginPath();
    context.moveTo(x + lean + s * f, crest + (y + s * 0.3 - crest) * f * 0.9);
    context.quadraticCurveTo(x + lean + s * (f + 0.25), y - s * 0.1, x + s * t, y + s * 0.25);
    context.stroke();
  }
  context.globalAlpha = 1;
};

/**
 * A tree, drawn one of two ways by its seed: a broadleaf with a scalloped
 * crown shaded on the south-east, or a conifer in three tiers. Both stand on
 * a short trunk with a dab of shadow at the foot.
 */
const tree: Glyph = (context, x, y, s, seed) => {
  const rng = createRng(seed);
  const r = s * rng.range(0.85, 1.05);
  context.strokeStyle = PALETTE.ink;
  // The dab of shadow the tree casts, south-east of the trunk.
  context.beginPath();
  context.ellipse(x + r * 0.25, y + r * 0.42, r * 0.55, r * 0.16, 0, 0, Math.PI * 2);
  context.fillStyle = PALETTE.ink;
  context.globalAlpha = 0.16;
  context.fill();
  context.globalAlpha = 1;

  if (rng.chance(0.38)) {
    // The conifer: tiers narrowing to a point, each edged below.
    const top = y - r * 2.1;
    const tiers = 3;
    context.beginPath();
    context.moveTo(x, top);
    for (let i = 0; i < tiers; i++) {
      const t = (i + 1) / tiers;
      const wide = r * (0.35 + 0.65 * t);
      const base = top + (y - r * 0.15 - top) * t;
      context.lineTo(x + wide, base);
      context.lineTo(x + wide * 0.55, base - r * 0.08);
    }
    for (let i = tiers - 1; i >= 0; i--) {
      const t = (i + 1) / tiers;
      const wide = r * (0.35 + 0.65 * t);
      const base = top + (y - r * 0.15 - top) * t;
      context.lineTo(x - wide * 0.55, base - r * 0.08);
      context.lineTo(x - wide, base);
    }
    context.closePath();
    context.fillStyle = PALETTE.forest;
    context.fill();
    context.lineWidth = Math.max(0.6, r * 0.1);
    context.globalAlpha = 0.8;
    context.stroke();
    context.globalAlpha = 1;
    // The shaded half, a wash over the right side.
    context.beginPath();
    context.moveTo(x, top);
    context.lineTo(x + r, y - r * 0.15);
    context.lineTo(x, y - r * 0.15);
    context.closePath();
    context.fillStyle = PALETTE.ink;
    context.globalAlpha = 0.18;
    context.fill();
    context.globalAlpha = 1;
  } else {
    // The broadleaf: a crown of lobes, its outline scalloped, dark on the shade side.
    const cy = y - r * 0.85;
    const lobes = 5 + rng.int(0, 2);
    const turn = rng.range(0, Math.PI * 2);
    const radii: number[] = [];
    for (let i = 0; i < lobes; i++) radii.push(r * rng.range(0.6, 0.78));
    context.beginPath();
    for (let i = 0; i < lobes; i++) {
      const angle = turn + (i / lobes) * Math.PI * 2;
      const lx = x + Math.cos(angle) * r * 0.42;
      const ly = cy + Math.sin(angle) * r * 0.36;
      context.moveTo(lx + radii[i], ly);
      context.arc(lx, ly, radii[i], 0, Math.PI * 2);
    }
    context.fillStyle = PALETTE.crown;
    context.fill();
    // The shaded side: the same lobes clipped to the south-east, washed darker.
    context.save();
    context.clip();
    context.beginPath();
    context.arc(x + r * 0.25, cy + r * 0.25, r * 1.6, 0, Math.PI * 2);
    context.arc(x - r * 0.28, cy - r * 0.28, r * 1.05, 0, Math.PI * 2, true);
    context.fillStyle = PALETTE.forest;
    context.globalAlpha = 0.7;
    context.fill();
    context.restore();
    context.globalAlpha = 1;
    // The scalloped edge in ink, lighter on the lit side.
    context.lineWidth = Math.max(0.6, r * 0.1);
    for (let i = 0; i < lobes; i++) {
      const angle = turn + (i / lobes) * Math.PI * 2;
      const lx = x + Math.cos(angle) * r * 0.42;
      const ly = cy + Math.sin(angle) * r * 0.36;
      const lit = Math.cos(angle + Math.PI * 0.75) > 0;
      context.beginPath();
      context.arc(lx, ly, radii[i], angle - Math.PI * 0.6, angle + Math.PI * 0.6);
      context.globalAlpha = lit ? 0.35 : 0.7;
      context.stroke();
    }
    context.globalAlpha = 1;
  }

  // The trunk.
  context.beginPath();
  context.moveTo(x, y - r * 0.3);
  context.lineTo(x, y + r * 0.35);
  context.lineWidth = Math.max(0.7, r * 0.13);
  context.globalAlpha = 0.9;
  context.stroke();
  context.globalAlpha = 1;
};

const field: Glyph = (context, x, y, s, seed) => {
  const rng = createRng(seed);
  const turn = rng.chance(0.5) ? 0.35 : -0.35;
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  context.strokeStyle = PALETTE.ink;
  context.globalAlpha = 0.5;
  context.lineWidth = Math.max(0.6, s * 0.08);
  for (let i = -1; i <= 1; i++) {
    const oy = i * s * 0.42;
    context.beginPath();
    context.moveTo(x - s * cos - oy * sin, y - s * sin + oy * cos);
    context.lineTo(x + s * cos - oy * sin, y + s * sin + oy * cos);
    context.stroke();
  }
  context.globalAlpha = 1;
};

const marsh: Glyph = (context, x, y, s) => {
  context.strokeStyle = PALETTE.ink;
  context.globalAlpha = 0.55;
  context.lineWidth = Math.max(0.6, s * 0.08);
  for (const [ox, oy, len] of [
    [-0.6, 0.35, 0.7],
    [0.35, 0.55, 0.6],
    [-0.1, 0.05, 0.5],
  ]) {
    context.beginPath();
    context.moveTo(x + (ox - len / 2) * s, y + oy * s);
    context.lineTo(x + (ox + len / 2) * s, y + oy * s);
    context.stroke();
  }
  for (const lean of [-0.5, 0, 0.5]) {
    context.beginPath();
    context.moveTo(x, y + s * 0.05);
    context.quadraticCurveTo(x + lean * s * 0.4, y - s * 0.4, x + lean * s * 0.8, y - s * 0.8);
    context.stroke();
  }
  context.globalAlpha = 1;
};

const tuft: Glyph = (context, x, y, s) => {
  context.strokeStyle = PALETTE.ink;
  context.globalAlpha = 0.45;
  context.lineWidth = Math.max(0.6, s * 0.08);
  for (const lean of [-0.5, 0, 0.5]) {
    context.beginPath();
    context.moveTo(x, y + s * 0.5);
    context.quadraticCurveTo(x + lean * s, y, x + lean * s * 1.6, y - s * 0.6);
    context.stroke();
  }
  context.globalAlpha = 1;
};

const chimney: Glyph = (context, x, y, s) => {
  context.strokeStyle = PALETTE.ink;
  context.lineWidth = Math.max(0.7, s * 0.1);
  context.beginPath();
  context.moveTo(x - s * 0.3, y + s * 0.8);
  context.lineTo(x - s * 0.2, y - s * 0.8);
  context.lineTo(x + s * 0.2, y - s * 0.8);
  context.lineTo(x + s * 0.3, y + s * 0.8);
  context.closePath();
  context.fillStyle = PALETTE.blight;
  context.fill();
  context.stroke();
  context.beginPath();
  context.arc(x + s * 0.15, y - s * 1.2, s * 0.4, 0, Math.PI * 2);
  context.arc(x + s * 0.55, y - s * 1.5, s * 0.3, 0, Math.PI * 2);
  context.fillStyle = PALETTE.ink;
  context.globalAlpha = 0.22;
  context.fill();
  context.globalAlpha = 1;
};

const pylon: Glyph = (context, x, y, s) => {
  context.strokeStyle = PALETTE.ink;
  context.lineWidth = Math.max(0.7, s * 0.09);
  context.beginPath();
  context.moveTo(x - s * 0.7, y + s);
  context.lineTo(x, y - s);
  context.lineTo(x + s * 0.7, y + s);
  context.stroke();
  context.beginPath();
  context.moveTo(x - s * 0.6, y - s * 0.2);
  context.lineTo(x + s * 0.6, y - s * 0.2);
  context.moveTo(x - s * 0.4, y - s * 0.55);
  context.lineTo(x + s * 0.4, y - s * 0.55);
  context.stroke();
};

const heap: Glyph = (context, x, y, s) => {
  context.beginPath();
  context.moveTo(x - s, y + s * 0.5);
  context.lineTo(x - s * 0.3, y - s * 0.5);
  context.lineTo(x + s * 0.4, y + s * 0.1);
  context.lineTo(x + s, y + s * 0.5);
  context.closePath();
  context.fillStyle = PALETTE.blight;
  context.fill();
  context.strokeStyle = PALETTE.ink;
  context.lineWidth = Math.max(0.7, s * 0.1);
  context.stroke();
};

const grate: Glyph = (context, x, y, s) => {
  context.strokeStyle = PALETTE.ink;
  context.lineWidth = Math.max(0.7, s * 0.09);
  context.strokeRect(x - s * 0.8, y - s * 0.5, s * 1.6, s);
  for (let i = 1; i < 3; i++) {
    const at = x - s * 0.8 + (s * 1.6 * i) / 3;
    context.beginPath();
    context.moveTo(at, y - s * 0.5);
    context.lineTo(at, y + s * 0.5);
    context.stroke();
  }
};

const GLYPHS: Record<Kind, Glyph> = {
  mountain,
  hill,
  tree,
  field,
  marsh,
  tuft,
  chimney,
  pylon,
  heap,
  grate,
};
