import * as THREE from 'three';
import { buildInterior, WORKS_STYLE } from '@engine/world/interior';
import { markCollidable } from '@engine/player/Collider';
import { PALETTE, shade } from '@engine/art/palette';
import {
  FACTORY,
  ENGINE_X,
  ENGINE_Z,
  STRIPPED_AT,
  GANTRY_AT,
  PIPE_RUN,
} from './zones';
// Builders are imported directly rather than through `art/registry`, which is
// Vite-only. The headless zone check reaches this file through esbuild.
import { machine } from '@engine/art/builders/machine';
import { sink } from '@engine/art/builders/sink';
import { floodlight } from '@engine/art/builders/floodlight';
import { pipes } from '@engine/art/builders/pipes';
import { tank } from '@engine/art/builders/tank';
import { vent } from '@engine/art/builders/vent';
import { railing } from '@engine/art/builders/railing';
import { chainlink } from '@engine/art/builders/chainlink';
import { hoist } from '@engine/art/builders/hoist';

/**
 * The factory hall's geometry, in its own chunk. The dimensions and the machine
 * placements stay in `zones.ts`, because the portals and the factory soundscape
 * are built from them at boot — see `PIPE_RUN`.
 *
 * The last hand-placed interior. Its roof trusses are raw boxes in a private
 * material rather than art-kit builders, so there is no builder name a document
 * could put in the room.
 */

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
