import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * A workbench with a vice bolted to the front edge.
 *
 * The other place a person stands, and the counterpart to `panel`: that one is
 * where a works is *controlled* and this is where things are actually made. It
 * is also the only piece of industrial furniture at hand height, which matters
 * more than it sounds — a room whose contents are all either floor-level or
 * overhead has no register for a person in it.
 *
 * **The vice is the silhouette.** A bench is a slab on legs, which is a table,
 * and there is already a table in the kit. The one small right-angled lump
 * jutting off the front edge is the entire difference, so it is drawn large
 * and proud rather than tucked in.
 *
 * About half of them have one. A workshop where every bench is fitted alike
 * reads as a showroom; the plain ones are assembly benches, and they are also
 * the ones worth putting something else on.
 *
 * Built facing +Z, standing on y = 0. No random facing: a bench is worked at
 * from one side and the caller decides which.
 */
export const workbench: MeshBuilder = {
  name: 'workbench',
  category: 'furniture',
  radius: 1.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(1.4, 2.1);
    const depth = rng.range(0.6, 0.75);
    // Bench height is nearly a constant in the real world — it is set by where
    // a standing person's hands are, not by taste — so this range is tight.
    const top = rng.range(0.86, 0.92);
    const slab = rng.range(0.06, 0.09);

    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    const timber = shade(PALETTE.TIMBER, rng.range(0.82, 1));

    // --- the top -------------------------------------------------------------
    //
    // Boards rather than one slab, each a shade off its neighbours. A bench top
    // of one flat colour reads as a painted plane however many polygons it has.
    const boards = rng.int(3, 5);
    for (let i = 0; i < boards; i++) {
      const board = new THREE.BoxGeometry(length, slab, (depth / boards) * 0.97);
      board.translate(0, top - slab / 2, -depth / 2 + (depth / boards) * (i + 0.5));
      parts.push({ geometry: board, color: shade(timber, rng.range(0.9, 1.12)), sway: 0 });
    }

    // --- frame ---------------------------------------------------------------
    const legR = rng.range(0.032, 0.045);
    const inset = 0.1;
    // Into the boards, not flush with their underside. `top - slab` is exactly
    // where the boards begin, so a leg that tall ends with its cap in the same
    // plane as the board above it — two coplanar quads that flicker against
    // each other from underneath. Buried a little way into the slab there is
    // nothing coincident, and a bench leg does go into its top.
    const legTop = top - slab * 0.4;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.BoxGeometry(legR * 2, legTop, legR * 2);
        leg.translate(
          (sx * (length - inset * 2)) / 2,
          legTop / 2,
          (sz * (depth - inset * 2)) / 2,
        );
        parts.push({ geometry: leg, color: iron, sway: 0 });
      }
    }

    // A rail low down, and a shelf on some. Anything standing on four thin pins
    // wants tying together, and the eye knows it.
    for (const sz of [-1, 1]) {
      const rail = new THREE.BoxGeometry(length - inset * 2, legR * 1.5, legR * 1.4);
      rail.translate(0, top * 0.22, (sz * (depth - inset * 2)) / 2);
      parts.push({ geometry: rail, color: shade(iron, 0.86), sway: 0 });
    }
    if (rng.chance(0.6)) {
      const shelf = new THREE.BoxGeometry(length - inset * 2.4, 0.03, depth - inset * 2.4);
      shelf.translate(0, top * 0.26, 0);
      parts.push({ geometry: shelf, color: shade(timber, 0.8), sway: 0 });
    }

    // --- the vice ------------------------------------------------------------
    //
    // On the front edge, off to one side — a vice in the middle of a bench is
    // where nobody puts one, because it has to be worked at standing to one
    // side of the job.
    if (!rng.chance(0.5)) {
      const geometry = assemble(parts);
      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, 'workbench', 0, 'wood');
    }

    const vx = length * rng.range(0.2, 0.34) * (rng.chance(0.5) ? 1 : -1);
    const vz = depth / 2;
    const jaw = rng.range(0.13, 0.18);
    const open = rng.range(0.02, 0.12);

    const body = new THREE.BoxGeometry(jaw * 1.1, jaw * 0.85, jaw * 1.5);
    body.translate(vx, top + jaw * 0.42, vz - jaw * 0.35);
    parts.push({ geometry: body, color: shade(iron, 1.1), sway: 0 });

    for (const [z, w] of [[vz + open * 0.5, 1], [vz - open * 0.5 - jaw * 0.28, 0.95]] as const) {
      const face = new THREE.BoxGeometry(jaw * 1.25 * w, jaw * 0.7, jaw * 0.24);
      face.translate(vx, top + jaw * 0.5, z);
      parts.push({ geometry: face, color: shade(iron, 1.2), sway: 0 });
    }

    // The screw and its tommy bar, sticking out over the front of the bench.
    const screw = new THREE.CylinderGeometry(jaw * 0.11, jaw * 0.11, jaw * 1.1, 6);
    screw.rotateX(Math.PI / 2);
    screw.translate(vx, top + jaw * 0.5, vz + jaw * 0.55);
    parts.push({ geometry: screw, color: shade(iron, 1.25), sway: 0 });

    // The tommy bar: through the end of the screw and **across** it.
    //
    // It was built along X and then turned about Y, which swings it in the
    // horizontal plane — so at a quarter turn it lay along the screw's own axis
    // and disappeared into it, and everywhere in between it was skewed. A bar
    // through a screw can only turn in the plane at right angles to that screw,
    // and the screw here runs along Z.
    //
    // Built between two points rather than by rotating a cylinder, so the ends
    // are known and the knobs can be put exactly on them.
    const swing = rng.range(0, Math.PI);
    const half = jaw * 0.8;
    const centre = new THREE.Vector3(vx, top + jaw * 0.5, vz + jaw * 1.02);
    const ends = [-1, 1].map((end) =>
      new THREE.Vector3(
        centre.x + Math.cos(swing) * half * end,
        centre.y + Math.sin(swing) * half * end,
        centre.z,
      ),
    );

    parts.push({ geometry: rod(ends[0], ends[1], jaw * 0.06, jaw * 0.06, 5), color: shade(iron, 1.1), sway: 0 });

    for (const end of ends) {
      const knob = new THREE.IcosahedronGeometry(jaw * 0.085, 0);
      knob.translate(end.x, end.y, end.z);
      parts.push({ geometry: knob, color: shade(iron, 1.2), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'workbench', 0);
  },
};
