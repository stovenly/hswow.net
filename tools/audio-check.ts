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
import { derivedQ } from '../src/audio/dsp/modal';
import { SURFACES, BANK, RINGS, gaitFor, panFor } from '../src/audio/models/footsteps';

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
  const ALLOWED = ['wood', 'metal-hollow'];
  const wrong = Object.entries(SURFACES)
    .filter(
      ([name, surface]) =>
        !ALLOWED.includes(name) &&
        surface.modes.some((mode) => mode.hz < HOLLOW_HZ && mode.decay > HOLLOW_DECAY),
    )
    .map(([name]) => name);
  check(
    'only wood and hollow metal are hollow',
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
  check('every impact band has room in it', wrong.length === 0, wrong.join(', ') || '16 bands, all open');
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
    panFor(1, 1) > panFor(1, -1) && Math.abs(panFor(0, 1) - 0.2) < 1e-9,
    `lead ${panFor(1, 1).toFixed(2)}, trail ${panFor(1, -1).toFixed(2)}, walk ${panFor(0, 1).toFixed(2)}`,
  );
}

// **Shear has to do something on the materials it is claimed for.** The point
// of `scuff` is that creeping over gravel and sprinting over it are different
// events, so a loose surface that ignores speed is the feature not working.
{
  const LOOSE = ['gravel', 'cobble-loose', 'sand', 'leaves', 'water'];
  const deaf = LOOSE.filter((name) => SURFACES[name as keyof typeof SURFACES].scuff < 0.7);
  check('loose surfaces answer to speed', deaf.length === 0, deaf.join(', ') || `${LOOSE.length} checked`);
}

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
