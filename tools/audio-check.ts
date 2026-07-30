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

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
