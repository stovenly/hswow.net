import * as THREE from 'three';
import { OUTDOOR_ENVIRONMENT, type ZoneDefinition } from '../world/Zone';
import type { SoundscapeSpec, EmitterSpec } from '../audio/Soundscape';
import type { ScatterSpec } from '../audio/Scatter';
import type { PortalEnd, PortalDefinition } from '../world/Portal';
import { markCollidable } from '../player/Collider';
import { flatGround, GRID_TILE } from '../world/floor';
import { signPost } from './galleries/layout';
import { PALETTE, shade } from '../art/palette';

/**
 * A room with one of everything in it, standing in a line.
 *
 * SPEC promised this in Phase 3 and it never got built, and the cost of not
 * having it has been paid steadily ever since: every model in the library was
 * tuned in whatever zone happened to contain it, against whatever else that
 * zone was playing, in whatever room that zone declares. Three variables, none
 * of them the model.
 *
 * ## What it is for, in order
 *
 * - **Comparison.** The commonest way a procedural library sounds bad is not
 *   that any one model is wrong — it is that one of them is four times louder
 *   than its neighbours, and nothing reveals that except hearing them in a row
 *   at the same distance. The stations are evenly spaced and identically
 *   configured for exactly that reason: every emitter here has the same
 *   `refDistance`, `maxDistance` and rolloff, so **the only difference between
 *   two stations is the model.** Any temptation to tune the spacing or the
 *   reach of one station is the temptation to hide the thing this room exists
 *   to show.
 * - **Isolation.** Walking up to a station gets you most of the way; `setSolo`
 *   gets the rest, because a shared room tail and a neighbouring drone sit
 *   underneath a source however close you stand.
 * - **Rooms.** The FDN's parameters are live, so a cave can be dialled in with
 *   no cave to stand in. This is the one thing here that cannot be done
 *   anywhere else at all.
 *
 * ## Why it is a rank and not a circle
 *
 * A ring of sources around a listener is the obvious layout and it is the
 * wrong one: it makes every station equidistant, which sounds like a fair test
 * and removes the ability to *approach* anything. Half of what these models do
 * is change with distance — air absorption darkens them, the panner LOD swaps
 * under them, the reverb send stays put while the dry path falls away — and
 * none of that is audible from a fixed radius. A rank is walked.
 *
 * ## The stage is silent until you are on it
 *
 * Fifteen sources at once is more than any real zone will ever run, which is
 * what makes it a performance test — and also means this room must never be
 * entered by accident. It has no door in the hub rank. The only way in is the
 * zone jump list under `?debug`, which is a deliberate act by someone who is
 * already holding the tools.
 */

export const ZONE_SOUND_STAGE = 'sound-stage';

/** Metres between stations. Far enough that walking to one is soloing it. */
const PITCH = GRID_TILE * 1.5;
/** How far back the door stands. Enough to see the whole rank on arrival. */
const DOOR_Z = 14;
/** Pedestal top. Roughly chest height, so a source is not at your feet. */
const PLINTH_H = 1.15;

/**
 * One entry in the rack.
 *
 * `spec` is everything except the position, which the layout supplies — a
 * station that carried its own coordinates would drift out of line the moment
 * anything before it in the rack changed.
 */
type Station =
  | { kind: 'emitter'; name: string; spec: Omit<EmitterSpec, 'at'> }
  | { kind: 'scatter'; name: string; spec: Omit<ScatterSpec, 'at'> };

/**
 * Shared by every station, and the whole basis of the comparison.
 *
 * Generous reach, because the rank is wide and a source that goes virtual
 * halfway down it cannot be compared with anything. Gentle rolloff for the
 * same reason. A modest send: enough that the room is audible and not so much
 * that fifteen sources build a wash nobody can hear a model through.
 */
const UNIFORM = { refDistance: 2, maxDistance: 42, rolloff: 1.2, reverb: 0.4 } as const;

/**
 * The rack, in the order it stands.
 *
 * Grouped by family rather than alphabetically — weather, then water, then
 * fire and works, then voices, then the one-shots — because the comparison
 * that matters is between things that might be confused for one another, and
 * that comparison is easiest when they are adjacent.
 *
 * Every model's options are its **defaults**, or as near as makes no
 * difference. A stage tuned to flatter each model is a stage that agrees with
 * itself and tells you nothing; what is wanted here is what a zone gets when
 * it declares a model and says nothing else.
 */
const RACK: readonly Station[] = [
  // --- weather ------------------------------------------------------------
  {
    kind: 'emitter',
    name: 'wind',
    // Positional here and non-positional everywhere else, which is the one
    // deliberate lie in this room. Wind is the air you are standing in and
    // spatialising it in a zone is wrong — but a bed cannot be walked up to,
    // and a model that cannot be walked up to cannot be judged beside one that
    // can.
    spec: { model: 'wind', id: 'wind', options: { gain: 0.3 }, ...UNIFORM },
  },
  {
    kind: 'emitter',
    name: 'foliage',
    spec: { model: 'foliage', id: 'foliage', options: { gain: 0.4 }, ...UNIFORM },
  },
  {
    kind: 'emitter',
    name: 'rain',
    spec: {
      model: 'rain',
      id: 'rain',
      // The one model in the library that defaults to off, because a zone
      // declares it and then decides when it rains. On the stage that would be
      // a station of silence with a sign in front of it.
      options: { gain: 0.5, intensity: 0.6, surface: 'earth' },
      ...UNIFORM,
    },
  },
  // --- water --------------------------------------------------------------
  {
    kind: 'emitter',
    name: 'water',
    spec: { model: 'water', id: 'water', options: { gain: 0.4 }, ...UNIFORM },
  },
  {
    kind: 'scatter',
    name: 'drip',
    spec: { sound: 'drip', id: 'drip', every: 3.5, spread: [0.2, 0.1, 0.2], ...UNIFORM },
  },
  // --- fire and works -----------------------------------------------------
  {
    kind: 'emitter',
    name: 'fire',
    spec: { model: 'fire', id: 'fire', options: { gain: 0.5 }, ...UNIFORM },
  },
  {
    kind: 'emitter',
    name: 'machine',
    spec: { model: 'machine', id: 'machine', options: { gain: 0.35 }, ...UNIFORM },
  },
  {
    kind: 'emitter',
    name: 'friction',
    // `'steady'` here alone. Every friction source in the world moves in bursts
    // and stops, which is right in a place and useless on a bench — you cannot
    // compare a model against its neighbours while waiting fourteen seconds for
    // it to say something.
    spec: {
      model: 'friction',
      id: 'friction',
      options: { motion: 'steady', speed: 0.28, gain: 0.4 },
      ...UNIFORM,
    },
  },
  {
    kind: 'emitter',
    name: 'waveguide',
    // Struck rather than blown, and driven steadily rather than by weather.
    // Both for the same reason `friction` is `'steady'` here: a bench wants
    // the model, not its silences, and `'chime'` is the mode that shows what
    // the loop actually does — the timbre changing as it rings, which is the
    // one thing the modal fallback cannot reproduce and therefore the thing
    // worth being able to hear side by side.
    spec: {
      model: 'waveguide',
      id: 'waveguide',
      options: { excite: 'chime', pitch: 900, decay: 3, bright: 0.7, drive: 0.3, gain: 0.4 },
      ...UNIFORM,
    },
  },
  {
    kind: 'scatter',
    name: 'hammer',
    spec: { sound: 'hammer', id: 'hammer', every: 4, spread: [0.3, 0.2, 0.3], ...UNIFORM },
  },
  {
    kind: 'scatter',
    name: 'clatter',
    spec: { sound: 'clatter', id: 'clatter', every: 6, spread: [0.5, 0.2, 0.5], ...UNIFORM },
  },
  // --- voices -------------------------------------------------------------
  {
    kind: 'emitter',
    name: 'bird',
    spec: { model: 'bird', id: 'bird', options: { gain: 0.2 }, ...UNIFORM },
  },
  {
    kind: 'emitter',
    name: 'crowd',
    spec: { model: 'crowd', id: 'crowd', options: { gain: 0.4 }, ...UNIFORM },
  },
  {
    kind: 'scatter',
    name: 'animal',
    spec: { sound: 'animal', id: 'animal', every: 5, spread: [0.4, 0.2, 0.4], ...UNIFORM },
  },
  {
    kind: 'scatter',
    name: 'bell',
    spec: {
      sound: 'bell',
      id: 'bell',
      every: 11,
      spread: [0.2, 0.1, 0.2],
      // The one exception to the uniform send, and it is not tuning. A bell is
      // most of tail, and at 0.4 the stage's bell would be a struck plate with
      // a room somewhere behind it rather than the thing the model is.
      ...UNIFORM,
      reverb: 1,
    },
  },
];

/**
 * Every station's id, in rack order. For the solo control.
 *
 * Every entry declares one — `Soundscape.setSolo` and `findField` both look
 * things up by it, and a station with no id is a station that cannot be
 * soloed, which on a bench is the same as not being there.
 */
export const STAGE_STATIONS: readonly string[] = RACK.map(
  (station) => station.spec.id as string,
);

/** Where the nth station stands. Centred, so the door looks down the middle. */
function stationAt(index: number): [number, number, number] {
  const span = (RACK.length - 1) * PITCH;
  return [-span / 2 + index * PITCH, PLINTH_H + 0.25, 0];
}

const STAGE_SOUND: SoundscapeSpec = {
  emitters: RACK.flatMap((station, index) =>
    station.kind === 'emitter' ? [{ ...station.spec, at: stationAt(index) } as EmitterSpec] : [],
  ),
  scatter: RACK.flatMap((station, index) =>
    station.kind === 'scatter' ? [{ ...station.spec, at: stationAt(index) } as ScatterSpec] : [],
  ),
};

const PLINTH = new THREE.MeshLambertMaterial({
  color: shade(PALETTE.STONE, 0.94),
  flatShading: true,
});
const PLINTH_TOP = new THREE.MeshLambertMaterial({
  color: shade(PALETTE.STONE_PALE, 1.02),
  flatShading: true,
});

/**
 * A block with a cap on it, and the station's name on a post beside it.
 *
 * **Something has to be standing where the sound is.** That rule is written
 * down for the world and it holds here for a different reason: a rack of
 * fifteen invisible sources is a room where you cannot tell whether you are
 * standing in front of a station or between two of them, and the whole method
 * depends on knowing which one you are hearing.
 *
 * Deliberately not an art-kit builder. Every builder in the kit is a *thing* —
 * a tree, an anvil, a hopper — and it carries associations that would be read
 * as part of the sound standing on it. A plain block carries none, which is
 * what a bench wants.
 */
function plinth(name: string, x: number): THREE.Group {
  const group = new THREE.Group();
  group.name = `station:${name}`;

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, PLINTH_H, 0.8), PLINTH);
  body.position.set(x, PLINTH_H / 2, 0);
  group.add(markCollidable(body));

  const cap = new THREE.Mesh(new THREE.BoxGeometry(1, 0.09, 1), PLINTH_TOP);
  cap.position.set(x, PLINTH_H + 0.045, 0);
  group.add(markCollidable(cap));

  // In front of the plinth, on the side you approach from, so the caption is
  // never behind the thing it names.
  const sign = signPost(name);
  sign.position.set(x, 0, 1.5);
  group.add(sign);

  return group;
}

/** Wide enough for the rank plus room to stand back from either end. */
function floorSize(): number {
  const span = (RACK.length - 1) * PITCH + DOOR_Z * 2 + 40;
  return Math.min(200, Math.max(120, Math.ceil(span / 20) * 20));
}

export function soundStageZone(): ZoneDefinition {
  return {
    id: ZONE_SOUND_STAGE,
    name: 'Sound Stage',
    environment: {
      ...OUTDOOR_ENVIRONMENT,
      fogNear: floorSize() * 0.2,
      fogFar: floorSize() * 0.46,
      ambientGround: 0xbfb298,
      surface: 'stone',
      // Starts dry. Every other room in the game declares an acoustic and this
      // one declares the absence of one, because the first question about a
      // model is what it sounds like before a room has had its way with it.
      // The stage's own control changes this live.
      room: 'open',
      soundscape: STAGE_SOUND,
    },
    spawn: { position: new THREE.Vector3(0, 0.1, DOOR_Z - 2), yaw: 0 },
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

/**
 * The stage end of a portal, for whoever wants to stand a door here.
 *
 * Nothing does yet, and that is on purpose — see the header. It exists so that
 * putting one in later is a line rather than a redesign, and so the zone can
 * be reached the way every other zone is if that ever becomes the right call.
 */
export function soundStageDoor(): PortalEnd {
  return {
    zone: ZONE_SOUND_STAGE,
    position: new THREE.Vector3(0, 0, DOOR_Z),
    yaw: Math.PI,
    material: 'iron',
    seed: 6601,
  };
}

export function soundStagePortal(hub: PortalEnd): PortalDefinition {
  return { id: `portal:${ZONE_SOUND_STAGE}`, a: hub, b: soundStageDoor() };
}
