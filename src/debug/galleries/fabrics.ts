import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import { signPost } from './layout';
import { markCollidable } from '../../player/Collider';
import { assemble, finish, type Part } from '../../art/assemble';
import { PALETTE, shade } from '../../art/palette';
import { FABRICS } from '../../art/fabrics';
import { ClothSim } from '../../art/cloth';
import { clothPanel } from '../../art/clothMesh';
import { banner } from '../../art/builders/banner';
import { hangingBanner } from '../../art/builders/hanging-banner';
import { flag } from '../../art/builders/flag';
import { curtain } from '../../art/builders/curtain';
import { figure, type FigureOptions } from '../../art/builders/figure';
import type { BuilderWith, BuildOptions } from '../../art/types';

/**
 * The Fabrics Gallery: the cloth simulation, judged by walking a matrix.
 *
 * One column per implementation — the test sheet, the strung banner, the
 * vertical hanging banner, the flag, the doorway curtain — with the same
 * implementation repeated in every fabric down the column, so `canvas` and
 * `sheer` differ only in the one thing being judged. Then the worn-cloth
 * columns: figures in capes and scarves across several seeds and head shapes,
 * the standing home of the no-clipping acceptance test — if a cape clips
 * anywhere, it clips here first.
 *
 * The wind override, collider wireframes and freeze switch live in the
 * `?debug` panel's cloth folder. All tuning happens here by looking at the
 * rendered image under the reproduced wind regime, not by trusting solver
 * numbers. CLOTH.md §10.
 */

export const ZONE_FABRICS_GALLERY = 'fabrics-gallery';

const FABRIC_NAMES = Object.keys(FABRICS);
/** Down a column, one instance per fabric, spaced for the drapes to swing. */
const ROW_DEPTH = 6;
const SIGN_Z = 4;

/**
 * The hard-coded C1 station: a plain sheet draped over a capsule on a stand.
 * No pins at all — pure drape, collision and margins, nothing else to blame.
 */
function sheetStation(fabric: string, seed: number): THREE.Object3D {
  const barRadius = 0.16;
  const barLength = 1.1;
  const barY = 1.05;

  const parts: Part[] = [];
  const bar = new THREE.CylinderGeometry(barRadius * 0.35, barRadius * 0.35, barLength, 8);
  bar.rotateZ(Math.PI / 2);
  bar.translate(0, barY, 0);
  parts.push({ geometry: bar, color: PALETTE.TIMBER_DARK, sway: 0 });
  for (const side of [-1, 1]) {
    const leg = new THREE.CylinderGeometry(0.05, 0.06, barY, 6);
    leg.translate(side * (barLength / 2), barY / 2, 0);
    parts.push({ geometry: leg, color: shade(PALETTE.TIMBER_DARK, 0.9), sway: 0 });
  }
  const mesh = finish(assemble(parts), 'fabrics-stand', 0);

  const COLS = 12;
  const ROWS = 12;
  const size = 1.2;
  const rest = new Float32Array(COLS * ROWS * 3);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      rest[i * 3] = -size / 2 + (c / (COLS - 1)) * size;
      rest[i * 3 + 1] = barY + 0.4;
      rest[i * 3 + 2] = -size / 2 + (r / (ROWS - 1)) * size;
    }
  }
  const sim = new ClothSim({
    cols: COLS,
    rows: ROWS,
    rest,
    pins: [],
    fabric,
    colliders: [
      // The capsule the sheet must never pass through — the whole station.
      { kind: 'capsule', a: [-barLength / 2, barY, 0], b: [barLength / 2, barY, 0], radius: barRadius },
      { kind: 'ground', y: 0 },
    ],
    seed,
  });
  // Pinless, so it falls, finds the capsule and comes to rest — longer than a
  // hanging cloth needs.
  sim.settle(150);

  const panel = clothPanel(sim, { name: 'fabrics-sheet', color: PALETTE.CLOTH });
  mesh.add(panel.mesh);
  return markCollidable(mesh);
}

/** A column of one hanging implementation, repeated in every fabric. */
function implementationColumn(
  builder: BuilderWith<BuildOptions & { fabric?: string }>,
  x: number,
): THREE.Object3D[] {
  const placed: THREE.Object3D[] = [];
  const sign = signPost(builder.name, builder.display);
  sign.position.set(x, 0, SIGN_Z);
  placed.push(sign);
  FABRIC_NAMES.forEach((fabric, row) => {
    const mesh = builder.build({ seed: 1000 + row * 7919, fabric });
    mesh.position.set(x, 0, -row * ROW_DEPTH);
    placed.push(markCollidable(mesh));
  });
  return placed;
}

/** The worn-cloth column: one figure per fabric, across seeds and head shapes. */
function wornColumn(wearing: 'cape' | 'scarf', x: number): THREE.Object3D[] {
  const placed: THREE.Object3D[] = [];
  const sign = signPost(wearing);
  sign.position.set(x, 0, SIGN_Z);
  placed.push(sign);
  const seeds = [11, 4242, 99991];
  let row = 0;
  for (const fabric of FABRIC_NAMES) {
    for (const seed of seeds) {
      const options: FigureOptions = { seed, wearing, fabric };
      const mesh = figure.build(options);
      mesh.position.set(x, 0, -row * 3);
      // Faced a half-turn about the rank so both the drape and the pinned
      // line are walkable from one side.
      mesh.rotation.y = row % 2 === 0 ? 0 : Math.PI;
      placed.push(markCollidable(mesh));
      row++;
    }
  }
  return placed;
}

function extras(): THREE.Object3D[] {
  const placed: THREE.Object3D[] = [];

  // The sheet stations, one per fabric, westmost.
  {
    const sign = signPost('test-sheet');
    sign.position.set(-15, 0, SIGN_Z);
    placed.push(sign);
    FABRIC_NAMES.forEach((fabric, row) => {
      const station = sheetStation(fabric, 71 + row);
      station.position.set(-15, 0, -row * ROW_DEPTH);
      placed.push(station);
    });
  }

  placed.push(...implementationColumn(banner, -10));
  placed.push(...implementationColumn(hangingBanner, -5));
  placed.push(...implementationColumn(flag, 0));
  placed.push(...implementationColumn(curtain, 5));
  placed.push(...wornColumn('cape', 10));
  placed.push(...wornColumn('scarf', 14));

  return placed;
}

export const fabricsGalleryPlan: GalleryPlan = {
  id: ZONE_FABRICS_GALLERY,
  group: 'general',
  name: 'Fabrics',
  // The matrix is the room; there is no eight-seed rank. Everything stands in
  // `extras`, laid out fabrics × implementations.
  builders: [],
  extras,
};
