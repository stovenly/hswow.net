import type { Menu } from './Menu';
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
 * The maps: two tabs of the menu, the local map and the world map, each one
 * canvas filling its pane. Neither is a minimap; both are things you stop to
 * open.
 */

export interface MapSource {
  /** What the local window draws. Null before the player is anywhere. */
  local(): LocalChart | null;
  /** The name of the place the local window is of. */
  here(): string;
  /** The chart is null while the pool is still raising it. */
  world(): { chart: WorldChart | null; seen: Discovery };
}

/** Pixels of the window's edge a chart keeps clear of. */
const MARGIN = 18;

export class MapScreen {
  private readonly root: HTMLDivElement;
  private readonly caption: HTMLDivElement;
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
  private active = false;
  private drag: { canvas: HTMLCanvasElement; x: number; y: number } | null = null;
  /** The marks the last redraw laid down, so the cursor is tested against what is on screen. */
  private marks: Mark[] = [];
  /** What the tip is about. `'you'` rather than a mark, because the marks are rebuilt on every redraw. */
  private hovered: PortalSide | 'you' | null = null;

  constructor(menu: Menu, source: MapSource) {
    this.source = source;
    this.root = menu.root;

    const local = menu.pane('map');
    local.classList.add('map-pane');
    this.caption = document.createElement('div');
    this.caption.className = 'map-caption';
    local.append(this.caption);
    this.localCanvas = canvasIn(local);

    const world = menu.pane('world');
    world.classList.add('map-pane');
    this.worldCanvas = canvasIn(world);

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
    this.observer.observe(local);
    this.observer.observe(world);

    const pane = { activate: () => this.activate(), deactivate: () => this.deactivate() };
    menu.mount('map', pane);
    menu.mount('world', pane);
  }

  private activate(): void {
    this.active = true;
    this.draw();
  }

  private deactivate(): void {
    this.active = false;
    this.drag = null;
    this.hovered = null;
    this.tip.hidden = true;
  }

  /** The world chart has arrived. */
  charted(): void {
    if (this.active) this.draw();
  }

  /** A new zone is a new chart: the local window opens at its fit rather than at the last one's zoom. */
  zoneChanged(): void {
    this.localView.reset();
    if (this.active) this.draw();
  }

  dispose(): void {
    this.observer.disconnect();
    this.tip.remove();
  }

  /** Whichever canvas is up; a hidden pane's has no box to draw into. */
  private draw(): void {
    if (!this.active) return;
    const ink = sheetOf(this.root);
    this.caption.textContent = this.source.here().toLowerCase();

    const local = this.source.local();
    const localContext = this.localCanvas.clientWidth > 0 ? fit(this.localCanvas, ink.density) : null;
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

    const worldContext = this.worldCanvas.clientWidth > 0 ? fit(this.worldCanvas, ink.density) : null;
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

}

function canvasIn(pane: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.className = 'map-canvas';
  pane.append(canvas);
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
