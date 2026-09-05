import type { Menu, Pane } from './Menu';
import { START_DAY, planSky, type Climate, type DeckTarget } from '../world/climate';
import { DECK_LEVELS, GENERA } from '../art/glsl/clouds';
import { hash } from '../audio/weather';

/**
 * The time tab: the day and the hour as a clock face, and a wait of one to
 * twenty-four hours run with the world on screen behind it. Midnight is at the
 * bottom of the ring and noon at the top, so the sun's place on the ring is
 * its place in the sky.
 */

/** Real seconds one game hour takes while waiting. */
const HOUR_SECONDS = 0.65;
/** Degrees per real second the sky turns behind the ring. */
const SKY_TURN = 1.2;
const SKY_PX = 192;
const SVG = 'http://www.w3.org/2000/svg';
const SIZE = 400;
const CENTRE = SIZE / 2;
const RING = 168;
const RING_WIDTH = 22;

type State = 'idle' | 'choosing' | 'waiting' | 'stopping';

/** `9:42 am`, twelve-hour, minutes floored. */
export function formatClock(timeOfDay: number): string {
  const minutes = Math.floor((((timeOfDay % 1) + 1) % 1) * 1440);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`;
}

/** Day one is the day a new game begins. */
export function dayNumber(elapsedDays: number): number {
  return Math.floor(elapsedDays) - START_DAY + 1;
}

/** Where an hour (0..24) falls on the ring: midnight at the bottom, clockwise. */
function onRing(hour: number, radius: number): [number, number] {
  const angle = (hour / 24) * Math.PI * 2;
  return [CENTRE - Math.sin(angle) * radius, CENTRE + Math.cos(angle) * radius];
}

/** An SVG arc path clockwise from an hour for a span of hours; a whole turn is two half arcs. */
function arcPath(from: number, span: number, radius: number): string {
  if (span <= 0.001) return '';
  const [x0, y0] = onRing(from, radius);
  if (span >= 23.99) {
    const [xh, yh] = onRing(from + 12, radius);
    return (
      `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${radius} ${radius} 0 0 1 ${xh.toFixed(2)} ${yh.toFixed(2)} ` +
      `A ${radius} ${radius} 0 0 1 ${x0.toFixed(2)} ${y0.toFixed(2)}`
    );
  }
  const [x1, y1] = onRing(from + span, radius);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${radius} ${radius} 0 ${span > 12 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function smoothstep(a: number, b: number, t: number): number {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function noise2(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const sx = smoothstep(0, 1, x - ix);
  const sy = smoothstep(0, 1, y - iy);
  const at = (i: number, j: number): number => hash(i * 374761393 + j * 668265263 + seed);
  const top = at(ix, iy) * (1 - sx) + at(ix + 1, iy) * sx;
  const bottom = at(ix, iy + 1) * (1 - sx) + at(ix + 1, iy + 1) * sx;
  return top * (1 - sy) + bottom * sy;
}

function fbm(x: number, y: number, seed: number): number {
  let sum = 0;
  let amp = 0.5;
  let total = 0;
  for (let octave = 0; octave < 5; octave++) {
    sum += noise2(x, y, seed + octave * 101) * amp;
    total += amp;
    x *= 2.03;
    y *= 1.97;
    amp *= 0.5;
  }
  return sum / total;
}

/** A square of sky as a data URL: blue with heaps of cloud, or a grey sheet. */
function skyTexture(overcast: boolean, seed: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = SKY_PX;
  canvas.height = SKY_PX;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(SKY_PX, SKY_PX);
  const data = image.data;
  for (let y = 0; y < SKY_PX; y++) {
    for (let x = 0; x < SKY_PX; x++) {
      const n = fbm((x / SKY_PX) * 7, (y / SKY_PX) * 7, seed);
      let r: number;
      let g: number;
      let b: number;
      if (overcast) {
        const t = 0.5 + (n - 0.5) * 0.7;
        r = 112 + t * 44;
        g = 118 + t * 44;
        b = 128 + t * 44;
      } else {
        const cloud = smoothstep(0.47, 0.62, n);
        const lit = 0.84 + 0.16 * smoothstep(0.58, 0.72, n);
        r = 88 + (250 * lit - 88) * cloud;
        g = 148 + (250 * lit - 148) * cloud;
        b = 214 + (246 * lit - 214) * cloud;
      }
      const i = (y * SKY_PX + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

function el<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

export class TimePane implements Pane {
  private readonly climate: Climate;
  private state: State = 'idle';
  /** Hours the wait would run, 1..24. */
  private target = 1;
  private startDay = 0;
  private endDay = 0;

  private readonly svg: SVGSVGElement;
  private readonly skyTurn: SVGGElement;
  private readonly sheet: SVGImageElement;
  private readonly rainTint: SVGCircleElement;
  private readonly decks: DeckTarget[] = DECK_LEVELS.map(() => ({ genus: null, amount: 0, snap: false }));
  /** How much of the sky the sheet layer hides, eased toward the weather, 0..1. */
  private cover = 0;
  private skyAngle = 0;
  private lastNow = -1;
  private readonly nightArc: SVGPathElement;
  private readonly waitArc: SVGPathElement;
  private readonly hand: SVGLineElement;
  private readonly ghost: SVGLineElement;
  private readonly sun: SVGCircleElement;
  private readonly moon: SVGGElement;
  private readonly moonShadow: SVGCircleElement;
  private readonly clockText: HTMLDivElement;
  private readonly dayText: HTMLDivElement;
  private readonly choiceText: HTMLSpanElement;
  private readonly button: HTMLButtonElement;
  private readonly progressEl: HTMLDivElement;
  private readonly progressFill: HTMLDivElement;
  private lastDaylightDay = -1;
  private dragging = false;

  constructor(menu: Menu, climate: Climate) {
    this.climate = climate;

    const pane = menu.pane('time');
    pane.classList.add('time-pane');
    const card = document.createElement('div');
    card.className = 'time-card';
    pane.append(card);

    const face = document.createElement('div');
    face.className = 'time-face';
    this.svg = el('svg', { viewBox: `0 0 ${SIZE} ${SIZE}` });
    face.append(this.svg);
    card.append(face);

    // --- the ring --------------------------------------------------------------
    const defs = el('defs');
    const sunFill = el('radialGradient', { id: 'time-sun' });
    for (const [offset, colour] of [
      [0, '#f4e6bd'],
      [0.5, '#f4e6bd'],
      [0.5, '#d9b478'],
      [0.72, '#d9b478'],
      [0.72, '#9a6f45'],
      [1, '#9a6f45'],
    ] as const) {
      sunFill.append(el('stop', { offset, 'stop-color': colour }));
    }
    const moonClip = el('clipPath', { id: 'time-moon-clip' });
    moonClip.append(el('circle', { cx: 0, cy: 0, r: 9 }));
    const band = el('mask', { id: 'time-band' });
    band.append(el('circle', { cx: CENTRE, cy: CENTRE, r: RING, fill: 'none', stroke: '#fff', 'stroke-width': RING_WIDTH }));
    defs.append(sunFill, moonClip, band);
    this.svg.append(defs);

    // The band: the sky turning behind it, a grey sheet drawn over as the cover builds, the night laid over that.
    const sky = el('g', { mask: 'url(#time-band)' });
    this.skyTurn = el('g');
    const side = (RING + RING_WIDTH / 2) * 2 + 4;
    const square = { x: CENTRE - side / 2, y: CENTRE - side / 2, width: side, height: side, preserveAspectRatio: 'none' };
    this.sheet = el('image', { ...square, href: skyTexture(true, 29), opacity: 0 });
    this.skyTurn.append(el('image', { ...square, href: skyTexture(false, 11) }), this.sheet);
    this.rainTint = el('circle', { cx: CENTRE, cy: CENTRE, r: RING, fill: 'none', stroke: 'rgb(22 26 34)', 'stroke-width': RING_WIDTH, opacity: 0 });
    sky.append(this.skyTurn, this.rainTint);
    this.svg.append(sky);
    this.nightArc = el('path', {
      fill: 'none',
      stroke: 'rgb(8 10 30 / 74%)',
      'stroke-width': RING_WIDTH,
    });
    this.svg.append(this.nightArc);

    const ticks = el('g', { stroke: 'rgb(220 220 200 / 80%)', 'stroke-width': 1.5 });
    for (let hour = 0; hour < 24; hour++) {
      const quarter = hour % 6 === 0;
      const [x0, y0] = onRing(hour, RING - RING_WIDTH / 2 - (quarter ? 10 : 4));
      const [x1, y1] = onRing(hour, RING - RING_WIDTH / 2 - 1);
      ticks.append(el('line', { x1: x0, y1: y0, x2: x1, y2: y1 }));
    }
    this.svg.append(ticks);
    for (const [hour, word] of [
      [0, 'midnight'],
      [6, 'dawn'],
      [12, 'noon'],
      [18, 'dusk'],
    ] as const) {
      const [x, y] = onRing(hour, RING - RING_WIDTH / 2 - 26);
      const label = el('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'time-label' });
      label.textContent = word;
      this.svg.append(label);
    }

    // The wait arc, inside the ring, and the ghost hand at its end.
    this.waitArc = el('path', {
      fill: 'none',
      stroke: 'rgb(217 180 120 / 75%)',
      'stroke-width': 6,
      'stroke-linecap': 'butt',
    });
    this.svg.append(this.waitArc);
    this.ghost = el('line', { stroke: 'rgb(217 180 120 / 70%)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
    this.svg.append(this.ghost);

    // The hand.
    this.hand = el('line', { stroke: 'var(--ink)', 'stroke-width': 2, 'stroke-linecap': 'round' });
    this.svg.append(this.hand);
    this.svg.append(el('circle', { cx: CENTRE, cy: CENTRE, r: 3.5, fill: 'var(--ink)' }));

    // The orbs, on the ring.
    this.sun = el('circle', { r: 13, fill: 'url(#time-sun)' });
    this.moon = el('g');
    this.moon.append(el('circle', { r: 9, fill: '#dcdcc8', stroke: '#9a958a', 'stroke-width': 2 }));
    this.moonShadow = el('circle', { r: 9, fill: '#46413a', 'clip-path': 'url(#time-moon-clip)' });
    this.moon.append(this.moonShadow);
    this.svg.append(this.sun, this.moon);

    // A transparent disc over the ring takes the drag and the wheel.
    const drag = el('circle', {
      cx: CENTRE,
      cy: CENTRE,
      r: RING + RING_WIDTH,
      fill: 'transparent',
      class: 'time-drag',
    });
    this.svg.append(drag);
    drag.addEventListener('pointerdown', (event) => {
      if (this.state !== 'choosing') return;
      event.stopPropagation();
      this.dragging = true;
      drag.classList.add('is-held');
      drag.setPointerCapture(event.pointerId);
      this.aimAt(event);
    });
    drag.addEventListener('pointermove', (event) => {
      if (this.dragging) this.aimAt(event);
    });
    const release = (): void => {
      this.dragging = false;
      drag.classList.remove('is-held');
    };
    drag.addEventListener('pointerup', release);
    drag.addEventListener('pointercancel', release);
    drag.addEventListener('wheel', (event) => {
      if (this.state !== 'choosing') return;
      event.preventDefault();
      this.nudge(event.deltaY > 0 ? 1 : -1);
    });

    // --- under the disc ---------------------------------------------------------
    this.clockText = document.createElement('div');
    this.clockText.className = 'time-clock';
    this.dayText = document.createElement('div');
    this.dayText.className = 'time-day';
    card.append(this.clockText, this.dayText);

    const choice = document.createElement('div');
    choice.className = 'time-choice';
    this.choiceText = document.createElement('span');
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'time-wait';
    this.button.textContent = 'wait';
    this.button.addEventListener('click', () => {
      if (this.state === 'choosing') this.beginWait();
      else if (this.state === 'waiting') this.stopWait();
    });
    choice.append(this.choiceText, this.button);
    card.append(choice);

    this.progressEl = document.createElement('div');
    this.progressEl.className = 'time-progress';
    this.progressFill = document.createElement('div');
    this.progressFill.className = 'time-progress-fill';
    this.progressEl.append(this.progressFill);
    card.append(this.progressEl);

    menu.mount('time', this);
  }

  activate(): void {
    this.state = 'choosing';
    this.target = 1;
    this.lastDaylightDay = -1;
    this.lastNow = -1;
    this.draw();
  }

  deactivate(): void {
    this.abandon();
    this.state = 'idle';
  }

  closed(): void {
    this.target = 1;
  }

  /** Once a frame, from the app's loop. */
  tick(): void {
    if (this.state === 'idle') return;
    if (this.state === 'waiting' || this.state === 'stopping') this.runWait();
    this.draw();
  }

  // --- choosing -----------------------------------------------------------------

  private nudge(by: number): void {
    this.target = ((this.target - 1 + by + 24) % 24) + 1;
    this.draw();
  }

  /** The hour under the pointer, as a target measured on from the hand. */
  private aimAt(event: PointerEvent): void {
    const box = this.svg.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * SIZE - CENTRE;
    const y = ((event.clientY - box.top) / box.height) * SIZE - CENTRE;
    // onRing puts hour h at (−sin, +cos) about the centre.
    const hour = ((Math.atan2(-x, y) / (Math.PI * 2)) * 24 + 24) % 24;
    const now = this.climate.timeOfDay * 24;
    const ahead = ((hour - now) % 24 + 24) % 24;
    // Right at the hand it is either one hour or the whole ring; keep whichever it already was.
    if (ahead < 0.5 || ahead > 23.5) {
      if (this.target !== 1 && this.target !== 24) this.target = 24;
    } else {
      this.target = Math.round(ahead);
    }
    this.draw();
  }

  // --- waiting ------------------------------------------------------------------

  private beginWait(): void {
    if (this.state !== 'choosing') return;
    this.state = 'waiting';
    this.startDay = this.climate.elapsedDays;
    this.endDay = this.startDay + this.target / 24;
    this.progressEl.classList.add('is-live');
    this.progressFill.style.width = '0%';
    this.button.textContent = 'stop';
    document.body.classList.add('is-waiting');
  }

  /** The wait ends at the next whole hour, keeping what it reached. */
  private stopWait(): void {
    if (this.state !== 'waiting') return;
    this.state = 'stopping';
    const done = (this.climate.elapsedDays - this.startDay) * 24;
    this.endDay = this.startDay + Math.min(this.target, Math.ceil(done + 1e-6)) / 24;
  }

  private runWait(): void {
    const climate = this.climate;
    // The dev panel's hold wins over the rate, and a wait on a held clock would never land.
    if (climate.frozen || climate.scrubbing) {
      this.finishWait();
      return;
    }
    climate.rate = climate.settings.dayLength / 24 / HOUR_SECONDS;
    if (climate.elapsedDays >= this.endDay - 1e-7) {
      climate.day = Math.floor(this.endDay);
      climate.timeOfDay = this.endDay - climate.day;
      this.finishWait();
    }
  }

  private finishWait(): void {
    this.climate.rate = 1;
    document.body.classList.remove('is-waiting');
    this.progressEl.classList.remove('is-live');
    this.button.textContent = 'wait';
    this.state = 'choosing';
    this.target = 1;
  }

  /** The tab or the window went away mid-wait: the clock keeps what it reached, at once. */
  private abandon(): void {
    if (this.state !== 'waiting' && this.state !== 'stopping') return;
    this.finishWait();
  }

  // --- drawing ------------------------------------------------------------------

  private draw(): void {
    const climate = this.climate;
    const hour = climate.timeOfDay * 24;
    const now = performance.now();
    const dt = this.lastNow < 0 ? 0 : (now - this.lastNow) / 1000;
    this.lastNow = now;

    this.skyAngle = (this.skyAngle + dt * SKY_TURN) % 360;
    this.skyTurn.setAttribute('transform', `rotate(${this.skyAngle.toFixed(2)} ${CENTRE} ${CENTRE})`);
    planSky(climate, this.decks);
    let clear = 1;
    for (const deck of this.decks) {
      if (!deck.genus) continue;
      const genus = GENERA[deck.genus];
      clear *= 1 - genus.cover * genus.opacity * deck.amount;
    }
    const cover = Math.max(1 - clear, climate.amountOf('fog'));
    this.cover += (cover - this.cover) * Math.min(1, dt * 1.5);
    this.sheet.setAttribute('opacity', this.cover.toFixed(3));
    this.rainTint.setAttribute('opacity', (climate.falling * 0.45).toFixed(3));

    if (Math.floor(climate.elapsedDays) !== this.lastDaylightDay) {
      this.lastDaylightDay = Math.floor(climate.elapsedDays);
      const light = climate.daylight();
      if (light) this.nightArc.setAttribute('d', arcPath(light.set * 24, ((light.rise - light.set) % 1 + 1) % 1 * 24, RING));
      else this.nightArc.setAttribute('d', climate.sunElevation > 0 ? '' : arcPath(0, 24, RING));
    }

    const [hx, hy] = onRing(hour, RING - RING_WIDTH / 2 - 2);
    this.hand.setAttribute('x1', String(CENTRE));
    this.hand.setAttribute('y1', String(CENTRE));
    this.hand.setAttribute('x2', hx.toFixed(2));
    this.hand.setAttribute('y2', hy.toFixed(2));

    const [sx, sy] = onRing(hour, RING);
    this.sun.setAttribute('cx', sx.toFixed(2));
    this.sun.setAttribute('cy', sy.toFixed(2));
    const [mx, my] = onRing(hour + 12, RING);
    this.moon.setAttribute('transform', `translate(${mx.toFixed(2)} ${my.toFixed(2)})`);
    // Waxing is lit on the right, so the shadow slides off to the left; waning the other way.
    const phase = climate.moonPhase;
    const shown = 1 - Math.abs(phase - 0.5) * 2;
    this.moonShadow.setAttribute('cx', ((phase < 0.5 ? -1 : 1) * shown * 18).toFixed(2));

    const waiting = this.state === 'waiting' || this.state === 'stopping';
    const span = waiting ? Math.max(0, (this.endDay - climate.elapsedDays) * 24) : this.target;
    this.waitArc.setAttribute('d', arcPath(hour, span, RING / 2));
    const [gx, gy] = onRing(hour + span, RING / 2);
    this.ghost.setAttribute('x1', String(CENTRE));
    this.ghost.setAttribute('y1', String(CENTRE));
    this.ghost.setAttribute('x2', gx.toFixed(2));
    this.ghost.setAttribute('y2', gy.toFixed(2));

    this.clockText.textContent = formatClock(climate.timeOfDay);
    this.dayText.textContent = `Day ${dayNumber(climate.elapsedDays)}`;

    if (waiting) {
      const hours = Math.round((this.endDay - this.startDay) * 24);
      this.choiceText.textContent = `Waiting ${hours} ${hours === 1 ? 'hour' : 'hours'} · until ${formatClock(this.endDay)}`;
      const span = Math.max(this.endDay - this.startDay, 1e-9);
      const done = Math.min(1, (climate.elapsedDays - this.startDay) / span);
      this.progressFill.style.width = `${(done * 100).toFixed(1)}%`;
    } else {
      const until = formatClock(climate.timeOfDay + this.target / 24);
      this.choiceText.textContent = `Wait ${this.target} ${this.target === 1 ? 'hour' : 'hours'} · until ${until}`;
    }
  }
}
