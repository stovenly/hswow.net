import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { cloneGlow, finishGlow } from '../glow';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// Window: opening, frame, curtains and the sheared daylight shaft. Built in the
// XY plane with the wall at z = 0 and everything standing proud toward +Z, floor
// at y = 0, so local +Z is the inward normal and the wall's outside faces −Z.
// The shaft is a sheared box, not a cone: the sun's rays are parallel, so what
// comes through a hole keeps the hole's cross-section, and shearing it keeps
// that cross-section in the plane of the wall.
//
// A window comes out of `build` finished — aimed and lit from its own seed — so
// a caller that knows nothing about the clock gets a window that looks right.
// `WindowLight` then overwrites both every eighth frame for any window in a
// zone that has said which way it faces; `holdWindow` takes one back.

/**
 * Where `aimWindow` will accept the sun from. Elevation is clamped off the
 * horizon because the shaft length is `centreY / sin(elevation)`; azimuth is
 * clamped short of a right angle, past which the shear inverts.
 */
export const MIN_ELEVATION = 0.1;
const MAX_ELEVATION = 1.45;
const MAX_AZIMUTH = 1.3;
/** However low the sun, the shaft stops here. Longer than any room in the game. */
const MAX_REACH = 9;

/**
 * What an opening is worth at full daylight, as material opacity. On its own
 * schedule rather than the lamps': `setGlowLevel` lifts a lamp as the sun goes
 * down, and a window has no business brightening at dusk along with them. This
 * and `WindowLight`'s night floor are the two numbers that set how a window
 * reads at midnight against how it reads at noon.
 */
const PANE_GLOW = 0.8;

/** Daylight, so brighter than any lamp in the kit. */
const LIGHT_INTENSITY = 4.5;
const LIGHT_RANGE = 16;
/**
 * Softer than inverse-square. The interesting part of this light is four metres
 * away on the floor, and at `decay: 2` everything within a metre of the opening
 * is on the top quantization level and everything past three on the bottom.
 */
const LIGHT_DECAY = 1.5;

/**
 * What the seed rolled, unless a placer says. `'none'` is what a window put
 * somewhere to be looked *through* wants: drawn curtains take the shaft away,
 * and a shaft is most of why a window is where it is.
 */
export interface WindowOptions extends BuildOptions {
  curtains?: 'none' | 'open' | 'drawn';
}

/** What `aimWindow` needs to know, and what a caller can read back. */
export interface WindowMetrics {
  /** Aperture width and height, scale already applied. */
  width: number;
  height: number;
  /** Height of the aperture's centre above the floor. */
  centreY: number;
  /** 1 with the curtains open or absent, near 0 with them drawn. Already baked
   * into the pane's vertex colour and the lamp's intensity. */
  openness: number;
  /** Current aim, in the units `aimWindow` takes. */
  azimuth: number;
  elevation: number;
  /** Warm or cold, rolled from the seed. Packed sRGB, multiplied over the day's colour. */
  tint: number;
  /** Where the shaft stops however low the sun, in metres. */
  reach: number;
  /** Radians this window's own +Z is turned from the zone's, for the odd wall. */
  bearing: number;
  /** Whether the opening keeps a floor under it once the sun is down. */
  night: 'shine' | 'dark';
  /** Whether the daylight cycle may drive it. Cleared by `holdWindow`. */
  driven: boolean;
}

/** Scratch for `lightWindow`, which runs for every window in a room. */
const TINT = new THREE.Color();

/** Reads the metrics back off a mesh built by this builder. */
export function windowMetrics(mesh: THREE.Object3D): WindowMetrics {
  return mesh.userData.window as WindowMetrics;
}

/**
 * Points the daylight somewhere else. `azimuth` is the beam's horizontal swing
 * in radians, 0 being the sun square on the window, positive swinging toward the
 * window's own +X; clamped to ±1.3. `elevation` is the sun's height above the
 * horizon, clamped to 0.1..1.45 — higher means a shorter, steeper shaft. Safe to
 * call on a curtained window, which has none.
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

  // How far along the ray the middle of the opening travels to reach the floor.
  const reach = Math.min(metrics.centreY / Math.sin(el), metrics.reach);

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

  // The lamp is not moved. It stands outside the wall where the daylight comes
  // from; following the beam to where it lands would burn a tight circle into
  // the boards, which is the round shape all this exists to be rid of.
}

/**
 * How bright this window is, and what colour. `sky` is the opening — the pane,
 * its glare and the lamp — and `beam` is the shaft, which is the one that goes
 * out when the sun swings behind the wall; a pane still shows a sky it gets no
 * sun from. Both 0..1 against full daylight. `colour` is the light itself, and
 * the window's own tint is applied over it here.
 */
export function lightWindow(
  mesh: THREE.Object3D,
  colour: THREE.Color,
  sky: number,
  beam: number,
): void {
  const metrics = mesh.userData.window as WindowMetrics | undefined;
  if (!metrics) return;
  TINT.setHex(metrics.tint, THREE.SRGBColorSpace).multiply(colour);

  const glow = mesh.getObjectByName('window:glow');
  if (glow instanceof THREE.Mesh) paint(glow.material, TINT, sky);
  const shaft = mesh.getObjectByName('window:shaft');
  if (shaft instanceof THREE.Mesh) {
    paint(shaft.material, TINT, beam);
    // A beam at nothing is still a transparent draw of a twelve-segment box.
    shaft.visible = beam > 0;
  }

  const lamp = mesh.getObjectByName('window:sun');
  if (lamp instanceof THREE.PointLight) {
    lamp.color.copy(TINT);
    lamp.intensity = (lamp.userData.lit as number) * sky;
  }
}

/**
 * Stops the daylight cycle touching this window, and optionally sets it where
 * you want first. What a showcase wants, and a room whose light must not change.
 */
export function holdWindow(
  mesh: THREE.Object3D,
  aim?: { azimuth: number; elevation: number },
): void {
  const metrics = mesh.userData.window as WindowMetrics | undefined;
  if (!metrics) return;
  metrics.driven = false;
  if (aim) aimWindow(mesh, aim.azimuth, aim.elevation);
}

/** Whether this window's opening keeps a floor under it after dark. */
export function windowNight(mesh: THREE.Object3D, night: 'shine' | 'dark'): void {
  const metrics = mesh.userData.window as WindowMetrics | undefined;
  if (metrics) metrics.night = night;
}

/** Colour multiplies vertex colour; level is opacity against a full-daylight glow. */
function paint(
  material: THREE.Material | THREE.Material[],
  colour: THREE.Color,
  level: number,
): void {
  if (Array.isArray(material) || !(material instanceof THREE.MeshBasicMaterial)) return;
  material.color.copy(colour);
  material.opacity = PANE_GLOW * (level < 0 ? 0 : level);
}

const windowBuilder: BuilderWith<WindowOptions> = {
  name: 'window',
  category: 'structures',
  // Wider than the opening: a pair of shutters flung back is most of a metre
  // either side, and two windows spaced by the aperture alone would collide.
  radius: 1,

  build({ seed = 1, scale = 1, curtains } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    // Curtains, not shutters: this is a window seen from inside a room, and
    // shutters hang outside. Rolled first, so a given seed keeps its dressing
    // however much is added below — and rolled even when the caller has said,
    // so saying does not shift everything after it. `shut` means the curtains
    // are drawn, and it still kills the shaft.
    const rolled = rng.chance(0.6);
    const rolledShut = rolled && rng.chance(0.35);
    const hasCurtains = curtains === undefined ? rolled : curtains !== 'none';
    const shut = curtains === undefined ? rolledShut : curtains === 'drawn';

    const openW = rng.range(0.66, 1.1);
    const openH = rng.range(0.8, 1.3);
    const sillY = rng.range(0.85, 1.15);
    const centreY = sillY + openH / 2;
    const jambW = rng.range(0.09, 0.14);
    // How far the whole fitting stands out from the wall — the entire supply of
    // depth the window has, since there is no hole to be recessed into.
    const reveal = rng.range(0.1, 0.16);

    // Sun, or a north light. One cold window among warm ones reads as weather
    // rather than as a palette slip. A tint rather than a colour: it multiplies
    // whatever the sky is doing, so a north window stays cool at every hour and
    // a sunset still reddens it.
    const sunny = rng.chance(0.72);
    const day = sunny ? 0xfff1d2 : 0xdce8f6;

    const timber = shade(rng.chance(0.55) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK, rng.range(0.9, 1.08));
    const stone = shade(PALETTE.STONE_DARK, rng.range(0.9, 1.1));

    // --- the daylight panel ----------------------------------------------------
    //
    // A painted board, because the wall behind it is solid. Slightly oversized,
    // so its edges run under the jambs, head and sill rather than stopping in
    // their planes.
    //
    // Dark, and it has to be: this is a surface the room's own light falls on,
    // so a pale one says the window is bright at every hour and cannot be told
    // otherwise. How bright the window is, is the glow's to say — the board is
    // only what stops you seeing wall through the glass.
    const pane = new THREE.BoxGeometry(openW + 0.024, openH + 0.024, 0.018);
    pane.translate(0, centreY, 0.011);
    parts.push({ geometry: pane, color: fade(day, 0.14), sway: 0 });

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
    // Drawn curtains keep the glow and lose the beam. Cloth with daylight behind
    // it is a lit surface, not a dark one — it is the shaft that a curtain
    // stops, and that is not built at all below.
    const openness = shut ? 0.25 : 1;
    const paneGlow = shut ? 0.6 : 1;

    // Clear of the board behind it. At 0.026 its back face lands exactly on the
    // board's front one, and two surfaces in the same plane trade places pixel
    // by pixel as the camera turns.
    const bright = new THREE.BoxGeometry(openW * 0.97, openH * 0.97, 0.012);
    bright.translate(0, centreY, 0.038);
    glow.push({ geometry: bright, color: fade(0xffffff, paneGlow), sway: 0 });

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
        // in mid-air at a hard bright rectangle. Grey, not the day's colour:
        // the hue is the material's, so it can be changed without the buffer.
        color: (_x, _y, z) => fade(0xffffff, 0.22 * Math.max(0, 1 - z) ** 1.35),
        sway: 0,
      },
    ]);

    // --- assembly ------------------------------------------------------------
    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
      // The shaft's z is a sweep parameter rather than a length, so it is left
      // alone; the metres come out of the aim matrix.
      shaftGeometry.scale(scale, scale, 1);
    }

    const mesh = finish(geometry, 'window', 0);
    // Its own materials, not the shared glow: hue and level are per window from
    // here on. Two, because the opening and the shaft answer different questions.
    mesh.add(finishGlow(glowGeometry, 'window:glow', cloneGlow()));

    const metrics: WindowMetrics = {
      width: shaftW * scale,
      height: shaftH * scale,
      centreY: centreY * scale,
      openness,
      azimuth: 0,
      elevation: 0.6,
      tint: day,
      reach: MAX_REACH * scale,
      bearing: 0,
      night: 'shine',
      driven: true,
    };
    mesh.userData.window = metrics;

    // Shut curtains get no shaft at all. A beam through a closed window reads as
    // a bug in the renderer, so it is not dimmed — it is not built.
    if (!shut) {
      const shaft = finishGlow(shaftGeometry, 'window:shaft', cloneGlow());
      shaft.matrixAutoUpdate = false;
      mesh.add(shaft);
    } else {
      shaftGeometry.dispose();
    }

    // A point source at the far end, not a spot from the window. A spot throws a
    // cone and a cone lands as a circle; there is no rectangular light available,
    // so the answer is a light with no shape at all. `aimWindow` moves it to the
    // landing point, and this position is only what it has before the first aim.
    const light = new THREE.PointLight(
      day,
      LIGHT_INTENSITY * openness * rng.around(1, 0.1) * scale * scale,
      LIGHT_RANGE * scale,
      LIGHT_DECAY,
    );
    light.name = 'window:sun';
    // What full daylight is worth here, which is what `lightWindow` scales.
    light.userData.lit = light.intensity;
    // Outside the wall, where daylight comes from. In front of the glass it lit
    // the fitting it is part of, and a point source a hand's breadth off a flat
    // board burns a circle into the middle of it — the pane has to be one
    // brightness. Every face of the window points away from here and takes
    // nothing; the room beyond it takes the wash.
    light.position.set(0, centreY * scale, -0.55 * scale);
    light.castShadow = false;
    mesh.add(light);

    // A default sun, rolled from the seed: mid-morning, swung a little off square,
    // at full daylight. A window that had to be driven before it looked like
    // anything would be a trap, and in a gallery nothing drives it.
    aimWindow(mesh, rng.range(-0.7, 0.7), rng.range(0.38, 0.95));
    lightWindow(mesh, WHITE, 1, 1);

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

/** Full daylight, for the window that is never driven. */
const WHITE = new THREE.Color(1, 1, 1);

/** Scales a packed hex toward black. Additive, so this is an amount of light. */
function fade(hex: number, factor: number): number {
  const f = factor < 0 ? 0 : factor > 1 ? 1 : factor;
  const r = Math.round(((hex >> 16) & 0xff) * f);
  const g = Math.round(((hex >> 8) & 0xff) * f);
  const b = Math.round((hex & 0xff) * f);
  return (r << 16) | (g << 8) | b;
}
