import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A round stone cistern: standing water, and something to hold it.
 *
 * For the water in the Proving Ground's cell, which until now was a sound
 * coming out of a flagstone. A cistern rather than a spring or a fountain
 * because of what the sound already is: the model was retuned down to about one
 * bubble every two seconds, and **anything that bubbles continuously has
 * something driving it.** A cistern is defined by its gaps — water that arrived
 * a while ago and is going nowhere.
 *
 * Round, and deliberately not another trough. The kit already has a rectangular
 * timber water container, and two props that differ only in material are two
 * props that get used interchangeably and then look wrong somewhere.
 *
 * Built as a lathe from a closed profile — up the outside, across the rim, down
 * the inside, across the floor — which sweeps a real basin with a real wall.
 * Ten segments, so it faces visibly at arm's length and still reads as round
 * from across a room.
 */
export const cistern: MeshBuilder = {
  name: 'cistern',
  category: 'objects',
  radius: 0.75,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const outer = rng.range(0.5, 0.68);
    const wall = rng.range(0.09, 0.13);
    const inner = outer - wall;
    const height = rng.range(0.44, 0.62);
    const floor = rng.range(0.1, 0.15);
    const stone = shade(PALETTE.STONE, rng.range(0.9, 1.08));

    // Base and wall as two solids rather than one lathe.
    //
    // The tempting version is a single profile running from the centre of the
    // floor, up the inside, over the rim and down the outside — but a profile
    // that touches the axis revolves into a fan of degenerate slivers there,
    // and the solid comes out unclosed. A lathe is watertight exactly when its
    // profile is a closed loop that never reaches radius zero, so the floor is
    // a plain cylinder and the wall is a ring standing on it.
    const slab = new THREE.CylinderGeometry(outer * 0.99, outer * 1.02, floor, 10);
    slab.translate(0, floor / 2, 0);
    parts.push({ geometry: slab, color: shade(stone, 0.92), sway: 0 });

    const profile = [
      new THREE.Vector2(outer, floor * 0.5),
      // A slight batter: wider at the foot than the rim. Stonework that rises
      // dead vertical reads as poured concrete, and the taper is what carries
      // the weight of the thing at a glance.
      new THREE.Vector2(outer * 0.96, height),
      new THREE.Vector2(inner, height),
      new THREE.Vector2(inner * 0.97, floor * 0.5),
      // Closing the loop. `LatheGeometry` joins consecutive points and stops.
      new THREE.Vector2(outer, floor * 0.5),
    ];
    const basin = new THREE.LatheGeometry(profile, 10);
    // The rim is where hands and buckets go and it is worn paler than the rest.
    parts.push({
      geometry: basin,
      color: (_x, y) => (y > height * 0.9 ? shade(stone, 1.18) : stone),
      sway: 0,
    });

    // Standing water, well down inside. A basin filled to the rim reads as a
    // solid disc of colour rather than as something with depth in it — the same
    // mistake the trough's water panel exists to avoid, and worse here because
    // the walls are taller.
    const level = floor + (height - floor) * rng.range(0.3, 0.55);
    // A very flat cylinder rather than a disc. A disc is a surface, and every
    // edge round its rim belongs to one triangle — which is a hole as far as
    // any test of the solid is concerned, and invisible right up until
    // something walks past it and sees the back of nothing. The trough's water
    // is a thin box for the same reason.
    const water = new THREE.CylinderGeometry(inner * 0.97, inner * 0.97, 0.02, 10);
    water.translate(0, level, 0);
    parts.push({ geometry: water, color: PALETTE.WATER, sway: 0 });

    // A worn course of stones set into the ground around the foot on some of
    // them — the ground gives way around anything that has stood in one place
    // dripping for long enough.
    if (rng.chance(0.55)) {
      const apron = new THREE.CylinderGeometry(outer * 1.28, outer * 1.34, 0.07, 10);
      apron.translate(0, 0.03, 0);
      parts.push({ geometry: apron, color: shade(PALETTE.STONE_DARK, rng.range(0.94, 1.06)), sway: 0 });
    }

    // A spout on rather less than half of them: a block through the wall with a
    // channel cut by making it two pieces with a gap, since there is no
    // constructive solid geometry here and none is needed.
    if (rng.chance(0.45)) {
      const reach = rng.range(0.14, 0.22);
      const at = height * rng.range(0.72, 0.9);
      for (const side of [-1, 1]) {
        const cheek = new THREE.BoxGeometry(0.05, 0.09, reach);
        cheek.translate(side * 0.055, at, outer * 0.86 + reach / 2);
        parts.push({ geometry: cheek, color: shade(stone, 0.92), sway: 0 });
      }
      const sole = new THREE.BoxGeometry(0.16, 0.035, reach);
      sole.translate(0, at - 0.05, outer * 0.86 + reach / 2);
      parts.push({ geometry: sole, color: shade(stone, 0.86), sway: 0 });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'cistern', 0);
  },
};

/**
 * How high the water sits above the cistern's base, for placing the sound.
 *
 * The surface is where the bubbles break, and the rolled fill level varies by
 * more than the geometry does — so this is the middle of the range rather than
 * anything exact. Nobody localises a drip to five centimetres.
 */
export const CISTERN_WATER_HEIGHT = 0.28;
