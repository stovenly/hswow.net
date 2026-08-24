import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { sheet, STOCK, LEAF } from '../paper';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import type { Fields } from '../schema';

// A roll of parchment on a staff, with a turned knob standing out at each end.
// The knobs are the object: a plain cylinder of paper is a rolling pin, and what
// says roll of writing is two knobs on a bar with a fat middle. The staff runs
// along X in both states, so a placer never has to work out which way a scroll
// points depending on whether it is open.

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
  options: { state: { type: 'choice', options: ['rolled', 'unrolled'] } } satisfies Fields,
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
 * One roller: the shaft, a collar against the parchment, and the knob. Built about
 * the origin along X and moved out by the caller, so the two ends of a staff are
 * the same code twice. The three pieces are three different radii — a turned
 * finial is stepped, and two cylinders sharing an axis and a radius would weld
 * into an edge belonging to four faces.
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
 * Rolled: a fat cylinder of parchment with the staff through it. The free edge is
 * one flat box tangent to the roll, twelve triangles, and it is the difference
 * between a roll of paper and a dowel.
 */
function rolled(rng: Rng): Part[] {
  const parts: Part[] = [];
  const across = rng.range(0.19, 0.27);
  const radius = rng.range(0.026, 0.038);
  const shaft = radius * rng.range(0.3, 0.38);
  const paper = rng.pick(STOCK);
  const timber = timberFor(rng);

  // Everything here is authored about the staff's own axis at the origin and lifted
  // onto the ground once at the end, so the lift does not appear in six different
  // expressions with one of them wrong.
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

  // No cord round the middle: a square ring on a round roll does not read as a
  // cord, and a torus is thirty triangles to say something the silhouette does not
  // need said.

  for (const part of parts) part.geometry.translate(0, radius, 0);
  return parts;
}

/**
 * Unrolled: the sheet spread out with a roller still wound at each end. Both ends
 * keep one, which is what a rotulus looks like open and the only version that
 * stays recognisably the same object.
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
