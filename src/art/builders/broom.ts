import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * A besom broom, leaning where it was put down.
 *
 * **The only diagonal in the room.** Everything else indoors is built out of
 * verticals and horizontals — that is what furniture is — so a single stick at
 * fifteen degrees off plumb does more for a room than its four hundred
 * triangles have any right to. It is also the clearest possible statement that
 * somebody was here ten minutes ago: a broom in a corner is a job interrupted,
 * where a broom lying flat on the floor is a broom nobody owns.
 *
 * Head up or head down is rolled, and both are right. Bristles down is a broom
 * mid-sweep, propped for a moment; bristles up is a broom put away properly,
 * because standing one on its brush bends the twigs and every house that owned
 * one knew it.
 *
 * The whole thing is built along one axis from a floor contact point, and every
 * twig is a `rod` between a point on that axis and a point in the splay. The
 * alternative — a cone of cylinders each rotated into place — is the exact
 * pattern `rod` was written to replace, and a besom is forty chances to get it
 * wrong.
 */
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
    // Past about twenty degrees a leaning stick stops reading as propped and
    // starts reading as falling.
    // **Built upright, and turned by whoever places it.**
    //
    // This used to roll its own lean and its own compass bearing, so every
    // instance arrived already tipped in some arbitrary direction. That is a
    // placement decision, not a property of the object — a broom leaning
    // against a wall has to lean *toward that wall*, and a builder that has
    // already chosen for you cannot be made to. Everything rolled here now is
    // something about the broom itself.
    const lean = 0;
    const bearing = 0;
    // **No orientation roll at all.** This used to flip head-up or head-down.
    // Same reason the lean and the bearing went: which way up a broom is stored
    // is a decision about the corner it is standing in, and a builder that has
    // already made it cannot be overridden. Always bristles down; turn it over
    // at the placement if you want it the other way.
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
    // Where the head starts and which way its twigs run: from the binding
    // toward the free end, whichever end that is. A hand's width of clearance
    // at the bottom, so a downward splay lands on the floor rather than
    // through it.
    const sign = bristlesDown ? -1 : 1;
    const headFrom = bristlesDown ? headLength + 0.03 : length - headLength;

    // --- handle ---------------------------------------------------------------
    //
    // Runs the whole length and *into* the head rather than stopping at the
    // binding. A handle that ends where the twigs begin leaves the twigs
    // hanging off nothing the moment the splay is rolled wide.
    const buttEnd = bristlesDown ? headLength * 0.35 : 0.0;
    const tipEnd = bristlesDown ? length : length - headLength * 0.35;
    parts.push({
      geometry: rod(at(buttEnd), at(tipEnd), rng.range(0.014, 0.019), rng.range(0.011, 0.015), 6),
      color: handleColor,
      sway: 0,
    });

    // --- twigs ----------------------------------------------------------------
    // **Denser and fatter.** Thirteen to twenty thin rods read as a bundle of
    // sticks rather than as a brush — barren was the word — and the head is the
    // only part of a besom anybody looks at. More of them, and each one thicker
    // through, because at three-pixel blocks a five-millimetre twig is under a
    // block wide and contributes nothing but cost.
    const twigs = rng.int(24, 34);
    for (let i = 0; i < twigs; i++) {
      // Each twig leaves the handle at its own height. Starting them all from
      // one point would put a dozen cone caps through the same vertex, which is
      // the "many parts sharing one origin" failure — and it also looks like a
      // firework rather than a bundle.
      const from = at(headFrom + sign * rng.range(0, headLength * 0.35));
      // **The jitter has to stay inside the spacing.** It was a flat 0.5 rad
      // against a spacing of 2π/twigs, which for twenty twigs is 0.31 — so two
      // neighbours could be dealt the same angle, and with independent start
      // heights that also happened to agree they began at one point with one
      // 4-gon ring between them. Three of that ring's four edges then carried
      // four triangles. Seed 591 of the first 1500, which is exactly the kind
      // of thing four canonical seeds never see and a player eventually does.
      const spacing = (Math.PI * 2) / twigs;
      const phi = i * spacing + rng.range(0, spacing * 0.6);
      const reach = rng.range(0.72, 1.05);
      const to = at(headFrom + sign * headLength * reach).add(
        around(phi, splay * rng.range(0.35, 1) * reach),
      );
      // The splay is a cone about the handle, and the handle is nearly upright,
      // so half of that cone points at the floor. Clamping the tips up to it
      // rather than letting them through is also what a brush does in use: the
      // twigs on the low side bend and lie flat, which is why a besom's
      // footprint is wider than its bundle.
      to.y = Math.max(to.y, rng.range(0.004, 0.018));
      // Gathered end fatter than the free end, which is what binding a bundle
      // of twigs does to it.
      parts.push({
        // The start radius is rolled per twig as well, as a second and
        // independent guard: even if two twigs did land on the same angle and
        // the same height, they would still not share a ring. Belt and braces
        // is right here — the failure is invisible until it is in front of
        // somebody, and a bundle of twigs is meant to be irregular anyway.
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

    // **Nothing shed on the floor.** There were two or three loose twigs
    // scattered at the foot, as the difference between a broom stored here and
    // a broom used here. It is scenery attached to a prop: the litter belongs
    // to the *floor*, so it stayed put when the broom was leant on a wall or
    // stood in a corner, and left a patch of debris under a broom that was no
    // longer above it.

    // Lifted clear of the floor. A broom is always leaning on or propped
    // against something, so it is placed by whatever it leans on rather than by
    // standing on its own bristles — and a builder that plants itself exactly on
    // y = 0 forces every caller to sink it back down again.
    for (const part of parts) part.geometry.translate(0, 0.02, 0);

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'broom', 0);
  },
};
