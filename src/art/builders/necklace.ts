import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { shade } from '../palette';
import { beads, bezel, chain, rollMetal, rollStone, stone, STRING_RADIUS, type Metal, type Stone } from '../worn';

// Necklace: the pendant face up at the origin on y = 0, the chain gathered loosely round it.

type Pendant = 'none' | 'disc' | 'drop' | 'stone';
const PENDANTS: readonly Pendant[] = ['disc', 'drop', 'stone'];

const CHAIN_RADIUS = 0.0015;

function roll(rng: Rng): { metal: Metal; pendant: Pendant; bead?: Stone; gem?: Stone } {
  const metal = rollMetal(rng);
  const pendant: Pendant = rng.chance(0.3) ? 'none' : rng.pick(PENDANTS);
  const bead = rng.chance(0.3) ? rollStone(rng) : undefined;
  const gem = pendant === 'stone' ? rollStone(rng) : undefined;
  return { metal, pendant, bead, gem };
}

export const necklace: MeshBuilder = {
  name: 'necklace',
  category: 'objects',
  radius: 0.05,
  variants: 8,
  solid: false,

  nameFor(seed) {
    const { metal, bead, gem } = roll(createRng(seed));
    if (gem) return `${metal.name} ${gem.name} Necklace`;
    return bead ? `${bead.name} Bead Necklace` : `${metal.name} Necklace`;
  },

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const { metal, pendant, bead, gem } = roll(rng);
    const metalPart = (geometry: THREE.BufferGeometry): Part => ({
      geometry,
      color: metal.color,
      sway: 0,
      finish: metal.finish,
    });

    const size = rng.range(0.0075, 0.0125);
    let inner = 0.006;

    if (pendant === 'disc') {
      const disc = new THREE.CylinderGeometry(size, size * 0.96, 0.002, 12);
      disc.translate(0, 0.001, 0);
      parts.push(metalPart(disc));
    } else if (pendant === 'drop') {
      const drop = new THREE.SphereGeometry(size, 10, 6);
      drop.scale(0.8, 0.3, 1.2);
      drop.translate(0, size * 0.3, 0);
      parts.push(metalPart(drop));
    } else if (pendant === 'stone' && gem) {
      const cupR = size * 0.9;
      const cupH = 0.003;
      parts.push(metalPart(bezel(cupR, cupH)));
      const rock = stone(cupR * 0.8, gem.cut);
      rock.translate(0, cupH * 0.85, 0);
      parts.push({ geometry: rock, color: gem.color, sway: 0, finish: gem.finish });
    }

    if (pendant !== 'none') {
      // TorusGeometry lies in XY with its axis on +Z; rotateX(π/2) lays the bail flat at the pendant's +Z edge.
      const bail = new THREE.TorusGeometry(0.0025, 0.0008, 5, 10);
      bail.rotateX(Math.PI / 2);
      bail.translate(0, 0.0012, size * 1.2 + 0.0015);
      parts.push(metalPart(bail));
      inner = size * 1.2 + 0.006;
    }

    // Out from the bail at +Z, two or three loose turns about the pendant, each
    // pass a chain's thickness above the last so no two lengths share a plane.
    const turns = rng.range(2, 3);
    const outer = rng.range(0.04, 0.05);
    const steps = Math.round(turns * 10);
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = Math.PI / 2 + t * turns * Math.PI * 2;
      const r = (inner + (outer - inner) * t) * (i === 0 ? 1 : rng.around(1, 0.08));
      const y = CHAIN_RADIUS * (1 + 1.3 * t * turns);
      points.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    const path = new THREE.CatmullRomCurve3(points, false, 'centripetal');

    if (bead) {
      parts.push({ geometry: chain(path, STRING_RADIUS), color: shade(bead.color, 0.7), sway: 0 });
      const string = beads(path, rng.int(30, 50), [0.0024, 0.0018]);
      parts.push({ geometry: string, color: bead.color, sway: 0, finish: bead.finish });
    } else {
      parts.push(metalPart(chain(path, CHAIN_RADIUS)));
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'necklace', 0);
  },
};
