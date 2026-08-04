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
import * as THREE from 'three';
import type { MeshBuilder } from '../src/art/types';
import { SWAY_ATTRIBUTE } from '../src/art/assemble';
import { CLUTTER } from '../src/art/clutter';
import { FLEX } from '../src/art/flex';
import { COVER_MATERIAL, COVER_ATTRIBUTE } from '../src/art/cover';
import { windUniforms } from '../src/art/sway';

// Imported explicitly. `art/registry.ts` finds these with `import.meta.glob`,
// which exists only under Vite; the check below compares this list against the
// directory so the two cannot drift apart unnoticed.
import { anvil } from '../src/art/builders/anvil';
import { archway } from '../src/art/builders/archway';
import { banner } from '../src/art/builders/banner';
import { barrel } from '../src/art/builders/barrel';
import { bed } from '../src/art/builders/bed';
import { bell } from '../src/art/builders/bell';
import { bramble } from '../src/art/builders/bramble';
import { bovine } from '../src/art/builders/bovine';
import { bush } from '../src/art/builders/bush';
import { cairn } from '../src/art/builders/cairn';
import { candle } from '../src/art/builders/candle';
import { chainlink } from '../src/art/builders/chainlink';
import { chair } from '../src/art/builders/chair';
import { cistern } from '../src/art/builders/cistern';
import { crate } from '../src/art/builders/crate';
import { daisy } from '../src/art/builders/daisy';
import { hutDoor } from '../src/art/builders/hut-door';
import { hutTrapdoor } from '../src/art/builders/hut-trapdoor';
import { factoryDoor } from '../src/art/builders/factory-door';
import { factoryTrapdoor } from '../src/art/builders/factory-trapdoor';
import { sticks } from '../src/art/builders/sticks';
import { dog } from '../src/art/builders/dog';
import { equine } from '../src/art/builders/equine';
import { fence } from '../src/art/builders/fence';
import { fallenLog } from '../src/art/builders/fallen-log';
import { fern } from '../src/art/builders/fern';
import { figure } from '../src/art/builders/figure';
import { floodlight } from '../src/art/builders/floodlight';
import { smallGrassClump } from '../src/art/builders/small-grass-clump';
import { largeGrassClump } from '../src/art/builders/large-grass-clump';
import { hut } from '../src/art/builders/hut';
import { lantern } from '../src/art/builders/lantern';
import { machine } from '../src/art/builders/machine';
import { moss } from '../src/art/builders/moss';
import { mushroom } from '../src/art/builders/mushroom';
import { nettle } from '../src/art/builders/nettle';
import { ovine } from '../src/art/builders/ovine';
import { pipes } from '../src/art/builders/pipes';
import { pinecone } from '../src/art/builders/pinecone';
import { poppy } from '../src/art/builders/poppy';
import { porcine } from '../src/art/builders/porcine';
import { post } from '../src/art/builders/post';
import { poultry } from '../src/art/builders/poultry';
import { railing } from '../src/art/builders/railing';
import { reeds } from '../src/art/builders/reeds';
import { rock } from '../src/art/builders/rock';
import { smallTree } from '../src/art/builders/small-tree';
// Interior. `window` is declared as `windowBuilder` in its own file because a
// module-scope `const window` shadows the DOM global for the whole file; it is
// re-exported under the bare name too, and the builder's `name` is 'window'.
import { windowBuilder } from '../src/art/builders/window';
import { fireplace } from '../src/art/builders/fireplace';
import { stove } from '../src/art/builders/stove';
import { broom } from '../src/art/builders/broom';
import { chest } from '../src/art/builders/chest';
import { dresser } from '../src/art/builders/dresser';
import { hangingHerbs } from '../src/art/builders/hanging-herbs';
import { spinningWheel } from '../src/art/builders/spinning-wheel';
import { wallPegs } from '../src/art/builders/wall-pegs';
import { washtub } from '../src/art/builders/washtub';
import { elder } from '../src/art/builders/elder';
import { gorse } from '../src/art/builders/gorse';
import { hazel } from '../src/art/builders/hazel';
import { birch } from '../src/art/builders/birch';
import { smallBirch } from '../src/art/builders/small-birch';
import { oak } from '../src/art/builders/oak';
import { smallOak } from '../src/art/builders/small-oak';
import { spruce } from '../src/art/builders/spruce';
import { smallSpruce } from '../src/art/builders/small-spruce';
import { signboard } from '../src/art/builders/signboard';
import { sink } from '../src/art/builders/sink';
import { stool } from '../src/art/builders/stool';
import { streetlamp } from '../src/art/builders/streetlamp';
import { stump } from '../src/art/builders/stump';
import { sunflower } from '../src/art/builders/sunflower';
import { table } from '../src/art/builders/table';
import { tank } from '../src/art/builders/tank';
import { tree } from '../src/art/builders/tree';
import { trough } from '../src/art/builders/trough';
import { vent } from '../src/art/builders/vent';
import { wildflower } from '../src/art/builders/wildflower';
import { forge } from '../src/art/builders/forge';
import { hoist } from '../src/art/builders/hoist';
import { hopper } from '../src/art/builders/hopper';
import { ladder } from '../src/art/builders/ladder';
import { panel } from '../src/art/builders/panel';
import { stair } from '../src/art/builders/stair';
import { workbench } from '../src/art/builders/workbench';
import { bluebell } from '../src/art/builders/bluebell';
import { cowparsley } from '../src/art/builders/cowparsley';
import { foxglove } from '../src/art/builders/foxglove';
import { lavender } from '../src/art/builders/lavender';
import { thistle } from '../src/art/builders/thistle';

const builders: MeshBuilder[] = [
  bluebell,
  cowparsley,
  foxglove,
  lavender,
  thistle,
  forge,
  hoist,
  hopper,
  ladder,
  panel,
  stair,
  workbench,
  anvil,
  archway,
  banner,
  barrel,
  bed,
  bell,
  bovine,
  bramble,
  bush,
  cairn,
  candle,
  chainlink,
  chair,
  cistern,
  crate,
  daisy,
  sticks,
  dog,
  hutDoor,
  hutTrapdoor,
  factoryDoor,
  factoryTrapdoor,
  equine,
  fallenLog,
  fence,
  fern,
  figure,
  floodlight,
  smallGrassClump,
  largeGrassClump,
  hut,
  lantern,
  machine,
  moss,
  mushroom,
  nettle,
  ovine,
  pinecone,
  pipes,
  poppy,
  porcine,
  post,
  poultry,
  railing,
  reeds,
  rock,
  smallTree,
  windowBuilder,
  fireplace,
  stove,
  broom,
  chest,
  dresser,
  hangingHerbs,
  spinningWheel,
  wallPegs,
  washtub,
  elder,
  gorse,
  hazel,
  birch,
  smallBirch,
  oak,
  smallOak,
  spruce,
  smallSpruce,
  signboard,
  sink,
  stool,
  streetlamp,
  stump,
  sunflower,
  table,
  tank,
  tree,
  trough,
  vent,
  wildflower,
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

// --- the flex table names real builders -----------------------------------
//
// `FLEX` is keyed by builder name and anything missing from it does not move.
// That default is deliberate — an anvil should never wobble because somebody
// forgot — but it makes a *typo* silent: `'sunflowr': 0.2` is not an error,
// it is a sunflower that has quietly gone rigid, and nothing about the frame
// rate, the geometry or the checks would say so. Only standing in a field on
// a windy day would, and only if you were looking at the right plant.
const stale = Object.keys(FLEX).filter((name) => !onDisk.includes(name));
check(
  'every flex entry names a builder',
  stale.length === 0,
  stale.length === 0
    ? `${Object.keys(FLEX).length} species bend, ${onDisk.length - Object.keys(FLEX).length} are rigid`
    : `no such builder: ${stale.join(', ')}`,
);

// --- the clutter table names real builders ---------------------------------
//
// Exactly the same trap as `FLEX`, one step quieter. A typo here does not make
// a plant rigid, it makes a plant *keep a shadow it was meant to lose* — which
// costs frame time and looks completely correct, so there is no symptom at all
// beyond a draw call count slightly higher than the arithmetic said.
const unknown = [...CLUTTER].filter((name) => !onDisk.includes(name));
check(
  'every clutter entry names a builder',
  unknown.length === 0,
  unknown.length === 0
    ? `${CLUTTER.size} species drop their shadows`
    : `no such builder: ${unknown.join(', ')}`,
);

// --- the cover patch actually lands ----------------------------------------
//
// `String.replace` on a marker that is not there does nothing and says nothing.
// If upstream renames an include, the shell shader silently becomes a no-op:
// the material compiles, the mesh draws, and every shell lands in the same
// place. Nothing about that is an error anywhere.
{
  const lambert = THREE.ShaderLib.lambert;
  const shader = {
    uniforms: {} as Record<string, unknown>,
    vertexShader: lambert.vertexShader,
    fragmentShader: lambert.fragmentShader,
  };
  COVER_MATERIAL.onBeforeCompile?.(
    shader as unknown as THREE.WebGLProgramParametersWithUniforms,
    null as unknown as THREE.WebGLRenderer,
  );

  const landed: string[] = [];
  const missed: string[] = [];
  // Named by what each is for, since a failure here is read by somebody asking
  // what stopped working rather than by somebody reading three's shader source.
  for (const [what, source, needle] of [
    ['declarations', shader.vertexShader, `attribute vec4 ${COVER_ATTRIBUTE};`],
    ['the shell lift', shader.vertexShader, 'transformed.y += rise'],
    ['the height swell', shader.vertexShader, 'float swell = mix('],
    ['the wind shear', shader.vertexShader, 'vCoverPlace = vec4('],
    ['the height field', shader.fragmentShader, 'float field = 0.68 * coverNoise('],
    ['the tuft floor', shader.fragmentShader, 'if (tuft <= 0.0) discard;'],
    ['the taper discard', shader.fragmentShader, 'if (up > reach) discard;'],
    ['the bare-face early out', shader.fragmentShader, 'if (vCoverBlade.x <= 0.0) discard;'],
    ['the blade colour', shader.fragmentShader, 'mix(vCoverTint, diffuseColor.rgb, 0.25)'],
  ] as const) {
    (source.includes(needle) ? landed : missed).push(what);
  }
  check(
    'the groundcover shader patch lands',
    missed.length === 0,
    missed.length === 0
      ? `${landed.length} injections land in three's Lambert program`
      : `no marker for: ${missed.join(', ')} — three's Lambert program has moved`,
  );

  // And that it took the *shared* wind field rather than a copy of it, which is
  // the claim `art/sway.ts` makes: the gust bending a tree is the gust shearing
  // the grass under it, and two sets of numbers cannot make that claim.
  check(
    'groundcover answers the same gust as the trees',
    shader.uniforms.gustField === windUniforms.gustField,
    shader.uniforms.gustField === windUniforms.gustField
      ? 'one gust texture, shared by reference'
      : 'the cover material has its own gust field',
  );
}

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
