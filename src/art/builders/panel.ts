import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A control panel: a slate face with levers, gauges and knife switches.
 *
 * The place a person *stands* in a works. Everything else in the industrial kit
 * is machinery, storage or structure; this is the one object built to be
 * operated, and a room with one in it has somebody's job in it.
 *
 * **A flat slab bristling with angled arms.** That is the whole read, and it
 * matters that the levers are at *different* angles — a bank all thrown the
 * same way looks moulded, and half the point of a control panel is that it
 * records a state somebody left it in.
 *
 * The controls sit on a **grid**. Six kinds land in the cells at weighted
 * random — gauges and lamps high where they are read, switchgear low where it
 * is reached — so no two boards are alike while every board is plainly
 * drilled to a marked-out plate rather than grown.
 *
 * Built facing +Z, standing on y = 0 on its own plinth, so it works against a
 * wall and free in the middle of a floor alike. No random facing: this is a
 * thing you walk up to and it should face where it is put.
 */
export const panel: MeshBuilder = {
  name: 'panel',
  category: 'structures',
  radius: 0.9,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(1, 1.5);
    const faceH = rng.range(0.85, 1.15);
    const plinth = rng.range(0.35, 0.6);
    const depth = rng.range(0.18, 0.26);

    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    // Slate or enamelled iron, both of which a period switchboard was made of.
    const slate = rng.chance(0.5) ? 0x2f3338 : 0x3a3330;
    const brass = 0x9a7c3c;

    // --- plinth and frame ----------------------------------------------------
    const base = new THREE.BoxGeometry(width * 0.94, plinth, depth * 1.15);
    base.translate(0, plinth / 2, 0);
    parts.push({ geometry: base, color: shade(iron, 0.8), sway: 0 });

    // The face, raked back a little. A dead vertical panel in a room lit from
    // above is the darkest surface in view and loses every detail on it.
    const rake = rng.range(0.1, 0.2);
    const face = new THREE.BoxGeometry(width, faceH, depth * 0.5);
    face.rotateX(-rake);
    face.translate(0, plinth + faceH / 2, depth * 0.16);
    parts.push({ geometry: face, color: slate, sway: 0 });

    // A frame round it, proud on all four sides. Cast iron switchboards were
    // always framed, and it is what stops the slate reading as a hole.
    for (const [w, h, y] of [
      [width * 1.06, 0.06, plinth],
      [width * 1.06, 0.06, plinth + faceH],
    ] as const) {
      const rail = new THREE.BoxGeometry(w, h, depth * 0.62);
      rail.rotateX(-rake);
      rail.translate(0, y, depth * 0.16 + (y > plinth + 0.1 ? -faceH * rake * 0.5 : faceH * rake * 0.5));
      parts.push({ geometry: rail, color: iron, sway: 0 });
    }

    // --- the controls, on a grid --------------------------------------------
    //
    // **Laid out in rows and columns, not scattered.** Gauges were spread along
    // one line and levers along another, each at its own rolled height, which
    // gave a face that looked *grown*. Switchgear is drilled and bolted to a
    // marked-out plate: everything sits on a pitch, and that regularity is most
    // of what makes a panel read as manufactured rather than as an outcrop.
    //
    // The variety comes from *which* control lands in each cell, not from where
    // the cells are.
    const columns = rng.int(3, 5);
    const rows = rng.int(2, 3);
    const cellW = (width * 0.84) / columns;
    const cellH = (faceH * 0.78) / rows;

    /**
     * Where a cell's centre is, on the front of the raked face.
     *
     * **Taken from the face's own transform.** It was an approximation — the
     * height used straight and the depth nudged by a linear term in the rake —
     * and it did not follow the plate: controls near the top and bottom rows
     * hung off it into open air, which is the sort of thing that is obvious the
     * moment anyone looks and invisible in the code.
     *
     * The face is a box rotated about X by `-rake` and then moved. So a point
     * on its front surface is that same rotation applied to a local point, and
     * asking for it directly cannot disagree with where the plate actually is.
     */
    const faceMid = plinth + faceH / 2;
    const faceZ = depth * 0.16;
    const skin = depth * 0.25;
    const cell = (col: number, row: number): THREE.Vector3 => {
      const cx = -width * 0.42 + cellW * (col + 0.5);
      // Rows numbered from the top, which is how a board is read. Measured
      // from the middle of the plate, which is what the rotation turns about.
      const dy = faceH * 0.4 - cellH * (row + 0.5) + cellH * 0.5;
      return new THREE.Vector3(
        cx,
        faceMid + dy * Math.cos(rake) + skin * Math.sin(rake),
        faceZ - dy * Math.sin(rake) + skin * Math.cos(rake),
      );
    };

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const at = cell(col, row);
        // Weighted so a board is mostly gauges up top and mostly switchgear
        // below, which is how they were actually arranged — you read the dials
        // at eye level and reach the handles at chest height.
        const high = row === 0;
        const roll = rng();
        const kind = high
          ? roll < 0.6
            ? 'gauge'
            : roll < 0.8
              ? 'lamp'
              : 'dial'
          : roll < 0.4
            ? 'lever'
            : roll < 0.65
              ? 'knife'
              : roll < 0.85
                ? 'button'
                : 'dial';

        if (kind === 'gauge') {
          // Round, on a square face. The contrast is the point: a board of only
          // rectangles reads as a cupboard door.
          const r = Math.min(cellW, cellH) * 0.36;
          const bezel = new THREE.CylinderGeometry(r, r, depth * 0.3, 10);
          bezel.rotateX(Math.PI / 2 - rake);
          bezel.translate(at.x, at.y, at.z);
          parts.push({ geometry: bezel, color: brass, sway: 0 });

          const dial = new THREE.CylinderGeometry(r * 0.76, r * 0.76, depth * 0.34, 10);
          dial.rotateX(Math.PI / 2 - rake);
          dial.translate(at.x, at.y, at.z + depth * 0.04);
          parts.push({ geometry: dial, color: 0xd8d2be, sway: 0 });

          const swing = rng.range(-1.1, 1.1);
          const needle = new THREE.BoxGeometry(r * 0.09, r * 1.25, depth * 0.12);
          needle.translate(0, r * 0.5, 0);
          needle.rotateZ(swing);
          needle.rotateX(-rake);
          needle.translate(at.x, at.y, at.z + depth * 0.1);
          parts.push({ geometry: needle, color: 0x241f1c, sway: 0 });
        } else if (kind === 'lamp') {
          // An indicator: a small domed lens in a collar. Coloured, and the
          // only warm thing on an otherwise cold face.
          const r = Math.min(cellW, cellH) * 0.18;
          const collar = new THREE.CylinderGeometry(r * 1.5, r * 1.5, depth * 0.26, 8);
          collar.rotateX(Math.PI / 2 - rake);
          collar.translate(at.x, at.y, at.z);
          parts.push({ geometry: collar, color: shade(iron, 0.9), sway: 0 });

          const lens = new THREE.ConeGeometry(r * 1.15, r * 1.5, 8);
          lens.rotateX(Math.PI / 2 - rake);
          lens.translate(at.x, at.y, at.z + depth * 0.14);
          parts.push({
            geometry: lens,
            color: rng.chance(0.5) ? 0xb8402c : 0x9aa83a,
            sway: 0,
          });
        } else if (kind === 'dial') {
          // A rotary selector: a knurled knob with a pointer off it.
          const r = Math.min(cellW, cellH) * 0.22;
          const boss = new THREE.CylinderGeometry(r, r, depth * 0.4, 8);
          boss.rotateX(Math.PI / 2 - rake);
          boss.translate(at.x, at.y, at.z + depth * 0.08);
          parts.push({ geometry: boss, color: shade(iron, 1.18), sway: 0 });

          const point = new THREE.BoxGeometry(r * 0.24, r * 1.5, depth * 0.16);
          point.translate(0, r * 0.7, 0);
          point.rotateZ(rng.range(-2.4, 2.4));
          point.rotateX(-rake);
          point.translate(at.x, at.y, at.z + depth * 0.22);
          parts.push({ geometry: point, color: brass, sway: 0 });
        } else if (kind === 'button') {
          // A row of three push buttons in the cell, which is how they come.
          for (let i = 0; i < 3; i++) {
            const r = Math.min(cellW, cellH) * 0.11;
            const bx = at.x + (i - 1) * cellW * 0.26;
            const cap = new THREE.CylinderGeometry(r, r * 1.2, depth * 0.34, 8);
            cap.rotateX(Math.PI / 2 - rake);
            cap.translate(bx, at.y, at.z + depth * 0.06);
            parts.push({
              geometry: cap,
              color: i === 0 ? 0x9aa83a : i === 2 ? 0xb8402c : shade(iron, 1.2),
              sway: 0,
            });
          }
        } else if (kind === 'knife') {
          // A knife switch: a hinged blade between two brass posts, thrown open
          // or closed. Flat and angular against all the round things.
          const w = cellW * 0.34;
          for (const side of [-1, 1]) {
            const post = new THREE.BoxGeometry(w * 0.34, cellH * 0.16, depth * 0.34);
            post.rotateX(-rake);
            post.translate(at.x + side * w, at.y - cellH * 0.12, at.z + depth * 0.06);
            parts.push({ geometry: post, color: brass, sway: 0 });
          }
          const thrown = rng.chance(0.5);
          const blade = new THREE.BoxGeometry(w * 2.2, cellH * 0.1, depth * 0.16);
          blade.rotateZ(thrown ? 0 : rng.range(0.6, 1));
          blade.rotateX(-rake);
          blade.translate(at.x, at.y - cellH * (thrown ? 0.12 : -0.05), at.z + depth * 0.14);
          parts.push({ geometry: blade, color: shade(brass, 1.15), sway: 0 });
        } else {
          // A lever, on its own quadrant. Each thrown independently — a bank all
          // at one angle is a moulding, and half the point of a control panel is
          // that it records a state somebody left it in.
          const long = cellH * rng.range(0.55, 0.85);
          const thrown = rng.range(-0.9, 0.9);

          const arm = new THREE.CylinderGeometry(0.013, 0.018, long, 5);
          arm.translate(0, long / 2, 0);
          arm.rotateZ(thrown);
          arm.rotateX(-rake - 0.85);
          arm.translate(at.x, at.y - cellH * 0.2, at.z + depth * 0.06);
          parts.push({ geometry: arm, color: shade(iron, 1.15), sway: 0 });

          const knob = new THREE.IcosahedronGeometry(0.03, 0);
          knob.translate(
            at.x + Math.sin(thrown) * -long,
            at.y - cellH * 0.2 + Math.cos(thrown) * long * 0.66,
            at.z + depth * 0.06 + long * 0.7,
          );
          parts.push({ geometry: knob, color: rng.chance(0.5) ? PALETTE.RUST : brass, sway: 0 });
        }
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'panel', 0, 'metal-solid');
  },
};
