import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A tube with a fitted cap: what a scroll travels in.
 *
 * The pair to `roller-scroll`, and the reason it is worth a builder of its own
 * is that it is the readable family's only *closed* object. Everything else
 * here shows what it is by showing paper — a spine, a page, a roll. This shows
 * nothing, which is exactly what makes it findable: a smooth capped cylinder
 * lying on a table is unmistakably a container, and a container in a room full
 * of open books is the one thing somebody has bothered to shut.
 *
 * Leather over a former, or cast bronze. Two raised bands and a stepped cap
 * are the whole of it — a tube with no relief on it reads as a pipe, and the
 * kit already has pipes.
 *
 * Lying along **X**, matching the scroll that goes in it.
 */
export const scrollCase: MeshBuilder = {
  name: 'scroll-case',
  category: 'objects',
  display: 'Scroll Case',
  radius: 0.24,
  solid: false,

  build({ seed = 1, scale = 1 }: BuildOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(0.3, 0.42);
    const radius = rng.range(0.031, 0.042);
    const bronze = rng.chance(0.35);
    const skin = bronze
      ? rng.pick([PALETTE.BRONZE, shade(PALETTE.BRONZE, 0.82), PALETTE.PATINA])
      : rng.pick([
          PALETTE.HIDE_DARK,
          PALETTE.HIDE,
          shade(PALETTE.BARK, 1.05),
          shade(PALETTE.COMB, 0.5),
        ]);

    // Authored about the tube's own axis at the origin and lifted onto the
    // ground once at the end, the same way the scroll is — the lift is a fact
    // about where the thing is standing, not about any part of it.
    const capLen = length * rng.range(0.2, 0.28);
    const body = new THREE.CylinderGeometry(radius, radius, length - capLen * 0.45, 12);
    body.rotateZ(Math.PI / 2);
    body.translate(-capLen * 0.22, 0, 0);
    parts.push({ geometry: body, color: skin, sway: 0 });

    // The cap, over the near end and standing proud of the body all round. That
    // step is the one feature that says *this comes off*, and without it the
    // prop is a length of tube.
    const cap = new THREE.CylinderGeometry(radius * 1.11, radius * 1.13, capLen, 12);
    cap.rotateZ(Math.PI / 2);
    cap.translate((length - capLen) / 2, 0, 0);
    parts.push({ geometry: cap, color: shade(skin, 1.12), sway: 0 });

    // A knob on the cap to pull it by, and a domed foot at the other end so
    // neither end of the case is a cut pipe.
    const pull = new THREE.CylinderGeometry(radius * 0.42, radius * 0.6, radius * 0.55, 8);
    pull.rotateZ(Math.PI / 2);
    pull.translate(length / 2 + radius * 0.24, 0, 0);
    parts.push({ geometry: pull, color: shade(skin, 1.2), sway: 0 });

    const foot = new THREE.CylinderGeometry(radius * 0.86, radius * 1.04, radius * 0.5, 12);
    foot.rotateZ(Math.PI / 2);
    foot.translate(-length / 2 + radius * 0.2, 0, 0);
    parts.push({ geometry: foot, color: shade(skin, 0.88), sway: 0 });

    // Two bands round the body. Chunky rings rather than incised lines: at this
    // scale anything under a few millimetres proud is a smear, which is the
    // lesson every thin detail in this kit has taught.
    const bands = rng.int(2, 3);
    for (let i = 0; i < bands; i++) {
      const at = -length * 0.38 + (length * 0.5 * (i + 0.5)) / bands;
      const band = new THREE.CylinderGeometry(radius * 1.07, radius * 1.07, radius * 0.34, 12);
      band.rotateZ(Math.PI / 2);
      band.translate(at, 0, 0);
      parts.push({ geometry: band, color: shade(skin, bronze ? 1.18 : 0.78), sway: 0 });
    }

    for (const part of parts) part.geometry.translate(0, radius * 1.13, 0);

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'scroll-case', 0);
  },
};
