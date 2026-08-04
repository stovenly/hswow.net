import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A wooden washtub: flared staves, iron hoops, and the washing still in it.
 *
 * **The floor-level piece.** A room where everything begins at knee height and
 * goes up has no bottom to it, and a wide shallow bowl is the shape that fixes
 * that — it is read almost entirely as a horizontal ellipse, which is a thing
 * nothing else indoors is.
 *
 * Deliberately *not* a barrel. A barrel bellies outward at its waist and stands
 * taller than it is wide; this flares straight from a narrow foot to a wide
 * rim and is twice as wide as it is tall. The two are made by the same trade
 * out of the same materials and the only thing keeping them apart on screen is
 * that proportion, so the ranges here never come near a barrel's.
 *
 * Turned from a profile rather than stacked out of rings, for the reason the
 * barrel records: every cylinder brings its own end caps, and two of them
 * meeting buries a pair of coincident faces inside the solid. A profile that
 * runs up the outside, over the rim, down the inside and across the floor is a
 * closed vessel in one piece, and its only degenerate triangles are at the two
 * points where it meets the axis.
 *
 * The laundry hanging over the rim is what makes it a washtub in use rather
 * than a tub in a shop. It also breaks the outline: a perfect circle reads as
 * geometry, and a circle with a rag over one side reads as somebody's Monday.
 */
export const washtub: MeshBuilder = {
  name: 'washtub',
  category: 'objects',
  radius: 0.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const rimRadius = rng.range(0.34, 0.46);
    const height = rng.range(0.26, 0.36);
    const footRadius = rimRadius * rng.range(0.72, 0.82);
    const wall = rng.range(0.028, 0.04);
    const floorT = rng.range(0.04, 0.06);
    const sides = rng.int(10, 14);

    const timber = rng.chance(0.5) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK;
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));

    // Outer bottom, outer wall, rim, inner wall, inner floor. Both ends land on
    // the axis, which closes the surface at the poles.
    const profile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(footRadius, 0.006),
      new THREE.Vector2(rimRadius, height),
      new THREE.Vector2(rimRadius - wall * 0.8, height),
      new THREE.Vector2(footRadius - wall, floorT),
      new THREE.Vector2(0, floorT),
    ];
    parts.push({
      geometry: new THREE.LatheGeometry(profile, sides),
      color: timber,
      sway: 0,
    });

    // --- hoops ----------------------------------------------------------------
    //
    // Tapered to match the stave line at the height they sit. A straight-sided
    // hoop on a flared tub touches at one edge and floats at the other, and on
    // a shape this simple that is the only place a mistake can show.
    const radiusAt = (t: number): number => footRadius + (rimRadius - footRadius) * t;
    for (const at of [rng.range(0.16, 0.26), rng.range(0.72, 0.84)]) {
      const band = rng.range(0.03, 0.045);
      const lower = radiusAt(at - band / (2 * height)) * 1.03;
      const upper = radiusAt(at + band / (2 * height)) * 1.03;
      const hoop = new THREE.CylinderGeometry(upper, lower, band, sides);
      hoop.translate(0, height * at, 0);
      parts.push({ geometry: hoop, color: iron, sway: 0 });
    }

    // --- water ----------------------------------------------------------------
    //
    // A disc low in the tub, never near the rim. Water filled to the brim reads
    // as a solid slug of colour with a wooden ring round it; sunk, the shadow
    // of the rim falls across it and it reads as depth.
    const wet = rng.chance(0.7);
    const waterLevel = height * rng.range(0.35, 0.6);
    if (wet) {
      const inner = radiusAt(waterLevel / height) - wall;
      const water = new THREE.CylinderGeometry(inner, inner * 0.96, 0.02, sides);
      water.translate(0, waterLevel, 0);
      parts.push({ geometry: water, color: PALETTE.WATER, sway: 0 });
    }

    // --- no washing over the rim ---------------------------------------------
    //
    // **There were three cloth slabs draped over the rim and they are gone.**
    // The idea was that a circle with a rag over one side reads as somebody's
    // Monday rather than as an empty prop, and that is a fair idea. The
    // execution could not work: a hanging cloth is a *bent sheet*, and nothing
    // in this kit may be a sheet — every part has to be a closed solid — so it
    // was built as three separate boxes at three angles pretending to be one
    // draped piece. Boxes do not fold, so the corners passed through the rim
    // and through each other at most rolls, and the join between the inside
    // slab and the one over the rim was never closed.
    //
    // A tub with water in it and a washboard leaning in it is already somebody
    // halfway through a job. The laundry was the part that could not be made
    // to look like laundry, so it is not here.

    // --- no washboard --------------------------------------------------------
    //
    // Gone with the laundry, and for the same reason: it was staging a scene.
    // A board leaning in the tub says somebody is halfway through a wash, which
    // is a lovely thing for *one* prop in a room and wrong for a placeable —
    // twenty of them across a village is twenty interrupted washdays. A tub is
    // a tub; whether anyone is using it is the zone's business, not the
    // builder's.

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'washtub', 0, 'metal-hollow-small');
  },
};
