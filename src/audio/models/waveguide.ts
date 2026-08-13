import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import type { FaustNode } from '../faust/FaustNode';
import { createEventClock, poissonGap } from '../dsp/clock';
import { createModalBank } from '../dsp/modal';
import { excite } from '../dsp/impact';

/**
 * Something hollow or taut, ringing.
 *
 * Chimes, hanging wire, struck tubes, singing bowls, and air moving through
 * pipework or an arrow slit. The synthesis is in `faust/waveguide.dsp` and the
 * reasoning is there; this is the game's side of it — what excites the thing,
 * how often, and what happens when the wasm does not arrive.
 *
 * ## The excitation lives here, and that is the design
 *
 * The module takes an audio input and makes no sound on its own. Everything
 * that hits it is scheduled from this file using `dsp/impact` and `dsp/clock`,
 * the same substrate `footsteps` and `door` are built on. A Faust control
 * cannot be scheduled accurately — parameters arrive by message and land on a
 * quantum boundary at best — so putting the strike in the module would mean
 * reimplementing the scheduler badly and losing sample accuracy for it.
 *
 * The split is worth stating plainly because it is the pattern for every
 * module after this one: **Faust does the part node graphs cannot, and the
 * substrate does everything else.**
 *
 * ## Two implementations, and this fallback is honestly worse
 *
 * The native path is a modal bank on the harmonic series. It gets the pitch
 * and roughly the timbre, and it cannot do the one thing that makes a
 * waveguide worth having: a real one's damping is *inside* the loop, so high
 * partials die faster than low ones and the timbre changes as it rings —
 * bright at the strike, settling to a hum. A bank of fixed resonators has one
 * timbre for its whole life however many modes it has.
 *
 * It also cannot reach the high pitches convincingly, which is the other half
 * of why the module exists. So the fallback is a stand-in for a chime rather
 * than a chime, and `usingFaust` says which one is playing.
 */

export interface WaveguideOptions {
  /** Resonant frequency. With `closed`, the pitch heard is an octave below. */
  pitch?: number;
  /** Seconds to fall 60 dB. See the note on `drive` about what is achievable. */
  decay?: number;
  /** Weight of the upper partials, 0..1. Low is stopped wood, high is metal. */
  bright?: number;
  /** Stopped at one end: odd harmonics only, sounding an octave down. */
  closed?: boolean;
  /** Where it is struck along its length, 0.02..0.5. */
  place?: number;
  gain?: number;
  /**
   * How it is set going.
   *
   * - `'chime'` — struck at intervals. Hanging wire, chimes, a bowl knocked
   *   by something passing. **The default**, because a resonator that is
   *   struck and then left alone is the shape this synthesis flatters most:
   *   the whole point is what happens during the ring.
   * - `'breath'` — a continuous stream of air through it. Pipework, vents,
   *   arrow slits. Quieter, and it never quite stops.
   */
  excite?: 'chime' | 'breath';
  /**
   * How hard it is driven, 0..1. Strike rate for `'chime'`, air for `'breath'`.
   *
   * With `weather` set this is the ceiling rather than the value.
   */
  drive?: number;
  /**
   * Whether the gust field drives it.
   *
   * A wind chime is the obvious case and it is the one that most rewards
   * having a weather system: the chime is silent in still air, hurries when it
   * gusts, and rings on afterwards. None of that has to be scheduled.
   */
  weather?: boolean;
}

export interface WaveguideModel extends SoundModel {
  /** Hits it now. For something walking into it, or for a tuning panel. */
  strike(force?: number): void;
  /** Resolves once the Faust tier has arrived or failed. See `friction.ts`. */
  readonly ready: Promise<void>;
  /** The compiled loop, for a generated panel. `null` on the fallback. */
  readonly loop: FaustNode | null;
  readonly usingFaust: boolean;
}

/** Strikes per second at full drive. A chime clatters; it does not machine-gun. */
const MAX_RATE = 7;
/** Below this the air is too still to move anything. */
const WEATHER_FLOOR = 0.3;
/** Crossfade when the Faust node arrives mid-life. */
const HANDOVER = 0.4;

async function loadWaveguideNode(context: BaseAudioContext): Promise<FaustNode | null> {
  try {
    const [{ createFaustNode }, { waveguideMeta, waveguideUrl }] = await Promise.all([
      import('../faust/FaustNode'),
      import('../faust/built/waveguide'),
    ]);
    return await createFaustNode(context, waveguideUrl, waveguideMeta);
  } catch (error) {
    console.warn('waveguide: faust tier unavailable — using the modal fallback', error);
    return null;
  }
}

export function createWaveguide(
  engine: AudioEngine,
  options: WaveguideOptions = {},
): WaveguideModel {
  const context = engine.context;
  // Captured as a non-null local rather than read off the engine at use time:
  // `hit` is called from a closure long after this check, and `engine.noise`
  // is nullable until the buffers are built.
  const noise = engine.noise;
  if (noise === null) throw new Error('waveguide built before the noise buffers were ready');
  const white = noise.white;

  const pitch = options.pitch ?? 440;
  const decay = options.decay ?? 2;
  const bright = options.bright ?? 0.5;
  const closed = options.closed ?? false;
  const place = options.place ?? 0.22;
  const mode = options.excite ?? 'chime';
  const drive = options.drive ?? 0.5;
  const weatherDriven = options.weather ?? false;

  const output = context.createGain();
  // The module runs quiet — a waveguide's output is one round trip of whatever
  // was put in, and the comb at the strike position takes more out again. This
  // is a working level, not a fudge.
  output.gain.value = (options.gain ?? 0.5) * 3.2;

  const faustBus = context.createGain();
  faustBus.gain.value = 0;
  faustBus.connect(output);
  const nativeBus = context.createGain();
  nativeBus.gain.value = 1;
  nativeBus.connect(output);

  // --- the exciter ---------------------------------------------------------
  //
  // One node that both paths are driven from, so a handover does not change
  // what is hitting the resonator — only what the resonator is.
  const exciter = context.createGain();
  exciter.gain.value = 1;

  // Continuous air, for `'breath'`. Always built and left at zero otherwise:
  // one buffer source is cheaper than branching the graph, and it means a
  // model can be switched between modes from a panel without rewiring.
  const air = context.createBufferSource();
  air.buffer = white;
  air.loop = true;
  const airShape = context.createBiquadFilter();
  airShape.type = 'bandpass';
  // Around the pitch, so the noise is already close to what the tube wants to
  // resonate at. Broadband air through a sharp resonator wastes most of itself
  // and the part that gets through is hiss.
  airShape.frequency.value = pitch * (closed ? 0.5 : 1);
  airShape.Q.value = 0.9;
  const airLevel = context.createGain();
  airLevel.gain.value = 0;
  air.connect(airShape).connect(airLevel).connect(exciter);
  air.start();

  // --- the fallback --------------------------------------------------------
  //
  // A harmonic series rather than the inharmonic set the friction body uses:
  // this is a *tuned* object, and that is the difference. Odd harmonics only
  // when stopped, at half the frequency, which is what the sign flip in the
  // module does properly.
  const base = closed ? pitch * 0.5 : pitch;
  const ratios = closed ? [1, 3, 5, 7] : [1, 2, 3, 4];
  const bank = createModalBank(
    context,
    ratios.map((n, i) => ({
      hz: base * n,
      decay: decay / (1 + i * 0.6),
      level: (0.2 + bright * 0.8) ** i,
      // High Q, because this is a tuned resonator and not a material. The
      // usual argument against — that a sharp bandpass has no timbre left —
      // does not apply when the timbre is supposed to be a pitch.
      q: 60 + bright * 60,
    })),
    nativeBus,
    { ring: 'filter', maxQ: 200 },
  );
  for (const input of bank.inputs) exciter.connect(input);

  const clock = createEventClock(context);
  const hitGap = poissonGap();

  let faust: FaustNode | null = null;
  let disposed = false;
  let active = true;

  const ready = loadWaveguideNode(context).then((node) => {
    if (!node) return;
    if (disposed) {
      node.dispose();
      return;
    }
    faust = node;
    exciter.connect(node.node);
    node.node.connect(faustBus);
    node.set('pitch', pitch);
    node.set('decay', decay);
    node.set('bright', bright);
    node.set('closed', closed ? 1 : 0);
    node.set('place', place);
    node.set('gain', 0.7);

    const now = context.currentTime;
    faustBus.gain.setTargetAtTime(1, now, HANDOVER / 3);
    nativeBus.gain.setTargetAtTime(0, now, HANDOVER / 3);
  });

  /** One strike, scheduled. Short and bright — a hard contact on a hard thing. */
  function hit(at: number, force: number): void {
    excite(context, white, exciter, at, force * 0.5, 0.0016);
  }

  return {
    output,
    ready,

    get loop() {
      return faust;
    },

    get usingFaust() {
      return faust !== null;
    },

    strike(force = 1) {
      hit(context.currentTime + 0.02, force);
    },

    update(dt, audio, at) {
      if (!active) return;
      void dt;

      // How hard it is being driven this frame. Weather, when asked for —
      // squared above the floor, because a chime does not respond in
      // proportion to the wind, it responds when the wind is enough to move
      // something and not at all below that.
      const wind = Math.max(0, audio.weather.strengthAt(at.x, at.z) - WEATHER_FLOOR) / (1 - WEATHER_FLOOR);
      const amount = weatherDriven ? drive * wind ** 2 : drive;

      const now = context.currentTime;
      if (mode === 'breath') {
        airLevel.gain.setTargetAtTime(amount * 0.09, now, 0.25);
        return;
      }

      airLevel.gain.setTargetAtTime(0, now, 0.25);
      if (amount < 0.02) {
        clock.reset();
        return;
      }

      hitGap.rate = MAX_RATE * amount;
      clock.pump(
        (at) => hit(at, 0.35 + Math.random() * 0.65),
        hitGap,
        // Individually audible events, so a source returning from silence must
        // wait an interval rather than firing the moment it becomes audible.
        'oneGap',
      );
    },

    setActive(value) {
      active = value;
      if (!value) {
        airLevel.gain.setTargetAtTime(0, context.currentTime, 0.1);
        clock.reset();
      }
    },

    dispose() {
      disposed = true;
      air.stop();
      air.disconnect();
      airShape.disconnect();
      airLevel.disconnect();
      bank.dispose();
      exciter.disconnect();
      faust?.dispose();
      faustBus.disconnect();
      nativeBus.disconnect();
      output.disconnect();
    },
  };
}
