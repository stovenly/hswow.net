import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { bezel, rollMetal, rollStone, stone, type Metal, type Stone } from '../worn';

// Brooch: a disc or an annular brooch face up on y = 0, its pin along x.

const PIN_RADIUS = 0.001;

function roll(rng: Rng): { metal: Metal; annular: boolean; gem?: Stone } {
  const metal = rollMetal(rng);
  const annular = rng.chance(0.4);
  const gem = !annular && rng.chance(0.5) ? rollStone(rng) : undefined;
  return { metal, annular, gem };
}

export const brooch: MeshBuilder = {
  name: 'brooch',
  category: 'objects',
  radius: 0.045,
  variants: 8,
  solid: false,

  nameFor(seed) {
    const { metal, gem } = roll(createRng(seed));
    return gem ? `${metal.name} ${gem.name} Brooch` : `${metal.name} Brooch`;
  },

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const { metal, annular, gem } = roll(rng);
    const metalPart = (geometry: THREE.BufferGeometry): Part => ({
      geometry,
      color: metal.color,
      sway: 0,
      finish: metal.finish,
    });

    if (annular) {
      const major = rng.range(0.021, 0.028);
      const tube = rng.range(0.0035, 0.005);
      // TorusGeometry lies in XY with its axis on +Z; rotateX(π/2) takes +Z to −Y, so it lies flat.
      const hoop = new THREE.TorusGeometry(major, tube, 6, 24);
      hoop.rotateX(Math.PI / 2);
      hoop.translate(0, tube, 0);
      parts.push(metalPart(hoop));
      // CylinderGeometry's axis is +Y; rotateZ(π/2) takes +Y to −X, so the pin lies along x across the opening.
      const pin = new THREE.CylinderGeometry(PIN_RADIUS, PIN_RADIUS, major * 2 + tube, 6);
      pin.rotateZ(Math.PI / 2);
      pin.translate(0, tube, 0);
      parts.push(metalPart(pin));
    } else {
      const radius = rng.range(0.021, 0.032);
      const thick = rng.range(0.0055, 0.0085);
      const under = PIN_RADIUS * 2;
      const pin = new THREE.CylinderGeometry(PIN_RADIUS, PIN_RADIUS, radius * 1.6, 6);
      pin.rotateZ(Math.PI / 2);
      pin.translate(0, PIN_RADIUS, 0);
      parts.push(metalPart(pin));

      const face = new THREE.CylinderGeometry(radius, radius * 0.96, thick, 16);
      face.translate(0, under + thick / 2, 0);
      parts.push(metalPart(face));
      const rim = new THREE.TorusGeometry(radius * 0.88, thick * 0.22, 5, 24);
      rim.rotateX(Math.PI / 2);
      rim.translate(0, under + thick, 0);
      parts.push(metalPart(rim));

      const top = under + thick;
      if (gem) {
        const cupR = radius * 0.3;
        const cupH = thick * 0.5;
        const cup = bezel(cupR, cupH);
        cup.translate(0, top - thick * 0.2, 0);
        parts.push(metalPart(cup));
        const rock = stone(cupR * 0.8, gem.cut);
        rock.translate(0, top - thick * 0.2 + cupH * 0.85, 0);
        parts.push({ geometry: rock, color: gem.color, sway: 0, finish: gem.finish });
      } else {
        const boss = new THREE.SphereGeometry(radius * 0.3, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
        boss.translate(0, top - thick * 0.1, 0);
        parts.push(metalPart(boss));
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'brooch', 0);
  },
};
