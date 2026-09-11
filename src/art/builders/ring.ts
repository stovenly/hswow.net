import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { bezel, rollMetal, rollStone, stone, type Metal, type Stone } from '../worn';

// Ring: a band lying flat on y = 0, its head at +Z when it has one.

type Head = 'plain' | 'signet' | 'stone';

function roll(rng: Rng): { metal: Metal; head: Head; gem?: Stone } {
  const metal = rollMetal(rng);
  const head: Head = rng.chance(0.4) ? 'plain' : rng.chance(0.35) ? 'signet' : 'stone';
  const gem = head === 'stone' ? rollStone(rng) : undefined;
  return { metal, head, gem };
}

export const ring: MeshBuilder = {
  name: 'ring',
  category: 'objects',
  radius: 0.03,
  variants: 8,
  solid: false,

  nameFor(seed) {
    const { metal, gem } = roll(createRng(seed));
    return gem ? `${metal.name} ${gem.name} Ring` : `${metal.name} Ring`;
  },

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const { metal, head, gem } = roll(rng);

    const major = rng.range(0.013, 0.016);
    const tube = head === 'signet' ? rng.range(0.0023, 0.0029) : rng.range(0.0017, 0.0029);

    // TorusGeometry lies in XY with its axis on +Z; rotateX(π/2) takes +Z to −Y, so the band lies flat.
    const band = new THREE.TorusGeometry(major, tube, 6, 24);
    band.rotateX(Math.PI / 2);
    band.translate(0, tube, 0);
    parts.push({ geometry: band, color: metal.color, sway: 0, finish: metal.finish });

    if (head === 'signet') {
      const table = new THREE.CylinderGeometry(major * 0.42, major * 0.38, tube * 1.6, 8);
      table.scale(1.25, 1, 1);
      table.translate(0, tube * 1.8, major);
      parts.push({ geometry: table, color: metal.color, sway: 0, finish: metal.finish });
    }

    if (head === 'stone' && gem) {
      const cupR = major * 0.4;
      const cupH = tube * 1.4;
      const cup = bezel(cupR, cupH);
      cup.translate(0, tube, major);
      parts.push({ geometry: cup, color: metal.color, sway: 0, finish: metal.finish });
      const rock = stone(cupR * 0.82, gem.cut);
      rock.translate(0, tube + cupH * 0.85, major);
      parts.push({ geometry: rock, color: gem.color, sway: 0, finish: gem.finish });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'ring', 0);
  },
};
