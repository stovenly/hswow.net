import * as THREE from 'three';
import type { AudioEngine } from '../AudioEngine';
import { createModalBank } from '../dsp/modal';
import { strike } from '../dsp/envelopes';
import { thump } from '../dsp/impact';

/**
 * The sound of going somewhere else.
 *
 * Played when a portal is used. Its job is to tell the player they have changed
 * places, over a fade that takes about six tenths of a second — so it has to be
 * **recognisable inside the first hundred milliseconds** and finished before the
 * fade is. Door-shaped, because the thing you pressed was a door. Not a
 * simulation of one.
 *
 * That distinction matters, and getting it wrong cost two rewrites. The first
 * version was a stick-slip friction creak: a scheduled train of impulses whose
 * rate followed a synthetic swing trajectory, with a bank of resonators derived
 * from Farnell's measured wooden-door formants. The physics was right and the
 * sound was wrong, for reasons worth keeping:
 *
 * - **Creaking was never the brief.** A door that groans is a *character* —
 *   it says neglected, heavy, old. Nothing here has asked for that yet, and a
 *   transition cue that editorialises is worse than one that does not.
 * - **The Q values were invented.** Farnell's six frequencies came across
 *   correctly and their Q was derived from a decay time as `π · f · decay`,
 *   giving 59 to 176. His are `1, 1, 2, 2, 3, 3` — written as `rq`, the
 *   *reciprocal*, which is a bandwidth. Read as Q they are two orders out.
 *   Web Audio's bandpass has a constant 0 dB peak, so a Q of 200 passes a slice
 *   a few hertz wide and almost no energy; the iron door's modes all clamped at
 *   the ceiling and it came out a six-tone drone.
 * - **It was pitched below the speakers.** Three of six formants sat at 62.5,
 *   125 and 250 Hz. Built-in laptop speakers give up below about 300.
 *
 * ## What it is now
 *
 * A **thunk**: transient, body, tail. One of them, when you press the key —
 * nothing plays on arrival. This is how door slams are described
 * everywhere from foley practice to automotive acoustics, where a "premium"
 * door is deliberately engineered as a high click around 5–10 kHz over a body
 * resonance at 100–400 Hz. It is also the same shape as `footsteps.ts` — an
 * impact plus a modal ring — which is the one model in this project already
 * known to sound like the material it claims to be.
 *
 * ```
 *  noise ─► click envelope ─► bandpass (hardware)  ─┐
 *  noise ─► body envelope  ─► bandpass (panel) ×3  ─┼─► out ─► panner ─┬─► dry
 *  sine  ─► thump envelope ────────────────────────ˈ                   └─► send
 * ```
 *
 * **The ring-down is in the envelope, not in the filter Q.** A resonator sharp
 * enough to ring for 150 ms at 200 Hz needs a Q above 120, which is a sine wave
 * with a rumour of noise in it. Driving a *moderate* resonator with a decaying
 * excitation gives the same perceived decay while keeping the band wide enough
 * to have a timbre. Q stays between about 5 and 12 throughout, and the gain
 * compensation is `sqrt(Q)` — the previous code had `1/sqrt(Q)`, which is
 * backwards for a constant-peak bandpass and made the sharpest modes quietest.
 *
 * Everything is scheduled at fire time on the audio clock. **The sound outlives
 * the zone that made it** — you press E, the world is torn down and rebuilt
 * somewhere else, and this has to carry across the cut, so nothing about it may
 * depend on a frame loop or on any object a zone owns.
 */

interface Mode {
  hz: number;
  /** Perceived ring-down in seconds. Set by the excitation, not by Q. */
  decay: number;
  /** Moderate. Colour, not pitch — see the note above. */
  q: number;
  level: number;
}

export interface DoorSpec {
  level: number;
  /** The hardware: latch, bolt, strike plate. Short, bright, and up top. */
  click: { hz: number; q: number; duration: number; level: number };
  /** The leaf and frame. What actually says which material the door is. */
  modes: readonly Mode[];
  /** The weight of it. A falling sine, felt more than heard. */
  thump: { from: number; to: number; decay: number; level: number };
}

/** Heavy timber. A warm, hollow knock. */
const TIMBER: DoorSpec = {
  level: 0.55,
  click: { hz: 3200, q: 6, duration: 0.004, level: 0.5 },
  modes: [
    { hz: 180, decay: 0.16, q: 5, level: 1 },
    { hz: 430, decay: 0.1, q: 6, level: 0.55 },
    { hz: 950, decay: 0.055, q: 7, level: 0.25 },
  ],
  thump: { from: 112, to: 82, decay: 0.13, level: 0.55 },
};

/** Iron. Brighter, longer, and it rings — the only one that sings. */
const IRON: DoorSpec = {
  level: 0.5,
  click: { hz: 5200, q: 9, duration: 0.005, level: 0.6 },
  modes: [
    { hz: 240, decay: 0.34, q: 9, level: 0.8 },
    { hz: 620, decay: 0.28, q: 11, level: 0.6 },
    { hz: 1450, decay: 0.2, q: 12, level: 0.35 },
    { hz: 2900, decay: 0.12, q: 10, level: 0.18 },
  ],
  thump: { from: 78, to: 62, decay: 0.3, level: 0.7 },
};

/** Thin boards. Quick, light, a little rattly, and gone. */
const PLANK: DoorSpec = {
  level: 0.42,
  click: { hz: 2400, q: 5, duration: 0.003, level: 0.35 },
  modes: [
    { hz: 320, decay: 0.08, q: 5, level: 0.8 },
    { hz: 720, decay: 0.055, q: 6, level: 0.45 },
    { hz: 1600, decay: 0.035, q: 6, level: 0.2 },
  ],
  thump: { from: 150, to: 120, decay: 0.07, level: 0.3 },
};

export const DOOR_SPECS = { timber: TIMBER, iron: IRON, plank: PLANK } as const;
export type DoorMaterial = keyof typeof DOOR_SPECS;

/**
 * How long a gesture lasts, for a spec. Used by the check and by the cleanup.
 *
 * The longest thing in it, plus the gap the click sits in. Deliberately well
 * inside the fade — a transition cue that is still going when the next place
 * has appeared reads as a sound belonging to the new room.
 */
export function doorDuration(spec: DoorSpec): number {
  const longest = Math.max(spec.thump.decay, ...spec.modes.map((m) => m.decay));
  return longest * 3 + CLICK_GAP + 0.05;
}

/** Seconds between the leaf landing and the latch catching. */
const CLICK_GAP = 0.032;

/** Audio needs no determinism; nothing here is stored by seed. */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export class DoorAudio {
  private readonly engine: AudioEngine;

  constructor(engine: AudioEngine) {
    this.engine = engine;
  }

  /**
   * Fires the cue. One gesture, on interact — nothing plays on arrival.
   *
   * There was a second, heavier version for the far side, so a door shut behind
   * you as you stepped through. It was cut: two sounds for one action reads as
   * two events, and the fade is short enough that the second landed while the
   * first was still ringing. One press, one sound.
   *
   * The latch comes first and the body follows, because that is the order your
   * hand does it in — the handle turns, then the leaf moves.
   */
  play(position: THREE.Vector3, material: DoorMaterial = 'timber'): void {
    const spec = DOOR_SPECS[material];
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const start = context.currentTime + 0.02;
    const nodes: AudioNode[] = [];
    const output = this.buildOutput(spec, position, nodes);

    // The resonators are built per fire rather than kept, unlike `footsteps`.
    // A door sound has to outlive the zone that made it — you press E, the
    // world is torn down and rebuilt somewhere else, and this carries across
    // the cut — so it owns everything it needs and throws it all away on a
    // timer rather than hanging off anything a zone can dispose.
    const hardware = createModalBank(
      context,
      // The latch as a single mode. Its `decay` is the click's duration; `q`
      // is given explicitly so the bank does not derive one.
      [{ hz: spec.click.hz, decay: spec.click.duration, level: spec.click.level, q: spec.click.q }],
      output,
    );
    const panel = createModalBank(context, spec.modes, output);

    this.excite(hardware.inputs[0], spec.click.level, start, 0.0006, spec.click.duration * 1.5, nodes);

    const bodyAt = start + CLICK_GAP;
    spec.modes.forEach((mode, i) => {
      this.excite(panel.inputs[i], mode.level * rand(0.92, 1.08), bodyAt, 0.002, mode.decay, nodes);
    });

    // The weight of the leaf. A sine rather than another resonator: down here
    // a bandpass would need a Q high enough to ring for a second, and the
    // weight has to land and stop.
    thump(
      context,
      output,
      bodyAt,
      spec.thump.level,
      spec.thump.from * rand(0.96, 1.04),
      spec.thump.to,
      spec.thump.decay,
      0.004,
    );

    const tail = doorDuration(spec);
    window.setTimeout(
      () => {
        for (const node of nodes) node.disconnect();
        hardware.dispose();
        panel.dispose();
      },
      (start - context.currentTime + tail) * 1000 + 250,
    );
  }

  /** Output stage: level, position, and a healthy send so doorways sound like doorways. */
  private buildOutput(
    spec: DoorSpec,
    position: THREE.Vector3,
    nodes: AudioNode[],
  ): GainNode {
    const context = this.engine.context;

    const output = context.createGain();
    output.gain.value = spec.level;

    const panner = context.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1.6;
    panner.maxDistance = 45;
    panner.rolloffFactor = 1.1;
    setPosition(panner, position);

    const send = context.createGain();
    // Doors are in doorways, which is exactly where a room's acoustics are most
    // legible — and on a transition the tail is the first thing you hear of the
    // place you have arrived in.
    send.gain.value = 0.9;

    output.connect(panner);
    panner.connect(this.engine.dry);
    panner.connect(send);
    send.connect(this.engine.send);
    nodes.push(output, panner, send);
    return output;
  }

  /**
   * A decaying burst of noise into one resonator input.
   *
   * **The ring-down is in this envelope, not in the filter's Q.** See the
   * header: a resonator sharp enough to ring for 150 ms at 200 Hz needs a Q
   * above 120, which is a sine wave with a rumour of noise in it. Driving a
   * moderate resonator with a decaying excitation gives the same perceived
   * decay while leaving the band wide enough to have a timbre.
   */
  private excite(
    target: AudioNode,
    level: number,
    at: number,
    attack: number,
    decay: number,
    nodes: AudioNode[],
  ): void {
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;

    const source = context.createBufferSource();
    source.buffer = noise.white;
    source.playbackRate.value = rand(0.9, 1.1);

    const envelope = context.createGain();
    strike(envelope.gain, at, level, attack, decay);

    source.connect(envelope).connect(target);
    // A random offset into the buffer, so two presses of the same door are two
    // different noises rather than the same one twice.
    source.start(at, rand(0, noise.white.duration - 1), decay * 3 + 0.05);
    source.stop(at + decay * 3 + 0.06);
    nodes.push(source, envelope);
  }
}

function setPosition(panner: PannerNode, position: THREE.Vector3): void {
  if (panner.positionX) {
    panner.positionX.value = position.x;
    panner.positionY.value = position.y;
    panner.positionZ.value = position.z;
  } else {
    (panner as unknown as { setPosition(x: number, y: number, z: number): void }).setPosition(
      position.x,
      position.y,
      position.z,
    );
  }
}
