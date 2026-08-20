import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A swing plough, left standing at the end of a furrow. A plough is a rigid
// frame, so this names its four joints first — `sole` on the ground at the back
// of the share, `throat` low and forward, `hitch` high and forward, `hands` high
// and back — and draws each member between two of them, overlapping each end so
// the joints are lapped rather than butted. Nothing has a position of its own.
//
// Three lines have to read at thirty metres: the beam running forward and up, the
// stilts in a clear V, and the share in bright metal at the bottom. It leans,
// because a plough parked on its own falls onto one stilt; the list is applied to
// the whole frame at the end, so the frame stays a frame.

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
    // Proportioned off one length, so a big plough is a big plough all over. The
    // three that matter to the silhouette are the beam's rise (shallow — a plough
    // beam is nearly level), the stilts' reach back, and how far the head stands in
    // front of the throat.
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
     * A member between two joints: built along its own length and turned onto the
     * line, with `lap` added at each end so it runs into whatever it meets. A frame
     * whose members merely touch shows daylight at every joint once anything turns.
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
    // The sole: a flat bar lying along the ground under the head, from behind the
    // stilts' foot forward to the share. Long, because the sole is what the whole
    // implement rides on and a short one makes it look tipped.
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

    // The mouldboard: the plate that turns the furrow over. It stands on the sole
    // and against the head, sloping up and back in a long shallow twist — both of
    // its lower edges have something to be against, which is what makes it read as
    // fixed rather than propped.
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


    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'plough', 0);
  },
};
