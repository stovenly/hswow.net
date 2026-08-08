import type { GalleryPlan } from './layout';
import { giltOrb } from '../../art/builders/gilt-orb';
import { polishedOrb } from '../../art/builders/polished-orb';
import { chromeOrb } from '../../art/builders/chrome-orb';
import { brushedOrb } from '../../art/builders/brushed-orb';
import { frostOrb } from '../../art/builders/frost-orb';
import { giltColumn } from '../../art/builders/gilt-column';
import { chromeColumn } from '../../art/builders/chrome-column';
import { polishedColumn } from '../../art/builders/polished-column';
import { brushedColumn } from '../../art/builders/brushed-column';
import { frostColumn } from '../../art/builders/frost-column';
import { shellColumn } from '../../art/builders/shell-column';
import { waxenColumn } from '../../art/builders/waxen-column';
import { marbleColumn } from '../../art/builders/marble-column';
import { shellOrb } from '../../art/builders/shell-orb';
import { waxenOrb } from '../../art/builders/waxen-orb';
import { marbleOrb } from '../../art/builders/marble-orb';
import { silkDrape } from '../../art/builders/silk-drape';
import { velvetDrape } from '../../art/builders/velvet-drape';
import { crystalGem } from '../../art/builders/crystal-gem';
import { amethystGem } from '../../art/builders/amethyst-gem';
import { bubbleOrb } from '../../art/builders/bubble-orb';
import { glassPaneProp } from '../../art/builders/glass-pane';

/**
 * The Materials Gallery: the finish stage, judged in daylight.
 *
 * Fixtures rather than props — an orb catches the sun from every facet at once,
 * which no real object is shaped to do, and that is what makes it the thing to
 * tune against. Cloth gets a drape instead, because the terms that matter to
 * cloth are both about a surface turning.
 *
 * **One rank, one claim.** Each fixture isolates a single term as far as it
 * can: chrome is the mirror end, polished the practical one, brushed adds only
 * the grain, gilt is smooth leaf, frost is nothing but sparkle, shell only the
 * hue walk, waxen only the wrap, marble is the one dielectric, and the two
 * drapes are anisotropy with sheen against sheen alone. Standing them beside
 * each other is the whole point — a highlight is only judgeable against
 * another highlight.
 */

export const ZONE_MATERIALS_GALLERY = 'materials-gallery';

const MATERIAL_BUILDERS = [
  // Metal, mirror to matte.
  chromeOrb,
  chromeColumn,
  polishedOrb,
  polishedColumn,
  brushedOrb,
  brushedColumn,
  giltOrb,
  giltColumn,
  // Films, sparkle and depth.
  frostOrb,
  frostColumn,
  shellOrb,
  shellColumn,
  waxenOrb,
  waxenColumn,
  marbleOrb,
  marbleColumn,
  // Cloth, which wants a different shape entirely.
  silkDrape,
  velvetDrape,
  // The transmissive family — a different material and a different pass, so
  // they stand last. Each isolates one term: the gem is refraction broken by
  // facets, the amethyst is the same cut absorbing hard, the pane is one flat
  // normal with no dispersion, and the bubble is fresnel and film alone.
  crystalGem,
  amethystGem,
  glassPaneProp,
  bubbleOrb,
];

export const materialsGalleryPlan: GalleryPlan = {
  id: ZONE_MATERIALS_GALLERY,
  group: 'general',
  name: 'Materials',
  builders: MATERIAL_BUILDERS,
};
