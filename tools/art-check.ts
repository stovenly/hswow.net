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
import { SWAY_ATTRIBUTE, ART_MATERIAL } from '../src/art/assemble';
import { DETAIL_ATTRIBUTE, DETAIL_TINT_ATTRIBUTE, detailUniforms } from '../src/art/detail';
import { CLUTTER } from '../src/art/clutter';
import { FLEX } from '../src/art/flex';
import {
  COVER_MATERIAL,
  TUFT_MATERIAL,
  COVER_NORMAL_MATERIAL,
  TUFT_NORMAL_MATERIAL,
  PROP_TURN,
  WALL_LIFT,
  coverFor,
} from '../src/art/cover';
import { windUniforms, patchArtMaterial } from '../src/art/sway';
import { PARTICLE_MATERIAL, PARTICLE_GLOW_MATERIAL, createParticles } from '../src/art/particles';
import { WATER_MATERIAL } from '../src/art/water';
import { GLOW_MATERIAL, TEXT_GLOW_ADDITIVE, TEXT_GLOW_MATERIAL } from '../src/art/glow';
import { letteringGlow } from '../src/art/lettering';
import { GLOW_LAYER } from '../src/layers';
import { createRng } from '../src/art/random';
import {
  rollActivity,
  displace,
  sampleActivity,
  eventsIn,
  CANDLE,
  LANTERN,
  STREETLAMP,
  HEARTH,
  FORGE,
  STOVE,
  type ActivityEvent,
} from '../src/art/activity';

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
import {
  fence,
  FENCE_MAX_SECTIONS,
  FENCE_SECTION,
  RAIL_DEPTH,
} from '../src/art/builders/fence';
import { fencePost } from '../src/art/builders/fence-post';
import {
  stoneWall,
  WALL_MAX_SECTIONS,
  WALL_SECTION,
} from '../src/art/builders/stone-wall';
import { stoneWallLow } from '../src/art/builders/stone-wall-low';
import { stoneWallColumn } from '../src/art/builders/stone-wall-column';
import { stoneWallColumnLow } from '../src/art/builders/stone-wall-column-low';
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
  fencePost,
  stoneWall,
  stoneWallLow,
  stoneWallColumn,
  stoneWallColumnLow,
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

// --- the detail fade lands, and lands after weathering ----------------------
//
// Two failures with no symptom. `String.replace` on a marker that is not there
// does nothing and says nothing, so a renamed include upstream turns the fade
// into a no-op and the moiré simply comes back — see ANTIALIASING.md, which is
// a document about chasing that exact shimmer through three separate causes.
//
// The ordering is the subtler one. The fade is anchored *after* `color_fragment`
// rather than on it, because weathering has already replaced that chunk; land
// above the wear block instead and a rusted patch keeps full contrast into the
// distance while the surface under it dissolves. That reads as sparkle on rust
// and nothing about it points here.
{
  patchArtMaterial();
  const shader = {
    uniforms: {} as Record<string, unknown>,
    vertexShader: THREE.ShaderLib.lambert.vertexShader,
    fragmentShader: THREE.ShaderLib.lambert.fragmentShader,
  };
  ART_MATERIAL.onBeforeCompile?.(
    shader as unknown as THREE.WebGLProgramParametersWithUniforms,
    null as unknown as THREE.WebGLRenderer,
  );

  const missed: string[] = [];
  for (const [what, source, needle] of [
    ['the feature size', shader.vertexShader, `attribute float ${DETAIL_ATTRIBUTE};`],
    ['the fade target', shader.vertexShader, `attribute vec3 ${DETAIL_TINT_ATTRIBUTE};`],
    ['the view position', shader.vertexShader, 'vDetailView = mvPosition.xyz;'],
    ['the footprint', shader.fragmentShader, 'length(fwidth(vDetailView))'],
    ['the fade', shader.fragmentShader, 'mix(diffuseColor.rgb, vDetailTint, gone)'],
  ] as const) {
    if (!source.includes(needle)) missed.push(what);
  }

  const wearAt = shader.fragmentShader.indexOf('vWearTint * (0.72');
  const fadeAt = shader.fragmentShader.indexOf('vDetailTint, gone');
  const ordered = wearAt >= 0 && fadeAt > wearAt;
  if (!ordered) missed.push('the fade running after weathering');

  const wired =
    shader.uniforms.uDetailStart === detailUniforms.uDetailStart &&
    shader.uniforms.uDetailSpan === detailUniforms.uDetailSpan;
  if (!wired) missed.push('the dials, shared by reference');

  check(
    'the detail fade patches land, after weathering',
    missed.length === 0,
    missed.length === 0
      ? '5 injections land in three’s Lambert program, fade after wear'
      : `missing: ${missed.join(', ')}`,
  );
}

// --- nothing fades unless it asked to ---------------------------------------
//
// The fade is opt-in, and the default has to be *never*. A stray non-zero
// feature size dissolves a prop into a colour at a distance somebody has to
// walk to before they can see it go wrong — and the whole art kit shares one
// material, so a mistake in `assemble` would do it to everything at once.
{
  const stray: string[] = [];
  let missing = 0;
  let vertices = 0;
  for (const builder of builders) {
    const attribute = builder.build({ seed: 1 }).geometry.getAttribute(DETAIL_ATTRIBUTE);
    // Absent is worse than non-zero: the attribute has to exist on every
    // geometry, because they all merge into one buffer against one program.
    if (!attribute) {
      missing++;
      continue;
    }
    vertices += attribute.count;
    for (let i = 0; i < attribute.count; i++) {
      if (attribute.getX(i) !== 0) {
        stray.push(`${builder.name} at ${(attribute.getX(i) * 1000).toFixed(0)} mm`);
        break;
      }
    }
  }
  const problems = [
    missing > 0 && `${missing} builders carry no ${DETAIL_ATTRIBUTE} attribute`,
    // Named, but not all of them: the likely cause is `assemble` fading
    // everything, and a failure that prints ninety identical lines buries the
    // one number that says what went wrong.
    stray.length > 0 &&
      `${stray.length} declared a feature size: ${stray.slice(0, 4).join(', ')}` +
        (stray.length > 4 ? ` and ${stray.length - 4} more` : ''),
  ].filter(Boolean);
  check(
    'nothing in the kit fades unless it asked to',
    problems.length === 0,
    problems.length === 0
      ? `${vertices.toLocaleString()} vertices across ${builders.length} builders, every feature size 0`
      : problems.join('; '),
  );
}

// --- runs join, and join the same way every time ----------------------------
//
// `fence` and `stone-wall` exist to be laid end to end by a placer that wants a
// boundary of some arbitrary length. Both promise the same two things, and both
// promises are invisible in a gallery — a row of eight fences standing apart
// looks identical whether or not any two of them would actually meet.
//
// **A piece is exactly its sections long.** Get this wrong by a centimetre and
// nothing breaks; a run of twenty pieces is simply twenty centimetres short of
// where the placer put the gate.
//
// **A fence is missing its last post, and only its last post.** That is what
// lets `fence-post` finish a run and another fence extend it, with no doubled
// post either way — so the far end must carry nothing past the join, and the
// near end must carry a post standing proud of it. A wall makes no such
// promise: it has no piers at all, so it is flush at both ends.
{
  let overrun = 0;
  let nearEnd = -Infinity;
  for (let seed = 1; seed <= 400; seed++) {
    for (let sections = 1; sections <= FENCE_MAX_SECTIONS; sections++) {
      const geometry = fence.build({ seed, sections }).geometry;
      geometry.computeBoundingBox();
      const box = geometry.boundingBox as THREE.Box3;
      const half = (sections * FENCE_SECTION) / 2;
      overrun = Math.max(overrun, box.max.x - half);
      nearEnd = Math.max(nearEnd, half + box.min.x);
    }
  }

  // A wall's face deliberately wanders across the join — see `seam` — so what
  // has to line up is not the bounding box but the *profile*, and it does
  // because it is a function of height alone. So the pieces of one run are
  // measured against each other rather than against the nominal plane: whatever
  // one of them does at its end, every other length of the same run does too.
  // A wall's face deliberately wanders across the join — see `seam` — so what
  // it may not do is leave it by more than that wander. The pieces still meet
  // because the wander is a function of height alone and both sides compute the
  // same one; the hearting they bear on spans exactly and never moves at all.
  //
  // That last part is by construction and no measurement here can stand in for
  // it: at any given height the leftmost vertex is the seam plus whatever the
  // bedding pulled that particular stone in by, and the bedding varies more than
  // the seam does. A profile comparison reads the same with the fault in.
  let drift = 0;
  for (let run = 1; run <= 200; run++) {
    for (let sections = 1; sections <= WALL_MAX_SECTIONS; sections++) {
      const geometry = stoneWall.build({ seed: run * 131 + sections, run, sections }).geometry;
      geometry.computeBoundingBox();
      const box = geometry.boundingBox as THREE.Box3;
      const half = (sections * WALL_SECTION) / 2;
      drift = Math.max(drift, Math.abs(box.max.x - half), Math.abs(box.min.x + half));
    }
  }

  const problems = [
    // A sagging rail tips its own end out by a millimetre or so. A *post* at
    // the far end would put six centimetres there, which is the failure.
    overrun > 0.005 && `a fence runs ${(overrun * 1000).toFixed(0)} mm past its last join`,
    nearEnd >= 0 && 'a fence has no post at its near end',
    drift > 0.045 && `a wall face leaves its join by ${(drift * 1000).toFixed(0)} mm`,
  ].filter(Boolean);

  check(
    'runs are exactly as long as they say',
    problems.length === 0,
    problems.length === 0
      ? `fence overruns ${(overrun * 1000).toFixed(1)} mm and stands ${(-nearEnd * 1000).toFixed(0)} mm proud at the near end; wall faces wander ${(drift * 1000).toFixed(0)} mm across a join`
      : problems.join(', '),
  );
}

// --- the pieces of a run agree with each other ------------------------------
//
// Tiling exactly is not enough, and this is the half that a bounding box cannot
// see. A placer laying a boundary longer than one piece calls the builder again
// with a different seed, and if the *carpentry* is rolled off that seed then the
// two halves of one fence have different numbers of rails and tops a hand's
// breadth apart — three rails meeting two on the same post. Same for a wall,
// where the step reached two thirds of a metre.
//
// So both take a `run` seed for everything that has to match, and this is what
// holds them to it. A one-section fence is one post and its rails, so its
// triangle count *is* the rail count: nothing else could tell them apart.
{
  let mismatched = 0;
  let step = 0;
  for (let run = 1; run <= 300; run++) {
    const a = fence.build({ seed: run * 31 + 1, run, sections: 1 }).geometry;
    const b = fence.build({ seed: run * 977 + 5, run, sections: 1 }).geometry;
    if (a.getAttribute('position').count !== b.getAttribute('position').count) mismatched++;
    a.computeBoundingBox();
    b.computeBoundingBox();
    const ay = (a.boundingBox as THREE.Box3).max.y;
    const by = (b.boundingBox as THREE.Box3).max.y;
    // Posts still vary about the run's own height; a different height *band* is
    // what this is looking for.
    step = Math.max(step, Math.abs(ay - by) / Math.max(ay, by));
  }

  let wallStep = 0;
  for (let run = 1; run <= 300; run++) {
    const boxes = [run * 31 + 1, run * 977 + 5].map((seed) => {
      const geometry = stoneWall.build({ seed, run, sections: 1 }).geometry;
      geometry.computeBoundingBox();
      return geometry.boundingBox as THREE.Box3;
    });
    wallStep = Math.max(wallStep, Math.abs(boxes[0].max.y - boxes[1].max.y));
  }

  const problems = [
    mismatched > 0 && `${mismatched}/300 fence runs change their rail count mid-run`,
    step > 0.25 && `a fence run steps ${(step * 100).toFixed(0)}% in height`,
    wallStep > 0.08 && `a wall run steps ${(wallStep * 100).toFixed(0)} cm in height`,
  ].filter(Boolean);

  check(
    'the pieces of a run agree',
    problems.length === 0,
    problems.length === 0
      ? `300 runs: rails always match, fence tops within ${(step * 100).toFixed(0)}%, wall tops within ${(wallStep * 1000).toFixed(0)} mm`
      : problems.join(', '),
  );
}

// --- a pier is never overtopped by its own wall -----------------------------
//
// `stone-wall-column` is what finishes a run, and a pier the wall stands taller
// than reads as a lump in the middle of it rather than its end. The two bands
// used to overlap, so it happened on one pair in six.
{
  let worst = -Infinity;
  for (let seed = 1; seed <= 400; seed++) {
    const wall = stoneWall.build({ seed, run: seed, sections: 1 }).geometry;
    const pier = stoneWallColumn.build({ seed: seed + 70 }).geometry;
    wall.computeBoundingBox();
    pier.computeBoundingBox();
    const over =
      (wall.boundingBox as THREE.Box3).max.y - (pier.boundingBox as THREE.Box3).max.y;
    worst = Math.max(worst, over);
  }
  check(
    'a pier stands clear of the wall it ends',
    worst <= 0,
    worst <= 0
      ? `400 pairs, the wall never reaches within ${(-worst * 100).toFixed(0)} cm of the pier`
      : `a wall overtops its own pier by ${(worst * 100).toFixed(0)} cm`,
  );
}

// --- the rails are all on one face ------------------------------------------
//
// A rail in front of one post and behind the next reads as a fault rather than
// as a fence somebody knocked together, and nothing else here would measure it.
//
// Stated as: every fence leans the same way off its own line. The mean z over
// all vertices mixes posts sitting on the line with rails standing off it, and
// so lands somewhere between zero and the standoff — where rails jittered onto
// either side average out to nothing.
{
  let quietest = Infinity;
  let at = 0;
  for (let seed = 1; seed <= 400; seed++) {
    const position = fence.build({ seed }).geometry.getAttribute('position');
    let total = 0;
    for (let i = 0; i < position.count; i++) total += position.getZ(i);
    const mean = total / position.count;
    if (mean < quietest) {
      quietest = mean;
      at = seed;
    }
  }
  // A quarter of the rail's own thickness. Well clear of zero, and well under
  // what a run whose rails are genuinely one-sided ever gets down to.
  const bar = RAIL_DEPTH / 4;
  check(
    'a fence puts its rails on one face',
    quietest > bar,
    quietest > bar
      ? `worst of 400 seeds sits ${(quietest * 1000).toFixed(0)} mm in front of the post line`
      : `seed ${at} averages ${(quietest * 1000).toFixed(0)} mm, under the ${(bar * 1000).toFixed(0)} mm bar`,
  );
}

// --- the cover patches actually land ----------------------------------------
//
// `String.replace` on a marker that is not there does nothing and says nothing.
// If upstream renames an include, a cover shader silently becomes a no-op:
// the material compiles, the mesh draws, and every blade stands at the origin.
// Nothing about that is an error anywhere.
{
  const compiled = (material: THREE.Material, lib: THREE.ShaderLibShader) => {
    const shader = {
      uniforms: {} as Record<string, unknown>,
      vertexShader: lib.vertexShader,
      fragmentShader: lib.fragmentShader,
    };
    material.onBeforeCompile(
      shader as unknown as THREE.WebGLProgramParametersWithUniforms,
      null as unknown as THREE.WebGLRenderer,
    );
    return shader;
  };
  const blades = compiled(COVER_MATERIAL, THREE.ShaderLib.lambert);
  const tufts = compiled(TUFT_MATERIAL, THREE.ShaderLib.lambert);
  // The normal-pass twins compile against the normal program — see
  // drawCoverNormals for why they exist.
  const bladesNormal = compiled(COVER_NORMAL_MATERIAL, THREE.ShaderLib.normal);
  const tuftsNormal = compiled(TUFT_NORMAL_MATERIAL, THREE.ShaderLib.normal);

  const landed: string[] = [];
  const missed: string[] = [];
  // Named by what each is for, since a failure here is read by somebody asking
  // what stopped working rather than by somebody reading three's shader source.
  for (const [what, source, needle] of [
    ['the blade instance data', blades.vertexShader, 'attribute vec4 iPlace;'],
    ['the ground normal', blades.vertexShader, 'vec3 objectNormal = iNormal;'],
    ['the blade gust', blades.vertexShader, 'texture2D(gustField'],
    ['the width clamp', blades.vertexShader, '0.5 * coverPixel * length(toCam)'],
    ['the tread', blades.vertexShader, 'coverPlayer.xz'],
    ['the unflipped normal', blades.fragmentShader, 'normal = normalize(vNormal);'],
    ['the blade tint', blades.fragmentShader, 'diffuseColor.rgb = vCoverTint;'],
    ['the tuft lag', tufts.vertexShader, 'windLagScale + iProp.y'],
    ['the tuft tread', tufts.vertexShader, 'coverPlayer.xz'],
    ['the stipple', tufts.fragmentShader, '> vTuftGrain.z) discard'],
    ['the backlight', tufts.fragmentShader, 'outgoingLight += diffuseColor.rgb * coverGlow'],
    ['the blade normal pass', bladesNormal.vertexShader, 'attribute vec4 iPlace;'],
    ['the tuft normal pass', tuftsNormal.vertexShader, 'attribute vec4 iPlace;'],
    ['the normal-pass stipple', tuftsNormal.fragmentShader, '> vTuftGrain.z) discard'],
  ] as const) {
    (source.includes(needle) ? landed : missed).push(what);
  }
  check(
    'the groundcover shader patches land',
    missed.length === 0,
    missed.length === 0
      ? `${landed.length} injections land in three's Lambert program`
      : `no marker for: ${missed.join(', ')} — three's Lambert program has moved`,
  );

  // And that both took the *shared* wind field rather than a copy of it, which
  // is the claim `art/sway.ts` makes: the gust bending a tree is the gust
  // bending the grass under it, and two sets of numbers cannot make that claim.
  const shared =
    blades.uniforms.gustField === windUniforms.gustField &&
    tufts.uniforms.gustField === windUniforms.gustField;
  check(
    'groundcover answers the same gust as the trees',
    shared,
    shared ? 'one gust texture, shared by reference' : 'a cover material has its own gust field',
  );

  /**
   * Wall cover stands in front of its wall.
   *
   * A wall prop is authored in the wall's frame and then turned about the
   * vertical per instance, which takes anything wide *behind* the wall face,
   * where it is depth-tested away and simply never seen. The failure is
   * invisible in every other measurement — the props are placed, counted and
   * drawn, they just are not there — so the geometry is measured against its
   * own turn instead. The ivy shipped like this: a half-metre crawl turned
   * seventeen degrees lost its far end 14 cm into the masonry.
   */
  const buried: string[] = [];
  const clearances: string[] = [];
  for (const type of ['ivy', 'rose', 'wisteria'] as const) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.7));
    const grown = coverFor(wall, type);
    const seen = new Set<string>();
    grown?.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh) || seen.has(mesh.name)) return;
      seen.add(mesh.name);
      const kind = mesh.name.replace('cover-', '') as keyof typeof PROP_TURN;
      const turn = (PROP_TURN[kind] ?? 0) / 2;
      const position = mesh.geometry.getAttribute('position');
      let worst = Infinity;
      for (let i = 0; i < position.count; i++) {
        const out = position.getZ(i) * Math.cos(turn) - Math.abs(position.getX(i)) * Math.sin(turn);
        worst = Math.min(worst, out);
      }
      // Props are lifted `WALL_LIFT` off the face and scale up to 1.2.
      const clearance = worst * 1.2 + WALL_LIFT;
      clearances.push(`${kind} ${(clearance * 100).toFixed(1)} cm`);
      if (clearance < 0) buried.push(`${kind} by ${(-clearance * 100).toFixed(1)} cm`);
    });
  }
  check(
    'wall cover stands in front of its wall',
    buried.length === 0,
    buried.length === 0
      ? `closest approach: ${clearances.join(', ')}`
      : `turned into the wall: ${buried.join(', ')}`,
  );

  /**
   * The particle patches land, in both materials.
   *
   * Two of these replace a three include rather than adding to it —
   * `begin_vertex`, because a particle's position is not its vertex's, and
   * `project_vertex`, because that position is already in world space. A
   * `String.replace` that matches nothing is silent, and what it leaves behind
   * is a shader that compiles perfectly and draws every particle at the origin.
   */
  const particleShader = (material: THREE.Material, lib: { vertexShader: string; fragmentShader: string }) => {
    const shader = {
      uniforms: {} as Record<string, unknown>,
      vertexShader: lib.vertexShader,
      fragmentShader: lib.fragmentShader,
    };
    (material.onBeforeCompile as unknown as (s: typeof shader, r: unknown) => void)(shader, null);
    return shader;
  };
  const lit = particleShader(PARTICLE_MATERIAL, THREE.ShaderLib.lambert);
  const glow = particleShader(PARTICLE_GLOW_MATERIAL, THREE.ShaderLib.basic);

  const gone: string[] = [];
  const here: string[] = [];
  for (const [what, source, needle] of [
    ['the instance data', lit.vertexShader, 'attribute vec4 iShape;'],
    ['the wrap', lit.vertexShader, 'pos.xz = centre.xz + mod('],
    ['the wind integral', lit.vertexShader, 'gustSum(uNow) - gustSum(uThen)'],
    ['the sub-pixel clamp', lit.vertexShader, 'float drawn = max(wanted, 1.0);'],
    // The *on-screen* speed, not the world one — see the note beside it. Rain
    // stretched by its world speed lies on its side the moment you look up.
    ['the streak', lit.vertexShader, 'speedOnScreen * uShutter'],
    ['begin_vertex replaced', lit.vertexShader, 'vec3 transformed = vec3(position);'],
    ['the depth test', lit.fragmentShader, 'if (sceneZ < vParticleDepth) discard;'],
    ['the soft fade', lit.fragmentShader, 'smoothstep(0.0, uSoftFade'],
    ['the emissive twin', glow.vertexShader, 'attribute vec4 iShape;'],
    ['the emissive depth test', glow.fragmentShader, 'if (sceneZ < vParticleDepth) discard;'],
  ] as const) {
    (source.includes(needle) ? here : gone).push(what);
  }
  // The two replacements have to have *consumed* their include, or the original
  // runs after the patch and quietly overwrites `transformed`.
  for (const [what, source] of [
    ['begin_vertex', lit.vertexShader],
    ['project_vertex', lit.vertexShader],
  ] as const) {
    if (source.includes(`#include <${what}>`)) gone.push(`${what} still present`);
  }
  check(
    'the particle shader patches land',
    gone.length === 0,
    gone.length === 0
      ? `${here.length} injections land in both particle programs`
      : `no marker for: ${gone.join(', ')} — three's program has moved`,
  );

  /**
   * Nothing drawn into the effect chain may hardware depth-test.
   *
   * **This is the check for the bug that made the whole feature invisible.**
   * The ping-pong targets carry a depth renderbuffer nothing fills
   * meaningfully, and every pass that draws into one opens with a full-screen
   * blit — which, on a `ShaderMaterial`, writes depth by default and stamps the
   * near plane across the frame. Anything drawn afterwards that tests against
   * it fails everywhere.
   *
   * The particle materials shipped with `depthTest: true` and drew eleven
   * systems, every one of them discarded at the first fragment. The draw calls
   * were right, the instance data was right, the shader compiled, and the room
   * was empty. `WATER_MATERIAL` has had the correct setting since it was
   * written; this asserts the particle ones match it.
   */
  const depthy = [
    ['particles (lit)', PARTICLE_MATERIAL],
    ['particles (glow)', PARTICLE_GLOW_MATERIAL],
    ['water', WATER_MATERIAL],
  ] as const;
  const testing = depthy.filter(([, m]) => m.depthTest || m.depthWrite).map(([n]) => n);
  check(
    'nothing in the effect chain depth-tests in hardware',
    testing.length === 0,
    testing.length === 0
      ? `${depthy.length} chain materials, all testing depth in the shader instead`
      : `still depth-testing against a buffer nobody fills: ${testing.join(', ')}`,
  );

  // The same claim the cover makes, one layer out: the gust carrying the snow
  // is the gust bending the trees, which two tables cannot say.
  const oneWind =
    lit.uniforms.gustIntegral === windUniforms.gustIntegral &&
    glow.uniforms.gustIntegral === windUniforms.gustIntegral;
  check(
    'particles answer the same gust as the trees',
    oneWind,
    oneWind ? 'one integral texture, shared by reference' : 'a particle material has its own',
  );

  /**
   * A system is built deterministically, finite, and off layer 0.
   *
   * Off layer 0 is the whole of the layer decision — it is what buys no
   * outline, no hole in anything else's outline, and no shadow — and it is one
   * line in `createParticles` that nothing else would notice the loss of. The
   * *showcase* is checked in `world-check`, where the zones live.
   */
  const madeOf = (motion: 'fall' | 'ballistic' | 'rise' | 'tumble') =>
    createParticles(
      {
        count: 64,
        shape: motion === 'tumble' ? new THREE.PlaneGeometry(1, 1) : 'billboard',
        motion,
        volume:
          motion === 'fall' || motion === 'tumble'
            ? { kind: 'field', size: new THREE.Vector3(8, 8, 8) }
            : { kind: 'emitter', spread: 0.2 },
        size: [0.02, 0.05],
        colour: [0xffffff, 0xcccccc],
        opacity: 0.8,
        speed: [1, 2],
        life: 2,
      },
      1234,
    );

  const wrong: string[] = [];
  let instances = 0;
  for (const motion of ['fall', 'ballistic', 'rise', 'tumble'] as const) {
    const first = madeOf(motion);
    const second = madeOf(motion);
    const zero = new THREE.Layers();
    zero.set(0);
    if (first.layers.test(zero)) wrong.push(`${motion} is on layer 0`);
    if (first.frustumCulled) wrong.push(`${motion} is frustum culled`);
    if (first.userData.noCollide !== true) wrong.push(`${motion} is collidable`);
    const geometry = first.geometry as THREE.InstancedBufferGeometry;
    instances += geometry.instanceCount;
    for (const [name, attribute] of Object.entries(geometry.attributes)) {
      const mine = (attribute as THREE.BufferAttribute).array as ArrayLike<number>;
      const theirs = ((second.geometry.getAttribute(name) as THREE.BufferAttribute).array) as ArrayLike<number>;
      for (let i = 0; i < mine.length; i++) {
        if (!Number.isFinite(mine[i])) wrong.push(`${motion}.${name}[${i}] is not finite`);
        else if (mine[i] !== theirs[i]) wrong.push(`${motion}.${name} is not deterministic`);
        if (wrong.length > 4) break;
      }
    }
  }
  check(
    'every particle motion builds clean',
    wrong.length === 0,
    wrong.length === 0
      ? `4 motions, ${instances} instances, deterministic, off layer 0, never culled`
      : wrong.slice(0, 4).join('; '),
  );
}

// --- lettering that emits ---------------------------------------------------
{
  // Bloom's emitters pass selects by layer and nothing else, so text that
  // missed it would render correctly and simply never bloom, with no error.
  const onLayer = new THREE.Layers();
  onLayer.set(GLOW_LAYER);
  const wrong: string[] = [];
  for (const additive of [false, true]) {
    const mode = additive ? 'additive' : 'solid';
    const mesh = letteringGlow('AB', 0xffe0a8, { additive });
    if (!mesh.layers.test(onLayer)) wrong.push(`${mode} is off the glow layer`);
    if (mesh.userData.noCollide !== true) wrong.push(`${mode} is collidable`);
    const wanted = additive ? TEXT_GLOW_ADDITIVE : TEXT_GLOW_MATERIAL;
    if (mesh.material !== wanted) wrong.push(`${mode} is on the wrong material`);
  }

  // Intensity has to leave the colour over 1 or bloom has nothing to spread,
  // and the symptom of losing it is "the glow looks a bit weak".
  const plain = letteringGlow('AB', 0xffe0a8, {});
  const bright = letteringGlow('AB', 0xffe0a8, { intensity: 4 });
  const peak = (mesh: THREE.Mesh): number =>
    Math.max(...(mesh.geometry.getAttribute('color').array as Float32Array));
  if (!(peak(plain) <= 1.0001)) wrong.push('an unscaled word is already over 1');
  if (peak(bright) < 3.9) wrong.push(`intensity 4 only reached ${peak(bright).toFixed(2)}`);

  check(
    'glowing text emits, and has headroom to bloom with',
    wrong.length === 0,
    wrong.length === 0
      ? `both modes on layer ${GLOW_LAYER}, uncollidable, peak ${peak(bright).toFixed(1)} at intensity 4`
      : wrong.join('; '),
  );

  // Bloom's emitters pass borrows the scene's depth texture, so a glow material
  // that writes depth breaks the edge lines — in some other zone, with no
  // lettering in it. Transparent-queued for the reason on `TEXT_GLOW_MATERIAL`.
  const glows = [
    ['flames', GLOW_MATERIAL],
    ['text (solid)', TEXT_GLOW_MATERIAL],
    ['text (additive)', TEXT_GLOW_ADDITIVE],
  ] as const;
  const writing = glows.filter(([, m]) => m.depthWrite || !m.transparent).map(([n]) => n);
  check(
    'glow materials draw last and write no depth',
    writing.length === 0,
    writing.length === 0
      ? `${glows.length} materials, all transparent-queued and depth-read-only`
      : `would scribble on the scene depth, or be overdrawn by it: ${writing.join(', ')}`,
  );

  // A string replacement against three's own chunk: rename it upstream and the
  // patch silently does nothing, and additive text hazes again.
  const marker = THREE.ShaderLib.basic.fragmentShader.includes('#include <fog_fragment>');
  check(
    "the additive text fog patch has a chunk to land on",
    marker,
    marker
      ? 'fog_fragment is still where three keeps it'
      : "no fog_fragment in three's basic shader — glowing text will haze again",
  );
}

// --- what the flames are doing ----------------------------------------------
{
  const presets = [
    ['candle', CANDLE],
    ['lantern', LANTERN],
    ['streetlamp', STREETLAMP],
    ['hearth', HEARTH],
    ['forge', FORGE],
    ['stove', STOVE],
  ] as const;

  // Ten candles in a row is the requirement, stated as a number. Phase alone
  // passes this at two sources and fails it at ten — same rate, different
  // phase, and they drift into step and beat.
  const RUN = 90;
  const RATE = 30;
  const trace = (source: ReturnType<typeof rollActivity>): number[] =>
    Array.from({ length: RUN * RATE }, (_, s) => sampleActivity(source, s / RATE));
  const traces = Array.from({ length: 10 }, (_, i) =>
    trace(displace(rollActivity(CANDLE, createRng(700 + i * 7919)), i * 2654435761)),
  );

  let worst = 0;
  for (let a = 0; a < traces.length; a++) {
    for (let b = a + 1; b < traces.length; b++) {
      worst = Math.max(worst, Math.abs(correlation(traces[a], traces[b])));
    }
  }

  // And the same measurement on two flames that *are* in step, so the threshold
  // above is a bar something can fail rather than a number that always passes.
  const twinned = rollActivity(CANDLE, createRng(700));
  const locked = correlation(trace(twinned), trace(twinned));

  check(
    'no two flames flicker together',
    worst < 0.25 && locked > 0.99,
    `worst of ${(traces.length * (traces.length - 1)) / 2} pairs correlates ` +
      `${worst.toFixed(3)}, against ${locked.toFixed(3)} for two in lockstep`,
  );

  // A signal that averages 0.8 dims every hearth in the game by a fifth, and
  // nothing anywhere reports it.
  const drifting: string[] = [];
  for (const [name, spec] of presets) {
    const source = rollActivity(spec, createRng(9001));
    let sum = 0;
    let pinned = 0;
    let high = -Infinity;
    const samples = 120 * RATE;
    for (let s = 0; s < samples; s++) {
      const level = sampleActivity(source, s / RATE);
      sum += level;
      if (level <= spec.floor + 1e-9) pinned++;
      high = Math.max(high, level);
    }
    const mean = sum / samples;
    if (Math.abs(mean - 1) > 0.05) drifting.push(`${name} averages ${mean.toFixed(3)}`);
    // A floor that bites often is a light pinned dark, and it makes the mean
    // above a claim about a number nobody is looking at.
    if (pinned / samples > 0.02) {
      drifting.push(`${name} sits on its floor ${((pinned / samples) * 100).toFixed(0)}% of the time`);
    }
    if (high > 3) drifting.push(`${name} peaked at ${high.toFixed(2)}`);
  }
  check(
    'every flame averages the brightness it was authored at',
    drifting.length === 0,
    drifting.length === 0
      ? `${presets.length} presets within 5% of 1 over two minutes`
      : drifting.join('; '),
  );

  // The whole sound coupling rests on this. A signal that answers differently
  // depending on when it was asked cannot be scheduled ahead on the audio
  // clock, and a crackle would fire at a time the light never responded to.
  const source = rollActivity(HEARTH, createRng(4242));
  const ordered = Array.from({ length: 400 }, (_, i) => sampleActivity(source, 10 + i * 0.05));
  const shuffled = new Array<number>(400);
  for (let i = 399; i >= 0; i--) shuffled[i] = sampleActivity(source, 10 + i * 0.05);
  const pure = ordered.every((value, i) => value === shuffled[i]);

  const whole: ActivityEvent[] = [];
  const first: ActivityEvent[] = [];
  const second: ActivityEvent[] = [];
  const all = eventsIn(source, 10, 40, whole);
  const split =
    eventsIn(source, 10, 25, first) + eventsIn(source, 25, 40, second);
  const seamless = all === split && all > 0;

  check(
    'the signal is seekable, so sound can schedule off it',
    pure && seamless,
    pure && seamless
      ? `${all} events over 30 s, and a window is the sum of its halves`
      : [!pure && 'sampling order changes the answer', !seamless && `${all} whole vs ${split} split`]
          .filter(Boolean)
          .join('; '),
  );

  // Six one-line changes, each of which is silent if dropped: the prop simply
  // never moves, among five that do.
  const lit = [candle, lantern, streetlamp, fireplace, forge, stove];
  const still = lit
    .filter((builder) => !builder.build({ seed: 31 }).userData.activity)
    .map((builder) => builder.name);
  check(
    'everything that burns has an activity signal',
    still.length === 0,
    still.length === 0 ? `${lit.length} builders tagged` : `not tagged: ${still.join(', ')}`,
  );

  // A candle's wicks lean, so where the flame goes is the top of a rotated
  // axis rather than the point it was built from — and getting that wrong
  // stands the flame beside the candle rather than on it. Invisible in every
  // headless measure of the prop: the bounds, the triangle count and the seed
  // response are all unchanged by a flame in the wrong place.
  const wickLayer = new THREE.Layers();
  wickLayer.set(GLOW_LAYER);
  let strays = 0;
  let wicks = 0;
  let worstWick = 0;
  // Widest a candle gets, so two of them centred this far apart are touching.
  const FATTEST = 0.016 * 2;
  let closest = Infinity;
  let shared = 0;

  for (let seed = 1; seed <= 400; seed++) {
    const prop = candle.build({ seed });
    const wax = prop.geometry.getAttribute('position');
    const onDish: THREE.Vector3[] = [];
    prop.traverse((child) => {
      if (child === prop || !(child instanceof THREE.Mesh)) return;
      if (!child.layers.test(wickLayer)) return;
      wicks++;
      for (const other of onDish) {
        const gap = Math.hypot(other.x - child.position.x, other.z - child.position.z);
        closest = Math.min(closest, gap);
        if (gap < FATTEST) shared++;
      }
      onDish.push(child.position);
      // Horizontally, because the flame sits deliberately above the wick. A
      // cylinder cap has a vertex on its own axis, so a flame standing where
      // it should is directly over one.
      let nearest = Infinity;
      for (let v = 0; v < wax.count; v++) {
        nearest = Math.min(
          nearest,
          Math.hypot(wax.getX(v) - child.position.x, wax.getZ(v) - child.position.z),
        );
      }
      worstWick = Math.max(worstWick, nearest);
      if (nearest > 0.004) strays++;
    });
  }

  check(
    'every flame stands on its own wick',
    strays === 0,
    strays === 0
      ? `${wicks} wicks over 400 candles, worst ${(worstWick * 1000).toFixed(1)} mm off axis`
      : `${strays} of ${wicks} flames off their wick, worst ${(worstWick * 1000).toFixed(1)} mm`,
  );

  // Two candles standing in the same place read as one candle with a doubled
  // flame — the geometry interpenetrates and the bounds do not change, so it
  // survives every other measure here.
  check(
    'no two candles stand in the same spot',
    shared === 0,
    shared === 0
      ? `closest pair on any dish ${(closest * 1000).toFixed(1)} mm apart, and a candle is ${(FATTEST * 1000).toFixed(0)} mm at its fattest`
      : `${shared} overlapping pairs, closest ${(closest * 1000).toFixed(1)} mm`,
  );
}

console.log('');

/** Pearson's r between two equal-length traces. */
function correlation(a: number[], b: number[]): number {
  const n = a.length;
  let sa = 0;
  let sb = 0;
  for (let i = 0; i < n; i++) {
    sa += a[i];
    sb += b[i];
  }
  const ma = sa / n;
  const mb = sb / n;

  let top = 0;
  let va = 0;
  let vb = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - ma;
    const db = b[i] - mb;
    top += da * db;
    va += da * da;
    vb += db * db;
  }
  const bottom = Math.sqrt(va * vb);
  return bottom === 0 ? 0 : top / bottom;
}

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
