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

// --- blocked by a wall ----------------------------------------------------
// yaw = pi/2 faces -X; the strafe wall's near face is at x = -3.8.
reset(0, 0.1, 8, Math.PI / 2);
input.moveZ = 1;
run(3);
check(
  'strafe wall blocks',
  player.position.x > -4.4 && player.position.x < -3.3,
  `x=${player.position.x.toFixed(2)}, expected ~-3.5`,
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
  // Started at z = 1.5, not 0: the strafe wall's arm occupies z 0..0.4 across
  // this whole lane, so spawning at the origin put the capsule inside it and
  // let the step-up carry the player onto the wall before the ramp was even
  // reached. The measurement was of the wrong thing entirely.
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

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
