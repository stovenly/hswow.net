/**
 * The throat. One processor, for everything that has one.
 *
 * Plain JavaScript, not TypeScript, and dependency-free: `addModule` loads this
 * file verbatim into a scope with no `window`, no `fetch` and no module
 * resolution. Everything it knows about the body it is arrives in
 * `processorOptions`; everything it is asked to do arrives as gestures on
 * twelve tracks of physical parameters. It knows no vowels and no species.
 *
 * Nothing here allocates and nothing here throws once running — one exception
 * kills the node for good.
 *
 * ## The model
 *
 * A Liljencrants–Fant glottal pulse drives a Kelly–Lochbaum waveguide with a
 * nasal branch, run at twice the context rate. The waves in the lines are
 * **volume velocity**, so a junction between sections of area A1 (behind) and
 * A2 (ahead) has `r = (A1 − A2)/(A1 + A2)`, an outgoing pair of
 * `a − r(a + b)` forward and `b + r(a + b)` back, and the ends reflect
 * positively at the glottis and negatively at the lips. The source is the
 * *derivative* of glottal flow, which is what radiation from the lips would
 * have differentiated anyway — so the output needs a DC block and nothing more.
 */

const QUANTUM = 128;
const TWO_PI = Math.PI * 2;
/** Keys one track will hold. Longer than any line a writer sends. */
const CAP = 384;
const NTRACKS = 12;
/** The first six are the source; the six after are articulators, in follower order. */
const T_F0 = 0, T_RD = 1, T_LOUD = 2, T_BREATH = 3, T_MOD = 4, T_CHAOS = 5;
const T_VELUM = 6, T_JAW = 7, T_BODYPOS = 8, T_BODYDIA = 9, T_TIP = 10, T_LIPS = 11;
const TRACKS = [
  'f0', 'rd', 'loud', 'breath', 'modulate', 'chaos',
  'velum', 'jaw', 'bodyPos', 'bodyDia', 'tip', 'lips',
];
const STEP = 0, EXP = 2;

/**
 * Diameter under which a constriction starts to hiss. **Every vowel must sit
 * clear of this** — a tongue humped for an `i` is nowhere near tight enough to
 * make turbulence, and a threshold above one turns the vowel into frication.
 */
const HISS_AT = 0.45;

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

class VoiceProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const b = options.processorOptions.body;

    this.dt = 1 / sampleRate;
    this.over = b.oversample;
    this.gain = b.gain;

    // --- the tube ---------------------------------------------------------
    const n = (this.n = b.sections);
    this.R = new Float32Array(n);
    this.L = new Float32Array(n);
    this.jR = new Float32Array(n + 1);
    this.jL = new Float32Array(n + 1);
    this.rest = Float32Array.from(b.restShape);
    this.diameter = Float32Array.from(b.restShape);
    this.area = new Float32Array(n);
    this.k = new Float32Array(n);
    this.kWas = new Float32Array(n);

    const nn = (this.nn = b.noseSections);
    this.nR = new Float32Array(nn);
    this.nL = new Float32Array(nn);
    this.njR = new Float32Array(nn + 1);
    this.njL = new Float32Array(nn + 1);
    this.noseShape = Float32Array.from(b.noseShape);
    this.noseArea = new Float32Array(nn);
    this.nk = new Float32Array(nn);
    this.noseAt = b.noseAt;
    this.kLeft = 0; this.kRight = 0; this.kNose = -1;
    this.kLeftWas = 0; this.kRightWas = 0; this.kNoseWas = -1;

    this.glottalK = b.glottalReflect;
    this.glottalBase = b.glottalReflect;
    this.lipK = b.lipReflect;
    this.loss = b.wallLoss;
    this.damp = b.wallDamp;
    this.lipLp = 0;
    this.glottalLp = 0;
    this.noseLp = 0;

    // --- the shape --------------------------------------------------------
    this.bodyFrom = b.bodyFrom;
    this.bodyTo = b.bodyTo;
    this.bodySpread = b.bodySpread;
    this.tipAt = b.tipAt;
    this.tipSpread = b.tipSpread;
    this.lipSections = b.lipSections;
    this.tau = Float32Array.from(b.tau);
    // Follower position and velocity, one per articulator, resting open.
    this.pos = new Float32Array([0, 0.45, 0.55, 1.2, 1.5, 1.2]);
    this.vel = new Float32Array(6);

    // --- the source -------------------------------------------------------
    this.jitter = b.jitter;
    this.shimmer = b.shimmer;
    this.driftAmount = b.drift;
    this.tremor = b.tremor;
    this.tremorHz = b.tremorHz;
    this.modulateHz = b.modulateHz;
    this.breathFloor = b.breathFloor;
    this.airCap = b.air;
    this.turbulence = b.turbulence;
    // Dev dials, overridden live by `voice/tuning.ts`.
    this.headCoef = 0.78;
    this.rdBias = 0;
    this.aspGain = 0.3;

    this.phase = 0;
    this.cycleRate = 1;
    this.cycleAmp = 1;
    this.flip = 1;
    this.air = 1;
    this.drift = 0;
    this.driftTo = 0;
    this.driftT = 0;
    this.tremorPhase = 0;
    this.modPhase = 0;
    this.aspLp = 0;
    this.turbLp = 0;
    this.lastNoise = 0;
    // Its own noise, or two villagers standing together hiss in step and sum
    // as one louder source rather than as two people.
    this.seed = (b.noiseSeed | 0) || 22222;
    this.dcFlip = 1;

    // LF shape, recomputed when Rd has moved enough.
    this.rdWas = -1;
    this.lfE0 = 1; this.lfAlpha = 0; this.lfOmega = 0;
    this.lfTe = 0.6; this.lfEps = 0; this.lfShift = 0; this.lfDelta = 1;
    this.setWaveform(1.2);

    // --- turbulence -------------------------------------------------------
    // The search for the constriction starts clear of the glottal end, where
    // the tube is narrow by nature and the noise made there is aspiration —
    // which the source has already accounted for.
    this.turbFrom = Math.max(2, (n * 0.2) | 0);
    this.turbAt = n - 2;
    this.turbLevel = 0;
    // Followed per sample. `turbLevel` is a block quantity, and a stop is now
    // open in nine milliseconds — three or four blocks — so using it directly
    // steps the noise envelope on the way out of a closure, and a stepped
    // envelope on noise crackles at every step.
    this.turbSmooth = 0;
    // The release. The waveguide has no pressure behind a closure, so a stop
    // opening is silent by itself; this is the puff that lets go — a decaying
    // pulse into both directions at the section that just came open.
    this.minWas = 1;
    this.transAmp = 0;
    this.transAt = 0;

    // --- the schedule -----------------------------------------------------
    this.times = [];
    this.values = [];
    this.curves = [];
    this.count = new Int32Array(NTRACKS);
    this.cursor = new Int32Array(NTRACKS);
    this.now = new Float32Array([180, 1.2, 0, 0, 0, 0, 0, 0.45, 0.55, 1.2, 1.5, 1.2]);
    // Where every track stood when the last gesture landed, and when that was:
    // a new line glides in from wherever the throat actually is rather than
    // holding the note it was cut off on.
    this.was = Float32Array.from(this.now);
    this.since = 0;
    for (let t = 0; t < NTRACKS; t++) {
      this.times.push(new Float64Array(CAP));
      this.values.push(new Float32Array(CAP));
      this.curves.push(new Uint8Array(CAP));
    }

    this.hushAt = Infinity;
    this.hushOver = 0.02;
    this.hushGain = 1;
    this.inhaleAt = Infinity;
    this.inhaleFor = 0;
    this.inhaleDepth = 0;

    this.quiet = 0;
    this.env = 0;
    this.idle = true;
    this.toldIdle = true;

    // --- output -----------------------------------------------------------
    this.dcX = 0;
    this.dcY = 0;
    this.headLp = 0;

    this.port.onmessage = (event) => this.take(event.data);
    this.alive = true;
  }

  /**
   * A message. Runs on the audio thread but outside `process`, so the copies
   * here are the only place keys are written.
   */
  take(msg) {
    if (msg.kind === 'gesture') {
      const tracks = msg.tracks;
      this.was.set(this.now);
      this.since = currentTime;
      for (let t = 0; t < NTRACKS; t++) {
        const packed = tracks[TRACKS[t]];
        // A track the writer did not mention holds where it stands.
        if (!packed) {
          this.count[t] = 0;
          continue;
        }
        const keys = Math.min(CAP, (packed.length / 3) | 0);
        const times = this.times[t];
        const values = this.values[t];
        const curves = this.curves[t];
        for (let i = 0; i < keys; i++) {
          times[i] = packed[i * 3];
          values[i] = packed[i * 3 + 1];
          curves[i] = packed[i * 3 + 2];
        }
        this.count[t] = keys;
        this.cursor[t] = 0;
      }
      this.hushAt = Infinity;
      this.hushGain = 1;
      this.idle = false;
      this.toldIdle = false;
      this.quiet = 0;
    } else if (msg.kind === 'hush') {
      this.hushAt = msg.at;
      this.hushOver = Math.max(0.005, msg.over);
    } else if (msg.kind === 'tune') {
      // Dev dials. Assigning a field is enough — every one of these is read
      // fresh in the loop below.
      const v = msg.value;
      if (msg.key === 'gain') this.gain = v;
      else if (msg.key === 'wallLoss') this.loss = v;
      else if (msg.key === 'glottalReflect') this.glottalBase = v;
      else if (msg.key === 'lipReflect') this.lipK = v;
      else if (msg.key === 'wallDamp') this.damp = v;
      else if (msg.key === 'head') this.headCoef = v;
      else if (msg.key === 'rdBias') this.rdBias = v;
      else if (msg.key === 'aspiration') this.aspGain = v;
      else if (msg.key === 'turbulence') this.turbulence = v;
    } else if (msg.kind === 'inhale') {
      this.inhaleAt = msg.at;
      this.inhaleDepth = msg.depth;
      this.inhaleFor = 0.16 + 0.22 * msg.depth;
      this.idle = false;
      this.toldIdle = false;
      this.quiet = 0;
    }
  }

  // --- source -------------------------------------------------------------

  /**
   * Fant's transformed LF, by the closed-form fit Pink Trombone uses: one
   * number, `Rd`, moves open quotient, skew and return phase together, so
   * spectral tilt follows effort instead of being dialled separately. Low is
   * pressed, high is breathy. The waveform it defines dips to −1 at closure
   * and is zero at both ends of the cycle.
   */
  setWaveform(rd) {
    const Rd = rd < 0.3 ? 0.3 : rd > 2.7 ? 2.7 : rd;
    const Ra = -0.01 + 0.048 * Rd;
    const Rk = 0.224 + 0.118 * Rd;
    const Rg = (Rk / 4) * (0.5 + 1.2 * Rk) / (0.11 * Rd - Ra * (0.5 + 1.2 * Rk));

    const Tp = 1 / (2 * Rg);
    const Te = Tp + Tp * Rk;
    const eps = 1 / Ra;
    const shift = Math.exp(-eps * (1 - Te));
    const delta = 1 - shift;

    const rhs = ((1 / eps) * (shift - 1) + (1 - Te) * shift) / delta;
    const upper = (Te - Tp) / 2 - rhs;
    const omega = Math.PI / Tp;
    const s = Math.sin(omega * Te);
    const y = (-Math.PI * s * upper) / (Tp * 2);
    const alpha = Math.log(y) / (Tp / 2 - Te);

    // A bad Rd can put `y` at or below zero; keep the last good shape rather
    // than poison the source with a NaN that never washes out.
    if (!isFinite(alpha) || !isFinite(eps)) return;
    this.lfAlpha = alpha;
    this.lfOmega = omega;
    this.lfTe = Te;
    this.lfEps = eps;
    this.lfShift = shift;
    this.lfDelta = delta;
    this.lfE0 = -1 / (s * Math.exp(alpha * Te));
  }

  lf(t) {
    if (t > this.lfTe) {
      return (-Math.exp(-this.lfEps * (t - this.lfTe)) + this.lfShift) / this.lfDelta;
    }
    return this.lfE0 * Math.exp(this.lfAlpha * t) * Math.sin(this.lfOmega * t);
  }

  noise() {
    let s = this.seed;
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    this.seed = s | 0;
    return this.seed * 4.6566128e-10;
  }

  /**
   * A new fold cycle: roll the roughness that is rolled once and not within.
   * `chaos` doubles the period — alternate cycles come out shorter and
   * quieter, which is what creak and a rasp are.
   */
  newCycle(chaos) {
    this.flip = -this.flip;
    const rough = 1 + chaos * 6;
    this.cycleRate = 1 + (this.noise() * this.jitter * rough);
    this.cycleAmp = 1 + this.noise() * this.shimmer;
    if (chaos > 0 && this.flip < 0) {
      this.cycleRate *= 1 + chaos * 0.22;
      this.cycleAmp *= 1 - chaos * 0.55;
    }
  }

  // --- shape --------------------------------------------------------------

  /**
   * Articulator followers, then the area function, then the reflections.
   *
   * Once a block. The followers are critically damped and integrated
   * implicitly, so a 12 ms tongue tip is stable at a 2.7 ms step; the
   * reflections computed here are crossfaded from the last block's inside the
   * sample loop, so a shape change never steps.
   */
  shape(dt) {
    for (let a = 0; a < 6; a++) {
      const w = 1 / this.tau[a];
      const wd = w * dt;
      const target = this.now[T_VELUM + a];
      this.vel[a] = (this.vel[a] + (target - this.pos[a]) * w * wd) / (1 + 2 * wd + wd * wd);
      this.pos[a] += this.vel[a] * dt;
    }

    const n = this.n;
    const jaw = this.pos[1];
    const bodyPos = this.bodyFrom + (this.bodyTo - this.bodyFrom) * clamp01(this.pos[2]);
    const bodyDia = this.pos[3];
    const tip = this.pos[4];
    const lips = this.pos[5];
    // The jaw opens the mouth and leaves the pharynx alone, so it ramps in
    // over the back third and holds from there forward.
    const open = 0.55 + jaw * 0.85;

    for (let i = 0; i < n; i++) {
      const p = i / (n - 1);
      let d = this.rest[i] * (p < 0.33 ? 1 + (open - 1) * (p / 0.33) : open);

      // Three constrictions, each a raised cosine that pulls the tube toward
      // its own diameter. A weight of one is that diameter exactly, so a
      // closure really closes.
      const ub = (p - bodyPos) / this.bodySpread;
      if (ub > -1 && ub < 1) d += (bodyDia - d) * 0.5 * (1 + Math.cos(Math.PI * ub));
      // The tip and the lips can only *narrow*. A tip held out of the way is
      // not a wide spot in the tube, and lips cannot open wider than the mouth
      // behind them — blending toward those values both ways was flattening
      // the tongue hump of a front vowel and bulging the front of an open one.
      const ut = (p - this.tipAt) / this.tipSpread;
      if (tip < d && ut > -1 && ut < 1) d += (tip - d) * 0.5 * (1 + Math.cos(Math.PI * ut));
      // The lips take over completely by the last section, so shutting them
      // really shuts the tube rather than leaving a gap that leaks.
      if (lips < d && i > n - 1 - this.lipSections) {
        d += (lips - d) * (i - (n - 1 - this.lipSections)) / this.lipSections;
      }

      this.diameter[i] = d < 0 ? 0 : d;
      this.area[i] = this.diameter[i] * this.diameter[i];
    }

    // Reflections. A zero-area section would divide by zero, so an empty
    // junction is clamped just short of a perfect mirror.
    this.kWas.set(this.k);
    for (let i = 1; i < n; i++) {
      const sum = this.area[i - 1] + this.area[i];
      this.k[i] = sum <= 0 ? 0.999 : (this.area[i - 1] - this.area[i]) / sum;
    }

    // Nose. Section 0 is the velum: the track opens it, and it is sealed at 0.
    this.noseShape[0] = this.pos[0];
    for (let i = 0; i < this.nn; i++) this.noseArea[i] = this.noseShape[i] * this.noseShape[i];
    for (let i = 1; i < this.nn; i++) {
      const sum = this.noseArea[i - 1] + this.noseArea[i];
      this.nk[i] = sum <= 0 ? 0.999 : (this.noseArea[i - 1] - this.noseArea[i]) / sum;
    }

    // The three-port junction where the nose leaves the mouth.
    //
    // Each port is floored before the ratios are taken. A velar closure sits
    // almost on top of this junction — the tongue-body window is wide enough
    // to reach it — so a `k` takes both oral areas to nothing, and
    // `(2A − sum)/sum` with `sum` collapsing sends the coefficients to ±1,
    // where the nose branch picks up a gain of two on everything arriving.
    const s = this.noseAt;
    const back = Math.max(1e-4, this.area[s - 1]);
    const front = Math.max(1e-4, this.area[s]);
    const nose = Math.max(1e-4, this.noseArea[0]);
    const sum = back + front + nose;
    this.kLeftWas = this.kLeft;
    this.kRightWas = this.kRight;
    this.kNoseWas = this.kNose;
    this.kLeft = (2 * back - sum) / sum;
    this.kRight = (2 * front - sum) / sum;
    this.kNose = (2 * nose - sum) / sum;

    // Where it hisses: the narrowest place in front of the glottis, so long as
    // it is narrow and not shut. A stop's burst is this passing through on the
    // way open.
    let at = n - 2;
    let min = 1e9;
    for (let i = this.turbFrom; i < n; i++) {
      if (this.diameter[i] < min) { min = this.diameter[i]; at = i; }
    }
    this.turbAt = at;
    // Narrow enough to whistle, open enough for air to get through it. The
    // second term used to snap on over the last twelfth of the band, which put
    // the loudest noise in the model at the exact diameter a stop passes
    // through on its way open — every k, t and n cracked, and none of the
    // vowels between them did.
    // Nothing builds up behind a constriction while the nose is open — the
    // air has somewhere else to go — so an `m` neither hisses nor pops as it
    // lets go, where a `b` does both.
    const sealed = clamp01(1 - this.noseArea[0] * 3);
    const thin = clamp01((HISS_AT - min) / HISS_AT);
    const passing = clamp01(min / (HISS_AT * 0.5));
    this.turbLevel = thin * passing * this.turbulence * sealed;

    // A closure that has just come open lets go of what was behind it.
    if (this.minWas <= 0.03 && min > 0.03) {
      this.transAmp = 0.12 * sealed;
      this.transAt = at;
    }
    this.minWas = min;
  }

  // --- one pass of the waveguide -----------------------------------------

  step(glottal, turb, lambda) {
    const n = this.n;
    const R = this.R, L = this.L, jR = this.jR, jL = this.jL;

    // Turbulence is made *at* the constriction, into both directions, and
    // pre-emphasised: the source is already a flow derivative and this is not,
    // so without the tilt a fricative sits under the vowel it belongs to.
    if (turb !== 0) {
      const i = this.turbAt;
      R[i] += turb;
      L[i] += turb;
    }
    // The release pulse, gone in a few milliseconds.
    if (this.transAmp > 1e-5) {
      const i = this.transAt;
      R[i] += this.transAmp;
      L[i] += this.transAmp;
      this.transAmp *= 0.9985;
    }

    // The ends. Each reflection runs through a one-pole, so the round trip
    // loses treble the way a soft-walled tube does, and the glottal end's
    // reflection is pulled down while the folds are open — F1 shifts and
    // widens in the open phase, which is one multiply and audible.
    this.glottalLp += (L[0] - this.glottalLp) * this.damp;
    jR[0] = this.glottalLp * this.glottalK + glottal;
    this.lipLp += (R[n - 1] - this.lipLp) * this.damp;
    jL[n] = this.lipLp * this.lipK;

    for (let i = 1; i < n; i++) {
      const r = this.kWas[i] + (this.k[i] - this.kWas[i]) * lambda;
      const w = r * (R[i - 1] + L[i]);
      jR[i] = R[i - 1] - w;
      jL[i] = L[i] + w;
    }

    // The nose junction overwrites the two-port answer at its section.
    const s = this.noseAt;
    const nl = this.nL[0];
    let r = this.kLeftWas + (this.kLeft - this.kLeftWas) * lambda;
    jL[s] = r * R[s - 1] + (1 + r) * (nl + L[s]);
    r = this.kRightWas + (this.kRight - this.kRightWas) * lambda;
    jR[s] = r * L[s] + (1 + r) * (R[s - 1] + nl);
    r = this.kNoseWas + (this.kNose - this.kNoseWas) * lambda;
    this.njR[0] = r * nl + (1 + r) * (L[s] + R[s - 1]);

    const loss = this.loss;
    for (let i = 0; i < n; i++) {
      R[i] = jR[i] * loss;
      L[i] = jL[i + 1] * loss;
    }
    const lip = R[n - 1];

    // The nose, same waveguide, one open end.
    const nn = this.nn;
    const nR = this.nR, nL = this.nL, njR = this.njR, njL = this.njL;
    this.noseLp += (nR[nn - 1] - this.noseLp) * this.damp;
    njL[nn] = this.noseLp * this.lipK;
    for (let i = 1; i < nn; i++) {
      const rn = this.nk[i];
      const w = rn * (nR[i - 1] + nL[i]);
      njR[i] = nR[i - 1] - w;
      njL[i] = nL[i] + w;
    }
    for (let i = 0; i < nn; i++) {
      nR[i] = njR[i] * loss;
      nL[i] = njL[i + 1] * loss;
    }

    return lip + nR[nn - 1];
  }

  // --- the schedule -------------------------------------------------------

  /** Where track `t` is at time `time`, walking its keys forward only. */
  read(t, time) {
    const count = this.count[t];
    if (count === 0) return this.now[t];
    const times = this.times[t];
    let i = this.cursor[t];
    while (i + 1 < count && time >= times[i + 1]) i++;
    this.cursor[t] = i;

    const values = this.values[t];
    if (time <= times[0]) {
      // Before the first key: glide in from where the gesture found us.
      const lead = times[0] - this.since;
      if (lead <= 0) return values[0];
      const a = clamp01((time - this.since) / lead);
      return this.was[t] + (values[0] - this.was[t]) * a;
    }
    if (i + 1 >= count) return values[i];

    const curve = this.curves[t][i + 1];
    if (curve === STEP) return values[i];
    const span = times[i + 1] - times[i];
    const a = span <= 0 ? 1 : clamp01((time - times[i]) / span);
    const from = values[i];
    const to = values[i + 1];
    if (curve === EXP && from > 1e-4 && to > 1e-4) return from * Math.pow(to / from, a);
    return from + (to - from) * a;
  }

  /** True while any track still has a key ahead of `time`. */
  pending(time) {
    for (let t = 0; t < NTRACKS; t++) {
      const count = this.count[t];
      if (count > 0 && this.times[t][count - 1] > time) return true;
    }
    return false;
  }

  // --- the loop -----------------------------------------------------------

  process(_inputs, outputs) {
    if (!this.alive) return false;
    const out = outputs[0][0];
    if (!out) return true;

    const t0 = currentTime;
    const dt = this.dt;
    const blockDt = QUANTUM * dt;
    const end = t0 + blockDt;

    // Nothing scheduled, nothing ringing: an idle throat is a function call.
    if (this.idle && this.inhaleAt > end && !this.pending(t0)) {
      out.fill(0);
      if (!this.toldIdle) {
        this.toldIdle = true;
        this.port.postMessage({ kind: 'idle' });
      }
      return true;
    }

    // A hush ramps the voice out and drops everything after it: with no keys
    // left, every track holds where the ramp found it.
    if (t0 >= this.hushAt) {
      if (this.hushGain === 1) this.count.fill(0);
      this.hushGain -= blockDt / this.hushOver;
      if (this.hushGain < 0) this.hushGain = 0;
    }

    for (let t = 0; t < NTRACKS; t++) this.now[t] = this.read(t, t0);
    this.shape(blockDt);

    // The reservoir. Long calls run out of air, and Rd rises and loudness
    // falls as they do — an inhale is the only thing that fills it quickly.
    const drain = (this.now[T_LOUD] * 0.3 + this.now[T_BREATH] * 0.55) / this.airCap;
    this.air += (0.12 - drain) * blockDt;
    if (this.air > 1) this.air = 1;
    if (this.air < 0) this.air = 0;
    const lack = clamp01((0.35 - this.air) / 0.35);

    // Drift: a smoothed random walk, a fresh target every half second or so.
    this.driftT -= blockDt;
    if (this.driftT <= 0) {
      this.driftT = 0.35 + Math.abs(this.noise()) * 1.2;
      this.driftTo = this.noise() * this.driftAmount;
    }
    this.drift += (this.driftTo - this.drift) * Math.min(1, blockDt * 3);

    let peak = 0;
    for (let i = 0; i < QUANTUM; i++) {
      const time = t0 + i * dt;
      const lambda = i / QUANTUM;

      const f0 = this.read(T_F0, time);
      const rd = this.read(T_RD, time) + lack * 0.9 + this.rdBias;
      const chaos = this.read(T_CHAOS, time);
      const modulate = this.read(T_MOD, time);
      let loud = this.read(T_LOUD, time) * (1 - 0.45 * lack) * this.hushGain;
      let breath = this.read(T_BREATH, time) * this.hushGain;

      // An inhale: voicing off, a shaped rush of noise, and the lungs fill.
      if (time >= this.inhaleAt) {
        const through = (time - this.inhaleAt) / this.inhaleFor;
        if (through >= 1) {
          this.inhaleAt = Infinity;
        } else {
          loud = 0;
          breath = Math.max(breath, Math.sin(Math.PI * through) * this.inhaleDepth * 0.8);
          this.air = Math.min(1, this.air + (this.inhaleDepth * dt) / this.inhaleFor);
        }
      }

      if (Math.abs(rd - this.rdWas) > 0.02) {
        this.rdWas = rd;
        this.setWaveform(rd);
      }

      // f0: the line, plus drift, plus an old voice's tremor, plus whatever
      // roughness the `modulate` track is asking for.
      this.tremorPhase += this.tremorHz * dt;
      if (this.tremorPhase > 1) this.tremorPhase -= 1;
      this.modPhase += this.modulateHz * dt;
      if (this.modPhase > 1) this.modPhase -= 1;
      const wobble = Math.sin(TWO_PI * this.modPhase);
      const f0Now =
        f0 *
        (1 + this.drift + this.tremor * Math.sin(TWO_PI * this.tremorPhase)) *
        (1 + modulate * 0.12 * wobble);

      this.phase += f0Now * this.cycleRate * dt;
      while (this.phase >= 1) {
        this.phase -= 1;
        this.newCycle(chaos);
      }

      const amp = loud * this.cycleAmp * (1 - modulate * 0.4 * (0.5 - 0.5 * wobble));
      const voiced = this.lf(this.phase) * amp;

      // Klatt's pulsed aspiration: noise gated by the open phase reads as
      // breath, where the same noise held steady reads as a second sound.
      //
      // The floor rides on the voice and not under silence. Air only moves
      // through a glottis something is being pushed through — a floor that is
      // always there is a throat that hisses when nobody is talking.
      const flow = breath + this.breathFloor * clamp01(loud * 6);
      const white = this.noise();
      const bright = 0.14 + 0.3 * clamp01((rd - 0.3) / 2.4);
      this.aspLp += (white - this.aspLp) * bright;
      const opening = Math.max(0, Math.sin(TWO_PI * this.phase));
      const asp = this.aspLp * flow * (0.3 + 0.7 * opening) * this.aspGain;

      // Source–tract coupling.
      this.glottalK = this.glottalBase * (1 - 0.12 * opening * clamp01(loud * 3));

      // Denormals: the lines decay geometrically toward zero and stall there
      // without something to keep them awake.
      this.dcFlip = -this.dcFlip;
      const glottal = voiced + asp + this.dcFlip * 1e-15;

      // Nothing blows through the constriction either, for the same reason.
      //
      // Band-limited first, then differentiated. The tilt is right — noise
      // enters the tube as a flow and has to come out as a pressure — but
      // white noise tilted 6 dB an octave rises all the way to Nyquist, and
      // air through a gap does not. Lowpassing before the difference puts the
      // hump near 3 kHz, where a burst and a hush sit; the tube in front of
      // the gap shapes it from there.
      const drive = clamp01(loud * 0.9 + flow * 1.3);
      this.turbLp += (white - this.turbLp) * 0.3;
      const shaped = this.turbLp - this.lastNoise;
      this.lastNoise = this.turbLp;
      this.turbSmooth += (this.turbLevel - this.turbSmooth) * 0.02;
      const turb = shaped * this.turbSmooth * drive;

      // The tract runs faster than the context — the section count in the
      // preset was chosen against this same number — and the passes average.
      let sample = 0;
      for (let p = 0; p < this.over; p++) {
        sample += this.step(glottal, turb, lambda + p / (this.over * QUANTUM));
      }
      sample *= 0.25 / this.over;

      // Radiation is only a DC block — the LF source is already differentiated
      // — and a little off the top for the head in the way.
      this.dcY = 0.995 * (this.dcY + sample - this.dcX);
      this.dcX = sample;
      this.headLp += (this.dcY - this.headLp) * this.headCoef;
      // **Nothing shapes the peaks.** A tanh here is a waveshaper, and a
      // glottal pulse train through one comes out with broadband hash on
      // every cycle — heard as sibilance, and as compression, because that is
      // what it is. The model runs well under unity instead and the level
      // lives on the emitter; the clamp below is a seatbelt and should never
      // be reached.
      let value = this.headLp * this.gain;
      if (value > 1) value = 1;
      else if (value < -1) value = -1;
      out[i] = value;
      const mag = value < 0 ? -value : value;
      if (mag > peak) peak = mag;
    }

    // Ring-down. Once nothing is scheduled and nothing is left in the tube,
    // the next block takes the silent path.
    this.env += (peak - this.env) * 0.25;
    if (!this.pending(end) && this.now[T_LOUD] < 0.001 && this.env < 2e-4) {
      this.quiet += blockDt;
      if (this.quiet > 0.15) this.idle = true;
    } else {
      this.quiet = 0;
    }
    return true;
  }
}

registerProcessor('voice-processor', VoiceProcessor);
