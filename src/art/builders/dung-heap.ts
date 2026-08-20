import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, blend, shade } from '../palette';

// A dung heap: the muck from the byre, piled up to rot down. Flat-topped and
// steep-sided, because muck is forked up from one side and trodden — a cone reads
// as something poured. Layered dark at the bottom, since a heap rots from the
// inside out, with straw broken through the surface everywhere. Boards along the
// sides hold it in: a heap somebody retains is a store rather than a mess.
export const dungHeap: MeshBuilder = {
  name: 'dung-heap',
  category: 'objects',
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const long = rng.range(1.5, 2.2);
    const wide = long * rng.range(0.6, 0.8);
    const tall = rng.range(0.55, 0.85);
    const sides = 9;

    // Dark and rotted at the foot, paler and strawy on top.
    const rotted = shade(blend(PALETTE.EARTH, 0x1e1a14, 0.55), rng.range(0.9, 1.1));
    const fresh = blend(PALETTE.EARTH, PALETTE.GRASS_DRY, rng.range(0.35, 0.55));
    const straw = shade(PALETTE.GRASS_DRY, rng.range(0.92, 1.08));
    const board = shade(PALETTE.TIMBER_DARK, rng.range(0.82, 0.95));

    /** Dark below, strawy on top, with a little wobble so it is not a ramp. */
    const weather = (_x: number, y: number, _z: number): number =>
      shade(blend(rotted, fresh, Math.min(1, Math.max(0, y / tall)) ** 0.8), rng.range(0.94, 1.06));

    // The mound: a lathe with a flat top and steep sides, stretched along X so it
    // is a bank rather than a cone. The profile is stated once and everything reads
    // it — the lumps and the straw are sited on the mound's own surface, and an
    // approximated taper runs inside the real curve and buries them.
    const STOPS: readonly (readonly [number, number])[] = [
      [0, 0.5],
      [0.45, 0.47],
      [0.82, 0.36],
      [1, 0.2],
    ];
    const stretch = (long / wide) * rng.range(0.95, 1.05);
    /** The mound's own radius at a height, in the lathe's frame. */
    const radiusAt = (t: number): number => {
      const u = Math.min(1, Math.max(0, t));
      for (let i = 1; i < STOPS.length; i++) {
        if (u <= STOPS[i][0]) {
          const [y0, r0] = STOPS[i - 1];
          const [y1, r1] = STOPS[i];
          return (r0 + ((r1 - r0) * (u - y0)) / (y1 - y0)) * wide;
        }
      }
      return STOPS[STOPS.length - 1][1] * wide;
    };

    const profile = [
      new THREE.Vector2(0, 0),
      ...STOPS.map(([t, r]) => new THREE.Vector2(r * wide, t * tall)),
      new THREE.Vector2(0, tall * rng.range(0.98, 1.02)),
    ];
    const mound = new THREE.LatheGeometry(profile, sides);
    mound.scale(stretch, 1, 1);
    // Not turned. The boards, the stakes, the lumps and the straw are all sited
    // against a profile that assumes the stretch is still on X, so a yaw here would
    // swing the heap out from under its own boards. The prop is placed by hand.
    parts.push({ geometry: mound, color: weather, sway: 0 });

    // Lumps forked onto it, breaking the outline. On the mound's own surface rather
    // than near it: each sits at a height and is pulled in to the radius the profile
    // has there.
    /**
     * Which way round the mound a forkful lands: toward the open ends, never the
     * boarded flanks. A lump straddling the surface sticks out by its own radius,
     * and anything sited on a long side comes through the board.
     */
    const openEnd = (): number => (rng.chance(0.5) ? 0 : Math.PI) + rng.around(0, 0.85);

    // Straddling the surface: centred just inside it, so each lump is half
    // buried and half proud. That is where a forkful lands and it is the only
    // placement that both shows and holds.
    for (let i = rng.int(4, 8); i > 0; i--) {
      const t = rng.range(0.15, 0.9);
      const at = tall * t;
      const skin = radiusAt(t) * rng.range(0.82, 0.98);
      const around = openEnd();
      const size = rng.range(0.1, 0.22);
      const lump = new THREE.IcosahedronGeometry(size, 0);
      lump.scale(rng.range(1, 1.5), rng.range(0.5, 0.8), rng.range(0.9, 1.3));
      lump.rotateY(rng.range(0, Math.PI * 2));
      lump.translate(Math.cos(around) * skin * stretch, at, Math.sin(around) * skin);
      parts.push({ geometry: lump, color: weather, sway: 0 });
    }

    // Straw out of the surface, in the same way and for the same reason.
    for (let i = rng.int(8, 14); i > 0; i--) {
      const t = rng.range(0.06, 0.92);
      const at = tall * t;
      // Rooted a little under the surface, so the stalk comes out of the heap
      // rather than lying against it.
      const skin = radiusAt(t) * rng.range(0.86, 0.96);
      const around = openEnd();
      const out = rng.range(0.08, 0.2);
      const wisp = new THREE.ConeGeometry(rng.range(0.008, 0.017), out, 3);
      wisp.rotateZ(rng.range(0.5, 1.5));
      wisp.rotateY(around);
      wisp.translate(Math.cos(around) * skin * stretch, at, Math.sin(around) * skin);
      parts.push({ geometry: wisp, color: shade(straw, rng.range(0.9, 1.1)), sway: 0 });
    }

    // The boards that hold it in, along the two long sides and let into the ground.
    // Not all round: you have to be able to get at it with a fork. Set at four
    // tenths of the width — deep inside the heap at ground level — and tall enough
    // that the top half stands out in the air where the mound has narrowed away.
    const boardT = 0.06;
    for (const side of [-1, 1]) {
      // The board's outer face is past the mound's widest point, which is the whole
      // purpose of it. The mound reaches `wide × 0.5` at the ground and narrows
      // above that, so the inner face goes at 0.44 and the 6 cm of board takes the
      // outer face to exactly 0.5, where the muck stops.
      const at = side * (wide * 0.44 + boardT / 2);
      const high = tall * rng.range(0.75, 0.95);
      // Longer than the heap, so the muck cannot get round the ends of it
      // either. The mound reaches `wide × 0.5 × stretch` along X, and `stretch`
      // is `long / wide` give or take, so that is very nearly `long`.
      const plankLong = long * rng.range(1.06, 1.18);
      const slide = rng.around(0, long * 0.05);
      const plank = new THREE.BoxGeometry(plankLong, high, boardT);
      plank.rotateZ(rng.around(0, 0.02));
      plank.rotateY(rng.around(0, 0.04));
      plank.translate(slide, high * 0.4, at);
      parts.push({ geometry: plank, color: shade(board, rng.range(0.94, 1.06)), sway: 0 });

      // A stake at each end holding the board up, driven into the ground. Measured
      // off the board, not off the heap, or a short board and a far stake put the
      // stake past the end of the thing it is holding.
      for (const end of [-1, 1]) {
        const stake = new THREE.BoxGeometry(0.07, high * 1.25, 0.07);
        stake.rotateZ(rng.around(0, 0.05));
        stake.translate(slide + end * plankLong * rng.range(0.36, 0.44), high * 0.45, at);
        parts.push({ geometry: stake, color: shade(board, 0.9), sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'dung-heap', 0);
  },
};
