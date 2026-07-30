import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

/**
 * A tree: tapered trunk, a few limbs, overlapping canopy lumps.
 *
 * Three lumps rather than one, because a single blob reads as a lollipop. They
 * are deliberately unequal and off-centre — a canopy is not symmetrical, and
 * the eye picks up symmetry before it picks up anything else.
 *
 * Sway weights are the point of this builder as much as the shape is. The
 * trunk ramps from rigid at the roots to loose at the crown, the limbs inherit
 * roughly their attachment height, and the canopy is near-maximum throughout
 * so leaves move as a mass. Getting this wrong is very visible: a uniform
 * weight makes the whole tree slide sideways like a sticker.
 */
export const tree: MeshBuilder = {
  name: 'tree',
  radius: 2.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(3.2, 4.6);
    const lean = rng.range(0, Math.PI * 2);
    const trunkTop = height * rng.range(0.55, 0.68);

    const trunk = new THREE.CylinderGeometry(
      rng.range(0.11, 0.17),
      rng.range(0.24, 0.34),
      trunkTop,
      6,
    );
    trunk.translate(0, trunkTop / 2, 0);
    parts.push({ geometry: trunk, color: PALETTE.BARK, sway: heightRamp(0, height, 2.2) });

    // Limbs, angled out and up from the upper third of the trunk.
    const limbs = rng.int(2, 4);
    for (let i = 0; i < limbs; i++) {
      const at = trunkTop * rng.range(0.6, 0.95);
      const length = rng.range(0.7, 1.3);
      const limb = new THREE.CylinderGeometry(0.045, 0.09, length, 4);
      limb.translate(0, length / 2, 0);
      limb.rotateZ(rng.range(0.5, 1.05));
      limb.rotateY(lean + (i / limbs) * Math.PI * 2 + rng.around(0, 0.4));
      limb.translate(0, at, 0);
      parts.push({
        geometry: limb,
        color: PALETTE.BARK_PALE,
        sway: heightRamp(0, height, 1.4),
      });
    }

    // Canopy. Detail 0 icosahedra — twenty faces is plenty at this scale, and
    // faceting is the look rather than something to be smoothed away.
    const lumps = rng.int(3, 5);
    const crown = trunkTop + rng.range(0.3, 0.7);
    for (let i = 0; i < lumps; i++) {
      const radius = rng.range(0.75, 1.35);
      const lump = new THREE.IcosahedronGeometry(radius, 0);
      lump.rotateX(rng.range(0, Math.PI));
      lump.rotateY(rng.range(0, Math.PI));
      // Squashed a little: canopies spread wider than they are tall.
      lump.scale(1, rng.range(0.72, 0.95), 1);
      const spread = rng.range(0, 0.95);
      const angle = lean + (i / lumps) * Math.PI * 2 + rng.around(0, 0.5);
      lump.translate(
        Math.cos(angle) * spread,
        crown + rng.around(0, 0.45),
        Math.sin(angle) * spread,
      );
      parts.push({
        geometry: lump,
        color: rng.chance(0.25) ? PALETTE.LEAF_DARK : PALETTE.LEAF,
        // Nearly free at the top, but not identical across lumps — a canopy
        // that moves as one rigid blob is the second-most obvious failure
        // after no sway at all.
        sway: rng.range(0.82, 1),
      });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'tree', rng() * Math.PI * 2);
  },
};
