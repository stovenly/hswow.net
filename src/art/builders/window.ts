import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A window in a wall, and the block of daylight coming through it.
 *
 * ## The shaft is a sheared box, and that is the whole reason this exists
 *
 * Every other light in the kit is a point or a cone. A candle, a lantern and a
 * hearth radiate from a place; a floodlight throws a cone because a reflector
 * housing does. An opening does neither. The sun is far enough away that its
 * rays are parallel, so what comes through a hole is a **prism with the hole's
 * own cross-section** — it does not spread, it does not converge, and it still
 * has the window's rectangle in it when it reaches the floor. Built as a cone it
 * would read as a lamp standing just outside the wall; built as a frustum that
 * widens it would put the sun a few metres away. The parallel sides are the
 * whole tell, and they are free.
 *
 * **Sheared, not rotated,** and the difference is not pedantry. A rotated box
 * has its cross-section square to the ray, so where it meets the wall it is
 * *wider* than the window and pokes out past the frame on the low side. A
 * sheared box keeps its cross-section in the plane of the wall, exactly filling
 * the opening, and leans over as it crosses the room. That is both the correct
 * solid and the one that lines up with the hole it is coming out of.
 *
 * ## How it is aimed
 *
 * `MeshBuilder.build()` takes a seed and a scale and nothing else, so the sun's
 * bearing cannot be a build option without breaking the contract every other
 * builder keeps. The builder rolls a plausible bearing from the seed and
 * `aimWindow` re-aims it afterwards.
 *
 * The shaft is a child mesh with `matrixAutoUpdate` off, and aiming writes its
 * matrix directly. The geometry is authored in a canonical unit form — the
 * aperture sitting at z = 0, swept straight to z = 1 — and the matrix carries
 * the whole of the shear, the direction and the length in its third column.
 * Nothing is rebuilt and nothing is allocated, so this is cheap enough to drive
 * from a clock if a day cycle ever wants to.
 *
 * ## The light that lands has no shape, on purpose
 *
 * Three has no rectangular light that works here: `RectAreaLight` needs a
 * standard or physical material and its own uniform tables, and this kit is one
 * shared `MeshLambertMaterial` on purpose. So the illumination is a wide, very
 * `PointLight` sitting where the beam lands. The *shape* of the daylight is
 * carried entirely by the visible shaft and the bright parallelogram on the
 * floor; the lamp only adds warmth around it. A spot was tried and its cone
 * landed a circle over the square patch, which read as the circle being real.
 *
 * Built in the XY plane with the wall at z = 0 and everything standing proud
 * toward **+Z**, floor at y = 0 — the same convention as `vent` and `pipes`, so
 * placing one is a yaw and a nudge. Interiors have no holes cut in them (see
 * `world/interior`), so the daylight behind the glazing bars is a painted panel
 * rather than an opening; the frame standing proud of it is what supplies the
 * depth, exactly as a portal door's frame does.
 */

/**
 * Where `aimWindow` will accept the sun from.
 *
 * Elevation is clamped away from the horizon because the shaft length is
 * `centre height / sin(elevation)` and that goes to infinity at zero — a sun on
 * the horizon throws a beam the length of the county. Azimuth is clamped short
 * of a right angle for the same class of reason: at 90° the sun is grazing the
 * wall, the shear factor is infinite, and past it the shear inverts and the
 * shaft turns itself inside out.
 */
const MIN_ELEVATION = 0.1;
const MAX_ELEVATION = 1.45;
const MAX_AZIMUTH = 1.3;
/** However low the sun, the shaft stops here. Longer than any room in the game. */
const MAX_REACH = 9;

/** Daylight, so brighter than any lamp in the kit. */
// **Deliberately weak, and this is the correction.** Cutting the spot to a
// point light removed its cone, but *any* lamp above a floor throws a round
// pool onto it — the shape of the lit area comes from the geometry of the
// surface, not from the light's own outline, so no light can ever draw a
// square. At 20 it was bright enough to make its own circular patch and that
// circle was what you saw.
//
// So the lamp is demoted to what it should always have been: a little warmth in
// the air near where the sun lands, well below the level that draws a visible
// pool of its own. **The square is drawn by the additive slab further down**,
// which is the only thing here that can be square, and it has been brightened
// to match.
const LIGHT_INTENSITY = 4.5;
const LIGHT_RANGE = 16;
/**
 * Softer than inverse-square, as the flames use.
 *
 * Not for the reason `art/flame` gives — nobody puts their eye against a window
 * pane — but because the interesting part of this light is four metres away on
 * the floor, and at `decay: 2` everything within a metre of the opening is on
 * the top quantization level and everything past three metres is on the bottom
 * one. The daylight has to survive the length of the room.
 */
const LIGHT_DECAY = 1.5;

/** What `aimWindow` needs to know, and what a caller can read back. */
export interface WindowMetrics {
  /** Aperture width and height, scale already applied. */
  width: number;
  height: number;
  /** Height of the aperture's centre above the floor. */
  centreY: number;
  /** 1 with the curtains open or absent, near 0 with them drawn. */
  openness: number;
  /** Current aim, in the units `aimWindow` takes. */
  azimuth: number;
  elevation: number;
}

/** Reads the metrics back off a mesh built by this builder. */
export function windowMetrics(mesh: THREE.Object3D): WindowMetrics {
  return mesh.userData.window as WindowMetrics;
}

/**
 * Points the daylight somewhere else.
 *
 * - `azimuth` — the beam's horizontal swing, in radians, measured from straight
 *   through the opening. **0 is the sun square on the window**; positive swings
 *   the shaft toward the window's own +X, negative toward −X. Clamped to ±1.3
 *   (about 75°), past which the sun would be behind the wall.
 * - `elevation` — the sun's height above the horizon, in radians. **0 is a sun
 *   on the horizon** throwing a level beam deep into the room; π/2 is a sun
 *   directly overhead, dropping the shaft almost vertically down the inside of
 *   the wall. Clamped to 0.1..1.45. Higher sun means a shorter, steeper shaft
 *   and a patch of floor closer to the window, which is the whole read of time
 *   of day.
 *
 * Safe to call on a curtained window: there is no shaft to aim, and only the
 * trickle of light through the boards gets re-pointed.
 */
export function aimWindow(mesh: THREE.Object3D, azimuth: number, elevation: number): void {
  const metrics = mesh.userData.window as WindowMetrics | undefined;
  if (!metrics) return;

  const az = clamp(azimuth, -MAX_AZIMUTH, MAX_AZIMUTH);
  const el = clamp(elevation, MIN_ELEVATION, MAX_ELEVATION);
  metrics.azimuth = az;
  metrics.elevation = el;

  // The direction light travels: into the room (+Z), downward (−Y), and swung
  // sideways by the azimuth. Unit length, so `reach` below is in metres.
  const flat = Math.cos(el);
  const dx = Math.sin(az) * flat;
  const dy = -Math.sin(el);
  const dz = Math.cos(az) * flat;

  // How far along the ray the middle of the opening has to travel to reach the
  // floor. This is what makes the patch land *on* something instead of hanging
  // in the air at a fixed distance.
  const drop = metrics.centreY / Math.sin(el);
  const reach = Math.min(drop, MAX_REACH);

  const shaft = mesh.getObjectByName('window:shaft');
  if (shaft) {
    // The third column is the sweep. x and y are carried through untouched, so
    // the cross-section stays put in the plane of the wall — that is the shear,
    // and writing it as a matrix is the cheapest possible way to say it.
    shaft.matrixAutoUpdate = false;
    shaft.matrix.set(
      1, 0, dx * reach, 0,
      0, 1, dy * reach, 0,
      0, 0, dz * reach, 0,
      0, 0, 0, 1,
    );
    shaft.matrixWorldNeedsUpdate = true;
  }

  const pool = mesh.getObjectByName('window:pool');
  if (pool) {
    // The aperture projected onto the floor: as wide as the window, and
    // stretched along the ray by 1/sin(elevation) — which is why a low sun
    // throws a long smear across the boards and a high one a near-square patch.
    const stretch = metrics.height / Math.sin(el);
    pool.matrixAutoUpdate = false;
    pool.matrix.set(
      metrics.width, 0, stretch * dx, drop * dx,
      0, 1, 0, 0,
      0, 0, stretch * dz, drop * dz,
      0, 0, 0, 1,
    );
    pool.matrixWorldNeedsUpdate = true;
    // A sun this low never gets its beam down to the floor inside a building.
    // Drawing the patch anyway would put it out beyond the far wall.
    pool.visible = drop <= MAX_REACH;
  }

  // The lamp sits *where the daylight lands*, a little above the floor, rather
  // than at the window aiming across the room. See the note at its construction:
  // a point source has no cone and therefore no circular edge to give the game
  // away, and warmth pooled around the bright patch is what a shaft of sun
  // actually does to a room.
  // **The lamp deliberately does not follow the beam.**
  //
  // It used to be moved to where the daylight lands, on the theory that what
  // lights a room is the bright patch on the floor. That is true and it made
  // things worse: a point source sitting sixty centimetres above the boards
  // burns a tight circle into them, which is precisely the round shape all this
  // is trying to be rid of — and it did it on *every* window, including the
  // ones whose square patch was drawing correctly underneath it.
  //
  // So it stays up at the aperture. From there its falloff washes the room
  // broadly and lands nowhere in particular, leaving the additive slab as the
  // only thing on the floor with an edge. The lamp contributes brightness; the
  // geometry contributes shape; neither does the other's job.
}

const windowBuilder: MeshBuilder = {
  name: 'window',
  category: 'structures',
  // Wider than the opening, because a pair of shutters flung back against the
  // wall is most of a metre either side of it and two windows spaced by the
  // aperture alone would have their shutters growing through one another.
  radius: 1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    // **Curtains, not shutters.**
    //
    // This is a window seen from *inside* a room, and shutters hang on the
    // outside of a wall. Standing in a hut looking at a pair of boarded leaves
    // folded back against the plaster is simply the wrong side of the building.
    // What is on the inside of a cottage window is a curtain.
    //
    // Rolled first so a given seed keeps its dressing however much is added to
    // the builder below this line. `shut` now means the curtains are drawn, and
    // it still kills the shaft — a sunbeam through a drawn curtain reads as a
    // renderer fault exactly as one through a closed shutter did.
    const hasCurtains = rng.chance(0.6);
    const shut = hasCurtains && rng.chance(0.35);

    const openW = rng.range(0.66, 1.1);
    const openH = rng.range(0.8, 1.3);
    const sillY = rng.range(0.85, 1.15);
    const centreY = sillY + openH / 2;
    const jambW = rng.range(0.09, 0.14);
    // How far the whole fitting stands out from the wall. This is the entire
    // supply of depth the window has — there is no hole to be recessed into —
    // so a shallow one reads as a picture hung on the plaster.
    const reveal = rng.range(0.1, 0.16);

    // Sun, or a north light. The second is much less common and is the reason
    // not every window in a village is the same temperature: an overcast pane
    // is genuinely blue, and one cold window among warm ones reads as weather
    // rather than as a palette slip.
    const sunny = rng.chance(0.72);
    const day = sunny ? 0xfff1d2 : 0xdce8f6;
    // Deeper than the glow, for the reason `art/flame` sets out: the glow is
    // additive and already at its own brightness, but this one is multiplied
    // into albedo and a near-white light washes the room's colours out.
    const dayLight = sunny ? 0xffe3ae : 0xbed2e8;

    const timber = shade(rng.chance(0.55) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK, rng.range(0.9, 1.08));
    const stone = shade(PALETTE.STONE_DARK, rng.range(0.9, 1.1));

    // --- the daylight panel ----------------------------------------------------
    //
    // What you see "through" the window. A painted board, because the wall
    // behind it is solid and nothing is on the other side — the same trick a
    // portal door plays with its dark backing panel, inverted.
    //
    // Slightly oversized, so its edges run *under* the jambs, head and sill
    // rather than stopping exactly in their planes. Two surfaces ending in the
    // same plane is the commonest z-fight in the kit and it shows worst on a
    // bright panel against a dark frame, which is precisely this.
    const pane = new THREE.BoxGeometry(openW + 0.024, openH + 0.024, 0.018);
    pane.translate(0, centreY, 0.011);
    parts.push({ geometry: pane, color: day, sway: 0 });

    // --- frame ---------------------------------------------------------------
    //
    // Jambs run past the head and sill rather than butting into them, so the
    // corners are two boxes intersecting. Boxes that meet exactly share four
    // edges apiece, and an edge belonging to four triangles instead of two is a
    // hole to every test of the solid — and z-fights where it shows.
    const jambH = openH + jambW * 2.4;
    for (const side of [-1, 1]) {
      const post = new THREE.BoxGeometry(jambW, jambH, reveal);
      post.translate((side * (openW + jambW)) / 2, centreY, reveal / 2);
      parts.push({ geometry: post, color: timber, sway: 0 });
    }

    const head = new THREE.BoxGeometry(openW + jambW * 2 + 0.1, jambW * 0.92, reveal * 1.06);
    head.translate(0, sillY + openH + jambW * 0.46, reveal * 0.5);
    parts.push({ geometry: head, color: shade(timber, 0.92), sway: 0 });

    // The sill projects further than anything else and tips forward, which is
    // what it is for. It is also the one part of a window you can read from
    // directly below, which is where most of them are seen from.
    const sill = new THREE.BoxGeometry(openW + jambW * 2 + 0.17, 0.068, reveal * 1.9);
    sill.rotateX(-0.07);
    sill.translate(0, sillY - 0.028, reveal * 0.6);
    parts.push({ geometry: sill, color: stone, sway: 0 });

    if (rng.chance(0.5)) {
      // Corbels under the sill. Small, and they stop the sill reading as a
      // shelf that grew out of the plaster.
      for (const side of [-1, 1]) {
        const bracket = new THREE.BoxGeometry(0.07, 0.13, reveal * 1.25);
        bracket.translate((side * openW) / 2, sillY - 0.1, reveal * 0.62);
        parts.push({ geometry: bracket, color: shade(stone, 0.88), sway: 0 });
      }
    }

    // --- stop beads ----------------------------------------------------------
    //
    // The thin frame the glass would sit behind. Four bars at slightly
    // different lengths, so that no two of them share an end.
    const bead = 0.028;
    const beadZ = reveal * 0.82;
    for (const side of [-1, 1]) {
      const rail = new THREE.BoxGeometry(openW + bead * 1.4, bead, bead * 1.1);
      rail.translate(0, centreY + (side * openH) / 2, beadZ);
      parts.push({ geometry: rail, color: shade(timber, 1.08), sway: 0 });

      const stile = new THREE.BoxGeometry(bead * 0.9, openH - bead * 1.6, bead);
      stile.translate((side * openW) / 2, centreY, beadZ * 0.97);
      parts.push({ geometry: stile, color: shade(timber, 1.12), sway: 0 });
    }

    // --- glazing bars --------------------------------------------------------
    //
    // Panes were small, so windows were divided. Also the cheapest way to make
    // a bright rectangle read as glass rather than as a hole: the bars cross in
    // front of the light and break it up, and the eye supplies the glazing.
    const acrossPanes = rng.int(2, 3);
    const upPanes = rng.int(2, 3);
    const barZ = reveal * 0.62;
    for (let i = 1; i < acrossPanes; i++) {
      const bar = new THREE.BoxGeometry(0.026, openH, 0.03);
      bar.translate(-openW / 2 + (openW * i) / acrossPanes, centreY, barZ);
      parts.push({ geometry: bar, color: shade(timber, 1.02), sway: 0 });
    }
    for (let i = 1; i < upPanes; i++) {
      // A hair thinner and a hair shallower than the uprights, so the crossings
      // are two boxes passing through one another rather than two boxes meeting.
      const bar = new THREE.BoxGeometry(openW, 0.023, 0.027);
      bar.translate(0, sillY + (openH * i) / upPanes, barZ * 1.02);
      parts.push({ geometry: bar, color: shade(timber, 0.96), sway: 0 });
    }

    // --- curtains -------------------------------------------------------------
    //
    // Hanging inside the room on a pole across the head of the opening, which
    // is what dresses a window from this side. Two panels, gathered at the top
    // and falling straight — drawn they meet in the middle, open they are
    // pushed back against the jambs and bunched, which is why the open ones are
    // narrower and thicker than half the opening rather than exactly half.
    //
    // Each panel is a single box. A real curtain has folds in it and a fold is
    // a bent sheet, which nothing here may be — the washtub's laundry was three
    // boxes pretending to fold and it never closed. A slab reads perfectly well
    // as cloth at this size provided it is *thick*: the shadow down its leading
    // edge is the whole of what says fabric rather than card.
    if (hasCurtains) {
      const cloth = rng.chance(0.5)
        ? shade(PALETTE.CLOTH, rng.range(0.85, 1.05))
        : shade(PALETTE.WOOL, rng.range(0.85, 1.05));
      const poleY = sillY + openH + rng.range(0.04, 0.09);
      // **Derived from `reveal`, not rolled on its own.** The curtain's depth
      // used to be an independent 0.05..0.08 while the frame's ran 0.1..0.16,
      // so on all but the shallowest window the glazing bars and stop beads sat
      // in front of the cloth and a drawn panel came out with the muntins
      // buried in it. A curtain hangs on the room side of the joinery, so it is
      // the frame's front face plus a gap for the brackets.
      const poleZ = reveal + rng.range(0.035, 0.06);
      // Sill-length, measured to the sill rather than scaled off the opening —
      // and clearing its top face, which the tilt lifts about 16 mm proud of
      // `sillY` at the nose. The sill projects further into the room than the
      // cloth does, so a hem level with it would cut through it.
      const drop = poleY - (sillY + rng.range(0.04, 0.1));
      // **One height for both tie-backs**, rolled here rather than inside the
      // loop below — where each side drew its own and the pair came out at
      // visibly different heights. A tie-back is a hook driven into the jamb,
      // and a joiner setting two of them sets them level.
      const tieY = poleY - drop * rng.range(0.45, 0.6);

      // The pole, run past the opening on both sides so its ends are visible.
      const pole = new THREE.CylinderGeometry(0.016, 0.016, openW + jambW * 2.2, 6);
      pole.rotateZ(Math.PI / 2);
      pole.translate(0, poleY, poleZ);
      parts.push({ geometry: pole, color: shade(PALETTE.TIMBER_DARK, 0.95), sway: 0 });

      for (const side of [-1, 1]) {
        // Drawn: half the opening each, meeting in the middle. Open: bunched
        // against the jamb, so narrower across and deeper front to back.
        const panelW = shut ? openW * rng.range(0.52, 0.56) : openW * rng.range(0.2, 0.3);
        const panelD = shut ? rng.range(0.022, 0.032) : rng.range(0.05, 0.08);
        const centreX = shut
          ? side * (openW / 2 - panelW / 2)
          : side * (openW / 2 - panelW * rng.range(0.3, 0.45));

        const panel = new THREE.BoxGeometry(panelW, drop, panelD);
        panel.translate(centreX, poleY - drop / 2 - 0.01, poleZ + panelD * 0.5);
        parts.push({ geometry: panel, color: cloth, sway: 0 });

        // A heading above the panel, sunk into it and onto the pole, so the
        // cloth is hung on something rather than floating below it.
        const head = new THREE.BoxGeometry(panelW * 1.02, 0.05, panelD * 1.15);
        head.translate(centreX, poleY, poleZ + panelD * 0.5);
        parts.push({ geometry: head, color: shade(cloth, 0.88), sway: 0 });

        // A tie-back on the open ones only, which is what holds a curtain
        // against the jamb and is most of why an open curtain reads as open
        // rather than as a narrow one. Its width and depth follow the panel it
        // is wrapped round; only the height is shared.
        if (!shut) {
          const tie = new THREE.BoxGeometry(panelW * 1.15, 0.05, panelD * 1.2);
          tie.translate(centreX, tieY, poleZ + panelD * 0.5);
          parts.push({ geometry: tie, color: shade(cloth, 0.78), sway: 0 });
        }
      }
    }

    // --- the aperture glow ---------------------------------------------------
    //
    // A curtained window still shows light round the cloth, so this is
    // dimmed rather than removed. The curtains are opaque and in front of it,
    // so the depth test does most of the work by itself.
    const openness = shut ? 0.07 : 1;
    const paneGlow = shut ? 0.3 : 1;

    const bright = new THREE.BoxGeometry(openW * 0.97, openH * 0.97, 0.012);
    bright.translate(0, centreY, 0.026);
    glow.push({ geometry: bright, color: fade(day, paneGlow), sway: 0 });

    // Glare round the opening. An octahedron rather than a subdivided plane for
    // the reason `flameGlow` gives: eight faces is the cheapest soft edge there
    // is, and the falloff is authored as vertex colour going to black, which
    // adds nothing under additive blending.
    const halo = new THREE.OctahedronGeometry(1, 1);
    halo.scale(openW * 0.85, openH * 0.8, 0.3);
    halo.translate(0, centreY, 0.05);
    const haloReach = Math.max(openW, openH) * 0.85;
    glow.push({
      geometry: halo,
      color: (x, y) => {
        const d = Math.hypot(x / haloReach, (y - centreY) / haloReach);
        return fade(day, Math.max(0, 0.3 * paneGlow * (1 - d)));
      },
      sway: 0,
    });

    // --- the shaft, in canonical form ----------------------------------------
    //
    // The aperture at z = 0 swept straight to z = 1. z here is not a length, it
    // is the sweep parameter — `aimWindow` turns it into one. Segmented along
    // its length because vertex colour is evaluated **per face**, and a box
    // whose side is one quad from end to end can only be one brightness: the
    // fade needs faces to land on.
    const shaftW = openW * 0.94;
    const shaftH = openH * 0.94;
    const shaftGeometry = assemble([
      {
        geometry: (() => {
          const box = new THREE.BoxGeometry(shaftW, shaftH, 1, 1, 1, 12);
          box.translate(0, centreY, 0.5);
          return box;
        })(),
        // Bright at the glass, nothing at the far end. Without this the beam
        // stops in mid-air at a hard bright rectangle, which reads as a slab of
        // coloured plastic rather than as lit dust.
        color: (_x, _y, z) => fade(day, 0.22 * Math.max(0, 1 - z) ** 1.35),
        sway: 0,
      },
    ]);

    // --- the patch on the floor ----------------------------------------------
    //
    // A unit square in x and z, sheared and stretched into a parallelogram by
    // `aimWindow`. Only y is a real length here: the thickness, and the lift
    // that keeps it off the boards instead of z-fighting with them.
    const poolLift = 0.014;
    const poolGeometry = assemble([
      {
        geometry: (() => {
          const slab = new THREE.BoxGeometry(1, 0.012, 1, 4, 1, 4);
          slab.translate(0, poolLift, 0);
          return slab;
        })(),
        // Soft at the edges. A real sun patch has an edge about half a degree
        // wide, which is sharp — but a hard edge on a quantized pipeline gives
        // a stair-stepped outline that is far more conspicuous than the
        // softness costs.
        color: (x, _y, z) => {
          const edge = Math.max(Math.abs(x), Math.abs(z)) * 2;
          return fade(day, 0.62 * (1 - smoothstep(0.6, 1.02, edge)));
        },
        sway: 0,
      },
    ]);

    // --- assembly ------------------------------------------------------------
    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
      // The shaft's z and the patch's x and z are sweep parameters rather than
      // lengths, so they are deliberately left alone — the metres come out of
      // the aim matrix, which is built from the scaled metrics below.
      shaftGeometry.scale(scale, scale, 1);
      poolGeometry.scale(1, scale, 1);
    }

    const mesh = finish(geometry, 'window', 0);
    mesh.add(finishGlow(glowGeometry, 'window:glow'));

    const metrics: WindowMetrics = {
      width: shaftW * scale,
      height: shaftH * scale,
      centreY: centreY * scale,
      openness,
      azimuth: 0,
      elevation: 0.6,
    };
    mesh.userData.window = metrics;

    // Shut shutters get no shaft and no patch at all. A beam of sunlight coming
    // through a closed window is the sort of thing that reads as a bug in the
    // renderer rather than as a mistake in the content, so it is not dimmed —
    // it is simply not built.
    if (!shut) {
      const shaft = finishGlow(shaftGeometry, 'window:shaft');
      shaft.matrixAutoUpdate = false;
      mesh.add(shaft);

      const pool = finishGlow(poolGeometry, 'window:pool');
      pool.matrixAutoUpdate = false;
      mesh.add(pool);
    } else {
      shaftGeometry.dispose();
      poolGeometry.dispose();
    }

    // **A point source at the far end, not a spot from the window.**
    //
    // A `SpotLight` throws a cone, and a cone lands as a circle. Opening it out
    // and taking the penumbra to 1 was tried and was not enough: the round pool
    // was still legible over the square patch the geometry draws, and two
    // disagreeing shapes read as the round one being the truth.
    //
    // There is no rectangular light available — `RectAreaLight` needs a standard
    // or physical material and this kit is one shared Lambert on purpose — so
    // the answer is to use a light with **no shape at all**. A point source has
    // no edge to give the game away, and putting it where the daylight *lands*
    // rather than where it enters is also closer to the truth: what lights a
    // room on a sunny day is the patch of floor being hit, throwing warmth back
    // into everything around it.
    //
    // `aimWindow` moves it to the landing point; this position is only what it
    // has before the first aim.
    const light = new THREE.PointLight(
      dayLight,
      LIGHT_INTENSITY * openness * rng.around(1, 0.1) * scale * scale,
      LIGHT_RANGE * scale,
      LIGHT_DECAY,
    );
    light.name = 'window:sun';
    // At the aperture, at its own height, standing a little into the room. See
    // the note in `aimWindow`: putting a point source near the floor is what
    // draws a circle on it.
    light.position.set(0, centreY * scale, reveal * scale + 0.25);
    light.castShadow = false;
    mesh.add(light);

    // A default sun, rolled from the seed: mid-morning, swung a little off
    // square. Aiming is what makes it worth having, but a window that had to be
    // aimed before it looked like anything would be a trap.
    aimWindow(mesh, rng.range(-0.7, 0.7), rng.range(0.38, 0.95));

    return mesh;
  },
};

/**
 * Exported under the bare name too, because the registry and the art check both
 * key on the file name — but declared as `windowBuilder` first. A module-scope
 * `const window` shadows the DOM global for the whole file, and the next person
 * to reach for `window.devicePixelRatio` in here would silently get a mesh
 * builder instead.
 */
export { windowBuilder, windowBuilder as window };

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/** Smooth 0→1 between two thresholds. */
function smoothstep(a: number, b: number, x: number): number {
  const t = clamp((x - a) / Math.max(b - a, 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Scales a packed hex toward black. Additive, so this is an amount of light. */
function fade(hex: number, factor: number): number {
  const f = factor < 0 ? 0 : factor > 1 ? 1 : factor;
  const r = Math.round(((hex >> 16) & 0xff) * f);
  const g = Math.round(((hex >> 8) & 0xff) * f);
  const b = Math.round((hex & 0xff) * f);
  return (r << 16) | (g << 8) | b;
}
