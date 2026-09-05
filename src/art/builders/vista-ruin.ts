import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { markVista, vistaBank, vistaMass } from '../vista';
import { block } from '../vista-kit';

// A ruin on a knoll: a broken tower with a jagged top and one standing wall.

export const vistaRuin: MeshBuilder = {
  name: 'vista-ruin',
  category: 'vista',
  radius: 16,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const moundRadius = rng.range(13, 17);
    const mound = vistaMass(rng, {
      radius: moundRadius,
      detail: 0,
      rough: rng.range(0.1, 0.18),
      squash: rng.range(0.35, 0.45),
      stretch: rng.range(0.85, 1.2),
      bury: 0.5,
    });
    const crown = moundRadius * 0.4 * 0.5;
    const parts: Part[] = [
      {
        geometry: mound,
        color: vistaBank(seed ^ 0x2a11, { ground: 'pasture', bands: [{ material: 'scrub', steeperThan: 0.5 }], crown }),
        sway: 0,
      },
    ];

    const height = rng.range(9, 13);
    const foot = rng.range(2.6, 3.4);
    const tower = new THREE.CylinderGeometry(foot * 0.85, foot, height, 6, 1, true);
    tower.deleteAttribute('uv');
    const position = tower.getAttribute('position');
    for (let i = 0; i < position.count; i++) {
      if (position.getY(i) > 0) position.setY(i, position.getY(i) - rng.range(0, height * 0.45));
    }
    position.needsUpdate = true;
    tower.translate(0, height / 2 + crown - 1, 0);
    const stone = shade(rng.pick([PALETTE.STONE_DARK, PALETTE.STONE]), 0.95);
    parts.push({ geometry: tower, color: stone, sway: 0 });

    const wallLength = rng.range(7, 10);
    const wall = block(wallLength, rng.range(4, 6), 1.2, foot + wallLength / 2, crown - 1.2, rng.range(-2, 2));
    wall.rotateY(rng.range(-0.4, 0.4));
    parts.push({ geometry: wall, color: shade(stone, 0.95), sway: 0 });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-ruin', 0));
  },
};
