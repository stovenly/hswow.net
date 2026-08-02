import * as THREE from 'three';
import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { HUT_STAINS } from './hut-door';

/**
 * A wooden trapdoor: a planked hatch in a timber curb, flat on the ground.
 *
 * The hut door turned on its back, and joinery from the same yard — it draws
 * its stains from `HUT_STAINS`, so a hamlet's hatches match its doors without
 * either builder knowing about the other's placement. Cellars, wells, and
 * lofts reached from below; the door you stand on rather than walk through.
 *
 * No voice and no metrics: portals do not open downward — this is dressing,
 * not a threshold. If a zone ever does lead through a floor, the sound and
 * the arrival arithmetic get designed then, for what a hatch actually does.
 *
 * Built lying flat, standing on y = 0, the leaf's face up. The curb stands a
 * hand's height proud of the ground, which the collider treats as a kerb —
 * well under the step limit, so it is walked over, not around.
 */

export type HutTrapdoorOptions = BuildOptions;

/** Every stain in one pool. A hatch has no voice, so no family to respect. */
const ALL_STAINS = [...HUT_STAINS.timber, ...HUT_STAINS.plank];

export function buildHutTrapdoor(options: HutTrapdoorOptions = {}): THREE.Mesh {
  const { seed = 1, scale = 1 } = options;
  const rng = createRng(seed);
  const parts: Part[] = [];

  const look = rng.pick(ALL_STAINS);
  const leafTone = shade(look.leaf, rng.range(0.94, 1.06));

  const width = rng.range(0.95, 1.25);
  const depth = rng.range(0.85, 1.1);
  const curb = rng.range(0.08, 0.11);
  const curbHeight = rng.range(0.09, 0.12);

  // --- curb ----------------------------------------------------------------
  // A raised timber surround, which is what stops a hatch in the ground
  // reading as a rug. The stiles run half a curb *into* the rails rather than
  // butting flush against them: butted flush, the two boxes share their
  // corner vertices exactly, and coincident vertices are how a pile of closed
  // solids fails the kit's watertight accounting — the same lesson the
  // lettering's joints learned. Lapped, every end face sits strictly inside
  // its neighbour and the silhouette is identical.
  for (const side of [-1, 1]) {
    const rail = new THREE.BoxGeometry(width + curb * 2, curbHeight, curb);
    rail.translate(0, curbHeight / 2, side * (depth / 2 + curb / 2));
    parts.push({ geometry: rail, color: look.frame, sway: 0 });

    const stile = new THREE.BoxGeometry(curb, curbHeight, depth + curb);
    stile.translate(side * (width / 2 + curb / 2), curbHeight / 2, 0);
    parts.push({ geometry: stile, color: look.frame, sway: 0 });
  }

  // --- leaf ----------------------------------------------------------------
  // Planks spanning the opening, recessed a hair below the curb's top so the
  // hatch reads as sitting *in* its frame. A dark void underneath, so the
  // gaps between boards read as depth over a cellar rather than as ground.
  const leafTop = curbHeight - 0.02;
  const plankThickness = 0.05;

  const void_ = new THREE.BoxGeometry(width, 0.015, depth);
  void_.translate(0, leafTop - plankThickness - 0.01, 0);
  parts.push({ geometry: void_, color: 0x14161a, sway: 0 });

  const plankCount = rng.int(4, 6);
  const plankDepth = depth / plankCount;
  for (let i = 0; i < plankCount; i++) {
    const plank = new THREE.BoxGeometry(
      width * rng.range(0.985, 1),
      plankThickness * rng.range(0.88, 1),
      plankDepth * 0.94,
    );
    plank.translate(0, leafTop - plankThickness / 2, -depth / 2 + plankDepth * (i + 0.5));
    parts.push({ geometry: plank, color: shade(leafTone, rng.range(0.95, 1.05)), sway: 0 });
  }

  // --- ironwork ------------------------------------------------------------
  // Two hinge straps running from one edge across the planks — the hatch is
  // read from above, so the straps do the job the ledges do on a door: they
  // say which edge swings. The pintle stubs sit on the curb.
  const hingeSign = rng.chance(0.5) ? -1 : 1;
  const strapReach = depth * rng.range(0.5, 0.7);
  for (const sx of [-width * 0.3, width * 0.3]) {
    const strap = new THREE.BoxGeometry(0.055, 0.02, strapReach);
    strap.translate(sx, leafTop + 0.01, hingeSign * (depth / 2 - strapReach / 2));
    parts.push({ geometry: strap, color: look.iron, sway: 0 });

    const pin = new THREE.BoxGeometry(0.07, 0.045, 0.06);
    pin.translate(sx, curbHeight - 0.01, hingeSign * (depth / 2 + curb / 2));
    parts.push({ geometry: pin, color: look.iron, sway: 0 });
  }

  // The pull, on the free edge. A bar on mounts, or a hasp over a staple with
  // the padlock that says somebody minds what is down there.
  const pullZ = -hingeSign * depth * 0.34;
  if (rng.chance(0.55)) {
    const bar = new THREE.BoxGeometry(0.2, 0.045, 0.045);
    bar.translate(0, leafTop + 0.045, pullZ);
    parts.push({ geometry: bar, color: look.iron, sway: 0 });
    for (const dx of [-0.09, 0.09]) {
      const mount = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      mount.translate(dx, leafTop + 0.015, pullZ);
      parts.push({ geometry: mount, color: look.iron, sway: 0 });
    }
  } else {
    const hasp = new THREE.BoxGeometry(0.06, 0.018, 0.22);
    hasp.translate(0, leafTop + 0.012, pullZ);
    parts.push({ geometry: hasp, color: look.iron, sway: 0 });

    const staple = new THREE.BoxGeometry(0.045, 0.05, 0.045);
    staple.translate(0, leafTop + 0.02, pullZ - hingeSign * 0.13);
    parts.push({ geometry: staple, color: look.iron, sway: 0 });

    const lock = new THREE.BoxGeometry(0.06, 0.075, 0.03);
    lock.translate(0, leafTop + 0.02, pullZ - hingeSign * 0.17);
    parts.push({ geometry: lock, color: shade(look.iron, 0.8), sway: 0 });
  }

  const geometry = assemble(parts);
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return finish(geometry, 'hut-trapdoor', 0);
}

export const hutTrapdoor: MeshBuilder = {
  name: 'hut-trapdoor',
  category: 'structures',
  radius: 0.8,
  build: buildHutTrapdoor,
};
