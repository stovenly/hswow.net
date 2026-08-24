import * as THREE from 'three';
import type { BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { rollActivity, CANDLE } from '../activity';
import { PALETTE, shade } from '../palette';
import { castFlame, flameGlow, rollFlame, FLAME_DECAY, type FlameOptions } from '../flame';
import type { Fields } from '../schema';

// A candle on a dish, sometimes several, sometimes on a stick — the small light,
// about one candela. Returns a `PointLight` at the flame and additive glow
// geometry as children of the mesh. The tint from `art/flame` is applied to the
// glow, the light and the wax's own upper reaches together, because the wax below
// a blue flame has to be lit blue.

/**
 * Intensity at the flame. Not candela: the units stop meaning anything the moment
 * `FLAME_DECAY` stops being inverse-square, so this is tuned by eye against how
 * the wax immediately around the wick reads.
 */
const LIGHT_INTENSITY = 2.15;
/**
 * Hard cutoff — past this it contributes nothing and costs nothing. At
 * `FLAME_DECAY` of 1.25 the falloff is d^1.25, so reaching twice as far at the
 * same brightness costs a factor of about 2.4.
 */
const LIGHT_RANGE = 14;

export const candle: BuilderWith<FlameOptions> = {
  name: 'candle',
  category: 'objects',
  options: { shadows: { type: 'boolean' } } satisfies Fields,
  radius: 0.3,

  build({ seed = 1, scale = 1, shadows = false } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    // One glow mesh per flame rather than one for the prop — see below.
    const flames: THREE.Mesh[] = [];
    const wicks: number[] = [];

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
    // Arranged on a circle and rotated by one random phase for the dish, so two
    // candles are never at the same bearing across instances. Rolled per candle it
    // is not a phase at all, and two of them share a spot often enough to see.
    const phase = rng.range(0, Math.PI * 2);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + phase;
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
      const leanX = Math.cos(leanAt) * lean;
      const leanZ = Math.sin(leanAt) * lean;

      const stick = new THREE.CylinderGeometry(radius * 0.92, radius, height, 7);
      stick.translate(0, height / 2, 0);
      stick.rotateX(leanX);
      stick.rotateZ(leanZ);
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

      // Where the wick actually is: the top of the candle's own axis carried through
      // the same two rotations the geometry took, in the same order. A sign wrong
      // here floats the flame beside the candle instead of on it.
      const tipX = ox - Math.sin(leanZ) * Math.cos(leanX) * height;
      const tipY = base + Math.cos(leanZ) * Math.cos(leanX) * height + radius * 2.2;
      const tipZ = oz + Math.sin(leanX) * height;

      // A bright core inside a wide faint halo, both additive and unlit, so they
      // stay bright whatever is lighting the room. Built at the origin in its own
      // mesh and moved to the wick: `LightActivity` swells a flame by scaling its
      // mesh, and three wicks sharing a buffer would grow about the point between
      // them and slide off their candles.
      const one: Part[] = [];
      flameGlow(one, flame, 0, 0, 0, radius * 1.35);
      const shape = assemble(one);
      // The variety `facing` used to give the merged buffer. Geometry rather
      // than the mesh, which `LightActivity` needs — see its `apply`.
      shape.rotateY(leanAt);
      flames.push(finishGlow(shape, 'candle:flame'));
      wicks.push(tipX, tipY, tipZ);

      // One light for the whole prop, not one per candle — three point lights
      // on an object this size is three shader iterations for a difference
      // nobody can see. Recorded here and hung after assembly.
      if (i === 0) lightAt.set(tipX, tipY, tipZ);
    }

    const geometry = assemble(parts);

    const facing = rng.range(0, Math.PI * 2);
    geometry.rotateY(facing);

    if (scale !== 1) geometry.scale(scale, scale, scale);

    const mesh = finish(geometry, 'candle', 0);

    // Everything hung on the prop rather than merged into it takes the facing and
    // the scale by hand. `rotateY` maps (x, z) to (x·cos + z·sin, −x·sin + z·cos).
    const cos = Math.cos(facing);
    const sin = Math.sin(facing);
    const place = (child: THREE.Object3D, x: number, y: number, z: number) => {
      child.position.set((cos * x + sin * z) * scale, y * scale, (-sin * x + cos * z) * scale);
      mesh.add(child);
    };

    for (let i = 0; i < flames.length; i++) {
      flames[i].scale.setScalar(scale);
      place(flames[i], wicks[i * 3], wicks[i * 3 + 1], wicks[i * 3 + 2]);
    }

    const light = new THREE.PointLight(
      flame.light,
      // Squared no longer applies cleanly at a non-physical decay, but the
      // relationship still has to hold in the same direction: a candle built at
      // half size must not be brighter at its own wick than a full-sized one.
      LIGHT_INTENSITY * rng.around(1, 0.15) * scale * scale,
      LIGHT_RANGE * scale,
      FLAME_DECAY,
    );
    if (shadows) castFlame(light, LIGHT_RANGE * scale);
    place(light, lightAt.x, lightAt.y, lightAt.z);

    // What it is doing over time, which drives both the light and the flame.
    mesh.userData.activity = rollActivity(CANDLE, rng);

    return mesh;
  },
};

/** Reused across builds. One prop is built at a time and never concurrently. */
const lightAt = new THREE.Vector3();
