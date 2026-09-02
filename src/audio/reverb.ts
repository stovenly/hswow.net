import { pool } from '../engine/work/pool';

/**
 * Impulse responses, generated rather than recorded — this project has no
 * files. A synthesised IR is noise shaped by an exponential decay: noise
 * because a room's late reverberation is dense random reflections, exponential
 * because energy is lost as a fixed fraction per bounce.
 *
 * That gets the tail. Two details get the room. **Damping**: air and soft
 * surfaces absorb high frequencies faster, so a real tail darkens as it
 * decays, and a flat-spectrum tail is a spring rather than a space.
 * **Decorrelation**: the two channels must be different noise, or the reverb
 * collapses to the centre of the head, which is the one thing a room never
 * does.
 *
 * Rendered in an `OfflineAudioContext`, so the damping filter is the same
 * biquad the live graph would use.
 */

export interface RoomAcoustics {
  /**
   * How much of the early reflection cluster comes back, 0..1. Bare hard
   * surfaces are high; anything with soft furnishing in it is not.
   */
  bounce: number;
  /**
   * Where that cluster sits, in seconds. It is a distance: sound covers about
   * 34 cm per millisecond, so 9 ms is a wall three metres off and 75 ms is one
   * you would have to walk toward.
   */
  spread: number;
  /** Seconds for the tail to fall 60 dB. A cupboard is 0.3; a cathedral is 6. */
  rt60: number;
  /** Silence before the tail, in seconds. Reads as the size of the room. */
  preDelay: number;
  /** 0 is a bright stone room, 1 is heavy curtains everywhere. */
  damping: number;
  /** How much of the signal goes to the reverb at all. */
  wet: number;
}

/**
 * The book of rooms, named by **what the walls are** rather than by what the
 * place is called. A zone picks the one its geometry actually is, so a cave
 * chapel and a cave both take `vault` and differ in their vibe instead.
 *
 * Adding one is a row here and nothing else: `RoomName` is the keys of this
 * object, so the name is available and type-checked the moment it exists, and
 * on the network path a preset is pure numbers and costs nothing at boot.
 *
 * `bounce` and `spread` are the early reflections and they are what "echo"
 * means — see `EARLY_TAPS` in `AudioEngine`. The tail says how big; the
 * reflections say how hard, how close, and how bare.
 */
export const ROOM_PRESETS = {
  /** Outdoors: a suggestion of distant surfaces, no enclosure. */
  open: { rt60: 0.7, preDelay: 0.012, damping: 0.7, wet: 0.12, bounce: 0.05, spread: 0.05 },
  /** A lane between buildings. Hard, close on two sides, open above. */
  street: { rt60: 1.1, preDelay: 0.014, damping: 0.42, wet: 0.22, bounce: 0.3, spread: 0.03 },
  /** An ordinary room with things in it. */
  room: { rt60: 0.55, preDelay: 0.006, damping: 0.6, wet: 0.26, bounce: 0.16, spread: 0.012 },
  /** A small dead room. Speech is intimate and close. */
  cell: { rt60: 0.45, preDelay: 0.004, damping: 0.55, wet: 0.3, bounce: 0.12, spread: 0.009 },
  /** A big shed: a hard shell with a lot of air and a lot of clutter. */
  shed: { rt60: 1.9, preDelay: 0.018, damping: 0.35, wet: 0.4, bounce: 0.34, spread: 0.028 },
  /** Big, hard and empty. The one that should be unmistakable. */
  hall: { rt60: 4.2, preDelay: 0.035, damping: 0.18, wet: 0.62, bounce: 0.4, spread: 0.045 },
  /**
   * Rock. The longest tail in the book and the latest reflections — a cave's
   * slap comes back long after you have stopped expecting it, and that gap is
   * most of what tells you how far away the far wall is.
   */
  vault: { rt60: 5.5, preDelay: 0.05, damping: 0.08, wet: 0.66, bounce: 0.52, spread: 0.075 },
  /**
   * A long tube. Almost no diffusion and a very strong single return, which is
   * why a shout down a pipe comes back as a shout rather than as a wash.
   */
  pipe: { rt60: 3.2, preDelay: 0.026, damping: 0.3, wet: 0.55, bounce: 0.66, spread: 0.055 },
} as const satisfies Record<string, RoomAcoustics>;

export type RoomName = keyof typeof ROOM_PRESETS;

/**
 * Renders an impulse response for the given room. Returns a promise:
 * `OfflineAudioContext` is asynchronous, and at these lengths the render takes
 * long enough to matter.
 */
export async function generateImpulseResponse(
  sampleRate: number,
  room: RoomAcoustics,
): Promise<AudioBuffer> {
  const tail = Math.max(room.rt60, 0.05);
  const length = Math.ceil(sampleRate * (tail + room.preDelay));
  const offline = new OfflineAudioContext(2, length, sampleRate);

  const source = offline.createBufferSource();
  const channels = await pool.run('room-noise', {
    length,
    sampleRate,
    preDelay: room.preDelay,
    rt60: room.rt60,
  });
  source.buffer = offline.createBuffer(2, length, sampleRate);
  channels.forEach((data, channel) => source.buffer!.copyToChannel(data, channel));

  // A one-pole-ish lowpass standing in for absorption. It shapes the whole tail
  // rather than the decay curve — real damping is a frequency-dependent decay
  // *rate* — but the ear reads a darker tail as a softer room either way.
  const damp = offline.createBiquadFilter();
  damp.type = 'lowpass';
  // 18 kHz down to about 700 Hz across the damping range.
  damp.frequency.value = 700 + (1 - room.damping) ** 2 * 17300;

  // Rolls off the rumble that random noise puts below the useful range, which
  // otherwise just muddies everything convolved through it.
  const cut = offline.createBiquadFilter();
  cut.type = 'highpass';
  cut.frequency.value = 90;

  source.connect(damp).connect(cut).connect(offline.destination);
  source.start(0);

  return offline.startRendering();
}
