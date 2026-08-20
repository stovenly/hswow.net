import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A handcart, parked nose-down on its shafts. The tilt is solved rather than
// chosen: the body rotates about the axle by whatever angle brings the shaft tips
// to y = 0, so a bigger wheel or a longer shaft still parks it on the ground.
// Ten-sided rims, because a cartwheel is seen face-on and at six sides it reads
// as a hexagon.
export const cart: MeshBuilder = {
  name: 'cart',
  category: 'objects',
  radius: 1.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const wheel = rng.range(0.36, 0.5);
    const track = rng.range(0.78, 0.98);
    const bedLength = rng.range(1.2, 1.6);
    const bedWidth = track * rng.range(0.82, 0.95);
    const shaft = rng.range(1, 1.4);
    const board = rng.range(0.28, 0.44);
    const timber = shade(PALETTE.TIMBER, rng.range(0.94, 1.06));
    const frame = shade(PALETTE.TIMBER_DARK, rng.range(0.92, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.9, 1.1));

    // Everything above the axle is built in the cart's own frame, with the axle
    // at the origin and the shafts running out along +X, then tipped as one.
    const body: THREE.BufferGeometry[] = [];
    const bodyColour: number[] = [];
    const add = (geometry: THREE.BufferGeometry, color: number): void => {
      body.push(geometry);
      bodyColour.push(color);
    };

    const floor = wheel * rng.range(0.32, 0.46);

    const bed = new THREE.BoxGeometry(bedLength, 0.08, bedWidth);
    bed.translate(0, floor, 0);
    add(bed, timber);

    // Sideboards and a headboard. Three sides, never four: a cart open at the
    // tail is what you load and unload, and the gap is what stops the object
    // reading as a box on wheels.
    for (const side of [-1, 1]) {
      const rail = new THREE.BoxGeometry(bedLength, board, 0.05);
      rail.translate(0, floor + board / 2, (side * bedWidth) / 2);
      add(rail, frame);
    }
    const head = new THREE.BoxGeometry(0.05, board, bedWidth);
    head.translate(bedLength / 2, floor + board / 2, 0);
    add(head, frame);

    // Uprights at the corners, so the boards are carried rather than glued on.
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const post = new THREE.BoxGeometry(0.06, board * 1.15, 0.06);
        post.translate((sx * bedLength) / 2, floor + board * 0.55, (sz * bedWidth) / 2);
        add(post, frame);
      }
    }

    // The shafts, running forward from under the bed to the handle. `tip` is where
    // they actually end: the handle goes there and the parking angle is solved to
    // put that on the ground, so one number decides all three.
    const shaftY = floor * rng.range(0.35, 0.6);
    const shaftZ = bedWidth * rng.range(0.28, 0.38);
    const heel = -bedLength * 0.3;
    const tip = bedLength / 2 + shaft;
    // The shafts stop at the handle's axis, not past it. A shaft that ends on the
    // axis is capped by the bar from every direction, and the bar is fat enough to
    // cover the corner of the section.
    const grip = 0.05;
    for (const side of [-1, 1]) {
      const arm = new THREE.BoxGeometry(tip - grip - heel, 0.07, 0.06);
      arm.translate((tip - grip + heel) / 2, shaftY, side * shaftZ);
      add(arm, timber);
    }
    // The crossbar, capping both shaft ends and running a little past them, so the
    // joint is a lap rather than three sticks meeting at a point. Turned, not sawn:
    // a round handle has no face that can be coplanar with a flat one. Its radius
    // covers the half-diagonal of a shaft's section, so the flat end let into it is
    // inside the round and not through the far side.
    const bar = new THREE.CylinderGeometry(grip, grip, shaftZ * 2 + 0.1, 8);
    bar.rotateX(Math.PI / 2);
    bar.translate(tip - grip, shaftY, 0);
    add(bar, frame);

    // The parking angle. Rotating by `t` about the axle takes (tip, shaftY) to
    // y = shaftY·cos t − tip·sin t, and that plus the wheel radius has to be zero.
    // Solved from the same `tip` the handle is nailed to.
    const span = Math.hypot(tip, shaftY);
    const park = Math.atan2(shaftY, tip) + Math.asin(Math.min(1, wheel / span));

    body.forEach((geometry, i) => {
      geometry.rotateZ(-park);
      geometry.translate(0, wheel, 0);
      parts.push({ geometry, color: bodyColour[i], sway: 0 });
    });

    // --- the wheels ----------------------------------------------------------
    //
    // On the ground, not in the body's frame — they are what it is resting on.
    for (const side of [-1, 1]) {
      const z = (side * track) / 2;
      const rim = new THREE.CylinderGeometry(wheel, wheel, 0.08, 10);
      rim.rotateX(Math.PI / 2);
      rim.translate(0, wheel, z);
      parts.push({ geometry: rim, color: shade(timber, 0.94), sway: 0 });

      // A tyre, standing proud. Iron on a wooden wheel, and the one place on a
      // cart where the two materials meet in a way you can see.
      const tyre = new THREE.CylinderGeometry(wheel * 1.05, wheel * 1.05, 0.05, 10);
      tyre.rotateX(Math.PI / 2);
      tyre.translate(0, wheel, z);
      parts.push({ geometry: tyre, color: iron, sway: 0 });

      const hub = new THREE.CylinderGeometry(wheel * 0.2, wheel * 0.2, 0.16, 6);
      hub.rotateX(Math.PI / 2);
      hub.translate(0, wheel, z);
      parts.push({ geometry: hub, color: frame, sway: 0 });

      const spokes = 5;
      const start = rng.range(0, Math.PI * 2);
      for (let i = 0; i < spokes; i++) {
        const spoke = new THREE.BoxGeometry(wheel * 0.92, 0.05, 0.045);
        spoke.rotateZ((i / spokes) * Math.PI + start);
        spoke.translate(0, wheel, z);
        parts.push({ geometry: spoke, color: shade(timber, 0.9), sway: 0 });
      }
    }

    // The axle between them, which is also what stops daylight through the gap
    // under the bed.
    const axle = new THREE.CylinderGeometry(0.05, 0.05, track, 6);
    axle.rotateX(Math.PI / 2);
    axle.translate(0, wheel, 0);
    parts.push({ geometry: axle, color: frame, sway: 0 });

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'cart', 0);
  },
};
