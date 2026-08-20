import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

// A chair. The back is the whole object, so the seat and legs are plain and the
// variation is spent upward. The back is dead vertical, and the back legs run all
// the way up through the seat to become its uprights.

type Back = 'slats' | 'spindles' | 'board';

export const chair: MeshBuilder = {
  name: 'chair',
  category: 'furniture',
  radius: 0.45,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const seatHeight = rng.range(0.42, 0.5);
    const seatWidth = rng.range(0.38, 0.46);
    const seatDepth = rng.range(0.36, 0.44);
    const seatThickness = rng.range(0.04, 0.06);
    const backHeight = rng.range(0.44, 0.66);
    const style: Back = rng.pick(['slats', 'spindles', 'board'] as const);

    const timber = rng.chance(0.55) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK;
    const frame = timber === PALETTE.TIMBER ? PALETTE.TIMBER_DARK : PALETTE.TIMBER;

    const seat = new THREE.BoxGeometry(seatWidth, seatThickness, seatDepth);
    seat.translate(0, seatHeight - seatThickness / 2, 0);
    parts.push({ geometry: seat, color: timber, sway: 0 });

    const legThickness = rng.range(0.035, 0.048);
    const halfW = seatWidth / 2 - legThickness * 0.7;
    const halfD = seatDepth / 2 - legThickness * 0.7;

    /**
     * Where a leg stops: inside the seat, not flush with the top of it. A leg
     * exactly `seatHeight` tall ends with its top cap in the same plane as the
     * seat's own top surface, and because the legs are inset that cap lies
     * entirely within it. Ending part-way into the thickness is also how the
     * joint really works — a leg goes into a seat.
     */
    const legTop = seatHeight - seatThickness * 0.4;

    // Front legs stop inside the seat.
    for (const sx of [-1, 1]) {
      const leg = new THREE.BoxGeometry(legThickness, legTop, legThickness);
      leg.translate(sx * halfW, legTop / 2, halfD);
      parts.push({ geometry: leg, color: frame, sway: 0 });
    }

    // Back legs continue up through the seat and become the back uprights.
    for (const sx of [-1, 1]) {
      const leg = new THREE.BoxGeometry(legThickness, legTop, legThickness);
      leg.translate(sx * halfW, legTop / 2, -halfD);
      parts.push({ geometry: leg, color: frame, sway: 0 });

      // Dead vertical, continuing the line of the leg below it, and run down into
      // the leg rather than balanced on top: sharing a footprint exactly would put
      // four identical corner vertices in one plane, which weld into edges
      // belonging to four triangles. Measured down from `legTop` rather than fixed,
      // because the leg stops short of the seat by an amount that varies with the
      // seat's thickness.
      const overlap = seatThickness * 0.4 + 0.02;
      const upright = new THREE.BoxGeometry(legThickness, backHeight + overlap, legThickness);
      upright.translate(sx * halfW, seatHeight + backHeight / 2 - overlap / 2, -halfD);
      parts.push({ geometry: upright, color: frame, sway: 0 });
    }

    // --- the back -----------------------------------------------------------
    // Everything in the back is placed by height above the seat, against the same
    // back plane as the uprights, so nothing ends up in front of its posts.
    const onBack = (geometry: THREE.BufferGeometry, above: number): void => {
      geometry.translate(0, seatHeight + above, -halfD);
    };

    if (style === 'board') {
      const boardHeight = backHeight * rng.range(0.4, 0.55);
      const board = new THREE.BoxGeometry(seatWidth * 0.86, boardHeight, 0.03);
      onBack(board, backHeight - boardHeight * 0.62);
      parts.push({ geometry: board, color: timber, sway: 0 });
    } else if (style === 'slats') {
      const count = rng.int(2, 3);
      for (let i = 0; i < count; i++) {
        const at = backHeight * (0.42 + (i / Math.max(count - 1, 1)) * 0.5);
        const slat = new THREE.BoxGeometry(seatWidth * 0.84, rng.range(0.06, 0.1), 0.026);
        onBack(slat, at);
        parts.push({ geometry: slat, color: timber, sway: 0 });
      }
    } else {
      const count = rng.int(3, 5);
      const spread = seatWidth * 0.72;
      // Spindles run the whole way, from a little inside the seat to the top rail.
      // Both ends are derived from where they have to land rather than from a
      // fraction of the back height.
      const railAt = backHeight * 0.93;
      const sink = 0.02;
      const spindleHeight = railAt + sink;
      for (let i = 0; i < count; i++) {
        const x = -spread / 2 + (i / (count - 1)) * spread;
        const spindle = new THREE.BoxGeometry(0.026, spindleHeight, 0.026);
        spindle.translate(x, spindleHeight / 2 - sink, 0);
        onBack(spindle, 0);
        parts.push({ geometry: spindle, color: frame, sway: 0 });
      }
      // A top rail capping the spindles, or they float.
      const rail = new THREE.BoxGeometry(seatWidth * 0.84, 0.055, 0.032);
      onBack(rail, railAt);
      parts.push({ geometry: rail, color: timber, sway: 0 });
    }

    // A stretcher between the front legs, low down, where the wear would be.
    if (rng.chance(0.6)) {
      const rail = new THREE.BoxGeometry(halfW * 2, 0.026, 0.026);
      rail.translate(0, seatHeight * rng.range(0.28, 0.36), halfD);
      parts.push({ geometry: rail, color: frame, sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'chair', 0);
  },
};
