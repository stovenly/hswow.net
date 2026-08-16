import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { createFormantBank, type Formant, type FormantBank } from '../dsp/formant';
import { glottalWave } from '../dsp/glottal';
import { babbleScore, score, type Score, type Syllable, type Vowel, type Place, type Tune } from '../speech';

/**
 * A villager's voice: it says whatever is written, in no language.
 *
 * `say(text)` scores the line into syllables (`audio/speech`) and sings each
 * one — an opening consonant, a vowel that moves, a pitch that carries on
 * from the last — on a clock the head can follow. What
 * keeps it from sounding like a machine is that nothing in it is steady:
 *
 * - the source is a **glottal pulse**, not a sawtooth, and it **flutters** —
 *   three slow sines on the pitch (Klatt's trick), a little random jitter on
 *   top, and a shimmer on the level;
 * - **breath** — a band of noise through the same formants — is under the
 *   voice all the time, and up at the start of every word;
 * - the **formants never hold**: each syllable opens from its consonant's
 *   place in the mouth and slides into its vowel, the vowel slides on into
 *   the next if there is one, and a nasal ending closes down into a hum;
 * - the **pitch is a line, not notes**: it glides from where the last
 *   syllable ended, lifts through each one, falls across a sentence and rises
 *   at the end of a question.
 *
 * One oscillator, one noise source and a handful of filters, all persistent
 * for as long as it is talking and taken down a second after — the whole
 * line is scheduled as automation on the audio clock, which is what lets it
 * be cut short cleanly with `hush`.
 */

export interface VoiceOptions {
  gain?: number;
  /** Tract length as a multiplier; below 1 is a bigger person, lower voice. */
  tone?: number;
  /** Base pitch, Hz. Around 250 is a small voice, 180 a larger one. */
  pitch?: number;
  /** Fixes the voice's character — rate, breath, flutter — so it is the same voice every time. */
  seed?: number;
}

export interface Unit {
  /** Where the voice comes on, audio clock. */
  at: number;
  /** Seconds it is voiced. */
  length: number;
  /** Text range this unit reveals, end exclusive. */
  from: number;
  to: number;
  stress: number;
}

export interface Utterance {
  readonly text: string;
  readonly at: number;
  /** When the last unit is done — before its trailing pause. */
  readonly end: number;
  readonly units: readonly Unit[];
}

export interface Voice extends OneShot {
  /** Says a written line: for a dialogue box, when there is one. */
  say(text: string, at: number): Utterance;
  /** Says nothing in particular: a short greeting, or a run of talk. */
  babble(kind: 'greeting' | 'talk', at: number): Utterance;
  /** Cuts whatever is being said, from `at`. */
  hush(at: number): void;
  readonly speaking: Utterance | null;
}

// --- mouth shapes -------------------------------------------------------------------

/** Four formants: the three that make a vowel and one more that makes it a voice. */
const SHAPES: Record<Vowel, readonly Formant[]> = {
  a: [{ hz: 730, q: 9, level: 1 }, { hz: 1090, q: 11, level: 0.5 }, { hz: 2440, q: 16, level: 0.22 }, { hz: 3300, q: 20, level: 0.1 }],
  e: [{ hz: 530, q: 8, level: 1 }, { hz: 1840, q: 14, level: 0.42 }, { hz: 2480, q: 16, level: 0.2 }, { hz: 3350, q: 20, level: 0.1 }],
  i: [{ hz: 300, q: 6, level: 1 }, { hz: 2250, q: 16, level: 0.36 }, { hz: 3000, q: 18, level: 0.18 }, { hz: 3500, q: 20, level: 0.1 }],
  o: [{ hz: 570, q: 8, level: 1 }, { hz: 840, q: 9, level: 0.55 }, { hz: 2410, q: 16, level: 0.14 }, { hz: 3250, q: 20, level: 0.08 }],
  u: [{ hz: 320, q: 6, level: 1 }, { hz: 870, q: 9, level: 0.4 }, { hz: 2240, q: 16, level: 0.1 }, { hz: 3200, q: 20, level: 0.07 }],
  schwa: [{ hz: 500, q: 7, level: 1 }, { hz: 1500, q: 12, level: 0.4 }, { hz: 2500, q: 16, level: 0.18 }, { hz: 3300, q: 20, level: 0.09 }],
};
/** The murmur of an m or n: low, closed, dull. */
const NASAL: readonly Formant[] = [{ hz: 260, q: 5, level: 1 }, { hz: 1000, q: 10, level: 0.2 }, { hz: 2200, q: 14, level: 0.08 }, { hz: 3200, q: 20, level: 0.04 }];
/** Where a consonant's formants start, by where in the mouth it is made. */
const LOCUS: Record<Place, readonly Formant[]> = {
  lip: [{ hz: 320, q: 6, level: 0.8 }, { hz: 800, q: 9, level: 0.4 }, { hz: 2200, q: 14, level: 0.15 }, { hz: 3200, q: 20, level: 0.07 }],
  ridge: [{ hz: 360, q: 6, level: 0.8 }, { hz: 1800, q: 13, level: 0.4 }, { hz: 2650, q: 16, level: 0.18 }, { hz: 3400, q: 20, level: 0.08 }],
  back: [{ hz: 320, q: 6, level: 0.8 }, { hz: 2100, q: 14, level: 0.4 }, { hz: 2400, q: 15, level: 0.2 }, { hz: 3300, q: 20, level: 0.08 }],
};
/** l, r, w, y — voiced openings with a mouth of their own. */
const LIQUID: Record<Place, readonly Formant[]> = {
  lip: SHAPES.u,
  ridge: [{ hz: 400, q: 6, level: 0.9 }, { hz: 1150, q: 10, level: 0.4 }, { hz: 1900, q: 12, level: 0.2 }, { hz: 3200, q: 20, level: 0.06 }],
  back: SHAPES.i,
};
/** Where a stop's burst and a fricative's hiss sit, Hz. */
const BURST: Record<Place, number> = { lip: 900, ridge: 3800, back: 1900 };

function scaled(formants: readonly Formant[], k: number): Formant[] {
  return formants.map((f) => ({ ...f, hz: f.hz * k }));
}

function hash(seed: number, n: number): number {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** A voice's character, from its seed: how fast, how breathy, how wobbly. */
interface Character {
  /** Syllables a second. */
  rate: number;
  /** Open quotient of the folds. */
  open: number;
  breath: number;
  flutter: number;
  vibrato: number;
  /** How wide the pitch swings. */
  range: number;
  /** Tract scaling on top of the tone: shorter reads younger. */
  tract: number;
}

function character(seed: number): Character {
  return {
    rate: 5.6 + hash(seed, 1) * 2.2,
    open: 0.55 + hash(seed, 2) * 0.2,
    breath: 0.03 + hash(seed, 3) * 0.05,
    flutter: 8 + hash(seed, 4) * 14,
    vibrato: hash(seed, 5) * 12,
    range: 0.08 + hash(seed, 6) * 0.1,
    tract: 1.1 + hash(seed, 7) * 0.15,
  };
}

// --- the model -------------------------------------------------------------------------

export function createVoice(engine: AudioEngine, options: VoiceOptions = {}): Voice {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('voice built before the noise buffers were ready');

  const tone = options.tone ?? 1;
  const seed = options.seed ?? 1;
  const me = character(seed);
  const tract = tone * me.tract;
  const base = (options.pitch ?? 250) * (0.7 + 0.3 * tone) * (0.94 + hash(seed, 8) * 0.12);

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // A gentle roll-off over the whole voice, and the rumble taken out under it.
  const warmth = context.createBiquadFilter();
  warmth.type = 'lowpass';
  warmth.frequency.value = 3800 * tract;
  warmth.Q.value = 0.5;
  const floor = context.createBiquadFilter();
  floor.type = 'highpass';
  floor.frequency.value = 90;
  warmth.connect(floor).connect(output);

  const bank: FormantBank = createFormantBank(context, scaled(SHAPES.a, tract), warmth);

  /** The persistent sources, alive while talking. */
  interface Graph {
    osc: OscillatorNode;
    voiced: GainNode;
    breath: GainNode;
    fric: BiquadFilterNode;
    fricGain: GainNode;
    nodes: AudioNode[];
    sources: AudioScheduledSourceNode[];
  }
  let graph: Graph | null = null;
  let retire = 0;
  let speaking: Utterance | null = null;
  let syllables: Unit[] = [];

  const build = (at: number): Graph => {
    if (graph) return graph;
    const nodes: AudioNode[] = [];
    const sources: AudioScheduledSourceNode[] = [];

    const osc = context.createOscillator();
    osc.setPeriodicWave(glottalWave(context, me.open));
    osc.frequency.value = base;
    // Shimmer rides on its own stage, so the envelope below it still shuts
    // the voice off completely between syllables.
    const shimmered = context.createGain();
    shimmered.gain.value = 1;
    const voiced = context.createGain();
    voiced.gain.value = 0;
    osc.connect(shimmered).connect(voiced).connect(bank.input);

    // Flutter: three slow sines on the pitch, in cents, and a random walk under them.
    for (const [hz, depth] of [[12.7, 1], [7.1, 0.9], [4.7, 0.8]] as const) {
      const lfo = context.createOscillator();
      lfo.frequency.value = hz;
      const g = context.createGain();
      g.gain.value = me.flutter * depth * 0.4;
      lfo.connect(g).connect(osc.detune);
      lfo.start(at);
      sources.push(lfo);
      nodes.push(g);
    }
    if (me.vibrato > 0) {
      const lfo = context.createOscillator();
      lfo.frequency.value = 5.2 + hash(seed, 9) * 1.3;
      const g = context.createGain();
      g.gain.value = me.vibrato;
      lfo.connect(g).connect(osc.detune);
      lfo.start(at);
      sources.push(lfo);
      nodes.push(g);
    }
    const jitterSrc = context.createBufferSource();
    jitterSrc.buffer = noise.white;
    jitterSrc.loop = true;
    const jitterLp = context.createBiquadFilter();
    jitterLp.type = 'lowpass';
    jitterLp.frequency.value = 18;
    const jitter = context.createGain();
    jitter.gain.value = 500;
    jitterSrc.connect(jitterLp).connect(jitter).connect(osc.detune);
    // The same slow noise, scaled small, on the level: shimmer.
    const shimmer = context.createGain();
    shimmer.gain.value = 1.8;
    jitterLp.connect(shimmer).connect(shimmered.gain);
    jitterSrc.start(at, hash(seed, 10) * 3);
    sources.push(jitterSrc);
    nodes.push(jitterLp, jitter, shimmer, shimmered);

    // Breath: noise through the formants, and the hiss path round them.
    const breathSrc = context.createBufferSource();
    breathSrc.buffer = noise.white;
    breathSrc.loop = true;
    const breathBand = context.createBiquadFilter();
    breathBand.type = 'bandpass';
    breathBand.frequency.value = 2600 * tract;
    breathBand.Q.value = 0.6;
    const breath = context.createGain();
    breath.gain.value = 0;
    breathSrc.connect(breathBand).connect(breath).connect(bank.input);
    const fric = context.createBiquadFilter();
    fric.type = 'bandpass';
    fric.frequency.value = 4000;
    fric.Q.value = 1.2;
    const fricGain = context.createGain();
    fricGain.gain.value = 0;
    breathSrc.connect(fric).connect(fricGain).connect(warmth);
    breathSrc.start(at, hash(seed, 11) * 3);
    sources.push(breathSrc);
    nodes.push(breathBand, breath, fric, fricGain);

    osc.start(at);
    sources.push(osc);
    nodes.push(voiced);
    graph = { osc, voiced, breath, fric, fricGain, nodes, sources };
    return graph;
  };

  const teardown = (): void => {
    if (!graph) return;
    for (const s of graph.sources) {
      try {
        s.stop();
      } catch {
        // Already stopped.
      }
    }
    for (const n of graph.nodes) n.disconnect();
    for (const s of graph.sources) s.disconnect();
    graph = null;
  };

  /**
   * One syllable, from `at`. Returns when its voice ends and the pitch it
   * ended on. Consonants come *before* `at`; the voice comes on at it.
   */
  const sing = (
    g: Graph,
    s: Syllable,
    at: number,
    length: number,
    level: number,
    f0From: number,
    f0To: number,
    tail: number,
    since: number,
  ): { end: number; f0: number } => {
    const k = tract;
    const open = scaled(SHAPES[s.vowel], k);
    const glide = scaled(SHAPES[s.glide], k);
    const rise = s.onset === 'stop' ? 0.012 : s.onset === 'none' ? 0.03 : 0.02;
    const end = at + length;
    const release = s.coda === 'stop' ? 0.014 : 0.045;

    // --- the consonant, ahead of the voice ---
    switch (s.onset) {
      case 'stop': {
        // A closed mouth, then a burst at the place of the stop.
        g.fric.frequency.setValueAtTime(BURST[s.place] * k, at - 0.02);
        g.fric.Q.setValueAtTime(2, at - 0.02);
        g.fricGain.gain.setValueAtTime(0, at - 0.02);
        g.fricGain.gain.linearRampToValueAtTime(level * 0.35, at - 0.016);
        g.fricGain.gain.linearRampToValueAtTime(0, at - 0.002);
        bank.shape(scaled(LOCUS[s.place], k), at - 0.002, 0);
        bank.shape(open, at + 0.005, 0.045);
        break;
      }
      case 'hiss':
      case 'hush': {
        const hz = (s.onset === 'hiss' ? 6200 : 3100) * k;
        g.fric.frequency.setValueAtTime(hz, at - 0.075);
        g.fric.Q.setValueAtTime(s.onset === 'hiss' ? 0.9 : 1.4, at - 0.075);
        g.fricGain.gain.setValueAtTime(0, at - 0.075);
        g.fricGain.gain.linearRampToValueAtTime(level * (s.onset === 'hiss' ? 0.22 : 0.3), at - 0.045);
        g.fricGain.gain.linearRampToValueAtTime(0, at + 0.008);
        bank.shape(scaled(LOCUS.ridge, k), at - 0.01, 0);
        bank.shape(open, at, 0.04);
        break;
      }
      case 'breath': {
        // An h: the vowel's own shape, breathed before it is voiced.
        bank.shape(open, at - 0.06, 0.02);
        g.breath.gain.setValueAtTime(me.breath, at - 0.06);
        g.breath.gain.linearRampToValueAtTime(level * 0.5, at - 0.03);
        g.breath.gain.linearRampToValueAtTime(me.breath * 1.5, at + 0.03);
        break;
      }
      case 'nasal': {
        // A hum through a closed mouth that opens into the vowel.
        bank.shape(scaled(NASAL, k), at - 0.045, 0.01);
        g.voiced.gain.setValueAtTime(0, at - 0.05);
        g.voiced.gain.linearRampToValueAtTime(level * 0.5, at - 0.035);
        bank.shape(open, at, 0.04);
        break;
      }
      case 'liquid': {
        bank.shape(scaled(LIQUID[s.place], k), at - 0.03, 0.01);
        g.voiced.gain.setValueAtTime(0, at - 0.035);
        g.voiced.gain.linearRampToValueAtTime(level * 0.7, at - 0.01);
        bank.shape(open, at, 0.06);
        break;
      }
      default:
        bank.shape(open, at, rise);
        break;
    }

    // --- the vowel ---
    if (s.onset !== 'nasal' && s.onset !== 'liquid') g.voiced.gain.setValueAtTime(0, at - 0.001);
    g.voiced.gain.linearRampToValueAtTime(level, at + rise);
    g.voiced.gain.linearRampToValueAtTime(level * 0.82, end - release);
    // The mouth moves on into the second vowel across the middle of it.
    if (s.glide !== s.vowel) bank.shape(glide, at + length * 0.3, length * 0.55);
    // A nasal ending hums shut; the rest just release.
    if (s.coda === 'nasal') {
      bank.shape(scaled(NASAL, k), end - 0.05, 0.035);
      g.voiced.gain.linearRampToValueAtTime(level * 0.45, end - 0.012);
    }
    g.voiced.gain.linearRampToValueAtTime(0, end + (s.coda === 'nasal' ? 0.01 : 0));

    // Breath under the voice, more at a word's start and in the tail.
    if (s.onset !== 'breath') {
      g.breath.gain.setValueAtTime(me.breath * (1 + s.stress), at);
      g.breath.gain.linearRampToValueAtTime(me.breath * 0.6, at + length * 0.5);
    }
    g.breath.gain.linearRampToValueAtTime(me.breath * (tail > 0.2 ? 1.6 : 0.8), end);
    g.breath.gain.linearRampToValueAtTime(0, end + 0.01);

    // --- the pitch: a line through it, from where the last one ended ---
    const f = g.osc.frequency;
    f.setValueAtTime(f0From, since);
    f.exponentialRampToValueAtTime(f0To * 1.03, at + length * 0.4);
    const f0End = f0To * (tail > 0.3 && s.tune !== 'question' ? 0.9 : 0.985);
    f.exponentialRampToValueAtTime(f0End, end);
    return { end, f0: f0End };
  };

  let turn = 0;
  const perform = (sc: Score, at: number): Utterance => {
    const start = Math.max(at, context.currentTime + 0.08);
    voice.hush(start - 0.001);
    const g = build(start);
    const units: Unit[] = [];
    const unit = 1 / me.rate;

    let cursor = start + 0.05;
    let f0 = base;
    let afterPause = true;
    for (let i = 0; i < sc.syllables.length; i++) {
      const s = sc.syllables[i];
      // How long, and how loud.
      const held = s.pause >= 0.2 ? 1.35 : s.pause > 0 ? 1.1 : 1;
      const length = unit * (0.62 + 0.3 * s.stress) * held * (0.92 + hash(seed, 20 + i) * 0.16);
      const level = (0.7 + 0.28 * s.stress) * (s.tune === 'exclaim' ? 1.12 : 1) * (0.92 + hash(seed, 60 + i) * 0.16);
      // The consonant needs room in front of the voice.
      const lead =
        s.onset === 'none' ? 0.012 : s.onset === 'hiss' || s.onset === 'hush' ? 0.08 : s.onset === 'breath' || s.onset === 'nasal' ? 0.065 : 0.05;
      const on = cursor + lead;

      // Where the pitch goes: down across a statement, up at the end of a
      // question, wider and higher in an exclamation, a lift on the stress.
      let contour: number;
      if (s.tune === 'question') contour = s.final ? (s.along >= 1 ? 1.3 : 1.14) : 1.0 - 0.04 * s.along;
      else if (s.tune === 'exclaim') contour = 1.12 - 0.16 * s.along;
      else contour = 1.06 - 0.15 * s.along;
      contour *= 1 + me.range * (s.stress - 0.35) + (hash(seed, 100 + i) - 0.5) * 0.06;
      const target = base * contour;
      // After a pause the line starts again from just under its note; in a
      // run it carries on from where it was.
      const from = afterPause ? target * 0.94 : f0;

      const sung = sing(g, s, on, length, level, from, target, s.pause, cursor);
      units.push({ at: on, length, from: s.from, to: s.to, stress: s.stress });
      f0 = sung.f0;
      cursor = sung.end + 0.012 + s.pause;
      afterPause = s.pause >= 0.2;
    }

    const end = units.length ? units[units.length - 1].at + units[units.length - 1].length : start;
    const utterance: Utterance = { text: sc.text, at: start, end, units };
    speaking = utterance;
    syllables = units;

    window.clearTimeout(retire);
    retire = window.setTimeout(
      () => {
        teardown();
        if (speaking === utterance) speaking = null;
      },
      (cursor - context.currentTime + 1.2) * 1000,
    );
    return utterance;
  };

  const voice: Voice = {
    output,
    get syllables() {
      return syllables;
    },
    get speaking() {
      return speaking;
    },

    say(text, at) {
      return perform(score(text), at);
    },

    babble(kind, at) {
      const tune: Tune = kind === 'greeting' ? (hash(seed, ++turn) < 0.5 ? 'exclaim' : 'statement') : hash(seed, ++turn) < 0.3 ? 'question' : 'statement';
      const count = kind === 'greeting' ? 2 + Math.floor(hash(seed, ++turn) * 2) : 6 + Math.floor(hash(seed, ++turn) * 9);
      const salt = ++turn;
      let n = 0;
      return perform(babbleScore(count, tune, () => hash(seed, salt * 100 + n++)), at);
    },


    hush(at) {
      if (!graph) return;
      const t = Math.max(at, context.currentTime);
      for (const p of [graph.voiced.gain, graph.breath.gain, graph.fricGain.gain]) {
        p.cancelScheduledValues(t);
        p.setTargetAtTime(0, t, 0.015);
      }
      graph.osc.frequency.cancelScheduledValues(t);
      if (speaking) syllables = speaking.units.filter((u) => u.at + u.length <= t);
      speaking = null;
      window.clearTimeout(retire);
      retire = window.setTimeout(teardown, 400);
    },

    fire(at, force) {
      const said = voice.babble(force > 0.7 ? 'talk' : 'greeting', at);
      return said.end - at + 0.3;
    },

    dispose() {
      window.clearTimeout(retire);
      teardown();
      bank.dispose();
      warmth.disconnect();
      floor.disconnect();
      output.disconnect();
    },
  };
  return voice;
}
