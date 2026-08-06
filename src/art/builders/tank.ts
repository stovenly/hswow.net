import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A pressure vessel on saddles: a riveted drum, a manway, and tappings.
 *
 * The big mass a works needs. `machine` is the thing that moves and `pipes` is
 * the thing that connects; this is the thing that just *sits there*, and a
 * factory without one reads as a workshop. It is also the only prop in the
 * industrial kit large enough to block a sightline, which is what turns a shed
 * into a place with rooms in it.
 *
 * Built lying along +X and left that way. **No random facing** — placement is
 * the caller's business, and a prop that spins on its own seed cannot be
 * aimed at anything.
 *
 * Lying down rather than standing, on most of them. A vertical cylinder is a
 * silo and reads agricultural; a horizontal one on saddles is unmistakably
 * pressurised, because the only reason to lie a tank down is that its ends have
 * to be domed and domed ends are what you do to hold pressure.
 *
 * **The bands are what make it read as riveted.** A smooth drum is a barrel at
 * any size. Real vessels are rolled from plate in courses and strapped at every
 * seam, so the surface has a rhythm along its length — the same argument the
 * pipe run's flanges are built on, and it works here for the same reason: a
 * ring costs sixteen triangles and does more than doubling the radial segments
 * would.
 */
export const tank: MeshBuilder = {
  name: 'tank',
  category: 'structures',
  radius: 1.9,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Wide ranges, and the aspect ratio is rolled independently of the size —
    // a short fat receiver and a long thin one are both pressure vessels and
    // they look nothing alike, which is exactly the variety wanted.
    const radius = rng.range(0.4, 1.05);
    const length = radius * rng.range(2.1, 4.6);
    const saddle = rng.range(0.16, 0.62);
    const axis = saddle + radius;

    const rusty = rng.chance(0.45);
    const shell = rusty
      ? shade(PALETTE.RUST, rng.range(0.78, 0.95))
      : shade(0x6d757b, rng.range(0.9, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));

    // --- the drum ------------------------------------------------------------
    //
    // Ten radial segments. Eight reads as an octagonal hopper and twelve costs
    // half again for a curve the dither cannot resolve anyway.
    const drum = new THREE.CylinderGeometry(radius, radius, length, 10);
    drum.rotateZ(Math.PI / 2);
    drum.translate(0, axis, 0);
    parts.push({
      geometry: drum,
      // Streaked down the flanks on the rusty ones. Evaluated per face at its
      // centroid, so the staining lands on facet boundaries and comes out
      // crisp rather than smeared — the same mechanism the cattle's patches
      // use, and the reason markings need no extra geometry.
      color: rusty
        ? (_x, y) => (y < axis ? shade(shell, 0.82) : shell)
        : shell,
      sway: 0,
    });

    // Domed ends. Half-spheres would be right and cost sixty triangles each;
    // a low cone reads the same from anywhere you can stand and costs ten.
    for (const side of [-1, 1]) {
      const cap = new THREE.CylinderGeometry(radius * 0.42, radius, radius * 0.45, 10);
      cap.rotateZ((side * Math.PI) / 2);
      cap.translate((side * (length + radius * 0.44)) / 2, axis, 0);
      parts.push({ geometry: cap, color: shade(shell, 1.06), sway: 0 });

      const boss = new THREE.CylinderGeometry(radius * 0.42, radius * 0.42, radius * 0.12, 10);
      boss.rotateZ(Math.PI / 2);
      boss.translate((side * (length + radius * 0.88)) / 2, axis, 0);
      parts.push({ geometry: boss, color: shade(iron, 0.95), sway: 0 });
    }

    // --- courses -------------------------------------------------------------
    // Scaled to the length rather than fixed, so a long vessel gets more
    // seams than a short one — which is how it would have been rolled.
    const courses = Math.max(2, Math.round(length / rng.range(0.7, 1.2)));
    for (let i = 1; i < courses; i++) {
      const x = -length / 2 + (length * i) / courses;
      const band = new THREE.CylinderGeometry(radius * 1.035, radius * 1.035, radius * 0.1, 10);
      band.rotateZ(Math.PI / 2);
      band.translate(x, axis, 0);
      parts.push({ geometry: band, color: shade(iron, 1.05), sway: 0 });
    }

    // --- saddles -------------------------------------------------------------
    //
    // Two, near the ends but not at them. A vessel supported at its extremities
    // sags in the middle, so real ones are carried at about a fifth in from
    // each end — and getting that right is why it looks engineered.
    for (const side of [-1, 1]) {
      const x = (side * length) / 2 * rng.range(0.5, 0.66);

      const pier = new THREE.BoxGeometry(radius * 0.5, saddle, radius * 1.8);
      pier.translate(x, saddle / 2, 0);
      parts.push({ geometry: pier, color: shade(iron, 0.82), sway: 0 });

      // A cradle: a short wide block the drum beds into, so the tank is
      // *held* rather than balanced on a post.
      const cradle = new THREE.BoxGeometry(radius * 0.42, radius * 0.34, radius * 1.55);
      cradle.translate(x, saddle + radius * 0.1, 0);
      parts.push({ geometry: cradle, color: shade(iron, 0.92), sway: 0 });

      const pad = new THREE.BoxGeometry(radius * 0.8, radius * 0.09, radius * 2);
      pad.translate(x, radius * 0.045, 0);
      parts.push({ geometry: pad, color: shade(iron, 0.74), sway: 0 });
    }

    // --- the manway ----------------------------------------------------------
    //
    // On top, offset along the length. A hatch dead centre reads as decoration;
    // one placed where a person could actually get at it from a walkway reads
    // as a way in.
    const manR = radius * rng.range(0.3, 0.5);
    const manX = rng.range(-length * 0.2, length * 0.2);

    const collar = new THREE.CylinderGeometry(manR, manR * 1.1, radius * 0.22, 8);
    collar.translate(manX, axis + radius * 0.98, 0);
    parts.push({ geometry: collar, color: shade(iron, 0.95), sway: 0 });

    const cover = new THREE.CylinderGeometry(manR * 1.2, manR * 1.2, radius * 0.09, 8);
    cover.translate(manX, axis + radius * 1.12, 0);
    parts.push({ geometry: cover, color: shade(iron, 1.12), sway: 0 });

    // Bolts round the cover. Eight small boxes, and they are the difference
    // between a hatch and a drawn circle.
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const bolt = new THREE.BoxGeometry(radius * 0.055, radius * 0.05, radius * 0.055);
      bolt.translate(
        manX + Math.cos(a) * manR * 1.05,
        axis + radius * 1.17,
        Math.sin(a) * manR * 1.05,
      );
      parts.push({ geometry: bolt, color: shade(iron, 0.8), sway: 0 });
    }

    // --- tappings ------------------------------------------------------------
    //
    // A stub or two off the top, so it looks connected to something even when
    // it is standing alone in a gallery.
    const stubs = rng.int(0, 4);
    for (let i = 0; i < stubs; i++) {
      const x = -length * 0.35 + (length * 0.7 * (i + 0.5)) / stubs;
      if (Math.abs(x - manX) < manR * 1.6) continue;
      const bore = radius * rng.range(0.1, 0.16);
      const up = radius * rng.range(0.3, 0.6);

      const stub = new THREE.CylinderGeometry(bore, bore, up, 6);
      stub.translate(x, axis + radius * 0.9 + up / 2, 0);
      parts.push({ geometry: stub, color: shade(shell, 1.1), sway: 0 });

      const flange = new THREE.CylinderGeometry(bore * 1.6, bore * 1.6, bore * 0.5, 6);
      flange.translate(x, axis + radius * 0.9 + up, 0);
      parts.push({ geometry: flange, color: shade(iron, 1.05), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'tank', 0);
  },
};
