import * as THREE from 'three';
import {
  OUTDOOR_ENVIRONMENT,
  type ZoneDefinition,
  type ZoneEnvironment,
  type ZoneId,
  type ZoneGroup,
} from '../../world/Zone';
import { SILENCE, type SoundscapeSpec } from '../../audio/Soundscape';
import type { PortalDefinition, PortalEnd } from '../../world/Portal';
import type { DoorMaterial } from '../../audio/models/door';
import type { MeshBuilder } from '../../art/types';
import type { FogVolume } from '../../engine/FogVolumes';
import type { GlitchPlacement } from '../../engine/Glitch';
import type { HorrorPlacement } from '../../engine/Horror';
import { markCollidable } from '../../player/Collider';
import { markLabelled } from '../../world/Interaction';
import { createRng } from '../../art/random';
import { assemble, finish } from '../../art/assemble';
import { writing, textSeed } from '../../art/writing';
import { DEFAULT_TUNING } from '../../player/Controller';
import { flatGround, GRID_TILE } from '../../world/floor';

/**
 * Galleries: one room per kind of thing, so the kit can be judged a family at
 * a time.
 *
 * The Proving Ground grew an object gallery it was never meant to hold. It was
 * built as a movement and acoustics rig, and it has been widened three times to
 * make room for rows of props that have nothing to do with either — by the end
 * the rows ran past ninety metres and the far end of them was standing on
 * nothing. Worse, walking to the thing you wanted to look at meant walking
 * through the movement gym, and two fixtures that crowd each other get tested
 * together whether or not that was the intention.
 *
 * So each family gets a room. A gallery is a flat floor, a grid to judge scale
 * against, a rank of rows, and a door home. It is a dev room and looks like one
 * — no ground cover, no landforms, no terrain system in any form.
 *
 * **Galleries are silent.** They were briefly not: each had emitters sited on
 * its own rows, on the theory that a sound is judged next to the thing making
 * it. That is true in the *world* and false in here — eight copies of a builder
 * standing in a line is not a place, so a sound coming out of one of them has
 * nothing to be judged against, and four animals calling over a rank of rows is
 * just noise over the thing you came to look at. The objects these rooms exist
 * to provide get their emitters where they are actually placed.
 *
 * ## Why builders are imported rather than read from the registry
 *
 * `art/registry` uses `import.meta.glob` and so only exists under Vite, but the
 * headless world check reaches zone definitions through esbuild — and a gallery
 * that the check cannot see is a gallery whose portals nobody verifies. Each
 * gallery lists its builders explicitly, which costs an import line and buys
 * the check. It also means a gallery is a *statement about what belongs
 * together*, which a glob cannot make.
 *
 * The cost is that a new builder does not appear by itself, the way it did in
 * the old registry-driven gallery. `check:art` fails on any builder that is in
 * no gallery, so the omission is caught rather than discovered.
 */

/**
 * Seeds per builder.
 *
 * Eight, carried over from the old gallery and for its reason: four is enough
 * to prove a builder varies at all, and not enough to see *how* — whether the
 * spread is even or clusters on one shape, and whether a rare variant shows up
 * at the rate it was meant to. Rare things are invisible in small samples,
 * which is exactly when a wrong probability goes unnoticed.
 */
const INSTANCES = 8;
/** Gap between instances of the same builder, beyond their own radius. */
const PADDING = 1.4;
/** Rows run along -Z at this spacing. A multiple of the grid tile, so they land on lines. */
const DEPTH = GRID_TILE;
/**
 * Where the door stands, well back from the near end of the rank.
 *
 * Two things it has to get right, both learned by getting them wrong.
 *
 * **Distance.** At seven metres the arrival stood almost inside the first row,
 * so the near instances filled the view and the far end of the rank was hidden
 * behind them. A gallery is for comparing a row *along its length*, which means
 * arriving far enough back to see the length.
 *
 * **Facing.** A portal arrival is always in front of its door facing *away*
 * from it, so a door facing +Z puts your back to a rank that runs toward -Z —
 * you arrive looking out at empty floor. The door therefore faces -Z, into the
 * room, which puts the arrival on its near side looking down the rows.
 */
const DOOR_Z = 16;

const SIGN_POST = new THREE.MeshLambertMaterial({ color: 0x3a3228, flatShading: true });
const SIGN_BOARD = new THREE.MeshLambertMaterial({ color: 0xb9ad92, flatShading: true });

/**
 * Marks on a board that read as writing without being any.
 *
 * The marks themselves are `art/writing` now, shared with whatever else in the
 * kit has words on it that nobody is meant to read. This is only the sign's own
 * decision about how much text a caption plank carries — a couple of rows, and
 * the third about half the time.
 *
 * Why a plank rather than real lettering: `art/lettering` earns its keep at
 * sign scale and these boards are caption scale, so a name on a 26 cm plank
 * would have to be read from a metre away, which is exactly the reach at which
 * the tooltip already does it better. But a blank board is furniture — nobody
 * walks up to a plank to see what it says.
 */
function scribble(name: string, width: number, height: number): THREE.Mesh {
  const rng = createRng(textSeed(name));
  const marks = writing(width, height, rng, {
    lines: 2 + (rng.chance(0.45) ? 1 : 0),
    color: 0x2b2620,
  });
  return finish(assemble(marks), 'writing', 0);
}

/**
 * A marker post at the head of a row, carrying the row's name as a tooltip.
 *
 * It was a plinth — a 12 cm slab on the floor — and a slab on the floor is not
 * a sign. You had to already know the rows apart to know what it was marking,
 * which is the opposite of the job. This stands at eye height with a board on
 * it, so it reads as a label from down the rank rather than from directly
 * above it.
 *
 * The board is blank on purpose — see `scribble` for why caption-scale text
 * stays in the tooltip even now that `art/lettering` exists. The board says
 * what a sign *is* and the tooltip says what it *reads* — walk within reach
 * and the name appears over the crosshair, exactly as a door's does.
 *
 * Exported because the sound stage labels its stations the same way, and a
 * second implementation of "a post with a caption on it" would drift from this
 * one within a phase.
 */
export function signPost(name: string, display?: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `sign:${name}`;

  // Waist high, at about half eye height.
  //
  // It was matched to the eye on the reasoning that a sign should land on the
  // horizon, and that is right for a sign you read *instead of* looking at
  // something. This one is a caption on the row behind it, so a board at eye
  // level stands directly in front of the thing it is naming — you have to walk
  // round your own label. Dropped to the waist it is still an obvious marker
  // from down the rank, still well within the interaction ray, and no longer in
  // the way of the object.
  const height = DEFAULT_TUNING.eyeHeight * 0.68;
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, height, 0.09), SIGN_POST);
  post.position.y = height / 2;
  group.add(post);

  // Raked back a few degrees so it catches the light differently from the
  // posts and the floor. A board dead vertical in a scene lit from above is
  // the darkest thing in view and disappears into its own post.
  //
  // A group rather than a mesh, so the writing tilts with the plank it is
  // painted on — marks positioned in world space would slide off the face.
  const boardW = 0.62;
  const boardH = 0.26;
  const board = new THREE.Group();
  board.position.set(0, height - 0.1, 0.045);
  board.rotation.x = -0.16;

  const plank = new THREE.Mesh(new THREE.BoxGeometry(boardW, boardH, 0.05), SIGN_BOARD);
  board.add(plank);
  // Proud of the front face by a hair. Coplanar would z-fight, and at this
  // size the offset is invisible from anywhere you can see the sign at all.
  const marks = scribble(name, boardW, boardH);
  marks.position.z = 0.026;
  board.add(marks);
  group.add(board);

  // A cap, so the post does not end in a cut end.
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.05, 0.13), SIGN_POST);
  cap.position.y = height + 0.02;
  group.add(cap);

  // Labelled on the group: the interaction raycast reports whichever child it
  // hit, and `labelOf` walks up to find this.
  //
  // The board and the tooltip are allowed to disagree, and for a few props they
  // should. The board is the catalogue and teaches the identifier, which is the
  // point of a gallery. The tooltip is the game speaking to the player, and it
  // uses the player's word for the thing. See `display` on `MeshBuilder`.
  return markLabelled(group, display ?? signName(name));
}

/**
 * A builder's name as it goes on a sign.
 *
 * The builder names are lowercase identifiers — `bovine`, `small-tree` — and
 * they are the right words. They are what the content data will refer to these
 * by, so a sign showing anything else would be teaching a name that is not the
 * name. Capitalised, hyphens opened out to spaces, and that is all.
 */
function signName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface GalleryPlan {
  readonly id: ZoneId;
  /** What the door's tooltip says. */
  readonly name: string;
  /**
   * Which family the room belongs to — the same three the halls are split into.
   *
   * Stated here rather than derived from which hall `propPortals` happens to
   * hang the door in. That placement is a fact about reachability; this is a
   * fact about kind, and a gallery that moved doors would otherwise silently
   * change what it *is*.
   */
  readonly group?: ZoneGroup;
  readonly builders: readonly MeshBuilder[];
  /**
   * How far apart the instances in a row stand, along -Z.
   *
   * One grid tile unless a gallery says otherwise, which is right for anything
   * you can stand beside and wrong for a room full of buildings — a barn is
   * fourteen metres long, so eight of them four metres apart is one barn.
   * `columns` already spaces the *rows* by what the builders need; this is the
   * same argument in the other axis, and it only has to be said where the rank
   * is made of things bigger than the grid.
   */
  readonly spacing?: number;
  /**
   * What the door home is made of — and therefore which builder makes it and
   * how it sounds. Timber unless the gallery says otherwise; the industrial
   * rooms say `iron`, because a hut door standing inside a works gallery is
   * the kit contradicting itself at its own front door.
   */
  readonly door?: DoorMaterial;
  /** What the room sounds like. Silent unless it has something in it that makes noise. */
  readonly soundscape?: SoundscapeSpec;
  /** Anything not built from a builder — a fixture the gallery needs to make sense. */
  readonly extras?: () => THREE.Object3D[];
  /**
   * Placed fog volumes (SHADERS-AND-MATERIALS.md §2), in the gallery's own space.
   *
   * Here rather than only on the Fog gallery, because a gallery is a room and
   * any room may want air in it — and threading it through the plan means the
   * one place that turns a plan into a zone stays the one place that knows how.
   */
  readonly fogVolumes?: readonly FogVolume[];
  /**
   * Placed glitch volumes (GLITCH-SHADERS.md), in the gallery's own space —
   * `fogVolumes`' thread, for its reason: the one place that turns a plan
   * into a zone stays the one place that knows how.
   */
  readonly glitches?: readonly GlitchPlacement[];
  /** Placed horror volumes (HORROR-SHADERS.md) — `glitches`' thread exactly. */
  readonly horrors?: readonly HorrorPlacement[];
  /**
   * Overrides on the room's light and air. Applied last, so a gallery can put
   * out the sun — which is the only way to judge anything that emits.
   */
  readonly environment?: Partial<ZoneEnvironment>;
}

/**
 * Total width of a rank of rows, and where each row starts.
 *
 * Laid out by accumulating radii rather than on a fixed grid, so a hut and a
 * tuft of grass each get the room they need and no more. Centred afterwards, so
 * the door in the middle of the south edge looks down the middle of the rank
 * rather than at one end of it.
 */
function columns(builders: readonly MeshBuilder[]): { offsets: number[]; width: number } {
  const offsets: number[] = [];
  let x = 0;
  for (let i = 0; i < builders.length; i++) {
    offsets.push(x);
    const next = builders[i + 1];
    // The gap to the *next* row has to clear both radii. Spacing from only the
    // current builder's radius leaves a three-metre hut standing on top of the
    // grass beside it — which is exactly what the old gallery did.
    if (next) x += builders[i].radius + next.radius + PADDING;
  }
  return { offsets, width: x };
}

/**
 * Where one instance in one row actually stands.
 *
 * Exported because **placement runs object → sound, never the reverse.** A
 * gallery that wants an emitter on its third tree asks for the third tree; it
 * does not hardcode a coordinate that the next builder added to the rank will
 * silently invalidate. The rank is laid out by accumulating radii, so every
 * position in it moves when anything before it changes width.
 */
export function rowPosition(
  builders: readonly MeshBuilder[],
  name: string,
  instance = 0,
  height = 0,
  spacing = DEPTH,
): [number, number, number] {
  const index = builders.findIndex((builder) => builder.name === name);
  if (index === -1) throw new Error(`no '${name}' row in this gallery`);
  const { offsets, width } = columns(builders);
  return [-width / 2 + offsets[index], height, -instance * spacing];
}

/** Lays out one gallery's rows about the origin. */
export function galleryRows(builders: readonly MeshBuilder[], spacing = DEPTH): THREE.Group {
  const rank = new THREE.Group();
  rank.name = 'rows';

  const { offsets, width } = columns(builders);
  const start = -width / 2;

  for (let index = 0; index < builders.length; index++) {
    const builder = builders[index];
    const x = start + offsets[index];

    const row = new THREE.Group();
    row.name = `row:${builder.name}`;

    // A sign at the near end of each row, facing back toward the door — and
    // clear of the row's own first instance. A grid tile is right for a stool
    // and puts the post inside a barn, which is how the sign for the row you
    // most wanted to identify became the one you could not read.
    const sign = signPost(builder.name, builder.display);
    sign.position.set(x, 0, Math.max(DEPTH, builder.radius + 1.6));
    // Not collidable. A rank of sixteen posts you can walk into turns browsing
    // a gallery into an obstacle course, and there is nothing to be gained by
    // being stopped by a caption.
    row.add(sign);

    for (let i = 0; i < (builder.variants ?? INSTANCES); i++) {
      // Seeds spaced widely: adjacent integers through a good hash are as
      // unrelated as distant ones, but wide spacing makes that obvious to
      // anyone reading the numbers.
      const mesh = builder.build({ seed: 1000 + i * 7919 });
      mesh.position.set(x, 0, -i * spacing);
      // A living row mills about its own spots rather than wandering off
      // across the rank — the room is for comparing them side by side.
      const life = mesh.userData.life as { roam: number } | undefined;
      if (life) life.roam = Math.min(life.roam, 1.2);
      // Per builder, not per gallery: grass and the like are meant to be walked
      // through, and marking the whole group solid would override that.
      row.add(builder.solid === false ? mesh : markCollidable(mesh));
    }

    rank.add(row);
  }

  return rank;
}

/**
 * How wide a gallery's floor has to be, and how far you can see across it.
 *
 * Sized to the rank and then **clamped**, which the first version did not do —
 * it took the outdoor `fogFar` of 140 m as a lower bound and built a 280 m
 * floor for every gallery, on the reasoning that a flat quad is free. It is
 * free to draw and it is not free to collide with: see `world/floor.ts`, where
 * indexing four floors that size exhausted the heap.
 *
 * So the floor is only as big as it has to be, and the fog is pulled in to
 * match rather than the other way round. The two numbers have to move together
 * — a floor smaller than the view distance shows its own edge, which is worse
 * than either problem separately.
 */
function floorSize(builders: readonly MeshBuilder[], spacing = DEPTH): number {
  const { width } = columns(builders);
  // The rank plus room to stand back from it. The deepest thing to see is the
  // far end of the longest row.
  const deepest = Math.max(...builders.map((builder) => builder.variants ?? INSTANCES));
  const span = Math.max(width, DOOR_Z + deepest * spacing) + 40;
  return Math.min(200, Math.max(120, Math.ceil(span / 20) * 20));
}

/** Where the fog closes, given a floor. Inside its half-width, so no edge shows. */
function viewDistance(size: number): number {
  return size * 0.46;
}

/** The door home, at the south edge of the rank facing out of the room. */
export function galleryDoor(plan: GalleryPlan): PortalEnd {
  return {
    zone: plan.id,
    position: new THREE.Vector3(0, 0, DOOR_Z),
    // Faces -Z, into the room. See `DOOR_Z` — this is what puts the rank in
    // front of you on arrival rather than behind you.
    yaw: Math.PI,
    material: plan.door ?? 'timber',
    // Derived from the id so two galleries never share a door, and so a door
    // does not change when a gallery is added beside it. Folded from the
    // characters rather than the length, which collided the moment the village
    // split into interior and exterior — two ids of exactly equal length.
    seed: 3300 + doorSalt(plan.id),
  };
}

/** A small stable hash of a gallery id, for seeding its door. */
function doorSalt(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 7919;
  return hash;
}

export function galleryZone(plan: GalleryPlan): ZoneDefinition {
  return {
    id: plan.id,
    name: plan.name,
    group: plan.group,
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      // A gallery is a void with a floor in it, and the fog is what makes that
      // read as air rather than as a missing skybox. Derived from the floor
      // rather than chosen, so the edge of the world is always hidden however
      // wide the rank has grown.
      fogNear: viewDistance(floorSize(plan.builders, plan.spacing)) * 0.45,
      fogFar: viewDistance(floorSize(plan.builders, plan.spacing)),
      // The floor is pale, so the bounce off it is too. The shared outdoor
      // default is the old dark ground colour and would leave every underside
      // reading as dirt.
      ambientGround: 0xbfb298,
      surface: 'stone',
      room: 'open',
      soundscape: plan.soundscape ?? SILENCE,
      ...plan.environment,
    },
    // Only reached on a fresh boot into a gallery, which the game never does —
    // but it has to exist, and just inside the door looking down the rank is
    // the least surprising place for it to be. Yaw 0 faces -Z: the controller's
    // forward is `(-sin yaw, 0, -cos yaw)`, so zero looks the way the rows run.
    spawn: { position: new THREE.Vector3(0, 0.1, DOOR_Z - 2), yaw: 0 },
    fogVolumes: plan.fogVolumes,
    glitches: plan.glitches,
    horrors: plan.horrors,
    floor: -20,
    // Flat by construction. Portal arrivals are derived by stepping out from a
    // door and keep the door's height, which is correct here and stated anyway
    // so nothing has to infer it.
    groundAt: () => 0,
    build() {
      const root = new THREE.Group();
      root.add(flatGround(floorSize(plan.builders, plan.spacing)));
      root.add(galleryRows(plan.builders, plan.spacing));

      for (const extra of plan.extras?.() ?? []) root.add(extra);
      return root;
    },
  };
}

/**
 * The portal joining a gallery to wherever its door stands in the hub.
 *
 * The hub end is passed in rather than derived, because where the rank of doors
 * stands is the hub's business — a gallery knows what is in it and nothing
 * about the world outside its own door.
 */
export function galleryPortal(plan: GalleryPlan, hub: PortalEnd): PortalDefinition {
  return { id: `portal:${plan.id}`, a: hub, b: galleryDoor(plan) };
}
