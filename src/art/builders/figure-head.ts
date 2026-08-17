import * as THREE from 'three';
import type { Part } from '../assemble';
import type { BoneSpec } from '../rig';
import type { Rng } from '../random';
import { loft, type Station } from '../loft';
import { shade } from '../palette';
import { BOARD, OUTLINES, carveMask, profileAt, type Register, type Relief } from '../mask';

/**
 * The villagers' heads: a plain hood, and a carved mask (`art/mask`) worn over
 * it. Three families — a round cut across the grain, a board built from parts,
 * and a board carrying a rack — and permutations of each.
 *
 * Every mask is furnished on the back with its harness: battens, a grip bar and
 * cord anchors. The front carries all the ornament and everything fixed on, so
 * which way it faces is never in doubt.
 *
 * The hood rides `head`, the cowl over the shoulders `neck` and the mask
 * `face`, rack and all. LIFE.md §3.2.
 */

export type HeadKind =
  // A round cut across the grain.
  | 'round'
  | 'burr'
  | 'bough'
  // Built from parts.
  | 'lapped'
  | 'crown'
  // Carrying a rack.
  | 'antler'
  | 'palm'
  | 'briar'
  | 'wheel';

export const HEAD_KINDS: readonly HeadKind[] = [
  'round',
  'burr',
  'bough',
  'lapped',
  'crown',
  'antler',
  'palm',
  'briar',
  'wheel',
];

export interface HeadOptions {
  rng: Rng;
  /** Where the hood sits: the top of the torso. */
  base: number;
  /** Half-width of the shoulders, for the collar that covers the join. */
  shoulderR: number;
  /** How much covered neck stands between the collar and the hood. */
  neck: number;
  /** How wide the hood is; it stands about twice this tall. */
  size: number;
  cloth: number;
  accent: number;
  leather: number;
  metal: number;
  side: 1 | -1;
}

export interface BuiltHead {
  /** Top of the head, for the collision cylinder. */
  crown: number;
  /** Where the voice comes from — the middle of the mask. */
  faceY: number;
}

/**
 * The timber a mask is cut from. One is drawn per villager, so the same design
 * turns up in birch and in walnut — four tones from the same log, in the same
 * order of lightness whichever it is, so a design that asks for its darkest
 * gets the darkest of *that* wood.
 *
 * Antler, cord and iron are not wood and do not move with it.
 */
interface Timber {
  wood: number;
  heart: number;
  pale: number;
  bark: number;
}

const TIMBERS: readonly Timber[] = [
  // Birch: nearly white, with a fawn heart.
  { wood: 0xe0d2b4, heart: 0xc6ac84, pale: 0xac9a7c, bark: 0x82735d },
  // Ash.
  { wood: 0xc2a06a, heart: 0xa87c4a, pale: 0x8a7050, bark: 0x6b543c },
  // Oak.
  { wood: 0xb08d5c, heart: 0x8f6f42, pale: 0x7a6448, bark: 0x5a472f },
  // Mahogany: red under the brown.
  { wood: 0x9a5c3c, heart: 0x7d4530, pale: 0x6d4632, bark: 0x5b3826 },
  // Walnut. Nothing here goes darker than this: the back of a board is
  // shaded down from it, and a hollow that reads as a hole is not wanted.
  { wood: 0x7d6249, heart: 0x674e39, pale: 0x5c4a3c, bark: 0x4b3c2c },
];

const HORN = 0xbfae8e;
const LEATHER_CORD = 0x6a4a30;
const IRON = 0x5c5a56;
const HOOD_CLOTH = 0x4a4234;

/**
 * The hood, the same under every mask: a bell drawn in at the crown, narrower
 * than any board so the mask's outline stands clear of it.
 */
const HOOD: readonly [number, number][] = [[0, 0.84], [0.26, 0.98], [0.6, 1], [0.86, 0.82], [1, 0.44]];
const HOOD_HEIGHT = 2.05;
const HOOD_SIDES = 12;
const HOOD_DEPTH = 0.86;
const HOOD_WIDTH = 0.74;

/** Where the front's registers end, chin to crown. */
const REGISTER_TOPS = [0.16, 0.3, 0.5, 0.64, 0.8, 1];
/** One board, so the registers barely differ; the planes do the work. */
const PLAIN = [0.94, 0.97, 1, 0.96, 1.04, 1];

const registers = (board: number, shades: readonly number[]): Register[] =>
  REGISTER_TOPS.map((to, i) => ({ to, color: shade(board, shades[i]) }));

/** Which back furniture a design takes. */
type Harness = 'battens' | 'ledgers' | 'sockets';

interface Design {
  outline: readonly [number, number][];
  relief: Partial<Relief>;
  /** Which of the timber's four tones the board is cut in. */
  board: (t: Timber) => number;
  harness: Harness;
  shades?: readonly number[];
  /** The rim and the hollow back, as multipliers on the board. */
  rim?: number;
  hood?: number;
  width?: number;
  height?: number;
  depth?: number;
  thick?: number;
}

const DESIGNS: Record<HeadKind, Design> = {
  // A round cut across the grain, its heartwood rings left standing.
  round: {
    outline: OUTLINES.disc,
    relief: { vault: 0.7, border: 0.3 },
    board: (w) => w.wood,
    harness: 'battens',
    width: 2.05,
    height: 2.05,
    depth: 0.4,
  },
  // A burr: rings crowded tight and knots budding all round them.
  burr: {
    outline: OUTLINES.disc,
    relief: { vault: 0.78, border: 0.24 },
    board: (w) => shade(w.wood, 0.9),
    harness: 'battens',
    width: 2.1,
    height: 2.05,
    depth: 0.46,
  },
  // A round with a forked bough grown out over it.
  bough: {
    outline: OUTLINES.disc,
    relief: { vault: 0.7, border: 0.28 },
    board: (w) => shade(w.heart, 1.08),
    harness: 'battens',
    width: 2,
    height: 2,
    depth: 0.4,
  },
  // Boards lapped one over the next, beaded, notched and pegged.
  lapped: {
    outline: OUTLINES.plank,
    relief: { vault: 0.68, border: 0 },
    board: (w) => w.wood,
    harness: 'ledgers',
    height: 2.3,
    depth: 0.34,
  },
  // A staved board inside a crown of standing twigs.
  crown: {
    outline: OUTLINES.plank,
    relief: { vault: 0.7, border: 0.14 },
    board: (w) => shade(w.pale, 0.92),
    harness: 'ledgers',
    height: 2.15,
    depth: 0.36,
  },
  // A gable board under a rack of antlers.
  antler: {
    outline: OUTLINES.gable,
    relief: { border: 0.16 },
    board: (w) => shade(w.wood, 0.86),
    harness: 'sockets',
    height: 2.35,
  },
  // A palmate rack: two broad blades with tines off their outer edges.
  palm: {
    outline: OUTLINES.gable,
    relief: { border: 0.18 },
    board: (w) => shade(w.heart, 0.94),
    harness: 'sockets',
    height: 2.3,
  },
  // Briar canes wound out of both temples, thorned, swaying as it talks.
  briar: {
    outline: OUTLINES.oval,
    relief: { border: 0.2 },
    board: (w) => w.bark,
    harness: 'sockets',
  },
  // A wheel of withy standing round the whole board, spoked to its rim.
  wheel: {
    outline: OUTLINES.oval,
    relief: { border: 0.22 },
    board: (w) => shade(w.pale, 1.05),
    harness: 'sockets',
    width: 1.7,
    height: 2,
  },
};

export function buildHead(
  kind: HeadKind,
  options: HeadOptions,
  parts: Part[],
  bones: BoneSpec[],
): BuiltHead {
  const { base, size, neck, cloth, leather, shoulderR } = options;
  const design = DESIGNS[kind];
  const H = size * HOOD_HEIGHT;
  const R = (t: number): number => size * HOOD_WIDTH * profileAt(HOOD, t);
  const Y = (t: number): number => base + t * H;

  const push = (g: THREE.BufferGeometry, color: number, bone = 'face'): void => {
    parts.push({ geometry: g, color, bone });
  };

  // The neck is three overlapping solids, each centred on the pivot it turns
  // about — collar on `torso`, gorget on `neck`, hood on `head` — so no surface
  // is split across two bones and the join cannot open.
  {
    const neckPivot = base - neck;
    const collar: Station[] = [
      { at: [0, neckPivot - size * 0.5, 0], rx: shoulderR * 0.95, ry: shoulderR * 0.8, axis: [0, 1, 0] },
      { at: [0, neckPivot - size * 0.2, 0], rx: shoulderR * 0.78, ry: shoulderR * 0.66, axis: [0, 1, 0] },
      { at: [0, neckPivot + size * 0.12, 0], rx: size * 0.62, ry: size * 0.56, axis: [0, 1, 0] },
    ];
    parts.push({ geometry: loft(collar, HOOD_SIDES, { start: true, end: true }), color: shade(leather, 0.9), bone: 'torso' });

    const gorget: Station[] = [
      { at: [0, neckPivot - size * 0.14, 0], rx: size * 0.26, ry: size * 0.24, axis: [0, 1, 0] },
      { at: [0, neckPivot, 0], rx: size * 0.44, ry: size * 0.4, axis: [0, 1, 0] },
      { at: [0, neckPivot + neck * 0.55, 0], rx: size * 0.42, ry: size * 0.38, axis: [0, 1, 0] },
      { at: [0, base + size * 0.06, 0], rx: size * 0.4, ry: size * 0.36, axis: [0, 1, 0] },
    ];
    parts.push({ geometry: loft(gorget, HOOD_SIDES, { start: true, end: true }), color: cloth, bone: 'neck' });
    const wrap: Station[] = [
      { at: [0, neckPivot + neck * 0.3, 0], rx: size * 0.47, ry: size * 0.43, axis: [0, 1, 0] },
      { at: [0, neckPivot + neck * 0.66, 0], rx: size * 0.46, ry: size * 0.42, axis: [0, 1, 0] },
    ];
    parts.push({ geometry: loft(wrap, HOOD_SIDES, { start: true, end: true }), color: shade(cloth, 0.82), bone: 'neck' });
  }

  // Carried below its own base, so the head can turn without opening the join.
  {
    const ts = new Set<number>([0, 1]);
    for (const [t] of HOOD) ts.add(t);
    for (let t = 0.08; t < 1; t += 0.08) ts.add(Math.round(t * 1000) / 1000);
    const stations: Station[] = [...ts]
      .sort((a, b) => a - b)
      .map((t) => ({ at: [0, Y(t), 0] as const, rx: R(t), ry: R(t) * HOOD_DEPTH, axis: [0, 1, 0] as const }));
    stations.unshift({ at: [0, base - size * 0.34, 0], rx: R(0) * 0.86, ry: R(0) * HOOD_DEPTH * 0.86, axis: [0, 1, 0] });
    parts.push({
      geometry: loft(stations, HOOD_SIDES, { start: true, end: true }),
      color: design.hood ?? HOOD_CLOTH,
      bone: 'head',
    });
  }

  // The log this one was cut from. Everything wooden on the mask comes out of
  // it, so a walnut board does not carry birch ornament.
  const timber = options.rng.pick(TIMBERS);
  const { wood: WOOD, heart: HEART, pale: BARK_PALE, bark: BARK } = timber;
  const board = design.board(timber);
  const boardW = size * (design.width ?? 1.86);
  const boardH = size * (design.height ?? 2.2);
  const mask = carveMask({
    width: boardW,
    height: boardH,
    depth: size * (design.depth ?? 0.5),
    thick: size * (design.thick ?? 0.11),
    outline: design.outline,
    relief: { ...BOARD, ...design.relief },
    registers: registers(board, design.shades ?? PLAIN),
    rim: shade(board, design.rim ?? 0.72),
    back: shade(board, 0.68),
  });

  // rotateX(−lean) takes +Y toward −Z: the crown sits back of the chin.
  const lean = 0.08;
  const faceT = 0.5;
  const faceY = Y(faceT);
  // The board's base plane stands off far enough that the hood's front sits
  // inside its hollow instead of cutting through the worked face.
  const faceZ = R(faceT) * HOOD_DEPTH * 0.82;
  const place = new THREE.Matrix4().makeRotationX(-lean);
  place.setPosition(0, faceY, faceZ);
  bones.push({ name: 'face', parent: 'head', at: [0, faceY, faceZ] });
  for (const piece of mask.pieces) {
    piece.geometry.applyMatrix4(place);
    push(piece.geometry, piece.color);
  }

  /** A point on the front of the board, in the villager's own space. */
  const at = (s: number, v: number, out = 0): THREE.Vector3 => mask.at(s, v, out).applyMatrix4(place);
  /** The same point on the hollow back. */
  const rear = (s: number, v: number, out = 0): THREE.Vector3 => mask.behind(s, v, out).applyMatrix4(place);
  /** A piece built facing +Z, laid at a point on the front. */
  const on = (g: THREE.BufferGeometry, s: number, v: number, out: number, color: number, bone = 'face'): void => {
    const p = at(s, v, out);
    g.rotateX(-lean);
    g.translate(p.x, p.y, p.z);
    push(g, color, bone);
  };
  /** The same, on the back. */
  const behind = (g: THREE.BufferGeometry, s: number, v: number, out: number, color: number): void => {
    const p = rear(s, v, out);
    g.rotateX(-lean);
    g.translate(p.x, p.y, p.z);
    push(g, color);
  };
  /** A tapered stick from one point to another. */
  const stick = (a: THREE.Vector3, b: THREE.Vector3, r0: number, r1: number, color: number, bone = 'face'): void => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const g = new THREE.CylinderGeometry(r1, r0, len, 5);
    g.translate(0, len / 2, 0);
    // CylinderGeometry's axis is +Y; this turns +Y onto the segment.
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
    g.translate(a.x, a.y, a.z);
    push(g, color, bone);
  };
  /** A point in the board's own plane, as (s, v), from an offset off centre. */
  const spot = (x: number, y: number): [number, number] => {
    const v = 0.5 + y / boardH;
    return [x / Math.max(1e-4, mask.halfAt(v)), v];
  };
  /** A closed convex lens facing +Z. */
  const lens = (w: number, h: number, d: number, detail = 1): THREE.BufferGeometry => {
    const g = new THREE.IcosahedronGeometry(1, detail);
    g.scale(w / 2, h / 2, d);
    return g;
  };

  // --- ornament, all of it raised off the board ---------------------------

  /** Concentric rings about a point on the board. */
  const rings = (cs: number, cv: number, n: number, first: number, step: number, color: number, arc = Math.PI * 2): void => {
    for (let i = 0; i < n; i++) {
      const ring = new THREE.TorusGeometry(first - i * step, size * 0.06, 4, 16, arc);
      on(ring, cs, cv, size * (0.03 + i * 0.01), i % 2 ? shade(color, 1.12) : shade(color, 0.88));
    }
  };
  /**
   * A band of flat triangles standing proud, alternately point up and down.
   * `across` is a tooth's circumradius as a fraction of the board's width; the
   * count follows from how wide the board is at that height, so they are the
   * same size on every row and never crowd into one another.
   */
  // Every tooth sits off the board the same way — all lighter on a dark board,
  // all darker on a pale one — so the band reads whatever the timber. `away`
  // is how far the row steps from the board; alternate teeth step further.
  const boardLum = (((board >> 16) & 0xff) * 0.3 + ((board >> 8) & 0xff) * 0.59 + (board & 0xff) * 0.11) / 255;
  const dogtooth = (v: number, away: number, across = 0.1): void => {
    const r = boardW * across;
    const n = Math.max(2, Math.floor((1.6 * mask.halfAt(v)) / (Math.sqrt(3) * r * 1.12)));
    const off = (k: number): number => shade(board, boardLum > 0.5 ? 1 - k : 1 + k * 1.6);
    for (let i = 0; i < n; i++) {
      const s = (((i + 0.5) / n) * 2 - 1) * 0.8;
      // CylinderGeometry's axis is +Y; rotateX(π/2) lays the triangle flat on
      // the board with its thickness running out of it.
      const tooth = new THREE.CylinderGeometry(r, r, size * 0.08, 3);
      tooth.rotateX(Math.PI / 2);
      tooth.rotateZ(i % 2 ? 0 : Math.PI);
      on(tooth, s, v, size * 0.04, i % 2 ? off(away) : off(away + 0.12));
    }
  };
  // --- the back -----------------------------------------------------------
  //
  // Furniture only: battens, a bar to grip in the teeth, the anchors the head
  // cord is knotted through, and that cord running round the hood to a knot at
  // the nape — which is what a villager walking away shows. Nothing here is
  // ornament, so the front is never in question.
  {
    const dark = shade(board, 0.62);
    if (design.harness === 'ledgers') {
      for (const v of [0.24, 0.5, 0.76] as const) {
        behind(new THREE.BoxGeometry(boardW * 0.86, size * 0.12, size * 0.08), 0, v, size * 0.03, dark);
      }
    } else if (design.harness === 'sockets') {
      // A cross-brace, corner to corner, one batten lapped over the other.
      for (const s of [-1, 1] as const) {
        const brace = new THREE.BoxGeometry(boardW * 0.98, size * 0.12, size * 0.08);
        // rotateZ(θ) takes +X toward +Y: the batten rakes up to the far corner.
        brace.rotateZ(s * 0.66);
        behind(brace, 0, 0.55, size * (s > 0 ? 0.03 : 0.09), dark);
      }
    } else {
      behind(new THREE.BoxGeometry(size * 0.13, boardH * 0.74, size * 0.08), 0, 0.5, size * 0.03, dark);
      behind(new THREE.BoxGeometry(boardW * 0.78, size * 0.13, size * 0.08), 0, 0.66, size * 0.05, dark);
    }
    behind(new THREE.BoxGeometry(boardW * 0.34, size * 0.1, size * 0.12), 0, 0.3, size * 0.07, LEATHER_CORD);
    for (const s of [-0.86, 0.86] as const) {
      behind(new THREE.TorusGeometry(size * 0.07, size * 0.025, 4, 8), s, 0.7, size * 0.03, IRON);
    }

    const hoodAt = (t: number, bearing: number, proud = 0): THREE.Vector3 =>
      new THREE.Vector3(
        Math.sin(bearing) * (R(t) + proud),
        Y(t),
        Math.cos(bearing) * (R(t) * HOOD_DEPTH + proud),
      );
    const nape = hoodAt(0.56, Math.PI, size * 0.04);
    for (const s of [-1, 1] as const) {
      const anchor = rear(s * 0.86, 0.7, size * 0.02);
      const flank = hoodAt(0.64, (s * Math.PI) / 2, size * 0.04);
      stick(anchor, flank, size * 0.035, size * 0.035, LEATHER_CORD, 'head');
      stick(flank, nape, size * 0.035, size * 0.04, LEATHER_CORD, 'head');
    }
    push(new THREE.IcosahedronGeometry(size * 0.12, 1).translate(nape.x, nape.y, nape.z), shade(LEATHER_CORD, 1.2), 'head');
    if (design.harness === 'ledgers') {
      for (const t of [0.3, 0.72] as const) {
        const p = hoodAt(t, Math.PI, size * 0.03);
        push(new THREE.BoxGeometry(size * 0.5, size * 0.1, size * 0.09).translate(p.x, p.y, p.z), dark, 'head');
      }
    } else if (design.harness === 'sockets') {
      // A cross of raking straps, matching the brace on the mask's own back.
      // Two bosses up here and the cord's knot below them read as a face.
      const p = hoodAt(0.76, Math.PI, size * 0.03);
      for (const s of [-1, 1] as const) {
        const strap = new THREE.BoxGeometry(size * 0.66, size * 0.09, size * 0.08);
        // rotateZ(θ) takes +X toward +Y: the strap rakes across the back.
        strap.rotateZ(s * 0.7);
        push(strap.translate(p.x, p.y, p.z + s * size * 0.02), dark, 'head');
      }
    } else {
      const spine: Station[] = [0.18, 0.5, 0.82].map((t) => {
        const p = hoodAt(t, Math.PI, size * 0.02);
        return { at: [p.x, p.y, p.z] as const, rx: size * 0.09, ry: size * 0.06, axis: [0, 1, 0] as const };
      });
      parts.push({ geometry: loft(spine, 5, { start: true, end: true }), color: dark, bone: 'head' });
    }
  }

  switch (kind) {
    case 'round': {
      rings(0, 0.5, 4, boardW * 0.4, boardW * 0.09, HEART);
      break;
    }
    case 'burr': {
      // Rings crowded tight at the centre, and knots budding round them, each
      // a ring of its own with a dark eye.
      rings(0, 0.5, 5, boardW * 0.3, boardW * 0.055, HEART);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.4;
        const r = boardW * (0.42 + 0.06 * (i % 2));
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.95;
        const bud = boardW * (0.1 + 0.03 * (i % 3));
        on(lens(bud * 2.2, bud * 2, size * 0.1), ...spot(x, y), size * 0.03, shade(WOOD, 1.1));
        on(new THREE.TorusGeometry(bud, size * 0.045, 4, 10), ...spot(x, y), size * 0.06, shade(HEART, 0.88));
        on(new THREE.IcosahedronGeometry(bud * 0.45, 0), ...spot(x, y), size * 0.08, shade(HEART, 1.16));
      }
      break;
    }
    case 'bough': {
      rings(0, 0.5, 3, boardW * 0.34, boardW * 0.1, shade(HEART, 0.9));
      // A limb out of each side of the head, spreading wide, twigs off every
      // joint. Nothing grows off the front of the board.
      for (const side of [-1, 1] as const) {
        const root = at(side * 0.98, 0.62, size * 0.02);
        let p = root;
        let thick = size * 0.11;
        for (const [dx, dy, dz] of [[0.52, 0.26, -0.08], [1.06, 0.64, -0.18], [1.58, 0.9, -0.26]] as const) {
          const q = new THREE.Vector3(root.x + side * size * dx, root.y + size * dy, root.z + size * dz);
          stick(p, q, thick, thick * 0.74, side > 0 ? BARK : shade(BARK, 1.12));
          for (const lean of [0.6, -0.3] as const) {
            stick(q, new THREE.Vector3(q.x + side * size * 0.3, q.y + size * (0.32 + lean * 0.22), q.z + size * lean * 0.5), thick * 0.5, size * 0.018, shade(BARK, 1.2));
          }
          thick *= 0.74;
          p = q;
        }
      }
      break;
    }
    case 'lapped': {
      // Each board laps the one below, so every course stands a little prouder.
      for (let i = 0; i < 6; i++) {
        const v = 0.14 + i * 0.145;
        const long = boardW * (0.96 - 0.5 * Math.abs(v - 0.5));
        const plank = new THREE.BoxGeometry(long, boardH * 0.17, size * 0.08);
        plank.rotateX(-0.16);
        on(plank, 0, v, size * 0.05, i % 2 ? shade(WOOD, 1.1) : shade(WOOD, 0.9));
        // A bead run along the lapping edge, and the ends chamfered off it.
        const bead = new THREE.CylinderGeometry(size * 0.035, size * 0.035, long * 0.98, 5);
        bead.rotateZ(Math.PI / 2);
        on(bead, 0, v - 0.055, size * 0.11, shade(WOOD, 1.2));
        for (const s of [-1, 1] as const) {
          const chamfer = new THREE.BoxGeometry(boardW * 0.07, boardH * 0.15, size * 0.09);
          chamfer.rotateZ(s * 0.3);
          on(chamfer, s * (long / boardW) * 0.92, v, size * 0.05, shade(WOOD, 0.82));
          on(new THREE.IcosahedronGeometry(size * 0.05, 0), s * 0.66, v, size * 0.1, IRON);
        }
        // A notch cut in the face of every second board.
        if (i % 2) {
          for (let j = 0; j < 3; j++) {
            const notch = new THREE.CylinderGeometry(size * 0.06, size * 0.06, size * 0.06, 3);
            notch.rotateX(Math.PI / 2);
            on(notch, (j - 1) * 0.34, v, size * 0.1, shade(WOOD, 0.8));
          }
        }
      }
      break;
    }
    case 'crown': {
      // The staves, worked only between the two withies and outside them, so
      // nothing runs under a strap.
      for (let i = 0; i < 5; i++) {
        const s = (i - 2) / 2.6;
        const stave = new THREE.BoxGeometry(boardW * 0.15, boardH * (0.86 - 0.2 * s * s), size * 0.08);
        on(stave, s, 0.5, size * 0.04, i % 2 ? shade(BARK_PALE, 1.14) : shade(BARK_PALE, 0.88));
        const bead = new THREE.CylinderGeometry(size * 0.028, size * 0.028, boardH * 0.24, 5);
        on(bead, s, 0.51, size * 0.09, shade(BARK_PALE, i % 2 ? 1.24 : 0.98));
        for (const [lean, v] of [[1, 0.44], [-1, 0.58]] as const) {
          const nick = new THREE.CylinderGeometry(size * 0.055, size * 0.055, size * 0.05, 3);
          nick.rotateX(Math.PI / 2);
          nick.rotateZ(lean > 0 ? 0 : Math.PI);
          on(nick, s, v, size * 0.09, shade(BARK, 1.1));
        }
        for (const v of [0.14, 0.86] as const) {
          on(new THREE.IcosahedronGeometry(size * 0.045, 0), s, v, size * 0.07, LEATHER_CORD);
        }
      }
      // Twigs stood all round the rim from one shoulder over to the other,
      // and two withies binding them in.
      for (let i = 0; i < 13; i++) {
        const turn = -1.15 + (i / 12) * 2.3;
        const s = Math.sin(turn) * 0.95;
        const v = 0.52 + 0.46 * Math.cos(turn);
        const root = at(s, v, size * 0.02);
        const len = size * (0.72 - 0.16 * Math.abs(turn));
        const tip = new THREE.Vector3(
          root.x + Math.sin(turn) * len * 0.75,
          root.y + Math.cos(turn) * len,
          root.z - len * 0.2,
        );
        stick(root, tip, size * 0.045, size * 0.02, i % 2 ? BARK : shade(BARK, 1.18));
      }
      for (const v of [0.3, 0.72] as const) {
        on(new THREE.BoxGeometry(boardW * 1.02, size * 0.08, size * 0.08), 0, v, size * 0.12, LEATHER_CORD);
      }
      break;
    }
    case 'antler': {
      dogtooth(0.22, 0.3);
      dogtooth(0.44, 0.18);
      dogtooth(0.66, 0.3);
      // A beam back and out of each top corner, with two tines forward off it.
      for (const side of [-1, 1] as const) {
        const root = at(side * 0.66, 0.94, 0);
        const mid = new THREE.Vector3(root.x + side * size * 0.34, root.y + size * 0.5, root.z - size * 0.24);
        const tip = new THREE.Vector3(mid.x + side * size * 0.3, mid.y + size * 0.52, mid.z - size * 0.1);
        stick(root, mid, size * 0.075, size * 0.055, HORN);
        stick(mid, tip, size * 0.055, size * 0.03, shade(HORN, 1.08));
        stick(mid, new THREE.Vector3(mid.x + side * size * 0.06, mid.y + size * 0.3, mid.z + size * 0.3), size * 0.045, size * 0.02, HORN);
        stick(root, new THREE.Vector3(root.x + side * size * 0.1, root.y + size * 0.34, root.z + size * 0.24), size * 0.04, size * 0.02, shade(HORN, 0.92));
      }
      break;
    }
    case 'palm': {
      dogtooth(0.2, 0.3);
      dogtooth(0.4, 0.18);
      dogtooth(0.6, 0.3);
      // An elk's rack, built the way one is: a burr at the top corner, one
      // main beam out of it sweeping up, out and back over the head, and six
      // points off that beam — brow and bez forward over the face, trez off
      // the side, then the royal, which is the longest, off the top where the
      // beam turns back, and two more at the end. Points grow forward and
      // slightly outward, and every one curls up over its length.
      const BEAM: readonly [number, number, number][] = [
        [0, 0, 0], [0.26, 0.29, -0.09], [0.48, 0.58, -0.29], [0.6, 0.83, -0.58], [0.63, 1.02, -0.9], [0.56, 1.14, -1.21],
      ];
      const TINES: readonly { at: number; dir: readonly [number, number, number]; len: number; curl: number }[] = [
        // The brow tine leaves once the beam is clear of the board's corner.
        { at: 0.55, dir: [0.34, 0.2, 0.92], len: 0.62, curl: 0.34 },
        { at: 0.85, dir: [0.4, 0.42, 0.82], len: 0.7, curl: 0.34 },
        { at: 1.8, dir: [0.8, 0.48, 0.36], len: 0.56, curl: 0.3 },
        { at: 2.8, dir: [0.26, 0.86, 0.44], len: 0.94, curl: 0.26 },
        { at: 3.8, dir: [0.08, 0.94, 0.32], len: 0.7, curl: 0.22 },
        { at: 4.6, dir: [-0.12, 0.92, 0.36], len: 0.48, curl: 0.2 },
      ];
      for (const side of [-1, 1] as const) {
        // Rooted behind the board, so the burr and the first stretch of beam
        // are hidden by it and nothing sits over the worked face.
        const root = rear(side * 0.62, 0.88, size * 0.1);
        /** A point along the beam, `u` in beam-point units. */
        const beamAt = (u: number): THREE.Vector3 => {
          const i = Math.max(0, Math.min(BEAM.length - 2, Math.floor(u)));
          const f = u - i;
          const a = BEAM[i];
          const b = BEAM[i + 1];
          return new THREE.Vector3(
            root.x + side * size * (a[0] + (b[0] - a[0]) * f),
            root.y + size * (a[1] + (b[1] - a[1]) * f),
            root.z + size * (a[2] + (b[2] - a[2]) * f),
          );
        };
        // The burr: a swelling on the first stretch of beam, so it sits square
        // to however the beam leaves the board.
        stick(root, beamAt(0.34), size * 0.17, size * 0.12, shade(HORN, 0.8));
        for (let k = 0; k < BEAM.length - 1; k++) {
          stick(beamAt(k), beamAt(k + 1), size * (0.115 - k * 0.016), size * (0.1 - k * 0.016), k % 2 ? shade(HORN, 1.06) : HORN);
        }
        for (const tine of TINES) {
          const from = beamAt(tine.at);
          const out = new THREE.Vector3(side * tine.dir[0], tine.dir[1], tine.dir[2]).normalize();
          const mid = from.clone().addScaledVector(out, size * tine.len * 0.55);
          const up = out.clone().setY(out.y + tine.curl).normalize();
          const tip = mid.clone().addScaledVector(up, size * tine.len * 0.5);
          stick(from, mid, size * 0.072, size * 0.052, shade(HORN, 1.02));
          stick(mid, tip, size * 0.052, size * 0.02, shade(HORN, 1.14));
        }
      }
      break;
    }
    case 'briar': {
      // A cane bent into a ring across the front, thorned round it, with a
      // briar rose opened at its middle.
      on(new THREE.TorusGeometry(boardW * 0.4, size * 0.045, 4, 18), 0, 0.5, size * 0.05, shade(BARK, 1.18));
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.2;
        const thorn = new THREE.CylinderGeometry(0, size * 0.04, size * 0.16, 4);
        // CylinderGeometry's axis is +Y; rotateZ(a − π/2) turns the tip out at a.
        thorn.rotateZ(a - Math.PI / 2);
        on(thorn, ...spot(Math.cos(a) * boardW * 0.4, Math.sin(a) * boardH * 0.4), size * 0.06, shade(BARK_PALE, 1.1));
      }
      for (let i = 0; i < 5; i++) {
        const petal = lens(size * 0.2, size * 0.34, size * 0.07);
        petal.translate(0, size * 0.16, 0);
        petal.rotateZ((i / 5) * Math.PI * 2);
        on(petal, 0, 0.5, size * 0.05, i % 2 ? shade(BARK_PALE, 1.22) : shade(BARK_PALE, 1.06));
      }
      on(new THREE.IcosahedronGeometry(size * 0.09, 1), 0, 0.5, size * 0.09, shade(HEART, 1.12));
      // Eight canes rooted along the rim, four a side, with the crown left
      // clear. Each leaves the rim nearly on its side and turns up as it goes,
      // so it reaches out and then climbs. Every cane leans further out than
      // the one inside it and they all straighten by the same factor, so the
      // order across the fan is kept at every height and no two can cross.
      for (let i = 0; i < 8; i++) {
        const t = (i < 4 ? i - 4 : i - 3) / 4;
        const turn = t * 1.16;
        let q = at(Math.sin(turn) * 0.93, 0.5 + 0.46 * Math.cos(turn), size * 0.03);
        const lean = turn * 1.25;
        const depth = size * (0.06 - 0.03 * (i % 3));
        for (let k = 0; k < 4; k++) {
          // From +Y, out at `a`: the cane starts out sideways and comes up.
          const a = lean * (1 - 0.2 * k);
          const reach = size * (0.44 - 0.07 * k);
          const next = new THREE.Vector3(q.x + Math.sin(a) * reach, q.y + Math.cos(a) * reach, q.z + depth * 0.5);
          stick(q, next, size * (0.046 - k * 0.006), size * (0.038 - k * 0.006), i % 2 ? shade(BARK, 1.2) : BARK);
          // A thorn at each joint, square out of the cane, alternate sides.
          const thorn = new THREE.CylinderGeometry(0, size * 0.035, size * 0.13, 4);
          // rotateZ(−a − π/2) takes +Y to (cos a, −sin a): square to the cane.
          thorn.rotateZ(k % 2 ? -a - Math.PI / 2 : Math.PI / 2 - a);
          thorn.translate(next.x, next.y, next.z);
          push(thorn, shade(BARK_PALE, 1.15), 'face');
          q = next;
        }
      }
      break;
    }
    case 'wheel': {
      // Two rims standing round the whole board and a hub at its middle, all
      // in one plane off the board's face — so the spokes, struck in that same
      // plane, meet them.
      const spokes = 10;
      const plane = mask.at(0, 0.5).z + size * 0.05;
      /** A point in that plane, at `k` of the rim's own ellipse at angle `a`. */
      const rim = (a: number, k: number): THREE.Vector3 =>
        new THREE.Vector3(Math.cos(a) * boardW * k, Math.sin(a) * boardH * k, plane).applyMatrix4(place);
      for (const [k, tube, tone] of [[0.86, 0.042, 1.14], [0.68, 0.034, 0.88], [0.24, 0.05, 1.2]] as const) {
        const ring = new THREE.TorusGeometry(boardW * k, size * tube, 4, 22);
        ring.scale(1, boardH / boardW, 1);
        on(ring, 0, 0.5, size * 0.05, shade(BARK_PALE, tone));
      }
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2 + Math.PI / spokes;
        stick(rim(a, 0.24), rim(a, 0.86), size * 0.03, size * 0.026, i % 2 ? shade(BARK_PALE, 1.1) : BARK_PALE);
        const bind = rim(a, 0.68);
        push(new THREE.IcosahedronGeometry(size * 0.05, 0).translate(bind.x, bind.y, bind.z), LEATHER_CORD);
      }
      break;
    }
  }

  return { crown: base + H * 1.02, faceY };
}
