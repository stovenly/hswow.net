import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A fowl. The only two-legged animal in the kit, so it gets its own builder.
 *
 * A chicken is not a small quadruped — the body is tipped up at the back and
 * the legs come out of the middle of it rather than the corners, which is why
 * scaling any four-legged plan down never produces one.
 *
 * Three details do the identifying, and none of them is the body: the tail
 * cocked up behind, the comb on top, and the beak. Take those away and it is a
 * lump on two sticks.
 *
 * Not solid — small enough that colliding with it would be more annoying than
 * convincing.
 */
export const poultry: MeshBuilder = {
  name: 'poultry',
  category: 'animals',
  radius: 0.35,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const body = rng.range(0.16, 0.23);
    const legLength = rng.range(0.09, 0.16);
    const plumage = rng.pick([PALETTE.FOWL, PALETTE.HIDE_PALE, PALETTE.HIDE_DARK, PALETTE.CLOTH]);
    const belly = legLength + body * 0.75;

    // Body, tipped nose-down so the tail end rides high.
    const torso = new THREE.IcosahedronGeometry(body, 0);
    torso.scale(0.8, 0.95, 1.25);
    torso.rotateX(rng.range(0.15, 0.35));
    torso.translate(0, belly, 0);
    parts.push({ geometry: torso, color: plumage, sway: 0 });

    // Head, forward and up on a stub of neck.
    const headSize = body * rng.range(0.42, 0.55);
    const headAt = new THREE.Vector3(0, belly + body * rng.range(0.75, 1.05), body * 0.6);

    const neck = new THREE.CylinderGeometry(body * 0.2, body * 0.28, body * 0.55, 5);
    neck.rotateX(-0.5);
    neck.translate(0, belly + body * 0.5, body * 0.42);
    parts.push({ geometry: neck, color: plumage, sway: 0 });

    const head = new THREE.IcosahedronGeometry(headSize, 0);
    head.translate(headAt.x, headAt.y, headAt.z);
    parts.push({ geometry: head, color: plumage, sway: 0 });

    const beak = new THREE.ConeGeometry(headSize * 0.35, headSize * 0.8, 4);
    beak.rotateX(Math.PI / 2);
    beak.translate(headAt.x, headAt.y - headSize * 0.15, headAt.z + headSize * 0.9);
    parts.push({ geometry: beak, color: PALETTE.MARKER_YELLOW, sway: 0 });

    // Comb: a row of small blades along the crown, shrinking toward the back.
    const teeth = rng.int(2, 4);
    for (let i = 0; i < teeth; i++) {
      const t = i / Math.max(teeth - 1, 1);
      const blade = new THREE.ConeGeometry(headSize * 0.14, headSize * (0.7 - t * 0.3), 3);
      blade.scale(1, 1, 0.4);
      blade.translate(headAt.x, headAt.y + headSize * 0.95, headAt.z - t * headSize * 0.7);
      parts.push({ geometry: blade, color: PALETTE.COMB, sway: 0.4 });
    }

    // Wattle, sometimes — a small lobe under the beak.
    if (rng.chance(0.6)) {
      const wattle = new THREE.IcosahedronGeometry(headSize * 0.22, 0);
      wattle.scale(0.5, 1.1, 0.7);
      wattle.translate(headAt.x, headAt.y - headSize * 0.75, headAt.z + headSize * 0.5);
      parts.push({ geometry: wattle, color: PALETTE.COMB, sway: 0.3 });
    }

    // Tail: a fan of flat feathers, cocked up and back.
    const feathers = rng.int(3, 5);
    for (let i = 0; i < feathers; i++) {
      const spread = (i / Math.max(feathers - 1, 1) - 0.5) * 0.8;
      const feather = new THREE.ConeGeometry(body * 0.2, body * rng.range(0.9, 1.4), 3);
      feather.scale(1, 1, 0.35);
      feather.translate(0, body * 0.55, 0);
      feather.rotateX(rng.range(-1.1, -0.7));
      feather.rotateY(spread);
      feather.translate(0, belly + body * 0.35, -body * 0.85);
      parts.push({ geometry: feather, color: plumage, sway: 0.45 });
    }

    // Legs, out of the middle of the body rather than its corners.
    for (const side of [-1, 1]) {
      // Up to the body's centre, not its underside: the torso is an ellipsoid
      // and curves away above the leg positions, so a leg cut to the lowest
      // point of the belly ends in mid-air.
      const legTotal = belly;
      const leg = new THREE.CylinderGeometry(body * 0.055, body * 0.05, legTotal, 4);
      leg.translate(0, legTotal / 2, 0);
      leg.rotateZ(side * rng.range(0, 0.12));
      leg.translate(side * body * 0.24, 0, rng.around(0, body * 0.1));
      parts.push({ geometry: leg, color: PALETTE.MARKER_YELLOW, sway: 0 });

      const foot = new THREE.ConeGeometry(body * 0.13, body * 0.09, 3);
      foot.rotateX(Math.PI);
      foot.translate(side * body * 0.24, body * 0.04, body * 0.06);
      parts.push({ geometry: foot, color: PALETTE.MARKER_YELLOW, sway: 0 });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'poultry', rng() * Math.PI * 2);
  },
};
