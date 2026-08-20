import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { PALETTE } from '../palette';

// A small tree: one clear stem, a few branches, and a thin canopy — the middle
// storey between `bush` and `tree`. What makes it young is the taper, not the
// height: a nearly parallel trunk rather than one buttressed at the foot, a crown
// starting high up a bare stem, and a canopy of a few small blobs, because a solid
// lump on a thin stick is a lollipop.
export const smallTree: MeshBuilder = {
  name: 'small-tree',
  category: 'foliage',
  radius: 1.1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(1.6, 2.8);
    // Barely tapered. A mature trunk swells at the base to carry the load; a
    // sapling has almost no load to carry, and the parallel stem is most of
    // what reads as "young" from any distance.
    const butt = rng.range(0.035, 0.06);
    const top = butt * rng.range(0.62, 0.78);
    // Where the leaves start. High, and deliberately: a sapling in a wood is
    // reaching for light and has shed its lower branches doing it.
    const crownBase = height * rng.range(0.45, 0.6);

    const bark = rng.chance(0.4) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const leaf = rng.chance(0.25) ? PALETTE.LEAF_DRY : PALETTE.LEAF;

    // A slight sweep, because nothing this thin grows straight. Built as two
    // segments with a bend between them rather than one bent cylinder — there
    // is no curve primitive here and two segments is enough to read.
    const lower = height * rng.range(0.5, 0.65);
    const sweep = rng.range(0.03, 0.13);
    const sweepAt = rng.range(0, Math.PI * 2);

    const stem = new THREE.CylinderGeometry(butt * 0.8, butt, lower, 5);
    stem.translate(0, lower / 2, 0);
    parts.push({ geometry: stem, color: bark, sway: heightRamp(0, height, 2.2) });

    const upper = new THREE.CylinderGeometry(top, butt * 0.82, height - lower, 5);
    upper.translate(0, (height - lower) / 2, 0);
    upper.rotateX(Math.cos(sweepAt) * sweep);
    upper.rotateZ(Math.sin(sweepAt) * sweep);
    upper.translate(0, lower, 0);
    parts.push({ geometry: upper, color: bark, sway: heightRamp(0, height, 2.2) });

    // Where the top of the stem actually ended up after the sweep.
    const leanX = Math.sin(Math.sin(sweepAt) * sweep) * (height - lower);
    const leanZ = -Math.sin(Math.cos(sweepAt) * sweep) * (height - lower);

    // Branches: a few short ones off the upper stem, angled up. Three to five,
    // because a sapling that has been at it long enough to have a dozen is a
    // tree.
    const branches = rng.int(3, 5);
    for (let i = 0; i < branches; i++) {
      const t = i / branches;
      const at = crownBase + (height - crownBase) * t * rng.range(0.7, 1);
      const length = rng.range(0.28, 0.62) * (1 - t * 0.4);
      const bearing = rng.range(0, Math.PI * 2);
      // Steeply up. Young growth reaches; a horizontal branch is an old one
      // that has been weighed down for a decade.
      const rise = rng.range(0.75, 1.15);

      const branch = new THREE.CylinderGeometry(butt * 0.22, butt * 0.4, length, 4);
      branch.translate(0, length / 2, 0);
      branch.rotateZ(Math.PI / 2 - rise);
      branch.rotateY(bearing);
      branch.translate(leanX * (at / height), at, leanZ * (at / height));
      parts.push({ geometry: branch, color: bark, sway: heightRamp(0, height, 1.8) });

      // A small clump of leaves at the end of each, plus one at the leader.
      // Several small masses rather than one big one: you can see sky through
      // it, which is the difference between a canopy and a hat.
      const reach = Math.cos(rise) * length;
      const cx = leanX * (at / height) + Math.sin(bearing) * reach;
      const cz = leanZ * (at / height) + Math.cos(bearing) * reach;
      const cy = at + Math.sin(rise) * length;

      const clump = lumpySphere(rng, rng.range(0.22, 0.38), 0, 0.7, 1.3);
      clump.scale(1, rng.range(0.7, 0.95), 1);
      clump.translate(cx, cy, cz);
      parts.push({
        geometry: clump,
        color: rng.chance(0.3) ? PALETTE.LEAF_DARK : leaf,
        // The canopy of something this slender moves a great deal, and moves
        // as one — the whole stem bends rather than the leaves fluttering on
        // it, which is what a sapling in wind actually does.
        sway: 1,
      });
    }

    const leader = lumpySphere(rng, rng.range(0.26, 0.42), 0, 0.72, 1.28);
    leader.scale(1, 1.15, 1);
    leader.translate(leanX, height + 0.06, leanZ);
    parts.push({ geometry: leader, color: leaf, sway: 1 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    // A phase per instance, so a stand of them does not move in unison — which
    // reads instantly as one mechanism rather than as many things in the same
    // wind.
    return finish(geometry, 'small-tree', rng.range(0, Math.PI * 2));
  },
};
