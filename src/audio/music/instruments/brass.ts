import type { AudioEngine } from '../../AudioEngine';
import type { Instrument } from './voice';
import { createMonoPool, type MonoVoice } from './mono';

/**
 * Brass — detuned saws and a sine of weight, blown by the mono core.
 *
 * In a real horn the higher harmonics speak *late*: the lips settle, the
 * standing wave builds, and the brightness blooms over a few hundred
 * milliseconds and then relaxes. That slow bloom is the single most
 * brass-identifying cue there is. The bloom here is deliberately an orchestral
 * horn's and not a lead synth's — the cutoff never leaves the low harmonics,
 * because a section horn is warm before it is bright.
 *
 * Two saws a few cents apart are the section; the sine underneath keeps the
 * fundamental solid while the filter moves. And there is **no periodic
 * vibrato** — orchestral brass holds straight tone, and a steady LFO on a
 * horn is the fastest way to sound electronic. What it gets instead is a slow
 * random drift of a few cents, which is what lips actually do.
 *
 * The one player is the whole family: how far the bloom reaches, how fast it
 * speaks and how much sine sits under it are what separate horn, trumpet and
 * tuba — see the presets at the bottom.
 */

export interface BrassOptions {
  gain?: number;
  attack?: number;
  release?: number;
  /** Ceiling scale. 1 is the horn; the trumpet overshoots, the tuba stays home. */
  bright?: number;
  /** Bloom time scale. Under 1 speaks faster. */
  speak?: number;
  /** The sine of weight's gain. */
  sub?: number;
  /** Saw spread, in cents. */
  detune?: number;
  /** 80 Hz lip rasp on hard fresh attacks, 0..1. Trumpets only. */
  rasp?: number;
}

interface BrassVoicing {
  bright: number;
  speak: number;
  sub: number;
  detune: number;
  rasp: number;
}

function brassPlayer(context: BaseAudioContext, output: AudioNode, o: BrassVoicing): MonoVoice {
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;
  filter.Q.value = 0.9;

  const envelope = context.createGain();
  envelope.gain.value = 0;
  filter.connect(envelope).connect(output);

  const saws = [-o.detune, o.detune].map((cents) => {
    const osc = context.createOscillator();
    osc.type = 'sawtooth';
    osc.detune.value = cents;
    osc.connect(filter);
    osc.start();
    return osc;
  });

  // The weight: a quiet sine at the fundamental, past the filter so it stays
  // put while the brightness moves.
  const sub = context.createOscillator();
  sub.type = 'sine';
  const weight = context.createGain();
  weight.gain.value = o.sub;
  sub.connect(weight).connect(envelope);
  sub.start();

  // The lip drift: ±4 cents wandering over seconds, one rate per player.
  const drift = context.createOscillator();
  drift.type = 'sine';
  drift.frequency.value = 0.2 + Math.random() * 0.2;
  const sway = context.createGain();
  sway.gain.value = 4;
  drift.connect(sway);
  for (const saw of saws) sway.connect(saw.detune);
  drift.start();

  let sustain = 600;

  return {
    envelope,

    tune(at, freq, velocity, glide) {
      for (const saw of saws) saw.frequency.cancelScheduledValues(at);
      sub.frequency.cancelScheduledValues(at);
      filter.frequency.cancelScheduledValues(at);
      const peak = Math.min(freq * (2.5 + 1.5 * velocity) * o.bright, 1800 * o.bright);
      sustain = Math.min(freq * (1.5 + 0.7 * velocity) * o.bright, 1200 * o.bright);
      if (glide) {
        // A join is one breath continuing: no re-bloom, just a settle.
        for (const saw of saws) saw.frequency.setTargetAtTime(freq, at, 0.02);
        sub.frequency.setTargetAtTime(freq, at, 0.02);
        filter.frequency.setTargetAtTime(sustain, at, 0.08);
      } else {
        // Harder blowing blooms faster: 350 ms at a whisper, 150 at forte.
        const speak = (0.35 - 0.2 * velocity) * o.speak;
        for (const saw of saws) saw.frequency.setValueAtTime(freq, at);
        sub.frequency.setValueAtTime(freq, at);
        filter.frequency.setValueAtTime(Math.max(freq * 1.1, 60), at);
        filter.frequency.exponentialRampToValueAtTime(peak, at + speak);
        filter.frequency.setTargetAtTime(sustain, at + speak, 0.4);
        if (o.rasp > 0 && velocity > 0.55) {
          // The lip rasp: 80 Hz on the cutoff for the first instants of a
          // hard attack — the buzz before the note stands up.
          const buzz = context.createOscillator();
          buzz.type = 'triangle';
          buzz.frequency.value = 80;
          const depth = context.createGain();
          depth.gain.setValueAtTime(sustain * 0.3 * o.rasp * velocity, at);
          depth.gain.setTargetAtTime(0, at + 0.02, 0.02);
          buzz.connect(depth).connect(filter.frequency);
          buzz.start(at);
          buzz.stop(at + 0.12);
        }
      }
    },

    taper(at, release) {
      filter.frequency.setTargetAtTime(sustain * 0.6, at, release / 3);
    },

    dispose() {
      for (const saw of saws) {
        saw.stop();
        saw.disconnect();
      }
      sub.stop();
      drift.stop();
      sub.disconnect();
      weight.disconnect();
      drift.disconnect();
      sway.disconnect();
      filter.disconnect();
      envelope.disconnect();
    },
  };
}

export function createBrass(engine: AudioEngine, options: BrassOptions = {}): Instrument {
  const context = engine.context;

  const voicing: BrassVoicing = {
    bright: options.bright ?? 1,
    speak: options.speak ?? 1,
    sub: options.sub ?? 0.4,
    detune: options.detune ?? 6,
    rasp: options.rasp ?? 0,
  };

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  const pool = createMonoPool(context, () => brassPlayer(context, output, voicing), {
    attack: options.attack ?? 0.09,
    release: options.release ?? 0.45,
    peak: (velocity) => velocity * 0.22,
  });

  return {
    output,

    noteOn(at, freq, velocity, duration = 1.6) {
      pool.note(at, freq, velocity, duration);
    },

    dispose() {
      pool.dispose();
      output.disconnect();
    },
  };
}

/** The bloom twice as fast and nearly twice as bright, rasp on hard attacks. */
export const createTrumpet = (engine: AudioEngine, options: BrassOptions = {}): Instrument =>
  createBrass(engine, {
    attack: 0.035,
    release: 0.4,
    bright: 1.9,
    speak: 0.45,
    sub: 0.25,
    detune: 4,
    rasp: 1,
    ...options,
  });

/** Sub-dominant and slow to speak, the ceiling never leaving the low harmonics. */
export const createTuba = (engine: AudioEngine, options: BrassOptions = {}): Instrument =>
  createBrass(engine, {
    attack: 0.13,
    release: 0.5,
    bright: 0.55,
    speak: 1.3,
    sub: 0.9,
    detune: 3,
    ...options,
  });
