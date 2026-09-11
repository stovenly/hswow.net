import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { FinishName } from './finishes';
import { PALETTE, shade } from './palette';
import type { Rng } from './random';

// The jewellery vocabulary the accessory builders share: metals, stones, the
// head a stone sits in, chain and beads along a curve, and a buckle. Metres.

export interface Metal {
  readonly name: string;
  readonly color: number;
  readonly finish?: FinishName;
}

const METALS: readonly Metal[] = [
  { name: 'Iron', color: PALETTE.IRON },
  { name: 'Bronze', color: PALETTE.BRONZE, finish: 'bronze' },
  { name: 'Silver', color: shade(PALETTE.CHROME, 0.8), finish: 'chrome' },
  { name: 'Gold', color: PALETTE.GOLD, finish: 'gilt' },
];

/** Two draws: the row, then its shade. */
export function rollMetal(rng: Rng): Metal {
  const picked = rng.pick(METALS);
  return { ...picked, color: shade(picked.color, rng.range(0.92, 1.06)) };
}

export type Cut = 'faceted' | 'cabochon';

export interface Stone {
  readonly name: string;
  readonly color: number;
  readonly finish: FinishName;
  readonly cut: Cut;
}

const STONES: readonly Omit<Stone, 'cut'>[] = [
  { name: 'Quartz', color: shade(PALETTE.WOOL, 1.15), finish: 'quartz' },
  { name: 'Opal', color: shade(PALETTE.STONE_PALE, 1.08), finish: 'iridescent' },
  { name: 'Labradorite', color: PALETTE.IRON_DARK, finish: 'labradorite' },
  { name: 'Moonstone', color: shade(PALETTE.STONE_PALE, 0.92), finish: 'moonsheen' },
  { name: 'Sunstone', color: shade(PALETTE.BRONZE, 0.8), finish: 'sunstone' },
  { name: 'Pearl', color: shade(PALETTE.WOOL, 1.22), finish: 'nacreous' },
];

/** Two draws: the row, then the cut. A pearl is never faceted. */
export function rollStone(rng: Rng): Stone {
  const row = rng.pick(STONES);
  const faceted = rng.chance(0.5) && row.finish !== 'nacreous';
  return { ...row, cut: faceted ? 'faceted' : 'cabochon' };
}

/** Girdle radius `size` at y = 0, table up. A faceted stone reaches below the girdle; a cabochon does not. */
export function stone(size: number, cut: Cut): THREE.BufferGeometry {
  if (cut === 'cabochon') {
    const dome = new THREE.SphereGeometry(size, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
    dome.scale(1, 0.62, 1);
    return dome;
  }
  const crownH = size * 0.6;
  const crown = new THREE.CylinderGeometry(size * 0.55, size, crownH, 8);
  crown.translate(0, crownH / 2 - size * 0.02, 0);
  const depth = size * 1.1;
  const pavilion = new THREE.CylinderGeometry(size * 0.97, 0, depth, 8, 1, true);
  pavilion.translate(0, -depth / 2, 0);
  return merged([crown, pavilion]);
}

/** The cup a stone sits in: a cylinder standing on y = 0 with a lip round its top. */
export function bezel(radius: number, height: number): THREE.BufferGeometry {
  const cup = new THREE.CylinderGeometry(radius, radius * 0.94, height, 10);
  cup.translate(0, height / 2, 0);
  const lipH = height * 0.3;
  const lip = new THREE.CylinderGeometry(radius * 1.08, radius * 1.08, lipH, 10);
  lip.translate(0, height - lipH / 2, 0);
  return merged([cup, lip]);
}

/** A tube along the curve. */
export function chain(
  curve: THREE.Curve<THREE.Vector3>,
  radius: number,
  closed = false,
): THREE.BufferGeometry {
  const segments = Math.min(160, Math.max(24, Math.round(curve.getLength() / 0.003)));
  return new THREE.TubeGeometry(curve, segments, radius, 6, closed);
}

/** The thread a bead string hangs on: a fine tube in the beads' own colour, darkened. */
export const STRING_RADIUS = 0.0006;

/** Beads along the curve, alternating the two sizes. */
export function beads(
  curve: THREE.Curve<THREE.Vector3>,
  count: number,
  sizes: readonly [number, number],
): THREE.BufferGeometry {
  const out: THREE.BufferGeometry[] = [];
  const point = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const bead = new THREE.IcosahedronGeometry(sizes[i % 2], 0);
    curve.getPointAt(i / count, point);
    bead.translate(point.x, point.y, point.z);
    out.push(bead);
  }
  return merged(out);
}

/** A frame lying flat on y = 0, its tongue along +Z, wide enough for a strap `width` across. */
export function buckle(width: number, round: boolean): THREE.BufferGeometry {
  const bar = width * 0.12;
  const across = width * 1.15;
  const along = width * 0.8;
  const out: THREE.BufferGeometry[] = [];
  if (round) {
    // TorusGeometry lies in XY with its axis on +Z; rotateX(π/2) takes +Z to −Y, so it lies flat.
    const frame = new THREE.TorusGeometry(across / 2 - bar / 2, bar / 2, 6, 20);
    frame.rotateX(Math.PI / 2);
    frame.scale(1, 1, along / across);
    frame.translate(0, bar / 2, 0);
    out.push(frame);
  } else {
    for (const sx of [-1, 1]) {
      const side = new THREE.BoxGeometry(bar, bar, along);
      side.translate(sx * (across - bar) / 2, bar / 2, 0);
      out.push(side);
    }
    for (const sz of [-1, 1]) {
      const end = new THREE.BoxGeometry(across, bar, bar);
      end.translate(0, bar / 2, sz * (along - bar) / 2);
      out.push(end);
    }
  }
  const tongue = new THREE.BoxGeometry(bar * 0.7, bar * 0.7, along * 0.95);
  tongue.translate(0, bar * 0.65, along * 0.12);
  out.push(tongue);
  return merged(out);
}

function merged(pieces: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const flat = pieces.map((piece) => (piece.index === null ? piece : piece.toNonIndexed()));
  const out = mergeGeometries(flat, false);
  for (const piece of pieces) piece.dispose();
  for (const piece of flat) piece.dispose();
  if (!out) throw new Error('worn: pieces did not merge');
  return out;
}
