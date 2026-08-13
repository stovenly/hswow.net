/**
 * Headless checks on the parts of the audio engine that are pure maths.
 *
 * `npm run check:audio`
 *
 * Most of this engine can only be judged by ear, but not all of it. The gust
 * field, the noise generators and the reverb decay are ordinary arithmetic,
 * and each has a failure mode that is easy to hit and hard to diagnose from a
 * listening chair — a gust signal stuck near its mean sounds like "the wind
 * model is too quiet", and pink noise with the wrong slope sounds like "the
 * filters are wrong".
 */
import { Weather } from '../src/audio/weather';
import { measure, periodicity } from '../src/audio/audition/measure';
import { bubbleHz, bubbleRadius } from '../src/audio/dsp/bubble';
import { derivedQ, trimFor } from '../src/audio/dsp/modal';
import {
  SURFACES,
  BANK,
  RINGS,
  HOLLOW,
  gaitFor,
  panFor,
  lateralWeight,
} from '../src/audio/models/footsteps';
import {
  MODES,
  NEIGHBOURS,
  DRONE,
  JUST,
  hz,
  justHz,
  inMode,
  lock,
  degreeToSemitone,
  semitoneToDegree,
  type ModeName,
} from '../src/audio/music/theory';
import {
  melodyCell,
  textureCell,
  texturePool,
  motifHead,
  periodFrom,
  applyOp,
  openDegrees,
  CONNECT,
  type MotifOp,
} from '../src/audio/music/patterns';
import { GROUNDS, groundFor, cadenceApproach } from '../src/audio/music/harmony';
import {
  BAR_BEATS,
  RHYTHM_CELLS,
  rhythmCell,
  subdivide,
  mutateOstinato,
} from '../src/audio/music/rhythm';
import { ritardCurve, phraseArch, SECTION_END_V, FINAL_V } from '../src/audio/music/tempo';
import { VIBES } from '../src/audio/music/vibes';
import { createRng } from '../src/art/random';

let failures = 0;

function check(label: string, ok: boolean, detail: string): void {
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label.padEnd(38)} ${detail}`);
}

// --- the gust field -------------------------------------------------------
const weather = new Weather();
const dt = 1 / 60;

// Three hours of it. Autocorrelation at lag L is only trustworthy when the
// record is much longer than L — the usual rule of thumb is ten times — and the
// lags worth testing here run to fifteen minutes.
const MINUTES = 180;

// Typed array and explicit loops throughout: an hour at 60 Hz is 216,000
// samples, and spreading that into Math.min overflows the call stack.
const samples = new Float64Array(60 * 60 * MINUTES);
let biggestJump = 0;
let min = Infinity;
let max = -Infinity;
let total = 0;

for (let i = 0; i < samples.length; i++) {
  weather.update(dt);
  const value = weather.strength;
  samples[i] = value;
  if (i > 0) biggestJump = Math.max(biggestJump, Math.abs(value - samples[i - 1]));
  if (value < min) min = value;
  if (value > max) max = value;
  total += value;
}

const mean = total / samples.length;
let squared = 0;
let strong = 0;
for (let i = 0; i < samples.length; i++) {
  squared += (samples[i] - mean) ** 2;
  if (samples[i] > 0.75) strong++;
}
const variance = squared / samples.length;

check(
  'gust stays inside 0..1',
  min >= 0 && max <= 1,
  `${min.toFixed(3)} .. ${max.toFixed(3)} over ${MINUTES} minutes`,
);
check(
  'gust actually swings',
  Math.sqrt(variance) > 0.05 && max - min > 0.3,
  `sd ${Math.sqrt(variance).toFixed(3)}, range ${(max - min).toFixed(3)}`,
);
// The wind whistle scales as strength cubed, so it only appears above roughly
// 0.75. If the gust field never gets there, that whole layer is dead code and
// the wind is a hiss that gets slightly louder.
const strongFraction = strong / samples.length;
check(
  'gust reaches whistling strength',
  strongFraction > 0.02,
  `${(strongFraction * 100).toFixed(1)}% of the time above 0.75, peak ${max.toFixed(2)}`,
);
check(
  'gust is continuous',
  // A value-noise field sampled at 60 Hz should crawl. Anything above a
  // percent per frame is a discontinuity, and discontinuities are clicks.
  biggestJump < 0.01,
  `largest single-frame change ${biggestJump.toFixed(5)}`,
);

// Periodicity.
//
// The naive test — "correlation at long lags must be small" — is wrong here,
// and failed a correct implementation the moment the slow swell was added.
// The swell is *supposed* to keep the signal self-similar for minutes; that is
// what ebb and flow means.
//
// What separates weather from an LFO is not how long correlation lasts but
// whether it ever comes *back*. A periodic signal decorrelates and then
// re-correlates at its period, again and again. Layered value noise decays and
// stays decayed. So: find where correlation has died away, then check it never
// revives past that.
//
// Decimated to 2 Hz first. Nothing in this field moves faster than a fraction
// of a hertz, and the full-rate autocorrelation over these lags is billions of
// operations for no extra information.
const DECIMATE = 30;
const coarse = new Float64Array(Math.floor(samples.length / DECIMATE));
for (let i = 0; i < coarse.length; i++) coarse[i] = samples[i * DECIMATE];

function autocorrelation(lagSeconds: number): number {
  const lag = Math.round((lagSeconds * 60) / DECIMATE);
  if (lag >= coarse.length) return 0;
  let sum = 0;
  for (let i = 0; i + lag < coarse.length; i++) {
    sum += (coarse[i] - mean) * (coarse[i + lag] - mean);
  }
  return sum / ((coarse.length - lag) * variance);
}

const curve: { lag: number; r: number }[] = [];
for (let lag = 30; lag <= 900; lag += 30) curve.push({ lag, r: Math.abs(autocorrelation(lag)) });

// Once it has fallen this far it counts as decorrelated; anything above the
// revival threshold after that point is a period.
const settled = curve.findIndex((point) => point.r < 0.2);
const revival =
  settled === -1
    ? { lag: 0, r: 1 }
    : curve.slice(settled).reduce((a, b) => (b.r > a.r ? b : a), { lag: 0, r: 0 });

check(
  'gust never becomes periodic',
  settled !== -1 && revival.r < 0.35,
  settled === -1
    ? `never decorrelates within 900s (r=${curve[curve.length - 1].r.toFixed(2)})`
    : `settles by ${curve[settled].lag}s, worst revival after ${revival.r.toFixed(3)}`,
);

// --- noise colour ---------------------------------------------------------
// The generators live inside createNoiseBuffers, which needs an AudioContext.
// The maths does not, so it is reproduced here and checked for spectral slope:
// white is flat, pink falls 3 dB per octave, brown 6.
function pinkGenerator(): () => number {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  return () => {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    return pink * 0.11;
  };
}
function brownGenerator(): () => number {
  let last = 0;
  return () => {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    return last * 3.5;
  };
}

/** Energy in a band, by direct evaluation at a few frequencies. */
function bandEnergy(signal: Float64Array, rate: number, hz: number): number {
  let re = 0;
  let im = 0;
  const n = Math.min(signal.length, 16384);
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * hz * i) / rate;
    re += signal[i] * Math.cos(a);
    im += signal[i] * Math.sin(a);
  }
  return (re * re + im * im) / n;
}

function slopePerOctave(next: () => number): number {
  const rate = 48000;
  const signal = new Float64Array(16384);
  for (let i = 0; i < signal.length; i++) signal[i] = next();

  // A single bin of a random signal is itself random, so this would be a coin
  // flip without a good many probes averaged across each band.
  const probes = 96;
  const measure = (centre: number): number => {
    let sum = 0;
    for (let k = 0; k < probes; k++) sum += bandEnergy(signal, rate, centre * (0.7 + k * 0.0063));
    return sum / probes;
  };
  const low = measure(250);
  const high = measure(4000);
  // Four octaves between 250 Hz and 4 kHz.
  return (10 * Math.log10(high / low)) / 4;
}

const whiteSlope = slopePerOctave(() => Math.random() * 2 - 1);
const pinkSlope = slopePerOctave(pinkGenerator());
const brownSlope = slopePerOctave(brownGenerator());

check('white noise is flat', Math.abs(whiteSlope) < 1, `${whiteSlope.toFixed(2)} dB/octave`);
check('pink noise falls ~3 dB/octave', Math.abs(pinkSlope + 3) < 1, `${pinkSlope.toFixed(2)} dB/octave`);
check('brown noise falls ~6 dB/octave', Math.abs(brownSlope + 6) < 1.5, `${brownSlope.toFixed(2)} dB/octave`);

// --- reverb decay ---------------------------------------------------------
// The IR envelope must reach -60 dB exactly at rt60, or every room preset is
// a different length than it claims and the presets stop meaning anything.
for (const rt60 of [0.45, 0.7, 4.2]) {
  const rate = 48000;
  const decay = Math.exp(-Math.log(1000) / (rt60 * rate));
  const atRt60 = 20 * Math.log10(decay ** (rt60 * rate));
  check(
    `rt60 ${rt60}s decays to -60 dB`,
    Math.abs(atRt60 + 60) < 0.1,
    `${atRt60.toFixed(2)} dB at t=rt60`,
  );
}

// --- the audition measurements -------------------------------------------
//
// **A measuring instrument that has not been measured is a decoration.** These
// numbers are about to be the basis for "does this model sound bad", so each is
// checked against a signal whose answer is known in advance rather than against
// a model, where a wrong reading and a wrong model are indistinguishable.
const RATE = 48000;
const N = 16384;

function generate(fill: (i: number) => number): Float32Array {
  const signal = new Float32Array(N);
  for (let i = 0; i < N; i++) signal[i] = fill(i);
  return signal;
}

// A 1 kHz sine: peak 1, crest 3.01 dB, centroid at 1 kHz.
const sine = measure(generate((i) => Math.sin((2 * Math.PI * 1000 * i) / RATE)), RATE);
check('sine peak is 1', Math.abs(sine.peak - 1) < 0.01, sine.peak.toFixed(4));
check('sine crest is 3 dB', Math.abs(sine.crest - 3.01) < 0.2, `${sine.crest.toFixed(2)} dB`);
check(
  'sine centroid lands on its pitch',
  Math.abs(sine.centroid - 1000) < 150,
  `${sine.centroid.toFixed(0)} Hz`,
);

const noise = measure(generate(() => Math.random() * 2 - 1), RATE);
// Uniform noise sits at 4.77 dB — RMS is 1/root-3 — which is *lower* than most
// people expect and only a little above a sine. The first version of this
// asserted it would be well above, and the measurement was right and the
// assertion was wrong. Crest factor does not measure randomness; it measures
// **sparseness**, which is why the impulse train below is the real test.
check('dense noise has a low crest', Math.abs(noise.crest - 4.77) < 0.6, `${noise.crest.toFixed(2)} dB`);

// One click every 40 ms over silence: the shape of grains loud and sparse
// enough to be heard individually, which is the bubble-wrap failure.
const sparse = measure(generate((i) => (i % 1920 === 0 ? 1 : 0)), RATE);
check(
  'sparse events read as a high crest',
  sparse.crest > 25 && sparse.crest > noise.crest + 15,
  `${sparse.crest.toFixed(1)} dB against dense noise at ${noise.crest.toFixed(1)}`,
);
check(
  'noise spreads across every band',
  noise.bands.every((b) => b > 0.001),
  `weakest band ${(Math.min(...noise.bands) * 100).toFixed(1)}%`,
);

// A DC offset is invisible in peak and obvious here — it is the fault that
// silently eats headroom and thumps when a source starts.
const offset = measure(generate(() => 0.5), RATE);
check('DC offset is caught', Math.abs(offset.dc - 0.5) < 0.01, offset.dc.toFixed(3));

// Loudness has to *order* correctly; its absolute value means nothing.
const quiet = measure(generate((i) => 0.1 * Math.sin((2 * Math.PI * 1000 * i) / RATE)), RATE);
check(
  'loudness orders two levels of one tone',
  sine.loudness > quiet.loudness + 15,
  `${sine.loudness.toFixed(1)} vs ${quiet.loudness.toFixed(1)} dB`,
);

// Periodicity has to catch an LFO and clear noise, or it is worthless as the
// thing that separates weather from a wobble.
const lags = Array.from({ length: 40 }, (_, i) => (i + 1) * 24);
const sineRevival = periodicity(generate((i) => Math.sin((2 * Math.PI * 300 * i) / RATE)), lags);
const noiseRevival = periodicity(generate(() => Math.random() * 2 - 1), lags);
check('periodicity catches a sine', sineRevival > 0.35, `revival ${sineRevival.toFixed(3)}`);
check('periodicity clears noise', noiseRevival < 0.35, `revival ${noiseRevival.toFixed(3)}`);

// --- bubbles ---------------------------------------------------------------
//
// Minnaert's relation and the radius distribution over it are the whole of the
// water models, and both are pure arithmetic that is easy to get subtly wrong
// and impossible to diagnose by ear — a distribution skewed to the bottom
// octave sounds like water that is merely *duller*, not like a bug.

// A one-millimetre bubble sings at 3.26 kHz. If this drifts, every radius in
// every water preset means a different pitch than the comment beside it claims.
for (const [mm, hz] of [
  [1, 3260],
  [3, 1087],
  [6, 543],
] as const) {
  const got = bubbleHz(mm / 1000);
  check(`${mm} mm bubble sings at ${hz} Hz`, Math.abs(got - hz) < 2, `${got.toFixed(0)} Hz`);
}

// **Log-uniform, not uniform.** Radius maps to pitch as 1/r, so a uniform draw
// piles most bubbles into the bottom octave of the pitch range. The test: the
// median draw must land at the *geometric* mean of the bounds, not the
// arithmetic one — for 0.4–4 mm those are 1.26 mm and 2.2 mm, far enough apart
// that a wrong distribution cannot pass.
{
  const low = 0.0004;
  const high = 0.004;
  const draws = Array.from({ length: 20000 }, () => bubbleRadius(low, high)).sort((a, b) => a - b);
  const median = draws[draws.length >> 1];
  const geometric = Math.sqrt(low * high);
  check(
    'bubble radii are spread evenly across pitch',
    Math.abs(median - geometric) / geometric < 0.05,
    `median ${(median * 1000).toFixed(2)} mm vs geometric mean ${(geometric * 1000).toFixed(2)} mm`,
  );
  check(
    'bubble radii stay inside their bounds',
    draws[0] >= low - 1e-9 && draws[draws.length - 1] <= high + 1e-9,
    `${(draws[0] * 1000).toFixed(2)}–${(draws[draws.length - 1] * 1000).toFixed(2)} mm`,
  );
}

// --- the footstep modal bank ----------------------------------------------
//
// FOOTSTEPS.md M2. The bank moved from `ring: 'filter'` / `compensation:
// 'inverse'` to `'excitation'` / `'energy'`, which corrects the timbre and
// would have changed every level in the table by 26 to 47 dB if the levels had
// not moved with it. They were put through `level × (1/√Q_old) / √Q_new`, which
// is loudness-neutral by construction — so the claim "this changed how the
// surfaces sound and not how loud they are" is arithmetic, and checkable.
//
// The pre-correction levels are recorded here because that is the only place
// left that knows them. A single mistyped constant in `SURFACES` is otherwise
// a surface that is quietly wrong and nothing says so.
// M2's loudness-neutral transform is deliberately no longer asserted: M3
// retuned every surface by ear, which is exactly what that transform existed
// to make safe to do. What survives it are the two structural rules, and both
// encode a fault that was actually shipped rather than one that was imagined.

// **A loose or soft material does not ring.** Earth had a mode at 120 Hz
// ringing for 50 ms, mud one at 240, snow one at 2100 — none of the three is a
// body free to vibrate, and all three read as a boarded floor. This is the
// single assertion that keeps the whole table from sounding like planks.
{
  const wrong = Object.entries(SURFACES)
    .filter(([name, surface]) => surface.modes.length > 0 && !RINGS.includes(name))
    .map(([name]) => name);
  check(
    'only solid bodies have modes',
    wrong.length === 0,
    wrong.length === 0
      ? `${RINGS.length} of ${Object.keys(SURFACES).length} surfaces ring`
      : `should not ring: ${wrong.join(', ')}`,
  );
  // And the converse, so `RINGS` cannot rot into a list of names nothing checks.
  const silent = RINGS.filter(
    (name) => (SURFACES[name as keyof typeof SURFACES]?.modes.length ?? 0) === 0,
  );
  check('every ringing surface actually has modes', silent.length === 0, silent.join(', ') || 'all present');
}

// **Hollowness is a licence, not an accident.** A mode low enough and long
// enough to be a boxy resonance belongs to exactly two things a player walks
// on: a board over a void, and an empty steel container. Anywhere else it is
// the plank fault coming back under a different surface's name.
{
  const HOLLOW_HZ = 500;
  const HOLLOW_DECAY = 0.15;
  const wrong = Object.entries(SURFACES)
    .filter(
      ([name, surface]) =>
        !HOLLOW.includes(name) &&
        surface.modes.some((mode) => mode.hz < HOLLOW_HZ && mode.decay > HOLLOW_DECAY),
    )
    .map(([name]) => name);
  check(
    'only wood and hollow metal are boxy',
    wrong.length === 0,
    wrong.length === 0
      ? `nothing else rings below ${HOLLOW_HZ} Hz for over ${HOLLOW_DECAY} s`
      : `boxy: ${wrong.join(', ')}`,
  );
}

// Every surface that leans on the bank must sit under the threshold `modal.ts`
// names — above `π·f·decay ≈ 40` a bandpass has no timbre left, which is
// precisely the fault M2 existed to fix.
{
  let worstQ = 0;
  let worst = '';
  for (const [name, surface] of Object.entries(SURFACES)) {
    for (const mode of surface.modes) {
      const q = derivedQ(mode, BANK);
      if (q > worstQ) {
        worstQ = q;
        worst = `${name} ${mode.hz} Hz`;
      }
    }
  }
  check('no mode is sharper than a bandpass can carry', worstQ <= 14, `${worst} at Q ${worstQ.toFixed(1)}`);
}

// **A band with no width is a filter somebody typed backwards**, and it is
// silent rather than wrong-sounding, which is the worst way for it to fail.
{
  const wrong = Object.entries(SURFACES)
    .filter(([, surface]) => (surface.impact.low ?? 0) >= surface.impact.tone * 0.8)
    .map(([name]) => name);
  check('every impact band has room in it', wrong.length === 0, wrong.join(', ') || `${Object.keys(SURFACES).length} bands, all open`);
}

// --- the gait blend --------------------------------------------------------
//
// FOOTSTEPS.md §3: **if the gait were chosen by branching on direction, this
// would ship worse than having no gaits at all.** Strafing while walking
// forward is most real movement and `wasd` gives eight directions, so a player
// drifting across a boundary would hear their footsteps flip character
// mid-corridor — far more noticeable than the missing detail it was added to
// fix. The blend is the whole design, and its continuity is arithmetic rather
// than something to be judged from a listening chair.
{
  const KEYS = ['at', 'level', 'stretch', 'modes', 'grit', 'tone'] as const;
  // Both feet independently: which one is leading flips as `right` crosses
  // zero, and the claim is that it is inaudible there because the lateral
  // weight is zero at exactly that point. If it were not, this is where it
  // would show.
  for (const foot of [-1, 1] as const) {
    let worst = 0;
    let where = '';
    let previous = gaitFor(0, 1, foot, 0.5);
    for (let degrees = 1; degrees <= 360; degrees++) {
      const angle = (degrees * Math.PI) / 180;
      const current = gaitFor(Math.sin(angle), Math.cos(angle), foot, 0.5);
      for (let c = 0; c < 2; c++) {
        for (const key of KEYS) {
          const jump = Math.abs(current[c][key] - previous[c][key]);
          if (jump > worst) {
            worst = jump;
            where = `${key} at ${degrees}°`;
          }
        }
      }
      previous = current;
    }
    // A degree of turn moves any parameter by well under a hundredth. Anything
    // above that is a branch that got in.
    check(
      `the gait blend is continuous (${foot === 1 ? 'right' : 'left'} foot)`,
      worst < 0.05,
      `largest step ${worst.toFixed(4)} per degree, at ${where}`,
    );
  }

  // And that it is actually doing something — a blend that returns the same
  // gait everywhere would pass the continuity test perfectly.
  const ahead = gaitFor(0, 1, 1, 0.5);
  const side = gaitFor(1, 0, 1, 0.5);
  const back = gaitFor(0, -1, 1, 0.5);
  check(
    'a sidestep is not a heel-to-toe roll',
    // The second contact lands at 0.4 of the gap rather than 1.0, because
    // rolling across the width of a foot is a third of rolling along it.
    side[1].at < ahead[1].at * 0.55,
    `second contact at ${side[1].at.toFixed(2)} against a walk's ${ahead[1].at.toFixed(2)}`,
  );
  check(
    'walking backwards sets the foot down rather than pushing off',
    // **Not "quieter".** Forward gait peaks halfway through the cycle and
    // backward peaks at 15% of it, so the load is on the *first* contact and
    // what follows is body weight being lowered onto a flat foot — which is
    // substantial. What makes it a lowering rather than a push is that it
    // arrives later, lasts far longer, is much duller, and scuffs almost
    // nothing, because nothing is driving off the ground.
    back[1].at > ahead[1].at &&
      back[1].stretch > ahead[1].stretch * 1.4 &&
      back[1].tone < ahead[1].tone * 0.75 &&
      back[1].grit < ahead[1].grit * 0.5 &&
      back[0].stretch < ahead[0].stretch,
    `at ${back[1].at.toFixed(2)}, stretch ${back[1].stretch.toFixed(2)}, tone ${back[1].tone.toFixed(2)}, grit ${back[1].grit.toFixed(2)}`,
  );
  check(
    'the two feet of a sidestep do different things',
    gaitFor(1, 0, 1, 0.5)[0].level !== gaitFor(1, 0, -1, 0.5)[0].level,
    `lead ${gaitFor(1, 0, 1, 0.5)[0].level.toFixed(2)}, trail ${gaitFor(1, 0, -1, 0.5)[0].level.toFixed(2)}`,
  );
  check(
    'the lead foot lands wider than the trail foot',
    panFor(1, 0, 1) > panFor(1, 0, -1) && Math.abs(panFor(0, 1, 1) - 0.2) < 1e-9,
    `lead ${panFor(1, 0, 1).toFixed(2)}, trail ${panFor(1, 0, -1).toFixed(2)}, walk ${panFor(0, 1, 1).toFixed(2)}`,
  );
}

// **Nothing soft is struck.** The rise time was fixed at 1.2 ms for every
// material, so mud's 45 ms contact was a click with a long tail glued on and
// every surface read as the same tap with effects on top. A material a foot
// sinks into cannot have a transient, because nothing stops suddenly.
{
  // **Depth is the predicate, not softness.** A foot is decelerated gradually
  // only when there is a depth of something for it to go through — and a
  // surface says so by declaring either a `crush` (it packs) or a `cavity` (it
  // is deep enough to drag air under). Anything with neither has something hard
  // within a few millimetres and is genuinely struck, which is why a *film* of
  // water over stone arrives in two milliseconds and is right to.
  const deep = Object.entries(SURFACES).filter(
    ([, surface]) => surface.crush || surface.splash?.cavity,
  );
  const rushed = deep.filter(([, surface]) => (surface.impact.attack ?? 0) < 0.01).map(([n]) => n);
  const slowest = Math.max(...deep.map(([, s]) => s.impact.attack ?? 0));
  check(
    'anything with depth arrives slowly',
    rushed.length === 0,
    rushed.length === 0
      ? `${deep.length} surfaces have depth, slowest ${(slowest * 1000).toFixed(0)} ms`
      : `struck anyway: ${rushed.join(', ')}`,
  );
}

// **Mud is the last liquid, and it is a bed and a cloud.**
//
// The two waters were fitted against a recording and then pulled: they matched
// it on bands, flatness, event density, crest and length, and still did not
// sound like water. What is worth keeping from that is the structure — a dense
// bed of small wet impacts under a sparse cloud of bubbles — because a bed
// alone is a rustle and a cloud alone is a warble, and neither is a liquid.
{
  const bed = SURFACES.mud.grit;
  const density = bed ? bed.count / bed.over : 0;
  check(
    'mud is a bed and a cloud',
    !!bed && !!SURFACES.mud.splash && density > 100 && (bed.grain ?? 0.012) >= 0.012,
    bed ? `${density.toFixed(0)} impacts/s ringing ${((bed.grain ?? 0.012) * 1000).toFixed(0)} ms` : 'no bed',
  );
}

// **Soft materials must not have hard grains.**
//
// Cook's particle model assumes the pieces are hard, because his were — beans,
// coins, gravel — so a collision opens in under a millisecond and the click is
// the point. A snow crystal shearing or a leaf folding does not, and a burst of
// instant clicks reads as *ball bearings* whatever the pitch and count are.
//
// The exemption is derived rather than listed: a surface with `splash` is a
// liquid, and a droplet striking water really is a click.
{
  const soft = Object.entries(SURFACES).filter(
    ([, surface]) => surface.crush && surface.grit && !surface.splash,
  );
  const clicky = soft
    .filter(([, surface]) => (surface.grit?.attack ?? 0.0008) < 0.0015)
    .map(([name]) => name);
  check(
    'nothing that gives has grains that click',
    clicky.length === 0,
    clicky.join(', ') || `${soft.length} granular surfaces, none of them hard`,
  );
}

// **A dense bed of pitched grains is a bag of marbles, not a material.**
//
// Grains sharing one resonance fuse into a texture; grains at clearly different
// pitches segregate into separate small objects. Sparse and spread is a handful
// of distinguishable stones, which is what rubble should be. Dense and spread is
// a shimmer of blips — marbles, or rain — and gravel, leaves and snow each
// acquired exactly that from a `spread` set for the wrong reason.
//
// Water is the deliberate exception, and it is the one surface where the ear
// *should* be able to count what it hears.
{
  const DENSE = 200;
  const wrong = Object.entries(SURFACES)
    // Liquids are exempt, and derived rather than listed: a bubble cloud is
    // meant to be countable, and none of them uses a particle bed anyway.
    .filter(([, surface]) => !surface.splash)
    .filter(([, surface]) => {
      const grit = surface.grit;
      if (!grit) return false;
      return grit.count / Math.max(grit.over, 1e-3) > DENSE && (grit.spread ?? 0) > 0.2;
    })
    .map(([name]) => name);
  check(
    'dense grains share a resonance',
    wrong.length === 0,
    wrong.join(', ') || `nothing above ${DENSE}/s is spread`,
  );
}

// **The impact is the contact, not the sound.** On a loose or soft surface the
// engine carrying the material has to be the thing you hear; where the contact
// competes with it, the surface reads as "the standard footstep with an effect
// on it", which is exactly the complaint this whole pass answers.
{
  // Exempt for the same reason the strike rule exempts them: this is about
  // there being a *depth* of material to be the sound. A puddle has none — two
  // centimetres of water over stone, where the contact genuinely is the event
  // and the droplets are the garnish — so it is allowed to lead with it.
  const layered = Object.entries(SURFACES).filter(
    ([name, surface]) => !RINGS.includes(name) && (surface.crush || surface.splash?.cavity),
  );
  const wrong = layered.filter(([, surface]) => surface.impact.level > 0.35).map(([n]) => n);
  check(
    'contacts stay under the material that has depth',
    wrong.length === 0,
    wrong.join(', ') || `${layered.length} layered surfaces, all quiet`,
  );
}

// And the metals specifically: a plate that taps louder than it rings is not
// metal, it is a footstep. Compared as delivered — a mode's level is scaled by
// the bank's `sqrt(Q)` trim before it reaches the output.
for (const name of ['metal-solid', 'metal-ring', 'metal-hollow-small', 'metal-hollow-big'] as const) {
  const surface = SURFACES[name];
  const loudest = Math.max(
    ...surface.modes.map((mode) => mode.level * trimFor(derivedQ(mode, BANK), BANK.compensation)),
  );
  check(
    `${name} rings louder than it taps`,
    loudest > surface.impact.level * 1.5,
    `ring ${loudest.toFixed(2)} against contact ${surface.impact.level.toFixed(2)}`,
  );
}

// **A forward diagonal is not half a strafe and a backward one very nearly is.**
// Moving forward-and-right you are still walking, with your feet turned a few
// degrees and still rolling; behind you there is no turning a foot into the
// direction of travel, so it is genuinely placed.
{
  const d = Math.SQRT1_2;
  const ahead = lateralWeight(d, d);
  const behind = lateralWeight(d, -d);
  check(
    'a forward diagonal keeps more of its roll than a backward one',
    // Discounted going forward, undiscounted going back, and still clearly a
    // diagonal rather than a walk with a lean.
    ahead < behind * 0.85 && ahead > 0.35,
    `forward ${ahead.toFixed(2)} lateral against backward ${behind.toFixed(2)}`,
  );
  check(
    'a true strafe is not discounted',
    Math.abs(lateralWeight(1, 0) - 1) < 1e-9 && Math.abs(lateralWeight(0, 1)) < 1e-9,
    'sideways 1.00, straight ahead 0.00',
  );
}

// **Shear has to do something on the materials it is claimed for.** The point
// of `scuff` is that creeping over gravel and sprinting over it are different
// events, so a loose surface that ignores speed is the feature not working.
{
  const LOOSE = ['gravel', 'cobble-loose', 'sand'];
  const deaf = LOOSE.filter((name) => SURFACES[name as keyof typeof SURFACES].scuff < 0.7);
  check('loose surfaces answer to speed', deaf.length === 0, deaf.join(', ') || `${LOOSE.length} checked`);
}

// --- the music grammar ------------------------------------------------------
//
// The grammar makes three promises the ear cannot audit note by note: every
// note in the declared mode, one leap then steps, and cells that connect in
// any order. Theory and patterns are pure arithmetic, so the promises are
// checked exhaustively — every mode, a couple of hundred seeds each, every
// permutation of every cell.

/** Heap's algorithm. Yields the same array reordered in place — scan, don't keep. */
function* permutations(cell: readonly number[]): Generator<readonly number[]> {
  const a = cell.slice();
  const c = new Array<number>(a.length).fill(0);
  yield a;
  let i = 0;
  while (i < a.length) {
    if (c[i] < i) {
      const j = i % 2 === 0 ? 0 : c[i];
      [a[j], a[i]] = [a[i], a[j]];
      c[i]++;
      i = 0;
      yield a;
    } else {
      c[i++] = 0;
    }
  }
}

{
  const modes = Object.entries(MODES);

  check(
    'mode tables are well formed',
    modes.every(
      ([, mode]) =>
        mode[0] === 0 && mode.every((s, i) => s >= 0 && s < 12 && (i === 0 || s > mode[i - 1])),
    ),
    `${modes.length} modes start at the root and ascend inside the octave`,
  );

  check(
    'note math holds',
    Math.abs(hz(220, 12) - 440) < 1e-9 &&
      Math.abs(hz(440, 0) - 440) < 1e-9 &&
      Math.abs(hz(440, 7) - 440 * 2 ** (7 / 12)) < 1e-9,
    'octave doubles, unison holds, a fifth is 2^(7/12)',
  );

  // The just table: pure where the drone demands it — unison, fourth, fifth,
  // octave — never more than a comma-and-change from equal temperament, and
  // octave-periodic across the whole range.
  {
    const cents = (ratio: number): number => 1200 * Math.log2(ratio);
    let close = true;
    for (let pc = 0; pc < 12; pc++) {
      if (Math.abs(cents(JUST[pc]) - pc * 100) > 20) close = false;
    }
    let periodic = true;
    for (let s = -25; s <= 25; s++) {
      if (Math.abs(justHz(220, s + 12) - 2 * justHz(220, s)) > 1e-9) periodic = false;
    }
    check(
      'just intonation stands on the drone',
      JUST.length === 12 &&
        Math.abs(justHz(220, 0) - 220) < 1e-9 &&
        Math.abs(justHz(220, 7) - 330) < 1e-9 &&
        Math.abs(justHz(220, 5) - 220 * (4 / 3)) < 1e-9 &&
        Math.abs(justHz(220, 12) - 440) < 1e-9 &&
        close &&
        periodic,
      'pure fifth and fourth, octaves double, all 12 within 20 cents of equal',
    );
  }

  // The neighbour table: every step a bridge may take is symmetric, keeps
  // the mode's size — degree space must carry over — and moves exactly one
  // accidental. Blues sits out by design.
  {
    const faults: string[] = [];
    for (const [from, tos] of Object.entries(NEIGHBOURS)) {
      const a = MODES[from as ModeName];
      for (const to of tos ?? []) {
        const b = MODES[to];
        if (!NEIGHBOURS[to]?.includes(from as ModeName)) faults.push(`${from}→${to} one-way`);
        if (a.length !== b.length) faults.push(`${from}→${to} resized`);
        const moved = a.filter((pc) => !b.includes(pc)).length;
        if (moved !== 1) faults.push(`${from}→${to} moved ${moved}`);
      }
    }
    if ('blues-hexatonic' in NEIGHBOURS) faults.push('blues stepped in');
    check(
      'mode neighbours move one accidental',
      faults.length === 0,
      faults.slice(0, 4).join(', ') || 'symmetric, same size, one accidental each way',
    );
  }

  // The lock: lands in the mode, never moves further than the nearest degree
  // can be, is idempotent, and passes in-mode notes through untouched.
  let snapped = 0;
  let lockOk = true;
  for (const [, mode] of modes) {
    for (let s = -24; s <= 24; s++) {
      const l = lock(s, mode);
      snapped++;
      if (!inMode(l, mode) || Math.abs(l - s) > 2) lockOk = false;
      if (lock(l, mode) !== l) lockOk = false;
      if (inMode(s, mode) && l !== s) lockOk = false;
    }
  }
  check('the scale lock locks', lockOk, `${snapped} notes snapped, none by more than a whole step`);

  let degreesOk = true;
  for (const [, mode] of modes) {
    for (let d = -15; d <= 15; d++) {
      const s = degreeToSemitone(mode, d);
      if (!inMode(s, mode) || semitoneToDegree(mode, s) !== d) degreesOk = false;
    }
  }
  check('degrees round-trip across octaves', degreesOk, '31 degrees in every mode, both ways');

  check(
    'the drone carries no third',
    DRONE.length === 2 && DRONE[0] === 0 && DRONE[1] === 7,
    'root and a perfect fifth, nothing else',
  );

  // The texture pool inherits the drone's ambiguity — a third under the
  // melody decides major or minor, which is exactly what the drone refuses.
  const decided = modes.filter(([, mode]) =>
    texturePool(mode).some((s) => s % 12 === 3 || s % 12 === 4),
  );
  const thin = modes.filter(([, mode]) => texturePool(mode).length < 3);
  check(
    'texture pools stay ambiguous and playable',
    decided.length === 0 && thin.length === 0,
    [...decided, ...thin].map(([name]) => name).join(', ') ||
      'no thirds, three notes or more, every mode',
  );

  // The ground library: the generalized form of the old centre promise. No
  // chord in any loop stands on the fifth or the leading tone — the two roots
  // that turn a rocking bass into a dominant cadence — every chord is in its
  // mode with its perfect fifth available, home loops start at home, away
  // loops start away, and the borrowed chord is genuinely borrowed.
  {
    const faults: string[] = [];
    for (const [name] of modes) {
      const mode = MODES[name as ModeName];
      const book = GROUNDS[name as ModeName];
      for (const side of ['home', 'away'] as const) {
        for (const loop of book[side]) {
          if (loop.length < 2 || loop.length > 5) faults.push(`${name} ${side} length`);
          if (side === 'home' && loop[0] !== 0) faults.push(`${name} home starts away`);
          if (side === 'away' && loop[0] === 0) faults.push(`${name} away starts home`);
          for (const pc of loop) {
            if (!inMode(pc, mode)) faults.push(`${name} ${side} ${pc} out of mode`);
            if (pc % 12 === 7 || pc % 12 === 11) faults.push(`${name} ${side} dominant`);
            if (!inMode(pc + 7, mode)) faults.push(`${name} ${side} ${pc} fifthless`);
          }
        }
      }
      if (inMode(book.borrow, mode)) faults.push(`${name} borrow not borrowed`);
      if (book.borrow % 12 === 7 || book.borrow % 12 === 11) faults.push(`${name} borrow dominant`);
      const approach = cadenceApproach(name as ModeName);
      if (!inMode(approach, mode) || approach === 0 || approach % 12 === 7 || approach % 12 === 11) {
        faults.push(`${name} approach`);
      }
    }
    check(
      'no ground chord stands on a dominant',
      faults.length === 0,
      faults.slice(0, 4).join(', ') || 'every loop in-mode, fifths intact, borrows outside',
    );

    let steadyGrounds = true;
    let variedGrounds = 0;
    const seen = new Set<string>();
    for (let seed = 1; seed <= 60; seed++) {
      const a = groundFor(seed, 'mixolydian', 'home');
      if (String(a) !== String(groundFor(seed, 'mixolydian', 'home'))) steadyGrounds = false;
      seen.add(String(a));
    }
    variedGrounds = seen.size;
    check(
      'a seed is a ground',
      steadyGrounds && variedGrounds > 1,
      `60 seeds re-rolled steady, ${variedGrounds} loops drawn`,
    );
  }

  const SEEDS = 200;
  let notes = 0;
  let cells = 0;
  let inModeOk = true;
  let shapeOk = true;
  let connectOk = true;
  let textureOk = true;
  for (const [, mode] of modes) {
    for (let seed = 1; seed <= SEEDS; seed++) {
      const cell = melodyCell(seed, mode);
      cells++;
      notes += cell.length;
      if (cell.length < 2 || cell.length > 6) shapeOk = false;
      for (const note of cell) if (!inMode(note, mode)) inModeOk = false;

      // One leap then steps, judged in degree space — a pentatonic scale step
      // is three semitones wide and still a step.
      const degrees = cell.map((s) => semitoneToDegree(mode, s));
      const leap = Math.abs(degrees[1] - degrees[0]);
      if (leap < 2 || leap > 3) shapeOk = false;
      for (let i = 2; i < degrees.length; i++) {
        if (Math.abs(degrees[i] - degrees[i - 1]) !== 1) shapeOk = false;
      }

      for (const order of permutations(cell)) {
        for (let i = 1; i < order.length; i++) {
          if (Math.abs(order[i] - order[i - 1]) > CONNECT) connectOk = false;
        }
      }

      const texture = textureCell(seed, mode);
      notes += texture.length;
      if (texture.length < 3 || texture.length > 5) textureOk = false;
      for (const note of texture) if (!inMode(note, mode)) inModeOk = false;
      for (let i = 1; i < texture.length; i++) {
        if (texture[i] === texture[i - 1]) textureOk = false;
      }
    }
  }
  check(
    'every generated note lands in its mode',
    inModeOk,
    `${notes} notes over ${modes.length} modes, ${SEEDS} seeds each`,
  );
  check('melody cells are one leap then steps', shapeOk, `${cells} cells, 2–6 notes, leap first`);
  check(
    'every permutation of every cell connects',
    connectOk,
    `no interval past ${CONNECT} semitones in any order`,
  );
  check('texture cells never stutter', textureOk, 'open intervals only, no repeated note');

  // Seeds are motifs — the Spore recipe only works if a re-rolled seed is the
  // same cell, and only matters if neighbouring seeds are not.
  const rolled = Array.from({ length: SEEDS }, (_, i) => melodyCell(i + 1, MODES.dorian));
  const identical = rolled.every(
    (cell, i) => String(melodyCell(i + 1, MODES.dorian)) === String(cell),
  );
  const distinct = new Set(rolled.map(String)).size;
  check('a seed is a motif', identical, `${SEEDS} seeds re-rolled into the same cells`);
  check(
    'neighbouring seeds are different music',
    distinct > SEEDS * 0.4,
    `${distinct} distinct cells from ${SEEDS} sequential seeds`,
  );

  // The period: both halves open with the same head, the antecedent hangs on
  // an open degree, and the consequent falls by step onto the root and lands
  // there — that asymmetry is the whole difference between an answer and a
  // transposition, and it has to hold for every developed head too.
  {
    const rng = createRng(6060);
    let periods = 0;
    let sharedHead = true;
    let openEnd = true;
    let landsRoot = true;
    let descends = true;
    for (const [, mode] of modes) {
      const open = openDegrees(mode);
      for (let seed = 1; seed <= SEEDS; seed++) {
        const base = motifHead(seed, mode);
        const ops: MotifOp[] = ['plain', 'sequence', 'inversion', 'fragment'];
        for (const op of ops) {
          const head = applyOp(base, op, rng);
          const period = periodFrom(head, mode);
          periods++;
          const startsWith = (half: readonly number[]): boolean =>
            head.every((degree, i) => half[i] === degree);
          if (!startsWith(period.antecedent) || !startsWith(period.consequent)) sharedHead = false;

          const question = period.antecedent[period.antecedent.length - 1];
          const index = ((question % mode.length) + mode.length) % mode.length;
          if (!open.includes(index)) openEnd = false;
          if (question === head[head.length - 1]) openEnd = false;

          const landing = period.consequent[period.consequent.length - 1];
          if (degreeToSemitone(mode, landing) % 12 !== 0) landsRoot = false;
          const tail = period.consequent.slice(head.length);
          for (let i = 1; i < tail.length; i++) {
            if (tail[i] - tail[i - 1] !== -1) descends = false;
          }
        }
      }
    }
    check('a period shares its head', sharedHead, `${periods} periods, four ops each`);
    check('a question hangs open', openEnd, 'antecedents end on the second or fifth, moved');
    check('an answer lands on the root', landsRoot && descends, 'stepwise descent, root pitch class');
  }

  // Rhythm cells: every figure sums to its bar — on both rungs of the ladder
  // — a seed owns one cell for good, and a vibe's gait genuinely narrows the
  // draw to the cells it names.
  {
    const cells = Object.values(RHYTHM_CELLS);
    const sums = [...cells, ...cells.map(subdivide)].every(
      (cell) => Math.abs(cell.reduce((total, step) => total + step.beats, 0) - BAR_BEATS) < 1e-9,
    );
    const accents = cells.every((cell) =>
      cell.every((step) => step.accent > 0 && step.accent <= 1),
    );
    const steady = Array.from({ length: 60 }, (_, i) => rhythmCell(i)).every(
      (cell, i) => cell === rhythmCell(i),
    );
    const owned = Array.from({ length: 60 }, (_, i) => rhythmCell(i, ['snap'])).every(
      (cell) => cell === RHYTHM_CELLS.snap,
    );
    check(
      'rhythm cells sum to their bar',
      sums && accents,
      `${cells.length} figures, subdivided too, accents in (0, 1]`,
    );
    check('a seed owns its cell', steady, '60 seeds re-rolled onto the same figures');
    check('a gait narrows the draw', owned, 'a one-cell gait always walks its cell');
  }

  // The ritard: monotone, bounded, committed — v(0) is full speed, v(1) is
  // the declared end, and nothing in between overshoots either.
  {
    let curveOk = true;
    for (const vEnd of [FINAL_V[0], FINAL_V[1], SECTION_END_V]) {
      let previous = Infinity;
      for (let i = 0; i <= 100; i++) {
        const v = ritardCurve(i / 100, vEnd);
        if (v > previous + 1e-12 || v > 1 + 1e-9 || v < vEnd - 1e-9) curveOk = false;
        previous = v;
      }
      if (Math.abs(ritardCurve(0, vEnd) - 1) > 1e-9) curveOk = false;
      if (Math.abs(ritardCurve(1, vEnd) - vEnd) > 1e-9) curveOk = false;
    }
    let archOk = true;
    for (let i = 0; i <= 100; i++) {
      const a = phraseArch(i / 100);
      if (a < 0.9 || a > 1.15) archOk = false;
    }
    if (!(phraseArch(0) > phraseArch(0.5) && phraseArch(1) > phraseArch(0.5))) archOk = false;
    check('the ritard is monotone and bounded', curveOk, 'v falls from 1 to v_end, never past');
    check('phrase ends linger', archOk, 'the arch lifts the edges and presses the middle');
  }

  // The minimalist's rule, held to the letter: a mutation is exactly one
  // edit — one note replaced, one added, one dropped, or one adjacent pair
  // swapped — and the result still never stutters or leaves the pool.
  {
    const rng = createRng(4242);
    let edits = 0;
    let oneEdit = true;
    let clean = true;
    for (const [, mode] of modes) {
      const pool = texturePool(mode);
      for (let seed = 1; seed <= 60; seed++) {
        let notes = textureCell(seed, mode);
        for (let round = 0; round < 4; round++) {
          const { notes: out, op } = mutateOstinato(rng, notes, pool);
          edits++;
          if (out.some((note, i) => i > 0 && note === out[i - 1])) clean = false;
          if (out.some((note) => !pool.includes(note))) clean = false;
          if (op === 'replace' || op === 'swap') {
            if (out.length !== notes.length) oneEdit = false;
            const moved = notes.map((note, i) => (out[i] !== note ? i : -1)).filter((i) => i >= 0);
            if (op === 'replace' && moved.length !== 1) oneEdit = false;
            if (
              op === 'swap' &&
              !(
                moved.length === 2 &&
                moved[1] === moved[0] + 1 &&
                out[moved[0]] === notes[moved[1]] &&
                out[moved[1]] === notes[moved[0]]
              )
            ) {
              oneEdit = false;
            }
          } else if (op === 'add') {
            const recovers = out.some(
              (_, i) => String([...out.slice(0, i), ...out.slice(i + 1)]) === String(notes),
            );
            if (out.length !== notes.length + 1 || !recovers) oneEdit = false;
          } else {
            const recovers = notes.some(
              (_, i) => String([...notes.slice(0, i), ...notes.slice(i + 1)]) === String(out),
            );
            if (out.length !== notes.length - 1 || !recovers) oneEdit = false;
          }
          notes = out;
        }
      }
    }
    check('a mutation changes exactly one element', oneEdit, `${edits} edits, all single`);
    check('a mutated ostinato still holds the line', clean, 'no stutter, nothing outside the pool');
  }
}

// --- the vibe book's pacing floors ----------------------------------------
// A drone with nothing moving over it is the one thing the score must never
// do, and every instance of it so far came from a vibe's own numbers rather
// than from the machinery. These are floors, not tuning: character lives in
// register, gait, fragment length and palette, never in how long the pad is
// left alone. Raising a rest past the cap or dropping a density under the
// floor fails the build.
{
  const DENSITY_FLOOR = 0.7;
  const REST_CAP = 24;

  const thin = Object.entries(VIBES).filter(([, v]) => v.density < DENSITY_FLOOR);
  check(
    'no vibe leaves the melody to chance',
    thin.length === 0,
    thin.map(([name, v]) => `${name} ${v.density}`).join(', ') ||
      `${Object.keys(VIBES).length} vibes, thinnest ${Math.min(
        ...Object.values(VIBES).map((v) => v.density),
      )}`,
  );

  const slow = Object.entries(VIBES).filter(([, v]) => v.character.phraseRest[1] > REST_CAP);
  check(
    'no vibe rests longer than the cap',
    slow.length === 0,
    slow.map(([name, v]) => `${name} ${v.character.phraseRest[1]}s`).join(', ') ||
      `longest rest ${Math.max(
        ...Object.values(VIBES).map((v) => v.character.phraseRest[1]),
      )}s against a ${REST_CAP}s cap`,
  );

  const backwards = Object.entries(VIBES).filter(
    ([, v]) => v.character.phraseRest[0] > v.character.phraseRest[1],
  );
  check(
    'every phrase rest is a span',
    backwards.length === 0,
    backwards.map(([name]) => name).join(', ') || `${Object.keys(VIBES).length} spans in order`,
  );
}

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
