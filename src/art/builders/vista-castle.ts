import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

/**
 * A castle on its own hill — the largest built thing in the band.
 *
 * `vista-tower` is one shaft, and it reads as "somebody put a marker there".
 * This reads as *somewhere*: a mound, a keep, a run of curtain wall and the
 * corner turrets that make a wall a wall. It is the thing on the far ridge that
 * a player points at, which is the whole reason the band has a roster instead of
 * a hill and a copse.
 *
 * ## Three rules, all of them about being a kilometre away
 *
 * - **It stands on ground of its own.** A castle on flat land at this distance
 *   is a lump of stone in a field. The mound is most of what says "fortified" —
 *   it lifts the silhouette clear of the horizon line and puts a shadowed skirt
 *   under it, and it costs twenty triangles.
 * - **Rectangles, not cylinders.** At a couple of hundred metres the difference
 *   between a hexagonal turret and a square one is nothing, but the difference
 *   between straight edges and a soft mass is everything: straight is the only
 *   cue that separates built from geological once fog has taken the detail.
 * - **One thing is taller than everything else.** A castle silhouette is a
 *   stepped profile — wall, keep, tower — and the eye reads the steps rather
 *   than any of the shapes. Even heights read as a factory.
 *
 * Around 190 triangles, which is the most expensive prop in the family and the
 * only one that earns it. Well under the 300 the spec allows.
 */

const STONE = [PALETTE.STONE_DARK, PALETTE.STONE, PALETTE.STONE_PALE] as const;
/** The mound. Ordinary hillside, so it belongs to the land and not to the wall. */
const TURF = [PALETTE.LEAF_DARK, PALETTE.LEAF, PALETTE.GRASS] as const;

export const vistaCastle: MeshBuilder = {
  name: 'vista-castle',
  category: 'vista',
  radius: 17,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // --- the hill it sits on -------------------------------------------------
    const moundRadius = rng.range(15, 19);
    const moundHeight = rng.range(0.34, 0.44);
    const mound = vistaMass(rng, {
      radius: moundRadius,
      // Twenty triangles. It is a plinth seen through haze, not a hill.
      detail: 0,
      rough: rng.range(0.1, 0.18),
      squash: moundHeight,
      stretch: rng.range(0.85, 1.2),
      bury: 0.52,
    });
    const crown = moundRadius * moundHeight * 0.48;
    parts.push({
      geometry: mound,
      color: landWash(seed ^ 0x0c57, TURF, { scale: rng.range(24, 40), crown }),
      sway: 0,
    });

    // --- the curtain, and what stands on it ----------------------------------
    // Two runs meeting at a corner rather than a full circuit: from any one
    // bearing you see two faces of a castle and never four, and the two that
    // are hidden cost as much as the two that are not.
    const wallHigh = rng.range(6, 8.5);
    const wallThick = rng.range(2.6, 3.6);
    const across = rng.range(15, 20);
    const along = rng.range(13, 18);
    const stone = (): number => shade(rng.pick(STONE), rng.range(0.94, 1.06));

    const block = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
    ): THREE.BufferGeometry => {
      const box = new THREE.BoxGeometry(width, height, depth);
      box.translate(x, y + height / 2, z);
      return box;
    };

    parts.push(
      {
        geometry: block(across, wallHigh, wallThick, 0, crown - 1, -along / 2),
        color: stone(),
        sway: 0,
      },
      {
        geometry: block(wallThick, wallHigh, along, -across / 2, crown - 1, 0),
        color: stone(),
        sway: 0,
      },
    );

    // Corner turrets, a head taller than the wall they punctuate. Three, at the
    // ends and the join — the fourth corner is behind the keep from every angle
    // that matters.
    const turret = rng.range(3.4, 4.6);
    const turretHigh = wallHigh * rng.range(1.35, 1.6);
    for (const [x, z] of [
      [-across / 2, -along / 2],
      [across / 2, -along / 2],
      [-across / 2, along / 2],
    ] as const) {
      parts.push({
        geometry: block(turret, turretHigh, turret, x, crown - 1.4, z),
        color: stone(),
        sway: 0,
      });
    }

    // --- the keep ------------------------------------------------------------
    // Off centre, because a keep sits in a corner of its bailey and a centred
    // one reads as a chimney.
    const keepWide = rng.range(6.5, 8.5);
    const keepHigh = wallHigh * rng.range(2.1, 2.7);
    const keepAt: readonly [number, number] = [rng.range(1, 4), rng.range(-2, 2)];
    parts.push({
      geometry: block(keepWide, keepHigh, keepWide * rng.range(0.85, 1.15), keepAt[0], crown - 1, keepAt[1]),
      color: shade(PALETTE.STONE, rng.range(0.92, 1.02)),
      sway: 0,
    });

    // The cap, and always darker. A roof reads as a roof because it is the dark
    // step at the top of a pale mass, which survives fog when its shape does
    // not — `vista-tower` says the same thing about the same twelve triangles.
    const roofHigh = rng.range(3, 5);
    const roof = new THREE.ConeGeometry(keepWide * rng.range(0.7, 0.85), roofHigh, 4);
    roof.rotateY(Math.PI / 4);
    roof.translate(keepAt[0], crown - 1 + keepHigh + roofHigh / 2, keepAt[1]);
    parts.push({
      geometry: roof,
      color: shade(PALETTE.STONE_DARK, rng.range(0.58, 0.72)),
      sway: 0,
    });

    const merged = assemble(parts);
    merged.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-castle', 0));
  },
};
