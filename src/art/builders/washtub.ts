import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A wooden washtub: flared staves, iron hoops, and the washing still in it — the
// floor-level piece, read almost entirely as a horizontal ellipse. Not a barrel:
// it flares straight from a narrow foot to a wide rim and is twice as wide as it
// is tall, and proportion is the only thing keeping the two apart on screen.
// Turned from a closed profile rather than stacked out of rings, which would bury
// coincident end caps at every join. The laundry over the rim breaks the outline.
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
    // Tapered to match the stave line at the height they sit: a straight-sided hoop
    // on a flared tub touches at one edge and floats at the other.
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
    // A disc low in the tub, never near the rim. Filled to the brim it reads as a
    // solid slug of colour with a wooden ring round it; sunk, the shadow of the rim
    // falls across it and it reads as depth.
    const wet = rng.chance(0.7);
    const waterLevel = height * rng.range(0.35, 0.6);
    if (wet) {
      const inner = radiusAt(waterLevel / height) - wall;
      const water = new THREE.CylinderGeometry(inner, inner * 0.96, 0.02, sides);
      water.translate(0, waterLevel, 0);
      parts.push({ geometry: water, color: PALETTE.WATER, sway: 0 });
    }



    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    // No declared material: it is a wooden vessel with two iron bands round it,
    // the staves are nearly all of its surface, and the geometry says so.
    return finish(geometry, 'washtub', 0);
  },
};
