import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

// A besom broom, leaning where it was put down — the only diagonal in the room.
// Head up or head down is rolled, and both are right. Built along one axis from a
// floor contact point, every twig a `rod` between a point on that axis and a point
// in the splay.
export const broom: MeshBuilder = {
  name: 'broom',
  category: 'objects',
  radius: 0.4,
  // Leaning in a corner, at the edge of the room. Blocking on it would mean a
  // broom you cannot walk past in a hut two paces wide.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(1.15, 1.45);
    // Built upright, and turned by whoever places it: which way a broom leans is a
    // placement decision, since it has to lean toward the wall it is against.
    const lean = 0;
    const bearing = 0;
    // Always bristles down; turn it over at the placement. Which way up a broom is
    // stored is a decision about the corner it is standing in.
    const bristlesDown = true;

    const handleColor = shade(
      rng.chance(0.5) ? PALETTE.BARK_PALE : PALETTE.TIMBER,
      rng.range(0.9, 1.1),
    );
    const twigColor = rng.pick([PALETTE.LEAF_DRY, PALETTE.GRASS_DRY, PALETTE.BARK]);
    const bindColor = rng.chance(0.6) ? PALETTE.CLOTH : PALETTE.IRON;

    // The axis, as a function of distance from the floor contact point. Every
    // other measurement in this file is a call to it.
    const dir = new THREE.Vector3(
      Math.sin(lean) * Math.cos(bearing),
      Math.cos(lean),
      Math.sin(lean) * Math.sin(bearing),
    );
    const at = (t: number): THREE.Vector3 => dir.clone().multiplyScalar(t);
    // Perpendicular to the axis, at a bearing round it. Used to push twigs and
    // bindings out from the centre line.
    const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 0, 1)).normalize();
    const other = new THREE.Vector3().crossVectors(dir, side).normalize();
    const around = (phi: number, r: number): THREE.Vector3 =>
      side.clone().multiplyScalar(Math.cos(phi) * r).add(other.clone().multiplyScalar(Math.sin(phi) * r));

    const headLength = rng.range(0.26, 0.38);
    const splay = rng.range(0.07, 0.13);
    // Where the head starts and which way its twigs run: from the binding toward
    // the free end. A hand's width of clearance, so a downward splay lands on the
    // floor rather than through it.
    const sign = bristlesDown ? -1 : 1;
    const headFrom = bristlesDown ? headLength + 0.03 : length - headLength;

    // --- handle ---------------------------------------------------------------
    // Runs the whole length and into the head rather than stopping at the binding,
    // or the twigs hang off nothing the moment the splay is rolled wide.
    const buttEnd = bristlesDown ? headLength * 0.35 : 0.0;
    const tipEnd = bristlesDown ? length : length - headLength * 0.35;
    parts.push({
      geometry: rod(at(buttEnd), at(tipEnd), rng.range(0.014, 0.019), rng.range(0.011, 0.015), 6),
      color: handleColor,
      sway: 0,
    });

    // --- twigs ----------------------------------------------------------------
    // Dense and fat: at three-pixel blocks a five-millimetre twig is under a block
    // wide and contributes nothing but cost, and the head is the only part of a
    // besom anybody looks at.
    const twigs = rng.int(24, 34);
    for (let i = 0; i < twigs; i++) {
      // Each twig leaves the handle at its own height. From one point a dozen cone
      // caps share a vertex — and it looks like a firework rather than a bundle.
      const from = at(headFrom + sign * rng.range(0, headLength * 0.35));
      // The jitter has to stay inside the spacing, or two neighbours can be dealt
      // the same angle and, with start heights that also agree, begin at one point
      // with one ring between them.
      const spacing = (Math.PI * 2) / twigs;
      const phi = i * spacing + rng.range(0, spacing * 0.6);
      const reach = rng.range(0.72, 1.05);
      const to = at(headFrom + sign * headLength * reach).add(
        around(phi, splay * rng.range(0.35, 1) * reach),
      );
      // The splay is a cone about a near-upright handle, so half of it points at the
      // floor. Clamping the tips up is also what a brush does in use, which is why a
      // besom's footprint is wider than its bundle.
      to.y = Math.max(to.y, rng.range(0.004, 0.018));
      // Gathered end fatter than the free end, which is what binding a bundle
      // of twigs does to it.
      parts.push({
        // The start radius is rolled per twig as well, so two twigs landing on the
        // same angle and height still do not share a ring.
        geometry: rod(
          from.add(around(phi, rng.range(0.006, 0.011))),
          to,
          rng.range(0.009, 0.014),
          0.005,
          4,
        ),
        color: shade(twigColor, rng.range(0.82, 1.18)),
        sway: 0,
      });
    }

    // --- bindings -------------------------------------------------------------
    //
    // Two withies round the gathered end. They are the reason the twigs read as
    // one head instead of a smear, and at three pixels a block they may be the
    // only part of the head that survives as an edge.
    for (const t of [rng.range(0.02, 0.08), rng.range(0.18, 0.3)]) {
      const centre = headFrom + sign * headLength * t;
      const band = rng.range(0.015, 0.024);
      parts.push({
        geometry: rod(
          at(centre - band),
          at(centre + band),
          rng.range(0.028, 0.036),
          rng.range(0.028, 0.036),
          8,
        ),
        color: shade(bindColor, rng.range(0.9, 1.1)),
        sway: 0,
      });
    }


    // Lifted clear of the floor: a broom is placed by whatever it leans on, and a
    // builder that plants itself exactly on y = 0 forces every caller to sink it.
    for (const part of parts) part.geometry.translate(0, 0.02, 0);

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'broom', 0);
  },
};
