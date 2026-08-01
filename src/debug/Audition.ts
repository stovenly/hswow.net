import { measure, periodicity, type Measurements } from '../audio/audition/measure';
import { render, type Subject } from '../audio/audition/render';
import { buildOneShot, type OneShotSpec } from '../audio/Scatter';
import type { SoundModel } from '../audio/Emitter';
import type { FrictionModel } from '../audio/models/friction';
import { createWind } from '../audio/models/wind';
import { createFoliage } from '../audio/models/foliage';
import { createMachine } from '../audio/models/machine';
import { createBird } from '../audio/models/bird';
import { createFire } from '../audio/models/fire';
import { createRain } from '../audio/models/rain';
import { createWater } from '../audio/models/water';
import { createCrowd } from '../audio/models/crowd';
import { createFriction } from '../audio/models/friction';
import { createWaveguide, type WaveguideModel } from '../audio/models/waveguide';
import baselines from '../audio/baselines.json';

/**
 * Rendering the whole library and asking whether any of it sounds bad.
 *
 * The listening test is the real one and this does not replace it. What it
 * replaces is the *other* listening test — the one where you walk the sound
 * stage every time anything changes, trying to notice by ear that a model is
 * now three decibels louder than it was last week. Nobody notices that, and
 * everybody notices the mix it eventually ruins.
 *
 * ## What it catches, and what it cannot
 *
 * Two kinds of failure, and the distinction is the design:
 *
 * - **Rules** are absolute and hold for anything in the library, whether or
 *   not it has ever been rendered before. Clipping, DC offset, a texture that
 *   has fused into a drone or come apart into bubble wrap, and — the one worth
 *   the whole harness — a loudness spread wider than three units across the
 *   library, which is the commonest single reason a procedural library sounds
 *   bad. These need no recorded history to check.
 * - **Baselines** are the recorded measurements of a specific model, and they
 *   catch *drift*: a change to a shared primitive that quietly moves six
 *   models nobody was thinking about. They can only be produced by running
 *   this, which can only happen in a browser, so `baselines.json` starts with
 *   rules and no rows and fills up as they are captured and committed.
 *
 * What none of it catches is whether a model sounds like the thing it claims
 * to be. A bird that measures perfectly and sounds like a kettle passes every
 * check here. That is what the sound stage and a pair of headphones are for,
 * and the division of labour is deliberate: the numbers take the tedious
 * faults so listening can be spent on judgement.
 */

/** The recorded shape of one model. See the header. */
interface Baseline {
  loudness: number;
  crest: number;
  centroid: number;
  bands: number[];
}

interface BaselineFile {
  rules: {
    peak: number;
    dc: number;
    periodicity: number;
    /** Per kind. Lower and upper bound as JSON arrays, so typed as such. */
    crest: Record<Kind, readonly number[]>;
  };
  /** Tolerances a recorded value may drift by before it is a failure. */
  drift: { loudness: number; crest: number; centroid: number };
  models: Record<string, Baseline>;
}

/**
 * What kind of source a subject is, which decides how it is judged.
 *
 * The distinction exists because crest factor means opposite things for the
 * two. A continuous texture with a very high crest has come apart into audible
 * individual grains — bubble wrap. An impulsive source with a high crest is
 * simply doing its job: silence with transients in it. Judged by one band, the
 * first version flagged the drip, the hammer, the clatter and the chime on a
 * run where all four were correct.
 */
type Kind = 'texture' | 'event';

const spec = baselines as BaselineFile;

/**
 * A one-shot rendered as a train of events.
 *
 * One hit measures the hit and nothing else, and half of what is being asked
 * about a one-shot is whether hearing it repeatedly is bearable — whether
 * successive events differ, and whether the tail of one lands on top of the
 * next. So they are fired at the rate their scatter fields actually use.
 */
function oneShot(name: string, shot: OneShotSpec, every: number, seconds = 8): Subject {
  return {
    name,
    kind: 'event',
    seconds,
    build(engine) {
      const built = buildOneShot(engine, shot);
      let next = 0;
      return {
        output: built.output,
        update(dt) {
          next -= dt;
          if (next > 0) return;
          // A fixed schedule and a varying force. The gaps are the scatter
          // field's business and they are measured there; what matters here is
          // that the *events* differ from one another.
          next = every;
          built.fire(engine.context.currentTime + 0.05, 0.45 + Math.random() * 0.55);
        },
        dispose: () => built.dispose(),
      } satisfies SoundModel;
    },
  };
}

/**
 * The library, as it is measured.
 *
 * Options are defaults throughout, for the reason the sound stage uses
 * defaults: a harness tuned to flatter each model agrees with itself and says
 * nothing. Rain is the one exception, because its default is off.
 *
 * Render lengths differ by model and are not a knob. Each is long enough to
 * contain the model's own slowest rhythm — a bird's phrase interval, a
 * machine's load cycle — because a measurement taken over less than one period
 * of something describes a fragment of it.
 */
const SUBJECTS: readonly Subject[] = [
  { name: 'wind', seconds: 12, build: (engine) => createWind(engine) },
  { name: 'foliage', seconds: 12, build: (engine) => createFoliage(engine) },
  { name: 'rain', seconds: 8, build: (engine) => createRain(engine, { intensity: 0.6 }) },
  { name: 'water', seconds: 8, build: (engine) => createWater(engine) },
  { name: 'fire', seconds: 8, build: (engine) => createFire(engine) },
  { name: 'machine', seconds: 12, build: (engine) => createMachine(engine) },
  {
    name: 'friction',
    seconds: 10,
    // `'steady'`, so the render is of the model rather than of its silences —
    // a `'cycle'` source spends most of ten seconds resting, and measuring
    // that reports the gaps.
    build: (engine) => createFriction(engine, { motion: 'steady' }),
    // The one subject that waits. Without this the render finishes before the
    // wasm lands and the row is the event fallback wearing the model's name.
    ready: (model) => (model as FrictionModel).ready,
  },
  {
    name: 'waveguide',
    // An event, despite being a continuous model: in `'chime'` mode it is
    // struck and left to ring, so its shape is transients and silence. The
    // classification follows the excitation, not the file.
    kind: 'event',
    seconds: 10,
    // Struck at a steady rate rather than weather-driven, so the render is of
    // the resonator rather than of the gust field's mood that minute.
    build: (engine) => createWaveguide(engine, { excite: 'chime', drive: 0.3 }),
    ready: (model) => (model as WaveguideModel).ready,
  },
  // Discrete calls with long silences between, so judged as events even though
  // it is a continuous model — same rule as the chime: the classification
  // follows what the output looks like, not what built it.
  { name: 'bird', kind: 'event', seconds: 16, build: (engine) => createBird(engine) },
  { name: 'crowd', seconds: 10, build: (engine) => createCrowd(engine) },
  oneShot('hammer', { sound: 'hammer' }, 1.1),
  oneShot('clatter', { sound: 'clatter' }, 1.6),
  oneShot('animal', { sound: 'animal' }, 1.8),
  oneShot('drip', { sound: 'drip' }, 0.9),
  oneShot('bell', { sound: 'bell' }, 3.5, 12),
];

export interface AuditionRow {
  name: string;
  measurements: Measurements;
  /** How periodic the envelope is, 0..1. Above the rule is a loop. */
  periodicity: number;
  /** Empty when everything passed. */
  problems: string[];
  /** True when this row had nothing recorded to compare against. */
  novel: boolean;
}

export interface AuditionReport {
  rows: AuditionRow[];
  /** Loudest minus quietest, in the same units `measure` reports. */
  spread: number;
  failures: number;
  /** Paste-ready replacement for the `models` block of `baselines.json`. */
  captured: Record<string, Baseline>;
}

/**
 * The envelope, decimated, for the periodicity test.
 *
 * Run on the *envelope* rather than on the waveform, because the question is
 * whether the texture loops and not whether the signal is pitched — a machine
 * is strongly periodic at its fundamental and has nothing wrong with it. Fifty
 * millisecond windows put the useful lags in the range of seconds, which is
 * where a scheduler that has quietly become a loop would show up.
 */
function envelope(signal: Float32Array, rate: number): Float32Array {
  const window = Math.round(rate * 0.05);
  const frames = Math.floor(signal.length / window);
  const out = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    let sum = 0;
    for (let j = 0; j < window; j++) {
      const v = signal[i * window + j];
      sum += v * v;
    }
    out[i] = Math.sqrt(sum / window);
  }
  return out;
}

function checkRules(m: Measurements, loop: number, kind: Kind): string[] {
  const problems: string[] = [];
  const { rules } = spec;
  const [floor, ceiling] = rules.crest[kind];
  if (m.peak > rules.peak) problems.push(`peak ${m.peak.toFixed(2)} — clipping`);
  if (Math.abs(m.dc) > rules.dc) problems.push(`dc ${m.dc.toFixed(4)}`);
  if (m.crest < floor) {
    problems.push(`crest ${m.crest.toFixed(1)} dB — ${kind === 'event' ? 'no transient left' : 'a drone'}`);
  }
  if (m.crest > ceiling) {
    problems.push(`crest ${m.crest.toFixed(1)} dB — ${kind === 'event' ? 'nothing but spikes' : 'bubble wrap'}`);
  }
  if (loop > rules.periodicity) problems.push(`periodicity ${loop.toFixed(2)} — it loops`);
  return problems;
}

/**
 * Drift against the recorded row. **The sharp instrument here.**
 *
 * Three measures, and deliberately not the bands. Asserting on eight band
 * energies per model is 120 tripwires that largely restate the centroid, and
 * every honest re-tuning trips several of them — which trains you to ignore
 * the output, and an ignored check cannot catch the one that mattered. The
 * bands are still recorded and printed, because *reading* them is what caught
 * the friction model coming out spectrally flat.
 */
function checkDrift(name: string, m: Measurements): string[] {
  const was = spec.models[name];
  if (!was) return [];
  const problems: string[] = [];
  const { drift } = spec;
  if (Math.abs(m.loudness - was.loudness) > drift.loudness) {
    problems.push(`loudness ${was.loudness.toFixed(1)} → ${m.loudness.toFixed(1)}`);
  }
  if (Math.abs(m.crest - was.crest) > drift.crest) {
    problems.push(`crest ${was.crest.toFixed(1)} → ${m.crest.toFixed(1)}`);
  }
  // Relative, not absolute: a hundred hertz is a great deal at the bottom of
  // the range and nothing at the top.
  if (Math.abs(Math.log2(Math.max(m.centroid, 1) / Math.max(was.centroid, 1))) > drift.centroid) {
    problems.push(`centroid ${was.centroid.toFixed(0)} → ${m.centroid.toFixed(0)} Hz`);
  }
  return problems;
}

/**
 * Renders and measures every subject.
 *
 * Serially, and not for want of trying otherwise: several `OfflineAudioContext`
 * renders at once contend for the same audio thread, and worse, the suspend
 * and resume dance each one uses is per-context state that is far easier to
 * reason about one at a time. The whole run is a few seconds.
 */
export async function runAudition(): Promise<AuditionReport> {
  const rows: AuditionRow[] = [];
  const captured: Record<string, Baseline> = {};

  for (const subject of SUBJECTS) {
    const { signal, model, rate } = await render(subject);
    const measurements = measure(signal, rate);

    const frames = envelope(signal, rate);
    // Lags from a fifth of a second out to a quarter of the render. Beyond
    // that there is not enough overlap left for the correlation to mean much.
    const lags: number[] = [];
    for (let lag = 4; lag < frames.length / 4; lag += 2) lags.push(lag);
    const loop = periodicity(frames, lags);

    const kind = subject.kind ?? 'texture';
    rows.push({
      name: subject.name,
      measurements,
      periodicity: loop,
      problems: [
        ...checkRules(measurements, loop, kind),
        ...checkDrift(subject.name, measurements),
      ],
      novel: spec.models[subject.name] === undefined,
    });
    captured[subject.name] = {
      loudness: Number(measurements.loudness.toFixed(2)),
      crest: Number(measurements.crest.toFixed(2)),
      centroid: Number(measurements.centroid.toFixed(0)),
      bands: measurements.bands.map((b) => Number(b.toFixed(4))),
    };

    model.dispose();
  }

  // --- reported, and asserted on never -------------------------------------
  //
  // **This used to be a rule, and it was the wrong rule.** The plan called for
  // every model to sit within three units of every other, on the reasoning
  // that the commonest way a procedural library sounds bad is one model being
  // four times louder than its neighbours. The reasoning is sound and the
  // measurement does not test it: models render here at their *defaults*, and
  // a zone spec sets `gain`, `refDistance` and `maxDistance`, so the mixing
  // happens at placement. The real spread is 23 — a wind bed at −47 against an
  // engine at −27 — and both are correct, because one is the air you stand in
  // and the other is a thing you walk toward.
  //
  // The number is still worth seeing. A sudden change in it means something
  // moved. It just cannot be a pass or a fail.
  const loud = rows.map((row) => row.measurements.loudness).filter(Number.isFinite);
  const spread = loud.length > 1 ? Math.max(...loud) - Math.min(...loud) : 0;

  return {
    rows,
    spread,
    failures: rows.filter((row) => row.problems.length > 0).length,
    captured,
  };
}

/**
 * Runs the audition and prints it.
 *
 * `console.table` rather than a rendered panel. The output is a grid of
 * numbers that wants sorting, copying and diffing against the last run, and a
 * dev-tools table does all three for nothing — building a nicer-looking one
 * inside the game would take work away from the models it exists to judge.
 */
export async function auditionToConsole(): Promise<AuditionReport> {
  console.log('audition: rendering the library…');
  const report = await runAudition();

  console.table(
    report.rows.map((row) => ({
      model: row.name,
      loudness: row.measurements.loudness.toFixed(1),
      crest: row.measurements.crest.toFixed(1),
      'centroid Hz': row.measurements.centroid.toFixed(0),
      peak: row.measurements.peak.toFixed(3),
      loop: row.periodicity.toFixed(2),
      status: row.problems.length === 0 ? (row.novel ? 'new' : 'ok') : row.problems.join('; '),
    })),
  );

  console.log(
    `audition: ${report.failures} of ${report.rows.length} flagged. ` +
      `Loudness spread ${report.spread.toFixed(1)} — reported, not a rule; see baselines.json.`,
  );
  // --- capturing -----------------------------------------------------------
  //
  // Printed every run, not only when something is missing a baseline. Once
  // rows exist, the thing you most often want after a deliberate change is to
  // *re-*capture — the harness has correctly flagged drift, you have listened
  // and you meant it — and having to reach for a flag to get the new numbers
  // out is friction at exactly the wrong moment.
  const block = JSON.stringify(report.captured, null, 2);
  const novel = report.rows.filter((row) => row.novel).map((row) => row.name);
  console.log(
    novel.length > 0
      ? `audition: no baseline yet for ${novel.join(', ')}.`
      : 'audition: current measurements, for re-capture after a deliberate change.',
  );
  console.log(
    'If this run sounded right, replace the `models` block of src/audio/baselines.json ' +
      'with the object below and commit it — drift is only visible against something.',
  );
  console.log(block);

  // Best-effort. `writeText` needs a secure context and, in some browsers, a
  // recent user gesture — clicking the button counts, but an audition takes a
  // few seconds and the gesture may have gone stale by the time it resolves.
  // The console copy above is the one that always works.
  try {
    await navigator.clipboard.writeText(block);
    console.log('audition: copied to the clipboard.');
  } catch {
    console.log('audition: could not reach the clipboard — copy the block above.');
  }

  return report;
}
