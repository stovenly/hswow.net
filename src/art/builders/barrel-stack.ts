import type { MeshBuilder } from '../types';
import { finish } from '../assemble';
import { createRng } from '../random';
import { barrel } from './barrel';
import { piece, sizeOf, pileUp, type Piece } from '../stack';

/**
 * A stand of barrels: a cellar's worth set out in a yard.
 *
 * `crate-stack`'s argument applied to the other movable good — the object is
 * `barrel`, several times over, and what is new is the arrangement. See
 * `art/stack.ts`.
 *
 * ## Barrels stack upright. That is the whole of it.
 *
 * A cask is coopered to stand on its end: the heads are flat, the staves are
 * bellied, and the only two faces it will sit still on are the two ends. So a
 * stand of them is upright barrels side by side, and a second course is upright
 * barrels on top of the first — end to end, head on head.
 *
 * They do **not** stack on their sides. A barrel on its side is a barrel that
 * has fallen over or is being rolled somewhere; it lies on the ground, on its
 * own, and nothing goes on top of it. The first version laid one across the
 * hollow between two others like a wine rack, which is a thing that exists and
 * needs a rack to exist in — without one it is a cask balanced on two curves,
 * and it also clipped straight through both of them.
 *
 * ## Two arrangements
 *
 * **A row.** Two or three standing in a line against a wall, sometimes with one
 * on top of one of them.
 *
 * **A quad.** Two by two, which is how you actually stand four in a corner, with
 * one or two more on the heads above. This is the one that reads as *stock* — a
 * square block of casks is a quantity, where a line of them is a few barrels.
 *
 * ## Nothing overlaps, and it is measured rather than trusted
 *
 * `barrel` rolls its own girth and its own height, so no two are the same and
 * nothing here can know the size of one until it has built it. Every gap is
 * therefore taken from the two bounding boxes either side of it — half of each,
 * plus a little — and every barrel put on top of another is seated at the
 * measured height of the one under it. Guessing a pitch is what had them growing
 * through each other.
 *
 * **The second course goes on the tallest cask on the ground, and only there.**
 * Not because it looks better but because it is the only choice that cannot
 * clash: a cask stacked on a short one starts below the tops of its neighbours,
 * and since a stack is packed as tightly as the girths allow, "below their tops"
 * and "inside them" are the same thing. Casks vary by a third in height, so this
 * happened often. Seating it on the tallest puts its foot at or above every
 * other top in the group, and the question cannot arise.
 *
 * That is also why there is one on top rather than two. A second would have to
 * sit on the second-tallest, which is exactly the case that clashes.
 */
export const barrelStack: MeshBuilder = {
  name: 'barrel-stack',
  category: 'objects',
  radius: 2.1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const placed: Piece[] = [];

    /**
     * Widest across the plan, which is what two neighbours have to clear.
     *
     * The gaps built from this are a good six centimetres rather than the two
     * they started at. Two casks a couple of centimetres apart are two casks
     * that read as touching, and at that distance nothing downstream — a
     * collision hull, a shadow, an eye at three metres — can tell "just clear"
     * from "just clipping". A finger's width of daylight says on sight that
     * nobody stacked them into each other.
     */
    const across = (item: Piece): number => {
      const { width, depth } = sizeOf(item);
      return Math.max(width, depth);
    };

    /** An upright cask, set down flat and turned about its own axis. */
    const stand = (x: number, y: number, z: number): Piece => {
      const item = piece(barrel, { seed: rng.int(1, 0x7fffffff), fallen: false });
      item.mesh.position.set(x, y, z);
      // Turned only. **No lean at all** — a cask stands on a flat head, and one
      // tipped even a couple of degrees is a cask about to go over, which is a
      // different object and one nothing may be stacked on.
      item.mesh.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      placed.push(item);
      return item;
    };

    /** The tallest cask on the ground — the only one anything may be set on. */
    const tallest = (of: readonly Piece[]): Piece =>
      of.reduce((best, item) => (sizeOf(item).height > sizeOf(best).height ? item : best));

    const quad = rng.chance(0.45);

    if (quad) {
      // --- two by two, and one or two on the heads -------------------------
      //
      // Built in two passes: stand the four, then measure the block. The gap is
      // set from the widest of the four so no pair of them can touch, since a
      // grid pitch taken from an average is a grid where the two biggest clip.
      const corners = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ] as const;
      const first = stand(0, 0, 0);
      let pitch = across(first) + rng.range(0.06, 0.13);
      const four: Piece[] = [first];
      for (let i = 1; i < 4; i++) four.push(stand(0, 0, 0));
      // Now that all four exist, the pitch can clear the widest of them.
      for (const item of four) pitch = Math.max(pitch, across(item) + 0.06);

      four.forEach((item, i) => {
        item.mesh.position.set((corners[i][0] * pitch) / 2, 0, (corners[i][1] * pitch) / 2);
      });

      // One on top, on the head of the tallest of the four — see the header for
      // why it cannot be any of the others. Over a corner rather than the middle
      // of the block: a cask sits on a head, not on the gap between four rims.
      const on = tallest(four);
      stand(on.mesh.position.x, sizeOf(on).height * rng.range(0.985, 1), on.mesh.position.z);
    } else {
      // --- a row, sometimes with one on top --------------------------------
      const many = rng.int(2, 3);
      const row: Piece[] = [];
      let x = 0;
      let last = 0;
      for (let i = 0; i < many; i++) {
        const item = stand(0, 0, 0);
        const room = across(item);
        if (i > 0) x += last / 2 + room / 2 + rng.range(0.06, 0.13);
        last = room;
        item.mesh.position.set(x, 0, rng.around(0, room * 0.12));
        row.push(item);
      }

      if (rng.chance(0.6)) {
        const on = tallest(row);
        stand(on.mesh.position.x, sizeOf(on).height * rng.range(0.985, 1), on.mesh.position.z);
      }
      // Centre the row on the origin.
      for (const item of row) item.mesh.position.x -= x / 2;
      for (const item of placed) if (!row.includes(item)) item.mesh.position.x -= x / 2;
    }

    // One that has been knocked over, lying on the ground clear of the rest.
    // Not part of the stack and never under it — see the header.
    //
    // **Cleared against the group as measured, not against a number that stood
    // for it.** The quad's clearance was taken from its grid pitch, which is the
    // distance between two corner *centres* and says nothing about how far the
    // casks on those corners reach — so the loose one was put down half a metre
    // inside the block and ran straight through two of them. The reach of a
    // group is the reach of the furthest thing in it, and the only way to know
    // that is to ask each of them.
    if (rng.chance(0.45)) {
      const item = piece(barrel, { seed: rng.int(1, 0x7fffffff), fallen: true });

      // How far the group reaches: to the **corner** of the furthest cask's
      // box, not to its centre plus half a width. Those differ by a factor of
      // √2 on a two-by-two block, which is most of a barrel.
      let reach = 0;
      for (const other of placed) {
        const at = other.mesh.position;
        const half = across(other) / 2;
        reach = Math.max(reach, Math.hypot(Math.abs(at.x) + half, Math.abs(at.z) + half));
      }

      // **A fallen cask is not centred on its own origin.** `barrel` tips it
      // about the origin and leaves it lying off to one side, by up to half its
      // own length — so setting `position` puts the *origin* where asked and the
      // cask somewhere else entirely. Placing it by its origin is what had it
      // lying inside the block it was supposed to be clear of.
      //
      // So: work out where its middle actually is, and offset the placement by
      // that, turned the same way the cask is.
      const yaw = rng.range(0, Math.PI * 2);
      const midX = (item.box.min.x + item.box.max.x) / 2;
      const midZ = (item.box.min.z + item.box.max.z) / 2;
      const spin = Math.cos(yaw);
      const tilt = Math.sin(yaw);
      const offX = midX * spin + midZ * tilt;
      const offZ = -midX * tilt + midZ * spin;
      // Half its own diagonal about that middle — invariant under the yaw.
      const half = Math.hypot(item.box.max.x - midX, item.box.max.z - midZ);

      const bearing = rng.range(0, Math.PI * 2);
      const clear = reach + half + rng.range(0.05, 0.3);
      item.mesh.position.set(
        Math.cos(bearing) * clear - offX,
        0,
        Math.sin(bearing) * clear - offZ,
      );
      item.mesh.rotation.set(0, yaw, 0);
      placed.push(item);
    }

    const geometry = pileUp(placed);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'barrel-stack', 0);
  },
};
