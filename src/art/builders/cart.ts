import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A handcart, parked nose-down on its shafts.
 *
 * **The only blocker here that is obviously somebody's.** A boulder is geology, a
 * hedge is time, a log pile is work that happened at some point — a cart is a
 * thing a person put down and is coming back for. Stood across the end of a lane
 * it closes it while saying the place is inhabited, which is a great deal of
 * value for something that also happens to be two metres of solid obstacle.
 *
 * ## Tipped, and the angle is solved rather than chosen
 *
 * A two-wheeled cart with nobody in the shafts falls forward until the shaft
 * ends hit the ground. That is its resting position and it is most of the
 * silhouette — a cart sitting level looks like it is being held, which is
 * exactly wrong for a prop whose whole statement is that it has been left.
 *
 * So the tilt is not a number in the file. The body rotates about the axle, and
 * the angle is whatever brings the shaft tips to y = 0: solved from the shaft's
 * length and the wheel's radius, so a seed that rolls a bigger wheel or a longer
 * shaft still parks the cart on the ground instead of in it or above it.
 *
 * ## Wheels
 *
 * Ten-sided rims. A cartwheel is seen face-on more than anything else in the kit
 * — it is a disc standing in a vertical plane at eye height — and at six sides it
 * reads as a hexagon, which is the one shape a wheel must not be. The spokes are
 * five flat bars rather than turned rods: at this size the difference is
 * invisible and the bars are a third of the triangles.
 */
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

    // The shafts, running forward from under the bed to the handle.
    //
    // **One number decides where they end, and the handle uses it.** It was
    // three: the shafts were sized from their own length and offset, the handle
    // was put at `bedLength/2 + shaft`, and the parking angle was solved from
    // that same third number. So on every cart the crossbar floated about
    // twenty centimetres in front of two shafts that stopped short of it — the
    // handle of a handcart, detached, which is the one part of the object a
    // player is going to look at.
    //
    // `tip` is where the shafts actually end. The handle goes there and the
    // parking angle is solved to put *that* on the ground.
    const shaftY = floor * rng.range(0.35, 0.6);
    const shaftZ = bedWidth * rng.range(0.28, 0.38);
    const heel = -bedLength * 0.3;
    const tip = bedLength / 2 + shaft;
    // **The shafts stop at the handle's axis, not past it.** They ran the whole
    // way to `tip` while the handle sat centred a little short of it, so the
    // square end of each shaft came out through the round bar and hung in the
    // air beyond — which is the same joint failing a second way after the first
    // fix. A shaft that ends *on* the axis is capped by the bar from every
    // direction, and the bar is fat enough to cover the corner of the section.
    const grip = 0.05;
    for (const side of [-1, 1]) {
      const arm = new THREE.BoxGeometry(tip - grip - heel, 0.07, 0.06);
      arm.translate((tip - grip + heel) / 2, shaftY, side * shaftZ);
      add(arm, timber);
    }
    // The crossbar, capping both shaft ends and running a little past them, so
    // the joint is a lap rather than three sticks meeting at a point.
    //
    // **Turned, not sawn**, and that is what stops it z-fighting. It was a box
    // of exactly the shafts' section at exactly their height, so its top and
    // bottom faces were coplanar with theirs along the whole overlap — two
    // surfaces at the same depth, which the buffer resolves differently from
    // pixel to pixel and from frame to frame. A round handle has no face that
    // can be coplanar with a flat one, and a handle is a thing you grip, so it
    // is the right shape anyway.
    //
    // Its radius covers the half-diagonal of a shaft's section (0.035 × 0.030 →
    // 0.046), so the flat end let into it is inside the round and not through
    // the far side of it.
    const bar = new THREE.CylinderGeometry(grip, grip, shaftZ * 2 + 0.1, 8);
    bar.rotateX(Math.PI / 2);
    bar.translate(tip - grip, shaftY, 0);
    add(bar, frame);

    // **The parking angle.** Bring the shaft tips down to the ground: rotating
    // by `t` about the axle takes (tip, shaftY) to y = shaftY·cos t − tip·sin t,
    // and that plus the wheel radius has to be zero. Solved from the same `tip`
    // the handle is nailed to, so the two cannot disagree about where the front
    // of the cart is.
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
