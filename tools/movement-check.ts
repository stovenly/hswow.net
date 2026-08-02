/**
 * Headless exercise of the first-person controller against the proving ground.
 *
 * `npm run check:movement`
 *
 * Collision is pure geometry — the octree, the capsule and every triangle test
 * run without a GPU or a DOM — so the one part of this game that is genuinely
 * hard to eyeball can be asserted instead. That matters here because the build
 * is played on a phone against a live URL, where there is no debugger and no
 * way to tell a tuning problem from a collision bug by feel.
 *
 * Run it after touching `Collider`, `Controller`, or the gym fixtures. The
 * numbers below are derived from `DEFAULT_TUNING`, so changing the tuning
 * moves the expectations with it rather than breaking them.
 *
 * `--trace` dumps per-tick state for the fixtures that are hardest to reason
 * about, which is how each of these checks got written in the first place.
 */
import * as THREE from 'three';
import { Collider } from '../src/player/Collider';
import { Controller } from '../src/player/Controller';
import { ProvingGround } from '../src/debug/ProvingGround';

class FakeInput {
  moveX = 0;
  moveZ = 0;
  sprint = false;
  /**
   * Held, like the real one. Added so the crouch tunnel can be walked: the
   * capsule genuinely shrinks and there was no fixture to shrink under, so
   * every line of that code and the headroom probe that guards standing back
   * up had never been exercised by anything but hand.
   */
  crouching = false;
  jumping = false;
  private jump = false;
  press(): void {
    this.jump = true;
  }
  takeJump(): boolean {
    const taken = this.jump;
    this.jump = false;
    return taken;
  }
  drainLook(out: { x: number; y: number }): void {
    out.x = 0;
    out.y = 0;
  }
}

const ground = new ProvingGround();
ground.root.updateWorldMatrix(true, true);
const collider = new Collider();
collider.build(ground.root);

const camera = new THREE.PerspectiveCamera(70, 16 / 9, 0.1, 500);
const input = new FakeInput();
const player = new Controller(camera, input as never, collider);

let failures = 0;

/** Runs the sim and reports the highest the feet got, for climb tests. */
function run(seconds: number, fn?: (t: number) => void): number {
  const dt = 1 / 60;
  let peak = -Infinity;
  for (let t = 0; t < seconds; t += dt) {
    fn?.(t);
    player.update(dt);
    peak = Math.max(peak, player.position.y);
  }
  return peak;
}

function reset(x: number, y: number, z: number, yaw: number): void {
  input.moveX = 0;
  input.moveZ = 0;
  input.sprint = false;
  input.crouching = false;
  player.teleport(new THREE.Vector3(x, y, z), yaw);
  run(0.6);
}

function check(label: string, ok: boolean, detail: string): void {
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label.padEnd(32)} ${detail}`);
}

console.log(`collision triangles: ${collider.triangles}\n`);

// --- resting on the ground ------------------------------------------------
player.teleport(new THREE.Vector3(0, 4, 10), 0);
run(2);
check(
  'falls and settles on the ground',
  player.isGrounded && Math.abs(player.position.y) < 0.05,
  `y=${player.position.y.toFixed(3)} grounded=${player.isGrounded}`,
);

// --- no drift when idle ---------------------------------------------------
const idleStart = player.position.clone();
run(3);
check(
  'stands still without drifting',
  idleStart.distanceTo(player.position) < 0.01,
  `drift ${idleStart.distanceTo(player.position).toFixed(4)} m`,
);

// --- the squeeze ----------------------------------------------------------
//
// **The only thing in the world that depends on the player's radius.** The
// capsule is 0.64 m across, so a 0.55 m gap must refuse it and a 0.75 m gap
// must not — which brackets the number from both sides, where one wall it
// bumps into would only ever have told you it was not zero.
//
// yaw = 0 faces -Z. Started between two pairs rather than in front of one, so
// the run is a metre and a bit and there is no chance of arriving with the
// capsule already touching something.
reset(-18, 0.1, 9.4, 0);
input.moveZ = 1;
run(2);
// The pair spans z 7.7..8.3, so anything north of 8.3 never got through it.
// It stops a little short of the 0.62 a flat face would give, because a
// capsule wedged between two opposing walls resolves against a *corner* — the
// two side pushes cancel and what finally arrests it is the front edge.
check(
  'a 0.55 m gap refuses the player',
  player.position.z > 8.3,
  `z=${player.position.z.toFixed(2)}, expected > 8.3 (the near face)`,
);

// Started north of the 0.9 pair and walked the whole rank. Getting past 12.9
// is the 0.75 pair cleared; where it ends up is the 0.55 pair above stopping
// it, which is the same assertion from the other direction.
reset(-18, 0.1, 14.4, 0);
input.moveZ = 1;
run(2);
check(
  'a 0.75 m gap admits the player',
  player.position.z < 12.9,
  `z=${player.position.z.toFixed(2)}, expected < 12.9 (past the far face)`,
);

// --- the crouch tunnel ----------------------------------------------------
//
// Three headers over one lane at 1.6, 1.3 and 1.1 m. Approached from the north
// the first one met is the 1.1, whose underside is at exactly the height a
// standing 1.8 m capsule cannot pass and a crouched 1.04 m one clears with six
// centimetres to spare.
reset(-10, 0.1, 16, 0);
input.moveZ = 1;
run(3);
check(
  'a header stops a standing player',
  player.position.z > 14.2,
  `z=${player.position.z.toFixed(2)}, expected > 14.2`,
);

// The same walk, crouched. Slower — `crouchDrag` is 0.45 — so this is given
// the time to cover eight metres at walking pace times that.
reset(-10, 0.1, 16, 0);
input.crouching = true;
input.moveZ = 1;
run(6);
check(
  'crouching clears every header',
  player.position.z < 8.5,
  `z=${player.position.z.toFixed(2)}, expected < 8.5`,
);

// --- stairs ---------------------------------------------------------------
reset(-24, 0.1, -1, 0);
input.moveZ = 1;
let peak = run(2.5);
check('climbs 0.18 m stairs', peak > 1.3, `peak y=${peak.toFixed(2)} of 1.44`);

reset(-28, 0.1, -1, 0);
input.moveZ = 1;
peak = run(3.5);
check('climbs 0.30 m stairs', peak > 2.1, `peak y=${peak.toFixed(2)} of 2.40`);

// --- ramps ----------------------------------------------------------------
for (const [index, degrees] of [10, 20, 30, 45].entries()) {
  const rise = 4 * Math.tan((degrees * Math.PI) / 180);
  // Started at z = 1.5 rather than at the foot of the slope, so the run has a
  // moment to reach walking pace before it meets the ramp — a climb measured
  // from a standing start is measuring the acceleration curve as much as the
  // slope.
  reset(-6 - index * 4, 0.1, 1.5, 0);
  input.moveZ = 1;
  const peak = run(3);
  check(
    `walks up the ${degrees}° ramp`,
    peak > rise * 0.9,
    `peak y=${peak.toFixed(2)} of ${rise.toFixed(2)}`,
  );
}

// --- kerbs, either side of the step height --------------------------------
// 0.5 m is expected to be climbed despite stepHeight being 0.45: the capsule's
// own shoulder carries it. 0.9 m is the one that has to hold.
for (const [index, height] of [0.2, 0.35, 0.5, 0.9].entries()) {
  reset(-8 - index * 4, 0.1, 8, 0);
  input.moveZ = 1;
  const climbed = run(1.2) > height * 0.8;
  const shouldClimb = height < 0.6;
  check(
    `${height} m kerb ${shouldClimb ? 'is climbed' : 'blocks'}`,
    climbed === shouldClimb,
    `z=${player.position.z.toFixed(2)} y=${player.position.y.toFixed(2)}`,
  );
}

// --- the jump arc itself, measured on flat ground -------------------------
// Expected from the tuning: apex v^2/2g and range 2v/g * sprint speed.
const t = player.tuning;
const expectedApex = (t.jumpSpeed * t.jumpSpeed) / (2 * t.gravity);
const expectedRange = ((2 * t.jumpSpeed) / t.gravity) * t.walkSpeed * t.sprintScale;

reset(10, 0.1, 20, 0);
input.moveZ = 1;
input.sprint = true;
run(0.8); // reach full sprint before leaving the ground
const launch = player.position.clone();
input.press();
let apex = -Infinity;
let airborne = 0;
let touchdown: THREE.Vector3 | null = null;
run(1.5, () => {
  if (!player.isGrounded) {
    airborne += 1 / 60;
    apex = Math.max(apex, player.position.y);
  } else if (airborne > 0.1 && touchdown === null) {
    touchdown = player.position.clone();
  }
});
const range = launch.distanceTo(touchdown ?? player.position);
check(
  'jump apex matches the tuning',
  Math.abs(apex - expectedApex) < 0.12,
  `${apex.toFixed(2)} m vs ${expectedApex.toFixed(2)} expected`,
);
check(
  'sprint jump range clears 3.5 m',
  range > 3.6 && range < expectedRange * 1.2,
  `${range.toFixed(2)} m vs ${expectedRange.toFixed(2)} ballistic`,
);
check('lands again', player.isGrounded && airborne > 0.3, `airborne ${airborne.toFixed(2)} s`);

// --- falling off the high walkway -----------------------------------------
player.teleport(new THREE.Vector3(-18, 4.1, -14), 0);
input.moveZ = 1;
input.sprint = false;
run(3);
check(
  'walks off the walkway and lands',
  player.isGrounded && player.position.y < 0.2,
  `y=${player.position.y.toFixed(2)} z=${player.position.z.toFixed(2)}`,
);

// --- cost -----------------------------------------------------------------
// One frame is up to 16 collision sub-steps, each a broad phase plus a narrow
// phase per candidate triangle. This has to be cheap on a phone.
reset(-14, 0.1, 0, 0);
input.moveZ = 1;
input.sprint = true;
const frames = 600;
const began = performance.now();
for (let i = 0; i < frames; i++) player.update(1 / 60);
const perFrame = (performance.now() - began) / frames;
console.log(
  `\nmovement cost: ${perFrame.toFixed(3)} ms/frame walking a ramp ` +
    `(${((perFrame / (1000 / 60)) * 100).toFixed(1)}% of a 60 fps budget)`,
);

// --- diagnostics ----------------------------------------------------------
if (process.argv.includes('--trace')) {
  const internals = player as unknown as {
    velocity: THREE.Vector3;
    groundNormal: THREE.Vector3;
  };
  for (const [label, x, z] of [
    ['0.2 kerb', -8, 8],
    ['30 ramp', -14, 0],
    ['45 ramp', -18, 0],
    ['0.40 stair', -28, -1],
  ] as const) {
    console.log(`\n--- ${label} ---`);
    reset(x, 0.1, z, 0);
    input.moveZ = 1;
    let tick = 0;
    run(2.5, () => {
      if (tick++ % 15 !== 0) return;
      const p = player.position;
      const v = internals.velocity;
      const n = internals.groundNormal;
      console.log(
        `y=${p.y.toFixed(2)} z=${p.z.toFixed(2)} ` +
          `grounded=${player.isGrounded ? 'Y' : 'n'} ` +
          `v=(${v.x.toFixed(1)},${v.y.toFixed(1)},${v.z.toFixed(1)}) ` +
          `n=(${n.x.toFixed(2)},${n.y.toFixed(2)},${n.z.toFixed(2)})`,
      );
    });
  }
}

// --- air-strafing cannot run away -----------------------------------------
// Quake acceleration adds up to the shortfall between speed *along the wish
// direction* and the wish speed. Point the wish sideways to where you are
// already going and that dot product stays near zero, so the shortfall stays
// near full and the acceleration lands at right angles — which grows the total
// speed by Pythagoras rather than by addition. With no air friction, every jump
// keeps whatever the last one gained.
//
// Performed here the way a player performs it: hold sprint, hop the instant
// there is ground to hop from, and sweep the heading and the strafe together so
// the wish direction keeps leading the velocity. Run out on empty ground well
// west of the gym and the rooms, so this measures acceleration rather than how
// often it runs into a wall.
{
  const state = player as unknown as { velocity: THREE.Vector3; yaw: number };
  reset(-60, 0.1, 90, 0);
  input.sprint = true;
  input.moveZ = 1;

  let fastest = 0;
  let turn = 0;
  const dt = 1 / 60;
  for (let i = 0; i < 60 * 12; i++) {
    if (player.isGrounded) input.press();
    turn += dt * 2.4;
    state.yaw = Math.sin(turn) * 0.9;
    input.moveX = Math.cos(turn) > 0 ? 1 : -1;
    player.update(dt);
    fastest = Math.max(fastest, Math.hypot(state.velocity.x, state.velocity.z));
  }
  input.sprint = false;
  input.moveX = 0;
  input.moveZ = 0;

  const sprintSpeed = t.walkSpeed * t.sprintScale;
  const ceiling = sprintSpeed * t.maxAirSpeed;
  check(
    'air-strafing cannot run away',
    fastest <= ceiling * 1.02,
    `peaked ${fastest.toFixed(2)} m/s vs ${ceiling.toFixed(2)} cap (sprint ${sprintSpeed.toFixed(2)})`,
  );
}

// --- coyote time ----------------------------------------------------------
// Players press jump *as* they reach an edge, not a frame before it. Without a
// grace window the honest result — nothing happens — reads as the game dropping
// inputs rather than as the player being late, so there is a window in which
// walking off a ledge still counts as standing on it.
//
// Both halves matter. A window that never expires is a double jump, and one
// that never opens is the bug it was meant to fix, so this measures the vertical
// velocity on the frame the press lands: a real jump sets it to `jumpSpeed`, and
// a refused one leaves it falling.
//
// Run off the high walkway rather than a kerb, so there is enough airtime to
// test a press from *outside* the window while still off the ground.
{
  const state = player as unknown as { velocity: THREE.Vector3 };
  const dt = 1 / 60;

  const pressAfterLeaving = (delay: number): number => {
    // North end, walking on toward -Z. The *south* end of the walkway adjoins
    // the 45 degree ramp's landing, so walking off that way just strolls back
    // down the ramp and never leaves the ground at all.
    reset(-18, 4.05, -14.5, 0);
    input.moveZ = 1;
    let leftGround = -1;
    let pressed = false;
    let verticalAfterPress = 0;
    for (let i = 0; i < 60 * 3; i++) {
      const now = i * dt;
      if (leftGround < 0 && !player.isGrounded) leftGround = now;
      if (leftGround >= 0 && !pressed && now - leftGround >= delay) {
        input.press();
        pressed = true;
        player.update(dt);
        verticalAfterPress = state.velocity.y;
        continue;
      }
      player.update(dt);
    }
    input.moveZ = 0;
    return verticalAfterPress;
  };

  const t2 = player.tuning;
  const inside = pressAfterLeaving(t2.coyoteTime * 0.45);
  const outside = pressAfterLeaving(t2.coyoteTime + 0.12);

  check(
    'a jump just after a ledge still fires',
    inside > t2.jumpSpeed * 0.9,
    `vy=${inside.toFixed(2)} after leaving the edge, jumpSpeed is ${t2.jumpSpeed}`,
  );
  check(
    'the coyote window does expire',
    outside < 0,
    `vy=${outside.toFixed(2)} once ${(t2.coyoteTime + 0.12).toFixed(2)} s past the edge`,
  );
}

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
