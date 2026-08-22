import type { AudioEngine } from '../AudioEngine';
import { createModalBank } from '../dsp/modal';
import { strike } from '../dsp/envelopes';
import { thump } from '../dsp/impact';

/**
 * The sound of going somewhere else. Played when a portal is used, over a fade
 * of about six tenths of a second, so it has to be recognisable inside the
 * first hundred milliseconds. Door-shaped, not a simulation of a door.
 *
 * A thunk: transient, body, tail. One of them, when you press the key — a
 * high click around 5-10 kHz over a body resonance at 100-400 Hz, which is how
 * door slams are described from foley practice to automotive acoustics.
 *
 * ```
 *  noise ─► click envelope ─► bandpass (hardware)  ─┐
 *  noise ─► body envelope  ─► bandpass (panel) ×3  ─┼─► out ─┬─► dry
 *  sine  ─► thump envelope ────────────────────────ˈ         └─► send
 * ```
 *
 * The ring-down is in the envelope, not in the filter Q: Q stays between about
 * 5 and 12 and gain compensation is `sqrt(Q)`. See `dsp/modal.ts`.
 *
 * Everything is scheduled at fire time on the audio clock, because the sound
 * outlives the zone that made it — you press E and the world is torn down and
 * rebuilt somewhere else. It outlives the listener's position too, so it is
 * routed to the bus rather than spatialised: a panner left at the door loses
 * 27 dB and the reverb tail with it. You have to be looking at a door to use
 * one, so there is no direction here worth rendering.
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
  level: 0.43,
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
  level: 0.39,
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
  level: 0.33,
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
 * How long a gesture lasts, for a spec: the longest thing in it plus the gap
 * the click sits in.
 *
 * Not required to finish inside the fade. The fade is 0.58 s and iron rings for
 * 1.1, so most of its tail lands in the room you have arrived in, which is the
 * point of a threshold. What must be over is the gesture — click and leaf are
 * done inside 0.1 s on every material.
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
   * Fires the cue. One gesture, on interact — nothing plays on arrival, and
   * there is no second sound for the far side: two sounds for one action reads
   * as two events.
   *
   * The latch comes first and the body follows, because that is the order your
   * hand does it in — the handle turns, then the leaf moves.
   */
  play(material: DoorMaterial = 'timber'): void {
    const spec = DOOR_SPECS[material];
    const context = this.engine.context;
    if (context.state !== 'running' || !this.engine.noise) return;

    const start = context.currentTime + 0.02;
    const nodes: AudioNode[] = [];
    const output = this.buildOutput(spec, nodes);

    // The resonators are built per fire rather than kept, unlike `footsteps`.
    // This sound has to outlive the zone that made it, so it owns everything
    // it needs and throws it away on a timer.
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

  /** Output stage: level, and a healthy send so doorways sound like doorways. */
  private buildOutput(spec: DoorSpec, nodes: AudioNode[]): GainNode {
    const context = this.engine.context;

    const output = context.createGain();
    output.gain.value = spec.level;

    const send = context.createGain();
    // Doors are in doorways, which is exactly where a room's acoustics are most
    // legible — and on a transition the tail is the first thing you hear of the
    // place you have arrived in.
    send.gain.value = 0.7;

    output.connect(this.engine.steps);
    output.connect(send);
    send.connect(this.engine.send);
    nodes.push(output, send);
    return output;
  }

  /**
   * A decaying burst of noise into one resonator input. The ring-down is in
   * this envelope rather than the filter's Q — see the header.
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
