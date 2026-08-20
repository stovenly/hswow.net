import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// Window: opening, frame, curtains and the sheared daylight shaft. Built in the
// XY plane with the wall at z = 0 and everything standing proud toward +Z, floor
// at y = 0. The shaft is a sheared box, not a cone: the sun's rays are parallel,
// so what comes through a hole keeps the hole's cross-section, and shearing it
// keeps that cross-section in the plane of the wall. `aimWindow` re-aims it by
// writing the shaft's matrix directly.

/**
 * Where `aimWindow` will accept the sun from. Elevation is clamped off the
 * horizon because the shaft length is `centreY / sin(elevation)`; azimuth is
 * clamped short of a right angle, past which the shear inverts.
 */
const MIN_ELEVATION = 0.1;
const MAX_ELEVATION = 1.45;
const MAX_AZIMUTH = 1.3;
/** However low the sun, the shaft stops here. Longer than any room in the game. */
const MAX_REACH = 9;

/** Daylight, so brighter than any lamp in the kit — but weak enough not to draw a
 * circular pool of its own. The square is drawn by the additive slab. */
const LIGHT_INTENSITY = 4.5;
const LIGHT_RANGE = 16;
/**
 * Softer than inverse-square. The interesting part of this light is four metres
 * away on the floor, and at `decay: 2` everything within a metre of the opening
 * is on the top quantization level and everything past three on the bottom.
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
 * Points the daylight somewhere else. `azimuth` is the beam's horizontal swing
 * in radians, 0 being the sun square on the window, positive swinging toward the
 * window's own +X; clamped to ±1.3. `elevation` is the sun's height above the
 * horizon, clamped to 0.1..1.45 — higher means a shorter, steeper shaft and a
 * patch closer to the window. Safe to call on a curtained window.
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

  // How far along the ray the middle of the opening travels to reach the floor,
  // which is what makes the patch land on something.
  const drop = metrics.centreY / Math.sin(el);
  const reach = Math.min(drop, MAX_REACH);

  const shaft = mesh.getObjectByName('window:shaft');
  if (shaft) {
    // The third column is the sweep. x and y are carried through untouched, so the
    // cross-section stays put in the plane of the wall — that is the shear.
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
    // The aperture projected onto the floor: as wide as the window, stretched
    // along the ray by 1/sin(elevation).
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

  // The lamp stays up at the aperture rather than following the beam. A point
  // source sixty centimetres above the boards burns a tight circle into them,
  // which is the round shape all this exists to be rid of. From the aperture its
  // falloff washes the room and lands nowhere in particular, leaving the additive
  // slab as the only thing on the floor with an edge.
}

const windowBuilder: MeshBuilder = {
  name: 'window',
  category: 'structures',
  // Wider than the opening: a pair of shutters flung back is most of a metre
  // either side, and two windows spaced by the aperture alone would collide.
  radius: 1,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    // Curtains, not shutters: this is a window seen from inside a room, and
    // shutters hang outside. Rolled first, so a given seed keeps its dressing
    // however much is added below. `shut` means the curtains are drawn, and it
    // still kills the shaft.
    const hasCurtains = rng.chance(0.6);
    const shut = hasCurtains && rng.chance(0.35);

    const openW = rng.range(0.66, 1.1);
    const openH = rng.range(0.8, 1.3);
    const sillY = rng.range(0.85, 1.15);
    const centreY = sillY + openH / 2;
    const jambW = rng.range(0.09, 0.14);
    // How far the whole fitting stands out from the wall — the entire supply of
    // depth the window has, since there is no hole to be recessed into.
    const reveal = rng.range(0.1, 0.16);

    // Sun, or a north light. One cold window among warm ones reads as weather
    // rather than as a palette slip.
    const sunny = rng.chance(0.72);
    const day = sunny ? 0xfff1d2 : 0xdce8f6;
    // Deeper than the glow: the glow is additive and already at its own
    // brightness, but this is multiplied into albedo.
    const dayLight = sunny ? 0xffe3ae : 0xbed2e8;

    const timber = shade(rng.chance(0.55) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK, rng.range(0.9, 1.08));
    const stone = shade(PALETTE.STONE_DARK, rng.range(0.9, 1.1));

    // --- the daylight panel ----------------------------------------------------
    //
    // A painted board, because the wall behind it is solid. Slightly oversized,
    // so its edges run under the jambs, head and sill rather than stopping in
    // their planes.
    const pane = new THREE.BoxGeometry(openW + 0.024, openH + 0.024, 0.018);
    pane.translate(0, centreY, 0.011);
    parts.push({ geometry: pane, color: day, sway: 0 });

    // --- frame ---------------------------------------------------------------
    //
    // Jambs run past the head and sill rather than butting into them, so the
    // corners are two boxes intersecting. Boxes that meet exactly share four
    // edges apiece, and an edge belonging to four triangles is a hole.
    const jambH = openH + jambW * 2.4;
    for (const side of [-1, 1]) {
      const post = new THREE.BoxGeometry(jambW, jambH, reveal);
      post.translate((side * (openW + jambW)) / 2, centreY, reveal / 2);
      parts.push({ geometry: post, color: timber, sway: 0 });
    }

    const head = new THREE.BoxGeometry(openW + jambW * 2 + 0.1, jambW * 0.92, reveal * 1.06);
    head.translate(0, sillY + openH + jambW * 0.46, reveal * 0.5);
    parts.push({ geometry: head, color: shade(timber, 0.92), sway: 0 });

    // The sill projects further than anything else and tips forward. It is also
    // the one part of a window you can read from directly below.
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
    // Four bars at slightly different lengths, so no two share an end.
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
    // The cheapest way to make a bright rectangle read as glass rather than as a
    // hole: the bars cross in front of the light and the eye supplies the glazing.
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
    // Two panels on a pole across the head, gathered at the top and falling
    // straight; open ones are pushed back against the jambs and bunched, so they
    // are narrower and thicker than half the opening. Each is a single box — a
    // fold is a bent sheet, which nothing here may be, and a slab reads as cloth
    // provided it is thick enough for a shadow down its leading edge.
    if (hasCurtains) {
      const cloth = rng.chance(0.5)
        ? shade(PALETTE.CLOTH, rng.range(0.85, 1.05))
        : shade(PALETTE.WOOL, rng.range(0.85, 1.05));
      const poleY = sillY + openH + rng.range(0.04, 0.09);
      // Derived from `reveal`, not rolled on its own: a curtain hangs on the room
      // side of the joinery, so it is the frame's front face plus a gap for the
      // brackets. Rolled independently, the muntins end up buried in the cloth.
      const poleZ = reveal + rng.range(0.035, 0.06);
      // Sill-length, measured to the sill and clearing its top face, which the
      // tilt lifts about 16 mm proud of `sillY` at the nose.
      const drop = poleY - (sillY + rng.range(0.04, 0.1));
      // One height for both tie-backs, rolled here rather than inside the loop:
      // a joiner setting two hooks in a jamb sets them level.
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

        // A tie-back on the open ones only, which is most of why an open curtain
        // reads as open rather than as a narrow one.
        if (!shut) {
          const tie = new THREE.BoxGeometry(panelW * 1.15, 0.05, panelD * 1.2);
          tie.translate(centreX, tieY, poleZ + panelD * 0.5);
          parts.push({ geometry: tie, color: shade(cloth, 0.78), sway: 0 });
        }
      }
    }

    // --- the aperture glow ---------------------------------------------------
    // A curtained window still shows light round the cloth, so this is dimmed
    // rather than removed.
    const openness = shut ? 0.07 : 1;
    const paneGlow = shut ? 0.3 : 1;

    const bright = new THREE.BoxGeometry(openW * 0.97, openH * 0.97, 0.012);
    bright.translate(0, centreY, 0.026);
    glow.push({ geometry: bright, color: fade(day, paneGlow), sway: 0 });

    // Glare round the opening. An octahedron rather than a subdivided plane:
    // eight faces is the cheapest soft edge there is, and the falloff is vertex
    // colour going to black, which adds nothing under additive blending.
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
    // The aperture at z = 0 swept straight to z = 1; z is the sweep parameter,
    // not a length. Segmented along its length because vertex colour is evaluated
    // per face, so the fade needs faces to land on.
    const shaftW = openW * 0.94;
    const shaftH = openH * 0.94;
    const shaftGeometry = assemble([
      {
        geometry: (() => {
          const box = new THREE.BoxGeometry(shaftW, shaftH, 1, 1, 1, 12);
          box.translate(0, centreY, 0.5);
          return box;
        })(),
        // Bright at the glass, nothing at the far end. Without it the beam stops
        // in mid-air at a hard bright rectangle.
        color: (_x, _y, z) => fade(day, 0.22 * Math.max(0, 1 - z) ** 1.35),
        sway: 0,
      },
    ]);

    // --- the patch on the floor ----------------------------------------------
    // A unit square in x and z, sheared and stretched into a parallelogram by
    // `aimWindow`. Only y is a real length: the thickness, and the lift that
    // keeps it off the boards.
    const poolLift = 0.014;
    const poolGeometry = assemble([
      {
        geometry: (() => {
          const slab = new THREE.BoxGeometry(1, 0.012, 1, 4, 1, 4);
          slab.translate(0, poolLift, 0);
          return slab;
        })(),
        // Soft at the edges. A real sun patch has an edge about half a degree
        // wide, but a hard edge on a quantized pipeline stair-steps.
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
      // lengths, so they are left alone; the metres come out of the aim matrix.
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

    // Shut shutters get no shaft and no patch at all. A beam through a closed
    // window reads as a bug in the renderer, so it is not dimmed — it is not built.
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

    // A point source at the far end, not a spot from the window. A spot throws a
    // cone and a cone lands as a circle; there is no rectangular light available,
    // so the answer is a light with no shape at all. `aimWindow` moves it to the
    // landing point, and this position is only what it has before the first aim.
    const light = new THREE.PointLight(
      dayLight,
      LIGHT_INTENSITY * openness * rng.around(1, 0.1) * scale * scale,
      LIGHT_RANGE * scale,
      LIGHT_DECAY,
    );
    light.name = 'window:sun';
    // At the aperture, at its own height, standing a little into the room.
    light.position.set(0, centreY * scale, reveal * scale + 0.25);
    light.castShadow = false;
    mesh.add(light);

    // A default sun, rolled from the seed: mid-morning, swung a little off square.
    // A window that had to be aimed before it looked like anything would be a trap.
    aimWindow(mesh, rng.range(-0.7, 0.7), rng.range(0.38, 0.95));

    return mesh;
  },
};

/**
 * Exported under the bare name too, because the registry keys on the file name —
 * but declared as `windowBuilder` first: a module-scope `const window` shadows
 * the DOM global for the whole file.
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
