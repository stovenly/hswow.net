import type { Menu, Pane } from './Menu';
import { START_DAY, type Climate } from '../world/climate';
import type { AudioEngine } from '../audio/AudioEngine';

/**
 * The time tab: the day and the hour as a clock face, and a wait of one to
 * twenty-four hours run with the world on screen behind it. Midnight is at the
 * bottom of the ring and noon at the top, so the sun's place on the ring is
 * its place in the sky.
 */

/** Real seconds one game hour takes while waiting. */
const HOUR_SECONDS = 0.5;
/** Real seconds the rate takes to come up at the start and go down at the end. */
const RAMP = 0.4;
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

/** The season a phase of the year falls in, with 0 at midwinter. */
export function seasonWord(phase: number): string {
  const turn = ((phase % 1) + 1) % 1;
  if (turn < 0.125 || turn >= 0.875) return 'winter';
  if (turn < 0.375) return 'spring';
  if (turn < 0.625) return 'summer';
  return 'autumn';
}

/** Where an hour (0..24) falls on the ring: midnight at the bottom, clockwise. */
function onRing(hour: number, radius: number): [number, number] {
  const angle = (hour / 24) * Math.PI * 2;
  return [CENTRE - Math.sin(angle) * radius, CENTRE + Math.cos(angle) * radius];
}

/** An SVG arc path along the ring from one hour clockwise to another. */
function arcPath(from: number, to: number, radius: number): string {
  let span = to - from;
  if (span <= 0) span += 24;
  if (span >= 24) span = 23.999;
  const [x0, y0] = onRing(from, radius);
  const [x1, y1] = onRing(from + span, radius);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${radius} ${radius} 0 ${span > 12 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function el<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

export class TimePane implements Pane {
  private readonly climate: Climate;
  private readonly audio: AudioEngine;
  private state: State = 'idle';
  /** Hours the wait would run, 1..24. */
  private target = 1;
  private startDay = 0;
  private endDay = 0;
  private waited = 0;
  private hoursDone = 0;

  private readonly svg: SVGSVGElement;
  private readonly nightArc: SVGPathElement;
  private readonly waitArc: SVGPathElement;
  private readonly hand: SVGLineElement;
  private readonly ghost: SVGLineElement;
  private readonly sun: SVGCircleElement;
  private readonly moon: SVGGElement;
  private readonly moonShadow: SVGCircleElement;
  private readonly clockText: SVGTextElement;
  private readonly dayText: SVGTextElement;
  private readonly smallText: SVGTextElement;
  private readonly choiceEl: HTMLDivElement;
  private readonly choiceText: HTMLSpanElement;
  private readonly keysEl: HTMLDivElement;
  private readonly progressEl: HTMLDivElement;
  private readonly progressText: HTMLDivElement;
  private readonly progressFill: HTMLDivElement;
  private lastDaylightDay = -1;
  private dragging = false;

  constructor(menu: Menu, climate: Climate, audio: AudioEngine) {
    this.climate = climate;
    this.audio = audio;

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
    defs.append(sunFill, moonClip);
    this.svg.append(defs);

    // The band: the whole ring pale, the night laid over it from dusk round to dawn.
    this.svg.append(
      el('circle', {
        cx: CENTRE,
        cy: CENTRE,
        r: RING,
        fill: 'none',
        stroke: 'rgb(220 220 200 / 30%)',
        'stroke-width': RING_WIDTH,
      }),
    );
    this.nightArc = el('path', {
      fill: 'none',
      stroke: 'rgb(10 10 15 / 72%)',
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
    for (const hour of [0, 6, 12, 18]) {
      const [x, y] = onRing(hour, RING - RING_WIDTH / 2 - 26);
      const label = el('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'time-label' });
      label.textContent = hour % 12 === 0 ? '12' : '6';
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

    // The readouts in the middle.
    this.clockText = el('text', { x: CENTRE, y: CENTRE - 8, 'text-anchor': 'middle', class: 'time-clock time-chrome' });
    this.dayText = el('text', { x: CENTRE, y: CENTRE + 26, 'text-anchor': 'middle', class: 'time-day time-chrome' });
    this.smallText = el('text', { x: CENTRE, y: CENTRE + 48, 'text-anchor': 'middle', class: 'time-small time-chrome' });
    this.svg.append(this.clockText, this.dayText, this.smallText);

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
      drag.setPointerCapture(event.pointerId);
      this.aimAt(event);
    });
    drag.addEventListener('pointermove', (event) => {
      if (this.dragging) this.aimAt(event);
    });
    drag.addEventListener('pointerup', () => {
      this.dragging = false;
    });
    drag.addEventListener('wheel', (event) => {
      if (this.state !== 'choosing') return;
      event.preventDefault();
      this.nudge(event.deltaY > 0 ? 1 : -1);
    });

    // --- under the disc ---------------------------------------------------------
    this.choiceEl = document.createElement('div');
    this.choiceEl.className = 'time-choice time-chrome';
    this.choiceText = document.createElement('span');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'time-wait';
    button.textContent = 'wait';
    button.addEventListener('click', () => this.beginWait());
    this.choiceEl.append(this.choiceText, button);
    card.append(this.choiceEl);

    this.progressEl = document.createElement('div');
    this.progressEl.className = 'time-progress';
    this.progressEl.hidden = true;
    this.progressText = document.createElement('div');
    const bar = document.createElement('div');
    bar.className = 'time-progress-bar';
    this.progressFill = document.createElement('div');
    this.progressFill.className = 'time-progress-fill';
    bar.append(this.progressFill);
    this.progressEl.append(this.progressText, bar);
    card.append(this.progressEl);

    this.keysEl = document.createElement('div');
    this.keysEl.className = 'time-keys time-chrome';
    for (const [caps, label] of [
      [['←', '→'], 'hours'],
      [['Enter'], 'wait'],
      [['Esc'], 'back'],
    ] as const) {
      const item = document.createElement('span');
      for (const cap of caps) {
        const key = document.createElement('kbd');
        key.className = cap.length > 1 ? 'key key-wide' : 'key';
        key.textContent = cap;
        item.append(key);
      }
      item.append(label);
      this.keysEl.append(item);
    }
    card.append(this.keysEl);

    menu.mount('time', this);
    window.addEventListener('keydown', this.handleKeyDown, true);
  }

  activate(): void {
    this.state = 'choosing';
    this.target = 1;
    this.lastDaylightDay = -1;
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
  tick(dt: number): void {
    if (this.state === 'idle') return;
    if (this.state === 'waiting' || this.state === 'stopping') this.runWait(dt);
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
    const ahead = Math.round(((hour - now) % 24 + 24) % 24);
    this.target = ahead === 0 ? 24 : ahead;
    this.draw();
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.state === 'idle') return;
    if (this.state === 'waiting' || this.state === 'stopping') {
      if (event.code === 'Escape' || event.code === 'Tab' || event.code === 'KeyT') {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!event.repeat) this.stopWait();
      }
      return;
    }
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        event.preventDefault();
        this.nudge(-1);
        break;
      case 'ArrowRight':
      case 'KeyD':
        event.preventDefault();
        this.nudge(1);
        break;
      case 'Enter':
      case 'NumpadEnter':
        if (event.repeat) return;
        event.preventDefault();
        this.beginWait();
        break;
    }
  };

  // --- waiting ------------------------------------------------------------------

  private beginWait(): void {
    if (this.state !== 'choosing') return;
    this.state = 'waiting';
    this.startDay = this.climate.elapsedDays;
    this.endDay = this.startDay + this.target / 24;
    this.waited = 0;
    this.hoursDone = 0;
    this.progressEl.hidden = false;
    document.body.classList.add('is-waiting');
    this.audio.hush(true);
  }

  /** Escape: the wait ends at the next whole hour, keeping what it reached. */
  private stopWait(): void {
    if (this.state !== 'waiting') return;
    this.state = 'stopping';
    const done = (this.climate.elapsedDays - this.startDay) * 24;
    this.endDay = this.startDay + Math.min(this.target, Math.ceil(done + 1e-6)) / 24;
  }

  private runWait(dt: number): void {
    const climate = this.climate;
    // The dev panel's hold wins over the rate, and a wait on a held clock would never land.
    if (climate.frozen || climate.scrubbing) {
      this.finishWait();
      return;
    }
    this.waited += dt;
    const full = climate.settings.dayLength / 24 / HOUR_SECONDS;
    // Real seconds left at full speed, so the way down starts in time to land softly.
    const left = ((this.endDay - climate.elapsedDays) * climate.settings.dayLength) / full;
    const ramp = Math.max(0.06, Math.min(1, this.waited / RAMP, left / RAMP));
    const eased = ramp * ramp * (3 - 2 * ramp);
    climate.rate = 1 + (full - 1) * eased;
    this.hoursDone = Math.min(this.target, Math.floor((climate.elapsedDays - this.startDay) * 24 + 1e-6));
    if (climate.elapsedDays >= this.endDay - 1e-7) {
      climate.day = Math.floor(this.endDay);
      climate.timeOfDay = this.endDay - climate.day;
      this.finishWait();
    }
  }

  private finishWait(): void {
    this.climate.rate = 1;
    this.audio.hush(false);
    document.body.classList.remove('is-waiting');
    this.progressEl.hidden = true;
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

    if (Math.floor(climate.elapsedDays) !== this.lastDaylightDay) {
      this.lastDaylightDay = Math.floor(climate.elapsedDays);
      const light = climate.daylight();
      if (light) this.nightArc.setAttribute('d', arcPath(light.set * 24, light.rise * 24, RING));
      else this.nightArc.setAttribute('d', climate.sunElevation > 0 ? '' : arcPath(0, 23.999, RING));
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
    const targetHour = waiting ? (this.endDay % 1) * 24 : hour + this.target;
    this.waitArc.setAttribute('d', arcPath(hour, targetHour, RING - RING_WIDTH / 2 - 6));
    const [gx, gy] = onRing(targetHour, RING - RING_WIDTH / 2 - 2);
    this.ghost.setAttribute('x1', String(CENTRE));
    this.ghost.setAttribute('y1', String(CENTRE));
    this.ghost.setAttribute('x2', gx.toFixed(2));
    this.ghost.setAttribute('y2', gy.toFixed(2));

    this.clockText.textContent = formatClock(climate.timeOfDay);
    this.dayText.textContent = `Day ${dayNumber(climate.elapsedDays)}`;
    this.smallText.textContent = `${climate.moonName} moon · ${seasonWord(climate.seasonPhase)}`;

    if (waiting) {
      this.progressText.textContent = `${this.hoursDone} of ${this.target} hours`;
      const done = Math.min(1, ((climate.elapsedDays - this.startDay) * 24) / this.target);
      this.progressFill.style.width = `${(done * 100).toFixed(1)}%`;
    } else {
      const until = formatClock(climate.timeOfDay + this.target / 24);
      this.choiceText.textContent = `Wait ${this.target} ${this.target === 1 ? 'hour' : 'hours'} · until ${until}`;
    }
  }
}
