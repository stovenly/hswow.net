/**
 * Where a chart is looked at from: a scale, a point held at the middle of the
 * window, and — for the local map — the turn that puts north up.
 *
 * Shared by both windows, so scrolling means the same thing in each.
 */

/** What a chart is drawn on and with: the two interface colours, two faces, and the display's density. */
export interface Sheet {
  ink: string;
  void: string;
  font: string;
  /** The serif the reading screen uses. A map is its own register, and every map anybody wants to look at sets its place names in one. */
  prose: string;
  /** Backing-store pixels per CSS pixel. Everything a drawer states is in CSS pixels. */
  density: number;
}

/** Times the fitting scale a chart may be pulled in to, and pushed out past. */
const CEILING = 6;
const FLOOR = 0.3;

export class ChartView {
  /** Pixels per chart unit. For the local map that unit is a metre. */
  scale = 1;
  /** The chart point at the middle of the window. */
  x = 0;
  y = 0;
  /** Radians the chart is turned by on the way to the screen. */
  rotation = 0;
  /** The scale at which the whole chart fits, and the floor zoom may not go below. */
  private floor = 1;
  private settled = false;

  /** Whether this window has been shown yet. A first sight is always a fit. */
  get ready(): boolean {
    return this.settled;
  }

  /**
   * How far in the view is on the scale where the whole chart fits, which is 1.
   * What the marks on a chart are sized by: they belong to the chart and not to
   * the window, so pulling in makes them larger the way everything else drawn
   * on the ground does.
   */
  get drawn(): number {
    return this.floor > 0 ? this.scale / this.floor : 1;
  }

  /**
   * Sets the floor from what has to fit, and — the first time, or when asked —
   * puts the view there. `over` is a multiple of the fitting scale, for an
   * interior that would otherwise sit as a postage stamp in the middle of a
   * window sized for a village.
   */
  fit(
    w: number,
    h: number,
    span: { x: number; y: number; w: number; h: number },
    margin: number,
    over = 1,
  ): void {
    const room = Math.max(1, Math.min(w - margin * 2, h - margin * 2));
    const across = Math.max(span.w, span.h, 0.001);
    this.floor = room / across;
    if (this.settled) {
      this.scale = this.hold(this.scale);
      return;
    }
    this.settled = true;
    this.scale = this.floor * over;
    this.x = span.x + span.w / 2;
    this.y = span.y + span.h / 2;
  }

  /** Puts the view back at the fit, for a window whose chart has been replaced. */
  reset(): void {
    this.settled = false;
  }

  /** Chart to window pixels. */
  project(x: number, y: number, w: number, h: number, out: [number, number]): [number, number] {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    const dx = x - this.x;
    const dy = y - this.y;
    out[0] = w / 2 + this.scale * (dx * cos - dy * sin);
    out[1] = h / 2 + this.scale * (dx * sin + dy * cos);
    return out;
  }

  /** And back, for zooming about the pointer. */
  unproject(px: number, py: number, w: number, h: number): [number, number] {
    const cos = Math.cos(-this.rotation);
    const sin = Math.sin(-this.rotation);
    const dx = (px - w / 2) / this.scale;
    const dy = (py - h / 2) / this.scale;
    return [this.x + (dx * cos - dy * sin), this.y + (dx * sin + dy * cos)];
  }

  /**
   * The whole transform, for drawing the picture itself in chart units.
   * `density` is backing-store pixels per CSS pixel: every other number here is
   * in CSS pixels, and a canvas set outright cannot inherit a scale.
   */
  matrix(w: number, h: number, density: number): [number, number, number, number, number, number] {
    const cos = Math.cos(this.rotation) * this.scale * density;
    const sin = Math.sin(this.rotation) * this.scale * density;
    return [
      cos,
      sin,
      -sin,
      cos,
      (w / 2) * density - (this.x * cos - this.y * sin),
      (h / 2) * density - (this.x * sin + this.y * cos),
    ];
  }

  /**
   * The zoom, held inside its range. The chart fitting the window is where a
   * view opens, not where it stops: there is room to pull back past it, because
   * seeing where a level sits inside its own country is worth having.
   */
  private hold(scale: number): number {
    return Math.min(this.floor * CEILING, Math.max(this.floor * FLOOR, scale));
  }

  /** Scroll, about the pointer: the chart point under the cursor stays under it. */
  zoomAt(px: number, py: number, by: number, w: number, h: number): void {
    const [hx, hy] = this.unproject(px, py, w, h);
    this.scale = this.hold(this.scale * by);
    const [nx, ny] = this.unproject(px, py, w, h);
    this.x += hx - nx;
    this.y += hy - ny;
  }

  /** Drag, in window pixels. */
  panBy(dx: number, dy: number): void {
    const cos = Math.cos(-this.rotation);
    const sin = Math.sin(-this.rotation);
    const mx = dx / this.scale;
    const my = dy / this.scale;
    this.x -= mx * cos - my * sin;
    this.y -= mx * sin + my * cos;
  }
}

/** Back to CSS pixels, after a drawer has set the transform outright. */
export function inPixels(context: CanvasRenderingContext2D, density: number): void {
  context.setTransform(density, 0, 0, density, 0, 0);
}
