/**
 * Renders a batch of candidate surfaces, so a search can drive the tuning.
 *
 * `node footstep-fit.mjs candidates.json outdir`
 *
 * `footstep-render.ts` renders one surface as it is written; this renders many
 * as they *might* be written. The input is a surface name and a list of
 * overrides, each a flat map of dotted paths — `{"grit.q": 2.2}` — and each
 * comes back as a single-footfall wav named by its index.
 *
 * **This exists because tuning a liquid by ear-proxy does not converge.** There
 * are the better part of twenty coupled numbers in one of these, several of
 * them pulling against each other: spread widens the texture and also breaks it
 * into countable objects, grain length is both the wet/dry control and the
 * thing that decides how much of the band a grain covers, and every level moves
 * the balance of all the others. Changing one at a time and listening is a walk
 * through that space with no gradient, and eleven rounds of it produced goop,
 * then foil, then cereal.
 *
 * A search does not need to be clever to beat that. It needs the loop to be
 * cheap, which means one footfall and a short buffer, and it needs a score —
 * which `measure` on the reference recording supplies.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { OfflineAudioContext } from 'node-web-audio-api';
import { Footsteps, SURFACES, type SurfaceName } from '../src/audio/models/footsteps';
import { createNoiseBuffers } from '../src/audio/noise';

const RATE = 48000;
/** One footfall and its tail. Long enough for anything, short enough to iterate. */
const SECONDS = 0.62;

interface Batch {
  surface: SurfaceName;
  sets: Record<string, number>[];
}

const [inputPath, outDir] = process.argv.slice(2);
const batch = JSON.parse(readFileSync(inputPath, 'utf8')) as Batch;
mkdirSync(outDir, { recursive: true });

/** Deep clone, because each candidate patches its own copy. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Writes `a.b` = v into a nested object, creating nothing that is not there. */
function poke(target: Record<string, unknown>, path: string, value: number): void {
  const parts = path.split('.');
  let node = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const next = node[parts[i]];
    if (typeof next !== 'object' || next === null) return;
    node = next as Record<string, unknown>;
  }
  const leaf = parts[parts.length - 1];
  // Array indices arrive as `radius.0`; everything else is a plain key.
  node[leaf] = value;
}

function wav(samples: Float32Array): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const c = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(c * 32767), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

const pristine = clone(SURFACES[batch.surface] as unknown as Record<string, unknown>);

for (let i = 0; i < batch.sets.length; i++) {
  const patched = clone(pristine);
  for (const [path, value] of Object.entries(batch.sets[i])) poke(patched, path, value);
  // Runtime mutation of the table the model reads. The `as const` on `SURFACES`
  // is a compile-time promise about the shipped values, not a runtime lock.
  (SURFACES as unknown as Record<string, unknown>)[batch.surface] = patched;

  const context = new OfflineAudioContext(1, Math.ceil(SECONDS * RATE), RATE);
  const dry = context.createGain();
  const send = context.createGain();
  send.gain.value = 0;
  dry.connect(context.destination);

  // See `footstep-render.ts`: an offline context never reports `running`, and
  // every gesture guards on it.
  const running = new Proxy(context, {
    get(target, key) {
      if (key === 'state') return 'running';
      const value = Reflect.get(target, key) as unknown;
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });

  const feet = new Footsteps(
    { context: running, noise: createNoiseBuffers(context as never), dry, send } as never,
    1,
  );
  feet.surface = batch.surface;
  feet.step({ speed: 1.55, right: 0, forward: 1 });

  const buffer = await context.startRendering();
  writeFileSync(`${outDir}/${String(i).padStart(3, '0')}.wav`, wav(buffer.getChannelData(0) as Float32Array));
}

(SURFACES as unknown as Record<string, unknown>)[batch.surface] = pristine;
console.log(`rendered ${batch.sets.length}`);
