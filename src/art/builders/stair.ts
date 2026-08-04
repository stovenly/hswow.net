import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * An iron stair to a landing: stringers, open treads, and a rail.
 *
 * The kit's first piece of vertical circulation. Everything else in it stands
 * on the floor and is looked at; this is the thing that says a works has an
 * *upstairs* — and once a room has a stair in it, the space above head height
 * stops being empty and becomes somewhere you have not been yet.
 *
 * **The diagonal stripe is the silhouette.** A ladder is two verticals with
 * rungs; a stair is a sloped band of horizontal lines, and the treads showing
 * as separate steps under a single raking stringer is what tells them apart at
 * any distance. Open treads matter — a closed stair is a ramp.
 *
 * Built rising toward -Z, with the bottom step at the origin, so a caller puts
 * it at the foot and turns it.
 */
export const stair: MeshBuilder = {
  name: 'stair',
  category: 'structures',
  radius: 2.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Real stair geometry, near enough: a 0.19 m rise to a 0.25 m going is
    // about 37°, which is what an industrial stair is built to. Getting this
    // ratio wrong is the fastest way to make a stair read as scenery.
    const rise = rng.range(0.17, 0.2);
    const going = rng.range(0.23, 0.27);
    const steps = rng.int(11, 16);
    const width = rng.range(0.85, 1.05);

    const top = rise * steps;
    const run = going * steps;
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    const tread = shade(PALETTE.IRON, rng.range(0.95, 1.15));

    // --- stringers -----------------------------------------------------------
    const pitch = Math.atan2(top, run);
    const long = Math.hypot(top, run);
    for (const side of [-1, 1]) {
      const stringer = new THREE.BoxGeometry(0.06, 0.28, long + 0.2);
      stringer.rotateX(pitch);
      stringer.translate((side * width) / 2, top / 2 - 0.06, -run / 2);
      parts.push({ geometry: stringer, color: iron, sway: 0 });
    }

    // --- treads --------------------------------------------------------------
    for (let i = 0; i < steps; i++) {
      const plate = new THREE.BoxGeometry(width * 0.94, 0.035, going * 0.72);
      plate.translate(0, rise * (i + 1), -going * (i + 0.5));
      parts.push({ geometry: plate, color: tread, sway: 0 });

      // A nosing lip on the front edge of each. Two triangles that catch the
      // light from a different angle, which is what separates the treads from
      // each other when the stair is edge-on.
      const nose = new THREE.BoxGeometry(width * 0.94, 0.05, 0.03);
      nose.translate(0, rise * (i + 1) - 0.012, -going * (i + 0.5) - going * 0.36);
      parts.push({ geometry: nose, color: shade(tread, 0.86), sway: 0 });
    }

    // --- landing -------------------------------------------------------------
    const deck = rng.range(0.9, 1.3);
    const platform = new THREE.BoxGeometry(width + 0.12, 0.07, deck);
    platform.translate(0, top, -run - deck / 2 + 0.02);
    parts.push({ geometry: platform, color: shade(tread, 1.06), sway: 0 });

    for (const side of [-1, 1]) {
      const bearer = new THREE.CylinderGeometry(0.045, 0.05, top, 6);
      bearer.translate((side * width) / 2, top / 2, -run - deck + 0.12);
      parts.push({ geometry: bearer, color: shade(iron, 0.9), sway: 0 });
    }

    // --- handrail ------------------------------------------------------------
    //
    // Up one side only. Both sides doubles the part count for a stair you can
    // only ever walk up the middle of, and a single rail reads as industrial
    // where a pair reads as a staircase in a house.
    const railSide = rng.chance(0.5) ? 1 : -1;
    const railH = 1.05;
    const posts = 4;
    for (let i = 0; i <= posts; i++) {
      const t = i / posts;
      const post = new THREE.CylinderGeometry(0.022, 0.026, railH, 6);
      post.translate((railSide * width) / 2, rise * steps * t + railH / 2, -run * t);
      parts.push({ geometry: post, color: iron, sway: 0 });
    }

    const rail = new THREE.CylinderGeometry(0.026, 0.026, long + 0.16, 6);
    rail.rotateX(Math.PI / 2 + pitch);
    rail.translate((railSide * width) / 2, top / 2 + railH, -run / 2);
    parts.push({ geometry: rail, color: shade(iron, 1.12), sway: 0 });

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    const mesh = finish(geometry, 'stair', 0, 'metal-ring');

    // --- what the player actually walks on -----------------------------------
    //
    // **A capsule cannot climb a real staircase.** Driven at one headlessly, the
    // controller reports `grounded === false` for the entire ascent: the deepest
    // contact each sub-step is a riser or a nosing, whose normal is nowhere near
    // vertical, so nothing ever counts as standing. The player is shoved out of
    // one riser, falls, catches the next, and reaches the top having technically
    // been airborne the whole way.
    //
    // Everything downstream of that breaks, and none of it looks like a
    // collision bug. Air acceleration replaces ground acceleration, so speed
    // lurches between 1 and 4 m/s. Step smoothing is gated on being grounded, so
    // the camera jumps a full tread at a time. `advanceBob` returns early when
    // airborne, so **a staircase is silent** — no footfalls at all.
    //
    // So the geometry you see is not the geometry you stand on. A plane above
    // every tread has a constant 37° normal, inside the slope limit, and the
    // climb becomes an ordinary walk up a hill: grounded throughout, ground
    // acceleration, footsteps, and a camera rising in a straight line because
    // the surface under it is straight.
    //
    // **It rides the leading corners**, which is where a straight plane over a
    // sawtooth has to sit: the front edge of each tread is the binding
    // constraint, so the plane touches there and clears the back of that same
    // tread by about seven tenths of a rise. Thirteen centimetres of daylight
    // under the boots at the back of each step — in a game with no visible feet
    // and no player shadow, nobody can see it and everybody can feel it.
    const lift = rise * 0.86 + 0.02;
    const thickness = 0.08;
    const ramp = new THREE.BoxGeometry(width * 0.94, thickness, long + 0.7);
    ramp.rotateX(pitch);
    // Dropped by half a thickness measured along the *world* vertical rather
    // than along the plane's own normal, so the top face lands on the line
    // through the corners instead of near it.
    ramp.translate(0, lift + top / 2 - thickness / 2 / Math.cos(pitch), -run / 2);
    const walkway = new THREE.Mesh(ramp, mesh.material);
    // Never drawn, always collided with. Visibility and collision are separate
    // here — the octree filters by layer, which is what `markCollidable` sets —
    // so an invisible mesh is as solid as any other.
    walkway.visible = false;
    walkway.userData.underfoot = 'metal-ring';
    mesh.add(walkway);
    return mesh;
  },
};
