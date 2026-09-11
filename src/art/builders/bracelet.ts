import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { shade } from '../palette';
import { beads, bezel, chain, rollMetal, rollStone, stone, STRING_RADIUS, type Metal, type Stone } from '../worn';

// Bracelet: a bangle, a cuff or a bead string lying flat on y = 0; a cuff's gap is at −Z, a stone at +Z.

type Form = 'bangle' | 'cuff' | 'beads';
const FORMS: readonly Form[] = ['bangle', 'cuff', 'beads'];

function roll(rng: Rng): { metal: Metal; form: Form; gem?: Stone } {
  const metal = rollMetal(rng);
  const form = rng.pick(FORMS);
  const gem = form === 'beads' ? rollStone(rng) : rng.chance(0.4) ? rollStone(rng) : undefined;
  return { metal, form, gem };
}

export const bracelet: MeshBuilder = {
  name: 'bracelet',
  category: 'objects',
  radius: 0.045,
  variants: 8,
  solid: false,

  nameFor(seed) {
    const { metal, form, gem } = roll(createRng(seed));
    if (form === 'beads') return `${gem?.name} Bead Bracelet`;
    return gem ? `${metal.name} ${gem.name} Bracelet` : `${metal.name} Bracelet`;
  },

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const { metal, form, gem } = roll(rng);

    const major = rng.range(0.03, 0.036);
    const tube = rng.range(0.003, 0.005);

    if (form === 'beads' && gem) {
      const bead = gem;
      const count = rng.int(12, 20);
      const small = rng.range(0.0028, 0.0036);
      const large = small * 1.45;
      const ringPoints: THREE.Vector3[] = [];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(a) * major, large, Math.sin(a) * major));
      }
      const circle = new THREE.CatmullRomCurve3(ringPoints, true, 'centripetal');
      parts.push({ geometry: chain(circle, STRING_RADIUS, true), color: shade(bead.color, 0.7), sway: 0 });
      parts.push({ geometry: beads(circle, count, [large, small]), color: bead.color, sway: 0, finish: bead.finish });
    } else {
      const arc = form === 'cuff' ? Math.PI * 2 * rng.range(0.72, 0.82) : Math.PI * 2;
      const band = new THREE.TorusGeometry(major, tube, 6, 28, arc);
      // In the torus's own XY plane the gap is centred at (arc + 2π)/2; rotateZ turns
      // that to −Y, and rotateX(π/2) takes −Y to −Z, so the band lies flat with its gap at −Z.
      const turn = -Math.PI / 2 - (arc + Math.PI * 2) / 2;
      band.rotateZ(turn);
      band.rotateX(Math.PI / 2);
      band.translate(0, tube, 0);
      parts.push({ geometry: band, color: metal.color, sway: 0, finish: metal.finish });
      if (form === 'cuff') {
        for (const a of [turn, turn + arc]) {
          const cap = new THREE.IcosahedronGeometry(tube * 1.02, 1);
          cap.translate(Math.cos(a) * major, tube, Math.sin(a) * major);
          parts.push({ geometry: cap, color: metal.color, sway: 0, finish: metal.finish });
        }
      }
      if (gem) {
        const cupR = tube * 1.3;
        const cupH = tube * 1.2;
        const cup = bezel(cupR, cupH);
        cup.translate(0, tube, major);
        parts.push({ geometry: cup, color: metal.color, sway: 0, finish: metal.finish });
        const rock = stone(cupR * 0.82, gem.cut);
        rock.translate(0, tube + cupH * 0.85, major);
        parts.push({ geometry: rock, color: gem.color, sway: 0, finish: gem.finish });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'bracelet', 0);
  },
};
