import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A stationary engine: bed, boiler, flywheel, linkage.
 *
 * **The flywheel is the whole object.** A box with pipes on it is a boiler; what
 * makes something read as *machinery* is a big exposed wheel, because a wheel is
 * the one shape that obviously turns. Everything else here exists to give the
 * wheel something to be bolted to, which is also why it is the only part built
 * from more than a couple of primitives.
 *
 * ## The wheel has to be attached to something
 *
 * It was not. The wheel sat past the end of the bed, and its bearing block stood
 * at the same place — so the block was hanging in mid-air off the end of the
 * machine, and the wheel it carried appeared to be floating beside an engine
 * rather than being driven by one. The fix is a *shaft*: a visible axle running
 * from the hub back into the frame, and bearings standing where there is
 * actually bed underneath them. An axle is also the honest answer, being the
 * part that transmits the power — without one drawn, the wheel has no
 * mechanical relationship to anything.
 *
 * ## Three engines, not one
 *
 * A row of these read as three copies, because the only things varying were
 * dimensions. Layout varies now too: a single drum, twin drums abreast, or a
 * stacked pair — and one flywheel or two. Those are real distinctions between
 * real engines and, unlike a few centimetres of boiler radius, they are visible
 * from across a hall.
 *
 * Built with the wheel on the +X end, the bed centred on the origin and the
 * whole thing standing on y = 0. Roughly two and a half metres long, so it
 * reads as something a person works at rather than something they live in.
 *
 * The audio counterpart is `audio/models/machine.ts`, which is a different file
 * doing a different job — this one never moves. Phase 7 owns the rotation, and
 * the wheel is a separate part in the source precisely so it can be lifted out
 * and spun then.
 */
export const machine: MeshBuilder = {
  name: 'machine',
  category: 'structures',
  radius: 1.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(2.1, 2.8);
    const width = rng.range(0.9, 1.3);
    const bedHeight = rng.range(0.32, 0.46);
    const iron = rng.chance(0.5) ? PALETTE.IRON : PALETTE.IRON_PALE;
    const trim = rng.chance(0.6) ? PALETTE.RUST : PALETTE.IRON;

    // --- bed ----------------------------------------------------------------
    const bed = new THREE.BoxGeometry(length, bedHeight, width);
    bed.translate(0, bedHeight / 2, 0);
    parts.push({ geometry: bed, color: PALETTE.IRON_PALE, sway: 0 });

    // Feet, so it sits on the floor rather than growing out of it.
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const foot = new THREE.BoxGeometry(0.22, 0.08, 0.22);
        foot.translate((sx * (length - 0.3)) / 2, 0.04, (sz * (width - 0.3)) / 2);
        parts.push({ geometry: foot, color: trim, sway: 0 });
      }
    }

    // --- boiler -------------------------------------------------------------
    // A cylinder lying along the bed. Its own radius decides how high it sits,
    // measured rather than guessed, so changing the proportions cannot bury it.
    // One drum, two abreast, or two stacked.
    const layout = rng.chance(0.4) ? 'twin' : rng.chance(0.5) ? 'stacked' : 'single';
    const boilerRadius = rng.range(0.34, 0.46) * (layout === 'single' ? 1 : 0.82);
    const boilerLength = length * rng.range(0.62, 0.74);
    const boilerX = -length * 0.12;

    /** One drum lying along the bed, with the seam bands a riveted one has. */
    const drum = (radius: number, y: number, z: number): void => {
      const barrel = new THREE.CylinderGeometry(radius, radius, boilerLength, 10);
      barrel.rotateZ(Math.PI / 2);
      barrel.translate(boilerX, y, z);
      parts.push({ geometry: barrel, color: iron, sway: 0 });

      for (const along of [-0.28, 0.08, 0.34]) {
        const band = new THREE.CylinderGeometry(radius * 1.06, radius * 1.06, 0.07, 10);
        band.rotateZ(Math.PI / 2);
        band.translate(boilerX + boilerLength * along, y, z);
        parts.push({ geometry: band, color: trim, sway: 0 });
      }
    };

    // How high the plant reaches, whatever shape it took. Measured rather than
    // assumed: the stack and the valves stand on it, and a stacked pair is
    // nearly twice the height of a single.
    let crown = bedHeight + boilerRadius * 2;

    if (layout === 'twin') {
      // Close enough to touch. A pair with daylight between them reads as two
      // engines sharing a plinth rather than as one machine.
      const apart = boilerRadius * 1.02;
      drum(boilerRadius, bedHeight + boilerRadius, -apart);
      drum(boilerRadius, bedHeight + boilerRadius, apart);
    } else if (layout === 'stacked') {
      const upper = boilerRadius * rng.range(0.7, 0.86);
      drum(boilerRadius, bedHeight + boilerRadius, 0);
      drum(upper, bedHeight + boilerRadius * 2 + upper * 0.92, 0);
      crown = bedHeight + boilerRadius * 2 + upper * 1.9;
      // Stays between them, so the upper drum is carried rather than balanced.
      for (const along of [-0.3, 0.3]) {
        const stay = new THREE.BoxGeometry(0.1, upper * 1.1, boilerRadius * 1.1);
        stay.translate(boilerX + boilerLength * along, bedHeight + boilerRadius * 2, 0);
        parts.push({ geometry: stay, color: trim, sway: 0 });
      }
    } else {
      drum(boilerRadius, bedHeight + boilerRadius, 0);
    }

    // --- flywheel -----------------------------------------------------------
    //
    // Upright, turning about X, and carried on a shaft that runs back into the
    // frame. One wheel on the +X end, or a matched pair on both ends — a common
    // arrangement, and it reads as a bigger machine at a glance.
    const wheelRadius = rng.range(0.52, 0.72);
    const wheelY = bedHeight + wheelRadius * 0.82;
    const spokeCount = rng.chance(0.5) ? 4 : 3;
    const twinWheels = rng.chance(0.3);

    const wheelX = length / 2 + rng.range(0.16, 0.26);
    const span = twinWheels ? wheelX * 2 : wheelX + length * 0.28;
    const shaftX = twinWheels ? 0 : wheelX - span / 2;

    const shaft = new THREE.CylinderGeometry(0.075, 0.075, span, 8);
    shaft.rotateZ(Math.PI / 2);
    shaft.translate(shaftX, wheelY, 0);
    parts.push({ geometry: shaft, color: shade(trim, 1.1), sway: 0 });

    // Bearings **on the bed**, not out past the end of it. That the wheel's
    // only support used to stand in mid-air is the whole reason it looked
    // detached from the engine.
    const bearings = twinWheels ? [-length * 0.34, length * 0.34] : [length * 0.16, length * 0.4];
    for (const at of bearings) {
      const pillow = new THREE.BoxGeometry(0.26, wheelY - bedHeight + 0.12, 0.3);
      pillow.translate(at, bedHeight + (wheelY - bedHeight) / 2, 0);
      parts.push({ geometry: pillow, color: PALETTE.IRON_PALE, sway: 0 });

      const cap = new THREE.BoxGeometry(0.3, 0.1, 0.34);
      cap.translate(at, wheelY, 0);
      parts.push({ geometry: cap, color: trim, sway: 0 });
    }

    for (const at of twinWheels ? [wheelX, -wheelX] : [wheelX]) {
      const rim = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.12, 12);
      rim.rotateZ(Math.PI / 2);
      rim.translate(at, wheelY, 0);
      parts.push({ geometry: rim, color: iron, sway: 0 });

      // Wider than the shaft it is keyed to, so the join reads as a hub rather
      // than as a wheel threaded onto a pole.
      const hub = new THREE.CylinderGeometry(0.15, 0.15, 0.26, 8);
      hub.rotateZ(Math.PI / 2);
      hub.translate(at, wheelY, 0);
      parts.push({ geometry: hub, color: trim, sway: 0 });

      // Spokes at fractions of a half turn — never at halves themselves,
      // because a spoke rotated by pi lands exactly on the one opposite and
      // welds into edges belonging to four triangles.
      for (let i = 0; i < spokeCount; i++) {
        const spoke = new THREE.BoxGeometry(0.07, wheelRadius * 1.85, 0.06);
        spoke.rotateX(Math.PI / 2);
        spoke.rotateX((i / spokeCount) * Math.PI);
        spoke.translate(at, wheelY, 0);
        parts.push({ geometry: spoke, color: shade(iron, 0.86), sway: 0 });
      }
    }

    // --- linkage ------------------------------------------------------------
    // A rod from the boiler to the wheel. What makes the two read as one
    // machine rather than as two objects sharing a plinth.
    const rod = new THREE.BoxGeometry(length * 0.42, 0.08, 0.08);
    rod.translate(boilerX + boilerLength * 0.45, bedHeight + boilerRadius * 0.9, wheelRadius * 0.42);
    parts.push({ geometry: rod, color: trim, sway: 0 });

    // --- pipes --------------------------------------------------------------
    const stackHeight = rng.range(1.1, 1.8);
    const stackRadius = rng.range(0.11, 0.16);
    const stack = new THREE.CylinderGeometry(stackRadius * 0.85, stackRadius, stackHeight, 8);
    stack.translate(-length * 0.3, crown + stackHeight / 2 - 0.1, 0);
    parts.push({ geometry: stack, color: iron, sway: 0 });

    const cap = new THREE.CylinderGeometry(stackRadius * 1.3, stackRadius * 1.1, 0.1, 8);
    cap.translate(-length * 0.3, crown + stackHeight - 0.14, 0);
    parts.push({ geometry: cap, color: trim, sway: 0 });

    // A valve or two on top, at whatever angle they were fitted.
    const valves = rng.int(1, 2);
    for (let i = 0; i < valves; i++) {
      const at = rng.range(-0.3, 0.25);
      const valve = new THREE.CylinderGeometry(0.07, 0.09, rng.range(0.16, 0.26), 6);
      valve.translate(boilerX + boilerLength * at, crown, 0);
      parts.push({ geometry: valve, color: trim, sway: 0 });

      const wheelTop = new THREE.CylinderGeometry(0.1, 0.1, 0.035, 8);
      wheelTop.translate(boilerX + boilerLength * at, crown + 0.16, 0);
      parts.push({ geometry: wheelTop, color: shade(trim, 1.2), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'machine', 0);
  },
};
