import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A log pile: cut firewood stacked between two stakes.
 *
 * **The classic yard wall, and the cheapest thing on this list that reads as
 * worked ground on sight.** A boulder says nobody has been here; a stack of split
 * logs says somebody comes out here with an axe, and it does it at about two
 * hundred triangles for two metres of solid, opaque, waist-high boundary. Against
 * a house wall it dresses a yard; across the end of a lane it closes it.
 *
 * ## The cut ends are the whole read
 *
 * A log pile seen from the side is a heap of sticks. Seen from the end — which is
 * how it is always stacked, because that is the only way it stays up — it is a
 * wall of pale discs in a dark frame, and that pattern is unmistakable at any
 * distance the prop is worth drawing at.
 *
 * So the logs run **along Z, into the pile**, and the colouring is a function of
 * position: faces out at the ends take sawn timber, everything between takes
 * bark. `Part.color` is evaluated once per face at its centroid, so the change
 * lands on the ring of facets where the cap meets the barrel and comes out as a
 * hard edge rather than a gradient.
 *
 * ## The packing
 *
 * Six-sided logs all turned to the same angle, on the honeycomb lattice those
 * hexagons tile: neighbours `r√3` apart, which is twice the apothem rather than
 * twice the radius. Rows step `1.5r` up and alternate rows shift half the
 * across-pitch.
 *
 * **Nothing is rotated and every log is the same size.** A log at its own angle
 * cannot tessellate with the one beside it, and a slot cut for the nominal
 * radius with a smaller log in the middle of it is a log touching nothing. What
 * varies is length, colour and which end shows sawn wood.
 *
 * The stakes at either end are what makes the packing legible.
 *
 * Built across **+X** with the logs running along Z, standing on y = 0.
 */
export const logPile: MeshBuilder = {
  name: 'log-pile',
  category: 'objects',
  radius: 1.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const span = rng.range(1.3, 2);
    const long = rng.range(0.45, 0.72);
    // Chunky on purpose. Firewood is split, not sawn to a dowel — and a stack
    // of thin rounds costs twenty triangles a log for a cut face three pixels
    // across. Bigger logs mean fewer of them for the same wall.
    const log = rng.range(0.11, 0.16);
    const rows = rng.int(3, 5);
    const bark = rng.chance(0.45) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const sawn = shade(PALETTE.TIMBER_PALE, rng.range(0.88, 1.02));
    const stake = shade(PALETTE.TIMBER_DARK, rng.range(0.92, 1.06));

    // Opened a tenth: on the exact lattice the flats meet along their whole
    // length, which reads as one solid scored into hexagons rather than as logs.
    const TIGHT = 1.1;
    /** How far off true a log may sit. Well under the gap, so none can touch. */
    const SLOP = 0.03;
    const acrossPitch = log * Math.sqrt(3) * TIGHT;
    const upPitch = log * 1.5 * TIGHT;

    // `CylinderGeometry`'s first vertex is on +Z, so after the quarter turn that
    // lays a log along Z there is a vertex top and bottom — which is the phase
    // whose flats face the six lattice neighbours. No correction, and none may
    // be applied.
    const facets = 6;

    // The stakes. Driven in a little past the ends of the stack and leaning
    // outward, which is what they do once a stack has been leaning on them for
    // a winter.
    const stand = log * 0.94 + (rows - 1) * upPitch + log + rng.range(0.12, 0.3);
    for (const side of [-1, 1]) {
      for (const at of [-long * 0.34, long * 0.34]) {
        const post = new THREE.CylinderGeometry(0.045, 0.06, stand, 4);
        post.translate(0, stand / 2, 0);
        post.rotateZ(side * rng.range(0.03, 0.1));
        post.translate((side * span) / 2 + side * log * 0.95, 0, at);
        parts.push({ geometry: post, color: shade(stake, rng.around(1, 0.07)), sway: 0 });
      }
    }

    for (let row = 0; row < rows; row++) {
      // Half the across-pitch on alternate rows, so each log drops into the
      // valley between two below rather than balancing on one.
      const stagger = (row % 2) * (acrossPitch / 2);
      // The bottom row sits on a vertex rather than a flat, so it is let into
      // the ground by a hair — which is where a bottom log ends up anyway.
      const y = log * 0.94 + row * upPitch;
      // Rows get shorter toward the top: the ends of a stack slump.
      const reach = span * (1 - (row / rows) * rng.range(0.05, 0.22));

      for (let x = -reach / 2 + stagger; x <= reach / 2 - log * 0.8; x += acrossPitch) {
        // One radius for the whole pile, and no roll — see the header.
        // Everything that varies here is something that cannot open a gap.
        const length = long * rng.range(0.9, 1.05);
        const barrel = new THREE.CylinderGeometry(log, log, length, facets);
        // Laid along Z, ends facing out. **Not rolled about its own axis** — see
        // the header; the packing depends on every log presenting the same flats.
        barrel.rotateX(Math.PI / 2);
        const seat = rng.around(0, long * 0.05);
        // Off true by a few millimetres in the plane of the stack, which is what
        // makes it a pile somebody built rather than a lattice.
        barrel.translate(
          x + rng.around(0, log * SLOP),
          y + rng.around(0, log * SLOP),
          seat,
        );
        // Measured from where this log actually ended up, not from the origin:
        // the cut faces are a fixed distance along its own axis, and a log that
        // has been nudged 3 cm along must not lose one of them to a test that
        // assumes it did not move.
        const end = (length / 2) * 0.86;
        parts.push({
          geometry: barrel,
          // Sawn where the face is out at either end, bark everywhere else.
          color: (_cx, _cy, cz) =>
            Math.abs(cz - seat) > end
              ? shade(sawn, rng.range(0.92, 1.08))
              : shade(bark, rng.range(0.88, 1.1)),
          sway: 0,
        });
      }
    }

    // A few that have rolled off, at the foot. Lying any which way, because
    // that is the difference between the stack and what has left it.
    for (let i = rng.int(1, 3); i > 0; i--) {
      // These are the only ones allowed a size of their own: nothing is resting
      // on them, so nothing can be left hanging by it.
      const radius = log * rng.range(0.8, 1.1);
      const length = long * rng.range(0.85, 1.05);
      const yaw = rng.range(0, Math.PI * 2);
      const at = {
        x: rng.range(-span * 0.6, span * 0.6),
        z: rng.range(long * 0.6, long * 1.4) * (rng.chance(0.5) ? 1 : -1),
      };
      const loose = new THREE.CylinderGeometry(radius, radius, length, 5);
      loose.rotateZ(Math.PI / 2);
      loose.rotateY(yaw);
      loose.translate(at.x, radius * 0.92, at.z);
      // Along the log's own axis, which a yaw about Y makes exact. The stacked
      // ones can get away with testing Z because they all point the same way;
      // a log that has rolled away points wherever it stopped.
      const ax = Math.cos(yaw);
      const az = -Math.sin(yaw);
      const end = (length / 2) * 0.8;
      parts.push({
        geometry: loose,
        color: (cx, _cy, cz) =>
          Math.abs((cx - at.x) * ax + (cz - at.z) * az) > end ? sawn : bark,
        sway: 0,
      });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'log-pile', 0);
  },
};
