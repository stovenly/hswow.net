/**
 * The glottal pulse: what vocal folds actually put into a throat.
 *
 * A sawtooth has every harmonic at −6 dB an octave, which is a buzz. Real
 * voicing is a smooth pulse of airflow — the Rosenberg shape: a cosine rise
 * while the folds open, a faster cosine fall as they close, silence while they
 * are shut — and what the ear gets is its *derivative*, since the lips
 * radiate the change in flow. That falls at about −12 dB an octave with a
 * softer top the longer the folds stay open, which is what breathy and warm
 * mean. Built once as a `PeriodicWave` per open quotient and cached.
 */

const HARMONICS = 48;
const SAMPLES = 1024;

const cache = new Map<string, PeriodicWave>();

/**
 * @param open Fraction of the period the folds are open, 0.4 (pressed) to
 *   0.8 (breathy). 0.6 is an ordinary speaking voice.
 * @param skew How much faster the closing is than the opening. 2–3.
 */
export function glottalWave(context: BaseAudioContext, open = 0.6, skew = 2.5): PeriodicWave {
  const key = `${open.toFixed(2)}:${skew.toFixed(1)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  // Flow over one period.
  const flow = new Float32Array(SAMPLES);
  const tp = (open * skew) / (1 + skew);
  const tn = open / (1 + skew);
  for (let n = 0; n < SAMPLES; n++) {
    const t = n / SAMPLES;
    if (t < tp) flow[n] = 0.5 * (1 - Math.cos((Math.PI * t) / tp));
    else if (t < tp + tn) flow[n] = Math.cos((Math.PI * (t - tp)) / (2 * tn));
    else flow[n] = 0;
  }
  // Its derivative, which is the sound.
  const pulse = new Float32Array(SAMPLES);
  for (let n = 0; n < SAMPLES; n++) pulse[n] = flow[(n + 1) % SAMPLES] - flow[n];

  // Fourier series of that shape: PeriodicWave wants x(t) = Σ re·cos + im·sin.
  const real = new Float32Array(HARMONICS + 1);
  const imag = new Float32Array(HARMONICS + 1);
  for (let k = 1; k <= HARMONICS; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < SAMPLES; n++) {
      const a = (2 * Math.PI * k * n) / SAMPLES;
      re += pulse[n] * Math.cos(a);
      im -= pulse[n] * Math.sin(a);
    }
    real[k] = (2 * re) / SAMPLES;
    imag[k] = (-2 * im) / SAMPLES;
  }
  const wave = context.createPeriodicWave(real, imag);
  cache.set(key, wave);
  return wave;
}
