/**
 * A floating panel: dragged by its header, resized by any edge or corner, its
 * geometry remembered in localStorage per machine and clamped back on screen
 * whenever the viewport shrinks. Geometry only — what stands inside is the
 * caller's business.
 */

export interface FloatingRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Limits {
  minW: number;
  minH: number;
}

/** Pixels of screen edge every window must keep hold of. */
const MARGIN = 8;

const HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type Handle = (typeof HANDLES)[number];

export class Floating {
  readonly root: HTMLDivElement;
  /** Room in the header for a caller's buttons, right of the title. */
  readonly tools: HTMLSpanElement;
  readonly body: HTMLDivElement;

  private readonly titleEl: HTMLSpanElement;
  private readonly storageKey: string;
  private readonly limits: Limits;
  private rect: FloatingRect;
  private drag: { mode: 'move' | Handle; x: number; y: number; from: FloatingRect } | null = null;

  constructor(parent: HTMLElement, storageKey: string, limits: Limits, fallback: () => FloatingRect) {
    this.storageKey = storageKey;
    this.limits = limits;

    this.root = document.createElement('div');
    this.root.className = 'inv-window';

    const head = document.createElement('div');
    head.className = 'inv-window-head';
    head.addEventListener('pointerdown', (event) => this.begin('move', event, head));

    this.titleEl = document.createElement('span');
    this.titleEl.className = 'inv-window-title';

    this.tools = document.createElement('span');
    this.tools.className = 'inv-window-tools';
    // Buttons must not start a window drag under a click.
    this.tools.addEventListener('pointerdown', (event) => event.stopPropagation());

    head.append(this.titleEl, this.tools);

    this.body = document.createElement('div');
    this.body.className = 'inv-window-body';

    this.root.append(head, this.body);
    for (const handle of HANDLES) {
      const edge = document.createElement('div');
      edge.className = `inv-resize inv-resize-${handle}`;
      edge.addEventListener('pointerdown', (event) => this.begin(handle, event, edge));
      this.root.append(edge);
    }
    parent.append(this.root);

    this.rect = this.clamp(restore(storageKey) ?? fallback());
    this.apply();
    window.addEventListener('resize', this.handleViewport);
  }

  setTitle(text: string): void {
    this.titleEl.textContent = text;
  }

  dispose(): void {
    window.removeEventListener('resize', this.handleViewport);
    this.root.remove();
  }

  private apply(): void {
    this.root.style.left = `${this.rect.x}px`;
    this.root.style.top = `${this.rect.y}px`;
    this.root.style.width = `${this.rect.w}px`;
    this.root.style.height = `${this.rect.h}px`;
  }

  private clamp(rect: FloatingRect): FloatingRect {
    const w = Math.min(Math.max(rect.w, this.limits.minW), window.innerWidth - MARGIN * 2);
    const h = Math.min(Math.max(rect.h, this.limits.minH), window.innerHeight - MARGIN * 2);
    const x = Math.min(Math.max(rect.x, MARGIN), window.innerWidth - w - MARGIN);
    const y = Math.min(Math.max(rect.y, MARGIN), window.innerHeight - h - MARGIN);
    return { x, y, w, h };
  }

  private begin(mode: 'move' | Handle, event: PointerEvent, on: HTMLElement): void {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    this.drag = { mode, x: event.clientX, y: event.clientY, from: { ...this.rect } };
    on.setPointerCapture(event.pointerId);
    on.addEventListener('pointermove', this.handleMove);
    on.addEventListener('pointerup', this.handleUp);
    on.addEventListener('pointercancel', this.handleUp);
  }

  private readonly handleMove = (event: PointerEvent): void => {
    const drag = this.drag;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const from = drag.from;

    if (drag.mode === 'move') {
      this.rect = this.clamp({ ...from, x: from.x + dx, y: from.y + dy });
      this.apply();
      return;
    }

    let { x, y, w, h } = from;
    if (drag.mode.includes('e')) w = from.w + dx;
    if (drag.mode.includes('s')) h = from.h + dy;
    if (drag.mode.includes('w')) {
      w = from.w - dx;
      x = from.x + dx;
    }
    if (drag.mode.includes('n')) {
      h = from.h - dy;
      y = from.y + dy;
    }
    // A pull past the minimum anchors the far edge instead of sliding the box.
    if (w < this.limits.minW) {
      if (drag.mode.includes('w')) x = from.x + from.w - this.limits.minW;
      w = this.limits.minW;
    }
    if (h < this.limits.minH) {
      if (drag.mode.includes('n')) y = from.y + from.h - this.limits.minH;
      h = this.limits.minH;
    }
    this.rect = this.clamp({ x, y, w, h });
    this.apply();
  };

  private readonly handleUp = (event: PointerEvent): void => {
    const on = event.currentTarget as HTMLElement;
    on.removeEventListener('pointermove', this.handleMove);
    on.removeEventListener('pointerup', this.handleUp);
    on.removeEventListener('pointercancel', this.handleUp);
    this.drag = null;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.rect));
    } catch {
      // A machine preference; losing it costs a default.
    }
  };

  private readonly handleViewport = (): void => {
    this.rect = this.clamp(this.rect);
    this.apply();
  };
}

function restore(key: string): FloatingRect | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const held = JSON.parse(raw) as FloatingRect;
    if ([held.x, held.y, held.w, held.h].some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
      return null;
    }
    return held;
  } catch {
    return null;
  }
}
