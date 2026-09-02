import { Quaternion, Vector3 } from 'three';
import type * as THREE from 'three';

/**
 * The aiming dot, kept legible against whatever it is over.
 *
 * Read the pixel actually behind it and flip the dot between near black and
 * near white: two flat colours, always at full contrast, and never a hue the
 * scene did not ask for. `mix-blend-mode: difference` is the cheap version and
 * fails exactly where it matters — a per-channel inversion of mid grey is
 * another mid grey.
 *
 * `gl.readPixels` on the default framebuffer, one pixel, immediately after the
 * composer has drawn — into a pixel pack buffer behind a fence, so the frame
 * never waits on the GPU: the pixel is collected a frame or two later, once the
 * fence reports done. It runs `INTERVAL` frames apart while the camera is
 * moving, since a still camera is looking at the same pixel, and drops to
 * `STILL_INTERVAL` otherwise, often enough that a flame guttering behind the
 * dot is noticed.
 *
 * The pipeline chunks the image to three-pixel blocks before this runs, so the
 * sample is the colour of the block the crosshair sits in rather than a lone
 * pixel of noise.
 *
 * Two thresholds with a gap between them, not one: a surface hovering near a
 * single threshold flips the dot as the camera breathes, and a crosshair that
 * flickers is worse than one that is merely hard to see.
 */

/** Frames between samples while the view is moving. Six is about ten a second. */
const INTERVAL = 6;
/** And while it is not. A second apart, for whatever moves on its own. */
const STILL_INTERVAL = 60;
/**
 * How much the camera has to move to count as moving. Squared metres against
 * the position and one minus the dot product against the orientation, which
 * for small angles is about half the angle squared — so a millimetre and a
 * hundredth of a degree. Small enough that the mouse cannot be moved without
 * tripping it, large enough that arithmetic noise in a standing pose cannot.
 */
const MOVED = 1e-6;
/** Above this the background is light, so the dot goes dark. */
const TO_DARK = 0.55;
/** Below this the background is dark, so the dot goes light. */
const TO_LIGHT = 0.42;

export class Crosshair {
  private readonly element: HTMLElement | null;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly pixel = new Uint8Array(4);
  private buffer: WebGLBuffer | null = null;
  /** The read in flight, if any. One at a time. */
  private fence: WebGLSync | null = null;
  private countdown = 0;
  private onLight = false;
  /** Where the camera stood last frame, for the still test. */
  private readonly at = new Vector3();
  private readonly facing = new Quaternion();

  constructor(renderer: THREE.WebGLRenderer, element = document.getElementById('crosshair')) {
    this.renderer = renderer;
    this.element = element;
  }

  /**
   * Samples the frame and updates the dot. Call straight after rendering, and
   * not at the top of the next frame: the default framebuffer's contents are
   * only reliably readable before the browser has composited it.
   */
  update(camera: THREE.Camera): void {
    if (!this.element) return;

    // The world matrices are current: `PostFX.render` updates them and this is
    // called straight afterwards.
    _position.setFromMatrixPosition(camera.matrixWorld);
    _quaternion.setFromRotationMatrix(camera.matrixWorld);
    const moved =
      _position.distanceToSquared(this.at) > MOVED ||
      1 - Math.abs(_quaternion.dot(this.facing)) > MOVED;
    this.at.copy(_position);
    this.facing.copy(_quaternion);

    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (this.fence) this.collect(gl);

    this.countdown--;
    // A view that has just started moving does not sit out the rest of a still
    // interval — the dot would be a second behind the first flick of the mouse.
    if (moved && this.countdown > INTERVAL) this.countdown = INTERVAL;
    if (this.countdown > 0) return;
    this.countdown = moved ? INTERVAL : STILL_INTERVAL;
    if (this.fence) return;

    // The pipeline may have left a target bound, and reading the wrong buffer
    // would sample an intermediate pass — the failure looks like the dot
    // deciding at random.
    this.renderer.setRenderTarget(null);

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    if (width === 0 || height === 0) return;

    this.buffer ??= gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.buffer);
    // A fresh store per sample, so the driver's readback copy is never written
    // over before it has been read.
    gl.bufferData(gl.PIXEL_PACK_BUFFER, 4, gl.STREAM_READ);
    gl.readPixels(width >> 1, height >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    this.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
  }

  /** Takes the pixel if the read has landed. Never waits. */
  private collect(gl: WebGL2RenderingContext): void {
    if (!this.fence || !this.element) return;
    const status = gl.clientWaitSync(this.fence, 0, 0);
    if (status !== gl.ALREADY_SIGNALED && status !== gl.CONDITION_SATISFIED) return;
    gl.deleteSync(this.fence);
    this.fence = null;
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.buffer);
    gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, this.pixel);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

    // Rec. 709 luma on the sRGB values as they sit in the buffer, deliberately
    // not linearised: the question is how bright this looks to a person, and
    // the encoded value is already a perceptual scale.
    const luma =
      (0.2126 * this.pixel[0] + 0.7152 * this.pixel[1] + 0.0722 * this.pixel[2]) / 255;

    const next = this.onLight ? luma > TO_LIGHT : luma > TO_DARK;
    if (next === this.onLight) return;
    this.onLight = next;
    this.element.classList.toggle('on-light', next);
  }
}

/** Reused; the still test runs every frame and must allocate nothing. */
const _position = new Vector3();
const _quaternion = new Quaternion();
