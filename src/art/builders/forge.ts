import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { rollActivity, FORGE } from '../activity';
import { PALETTE, shade } from '../palette';

// A forge hearth: a brick firebox under a collecting hood and a flue. The
// funnel-to-pipe transition is the silhouette — a box with a fire in it is a
// brazier, and what says forge is a great hood spreading over it and narrowing
// hard into one thin flue. Returns a `PointLight` in the coal bed and additive
// glow for the embers, warm and low. Built facing +Z with the hood overhead, on
// y = 0.

/** Intensity at the coal bed, with soft falloff: an inverse-square light in a hearth you can lean over blows the whole near field onto one quantization level. */
const LIGHT_INTENSITY = 4.5;
const LIGHT_RANGE = 11;
const EMBER = 0xff8a3c;

/**
 * Height of the coal bed above the forge's base, for placing the `fire` emitter.
 * `bench` rolls between 0.62 and 0.92 and the fire sits 0.09 above it, so this is
 * the middle of that range and within a few centimetres on any instance.
 */
export const FORGE_FIRE_HEIGHT = 0.86;

export const forge: MeshBuilder = {
  name: 'forge',
  category: 'structures',
  radius: 1.3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    // Wide ranges. A village smithy's hearth and a foundry's are the same
    // object at very different sizes, and a rank of identical ones reads as a
    // catalogue.
    const width = rng.range(0.85, 1.8);
    const depth = rng.range(0.7, 1.25);
    const bench = rng.range(0.62, 0.92);
    // How hard it is being worked. Drives the fire, the light and how much of
    // the coal is glowing — one number, because those three always agree.
    const heat = rng.range(0.3, 1);
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    const brick = shade(rng.chance(0.5) ? 0x7a4a38 : 0x6b4436, rng.range(0.9, 1.1));
    const soot = 0x2a2724;

    // --- the firebox ---------------------------------------------------------
    // Brick, and coursed: one flat mass reads as a painted block whatever colour it
    // is, where three courses at slightly different shades read as masonry.
    const courses = rng.int(2, 4);
    for (let i = 0; i < courses; i++) {
      const h = bench / courses;
      const course = new THREE.BoxGeometry(width * (1 - i * 0.015), h, depth * (1 - i * 0.015));
      course.translate(0, h * (i + 0.5), 0);
      parts.push({ geometry: course, color: shade(brick, rng.range(0.9, 1.12)), sway: 0 });
    }

    // The hearth plate on top, sooted black, with a raised kerb round three
    // sides — open at the front, which is where the work goes in.
    const plate = new THREE.BoxGeometry(width * 1.02, 0.06, depth * 1.02);
    plate.translate(0, bench + 0.03, 0);
    parts.push({ geometry: plate, color: soot, sway: 0 });

    const kerb = 0.1;
    for (const [w, d, x, z] of [
      [width * 1.02, kerb, 0, -depth / 2],
      [kerb, depth * 1.02, -width / 2, 0],
      [kerb, depth * 1.02, width / 2, 0],
    ] as const) {
      const wall = new THREE.BoxGeometry(w, kerb * 1.6, d);
      wall.translate(x, bench + kerb * 0.8, z);
      parts.push({ geometry: wall, color: shade(brick, 0.86), sway: 0 });
    }

    // --- the coal bed --------------------------------------------------------
    // A shallow heap of lumps in the middle, on the lit material rather than the
    // glow one: coal is mostly dark, and only the fire in it glows.
    const lumps = rng.int(5, 9);
    for (let i = 0; i < lumps; i++) {
      const a = rng.range(0, Math.PI * 2);
      const away = Math.sqrt(rng()) * width * 0.22;
      const size = rng.range(0.035, 0.075);
      const coal = new THREE.IcosahedronGeometry(size, 0);
      coal.rotateY(rng.range(0, Math.PI));
      coal.translate(Math.cos(a) * away, bench + 0.06 + size * 0.5, Math.sin(a) * away);
      // A few of the lumps nearest the middle are lit through rather than black, and
      // still on the lit material — coal that has caught is a dull red surface.
      parts.push({
        geometry: coal,
        color: rng.chance(heat * 0.45) ? 0x9c3f24 : shade(soot, rng.range(0.85, 1.3)),
        sway: 0,
      });
    }

    // The fire itself: a low flat glow through the coals, and a small core.
    // Flat, because a forge fire is a *bed* — flames standing off it would read
    // as a bonfire, and the whole point of a hearth is that it burns down low.
    const bedY = bench + 0.09;
    const bed = new THREE.OctahedronGeometry(width * 0.2 * (0.6 + heat * 0.6), 0);
    bed.scale(1, 0.32, 0.8);
    bed.translate(0, bedY, 0);
    glow.push({ geometry: bed, color: EMBER, sway: 0 });

    const core = new THREE.OctahedronGeometry(width * 0.09, 0);
    core.scale(1, 0.5, 1);
    core.translate(rng.around(0, 0.05), bedY + 0.02, rng.around(0, 0.05));
    glow.push({ geometry: core, color: 0xffd08a, sway: 0 });

    // --- the hood ------------------------------------------------------------
    // Sheet steel, spreading over the hearth and closing to the flue: a lathe from a
    // closed profile that never reaches the axis, which is the only way a solid of
    // revolution comes out watertight.
    const hoodBase = bench + rng.range(0.6, 1.15);
    const hoodTop = hoodBase + rng.range(0.65, 1.3);
    const spread = width * rng.range(0.62, 0.75);
    const neck = rng.range(0.16, 0.22);
    const skin = 0.03;

    const hood = new THREE.LatheGeometry(
      [
        new THREE.Vector2(spread, hoodBase),
        new THREE.Vector2(neck, hoodTop),
        new THREE.Vector2(neck - skin, hoodTop),
        new THREE.Vector2(spread - skin, hoodBase),
        new THREE.Vector2(spread, hoodBase),
      ],
      6,
    );
    hood.rotateY(Math.PI / 6);
    parts.push({ geometry: hood, color: shade(iron, 0.92), sway: 0 });

    // A rim round the mouth, which is what makes the hood read as folded sheet
    // rather than as a cast cone.
    const rim = new THREE.CylinderGeometry(spread * 1.05, spread * 1.05, skin * 2.2, 6);
    rim.rotateY(Math.PI / 6);
    rim.translate(0, hoodBase + skin, 0);
    parts.push({ geometry: rim, color: shade(iron, 1.1), sway: 0 });

    // The flue, running up out of sight. Long enough to leave the frame of any
    // room this is put in — a chimney that stops in mid-air is worse than none.
    const flue = new THREE.CylinderGeometry(neck * 0.94, neck * 0.94, 2.4, 6);
    flue.translate(0, hoodTop + 1.2, 0);
    parts.push({ geometry: flue, color: shade(iron, 0.86), sway: 0 });

    // Stays from the hood down to the firebox, so it is carried rather than
    // hovering.
    for (const side of [-1, 1]) {
      const stay = new THREE.BoxGeometry(0.06, hoodBase - bench, 0.06);
      stay.translate((side * width) / 2 * 0.86, bench + (hoodBase - bench) / 2, -depth * 0.36);
      parts.push({ geometry: stay, color: iron, sway: 0 });
    }

    // --- assembly ------------------------------------------------------------
    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
    }

    const mesh = finish(geometry, 'forge', 0);
    mesh.add(finishGlow(glowGeometry, 'forge:glow'));

    const light = new THREE.PointLight(
      0xff9440,
      LIGHT_INTENSITY * (0.35 + heat * 0.9) * rng.around(1, 0.1) * scale * scale,
      LIGHT_RANGE * scale,
      // Soft falloff, as the candle and lantern use. See `art/flame`.
      1.35,
    );
    light.position.set(0, (bedY + 0.1) * scale, 0);
    light.castShadow = false;
    mesh.add(light);

    // What it is doing over time, which drives both the light and the flame.
    mesh.userData.activity = rollActivity(FORGE, rng);

    return mesh;
  },
};
