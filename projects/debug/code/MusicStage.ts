import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '@engine/world/Zone';
import { SILENCE, type SoundscapeSpec, type EmitterSpec } from '@engine/audio/Soundscape';
import type { PlayedOptions, PlayedVoice } from '@engine/audio/music/played';
import type { PortalEnd, PortalDefinition } from '@engine/world/Portal';
import { flatGround, GRID_TILE } from '@engine/world/floor';
import { signPost } from './galleries/layout';
import { plinth, PLINTH_H } from './SoundStage';
import { VIBES } from '@engine/audio/vibes';

/**
 * The music stage — the sound stage's method applied to the score.
 *
 * Two questions the director's real zones cannot answer, and a place for each:
 *
 * - **Is each voice right?** A rank of stations, one per instrument, each an
 *   ordinary emitter wrapping a voice in `played`, stating seeded cells in
 *   the stage's own key. **Walking to a plinth is the solo**: a station's
 *   reach ends before its neighbour begins, so the rank is silent except for
 *   the one you are standing at, and silent altogether from anywhere else.
 * - **Is the score right?** Stand on the listening ground between the doors
 *   and the rank — the stations cannot reach it, and this zone is scored, so
 *   what plays there is the director and nothing else. The dev panel's vibe
 *   control switches specs on the spot and its play button states a whole
 *   vibe in seconds; the door at the back leads to the annex, scored in
 *   another key, so a border's crossfade-and-retune can be walked.
 *
 * The way in is a door in the general props hall, beside the other
 * showcases. The second door connects the stage to its own annex, because
 * the border test needs a border.
 *
 * Ids, names and vibe fictions are placeholders — naming stays with the repo
 * owner.
 */

export const ZONE_MUSIC_STAGE = 'music-stage';
export const ZONE_MUSIC_ANNEX = 'music-annex';

/** Metres between stations. Wider than a station's reach — see `UNIFORM`. */
const PITCH = GRID_TILE * 2;
/** The two doors, well behind the listening ground. */
const DOOR_Z = 34;
/** Past every station's reach, so arrival is the score before it is the rank. */
const SPAWN_Z = 26;

/**
 * The sound stage's uniform settings with the reach cut right down — and
 * that is not tuning, it is the room's design. Past `maxDistance` an emitter
 * is disconnected outright, and six metres against an eight-metre pitch means
 * standing at a plinth plays that plinth and nothing else: the walk *is* the
 * solo. It also keeps the whole rank out of the listening ground, so the
 * score is never judged with eleven practice rooms bleeding into it.
 */
const UNIFORM = { refDistance: 2, maxDistance: 6, rolloff: 1.4, reverb: 0.4 } as const;

/** The key the rank and the listening ground share. */
const STAGE_KEY = VIBES['village 1'].music;

/** Every station states the stage's own material, in the stage's own key. */
const line = (voice: PlayedVoice, octave: number, every: number): PlayedOptions => ({
  voice,
  root: STAGE_KEY.root,
  mode: STAGE_KEY.mode,
  seed: STAGE_KEY.seed,
  octave,
  every,
});

/**
 * The rank: sustained voices, then the low one, then the struck ones, then
 * the kit — adjacency by confusability, the sound stage's ordering rule.
 * Pace and register are per family: the sustained speak slowly and low, the
 * struck speak often and high, the kit ignores pitch entirely.
 */
const RACK: readonly { name: string; options: PlayedOptions }[] = [
  { name: 'strings', options: line('strings', 0, 3.2) },
  { name: 'fiddle', options: line('fiddle', 12, 1.5) },
  { name: 'viol', options: line('viol', -12, 3.0) },
  { name: 'brass', options: line('brass', 0, 1.6) },
  { name: 'trumpet', options: line('trumpet', 12, 1.4) },
  { name: 'tuba', options: line('tuba', -12, 1.8) },
  { name: 'choir', options: line('choir', 0, 2.8) },
  { name: 'monks', options: line('monks', -12, 3.0) },
  { name: 'flute', options: line('flute', 12, 1.2) },
  { name: 'ocarina', options: line('ocarina', 12, 1.3) },
  { name: 'whistler', options: line('whistler', 12, 1.4) },
  { name: 'pipe', options: line('pipe', 0, 1.6) },
  { name: 'accordion', options: line('accordion', 0, 1.8) },
  { name: 'harmonica', options: line('harmonica', 12, 1.3) },
  { name: 'hurdy-gurdy', options: line('gurdy', 0, 2.4) },
  { name: 'organ', options: line('organ', -12, 2.6) },
  { name: 'glass', options: line('glass', 12, 4.0) },
  { name: 'saw', options: line('saw', 12, 2.2) },
  { name: 'waterphone', options: line('waterphone', 12, 3.5) },
  { name: 'hum', options: line('hum', -12, 3.0) },
  { name: 'bass', options: line('bass', -12, 1.4) },
  { name: 'bells', options: line('bells', 12, 2.6) },
  { name: 'chimes', options: line('chimes', 12, 2.2) },
  { name: 'music box', options: line('musicbox', 24, 1.0) },
  { name: 'kalimba', options: line('kalimba', 12, 0.9) },
  { name: 'tongue drum', options: line('tonguedrum', 0, 1.6) },
  { name: 'deep drum', options: line('deepdrum', 0, 2.2) },
  { name: 'marimba', options: line('marimba', 0, 1.1) },
  { name: 'vibraphone', options: line('vibraphone', 12, 1.8) },
  { name: 'anvil', options: line('anvil', 12, 1.0) },
  { name: 'oil drum', options: line('oildrum', -12, 1.5) },
  { name: 'pluck', options: line('pluck', 12, 0.9) },
  { name: 'harp', options: line('harp', 12, 1.1) },
  { name: 'dulcimer', options: line('dulcimer', 12, 0.8) },
  { name: 'guitar', options: line('guitar', 0, 1.0) },
  { name: 'banjo', options: line('banjo', 12, 0.9) },
  { name: 'jaw harp', options: line('jawharp', 0, 1.2) },
  { name: 'kick', options: line('kick', 0, 0.9) },
  { name: 'snare', options: line('snare', 0, 1.1) },
  { name: 'hat', options: line('hat', 0, 0.45) },
];

/** Where the nth station stands. Centred, so the door looks down the middle. */
function stationAt(index: number): [number, number, number] {
  const span = (RACK.length - 1) * PITCH;
  return [-span / 2 + index * PITCH, PLINTH_H + 0.25, 0];
}

const STAGE_SOUND: SoundscapeSpec = {
  emitters: RACK.map(
    (station, index): EmitterSpec => ({
      model: 'played',
      id: station.name,
      options: station.options,
      at: stationAt(index),
      ...UNIFORM,
    }),
  ),
};

/** Wide enough for the rank plus the listening ground behind it. */
function floorSize(): number {
  const span = (RACK.length - 1) * PITCH + DOOR_Z * 2 + 40;
  return Math.min(240, Math.max(120, Math.ceil(span / 20) * 20));
}

export function musicStageZone(): ZoneDefinition {
  return {
    id: ZONE_MUSIC_STAGE,
    name: 'Music Showcase',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      fogNear: floorSize() * 0.2,
      fogFar: floorSize() * 0.46,
      ambientGround: 0xbfb298,
      surface: 'stone',
      room: 'open',
      // No bed. The wind would sit under every vibe and the whole point of
      // the listening ground is hearing the silence the scarcity machine
      // actually leaves.
      soundscape: STAGE_SOUND,
      // Music only: the listening ground exists to hear the score against
      // silence, so it takes no ambience half.
      vibe: { music: 'village 1' },
    },
    spawn: { position: new THREE.Vector3(0, 0.1, SPAWN_Z), yaw: 0 },
    floor: -20,
    groundAt: () => 0,
    build() {
      const root = new THREE.Group();
      root.add(flatGround(floorSize()));
      RACK.forEach((station, index) => {
        root.add(plinth(station.name, stationAt(index)[0]));
      });
      return root;
    },
  };
}

/** Small on purpose: it exists to be *another key*, not another place. */
const ANNEX_SIZE = 60;

export function musicAnnexZone(): ZoneDefinition {
  return {
    id: ZONE_MUSIC_ANNEX,
    name: 'Music Annex',
    group: 'general',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      fogNear: ANNEX_SIZE * 0.2,
      fogFar: ANNEX_SIZE * 0.5,
      ambientGround: 0x9a8f78,
      surface: 'stone',
      // Silent apart from the score, so what changed at the door is only the
      // key. A piece that survives the crossing is the thing being proved —
      // and the cave vibe is the village's far opposite, so the border is
      // the hardest one the book has.
      soundscape: SILENCE,
      vibe: { music: 'cave' },
    },
    spawn: { position: new THREE.Vector3(0, 0.1, 4), yaw: 0 },
    floor: -20,
    groundAt: () => 0,
    build() {
      const root = new THREE.Group();
      root.add(flatGround(ANNEX_SIZE));
      const sign = signPost('annex');
      sign.position.set(2.5, 0, 4);
      root.add(sign);
      return root;
    },
  };
}

/** The way in, centred so arriving looks down the middle of the rank. */
export function musicStageDoor(): PortalEnd {
  return {
    zone: ZONE_MUSIC_STAGE,
    position: new THREE.Vector3(0, 0, DOOR_Z),
    yaw: Math.PI,
    material: 'iron',
    seed: 6703,
  };
}

/** The door from the general props hall, beside the other showcases. */
export function musicStageHallPortal(hall: PortalEnd): PortalDefinition {
  return { id: `portal:${ZONE_MUSIC_STAGE}`, a: hall, b: musicStageDoor() };
}

/**
 * The annex door, off to one side of the entrance. Half of what this room
 * exists to prove is a border crossing, and a border crossing has to be
 * walked.
 */
export function musicStagePortal(): PortalDefinition {
  return {
    id: `portal:${ZONE_MUSIC_ANNEX}`,
    a: {
      zone: ZONE_MUSIC_STAGE,
      position: new THREE.Vector3(10, 0, DOOR_Z),
      yaw: Math.PI,
      material: 'timber',
      seed: 6701,
    },
    b: {
      zone: ZONE_MUSIC_ANNEX,
      position: new THREE.Vector3(0, 0, 10),
      yaw: Math.PI,
      material: 'timber',
      seed: 6702,
    },
  };
}
