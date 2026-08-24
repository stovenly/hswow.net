const params = new URLSearchParams(window.location.search);

/**
 * Debug switches read from the query string rather than `import.meta.env.DEV`.
 *
 * The game is tested against the deployed Pages build on a phone, so anything
 * gated on a dev-only build would never be reachable where it's actually needed.
 * `?debug` therefore works in production too.
 */
export const flags = {
  /** `?debug` — stats readout and the live tuning panel. */
  debug: params.has('debug'),
  /** `?level=…` — which level to boot into. Only the proving ground exists so far. */
  level: params.get('level') ?? 'proving',
  /** `?touch` — force the touch controls on, so they can be tested with a mouse. */
  touch: params.has('touch'),
} as const;
