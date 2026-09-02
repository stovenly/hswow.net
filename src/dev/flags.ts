const params = new URLSearchParams(window.location.search);

/** Debug switches from the query string, so `?debug` works on the deployed build too. */
export const flags = {
  /** `?debug` — stats readout and the live tuning panel. */
  debug: params.has('debug'),
} as const;
