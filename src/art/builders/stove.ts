import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { FLAME_DECAY } from '../flame';

/**
 * A small wood-burning stove: a cast-iron box on legs, with a flue going up.
 *
 * The third fire in the kit and the one that has to work hardest not to be
 * mistaken for the other two. `forge` is a works hearth — a brick mass under a
 * sheet-metal hood, waist-high and a metre and a half across. `fireplace` is
 * masonry set into a wall. This is a **piece of furniture**: it stands clear of
 * everything, you can walk round it, and it is small enough that its whole
 * silhouette fits between a chair and a table without either of them looking
 * wrong.
 *
 * Four things do that work, and all four are the opposite of the forge:
 *
 * - **Legs.** A fire raised off the floor on four short legs cannot be a hearth;
 *   a hearth is a mass sitting on the ground. This is the single strongest tell
 *   and it costs eighty triangles.
 * - **A flat top, and nothing above it.** No hood, no funnel, no taper. The
 *   forge's whole silhouette is a wide-to-narrow transition, so anything with
 *   one reads as a smaller forge. A stove is a box with a lid you could stand a
 *   kettle on.
 * - **A thin flue leaving the top of the box directly.** Not a chimney it stands
 *   under — a pipe it carries.
 * - **Enamel, sometimes.** Cast iron black, cream, deep green or oxblood. A
 *   works has no painted objects in it at all; a painted stove is domestic
 *   before you have looked at its shape.
 *
 * ## The glass is a hole, as usual
 *
 * The door has a glass front, and there is no transparency in this kit — one
 * shared `MeshLambertMaterial`, vertex colours, no alpha. So the glass is not
 * there: what is built is a cast frame around a rectangular gap, with a panel
 * behind it painted the fire's own colour and additive glow in between. The same
 * answer the lantern reached, for the same reason. The eye supplies the glass
 * because the frame implies it, and the fire shows through, which is the only
 * thing that makes it a stove rather than an iron box.
 *
 * Built facing **+Z**, standing on y = 0.
 */

/**
 * Modest. It is a small fire behind a small pane of glass and most of its
 * output goes up the flue as heat — a stove lights the hearthrug and the legs of
 * whoever is sitting nearest, and that is the whole effect worth having.
 *
 * Uses `FLAME_DECAY` rather than the physical exponent for the reason written
 * out in `art/flame`: at inverse-square, a light this close to something you can
 * crouch in front of blows the near field onto one quantization level.
 */
const LIGHT_INTENSITY = 3.4;
const LIGHT_RANGE = 12;

/** What the fire behind the glass looks like, and what it casts. */
const FIREBOX = 0xff8f42;
const FIREBOX_LIGHT = 0xff8a3c;

/** Enamels, and plain black. Rolled per stove. */
const FINISHES = [
  PALETTE.IRON_DARK,
  0x25282a,
  // Cream, deep green, oxblood. Deliberately far apart in hue rather than in
  // brightness: the render pipeline quantizes per channel, so colours that
  // differ only in value collapse into each other and the variety disappears.
  0xd6cdb4,
  0x33503f,
  0x6b2f28,
] as const;

export const stove: MeshBuilder = {
  name: 'stove',
  category: 'furniture',
  radius: 0.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    const bodyW = rng.range(0.4, 0.56);
    const bodyD = rng.range(0.33, 0.46);
    const bodyH = rng.range(0.44, 0.6);
    const legH = rng.range(0.1, 0.18);
    const bodyY = legH + bodyH / 2;
    const front = bodyD / 2;

    const enamel = shade(rng.pick(FINISHES), rng.range(0.92, 1.08));
    // The castings — door frame, hinges, top lip — stay iron whatever the body
    // is painted, because they are the parts that get handled and scoured.
    const iron = shade(PALETTE.IRON, rng.range(0.82, 1.02));

    // How hard it is being run. Drives the glass, the glow and the light.
    const heat = rng.range(0.35, 1);

    // --- legs ----------------------------------------------------------------
    //
    // Splayed a little, and each at its own radius. Four identical cylinders at
    // four mirrored positions would be fine geometrically, but a stove is a
    // casting and castings are never quite square — and a metre away, the only
    // thing telling you these are legs rather than a plinth is that you can see
    // between them.
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const top = rng.range(0.032, 0.042);
        const leg = new THREE.CylinderGeometry(top, top * rng.range(1.15, 1.4), legH * 1.12, 5);
        // Leaning outward at the foot. It also means no two legs are parallel,
        // so the group never lines up into a fence.
        leg.rotateZ(sx * -0.08);
        leg.rotateX(sz * 0.08);
        leg.translate((sx * (bodyW - top * 3)) / 2, (legH * 1.12) / 2, (sz * (bodyD - top * 3)) / 2);
        parts.push({ geometry: leg, color: iron, sway: 0 });
      }
    }

    // --- the body ------------------------------------------------------------
    //
    // One box. The legs sink into it rather than meeting its underside, so the
    // joints are solids overlapping — boxes and cylinders that butt exactly
    // share edges between four triangles, which is a hole to every test of the
    // solid and z-fights where it shows.
    const body = new THREE.BoxGeometry(bodyW, bodyH, bodyD);
    body.translate(0, bodyY, 0);
    parts.push({ geometry: body, color: enamel, sway: 0 });

    // An ash lip along the bottom of the front, which is the one bit of relief
    // on an otherwise plain box and stops the door reading as painted on.
    const lip = new THREE.BoxGeometry(bodyW * 1.04, 0.045, bodyD * 0.24);
    lip.translate(0, legH + 0.035, front * rng.range(0.9, 1.02));
    parts.push({ geometry: lip, color: shade(iron, 0.9), sway: 0 });

    // --- the top -------------------------------------------------------------
    //
    // Proud of the body on every side and flat. This is the surface a kettle
    // goes on and it is what makes the thing read as furniture rather than as
    // masonry — a forge's hearth plate is *inside* a kerb, this one overhangs.
    const topT = rng.range(0.028, 0.04);
    const topPlate = new THREE.BoxGeometry(bodyW + 0.055, topT, bodyD + 0.05);
    topPlate.translate(0, legH + bodyH - topT * 0.35, 0);
    parts.push({ geometry: topPlate, color: shade(iron, 1.06), sway: 0 });

    // A raised rail round three sides of the top, so things do not slide off the
    // back. Open at the front, which is the side you reach over.
    //
    // Each rail is set in from the plate's edge and sunk a little into it, so
    // no face of a rail ever lands in a face of the plate. It very nearly did:
    // the back rail was the plate's own width, its back face was in the plate's
    // back face, and its underside coincided with the plate's top surface for
    // one particular value of the plate thickness — which the roll duly found on
    // seed 132, and only there. Two solids meeting exactly is not a rare bug, it
    // is a bug waiting for the right random number.
    const railT = 0.022;
    const topY = legH + bodyH + topT * 0.5;
    const plateW = bodyW + 0.055;
    const plateD = bodyD + 0.05;
    for (const [w, d, x, z] of [
      [plateW - railT, railT, 0, -plateD / 2 + railT * 0.8],
      [railT, bodyD * 0.86, -plateW / 2 + railT * 0.8, 0],
      [railT, bodyD * 0.82, plateW / 2 - railT * 0.8, 0],
    ] as const) {
      const rail = new THREE.BoxGeometry(w, 0.028, d);
      rail.translate(x, topY - 0.006, z);
      parts.push({ geometry: rail, color: shade(iron, 1.14), sway: 0 });
    }

    // --- the door ------------------------------------------------------------
    //
    // A frame around a hole, with the firebox behind it. See the header: the
    // gap is the glass.
    const doorW = bodyW * rng.range(0.6, 0.72);
    const doorH = bodyH * rng.range(0.5, 0.62);
    const doorY = bodyY + bodyH * rng.range(0.02, 0.1);

    // What you see through the glass. Painted the fire's colour on the lit
    // material, which is what makes the wood immediately behind the pane agree
    // with the light coming out of it — the same argument the candle's wax makes.
    // Sunk a few millimetres into the body rather than laid flat on its face:
    // its back would otherwise share a plane with the front of the stove over
    // the whole area of the door, which is a guaranteed z-fight at every angle.
    const inner = new THREE.BoxGeometry(doorW, doorH, 0.016);
    inner.translate(0, doorY, front + 0.005);
    parts.push({ geometry: inner, color: dim(FIREBOX, 0.45 + heat * 0.5), sway: 0 });

    // The frame: four bars, no two the same length, standing proud of the
    // firebox panel so the pane sits visibly *inside* the casting.
    const barZ = front + 0.032;
    const bar = 0.038;
    for (const side of [-1, 1]) {
      const rail = new THREE.BoxGeometry(doorW + bar * 2.1, bar, 0.03);
      rail.translate(0, doorY + (side * doorH) / 2, barZ);
      parts.push({ geometry: rail, color: iron, sway: 0 });

      const stile = new THREE.BoxGeometry(bar * 0.92, doorH + bar * 0.4, 0.028);
      stile.translate((side * doorW) / 2, doorY, barZ * 0.999);
      parts.push({ geometry: stile, color: shade(iron, 1.08), sway: 0 });
    }

    // Hinges down one side and a latch on the other, so the door has a way of
    // opening. Which side is rolled once and both follow from it.
    const hinge = rng.chance(0.5) ? -1 : 1;
    for (const at of [-0.3, 0.3]) {
      const knuckle = new THREE.BoxGeometry(0.03, 0.05, 0.04);
      knuckle.translate((hinge * (doorW + bar * 2.1)) / 2, doorY + doorH * at, barZ + 0.006);
      parts.push({ geometry: knuckle, color: shade(iron, 0.86), sway: 0 });
    }

    const latchX = (-hinge * (doorW + bar * 2.4)) / 2;
    const spindle = new THREE.CylinderGeometry(0.012, 0.012, 0.05, 6);
    spindle.rotateX(Math.PI / 2);
    spindle.translate(latchX, doorY, barZ + 0.025);
    parts.push({ geometry: spindle, color: shade(iron, 1.1), sway: 0 });

    // A curled handle, standing in as a short bar. A ring at this polygon count
    // comes back as a smudge — the door builder learned that one the hard way.
    const grip = new THREE.BoxGeometry(0.026, 0.1, 0.026);
    grip.rotateZ(rng.range(-0.4, 0.4));
    grip.translate(latchX, doorY, barZ + 0.056);
    parts.push({ geometry: grip, color: shade(iron, 0.94), sway: 0 });

    // The air control: a small disc low on the front, turned to whatever it is
    // set to. Two triangles' worth of "this thing is operated".
    const vent = new THREE.CylinderGeometry(0.03, 0.03, 0.018, 6);
    vent.rotateX(Math.PI / 2);
    vent.rotateZ(rng.range(0, Math.PI));
    vent.translate(rng.around(0, bodyW * 0.18), doorY - doorH * 0.5 - 0.055, front + 0.012);
    parts.push({ geometry: vent, color: shade(iron, 1.12), sway: 0 });

    // --- the flue ------------------------------------------------------------
    //
    // Thin. A stove pipe is about 12 cm across, which next to a forge's flue is
    // slender enough to read as sheet rolled into a tube rather than as
    // brickwork — and the contrast between a heavy iron box and a thin pipe is
    // most of what makes the box look heavy.
    const bore = rng.range(0.055, 0.075);
    const collarH = rng.range(0.05, 0.075);
    // Set back from the middle of the top plate. Dead centre would put the pipe
    // in front of the kettle, and every stove ever made puts the flue at the
    // back for exactly that reason.
    const stackZ = -bodyD * rng.range(0.08, 0.2);

    const collar = new THREE.CylinderGeometry(bore * 1.3, bore * 1.45, collarH, 8);
    collar.translate(0, topY + collarH * 0.4, stackZ);
    parts.push({ geometry: collar, color: shade(iron, 0.9), sway: 0 });

    // Either straight up out of sight, or up and then back into the wall behind.
    // The elbow is the more domestic of the two and it also gives the prop a
    // direction, which a vertical pipe does not.
    const elbowed = rng.chance(0.45);
    const riseTo = elbowed ? rng.range(1.5, 1.95) : rng.range(2.35, 2.7);
    const riseFrom = topY + collarH * 0.5;
    const rise = new THREE.CylinderGeometry(bore, bore * 1.03, riseTo - riseFrom, 8);
    rise.translate(0, (riseTo + riseFrom) / 2, stackZ);
    parts.push({ geometry: rise, color: shade(iron, 0.96), sway: 0 });

    // A joint band partway up. Stove pipe comes in lengths and the joints are
    // where it is held — the same trick `pipes` uses, for the same reason: a
    // bare cylinder is a stick.
    const band = new THREE.CylinderGeometry(bore * 1.22, bore * 1.22, bore * 0.5, 8);
    band.translate(0, riseFrom + (riseTo - riseFrom) * rng.range(0.4, 0.6), stackZ);
    parts.push({ geometry: band, color: shade(iron, 1.1), sway: 0 });

    if (elbowed) {
      // Run back toward −Z, overlapping the riser at the corner rather than
      // meeting it. Long enough to reach a wall the stove is stood against.
      const reach = rng.range(0.45, 0.7);
      const arm = new THREE.CylinderGeometry(bore * 0.98, bore * 0.98, reach, 8);
      arm.rotateX(Math.PI / 2);
      arm.translate(0, riseTo - bore * 0.9, stackZ - reach / 2 + bore * 0.4);
      parts.push({ geometry: arm, color: shade(iron, 0.92), sway: 0 });

      const cap = new THREE.CylinderGeometry(bore * 1.18, bore * 1.18, bore * 0.55, 8);
      cap.rotateX(Math.PI / 2);
      cap.translate(0, riseTo - bore * 0.9, stackZ - reach + bore * 0.6);
      parts.push({ geometry: cap, color: shade(iron, 1.08), sway: 0 });
    }

    // --- a hearth plate ------------------------------------------------------
    //
    // A sheet on the floor under it, on some. Anything with a fire in it that
    // stands on boards needs one, and it also gives the stove a footprint —
    // without it a small object on a big floor looks dropped rather than placed.
    if (rng.chance(0.6)) {
      const plate = new THREE.BoxGeometry(
        bodyW + rng.range(0.16, 0.3),
        0.014,
        bodyD + rng.range(0.24, 0.42),
      );
      plate.translate(0, 0.007, rng.range(0.04, 0.12));
      parts.push({ geometry: plate, color: shade(PALETTE.IRON_DARK, rng.range(0.9, 1.15)), sway: 0 });
    }

    // --- the fire behind the glass -------------------------------------------
    //
    // Flat and wide rather than a standing flame: what you see through a stove
    // door is mostly a bed of burning wood with the top of the flame cut off by
    // the frame. A tall tongue here would be sticking out through the casting.
    const glowZ = front + 0.022;
    // **A box, not an octahedron.** This was a squashed octahedron, which from
    // the front is a *diamond* — and what you are looking at is a rectangular
    // pane of glass with fire behind it, so the lit shape has to be the pane.
    // A diamond reads as a gem set in the door, which is a different object
    // entirely and the first thing anyone notices about it.
    //
    // Inset from the opening rather than filling it, so a rim of dark iron
    // still frames the light and the glass has an edge.
    const core = new THREE.BoxGeometry(doorW * 0.78, doorH * 0.6, 0.02);
    core.translate(0, doorY - doorH * 0.1, glowZ);
    glow.push({ geometry: core, color: dim(FIREBOX, 0.55 + heat * 0.45), sway: 0 });

    // A spill in front of the door, faded to black at its edges. This is the
    // part that says light is coming *out* — without it the glass is a bright
    // rectangle painted on an iron box, and the room around it never brightens.
    const spillR = Math.max(doorW, doorH) * 0.85;
    const spill = new THREE.OctahedronGeometry(spillR, 1);
    spill.scale(1, 0.85, 0.55);
    spill.translate(0, doorY - doorH * 0.08, glowZ + 0.03);
    glow.push({
      geometry: spill,
      color: (x, y, z) => {
        const d = Math.hypot(x, (y - doorY + doorH * 0.08) / 0.85, (z - glowZ - 0.03) / 0.55) / spillR;
        return dim(FIREBOX, Math.max(0, 0.26 * (0.4 + heat * 0.6) * (1 - d)));
      },
      sway: 0,
    });

    // --- assembly ------------------------------------------------------------
    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
    }

    const mesh = finish(geometry, 'stove', 0, 'metal-hollow-small');
    mesh.add(finishGlow(glowGeometry, 'stove:glow'));

    const light = new THREE.PointLight(
      FIREBOX_LIGHT,
      LIGHT_INTENSITY * (0.45 + heat * 0.75) * rng.around(1, 0.12) * scale * scale,
      LIGHT_RANGE * scale,
      FLAME_DECAY,
    );
    // Just outside the glass, not inside the box. A stove is a sealed firebox
    // and the only light that leaves it comes through one small pane — putting
    // the source behind the casting would light the inside of a box nobody can
    // see into and leave the floor in front of it dark.
    light.position.set(0, doorY * scale, (front + 0.06) * scale);
    light.castShadow = false;
    mesh.add(light);

    return mesh;
  },
};

/** Scales a packed hex toward black. */
function dim(hex: number, factor: number): number {
  const f = factor < 0 ? 0 : factor > 1 ? 1 : factor;
  const r = Math.round(((hex >> 16) & 0xff) * f);
  const g = Math.round(((hex >> 8) & 0xff) * f);
  const b = Math.round((hex & 0xff) * f);
  return (r << 16) | (g << 8) | b;
}
