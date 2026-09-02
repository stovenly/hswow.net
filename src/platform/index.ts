/**
 * What the page is running on, asked once. The web implementation is the
 * browser calls themselves; a desktop wrapper installs its own under
 * `window.hswowPlatform` before the engine boots.
 */

export interface Platform {
  readonly kind: 'web' | 'desktop';
  /** `crossOriginIsolated`: shared memory and an honest core count. */
  readonly isolated: boolean;
  readonly window: {
    fullscreen(on: boolean): Promise<void>;
    isFullscreen(): boolean;
  };
  readonly keys: {
    /** Claims the named keys from the browser while in fullscreen. */
    lock(codes: readonly string[]): Promise<void>;
    unlock(): void;
  };
}

const web: Platform = {
  kind: 'web',
  isolated: typeof crossOriginIsolated === 'boolean' && crossOriginIsolated,
  window: {
    async fullscreen(on) {
      if (on) {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    },
    isFullscreen: () => document.fullscreenElement !== null,
  },
  keys: {
    async lock(codes) {
      const keyboard = (navigator as Navigator & { keyboard?: { lock(codes?: string[]): Promise<void> } }).keyboard;
      if (keyboard?.lock) await keyboard.lock([...codes]);
    },
    unlock() {
      const keyboard = (navigator as Navigator & { keyboard?: { unlock(): void } }).keyboard;
      keyboard?.unlock?.();
    },
  },
};

const installed = (window as Window & { hswowPlatform?: Platform }).hswowPlatform;

export const platform: Platform = installed ?? web;
