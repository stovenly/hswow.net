import type { AudioEngine } from '../audio/AudioEngine';

/**
 * A spectrum and a level bar, in the corner.
 *
 * The audio system has no visible output at all, and that is the whole reason
 * this exists. Every other subsystem can be debugged by looking at it — a
 * collider by walking into things, a light by seeing what it lights. Sound can
 * only be debugged by listening, which means one problem at a time, on
 * headphones, by someone who already knows what it is supposed to sound like.
 *
 * A spectrum will not tell you whether a model is any good. It will tell you,
 * instantly, the three things that are otherwise slow to establish:
 *
 * - **Whether anything is coming out at all.** A silent model and a muted bus
 *   sound identical.
 * - **Where the energy actually is.** "This is too harsh" is a guess until you
 *   can see a spike at 3 kHz, and then it is a fix.
 * - **Whether the master is being driven into the limiter.** The bar goes red
 *   before anything audibly distorts, which is the point at which mixing
 *   decisions are still cheap.
 *
 * Drawn on its own canvas rather than into the scene. It has to be legible,
 * and the render pipeline chunks to three-pixel blocks and dithers to a
 * palette — a spectrum through that is a decorative pattern.
 */

/** Bottom of the scale. Below this is silence for display purposes. */
const FLOOR_DB = -90;
const WIDTH = 240;
const HEIGHT = 92;

export interface Meter {
  /** Toggled from the panel. Nothing is computed while hidden. */
  visible: boolean;
  update(): void;
  dispose(): void;
}

export function createMeter(engine: AudioEngine): Meter {
  const canvas = document.createElement('canvas');
  // Backing store at device resolution, laid out at CSS pixels, so the bars
  // are crisp on a phone rather than four scaled-up blocks.
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = WIDTH * scale;
  canvas.height = HEIGHT * scale;
  Object.assign(canvas.style, {
    position: 'fixed',
    right: '8px',
    bottom: '8px',
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`,
    // Above the scene, below the panel, and never in the way of a click — the
    // canvas sits over the viewport and would otherwise eat pointer lock.
    zIndex: '20',
    pointerEvents: 'none',
    display: 'none',
    background: 'rgba(8, 10, 12, 0.72)',
    borderRadius: '3px',
  });
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  const analyser = engine.analyser;
  const bins = new Uint8Array(analyser.frequencyBinCount);
  const samples = new Float32Array(analyser.fftSize);
  engine.releaseAnalyser();
  let shown = false;

  // Peak, held and decayed. An instantaneous peak on a 60 Hz display is
  // unreadable — the number worth seeing is the loudest thing in the last
  // second or so, which is what a real meter's hold does.
  let held = 0;

  const meter: Meter = {
    visible: false,

    update() {
      canvas.style.display = this.visible ? 'block' : 'none';
      // On the bus only while it is being looked at: an FFT per frame is not free.
      if (shown !== this.visible) {
        shown = this.visible;
        if (shown) void engine.analyser;
        else engine.releaseAnalyser();
      }
      if (!this.visible || !context) return;

      analyser.getByteFrequencyData(bins);
      analyser.getFloatTimeDomainData(samples);

      let peak = 0;
      for (let i = 0; i < samples.length; i++) {
        const magnitude = Math.abs(samples[i]);
        if (magnitude > peak) peak = magnitude;
      }
      held = Math.max(peak, held * 0.94);

      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, WIDTH, HEIGHT);

      // --- the spectrum ----------------------------------------------------
      //
      // Logarithmic across the width. A linear frequency axis spends four
      // fifths of the display above 5 kHz, where almost nothing in this
      // library lives — every model would be a spike jammed against the left
      // edge.
      const nyquist = engine.context.sampleRate / 2;
      const top = HEIGHT - 12;
      const lowest = 30;
      context.fillStyle = '#7fb2c9';
      for (let x = 0; x < WIDTH; x++) {
        const hz = lowest * Math.pow(nyquist / lowest, x / WIDTH);
        const bin = Math.min(bins.length - 1, Math.round((hz / nyquist) * bins.length));
        const height = (bins[bin] / 255) * top;
        context.fillRect(x, top - height, 1, height);
      }

      // Octave ticks, so the axis means something without a label on it.
      context.fillStyle = 'rgba(255, 255, 255, 0.16)';
      for (let hz = 100; hz < nyquist; hz *= 10) {
        const x = (Math.log(hz / lowest) / Math.log(nyquist / lowest)) * WIDTH;
        context.fillRect(x, 0, 1, top);
      }

      // --- the level bar ---------------------------------------------------
      const db = held > 0 ? 20 * Math.log10(held) : FLOOR_DB;
      const across = Math.max(0, (db - FLOOR_DB) / -FLOOR_DB) * WIDTH;
      // The limiter's threshold is −6 dB. Past that it is working, which is
      // fine occasionally and a mix problem continuously.
      context.fillStyle = db > -1 ? '#e05a4a' : db > -6 ? '#e0b44a' : '#6fbf73';
      context.fillRect(0, HEIGHT - 8, across, 6);
    },

    dispose() {
      canvas.remove();
    },
  };

  return meter;
}
