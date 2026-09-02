import { Floating, type FloatingRect } from './Floating';
import {
  drawLocal,
  localSpan,
  LOCAL_MARGIN,
  LOCAL_ZOOM,
  type LocalChart,
  type Mark,
} from './map/local';
import { linkPrompt } from './Reticle';
import type { PortalSide } from '../world/Portal';
import { ChartView, inPixels, type Sheet } from './map/view';
import { drawWorld, type Discovery, type WorldChart } from './map/world';

/**
 * The map screen: two floating windows over the world, the world map on the
 * left and the local map on the right, opened and closed together on one key.
 *
 * Neither is a minimap. Both are things you stop to open, so this releases the
 * pointer lock on the way in and takes it back on the way out, exactly as the
 * inventory does — and, like the inventory, it leaves the world visible behind
 * a scrim rather than pausing it.
 */

export interface MapSource {
  /** Called on the way in, where the pointer lock is given up. */
  onOpen(): void;
  /** And on the way out, where it is taken back. */
  onClose(): void;
  /** What the local window draws. Null before the player is anywhere. */
  local(): LocalChart | null;
  /** The name of the place the local window is of. */
  here(): string;
  /** The chart is null while the pool is still raising it. */
  world(): { chart: WorldChart | null; seen: Discovery };
}

const LIMITS = { minW: 260, minH: 240 };

/** Pixels of the window's edge a chart keeps clear of. */
const MARGIN = 18;

export class MapScreen {
  private readonly root: HTMLDivElement;
  private readonly worldWindow: Floating;
  private readonly localWindow: Floating;
  private readonly worldCanvas: HTMLCanvasElement;
  private readonly localCanvas: HTMLCanvasElement;
  private readonly worldView = new ChartView();
  private readonly localView = new ChartView();
  private readonly source: MapSource;
  private readonly observer: ResizeObserver;
  private readonly tip: HTMLDivElement;
  private readonly tipTitle: HTMLSpanElement;
  private readonly tipJoiner: HTMLSpanElement;
  private readonly tipTarget: HTMLSpanElement;
  private open_ = false;
  private drag: { canvas: HTMLCanvasElement; x: number; y: number } | null = null;
  /** The marks the last redraw laid down, so the cursor is tested against what is on screen. */
  private marks: Mark[] = [];
  /** What the tip is about. `'you'` rather than a mark, because the marks are rebuilt on every redraw. */
  private hovered: PortalSide | 'you' | null = null;

  constructor(overlay: HTMLElement, source: MapSource) {
    this.source = source;

    this.root = document.createElement('div');
    this.root.id = 'map';
    this.root.hidden = true;

    // Invisible and necessary, for the inventory's reason: without it a click
    // beside the windows lands on the canvas and takes pointer lock back.
    const scrim = document.createElement('div');
    scrim.className = 'map-scrim';
    this.root.append(scrim);

    this.worldWindow = new Floating(this.root, 'hswow:ui:chart-world', LIMITS, () => half(true));
    this.worldWindow.setTitle('world');
    this.localWindow = new Floating(this.root, 'hswow:ui:chart-local', LIMITS, () => half(false));

    this.worldCanvas = canvasIn(this.worldWindow);
    this.localCanvas = canvasIn(this.localWindow);

    for (const canvas of [this.worldCanvas, this.localCanvas]) {
      canvas.addEventListener('wheel', this.handleWheel, { passive: false });
      canvas.addEventListener('pointerdown', this.handleDown);
    }
    this.localCanvas.addEventListener('pointermove', this.handleHover);
    this.localCanvas.addEventListener('pointerleave', this.handleLeave);

    // The crosshair's own three lines, in the crosshair's own classes: a door
    // is named once, and the map asks rather than answering.
    this.tip = document.createElement('div');
    this.tip.id = 'map-tip';
    this.tip.hidden = true;
    const lines = document.createElement('span');
    lines.className = 'prompt-lines';
    this.tipTitle = document.createElement('span');
    this.tipTitle.className = 'prompt-title';
    this.tipJoiner = document.createElement('span');
    this.tipJoiner.className = 'prompt-to';
    this.tipJoiner.textContent = 'to';
    this.tipTarget = document.createElement('span');
    this.tipTarget.className = 'prompt-target';
    lines.append(this.tipTitle, this.tipJoiner, this.tipTarget);
    this.tip.append(lines);
    this.root.append(this.tip);

    this.observer = new ResizeObserver(() => this.draw());
    this.observer.observe(this.worldWindow.body);
    this.observer.observe(this.localWindow.body);

    overlay.append(this.root);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  get shown(): boolean {
    return this.open_;
  }

  show(): void {
    if (this.open_) return;
    this.open_ = true;
    this.root.hidden = false;
    document.body.classList.add('is-map');
    this.draw();
    this.source.onOpen();
  }

  hide(): void {
    if (!this.open_) return;
    this.open_ = false;
    this.drag = null;
    this.hovered = null;
    this.tip.hidden = true;
    this.root.hidden = true;
    document.body.classList.remove('is-map');
    this.source.onClose();
  }

  toggle(): void {
    if (this.open_) this.hide();
    else this.show();
  }

  /** The world chart has arrived. */
  charted(): void {
    if (this.open_) this.draw();
  }

  /** A new zone is a new chart: the local window opens at its fit rather than at the last one's zoom. */
  zoneChanged(): void {
    this.localView.reset();
    if (this.open_) this.draw();
  }

  dispose(): void {
    this.observer.disconnect();
    window.removeEventListener('keydown', this.handleKeyDown);
    this.worldWindow.dispose();
    this.localWindow.dispose();
    this.root.remove();
  }

  private draw(): void {
    if (!this.open_) return;
    const ink = sheetOf(this.root);
    this.localWindow.setTitle(this.source.here().toLowerCase());

    const local = this.source.local();
    const localContext = fit(this.localCanvas, ink.density);
    if (localContext && local) {
      const box = this.localCanvas;
      // Turned so world north is up. `bearing` is how far the zone's own +Z is
      // turned from world +Z, so the chart is turned back by it.
      this.localView.rotation = -local.bearing;
      // No extra pull for an interior: the span is the level itself, so a
      // cottage fills its window exactly as a village does.
      this.localView.fit(
        box.clientWidth,
        box.clientHeight,
        localSpan(local.plan),
        LOCAL_MARGIN,
        LOCAL_ZOOM,
      );
      this.marks = drawLocal(
        localContext,
        box.clientWidth,
        box.clientHeight,
        this.localView,
        local,
        ink,
        this.hovered === 'you' ? null : this.hovered,
      );
    } else if (localContext) {
      this.marks = [];
      blank(localContext, this.localCanvas, ink);
    }

    const worldContext = fit(this.worldCanvas, ink.density);
    if (worldContext) {
      const box = this.worldCanvas;
      const { chart, seen } = this.source.world();
      if (chart) {
        this.worldView.fit(box.clientWidth, box.clientHeight, chart.span, MARGIN);
        drawWorld(worldContext, box.clientWidth, box.clientHeight, this.worldView, chart, seen, ink);
      } else {
        blank(worldContext, this.worldCanvas, ink);
      }
    }
  }

  private viewFor(canvas: HTMLCanvasElement): ChartView {
    return canvas === this.worldCanvas ? this.worldView : this.localView;
  }

  private readonly handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const canvas = event.currentTarget as HTMLCanvasElement;
    const box = canvas.getBoundingClientRect();
    this.viewFor(canvas).zoomAt(
      event.clientX - box.left,
      event.clientY - box.top,
      Math.pow(0.999, event.deltaY),
      box.width,
      box.height,
    );
    this.draw();
  };

  private readonly handleHover = (event: PointerEvent): void => {
    if (this.drag) return;
    const box = this.localCanvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    let found: Mark | null = null;
    for (const mark of this.marks) {
      if (Math.hypot(mark.x - x, mark.y - y) <= mark.r + 3) found = mark;
    }
    this.localCanvas.style.cursor = found ? 'pointer' : '';
    if (found) {
      const prompt = found.side ? linkPrompt(found.side.title, found.side.label) : { title: 'You' };
      this.tipTitle.textContent = prompt.title;
      this.tipTarget.textContent = prompt.target ?? '';
      this.tipJoiner.hidden = !prompt.target;
      this.tipTarget.hidden = !prompt.target;
      this.tip.hidden = false;
      this.tip.style.left = `${event.clientX}px`;
      this.tip.style.top = `${event.clientY}px`;
    } else {
      this.tip.hidden = true;
    }
    const on = found ? (found.side ?? 'you') : null;
    if (on !== this.hovered) {
      this.hovered = on;
      this.draw();
    }
  };

  private readonly handleLeave = (): void => {
    this.tip.hidden = true;
    this.localCanvas.style.cursor = '';
    if (!this.hovered) return;
    this.hovered = null;
    this.draw();
  };

  private readonly handleDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    const canvas = event.currentTarget as HTMLCanvasElement;
    this.drag = { canvas, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
    canvas.addEventListener('pointermove', this.handleMove);
    canvas.addEventListener('pointerup', this.handleUp);
    canvas.addEventListener('pointercancel', this.handleUp);
  };

  private readonly handleMove = (event: PointerEvent): void => {
    const drag = this.drag;
    if (!drag) return;
    this.viewFor(drag.canvas).panBy(event.clientX - drag.x, event.clientY - drag.y);
    drag.x = event.clientX;
    drag.y = event.clientY;
    this.draw();
  };

  private readonly handleUp = (event: PointerEvent): void => {
    const canvas = event.currentTarget as HTMLCanvasElement;
    canvas.removeEventListener('pointermove', this.handleMove);
    canvas.removeEventListener('pointerup', this.handleUp);
    canvas.removeEventListener('pointercancel', this.handleUp);
    this.drag = null;
  };

  // Tab as well as Escape: the pack's key is what a hand reaches for to put a
  // screen away, and with the map up it has nothing else to mean.
  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.open_ || event.repeat) return;
    if (event.code !== 'Escape' && event.code !== 'Tab') return;
    event.preventDefault();
    this.hide();
  };
}

function canvasIn(panel: Floating): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.className = 'map-canvas';
  panel.body.append(canvas);
  return canvas;
}

/** Sizes the backing store to the window's box at the display's own density. */
function fit(canvas: HTMLCanvasElement, density: number): CanvasRenderingContext2D | null {
  const context = canvas.getContext('2d');
  if (!context) return null;
  const w = Math.max(1, Math.round(canvas.clientWidth * density));
  const h = Math.max(1, Math.round(canvas.clientHeight * density));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return context;
}

function blank(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ink: Sheet): void {
  inPixels(context, ink.density);
  context.fillStyle = ink.void;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function sheetOf(root: HTMLElement): Sheet {
  const style = getComputedStyle(root);
  return {
    ink: style.getPropertyValue('--ink').trim() || '#dcdcc8',
    void: style.getPropertyValue('--void').trim() || '#0a0a0f',
    font: style.fontFamily,
    prose: style.getPropertyValue('--prose').trim() || 'Georgia, serif',
    density: Math.min(globalThis.devicePixelRatio || 1, 2),
  };
}

/** Half the screen each, side by side. A chart is a thing you stop to read. */
function half(left: boolean): FloatingRect {
  const margin = Math.max(12, Math.round(window.innerWidth * 0.025));
  const gap = 14;
  const w = Math.floor((window.innerWidth - margin * 2 - gap) / 2);
  const h = Math.round(window.innerHeight * 0.86);
  const y = Math.round((window.innerHeight - h) / 2);
  return { x: left ? margin : margin + w + gap, y, w, h };
}
