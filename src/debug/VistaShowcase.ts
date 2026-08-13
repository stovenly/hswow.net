import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '../world/Zone';
import { SILENCE } from '../audio/Soundscape';
import { Terrain, type Landform } from '../world/terrain';
import { Skirt } from '../world/vista';
import { markCollidable } from '../player/Collider';
import { markVista } from '../art/vista';
import { signPost } from './galleries/layout';
import type { PortalEnd, PortalDefinition } from '../world/Portal';
import { vistaHill } from '../art/builders/vista-hill';
import { vistaCrag } from '../art/builders/vista-crag';
import { vistaForest } from '../art/builders/vista-forest';
import { vistaCopse } from '../art/builders/vista-copse';
import { vistaHamlet } from '../art/builders/vista-hamlet';
import { vistaTower } from '../art/builders/vista-tower';
import { vistaFieldWall } from '../art/builders/vista-field-wall';
import { vistaRing } from '../world/vista-ring';
import { edgeDressing } from '../world/dressing';
// Band 1 is ordinary props at ordinary scale — the kit's own, not the vista
// family's.
import { bush } from '../art/builders/bush';
import { gorse } from '../art/builders/gorse';
import { bramble } from '../art/builders/bramble';
import { hazel } from '../art/builders/hazel';
import { rock } from '../art/builders/rock';

/**
 * The Vista Showcase: flat ground, an invisible boundary, and the world past it.
 *
 * **There is no rim, and that is the whole point of the room.** A wall of hills
 * high enough to turn the player back is also high enough to stand between them
 * and everything the band exists to show — at eye height a 10 m rim 30 m away
 * eats twenty degrees of the horizon, which is most of it. The vista band exists
 * so the edge of the world can be a *view* instead of a wall, so the boundary
 * here is an invisible plane and the ground stays flat right up to it.
 *
 * ## The field is much bigger than the part you can walk on
 *
 * Ground cover has to thin to nothing before the level's mesh gives out, or the
 * grass ends in a line that draws the exact shape of the playable area. That
 * fade cannot happen anywhere the player can stand, and it cannot happen just
 * past the wall either — on flat open ground it reads as one field changing
 * colour whether you can walk into it or not. So the terrain runs a long way
 * past the boundary and the whole of that margin is fade: full density
 * everywhere reachable, and the transition eighteen metres out, where distance
 * and the band 1 dressing do most of the hiding.
 *
 * Everything below is derived from two numbers — how far you can walk, and how
 * much ground there is beyond that to fade across.
 *
 * ## Three things to look at
 *
 * - **The judged lane**, due north from the arrival: `vista-hill` at 60, 110 and
 *   165 m, the three ranges the spec asks for, measured from where you land.
 *   Same builder at all three, so distance is the only variable.
 * - **The raw bay**, a few paces east and inside `fogNear`: the same hill at a
 *   quarter scale with no fog on it at all. Shape is scale invariant, so a
 *   silhouette that reads wrong out there gets taken apart here. Judge the fault
 *   here, never the look.
 * - **The ring** everywhere else — the whole roster, scattered through the band
 *   by `vistaRing` and merged into a handful of draws. Past the honest band are
 *   two *parallax tiers*, sliding with the camera at half and three quarters of
 *   its travel, so what is left over reads as two and four times their real
 *   distance. Walk a straight line and watch them move against each other and
 *   against the still band in front; `freeze parallax` in the `?debug` panel
 *   puts them back where they were built, for comparison.
 * - **The skyline** past all of it, which is not geometry — see `skyRidge` on
 *   the environment below. It is the same parallax mechanism at k = 1.
 *
 * Fog runs 30 → 240 — see `FOG_FAR`, which is this room's own number and not
 * the countryside's. Silent, like the galleries.
 */

export const ZONE_VISTA_SHOWCASE = 'vista-showcase';

/**
 * How far from the middle the player can actually walk. The wall stands here.
 *
 * Eighty metres across. It was forty-eight, which the wall visualiser made
 * obvious was far too tight — a room for judging a view wants enough ground
 * that walking across it is a real change of viewpoint, and the parallax tier
 * has nothing to work with if the camera barely moves.
 */
const PLAY_HALF = 40;

/**
 * Ground beyond the wall, every metre of which is cover fade.
 *
 * The whole margin rather than a band inside it: there is no reason to keep
 * full-density grass somewhere nobody can reach, and starting the ramp at the
 * wall puts its steepest part — the only part that reads as a change — as far
 * out as the margin allows.
 */
const MARGIN = 36;

const HALF = PLAY_HALF + MARGIN;
const SIZE = HALF * 2;
/**
 * Coarser than the 2 m it was, because the field is now more than twice as
 * wide and nearly all of the extra is ground nobody stands on. The landforms
 * here are shallow enough that 3 m facets are invisible underfoot.
 */
const RESOLUTION = 3;

/** The boundary: an invisible wall, not terrain. */
const WALL = { height: 2.4, thick: 0.5 };

/** Where the door home stands, at the north end of the walkable ground. */
const DOOR_Z = -PLAY_HALF + 10;
/**
 * Where you land, and the point every judged distance is measured from.
 *
 * A stride in front of the door, which faces north — so the arrival is already
 * looking down the lane, and the numbers on the sign are true from where you
 * are standing when you read it.
 */
const VIEW_Z = DOOR_Z - 1.2;

/**
 * The air, and this room's own numbers rather than the countryside's.
 *
 * It started at the countryside's 30 → 190, which was itself only ever a number
 * somebody had to pick. At 190 the outer tier sat at 80–95% fog — obeying the
 * rule that a moving layer belongs where its footings cannot be read, and so
 * nearly the horizon colour that there was nothing left to judge. Pulled out to
 * 240 the same tier lands around 60–70%: a hazy silhouette that still has a
 * shape, which is what the parallax question actually needs to be answerable.
 *
 * `fogNear` moved out too, and had to. At 30 m the haze started inside the
 * walkable ground — the far corner of an eighty-metre field is 113 m away, so a
 * third of the way to the fog's end before you have left the level at all, and
 * things you can walk up to were washing out. Ninety clears the whole of the
 * playable area with room to spare and still leaves 210 m of ramp for the band
 * to recede across.
 *
 * Both went out again when fog became radial. Measuring from the camera rather
 * than from the plane in front of it makes everything off the view axis further
 * away than it used to be — half again at the edge of the screen — so the same
 * numbers read considerably thicker than they did. See `engine/fog.ts`.
 *
 * Far below the 450 the sky dome and the far plane allow.
 */
const FOG_NEAR = 90;
const FOG_FAR = 300;

/**
 * The band, in metres out from the level's edge.
 *
 * Inner is well clear of the fifteen-odd metres of margin the player can see
 * across but not enter. Outer stops short of `fogFar` × 0.9 to leave the moving
 * tier room to slide without swimming through it — see `FRINGE`.
 */
const BAND = { inner: 15, outer: 82 };

/**
 * The moving tier: the fringe, and how much of the camera's travel it takes.
 *
 * Two rules pin both numbers, and neither is a matter of taste.
 *
 * **A moving tier cannot stand on still ground**, or its footings slide across
 * the skirt — so it lives well out, where there is little left to read a slide
 * against. Kept at the absolute distance it was at when the fog ended at 190,
 * which is the whole point of pulling the fog out: the tier did not move, the
 * haze in front of it thinned. Whether 60–70% is thin enough to expose the feet
 * is now something that can be looked at rather than assumed.
 *
 * **Slide budget must stay under tier separation, measured on the worst side.**
 * A tier translates rigidly, so walking to one end drags the whole ring that
 * way and the half you walked away from comes toward the level. The furthest
 * you can get from the middle is the corner of the walkable square, about 57 m,
 * so at `k` = 0.5 this tier slides 28 m — and the clearance it needs is that
 * plus the *extents* of the props in front, not the gap between the bands. A
 * `vista-forest` at 1.5 reaches 51 m past its own centre, so the honest band's
 * props reach 133 m out from a band that stops at 82.
 *
 * Working it out from the props rather than the bands: a tier-0 forest at 1.2
 * reaches 41 m past its centre from a band that stops at 82, so the honest ring
 * reaches 123. A tier-1 hill at 1.4 reaches 28 m back toward it. 123 + 28 of
 * that reach + 28 of slide + a margin puts the inner edge at 190.
 *
 * Forests are deliberately absent from this tier: at 34 m of radius they are
 * the widest thing in the kit, and a tier's clearance is mostly other people's
 * half-extents. Hills read as well and cost a third of the room.
 *
 * `vistaRing` recomputes all of this from what it actually placed and clamps
 * `k` if it does not hold, so an authored scale cannot quietly break it.
 *
 * Whether one moving tier is one too many, and whether 0.5 reads as distance or
 * as the world sliding, is the eyeball question. The freeze toggle in the
 * `?debug` panel is how to A/B it.
 */
const FRINGE = { k: 0.5, band: { inner: 190, outer: 212 } };

/**
 * **There is no second moving tier, and the arithmetic is why.**
 *
 * A rigid tier needs clearance equal to its own slide plus the reach of
 * everything in front of it, and both scale with the level. Working outward
 * from an eighty-metre walkable field: the honest band's props reach 133 m out,
 * so a `k` = 0.5 tier starts at 160 and its own props reach 229. A second tier
 * would then have to start past 250 — which at this fog is 295 m from the
 * arrival and therefore fully dissolved. It would be a layer nobody can see,
 * moving for nobody.
 *
 * That is not a limit of the machinery — `vistaRing` takes any number of tiers —
 * it is a fact about small levels. A zone with a longer walk has room for two;
 * this one has room for one, and one that can be seen beats two that cannot.
 */

/** The three ranges a vista prop is judged at, north of the arrival. */
const JUDGED = [60, 110, 165] as const;

/**
 * Ground you can see across.
 *
 * Broad and shallow, and all of it inside the walkable part — the margin is
 * left flat so nothing complicates the one thing it is there to do. Everything
 * here is walkable; what stops the player is the wall.
 */
const LANDFORMS: readonly Landform[] = [
  { kind: 'hill', at: [-22, 6], radius: 28, height: 1.6 },
  { kind: 'basin', at: [20, 14], radius: 22, depth: 1.2 },
  { kind: 'hill', at: [24, -18], radius: 22, height: 1.1 },
  { kind: 'hill', at: [-8, -24], radius: 20, height: 0.9 },
];

const terrain = new Terrain({
  size: SIZE,
  resolution: RESOLUTION,
  landforms: LANDFORMS,
  // Full density everywhere reachable, nothing at all by the time the mesh
  // ends. See `MARGIN` and `TerrainOptions.edgeFade`.
  edgeFade: { band: MARGIN },
});

/**
 * The ground the band stands on.
 *
 * Reaching `fogFar` rather than the band's outer edge: the last ring of
 * vertices has to sit where the fog has already taken it, or the edge of the
 * skirt is a rim of its own on the horizon. Its colour comes from the level's
 * own base material, so the two sides of the boundary are the same green.
 */
const skirt = new Skirt({
  terrain,
  // Measured out from the level's outline rather than from the origin, so a
  // level shaped like an S gets the same depth of country along its whole
  // length instead of a disc centred on nothing in particular.
  reach: FOG_FAR,
  // Coarser as the sheet got bigger. Pulling the fog out to 240 grew the skirt
  // by half again in each direction, and the far half of it is still fog.
  resolution: 11,
  collar: 8,
  apron: 24,
  // **Level with the ground you walk on, and not by omission.** Rolling country
  // outside the boundary reads as a low ridge, and a low ridge is exactly what
  // this room exists to do without: it stands in front of the band, and it
  // collects the whole fog gradient onto its crest where there is no screen
  // space to spend it. See `SkirtOptions.roll`.
  roll: 0,
  // Moot while `roll` is zero, and kept because it is the constraint any zone
  // that does roll has to respect: a moving tier slides across ground it was
  // never measured against, and rolling ground puts daylight under its feet.
  flatten: { from: BAND.outer, to: FRINGE.band.inner },
  seed: 7301,
});

const WALL_MATERIAL = new THREE.MeshBasicMaterial();

export function vistaShowcaseZone(): ZoneDefinition {
  return {
    id: ZONE_VISTA_SHOWCASE,
    name: 'Vista Showcase',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      fogNear: FOG_NEAR,
      fogFar: FOG_FAR,
      // Band 3: the land past where the fog has dissolved band 2, drawn in the
      // sky's own shader for no triangles at all. Low and hazy — anything with
      // a readable shape up here would compete with the geometry in front of it.
      skyRidge: {
        opacity: 1,
        height: 0.045,
        scale: 3.4,
        roughness: 0.5,
        tint: '#6c7f95',
        shade: 0.34,
        haze: 0.014,
        seed: 3307,
      },
      soundscape: SILENCE,
    },
    spawn: { position: onGround(0, VIEW_Z), yaw: Math.PI },
    floor: -20,
    surfaceAt: (x, z) => terrain.stepAt(x, z),
    // The level's own ground, never the skirt's. Nothing out there holds the
    // player up and nothing out there is meant to.
    groundAt: (x, z) => terrain.heightAt(x, z),
    build() {
      const root = new THREE.Group();
      root.add(markCollidable(terrain.build()));
      root.add(skirt.build());
      buildWalls(root);

      const lane = signPost(`vista-hill at ${JUDGED.join(', ')} m`);
      lane.position.copy(onGround(4.5, VIEW_Z - 2));
      root.add(lane);

      // --- the raw bay ------------------------------------------------------
      // The middle hill again, small enough to walk round and near enough that
      // no fog reaches it.
      const raw = vistaHill.build({ seed: 4131, scale: 0.25 });
      raw.position.copy(onGround(13, VIEW_Z + 1));
      root.add(markVista(raw));
      const bayLabel = signPost('the same hill, raw');
      bayLabel.position.copy(onGround(6, VIEW_Z + 1));
      root.add(bayLabel);

      root.add(buildRing());
      root.add(buildDressing());
      return root;
    },
  };
}

/**
 * The ring.
 *
 * The judged lane is hand-placed, because what you see from where you arrive is
 * authored; everything else is scattered so no bearing is empty. Both go through
 * the same placer, and the whole lot comes back as a handful of merged chunks.
 */
function buildRing(): THREE.Group {
  return vistaRing({
    skirt,
    seed: 9040,
    band: BAND,
    // Index 0 is the honest band and never moves. See `FRINGE`.
    tiers: [{ k: 0 }, { k: FRINGE.k }],
    // The corner of the walkable square, which is the furthest the ring can be
    // dragged. The placer clamps every tier's k against it.
    travel: Math.hypot(PLAY_HALF, PLAY_HALF),
    // Measured from the arrival rather than from the origin, so the sign in
    // front of you is telling the truth.
    place: [
      ...JUDGED.map((distance, i) => ({
        builder: vistaHill,
        at: [0, VIEW_Z - distance] as const,
        seed: 4100 + i * 31,
      })),
      // **The landmarks, by hand, and the spec is explicit that they must be.**
      // Scattering something with a count of one into a band thirty props have
      // already filled can only fail — and it did, silently, until the placer
      // started saying so. It is also the wrong shape: which bearing a landmark
      // sits on is composition, not luck.
      //
      // These two bearings are placeholders. Which places deserve an echo on
      // the horizon is a fiction decision, and yours.
      { builder: vistaTower, at: [86, -154] as const, scale: 1.35, seed: 5501 },
      { builder: vistaHamlet, at: [-77, -123] as const, scale: 1.15, seed: 5502 },
    ],
    scatter: [
      // Woodland first and most of it — a treeline is what fills a horizon, and
      // a band of bare hills reads as wallpaper.
      // Capped at 1.2: this is the widest thing in the ring, and every metre of
      // it is a metre the moving tier has to stand further back.
      { builder: vistaForest, count: 9, scale: [0.9, 1.2], spacing: 26 },
      { builder: vistaHill, count: 7, scale: [0.8, 1.4], spacing: 30 },
      // Copses between the woods and the near edge, where a treeline would
      // otherwise start out of nothing.
      {
        builder: vistaCopse,
        count: 6,
        band: { inner: BAND.inner, outer: 70 },
        scale: [0.9, 1.4],
        spacing: 20,
      },
      // Walls, because a landscape with no boundaries in it is scenery rather
      // than country. Kept near, where a two-metre line still resolves.
      {
        builder: vistaFieldWall,
        count: 5,
        band: { inner: BAND.inner, outer: 60 },
        scale: [0.9, 1.5],
        spacing: 30,
      },
      // Crags, for something that is not green.
      {
        builder: vistaCrag,
        count: 3,
        band: { inner: BAND.inner + 10, outer: 85 },
        scale: [1, 1.8],
        spacing: 34,
      },
      // Signs of people, one of each and no more. Both are landmarks, and the
      // point of a landmark is that there is one.
      {
        builder: vistaHamlet,
        count: 1,
        band: { inner: 30, outer: 70 },
        scale: [1, 1.3],
        spacing: 40,
      },
      {
        builder: vistaTower,
        count: 1,
        band: { inner: 40, outer: 85 },
        scale: [1, 1.5],
        spacing: 40,
      },
      // --- the moving tier ---------------------------------------------------
      // Masses only, and big ones. This far out the fog has taken everything but
      // value, so what is placed here has to be a suggestion of land rather than
      // a thing with a shape — and it stands on ground that has already gone.
      // Hills only, and modestly scaled. A prop's own reach is most of what a
      // tier's clearance has to cover — see `FRINGE`.
      {
        builder: vistaHill,
        tier: 1,
        count: 9,
        band: FRINGE.band,
        scale: [1.1, 1.4],
        spacing: 30,
      },
    ],
  });
}

/**
 * Band 1: what stands along the boundary.
 *
 * Straddling the wall, so half of it is stone you can walk up to and half is
 * scenery on the far side. It no longer has to hide the whole cover fade — the
 * margin does most of that by putting the fade a long way off — but it is still
 * what stops the boundary reading as a line on open ground.
 *
 * `-MARGIN` is where the wall is, in distance-from-the-outline terms.
 */
function buildDressing(): THREE.Group {
  return edgeDressing({
    terrain,
    skirt,
    seed: 6180,
    band: { inner: -MARGIN - 5, outer: -MARGIN + 18 },
    // The wall. Past it nothing can be reached, so nothing past it collides.
    solidWithin: -MARGIN,
    kinds: [
      // --- inside the wall: the detailed kit, walked past -------------------
      // Gorse and hazel are a couple of thousand triangles each, so they are
      // spent only where somebody can get close enough to see it.
      {
        builder: gorse,
        count: 4,
        band: { inner: -MARGIN - 4, outer: -MARGIN },
        clump: [2, 4],
        huddle: 3.2,
        scale: [0.9, 1.4],
      },
      {
        builder: bramble,
        count: 4,
        band: { inner: -MARGIN - 4, outer: -MARGIN + 1 },
        clump: [2, 4],
        huddle: 2.8,
        scale: [0.9, 1.3],
      },
      // A few real trees, standing where the copses out in the band take over —
      // the join the copse exists to cover, covered from this side as well.
      {
        builder: hazel,
        count: 2,
        band: { inner: -MARGIN - 5, outer: -MARGIN - 1 },
        clump: [1, 2],
        huddle: 4,
        scale: [0.9, 1.2],
      },
      // --- beyond it: cheap mass, never approached --------------------------
      // Bush is 78 triangles and rock is 55, so this is where the massing is
      // done.
      {
        builder: bush,
        count: 9,
        band: { inner: -MARGIN - 2, outer: -MARGIN + 16 },
        clump: [3, 6],
        huddle: 3,
        scale: [1, 1.7],
      },
      // Boulder runs, which read at a different height and stop the hedge line
      // from becoming a line of its own.
      {
        builder: rock,
        count: 8,
        band: { inner: -MARGIN - 3, outer: -MARGIN + 16 },
        clump: [3, 6],
        huddle: 2.6,
        scale: [1.2, 2.8],
      },
    ],
  });
}

/**
 * The boundary, as four slabs you cannot see.
 *
 * Standing at `PLAY_HALF`, which is where the cover fade begins — so the player
 * is kept out of the whole of it, and out of the margin where the skirt takes
 * over underneath.
 */
function buildWalls(root: THREE.Group): void {
  const at = PLAY_HALF;
  const span = at * 2 + WALL.thick;
  for (const [x, z, w, d] of [
    [0, -at, span, WALL.thick],
    [0, at, span, WALL.thick],
    [-at, 0, WALL.thick, span],
    [at, 0, WALL.thick, span],
  ] as const) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, WALL.height * 3, d), WALL_MATERIAL);
    // Tall and sunk, so it holds on the high ground and on the low without the
    // terrain having to be level under it.
    wall.position.set(x, WALL.height / 2, z);
    // Never drawn, always collided with — `art/builders/stair.ts` says why.
    wall.visible = false;
    root.add(markCollidable(wall));
  }
}

/** Drops a point onto the level's own ground. */
function onGround(x: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, terrain.heightAt(x, z), z);
}

/** The showcase end of a portal, for whoever stands a door here. */
export function vistaShowcaseDoor(): PortalEnd {
  return {
    zone: ZONE_VISTA_SHOWCASE,
    position: onGround(0, DOOR_Z),
    // Facing -Z, into the room, so the arrival looks straight down the judged
    // lane and out over the band.
    yaw: Math.PI,
    material: 'timber',
    seed: 6712,
  };
}

export function vistaShowcasePortal(hub: PortalEnd): PortalDefinition {
  return { id: `portal:${ZONE_VISTA_SHOWCASE}`, a: hub, b: vistaShowcaseDoor() };
}
