import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// An anvil on its stump. Mounted rather than bare: an anvil is knee-high on its
// own and belongs at knuckle height, and the block is what puts the face at about
// 0.75 m, which is where the sound emitter is placed from. The silhouette is a
// wide foot, a waist pinched well in, a long face and a horn.
export const anvil: MeshBuilder = {
  name: 'anvil',
  category: 'objects',
  radius: 0.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const stumpHeight = rng.range(0.42, 0.56);
    const stumpRadius = rng.range(0.2, 0.26);
    const faceLength = rng.range(0.44, 0.58);
    const faceWidth = rng.range(0.12, 0.16);
    const iron = shade(PALETTE.IRON, rng.range(0.88, 1.06));

    // Slightly wider at the foot than the top, and eight-sided: six reads as a
    // hexagonal post, twelve as a lathe turning, and eight as sawn timber.
    const stump = new THREE.CylinderGeometry(stumpRadius, stumpRadius * 1.12, stumpHeight, 8);
    stump.translate(0, stumpHeight / 2, 0);
    parts.push({ geometry: stump, color: PALETTE.TIMBER_DARK, sway: 0 });

    // The three iron masses. Each is a percent or two off its neighbour's
    // dimensions so no two boxes share an exact edge — a shared edge belongs to
    // four faces instead of two and z-fights wherever it shows.
    const footHeight = rng.range(0.055, 0.08);
    const foot = new THREE.BoxGeometry(faceLength * 0.62, footHeight, faceWidth * 1.5);
    foot.translate(0, stumpHeight + footHeight / 2, 0);
    parts.push({ geometry: foot, color: shade(iron, 0.88), sway: 0 });

    // Pinched hard. The waist is what the eye reads as "anvil" — it is the only
    // part of the shape that is not doing structural work, and it is the only
    // part that is unmistakable.
    const waistHeight = rng.range(0.1, 0.15);
    const waist = new THREE.BoxGeometry(faceLength * 0.34, waistHeight, faceWidth * 0.78);
    waist.translate(0, stumpHeight + footHeight + waistHeight / 2, 0);
    parts.push({ geometry: waist, color: shade(iron, 0.94), sway: 0 });

    const bodyHeight = rng.range(0.09, 0.13);
    const bodyBase = stumpHeight + footHeight + waistHeight;
    const body = new THREE.BoxGeometry(faceLength, bodyHeight, faceWidth);
    body.translate(0, bodyBase + bodyHeight / 2, 0);
    // The face proper is the one polished surface on a working anvil, and the
    // sides are not. Painted brighter as a function of height rather than as a
    // separate part, which would cost a coincident plane across the top.
    parts.push({
      geometry: body,
      color: (_x, y) => (y > bodyBase + bodyHeight * 0.85 ? shade(iron, 1.22) : iron),
      sway: 0,
    });

    // The horn: a cone laid on its side off one end. Rotated about Z, which
    // turns three's +Y default into +X.
    const hornLength = rng.range(0.16, 0.24);
    const horn = new THREE.ConeGeometry(faceWidth * 0.46, hornLength, 6);
    horn.rotateZ(-Math.PI / 2);
    horn.translate(faceLength / 2 + hornLength / 2 - 0.01, bodyBase + bodyHeight * 0.55, 0);
    parts.push({ geometry: horn, color: shade(iron, 1.06), sway: 0 });

    // And the heel at the other end, squared off. Shorter than the horn, so
    // which way the anvil is facing is legible from across a yard.
    const heel = new THREE.BoxGeometry(rng.range(0.07, 0.11), bodyHeight * 0.86, faceWidth * 0.92);
    heel.translate(-faceLength / 2 - 0.03, bodyBase + bodyHeight * 0.5, 0);
    parts.push({ geometry: heel, color: shade(iron, 0.98), sway: 0 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'anvil', 0);
  },
};

/** How high above the anvil's base the face sits, for placing the strike sound. The middle of the rolled range. */
export const ANVIL_FACE_HEIGHT = 0.78;
