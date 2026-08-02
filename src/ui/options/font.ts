import type { Options } from './model';

/**
 * The dyslexia-friendly typeface, fetched only if somebody asks for it.
 *
 * OpenDyslexic is 172 KB, which is not much next to a photograph and is a
 * great deal next to this game: the entire build is code, every triangle and
 * every sample is generated at boot, and nothing else is downloaded at all.
 * Bundling it would make the typeface the largest single asset in a game that
 * has no assets, and it would be paid for by everyone to serve the few people
 * who want it. So it stays in `public/` and is pulled in on demand — and
 * because that is a real download over a real connection, the menu says so
 * while it is happening rather than leaving a switch that appears to do
 * nothing for a second.
 *
 * Weighted regular only. The interface has no bold or italic anywhere, so the
 * other faces would be three more downloads nobody would ever see.
 */

const FAMILY = 'OpenDyslexic';

/**
 * Resolved through Vite's base, so it is correct both on the dev server at the
 * root and in the built site, which is served from a Pages subpath.
 */
const FONT_URL = `${import.meta.env.BASE_URL}fonts/OpenDyslexic-Regular.otf`;

/** Applied as a class rather than an inline style; `styles.css` owns the stack. */
const BODY_CLASS = 'is-dyslexic';

type Status = 'idle' | 'loading' | 'ready' | 'failed';

let status: Status = 'idle';
/** What the option currently says, which the load may finish after. */
let wanted = false;
const listeners = new Set<() => void>();

/**
 * Turns the typeface on or off, fetching it the first time it is needed.
 *
 * Safe to call repeatedly with the same value, and safe to call again while a
 * load is in flight — the second call sets `wanted` and the load applies
 * whatever that says when it lands, so switching off and on again quickly
 * cannot leave the page in the wrong state.
 */
export function setDyslexicFont(enabled: boolean): void {
  wanted = enabled;

  if (!enabled) {
    document.body.classList.remove(BODY_CLASS);
    notify();
    return;
  }

  if (status === 'ready') {
    document.body.classList.add(BODY_CLASS);
    notify();
    return;
  }
  // A failed load is not retried on every click. The file is part of the build;
  // if it is not there, it will not be there a second later either.
  if (status === 'loading' || status === 'failed') return;

  status = 'loading';
  notify();

  void load().then((ok) => {
    status = ok ? 'ready' : 'failed';
    if (ok && wanted) document.body.classList.add(BODY_CLASS);
    notify();
  });
}

async function load(): Promise<boolean> {
  try {
    const face = new FontFace(FAMILY, `url(${FONT_URL})`);
    await face.load();
    document.fonts.add(face);
    return true;
  } catch {
    // A missing or corrupt font is not worth taking the game down for. The
    // menu says it is unavailable and the interface keeps its own typeface.
    return false;
  }
}

/** What the menu prints under the switch. Null when there is nothing to say. */
export function fontNote(options: Options): string | null {
  if (status === 'failed') return 'typeface unavailable';
  if (!options.dyslexicFont) return null;
  if (status === 'loading') return 'fetching the typeface…';
  return null;
}

/** The menu subscribes, so the note above appears and clears on its own. */
export function onFontChange(listener: () => void): void {
  listeners.add(listener);
}

export function offFontChange(listener: () => void): void {
  listeners.delete(listener);
}

function notify(): void {
  for (const listener of listeners) listener();
}
