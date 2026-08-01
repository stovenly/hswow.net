import * as THREE from 'three';
import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { DoorMaterial } from '../../audio/models/door';

/**
 * A door in its frame.
 *
 * Built facing **+Z**, standing on y = 0, centred on x. Portals place it by
 * position and yaw, so every door in the game agrees about which way "out of
 * the doorway" points and the arrival marker in front of it can be derived
 * rather than authored.
 *
 * The leaf is made of separate planks rather than one slab. It costs a handful
 * of boxes and it is the whole reason the thing reads as carpentry — a single
 * flat panel at this polygon count is indistinguishable from a hole with a
 * colour in it. Each plank is a hair proud of its neighbour, the ledges are
 * proud of the planks and the ironwork is proud of the ledges, so nothing
 * shares a plane with anything else. Coincident faces cost nothing to avoid
 * here and z-fight visibly at every distance if you don't.
 *
 * The leaf is inset into the frame and never opens — Phase 5 portals are a
 * click and a fade, not a swing. `audio/models/door` carries the swing instead,
 * as a synthetic gesture, which is why nothing here has a hinge axis.
 */

interface DoorOptions extends BuildOptions {
  /** Chooses both the look and the voice. Rolled from the seed if omitted. */
  material?: DoorMaterial;
}

interface Palette {
  leaf: number;
  ledge: number;
  iron: number;
  frame: number;
}

const LOOKS: Record<DoorMaterial, Palette> = {
  timber: {
    leaf: PALETTE.TIMBER,
    ledge: PALETTE.TIMBER_DARK,
    iron: PALETTE.IRON,
    frame: PALETTE.STONE_DARK,
  },
  iron: {
    leaf: PALETTE.IRON,
    ledge: PALETTE.STONE_DARK,
    iron: PALETTE.RUST,
    frame: PALETTE.STONE,
  },
  // Rough sawn boards, and the pale one of the three. It used to take
  // `TIMBER_DARK` for both leaf and frame, which made the door whose entire
  // idea is *visible planks* the one door you could not see the planks on —
  // the gaps between boards are read by the shadow between them, and there is
  // no shadow to see against near-black wood.
  plank: {
    leaf: PALETTE.TIMBER_PALE,
    ledge: PALETTE.TIMBER,
    iron: PALETTE.RUST,
    frame: PALETTE.TIMBER_DARK,
  },
};

const MATERIALS: readonly DoorMaterial[] = ['timber', 'iron', 'plank'];

/**
 * What a door is called when the player looks at it.
 *
 * Descriptive rather than evocative, on purpose. This is the top line of the
 * tooltip and it names the *object*; the line beneath it names the place, and
 * that one is content. A door that called itself something atmospheric would be
 * competing with the destination for the one thing the player is reading.
 */
const NAMES: Record<DoorMaterial, string> = {
  timber: 'Wooden Door',
  iron: 'Iron Door',
  plank: 'Plank Door',
};

export function doorName(material: DoorMaterial): string {
  return NAMES[material];
}

/** What a portal needs to know about the door it just built. */
export interface DoorMetrics {
  width: number;
  height: number;
  /** How far the leaf's face stands out from the wall behind it. */
  depth: number;
  material: DoorMaterial;
}

/** Reads the metrics back off a mesh built by this builder. */
export function doorMetrics(mesh: THREE.Mesh): DoorMetrics {
  return mesh.userData.door as DoorMetrics;
}

export function buildDoor(options: DoorOptions = {}): THREE.Mesh {
  const { seed = 1, scale = 1 } = options;
  const rng = createRng(seed);
  const parts: Part[] = [];

  // Rolled first, so a given seed keeps its material no matter what is added
  // to the builder below it.
  const material = options.material ?? rng.pick(MATERIALS);
  const look = LOOKS[material];

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
    // Each plank slightly narrower than its share, leaving a shadow gap, and
    // each at its own thickness so the face is not perfectly flat.
    const thickness = leafThickness * rng.range(0.88, 1);
    const plank = new THREE.BoxGeometry(plankWidth * 0.94, height * rng.range(0.985, 1), thickness);
    plank.translate(
      -width / 2 + plankWidth * (i + 0.5),
      height / 2,
      thickness / 2,
    );
    parts.push({ geometry: plank, color: look.leaf, sway: 0 });
  }

  // --- ledges -------------------------------------------------------------
  // Horizontal braces holding the planks together. Two or three, and never
  // evenly spread — a real door has them at the top and bottom where the
  // racking is, not at thirds.
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
  // Hinge straps run from one edge across the ledges. Which edge is the hinge
  // side is rolled once and reused, so the straps and the handle end up on
  // opposite sides of the door like they would on a real one.
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
    // A knob on a short stem, over a backplate.
    //
    // This was a ring hanging from a plate, and a ring is the wrong shape for
    // this pipeline: a torus at eight segments is a faceted polygon loop, the
    // hole in the middle is a couple of pixels wide once the render pass has
    // chunked it, and what survives is a smudge that reads as damage rather
    // than as a handle. A knob is convex, catches the light on one side, and
    // is legible at any distance the door is visible from.
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

  const mesh = finish(geometry, 'door', 0);
  const metrics: DoorMetrics = {
    width: (width + jamb * 2) * scale,
    height: (height + jamb) * scale,
    depth: (leafThickness + ledgeDepth + strapDepth) * scale,
    material,
  };
  mesh.userData.door = metrics;
  return mesh;
}

export const door: MeshBuilder = {
  name: 'door',
  category: 'structures',
  radius: 0.9,
  build: buildDoor,
};
