import type { AudioEngine } from '../AudioEngine';
import type { OneShot } from '../Scatter';
import { popBubble, bubbleRadius } from '../dsp/bubble';
import { excite } from '../dsp/impact';

/**
 * A drip.
 *
 * Water falling from an eave, a vault, a cistern roof, the mouth of a passage.
 * Structurally the simplest thing in the library — two scheduled events — and
 * disproportionately effective, because a drip is the sound a **space** makes
 * rather than the sound an object makes. Nothing else so cheaply says "this
 * room is large, hard, and empty".
 *
 * Two parts, in this order:
 *
 * 1. A very short broadband tick: the surface of the pool breaking. It is
 *    almost inaudible on its own and it is what stops the bubble sounding like
 *    a sine that faded in.
 * 2. The bubble the impact traps, rising in pitch as it rings out. See
 *    `dsp/bubble.ts` — that rise is the entire difference between water and a
 *    marimba.
 *
 * ## It lives on the reverb
 *
 * The one place in this library where the emitter's `reverb` should be pushed
 * to 1 and its dry level kept low. A drip in a cavern is heard almost entirely
 * as its own tail; the click itself is a few milliseconds long and carries
 * essentially no information beyond "now". Run one dry in a big room and it
 * sounds like a bug.
 *
 * ## Regularity
 *
 * Real drips from one point are close to periodic — water accumulates at a
 * fixed rate and falls at a fixed volume — which makes them the one thing in
 * this library that should *not* be scheduled with `poisson`. A field of them
 * wants a slow `every` and a low `voices` count, and several fields at
 * mutually prime intervals read far better than one field firing faster.
 */

export interface DripOptions {
  gain?: number;
  /**
   * Radius range of the trapped bubble, in metres.
   *
   * The pitch, in other words: 1 mm is 3.3 kHz and a fine drip onto a hard
   * floor, 6 mm is 540 Hz and a fat one into standing water. A *narrow* range
   * is what makes repeated drips read as coming from the same place.
   */
  radius?: readonly [number, number];
  /** How long each bubble rings, in oscillations. Longer is a stiller pool. */
  cycles?: number;
  /** Level of the impact tick against the bubble, 0..1. */
  tick?: number;
}

export function createDrip(engine: AudioEngine, options: DripOptions = {}): OneShot {
  const context = engine.context;
  const noise = engine.noise;
  if (!noise) throw new Error('drip built before the noise buffers were ready');

  const radius = options.radius ?? [0.0018, 0.0032];
  const cycles = options.cycles ?? 30;
  const tick = options.tick ?? 0.35;

  const output = context.createGain();
  output.gain.value = options.gain ?? 0.5;

  // The tick is filtered high and narrow. Broadband here would be a stone
  // landing rather than a drop, and the difference is entirely in the bandwidth.
  const click = context.createBiquadFilter();
  click.type = 'bandpass';
  click.frequency.value = 3800;
  click.Q.value = 3;
  click.connect(output);

  return {
    output,

    fire(at, force) {
      excite(context, noise.white, click, at, force * tick, 0.0016);
      const length = popBubble(context, output, at + 0.0015, {
        radius: bubbleRadius(radius[0], radius[1]),
        level: force * 0.55,
        cycles: cycles * (0.85 + Math.random() * 0.3),
        // A still pool lets the bubble rise further before it dies, so the
        // chirp is wider than it is in agitated water.
        rise: 0.34,
      });
      return length + 0.02;
    },

    dispose() {
      click.disconnect();
      output.disconnect();
    },
  };
}
