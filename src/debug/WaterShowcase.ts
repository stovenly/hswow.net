import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '../world/Zone';
import type { SoundscapeSpec } from '../audio/Soundscape';
import type { Flow } from '../audio/models/water';
import type { PortalEnd, PortalDefinition } from '../world/Portal';
import { markCollidable } from '../player/Collider';
import { waterPlane } from '../art/water';
import { signPost } from './galleries/layout';
import { createRng } from '../art/random';

/**
 * The Water Showcase: a jetty with five pools off it and a bank of races
 * beside it.
 *
 * Every claim water makes is about how a surface looks from a particular
 * place, so each pool carries the geometry that claim needs — water over
 * nothing proves nothing.
 *
 * - **Rocks.** Boulders at mixed depths, so the foam has to trace an arbitrary
 *   waterline rather than a clean contour.
 * - **Chop.** Full wave amplitude on the gust field, with mooring posts to
 *   break against. Crest foam and wind coupling.
 * - **Shore.** One long ramp from 2.5 m down to dry land, so deep colour,
 *   shore colour, the bed coming back through and the waterline all lie across
 *   a single pool.
 * - **Still.** Twenty-six metres of mirror on the jetty's axis. Fresnel is an
 *   angle, so a reflection lives at the far end of a pool; the pilings are on
 *   screen and reflect properly, the sky beyond them is the fallback.
 * - **Beach.** A quarter-metre swell arriving square on the sand and dying as
 *   the bed comes up.
 *
 * **There is no floor.** A water surface is defined by what is under it, so a
 * slab two centimetres down would be measuring the wrong thing. The beds are
 * the floor, and each shelves up to dry land at one end.
 *
 * The fixtures are rough on purpose — a boulder is a rotated box. They exist
 * to break a waterline and be reflected.
 */

export const ZONE_WATER_SHOWCASE = 'water-showcase';

/** Rim and jetty height. Everything walkable in this zone is at this level. */
const DECK_Y = 0.4;
/**
 * Half-width of the jetty's *structure*, and therefore where the pools start.
 * The boards may be wider; this is the number the pools are written against.
 */
const DECK_HALF = 2.4;
/**
 * How far the boards project past the structure, each side: none.
 *
 * There is a metre and a half of stone verge either side of the jetty (see
 * `JETTY_GAP`) whose top is at deck height, so any overhang puts two horizontal
 * faces on the same plane in the same place. An overhang also hides the
 * half-metre of water nearest the deck, which is where the waterline is.
 */
const DECK_OVERHANG = 0;
/** Where the door home stands, the same distance in as a gallery's. */
const DOOR_Z = 16;
/** The jetty runs from behind the door to the lip of the still pool. */
const DECK_FROM = 19;
const DECK_TO = -18.3;
/** How far a kerb reaches down. Below every bed, so nothing shows underneath. */
const KERB_BOTTOM = -3.4;
/** Kerb width. */
const KERB = 0.7;
/** Where the bank comes up to. Above the water, so there is dry land to stand on. */
const BANK_Y = 0.25;
/**
 * Thickness of the jetty's boards, and therefore how far its underside clears
 * the water. **A clearance, not a look.**
 *
 * Water depth-tests in the shader against the scene's depth with two
 * centimetres of slack (see `art/water.ts`), and wave crests reach 8.5 cm above
 * the mean surface at full amplitude. At 15 cm the underside sits 25 cm above
 * the water: eight times the slack against a full crest, four times it at the
 * dev panel's maximum wave scale. Any prop hung over water owes the same sum.
 */
const DECK_THICK = 0.15;

const STONE = new THREE.MeshLambertMaterial({ color: 0x8d8779, flatShading: true });
const BED = new THREE.MeshLambertMaterial({ color: 0x7d7360, flatShading: true });
const TIMBER = new THREE.MeshLambertMaterial({ color: 0x6b563c, flatShading: true });

/** Which way a bed shelves up out of the water. */
type Bank = 'west' | 'east' | 'north';

/**
 * How far a water plane is built past the basin it sits in. The plane's
 * boundary is a hard geometric edge, so it goes inside the kerb, which stands
 * well above the water on every side.
 */
const WATER_MARGIN = 0.3;

/**
 * Stone between the jetty and any water, on the side a pool faces it.
 *
 * A jetty standing *in* a pond has water lapping the middle of it, the strip
 * you most want to look at is under your feet, and the water's edge is inside a
 * solid you cannot see into. A metre and a half of stone: the pools are pools,
 * the jetty is a jetty, and the verge is somewhere to stand between them.
 */
const JETTY_GAP = 1.6;
/** Where water is allowed to begin, either side of the jetty. */
const POOL_EDGE = DECK_HALF + JETTY_GAP;

/** The rectangle a pool's water is built over: proud of the basin all round. */
function waterRect(pool: Pool): { x: [number, number]; z: [number, number] } {
  return {
    x: [pool.x[0] - WATER_MARGIN, pool.x[1] + WATER_MARGIN],
    z: [pool.z[0] - WATER_MARGIN, pool.z[1] + WATER_MARGIN],
  };
}

interface Pool {
  name: string;
  /** The water rectangle. Kerbs stand outside it; the bed spans it. */
  x: [number, number];
  z: [number, number];
  /** Which edge the bed climbs to dry land at. */
  bank: Bank;
  /** How much of the span the climb takes, 0..1. The shore pool is nearly all ramp. */
  shelf: number;
  /** Bed height at the deep end. */
  deep: number;
  /** 0 is a mirror, 1 is the full wind-driven chop, above 1 is a swell. */
  chop: number;
  /**
   * Aims the wave trains and drifts the surface, in metres per second. Omitted,
   * the pool answers the wind like every pond; set, the waves run the way this
   * points, which is how the beach gets swell arriving square on the sand.
   */
  drift?: THREE.Vector2;
  /**
   * Whether the chop tapers away as the bed comes up. Off, a pool carries the
   * same wave height everywhere, which is right for a pond. On, the swell dies
   * as the water shallows.
   */
  taper?: boolean;
  /** Which side of this pool the jetty stands on, if any. See `JETTY_GAP`. */
  verge?: 'west' | 'east';
  /** Which water model stands in it. */
  flow: Flow;
  /** Where the caption goes, on the jetty. */
  sign: [number, number];
}

/**
 * The pools. Laid out around the jetty rather than in a rank: four flank it and
 * the fifth is on its axis past the end, because the still pool is the one that
 * has to be looked *down*. Every one is held off the jetty by `JETTY_GAP`.
 */
const POOLS: readonly Pool[] = [
  {
    // The beach. A quarter-metre swell running square onto the sand and dying
    // as the bed comes up — the whole read here is the taper, which is why the
    // ramp is eighteen metres long rather than the shore pool's fourteen.
    // Sited where you arrive, on the left as you come through the door.
    name: 'beach',
    x: [-22, -POOL_EDGE],
    z: [9.4, 19],
    // Shelving toward the jetty, so the surf comes at you and breaks at the
    // verge you are standing on rather than receding into the distance.
    bank: 'east',
    shelf: 0.8,
    deep: -2.6,
    chop: 2.6,
    taper: true,
    // Aimed at the sand rather than left to the weather. Slow — this is a
    // direction for the swell, not a current.
    drift: new THREE.Vector2(0.45, 0),
    verge: 'east',
    flow: 'stream',
    sign: [-1.6, 14],
  },
  {
    name: 'rocks',
    x: [-16, -POOL_EDGE],
    z: [-5, 8],
    bank: 'west',
    shelf: 0.25,
    deep: -1.6,
    // Enough motion that the waterline moves against the boulders. At full chop
    // the crest foam would swamp the shore foam, which is the thing on trial.
    chop: 0.7,
    verge: 'east',
    flow: 'brook',
    sign: [-1.6, 2],
  },
  {
    name: 'chop',
    x: [POOL_EDGE, 16],
    // The near edge is 1.6 rather than a round number so this pool's end kerb
    // butts exactly against the shore pool's: two rims with a hand's width of
    // nothing between them is a hole you can fall down.
    z: [-1.6, 8],
    bank: 'east',
    shelf: 0.2,
    deep: -2.2,
    chop: 1,
    verge: 'west',
    flow: 'stream',
    sign: [1.6, 4],
  },
  {
    name: 'shore',
    x: [POOL_EDGE, 19],
    // Running south to meet the still pool's kerb, so the rim you can walk
    // round this room on has no gap in it.
    z: [-17.6, -3],
    // Almost the whole width is ramp: two and a half metres of fall over
    // fourteen, which is a slope you can walk and a gradient you can read.
    bank: 'east',
    shelf: 0.85,
    deep: -2.4,
    // Some, because a waterline that never moves is a painted line.
    chop: 0.4,
    verge: 'west',
    flow: 'brook',
    sign: [1.6, -9],
  },
  {
    name: 'still',
    x: [-11, 11],
    // Pushed a verge's width south of where the jetty ends, like every other
    // pool here. Its near kerb used to sit against the deck's last bay, which
    // put the water four-tenths of a metre from the boards.
    z: [-46.6, -20.6],
    bank: 'north',
    shelf: 0.18,
    deep: -2,
    chop: 0,
    // Almost silent, which is what a body of standing water is.
    flow: 'cistern',
    sign: [-1.6, -17],
  },
];

/** A box with its base at `y`, centred on `x`/`z`. */
function block(
  material: THREE.Material,
  width: number,
  height: number,
  depth: number,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y + height / 2, z);
  return mesh;
}

/**
 * A pool's bed: a flat floor that shelves up to dry land at one end.
 *
 * Every pool has a bank. The jetty is 0.4 m above the water and the beds are
 * two metres under it, so a player who steps off without one is in a stone box
 * with no way out. It is also the honest shape, and on the shore pool it is the
 * entire station.
 *
 * Subdivided about every 1.6 m along the shelving axis so the ramp is a ramp
 * rather than a crease, and every 4 m across, which is `world/floor.ts`'s
 * figure for the collider: a triangle spanning a large part of a zone is
 * inserted into a large fraction of the octree.
 */
function slab(
  name: string,
  x: readonly [number, number],
  z: readonly [number, number],
  segX: number,
  segZ: number,
  heightAt: (x: number, z: number) => number,
): THREE.Mesh {
  const width = x[1] - x[0];
  const depth = z[1] - z[0];
  const middleX = (x[0] + x[1]) / 2;
  const middleZ = (z[0] + z[1]) / 2;

  const geometry = new THREE.PlaneGeometry(
    width,
    depth,
    Math.max(1, Math.round(width / segX)),
    Math.max(1, Math.round(depth / segZ)),
  );
  geometry.rotateX(-Math.PI / 2);

  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    // World coordinates in, so a profile is written against the room's layout
    // rather than against wherever this slab's origin happened to land.
    position.setY(i, heightAt(position.getX(i) + middleX, position.getZ(i) + middleZ));
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, BED);
  mesh.name = `bed:${name}`;
  mesh.position.set(middleX, 0, middleZ);
  // **Ground, so it neither casts nor receives.** A large near-horizontal plane
  // can only ever shadow itself, which is the classic source of acne — see the
  // same exclusion for gallery floors in `ZoneManager.prepare`, which reads
  // this flag.
  mesh.userData.ground = true;
  return markCollidable(mesh);
}

/** Smoothstep on an already-normalised 0..1 fraction. */
function ease(t: number): number {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}

/**
 * The height of a pool's bed at a point: flat, then shelving up to the bank.
 * Shared rather than living inside the slab builder, because the beach's wave
 * height is a function of it and the two must not disagree.
 */
function poolBedAt(pool: Pool, x: number, z: number): number {
  const [x0, x1] = pool.x;
  const [z0, z1] = pool.z;
  const shelf = Math.min(Math.max(pool.shelf, 0.01), 1);
  // How far along the shelving axis this point is, 0 at the deep end and 1 at
  // the bank.
  const s =
    pool.bank === 'west'
      ? (x1 - x) / (x1 - x0)
      : pool.bank === 'north'
        ? (z1 - z) / (z1 - z0)
        : (x - x0) / (x1 - x0);
  const climb = Math.min(Math.max((s - (1 - shelf)) / shelf, 0), 1);
  return pool.deep + (BANK_Y - pool.deep) * climb;
}

function bedSlab(pool: Pool): THREE.Mesh {
  const alongX = pool.bank !== 'north';
  return slab(
    pool.name,
    pool.x,
    pool.z,
    // The beach is finer along its shelving axis than the others: eighteen
    // metres of ramp faceted every 1.6 m is a staircase under a wave.
    alongX ? (pool.taper ? 0.9 : 1.6) : 4,
    alongX ? 4 : 1.6,
    (x, z) => poolBedAt(pool, x, z),
  );
}

/**
 * How rough a pool is at a point. A number for most of them; for the beach it
 * is the swell dying against the depth of water actually over the bed — full
 * height in two and a half metres, gone by a hand's depth.
 */
function poolChop(pool: Pool): number | ((x: number, z: number) => number) {
  if (!pool.taper) return pool.chop;
  // Over the first metre and a third of depth, so the swell is already doing
  // something a few paces off the sand and only dies where there is genuinely
  // no water to carry it. Spread wider than that and the waves retreat to the
  // deep end, which is the opposite of a beach.
  return (x, z) => pool.chop * ease((-poolBedAt(pool, x, z) - 0.1) / 1.3);
}

/**
 * The kerbs around a pool, on every side the jetty does not already close.
 * Their tops are at deck level, so the rims and the jetty are one continuous
 * walkable frame.
 *
 * The two axes are cut differently on purpose: the X-running kerbs span the
 * full width including the corners and the Z-running ones stop short. Two boxes
 * overlapping with their tops at the same height would z-fight where they meet.
 */
function kerbs(pool: Pool): THREE.Mesh[] {
  const [x0, x1] = pool.x;
  const [z0, z1] = pool.z;
  const height = DECK_Y - KERB_BOTTOM;
  const walls: THREE.Mesh[] = [];

  // **A complete ring, on every pool.** There is an argument for basins
  // the jetty closed on one side, which is how the jetty came to be standing in
  // the water — see `JETTY_GAP`. Now the side facing the jetty is simply a wider
  // kerb: a verge you can walk along, with the pier beyond it.
  const westWide = pool.verge === 'west' ? JETTY_GAP : KERB;
  const eastWide = pool.verge === 'east' ? JETTY_GAP : KERB;
  const from = x0 - westWide;
  const to = x1 + eastWide;

  for (const z of [z0 - KERB / 2, z1 + KERB / 2]) {
    // Including the far end, where the bank comes up — a wall behind a beach,
    // which is what a rim is anyway, and it keeps the walk round unbroken.
    walls.push(block(STONE, to - from, height, KERB, (from + to) / 2, KERB_BOTTOM, z));
  }

  // The long sides, cut short of the corners the end kerbs already fill. Two
  // boxes with their tops on the same plane, overlapping, is the one thing that
  // genuinely z-fights, so the two axes are cut differently on purpose.
  for (const [x, thick] of [
    [x0 - westWide / 2, westWide],
    [x1 + eastWide / 2, eastWide],
  ] as const) {
    walls.push(block(STONE, thick, height, z1 - z0, x, KERB_BOTTOM, (z0 + z1) / 2));
  }

  return walls.map((wall) => markCollidable(wall));
}

/**
 * The jetty: a slab on a skirt, on posts. The skirt is narrower than the slab,
 * which is what closes the near side of both flanking pools with one piece of
 * geometry instead of four kerbs.
 *
 * Cut into four-metre bays rather than one long box, for the collider's sake: a
 * fifty-metre triangle is inserted into most of the octree.
 */
function jetty(): THREE.Object3D[] {
  const parts: THREE.Object3D[] = [];
  const BAY = 4;
  const length = DECK_FROM - DECK_TO;
  const bays = Math.ceil(length / BAY);

  for (let i = 0; i < bays; i++) {
    const from = DECK_FROM - i * BAY;
    const to = Math.max(DECK_TO, from - BAY);
    const middle = (from + to) / 2;
    const span = from - to;

    parts.push(
      block(TIMBER, (DECK_HALF + DECK_OVERHANG) * 2, DECK_THICK, span, 0, DECK_Y - DECK_THICK, middle),
    );
    // The structure under the boards, flush with the water's edge.
    parts.push(
      block(STONE, DECK_HALF * 2, DECK_Y - DECK_THICK - KERB_BOTTOM, span, 0, KERB_BOTTOM, middle),
    );
  }

  return parts.map((part) => markCollidable(part));
}

/** A boulder: a box, turned. Rough on purpose — see the header. */
function boulder(seed: number, x: number, z: number, top: number): THREE.Mesh {
  const rng = createRng(seed);
  const width = rng.range(1.1, 2.4);
  const depth = rng.range(1.1, 2.2);
  const height = rng.range(1.4, 2.6);
  const mesh = block(STONE, width, height, depth, x, top - height, z);
  mesh.rotation.set(rng.range(-0.14, 0.14), rng.range(0, Math.PI), rng.range(-0.14, 0.14));
  return markCollidable(mesh);
}

/** A post standing in the water, tall enough to be reflected. */
function piling(x: number, z: number, height: number, base: number): THREE.Mesh {
  return markCollidable(block(TIMBER, 0.42, height, 0.42, x, base, z));
}

// --- the races --------------------------------------------------------------
//
// Four straight channels side by side and one that turns a corner, cut into a
// low stone apron west of the jetty. This is the *flow* half of the room:
// a pond answers the wind, so every pool moves the same way at the same speed,
// and a surface that is going somewhere is a different claim entirely.
//
// The apron sits at 20 cm rather than deck height, which is a walkability
// number: a channel bed is about 30 cm below the water and the controller's
// step height is 45 cm, so a rim at deck level would make every channel a box
// you could fall into and not climb out of.
//
// What each channel tests, in order along the bank: four *speeds* an octave
// apart and otherwise identical; *obstacles*, posts that make moving water
// legible by standing still in it and foam at their shallow margin; and the
// *corner*, a per-vertex flow field, which is the whole reason flow is an
// attribute and not a uniform.
//
// Not simulated, stated plainly: the obstacles do not disturb the water. No
// wake, no standing wave, no bow shock. Doing better means the water knowing
// where the obstacles are, which is a different design.

/** Top of the stone apron the races are cut into. See the note above. */
const APRON_Y = 0.2;
const RACE_WIDE = 2.2;
const RACE_WALL = 0.7;
/** Upstream and downstream ends of the straight races. */
const RACE_FROM = -6.4;
// Set so the bank's south wall lands flush against the still pool's kerb.
// A rim with a hand's width of nothing in it is a hole, not a detail.
const RACE_TO = -17.6;
/** How much of the downstream end shelves up, and to what height. */
const RACE_TAIL = 1.8;
const TAIL_Y = 0.06;

interface Race {
  name: string;
  /** Metres per second, running -Z: left to right, seen from the jetty. */
  speed: number;
  /** Bed height along the flat stretch. */
  deep: number;
  chop: number;
}

/**
 * Where the posts stand in every race: across the channel, and down it. Offset
 * side to side rather than in a line, so the streaklines have something to bend
 * around. Four is legible along the whole length without becoming a maze.
 */
const POSTS: readonly (readonly [number, number])[] = [
  [-0.55, -8.6],
  [0.45, -10.6],
  [-0.3, -12.6],
  [0.6, -14.6],
];

const RACES: readonly Race[] = [
  { name: 'flow-slow', speed: 0.35, deep: -0.34, chop: 0.2 },
  { name: 'flow-brisk', speed: 0.9, deep: -0.32, chop: 0.32 },
  { name: 'flow-fast', speed: 1.6, deep: -0.3, chop: 0.45 },
  { name: 'flow-race', speed: 2.5, deep: -0.28, chop: 0.6 },
];

/**
 * The x span of the nth race, counting west from the jetty. Starting at the
 * verge rather than at the pier, so the first channel is held off the jetty
 * exactly as the pools are — see `JETTY_GAP`.
 */
function raceSpan(index: number): [number, number] {
  const east = -POOL_EDGE - index * (RACE_WIDE + RACE_WALL);
  return [east - RACE_WIDE, east];
}

/** Bed height along a race: flat, then shelving up at the downstream end. */
function raceBedAt(z: number, deep: number): number {
  return deep + (TAIL_Y - deep) * ease((RACE_TO + RACE_TAIL - z) / RACE_TAIL);
}

/** The whole bank: apron walls, beds, water, obstacles and captions. */
function raceBank(): THREE.Object3D[] {
  const parts: THREE.Object3D[] = [];
  const west = raceSpan(RACES.length - 1)[0] - RACE_WALL;
  const height = APRON_Y - KERB_BOTTOM;

  // The apron's own masonry. X-running walls take the full width and the
  // Z-running dividers fit between them, so no two tops share a plane — the
  // same cut the pool kerbs make, for the same reason.
  for (const z of [RACE_FROM + RACE_WALL / 2, RACE_TO - RACE_WALL / 2]) {
    parts.push(
      markCollidable(
        block(STONE, -DECK_HALF - west, height, RACE_WALL, (west - DECK_HALF) / 2, KERB_BOTTOM, z),
      ),
    );
  }
  for (let i = 0; i < RACES.length; i++) {
    // The divider west of each race, which for the last one is the outer wall.
    const x = raceSpan(i)[0] - RACE_WALL / 2;
    parts.push(
      markCollidable(
        block(
          STONE,
          RACE_WALL,
          height,
          RACE_FROM - RACE_TO,
          x,
          KERB_BOTTOM,
          (RACE_FROM + RACE_TO) / 2,
        ),
      ),
    );
  }
  // And the verge between the first race and the jetty, which is the same piece
  // of stone the pools get and is here for the same reason.
  parts.push(
    markCollidable(
      block(
        STONE,
        JETTY_GAP,
        height,
        RACE_FROM - RACE_TO,
        -DECK_HALF - JETTY_GAP / 2,
        KERB_BOTTOM,
        (RACE_FROM + RACE_TO) / 2,
      ),
    ),
  );

  RACES.forEach((race, index) => {
    const [x0, x1] = raceSpan(index);
    const middle = (x0 + x1) / 2;

    parts.push(
      slab(race.name, [x0, x1], [RACE_TO, RACE_FROM], 4, 0.6, (_x, z) =>
        raceBedAt(z, race.deep),
      ),
    );

    parts.push(
      waterPlane({
        width: RACE_WIDE + WATER_MARGIN * 2,
        depth: RACE_FROM - RACE_TO + WATER_MARGIN * 2,
        at: new THREE.Vector3(middle, 0, (RACE_FROM + RACE_TO) / 2),
        chop: race.chop,
        // Straight down the channel, and constant, so the wave trains stay
        // coherent — see `WaterPlaneOptions.flow` on when they do not.
        flow: new THREE.Vector2(0, -race.speed),
      }),
    );

    // The same four posts in every channel, in the same places. These four
    // races differ in exactly one thing, and a rig where the furniture also
    // moves is a rig where you cannot tell which difference you are looking at.
    for (const [dx, z] of POSTS) {
      parts.push(markCollidable(block(STONE, 0.32, 0.86, 0.32, middle + dx, race.deep, z)));
    }

    const post = signPost(race.name);
    post.position.set(middle, APRON_Y, RACE_FROM + RACE_WALL / 2);
    parts.push(post);
  });

  return parts;
}

// --- the corner --------------------------------------------------------------

/**
 * An L-shaped race, south-west of the bank.
 *
 * **One water plane over the whole rectangle, not two meeting at the elbow.**
 * Two would have to agree about the wave phase along their seam and cannot,
 * since each carries its own flow direction, so the surface would split along a
 * straight line. One plane with a flow field that *turns* has no seam, and the
 * parts that are not channel are inside the masonry and discard.
 *
 * The chop is low for a related reason: wave phase depends on flow direction,
 * so a direction varying vertex to vertex shears the height field. The surface
 * *pattern* has no such constraint — noise shears cleanly, and it is what
 * carries the flow anyway.
 */
const CORNER = {
  /** The water rectangle. The L is cut out of it by the block below. */
  x: [-21, -13] as const,
  z: [-26, -19] as const,
  /** North edge of the east–west stroke, which runs along the south side. */
  outZ: -23.6,
  /** West edge of the north–south stroke, which runs down the east side. */
  inX: -15.4,
  // Shallower and faster than the straight cuts, to make it rush. The surface
  // break and the foam band are driven by speed, and the shallower the water
  // the more of the channel is inside that band.
  deep: -0.22,
  speed: 2.8,
  /** Where the turn happens, in Z. Eased across, and the width matters — see below. */
  turnFrom: -22.4,
  turnTo: -25,
};

/**
 * The inside of the bend — the concave corner the water sweeps around. Water on
 * the inside of a curve travels slower than water on the outside, and that
 * difference is most of what makes a bend read as a bend. The flow field is
 * evaluated per vertex on the CPU, so it costs only knowing which side a point
 * is on.
 */
const CORNER_INSIDE = { x: CORNER.inX, z: CORNER.outZ };
/**
 * How much faster the outside of the sweep runs than the inside, either way.
 * Deliberately larger than a river's: speed is what the shader turns into
 * surface break, foam and streak length, so a wide spread is the difference
 * between water *going round* a corner and water that merely points a different
 * way at the other end of it.
 */
const CORNER_SWING = 0.6;

/**
 * Widening on the east wall, so it meets the still pool's kerb. The rims are
 * meant to be one continuous thing you can walk round, and a six-tenths gap in
 * a walkable rim is a hole to fall down rather than a detail.
 */
const CORNER_EAST = 1.3;

/** Which way the water is going at a point in the corner, and how fast. */
function cornerFlow(x: number, z: number): THREE.Vector2 {
  // Turning from -Z to -X through the elbow. Eased across two and a half
  // metres, because how sharply this rotates is exactly how much the wave
  // phase shears between neighbouring vertices.
  const t = ease((z - CORNER.turnFrom) / (CORNER.turnTo - CORNER.turnFrom));
  const direction = new THREE.Vector2(-t, -(1 - t));
  const length = direction.length();
  if (length <= 1e-4) return new THREE.Vector2(0, -CORNER.speed);

  // How far round the turn this point is, peaking in the middle of the sweep
  // and zero at both ends — so the two straight strokes run at their stated
  // speed and only the bend itself is uneven.
  const turning = 4 * t * (1 - t);
  // And which side of the sweep it is on: the inside corner is slow water, the
  // outside is fast. Measured as distance from the concave corner, which is the
  // same quantity in both strokes and needs no case for the elbow.
  const radius = Math.hypot(x - CORNER_INSIDE.x, z - CORNER_INSIDE.z);
  const outward = Math.min(Math.max((radius - 0.6) / 2.6, 0), 1);
  const swing = 1 + turning * (outward - 0.5) * 2 * CORNER_SWING;

  return direction.multiplyScalar((CORNER.speed * swing) / length);
}

function cornerRace(): THREE.Object3D[] {
  const parts: THREE.Object3D[] = [];
  const [x0, x1] = CORNER.x;
  const [z0, z1] = CORNER.z;
  const height = APRON_Y - KERB_BOTTOM;

  // The ring, cut the same way the bank's is: X-running walls take the full
  // width including the corners, Z-running ones fit between them.
  const outerWest = x0 - RACE_WALL;
  const outerEast = x1 + CORNER_EAST;
  for (const z of [z0 - RACE_WALL / 2, z1 + RACE_WALL / 2]) {
    parts.push(
      markCollidable(
        block(
          STONE,
          outerEast - outerWest,
          height,
          RACE_WALL,
          (outerWest + outerEast) / 2,
          KERB_BOTTOM,
          z,
        ),
      ),
    );
  }
  for (const [x, thick] of [
    [x0 - RACE_WALL / 2, RACE_WALL],
    [x1 + CORNER_EAST / 2, CORNER_EAST],
  ] as const) {
    parts.push(markCollidable(block(STONE, thick, height, z1 - z0, x, KERB_BOTTOM, (z0 + z1) / 2)));
  }

  // **The inside of the L**, as solid masonry rather than as an absence. The
  // water plane covers the whole rectangle, so this block is what makes the
  // channel L-shaped: everything under it is behind opaque geometry and the
  // shader's own depth test throws it away.
  parts.push(
    markCollidable(
      block(
        STONE,
        CORNER.inX - x0,
        height,
        z1 - CORNER.outZ,
        (x0 + CORNER.inX) / 2,
        KERB_BOTTOM,
        (CORNER.outZ + z1) / 2,
      ),
    ),
  );

  parts.push(
    slab('corner', CORNER.x, CORNER.z, 1.2, 1.2, (x) =>
      // Shelving up at the far end of the outbound stroke, so this race has a
      // tail and a way out of it like the straight ones.
      CORNER.deep + (TAIL_Y - CORNER.deep) * ease((x0 + RACE_TAIL - x) / RACE_TAIL),
    ),
  );

  parts.push(
    waterPlane({
      width: x1 - x0 + 0.6,
      depth: z1 - z0 + 0.6,
      at: new THREE.Vector3((x0 + x1) / 2, 0, (z0 + z1) / 2),
      // Low, and lower than the straight races. Wave phase is measured from the
      // world origin, so a direction changing by a few degrees between
      // neighbouring vertices changes the phase by whole radians and the trains
      // decorrelate through the elbow. The turn is carried by the streaklines
      // instead, which shear cleanly.
      chop: 0.22,
      flow: cornerFlow,
    }),
  );

  // A head over the closed upstream end, so the water reads as arriving from
  // somewhere rather than as leaking out of a wall.
  parts.push(
    markCollidable(
      block(
        STONE,
        x1 - CORNER.inX,
        0.85,
        RACE_WALL,
        (CORNER.inX + x1) / 2,
        APRON_Y,
        z1 + RACE_WALL / 2,
      ),
    ),
  );

  // Two posts down the inbound stroke and one in the elbow, so the turn has
  // something standing still in it to be read against.
  for (const [x, z] of [
    [-13.9, -20.6],
    [-14.7, -22.4],
    [-16.4, -24.6],
  ] as const) {
    parts.push(markCollidable(block(STONE, 0.34, 0.9, 0.34, x, CORNER.deep, z)));
  }

  // On the masonry inside the L, which is where you stand to watch the turn.
  const post = signPost('corner');
  post.position.set(-18.2, APRON_Y, -21.4);
  parts.push(post);

  return parts;
}

/** Where a pool's water sound comes from: the middle of it, at the surface. */
function poolCentre(pool: Pool): [number, number, number] {
  return [(pool.x[0] + pool.x[1]) / 2, 0.15, (pool.z[0] + pool.z[1]) / 2];
}

/**
 * Four sources, one per pool, every one standing on something you can see.
 * Reach is short and rolloff steep: four continuous sources in one open room
 * otherwise build a wash they all disappear into, and walking up to a pool
 * should be what makes it audible.
 */
const WATER_SOUND: SoundscapeSpec = {
  emitters: [
    ...POOLS.map((pool) => ({
      model: 'water' as const,
      id: `pool-${pool.name}`,
      at: poolCentre(pool),
      options: {
        flow: pool.flow,
        // Scaled with the chop, so the pool that looks calmest sounds calmest.
        // The still pool runs at almost nothing, which is the cistern's whole
        // character — mostly silence, and the silence is the point.
        rate: 0.2 + pool.chop * 0.6,
        gain: 0.2 + pool.chop * 0.2,
      },
      refDistance: 3,
      maxDistance: 26,
      rolloff: 1.6,
      reverb: 0.25,
    })),
    // Two for the races, not six. One source per channel would be five
    // running-water models within a few metres of each other, which the ear
    // resolves as one wash. A bank of channels is a thing that makes a noise;
    // the corner is another.
    {
      model: 'water' as const,
      id: 'races',
      at: [-8, 0.2, -11.7] as [number, number, number],
      options: { flow: 'stream' as const, rate: 0.75, gain: 0.34 },
      refDistance: 4,
      maxDistance: 24,
      rolloff: 1.5,
      reverb: 0.25,
    },
    {
      model: 'water' as const,
      id: 'corner',
      at: [-16.5, 0.2, -23] as [number, number, number],
      options: { flow: 'brook' as const, rate: 0.6, gain: 0.3 },
      refDistance: 3,
      maxDistance: 20,
      rolloff: 1.6,
      reverb: 0.3,
    },
  ],
};

export function waterShowcaseZone(): ZoneDefinition {
  return {
    id: ZONE_WATER_SHOWCASE,
    name: 'Water Showcase',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // Opened well out compared with a gallery's. The still pool is
      // twenty-six metres long and the whole station is about seeing its far
      // end from the jetty; fog closing at fifty would put the reflection this
      // room exists to judge inside the haze.
      fogNear: 45,
      fogFar: 115,
      ambientGround: 0x8d9aa0,
      // Timber underfoot. The whole walkable surface of this zone is the jetty
      // and the rims, and the jetty is what you are on when it matters.
      surface: 'wood',
      room: 'open',
      soundscape: WATER_SOUND,
    },
    // On the jetty, looking down it. Only reached on a fresh boot into this
    // zone, which the game never does — but stepping into open air is a worse
    // default than most.
    spawn: { position: new THREE.Vector3(0, DECK_Y + 0.1, DOOR_Z - 2), yaw: 0 },
    floor: -20,
    // Flat, and at deck height rather than at zero: everything a portal arrival
    // can land on in this zone is the jetty. The beds are below it and are
    // waded to, never arrived on.
    groundAt: () => DECK_Y,
    build() {
      const root = new THREE.Group();

      for (const part of jetty()) root.add(part);
      // The verge across the head of the still pool. `kerbs` widens the two
      // sides a pool can face the jetty across; this one faces it end-on, and
      // one block is cheaper than a fourth case in there.
      root.add(
        markCollidable(
          block(
            STONE,
            22 + KERB * 2,
            DECK_Y - KERB_BOTTOM,
            JETTY_GAP,
            0,
            KERB_BOTTOM,
            DECK_TO - JETTY_GAP / 2,
          ),
        ),
      );

      // No widened platform at the end. The jetty is already five metres wide
      // where it ends, which is a viewing platform; a wider one has nowhere to
      // go that is not somebody else's water.

      for (const pool of POOLS) {
        root.add(bedSlab(pool));
        for (const wall of kerbs(pool)) root.add(wall);

        const rect = waterRect(pool);
        root.add(
          waterPlane({
            width: rect.x[1] - rect.x[0],
            depth: rect.z[1] - rect.z[0],
            at: new THREE.Vector3(
              (rect.x[0] + rect.x[1]) / 2,
              0,
              (rect.z[0] + rect.z[1]) / 2,
            ),
            chop: poolChop(pool),
            // Only the beach sets one, to aim its swell at the sand. Everything
            // else answers the wind, like a pond; the races west of the jetty
            // are where a surface that is actually going somewhere is judged.
            flow: pool.drift,
          }),
        );

        const post = signPost(pool.name);
        post.position.set(pool.sign[0], DECK_Y, pool.sign[1]);
        root.add(post);
      }

      // --- beach: something for the surf to run past ------------------------
      // Just offshore of where the bed crosses the surface, so the swell breaks
      // around them on its way in and the taper has a landmark to be read
      // against.
      for (const [i, x, z] of [
        [0, -7.6, 12.1],
        [1, -6.3, 16.4],
      ] as const) {
        root.add(boulder(7910 + i * 53, x, z, 0.5));
      }

      // --- rocks: an irregular waterline ------------------------------------
      // Tops spread either side of the surface. A boulder wholly submerged and
      // one standing clear are different problems for the foam, and the pool
      // has to contain both or it is only testing one of them.
      const rockSpots: readonly [number, number, number][] = [
        [-5.5, 5.6, 0.55],
        [-8.2, 3.1, -0.3],
        [-6.9, 0.2, 0.15],
        [-11.4, 4.4, 0.7],
        [-10.1, -1.8, -0.12],
        [-13.2, 1.2, 0.35],
        [-4.4, -3.2, -0.25],
      ];
      rockSpots.forEach(([x, z, top], i) => root.add(boulder(7710 + i * 31, x, z, top)));

      // --- chop: something for the waves to break against -------------------
      for (const [i, x, z] of [
        [0, 6.5, 6.2],
        [1, 10.8, 3.4],
        [2, 13.6, 6.8],
      ] as const) {
        root.add(piling(x, z, 2.6 + i * 0.3, -2.2));
      }

      // --- shore: a few stones at the waterline ------------------------------
      // Placed where the ramp crosses the surface, so the foam has edges to
      // wrap rather than one clean contour all the way across.
      for (const [i, x, z] of [
        [0, 12.4, -5.5],
        [1, 13.9, -9.8],
        [2, 11.6, -13.4],
      ] as const) {
        root.add(boulder(7810 + i * 41, x, z, 0.45));
      }

      // --- still: something to see in the mirror ----------------------------
      // Down the far end, because that is where the fresnel is. Standing at the
      // head of the pool you are looking at eighty-five degrees of incidence
      // by the time your eye reaches these, which is where water is a mirror.
      for (const [x, z, height] of [
        [-4.2, -26, 4.6],
        [-3.6, -33.5, 3.8],
        [4.8, -29, 5.2],
        [5.4, -36.5, 4.2],
        [-0.4, -39.5, 3.4],
      ] as const) {
        root.add(piling(x, z, height, -2));
      }
      // A stack, so there is something with a silhouette rather than five sticks.
      root.add(markCollidable(block(STONE, 3.4, 1.5, 3.2, 6.4, -2, -41)));
      root.add(markCollidable(block(STONE, 2.6, 1.6, 2.4, 6.1, -0.5, -41.4)));
      root.add(markCollidable(block(STONE, 1.7, 1.4, 1.6, 6.6, 1.1, -40.7)));

      // --- the races ---------------------------------------------------------
      for (const part of raceBank()) root.add(part);
      for (const part of cornerRace()) root.add(part);

      return root;
    },
  };
}

/** The showcase end of a portal, for whoever stands a door here. */
export function waterShowcaseDoor(): PortalEnd {
  return {
    zone: ZONE_WATER_SHOWCASE,
    // On the jetty rather than at y = 0, so the door stands on the boards
    // instead of being sunk 40 cm into them. The arrival is derived from this
    // and settled onto `groundAt`, which agrees.
    position: new THREE.Vector3(0, DECK_Y, DOOR_Z),
    // Faces -Z, into the room, which puts the arrival on its near side looking
    // down the jetty — the same reasoning `galleryDoor` gives.
    yaw: Math.PI,
    material: 'timber',
    seed: 6701,
  };
}

export function waterShowcasePortal(hub: PortalEnd): PortalDefinition {
  return { id: `portal:${ZONE_WATER_SHOWCASE}`, a: hub, b: waterShowcaseDoor() };
}
