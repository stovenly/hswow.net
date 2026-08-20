import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A bed: a frame, a mattress displaced along its length, a blanket stopping short
// of the head, and a pillow bunched at one end. Which end the head is at is rolled
// once and every other feature keyed off it. Built lying along Z, head toward −Z.
export const bed: MeshBuilder = {
  name: 'bed',
  category: 'furniture',
  radius: 1.3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(0.9, 1.25);
    const length = rng.range(1.85, 2.15);
    const frameHeight = rng.range(0.26, 0.4);
    const railThickness = rng.range(0.07, 0.1);

    const timber = rng.chance(0.55) ? PALETTE.TIMBER_DARK : PALETTE.BARK;
    const linen = rng.pick([PALETTE.CLOTH, PALETTE.WOOL, PALETTE.HIDE_PALE]);
    const blanketColor = rng.pick([
      PALETTE.HIDE,
      PALETTE.LEAF_DARK,
      PALETTE.RUST,
      PALETTE.STONE_DARK,
    ]);

    // -1 puts the head at -Z, +1 at +Z. Everything below reads this.
    const head = rng.chance(0.5) ? -1 : 1;

    // --- frame ---------------------------------------------------------------
    for (const sx of [-1, 1]) {
      const rail = new THREE.BoxGeometry(railThickness, frameHeight * 0.55, length);
      rail.translate((sx * (width - railThickness)) / 2, frameHeight * 0.72, 0);
      parts.push({ geometry: rail, color: timber, sway: 0 });
    }

    // Four posts, at the corners.
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const postHeight = frameHeight * (sz === head ? 1.05 : 0.98);
        const leg = new THREE.BoxGeometry(railThickness, postHeight, railThickness);
        leg.translate(
          (sx * (width - railThickness)) / 2,
          postHeight / 2,
          (sz * (length - railThickness)) / 2,
        );
        parts.push({ geometry: leg, color: timber, sway: 0 });
      }
    }

    // Headboard, taller than the footboard. Some beds have both, some only the
    // one — a plank bed in a poor room would not waste timber on a footboard.
    const headboardHeight = rng.range(0.34, 0.62);
    const headboard = new THREE.BoxGeometry(width, headboardHeight, 0.055);
    headboard.translate(0, frameHeight + headboardHeight / 2 - 0.04, (head * length) / 2);
    parts.push({ geometry: headboard, color: timber, sway: 0 });

    if (rng.chance(0.55)) {
      const footHeight = headboardHeight * rng.range(0.3, 0.5);
      const footboard = new THREE.BoxGeometry(width, footHeight, 0.05);
      footboard.translate(0, frameHeight + footHeight / 2 - 0.04, (-head * length) / 2);
      parts.push({ geometry: footboard, color: timber, sway: 0 });
    }

    // --- mattress ------------------------------------------------------------
    // Segmented along its length, each segment at its own height, so the top sags
    // and rises the way a straw tick does. One box reads as a shelf.
    const mattressTop = frameHeight + rng.range(0.14, 0.2);
    const segments = 6;
    const segmentLength = (length - 0.1) / segments;
    for (let i = 0; i < segments; i++) {
      const z = -length / 2 + 0.05 + (i + 0.5) * segmentLength;
      // Fullest a third of the way from the head, where nobody has sat.
      const along = head < 0 ? i / (segments - 1) : 1 - i / (segments - 1);
      const loft = 1 - 0.22 * Math.sin(along * Math.PI) * rng.range(0.4, 1);
      const height = (mattressTop - frameHeight * 0.72) * loft;
      // Overlapped by a few percent rather than butted end to end: exactly abutting
      // segments share their corner vertices, and those edges come out belonging to
      // four triangles instead of two.
      const slab = new THREE.BoxGeometry(
        width - railThickness * 1.4,
        height,
        segmentLength * 1.04,
      );
      slab.translate(0, frameHeight * 0.72 + height / 2, z);
      parts.push({ geometry: slab, color: linen, sway: 0 });
    }

    // --- blanket -------------------------------------------------------------
    // Covers the foot end and stops short of the pillow, which is what a bed
    // that has been slept in and roughly made looks like.
    const coverLength = length * rng.range(0.6, 0.75);
    const coverSegments = 4;
    const coverSegment = coverLength / coverSegments;
    // Measured from the foot, running toward the head.
    const foot = (-head * length) / 2;
    for (let i = 0; i < coverSegments; i++) {
      const z = foot + head * ((i + 0.5) * coverSegment);
      const thickness = rng.range(0.045, 0.075);
      const slab = new THREE.BoxGeometry(
        width - railThickness * 0.6,
        thickness,
        coverSegment * 1.02,
      );
      slab.translate(0, mattressTop + thickness / 2 - 0.01, z);
      parts.push({ geometry: slab, color: blanketColor, sway: 0 });
    }

    // The turned-down edge, a lip across the blanket's head end.
    const lip = new THREE.BoxGeometry(width - railThickness * 0.6, 0.05, 0.09);
    lip.translate(0, mattressTop + 0.05, foot + head * coverLength);
    parts.push({ geometry: lip, color: shade(blanketColor, 1.18), sway: 0 });

    // --- pillow --------------------------------------------------------------
    if (rng.chance(0.85)) {
      const pillowLength = rng.range(0.26, 0.36);
      const pillow = new THREE.BoxGeometry(
        width * rng.range(0.5, 0.72),
        rng.range(0.09, 0.14),
        pillowLength,
      );
      pillow.translate(
        rng.around(0, width * 0.1),
        mattressTop + 0.06,
        (head * (length / 2 - pillowLength * 0.8)),
      );
      pillow.rotateY(rng.around(0, 0.18));
      parts.push({ geometry: pillow, color: shade(linen, 1.12), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'bed', 0);
  },
};
