import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { rollActivity, HEARTH } from '../activity';
import { PALETTE, shade } from '../palette';

/**
 * An open hearth in a wall: a surround, a firebox, a mantel and a fire in it.
 *
 * `forge` is the works hearth — a brick box under a great sheet-metal hood,
 * built to be stood at and worked over. This is the domestic one, and the two
 * must not be confused at a glance, so almost every decision here runs the
 * other way: the fire is set *into* the wall rather than standing out from it,
 * the flue is a masonry breast rather than a funnel and a pipe, and the mantel
 * — a shelf at chest height, which a forge has nowhere to put — carries most of
 * the silhouette.
 *
 * **It is the thing that makes a room lived in.** A hut with a bed and a table
 * in it is furnished; a hut with a fire burning in the wall is inhabited, and
 * the difference is almost entirely light. So the fire is never off. What is
 * rolled is `heat` — how far it has burned down — and that one number drives the
 * flames, the light, how much of the wood is glowing and how many embers are
 * lit, because those four always agree with each other.
 *
 * ## Not `rollFlame`
 *
 * The candle, the lantern and everything else at wick scale share `art/flame`,
 * including the cold blue tint that is not chemistry. A hearth deliberately does
 * not. That table's variation is *what is burning* — a conceit that works on one
 * small flame you can lean over and read as strange. A whole fireplace of it
 * would not be a strange candle, it would be a differently-coloured room, and it
 * would drag the tint of every surface in the building with it. Here the
 * variation is temperature instead: how hot the fire is, not what it is made of.
 *
 * Built with its back at **z = 0** and everything projecting toward +Z, floor at
 * y = 0, so a caller sets it flush against a wall with a yaw and a nudge.
 */

/** Warm, and low. A banked fire lights the underside of its own lintel. */
const LIGHT_INTENSITY = 6.5;
const LIGHT_RANGE = 15;
/**
 * Soft falloff, as the flames and the forge use. See `art/flame`: an
 * inverse-square light in a hearth you can kneel at puts the whole near field on
 * one quantization level and comes back as a flat white hole in the wall.
 */
const LIGHT_DECAY = 1.3;

const EMBER = 0xff8a3c;
const FLAME = 0xffb663;
const SOOT = 0x22201d;

/**
 * Height of the fire above the fireplace's own origin, for placing a `fire`
 * emitter.
 *
 * The same reasoning as `FORGE_FIRE_HEIGHT` and `BELL_MOUTH_HEIGHT`: a sound
 * comes from the part of the object that makes it, not from the object's
 * origin, and for a thing this tall the difference is the whole width of a room
 * in stereo. The hearth slab is 0.07 and the log pile sits about 0.15 on top of
 * it, on every instance, so a constant is closer than an origin every time.
 */
export const FIREPLACE_FIRE_HEIGHT = 0.24;

export const fireplace: MeshBuilder = {
  name: 'fireplace',
  category: 'structures',
  radius: 1.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    const outerW = rng.range(1.35, 2.0);
    const outerD = rng.range(0.42, 0.62);
    const openW = outerW * rng.range(0.46, 0.58);
    const openH = rng.range(0.62, 0.85);
    const lintelH = rng.range(0.14, 0.22);

    // --- where the mantel sits, and why it is worked out here ----------------
    //
    // **The mantel has to land on the lintel, and it was floating.** Its centre
    // was placed 0.04–0.14 above the top of the piers with a height of
    // 0.07–0.10 rolled independently much further down the file, so its
    // underside came out anywhere between 0.01 *below* that top and 0.105
    // *above* it. Most rolls left a shelf hanging in mid-air with daylight
    // under it, and the two numbers were three dozen lines apart, so nothing
    // about either one looked wrong on its own.
    //
    // Rolled together now, and expressed as an overlap rather than a gap: the
    // underside is driven a centimetre or three *into* the masonry it rests
    // on, which is the only formulation that cannot come apart. A shelf that
    // merely touches is one rounding error from a visible seam.
    const mantelH = rng.range(0.07, 0.1);
    const pierTop = openH + lintelH;
    const mantelY = pierTop + mantelH / 2 - rng.range(0.012, 0.03);
    // Where the breast stops. Above the top of any doorway and below any
    // ceiling in the game, so it reads as carrying on out of sight rather than
    // as stopping.
    const breastTop = rng.range(2.1, 2.5);
    // How far it has burned down. One number for the fire, the light, the lit
    // wood and the embers.
    const heat = rng.range(0.3, 1);

    // Brick or dressed stone, and a timber bressummer or a stone lintel over
    // the opening. Two independent rolls, because the pairing is not fixed —
    // a stone surround with an oak beam across it is the commonest of all.
    const masonry = rng.chance(0.5)
      ? shade(rng.chance(0.5) ? 0x7a4a38 : 0x6b4436, rng.range(0.92, 1.1))
      : shade(PALETTE.STONE, rng.range(0.86, 1.02));
    const timberLintel = rng.chance(0.55);
    const lintelColor = timberLintel
      ? shade(PALETTE.TIMBER_DARK, rng.range(0.9, 1.1))
      : shade(masonry, 0.92);

    const pierW = (outerW - openW) / 2;
    const slabTop = 0.07;

    // --- the hearth slab -----------------------------------------------------
    //
    // Out into the room further than the surround, because that is what it is
    // for: catching what falls out of the fire. It is also the part a chair gets
    // pulled up to, so it does more for the read of the room than its two
    // triangles a face deserve.
    const apron = rng.range(0.3, 0.5);
    const slab = new THREE.BoxGeometry(outerW + rng.range(0.2, 0.4), slabTop, outerD + apron);
    slab.translate(0, slabTop / 2, (outerD + apron) / 2);
    parts.push({ geometry: slab, color: shade(PALETTE.STONE_DARK, rng.range(0.9, 1.05)), sway: 0 });

    // --- the piers -----------------------------------------------------------
    //
    // Coursed rather than solid. One flat mass reads as a painted block whatever
    // colour it is; four courses at slightly different shades read as masonry,
    // and shrinking each course a little as it climbs means no two of them share
    // an edge where they meet — an edge belonging to four triangles is a hole to
    // every test of the solid.
    const courses = rng.int(3, 5);
    for (const side of [-1, 1]) {
      for (let i = 0; i < courses; i++) {
        const h = (pierTop - slabTop) / courses;
        const w = pierW * (1 - i * 0.014);
        const d = outerD * (1 - i * 0.02);
        const course = new THREE.BoxGeometry(w, h, d);
        course.translate((side * (openW + pierW)) / 2, slabTop + h * (i + 0.5), d / 2);
        parts.push({ geometry: course, color: shade(masonry, rng.range(0.88, 1.12)), sway: 0 });
      }
    }

    // --- the lintel ----------------------------------------------------------
    //
    // Runs past the piers on both sides rather than sitting exactly between
    // them, so the joint is two boxes overlapping.
    const lintel = new THREE.BoxGeometry(openW + pierW * 0.7, lintelH, outerD * 1.04);
    lintel.translate(0, openH + lintelH / 2, (outerD * 1.04) / 2);
    parts.push({ geometry: lintel, color: lintelColor, sway: 0 });

    // --- the firebox ---------------------------------------------------------
    //
    // A sooted lining set back inside the opening. Dark on purpose: everything
    // else in this prop is lit by the fire, and there has to be something behind
    // the flames that is not, or the fire has nothing to be brighter *than*.
    const back = new THREE.BoxGeometry(openW * 1.02, openH * 1.02, 0.09);
    back.translate(0, slabTop + (openH * 1.02) / 2 - 0.02, 0.05);
    parts.push({ geometry: back, color: SOOT, sway: 0 });

    for (const side of [-1, 1]) {
      // Splayed cheeks. A firebox that narrows toward the back throws more of
      // its heat and light out into the room, and the taper is visible from any
      // angle you can sit at.
      const cheek = new THREE.BoxGeometry(0.07, openH * 0.98, outerD * 0.82);
      cheek.rotateY(side * 0.16);
      cheek.translate((side * openW) / 2 - side * 0.02, slabTop + (openH * 0.98) / 2, outerD * 0.44);
      parts.push({ geometry: cheek, color: shade(SOOT, rng.range(1.1, 1.5)), sway: 0 });
    }

    // The throat: a sooted panel under the lintel, closing the top of the
    // firebox. Without it you can see straight through to the ceiling above the
    // fire, which is the tell that the chimney is a box stuck on the front.
    const throat = new THREE.BoxGeometry(openW * 0.96, 0.08, outerD * 0.9);
    throat.rotateX(0.22);
    throat.translate(0, openH - 0.05, outerD * 0.44);
    parts.push({ geometry: throat, color: shade(SOOT, 1.25), sway: 0 });

    // --- the mantel ----------------------------------------------------------
    //
    // The one part of a fireplace that is only there to be useful, and the part
    // that makes it read as domestic rather than as an industrial opening. It is
    // also where a candle or a bowl gets put, so it projects further than the
    // breast above it on purpose.
    // `mantelH` is rolled up with `mantelY`, not here — see the note there. The
    // two decide between them whether the shelf touches what it rests on, and
    // rolling them apart is what let them disagree.
    const mantelD = outerD + rng.range(0.06, 0.14);
    const mantel = new THREE.BoxGeometry(outerW + rng.range(0.1, 0.2), mantelH, mantelD);
    mantel.translate(0, mantelY, mantelD / 2 - 0.02);
    parts.push({
      geometry: mantel,
      color: timberLintel ? shade(PALETTE.TIMBER, rng.range(0.95, 1.1)) : shade(masonry, 1.12),
      sway: 0,
    });

    // --- the chimney breast --------------------------------------------------
    //
    // Stepping in as it climbs, which is both what masonry does and what keeps
    // consecutive blocks from sharing edges. A breast of constant width would
    // read as a pillar; the taper is what says there is a flue narrowing inside
    // it.
    const steps = rng.int(2, 4);
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps;
      const t1 = (i + 1) / steps;
      const h = (breastTop - mantelY) / steps;
      const w = outerW * (0.9 - t0 * 0.3) * rng.range(0.98, 1.02);
      const d = outerD * (0.86 - t0 * 0.24);
      const block = new THREE.BoxGeometry(w, h * (1 + (t1 - t0) * 0.1), d);
      block.translate(0, mantelY + h * (i + 0.5), d / 2);
      parts.push({ geometry: block, color: shade(masonry, rng.range(0.9, 1.08)), sway: 0 });
    }

    // --- andirons ------------------------------------------------------------
    //
    // Iron dogs holding the logs clear of the slab. They are the reason a fire
    // has air under it, and geometrically they are the reason the log pile does
    // not simply lie on the floor looking abandoned.
    const dogY = slabTop + 0.06;
    for (const side of [-1, 1]) {
      const bar = new THREE.BoxGeometry(0.035, 0.05, outerD * 0.44);
      bar.translate((side * openW) / 2 * rng.range(0.5, 0.62), dogY, outerD * 0.34);
      parts.push({ geometry: bar, color: shade(PALETTE.IRON, 0.8), sway: 0 });

      const upright = new THREE.BoxGeometry(0.04, 0.16, 0.042);
      upright.translate((side * openW) / 2 * rng.range(0.5, 0.62), dogY + 0.09, outerD * 0.16);
      parts.push({ geometry: upright, color: shade(PALETTE.IRON, 0.9), sway: 0 });
    }

    // --- the fire ------------------------------------------------------------
    const fireZ = outerD * 0.34;
    const fireY = slabTop + 0.15;

    // Logs, lying roughly across the opening and crossed rather than stacked.
    // Each at its own length and radius: identical cylinders in a heap read as
    // dowel, and the whole point of firewood is that it was split.
    const logs = rng.int(3, 5);
    for (let i = 0; i < logs; i++) {
      const radius = rng.range(0.045, 0.075);
      const length = openW * rng.range(0.5, 0.78);
      const log = new THREE.CylinderGeometry(radius, radius * rng.range(0.85, 0.98), length, 6);
      log.rotateZ(Math.PI / 2);
      // Crossed at a shallow angle, and tipped a little, so the pile has gaps
      // in it for the fire to come through.
      log.rotateY(rng.range(-0.5, 0.5));
      log.rotateZ(rng.range(-0.14, 0.14));
      const y = slabTop + 0.09 + i * rng.range(0.05, 0.08);
      log.translate(rng.around(0, openW * 0.08), y, fireZ + rng.around(0, 0.05));

      const bark = shade(PALETTE.BARK, rng.range(0.85, 1.15));
      // The lower ones have caught; the ones on top have not yet.
      const caught = rng.chance(heat * 0.9) && i < logs - 1;
      const under = caught ? 0x8e3a1e : SOOT;
      const waterline = y + radius * 0.15;
      parts.push({
        geometry: log,
        // Charred and burning underneath, bark on top. Drawn on the *lit*
        // material rather than the additive one, because burning wood is a dull
        // red surface — only the fire between the logs is bright enough to add
        // light, and that is the glow below.
        color: (_x, ly) => (ly < waterline ? under : bark),
        sway: 0,
      });
    }

    // Embers scattered under the pile, most of them dead.
    const cinders = rng.int(5, 9);
    for (let i = 0; i < cinders; i++) {
      const size = rng.range(0.025, 0.05);
      const cinder = new THREE.IcosahedronGeometry(size, 0);
      cinder.rotateY(rng.range(0, Math.PI));
      cinder.translate(
        rng.around(0, openW * 0.3),
        slabTop + size * 0.6,
        fireZ + rng.around(0, outerD * 0.16),
      );
      parts.push({
        geometry: cinder,
        color: rng.chance(heat * 0.5) ? 0x9c3f24 : shade(SOOT, rng.range(0.9, 1.4)),
        sway: 0,
      });
    }

    // --- the light you can see -----------------------------------------------
    //
    // Hand-built rather than going through `flameGlow`, which is shaped for a
    // wick: one small bright core inside one halo four times its size. A hearth
    // is a *bed* of many small sources under a couple of standing tongues, so it
    // wants several cores sharing a single wide halo — which is both cheaper and
    // closer to what it looks like.
    const bed = new THREE.OctahedronGeometry(openW * 0.3 * (0.6 + heat * 0.55), 0);
    bed.scale(1, 0.3, 0.55);
    bed.translate(0, fireY - 0.05, fireZ);
    glow.push({ geometry: bed, color: EMBER, sway: 0 });

    const tongues = 2 + (rng.chance(heat) ? 1 : 0);
    for (let i = 0; i < tongues; i++) {
      const size = openW * rng.range(0.07, 0.12) * (0.5 + heat * 0.7);
      const tongue = new THREE.OctahedronGeometry(size, 0);
      tongue.scale(1, rng.range(2.2, 3.4), 1);
      tongue.translate(
        rng.around(0, openW * 0.2),
        fireY + size * rng.range(1.4, 2.2),
        fireZ + rng.around(0, 0.04),
      );
      glow.push({ geometry: tongue, color: FLAME, sway: 0 });
    }

    // One halo over the whole fire, faded to black at its extremities. Black
    // adds nothing under additive blending, so the falloff needs no alpha
    // channel and creates no sorting problem with the logs in front of it.
    const haloR = openW * 0.55;
    const halo = new THREE.OctahedronGeometry(haloR, 1);
    halo.scale(1, 0.9, 0.6);
    halo.translate(0, fireY + 0.06, fireZ);
    glow.push({
      geometry: halo,
      color: (x, y, z) => {
        const d = Math.hypot(x, (y - fireY - 0.06) / 0.9, (z - fireZ) / 0.6) / haloR;
        return dim(EMBER, Math.max(0, 0.3 * (0.4 + heat * 0.6) * (1 - d)));
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

    const mesh = finish(geometry, 'fireplace', 0);
    mesh.add(finishGlow(glowGeometry, 'fireplace:glow'));

    const light = new THREE.PointLight(
      0xff9645,
      LIGHT_INTENSITY * (0.4 + heat * 0.8) * rng.around(1, 0.1) * scale * scale,
      LIGHT_RANGE * scale,
      LIGHT_DECAY,
    );
    // Forward of the logs rather than in the middle of them. A point light
    // buried in the pile spends half its output lighting the inside of the
    // firebox, and the room gets a fire it can see but cannot feel.
    light.position.set(0, (fireY + 0.06) * scale, (outerD * 0.62) * scale);
    light.castShadow = false;
    mesh.add(light);

    // What it is doing over time, which drives both the light and the flame.
    mesh.userData.activity = rollActivity(HEARTH, rng);

    return mesh;
  },
};

/** Scales a packed hex toward black. Additive, so this is an amount of light. */
function dim(hex: number, factor: number): number {
  const f = factor < 0 ? 0 : factor > 1 ? 1 : factor;
  const r = Math.round(((hex >> 16) & 0xff) * f);
  const g = Math.round(((hex >> 8) & 0xff) * f);
  const b = Math.round((hex & 0xff) * f);
  return (r << 16) | (g << 8) | b;
}
