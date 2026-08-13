import { Vector2 } from 'three';
import type * as THREE from 'three';
import type { GpuClock } from '../engine/GpuClock';

/**
 * The performance readout, for a player rather than for me.
 *
 * There is already a full instrumentation panel behind `?debug` — collider
 * triangles, voice counts, resident zones — and none of that belongs here.
 * This answers the questions somebody benchmarking their own machine actually
 * asks: how fast is it running, how bad are the worst frames, and how much
 * work is a frame. Everything shown is something a setting in the same menu
 * can move.
 *
 * **The 1% low is the number worth having.** An average frame rate hides the
 * stutters, and stutters are what a player feels; two machines both reporting
 * sixty can be completely different to play on. This is the mean of the worst
 * one per cent of recent frames, expressed as a rate, which is the measure
 * every benchmark settled on for exactly that reason.
 */

export type PerformanceMode = 'off' | 'fps' | 'all';

/**
 * How many recent frames the statistics are drawn from.
 *
 * A couple of seconds at ordinary rates. Long enough that the one per cent low
 * is measuring a real stutter rather than a single unlucky frame, short enough
 * that the numbers still respond to a setting being changed while they are
 * being watched.
 */
const WINDOW = 180;

/**
 * How many frames the *live* figures are drawn from.
 *
 * Much shorter than the window above, and they are deliberately different
 * measurements. The one per cent low is a statistic about a stretch of play
 * and wants a long baseline; the frame rate is meant to answer "what is it
 * doing right now", and averaged over three seconds it visibly lags whatever
 * was just changed — turn the shadows off and the number takes a beat to
 * agree. About a quarter of a second is enough to stop the last digit
 * flickering and short enough to feel immediate.
 */
const LIVE = 20;

/** How often the text is rewritten, in seconds. */
const REFRESH = 0.1;

export class PerformanceHud {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly gpu: GpuClock;
  private readonly root: HTMLDivElement;
  private readonly rows = new Map<string, HTMLElement>();

  /** Frame durations in milliseconds, oldest first once it has filled. */
  private readonly samples = new Float32Array(WINDOW);
  private count = 0;
  private cursor = 0;
  private sinceRefresh = 0;
  private mode: PerformanceMode = 'off';

  constructor(overlay: HTMLElement, renderer: THREE.WebGLRenderer, gpu: GpuClock) {
    this.renderer = renderer;
    this.gpu = gpu;

    this.root = document.createElement('div');
    this.root.id = 'perf';
    this.root.hidden = true;
    overlay.appendChild(this.root);
  }

  setMode(mode: PerformanceMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    // Queries cost a little and nobody reads them the rest of the time. The
    // readings are dropped with them, so switching back on never shows a
    // number from before whatever was just changed.
    this.gpu.enabled = mode === 'all';
    if (!this.gpu.enabled) this.gpu.clear();
    this.root.hidden = mode === 'off';
    this.root.classList.toggle('is-full', mode === 'all');
    // Rebuilt rather than hidden row by row: the two modes show different
    // things, and leaving the wide layout's rows in the document as empty
    // strings would hold the box open at the wrong width.
    this.root.textContent = '';
    this.rows.clear();
    if (mode === 'off') return;

    this.addRow('fps');
    if (mode === 'all') {
      this.addRow('1% low');
      this.addRow('frame');
      this.addRow('draws');
      this.addRow('tris');
      this.addRow('buffers');
      this.addRow('memory');
      this.addRow('size');
      this.addRow('gpu');
    }
    // Written at once, so the box does not appear empty for a quarter of a
    // second after being switched on.
    this.sinceRefresh = REFRESH;
  }

  /**
   * Call once a frame, after the render.
   *
   * After, deliberately: `renderer.info` is reset inside `PostFX.render`, so
   * reading it here gives the frame just drawn rather than the one before it.
   */
  update(dt: number): void {
    // Sampled even while hidden. Switching the readout on should show what the
    // machine is doing now, not spend two seconds filling a window first.
    this.samples[this.cursor] = dt * 1000;
    this.cursor = (this.cursor + 1) % WINDOW;
    this.count = Math.min(this.count + 1, WINDOW);

    if (this.mode === 'off') return;
    this.sinceRefresh += dt;
    if (this.sinceRefresh < REFRESH) return;
    this.sinceRefresh = 0;
    this.draw();
  }

  private draw(): void {
    const live = this.recentMean(LIVE);
    this.set('fps', live > 0 ? Math.round(1000 / live).toString() : '—');
    if (this.mode !== 'all') return;

    const low = this.onePercentLow();
    this.set('1% low', low > 0 ? Math.round(1000 / low).toString() : '—');
    this.set('frame', `${live.toFixed(1)} ms`);

    const info = this.renderer.info;
    this.set('draws', info.render.calls.toString());
    this.set('tris', info.render.triangles.toLocaleString());
    // What is resident on the GPU. The number that moves when a zone is built
    // and, more to the point, the number that fails to come back down if one
    // is ever released without being disposed.
    this.set('buffers', `${info.memory.geometries} geo`);

    // Chrome only, and behind a flag on some builds. Absent is a normal answer
    // rather than an error.
    const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
    this.set('memory', memory ? `${(memory.usedJSHeapSize / 1048576).toFixed(0)} MB` : '—');

    // The resolution actually being rendered, which is not the window size:
    // the pixelation pass draws at a fraction of it, and device pixel ratio
    // multiplies it. Anybody comparing two machines needs to know this.
    const size = this.renderer.getDrawingBufferSize(_size);
    this.set('size', `${size.x}×${size.y}`);

    // **The one number here that is the GPU's rather than the CPU's.** Every
    // row above times how long this machine took to *ask* for a frame; a busy
    // GPU makes them go down. Below is where the frame is actually spent, pass
    // by pass, so "why is this frame slow" has an answer rather than an
    // argument. Absent on drivers that will not answer — see `GpuClock`.
    if (!this.gpu.available) {
      this.set('gpu', 'unavailable');
      return;
    }
    this.set('gpu', `${this.gpu.total.toFixed(2)} ms`);
    for (const [pass, ms] of this.gpu.passes) this.set(`· ${pass}`, `${ms.toFixed(2)} ms`);
  }

  /**
   * Mean of the newest `frames` frame times, in milliseconds.
   *
   * Walked backwards from the write cursor rather than over the array in
   * order: this is a ring buffer, so index 0 is not the oldest sample once it
   * has wrapped, and averaging the front of the array would silently be
   * averaging an arbitrary quarter-second from some time in the last three
   * seconds.
   */
  private recentMean(frames: number): number {
    const take = Math.min(frames, this.count);
    if (take === 0) return 0;
    let total = 0;
    for (let i = 1; i <= take; i++) total += this.samples[(this.cursor - i + WINDOW) % WINDOW];
    return total / take;
  }

  /**
   * Mean of the slowest one per cent of frames, in milliseconds.
   *
   * The mean of the tail rather than the single worst frame in it, which is
   * one sample and jumps about. At least one frame always counts, so this is
   * defined even on a short window.
   */
  private onePercentLow(): number {
    if (this.count === 0) return 0;
    const sorted = Array.from(this.samples.subarray(0, this.count)).sort((a, b) => b - a);
    const take = Math.max(1, Math.round(this.count / 100));
    let total = 0;
    for (let i = 0; i < take; i++) total += sorted[i];
    return total / take;
  }

  private addRow(label: string): void {
    const row = document.createElement('div');
    row.className = 'perf-row';

    const name = document.createElement('span');
    name.className = 'perf-label';
    name.textContent = label;

    const value = document.createElement('span');
    value.className = 'perf-value';
    value.textContent = '—';

    row.append(name, value);
    this.root.appendChild(row);
    this.rows.set(label, value);
  }

  /**
   * Writes a row, adding it if this is the first time it has had a value.
   *
   * The pass rows arrive rather than being declared: a pass that is switched
   * off never reports, and listing every one the pipeline *could* run would be
   * a column of dashes for the ones a zone has nothing for.
   */
  private set(label: string, value: string): void {
    let cell = this.rows.get(label);
    if (!cell) {
      this.addRow(label);
      cell = this.rows.get(label);
    }
    if (cell) cell.textContent = value;
  }

  dispose(): void {
    this.root.remove();
  }
}

/** Reused; `getDrawingBufferSize` writes into whatever it is handed. */
const _size = new Vector2();
