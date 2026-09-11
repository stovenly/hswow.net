import * as THREE from 'three';
import type { Rng } from './random';
import { assemble, assembleCanopy, finish, type Part } from './assemble';
import { CANOPY_ATTRIBUTE, WIND_ATTRIBUTE, ROOT_ATTRIBUTE, CARD_ATTRIBUTE, SHADE_ATTRIBUTE, CROWN_ATTRIBUTE, AXES_ATTRIBUTE, CANOPY_MODE, FIN_FLAG } from './canopy';
import { packBranch, type Family } from './fields';
import { aspectOf, SHEET_BROADLEAF } from './branchSheet';
import { PALETTE, shade, blend } from './palette';

// The crown helpers. A crown is branch cards: a few dozen quads each wearing a
// whole branch off the boot-rendered sheet, rooted on the wood inside an
// envelope of clouds that is never drawn, each turning about its own axis to
// face the eye, coloured from the crown field per pixel.

export interface LeafColour {
  /** sRGB hex, the leaf where the sky reaches it. */
  lit: number;
  /** The leaf in the crown's own shade. */
  shade: number;
}

/** Per-species leaf pairs, derived from the three leaf colours the kit already had. */
export const LEAVES = {
  broadleaf: { lit: shade(PALETTE.LEAF, 1.14), shade: shade(PALETTE.LEAF_DARK, 0.88) },
  birch: { lit: blend(shade(PALETTE.LEAF, 1.2), PALETTE.GRASS_DRY, 0.25), shade: shade(PALETTE.LEAF, 0.82) },
  willow: { lit: blend(PALETTE.LEAF, PALETTE.GRASS_DRY, 0.42), shade: blend(PALETTE.LEAF_DARK, PALETTE.GRASS_DRY, 0.3) },
  ash: { lit: blend(shade(PALETTE.LEAF, 1.2), PALETTE.GRASS, 0.3), shade: shade(PALETTE.LEAF, 0.8) },
  alder: { lit: shade(PALETTE.LEAF_DARK, 1.0), shade: shade(PALETTE.LEAF_DARK, 0.6) },
  hawthorn: { lit: shade(PALETTE.LEAF, 1.02), shade: shade(PALETTE.LEAF_DARK, 0.8) },
  conifer: { lit: shade(PALETTE.LEAF_DARK, 1.12), shade: shade(PALETTE.LEAF_DARK, 0.66) },
  pine: { lit: blend(PALETTE.LEAF_DARK, PALETTE.GRASS, 0.3), shade: shade(PALETTE.LEAF_DARK, 0.7) },
  // The darkest thing in the kit, and dark is most of what says yew.
  yew: { lit: shade(PALETTE.LEAF_DARK, 0.78), shade: shade(PALETTE.LEAF_DARK, 0.46) },
  rowan: { lit: blend(shade(PALETTE.LEAF, 1.1), PALETTE.GRASS_DRY, 0.18), shade: shade(PALETTE.LEAF_DARK, 0.86) },
  // Dark with a wide gap to its shade, which is how a glossy leaf reads at distance.
  holly: { lit: blend(shade(PALETTE.LEAF_DARK, 1.25), 0x2f4a34, 0.4), shade: shade(PALETTE.LEAF_DARK, 0.52) },
  poplar: { lit: blend(shade(PALETTE.LEAF, 1.28), PALETTE.GRASS_DRY, 0.2), shade: shade(PALETTE.LEAF, 0.78) },
  sycamore: { lit: shade(PALETTE.LEAF, 1.0), shade: shade(PALETTE.LEAF_DARK, 0.72) },
  gorse: { lit: shade(PALETTE.LEAF_DARK, 0.95), shade: shade(PALETTE.LEAF_DARK, 0.6) },
  palm: { lit: blend(shade(PALETTE.LEAF, 1.32), PALETTE.GRASS_DRY, 0.2), shade: shade(PALETTE.LEAF, 0.74) },
  // Dull and a little grey: a baobab's leaf is sparse enough that the pale bole behind it sets the tone.
  baobab: { lit: blend(shade(PALETTE.LEAF, 1.04), 0x7f8e6a, 0.4), shade: shade(PALETTE.LEAF_DARK, 0.7) },
  // The widest lit-to-shade gap in the kit after holly: a thin flat crown lit from above is exactly that contrast.
  acacia: { lit: blend(shade(PALETTE.LEAF, 1.12), 0x93a07a, 0.34), shade: shade(PALETTE.LEAF_DARK, 0.5) },
  hedge: { lit: shade(PALETTE.LEAF, 1.02), shade: shade(PALETTE.LEAF_DARK, 0.84) },
  thicket: { lit: shade(PALETTE.LEAF, 1.0), shade: shade(PALETTE.LEAF_DARK, 0.82) },
  fruit: { lit: shade(PALETTE.LEAF, 1.18), shade: shade(PALETTE.LEAF_DARK, 0.92) },
  dry: { lit: shade(PALETTE.LEAF_DRY, 1.08), shade: shade(PALETTE.LEAF_DRY, 0.78) },
  blossomWhite: { lit: 0xf3efe6, shade: 0xd9cfc0 },
  blossomPink: { lit: 0xe9c3c8, shade: 0xc9979f },
  gorseYellow: { lit: 0xe8c451, shade: 0xd9a41b },
  apple: { lit: 0xb84a3c, shade: 0x8c3a2e },
  pear: { lit: 0xc9b455, shade: 0x9c8b3a },
  elderberry: { lit: 0x3a2637, shade: 0x22161f },
} as const satisfies Record<string, LeafColour>;

/** What every canopy part of one plant shares. */
export interface Species {
  colour: LeafColour;
  deciduous: boolean;
  /** The twig colour a card's picture is tinted with; the sheet's own bark when absent. */
  bark?: number;
  /** Height weight for the wind, the same function the trunk's sway uses. */
  weight: (x: number, y: number, z: number) => number;
}

/** An ellipsoid in the crown's envelope. Never drawn. */
export interface Lobe {
  centre: THREE.Vector3;
  radii: THREE.Vector3;
  /** Branch phase for the sway band, hashed from the centre. */
  phase: number;
  /** The noise offset the surface was displaced with. */
  offset: THREE.Vector3;
  roughness: number;
}

/** How many seeds of one species a zone builds; a placement's seed picks one. */
export const CANOPY_VARIANTS = 4;

/** Builders whose crowns are instanced per zone as stands. */
export const STAND_SPECIES: ReadonlySet<string> = new Set([
  'oak',
  'beech',
  'ash',
  'alder',
  'birch',
  'spruce',
  'pine',
  'yew',
  'rowan',
  'holly',
  'poplar',
  'sycamore',
  'willow',
  'tree',
  'small-tree',
  'small-oak',
  'small-birch',
  'small-spruce',
  'hawthorn',
  'fruit',
  'bush',
  'thicket',
  'gorse',
  'bramble',
  'hazel',
  'elder',
  'palm',
  'baobab',
  'acacia',
]);

/** The seed a stand variant is built with: one of `CANOPY_VARIANTS` per zone and species. */
export function variantSeed(zone: string, builder: string, seed: number, variants = CANOPY_VARIANTS): number {
  let hash = 2166136261;
  for (const char of `${zone}:${builder}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return ((hash >>> 0) % 900000) + 1000 + (((seed % variants) + variants) % variants);
}

// --- noise ----------------------------------------------------------------------

function hash3(x: number, y: number, z: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise3(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const sz = fz * fz * (3 - 2 * fz);
  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
  const c00 = lerp(hash3(ix, iy, iz), hash3(ix + 1, iy, iz), sx);
  const c10 = lerp(hash3(ix, iy + 1, iz), hash3(ix + 1, iy + 1, iz), sx);
  const c01 = lerp(hash3(ix, iy, iz + 1), hash3(ix + 1, iy, iz + 1), sx);
  const c11 = lerp(hash3(ix, iy + 1, iz + 1), hash3(ix + 1, iy + 1, iz + 1), sx);
  return lerp(lerp(c00, c10, sy), lerp(c01, c11, sy), sz);
}

/** Two octaves, 0..1, at the lobe's own frequency. */
function bumps(u: THREE.Vector3, offset: THREE.Vector3): number {
  const a = noise3(u.x * 1.9 + offset.x, u.y * 1.9 + offset.y, u.z * 1.9 + offset.z);
  const b = noise3(u.x * 4.3 + offset.z, u.y * 4.3 + offset.x, u.z * 4.3 + offset.y);
  return a * 0.68 + b * 0.32;
}

// --- the leaf buffer -------------------------------------------------------------------

const _tmp = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

interface LeafSink {
  positions: number[];
  normals: number[];
  colors: number[];
  canopy: number[];
  wind: number[];
  roots: number[];
  cards: number[];
  shade: number[];
  /** The crown ellipsoid's centre and x radius, then its y and z radii. */
  crown: number[];
  axes: number[];
  index: number[];
}

function leafSink(): LeafSink {
  return { positions: [], normals: [], colors: [], canopy: [], wind: [], roots: [], cards: [], shade: [], crown: [], axes: [], index: [] };
}

function leafGeometry(sink: LeafSink): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(sink.positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(sink.normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(sink.colors, 3));
  geometry.setAttribute(CANOPY_ATTRIBUTE, new THREE.Float32BufferAttribute(sink.canopy, 4));
  geometry.setAttribute(WIND_ATTRIBUTE, new THREE.Float32BufferAttribute(sink.wind, 4));
  geometry.setAttribute(ROOT_ATTRIBUTE, new THREE.Float32BufferAttribute(sink.roots, 3));
  const count = sink.positions.length / 3;
  const lane = (values: number[], size: number): THREE.Float32BufferAttribute => new THREE.Float32BufferAttribute(values.length > 0 ? values : new Array(count * size).fill(0), size);
  geometry.setAttribute(CARD_ATTRIBUTE, lane(sink.cards, 3));
  geometry.setAttribute(SHADE_ATTRIBUTE, lane(sink.shade, 3));
  geometry.setAttribute(CROWN_ATTRIBUTE, lane(sink.crown, 4));
  geometry.setAttribute(AXES_ATTRIBUTE, lane(sink.axes, 2));
  geometry.setIndex(sink.index);
  return geometry;
}

/** Ranks dealt evenly and shuffled, so the far survivors are spread round the crown. */
function dealRanks(rng: Rng, count: number): number[] {
  const ranks: number[] = [];
  for (let i = 0; i < count; i++) ranks.push(0.06 + (0.94 * (i + 0.5)) / count);
  for (let i = ranks.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  return ranks;
}

// --- clouds and leaves ---------------------------------------------------------------

/** A piece of the crown's envelope: the space leaves fill and the surface they borrow their normal from. Never drawn. */
export interface Cloud extends Lobe {
  /** Points inside the cloud that the leaves nearest them lean toward, so the mass shows lumps. */
  lumps: THREE.Vector3[];
}

export function cloud(rng: Rng, centre: THREE.Vector3, radii: THREE.Vector3, roughness = 0.15): Cloud {
  const offset = new THREE.Vector3(rng.range(0, 40), rng.range(0, 40), rng.range(0, 40));
  const phase = rng.range(0, 1);
  const lumps: THREE.Vector3[] = [];
  for (let n = rng.int(5, 8); n > 0; n--) {
    const rise = rng.range(-0.6, 1);
    const flat = Math.sqrt(Math.max(0, 1 - rise * rise));
    const bearing = rng.range(0, Math.PI * 2);
    const r = rng.range(0.4, 0.7);
    lumps.push(new THREE.Vector3(centre.x + Math.cos(bearing) * flat * radii.x * r, centre.y + rise * radii.y * r, centre.z + Math.sin(bearing) * flat * radii.z * r));
  }
  return { centre: centre.clone(), radii: radii.clone(), phase, offset, roughness, lumps };
}

const _u = new THREE.Vector3();

/** How far out a point is in a cloud: 0 at the centre, 1 on its lumpy surface. */
function reach(c: Lobe, p: THREE.Vector3): number {
  _u.set((p.x - c.centre.x) / c.radii.x, (p.y - c.centre.y) / c.radii.y, (p.z - c.centre.z) / c.radii.z);
  const len = _u.length();
  if (len < 1e-6) return 0;
  _u.divideScalar(len);
  return len / (1 + c.roughness * (bumps(_u, c.offset) * 2 - 1));
}

/** A point in a cloud between two depths, 0 centre to 1 surface, biased upward by `upward`. */
function inCloud(rng: Rng, c: Cloud, upward: number, r0: number, r1: number, out: THREE.Vector3): void {
  const rise = rng.range(-0.35 + upward * 0.6, 1);
  const flat = Math.sqrt(Math.max(0, 1 - rise * rise));
  const bearing = rng.range(0, Math.PI * 2);
  _u.set(Math.cos(bearing) * flat, rise, Math.sin(bearing) * flat);
  const d = (1 + c.roughness * (bumps(_u, c.offset) * 2 - 1)) * rng.range(r0, r1);
  out.set(c.centre.x + _u.x * c.radii.x * d, c.centre.y + _u.y * c.radii.y * d, c.centre.z + _u.z * c.radii.z * d);
}

/**
 * The envelope's normal at a point, into `out`: the clouds the point is in,
 * blended by how deep it is in each, bent toward the nearest of its own
 * cloud's lumps, and never pointing far down. Returns the point's depth in
 * the envelope, 1 on the surface and less inside.
 */
function envelopeNormal(clouds: readonly Cloud[], own: Cloud, p: THREE.Vector3, lump: number, out: THREE.Vector3): number {
  out.set(0, 0, 0);
  let deepest = Infinity;
  for (const c of clouds) {
    const rho = reach(c, p);
    if (rho < deepest) deepest = rho;
    const w = Math.max(0, 1.12 - rho);
    if (w <= 0) continue;
    _tmp.set((p.x - c.centre.x) / (c.radii.x * c.radii.x), (p.y - c.centre.y) / (c.radii.y * c.radii.y), (p.z - c.centre.z) / (c.radii.z * c.radii.z)).normalize();
    out.addScaledVector(_tmp, w * w);
  }
  if (out.lengthSq() < 1e-8) {
    out.set((p.x - own.centre.x) / (own.radii.x * own.radii.x), (p.y - own.centre.y) / (own.radii.y * own.radii.y), (p.z - own.centre.z) / (own.radii.z * own.radii.z));
  }
  out.normalize();
  if (lump > 0 && own.lumps.length > 0) {
    let near = own.lumps[0];
    let best = Infinity;
    for (const l of own.lumps) {
      const d = l.distanceToSquared(p);
      if (d < best) {
        best = d;
        near = l;
      }
    }
    _tmp.subVectors(p, near);
    if (_tmp.lengthSq() > 1e-8) out.multiplyScalar(1 - lump).addScaledVector(_tmp.normalize(), lump).normalize();
  }
  if (out.y < -0.15) {
    out.y = -0.15;
    out.normalize();
  }
  return Math.min(1, deepest);
}

/** Picks a cloud by volume. */
function pickCloud(rng: Rng, clouds: readonly Cloud[]): Cloud {
  let total = 0;
  const volumes = clouds.map((c) => {
    const v = c.radii.x * c.radii.y * c.radii.z;
    total += v;
    return v;
  });
  let draw = rng() * total;
  for (let i = 0; i < clouds.length; i++) {
    draw -= volumes[i];
    if (draw <= 0) return clouds[i];
  }
  return clouds[clouds.length - 1];
}

/** The crown as the shader colours it: one ellipsoid round the whole crown, and every pixel of a card is painted from where it lies in it. */
export interface Crown {
  centre: THREE.Vector3;
  radii: THREE.Vector3;
}

/** One ellipsoid round every cloud: the shader's colour field for the whole crown. */
export function crownOf(clouds: readonly Lobe[]): Crown {
  const centre = new THREE.Vector3();
  let total = 0;
  for (const c of clouds) {
    const v = c.radii.x * c.radii.y * c.radii.z;
    centre.addScaledVector(c.centre, v);
    total += v;
  }
  centre.divideScalar(Math.max(total, 1e-6));
  const radii = new THREE.Vector3();
  for (const c of clouds) {
    const swell = 1 + c.roughness;
    radii.x = Math.max(radii.x, Math.abs(c.centre.x - centre.x) + c.radii.x * swell);
    radii.y = Math.max(radii.y, Math.abs(c.centre.y - centre.y) + c.radii.y * swell);
    radii.z = Math.max(radii.z, Math.abs(c.centre.z - centre.z) + c.radii.z * swell);
  }
  return { centre, radii };
}

// --- branch cards ------------------------------------------------------------------------

export interface Twig {
  from: THREE.Vector3;
  to: THREE.Vector3;
  /** The limb and sub-limb the wind swings this twig with; absent, it rides the trunk alone. */
  family?: Family | null;
  sub?: Family | null;
}

export interface BranchCardsOptions {
  /** The wood's twigs: a card grows out along each. */
  twigs: readonly Twig[];
  /** More cards through the crown's skin, rooted inside and pointing out. */
  count: number;
  /** Card length, metres, rolled between; the width follows the sheet's aspect. */
  length: readonly [number, number];
  /** A card length per twig instead, for a crown whose branches are the twigs. */
  lengthOf?: (twig: Twig) => number;
  /** Which tiles of the sheet to draw from: first and count. Broadleaf by default. */
  tiles?: readonly [number, number];
  /** Cards along each twig: the second is rolled a little off the first, for a bushier crown. */
  perTwig?: number;
  /** Cards turn about their axis to face the eye; false pins them where they are built. */
  turn?: boolean;
  /** Pinned cards come as a crossed pair per twig, one upright and one flat, so a bough reads from every side. */
  cross?: boolean;
  /** Where in the envelope loose cards sit: −1 fills to the floor of it, 0 is even, 1 is top-heavy. */
  upward?: number;
  /** How deep loose cards are rooted, 0 at the envelope's centre to 1 on its surface. A skin by default. */
  depth?: readonly [number, number];
  flag?: number;
  colour?: LeafColour;
}

/** sRGB into `aCanopy.y` as seven bits a channel, which `SHEET_COLOUR` unpacks the same way. */
function packBark(colour: number | undefined): number {
  if (colour === undefined) return 0;
  // Never 0, so no channel lands the packed value on a decode boundary that a varying's last bit could cross.
  const q = (byte: number): number => Math.max(1, Math.round((byte / 255) * 127));
  return q((colour >> 16) & 0xff) * 16384 + q((colour >> 8) & 0xff) * 128 + q(colour & 0xff);
}

const _cardSide = new THREE.Vector3();
const _cardOut = new THREE.Vector3();
const _litColour = new THREE.Color();
const _darkColour = new THREE.Color();

/**
 * The crown as a few dozen branch cards: quads that each wear one branch off
 * the sheet, hundreds of leaves in the picture, rooted on the wood and pointing
 * out along it, each turning about its own axis to face the eye. The picture
 * carries the density; the geometry is two triangles a card. Coloured from the
 * crown field per pixel, the sheet's tone and wood on top.
 */
export function branchCards(rng: Rng, species: Species, clouds: readonly Cloud[], options: BranchCardsOptions): Part[] {
  if (clouds.length === 0) return [];
  const upward = options.upward ?? 0.25;
  const flag = options.flag ?? FIN_FLAG.leaf;
  const colour = options.colour ?? species.colour;
  const turn = options.turn ?? true;
  const cross = options.cross ?? false;
  const [near, far] = options.depth ?? [0.35, 0.7];
  const kind = (species.deciduous ? 1 : 0) + flag + (turn ? CANOPY_MODE.branch : CANOPY_MODE.pinned);
  const crown = crownOf(clouds);
  const tiles = options.tiles ?? SHEET_BROADLEAF;
  const perTwig = options.perTwig ?? 1;
  const bark = packBark(species.bark);
  _litColour.setHex(colour.lit);
  _darkColour.setHex(colour.shade);
  const aspect = aspectOf(tiles[0]);
  const total = options.twigs.length * perTwig * (cross ? 2 : 1) + options.count;
  const ranks = dealRanks(rng, total);
  const sink = leafSink();
  const root = new THREE.Vector3();
  const axis = new THREE.Vector3();

  /** One quad along `axis` from `root`; `flat` lays a pinned card's width across the bough instead of up it. */
  const card = (length: number, tile: number, rank: number, twig: Twig | null, flat = false): void => {
    const width = length * aspect;
    _cardSide.crossVectors(axis, UP);
    if (_cardSide.lengthSq() < 1e-6) _cardSide.set(1, 0, 0);
    _cardSide.normalize();
    // Upright: the width runs up the bough's own vertical plane, so the side view is full.
    if (!flat) _cardSide.crossVectors(_cardSide, axis).normalize();
    const weight = species.weight(root.x, root.y, root.z);
    const base = sink.positions.length / 3;
    for (const [u, v] of [
      [-width / 2, 0],
      [width / 2, 0],
      [width / 2, length],
      [-width / 2, length],
    ] as const) {
      const x = root.x + axis.x * v + _cardSide.x * u;
      const y = root.y + axis.y * v + _cardSide.y * u;
      const z = root.z + axis.z * v + _cardSide.z * u;
      sink.positions.push(x, y, z);
      sink.normals.push(axis.x, axis.y, axis.z);
      sink.colors.push(_litColour.r, _litColour.g, _litColour.b);
      sink.shade.push(_darkColour.r, _darkColour.g, _darkColour.b);
      sink.canopy.push(1, bark, rank, kind);
      sink.wind.push(weight, 0, length, twig ? packBranch(x, y, z, twig.family, twig.sub) : 0);
      sink.roots.push(root.x, root.y, root.z);
      sink.cards.push(u, v, tile);
      sink.crown.push(crown.centre.x, crown.centre.y, crown.centre.z, crown.radii.x);
      sink.axes.push(crown.radii.y, crown.radii.z);
    }
    sink.index.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };

  let f = 0;
  const tile = (): number => tiles[0] + rng.int(0, tiles[1] - 1);
  const along = new THREE.Vector3();
  for (const twig of options.twigs) {
    along.subVectors(twig.to, twig.from).normalize();
    for (let k = 0; k < perTwig; k++) {
      axis.copy(along);
      // The next card leans a little off the twig's line; every card starts on the wood.
      if (k > 0) axis.add(_cardOut.set(rng.range(-1, 1), rng.range(-0.3, 1), rng.range(-1, 1)).normalize().multiplyScalar(0.25)).normalize();
      root.copy(twig.from).lerp(twig.to, 0.04);
      // Rooted at the fork, because the tile's own first sixth is bare stem and
      // that is what covers the twig's base; and never shorter than the twig,
      // whose last sixth would otherwise stand out past the leaves as bare wood.
      const length = options.lengthOf ? options.lengthOf(twig) : Math.max(rng.range(options.length[0], options.length[1]), twig.from.distanceTo(twig.to) * 1.15);
      const which = tile();
      card(length, which, ranks[f++], twig);
      if (cross) card(length, which, ranks[f++], twig, true);
    }
  }
  for (let i = 0; i < options.count; i++) {
    let own = pickCloud(rng, clouds);
    for (let tries = 0; tries < 12; tries++) {
      inCloud(rng, own, upward, near, far, root);
      const depth = envelopeNormal(clouds, own, root, 0, _cardOut);
      // Wider than the sample, because a point inside one cloud can be deeper in a neighbour.
      if (depth >= near - 0.05 && depth <= far + 0.05) break;
      own = pickCloud(rng, clouds);
    }
    axis.set(rng.range(-1, 1), rng.range(-0.2, 1), rng.range(-1, 1)).normalize().multiplyScalar(0.5).addScaledVector(_cardOut, 0.8).normalize();
    card(rng.range(options.length[0], options.length[1]), tile(), ranks[f++], null);
  }
  return [{ geometry: leafGeometry(sink), color: colour.lit, layer: 'canopy', name: 'branches' }];
}

// --- finishing -------------------------------------------------------------------------

/** Rotates a canopy geometry about Y and scales it, roots, card offsets and the crown ellipsoid included. */
function placeCanopy(geometry: THREE.BufferGeometry, yaw: number, scale: number): void {
  if (yaw !== 0) geometry.rotateY(yaw);
  const yawC = Math.cos(yaw);
  const yawS = Math.sin(yaw);
  if (scale !== 1) {
    geometry.scale(scale, scale, scale);
    const cards = geometry.getAttribute(CARD_ATTRIBUTE);
    if (cards) {
      // x and y are metres; z is a sheet tile and stays.
      for (let i = 0; i < cards.count; i++) cards.setXY(i, cards.getX(i) * scale, cards.getY(i) * scale);
      cards.needsUpdate = true;
    }
    const axes = geometry.getAttribute(AXES_ATTRIBUTE);
    if (axes) {
      for (let i = 0; i < axes.count; i++) axes.setXY(i, axes.getX(i) * scale, axes.getY(i) * scale);
      axes.needsUpdate = true;
    }
  }
  const crown = geometry.getAttribute(CROWN_ATTRIBUTE);
  if (crown && (yaw !== 0 || scale !== 1)) {
    for (let i = 0; i < crown.count; i++) {
      const x = crown.getX(i);
      const y = crown.getY(i);
      const z = crown.getZ(i);
      // rotateY(θ) takes +Z toward +X: (x, z) → (x cos θ + z sin θ, −x sin θ + z cos θ).
      crown.setXYZW(i, (x * yawC + z * yawS) * scale, y * scale, (-x * yawS + z * yawC) * scale, crown.getW(i) * scale);
    }
    crown.needsUpdate = true;
  }
  const roots = geometry.getAttribute(ROOT_ATTRIBUTE);
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  for (let i = 0; i < roots.count; i++) {
    const x = roots.getX(i);
    const y = roots.getY(i);
    const z = roots.getZ(i);
    // rotateY(θ) takes +Z toward +X: (x, z) → (x cos θ + z sin θ, −x sin θ + z cos θ).
    roots.setXYZ(i, (x * c + z * s) * scale, y * scale, (-x * s + z * c) * scale);
  }
  roots.needsUpdate = true;
}

/** The tail every foliage builder shares: both geometries turned and scaled together, then finished. */
export function finishFoliage(parts: Part[], name: string, phase: number, yaw: number, scale: number): THREE.Mesh {
  const art = assemble(parts);
  const crown = assembleCanopy(parts);
  if (yaw !== 0) art.rotateY(yaw);
  if (scale !== 1) art.scale(scale, scale, scale);
  if (crown) placeCanopy(crown, yaw, scale);
  return finish(art, name, phase, undefined, crown);
}

/** A species' height weight: the smoothstep ramp the trunks use, to a power. */
export function heightWeight(height: number, curve = 1.6): Species['weight'] {
  return (_x, y) => {
    const t = Math.min(1, Math.max(0, y / Math.max(height, 1e-6)));
    return (t * t * (3 - 2 * t)) ** curve;
  };
}
