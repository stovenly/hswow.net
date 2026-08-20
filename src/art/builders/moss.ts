import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { shade } from '../palette';
import * as THREE from 'three';

// Moss: a cushion, a carpet, or a fruiting patch — the small green thing that
// goes at the foot of everything else. Wider than it is tall by a lot, whichever
// form it takes; at even half its width in height it is a bush. A patch commits
// to one form, because a patch is one organism: tight hummocks, a broad low sheet,
// or a carpet with a haze of sporophyte stalks standing off it.
export const moss: MeshBuilder = {
  name: 'moss',
  category: 'foliage',
  radius: 0.55,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const form = rng.chance(0.4) ? 'cushion' : rng.chance(0.5) ? 'carpet' : 'fruiting';
    // Far more saturated than the grass, which is what carries "damp" with no
    // texture to say it with. Split warm and cold, because the two commonest
    // woodland mosses look nothing alike.
    const green = rng.chance(0.5) ? 0x47632f : 0x35573c;
    const spread = rng.range(0.2, 0.34);

    const lumps = form === 'cushion' ? rng.int(3, 6) : rng.int(4, 8);
    for (let i = 0; i < lumps; i++) {
      const main = i === 0;
      const size = main
        ? rng.range(0.16, 0.26)
        : rng.range(0.08, 0.18) * (form === 'cushion' ? 1 : 1.35);
      const away = main ? 0 : Math.sqrt(rng()) * spread;
      const at = rng.range(0, Math.PI * 2);

      // A cushion is domed; a carpet is nearly flat. One number, and it is the
      // whole difference between the two.
      const squash = form === 'cushion' ? rng.range(0.34, 0.46) : rng.range(0.13, 0.2);
      const cushion = lumpySphere(rng, size, 1, 0.86, 1.18);
      cushion.scale(1, squash, 1);
      // Sunk. The part below ground is invisible and it is what makes the edge
      // meet the floor instead of curling under it.
      cushion.translate(Math.cos(at) * away, size * squash * 0.35, Math.sin(at) * away);
      parts.push({
        geometry: cushion,
        color: shade(green, rng.range(0.86, 1.16)),
        sway: 0,
      });
    }

    if (form === 'fruiting') {
      // Sporophytes: bare threads with a capsule on the end, standing well
      // clear of the cushion. The only part of any moss that moves in wind, and
      // the only one with a silhouette above the ground plane.
      const stalks = rng.int(14, 26);
      const pale = rng.chance(0.5) ? 0x8a7a4a : 0x6d5f3a;
      for (let i = 0; i < stalks; i++) {
        const at = rng.range(0, Math.PI * 2);
        const away = Math.sqrt(rng()) * spread * 0.9;
        const ox = Math.cos(at) * away;
        const oz = Math.sin(at) * away;
        const tall = rng.range(0.045, 0.1);
        const lean = rng.range(0, 0.3);
        const leanAt = rng.range(0, Math.PI * 2);

        const seta = new THREE.CylinderGeometry(0.0018, 0.0028, tall, 4);
        seta.translate(0, tall / 2, 0);
        seta.rotateX(Math.cos(leanAt) * lean);
        seta.rotateZ(Math.sin(leanAt) * lean);
        seta.translate(ox, 0.02, oz);
        parts.push({ geometry: seta, color: shade(pale, 0.9), sway: 0.7 });

        const capsule = new THREE.CylinderGeometry(0.006, 0.0045, tall * 0.3, 5);
        capsule.rotateX(Math.cos(leanAt) * lean * 1.6);
        capsule.rotateZ(Math.sin(leanAt) * lean * 1.6);
        capsule.translate(
          ox + Math.sin(Math.sin(leanAt) * lean) * -tall,
          0.02 + tall * Math.cos(lean),
          oz + Math.sin(Math.cos(leanAt) * lean) * tall,
        );
        parts.push({ geometry: capsule, color: shade(pale, 1.2), sway: 1 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'moss', rng.range(0, Math.PI * 2));
  },
};
