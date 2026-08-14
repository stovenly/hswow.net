import type { MeshBuilder } from '../types';
import { finish } from '../assemble';
import { createRng } from '../random';
import { crate } from './crate';
import { piece, sizeOf, settle, pileUp, type Piece } from '../stack';

/**
 * A stack of crates: goods set down where a lane runs out.
 *
 * **No new geometry at all.** This is `crate`, four or five times, arranged into
 * something the player has to walk round — see `art/stack.ts` for why a second
 * definition of a crate would have been the worst way to get that. A crate is
 * already a good object; what the kit was missing was a *reason for several of
 * them to be in one place*, which is a placement problem wearing a builder's
 * clothes.
 *
 * It earns being a builder rather than four separately placed crates for the
 * same reason `cairn` does: the arrangement *is* the object. A cairn is not five
 * rocks, it is a stack, and stacking is the whole content — same here. Big ones
 * underneath, squared up but not square, one set down beside the pile rather
 * than on it.
 *
 * **Which is also the line.** This makes a pile; it does not decide whether
 * there is a pile, where it goes or which way it faces. If what is wanted is
 * three crates in a particular arrangement, place three crates — `crate` is
 * still there and is the same object this is built out of.
 *
 * ## Big ones at the bottom, and it is measured rather than assumed
 *
 * `crate` rolls its own size class, from a 0.4 m box to a 2.6 m one, so nothing
 * here can know how large a piece is until it has built it. Every crate is
 * therefore built first, sorted by how much room it takes, and laid out from the
 * measurements — which is also what lets the upper course sit exactly on top of
 * the lower one instead of at a guessed pitch that the rare huge roll would
 * break.
 */
export const crateStack: MeshBuilder = {
  name: 'crate-stack',
  category: 'objects',
  radius: 2.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const count = rng.int(3, 6);
    const built: Piece[] = [];
    for (let i = 0; i < count; i++) {
      built.push(piece(crate, { seed: rng.int(1, 0x7fffffff) }));
    }
    // Heaviest first. Anyone stacking anything does this, and it is the only
    // reason a pile of boxes reads as stacked rather than as heaped.
    built.sort((a, b) => sizeOf(b).width * sizeOf(b).depth - sizeOf(a).width * sizeOf(a).depth);

    // The ground course, laid along X. The footprint is taken as the larger of
    // width and depth, because `settle` turns each crate about its own axis
    // afterwards and a box on the diagonal needs the room its diagonal wants.
    //
    // Three at most. `crate`'s largest class is 2.6 m across, so four in a line
    // is nine metres of prop — a fence made of crates rather than a stack, and
    // well past the spacing radius a placer is working to.
    const base = Math.max(2, Math.min(built.length, rng.int(2, 3)));
    const placed: Piece[] = [];
    // Which crates still have a clear top. A crate that has had something set
    // on it is out, or two upper-course boxes pick the same one and grow
    // through each other — the bug this list exists to prevent.
    const open: Piece[] = [];
    let x = 0;
    let widest = 0;

    for (let i = 0; i < base; i++) {
      const item = built[i];
      const { width, depth, height } = sizeOf(item);
      const room = Math.max(width, depth);
      if (i > 0) x += widest / 2 + room / 2 + rng.range(0.02, 0.14);
      widest = room;
      placed.push(settle(item, rng, x, 0, rng.around(0, room * 0.18), 0.035));
      // Remember where the top of this one is, for anything going on it.
      item.mesh.userData.top = height;
      open.push(item);
    }

    // The upper course, each on top of a crate already down and never
    // overhanging by much — a box balanced on a corner reads as a physics bug.
    for (let i = base; i < built.length; i++) {
      const item = built[i];
      const room = Math.max(sizeOf(item).width, sizeOf(item).depth);
      // Only onto something it will actually sit on. A crate wider than the one
      // under it goes on the ground beside the pile instead, which is a
      // perfectly ordinary thing for a crate to do.
      const seat = open.findIndex(
        (under) => room <= Math.max(sizeOf(under).width, sizeOf(under).depth) * 1.05,
      );

      if (seat >= 0) {
        const under = open.splice(seat, 1)[0];
        const top = under.mesh.userData.top as number;
        placed.push(
          settle(
            item,
            rng,
            under.mesh.position.x + rng.around(0, room * 0.12),
            top * rng.range(0.97, 1),
            under.mesh.position.z + rng.around(0, room * 0.12),
            0.05,
          ),
        );
        item.mesh.userData.top = top + sizeOf(item).height;
        open.push(item);
      } else {
        const bearing = rng.range(0, Math.PI * 2);
        const out = widest * rng.range(0.9, 1.4);
        placed.push(
          settle(item, rng, x / 2 + Math.cos(bearing) * out, 0, Math.sin(bearing) * out, 0.035),
        );
        item.mesh.userData.top = sizeOf(item).height;
        open.push(item);
      }
    }

    // Centred on the pile rather than on the first crate laid, so the object's
    // origin is where a placer would expect it.
    const geometry = pileUp(placed);
    geometry.translate(-x / 2, 0, 0);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'crate-stack', 0);
  },
};
