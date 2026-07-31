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
    const iron = rng.chance(0.5) ? PALETTE.IRON : PALETTE.STONE_DARK;
    const trim = rng.chance(0.6) ? PALETTE.RUST : PALETTE.IRON;

    // --- bed ----------------------------------------------------------------
    const bed = new THREE.BoxGeometry(length, bedHeight, width);
    bed.translate(0, bedHeight / 2, 0);
    parts.push({ geometry: bed, color: PALETTE.STONE_DARK, sway: 0 });

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
    const boilerRadius = rng.range(0.34, 0.46);
    const boilerLength = length * rng.range(0.62, 0.74);
    const boiler = new THREE.CylinderGeometry(boilerRadius, boilerRadius, boilerLength, 10);
    boiler.rotateZ(Math.PI / 2);
    boiler.translate(-length * 0.12, bedHeight + boilerRadius, 0);
    parts.push({ geometry: boiler, color: iron, sway: 0 });

    // Bands around it, at the seams a riveted drum would have.
    for (const at of [-0.28, 0.08, 0.34]) {
      const band = new THREE.CylinderGeometry(boilerRadius * 1.06, boilerRadius * 1.06, 0.07, 10);
      band.rotateZ(Math.PI / 2);
      band.translate(-length * 0.12 + boilerLength * at, bedHeight + boilerRadius, 0);
      parts.push({ geometry: band, color: trim, sway: 0 });
    }

    // --- flywheel -----------------------------------------------------------
    // On the +X end, standing upright, turning about X.
    const wheelRadius = rng.range(0.52, 0.72);
    const wheelX = length / 2 + rng.range(0.12, 0.22);
    const wheelY = bedHeight + wheelRadius * 0.82;

    const rim = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.12, 12);
    rim.rotateZ(Math.PI / 2);
    rim.translate(wheelX, wheelY, 0);
    parts.push({ geometry: rim, color: iron, sway: 0 });

    const hub = new THREE.CylinderGeometry(0.14, 0.14, 0.2, 8);
    hub.rotateZ(Math.PI / 2);
    hub.translate(wheelX, wheelY, 0);
    parts.push({ geometry: hub, color: trim, sway: 0 });

    // Spokes. Four, at eighths of a turn — never at halves, because a spoke
    // rotated by a half turn lands exactly on top of the one opposite it and
    // welds into edges belonging to four triangles.
    const spokeCount = rng.chance(0.5) ? 4 : 3;
    for (let i = 0; i < spokeCount; i++) {
      const spoke = new THREE.BoxGeometry(0.07, wheelRadius * 1.85, 0.06);
      spoke.rotateX(Math.PI / 2);
      spoke.rotateX((i / spokeCount) * Math.PI);
      spoke.translate(wheelX, wheelY, 0);
      // Rotating about X keeps the spoke in the wheel's plane; the extra turn
      // above spaces them around it.
      parts.push({ geometry: spoke, color: shade(iron, 0.86), sway: 0 });
    }

    // The bearing the wheel runs in, standing on the bed.
    const pillow = new THREE.BoxGeometry(0.3, wheelY - bedHeight + 0.1, 0.26);
    pillow.translate(wheelX, bedHeight + (wheelY - bedHeight) / 2, 0);
    parts.push({ geometry: pillow, color: PALETTE.STONE_DARK, sway: 0 });

    // --- linkage ------------------------------------------------------------
    // A rod from the boiler to the wheel. What makes the two read as one
    // machine rather than as two objects sharing a plinth.
    const rod = new THREE.BoxGeometry(length * 0.42, 0.08, 0.08);
    rod.translate(length * 0.16, bedHeight + boilerRadius * 0.55, wheelRadius * 0.42);
    parts.push({ geometry: rod, color: trim, sway: 0 });

    // --- pipes --------------------------------------------------------------
    const stackHeight = rng.range(1.1, 1.8);
    const stackRadius = rng.range(0.11, 0.16);
    const stack = new THREE.CylinderGeometry(stackRadius * 0.85, stackRadius, stackHeight, 8);
    stack.translate(-length * 0.3, bedHeight + boilerRadius * 2 + stackHeight / 2 - 0.1, 0);
    parts.push({ geometry: stack, color: iron, sway: 0 });

    const cap = new THREE.CylinderGeometry(stackRadius * 1.3, stackRadius * 1.1, 0.1, 8);
    cap.translate(-length * 0.3, bedHeight + boilerRadius * 2 + stackHeight - 0.14, 0);
    parts.push({ geometry: cap, color: trim, sway: 0 });

    // A valve or two on top, at whatever angle they were fitted.
    const valves = rng.int(1, 2);
    for (let i = 0; i < valves; i++) {
      const at = rng.range(-0.3, 0.25);
      const valve = new THREE.CylinderGeometry(0.07, 0.09, rng.range(0.16, 0.26), 6);
      valve.translate(-length * 0.12 + boilerLength * at, bedHeight + boilerRadius * 2, 0);
      parts.push({ geometry: valve, color: trim, sway: 0 });

      const wheelTop = new THREE.CylinderGeometry(0.1, 0.1, 0.035, 8);
      wheelTop.translate(
        -length * 0.12 + boilerLength * at,
        bedHeight + boilerRadius * 2 + 0.16,
        0,
      );
      parts.push({ geometry: wheelTop, color: shade(trim, 1.2), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'machine', 0);
  },
};
