// The one loading screen, for every wait: a painting in a frame over a caption and a bar.

import { paintingCredit, paintingSrc, pickPainting } from './loadingScenes';

// Seconds. Matches the CSS transition.
const FADE = 0.25;

const FIRST = 0.06;

export class LoadingScreen {
  private readonly root: HTMLElement;
  private readonly label: HTMLElement;
  private readonly picture: HTMLImageElement;
  private readonly credit: HTMLElement;
  private shown: boolean;
  /** Raised by a press during boot: `done` then leaves the screen up for the wait that follows. */
  private held = false;
  private hung: Promise<void> = Promise.resolve();

  constructor() {
    this.root = document.getElementById('loading') ?? build();
    if (!this.root.isConnected) document.body.append(this.root);
    this.shown = !this.root.classList.contains('is-gone');
    this.label = this.root.querySelector<HTMLElement>('.loading-label') ?? labelEl();
    this.picture = this.root.querySelector<HTMLImageElement>('.scene') ?? sceneEl(this.root);
    this.credit = this.root.querySelector<HTMLElement>('.credit') ?? creditEl(this.root);
    if (this.root.dataset.scene) this.hung = decoded(this.picture);
    else this.hang(null);
    if (this.shown) document.body.classList.add('is-loading');
  }

  private hang(current: string | null): void {
    const painting = pickPainting(current);
    this.root.dataset.scene = painting.id;
    this.picture.style.objectPosition = painting.focus ?? '';
    this.picture.src = paintingSrc(painting);
    this.credit.replaceChildren(paintingCredit(painting));
    this.hung = decoded(this.picture);
  }

  async show(label: string): Promise<void> {
    this.label.textContent = label;
    if (this.shown) {
      await paint();
      return;
    }
    this.shown = true;
    this.root.classList.add('is-settling');
    this.set(FIRST);
    this.root.classList.remove('is-gone');
    document.body.classList.add('is-loading');
    await this.hung;
    await paint();
    this.root.classList.remove('is-settling');
  }

  /** Does not put the screen up: boot reports its steps from behind the title. */
  async working(label: string, progress?: number): Promise<void> {
    this.label.textContent = label;
    if (progress !== undefined) this.set(progress);
    await this.hung;
    await paint();
  }

  async step<T>(label: string, progress: number, work: () => T | Promise<T>): Promise<T> {
    await this.working(label, progress);
    return work();
  }

  async done(): Promise<void> {
    this.set(1);
    this.label.textContent = 'ready';
    await paint();
    await wait(0.18);
    if (this.held) {
      this.held = false;
      this.root.classList.add('is-settling');
      this.set(FIRST);
      await paint();
      this.root.classList.remove('is-settling');
      return;
    }
    this.hide();
    await wait(FADE);
  }

  hold(label: string): Promise<void> {
    this.held = true;
    return this.show(label);
  }

  hide(): void {
    if (!this.shown) return;
    this.shown = false;
    this.held = false;
    this.root.classList.add('is-gone');
    document.body.classList.remove('is-loading');
    // The next painting goes up only once this one has faded out, and not at
    // all if the screen is back up by then: a swap mid-fade shows through.
    window.setTimeout(() => {
      if (!this.shown) this.hang(this.root.dataset.scene ?? null);
    }, FADE * 1000 + 50);
  }

  fail(message: string): void {
    this.label.textContent = message;
    this.root.classList.add('is-failed');
  }

  private set(progress: number): void {
    this.root.style.setProperty('--lit', String(Math.min(Math.max(progress, 0), 1)));
  }
}

let held: LoadingScreen | null = null;

export function loadingScreen(): LoadingScreen {
  return (held ??= new LoadingScreen());
}

// Two frames: one requestAnimationFrame fires before the paint it belongs to.
function paint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
}

// Capped, so a missing file cannot hold a step.
function decoded(image: HTMLImageElement): Promise<void> {
  return Promise.race([image.decode().catch(() => undefined), wait(0.4)]);
}

function sceneEl(root: HTMLElement): HTMLImageElement {
  const image = document.createElement('img');
  image.className = 'scene';
  image.alt = '';
  image.decoding = 'async';
  (root.querySelector('.picture') ?? root).append(image);
  return image;
}

function creditEl(root: HTMLElement): HTMLElement {
  const credit = document.createElement('div');
  credit.className = 'credit';
  (root.querySelector('.sheet') ?? root).append(credit);
  return credit;
}

function labelEl(): HTMLElement {
  const label = document.createElement('div');
  label.className = 'loading-label';
  return label;
}

function div(className: string, into?: HTMLElement): HTMLElement {
  const element = document.createElement('div');
  element.className = className;
  into?.append(element);
  return element;
}

function build(): HTMLElement {
  const root = document.createElement('div');
  root.id = 'loading';

  const sheet = div('sheet', root);

  const frame = div('frame', sheet);
  frame.setAttribute('aria-hidden', 'true');
  for (let corner = 0; corner < 4; corner++) div('frame-corner', frame);
  sceneEl(div('picture', frame));
  creditEl(sheet);

  const plaque = div('plaque', sheet);
  const label = labelEl();
  plaque.append(label);
  const bar = div('bar', plaque);
  div('bar-fill', bar);
  div('bar-next', bar);

  return root;
}
