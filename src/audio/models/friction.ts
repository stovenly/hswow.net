import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import type { FaustNode } from '../faust/FaustNode';
import { createEventClock, poissonGap } from '../dsp/clock';
import { createModalBank } from '../dsp/modal';
import { excite } from '../dsp/impact';

/**
 * Two surfaces dragging over one another: a rope on a windlass, a cart axle, a
 * portcullis chain, a hinge, a tree on its own limbs. The same event at
 * different rates — held by static friction, released, caught again, a few
 * times a second at one end and several hundred at the other.
 *
 * The synthesis is in `faust/friction.dsp`, because the model is a per-sample
 * feedback loop a node graph cannot express. This file is what it is attached
 * to, what makes it move, and what happens when the wasm does not arrive.
 *
 * The fallback is a different thing that happens to sound similar: a train of
 * scheduled slip events into a modal bank. It cannot do the top of the range —
 * past a hundred slips a second the events fuse into a sung tone whose pitch
 * is the slip rate, and scheduling that fast outruns the lookahead. So it
 * creaks and rubs but never squeals, and `usingFaust` says which is playing.
 */

export interface FrictionOptions {
  /**
   * How hard the surfaces are pressed together, 0..1. Loudness and raspiness
   * at once: a loaded rope squeals and a slack one does not.
   */
  force?: number;
  /** The resonating body's first mode in Hz. What is creaking, not how fast. */
  pitch?: number;
  /** Ring-down of the body. Long is metal, short is wood. */
  decay?: number;
  /** Weight of the upper modes, 0..1. Low is heavy timber, high is thin plate. */
  bright?: number;
  /** Grain of the surface, 0..1. Zero is polished and sounds synthetic. */
  roughness?: number;
  gain?: number;
  /** Sliding speed when moving, 0..1. See `motion` for what moves it. */
  speed?: number;
  /**
   * What keeps it going.
   *
   * - `'cycle'` — turns for a while, rests, turns again. A windlass, a cart, a
   *   gate. The default: almost nothing in a world this size slides
   *   continuously, and friction that never stops is a drone with a texture.
   * - `'weather'` — driven by gust strength, with a threshold. A tree taking
   *   its own weight, a rope against a mast. Silent in still air.
   * - `'steady'` — never stops. A line shaft, a millwheel.
   */
  motion?: 'cycle' | 'weather' | 'steady';
}

export interface FrictionModel extends SoundModel {
  /** Overrides the motion for a frame. For a visual that drives its own sound. */
  setSpeed(value: number): void;
  setForce(value: number): void;
  /** Whether the per-sample loop is running, or the event-based stand-in. */
  readonly usingFaust: boolean;
  /**
   * Resolves once the Faust tier has either arrived or failed. For the audition
   * harness, which would otherwise measure the fallback under the real model's
   * name. Nothing in the game waits on it.
   */
  readonly ready: Promise<void>;
  /**
   * The compiled loop, or `null` if the fallback is carrying it. The whole node
   * rather than a setter, because the generated tuning panel builds itself from
   * its declared control ranges and current values.
   */
  readonly loop: FaustNode | null;
  /** Current sliding speed, for the debug readout and for driving a visual. */
  readonly currentSpeed: number;
}

/**
 * Fetches the compiled loop, or resolves `null` if it cannot be had. A function
 * rather than a top-level import, so the browser-only half of the Faust tier
 * stays out of every static import graph that touches `Soundscape` — see the
 * note at the call site.
 */
async function loadFrictionNode(context: BaseAudioContext): Promise<FaustNode | null> {
  try {
    const [{ createFaustNode }, { frictionMeta, frictionUrl }] = await Promise.all([
      import('../faust/FaustNode'),
      import('../faust/built/friction'),
    ]);
    return await createFaustNode(context, frictionUrl, frictionMeta);
  } catch (error) {
    console.warn('friction: faust tier unavailable — using the event fallback', error);
    return null;
  }
}

/** Above this the tree, gate or rope starts to take load and complain. */
const WEATHER_THRESHOLD = 0.42;
/**
 * Seconds over which `speed` glides toward its target. Enough to keep a step
 * from clicking and no more: a long constant against a 0.6 s pull leaves a
 * smear where the heave was.
 */
const GLIDE = 0.08;
/** Crossfade when the Faust node arrives mid-life. */
const HANDOVER = 0.4;

export function createFriction(engine: AudioEngine, options: FrictionOptions = {}): FrictionModel {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('friction model built before the noise buffers were ready');

  const force = options.force ?? 0.55;
  const pitch = options.pitch ?? 180;
  const decay = options.decay ?? 0.5;
  const bright = options.bright ?? 0.5;
  const roughness = options.roughness ?? 0.4;
  const motion = options.motion ?? 'cycle';
  const topSpeed = options.speed ?? 0.3;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // Both paths are built into their own bus and one is faded up. The fallback
  // runs from the first frame because the wasm takes a network round trip, and
  // a hinge silent for the first second of a zone is worse than one that
  // changes its mind about how it is synthesised.
  const nativeBus = context.createGain();
  nativeBus.gain.value = 1;
  nativeBus.connect(output);

  const faustBus = context.createGain();
  faustBus.gain.value = 0;
  faustBus.connect(output);

  // --- the fallback: slip events into a body ------------------------------
  //
  // The same four-mode inharmonic series the Faust body uses, so the two paths
  // agree about what is creaking. `'excitation'` ringing, because these decays
  // are long enough that filter Q would take the timbre with it.
  const bodyIn = context.createGain();
  bodyIn.connect(nativeBus);
  //
  // Q is stated rather than derived from the bank's `'excitation'` defaults,
  // which land between 4 and 14 — wide enough that a 2.5 ms noise burst goes
  // through nearly unchanged, which is static rather than a creak. Around 30
  // is the window: sharp enough that a slip arrives with a pitch attached,
  // wide enough to keep the grain of the contact.
  const q = 22 + bright * 22;
  const bank = createModalBank(
    context,
    [
      { hz: pitch, decay, level: 1, q },
      { hz: pitch * 2.41, decay: decay * 0.7, level: 0.12 + 0.55 * bright, q: q * 0.8 },
      { hz: pitch * 4.17, decay: decay * 0.45, level: 0.06 + 0.32 * bright, q: q * 0.6 },
      { hz: pitch * 6.83, decay: decay * 0.3, level: 0.03 + 0.18 * bright, q: q * 0.5 },
    ],
    bodyIn,
    { ring: 'excitation' },
  );

  // The rub underneath: contact noise whenever anything is moving at all.
  // Without it the fallback is discrete creaks with silence between them, and
  // that silence is what makes a procedural creak sound triggered.
  //
  // Narrow and quiet. A bandpass at Q 0.8 is barely a filter, and a broadband
  // hiss under everything reads as an untuned television.
  const rub = context.createBufferSource();
  rub.buffer = noise.pink;
  rub.loop = true;
  const rubFilter = context.createBiquadFilter();
  rubFilter.type = 'bandpass';
  rubFilter.frequency.value = pitch * 1.6;
  rubFilter.Q.value = 3.5;
  const rubLevel = context.createGain();
  rubLevel.gain.value = 0;
  rub.connect(rubFilter).connect(rubLevel).connect(nativeBus);
  rub.start();

  const clock = createEventClock(context);
  const slipGap = poissonGap();

  // --- motion state -------------------------------------------------------
  //
  // Declared before the loader below, whose callback reads `speed`. That
  // resolves long after this function returns, so the order is not
  // load-bearing — but a closure reaching backwards past its own declaration
  // stops being fine the moment someone makes the load synchronous.
  let speed = 0;
  let target = motion === 'steady' ? topSpeed : 0;
  let liveForce = force;
  let override: number | null = null;
  let active = true;
  // Time left in the current turn or rest. Only `'cycle'` uses these.
  let remaining = 1 + Math.random() * 4;
  let moving = false;
  /** Speed at the top of a stroke, re-rolled each burst. */
  let burst = topSpeed;
  /** Strokes per second. Somebody's arms, so slow and never quite regular. */
  let strokeRate = 0.8;
  let strokePhase = Math.random();

  // --- the loop, when it loads --------------------------------------------
  let faust: FaustNode | null = null;
  let disposed = false;

  // Imported dynamically, and not only for the bundle's sake. The Faust glue
  // reaches its wasm and worklet source through Vite's `?url` imports, which
  // only Vite resolves — and `Zone.ts` pulls `Soundscape` in for `SILENCE`, so
  // a static import here would drag the whole browser-only tier into the node
  // bundle. `AudioEngine` imports the reverb statically because nothing in
  // that graph reaches it; models are what a zone declares, so they are
  // reached. `--external:../faust/*` holds esbuild to the same boundary — the
  // dynamic import alone stops it running, not bundling.
  //
  // A zone with no friction in it never fetches the module at all.
  const ready = loadFrictionNode(context).then((node) => {
    if (!node) return;
    if (disposed) {
      node.dispose();
      return;
    }
    faust = node;
    node.node.connect(faustBus);
    node.set('force', force);
    node.set('pitch', pitch);
    node.set('decay', decay);
    node.set('bright', bright);
    node.set('roughness', roughness);
    node.set('gain', 0.7);
    node.set('speed', speed);

    const now = context.currentTime;
    faustBus.gain.setTargetAtTime(1, now, HANDOVER / 3);
    nativeBus.gain.setTargetAtTime(0, now, HANDOVER / 3);
  });

  // --- motion -------------------------------------------------------------
  /**
   * Bursts of work, and strokes within a burst.
   *
   * Constant speed puts the contact at one fixed point on the friction curve,
   * so the loop settles into one timbre and holds it — which is a buzz.
   * Nothing hauls a chain at a constant speed: it is pulled in strokes, and
   * each stroke sweeps the speed up and back down, walking the contact across
   * the curve through the sticking region, through the Stribeck dip, out into
   * the rub and back. That sweep is the creak.
   *
   * `max(0, sin)` rather than a full sine: the working half is the pull, and
   * the return is somebody's hands moving, which makes no sound.
   */
  function cycle(dt: number): void {
    remaining -= dt;
    if (remaining <= 0) {
      moving = !moving;
      // Worked in bursts with long gaps. A windlass that turns half the time is
      // a machine; one that turns for four seconds a minute is somebody doing
      // something, and that is the read this is for.
      remaining = moving ? 2 + Math.random() * 5 : 5 + Math.random() * 14;
      // Never twice at the same rate, and never twice at the same rhythm. A
      // rope hauled identically every time is the give-away that there is
      // nobody on the other end of it.
      burst = topSpeed * (0.6 + Math.random() * 0.7);
      strokeRate = 0.55 + Math.random() * 0.65;
      // Back to the start of a stroke, so a burst always opens on a pull from
      // rest. Carrying the phase over would start some bursts halfway up a
      // heave, which is a step into full speed and reads as a click.
      strokePhase = 0;
    }

    if (!moving) {
      target = 0;
      return;
    }

    strokePhase += dt * strokeRate;
    // Rounded off at the top by the exponent, so a stroke is a heave with a
    // sustain in the middle of it rather than a ping.
    target = burst * Math.max(0, Math.sin(strokePhase * Math.PI * 2)) ** 0.55;
  }

  return {
    output,
    ready,

    setSpeed(value) {
      override = Math.max(0, Math.min(1, value));
    },

    setForce(value) {
      liveForce = Math.max(0, Math.min(1, value));
      faust?.set('force', liveForce);
    },

    get usingFaust() {
      return faust !== null;
    },

    get loop() {
      return faust;
    },

    get currentSpeed() {
      return speed;
    },

    update(dt, audio, at) {
      if (!active) return;

      if (override !== null) {
        target = override;
        override = null;
      } else if (motion === 'cycle') {
        cycle(dt);
      } else if (motion === 'weather') {
        // Threshold, then a steep curve above it. A tree under load does
        // nothing at all until the limb moves, and then it complains. Linear
        // here gives a permanent quiet creak, which is a drone.
        const over = Math.max(0, audio.weather.strengthAt(at.x, at.z) - WEATHER_THRESHOLD);
        target = Math.min(1, (over / (1 - WEATHER_THRESHOLD)) ** 1.6) * topSpeed;
      }

      // Glided rather than assigned. `speed` walks the contact across the
      // friction curve, and stepping it jumps the whole loop to a different
      // regime between one quantum and the next.
      speed += (target - speed) * Math.min(1, dt / GLIDE);
      faust?.set('speed', speed);

      // --- the fallback's share -------------------------------------------
      //
      // Skipped entirely once the loop is running: the events would be audible
      // through the crossfade, and after it they are work for a silent bus.
      if (faust) return;

      const now = context.currentTime;
      if (speed < 0.01) {
        rubLevel.gain.setTargetAtTime(0, now, 0.2);
        clock.reset();
        return;
      }

      // Quiet. Under the slips, not beside them — a rub loud enough to be
      // heard as its own layer is hiss.
      rubLevel.gain.setTargetAtTime(0.022 * liveForce * speed ** 0.7, now, 0.12);

      // Slips you could count. A creak is a handful of slips a second at a
      // groan and a few dozen at a squeal; much faster and none of them is an
      // event any more, they fuse into the hiss the rub already supplies. The
      // top of that range is the boundary the Faust loop exists to cross.
      slipGap.rate = 2 + speed * 26;
      const level = liveForce * 0.5 * (0.3 + 0.7 / (1 + speed * 6));
      clock.pump(
        (at) => {
          const jitter = 0.7 + Math.random() * 0.6;
          for (const input of bank.inputs) {
            // A slip is a very short contact — that is what makes it a creak
            // and not a knock. See the note on duration in `dsp/impact.ts`.
            excite(context, noise.white, input, at, level * jitter, 0.003);
          }
        },
        slipGap,
        'immediate',
      );
    },

    setActive(value) {
      active = value;
      if (!value) {
        rubLevel.gain.setTargetAtTime(0, context.currentTime, 0.1);
        clock.reset();
        // The loop keeps running on the audio thread whatever we do, so it is
        // told to stop sliding rather than merely being disconnected.
        faust?.set('speed', 0);
        speed = 0;
      }
    },

    dispose() {
      disposed = true;
      rub.stop();
      rub.disconnect();
      rubFilter.disconnect();
      rubLevel.disconnect();
      bank.dispose();
      bodyIn.disconnect();
      faust?.dispose();
      faustBus.disconnect();
      nativeBus.disconnect();
      output.disconnect();
    },
  };
}
