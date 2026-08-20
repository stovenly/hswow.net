import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import {
  hearting,
  patch,
  pointing,
  prism,
  quoinedPier,
  roughBox,
  stoneColours,
  throughStone,
  type Point,
} from '../masonry';

// A standing stone archway: two piers and a lintel — somewhere for a door to be
// that is not a building. Built from the same masonry as `stone-wall` and
// `stone-wall-column`, because a village gate that did not match the wall running
// up to it would be the kit contradicting itself. The crown is dressed work:
// corbels out of the jambs, the lintel stepped back underneath, and a course
// oversailing both faces. Built facing +Z with its opening centred on the origin,
// matching the door builder, so a portal places both from one position and yaw.
export const stoneWallArchway: MeshBuilder = {
  name: 'stone-wall-archway',
  category: 'structures',
  radius: 1.8,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const opening = rng.range(1.5, 1.9);
    const height = rng.range(2.6, 3.1);
    const pier = rng.range(0.5, 0.64);
    const depth = rng.range(0.54, 0.7);

    const dry = rng.chance(0.4);
    const point = pointing(rng, dry);
    const fill = hearting(rng, dry);
    const colour = stoneColours(rng);
    // Quoins take a smaller bite than a wall pier's: these jambs are narrower,
    // and at the wall's 13 cm there would be no panel left between them.
    const quoin = 0.1;

    for (const side of [-1, 1]) {
      // Always up to the lintel, never short of it: a jamb a few centimetres
      // under its own lintel shows daylight through the joint.
      const shaft = height * rng.range(1, 1.02);
      const stones = quoinedPier(rng, {
        width: pier,
        depth,
        height: shaft,
        quoin,
        stone: rng.range(0.3, 0.38),
        point,
        fill,
        colour,
      });
      for (const part of stones) {
        part.geometry.translate((side * (opening + pier)) / 2, 0, 0);
        parts.push(part);
      }
    }

    // --- the crown -----------------------------------------------------------
    // All of it dressed, so none of it is brown: rubble is whatever came off the
    // field, and the stones carrying the opening were chosen out of one bed.
    const dressed = stoneColours(rng, 0);
    const crownPoint = { ...point, chamfer: 0.04 };

    // An impost across the top of each jamb, standing out of both faces and
    // reaching a little way over the opening — what the arch springs off, and
    // what shortens the span it has to cross.
    const impostH = rng.range(0.13, 0.19);
    const jut = rng.range(0.09, 0.15);
    for (const side of [-1, 1]) {
      const over = (side * opening) / 2 - side * jut;
      const out = (side * (opening + pier * 2.2)) / 2;
      parts.push({
        geometry: roughBox(
          rng,
          over < out ? [over, out] : [out, over],
          [height - impostH, height],
          [(-depth * 1.14) / 2, (depth * 1.14) / 2],
          0.008,
        ),
        color: shade(dressed(), rng.around(1.05, 0.04)),
        sway: 0,
      });
    }

    // The lintel, as a flat arch of wedge stones rather than one slab: a slab across
    // an opening this wide is not a thing anybody could lift, and it reads as a plank
    // laid on two posts. The joints radiate from a centre below the opening, which is
    // how a mason carries a flat head, and the middle stone is a keystone.
    const lintelH = rng.range(0.34, 0.46);
    const reach = (opening + pier * 2.5) / 2;
    const voussoirs = rng.pick([7, 9, 11]);
    // How far below the springing the joints point. Nearer and they splay like a
    // fan; further and they go parallel and it is a row of blocks again.
    const focus = opening * rng.range(1.4, 1.9);
    const splay = reach / (focus + lintelH);
    const camber = rng.range(0.025, 0.055);
    const keyRise = rng.range(0.1, 0.19);

    const soffit = (t: number): number => focus * splay * t;
    const back = (t: number): number => (focus + lintelH) * splay * t;
    const crownAt = (t: number): number => height + lintelH + camber * (1 - t * t);

    for (let i = 0; i < voussoirs; i++) {
      const t0 = -1 + (2 * i) / voussoirs;
      const t1 = -1 + (2 * (i + 1)) / voussoirs;
      const key = i === (voussoirs - 1) / 2 ? keyRise : 0;
      parts.push({
        geometry: throughStone(
          rng,
          [
            { x: soffit(t0), y: height },
            { x: soffit(t1), y: height },
            { x: back(t1), y: crownAt(t1) + key },
            { x: back(t0), y: crownAt(t0) + key },
          ],
          crownPoint,
          depth * rng.range(0.98, 1.04),
          rng.range(0.012, 0.026),
          // Every soffit on one line. Bedding pulls a wedge's underside up by
          // more the taller it is, so the stones over the middle of the opening
          // ride highest and the backing behind them hangs out below.
          height,
        ),
        color: key ? shade(dressed(), rng.around(1.07, 0.04)) : dressed(),
        sway: 0,
      });
    }

    // The course over it, oversailing both faces to throw rain clear, laid
    // outward from the keystone and following the camber under it.
    const dripH = rng.range(0.15, 0.21);
    const dripZ = depth * rng.range(1.16, 1.26);
    const keyHalf = back(1 / voussoirs);

    // What the crown is bedded on, set back inside every stone in it: the voussoirs
    // and the course above are each a joint's width off their neighbours, so with
    // nothing behind them the head of the arch is a comb. Inset by at least what
    // bedding takes off — `throughStone` pulls each outline in by half a joint and
    // wears the corners back — or the backing stands proud at each end of the arch.
    const hide = point.joint / 2 + point.chamfer * reach * 0.1 + 0.03;
    const pull = (x: number): number => x - Math.sign(x) * Math.min(hide, Math.abs(x));

    const backing: Point[] = [
      { x: pull(-soffit(1)), y: height + 0.025 },
      { x: pull(soffit(1)), y: height + 0.025 },
    ];
    for (let i = 8; i >= 0; i--) {
      const t = -1 + i / 4;
      backing.push({ x: pull(back(t)), y: crownAt(t) + dripH * 0.7 });
    }
    parts.push({ geometry: prism(backing, depth * 0.82), color: fill, sway: 0 });

    for (const dir of [-1, 1]) {
      let x = keyHalf;
      while (reach - x > 1e-6) {
        let w = rng.range(0.26, 0.42);
        if (reach - (x + w) < 0.2) w = reach - x;
        w = Math.min(w, reach - x);
        const from = dir < 0 ? -(x + w) : x;
        parts.push({
          geometry: throughStone(
            rng,
            patch(
              from,
              crownAt((from + w / 2) / reach) - rng.range(0.006, 0.018),
              w,
              dripH * rng.range(0.92, 1.06),
            ),
            crownPoint,
            dripZ,
            rng.range(0.01, 0.02),
          ),
          color: dressed(),
          sway: 0,
        });
        x += w;
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'stone-wall-archway', 0);
  },
};
