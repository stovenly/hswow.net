import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A stack of hay bales, built the way a person builds one: level full courses,
// every bale the same way round from the ground up, narrowing as it rises by a
// bale where the top course is short. The only things rolled per bale are a
// centimetre or two of position and a degree or two of yaw. Built along +X,
// standing on y = 0, centred on its own footprint.
export const hayBaleStack: MeshBuilder = {
  name: 'hay-bale-stack',
  category: 'objects',
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const straw = shade(PALETTE.GRASS_DRY, rng.range(1.02, 1.18));
    const cord = shade(PALETTE.HIDE, rng.range(0.8, 1));

    // One size for the whole stack. Bales come off one baler; a stack of
    // different-sized ones is a stack that would not stand up.
    const length = rng.range(0.88, 1.02);
    const width = length * rng.range(0.46, 0.56);
    const tall = length * rng.range(0.44, 0.54);

    // How many along a course, and how many courses. A course is at least two
    // — one bale on its own is `hay-bale`.
    const along = rng.int(2, 3);
    const courses = rng.int(2, 3);

    /** One bale, standing at the origin, laid along +X. */
    const bale = (l: number, w: number, h: number): { pieces: THREE.BufferGeometry[]; colours: number[] } => {
      const pieces: THREE.BufferGeometry[] = [];
      const colours: number[] = [];

      const body = new THREE.BoxGeometry(l, h, w);
      body.translate(0, h / 2, 0);
      pieces.push(body);
      colours.push(shade(straw, rng.around(1, 0.06)));

      // Two cords round the short way, standing proud so they catch the light
      // separately from the straw.
      for (const at of [-0.26, 0.26]) {
        const band = new THREE.BoxGeometry(0.035, h * 1.02, w * 1.03);
        band.translate(l * at, h / 2, 0);
        pieces.push(band);
        colours.push(cord);
      }

      // Loose straw out of the cut ends — silhouette work and nothing else.
      for (let s = rng.int(1, 3); s > 0; s--) {
        const out = rng.range(0.05, 0.13);
        const side = rng.chance(0.5) ? 1 : -1;
        const wisp = new THREE.ConeGeometry(rng.range(0.008, 0.016), out, 3);
        wisp.rotateZ(-side * (Math.PI / 2) + rng.around(0, 0.5));
        wisp.translate((side * l) / 2 + side * out * 0.4, h * rng.range(0.2, 0.85), rng.around(0, w * 0.35));
        pieces.push(wisp);
        colours.push(shade(straw, rng.range(1.05, 1.2)));
      }

      return { pieces, colours };
    };

    let y = 0;
    // Courses shorten as they rise, and never by half a bale.
    let count = along;
    for (let course = 0; course < courses && count > 0; course++) {
      // **Every course laid the same way**: bales along +X, cut ends out along
      // ±X, no course turned relative to any other.
      const run = (count - 1) * length;

      for (let i = 0; i < count; i++) {
        const at = -run / 2 + i * length;
        const built = bale(length, width, tall * rng.range(0.97, 1.03));
        for (let k = 0; k < built.pieces.length; k++) {
          const piece = built.pieces[k];
          // A degree or two, and a centimetre or two. Nothing more.
          piece.rotateY(rng.around(0, 0.035));
          piece.translate(at + rng.around(0, 0.02), y, rng.around(0, 0.025));
          parts.push({ geometry: piece, color: built.colours[k], sway: 0 });
        }
      }

      // Settled onto the course below rather than balanced on it.
      y += tall * rng.range(0.96, 1);
      // Shorter above, and only ever by a whole bale.
      if (rng.chance(0.55)) count -= 1;
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hay-bale-stack', 0);
  },
};
