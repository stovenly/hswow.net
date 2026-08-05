import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { rollActivity, LANTERN } from '../activity';
import { PALETTE, shade } from '../palette';
import { flameGlow, rollFlame, FLAME_DECAY } from '../flame';

/**
 * A carried lantern: a flame in a box, with a ring to lift it by.
 *
 * The third light in the kit and the one that sits between the other two.
 * `streetlamp` is fixed to a mast and lights a street; `candle` sits on a table
 * and marks a place on it; this is the one somebody picks up and takes with
 * them, so it is brighter than a candle, dimmer than a lamp, and — unlike
 * either — built to be looked at from every side at close range.
 *
 * Same flame table as the candle, so a shelf of lights in a room agrees with
 * itself: warm orange, warm red, or the cold blue that is not chemistry.
 *
 * ## The glass is the whole problem
 *
 * A lantern is defined by a pane you can see the flame through, and there is no
 * transparency in this kit — one shared `MeshLambertMaterial`, vertex colours,
 * no alpha. Modelling the panes as solid surfaces would hide the flame, which
 * removes the only thing that makes it a lantern.
 *
 * So the panes are simply *not there*. What is built is the frame around them:
 * a base, four corner posts, a lid, and horizontal rails top and bottom. The
 * flame shows through the gaps, which is exactly what it does in a real one,
 * and the eye supplies the glass because the frame implies it. The same
 * decision the streetlamp's lantern arrived at, for the same reason and
 * independently — which is a fair sign it is the right one.
 */

/**
 * Intensity at the flame.
 *
 * About twice a candle. A lantern is a bigger wick behind glass that is
 * reflecting some of it back out, and it is the thing you would actually carry
 * down a passage — it has to reach far enough to be worth carrying.
 *
 * Uses `FLAME_DECAY` rather than the physical exponent 2, for the reason
 * written out in `art/flame`: an inverse-square point light at hand distance
 * blows out to a flat white blob under this render pipeline.
 */
const LIGHT_INTENSITY = 5;
/**
 * Hard cutoff. Past this it contributes nothing and costs nothing.
 *
 * Doubled with the intensity. See the candle for why the intensity had to rise
 * by 2.4 rather than 2 to buy twice the reach.
 */
const LIGHT_RANGE = 18;

export const lantern: MeshBuilder = {
  name: 'lantern',
  category: 'objects',
  radius: 0.28,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    const flame = rollFlame(rng);
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.08));
    const rusty = rng.chance(0.35);
    const metal = rusty ? shade(PALETTE.RUST, rng.range(0.85, 1.05)) : iron;

    // A squat one and a tall one, and not much between. Lanterns come in
    // roughly two shapes and interpolating between them gives a family of
    // things that are each slightly wrong.
    const tall = rng.chance(0.45);
    const cage = rng.range(0.062, 0.082);
    const bodyH = cage * (tall ? 3.1 : 2.1) * rng.range(0.92, 1.08);
    const post = cage * 0.16;

    // --- the base ------------------------------------------------------------
    const footH = cage * 0.24;
    const foot = new THREE.CylinderGeometry(cage * 1.24, cage * 1.4, footH, 8);
    foot.translate(0, footH / 2, 0);
    parts.push({ geometry: foot, color: shade(metal, 0.82), sway: 0 });

    // A square pan the frame stands on. Round foot, square body — which is what
    // most of them are, and it means the silhouette changes as you walk round
    // it instead of being the same from every angle.
    const panH = cage * 0.16;
    const pan = new THREE.BoxGeometry(cage * 2.1, panH, cage * 2.1);
    pan.translate(0, footH + panH / 2, 0);
    parts.push({ geometry: pan, color: shade(metal, 0.9), sway: 0 });

    const bodyBase = footH + panH;

    // --- the frame -----------------------------------------------------------
    //
    // Four corner posts and no panes. See the header: the gaps are the glass.
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const upright = new THREE.BoxGeometry(post, bodyH, post);
        upright.translate((sx * (cage * 2 - post)) / 2, bodyBase + bodyH / 2, (sz * (cage * 2 - post)) / 2);
        parts.push({ geometry: upright, color: metal, sway: 0 });
      }
    }

    // Rails at the foot and shoulder of the cage, run at slightly different
    // lengths on the two axes so that no two boxes share an exact edge — a
    // shared edge belongs to four faces instead of two, which z-fights where it
    // shows and reads as a hole to any test of the solid.
    for (const at of [bodyBase + bodyH * 0.06, bodyBase + bodyH * 0.94]) {
      for (const along of [0, 1]) {
        const lengthwise = along === 0;
        const rail = new THREE.BoxGeometry(
          lengthwise ? cage * 2 : post * 0.9,
          post * 0.9,
          lengthwise ? post * 0.9 : cage * 2 - post * 2.2,
        );
        for (const side of [-1, 1]) {
          const copy = rail.clone();
          const offset = (cage * 2 - post) / 2;
          copy.translate(lengthwise ? 0 : side * offset, at, lengthwise ? side * offset : 0);
          parts.push({ geometry: copy, color: shade(metal, 0.92), sway: 0 });
        }
        rail.dispose();
      }
    }

    // --- the lid -------------------------------------------------------------
    //
    // A shallow pyramid with the top cut off, and a vent above it. Hot air has
    // to leave a lantern somewhere, and a sealed lid reads as a box with a lamp
    // painted on it.
    const lidBase = bodyBase + bodyH;
    const lidH = cage * 0.7;
    const lid = new THREE.CylinderGeometry(cage * 0.5, cage * 1.55, lidH, 4);
    // Four-sided cylinders come up corner-first; an eighth turn squares it to
    // the frame below.
    lid.rotateY(Math.PI / 4);
    lid.translate(0, lidBase + lidH / 2, 0);
    parts.push({ geometry: lid, color: shade(metal, 1.1), sway: 0 });

    const ventH = cage * 0.3;
    const vent = new THREE.CylinderGeometry(cage * 0.34, cage * 0.42, ventH, 6);
    vent.translate(0, lidBase + lidH + ventH / 2, 0);
    parts.push({ geometry: vent, color: shade(metal, 0.88), sway: 0 });

    // The bail: a ring to hook or carry it by. A full torus rather than a half
    // arc, because an arc is an open surface and this kit's solids are closed.
    const ringR = cage * 0.5;
    const ring = new THREE.TorusGeometry(ringR, post * 0.42, 4, 10);
    ring.rotateY(rng.chance(0.5) ? 0 : Math.PI / 2);
    ring.translate(0, lidBase + lidH + ventH + ringR * 0.85, 0);
    parts.push({ geometry: ring, color: shade(metal, 1.05), sway: 0 });

    // --- the flame -----------------------------------------------------------
    //
    // Low in the cage, where a wick actually sits, rather than in the middle of
    // it. A flame floating at the centre of a box is the reliable tell that the
    // light was placed by bisecting the geometry.
    const wick = bodyBase + bodyH * rng.range(0.24, 0.34);

    // A little dish of oil or a stub of tallow under it, so the flame has
    // something to be coming out of when you look in through the frame.
    const font = new THREE.CylinderGeometry(cage * 0.46, cage * 0.56, cage * 0.3, 8);
    font.translate(0, bodyBase + cage * 0.15, 0);
    parts.push({
      geometry: font,
      // Lit by what is directly above it, and lit *its* colour — the same
      // reason the candle's wax takes the flame tint near the wick.
      color: flame.color,
      sway: 0,
    });

    flameGlow(glow, flame, 0, wick, 0, cage * 0.42);

    // --- assembly ------------------------------------------------------------
    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    const facing = rng.range(0, Math.PI * 2);
    geometry.rotateY(facing);
    glowGeometry.rotateY(facing);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
    }

    const mesh = finish(geometry, 'lantern', 0);
    mesh.add(finishGlow(glowGeometry, 'lantern:glow'));

    const light = new THREE.PointLight(
      flame.light,
      // Scaled with the square of size for the same reason the lamp does it:
      // a lantern built at half size must not end up brighter at its own wick.
      LIGHT_INTENSITY * rng.around(1, 0.12) * scale * scale,
      LIGHT_RANGE * scale,
      FLAME_DECAY,
    );
    // On the axis, so the facing rotation does not move it.
    light.position.set(0, wick * scale, 0);
    light.castShadow = false;
    mesh.add(light);

    // What it is doing over time, which drives both the light and the flame.
    mesh.userData.activity = rollActivity(LANTERN, rng);

    return mesh;
  },
};
