import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import type { ZoneEnvironment } from '@engine/world/Zone';
import { markCollidable } from '@engine/player/Collider';
import { letteringGlow, type LetteringGlowStyle } from '@engine/art/lettering';
import { assemble, finish, type Part } from '@engine/art/assemble';
import { PALETTE, shade } from '@engine/art/palette';

/**
 * A room with the lights out, for the lettering that makes its own.
 *
 * Every other gallery is a lit void, which is the right room for judging a
 * shape and the wrong one for judging a light: at an ambient of 1.8 a glowing
 * word adds a few per cent to surfaces that are already bright, and the whole
 * effect — the pool it throws, how far it reaches, what colour it puts on
 * stone — is invisible. Here the sun is off and the emitters are the only
 * light in the room.
 *
 * Five alcoves, so the light lands on three planes and the floor at once. The
 * front rank varies one thing, the strength of the light the word throws; the
 * one at the back is the same caption in both modes with the same light on
 * each, which is the comparison the lit showcase cannot make.
 */

export const ZONE_DARK_ROOM = 'dark-room';

/**
 * The ambient is low but not zero. At zero the walls are pure black until
 * something lights them, and a room with no shape at all reads as a bug rather
 * than as darkness.
 */
export const UNLIT: Partial<ZoneEnvironment> = {
  sky: false,
  fogColor: '#04050a',
  fogNear: 12,
  fogFar: 60,
  sunIntensity: 0,
  fillIntensity: 0,
  ambientIntensity: 0.18,
  ambientSky: 0x2b3340,
  ambientGround: 0x181410,
  room: 'cell',
  surface: 'stone',
  firstPersonReverb: 0.4,
};

/** How far the room reaches: x ±HALF, z from SOUTH back to NORTH, LID high. */
const HALF = 16;
const SOUTH = 18;
const NORTH = -20;
const LID = 6;
const THICK = 0.4;

export interface SealedRoom {
  /** Half-width; the room runs x ±half. */
  half: number;
  /** Near and far walls, in z. */
  south: number;
  north: number;
  height: number;
}

/**
 * Four walls and a lid. A zone with no sky has to be *sealed* — `check:world`
 * fires six hundred rays out of the spawn and one that escapes is a hole into
 * the void — and the walls are what the light lands on anyway.
 *
 * Exported because the Light Showcase is the same problem at a different size.
 */
export function sealedRoom({ half, south, north, height }: SealedRoom): THREE.Object3D {
  const parts: Part[] = [];
  const depth = south - north;
  const middle = (south + north) / 2;
  const span = half * 2 + THICK * 2;
  const stone = shade(PALETTE.STONE_DARK, 0.8);

  for (const side of [-1, 1]) {
    const wall = new THREE.BoxGeometry(THICK, height, depth + THICK * 2);
    wall.translate(side * (half + THICK / 2), height / 2, middle);
    parts.push({ geometry: wall, color: stone, sway: 0 });
  }

  for (const z of [south, north]) {
    const wall = new THREE.BoxGeometry(span, height, THICK);
    wall.translate(0, height / 2, z + (z === south ? THICK / 2 : -THICK / 2));
    parts.push({ geometry: wall, color: stone, sway: 0 });
  }

  const lid = new THREE.BoxGeometry(span, THICK, depth + THICK * 2);
  lid.translate(0, height + THICK / 2, middle);
  parts.push({ geometry: lid, color: shade(PALETTE.STONE_DARK, 0.66), sway: 0 });

  return markCollidable(finish(assemble(parts), 'sealed-room', 0));
}

/** Three walls facing +Z, so a light inside has surfaces to fall off across. */
export function alcove(width: number, depth: number, height: number): THREE.Object3D {
  const parts: Part[] = [];
  const thickness = 0.4;

  const back = new THREE.BoxGeometry(width + thickness * 2, height, thickness);
  back.translate(0, height / 2, -depth - thickness / 2);
  parts.push({ geometry: back, color: PALETTE.STONE_DARK, sway: 0 });

  // A shade darker than the back, so the corner reads as a corner in a room
  // where nothing but the word is lighting it.
  for (const side of [-1, 1]) {
    const wall = new THREE.BoxGeometry(thickness, height, depth);
    wall.translate(side * (width / 2 + thickness / 2), height / 2, -depth / 2);
    parts.push({ geometry: wall, color: shade(PALETTE.STONE_DARK, 0.86), sway: 0 });
  }

  return markCollidable(finish(assemble(parts), 'dark-alcove', 0));
}

/** A word standing in an alcove, at reading height. */
function word(text: string, style: LetteringGlowStyle, x: number, z: number): THREE.Mesh {
  const mesh = letteringGlow(text, PALETTE.LAMPLIGHT, style);
  mesh.position.set(x, 1.7, z);
  return mesh;
}

/** The front rank: one thing changes, and it is the light. */
const RANK: [string, number, number][] = [
  ['NO LIGHT', 0, 0],
  ['LIGHT 3', 3, 6],
  ['LIGHT 8', 8, 9],
  ['LIGHT 20', 20, 14],
];

export const darkRoomPlan: GalleryPlan = {
  id: ZONE_DARK_ROOM,
  group: 'general',
  name: 'Dark Room',
  door: 'iron',
  // Nothing in here is a builder. The room is a light rig, not a catalogue.
  builders: [],
  environment: UNLIT,

  extras() {
    const extras: THREE.Object3D[] = [
      sealedRoom({ half: HALF, south: SOUTH, north: NORTH, height: LID }),
    ];

    RANK.forEach(([text, intensity, range], i) => {
      const x = -10.5 + i * 7;
      const bay = alcove(5, 2.6, 4);
      bay.position.set(x, 0, -4);
      extras.push(bay);
      extras.push(
        word(
          text,
          {
            capHeight: 0.24,
            depth: 1.2,
            intensity: 2,
            light: intensity > 0 ? { intensity, range } : undefined,
          },
          x,
          -5,
        ),
      );
    });

    // The back alcove: both modes, one light each, so the difference is the
    // mode and not the lighting.
    const feature = alcove(13, 3.5, 5);
    feature.position.set(0, 0, -15);
    extras.push(feature);
    const style: LetteringGlowStyle = {
      capHeight: 0.2,
      weight: 0.18,
      depth: 1.2,
      intensity: 2,
      light: { intensity: 10, range: 10 },
    };
    extras.push(word('SOLID\nTHROWING LIGHT', style, -3.4, -16.4));
    extras.push(word('ADDITIVE\nTHROWING LIGHT', { ...style, additive: true }, 3.4, -16.4));

    return extras;
  },
};
