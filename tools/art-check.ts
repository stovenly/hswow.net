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
import {
  COVER_MATERIAL,
  TUFT_MATERIAL,
  COVER_NORMAL_MATERIAL,
  TUFT_NORMAL_MATERIAL,
  PROP_TURN,
  WALL_LIFT,
  coverFor,
} from '../src/art/cover';
import { windUniforms } from '../src/art/sway';
import { PARTICLE_MATERIAL, PARTICLE_GLOW_MATERIAL, createParticles } from '../src/art/particles';
import { WATER_MATERIAL } from '../src/art/water';
import { GLOW_MATERIAL, TEXT_GLOW_ADDITIVE, TEXT_GLOW_MATERIAL } from '../src/art/glow';
import { letteringGlow } from '../src/art/lettering';
import { GLOW_LAYER } from '../src/layers';

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
