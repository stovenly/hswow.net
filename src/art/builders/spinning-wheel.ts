import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * A spinning wheel: drive wheel, treadle, flyer, and usually a distaff.
 *
 * **The one circle in the house.** Every other thing in a hut is made of
 * rectangles — boards, boxes, planks, posts — and the render pipeline's
 * quantization is unkind to fine detail but very kind indeed to a big clean
 * outline. A wheel two feet across, drawn as a ring with light through the
 * spokes, is legible from across a room at three pixels a block when a chest
 * beside it has collapsed into a brown lump.
 *
 * It is also the piece that puts something at *working* height without being
 * another table: the bench sits at about knee height and the wheel rises to a
 * metre, so the mass is low and the interest is high, which is the opposite of
 * everything else in the set.
 *
 * **Built between named points throughout.** A spinning wheel is a machine —
 * the footman reaches from a treadle on the floor to a crank on a turning axle,
 * the drive band runs from the rim to a pulley two feet away, the legs meet a
 * bench that is not level — and every one of those is a join that a rotate-then-
 * translate would miss by a centimetre in a direction nobody can predict. `rod`
 * takes two points, so there is nothing left to get wrong. The bench slope is
 * the reason it matters here more than usual: with the bench tilted, *no* two
 * fixings are at the same height and a hand-written constant is wrong for all
 * of them.
 *
 * Built with the wheel toward +X and the flyer toward -X, standing on y = 0.
 */
export const spinningWheel: MeshBuilder = {
  name: 'spinning-wheel',
  category: 'furniture',
  radius: 0.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const length = rng.range(0.62, 0.78);
    const benchW = rng.range(0.13, 0.17);
    const benchT = rng.range(0.038, 0.05);
    // The bench slopes down toward the wheel. Small — it is a Saxony wheel's
    // one piece of character and at more than about seven degrees it reads as
    // furniture that has been dropped.
    const tilt = rng.range(0.05, 0.12);
    const benchMid = rng.range(0.42, 0.48);
    /** Height of the bench's top surface at a given x. Everything fixes to this. */
    const benchTop = (x: number): number => benchMid - x * Math.tan(tilt);

    const timber = rng.chance(0.5) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK;
    const turned = timber === PALETTE.TIMBER ? PALETTE.TIMBER_DARK : PALETTE.TIMBER_PALE;
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));

    const bench = new THREE.BoxGeometry(length / Math.cos(tilt), benchT, benchW);
    bench.rotateZ(-tilt);
    bench.translate(0, benchMid - (benchT * Math.cos(tilt)) / 2, 0);
    parts.push({ geometry: bench, color: timber, sway: 0 });

    // --- three legs -----------------------------------------------------------
    //
    // Three, not four, and for the reason a milking stool has three: a wheel
    // that rocks with every press of the treadle is a wheel nobody can spin on.
    // Each foot is splayed away from the bench's centre, and each leg is its
    // own thickness — four identical turned legs at mirrored positions is the
    // furniture trap, and it costs nothing to sidestep.
    // x, z, and the direction the foot is thrown out in.
    const legs: Array<[number, number, number, number]> = [
      [length * 0.32, benchW * 0.38, 0.34, 0.94],
      [length * 0.32, -benchW * 0.38, 0.34, -0.94],
      [-length * 0.36, rng.around(0, 0.015), -1, 0],
    ];
    for (const [lx, lz, outX, outZ] of legs) {
      const splay = rng.range(0.05, 0.09);
      const top = new THREE.Vector3(lx, benchTop(lx) - 0.018, lz);
      const foot = new THREE.Vector3(lx + outX * splay, 0, lz + outZ * splay);
      parts.push({
        geometry: rod(foot, top, rng.range(0.015, 0.019), rng.range(0.012, 0.016), 5),
        color: turned,
        sway: 0,
      });
    }

    // --- the drive wheel ------------------------------------------------------
    const radius = rng.range(0.2, 0.28);
    const wheelX = length * rng.range(0.28, 0.34);
    // Tall enough that the rim clears the bench it is mounted on. Shorter and
    // the wheel passes through its own frame, which is invisible until the
    // radius rolls large.
    const postH = radius * rng.range(1.04, 1.14);
    const hubHalf = rng.range(0.05, 0.065);
    const centre = new THREE.Vector3(wheelX, benchTop(wheelX) + postH, 0);

    for (const sz of [-1, 1]) {
      const at = sz * hubHalf;
      parts.push({
        geometry: rod(
          new THREE.Vector3(wheelX + rng.around(0, 0.006), benchTop(wheelX) - 0.02, at),
          new THREE.Vector3(centre.x, centre.y, at),
          rng.range(0.02, 0.026),
          rng.range(0.012, 0.016),
          5,
        ),
        color: turned,
        sway: 0,
      });
    }

    const axle = new THREE.CylinderGeometry(0.011, 0.011, hubHalf * 2 + 0.04, 5);
    axle.rotateX(Math.PI / 2);
    axle.translate(centre.x, centre.y, centre.z);
    parts.push({ geometry: axle, color: iron, sway: 0 });

    const hubR = rng.range(0.028, 0.036);
    const hub = new THREE.CylinderGeometry(hubR, hubR, rng.range(0.05, 0.07), 6);
    hub.rotateX(Math.PI / 2);
    hub.translate(centre.x, centre.y, centre.z);
    parts.push({ geometry: hub, color: turned, sway: 0 });

    // `TorusGeometry` already lies in the XY plane, which is the plane the wheel
    // turns in — so the rim needs no rotation at all, and a rotation here would
    // be one more thing that could be wrong by a quarter turn.
    const rim = new THREE.TorusGeometry(radius, rng.range(0.013, 0.019), 4, 14);
    rim.translate(centre.x, centre.y, centre.z);
    parts.push({ geometry: rim, color: timber, sway: 0 });

    const spokes = rng.int(6, 10);
    const phase = rng.range(0, Math.PI * 2);
    for (let i = 0; i < spokes; i++) {
      const a = phase + (i / spokes) * Math.PI * 2;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      // Starting on the hub's surface rather than at its centre. A dozen rods
      // sharing one origin point put a dozen cone caps through the same vertex,
      // and that is the "many parts, one origin" way of unsealing a mesh.
      parts.push({
        geometry: rod(
          new THREE.Vector3(centre.x + dx * hubR * 0.9, centre.y + dy * hubR * 0.9, 0),
          new THREE.Vector3(centre.x + dx * (radius - 0.005), centre.y + dy * (radius - 0.005), 0),
          rng.range(0.007, 0.009),
          rng.range(0.005, 0.007),
          4,
        ),
        color: turned,
        sway: 0,
      });
    }

    // --- treadle and footman --------------------------------------------------
    //
    // The linkage down to the floor. It is what stops the wheel looking like an
    // ornament: a machine that a person drives has to reach the person's foot.
    const treadleX = length * rng.range(0.06, 0.16);
    const treadleZ = rng.around(0, 0.025);
    const treadleLength = rng.range(0.2, 0.28);
    const treadle = new THREE.BoxGeometry(treadleLength, 0.02, rng.range(0.09, 0.13));
    treadle.rotateZ(rng.around(0, 0.07));
    treadle.translate(treadleX, rng.range(0.03, 0.045), treadleZ);
    parts.push({ geometry: treadle, color: timber, sway: 0 });

    const pivot = new THREE.BoxGeometry(0.03, 0.035, benchW * 1.1);
    pivot.translate(treadleX - treadleLength / 2, 0.02, treadleZ);
    parts.push({ geometry: pivot, color: shade(timber, 0.85), sway: 0 });

    // The crank, on the axle and off-centre — which is the whole mechanism.
    const crankA = rng.range(0, Math.PI * 2);
    const crankR = rng.range(0.028, 0.042);
    parts.push({
      geometry: rod(
        new THREE.Vector3(treadleX + treadleLength * 0.36, 0.05, treadleZ + 0.02),
        new THREE.Vector3(
          centre.x + Math.cos(crankA) * crankR,
          centre.y + Math.sin(crankA) * crankR,
          hubHalf + 0.02,
        ),
        0.008,
        0.007,
        4,
      ),
      color: turned,
      sway: 0,
    });

    // --- flyer end ------------------------------------------------------------
    const motherX = -length * rng.range(0.26, 0.34);
    const motherY = benchTop(motherX);
    const block = new THREE.BoxGeometry(rng.range(0.09, 0.12), 0.05, rng.range(0.06, 0.08));
    block.translate(motherX, motherY + 0.015, 0);
    parts.push({ geometry: block, color: shade(timber, 1.06), sway: 0 });

    const maidenH = rng.range(0.11, 0.15);
    const spindleY = motherY + 0.03 + maidenH;
    const maidenSpread = rng.range(0.06, 0.085);
    for (const sx of [-1, 1]) {
      const foot = new THREE.Vector3(motherX + sx * maidenSpread, motherY + 0.01, 0);
      parts.push({
        geometry: rod(
          foot,
          new THREE.Vector3(foot.x, spindleY, 0),
          rng.range(0.015, 0.019),
          rng.range(0.009, 0.012),
          5,
        ),
        color: turned,
        sway: 0,
      });
    }

    parts.push({
      geometry: rod(
        new THREE.Vector3(motherX - maidenSpread, spindleY, 0),
        new THREE.Vector3(motherX + maidenSpread + 0.05, spindleY + 0.004, 0),
        0.007,
        0.006,
        4,
      ),
      color: iron,
      sway: 0,
    });

    // The bobbin, with yarn on it. Wound bobbins are pale and the wood is not,
    // which is the only reason anyone can tell the wheel is in use.
    const bobbin = new THREE.CylinderGeometry(rng.range(0.02, 0.028), rng.range(0.02, 0.028), 0.07, 7);
    bobbin.rotateZ(Math.PI / 2);
    bobbin.translate(motherX, spindleY, 0);
    parts.push({
      geometry: bobbin,
      color: shade(rng.pick([PALETTE.WOOL, PALETTE.CLOTH, PALETTE.HIDE_PALE]), rng.range(0.95, 1.1)),
      sway: 0,
    });

    const whorlX = motherX + maidenSpread + 0.03;
    const whorlR = rng.range(0.026, 0.034);
    const whorl = new THREE.CylinderGeometry(whorlR, whorlR, 0.013, 8);
    whorl.rotateZ(Math.PI / 2);
    whorl.translate(whorlX, spindleY, 0);
    parts.push({ geometry: whorl, color: turned, sway: 0 });

    // --- drive band -----------------------------------------------------------
    //
    // Two straight runs, top and bottom, from rim to whorl. A band is a loop,
    // but the only parts of a loop anybody sees are its two straights — and a
    // pair of thin lines tying the big circle to the small one is what turns
    // two separate assemblies into one machine.
    for (const sy of [-1, 1]) {
      parts.push({
        geometry: rod(
          new THREE.Vector3(centre.x, centre.y + sy * radius, 0),
          new THREE.Vector3(whorlX, spindleY + sy * whorlR, 0),
          0.005,
          0.004,
          4,
        ),
        color: shade(PALETTE.CLOTH, 0.85),
        sway: 0,
      });
    }

    // --- distaff --------------------------------------------------------------
    //
    // The arm carrying the unspun flax, and the only thing that reaches above
    // the wheel. Roughly half get one, so a pair of wheels in a room are not
    // the same object twice.
    if (rng.chance(0.55)) {
      const armX = motherX - rng.range(0.08, 0.13);
      const armFoot = new THREE.Vector3(armX, benchTop(armX) - 0.01, rng.around(0, 0.02));
      const armTop = new THREE.Vector3(
        armX - rng.range(0.03, 0.09),
        benchTop(armX) + rng.range(0.42, 0.56),
        armFoot.z + rng.around(0, 0.05),
      );
      parts.push({
        geometry: rod(armFoot, armTop, rng.range(0.016, 0.021), rng.range(0.009, 0.013), 5),
        color: turned,
        sway: 0,
      });

      const flaxColor = rng.pick([PALETTE.WOOL, PALETTE.LEAF_DRY, PALETTE.CLOTH]);
      const tie = new THREE.CylinderGeometry(0.026, 0.022, 0.03, 6);
      tie.translate(armTop.x, armTop.y - 0.01, armTop.z);
      parts.push({ geometry: tie, color: PALETTE.CLOTH, sway: 0 });

      const strands = rng.int(4, 6);
      for (let i = 0; i < strands; i++) {
        const a = (i / strands) * Math.PI * 2 + rng.range(0, 0.5);
        const out = rng.range(0.03, 0.07);
        parts.push({
          geometry: rod(
            new THREE.Vector3(
              armTop.x + Math.cos(a) * 0.01,
              armTop.y - 0.02,
              armTop.z + Math.sin(a) * 0.01,
            ),
            new THREE.Vector3(
              armTop.x + Math.cos(a) * out,
              armTop.y + rng.range(0.05, 0.12),
              armTop.z + Math.sin(a) * out,
            ),
            rng.range(0.008, 0.013),
            rng.range(0.004, 0.007),
            4,
          ),
          color: shade(flaxColor, rng.range(0.88, 1.12)),
          sway: 0,
        });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'spinning-wheel', 0);
  },
};
