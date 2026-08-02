import * as THREE from 'three';
import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { weatherTint } from '../weathering';
import type { DoorMetrics } from '../door';

/**
 * An industrial door in a steel frame.
 *
 * The works' answer to `hut-door`, and deliberately its opposite in every
 * register the two share. A hut door is boards held by ledges — verticals
 * crossed by horizontals, wood carrying iron. This is a plate stiffened by
 * riveted straps: one surface, mechanical fixings, and nothing on it that a
 * chisel made. It speaks with the `iron` voice in `audio/models/door`, which
 * is the one that rings.
 *
 * Where the hut door spends its variety on stain, this one spends it on
 * **wear**. A works door is painted iron losing an argument with weather:
 * most doors are lightly weathered, a third are properly rusted. The wear is
 * `art/weathering`'s shader stage, thresholded against a `Part.wear` field
 * that pools at the bottom and edges of the plate and runs hotter on the
 * fittings than the faces. Three earlier versions painted the speckle into
 * vertex colours instead, and every one read as its own faces; that lesson
 * is that module's header.
 *
 * Some doors carry a small shaded inspection window, high and barred — dark
 * glazing, because there are no transparent materials in the kit and a works
 * window is for glancing, not for light.
 *
 * Built facing **+Z**, standing on y = 0, centred on x, like every door: the
 * portal system derives its arrival markers from that promise.
 */

export type FactoryDoorOptions = BuildOptions;

export function buildFactoryDoor(options: FactoryDoorOptions = {}): THREE.Mesh {
  const { seed = 1, scale = 1 } = options;
  const rng = createRng(seed);
  const parts: Part[] = [];

  // Rolled first, like the hut door's material, and for the same reason:
  // how rusted a given seed's door is must not change when details are added
  // below. Two populations rather than a smear — most doors are maintained,
  // some are clearly not, and the middle would read as neither.
  const wear = rng.chance(0.35) ? rng.range(0.55, 0.9) : rng.range(0.08, 0.3);

  const width = rng.range(1.0, 1.24);
  const height = rng.range(2.1, 2.35);
  const leafThickness = 0.05;
  const jamb = rng.range(0.11, 0.15);

  const iron = shade(PALETTE.IRON, rng.range(0.92, 1.06));
  const frameTone = shade(PALETTE.IRON_DARK, rng.range(0.9, 1.05));
  /** Rust the colour of the metal it grows on — dark on the frame, brighter on plate. */
  const rustOn = (surface: number): number => weatherTint(PALETTE.RUST, surface, PALETTE.IRON);

  /**
   * Rust pooling low and creeping in from the edges — the field the shader's
   * per-pixel speckle is thresholded against. Per vertex, so the leaf needs
   * only a handful of segments for the gradient to bend; the shapes come
   * from the fragment stage, not the mesh. Kept quiet: most of a working
   * door is still paint, and the wear is read in the corners before it is
   * seen in the middle.
   */
  const corroded = (x: number, y: number): number => {
    const low = 1 - Math.min(Math.max(y / height, 0), 1);
    const edge = Math.min(Math.abs(x) / (width / 2), 1);
    return Math.min(wear * (0.08 + 0.4 * low * low + 0.14 * edge * edge), 0.85);
  };

  // --- frame --------------------------------------------------------------
  // Steel channel: the same bones as the hut door's stone surround, read as
  // rolled sections rather than dressed blocks — slimmer, and dead square.
  const frameDepth = leafThickness * 2.6;
  for (const side of [-1, 1]) {
    const post = new THREE.BoxGeometry(jamb, height + jamb, frameDepth);
    post.translate((side * (width + jamb)) / 2, (height + jamb) / 2, -frameDepth * 0.18);
    // Frames hold water at every joint, so they weather harder than the leaf
    // on average — a rusted leaf in a clean frame reads as two objects.
    parts.push({
      geometry: post,
      color: frameTone,
      sway: 0,
      wear: wear * 0.4,
      wearTint: rustOn(frameTone),
    });

    // Base plates at the post feet, bolted to whatever the floor is. The one
    // detail that most says "erected" rather than "built". Wettest metal on
    // the door, and weathered accordingly.
    const plate = new THREE.BoxGeometry(jamb * 1.7, 0.035, frameDepth * 1.4);
    plate.translate((side * (width + jamb)) / 2, 0.018, -frameDepth * 0.1);
    parts.push({
      geometry: plate,
      color: shade(frameTone, 0.85),
      sway: 0,
      wear: wear * 0.55,
      wearTint: rustOn(shade(frameTone, 0.85)),
    });
  }

  const lintel = new THREE.BoxGeometry(width + jamb * 2.4, jamb, frameDepth * 1.05);
  lintel.translate(0, height + jamb / 2, -frameDepth * 0.18);
  parts.push({
    geometry: lintel,
    color: frameTone,
    sway: 0,
    wear: wear * 0.3,
    wearTint: rustOn(frameTone),
  });

  // A steel threshold, on most doors — a works doorway takes barrows and
  // boots, and the sill is the part that shows it.
  if (rng.chance(0.7)) {
    const sill = new THREE.BoxGeometry(width + jamb * 1.6, 0.045, frameDepth * 1.5);
    sill.translate(0, 0.022, -frameDepth * 0.05);
    parts.push({
      geometry: sill,
      color: shade(frameTone, 0.8),
      sway: 0,
      wear: wear * 0.5,
      wearTint: rustOn(shade(frameTone, 0.8)),
    });
  }

  // --- leaf ---------------------------------------------------------------
  // One plate, and a coarse one: the segments exist only so the wear field
  // can bend across it — the speckle itself is per pixel and needs no
  // geometry at all. This is the paint-subdivision arms race ending.
  const leaf = new THREE.BoxGeometry(width, height, leafThickness, 6, 10, 1);
  leaf.translate(0, height / 2, leafThickness / 2);
  parts.push({
    geometry: leaf,
    color: iron,
    sway: 0,
    wear: (x, y) => corroded(x, y),
    wearTint: rustOn(iron),
  });

  // --- stiffeners and rivets ----------------------------------------------
  // Straps across the plate where a hut door has ledges — but riveted, and
  // the rivets are the read: a line of studs is what says plate steel at any
  // distance the pattern survives.
  const strapDepth = 0.02;
  const strapHeights = [height * 0.14, height * 0.5, height * 0.86];
  for (const at of strapHeights) {
    const strap = new THREE.BoxGeometry(width * 0.98, rng.range(0.09, 0.12), strapDepth);
    strap.translate(0, at, leafThickness + strapDepth / 2);
    parts.push({
      geometry: strap,
      color: shade(iron, 1.08),
      sway: 0,
      wear: wear * 0.3,
      wearTint: rustOn(shade(iron, 1.08)),
    });

    const rivets = 5;
    for (let i = 0; i < rivets; i++) {
      const rx = -width * 0.42 + (width * 0.84 * i) / (rivets - 1);
      const rivet = new THREE.CylinderGeometry(0.016, 0.02, 0.016, 6);
      rivet.rotateX(Math.PI / 2);
      rivet.translate(rx, at, leafThickness + strapDepth + 0.008);
      // Hardware stands proud of the runoff, so it does not inherit the
      // plate's rust — a fitting weathers on its own schedule, and mostly
      // later. What sells corrosion is the surface it pools on, not the
      // studs scattered through it.
      parts.push({
        geometry: rivet,
        color: shade(iron, 0.85),
        sway: 0,
        wear: wear * 0.3,
        wearTint: rustOn(shade(iron, 0.85)),
      });
    }
  }

  // A kick plate over the bottom of the leaf, proud and darker — scuffed by
  // exactly the traffic the threshold is.
  const kick = new THREE.BoxGeometry(width * 0.98, height * 0.13, 0.012);
  kick.translate(0, height * 0.065, leafThickness + 0.006);
  parts.push({
    geometry: kick,
    color: shade(iron, 0.72),
    sway: 0,
    wear: wear * 0.2,
    wearTint: rustOn(shade(iron, 0.72)),
  });

  // --- the window, sometimes ----------------------------------------------
  // Small, high, barred, and dark. Glazing in this kit is a dark surface, not
  // a transparency — the same read as the hut's windows — and the bars are
  // what keep it saying "works" rather than "cottage".
  if (rng.chance(0.45)) {
    const winW = rng.range(0.22, 0.3);
    const winH = rng.range(0.28, 0.36);
    const winY = height * 0.74;

    const collar = new THREE.BoxGeometry(winW + 0.07, winH + 0.07, 0.018);
    collar.translate(0, winY, leafThickness + 0.009);
    parts.push({
      geometry: collar,
      color: shade(frameTone, 1.05),
      sway: 0,
      wear: wear * 0.25,
      wearTint: rustOn(shade(frameTone, 1.05)),
    });

    // Smoked glass: near-black with a little blue, so it reads as glazing
    // seen at an angle rather than as a hole punched in the plate.
    const pane = new THREE.BoxGeometry(winW, winH, 0.014);
    pane.translate(0, winY, leafThickness + 0.02);
    parts.push({ geometry: pane, color: 0x232c34, sway: 0 });

    for (const bx of [-winW / 4, winW / 4]) {
      const bar = new THREE.CylinderGeometry(0.011, 0.011, winH + 0.05, 6);
      bar.translate(bx, winY, leafThickness + 0.032);
      parts.push({
        geometry: bar,
        color: shade(frameTone, 0.9),
        sway: 0,
        wear: wear * 0.3,
        wearTint: rustOn(shade(frameTone, 0.9)),
      });
    }
  }

  // --- hinges and handle ---------------------------------------------------
  // Barrel hinges on one edge, the handle on the other — the hut door's rule,
  // in the works' hardware.
  const hingeSide = rng.chance(0.5) ? -1 : 1;
  for (const at of [height * 0.2, height * 0.8]) {
    const barrel = new THREE.CylinderGeometry(0.028, 0.028, 0.16, 6);
    barrel.translate(hingeSide * (width / 2 + 0.02), at, leafThickness * 0.6);
    parts.push({
      geometry: barrel,
      color: shade(frameTone, 0.9),
      sway: 0,
      wear: wear * 0.3,
      wearTint: rustOn(shade(frameTone, 0.9)),
    });
  }

  const handleX = -hingeSide * width * rng.range(0.32, 0.38);
  const handleY = height * rng.range(0.44, 0.5);
  if (rng.chance(0.5)) {
    // A pull bar on two standoffs — the door you haul open.
    for (const dy of [-0.12, 0.12]) {
      const standoff = new THREE.BoxGeometry(0.035, 0.035, 0.05);
      standoff.translate(handleX, handleY + dy, leafThickness + 0.025);
      parts.push({ geometry: standoff, color: shade(iron, 0.8), sway: 0 });
    }
    const pull = new THREE.CylinderGeometry(0.017, 0.017, 0.3, 6);
    pull.translate(handleX, handleY, leafThickness + 0.058);
    parts.push({ geometry: pull, color: shade(iron, 1.15), sway: 0 });
  } else {
    // A lever latch on a boss — the door you unlatch and shoulder.
    const boss = new THREE.CylinderGeometry(0.042, 0.042, 0.024, 8);
    boss.rotateX(Math.PI / 2);
    boss.translate(handleX, handleY, leafThickness + 0.012);
    parts.push({ geometry: boss, color: shade(iron, 0.8), sway: 0 });

    const lever = new THREE.BoxGeometry(0.16, 0.032, 0.026);
    lever.rotateZ(rng.range(-0.25, 0.1));
    lever.translate(handleX - hingeSide * 0.055, handleY, leafThickness + 0.037);
    parts.push({ geometry: lever, color: shade(iron, 1.15), sway: 0 });
  }

  const geometry = assemble(parts);
  if (scale !== 1) geometry.scale(scale, scale, scale);

  const mesh = finish(geometry, 'factory-door', 0);
  const metrics: DoorMetrics = {
    width: (width + jamb * 2) * scale,
    height: (height + jamb) * scale,
    depth: (leafThickness + strapDepth + 0.024) * scale,
    material: 'iron',
  };
  mesh.userData.door = metrics;
  return mesh;
}

export const factoryDoor: MeshBuilder = {
  name: 'factory-door',
  category: 'structures',
  radius: 0.9,
  build: buildFactoryDoor,
};
