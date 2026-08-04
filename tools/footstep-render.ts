/**
 * Renders footsteps to a wav so they can be measured instead of argued about.
 *
 * `npm run render:footsteps -- water-puddle mud`
 *
 * **This runs the real `Footsteps`, not a model of it.** `audition/render.ts`
 * says why that matters and why it cannot be done in Node — `OfflineAudioContext`
 * *is* the Web Audio implementation, and a reimplementation would measure the
 * reimplementation. That was true when it was written; it stopped being true
 * when a Rust-backed Node build of the same API became installable. So the
 * class under test is the one that ships, filters and all.
 *
 * The point is the loop it closes. Every surface in this file has been tuned by
 * describing a sound, writing numbers that ought to produce it, and waiting to
 * be told what came out — which is slow, and worse, it lets a confident
 * description survive an output that does not match it. A recording of the real
 * thing can be banded and measured; so can this; and then the two are the same
 * kind of object and the difference between them is a number.
 */
import { writeFileSync } from 'node:fs';
import { OfflineAudioContext } from 'node-web-audio-api';
import { Footsteps, SURFACES, type SurfaceName } from '../src/audio/models/footsteps';
import { createNoiseBuffers } from '../src/audio/noise';

const RATE = 48000;
/** Four footfalls, at the pace of the reference recording. */
const STEPS = 4;
const STRIDE = 0.76;
const LEAD_IN = 0.05;
const TAIL = 0.6;

const wanted = process.argv.slice(2).filter((arg) => arg in SURFACES) as SurfaceName[];
const surfaces = wanted.length > 0 ? wanted : (Object.keys(SURFACES) as SurfaceName[]);

/** A 16-bit wav, because everything reads one and it needs no dependency. */
function wav(samples: Float32Array, rate: number): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const clipped = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(clipped * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

async function render(surface: SurfaceName): Promise<void> {
  const seconds = LEAD_IN + STRIDE * STEPS + TAIL;
  const context = new OfflineAudioContext(1, Math.ceil(seconds * RATE), RATE);

  // The two ends `Footsteps` connects to. No reverb: the room is not the
  // material, and a tail would smear exactly the envelope being measured.
  const dry = context.createGain();
  const send = context.createGain();
  send.gain.value = 0;
  dry.connect(context.destination);

  // **Every gesture guards on `context.state === 'running'`, and an offline
  // context is never in that state** — it reports `suspended` before rendering
  // and again at every suspension, which is exactly when this needs to schedule.
  // The guard is right for the live context it was written for: do not queue
  // sound before the user gesture that starts audio. It simply does not
  // describe an offline render.
  //
  // So the context is wrapped rather than the guard relaxed. Methods are bound
  // back to the real object, so every node built through this is a real node on
  // the real graph and nothing about the synthesis changes.
  const running = new Proxy(context, {
    get(target, key) {
      if (key === 'state') return 'running';
      const value = Reflect.get(target, key) as unknown;
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });

  const engine = {
    context: running,
    noise: createNoiseBuffers(context as unknown as BaseAudioContext),
    dry,
    send,
  };

  const feet = new Footsteps(engine as never, 1);
  feet.surface = surface;

  // **Every suspension is queued before rendering starts**, exactly as
  // `audition/render.ts` does it and for its reason: awaiting one before the
  // render is running waits on a clock that has not begun, which is a deadlock
  // and looks exactly like a hang.
  //
  // `step()` schedules against `currentTime`, so the clock has to have reached
  // the right place before each call — hence a suspension per footfall rather
  // than four calls up front, which would stack them all at zero.
  for (let i = 1; i < STEPS; i++) {
    void context.suspend(LEAD_IN + STRIDE * i).then(() => {
      feet.step({ speed: 1.55, right: 0, forward: 1 });
      void context.resume();
    });
  }
  // The first one lands before any audio is rendered, at t = 0.
  feet.step({ speed: 1.55, right: 0, forward: 1 });

  const buffer = await context.startRendering();
  const samples = buffer.getChannelData(0);
  const path = `node_modules/.cache/footsteps-${surface}.wav`;
  writeFileSync(path, wav(samples as Float32Array, RATE));

  let peak = 0;
  for (const value of samples) peak = Math.max(peak, Math.abs(value));
  console.log(`${surface.padEnd(20)} ${seconds.toFixed(2)}s  peak ${peak.toFixed(3)}  ${path}`);
}

for (const surface of surfaces) await render(surface);
