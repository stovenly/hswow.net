import type * as THREE from 'three';

/**
 * The aiming dot, kept legible against whatever it is over.
 *
 * It used to be `mix-blend-mode: difference`, which is the cheap version of
 * this and reads badly. Difference is a per-channel inversion, so over a mid
 * grey it produces another mid grey — the crosshair *disappears* exactly at the
 * luminance where it most needs to be visible — and over a saturated colour it
 * comes out as that colour's complement, which is a coloured dot rather than a
 * sight. Against the pale floor the galleries and the Proving Ground now use,
 * it was barely there.
 *
 * So instead: look at what is actually behind it, and flip the dot between near
 * black and near white. Two flat colours, always at full contrast, and never a
 * hue the scene did not ask for.
 *
 * ## Reading the pixel
 *
 * `gl.readPixels` on the default framebuffer, one pixel, immediately after the
 * composer has drawn. A one-pixel readback forces the GPU pipeline to
 * synchronise, which is the reason not to do it every frame — so it runs at
 * `INTERVAL` frames apart, which is far faster than the eye needs for something
 * that only changes when you look somewhere else.
 *
 * The pipeline chunks the image to three-pixel blocks before this runs, so the
 * sample is not a lone pixel of noise: it is the colour of the block the
 * crosshair is sitting in, which is exactly the thing it has to contrast with.
 *
 * ## Hysteresis, or it strobes
 *
 * A single threshold means any surface hovering near it flips the dot on and
 * off as the camera breathes — and a crosshair that flickers is worse than one
 * that is merely hard to see, because the eye is drawn to change. Two
 * thresholds with a gap between them mean the background has to move
 * meaningfully before the dot commits.
 */

/** Frames between samples. Six is about ten reads a second at 60 fps. */
const INTERVAL = 6;
/** Above this the background is light, so the dot goes dark. */
const TO_DARK = 0.55;
/** Below this the background is dark, so the dot goes light. */
const TO_LIGHT = 0.42;

export class Crosshair {
  private readonly element: HTMLElement | null;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly pixel = new Uint8Array(4);
  private countdown = 0;
  private onLight = false;

  constructor(renderer: THREE.WebGLRenderer, element = document.getElementById('crosshair')) {
    this.renderer = renderer;
    this.element = element;
  }

  /**
   * Samples the frame and updates the dot. Call straight after rendering.
   *
   * Straight after, and not at the top of the next frame: the default
   * framebuffer's contents are only reliably readable before the browser has
   * composited it.
   */
  update(): void {
    if (!this.element) return;
    if (this.countdown-- > 0) return;
    this.countdown = INTERVAL;

    const gl = this.renderer.getContext();
    // The pipeline may have left a target bound. Reading the wrong buffer would
    // sample an intermediate pass — usually the un-dithered scene, occasionally
    // a depth-normal buffer, and the failure looks like the dot deciding at
    // random.
    this.renderer.setRenderTarget(null);

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    if (width === 0 || height === 0) return;

    gl.readPixels(
      width >> 1,
      height >> 1,
      1,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.pixel,
    );

    // Rec. 709 luma on the sRGB values as they sit in the buffer. Deliberately
    // not linearised: the question is how bright this looks to a person, and
    // the encoded value is already a perceptual scale — converting to linear
    // light first would call a mid grey much darker than anyone sees it.
    const luma =
      (0.2126 * this.pixel[0] + 0.7152 * this.pixel[1] + 0.0722 * this.pixel[2]) / 255;

    const next = this.onLight ? luma > TO_LIGHT : luma > TO_DARK;
    if (next === this.onLight) return;
    this.onLight = next;
    this.element.classList.toggle('on-light', next);
  }
}
