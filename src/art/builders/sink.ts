import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A utility sink: a deep steel basin on legs, with a swan-neck tap — square,
// steel, waist high and usually empty, where `cistern` is round, stone, low and
// full. Built as five slabs rather than by cutting a box, because a container is
// walls. The splashback is what says plumbed in rather than a tub on a frame.
export const sink: MeshBuilder = {
  name: 'sink',
  category: 'objects',
  radius: 0.65,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(0.62, 0.86);
    const depth = rng.range(0.45, 0.6);
    const bowl = rng.range(0.24, 0.34);
    const legs = rng.range(0.5, 0.68);
    const t = rng.range(0.02, 0.032);

    const steel = shade(0x8f969b, rng.range(0.9, 1.08));
    const dull = shade(steel, 0.84);
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));

    const rim = legs + bowl;

    // --- the basin -----------------------------------------------------------
    const floor = new THREE.BoxGeometry(width, t, depth);
    floor.translate(0, legs + t / 2, 0);
    parts.push({ geometry: floor, color: dull, sway: 0 });

    for (const side of [-1, 1]) {
      // Each piece a percent or two off its neighbours, so no two boxes share
      // an exact edge — a shared edge belongs to four faces instead of two,
      // z-fights where it shows, and reads as a hole to any test of the solid.
      const long = new THREE.BoxGeometry(width * 0.99, bowl, t);
      long.translate(0, legs + bowl / 2, (side * (depth - t)) / 2);
      parts.push({ geometry: long, color: steel, sway: 0 });

      const short = new THREE.BoxGeometry(t, bowl * 0.985, depth * 0.985);
      short.translate((side * (width - t)) / 2, legs + bowl / 2, 0);
      parts.push({ geometry: short, color: steel, sway: 0 });
    }

    // A rolled lip round the top. Steel this thin has to be turned over at the
    // edge or it would cut you, and the lip is most of what makes it read as
    // pressed metal rather than as a wooden box painted grey.
    for (const side of [-1, 1]) {
      const lipA = new THREE.BoxGeometry(width * 1.04, t * 1.4, t * 2.2);
      lipA.translate(0, rim, (side * depth) / 2);
      parts.push({ geometry: lipA, color: shade(steel, 1.14), sway: 0 });

      const lipB = new THREE.BoxGeometry(t * 2.2, t * 1.35, depth * 0.96);
      lipB.translate((side * width) / 2, rim, 0);
      parts.push({ geometry: lipB, color: shade(steel, 1.14), sway: 0 });
    }

    // Standing water in some of them, well down — a basin filled to the rim
    // reads as a solid slab of colour instead of as something with depth.
    if (rng.chance(0.4)) {
      const water = new THREE.BoxGeometry(width - t * 2.2, 0.02, depth - t * 2.2);
      water.translate(0, legs + t + bowl * rng.range(0.12, 0.3), 0);
      parts.push({ geometry: water, color: PALETTE.WATER, sway: 0 });
    }

    // --- the frame -----------------------------------------------------------
    const legR = rng.range(0.018, 0.026);
    const inset = rng.range(0.06, 0.1);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const leg = new THREE.CylinderGeometry(legR * 0.85, legR, legs, 6);
        leg.translate((sx * (width - inset * 2)) / 2, legs / 2, (sz * (depth - inset * 2)) / 2);
        parts.push({ geometry: leg, color: iron, sway: 0 });
      }
    }

    // A stretcher between the legs on some. Anything standing on four thin
    // pins wants tying together, and the eye knows it.
    if (rng.chance(0.55)) {
      const at = legs * rng.range(0.2, 0.32);
      for (const along of [0, 1]) {
        const lengthwise = along === 0;
        for (const side of [-1, 1]) {
          const bar = new THREE.BoxGeometry(
            lengthwise ? width - inset * 2 : legR * 1.2,
            legR * 1.1,
            lengthwise ? legR * 1.2 : depth - inset * 2.4,
          );
          bar.translate(
            lengthwise ? 0 : (side * (width - inset * 2)) / 2,
            at,
            lengthwise ? (side * (depth - inset * 2)) / 2 : 0,
          );
          parts.push({ geometry: bar, color: shade(iron, 0.88), sway: 0 });
        }
      }
    }

    // --- splashback and tap --------------------------------------------------
    const backH = rng.range(0.16, 0.3);
    const back = new THREE.BoxGeometry(width * 1.02, backH, t * 1.6);
    back.translate(0, rim + backH / 2, -depth / 2 - t);
    parts.push({ geometry: back, color: shade(steel, 0.94), sway: 0 });

    // A swan neck: a riser, a bend, and a downspout. Three primitives, and the
    // silhouette is unmistakable at a glance — which is the whole point of
    // spending them.
    const riseH = backH + rng.range(0.1, 0.2);
    const pipeR = rng.range(0.012, 0.018);
    const tapZ = -depth / 2 - t;

    const riser = new THREE.CylinderGeometry(pipeR, pipeR * 1.15, riseH, 6);
    riser.translate(0, rim + riseH / 2, tapZ);
    parts.push({ geometry: riser, color: shade(iron, 1.15), sway: 0 });

    const reach = rng.range(0.14, 0.22);
    const arm = new THREE.CylinderGeometry(pipeR * 0.9, pipeR * 0.9, reach, 6);
    arm.rotateX(Math.PI / 2);
    arm.translate(0, rim + riseH, tapZ + reach / 2);
    parts.push({ geometry: arm, color: shade(iron, 1.15), sway: 0 });

    const spoutH = rng.range(0.05, 0.09);
    const spout = new THREE.CylinderGeometry(pipeR * 0.8, pipeR * 0.95, spoutH, 6);
    spout.translate(0, rim + riseH - spoutH / 2, tapZ + reach);
    parts.push({ geometry: spout, color: shade(iron, 1.05), sway: 0 });

    // Handles on their own pillars either side of the spout, not on the spout
    // itself: a tap body carries water, and the valves that let it through are
    // separate fittings beside it. Two of them, because a sink with one is a
    // standpipe.
    const handles = rng.chance(0.75) ? 2 : 1;
    const apart = rng.range(0.1, 0.16);
    // Forward of the splashback, standing on the rim. Set flush against the
    // wall they read as bumps in the panel rather than as something you could
    // get a hand round — a tap handle needs air behind it or it is a moulding.
    const handleZ = tapZ + pipeR * 3.4;
    for (let i = 0; i < handles; i++) {
      const hx = handles === 1 ? 0 : (i === 0 ? -apart : apart);
      const pillarH = rng.range(0.05, 0.085);

      // A short body standing on the deck, with a shoulder where the spindle
      // comes out of it.
      const pillar = new THREE.CylinderGeometry(pipeR * 1.25, pipeR * 1.5, pillarH, 6);
      pillar.translate(hx, rim + pillarH / 2, handleZ);
      parts.push({ geometry: pillar, color: shade(iron, 1.05), sway: 0 });

      const spindle = new THREE.CylinderGeometry(pipeR * 0.4, pipeR * 0.5, pipeR * 1.4, 6);
      spindle.translate(hx, rim + pillarH + pipeR * 0.7, handleZ);
      parts.push({ geometry: spindle, color: shade(iron, 1.15), sway: 0 });

      // A cross head. Two bars at right angles, turned by a random amount so
      // no two taps on a bench are left in the same position.
      const turn = rng.range(0, Math.PI / 2);
      for (const arm of [0, 1]) {
        const bar = new THREE.BoxGeometry(pipeR * 3.4, pipeR * 0.75, pipeR * 0.72);
        bar.rotateY(turn + (arm ? Math.PI / 2 : 0));
        bar.translate(hx, rim + pillarH + pipeR * 1.5, handleZ);
        parts.push({ geometry: bar, color: shade(PALETTE.RUST, 1.05), sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'sink', 0);
  },
};
