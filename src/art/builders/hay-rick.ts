import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A hay rick: the year's crop stacked, thatched and left standing — a landmark
// first and a blocker second. Three details carry it: a staddle frame holding it
// off the ground, so there is a shadow gap under the eaves; an overhang, because
// hay is thrown up and trodden and the sides bulge as it settles; and a thatched
// cap at a different colour and pitch. Turned from a closed profile rather than
// stacked from cylinders, which would bury coincident end caps at every join.
export const hayRick: MeshBuilder = {
  name: 'hay-rick',
  category: 'objects',
  radius: 2.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const radius = rng.range(1.25, 1.85);
    const body = rng.range(1.6, 2.5);
    const cap = body * rng.range(0.45, 0.7);
    const sides = rng.int(8, 10);
    const straw = shade(PALETTE.GRASS_DRY, rng.range(1.02, 1.16));
    const thatch = shade(PALETTE.GRASS_DRY, rng.range(0.82, 0.95));
    const timber = shade(PALETTE.TIMBER_DARK, rng.range(0.9, 1.05));
    const staddle = rng.range(0.16, 0.28);

    // --- the staddle ---------------------------------------------------------
    // Sleepers under the stack, laid across and kept well inside the eaves, so they
    // read as a frame the rick sits on rather than a plinth it stands in.
    const beams = rng.int(3, 4);
    for (let i = 0; i < beams; i++) {
      const at = ((i + 0.5) / beams - 0.5) * radius * 1.5;
      const beam = new THREE.BoxGeometry(radius * rng.range(1.5, 1.7), staddle, rng.range(0.14, 0.2));
      beam.translate(0, staddle / 2, at);
      beam.rotateY(rng.around(0, 0.04));
      parts.push({ geometry: beam, color: shade(timber, rng.around(1, 0.07)), sway: 0 });
    }
    // Stones under the corners, which is what a staddle actually rests on.
    for (let i = rng.int(2, 4); i > 0; i--) {
      const around = rng.range(0, Math.PI * 2);
      const out = radius * rng.range(0.55, 0.85);
      const pad = new THREE.CylinderGeometry(rng.range(0.14, 0.22), rng.range(0.16, 0.26), staddle * 1.2, 6);
      pad.translate(Math.cos(around) * out, staddle * 0.3, Math.sin(around) * out);
      parts.push({ geometry: pad, color: shade(PALETTE.STONE_DARK, rng.around(1, 0.08)), sway: 0 });
    }

    // --- the stack -----------------------------------------------------------
    // Bulging outward above the base and drawn back in under the eaves, widest
    // about a third of the way up.
    const foot = staddle;
    const shoulder = radius * rng.range(1.06, 1.16);
    const profile = [
      new THREE.Vector2(0, foot),
      new THREE.Vector2(radius * rng.range(0.9, 0.97), foot),
      new THREE.Vector2(shoulder, foot + body * rng.range(0.3, 0.42)),
      new THREE.Vector2(radius * rng.range(0.94, 1.02), foot + body * 0.78),
      new THREE.Vector2(radius * rng.range(0.82, 0.9), foot + body),
    ];
    parts.push({
      geometry: new THREE.LatheGeometry(profile, sides),
      color: (_x, y) => shade(straw, 0.9 + Math.min(1, (y - foot) / Math.max(body, 0.1)) * 0.18),
      sway: 0,
    });

    // --- the thatch ----------------------------------------------------------
    // Steeper than the body and standing proud of it, so there is an eave for rain
    // to come off. A cap flush with the sides is a lid.
    const eave = radius * rng.range(1.02, 1.12);
    const roof = [
      new THREE.Vector2(0, foot + body - 0.05),
      new THREE.Vector2(eave, foot + body),
      new THREE.Vector2(eave * rng.range(0.5, 0.62), foot + body + cap * 0.45),
      new THREE.Vector2(0, foot + body + cap),
    ];
    parts.push({ geometry: new THREE.LatheGeometry(roof, sides), color: thatch, sway: 0 });

    // Ropes over the thatch, weighted at the ends. What holds a rick's cap on in
    // a gale, and the one detail that says somebody has to come back to this.
    for (let i = rng.int(2, 4); i > 0; i--) {
      const around = rng.range(0, Math.PI * 2);
      const rope = new THREE.CylinderGeometry(0.018, 0.018, cap * rng.range(0.9, 1.15), 3);
      rope.rotateZ(rng.range(0.5, 0.85));
      rope.rotateY(around);
      rope.translate(0, foot + body + cap * rng.range(0.4, 0.6), 0);
      parts.push({ geometry: rope, color: shade(PALETTE.HIDE, 0.85), sway: 0 });
    }

    // A pole leaning against it. Not decoration — it is the thing that says the
    // rick has a working height, which is what makes it read as four metres
    // rather than as a small object seen close up.
    if (rng.chance(0.6)) {
      const long = (body + cap) * rng.range(0.85, 1.05);
      const pole = new THREE.CylinderGeometry(0.035, 0.05, long, 5);
      pole.translate(0, long / 2, 0);
      pole.rotateZ(rng.range(0.3, 0.45));
      pole.rotateY(rng.range(0, Math.PI * 2));
      pole.translate(0, 0, 0);
      parts.push({ geometry: pole, color: shade(PALETTE.TIMBER, rng.around(1, 0.07)), sway: 0 });
    }


    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hay-rick', 0);
  },
};
