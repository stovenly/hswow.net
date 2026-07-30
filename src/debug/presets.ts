/**
 * Tuning presets, stored in localStorage.
 *
 * Separate from Phase 9's autosave on purpose: that persists what the player
 * did, this persists what the *look* is, and the two have different lifetimes.
 * A preset survives clearing a save, and clearing a save should not throw away
 * an afternoon of tuning.
 *
 * Everything here is best-effort. Safari in private mode throws on write, and
 * a render setting failing to persist is not worth taking the game down for.
 */

const PREFIX = 'hswow.preset.';

export function loadPreset<T>(name: string): Partial<T> | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + name);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed as Partial<T>;
  } catch {
    return null;
  }
}

export function savePreset(name: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(PREFIX + name, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function clearPreset(name: string): void {
  try {
    window.localStorage.removeItem(PREFIX + name);
  } catch {
    // Nothing to be done, and nothing that depends on it.
  }
}
