import * as THREE from 'three';
import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';
import { HUT_STAINS } from './hut-door';

// A wooden trapdoor: a planked hatch in a timber curb, flat on the ground. Draws
// its stains from `HUT_STAINS`, so a hamlet's hatches match its doors. Built
// lying flat on y = 0, leaf face up, and finished on both faces — pitched half a
// turn about X it is the same hatch seen from the cellar below it. The curb is
// well under the step limit, so it is walked over rather than around.

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
  // A raised timber surround, which is what stops a hatch in the ground reading as
  // a rug. The stiles run half a curb into the rails rather than butting flush:
  // butted flush the two boxes share their corner vertices exactly. Lapped, every
  // end face sits strictly inside its neighbour and the silhouette is identical.
  for (const side of [-1, 1]) {
    const rail = new THREE.BoxGeometry(width + curb * 2, curbHeight, curb);
    rail.translate(0, curbHeight / 2, side * (depth / 2 + curb / 2));
    parts.push({ geometry: rail, color: look.frame, sway: 0 });

    const stile = new THREE.BoxGeometry(curb, curbHeight, depth + curb);
    stile.translate(side * (width / 2 + curb / 2), curbHeight / 2, 0);
    parts.push({ geometry: stile, color: look.frame, sway: 0 });
  }

  // --- leaf ----------------------------------------------------------------
  // Planks spanning the opening, recessed a hair below the curb's top so the hatch
  // reads as sitting in its frame, over a dark void so the gaps read as depth.
  // The void sits *inside* the leaf's thickness rather than under it: below it
  // the plank soffits are the lowest surface, so from underneath this is boards
  // with dark lines between them and not a black plate.
  const leafTop = curbHeight - 0.02;
  const plankThickness = 0.05;

  const void_ = new THREE.BoxGeometry(width, 0.02, depth);
  void_.translate(0, leafTop - plankThickness + 0.012, 0);
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

  // Two ledgers across the planks on the underside, which is what holds a run of
  // loose boards together and the only thing there is to see from below.
  for (const bx of [-width * 0.26, width * 0.26]) {
    const ledger = new THREE.BoxGeometry(0.075, 0.024, depth * 0.86);
    ledger.translate(bx, leafTop - plankThickness - 0.012, 0);
    parts.push({ geometry: ledger, color: shade(look.frame, 0.94), sway: 0 });
  }

  // --- ironwork ------------------------------------------------------------
  // Two hinge straps from one edge across the planks: a hatch is read from above,
  // so the straps say which edge swings. The pintle stubs sit on the curb.
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
  display: 'Wood Trapdoor',
  category: 'structures',
  radius: 0.8,
  build: buildHutTrapdoor,
};
