import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A pipe run: a horizontal main on brackets, with flanges, valves and a drop. A
// works reads as a works because things are routed through it. The flanges are the
// trick — wider than the pipe, so the run has a rhythm along its length instead of
// being uniform, at eight triangles each. No stands: pipes run along walls on
// clamps, and a pipe run on legs is a handrail. Built running along +X, with no
// random facing, because a prop that spins on its own seed cannot be aimed.
export const pipes: MeshBuilder = {
  name: 'pipes',
  category: 'structures',
  radius: 1.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(2.6, 3.6);
    // Where the main runs. Fixed rather than rolled, for the reason a vent's
    // sill is: a rank of runs at differing heights reads as a mistake, and in a
    // building they would all be following the same ceiling anyway.
    const at = 2;
    const bore = rng.range(0.06, 0.11);

    // Painted, not bare. Industrial pipework is colour-coded by what is in it,
    // and even without a code a painted run separates from the structure behind
    // it — bare steel on bare steel is one grey mass.
    const coats = [PALETTE.RUST, 0x4a6b74, 0x6b6a3c, PALETTE.IRON, 0x7a5a3c];
    const coat = shade(rng.pick(coats), rng.range(0.9, 1.1));
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));

    /** One length of pipe along +X, centred on `cx`. */
    const run = (cx: number, span: number, y: number, radius: number): void => {
      const pipe = new THREE.CylinderGeometry(radius, radius, span, 8);
      pipe.rotateZ(Math.PI / 2);
      pipe.translate(cx, y, 0);
      parts.push({ geometry: pipe, color: coat, sway: 0 });
    };

    /** A joint collar at `x`. Wider than the pipe, and short. */
    const flange = (x: number, y: number, radius: number, wide = 1.45): void => {
      const ring = new THREE.CylinderGeometry(radius * wide, radius * wide, radius * 0.55, 8);
      ring.rotateZ(Math.PI / 2);
      ring.translate(x, y, 0);
      parts.push({ geometry: ring, color: shade(iron, 1.05), sway: 0 });
    };

    // --- the main ------------------------------------------------------------
    //
    // Divided into three to five sections at uneven lengths. Even sections read
    // as a decorative moulding rather than as pipe that was cut to fit.
    const sections = rng.int(3, 5);
    const cuts: number[] = [-length / 2];
    for (let i = 1; i < sections; i++) {
      cuts.push(-length / 2 + length * (i / sections) * rng.range(0.82, 1.18));
    }
    cuts.push(length / 2);
    cuts.sort((a, b) => a - b);

    for (let i = 0; i < cuts.length - 1; i++) {
      // Each section runs a little past its own joint, so consecutive lengths
      // interpenetrate instead of butting. Sections that meet exactly share a
      // pair of coincident end caps — two faces in the same plane, which
      // z-fight against each other and read as a hole to any test of whether
      // the solid is closed. The overlap is buried inside the flange anyway.
      const span = cuts[i + 1] - cuts[i];
      run((cuts[i] + cuts[i + 1]) / 2, span + bore * 0.5, at, bore);
      if (i > 0) flange(cuts[i], at, bore);
    }
    flange(-length / 2, at, bore, 1.6);
    flange(length / 2, at, bore, 1.6);

    // --- a valve -------------------------------------------------------------
    //
    // One, on most runs. A valve is the thing that says the pipe is *operated*
    // rather than merely present, and a run with three of them reads as a
    // manifold, which is a different object.
    if (rng.chance(0.75)) {
      const x = rng.range(-length * 0.3, length * 0.3);
      const body = new THREE.CylinderGeometry(bore * 1.5, bore * 1.5, bore * 1.8, 6);
      body.rotateZ(Math.PI / 2);
      body.translate(x, at, 0);
      parts.push({ geometry: body, color: shade(iron, 1.1), sway: 0 });

      const stem = new THREE.CylinderGeometry(bore * 0.28, bore * 0.34, bore * 1.6, 6);
      stem.translate(x, at + bore * 2.2, 0);
      parts.push({ geometry: stem, color: iron, sway: 0 });

      // A handwheel: a flat torus, which is closed and reads instantly.
      const wheel = new THREE.TorusGeometry(bore * 1.1, bore * 0.2, 4, 10);
      wheel.rotateX(Math.PI / 2);
      wheel.translate(x, at + bore * 3, 0);
      parts.push({ geometry: wheel, color: shade(PALETTE.RUST, 1.1), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'pipes', 0);
  },
};
