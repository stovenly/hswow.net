import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import { bezel, buckle, rollMetal, rollStone, stone, type Metal, type Stone } from '../worn';

// Belt: a strap folded into a flat stack on y = 0, layers along z, the buckle on top at +Z.

const THICK = 0.003;
const TIP_OUT = 0.02;
const HIDES = [PALETTE.HIDE, PALETTE.HIDE_DARK, PALETTE.HIDE_PALE] as const;

function roll(rng: Rng): { metal: Metal; studs: boolean; round: boolean; gem?: Stone } {
  const metal = rollMetal(rng);
  const studs = rng.chance(0.4);
  const round = rng.chance(0.4);
  const gem = rng.chance(0.3) ? rollStone(rng) : undefined;
  return { metal, studs, round, gem };
}

export const belt: MeshBuilder = {
  name: 'belt',
  category: 'objects',
  radius: 0.08,
  variants: 8,
  solid: false,

  nameFor(seed) {
    const { metal, studs, gem } = roll(createRng(seed));
    if (gem) return `${metal.name} ${gem.name} Belt`;
    return studs ? `${metal.name} Studded Belt` : `${metal.name} Buckled Belt`;
  },

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const { metal, studs, round, gem } = roll(rng);
    const leather = shade(rng.pick(HIDES), rng.range(0.9, 1.1));
    const metalPart = (geometry: THREE.BufferGeometry): Part => ({
      geometry,
      color: metal.color,
      sway: 0,
      finish: metal.finish,
    });

    const width = rng.range(0.03, 0.04);
    const length = rng.range(0.12, 0.16);
    const layers = rng.int(4, 5);
    const metalTip = rng.chance(0.5);

    // Fold k joins layers k and k+1. The folds alternate ends, and the top layer's
    // free end has to be +Z for the buckle, which fixes every fold's end from the top down.
    const foldEnd = (k: number): number => ((layers - k) % 2 === 0 ? -1 : 1);
    const tipEnd = -foldEnd(0);

    for (let k = 0; k < layers; k++) {
      const bottom = k === 0;
      const long = length + THICK * 0.6 + (bottom ? TIP_OUT : 0);
      const layer = new THREE.BoxGeometry(width, THICK, long);
      layer.translate(0, k * THICK + THICK / 2, bottom ? (tipEnd * TIP_OUT) / 2 : 0);
      parts.push({ geometry: layer, color: shade(leather, rng.around(1, 0.03)), sway: 0 });
    }

    for (let k = 0; k + 1 < layers; k++) {
      const end = foldEnd(k);
      // CylinderGeometry's axis is +Y and theta 0 is +Z; the half from −π/2 is the +Z half.
      // rotateZ(π/2) takes +Y to −X, so the fold's axis runs along x and its half stays in z.
      const fold = new THREE.CylinderGeometry(THICK, THICK, width, 8, 1, false, end > 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI);
      fold.rotateZ(Math.PI / 2);
      fold.translate(0, (k + 1) * THICK, (end * length) / 2);
      parts.push({ geometry: fold, color: leather, sway: 0 });
    }

    const tipZ = tipEnd * (length / 2 + TIP_OUT);
    if (metalTip) {
      const cap = new THREE.BoxGeometry(width * 1.04, THICK * 1.3, 0.008);
      cap.translate(0, THICK / 2, tipZ - tipEnd * 0.004);
      parts.push(metalPart(cap));
    } else {
      const nose = new THREE.CylinderGeometry(width / 2, width / 2, THICK, 8, 1, false, tipEnd > 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI);
      nose.translate(0, THICK / 2, tipZ);
      parts.push({ geometry: nose, color: leather, sway: 0 });
    }

    const top = layers * THICK;
    const frame = buckle(width, round);
    frame.translate(0, top - THICK * 0.2, length / 2 - width * 0.4);
    parts.push(metalPart(frame));
    if (gem) {
      const bar = width * 0.12;
      const cupR = bar * 0.9;
      const seat = top - THICK * 0.2 + bar * 0.7;
      const cup = bezel(cupR, bar * 0.6);
      cup.translate(0, seat, length / 2 - width * 0.06);
      parts.push(metalPart(cup));
      const rock = stone(cupR * 0.8, gem.cut);
      rock.translate(0, seat + bar * 0.5, length / 2 - width * 0.06);
      parts.push({ geometry: rock, color: gem.color, sway: 0, finish: gem.finish });
    }

    if (studs) {
      const rows = rng.chance(0.5) ? [0] : [-width * 0.25, width * 0.25];
      const pitch = 0.012;
      for (let z = -length / 2 + 0.015; z < length / 2 - width * 0.9; z += pitch) {
        for (const x of rows) {
          const dome = new THREE.SphereGeometry(0.0022, 6, 3, 0, Math.PI * 2, 0, Math.PI / 2);
          dome.translate(x, top - 0.0004, z);
          parts.push(metalPart(dome));
        }
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'belt', 0);
  },
};
