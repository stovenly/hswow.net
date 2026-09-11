// Water palettes: per body, from content, keyed by id and merged by id.

export interface WaterPalette {
  /** sRGB hex. */
  shallow: number;
  deep: number;
  foam: number;
  /** The colour light takes through a raised crest. */
  scatter: number;
  /** Flat steps of depth colour: 0 is a gradient, 2..4 are painted bands. */
  bands: number;
}

export type WaterRegime = 'still' | 'flow' | 'fall' | 'sea';

const DEFAULTS: Record<string, WaterPalette> = {
  pond: { shallow: 0x67948e, deep: 0x1b3a43, foam: 0xecf2f2, scatter: 0x8fcfbf, bands: 3 },
  river: { shallow: 0x6f9a92, deep: 0x22434a, foam: 0xeef3f1, scatter: 0x93cfc0, bands: 3 },
  tarn: { shallow: 0x5c7a66, deep: 0x1a2a26, foam: 0xe4ecea, scatter: 0x7fae98, bands: 3 },
  rockpool: { shallow: 0x7aa9a4, deep: 0x2d5a5e, foam: 0xf0f5f4, scatter: 0x9fd6cd, bands: 2 },
  sea: { shallow: 0x5f948f, deep: 0x163640, foam: 0xedf3f3, scatter: 0x8fcfbf, bands: 0 },
  harbour: { shallow: 0x5b857f, deep: 0x1c333a, foam: 0xe8eeee, scatter: 0x86b9ad, bands: 0 },
};

const palettes = new Map<string, WaterPalette>(Object.entries(DEFAULTS));

/** Folds a project's palettes over the defaults, by id. A later document wins. */
export function holdWaterPalettes(extra: Record<string, Partial<WaterPalette>> | undefined): void {
  if (!extra) return;
  for (const [id, palette] of Object.entries(extra)) {
    palettes.set(id, { ...(palettes.get(id) ?? DEFAULTS.pond), ...palette });
  }
}

export function waterPaletteIds(): string[] {
  return [...palettes.keys()];
}

/** The palette a body asked for, by id or inline, or the regime's own default. */
export function waterPalette(ref: string | Partial<WaterPalette> | undefined, regime: WaterRegime): WaterPalette {
  const fallback = palettes.get(regime === 'sea' ? 'sea' : regime === 'flow' ? 'river' : 'pond') as WaterPalette;
  if (ref === undefined) return fallback;
  if (typeof ref === 'string') return palettes.get(ref) ?? fallback;
  return { ...fallback, ...ref };
}
