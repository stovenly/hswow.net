import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { flameGlow, rollFlame, FLAME_DECAY } from '../flame';

/**
 * A candle on a dish, sometimes several, sometimes on a stick.
 *
 * The small light. `streetlamp` is the one that lights a street; this is the
 * one that lights a table, and the difference is nearly two orders of magnitude
 * of intensity — a real candle is about one candela, which is where the unit
 * comes from and which three's physically-based lighting takes literally.
 *
 * Like the lamp it returns more than geometry: a `PointLight` at the flame for
 * what it does to a room, and additive glow geometry for the flame you can see.
 * Both are children of the mesh, so a candle is still one thing to place.
 *
 * The tint comes from `art/flame` — warm orange, warm red, or a cold pale blue
 * — and is applied to the glow, to the point light, and to the wax's own upper
 * reaches together. A flame whose light does not match its colour is the single
 * most obvious tell that a light source has been assembled out of parts: the
 * wax immediately below a blue flame has to be lit blue, and that is a vertex
 * colour rather than a second light.
 */

/**
 * Intensity at the flame.
 *
 * Not candela any more, because `FLAME_DECAY` is not 2 — the units stop meaning
 * anything the moment the falloff stops being inverse-square, so this is a
 * number tuned by eye against the one that matters, which is how the wax
 * immediately around the wick reads.
 *
 * Lower than it was, and reaching much further, which is the same change made
 * twice: the old value was correct at arm's length and blew out to flat white
 * anywhere nearer.
 */
const LIGHT_INTENSITY = 2.15;
/**
 * Hard cutoff. Past this it contributes nothing and costs nothing.
 *
 * Doubled, along with the intensity — and the intensity had to go up by rather
 * more than two to keep pace. At `FLAME_DECAY` of 1.25 the falloff is d^1.25,
 * so reaching twice as far at the same brightness costs a factor of 2^1.25,
 * about 2.4. Doubling both would have given twice the range at four fifths of
 * the light.
 */
const LIGHT_RANGE = 14;

export const candle: MeshBuilder = {
  name: 'candle',
  category: 'objects',
  radius: 0.3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    const flame = rollFlame(rng);
    // Beeswax is honey-coloured and tallow is grey-white. Rolled per candle
    // rather than per instance of the prop, so a group on one dish matches —
    // they came from the same batch.
    const wax = rng.chance(0.5) ? 0xd8cdae : 0xbfb9a8;

    // A dish, or a stick. The stick is taller than everything else in the prop
    // put together, so which one it is decides the silhouette entirely.
    const onStick = rng.chance(0.35);
    const dishRadius = rng.range(0.075, 0.11);
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));

    let base = 0;

    if (onStick) {
      const stem = rng.range(0.16, 0.3);
      const foot = new THREE.CylinderGeometry(dishRadius * 0.62, dishRadius * 1.05, 0.022, 8);
      foot.translate(0, 0.011, 0);
      parts.push({ geometry: foot, color: shade(iron, 0.86), sway: 0 });

      const shaft = new THREE.CylinderGeometry(0.014, 0.019, stem, 6);
      shaft.translate(0, 0.022 + stem / 2, 0);
      parts.push({ geometry: shaft, color: iron, sway: 0 });

      // A drip pan partway up, which is most of what makes a candlestick
      // legible as one rather than as a nail standing on a coin.
      if (rng.chance(0.6)) {
        const pan = new THREE.CylinderGeometry(dishRadius * 0.78, dishRadius * 0.5, 0.016, 8);
        pan.translate(0, 0.022 + stem * rng.range(0.45, 0.62), 0);
        parts.push({ geometry: pan, color: shade(iron, 1.08), sway: 0 });
      }

      base = 0.022 + stem;
    }

    // The dish under the candles. A shallow saucer with a lip, which is a
    // cylinder and a slightly wider ring — no constructive solid geometry here
    // and none needed.
    const dish = new THREE.CylinderGeometry(dishRadius, dishRadius * 0.88, 0.018, 10);
    dish.translate(0, base + 0.009, 0);
    parts.push({ geometry: dish, color: shade(iron, 0.94), sway: 0 });
    base += 0.018;

    // One, two or three. Three on one dish of this size is crowded, which is
    // why they lean — see below.
    const count = 1 + (rng.chance(0.42) ? 1 : 0) + (rng.chance(0.18) ? 1 : 0);
    const spread = dishRadius * 0.42;

    for (let i = 0; i < count; i++) {
      // Arranged on a circle rather than in a row, and rotated by a random
      // phase, so two candles are never at the same bearing across instances.
      const angle = (i / count) * Math.PI * 2 + rng.range(0, Math.PI * 2);
      const ox = count === 1 ? 0 : Math.cos(angle) * spread;
      const oz = count === 1 ? 0 : Math.sin(angle) * spread;

      // Burned down by different amounts. A group of candles at identical
      // height reads as a manufactured object; the whole reason to have three
      // is that they disagree.
      const height = rng.range(0.05, 0.16);
      const radius = rng.range(0.011, 0.016);

      // A lean, so they are set in wax by hand rather than machined into
      // sockets. Small — past about eight degrees they read as falling over.
      const lean = rng.range(0, 0.13);
      const leanAt = rng.range(0, Math.PI * 2);

      const stick = new THREE.CylinderGeometry(radius * 0.92, radius, height, 7);
      stick.translate(0, height / 2, 0);
      stick.rotateX(Math.cos(leanAt) * lean);
      stick.rotateZ(Math.sin(leanAt) * lean);
      stick.translate(ox, base, oz);

      // The wax nearest the flame is lit by it, and lit *its* colour. Without
      // this a blue flame sits on top of a candle lit warm by the room and the
      // two read as two separate objects that happen to be touching.
      const litFrom = base + height * 0.55;
      parts.push({
        geometry: stick,
        color: (_x, y) => (y > litFrom ? flame.color : wax),
        sway: 0,
      });

      // Where the wick actually is, once the lean has moved the top of the
      // candle off its own axis.
      const tipX = ox + Math.sin(Math.sin(leanAt) * lean) * height;
      const tipZ = oz - Math.sin(Math.cos(leanAt) * lean) * height;
      const tipY = base + height;

      // A bright core inside a wide faint halo, both additive and unlit, so
      // they stay bright regardless of what is lighting the room around them.
      // The halo is what stops the flame reading as a small orange solid.
      flameGlow(glow, flame, tipX, tipY + radius * 2.2, tipZ, radius * 1.35);

      // One light for the whole prop, not one per candle — three point lights
      // on an object this size is three shader iterations for a difference
      // nobody can see. Recorded here and hung after assembly.
      if (i === 0) lightAt.set(tipX, tipY + radius * 2.2, tipZ);
    }

    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    const facing = rng.range(0, Math.PI * 2);
    geometry.rotateY(facing);
    glowGeometry.rotateY(facing);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
    }

    const mesh = finish(geometry, 'candle', 0);
    mesh.add(finishGlow(glowGeometry, 'candle:glow'));

    // `rotateY` maps (x, z) to (x·cos − z·(−sin))… written out rather than
    // built with a matrix because it is two lines and a matrix here would be
    // three plus an allocation.
    const lx = Math.cos(facing) * lightAt.x + Math.sin(facing) * lightAt.z;
    const lz = -Math.sin(facing) * lightAt.x + Math.cos(facing) * lightAt.z;

    const light = new THREE.PointLight(
      flame.light,
      // Squared no longer applies cleanly at a non-physical decay, but the
      // relationship still has to hold in the same direction: a candle built at
      // half size must not be brighter at its own wick than a full-sized one.
      LIGHT_INTENSITY * rng.around(1, 0.15) * scale * scale,
      LIGHT_RANGE * scale,
      FLAME_DECAY,
    );
    light.position.set(lx * scale, lightAt.y * scale, lz * scale);
    light.castShadow = false;
    mesh.add(light);

    return mesh;
  },
};

/** Reused across builds. One prop is built at a time and never concurrently. */
const lightAt = new THREE.Vector3();
