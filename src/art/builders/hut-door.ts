import * as THREE from 'three';
import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import type { DoorMaterial } from '../../audio/models/door';
import type { DoorMetrics } from '../door';

// A village door in its frame: wooden, always, with the variety spent on the
// stain. Built facing +Z, standing on y = 0, centred on x — portals place it by
// position and yaw, and derive the arrival marker from that promise.
//
// The leaf is separate planks rather than one slab, each a hair proud of its
// neighbour, with the ledges proud of the planks and the ironwork proud of the
// ledges, so nothing shares a plane. It is inset into the frame and never opens:
// portals are a click and a fade, and `audio/models/door` carries the swing.

/** The two wooden voices. The iron one belongs to `factory-door`. */
export type HutDoorMaterial = Extract<DoorMaterial, 'timber' | 'plank'>;

export interface HutDoorOptions extends BuildOptions {
  /** Chooses the voice and the family of stains. Rolled from the seed if omitted. */
  material?: HutDoorMaterial;
}

export interface WoodStain {
  leaf: number;
  ledge: number;
  iron: number;
  frame: number;
}

/**
 * The stains, by voice. `timber` is the fitted, oiled door of a house — darker,
 * denser finishes on a stone frame; `plank` is rough sawn boards on an
 * outbuilding. The split is acoustic as much as visual: the voice a portal plays
 * is chosen by material. Within a family the stains differ in hue, not only
 * value, because the quantizer collapses same-hue brightness steps, and the
 * ironwork darkens or rusts with the wood.
 */
// Exported for `hut-trapdoor`, which is joinery from the same yard.
export const HUT_STAINS: Record<HutDoorMaterial, readonly WoodStain[]> = {
  timber: [
    // Oiled oak. The old default look, kept: it is what a cared-for door is.
    {
      leaf: PALETTE.TIMBER,
      ledge: PALETTE.TIMBER_DARK,
      iron: PALETTE.IRON,
      frame: PALETTE.STONE_DARK,
    },
    // Honey — freshly finished, the brightest a house door gets.
    {
      leaf: shade(PALETTE.TIMBER, 1.18),
      ledge: PALETTE.TIMBER,
      iron: PALETTE.IRON_DARK,
      frame: PALETTE.STONE,
    },
    // Walnut — dark-stained, the formal one. Ledges darker still, so the
    // shadow gaps between boards stay legible against near-dark wood.
    {
      leaf: PALETTE.TIMBER_DARK,
      ledge: shade(PALETTE.TIMBER_DARK, 0.78),
      iron: PALETTE.IRON_DARK,
      frame: PALETTE.STONE_DARK,
    },
    // Russet — a red-brown stain, the one colour in the family that is a
    // pigment rather than a depth of the same brown.
    {
      leaf: 0x7d4f36,
      ledge: 0x5c3a28,
      iron: PALETTE.IRON_DARK,
      frame: PALETTE.STONE_DARK,
    },
    // Tarred — pitch-blacked against weather, with rusted straps. As dark as
    // the family goes; the ledges are *lighter* than the leaf here, because
    // this is the one stain where the boards are darker than their braces.
    {
      leaf: 0x453c33,
      ledge: 0x57493c,
      iron: PALETTE.RUST,
      frame: PALETTE.STONE_DARK,
    },
  ],
  plank: [
    // Sun-bleached softwood on a timber frame. The old plank look, kept — see
    // the palette note on `TIMBER_PALE`: the door whose whole idea is visible
    // boards needs pale wood for the gaps to shadow against.
    {
      leaf: PALETTE.TIMBER_PALE,
      ledge: PALETTE.TIMBER,
      iron: PALETTE.RUST,
      frame: PALETTE.TIMBER_DARK,
    },
    // Silvered — decades of weather, no finish left at all. Grey, but a warm
    // grey; true neutral reads as primed metal, which is the other builder.
    {
      leaf: 0x968d7c,
      ledge: 0x736b5c,
      iron: PALETTE.RUST,
      frame: PALETTE.TIMBER_DARK,
    },
    // Tan — worked but unfinished, between the bleached and the silvered.
    {
      leaf: 0x9c8261,
      ledge: 0x7a654b,
      iron: PALETTE.IRON,
      frame: shade(PALETTE.TIMBER_DARK, 0.88),
    },
  ],
};

const MATERIALS: readonly HutDoorMaterial[] = ['timber', 'plank'];

export function buildHutDoor(options: HutDoorOptions = {}): THREE.Mesh {
  const { seed = 1, scale = 1 } = options;
  const rng = createRng(seed);
  const parts: Part[] = [];

  // Rolled first, so a given seed keeps its material no matter what is added
  // to the builder below it. The stain rolls second, under the same rule.
  const material = options.material ?? rng.pick(MATERIALS);
  const look = rng.pick(HUT_STAINS[material]);
  // A few percent of per-door drift on top of the stain, so two doors in the
  // same stain still are not the same door.
  const leafTone = shade(look.leaf, rng.range(0.94, 1.06));

  const width = rng.range(0.94, 1.16);
  const height = rng.range(2.0, 2.28);
  const leafThickness = rng.range(0.07, 0.1);
  const jamb = rng.range(0.13, 0.18);

  // --- frame --------------------------------------------------------------
  // Set back behind the leaf so the leaf reads as sitting *in* the opening.
  const frameDepth = leafThickness * 2.4;
  for (const side of [-1, 1]) {
    const post = new THREE.BoxGeometry(jamb, height + jamb, frameDepth);
    post.translate((side * (width + jamb)) / 2, (height + jamb) / 2, -frameDepth * 0.18);
    parts.push({ geometry: post, color: look.frame, sway: 0 });
  }

  const lintel = new THREE.BoxGeometry(width + jamb * 2.6, jamb, frameDepth * 1.1);
  lintel.translate(0, height + jamb / 2, -frameDepth * 0.18);
  parts.push({ geometry: lintel, color: look.frame, sway: 0 });

  // A sill, on some doors. Worn stone under a doorway is one of the few
  // details that says a place has been used rather than built.
  if (rng.chance(0.55)) {
    const sill = new THREE.BoxGeometry(width + jamb * 2.2, 0.06, frameDepth * 1.5);
    sill.translate(0, 0.03, -frameDepth * 0.1);
    parts.push({ geometry: sill, color: look.frame, sway: 0 });
  }

  // --- leaf ---------------------------------------------------------------
  // A dark void behind the planks, so the gaps between them read as depth
  // rather than as holes onto whatever is on the other side of the wall.
  const back = new THREE.BoxGeometry(width, height, 0.02);
  back.translate(0, height / 2, -leafThickness * 0.5);
  parts.push({ geometry: back, color: 0x14161a, sway: 0 });

  const plankCount = rng.int(4, 6);
  const plankWidth = width / plankCount;
  for (let i = 0; i < plankCount; i++) {
    // Each plank slightly narrower than its share, leaving a shadow gap, each at
    // its own thickness, and each at its own few percent of the stain — which is
    // what stops five boards reading as one board with grooves cut in it.
    const thickness = leafThickness * rng.range(0.88, 1);
    const plank = new THREE.BoxGeometry(plankWidth * 0.94, height * rng.range(0.985, 1), thickness);
    plank.translate(
      -width / 2 + plankWidth * (i + 0.5),
      height / 2,
      thickness / 2,
    );
    parts.push({ geometry: plank, color: shade(leafTone, rng.range(0.95, 1.05)), sway: 0 });
  }

  // --- ledges -------------------------------------------------------------
  // Horizontal braces holding the planks together. Two or three, and never evenly
  // spread: a real door has them where the racking is, not at thirds.
  const ledgeHeights = rng.chance(0.4)
    ? [height * 0.16, height * 0.52, height * 0.87]
    : [height * 0.18, height * 0.82];
  const ledgeDepth = leafThickness * 0.42;
  for (const at of ledgeHeights) {
    const ledge = new THREE.BoxGeometry(width * 0.96, rng.range(0.1, 0.15), ledgeDepth);
    ledge.translate(0, at, leafThickness + ledgeDepth / 2);
    parts.push({ geometry: ledge, color: look.ledge, sway: 0 });
  }

  // --- ironwork -----------------------------------------------------------
  // Hinge straps run from one edge across the ledges. Which edge is the hinge side
  // is rolled once and reused, so the straps and the handle end up on opposite
  // sides of the door.
  const hingeSide = rng.chance(0.5) ? -1 : 1;
  const strapDepth = ledgeDepth * 0.5;
  for (const at of [ledgeHeights[0], ledgeHeights[ledgeHeights.length - 1]]) {
    const reach = width * rng.range(0.45, 0.7);
    const strap = new THREE.BoxGeometry(reach, 0.055, strapDepth);
    strap.translate(
      hingeSide * (width / 2 - reach / 2),
      at,
      leafThickness + ledgeDepth + strapDepth / 2,
    );
    parts.push({ geometry: strap, color: look.iron, sway: 0 });

    // The pintle: a stub at the hinge edge, level with the strap.
    const pin = new THREE.BoxGeometry(0.07, 0.09, strapDepth * 2.2);
    pin.translate(hingeSide * (width / 2 + 0.02), at, leafThickness + strapDepth);
    parts.push({ geometry: pin, color: look.iron, sway: 0 });
  }

  // Handle on the far side from the hinges, at hand height.
  const handleX = -hingeSide * width * rng.range(0.3, 0.36);
  const handleY = height * rng.range(0.44, 0.5);
  if (rng.chance(0.5)) {
    // A knob on a short stem, over a backplate. A ring is the wrong shape for this
    // pipeline: a torus at eight segments is a faceted polygon loop and its hole is
    // a couple of pixels wide once the render pass has chunked it.
    const plate = new THREE.CylinderGeometry(0.062, 0.062, 0.02, 8);
    plate.rotateX(Math.PI / 2);
    plate.translate(handleX, handleY, leafThickness + 0.01);
    parts.push({ geometry: plate, color: look.iron, sway: 0 });

    const stem = new THREE.CylinderGeometry(0.022, 0.026, 0.05, 6);
    stem.rotateX(Math.PI / 2);
    stem.translate(handleX, handleY, leafThickness + 0.043);
    parts.push({ geometry: stem, color: look.iron, sway: 0 });

    // Slightly flattened along its own axis, so it sits like a turned knob
    // rather than a ball stuck to the door.
    const knob = new THREE.IcosahedronGeometry(0.052, 0);
    knob.scale(1, 1, 0.78);
    knob.translate(handleX, handleY, leafThickness + 0.095);
    parts.push({ geometry: knob, color: look.iron, sway: 0 });
  } else {
    // A bar.
    const bar = new THREE.BoxGeometry(0.045, 0.2, 0.045);
    bar.translate(handleX, handleY, leafThickness + 0.055);
    parts.push({ geometry: bar, color: look.iron, sway: 0 });
    for (const dy of [-0.09, 0.09]) {
      const mount = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      mount.translate(handleX, handleY + dy, leafThickness + 0.025);
      parts.push({ geometry: mount, color: look.iron, sway: 0 });
    }
  }

  const geometry = assemble(parts);
  if (scale !== 1) geometry.scale(scale, scale, scale);

  const mesh = finish(geometry, 'hut-door', 0);
  const metrics: DoorMetrics = {
    width: (width + jamb * 2) * scale,
    height: (height + jamb) * scale,
    depth: (leafThickness + ledgeDepth + strapDepth) * scale,
    material,
  };
  mesh.userData.door = metrics;
  return mesh;
}

export const hutDoor: MeshBuilder = {
  name: 'hut-door',
  display: 'Wood Door',
  category: 'structures',
  radius: 0.9,
  build: buildHutDoor,
};
