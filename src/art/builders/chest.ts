import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A storage chest: boarded body, iron straps, a hasp, and a lid that may be
// standing open. A third are open far enough to see into, and those get folded
// cloth inside. The lid is built in the hinge's own frame — origin on the hinge
// pin at the top of the back board, y up and z forward — and rotated into place as
// a unit. Domed lids are stepped boards. Built facing +Z, hinged along its −Z edge.
export const chest: MeshBuilder = {
  name: 'chest',
  category: 'furniture',
  radius: 0.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(0.82, 1.08);
    const depth = rng.range(0.44, 0.56);
    const footHeight = rng.range(0.04, 0.075);
    const bodyHeight = rng.range(0.3, 0.4);
    const lidHeight = rng.range(0.055, 0.075);
    const domed = rng.chance(0.45);

    const timber = rng.chance(0.5) ? PALETTE.TIMBER_DARK : PALETTE.BARK_PALE;
    const iron = shade(PALETTE.IRON, rng.range(0.82, 1.0));
    const rust = rng.chance(0.35);
    const banding = rust ? PALETTE.RUST : iron;

    // How far the lid is thrown back, in radians about the hinge. Three states
    // rather than a continuous roll: a chest an eighth open is a closed one with a
    // defect, where a lid at a right angle is a different silhouette.
    const roll = rng();
    // Always shut. A chest with its lid up is a scene, and a prop that stages a
    // scene stops being placeable — you cannot put twenty of them in a village.
    // `roll` is still drawn, so the seed stream is unchanged.
    void roll;
    const open = 0;

    const bodyBase = footHeight;
    const bodyTop = bodyBase + bodyHeight;

    // --- feet -----------------------------------------------------------------
    // Corner blocks, each its own size. Four identical blocks at four mirrored
    // positions is the furniture trap: nudge one onto another's plane and the weld
    // makes edges nobody wrote. Jittering removes the possibility.
    const runners = rng.chance(0.35);
    if (runners) {
      // Two runners front and back instead — a chest meant to be dragged.
      for (const sz of [-1, 1]) {
        const runner = new THREE.BoxGeometry(
          width * rng.range(0.92, 0.97),
          footHeight + 0.015,
          depth * 0.16,
        );
        runner.translate(0, (footHeight + 0.015) / 2, (sz * (depth - depth * 0.16)) / 2);
        parts.push({ geometry: runner, color: shade(timber, 0.85), sway: 0 });
      }
    } else {
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const w = rng.range(0.075, 0.1);
          const foot = new THREE.BoxGeometry(w, footHeight + 0.015, w * rng.range(0.9, 1.1));
          foot.translate(
            (sx * (width - w)) / 2,
            (footHeight + 0.015) / 2,
            (sz * (depth - w)) / 2,
          );
          parts.push({ geometry: foot, color: shade(timber, 0.85), sway: 0 });
        }
      }
    }

    // --- body -----------------------------------------------------------------
    const body = new THREE.BoxGeometry(width, bodyHeight, depth);
    body.translate(0, bodyBase + bodyHeight / 2, 0);
    parts.push({ geometry: body, color: timber, sway: 0 });

    // Corner stiles, standing proud. A boarded chest has its uprights on the
    // outside holding the boards; this is one of the two things that separate a
    // chest from a crate, the other being the ironwork.
    const stileW = rng.range(0.05, 0.07);
    for (const sx of [-1, 1]) {
      const stile = new THREE.BoxGeometry(
        stileW * rng.range(0.95, 1.05),
        bodyHeight * 1.02,
        depth * 1.03,
      );
      stile.translate((sx * (width - stileW * 0.5)) / 2, bodyBase + bodyHeight / 2, 0);
      parts.push({ geometry: stile, color: shade(timber, 0.8), sway: 0 });
    }

    // --- ironwork on the body -------------------------------------------------
    const strapCount = rng.int(2, 3);
    const strapSpread = width * rng.range(0.5, 0.66);
    const strapX: number[] = [];
    for (let i = 0; i < strapCount; i++) {
      const x =
        strapCount === 1 ? 0 : -strapSpread / 2 + (i / (strapCount - 1)) * strapSpread;
      strapX.push(x);
      for (const sz of [-1, 1]) {
        const strap = new THREE.BoxGeometry(
          rng.range(0.035, 0.055),
          bodyHeight * rng.range(0.96, 1.02),
          0.014,
        );
        strap.translate(x, bodyBase + bodyHeight / 2, (sz * (depth + 0.012)) / 2);
        parts.push({ geometry: strap, color: banding, sway: 0 });
      }
    }

    // A band right round the body under the lid, on some. Cheap, and it draws
    // the line the eye uses to find the join.
    if (rng.chance(0.5)) {
      const band = new THREE.BoxGeometry(width * 1.02, rng.range(0.026, 0.038), depth * 1.02);
      band.translate(0, bodyTop - 0.035, 0);
      parts.push({ geometry: band, color: shade(banding, 0.9), sway: 0 });
    }

    // The lock plate stays on the *body*. The hasp that drops over it belongs
    // to the lid and swings with it — which is the whole reason for splitting
    // a lock into two parts instead of drawing one.
    const lockW = rng.range(0.07, 0.1);
    const lock = new THREE.BoxGeometry(lockW, lockW * rng.range(1.0, 1.35), 0.016);
    lock.translate(0, bodyTop - lockW * 0.75, depth / 2 + 0.006);
    parts.push({ geometry: lock, color: shade(banding, 1.15), sway: 0 });

    const keyhole = new THREE.BoxGeometry(0.012, 0.022, 0.008);
    keyhole.translate(0, bodyTop - lockW * 0.75, depth / 2 + 0.016);
    parts.push({ geometry: keyhole, color: PALETTE.IRON_DARK, sway: 0 });

    // --- contents, if you can see them ----------------------------------------
    if (open > 0.5) {
      const layers = rng.int(2, 3);
      let fill = bodyTop - rng.range(0.05, 0.11);
      for (let i = 0; i < layers; i++) {
        const t = rng.range(0.03, 0.055);
        const cloth = new THREE.BoxGeometry(
          width * rng.range(0.6, 0.82),
          t,
          depth * rng.range(0.55, 0.78),
        );
        cloth.translate(rng.around(0, width * 0.08), fill - t / 2, rng.around(0, depth * 0.06));
        cloth.rotateY(rng.around(0, 0.15));
        parts.push({
          geometry: cloth,
          color: rng.pick([PALETTE.CLOTH, PALETTE.WOOL, PALETTE.LEAF_DARK, PALETTE.HIDE_PALE]),
          sway: 0,
        });
        fill -= t * rng.range(0.75, 0.95);
      }
    }

    // --- the lid --------------------------------------------------------------
    // Authored about the hinge: y is height above the pin, z is distance forward
    // from it. Nothing below knows how far the lid is open.
    const hingeY = bodyTop - 0.012;
    const hingeZ = -depth / 2 + 0.025;
    const lidReach = depth - 0.025 + 0.02;
    const addLid = (geometry: THREE.BufferGeometry, color: number): void => {
      geometry.rotateX(-open);
      geometry.translate(0, hingeY, hingeZ);
      parts.push({ geometry, color, sway: 0 });
    };

    if (domed) {
      // Three stepped boards. Each is narrower and taller than the one under
      // it and overlaps it, so the stack is a staircase of closed solids rather
      // than a single shell with seams in it.
      const steps = 3;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const slab = new THREE.BoxGeometry(
          width * (1.03 - t * 0.22) * rng.range(0.99, 1.01),
          lidHeight * 0.62,
          (lidReach + 0.03) * (1.0 - t * 0.26),
        );
        slab.translate(0, t * lidHeight * 0.52 + lidHeight * 0.2, lidReach / 2 - 0.005);
        addLid(slab, shade(timber, 1.05 + i * 0.04));
      }
    } else {
      const slab = new THREE.BoxGeometry(width * 1.03, lidHeight, lidReach + 0.03);
      slab.translate(0, lidHeight / 2, lidReach / 2 - 0.005);
      addLid(slab, shade(timber, 1.06));
    }

    // Lid straps, lined up with the body straps so they read as continuous when
    // the chest is shut.
    for (const x of strapX) {
      const strap = new THREE.BoxGeometry(
        rng.range(0.035, 0.055),
        lidHeight * (domed ? 1.5 : 1.05),
        lidReach * rng.range(0.86, 0.96),
      );
      strap.translate(x, lidHeight * (domed ? 0.75 : 0.5), lidReach * 0.48);
      addLid(strap, banding);
    }

    // The hasp: a tongue on the front lip of the lid that hangs down over the
    // lock plate. Closed it covers the keyhole; open it points at the ceiling.
    const hasp = new THREE.BoxGeometry(lockW * 0.55, lockW * 1.15, 0.014);
    hasp.translate(0, lidHeight * 0.35 - lockW * 0.4, lidReach + 0.012);
    addLid(hasp, shade(banding, 1.2));

    // Hinge pins, on the axis they actually turn about.
    for (const x of [-width * 0.3, width * 0.3]) {
      const pin = new THREE.CylinderGeometry(0.014, 0.014, rng.range(0.05, 0.07), 6);
      pin.rotateZ(Math.PI / 2);
      pin.translate(x, hingeY, hingeZ - 0.006);
      parts.push({ geometry: pin, color: shade(banding, 0.92), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'chest', 0);
  },
};
