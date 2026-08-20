import type * as THREE from 'three';

/**
 * Per-pass GPU milliseconds, hand-wired onto `EXT_disjoint_timer_query_webgl2`.
 * `performance.now()` around `render()` times how long it took to queue the work,
 * which is a CPU number and goes down when the GPU gets busier; the DevTools GPU
 * track is the whole process and cannot say which of ten passes is expensive.
 *
 * `TIME_ELAPSED_EXT` brackets a run of draw calls and reports nanoseconds spent on
 * the device. Results arrive a frame or three late, so queries live in a ring and
 * are collected once they are ready — waiting on one would stall the pipeline and
 * change the thing being measured. Where the extension is absent, `available` is
 * false and every call is a no-op.
 */

/** How many queries may be in flight. A dozen brackets a frame, so this is several frames of headroom; past it a bracket is skipped rather than allocating without bound. */
const RING = 64;

/** How much of the previous reading a new one keeps. Heavy enough to settle, light enough that turning a pass off is visible at once. */
const SMOOTHING = 0.85;

interface Timed {
  label: string;
  query: WebGLQuery;
}

export class GpuClock {
  /** False where the extension is missing. Everything below then does nothing. */
  readonly available: boolean;

  /** Off by default: queries cost a little, and nobody is reading them. */
  enabled = false;

  private readonly gl: WebGL2RenderingContext | null = null;
  private readonly timeElapsed: number = 0;
  private readonly disjoint: number = 0;

  private readonly spare: WebGLQuery[] = [];
  private readonly pending: Timed[] = [];
  private issued = 0;
  private open: WebGLQuery | null = null;

  /** Smoothed milliseconds per label, newest resolved reading folded in. */
  readonly passes = new Map<string, number>();

  constructor(renderer: THREE.WebGLRenderer) {
    const gl = renderer.getContext();
    // WebGL 1 has a different extension with a different query object; this
    // project asks for a WebGL 2 context and there is no reason to carry both.
    const ext =
      'createQuery' in gl
        ? (gl.getExtension('EXT_disjoint_timer_query_webgl2') as {
            TIME_ELAPSED_EXT: number;
            GPU_DISJOINT_EXT: number;
          } | null)
        : null;
    this.available = ext !== null;
    if (!ext) return;
    this.gl = gl as WebGL2RenderingContext;
    this.timeElapsed = ext.TIME_ELAPSED_EXT;
    this.disjoint = ext.GPU_DISJOINT_EXT;
  }

  /**
   * Starts timing a run of draw calls, closed by `end`. Only one timer query can be
   * open at a time — the extension's rule, not a simplification here — so brackets
   * cannot nest, and a second `begin` before its `end` is dropped.
   */
  begin(label: string): void {
    const gl = this.gl;
    if (!gl || !this.enabled || this.open) return;
    let query = this.spare.pop();
    if (!query) {
      if (this.issued >= RING) return;
      query = gl.createQuery() ?? undefined;
      if (!query) return;
      this.issued++;
    }
    gl.beginQuery(this.timeElapsed, query);
    this.open = query;
    this.pending.push({ label, query });
  }

  /** Closes the open bracket. Harmless with nothing open. */
  end(): void {
    const gl = this.gl;
    if (!gl || !this.open) return;
    gl.endQuery(this.timeElapsed);
    this.open = null;
  }

  /**
   * Collects whatever has finished, once a frame after the render. Oldest first and
   * stopping at the first unfinished query, since they complete in the order they
   * were issued. A disjoint means the driver interrupted the GPU and every timing
   * spanning it is meaningless, so the whole ring is thrown away.
   */
  collect(): void {
    const gl = this.gl;
    if (!gl) return;

    if (gl.getParameter(this.disjoint)) {
      for (const timed of this.pending) this.spare.push(timed.query);
      this.pending.length = 0;
      return;
    }

    while (this.pending.length > 0) {
      const timed = this.pending[0];
      if (!gl.getQueryParameter(timed.query, gl.QUERY_RESULT_AVAILABLE)) break;
      this.pending.shift();
      this.spare.push(timed.query);
      // Still drained while switched off — the queries have to come back either
      // way — but not recorded, or a reading issued before the switch would
      // land after `clear` and outlive the thing it was measuring.
      if (!this.enabled) continue;
      const ms = (gl.getQueryParameter(timed.query, gl.QUERY_RESULT) as number) / 1e6;
      const prior = this.passes.get(timed.label);
      this.passes.set(
        timed.label,
        prior === undefined ? ms : prior * SMOOTHING + ms * (1 - SMOOTHING),
      );
    }
  }

  /**
   * Every pass's time added up, in milliseconds. The sum of the brackets rather
   * than one bracket around the frame: a timer query cannot contain another, so a
   * whole-frame reading and a per-pass breakdown cannot both be taken.
   */
  get total(): number {
    let sum = 0;
    for (const ms of this.passes.values()) sum += ms;
    return sum;
  }

  /** Forgets every reading, so a stale number cannot outlive its pass. */
  clear(): void {
    this.passes.clear();
  }
}
