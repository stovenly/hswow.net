import type { Part } from '../assemble';
import type { Rng } from '../random';
import { pickWeighted, type Wearer } from './figure-surface';

/**
 * Layering as a declaration, not a side effect. Every catalog entry declares
 * the regions it occupies and its thickness, and *receives* its proud from
 * the stack; the driver walks the slots in order. A garment can no longer
 * depend on knowing what else was worn, only on the level the stack reports.
 */

/** A named stretch of the body a layer can stand over. The humanoid trunk
 *  declares 'waist', 'neck', 'shoulder' and 'back'; today's catalogs use the
 *  first two. */
export type Region = string;

export class LayerStack {
  private levels: Record<Region, number> = {};

  /** The current outer level over a region. */
  proudAt(region: Region): number {
    return this.levels[region] ?? 0;
  }

  /** The proud to build at; raises the level by `thickness`. */
  wear(region: Region, thickness: number): number {
    const at = this.proudAt(region);
    this.levels[region] = at + thickness;
    return at;
  }
}

/** One garment in a catalog slot. */
export interface Wear<M extends Wearer = Wearer> {
  weight: number;
  /** The regions this piece stands over, each with how thick it stands. */
  regions?: Partial<Record<Region, number>>;
  /** Whether the piece can go over what is already worn. */
  fits?(layers: LayerStack): boolean;
  build(rng: Rng, m: M): Part[];
}

/** A people's dress catalogs: one entry is picked per slot. */
export interface Catalogs<M extends Wearer = Wearer> {
  overlayers: readonly Wear<M>[];
  waists: readonly Wear<M>[];
  shoulders: readonly Wear<M>[];
  extras: readonly Wear<M>[];
  /** The chance ladder for how many extras: none, else one, else two, else three. */
  extraOdds: readonly [number, number, number];
}

/**
 * The dress driver: the base garment, then one entry per slot — overlayer,
 * waist, shoulders — then a few extras. Each pick is filtered by `fits`
 * against the stack, built, and the stack raised by what it declared.
 */
export function dress<M extends Wearer>(
  rng: Rng,
  m: M,
  parts: Part[],
  base: (rng: Rng, m: M, parts: Part[]) => void,
  set: Catalogs<M>,
  mark: (name: string) => void,
): void {
  base(rng, m, parts);
  mark('base garment');
  const slots: readonly [string, readonly Wear<M>[]][] = [
    ['overlayer', set.overlayers],
    ['waist', set.waists],
    ['shoulders', set.shoulders],
  ];
  for (const [slot, table] of slots) {
    const wearable = table.filter((w) => !w.fits || w.fits(m.layers));
    const wear = pickWeighted(rng, wearable);
    parts.push(...wear.build(rng, m));
    for (const [region, thickness] of Object.entries(wear.regions ?? {})) {
      if (thickness !== undefined) m.layers.wear(region, thickness);
    }
    mark(`${slot} #${table.indexOf(wear)}`);
  }
  const [none, one, two] = set.extraOdds;
  const count = rng.chance(none) ? 0 : rng.chance(one) ? 1 : rng.chance(two) ? 2 : 3;
  const worn = new Set<Wear<M>>();
  for (let i = 0; i < count; i++) {
    const wear = pickWeighted(rng, set.extras);
    if (worn.has(wear)) continue;
    worn.add(wear);
    parts.push(...wear.build(rng, m));
  }
  mark('extras');
}
