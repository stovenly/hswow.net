import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { Fields } from '../schema';

// A barrel: bellied staves with iron hoops, sometimes lying on its side. The
// belly is three stacked sections, because a straight tube with hoops on it
// reads as a can.

export interface BarrelOptions extends BuildOptions {
  /**
   * Whether it has been knocked over. Rolled from the seed when unsaid, and stated
   * by anything that needs to know which way up it is before it has one. The roll
   * still happens either way, so asking does not reshuffle the coopering.
   */
  fallen?: boolean;
}

export const barrel: BuilderWith<BarrelOptions> = {
  name: 'barrel',
  category: 'objects',
  options: { fallen: { type: 'boolean' } } satisfies Fields,
  radius: 0.55,

  build({ seed = 1, scale = 1, fallen: asked }: BarrelOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(0.75, 1.05);
    const waist = rng.range(0.3, 0.4);
    const end = waist * rng.range(0.78, 0.88);
    const sides = rng.int(8, 11);
    const rolled = rng.chance(0.25);
    const fallen = asked ?? rolled;

    // Turned on a lathe from a profile, which is how a barrel is made and gives one
    // continuous bellied surface. Stacked cylinders each bring their own end caps,
    // so every join is a buried pair of coincident faces.
    const profile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(end, 0),
      new THREE.Vector2(waist, height * 0.35),
      new THREE.Vector2(waist, height * 0.65),
      new THREE.Vector2(end, height),
      new THREE.Vector2(0, height),
    ];
    parts.push({
      geometry: new THREE.LatheGeometry(profile, sides),
      color: PALETTE.TIMBER,
      sway: 0,
    });

    // Hoops, standing slightly proud so they catch the light separately.
    for (const at of [0.14, 0.5, 0.86]) {
      const radius = at > 0.3 && at < 0.7 ? waist : end + (waist - end) * 0.45;
      const hoop = new THREE.CylinderGeometry(radius * 1.04, radius * 1.04, 0.055, sides);
      hoop.translate(0, height * at, 0);
      parts.push({ geometry: hoop, color: PALETTE.IRON, sway: 0 });
    }

    let geometry = assemble(parts);
    if (fallen) {
      // On its side and rolled a little — a barrel that has been knocked over
      // and stopped where it stopped.
      geometry.rotateX(Math.PI / 2);
      geometry.rotateY(rng.range(0, Math.PI * 2));
      geometry.translate(0, waist, 0);
    }
    if (scale !== 1) geometry = geometry.scale(scale, scale, scale);
    return finish(geometry, 'barrel', 0);
  },
};
