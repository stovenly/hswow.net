import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A chest of drawers: a plain carcass on a plinth, four to six drawers, knobs.
 *
 * **This was a Welsh dresser and that was overbuilt.** The first version had a
 * base cupboard, an upper stage of open shelves stepped back from it, and
 * crockery standing on the shelves — on the argument that empty shelves read as
 * flat-pack and that the plates were the second half of the silhouette. Every
 * word of that is true of a *kitchen* dresser, and a kitchen dresser is not
 * what a hut needed. What was wanted is the thing you put clothes in.
 *
 * So: no upper stage, no shelves, no crockery. A box with drawer fronts on it.
 *
 * The restraint is the point rather than a saving. The room already has a
 * fireplace, a stove, a spinning wheel, a chest, a washtub and a rack of herbs
 * in it, and if every one of them is the most elaborate version of itself then
 * nothing reads as *background* — a room needs plain things in it for the
 * interesting ones to be interesting against.
 *
 * ## What carries it at three-pixel blocks
 *
 * The horizontal lines between the drawers, and very little else. So the fronts
 * are boards standing **proud** of the carcass rather than recesses cut into it
 * — there is no constructive solid geometry here and none is wanted, and a
 * board on the outside is what a drawer front actually is. The shadow line
 * under each proud edge is what survives the quantizer.
 *
 * Knobs are the one indulgence and they earn it by breaking the outline: a
 * front face with nothing on it reads as a painted panel at any distance.
 *
 * Built with its back at z = 0, projecting toward +Z, standing on y = 0.
 */
export const dresser: MeshBuilder = {
  name: 'dresser',
  category: 'furniture',
  radius: 0.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(0.92, 1.24);
    const depth = rng.range(0.44, 0.56);
    // Chest height, not dresser height. Waist to chest — a thing you look down
    // onto and put a candle on, which is also what makes it useful scenery.
    const height = rng.range(0.86, 1.14);

    const timber = rng.chance(0.55) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK;
    const trim = timber === PALETTE.TIMBER ? PALETTE.TIMBER_DARK : PALETTE.TIMBER_PALE;
    const knobColor = rng.chance(0.45) ? PALETTE.IRON : shade(trim, 1.15);

    const plinthH = rng.range(0.07, 0.11);
    const topT = rng.range(0.03, 0.045);

    // --- plinth, carcass, top -------------------------------------------------
    //
    // Each overlaps its neighbour rather than meeting on a plane. Two boxes
    // sharing a face share its corners, and a shared corner makes edges
    // belonging to four triangles instead of two — the mesh stops being closed
    // even though nothing about it looks wrong.
    const plinth = new THREE.BoxGeometry(width * 0.96, plinthH, depth * 0.94);
    plinth.translate(0, plinthH / 2, depth / 2);
    parts.push({ geometry: plinth, color: shade(trim, 0.86), sway: 0 });

    const carcassH = height - plinthH - topT;
    const carcass = new THREE.BoxGeometry(width, carcassH + 0.03, depth);
    carcass.translate(0, plinthH + carcassH / 2, depth / 2);
    parts.push({ geometry: carcass, color: shade(timber, rng.range(0.95, 1.05)), sway: 0 });

    // Overhanging a little at the front and sides. That lip is the only thing
    // giving the top of the piece an edge; without it the object is one
    // untextured slab from any angle above eye height.
    const overhang = rng.range(0.015, 0.03);
    const top = new THREE.BoxGeometry(width + overhang * 2, topT + 0.02, depth + overhang);
    top.translate(0, height - topT / 2, depth / 2 + overhang / 2);
    parts.push({ geometry: top, color: shade(trim, rng.range(0.95, 1.08)), sway: 0 });

    // --- the drawers ----------------------------------------------------------
    //
    // Graded: the bottom drawer is deepest and they shallow toward the top,
    // which is how a real chest is made — heavy things low down — and is what
    // stops the front reading as a set of equal stripes.
    const rows = rng.int(4, 6);
    const faceZ = depth + rng.range(0.012, 0.02);
    const inset = rng.range(0.02, 0.035);
    const gap = 0.012;

    // Shares grow downward, normalised so the run exactly fills the carcass
    // whatever the row count and whatever the grading roll.
    const grade = rng.range(1.1, 1.45);
    const shares: number[] = [];
    for (let i = 0; i < rows; i++) shares.push(grade ** i);
    const total = shares.reduce((a, b) => a + b, 0);
    const runH = carcassH - gap * (rows + 1);

    let y = plinthH + gap;
    for (let i = rows - 1; i >= 0; i--) {
      const h = (runH * shares[i]) / total;
      const face = new THREE.BoxGeometry(width - inset * 2, h, 0.026);
      face.translate(0, y + h / 2, faceZ);
      parts.push({
        geometry: face,
        // Every front a shade apart. One flat colour across five boards reads
        // as a painted wall; a little variation reads as timber.
        color: shade(timber, rng.range(0.9, 1.12)),
        sway: 0,
      });

      // One knob on a deep drawer, two on a shallow wide one — the rule a real
      // chest follows, and the pair is what makes a wide drawer read as wide.
      const twin = width > 1.05 && h < carcassH * 0.26;
      const knobs = twin ? [-width * 0.22, width * 0.22] : [0];
      for (const kx of knobs) {
        const knob = new THREE.CylinderGeometry(
          rng.range(0.017, 0.024),
          rng.range(0.013, 0.018),
          rng.range(0.03, 0.045),
          6,
        );
        knob.rotateX(Math.PI / 2);
        // Sunk into the drawer front rather than set against it, so the join is
        // an overlap and never a coincident face.
        knob.translate(kx, y + h / 2, faceZ + 0.02);
        parts.push({ geometry: knob, color: shade(knobColor, rng.range(0.92, 1.1)), sway: 0 });
      }

      y += h + gap;
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'dresser', 0);
  },
};
