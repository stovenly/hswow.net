import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

// A young oak: a single leader with side branches all the way up it, and no fork
// — the outline is a rough cone widest a third of the way up, where the adult's is
// a mushroom. Branches come off nearly level rather than steeply up, which is the
// only channel left to separate it from a birch sapling at three metres, and the
// leaf clumps are large for the tree, because oak leaves reach full size long
// before the tree does.

const TAU = Math.PI * 2;

export const smallOak: MeshBuilder = {
  name: 'small-oak',
  category: 'foliage',
  radius: 1.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Stem height; the crowning tuft adds another twenty centimetres or so.
    const height = rng.range(2.1, 3);
    const butt = rng.range(0.055, 0.085);
    // Leafy from low down. A young oak in the open keeps its bottom branches
    // for years, and a bare lower stem is the thing that would make this read
    // as a small tree of no particular species.
    const crownBase = height * rng.range(0.28, 0.38);

    const bendAt = rng.range(0, TAU);
    // Little bend. Even at this size an oak stem is stiff — this is the point
    // where it most obviously is not a birch.
    const bend = rng.range(0.04, 0.13);
    const spine = (y: number): THREE.Vector3 => {
      const t = y / height;
      const off = bend * t ** 1.9;
      return new THREE.Vector3(Math.cos(bendAt) * off, y, Math.sin(bendAt) * off);
    };

    // --- the leader ----------------------------------------------------------
    const segments = 3;
    for (let i = 0; i < segments; i++) {
      const from = (height * i) / segments;
      const to = (height * (i + 1)) / segments;
      const a = spine(from);
      const b = spine(to);
      b.lerp(a, -0.07);
      parts.push({
        geometry: rod(
          a,
          b,
          butt * (1 - 0.22 * i),
          butt * (1 - 0.22 * (i + 1)),
          6,
        ),
        color: shade(PALETTE.BARK, rng.range(0.9, 1.12)),
        sway: heightRamp(0, height, 2.2),
      });
    }

    // --- branches ------------------------------------------------------------
    const branches = rng.int(5, 7);
    const lean = rng.range(0, TAU);
    const leaf = rng.chance(0.25) ? PALETTE.LEAF_DARK : PALETTE.LEAF;

    for (let i = 0; i < branches; i++) {
      const t = branches > 1 ? i / (branches - 1) : 0;
      const at = Math.min(height * 0.95, crownBase + (height - crownBase) * t * rng.range(0.85, 1));
      const root = spine(at);
      const bearing = lean + i * 2.399963 + rng.around(0, 0.35);
      // Longest low down and shortest at the top: the cone.
      const reach = rng.range(0.42, 0.72) * (1.15 - 0.5 * t);
      // Shallow. Between 20 and 45 degrees, against the birch sapling's 60-75.
      const rise = rng.range(0.35, 0.8);

      const tip = new THREE.Vector3(
        root.x + Math.cos(bearing) * Math.cos(rise) * reach,
        root.y + Math.sin(rise) * reach,
        root.z + Math.sin(bearing) * Math.cos(rise) * reach,
      );
      parts.push({
        geometry: rod(root, tip, butt * 0.4, butt * 0.2, 4),
        color: shade(PALETTE.BARK_PALE, rng.range(0.88, 1.12)),
        sway: heightRamp(0, height, 1.4),
      });

      // One clump on the end and, on the longer branches, a second halfway
      // along. Two masses per branch is enough to close the cone without
      // filling it — a young oak is dense but you can still see the stem.
      const clumps = reach > 0.55 ? 2 : 1;
      for (let c = 0; c < clumps; c++) {
        const u = clumps === 1 ? 1 : 0.55 + 0.45 * c;
        const clump = lumpySphere(rng, rng.range(0.26, 0.4) * (1.1 - 0.3 * t), 0, 0.76, 1.24);
        clump.rotateY(rng.range(0, TAU));
        // Rounded rather than drooping. Oak foliage sits on the branch as a
        // billow; nothing about it hangs.
        clump.scale(1, rng.range(0.78, 0.95), 1);
        clump.translate(
          root.x + (tip.x - root.x) * u,
          root.y + (tip.y - root.y) * u + rng.range(0.02, 0.1),
          root.z + (tip.z - root.z) * u,
        );
        parts.push({
          geometry: clump,
          color: rng.chance(0.3) ? PALETTE.LEAF_DARK : shade(leaf, rng.range(0.9, 1.1)),
          sway: rng.range(0.8, 0.95),
        });
      }
    }

    // The leader's own growth, capping the cone. Slightly proud of the topmost
    // branch clumps so the tree comes to a point rather than a plateau.
    const apex = spine(height);
    const top = lumpySphere(rng, rng.range(0.26, 0.36), 0, 0.76, 1.24);
    top.scale(1, rng.range(0.85, 1.05), 1);
    top.translate(apex.x, apex.y + rng.range(0.02, 0.12), apex.z);
    parts.push({ geometry: top, color: shade(leaf, rng.range(0.94, 1.08)), sway: 1 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, TAU));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'small-oak', rng.range(0, TAU));
  },
};
