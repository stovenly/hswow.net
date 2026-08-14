import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A deadfall: a tree blown over, with its root plate torn up on end.
 *
 * **The best natural blocker in the kit, and it is the root plate that does it.**
 * A fallen trunk lying on the ground is a metre of obstacle you step over; the
 * disc of earth and roots that comes up with it stands two or three metres in the
 * air, is four metres across, and is completely opaque. Two of these at an angle
 * to each other close a route as thoroughly as a wall and read as nothing but
 * weather.
 *
 * It is also the only thing on this list that is a small piece of *story*.
 * Boulders have always been there; a deadfall happened. The player does not have
 * to think about it for it to work — the difference between a place things have
 * happened to and a place things were placed in is made of details like this one.
 *
 * ## The plate faces the way the tree came from
 *
 * A tree levers up its own roots as it goes over, so the plate is a disc roughly
 * square to the trunk, standing on the hinge where it tore. Built with the plate
 * at the origin and the trunk running out along **+X**, so a placer turns the
 * whole thing to point the fall down whatever bearing the wind was.
 *
 * The trunk is not level. It sits high where it leaves the butt and comes down
 * to the ground at its far end, which is the shape a fallen tree actually holds —
 * and it is why you can see *under* one, which a log lying flat never gives you.
 */
export const deadfall: MeshBuilder = {
  name: 'deadfall',
  category: 'nature',
  // Measured, not guessed: the trunk runs out to five and a half metres from
  // the plate, so a placer told 3.2 would stand the next prop inside it.
  radius: 4.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const plate = rng.range(1, 1.7);
    const butt = rng.range(0.24, 0.4);
    const length = rng.range(3.2, 5.4);
    const bark = rng.chance(0.45) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const soil = shade(PALETTE.EARTH, rng.range(0.9, 1.15));
    // How far the plate has come past vertical. It hinges as it lifts, so a
    // little past is normal and dead upright looks arrested.
    const tip = rng.range(-0.28, -0.06);

    /**
     * Where the middle of the plate is, and therefore where the trunk leaves it.
     *
     * **One number, used by both.** This was two — the plate was centred on one
     * draw and the trunk started from another, a fifth of the plate's radius out
     * in front of it — so the butt of the tree stood clear of the disc it is
     * supposed to have torn out of the ground, at a different height. A fallen
     * tree and its own root plate are one object; nothing about them is allowed
     * to be rolled twice.
     */
    const hinge = plate * rng.range(0.72, 0.88);
    // Thick enough to swallow the end of the trunk — see `into` below.
    const thick = rng.range(0.45, 0.7);

    // --- the plate -----------------------------------------------------------
    //
    // A thick disc of earth, standing on edge with its face square to the trunk.
    // Eight sides: the outline is ragged by the roots hanging off it, so paying
    // for a round rim buys nothing.
    const disc = new THREE.CylinderGeometry(plate, plate * rng.range(0.85, 1), thick, 8);
    disc.rotateZ(Math.PI / 2);
    disc.scale(1, 1, rng.range(0.8, 1));
    disc.rotateZ(tip);
    disc.translate(0, hinge, 0);
    parts.push({ geometry: disc, color: soil, sway: 0 });

    // Roots, radiating in the plane of the plate and standing clear of its rim.
    // These are the whole silhouette — a bare disc of earth is a millstone.
    const roots = rng.int(6, 11);
    for (let i = 0; i < roots; i++) {
      const around = (i / roots) * Math.PI * 2 + rng.around(0, 0.35);
      const out = plate * rng.range(0.85, 1.35);
      const thick = rng.range(0.035, 0.09);
      const root = new THREE.CylinderGeometry(thick * 0.4, thick, out, 4);
      root.translate(0, out / 2, 0);
      // Laid into the plate's plane, then swept round it, then tipped with it.
      root.rotateZ(rng.around(0, 0.25));
      root.rotateX(-around);
      root.rotateZ(tip + rng.around(0, 0.12));
      root.translate(rng.around(0, thick * 0.25), hinge, 0);
      parts.push({ geometry: root, color: shade(bark, rng.range(0.8, 1)), sway: 0 });
    }

    // The socket it came out of — a low mound of turned earth on the far side.
    const crater = new THREE.CylinderGeometry(plate * rng.range(0.7, 1), plate * 1.15, 0.3, 7);
    crater.translate(-plate * rng.range(0.5, 0.9), 0.04, rng.around(0, 0.2));
    parts.push({ geometry: crater, color: shade(soil, 0.92), sway: 0 });

    // --- the trunk -----------------------------------------------------------
    //
    // High at the butt, down to the ground at the tip, hinged about the middle
    // of the plate so the two are joined by construction rather than by two
    // draws happening to agree.
    //
    // **The butt stops inside the plate**, which is the whole point of a root
    // plate: the tree did not come off it, it is still attached to it.
    //
    // It reached a whole `thick + butt` behind the middle of the disc, on the
    // reasoning that more overlap is safer. It is not — the disc is only `thick`
    // deep, so anything past half of that comes out of the *back* of it, and
    // what showed was the sawn end of the trunk hanging out below the plate.
    //
    // The trunk runs very nearly along the plate's own normal (its slope down to
    // the ground and the plate's tip past vertical are both small, and they
    // partly cancel), so the distance the butt travels through the disc is
    // `into · cos(drop + tip)` — near enough `into`. A third of the thickness
    // leaves it buried with half as much again to spare at either extreme of
    // both rolls.
    const rest = butt * 1.1;
    const drop = Math.atan2(hinge - rest, length);
    const into = thick * 0.33;

    const trunk = new THREE.CylinderGeometry(
      butt * rng.range(0.5, 0.72),
      butt,
      length + into,
      7,
    );
    trunk.rotateZ(Math.PI / 2);
    // Spans -`into` to `length` along its own axis before it is tipped, so the
    // near end is buried in the plate and the far end still lands at `length`.
    trunk.translate((length - into) / 2, 0, 0);
    trunk.rotateZ(-drop);
    trunk.rotateY(rng.around(0, 0.12));
    trunk.translate(0, hinge, 0);
    parts.push({ geometry: trunk, color: bark, sway: 0 });

    // Branch stubs, all snapped short. The ones underneath broke off on the way
    // down, so these are on the upper half only.
    for (let i = rng.int(3, 6); i > 0; i--) {
      const at = rng.range(length * 0.25, length * 0.95);
      const out = rng.range(0.3, 0.85);
      const bearing = rng.range(0.35, Math.PI - 0.35) * (rng.chance(0.5) ? 1 : -1);
      const stub = new THREE.CylinderGeometry(0.03, rng.range(0.05, 0.1), out, 4);
      stub.translate(0, out / 2, 0);
      stub.rotateX(Math.PI / 2 - rng.range(0.5, 1.2));
      stub.rotateY(bearing);
      // Sat on the trunk's own centre line at that distance along it, so a stub
      // grows out of the wood rather than hanging beside it.
      stub.translate(
        Math.cos(drop) * at,
        hinge - Math.sin(drop) * at + butt * 0.25,
        0,
      );
      parts.push({ geometry: stub, color: shade(bark, 0.88), sway: 0 });
    }

    // The torn end: pale splinters where the trunk parted from the stool. On the
    // face of the plate, around where the trunk goes into it.
    for (let i = rng.int(2, 4); i > 0; i--) {
      const spike = new THREE.ConeGeometry(butt * rng.range(0.14, 0.3), rng.range(0.25, 0.6), 4);
      spike.rotateZ(Math.PI / 2 + rng.around(0, 0.4));
      spike.rotateX(rng.range(0, Math.PI * 2));
      spike.translate(
        thick * 0.5 + rng.range(0, 0.12),
        hinge + rng.around(0, butt * 0.7),
        rng.around(0, butt * 0.7),
      );
      parts.push({ geometry: spike, color: shade(PALETTE.TIMBER, 0.84), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'deadfall', 0);
  },
};
