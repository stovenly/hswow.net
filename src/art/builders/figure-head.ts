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
 * The hood rides `head`, the cowl over the shoulders `neck`, the mask `face`,
 * and anything sprung off its sides `face0…faceN`. LIFE.md §3.2.
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

/** Most pieces any rack is cut into: `face0` … `face{FACE_PARTS − 1}`. */
export const FACE_PARTS = 7;

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

const BARK = 0x6b543c;
const BARK_PALE = 0x8a7050;
const WOOD = 0xc2a06a;
const HEART = 0xa87c4a;
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
  board: number;
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
    board: WOOD,
    harness: 'battens',
    width: 2.05,
    height: 2.05,
    depth: 0.4,
  },
  // A burr: rings crowded tight and knots budding all round them.
  burr: {
    outline: OUTLINES.disc,
    relief: { vault: 0.78, border: 0.24 },
    board: shade(WOOD, 0.9),
    harness: 'battens',
    width: 2.1,
    height: 2.05,
    depth: 0.46,
  },
  // A round with a forked bough grown out over it.
  bough: {
    outline: OUTLINES.disc,
    relief: { vault: 0.7, border: 0.28 },
    board: shade(HEART, 1.08),
    harness: 'battens',
    width: 2,
    height: 2,
    depth: 0.4,
  },
  // Boards lapped one over the next, beaded, notched and pegged.
  lapped: {
    outline: OUTLINES.plank,
    relief: { vault: 0.68, border: 0 },
    board: WOOD,
    harness: 'ledgers',
    height: 2.3,
    depth: 0.34,
  },
  // A staved board inside a crown of standing twigs.
  crown: {
    outline: OUTLINES.plank,
    relief: { vault: 0.7, border: 0.14 },
    board: shade(BARK_PALE, 0.92),
    harness: 'ledgers',
    height: 2.15,
    depth: 0.36,
  },
  // A gable board under a rack of antlers.
  antler: {
    outline: OUTLINES.gable,
    relief: { border: 0.16 },
    board: shade(WOOD, 0.86),
    harness: 'sockets',
    height: 2.35,
  },
  // A palmate rack: two broad blades with tines off their outer edges.
  palm: {
    outline: OUTLINES.gable,
    relief: { border: 0.18 },
    board: shade(HEART, 0.94),
    harness: 'sockets',
    height: 2.3,
  },
  // Briar canes wound out of both temples, thorned, swaying as it talks.
  briar: {
    outline: OUTLINES.oval,
    relief: { border: 0.2 },
    board: BARK,
    harness: 'sockets',
  },
  // A wheel of withy standing round the whole board, spoked to its rim.
  wheel: {
    outline: OUTLINES.oval,
    relief: { border: 0.22 },
    board: shade(BARK_PALE, 1.05),
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

  const board = design.board;
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
    back: shade(board, 0.6),
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
  const dogtooth = (v: number, color: number, across = 0.1): void => {
    const r = boardW * across;
    const n = Math.max(2, Math.floor((1.6 * mask.halfAt(v)) / (Math.sqrt(3) * r * 1.12)));
    for (let i = 0; i < n; i++) {
      const s = (((i + 0.5) / n) * 2 - 1) * 0.8;
      // CylinderGeometry's axis is +Y; rotateX(π/2) lays the triangle flat on
      // the board with its thickness running out of it.
      const tooth = new THREE.CylinderGeometry(r, r, size * 0.08, 3);
      tooth.rotateX(Math.PI / 2);
      tooth.rotateZ(i % 2 ? 0 : Math.PI);
      on(tooth, s, v, size * 0.04, i % 2 ? color : shade(color, 1.14));
    }
  };
  /** Something sprung out of the board's side, on its own bone. */
  const spring = (i: number, s: number, v: number, make: (p: THREE.Vector3) => THREE.BufferGeometry[], colors: readonly number[]): void => {
    const p = at(s, v, size * 0.02);
    const name = `face${i}`;
    bones.push({ name, parent: 'head', at: [p.x, p.y, p.z] });
    make(p).forEach((g, k) => push(g, colors[k % colors.length], name));
  };

  // --- the back -----------------------------------------------------------
  //
  // Furniture only: battens, a bar to grip in the teeth, the anchors the head
  // cord is knotted through, and that cord running round the hood to a knot at
  // the nape — which is what a villager walking away shows. Nothing here is
  // ornament, so the front is never in question.
  {
    const dark = shade(board, 0.5);
    if (design.harness === 'ledgers') {
      for (const v of [0.24, 0.5, 0.76] as const) {
        behind(new THREE.BoxGeometry(boardW * 0.86, size * 0.12, size * 0.08), 0, v, size * 0.03, dark);
      }
    } else if (design.harness === 'sockets') {
      for (const s of [-0.62, 0.62] as const) {
        behind(new THREE.CylinderGeometry(size * 0.11, size * 0.13, size * 0.14, 6), s, 0.9, size * 0.04, dark);
      }
      behind(new THREE.BoxGeometry(boardW * 0.8, size * 0.11, size * 0.08), 0, 0.62, size * 0.03, dark);
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
      for (const s of [-1, 1] as const) {
        const p = hoodAt(0.78, Math.PI + s * 0.4, size * 0.03);
        push(new THREE.IcosahedronGeometry(size * 0.09, 0).translate(p.x, p.y, p.z), dark, 'head');
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
      dogtooth(0.22, shade(WOOD, 0.9));
      dogtooth(0.44, shade(WOOD, 1.12));
      dogtooth(0.66, shade(WOOD, 0.96));
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
      dogtooth(0.2, shade(HEART, 0.9));
      dogtooth(0.4, shade(HEART, 1.14));
      dogtooth(0.6, shade(HEART, 0.98));
      // A palm out of each temple: a flat blade lofted along an arc sweeping
      // up and out, widest two thirds along, with tines rising off its outer
      // edge and a brow tine forward beneath.
      for (const side of [-1, 1] as const) {
        const root = at(side * 0.8, 0.84, 0);
        /** A point along the sweep, `u` from the root (0) to the tip (1). */
        const along = (u: number): THREE.Vector3 =>
          new THREE.Vector3(
            root.x + side * size * (0.24 + 1.05 * u),
            root.y + size * (0.1 + 1.0 * u - 0.24 * u * u),
            root.z - size * (0.08 + 0.28 * u),
          );
        const blade: Station[] = [];
        for (let i = 0; i <= 5; i++) {
          const u = i / 5;
          const p = along(u);
          const next = along(Math.min(1, u + 0.08));
          const prev = along(Math.max(0, u - 0.08));
          blade.push({
            at: [p.x, p.y, p.z],
            rx: size * (0.09 + 0.4 * Math.sin(Math.PI * Math.pow(u, 0.75))),
            ry: size * 0.032,
            axis: [next.x - prev.x, next.y - prev.y, next.z - prev.z],
          });
        }
        parts.push({ geometry: loft(blade, 6, { start: true, end: true }), color: HORN, bone: 'face' });
        // Five tines off the blade's outer edge, each longer toward the tip.
        for (let i = 0; i < 5; i++) {
          const u = 0.24 + i * 0.18;
          const p = along(u);
          const w = size * (0.09 + 0.4 * Math.sin(Math.PI * Math.pow(u, 0.75)));
          const from = new THREE.Vector3(p.x + side * w * 0.5, p.y + w * 0.55, p.z);
          stick(from, new THREE.Vector3(from.x + side * size * 0.1, from.y + size * (0.24 + i * 0.06), from.z - size * 0.05), size * 0.042, size * 0.016, i % 2 ? shade(HORN, 1.12) : HORN);
        }
        stick(root, new THREE.Vector3(root.x + side * size * 0.16, root.y + size * 0.1, root.z + size * 0.36), size * 0.05, size * 0.022, shade(HORN, 0.9));
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
      // Six canes wound out of the temples on their own bones, thorned along
      // their length, so they sway when it talks.
      for (let i = 0; i < 6; i++) {
        const side = i % 2 ? 1 : -1;
        const rank = Math.floor(i / 2);
        spring(i, side * 0.94, 0.74 - rank * 0.22, (p) => {
          const made: THREE.BufferGeometry[] = [];
          // Low and shallow, so the canes reach out from the temple rather
          // than standing up over the board and crossing one another.
          let a = -0.34 + rank * 0.36;
          let q = p.clone();
          for (let k = 0; k < 4; k++) {
            const reach = size * (0.46 - k * 0.05);
            const next = new THREE.Vector3(
              q.x + side * Math.cos(a) * reach,
              q.y + Math.sin(a) * reach,
              q.z + Math.sin(a * 1.4) * reach * 0.4,
            );
            const dir = new THREE.Vector3().subVectors(next, q);
            const len = dir.length();
            const cane = new THREE.CylinderGeometry(size * (0.036 - k * 0.005), size * (0.045 - k * 0.005), len, 5);
            cane.translate(0, len / 2, 0);
            cane.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()));
            cane.translate(q.x, q.y, q.z);
            made.push(cane);
            // A thorn at each joint, leaning out from the cane.
            const thorn = new THREE.CylinderGeometry(0, size * 0.035, size * 0.13, 4);
            thorn.rotateZ(side * 1.1);
            thorn.translate(next.x, next.y, next.z);
            made.push(thorn);
            a += 0.24;
            q = next;
          }
          return made;
        }, [i % 2 ? shade(BARK, 1.2) : BARK, shade(BARK_PALE, 1.15)]);
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
