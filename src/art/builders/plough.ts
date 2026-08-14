import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A swing plough, left standing at the end of a furrow.
 *
 * **The one object that says a field is worked rather than merely grassy.** A
 * crop patch is a colour on the ground and reads as one; the implement that made
 * it is a thing with a shape, and leaving it at the headland says the work is
 * ongoing and somebody will be back.
 *
 * ## It is a frame, and it is built as one
 *
 * The first attempt laid out six pieces at six independently rolled positions
 * and angles and hoped they would meet. They did not — the beam floated over the
 * stilts, the stay crossed both without touching either, and the share hung off
 * the front — because *nothing in it was derived from anything else*. A plough
 * is a rigid frame: every member is a line between two joints, and the joints
 * are the object.
 *
 * So this names its four joints first —
 *
 * - **`sole`**, on the ground at the back of the share, where the iron rides;
 * - **`throat`**, low and forward, where the beam meets the head;
 * - **`hitch`**, high and forward at the end of the beam;
 * - **`hands`**, high and back, where the stilts finish;
 *
 * — and then draws each member *between* two of them with a helper that takes
 * two points and returns a piece of timber joining them, overlapping each end so
 * the joints are lapped rather than butted. Nothing can be adrift, because
 * nothing has a position of its own.
 *
 * ## What has to read at thirty metres
 *
 * Three lines: the **beam** running forward and up, the **stilts** angling back
 * and up in a clear V, and the **share** at the bottom catching the light. So
 * the beam is long and unbroken, the stilts are the only other long member, and
 * the share is the one part in bright metal rather than timber.
 *
 * **It leans.** A plough parked on its own falls onto one stilt and the share
 * comes out of the ground — it is not a tripod. That list is most of what stops
 * it reading as a diagram, and it is applied to the whole frame at the end so
 * the frame stays a frame.
 */

type Joint = readonly [number, number, number];

export const plough: MeshBuilder = {
  name: 'plough',
  category: 'objects',
  radius: 1.55,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const timber = shade(PALETTE.TIMBER, rng.range(0.92, 1.06));
    const frame = shade(PALETTE.TIMBER_DARK, rng.range(0.92, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.92, 1.1));
    const bright = shade(PALETTE.IRON_PALE, rng.range(1, 1.12));

    // --- the joints ----------------------------------------------------------
    //
    // Proportioned off one length, so a big plough is a big plough all over
    // rather than a long beam with a small frame hung on it. The three that
    // matter to the silhouette are the beam's rise (shallow — a plough beam is
    // nearly level, and pitching it up turned the object into a see-saw), the
    // stilts' reach back, and how far the head stands in front of the throat.
    const size = rng.range(0.92, 1.1);
    const sole: Joint = [0, 0.05, 0];
    const throat: Joint = [0.24 * size, 0.34 * size, 0];
    const hitch: Joint = [1.72 * size, 0.56 * size, 0];
    const handY = 1.08 * size;
    const handX = -0.86 * size;
    const splay = 0.15 * size;

    const built: THREE.BufferGeometry[] = [];
    const tint: number[] = [];
    const add = (geometry: THREE.BufferGeometry, color: number): void => {
      built.push(geometry);
      tint.push(color);
    };

    const UP = new THREE.Vector3(0, 1, 0);
    /**
     * A member between two joints.
     *
     * Built along its own length and turned onto the line, with `lap` added at
     * each end so it runs *into* whatever it meets rather than stopping at the
     * surface. A frame whose members merely touch shows daylight at every joint
     * the moment anything is rotated.
     */
    const member = (
      from: Joint,
      to: Joint,
      thick: number,
      wide: number,
      color: number,
      lap = 0.05,
    ): void => {
      const dx = to[0] - from[0];
      const dy = to[1] - from[1];
      const dz = to[2] - from[2];
      const run = Math.hypot(dx, dy, dz);
      if (run < 1e-4) return;
      const bar = new THREE.BoxGeometry(wide, run + lap * 2, thick);
      bar.translate(0, run / 2, 0);
      bar.applyQuaternion(
        new THREE.Quaternion().setFromUnitVectors(
          UP,
          new THREE.Vector3(dx, dy, dz).divideScalar(run),
        ),
      );
      bar.translate(from[0] - (dx / run) * lap, from[1] - (dy / run) * lap, from[2] - (dz / run) * lap);
      add(bar, color);
    };

    // --- the frame -----------------------------------------------------------
    //
    // The head, from the sole up to the throat: the short stout piece everything
    // else is fastened to.
    member(sole, throat, 0.09, 0.09, frame, 0.04);
    // The beam, throat to hitch. The longest line on the object.
    member(throat, hitch, 0.075, 0.085, timber, 0.04);
    // The stilts, from the head back and up to the hands. Both start at the
    // throat, so the V has an apex rather than two unrelated feet.
    for (const side of [-1, 1]) {
      const hands: Joint = [handX, handY, side * splay];
      member(throat, hands, 0.05, 0.055, timber, 0.04);
      // The grip across the top of each, turned.
      const gripBar = new THREE.CylinderGeometry(0.028, 0.028, 0.14, 6);
      gripBar.rotateX(Math.PI / 2);
      gripBar.translate(hands[0], hands[1], hands[2]);
      add(gripBar, frame);
      // A stay from the beam down to the middle of each stilt — what makes it
      // a frame rather than three sticks sharing a corner. Both its ends are
      // points on members already drawn, so it cannot be adrift.
      const onBeam: Joint = [
        throat[0] + (hitch[0] - throat[0]) * 0.42,
        throat[1] + (hitch[1] - throat[1]) * 0.42,
        0,
      ];
      const onStilt: Joint = [
        throat[0] + (hands[0] - throat[0]) * 0.5,
        throat[1] + (hands[1] - throat[1]) * 0.5,
        (hands[2] as number) * 0.5,
      ];
      member(onBeam, onStilt, 0.04, 0.045, frame, 0.03);
    }

    // --- the iron ------------------------------------------------------------
    //
    // The sole: a flat bar lying along the ground under the head, running from
    // behind the stilts' foot forward to the share. Long, because the sole is
    // what the whole implement rides on and a short one makes it look tipped.
    const soleLong = 0.7 * size;
    const soleBar = new THREE.BoxGeometry(soleLong, 0.05, 0.11);
    soleBar.translate(sole[0] + soleLong * 0.28, sole[1] - 0.01, 0);
    add(soleBar, iron);

    // The share: the point, on the front of the sole and low. Its base is let
    // into the sole bar's front end rather than set beyond it.
    const point = 0.34 * size;
    const nose = sole[0] + soleLong * 0.28 + soleLong / 2;
    const share = new THREE.ConeGeometry(0.115 * size, point, 4);
    share.rotateZ(-Math.PI / 2);
    share.scale(1, 1, 0.5);
    share.translate(nose + point * 0.4, sole[1], 0);
    add(share, bright);

    // The mouldboard: the plate that turns the furrow over. It stands **on the
    // sole and against the head**, sloping up and back — a long shallow twist,
    // not a paddle. Both of its lower edges have something to be against, which
    // is what makes it read as fixed rather than propped.
    const boardLong = 0.52 * size;
    const boardH = 0.3 * size;
    const board = new THREE.BoxGeometry(boardLong, boardH, 0.035);
    board.rotateZ(0.18);
    board.rotateX(-0.72);
    board.translate(sole[0] + boardLong * 0.34, sole[1] + boardH * 0.34, 0.075 * size);
    add(board, iron);

    // The hitch ring at the end of the beam, standing in the beam's own line.
    const ring = new THREE.TorusGeometry(0.055, 0.016, 4, 8);
    ring.rotateY(Math.PI / 2);
    ring.translate(hitch[0] + 0.03, hitch[1], 0);
    add(ring, iron);

    // **The list.** Applied to the whole frame at once, about the sole, so the
    // plough comes to rest on one stilt the way a parked one does and every
    // joint in it stays a joint.
    const tip = rng.range(0.12, 0.28) * (rng.chance(0.5) ? 1 : -1);
    const lift = rng.around(0, 0.05);
    built.forEach((geometry, i) => {
      geometry.rotateX(tip);
      geometry.rotateZ(lift);
      parts.push({ geometry, color: tint[i], sway: 0 });
    });

    // **Nothing under it.** There were two ridges of turned earth beneath the
    // share, on the reasoning that a plough left in a field is left in the
    // furrow it stopped in. That is dressing a scene: it decides the ground this
    // object is standing on, in a world where the ground is placed by hand. If a
    // field wants a furrow, the field gets one.

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'plough', 0);
  },
};
