import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A scarecrow: a cross of poles in old clothes, standing in a crop — a
// person-shaped object that is supposed not to move, which is what gives a field
// a human silhouette at no cost in credibility.
//
// The cross has to read before the clothes do, so the arm pole is long — wider
// than the coat by a good margin — and stays bare at the tips. It leans, about
// its foot. The clothes hang rather than being worn: the coat is a slab standing
// off the pole, wider at the hem than the shoulder, and it is the one part that
// sways, only below the arms, because that is where cloth is free.
export const scarecrow: MeshBuilder = {
  name: 'scarecrow',
  category: 'objects',
  radius: 0.7,
  // Not solid. It is a stick in a field and it belongs to the ground cover, not
  // to the collider — being stopped by a scarecrow is being stopped by a coat.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const stand = rng.range(1.55, 1.95);
    const armY = stand * rng.range(0.6, 0.68);
    const armSpan = rng.range(0.95, 1.25);
    const pole = rng.range(0.05, 0.07);
    const wood = shade(PALETTE.TIMBER_DARK, rng.range(0.88, 1.05));
    const cloth = shade(rng.chance(0.4) ? PALETTE.CLOTH_DEEP : PALETTE.CLOTH, rng.range(0.82, 1.05));
    const straw = shade(PALETTE.GRASS_DRY, rng.range(1, 1.15));

    const lean = rng.range(0.04, 0.13);
    const facing = rng.range(0, Math.PI * 2);

    // Built plumb about its own foot, then leaned and turned as one — so the
    // whole thing tips together and the foot stays where it was driven in.
    const body: THREE.BufferGeometry[] = [];
    const tint: (number | ((x: number, y: number, z: number) => number))[] = [];
    const bend: (number | ((x: number, y: number, z: number) => number))[] = [];
    const add = (
      geometry: THREE.BufferGeometry,
      color: number,
      sway: number | ((x: number, y: number, z: number) => number) = 0,
    ): void => {
      body.push(geometry);
      tint.push(color);
      bend.push(sway);
    };

    // The upright, driven well in.
    const post = new THREE.CylinderGeometry(pole * 0.85, pole, stand + 0.25, 5);
    post.translate(0, (stand + 0.25) / 2 - 0.25, 0);
    add(post, wood);

    // The arm pole, lashed across. Long, and bare at the tips.
    const arm = new THREE.CylinderGeometry(pole * 0.8, pole * 0.8, armSpan, 5);
    arm.rotateZ(Math.PI / 2);
    arm.rotateX(rng.around(0, 0.07));
    arm.translate(0, armY, 0);
    add(arm, shade(wood, 1.06));

    // The lashing, which is what says the two are tied rather than merged.
    const bind = new THREE.CylinderGeometry(pole * 1.35, pole * 1.35, 0.075, 6);
    bind.rotateX(Math.PI / 2);
    bind.rotateZ(rng.around(0, 0.2));
    bind.translate(0, armY, 0);
    add(bind, shade(PALETTE.HIDE, 0.9));

    // The coat: a slab standing off the pole, wider at the hem. Two faces and
    // the sides, so there is a silhouette from every bearing.
    const coatTop = armY + rng.range(0.02, 0.08);
    const coatLong = rng.range(0.6, 0.85);
    const shoulder = rng.range(0.34, 0.44);
    const hem = shoulder * rng.range(1.15, 1.4);
    const hangs = (_x: number, y: number): number =>
      Math.min(1, Math.max(0, (coatTop - y) / Math.max(coatLong, 0.1))) * 0.8;

    for (let i = 0; i < 3; i++) {
      const t = i / 2;
      const width = shoulder + (hem - shoulder) * t;
      const panel = new THREE.BoxGeometry(width, coatLong / 2.4, rng.range(0.13, 0.19));
      panel.rotateY(rng.around(0, 0.1));
      panel.translate(rng.around(0, 0.02), coatTop - coatLong * (t * 0.42 + 0.12), 0);
      add(panel, shade(cloth, rng.range(0.9, 1.1)), hangs);
    }

    // Sleeves, hanging off the arms toward the ends but stopping short of them.
    for (const side of [-1, 1]) {
      const sleeve = new THREE.BoxGeometry(armSpan * rng.range(0.24, 0.32), 0.12, 0.12);
      sleeve.rotateZ(side * rng.range(0.05, 0.16));
      sleeve.translate(side * armSpan * rng.range(0.24, 0.3), armY - 0.03, 0);
      add(sleeve, shade(cloth, rng.range(0.85, 1)), 0.35);
    }

    // The head: a sack of straw, tied at the neck and set a little askew. Never
    // square on the post — a straight head reads as a lamp.
    const headR = rng.range(0.13, 0.17);
    const head = new THREE.IcosahedronGeometry(headR, 0);
    head.scale(1, rng.range(1.05, 1.25), rng.range(0.9, 1.05));
    head.rotateY(rng.range(0, Math.PI * 2));
    head.rotateZ(rng.around(0, 0.3));
    head.translate(rng.around(0, 0.03), stand - headR * 0.7, rng.around(0, 0.03));
    add(head, straw);

    const neck = new THREE.CylinderGeometry(headR * 0.55, headR * 0.55, 0.05, 6);
    neck.translate(0, stand - headR * 1.75, 0);
    add(neck, shade(PALETTE.HIDE, 0.95));

    // A hat, most of the time. It is the second silhouette cue after the cross
    // and it costs eight triangles.
    if (rng.chance(0.65)) {
      const brim = new THREE.CylinderGeometry(headR * 1.7, headR * 1.85, 0.03, 8);
      const crown = new THREE.CylinderGeometry(headR * 0.85, headR * 0.95, headR * 0.9, 8);
      const tiltX = rng.around(0, 0.22);
      const tiltZ = rng.around(0, 0.22);
      const at = stand + headR * 0.35;
      brim.rotateX(tiltX);
      brim.rotateZ(tiltZ);
      brim.translate(0, at, 0);
      crown.rotateX(tiltX);
      crown.rotateZ(tiltZ);
      crown.translate(0, at + headR * 0.45, 0);
      const felt = shade(PALETTE.GRASS_DRY, rng.range(0.78, 0.95));
      add(brim, felt);
      add(crown, felt);
    }

    // Straw out of the cuffs and the hem — what a stuffed figure looks like
    // where the stuffing gets out.
    for (let i = rng.int(3, 6); i > 0; i--) {
      const out = rng.range(0.07, 0.16);
      const wisp = new THREE.ConeGeometry(rng.range(0.008, 0.016), out, 3);
      const where = rng.chance(0.5);
      const angle = rng.range(0, Math.PI * 2);
      wisp.rotateZ(rng.range(1.1, 2.1));
      wisp.rotateY(angle);
      wisp.translate(
        where ? rng.around(0, armSpan * 0.3) : rng.around(0, hem * 0.45),
        where ? armY - 0.06 : coatTop - coatLong * rng.range(0.5, 0.62),
        rng.around(0, 0.1),
      );
      add(wisp, straw, 0.4);
    }

    body.forEach((geometry, i) => {
      geometry.rotateZ(lean);
      geometry.rotateY(facing);
      parts.push({ geometry, color: tint[i], sway: bend[i] });
    });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return finish(merged, 'scarecrow', rng.range(0, Math.PI * 2));
  },
};
