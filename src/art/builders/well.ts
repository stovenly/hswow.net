import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { pointing, stoneColours, throughStone, patch } from '../masonry';

/**
 * A town well: a coped drum, two posts, a roof over it and a crank to wind the
 * bucket up.
 *
 * `cistern` is a tank — a thing water is kept *in*, standing against a wall.
 * This is the other half of the idea and the more useful one: the place a
 * village goes. It is the one piece of the exterior kit that is a **destination**
 * rather than dressing, which is worth having for the same reason the bell is —
 * a settlement reads as inhabited when its objects imply people using them, and
 * nothing implies that like a thing you have to walk to and work.
 *
 * ## Round, and it costs almost nothing to be
 *
 * Ten sides on the drum. A well is the only masonry in the kit that is curved,
 * and squaring it off would be the cheapest possible saving and the most
 * obviously wrong — a square well head reads as a planter. The stones are laid
 * as courses of `throughStone`, the same primitive the wall's coping uses, each
 * course turned a little on the one below so the joints break.
 *
 * ## The roof is what makes it a *town* well
 *
 * A hole in the ground with a wall round it is a well. A hole with a roof over
 * it is a well somebody maintains, which is a statement about the place rather
 * than about the hole. Two posts, a pair of rafters, a ridge and boards over —
 * deliberately crude joinery, because a village does not employ a carpenter to
 * roof a well.
 *
 * ## And the crank has to be usable
 *
 * The winch is the detail the eye goes to, so it is the one part built properly:
 * a barrel between the posts, a rope wound onto it, a handle cranked out to one
 * side at a height a person could actually reach, and a bucket hanging on the
 * rope. The handle is offset from the axle by a real throw and turned to a real
 * angle — a crank drawn in line with its own axle is a stick.
 */
export const well: MeshBuilder = {
  name: 'well',
  category: 'structures',
  radius: 1.35,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const bore = rng.range(0.52, 0.68);
    const wall = rng.range(0.22, 0.3);
    const outer = bore + wall;
    const stand = rng.range(0.62, 0.85);
    const sides = 10;

    const dry = rng.chance(0.35);
    const point = pointing(rng, dry);
    const colour = stoneColours(rng);
    const timber = shade(PALETTE.TIMBER, rng.range(0.94, 1.06));
    const frame = shade(PALETTE.TIMBER_DARK, rng.range(0.92, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.9, 1.1));

    // --- the drum ------------------------------------------------------------
    //
    // Courses of through stones round a ring, each course turned so the joints
    // of one land in the middle of the stones below it. That break is the whole
    // difference between coursed masonry and a stack of identical rings.
    const courses = rng.int(3, 4);
    const courseH = stand / courses;
    for (let c = 0; c < courses; c++) {
      const twist = (c % 2) * (Math.PI / sides) + rng.around(0, 0.04);
      const low = c * courseH;
      for (let i = 0; i < sides; i++) {
        const angle = twist + (i / sides) * Math.PI * 2;
        // Each stone is a wedge of the ring, cut in the plane of the wall and
        // then stood up and swung round to its bearing.
        //
        // Wider than its share of the ring: the flat is the *chord*, not the
        // arc, and `throughStone` then beds in half a joint and chamfers the
        // corners on top of that. Overlapping neighbours are invisible; daylight
        // between them is not.
        const chord = 2 * outer * Math.sin(Math.PI / sides);
        const across = chord * 1.1 + point.joint;
        const stone = throughStone(
          rng,
          patch(-across / 2, low + 0.01, across, courseH - 0.02),
          point,
          wall,
          rng.range(0.012, 0.026),
        );
        // `throughStone` faces +Z, and the outward normal at bearing θ is
        // (sin θ, 0, cos θ) — which `rotateY(θ)` gives and `rotateY(−θ)` mirrors.
        stone.rotateY(angle);
        stone.translate(
          Math.sin(angle) * (bore + wall / 2),
          0,
          Math.cos(angle) * (bore + wall / 2),
        );
        parts.push({ geometry: stone, color: colour(), sway: 0 });
      }
    }

    // The coping: flat stones over the courses, standing proud to sit and lean
    // on. A joint between each — cut *over* their share they overlap along
    // near-coplanar side faces, which flickers all the way round the top.
    const copeH = rng.range(0.09, 0.13);
    const copeJoint = point.joint * 1.6;
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      // The chord at the coping's own outer radius, for the drum's reason. These
      // are boxes rather than bedded stones, so they only need the joint back.
      const across = 2 * (outer + 0.03) * Math.sin(Math.PI / sides);
      // Each a little different through and a little different in height, so
      // that even the top faces are not one continuous plane.
      const cope = new THREE.BoxGeometry(
        across - copeJoint,
        copeH * rng.range(0.94, 1.06),
        wall * rng.range(1.16, 1.3),
      );
      cope.rotateY(angle);
      cope.translate(
        Math.sin(angle) * (bore + wall / 2),
        stand + copeH / 2,
        Math.cos(angle) * (bore + wall / 2),
      );
      parts.push({ geometry: cope, color: colour(), sway: 0 });
    }

    // Hearting behind the face stones, so a joint that fails shows more wall
    // rather than the dark shaft. Stops level with the courses — run up into the
    // coping it draws a ring round the top of the drum.
    const core = new THREE.CylinderGeometry(
      bore + wall * 0.72,
      bore + wall * 0.72,
      stand,
      sides,
      1,
      true,
    );
    core.translate(0, stand / 2, 0);
    parts.push({ geometry: core, color: shade(PALETTE.STONE_DARK, 0.92), sway: 0 });

    // The shaft, inside the hearting: seen only by looking down.
    const shaft = new THREE.CylinderGeometry(bore * 1.01, bore * 1.01, 0.06, sides);
    shaft.translate(0, -0.35, 0);
    parts.push({ geometry: shaft, color: 0x14171a, sway: 0 });
    const lining = new THREE.CylinderGeometry(bore, bore, stand + 0.35, sides, 1, true);
    lining.translate(0, (stand + 0.35) / 2 - 0.35, 0);
    parts.push({ geometry: lining, color: shade(PALETTE.STONE_DARK, 0.4), sway: 0 });

    // --- the frame -----------------------------------------------------------
    const top = stand + copeH;
    const postH = rng.range(1.25, 1.55);
    const postX = outer * rng.range(0.86, 0.96);
    const postT = rng.range(0.11, 0.15);
    for (const side of [-1, 1]) {
      const post = new THREE.BoxGeometry(postT, postH, postT);
      post.translate(side * postX, top + postH / 2 - 0.06, 0);
      parts.push({ geometry: post, color: frame, sway: 0 });
    }

    // --- the winch -----------------------------------------------------------
    //
    // The barrel runs through both posts, and further through the near one to
    // carry the crank. Asymmetric because only one end has a crank on it — even
    // ends leave a stub of bare axle attached to nothing.
    const axleY = top + postH * rng.range(0.62, 0.72);
    const crankSide = rng.chance(0.5) ? 1 : -1;
    const stub = 0.02;
    const spigot = 0.13;
    const nearEnd = postX + postT / 2 + spigot;
    const farEnd = postX + postT / 2 - stub;
    const through = nearEnd + farEnd;
    const drum = new THREE.CylinderGeometry(0.075, 0.075, through, 8);
    drum.rotateZ(Math.PI / 2);
    // Centred on the midpoint of its own two ends, which is off the well's
    // centre by half the difference between them.
    drum.translate((crankSide * (nearEnd - farEnd)) / 2, axleY, 0);
    parts.push({ geometry: drum, color: timber, sway: 0 });

    // Rope wound onto it: a fatter sleeve over the middle of the drum, which is
    // all a coil reads as at this size, and the bucket hanging under it. Kept
    // inside the posts, where the rope actually winds.
    const coil = new THREE.CylinderGeometry(0.11, 0.11, postX * 0.9, 8);
    coil.rotateZ(Math.PI / 2);
    coil.translate(rng.around(0, postX * 0.12), axleY, 0);
    parts.push({ geometry: coil, color: shade(PALETTE.CLOTH, 0.85), sway: 0 });

    const hang = rng.range(0.3, 0.55);
    const rope = new THREE.CylinderGeometry(0.016, 0.016, hang, 4);
    const bucketX = rng.around(0, postX * 0.25);
    rope.translate(bucketX, axleY - hang / 2, 0.11);
    parts.push({ geometry: rope, color: shade(PALETTE.CLOTH, 0.8), sway: 0 });

    // The bucket. **Half again the size it was** — it was scaled off nothing in
    // particular and came out as a cup on a rope, where the thing it has to read
    // as is a vessel two hands can carry and a well head is built around.
    const bucketH = rng.range(0.34, 0.44);
    const bucketR = bucketH * rng.range(0.52, 0.62);
    const bucket = new THREE.CylinderGeometry(bucketR, bucketR * 0.84, bucketH, 8);
    bucket.translate(bucketX, axleY - hang - bucketH / 2, 0.11);
    parts.push({ geometry: bucket, color: timber, sway: 0 });
    for (const at of [0.2, 0.8]) {
      const hoop = new THREE.CylinderGeometry(bucketR * 1.05, bucketR * 1.05, 0.02, 8);
      hoop.translate(bucketX, axleY - hang - bucketH + bucketH * at, 0.11);
      parts.push({ geometry: hoop, color: iron, sway: 0 });
    }

    // **The crank.** An elbow out of the axle, a throw across, and a grip on the
    // end of that — three pieces, because a handle drawn in line with its own
    // axle is a stick and does not read as something you could turn.
    // Sat on the spigot, which is the bit of barrel that comes through the near
    // post — so the crank is on the end of the axle rather than floating past it.
    const throwOut = rng.range(0.17, 0.23);
    const clock = rng.range(0, Math.PI * 2);
    const elbowX = crankSide * (nearEnd - 0.035);
    // Reaches from the axle out to the throw and a little past, so the grip is
    // let into it rather than balanced on its end.
    const elbow = new THREE.BoxGeometry(0.05, throwOut + 0.08, 0.05);
    elbow.translate(0, throwOut / 2, 0);
    elbow.rotateX(clock);
    elbow.translate(elbowX, axleY, 0);
    parts.push({ geometry: elbow, color: iron, sway: 0 });

    // **The grip goes on the end the elbow actually reaches.** `rotateX(θ)` takes
    // (0, r, 0) to (0, r·cos θ, **+**r·sin θ) — the z is positive — and this was
    // written with a minus, so the handle sat on the opposite side of the axle
    // from the arm that is supposed to be carrying it. Every crank on every well
    // was in two pieces pointing opposite ways.
    const gripY = axleY + Math.cos(clock) * throwOut;
    const gripZ = Math.sin(clock) * throwOut;
    const grip = new THREE.CylinderGeometry(0.032, 0.032, 0.19, 6);
    grip.rotateZ(Math.PI / 2);
    grip.translate(elbowX + crankSide * 0.07, gripY, gripZ);
    parts.push({ geometry: grip, color: timber, sway: 0 });

    // --- the roof ------------------------------------------------------------
    //
    // A ridge on the posts and boards down each slope. Crude on purpose: a
    // village roofs a well itself.
    // Let into the tops of the posts rather than laid on the line they would
    // reach if they started at `top` — they start 6 cm below it.
    const ridgeY = top + postH - 0.1;
    const eave = outer * rng.range(1.15, 1.35);
    const pitch = rng.range(0.42, 0.56);

    const ridge = new THREE.BoxGeometry(postX * 2 + 0.3, 0.08, 0.09);
    ridge.translate(0, ridgeY, 0);
    parts.push({ geometry: ridge, color: frame, sway: 0 });

    const slope = Math.hypot(eave, pitch);
    const boards = rng.int(4, 6);
    for (const side of [-1, 1]) {
      for (let b = 0; b < boards; b++) {
        const width = (postX * 2 + 0.36) / boards;
        const plank = new THREE.BoxGeometry(width * 0.97, 0.045, slope * 1.02);
        plank.rotateX(side * Math.atan2(pitch, eave));
        plank.translate(
          -(postX + 0.18) + (b + 0.5) * width,
          ridgeY - pitch / 2 + 0.03,
          (side * eave) / 2,
        );
        parts.push({ geometry: plank, color: shade(timber, rng.range(0.9, 1.06)), sway: 0 });
      }
      // A bargeboard along the eave, which is the edge you actually see.
      const barge = new THREE.BoxGeometry(postX * 2 + 0.36, 0.07, 0.05);
      barge.translate(0, ridgeY - pitch, side * eave);
      parts.push({ geometry: barge, color: frame, sway: 0 });
    }

    // **Nothing else.** There was a pier standing off in the grass beside it,
    // on the reasoning that a well reads as built into something rather than
    // dropped on a lawn. That is dressing a scene, which is not a builder's job
    // here — the world is hand placed, and a column nobody asked for standing at
    // a random bearing is a prop the person placing this can neither move nor be
    // rid of. If a well wants a wall beside it, somebody puts one there.

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'well', 0);
  },
};
