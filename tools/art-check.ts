/**
 * Headless checks on the art kit.
 *
 * `npm run check:art`
 *
 * Builders are pure geometry — no GPU, no DOM — so the properties everything
 * else depends on can be asserted rather than eyeballed:
 *
 * - **Determinism.** A prop in the world is stored as a name and a seed, and
 *   rebuilt from those on load. A builder that is not reproducible would let
 *   the world quietly rearrange itself between sessions, and no save file
 *   could describe it. This is the important one.
 * - **Variety.** The opposite failure: a builder that ignores its seed and
 *   returns the same object forever. Passes every visual glance at one copy.
 * - **Sway weights.** Phase 7's wind shader reads a per-vertex attribute that
 *   only exists if the builder authored it. Missing, it fails silently — the
 *   prop simply never moves, among many that do.
 * - **Scale.** A builder whose geometry is a hundred metres across is obvious
 *   in a gallery and invisible in a data file.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { MeshBuilder } from '../src/art/types';
import { SWAY_ATTRIBUTE } from '../src/art/assemble';

// Imported explicitly. `art/registry.ts` finds these with `import.meta.glob`,
// which exists only under Vite; the check below compares this list against the
// directory so the two cannot drift apart unnoticed.
import { archway } from '../src/art/builders/archway';
import { barrel } from '../src/art/builders/barrel';
import { bed } from '../src/art/builders/bed';
import { bovine } from '../src/art/builders/bovine';
import { bush } from '../src/art/builders/bush';
import { cairn } from '../src/art/builders/cairn';
import { chair } from '../src/art/builders/chair';
import { crate } from '../src/art/builders/crate';
import { door } from '../src/art/builders/door';
import { equine } from '../src/art/builders/equine';
import { fence } from '../src/art/builders/fence';
import { figure } from '../src/art/builders/figure';
import { grass } from '../src/art/builders/grass';
import { hut } from '../src/art/builders/hut';
import { machine } from '../src/art/builders/machine';
import { mushroom } from '../src/art/builders/mushroom';
import { ovine } from '../src/art/builders/ovine';
import { porcine } from '../src/art/builders/porcine';
import { post } from '../src/art/builders/post';
import { poultry } from '../src/art/builders/poultry';
import { rock } from '../src/art/builders/rock';
import { stool } from '../src/art/builders/stool';
import { stump } from '../src/art/builders/stump';
import { table } from '../src/art/builders/table';
import { tree } from '../src/art/builders/tree';
import { trough } from '../src/art/builders/trough';

const builders: MeshBuilder[] = [
  archway,
  barrel,
  bed,
  bovine,
  bush,
  cairn,
  chair,
  crate,
  door,
  equine,
  fence,
  figure,
  grass,
  hut,
  machine,
  mushroom,
  ovine,
  porcine,
  post,
  poultry,
  rock,
  stool,
  stump,
  table,
  tree,
  trough,
];

let failures = 0;

function check(label: string, ok: boolean, detail: string): void {
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label.padEnd(34)} ${detail}`);
}

// --- the list matches the directory ---------------------------------------
const onDisk = fs
  .readdirSync(path.join(process.cwd(), 'src/art/builders'))
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.replace(/\.ts$/, ''))
  .sort();
const imported = builders.map((builder) => builder.name).sort();
check(
  'every builder is covered here',
  onDisk.join(',') === imported.join(','),
  onDisk.join(',') === imported.join(',')
    ? `${onDisk.length} builders`
    : `on disk [${onDisk}] vs imported [${imported}]`,
);

console.log('');

/**
 * Fraction of edges shared by exactly two triangles.
 *
 * Every primitive the kit uses — boxes, cylinders, cones, icosahedra — is a
 * closed solid, so in a correct build every edge belongs to exactly two faces.
 * An edge belonging to one is a hole.
 *
 * This is the check that would have caught the rock. Its vertices were
 * displaced *before* being welded, and `IcosahedronGeometry` is non-indexed —
 * so each corner existed once per face it touched, each copy moved somewhere
 * different, and the solid came apart into a cloud of loose triangles. Obvious
 * on screen, invisible in every other measurement: the triangle count, the
 * bounding box and the determinism were all still perfectly correct.
 *
 * Positions are quantized before hashing, because two vertices that should be
 * identical can differ in the last bit after a rotation.
 */
function closedFraction(geometry: { getAttribute(name: string): { count: number; getX(i: number): number; getY(i: number): number; getZ(i: number): number } }): number {
  const position = geometry.getAttribute('position');
  const key = (i: number): string =>
    `${Math.round(position.getX(i) * 8192)},${Math.round(position.getY(i) * 8192)},${Math.round(position.getZ(i) * 8192)}`;

  const edges = new Map<string, number>();
  for (let i = 0; i < position.count; i += 3) {
    const corners = [key(i), key(i + 1), key(i + 2)];
    // Degenerate triangles are skipped. A lathe whose profile touches the axis
    // produces zero-area triangles at each pole — two of their corners are the
    // same point — and those are not holes, they are the seam of a perfectly
    // closed surface. Counting their self-edges would condemn a correct solid.
    if (corners[0] === corners[1] || corners[1] === corners[2] || corners[0] === corners[2]) {
      continue;
    }
    for (let e = 0; e < 3; e++) {
      // Sorted, so the same edge from adjacent faces hashes the same way
      // regardless of winding.
      const pair = [corners[e], corners[(e + 1) % 3]].sort().join('|');
      edges.set(pair, (edges.get(pair) ?? 0) + 1);
    }
  }

  let shared = 0;
  for (const count of edges.values()) if (count === 2) shared++;
  return edges.size === 0 ? 0 : shared / edges.size;
}

function positions(builder: MeshBuilder, seed: number): Float32Array {
  const mesh = builder.build({ seed });
  const attribute = mesh.geometry.getAttribute('position');
  return new Float32Array(attribute.array as Float32Array);
}

for (const builder of builders) {
  const mesh = builder.build({ seed: 1234 });
  const geometry = mesh.geometry;

  // --- determinism --------------------------------------------------------
  const a = positions(builder, 4242);
  const b = positions(builder, 4242);
  const identical = a.length === b.length && a.every((value, i) => value === b[i]);

  // --- variety ------------------------------------------------------------
  const c = positions(builder, 99);
  const differs = c.length !== a.length || c.some((value, i) => value !== a[i]);

  // --- sway ---------------------------------------------------------------
  const sway = geometry.getAttribute(SWAY_ATTRIBUTE);
  const swayValues = sway ? Array.from(sway.array as Float32Array) : [];
  const swayInRange = swayValues.every((v) => v >= 0 && v <= 1);
  const maxSway = swayValues.length ? Math.max(...swayValues) : 0;

  // --- scale --------------------------------------------------------------
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const size = box ? [box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z] : [0, 0, 0];
  const largest = Math.max(...size);
  const sane = largest > 0.1 && largest < 12;
  const triangles = geometry.getAttribute('position').count / 3;

  // --- watertight ---------------------------------------------------------
  // Checked across several seeds: a builder can weld correctly for one set of
  // random numbers and split for another.
  let worstClosed = 1;
  for (const trialSeed of [1, 77, 4242, 99991]) {
    worstClosed = Math.min(worstClosed, closedFraction(builder.build({ seed: trialSeed }).geometry));
  }
  const solid = worstClosed > 0.999;

  const detail =
    `${size.map((v) => v.toFixed(1)).join('×')} m, ` +
    `${triangles} tris, sway max ${maxSway.toFixed(2)}`;

  const ok = identical && differs && sway !== undefined && swayInRange && sane && solid;
  const problems = [
    !identical && 'NOT DETERMINISTIC',
    !differs && 'ignores its seed',
    !sway && 'no sway attribute',
    sway && !swayInRange && 'sway outside 0..1',
    !sane && 'implausible size',
    !solid && `NOT CLOSED (${(worstClosed * 100).toFixed(1)}% of edges shared)`,
  ].filter(Boolean);

  check(builder.name, ok, ok ? detail : `${problems.join(', ')} — ${detail}`);
}

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
