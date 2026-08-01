/**
 * Stops the dev server reloading the page out from under you.
 *
 * Vite's default is a full reload whenever a module changes that nothing has
 * accepted a hot update for — which here is every module, because nothing in
 * this project accepts one. That is the right default for a form or a page of
 * text and completely wrong for this: a reload drops pointer lock, teleports
 * you back to spawn, rebuilds every zone and re-renders the impulse responses.
 * If you are twenty metres into a gallery looking at one instance of one
 * builder, the reload costs more than the change was worth.
 *
 * It gets much worse when something else is editing the source. A batch of
 * builder edits lands as a stream of saves, and the page reloads on every one
 * of them, so the moment you stand still and look at something is exactly the
 * moment it disappears.
 *
 * So the reload is cancelled and a banner is shown instead. **Nothing is
 * applied** — what you are looking at is the code as it was when the page
 * loaded, and staying that way is the entire point. Refresh when you are ready.
 *
 * ## The cancelling happens on the server, not here
 *
 * This file only draws the banner. The reload is stopped by the
 * `hswow:no-auto-reload` plugin in `vite.config.ts`, which returns no affected
 * modules from `handleHotUpdate` and sends a custom event in their place.
 *
 * It was tried the other way first — listen for `vite:beforeFullReload` and
 * throw, which used to abort the reload. Vite 5 awaits its listeners inside
 * `Promise.allSettled`, so the exception is swallowed and the page reloads
 * regardless. Worth recording because the failure is completely silent: the
 * handler runs, the banner appears, and the page reloads out from under it.
 *
 * The whole module is behind `import.meta.hot`, which is statically false in a
 * production build, so none of it reaches `docs/`.
 */

/** Everything about the banner, so a look change is one place. */
const STYLE: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  zIndex: '60',
  padding: '7px 12px',
  font: '12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace',
  letterSpacing: '0.02em',
  color: '#0d0f12',
  background: '#d9c88a',
  borderBottom: '1px solid #8d7f52',
  textAlign: 'center',
  cursor: 'pointer',
  // The canvas underneath owns pointer lock; the banner must be clickable
  // without being in the way of anything else.
  userSelect: 'none',
};

export function installReloadBanner(): void {
  if (!import.meta.hot) return;

  let banner: HTMLElement | null = null;
  let changes = 0;

  const show = (): void => {
    changes += 1;
    if (!banner) {
      banner = document.createElement('div');
      Object.assign(banner.style, STYLE);
      // Clicking it is the obvious thing to try, so it should work.
      banner.addEventListener('click', () => window.location.reload());
      document.body.appendChild(banner);
    }
    banner.textContent =
      changes === 1
        ? 'New version is available. Please refresh.'
        : `New version is available (${changes} changes). Please refresh.`;
  };

  // Sent by the `hswow:no-auto-reload` plugin in place of the update it
  // suppressed. See the header.
  import.meta.hot.on('hswow:changed', show);

  // Belt and braces. Neither of these should be reachable now, so if one fires
  // the plugin has stopped covering some path — worth still noticing rather than
  // trusting the server half completely, since the cost of being wrong is the
  // reload this file exists to prevent.
  import.meta.hot.on('vite:beforeFullReload', show);
  import.meta.hot.on('vite:afterUpdate', show);
}
