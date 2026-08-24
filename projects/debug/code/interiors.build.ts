import * as THREE from 'three';
import { buildInterior, HOUSE_STYLE, WORKS_STYLE } from '@engine/world/interior';
import { markCollidable } from '@engine/player/Collider';
import { PALETTE, shade } from '@engine/art/palette';
import {
  HUT_ROOM_SHELL,
  FACTORY,
  ENGINE_X,
  ENGINE_Z,
  STRIPPED_AT,
  GANTRY_AT,
  PIPE_RUN,
} from './zones';
// Builders are imported directly rather than through `art/registry`, which is
// Vite-only. The headless zone check reaches this file through esbuild.
import { crate } from '@engine/art/builders/crate';
import { barrel } from '@engine/art/builders/barrel';
import { bed } from '@engine/art/builders/bed';
import { table } from '@engine/art/builders/table';
import { chair } from '@engine/art/builders/chair';
import { stool } from '@engine/art/builders/stool';
import { figure } from '@engine/art/builders/figure';
import { machine } from '@engine/art/builders/machine';
import { sink } from '@engine/art/builders/sink';
import { candle } from '@engine/art/builders/candle';
import { floodlight } from '@engine/art/builders/floodlight';
import { pipes } from '@engine/art/builders/pipes';
import { tank } from '@engine/art/builders/tank';
import { vent } from '@engine/art/builders/vent';
import { railing } from '@engine/art/builders/railing';
import { chainlink } from '@engine/art/builders/chainlink';
import { fireplace } from '@engine/art/builders/fireplace';
import { stove } from '@engine/art/builders/stove';
import { windowBuilder } from '@engine/art/builders/window';
import { dresser } from '@engine/art/builders/dresser';
import { chest } from '@engine/art/builders/chest';
import { washtub } from '@engine/art/builders/washtub';
import { broom } from '@engine/art/builders/broom';
import { hangingHerbs } from '@engine/art/builders/hanging-herbs';
import { spinningWheel } from '@engine/art/builders/spinning-wheel';
import { wallPegs } from '@engine/art/builders/wall-pegs';
import { hoist } from '@engine/art/builders/hoist';
import { lantern } from '@engine/art/builders/lantern';

/**
 * The geometry of the two hub interiors, in its own chunk. The dimensions and
 * the machine placements stay in `zones.ts`, because the portals and the
 * factory soundscape are built from them at boot — see `PIPE_RUN`.
 */

/**
 * A small timber room: floor, four walls, ceiling, and somebody's things in it.
 *
 * Furnished rather than empty, because an empty sealed box proves the zone
 * system works and proves nothing about whether it is worth having. A bed
 * against one wall, a table with chairs pulled up to it and a figure standing
 * by are what make walking through the door land as arriving somewhere.
 *
 * Everything is placed by hand. An editor or a JSON file would be doing exactly
 * this from data — the point is that the placement is the only thing that would
 * move.
 */
export function buildVillagerHut(): THREE.Group {
  const root = new THREE.Group();
  root.add(
    buildInterior({ ...HUT_ROOM_SHELL, seed: 4400, style: HOUSE_STYLE, planks: true, beams: 3 }),
  );

  const halfW = HUT_ROOM_SHELL.width / 2;
  const halfD = HUT_ROOM_SHELL.depth / 2;

  // --- a room somebody lives in --------------------------------------------
  //
  // Arranged around the fireplace, because a hearth is not furniture — it is the
  // thing a room is *organised by*. The seating faces it, the bed is out of its
  // draught, the work that needs light is under the windows, and the storage is
  // in the dead corner behind the door.
  //
  // The door is in the north wall at x = 0, so the strip in front of it is kept
  // clear: you have to be able to walk forward off the arrival marker, and it is
  // also simply how a room works.

  // The hearth, central on the west wall and facing into the room. Built with
  // its back at z = 0 projecting +Z, so a quarter turn puts it against −X.
  place(root, fireplace.build({ seed: 8801 }), -halfW + 0.12, 0, 0.4, Math.PI / 2);

  // Two windows in the south wall, either side of centre. Facing −Z, into the
  // room. They are the reason the south half is where the daytime work happens.
  place(root, windowBuilder.build({ seed: 8810 }), -2.6, 0, halfD - 0.1, Math.PI);
  place(root, windowBuilder.build({ seed: 8811 }), 2.4, 0, halfD - 0.1, Math.PI);

  // The stove on the east wall — a second, smaller heat source at the far end
  // from the hearth, which is what a room this long would actually have.
  place(root, stove.build({ seed: 8820 }), halfW - 0.35, 0, -1.6, -Math.PI / 2);

  // Bed in the north-west corner: out of the hearth's radiant heat, out of the
  // window light, and away from the door. Beds are built lying along Z, so the
  // west wall needs no rotation.
  place(root, bed.build({ seed: 3120 }), -halfW + 0.95, 0, -2.5, 0);
  // The chest at its foot, which is where a chest goes.
  const foot = chest.build({ seed: 8830 });
  place(root, foot, -halfW + 1.0, 0, -1.0, 0.06);

  // Table and seating pulled in toward the fire rather than pushed to the far
  // wall. Two chairs and a stool round it, the chairs on the hearth side.
  const board = table.build({ seed: 2077 });
  place(root, board, 0.6, 0, 0.9, 0.08);
  place(root, chair.build({ seed: 411 }), -0.5, 0, 1.5, Math.PI * 0.4);
  place(root, chair.build({ seed: 412 }), 0.9, 0, -0.4, 0.1);
  place(root, stool.build({ seed: 413 }), 1.7, 0, 0.4, 0.4);
  // One drawn up to the fire itself, turned to face it.
  place(root, stool.build({ seed: 415 }), -halfW + 1.6, 0, 0.2, -0.5);

  // The spinning wheel under the west window, because it is the piece that
  // most needs light to work at — and putting it there is the cheapest way to
  // say the windows are for something.
  place(root, spinningWheel.build({ seed: 8840 }), -2.9, 0, halfD - 2.2, Math.PI * 0.85);

  // A side table against the south wall between the windows, with the clutter.
  const side = table.build({ seed: 2078 });
  place(root, side, -0.2, 0, halfD - 0.8, Math.PI);

  // The dresser on the north wall, east of the door, facing into the room.
  place(root, dresser.build({ seed: 8850 }), 2.6, 0, -halfD + 0.35, 0);

  // Washing in the corner by the hearth, where the water would be heated.
  place(root, washtub.build({ seed: 8860 }), -halfW + 0.75, 0, 3.3, 0.4);
  // Herbs drying on the wall above it — the overhead register, and the only
  // thing in the room whose geometry starts above head height.
  place(root, hangingHerbs.build({ seed: 8870 }), -halfW + 0.16, 0, 2.4, Math.PI / 2);
  // Pegs by the door, where coats come off.
  place(root, wallPegs.build({ seed: 8880 }), -1.5, 0, -halfD + 0.14, 0);
  // And the broom leaning beside them.
  place(root, broom.build({ seed: 8890 }), -2.3, 0, -halfD + 0.45, 0.25);

  // Somebody home. Static, but a room
  // with a person standing in it reads completely differently from one without,
  // and this is the fixture the animation work will be judged against. Stood at
  // the table rather than in open floor, which is where a person actually is.
  place(root, figure.build({ seed: 6602, roam: 1.2 }), 0.4, 0, 2.1, Math.PI * 0.9);

  // Storage in the dead corner behind the door, which is where it goes in a
  // real room: the space nobody walks through and nobody sits in.
  const crateA = crate.build({ seed: 61 });
  place(root, crateA, halfW - 0.9, 0, -halfD + 1.0, 0.4);
  // One crate, not two. A crate rolls very nearly a metre across, and there is
  // nowhere left in a ten-by-eight room with a hearth, a stove, a dresser and
  // two windows in it that a second metre-wide box can stand without fouling
  // something.
  place(root, barrel.build({ seed: 67 }), halfW - 0.7, 0, -0.2, 0.2);

  // --- light you can see ---------------------------------------------------
  //
  // The interior's own lighting is a sun at a tenth strength and a generous
  // ambient — enough to read the room by and no reason for any of it. These are
  // the reason: four small sources, each standing on something, so the light in
  // here is *coming from* things rather than being a property of the air.
  //
  // Four rather than a dozen. Each carries a `PointLight`, and every one is
  // another iteration in the shader for every lit fragment in the room. Four
  // gives the space a direction and a couple of pools of warmth; a candle on
  // every surface costs real frames to read as "the lights are on".
  //
  // Stood on measured surfaces rather than at guessed heights — see `topOf`.
  place(root, candle.build({ seed: 7101 }), 0.75, topOf(board), 0.65, 0.6);
  place(root, candle.build({ seed: 7102 }), -0.35, topOf(side), halfD - 0.85, -0.4);
  // On a crate rather than beside it. A lantern on the floor of a room this
  // size lights the boards and nothing else; up on a box it reaches the wall.
  place(root, lantern.build({ seed: 7103 }), halfW - 0.95, topOf(crateA), -halfD + 1, 0.9);
  // And one genuinely on the floor, by the bed, where somebody set it down.
  // Standing *on* the chest at the foot of the bed, not inside it. Read off
  // the chest's own geometry rather than assumed — the lid height is rolled.
  place(root, lantern.build({ seed: 7104 }), -halfW + 1.05, topOf(foot), -1.05, -0.5);

  return markCollidable(root);
}

/**
 * Inside the factory: a large stone hall with engines in it. The machinery is
 * the point of the room — an empty industrial shell is a bigger version of the
 * other interior, and the two are supposed to prove that crossing a threshold
 * puts you somewhere *different*.
 */
export function buildFactory(): THREE.Group {
  const root = new THREE.Group();
  // **No beams.** `buildInterior` puts timber joists across the ceiling, which
  // is right for a dwelling and wrong here — a works is not roofed in wood, and
  // a room dressed with steel plant under oak beams reads as a barn somebody
  // put machinery in. The overhead structure is pipework instead, below.
  root.add(buildInterior({ ...FACTORY, seed: 7700, style: WORKS_STYLE, planks: false, beams: 0 }));

  const halfW = FACTORY.width / 2;
  const halfD = FACTORY.depth / 2;

  // Laid out in three lanes across the width: engines west, an open aisle up
  // the middle where the door lets you in, and storage east. The door is in the
  // north wall at x = 0, so the strip around z = -4 is kept clear — you have to
  // be able to walk forward off the arrival marker.
  const engineX = ENGINE_X;

  // --- the plant -----------------------------------------------------------
  //
  // A row of engines along the west wall, turned to face the aisle. Different
  // seeds, so they read as the same kind of machine rather than as three copies
  // of one.
  //
  // Positions from `ENGINE_Z`, shared with `FACTORY_SOUND`. Typing them twice is
  // how an engine ends up standing a metre from its own noise.
  ENGINE_Z.forEach((z, index) => {
    place(root, machine.build({ seed: 3301 + index }), engineX, 0, z, Math.PI / 2);
  });

  // The vessel along the east wall, lying across the room. The biggest single
  // mass in here and the only thing that breaks the sightline down the hall,
  // which is what stops a shed reading as one empty box.
  place(root, tank.build({ seed: 4401 }), 5.1, 0, 2.1, Math.PI / 2);

  // And one engine pulled out into the open, at an angle, part-way through
  // being worked on — the reason anyone would be in here, and what the clatter
  // in `FACTORY_SOUND` is coming off.
  place(root, machine.build({ seed: 3304 }), STRIPPED_AT[0], 0, STRIPPED_AT[2], -0.35);

  // --- pipework, on the walls ---------------------------------------------
  //
  // Along the walls and not across the ceiling. A pipe run is a *service*,
  // something that goes from one machine to another at working height, and
  // hanging four of them across a roof reads as decoration. The roof is carried
  // by the trusses below.
  //
  // `pipes` builds its main at a fixed 2 m along +X, so a wall run is a
  // rotation and a nudge and nothing else.
  const wallRuns: [number, number, number][] = [
    [-3.6, -halfD + 0.34, 0],
    [3.6, -halfD + 0.34, 0],
    // Shared with `FACTORY_SOUND`, which puts the air in this one. Same rule
    // as the engines and the gantry: the emitter is derived from the object.
    [PIPE_RUN[0], PIPE_RUN[2], Math.PI / 2],
    [halfW - 0.34, -2.4, Math.PI / 2],
  ];
  for (let i = 0; i < wallRuns.length; i++) {
    const [a, b, yaw] = wallRuns[i];
    const run = pipes.build({ seed: 9101 + i });
    run.position.set(yaw === 0 ? a : a, 0, yaw === 0 ? b : b);
    run.rotation.y = yaw;
    root.add(run);
  }

  // Extract high on the east wall. Vents build about a fixed 1.7 m sill, so
  // this is lifted the same way a wall pipe run is turned.
  const extract = vent.build({ seed: 9201 });
  extract.position.set(halfW - 0.22, 1.4, -1.4);
  extract.rotation.y = -Math.PI / 2;
  root.add(extract);

  // --- roof trusses --------------------------------------------------------
  //
  // Steel, and built here rather than by `buildInterior`, whose `beams` are
  // timber joists — right for a dwelling, wrong for a works. But without them
  // the ceiling is one unbroken plane fifteen metres across, and an unbroken
  // plane lit from a single direction is a flat field of one colour whatever
  // that colour is. Pipes alone are too thin to break it.
  //
  // A truss is a top chord, a bottom chord and a zigzag of webs between them:
  // three cheap boxes and a loop, and the diagonals are the whole read.
  const truss = new THREE.MeshLambertMaterial({
    color: shade(PALETTE.IRON, 0.92),
    flatShading: true,
  });
  const trussTop = FACTORY.height - 0.12;
  const trussDepth = 0.42;

  for (const z of [-4.2, -1.4, 1.4, 4.2]) {
    const bay = new THREE.Group();

    for (const [y, thick] of [
      [trussTop, 0.13],
      [trussTop - trussDepth, 0.1],
    ] as const) {
      const chord = new THREE.Mesh(
        new THREE.BoxGeometry(FACTORY.width, thick, thick * 1.25),
        truss,
      );
      chord.position.set(0, y, 0);
      bay.add(chord);
    }

    // The webs. Alternating lean, so consecutive panels form the W that says
    // "this is carrying a load" rather than a ladder, which says nothing.
    const panels = 9;
    const pitch = FACTORY.width / panels;
    for (let i = 0; i < panels; i++) {
      const web = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, Math.hypot(pitch, trussDepth), 0.09),
        truss,
      );
      web.position.set(-FACTORY.width / 2 + pitch * (i + 0.5), trussTop - trussDepth / 2, 0);
      web.rotation.z = (i % 2 === 0 ? 1 : -1) * Math.atan2(pitch, trussDepth);
      bay.add(web);
    }

    bay.position.z = z;
    root.add(bay);
  }

  // --- keeping people out of the plant -------------------------------------
  //
  // A railing between the aisle and the engine row, and a fenced-off corner at
  // the south end. The cheapest way to say this is a place with rules in it: a
  // machine you can walk straight into is scenery, one behind a rail is
  // equipment.
  place(root, railing.build({ seed: 9301 }), engineX + 1.9, 0, 1, Math.PI / 2);
  place(root, chainlink.build({ seed: 9302 }), 2.4, 0, halfD - 0.7, 0);

  // The wash-up, in the corner by the door. Every works has one and it is the
  // one object in here at human scale.
  place(root, sink.build({ seed: 9401 }), halfW - 0.55, 0, -halfD + 1.5, -Math.PI / 2);

  // --- the gantry ----------------------------------------------------------
  //
  // Straddling the aisle rather than standing over the plant, because the point
  // of a hoist is the empty floor underneath it: something gets lifted *off* a
  // machine and set down where there is room to work on it. Turned to run along
  // the hall so the beam does not block the walk down it.
  //
  // **This is the object the creak comes from.** The friction emitter in the
  // factory soundscape sits at the trolley — a rope groaning out of clear air
  // in the middle of a room reads as a bug.
  place(root, hoist.build({ seed: 8110 }), GANTRY_AT[0], 0, GANTRY_AT[2], Math.PI / 2);

  // --- lit for work --------------------------------------------------------
  //
  // Aimed at things, not scattered. `floodlight` builds pointing +Z and takes no
  // facing of its own, so the yaw here is the whole aim.
  //
  // Aimed *across* the hall rather than down it: the beam is visible geometry,
  // and a beam pointing away from you is a bright disc while a beam crossing
  // your view is a shaft. The shaft is the entire value of drawing the cone.
  //
  // Three, and not one per machine. Each carries a `SpotLight`, the most
  // expensive light in the API — a cone test and a penumbra falloff for every
  // lit fragment, on top of a shadow map when shadows are on.
  place(root, floodlight.build({ seed: 5501 }), -0.6, 0, -2.4, -Math.PI / 2);
  place(root, floodlight.build({ seed: 5502 }), -0.6, 0, 4.4, -Math.PI / 2);
  // And onto the tank from the aisle, facing +X.
  place(root, floodlight.build({ seed: 5503 }), 1.2, 0, -0.6, Math.PI / 2);

  return markCollidable(root);
}

/**
 * The height of the top of a placed prop, in its parent's space. Measured off
 * the geometry rather than looked up: every builder rolls its own dimensions
 * from its seed — a table is between 0.68 and 0.78 m tall — so a constant here
 * would be correct for one seed and put a candle through the boards for every
 * other.
 */
function topOf(mesh: THREE.Mesh): number {
  mesh.geometry.computeBoundingBox();
  return (mesh.geometry.boundingBox?.max.y ?? 0) + mesh.position.y;
}

function place(
  parent: THREE.Object3D,
  mesh: THREE.Mesh,
  x: number,
  y: number,
  z: number,
  yaw: number,
): void {
  mesh.position.set(x, y, z);
  mesh.rotation.y = yaw;
  parent.add(mesh);
}
