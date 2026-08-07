import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { sheet, STOCK, LEAF } from '../paper';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A roll of parchment on a staff, with a turned knob standing out at each end.
 *
 * **The knobs are the object.** A scroll built as a plain cylinder of paper is
 * a rolling pin — that was the first attempt at one here and it is why there is
 * no plain scroll in the kit any more. What makes a roll read as *a roll of
 * writing* is a rod running through it and finials protruding past the paper at
 * both ends, because that is a silhouette nothing else in the kit makes: two
 * knobs on a bar with a fat middle.
 *
 * The real thing this is copied from is the pair of rollers a Torah is kept on
 * — the *atzei chaim*, turned wood with a collar plate against the parchment
 * and a bulb at the end of the shaft. It is the one scroll form that survived
 * the codex, and it survived it partly by being an object you can hold at both
 * ends without touching the writing.
 *
 * The staff runs along **X** in both states, so a placer never has to work out
 * which way a scroll points depending on whether it is open.
 */

export interface ScrollOptions extends BuildOptions {
  /** Rolled unless the placer says otherwise. Never rolled by the seed. */
  state?: 'rolled' | 'unrolled';
}

export const rollerScroll: BuilderWith<ScrollOptions> = {
  name: 'roller-scroll',
  category: 'objects',
  display: 'Scroll',
  // Sized for the spread, which is the larger of the two states. A gallery only
  // ever builds the rolled one, so this is a little generous there and correct
  // for anywhere a placer opens one.
  radius: 0.32,
  solid: false,

  build({ seed = 1, scale = 1, state = 'rolled' }: ScrollOptions = {}) {
    const rng = createRng(seed);
    const parts = state === 'unrolled' ? spread(rng) : rolled(rng);

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'roller-scroll', 0);
  },
};

/** What a roller is made of. Turned hardwood, dark or pale. */
function timberFor(rng: Rng): number {
  return rng.pick([
    PALETTE.TIMBER_DARK,
    shade(PALETTE.TIMBER, 0.9),
    shade(PALETTE.BARK, 1.15),
    shade(PALETTE.BRONZE, 0.8),
  ]);
}

/**
 * One roller: the shaft, a collar against the parchment, and the knob.
 *
 * Built about the origin along X and moved out by the caller, so the two ends
 * of a staff are the same code twice rather than a mirrored copy that drifts.
 * The three pieces are deliberately three different radii — partly because a
 * turned finial *is* stepped, and partly because two cylinders sharing an axis
 * and a radius would weld into an edge belonging to four faces.
 */
function finial(parts: Part[], at: number, side: number, shaft: number, timber: number): void {
  const collar = new THREE.CylinderGeometry(shaft * 2.1, shaft * 2.3, shaft * 1.5, 8);
  collar.rotateZ(Math.PI / 2);
  collar.translate(at + side * shaft * 0.9, 0, 0);
  parts.push({ geometry: collar, color: shade(timber, 1.08), sway: 0 });

  const stem = new THREE.CylinderGeometry(shaft * 1.15, shaft * 1.15, shaft * 3.4, 7);
  stem.rotateZ(Math.PI / 2);
  stem.translate(at + side * shaft * 3.4, 0, 0);
  parts.push({ geometry: stem, color: timber, sway: 0 });

  // The bulb. Wider than everything before it, which is what makes the end of
  // the staff a *stop* — a knob you cannot slide the parchment off over.
  const knob = new THREE.CylinderGeometry(shaft * 1.7, shaft * 2.5, shaft * 2.6, 8);
  knob.rotateZ(Math.PI / 2);
  knob.translate(at + side * shaft * 6.2, 0, 0);
  parts.push({ geometry: knob, color: shade(timber, 1.14), sway: 0 });
}

/**
 * Rolled: a fat cylinder of parchment with the staff through it.
 *
 * The free edge is one flat box tangent to the roll. It costs twelve triangles
 * and it is the difference between *a roll of paper* and *a dowel* — the eye
 * finds the loose edge and reads a thickness of something wound up.
 */
function rolled(rng: Rng): Part[] {
  const parts: Part[] = [];
  const across = rng.range(0.19, 0.27);
  const radius = rng.range(0.026, 0.038);
  const shaft = radius * rng.range(0.3, 0.38);
  const paper = rng.pick(STOCK);
  const timber = timberFor(rng);

  // **Everything here is authored about the staff's own axis at the origin**,
  // and the whole thing is lifted onto the ground once at the end. Placing each
  // piece at its final height instead means the lift appears in six different
  // expressions, and the first time one of them is wrong the knob floats beside
  // the scroll rather than on it.
  const roll = new THREE.CylinderGeometry(radius, radius * rng.range(0.95, 1), across, 11);
  roll.rotateZ(Math.PI / 2);
  parts.push({ geometry: roll, color: paper, sway: 0 });

  const lip = new THREE.BoxGeometry(across * 0.98, LEAF * 4, radius * rng.range(0.9, 1.25));
  lip.rotateX(rng.range(0.25, 0.75));
  lip.translate(0, radius * rng.range(0.55, 0.8), radius * rng.range(0.8, 1.05));
  parts.push({ geometry: lip, color: shade(paper, 0.9), sway: 0 });

  // The staff, run right through and out both sides.
  const rod = new THREE.CylinderGeometry(shaft, shaft, across + shaft * 14, 7);
  rod.rotateZ(Math.PI / 2);
  parts.push({ geometry: rod, color: shade(timber, 0.94), sway: 0 });

  for (const side of [-1, 1]) {
    finial(parts, (side * across) / 2, side, shaft, timber);
  }

  // **No cord round the middle.** There was one, as a box ring — and a square
  // ring on a round roll is a square ring on a round roll: at this size it does
  // not read as a cord, it reads as a mistake in the geometry. A band that
  // followed the curve would be a torus, which is thirty triangles to say
  // something the silhouette does not need said.

  for (const part of parts) part.geometry.translate(0, radius, 0);
  return parts;
}

/**
 * Unrolled: the sheet spread out with a roller still wound at each end.
 *
 * Both ends keep a roller, which is what a rotulus actually looks like open and
 * is also the only version that stays recognisably the same object — a spread
 * sheet with nothing on it is `loose-note` at four times the size.
 */
function spread(rng: Rng): Part[] {
  const across = rng.range(0.19, 0.27);
  const length = rng.range(0.36, 0.54);
  const radius = rng.range(0.016, 0.024);
  const shaft = radius * rng.range(0.34, 0.44);
  const paper = rng.pick(STOCK);
  const timber = timberFor(rng);

  const parts = sheet(across, length, rng, { colour: paper, margin: 0.78 });
  for (const part of parts) part.geometry.translate(0, radius, 0);

  for (const end of [-1, 1]) {
    const roll = new THREE.CylinderGeometry(radius, radius * rng.range(0.94, 1), across, 9);
    roll.rotateZ(Math.PI / 2);
    roll.translate(0, radius, (end * length) / 2);
    parts.push({ geometry: roll, color: shade(paper, 0.95), sway: 0 });

    const rod = new THREE.CylinderGeometry(shaft, shaft, across + shaft * 14, 7);
    rod.rotateZ(Math.PI / 2);
    rod.translate(0, radius, (end * length) / 2);
    parts.push({ geometry: rod, color: shade(timber, 0.94), sway: 0 });

    // Built about the origin and then carried to the end it belongs to, so the
    // finial code never has to know which roller it is on.
    const ends: Part[] = [];
    for (const side of [-1, 1]) {
      finial(ends, (side * across) / 2, side, shaft, timber);
    }
    for (const part of ends) {
      part.geometry.translate(0, radius, (end * length) / 2);
      parts.push(part);
    }
  }

  return parts;
}
