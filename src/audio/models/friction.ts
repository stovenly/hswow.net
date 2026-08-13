import type { AudioEngine } from '../AudioEngine';
import type { SoundModel } from '../Emitter';
import type { FaustNode } from '../faust/FaustNode';
import { createEventClock, poissonGap } from '../dsp/clock';
import { createModalBank } from '../dsp/modal';
import { excite } from '../dsp/impact';

/**
 * Two surfaces dragging over one another.
 *
 * A rope on a windlass, a cart axle, a portcullis chain, a hinge, a tree
 * leaning on its own limbs. All the same event at different rates: held by
 * static friction, released, caught again, a few times a second at one end of
 * the range and several hundred at the other. Groan, creak, squeal, rub.
 *
 * The synthesis is in `faust/friction.dsp` and the reasoning is all there,
 * because the interesting part is a per-sample feedback loop that a node graph
 * cannot express. This file is the game's side of it: what it is attached to,
 * what makes it move, and what happens when the wasm does not arrive.
 *
 * ## Two implementations, and the difference is honest
 *
 * The Faust loop is the real model. The fallback below is a different thing
 * that happens to sound similar, and pretending otherwise would be how a
 * degraded path silently becomes the one everybody hears.
 *
 * Stick-slip *is* a train of slip events, so a train of scheduled impacts into
 * a modal bank gets the character of a creak honestly and cheaply — the same
 * substrate `footsteps` and `door` are built on. What it cannot do is the top
 * of the range: past a hundred or so slips a second the events stop being
 * individually audible and fuse into a sung tone whose pitch is set by the
 * slip rate rather than by the body, and reaching that by scheduling events
 * would mean scheduling them faster than the lookahead window is long. So the
 * fallback creaks and rubs but never squeals, and `usingFaust` says which one
 * you are hearing rather than leaving it to be guessed at from the mix.
 */

export interface FrictionOptions {
  /**
   * How hard the surfaces are pressed together, 0..1.
   *
   * Loudness and raspiness at once, which is right: a loaded rope squeals and
   * a slack one does not, and they are not two settings of a volume control.
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
   * - `'cycle'` — turns for a while, rests, turns again. A windlass being
   *   worked, a cart passing, a gate. **The default**, because almost nothing
   *   in a world this size slides continuously, and a friction sound that
   *   never stops is a drone with a texture rather than an event.
   * - `'weather'` — driven by gust strength, with a threshold. A tree taking
   *   its own weight, a rope against a mast, a sign on its bracket. Silent in
   *   still air, which is most of the time, and that is the point.
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
   * Resolves once the Faust tier has either arrived or failed.
   *
   * For the audition harness, which would otherwise finish its render before
   * the wasm landed and measure the fallback under the real model's name.
   * Nothing in the game waits on this — the whole design is that it does not
   * have to.
   */
  readonly ready: Promise<void>;
  /**
   * The compiled loop, or `null` if the fallback is carrying it.
   *
   * For the generated tuning panel, which builds itself from the node's own
   * declared control ranges. Deliberately the whole node rather than a
   * `tune(key, value)` — a panel needs the ranges and the current values as
   * much as it needs the setter, and three accessors that always travel
   * together are one object.
   */
  readonly loop: FaustNode | null;
  /** Current sliding speed, for the debug readout and for driving a visual. */
  readonly currentSpeed: number;
}

/**
 * Fetches the compiled loop, or resolves `null` if it cannot be had.
 *
 * Kept as a function rather than a top-level import so the browser-only half
 * of the Faust tier stays out of every static import graph that touches
 * `Soundscape` — see the note at the call site.
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
 * Seconds over which `speed` glides toward its target.
 *
 * Enough to keep a step from clicking, and no more. It was four times this,
 * which was safe and which flattened the stroke shape the motion cycle exists
 * to produce — a 0.35 s time constant against a 0.6 s pull leaves a smear
 * where the heave was.
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

  // Both paths are built into their own bus and one of them is faded up. The
  // fallback runs from the first frame because the wasm takes a network round
  // trip to arrive and a hinge that is silent for the first second of a zone
  // is worse than a hinge that changes its mind about how it is synthesised.
  const nativeBus = context.createGain();
  nativeBus.gain.value = 1;
  nativeBus.connect(output);

  const faustBus = context.createGain();
  faustBus.gain.value = 0;
  faustBus.connect(output);

  // --- the fallback: slip events into a body ------------------------------
  //
  // The same four-mode inharmonic series the Faust body uses, so the two
  // paths at least agree about what is creaking. `'excitation'` ringing
  // because these decays are long enough that filter Q would take the timbre
  // with it — see `dsp/modal.ts`.
  const bodyIn = context.createGain();
  bodyIn.connect(nativeBus);
  //
  // **Q is stated rather than derived, and that is the whole fix.** The first
  // version took the bank's `'excitation'` defaults, which land between 4 and
  // 14 — wide enough that a 2.5 ms noise burst goes through nearly unchanged.
  // Thirty of those a second is not a creak, it is static, and it measured as
  // static too: energy spread evenly across every band with no peak anywhere.
  //
  // Around 30 is the useful window. Sharp enough that a slip arrives with a
  // pitch attached, wide enough to keep the grain of the contact in it, and
  // well under the point where a bandpass stops having a timbre at all.
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

  // The rub underneath: contact noise that exists whenever anything is moving
  // at all. Without it the fallback is a string of discrete creaks with
  // silence between them, and silence between the creaks is what makes a
  // procedural creak sound like a sound effect being triggered.
  //
  // Narrow, and much quieter than it was. A bandpass at Q 0.8 is barely a
  // filter — it passed most of the pink noise it was given, and a broadband
  // hiss under everything was doing more to make the model sound like an
  // untuned television than the slips were.
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
  // Declared before the loader below, which reads `speed` from inside its
  // callback. It resolves long after this function has returned, so the order
  // is not load-bearing — but a closure reaching backwards past its own
  // declaration is exactly the shape that stops being fine the moment someone
  // makes the load synchronous.
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

  // **Imported dynamically, and not only for the bundle's sake.** The Faust
  // glue reaches the compiled wasm and the worklet source through Vite's `?url`
  // imports, which only Vite can resolve — and `Zone.ts` pulls `Soundscape` in
  // for `SILENCE`, so a static import from here would drag the whole browser-
  // only tier into `check:world`'s node bundle and stop it building.
  //
  // `AudioEngine` gets away with importing the reverb statically because
  // nothing in the check graph reaches *it*. A model is not so lucky: models
  // are what a zone declares, so they are exactly the part of the audio system
  // the world check does see. Hence the boundary here rather than there, and
  // `--external:../faust/*` on `check:world` to hold esbuild to it — the
  // dynamic import alone does not stop it bundling, it only stops it running.
  //
  // The side benefit is real: a zone with no friction in it never fetches the
  // module at all.
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
   * The first version had only the outer layer — turning for a few seconds,
   * then resting — and it was wrong in a way that the parameters could not
   * fix. Constant speed puts the contact at one fixed point on the friction
   * curve, so the loop settles into one timbre and holds it, and a rough
   * timbre held for four seconds is a buzz. It read, accurately, as static.
   *
   * Nothing hauls a chain at a constant speed. It is pulled in strokes: heave,
   * release, take up the slack, heave again. Each stroke sweeps the speed from
   * nothing up and back down, which walks the contact right across the curve —
   * through the sticking region, through the Stribeck dip, out into the rub
   * and back — and that sweep *is* the creak. It also moves the level, so the
   * source has a rhythm rather than a duration.
   *
   * `max(0, sin)` rather than a full sine: the working half of a stroke is the
   * pull, and the return is somebody's hands moving, which makes no sound.
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
        // Threshold, then a steep curve above it. A tree under load does not
        // groan proportionally to the wind — it does nothing at all until the
        // limb moves, and then it complains. Linear here gives a permanent
        // quiet creak, which is a drone.
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
      // through the crossfade for as long as it lasts, and after that they are
      // scheduling work for a bus at zero gain.
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

      // **Slips you could count.** This was `3 + speed * 90`, which at a
      // working speed is better than thirty noise bursts a second — far too
      // fast for any of them to be an event, so they fused into the hiss the
      // rub was already supplying. A creak is a handful of slips a second at a
      // groan and a few dozen at a squeal, and the top of that range is where
      // scheduled events stop working at all, which is precisely the boundary
      // the Faust loop exists to cross.
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
