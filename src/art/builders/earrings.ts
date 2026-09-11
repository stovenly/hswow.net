import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { bezel, rollMetal, rollStone, stone, type Metal, type Stone } from '../worn';

// Earrings: a matched pair of drops side by side across x on y = 0, hooks open toward −Z.

const WIRE = 0.0009;

function roll(rng: Rng): { metal: Metal; gem?: Stone } {
  const metal = rollMetal(rng);
  const gem = rng.chance(0.5) ? rollStone(rng) : undefined;
  return { metal, gem };
}

export const earrings: MeshBuilder = {
  name: 'earrings',
  category: 'objects',
  radius: 0.045,
  variants: 8,
  solid: false,

  nameFor(seed) {
    const { metal, gem } = roll(createRng(seed));
    return gem ? `${metal.name} ${gem.name} Earrings` : `${metal.name} Earrings`;
  },

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const { metal, gem } = roll(rng);
    const metalPart = (geometry: THREE.BufferGeometry): Part => ({
      geometry,
      color: metal.color,
      sway: 0,
      finish: metal.finish,
    });

    const hookR = rng.range(0.007, 0.009);
    const arc = Math.PI * rng.range(1.15, 1.3);
    const beadR = rng.range(0.0031, 0.0042);
    // In the torus's own XY plane the gap is centred at (arc + 2π)/2; rotateZ turns
    // that to −Y, and rotateX(π/2) takes −Y to −Z, so the hook lies flat opening toward −Z.
    const turn = -Math.PI / 2 - (arc + Math.PI * 2) / 2;

    for (const sx of [-1, 1]) {
      const x = sx * 0.021;
      const hook = new THREE.TorusGeometry(hookR, WIRE, 5, 20, arc);
      hook.rotateZ(turn);
      hook.rotateX(Math.PI / 2);
      hook.translate(x, WIRE, 0);
      parts.push(metalPart(hook));
      for (const a of [turn, turn + arc]) {
        const cap = new THREE.IcosahedronGeometry(WIRE * 1.05, 0);
        cap.translate(x + Math.cos(a) * hookR, WIRE, Math.sin(a) * hookR);
        parts.push(metalPart(cap));
      }

      // The drop hangs off the outer end of each hook, so the pair mirrors.
      const end = sx < 0 ? turn + arc : turn;
      const ex = x + Math.cos(end) * hookR;
      const ez = Math.sin(end) * hookR;
      if (gem) {
        const cupR = 0.0042;
        const cupH = 0.0025;
        const cup = bezel(cupR, cupH);
        cup.translate(ex, 0, ez - cupR * 0.6);
        parts.push(metalPart(cup));
        const rock = stone(cupR * 0.8, gem.cut);
        rock.translate(ex, cupH * 0.85, ez - cupR * 0.6);
        parts.push({ geometry: rock, color: gem.color, sway: 0, finish: gem.finish });
      } else {
        const bead = new THREE.IcosahedronGeometry(beadR, 1);
        bead.translate(ex, beadR, ez - beadR * 0.5);
        parts.push(metalPart(bead));
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'earrings', 0);
  },
};
