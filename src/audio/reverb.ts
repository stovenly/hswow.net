/**
 * Impulse responses, generated rather than recorded.
 *
 * A convolution reverb needs an impulse response, and an IR is normally a
 * recording of a real room — a file, and this project has no files. Synthesised
 * IRs are noise shaped by an exponential decay: noise because a room's late
 * reverberation *is* dense random reflections, exponential because energy is
 * lost as a fixed fraction per bounce.
 *
 * That gets you the tail. Two details get you the room:
 *
 * - **Damping.** Air and soft surfaces absorb high frequencies faster than
 *   low ones, so a real tail gets darker as it decays. A flat-spectrum tail
 *   sounds like a spring, not a space.
 * - **Decorrelation.** The two channels must be different noise. Identical
 *   channels collapse the reverb to the centre of the head, which is the one
 *   thing a room never does.
 *
 * Rendered in an `OfflineAudioContext` so the damping filter is the same
 * biquad the live graph would use, running as fast as the CPU allows.
 */

export interface RoomAcoustics {
  /** Seconds for the tail to fall 60 dB. A cupboard is 0.3; a cathedral is 6. */
  rt60: number;
  /** Silence before the tail, in seconds. Reads as the size of the room. */
  preDelay: number;
  /** 0 is a bright stone room, 1 is heavy curtains everywhere. */
  damping: number;
  /** How much of the signal goes to the reverb at all. */
  wet: number;
}

export const ROOM_PRESETS = {
  /** Outdoors: a suggestion of distant surfaces, no enclosure. */
  open: { rt60: 0.7, preDelay: 0.012, damping: 0.7, wet: 0.12 },
  /** A small dead room. Speech is intimate and close. */
  cell: { rt60: 0.45, preDelay: 0.004, damping: 0.55, wet: 0.3 },
  /** Big, hard and empty. The one that should be unmistakable. */
  hall: { rt60: 4.2, preDelay: 0.035, damping: 0.18, wet: 0.62 },
} as const satisfies Record<string, RoomAcoustics>;

export type RoomName = keyof typeof ROOM_PRESETS;

/**
 * Renders an impulse response for the given room.
 *
 * Returns a promise: `OfflineAudioContext` is asynchronous, and at these
 * lengths the render takes long enough to matter on a phone.
 */
export async function generateImpulseResponse(
  sampleRate: number,
  room: RoomAcoustics,
): Promise<AudioBuffer> {
  const tail = Math.max(room.rt60, 0.05);
  const length = Math.ceil(sampleRate * (tail + room.preDelay));
  const offline = new OfflineAudioContext(2, length, sampleRate);

  const source = offline.createBufferSource();
  source.buffer = decayingNoise(offline, length, sampleRate, room);

  // One-pole-ish lowpass standing in for absorption. It shapes the whole tail
  // rather than the decay curve, which is a simplification — real damping is
  // frequency-dependent decay *rate* — but the ear reads a darker tail as a
  // softer room either way.
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

function decayingNoise(
  context: BaseAudioContext,
  length: number,
  sampleRate: number,
  room: RoomAcoustics,
): AudioBuffer {
  const buffer = context.createBuffer(2, length, sampleRate);
  const preDelay = Math.floor(room.preDelay * sampleRate);
  // -60 dB is a factor of 1000, so this is the per-sample decay that reaches
  // it exactly at rt60.
  const decay = Math.exp(-Math.log(1000) / (room.rt60 * sampleRate));

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let envelope = 1;
    for (let i = preDelay; i < length; i++) {
      // Independent noise per channel: this is the decorrelation, and without
      // it the reverb plays in mono up the middle of your skull.
      data[i] = (Math.random() * 2 - 1) * envelope;
      envelope *= decay;
    }
  }

  return buffer;
}
