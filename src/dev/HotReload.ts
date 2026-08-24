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
 * So the reload is cancelled and a prompt is shown instead. **Nothing is
 * applied** — what you are looking at is the code as it was when the page
 * loaded, and staying that way is the entire point. Refresh when you are ready.
 *
 * It sits in the top-left corner and is only as wide as its own text. It used
 * to be a bar across the full width of the window, which put it straight
 * through the performance readout in the opposite corner — and a notice that
 * covers the numbers you are reading is a notice that has to go, however
 * legible it is in isolation. The corners in use are top-centre (the pause
 * button) and top-right (the readout), so this one takes the free one and
 * matches the readout's inset so the two read as the same layer.
 *
 * ## The cancelling happens on the server, not here
 *
 * This file only draws the prompt. The reload is stopped by the
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

/** Everything about the prompt, so a look change is one place. */
const STYLE: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  // The performance readout's inset, mirrored. See the header.
  top: 'max(0.75rem, env(safe-area-inset-top))',
  left: 'max(0.75rem, env(safe-area-inset-left))',
  zIndex: '60',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  // Wide enough for the two lines below at this size, and never wider than the
  // window on a phone.
  maxWidth: 'min(13rem, calc(100vw - 1.5rem))',
  padding: '0.45rem 0.7rem',
  font: '12px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace',
  letterSpacing: '0.02em',
  color: '#0d0f12',
  background: '#d9c88a',
  // Square, like the readout. Nothing else in this interface is rounded.
  border: '1px solid #8d7f52',
  cursor: 'pointer',
  // The canvas underneath owns pointer lock; the prompt must be clickable
  // without being in the way of anything else.
  userSelect: 'none',
};

/**
 * The refresh arrow: a 315° arc with a square corner for the head, drawn at
 * the tangent so it reads as turning rather than as a broken ring.
 *
 * Inline because a file would be an asset, and this project does not keep
 * those — the same rule the meshes and the textures follow. `currentColor`
 * ties it to the text so there is one colour to change, not two.
 */
const ICON = /* html */ `
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
       stroke-width="2.6" stroke-linecap="butt" stroke-linejoin="miter" aria-hidden="true"
       style="flex: none;">
    <path d="M20 12A8 8 0 1 1 17.66 6.34" />
    <path d="M17.66 2.1V6.34H13.42" />
  </svg>
`;

/**
 * The arrow turns once, then rests. A static icon in the corner of a game is
 * scenery; the movement is the whole reason it gets noticed at all. It is also
 * the one thing here worth suppressing for anyone who has asked for less of it.
 */
const KEYFRAMES = /* css */ `
  @keyframes hswow-reload-turn {
    0%, 55% { transform: rotate(0turn); }
    100% { transform: rotate(1turn); }
  }
  @media (prefers-reduced-motion: reduce) {
    #hswow-reload svg { animation: none !important; }
  }
`;

export function installReloadBanner(): void {
  if (!import.meta.hot) return;

  let prompt: HTMLElement | null = null;
  let count: HTMLElement | null = null;
  let changes = 0;

  const build = (): void => {
    const style = document.createElement('style');
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);

    prompt = document.createElement('div');
    prompt.id = 'hswow-reload';
    Object.assign(prompt.style, STYLE);
    prompt.title = 'Reload the page';
    prompt.innerHTML = ICON;
    const svg = prompt.firstElementChild as SVGElement;
    svg.style.animation = 'hswow-reload-turn 2.8s ease-in-out infinite';

    const lines = document.createElement('div');
    const lead = document.createElement('div');
    lead.textContent = 'Refresh to update';
    // The count is the supporting detail, not the message — it tells you how
    // stale the page is once you have already read what to do about it.
    count = document.createElement('div');
    count.style.color = '#5d5333';
    lines.append(lead, count);
    prompt.append(lines);

    // Clicking it is the obvious thing to try, so it should work.
    prompt.addEventListener('click', () => window.location.reload());
    document.body.appendChild(prompt);
  };

  const show = (): void => {
    changes += 1;
    if (!prompt) build();
    if (count) count.textContent = `${changes} change${changes === 1 ? '' : 's'} since load`;
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
