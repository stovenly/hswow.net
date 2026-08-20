import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// Fallen sticks, lying where they came down. Flat: windfall lies down, and a heap
// of standing timber is a bonfire, which is a thing somebody made. Disorder is the
// silhouette and it has to be real — bearings are fully random and the sticks are
// allowed to interpenetrate, because arranging them tidily produces a bundle of
// firewood.
export const sticks: MeshBuilder = {
  name: 'sticks',
  category: 'nature',
  radius: 1,
  // Walked over. Ankle-height litter that stops the player is the single most
  // annoying thing a forest floor can contain, and there is nothing here worth
  // being stopped by.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Few, and flat. Windfall lies down: a scatter with a slight mound in it, and
    // almost nothing in it upright — propped sticks make a bonfire, which is a thing
    // somebody built.
    const count = rng.int(6, 11);
    const spread = rng.range(0.5, 0.95);
    const bark = rng.chance(0.5) ? PALETTE.BARK : PALETTE.BARK_PALE;

    for (let i = 0; i < count; i++) {
      const length = rng.range(0.4, 1.5);
      const thick = rng.range(0.018, 0.05);
      // Mostly lying, some propped. The propped ones give the pile height and
      // are the reason it is not a mat.
      // Almost flat. One in ten is propped a little where it has come to rest
      // across another, and nothing is anywhere near upright.
      const pitch = rng.chance(0.1) ? rng.range(0.12, 0.26) : rng.range(0, 0.06);
      const bearing = rng.range(0, Math.PI * 2);

      const stick = new THREE.CylinderGeometry(thick * 0.7, thick, length, 4);
      stick.rotateZ(Math.PI / 2);
      stick.rotateZ(pitch);
      stick.rotateY(bearing);

      // Piled toward the middle: the offset shrinks with height, so the heap
      // is a mound rather than a column.
      const rest = rng.range(0, 0.05) + Math.sin(pitch) * length * 0.4;
      const away = Math.sqrt(rng()) * spread * (1 - rest * 0.5);
      const at = rng.range(0, Math.PI * 2);
      stick.translate(Math.cos(at) * away, thick + rest, Math.sin(at) * away);

      parts.push({
        geometry: stick,
        color: shade(bark, rng.range(0.82, 1.14)),
        sway: 0,
      });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'sticks', 0);
  },
};
