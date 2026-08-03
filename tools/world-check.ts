/**
 * Headless checks on zones and portals.
 *
 * `npm run check:world`
 *
 * Zone geometry is built without a GPU or a DOM, and the collider is plain
 * triangle maths, so nearly everything that makes a portal *work* can be
 * asserted here rather than found by walking into it.
 *
 * The failures this is looking for are the ones that are invisible until they
 * strand you:
 *
 * - **A one-way door.** Every portal has two ends and each must lead back to
 *   the other. A door you can walk through and not return from is unplayable
 *   and looks completely fine in the editor.
 * - **An arrival inside the scenery.** Teleporting into geometry means the
 *   collider ejects the player in whatever direction resolves first, which is
 *   often through a wall and occasionally into the void.
 * - **An arrival out of reach of its own door.** Landing somewhere you cannot
 *   use the door you are standing in front of is the other way to make a
 *   one-way trip, and it is much harder to spot because the door is *visible*.
 * - **An arrival with no floor under it.** The same stranding, one frame later.
 * - **A leaky interior.** A gap in a sealed room is a hole into a black void
 *   with no ground and no way back.
 * - **A leak across crossings.** Geometry, doors or collider triangles
 *   accumulating each time a threshold is crossed. This is the one that only
 *   shows up after twenty minutes of play, which is exactly why it is worth
 *   crossing sixty times here rather than trusting one.
 */
import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import { Collider } from '../src/player/Collider';
import { Zone } from '../src/world/Zone';
import { PortalGraph, arrivalFor, doorFacing, ARRIVAL_STANDOFF } from '../src/world/Portal';
import { residentZones, KEEP_WITHIN } from '../src/world/residency';
import { DEFAULT_REACH } from '../src/world/Interaction';
import { buildDoor, doorMetrics, doorName } from '../src/art/door';
import { markCollidable } from '../src/player/Collider';
import { createTestWorld, ZONE_EXTERIOR } from '../src/debug/zones';
import { ZONE_FOOTSTEPS_SHOWCASE } from '../src/debug/FootstepsShowcase';
import { GROUND } from '../src/world/ground';
import { SURFACES } from '../src/audio/models/footsteps';
import { ProvingGround } from '../src/debug/ProvingGround';
import { countrysideTerrain, ZONE_COUNTRYSIDE } from '../src/debug/countryside';
import { DEFAULT_TUNING } from '../src/player/Controller';
import { doorDuration, DOOR_SPECS, type DoorMaterial } from '../src/audio/models/door';

let failures = 0;

function check(name: string, ok: boolean, detail = ''): void {
  if (!ok) failures++;
  const mark = ok ? 'ok  ' : 'FAIL';
  console.log(`${mark} ${name}${detail ? ` — ${detail}` : ''}`);
}

/** Matches the controller's capsule: 0.35 m radius, 1.8 m tall. */
const RADIUS = 0.35;
const HEIGHT = 1.8;

/**
 * Triangles and meshes under a node, for comparing a zone with its own rebuild.
 *
 * Counted rather than hashed: two builds that agree on both numbers and differ
 * in vertex positions would be a seeded builder reading a moving value, which
 * `check:art` already covers from the other side. This is here to catch the
 * blunt failure — a zone that comes back with different *contents* — and a
 * count is enough to see it.
 */
function countGeometry(root: THREE.Object3D): { triangles: number; meshes: number } {
  let triangles = 0;
  let meshes = 0;
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    meshes++;
    const position = object.geometry.getAttribute('position');
    const index = object.geometry.getIndex();
    triangles += index ? index.count / 3 : (position?.count ?? 0) / 3;
  });
  return { triangles, meshes };
}

function capsuleAt(position: THREE.Vector3): Capsule {
  return new Capsule(
    new THREE.Vector3(position.x, position.y + RADIUS, position.z),
    new THREE.Vector3(position.x, position.y + HEIGHT - RADIUS, position.z),
    RADIUS,
  );
}

// ---------------------------------------------------------------------------
console.log('\n--- world ---------------------------------------------------\n');

const ground = new ProvingGround();
// No gallery: it reads `art/registry`, which is Vite-only.
const world = createTestWorld(ground);

const zones = new Map<string, Zone>();
for (const definition of world.zones) zones.set(definition.id, new Zone(definition));

const portals = new PortalGraph();
for (const portal of world.portals) {
  portals.add(portal, (id) => zones.get(id)?.name ?? id);
}

/**
 * Builds a zone and stands its doors in it, exactly as `ZoneManager.prepare`
 * does.
 *
 * A function rather than a loop body because the residency check releases zones
 * and walks back into them, and a rebuilt zone has to get its doors back — the
 * manager re-stands them by clearing `doored`, and a check that did not would be
 * comparing a zone against a doorless copy of itself and calling the difference
 * a drift. It is also the honest shape: doors belong to the manager, not to the
 * zone, so anything simulating the manager owes them.
 */
function standDoors(zone: Zone): THREE.Group {
  const root = zone.root();
  for (const side of portals.in(zone.id)) {
    // **Take down whatever is already standing there first.** The manager gets
    // this free from its `doored` set — it stands a zone's doors exactly once
    // per build. Here it has to be explicit, and without it re-standing a zone
    // that was never released leaves two doors in one doorway, which reads back
    // as a zone that grew seven meshes since the last time it was measured.
    if (side.door) {
      side.door.removeFromParent();
      side.door.geometry.dispose();
    }
    // Unbound as well, so a rebuild does not leave the previous door in the
    // graph's lookup table — the same leak `PortalGraph.unbind` exists for.
    portals.unbind(side);
    const mesh = buildDoor({ seed: side.end.seed ?? 1, material: side.end.material });
    mesh.position.copy(side.end.position);
    mesh.rotation.y = side.end.yaw;
    markCollidable(mesh);
    root.add(mesh);
    portals.bind(side, mesh, doorName(doorMetrics(mesh).material));
  }
  root.updateWorldMatrix(true, true);
  return root;
}

for (const zone of zones.values()) standDoors(zone);

// --- portals are two-way ---------------------------------------------------
{
  const sides = portals.all();
  const byPortal = new Map<string, number>();
  for (const side of sides) byPortal.set(side.portal, (byPortal.get(side.portal) ?? 0) + 1);

  const paired = [...byPortal.values()].every((count) => count === 2);
  const resolved = sides.every((side) => zones.has(side.end.zone) && zones.has(side.target.zone));
  // Both lines of the tooltip. A door with no type reads as "Door to
  // somewhere", which is the default and means the material never reached it.
  const labelled = sides.every((side) => side.label.length > 0 && side.title !== 'Door');
  const doored = sides.every((side) => side.door !== null);

  check(
    'every portal has two live ends',
    paired && resolved && labelled && doored,
    `${byPortal.size} portals, ${sides.length} sides`,
  );

  // Round trip: leaving by a door and coming back should return you to within
  // arm's length of where you started, not to a different part of the zone.
  let worstReturn = 0;
  for (const side of sides) {
    const back = portals
      .in(side.target.zone)
      .find((other) => other.portal === side.portal && other.end === side.target);
    if (!back) continue;
    // Going out through `side` lands you at its target's marker; coming back
    // through `back` should land you at *this* door's marker, which is where
    // you were standing when you used it.
    const returned = back.arrival.position;
    const expected = arrivalFor(side.end).position;
    worstReturn = Math.max(worstReturn, returned.distanceTo(expected));
  }
  check('a round trip returns where it started', worstReturn < 0.01, `worst drift ${worstReturn.toFixed(4)} m`);
}

// --- arrivals are usable ---------------------------------------------------
for (const zone of zones.values()) {
  const collider = new Collider();
  collider.build(zone.root());

  for (const side of portals.in(zone.id)) {
    // The marker you land on when arriving *at this side's door* — that is,
    // the arrival derived from this end, not from its target.
    // Settled exactly as the manager settles it, so this measures where the
    // player will actually stand rather than where the geometry was authored.
    const arrival = zone.settle(arrivalFor(side.end));
    const name = `${zone.id}/${side.portal}`;

    // Clear of geometry.
    const clear = !collider.overlaps(capsuleAt(arrival.position));

    // Ground beneath. Cast from head height; anything more than a step below
    // is a drop rather than a floor.
    const from = arrival.position.clone().setY(arrival.position.y + HEIGHT * 0.9);
    const down = collider.raycast(from, new THREE.Vector3(0, -1, 0));
    const grounded = down !== null && Math.abs(down - HEIGHT * 0.9) < 0.6;

    // Within reach of its own door, measured from the eye rather than the feet.
    const eye = arrival.position.clone().setY(arrival.position.y + 1.65);
    const doorMiddle = side.end.position.clone().setY(side.end.position.y + 1.1);
    const reach = eye.distanceTo(doorMiddle);
    const reachable = reach < DEFAULT_REACH;

    // And facing it: arriving with your back to the door you came out of is
    // right, so the door should be *behind* the arrival yaw.
    const facing = doorFacing(side.end.yaw);
    const toDoor = doorMiddle.clone().sub(eye).setY(0).normalize();
    const away = facing.dot(toDoor) < 0;

    // And that you can walk *off* it. An arrival can be perfectly clear and
    // still be useless if a prop was placed a stride in front of the door —
    // you land boxed in against the thing you just came through. Swept as a
    // few capsule positions along the way the player is facing rather than as
    // a ray, because a ray fits through gaps a body does not.
    let blockedAt = 0;
    for (let step = 1; step <= 4; step++) {
      const along = arrival.position
        .clone()
        .addScaledVector(doorFacing(side.end.yaw), step * 0.5);
      if (collider.overlaps(capsuleAt(along))) {
        blockedAt = step * 0.5;
        break;
      }
    }

    const problems = [
      !clear && 'ARRIVES INSIDE GEOMETRY',
      blockedAt > 0 && `boxed in ${blockedAt.toFixed(1)} m from the door`,
      !grounded && `no floor (${down === null ? 'nothing below' : `${down.toFixed(2)} m drop`})`,
      !reachable && `door out of reach (${reach.toFixed(2)} m)`,
      !away && 'arrives facing the door',
    ].filter(Boolean);

    check(
      `arrival ${name}`,
      problems.length === 0,
      problems.length === 0 ? `${reach.toFixed(2)} m to the door` : problems.join(', '),
    );
  }
}

// --- interiors are sealed --------------------------------------------------
// Rays out of the middle of the room in every direction. Any that escapes is a
// gap the player can fall through.
for (const zone of zones.values()) {
  // Only interiors. A zone with a sky is *supposed* to leak upward — asking an
  // outdoor valley to contain a ray fired straight up is asking it to have a
  // ceiling, and the check is about rooms having no holes in them.
  if (zone.environment.sky) continue;

  const collider = new Collider();
  collider.build(zone.root());

  const from = zone.spawn.position.clone().setY(1.2);
  const rays = 600;
  let escaped = 0;
  // Golden-angle spiral over the sphere: even coverage without the clustering
  // at the poles that two nested loops over angles would give.
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < rays; i++) {
    const y = 1 - (i / (rays - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const direction = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
    if (collider.raycast(from, direction) === null) escaped++;
  }

  check(
    `${zone.id} is sealed`,
    escaped === 0,
    escaped === 0 ? `${rays} rays contained` : `${escaped}/${rays} rays ESCAPED`,
  );
}

// --- crossings do not leak -------------------------------------------------
{
  const collider = new Collider();
  const order = [...zones.keys()];
  const triangleCounts: number[] = [];
  const childCounts: number[] = [];

  // Sixty rather than a few hundred. Each pass rebuilds the collider over the
  // whole exterior, which is where the suite's runtime goes, and accumulation
  // is visible in the first handful of samples or it is not accumulation.
  for (let i = 0; i < 60; i++) {
    const zone = zones.get(order[i % order.length]);
    if (!zone) continue;
    const root = zone.root();
    root.updateWorldMatrix(true, true);
    collider.build(root);
    if (i % order.length === 0) {
      triangleCounts.push(collider.triangles);
      childCounts.push(root.children.length);
    }
  }

  const trianglesStable = triangleCounts.every((n) => n === triangleCounts[0]);
  const childrenStable = childCounts.every((n) => n === childCounts[0]);
  check(
    '60 crossings leak nothing',
    trianglesStable && childrenStable,
    `triangles ${triangleCounts[0]} → ${triangleCounts[triangleCounts.length - 1]}, ` +
      `children ${childCounts[0]} → ${childCounts[childCounts.length - 1]}`,
  );
}

// --- residency is bounded --------------------------------------------------
//
// **The leak canary for a long session.** Zones build lazily and used to be kept
// for the whole session, which is correct at nine zones and about a gigabyte at
// the hundred-and-forty the finished world is aimed at. Eviction keys residency
// to the portal graph; this asserts that the policy actually bounds the set, and
// — more importantly — that a zone dropped and walked back into comes back the
// same, which is the whole reason dropping it is allowed.
//
// `ZoneManager` cannot be constructed here: it wants a renderer, an interaction
// system and a DOM. So this drives `residentZones` — the same function the
// manager evicts by — over the same portal graph, and performs the build and
// dispose itself. What it cannot see is the manager's bookkeeping around the
// release, which is why that code is small and stated in one place.
{
  const walk = [ZONE_EXTERIOR, 'villager-hut', 'hut-room', 'hut-room-2'];
  const missing = walk.filter((id) => !zones.has(id));

  if (missing.length > 0) {
    check('the residency walk exists', false, `no such zone: ${missing.join(', ')}`);
  } else {
    // Standing at the end of a three-deep chain, the hub must have fallen out.
    // This is the assertion that distinguishes "eviction is implemented" from
    // "eviction is implemented and never fires" — every earlier layout of this
    // world had its whole contents within two doors of the hub, so the policy
    // would have been satisfied by keeping everything.
    const far = residentZones(portals, 'hut-room-2', KEEP_WITHIN);
    check(
      'the hub is released from three doors away',
      !far.has(ZONE_EXTERIOR),
      `${far.size} zones resident from hut-room-2: ${[...far].sort().join(', ')}`,
    );

    // And the set is bounded everywhere, not merely at the end of one chain.
    let worst = 0;
    let worstAt = '';
    for (const id of zones.keys()) {
      const size = residentZones(portals, id, KEEP_WITHIN).size;
      if (size > worst) {
        worst = size;
        worstAt = id;
      }
    }
    check(
      'the resident set is bounded from every zone',
      worst < zones.size,
      `worst ${worst}/${zones.size} zones, standing in ${worstAt}`,
    );

    // Now actually walk it, twice, building on arrival and disposing anything
    // outside the resident set — and assert the built count settles rather than
    // climbing. Two laps because a leak that takes one crossing to appear is
    // invisible in a single pass.
    const collider = new Collider();
    const builtCounts: number[] = [];
    const route = [...walk, ...[...walk].reverse(), ...walk, ...[...walk].reverse()];

    for (const id of route) {
      const zone = zones.get(id);
      if (!zone) continue;
      const root = standDoors(zone);
      collider.build(root, id);

      const keep = residentZones(portals, id, KEEP_WITHIN);
      for (const other of zones.values()) {
        if (other.isBuilt && !keep.has(other.id)) {
          other.dispose();
          collider.invalidate(other.id);
        }
      }
      builtCounts.push([...zones.values()].filter((z) => z.isBuilt).length);
    }

    const peak = Math.max(...builtCounts);
    const settled = builtCounts.slice(-walk.length);
    const stable = settled.every((n) => n <= peak);
    check(
      'walking the chain settles at a bounded resident set',
      stable && peak < zones.size,
      `peak ${peak}/${zones.size} built, ${builtCounts[0]} → ${builtCounts[builtCounts.length - 1]}`,
    );

    // **The property that makes eviction safe at all.** Builders are seeded, so
    // a rebuilt zone is supposed to be identical down to the last vertex. If it
    // is not, eviction is not a memory policy — it is a world that quietly
    // changes behind the player, which is far worse than the leak it fixes.
    let drifted = '';
    for (const id of walk) {
      const zone = zones.get(id);
      if (!zone) continue;
      const before = countGeometry(standDoors(zone));
      zone.dispose();
      // Re-stood, because that is what the manager does on the next entry —
      // doors are half of a link between zones and are not the zone's to build.
      const after = countGeometry(standDoors(zone));
      if (before.triangles !== after.triangles || before.meshes !== after.meshes) {
        drifted = `${id}: ${before.triangles}/${before.meshes} → ${after.triangles}/${after.meshes}`;
        break;
      }
    }
    check(
      'a released zone rebuilds identically',
      drifted === '',
      drifted === '' ? `${walk.length} zones dropped and rebuilt` : drifted,
    );

    // Put the world back. Later checks read zone roots directly and would
    // otherwise be handed whatever this block happened to leave standing —
    // which is a check that passes or fails depending on what ran before it.
    for (const zone of zones.values()) standDoors(zone);
  }
}

// ---------------------------------------------------------------------------
console.log('\n--- terrain -------------------------------------------------\n');

{
  const t = countrysideTerrain;
  const limit = DEFAULT_TUNING.slopeLimitDeg;
  const half = t.size / 2;

  // --- the rim actually holds ---------------------------------------------
  // The boundary is terrain, not a wall: the outer ring is meant to rise past
  // the controller's slope limit so you slide back instead of walking out. That
  // is a claim about every point on the perimeter, and a single hill placed
  // carelessly near an edge can flatten a section of it into a ramp — which is
  // a hole in the world that nothing else would ever catch.
  //
  // So: walk inward from all the way round, and confirm each line crosses at
  // least one stretch too steep to climb.
  const spokes = 240;
  let leaks = 0;
  let thinnest = Infinity;
  for (let i = 0; i < spokes; i++) {
    // Around the square perimeter rather than around a circle — the corners are
    // exactly where a circular sample would miss.
    const u = (i / spokes) * 4;
    const side = Math.floor(u);
    const along = (u - side) * 2 - 1;
    const from =
      side === 0 ? [along * half, -half] : side === 1 ? [half, along * half] : side === 2 ? [along * half, half] : [-half, along * half];
    const toward = Math.atan2(-from[1], -from[0]);

    let steepest = 0;
    // Far enough in to clear the rim, no further — walking to the middle of a
    // small map would sample the whole interior and always find something steep.
    const probe = Math.round(half * 0.55);
    for (let step = 0; step <= probe; step++) {
      const d = step;
      const x = from[0] + Math.cos(toward) * d;
      const z = from[1] + Math.sin(toward) * d;
      steepest = Math.max(steepest, t.slopeAt(x, z));
    }
    thinnest = Math.min(thinnest, steepest);
    if (steepest <= limit) leaks++;
  }
  check(
    'the rim cannot be walked over',
    leaks === 0,
    leaks === 0
      ? `${spokes} spokes, shallowest wall ${thinnest.toFixed(0)}° against a ${limit}° limit`
      : `${leaks}/${spokes} spokes climbable, shallowest ${thinnest.toFixed(0)}°`,
  );

  // --- and the inside is not all cliff -------------------------------------
  // The opposite failure, and just as easy to author by accident: a bowl so
  // steep that the walkable part of it is a disc in the middle.
  let walkable = 0;
  let samples = 0;
  const inner = half * 0.62;
  for (let x = -inner; x <= inner; x += 8) {
    for (let z = -inner; z <= inner; z += 8) {
      samples++;
      if (t.slopeAt(x, z) <= limit) walkable++;
    }
  }
  const fraction = walkable / samples;
  check(
    'most of the valley is walkable',
    fraction > 0.9,
    `${(fraction * 100).toFixed(1)}% of the interior under ${limit}°`,
  );

  // --- props sit on the ground ---------------------------------------------
  // Everything in the countryside demo is placed by sampling `heightAt`, so a prop that
  // floats or is buried means the placement and the mesh disagree about where
  // the ground is — which would silently break every future zone built this way.
  const zone = zones.get(ZONE_COUNTRYSIDE);
  if (!zone) {
    check('the countryside zone exists', false);
  } else {
    const collider = new Collider();
    collider.build(zone.root());

    let worstGap = 0;
    let checked = 0;
    let floating = 0;
    for (const child of zone.root().children) {
      // The terrain itself is the reference, not a thing to measure against it.
      if (child.name === 'terrain') continue;
      const ground = t.heightAt(child.position.x, child.position.z);
      const gap = Math.abs(child.position.y - ground);
      checked++;
      if (gap > 0.05) floating++;
      worstGap = Math.max(worstGap, gap);
    }
    check(
      'every prop stands on the ground',
      floating === 0,
      floating === 0
        ? `${checked} props, worst gap ${(worstGap * 1000).toFixed(0)} mm`
        : `${floating}/${checked} off the ground, worst ${worstGap.toFixed(2)} m`,
    );

    // --- buildings stand on level ground ---------------------------------
    // A hut is rigid and placed at a single point, so ground that falls across
    // its footprint buries one corner and floats the opposite one. Nothing else
    // catches this: the prop check above only asks whether the *origin* sits on
    // the ground, and it always does — the fall is across the footprint, not at
    // the middle of it. This is what the terrace landform exists to fix, and
    // this is what proves it is working.
    //
    // Fences and troughs count too. A rail follows the posts it is nailed to,
    // not the hillside underneath, so a paddock on a slope gapes underneath
    // exactly the way a building does.
    const RIGID = new Set(['hut', 'fence', 'trough', 'archway']);
    let worstFall = 0;
    let worstAt = '';
    for (const child of zone.root().children) {
      if (!RIGID.has(child.name)) continue;
      // Sampled at the corners of a square about the size of the thing.
      const r = child.name === 'trough' ? 1 : 2.2;
      let low = Infinity;
      let high = -Infinity;
      for (const [dx, dz] of [
        [-r, -r],
        [r, -r],
        [r, r],
        [-r, r],
      ]) {
        const h = t.heightAt(child.position.x + dx, child.position.z + dz);
        low = Math.min(low, h);
        high = Math.max(high, h);
      }
      if (high - low > worstFall) {
        worstFall = high - low;
        worstAt = `(${child.position.x.toFixed(0)}, ${child.position.z.toFixed(0)})`;
      }
    }
    check(
      'buildings stand on level ground',
      worstFall < 0.25,
      `worst fall ${(worstFall * 100).toFixed(0)} cm across a footprint${worstAt ? ` at ${worstAt}` : ''}`,
    );

    // The spawn has to be somewhere you can stand, not on a slope you slide off.
    const spawn = zone.spawn.position;
    check(
      'the countryside spawn is on walkable ground',
      t.slopeAt(spawn.x, spawn.z) <= limit,
      `${t.slopeAt(spawn.x, spawn.z).toFixed(0)}° at the spawn`,
    );
  }

  // --- detail boundaries sit on gentle ground ------------------------------
  // Stitching closes the geometric seam between two densities — there is no
  // gap, and the vertex test below proves it. What stitching cannot do is hide
  // a change of *facet size* on a slope: coarse and fine facets approximate a
  // curve with different normals, and two different normals meeting along a
  // line is, under flat shading, a line you can see. It reads exactly like a
  // crack, which is how an hour went into looking for a hole that was not there.
  //
  // On flat ground every facet points straight up whatever its size, so the
  // boundary disappears. Hence the rule: keep detail edges off slopes.
  {
    let worstRing = 0;
    let worstAt = 0;
    for (const region of t.detailRegions) {
      for (let i = 0; i < 240; i++) {
        const a = (i / 240) * Math.PI * 2;
        const slope = t.slopeAt(
          region.at[0] + Math.cos(a) * region.radius,
          region.at[1] + Math.sin(a) * region.radius,
        );
        if (slope > worstRing) {
          worstRing = slope;
          worstAt = region.radius;
        }
      }
    }
    check(
      'detail boundaries sit on gentle ground',
      worstRing < 30,
      `steepest ground under a detail edge is ${worstRing.toFixed(0)}° (ring r=${worstAt})`,
    );
  }

  // --- the stitching actually closes ---------------------------------------
  // Two vertices at the same footprint must agree on height, or the mesh has a
  // hole in it where the densities meet.
  {
    const mesh = t.build();
    const position = mesh.geometry.getAttribute('position');
    const byFootprint = new Map<string, number[]>();
    for (let i = 0; i < position.count; i++) {
      const key = `${position.getX(i).toFixed(4)},${position.getZ(i).toFixed(4)}`;
      const y = position.getY(i);
      const seen = byFootprint.get(key);
      if (seen) {
        if (!seen.some((v) => Math.abs(v - y) < 1e-5)) seen.push(y);
      } else {
        byFootprint.set(key, [y]);
      }
    }
    let cracks = 0;
    let worst = 0;
    for (const heights of byFootprint.values()) {
      if (heights.length > 1) {
        cracks++;
        worst = Math.max(worst, Math.max(...heights) - Math.min(...heights));
      }
    }
    check(
      'variable density leaves no cracks',
      cracks === 0,
      cracks === 0
        ? `${byFootprint.size} distinct footprints, all in agreement`
        : `${cracks} footprints disagree, worst ${worst.toFixed(3)} m`,
    );
    mesh.geometry.dispose();
  }

  // --- ground cover is doing something -------------------------------------
  // A painted patch that never wins is a patch nobody will notice is broken.
  const found = new Set<string>();
  for (let x = -half; x <= half; x += 6) {
    for (let z = -half; z <= half; z += 6) found.add(t.materialAt(x, z));
  }
  check(
    'painted ground cover reaches the surface',
    found.size >= 5,
    `${found.size} materials on the ground: ${[...found].sort().join(', ')}`,
  );
}

// ---------------------------------------------------------------------------
console.log('\n--- surfaces underfoot --------------------------------------\n');

/**
 * Every footstep model has ground somewhere that uses it.
 *
 * FOOTSTEPS.md M4: a surface with no ground that plays it cannot be heard, and
 * an unhearable sound is an unfinished one. This is the assertion that keeps
 * the two tables from drifting — adding a `SurfaceName` and forgetting to give
 * it any ground is otherwise completely silent, in both senses.
 */
{
  const played = new Set<string>(Object.values(GROUND).map((material) => material.step));
  const orphans = Object.keys(SURFACES).filter((name) => !played.has(name));
  check(
    'every surface has ground that uses it',
    orphans.length === 0,
    orphans.length === 0
      ? `${played.size} surfaces reachable through ${Object.keys(GROUND).length} ground materials`
      : `nothing plays: ${orphans.join(', ')}`,
  );

  // And that the showcase actually presents them. Its strips are the only
  // place all of them stand side by side, so a strip whose paint and footfall
  // disagree would be invisible everywhere else.
  const showcase = zones.get(ZONE_FOOTSTEPS_SHOWCASE);
  const surfaceAt = showcase?.definition.surfaceAt;
  if (!surfaceAt) {
    check('the footsteps showcase paints what it plays', false, 'no surfaceAt on the zone');
  } else {
    const heard = new Set<string>();
    // Across the field at half-strip resolution, so a boundary off by half a
    // strip shows up as a material sampled twice and another not at all.
    for (let x = -35; x <= 35; x += 2.5) heard.add(surfaceAt(x, 0));
    const missing = Object.keys(SURFACES).filter((name) => !heard.has(name));
    check(
      'the footsteps showcase presents every surface',
      missing.length === 0,
      missing.length === 0
        ? `${heard.size} distinct surfaces across the strips`
        : `not on any strip: ${missing.join(', ')}`,
    );
  }
}

// ---------------------------------------------------------------------------
console.log('\n--- transition cue ------------------------------------------\n');

/**
 * The transition cue.
 *
 * Its job is to tell the player they changed places, over a fade of about six
 * tenths of a second. So the assertions here are about *legibility and fit*,
 * not about physical fidelity — the previous model was a physically motivated
 * friction creak that satisfied every property of stick-slip and still sounded
 * wrong, because sounding like a hinge was never what was being asked for.
 */
for (const material of Object.keys(DOOR_SPECS) as DoorMaterial[]) {
  const spec = DOOR_SPECS[material];
  const duration = doorDuration(spec);

  // 1. Over before the fade is. A cue still sounding once the next place has
  //    appeared reads as belonging to that place instead of to the threshold.
  //    FADE_TIME + FADE_HOLD + FADE_TIME is 0.58 s.
  const brief = duration < 1.3;

  // 2. Recognisable immediately. Everything but the latch starts at once, so
  //    the only thing that can delay it is the click gap.
  const prompt = duration > 0.15;

  // 3. Audible on the target device. Built-in laptop speakers give up below
  //    about 300 Hz, so a door whose energy is all beneath that is a door
  //    nobody hears. The thump may sit low — it is felt, not heard — but the
  //    body has to have something above the floor.
  const audibleModes = spec.modes.filter((mode) => mode.hz >= 300);
  const carries = audibleModes.length >= 2 && spec.click.hz >= 1500;

  // 4. Moderate Q throughout. This is the error that made the last version a
  //    drone: Farnell's wooden-door values are 1, 1, 2, 2, 3, 3, and deriving
  //    them from a decay time gave 59 to 176. Anything past ~20 is a sine wave
  //    with a rumour of noise in it, and the ring-down belongs in the envelope.
  const worstQ = Math.max(spec.click.q, ...spec.modes.map((m) => m.q));
  const tinted = worstQ <= 20;

  const problems = [
    !brief && `runs ${duration.toFixed(2)}s, longer than the fade`,
    !prompt && `only ${duration.toFixed(2)}s — nothing to hear`,
    !carries &&
      `not enough above 300 Hz (${audibleModes.length} modes, click ${spec.click.hz} Hz)`,
    !tinted && `Q up to ${worstQ} — resonator, not tint`,
  ].filter(Boolean);

  check(
    `${material} thunk`,
    problems.length === 0,
    problems.length === 0
      ? `${duration.toFixed(2)}s, ${spec.modes.length} modes, Q<=${worstQ}, ` +
          `click ${spec.click.hz} Hz`
      : problems.join(', '),
  );
}

// The three materials have to be tellable apart, or there is no reason to have
// three. Compare the lowest body mode and the total ring length.
{
  const materials = Object.keys(DOOR_SPECS) as DoorMaterial[];
  let closest = Infinity;
  for (let i = 0; i < materials.length; i++) {
    for (let j = i + 1; j < materials.length; j++) {
      const a = DOOR_SPECS[materials[i]];
      const b = DOOR_SPECS[materials[j]];
      const pitch = Math.abs(Math.log2(a.modes[0].hz / b.modes[0].hz));
      const length = Math.abs(Math.log2(doorDuration(a) / doorDuration(b)));
      closest = Math.min(closest, Math.max(pitch, length));
    }
  }
  check(
    'the three doors are tellable apart',
    closest > 0.3,
    `closest pair differs by ${closest.toFixed(2)} octaves of pitch or length`,
  );
}

// The standoff has to clear the capsule and stay inside reach — the two
// constraints that make an arrival usable, checked against the constants
// rather than against any particular door.
check(
  'arrival standoff is sane',
  ARRIVAL_STANDOFF > RADIUS + 0.4 && ARRIVAL_STANDOFF < DEFAULT_REACH - 1,
  `${ARRIVAL_STANDOFF} m, capsule ${RADIUS} m, reach ${DEFAULT_REACH} m`,
);

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
