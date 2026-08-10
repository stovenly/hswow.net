import type { GalleryPlan } from './layout';
import { schillerOrb } from '../../art/builders/schiller-orb';
import { schillerColumn } from '../../art/builders/schiller-column';
import { nacreousOrb } from '../../art/builders/nacreous-orb';
import { nacreousColumn } from '../../art/builders/nacreous-column';
import { pointillistOrb } from '../../art/builders/pointillist-orb';
import { pointillistColumn } from '../../art/builders/pointillist-column';
import { tenebrescentOrb } from '../../art/builders/tenebrescent-orb';
import { tenebrescentColumn } from '../../art/builders/tenebrescent-column';
import { quickmetalOrb } from '../../art/builders/quickmetal-orb';
import { quickmetalColumn } from '../../art/builders/quickmetal-column';
import { voidstoneOrb } from '../../art/builders/voidstone-orb';
import { voidstoneColumn } from '../../art/builders/voidstone-column';

/**
 * Materials 2: the exotic recipes (EXOTIC-MATERIALS.md, M5–M8).
 *
 * A second room rather than ten more rows in the first one, and the reason is
 * what the first room is *for*. The Materials Gallery is a scale: chrome at the
 * mirror end, marble at the dielectric end, and eight fixtures between them
 * that differ by one parameter each. Standing something in it that differs by a
 * whole optical model breaks the scale — the eye stops reading a progression
 * and starts reading a collection, and then the progression is gone for the
 * eight fixtures that were making it.
 *
 * So: one room per question. Over there, *how much* — metallic, rough, sheened.
 * In here, *which* — a domain flood, a film laid two
 * different ways, flecks under the surface, a stone that darkens in the light,
 * one that answers only from behind the eye, a reflection that crawls, and a
 * sky sealed in a rock.
 *
 * ## Two fixtures a row, the same two the first gallery uses
 *
 * An orb and a column, because that is what a materials row in this project is
 * — the first gallery settled it and there is no reason for the second to
 * settle it differently. A fixture's job is to be the *same* shape wearing a
 * different material, and a room that invented its own shapes would break the
 * one comparison that matters most: these ten against the ten next door.
 *
 * The two are answering different questions, and both are needed here more
 * than they were there. An orb presents every angle at once, which is what
 * makes it the thing to tune a lobe against. A column is where a finish is read
 * across *large flat faces* — and half of what is in this room is view-dependent
 * across a surface rather than across an angle. A crawling
 * reflection and a domain that has to be wider than one facet are all being
 * drawn, on an orb, on a shape whose facets are smaller than the effect. On a
 * shaft they have room.
 *
 * ## The order, and what each neighbour is arguing with
 *
 * **One rank, and every pair is a claim against the pair beside it.** Grouped
 * by which part of the shading each recipe reaches into, because that is the
 * comparison that is actually informative — two recipes doing different things
 * to the same term tell you about the term.
 *
 * - **The highlight**: schiller. A domain flood in place of a specular lobe.
 * - **The film**: nacreous and pointillist stand adjacent on purpose. They are
 *   the *same term* with the same iridescence lane at nearly the same strength,
 *   and the only difference between them is where the film is thick. Banded
 *   against cellular, side by side, is the clearest statement in this room that
 *   a parameter and a recipe are different kinds of thing.
 * - **Where the light goes**: tenebrescent, dark where it is lit.
 * - **The environment**: quickmetal and voidstone last, because they are the
 *   two that replace what the surface is *looking at* rather than what it does
 *   with what it sees, and the second of them replaces it with something that
 *   is not in the world.
 *
 * The frost and gilt fixtures stay in the first gallery. They belong to the
 * parameter scale — glint and star are lanes, not recipes — and they are also
 * the two this whole room was written against, so leaving them where they are
 * means the comparison is one door away rather than one row.
 */

export const ZONE_MATERIALS_GALLERY_2 = 'materials-gallery-2';

const MATERIAL_BUILDERS = [
  // The highlight.
  schillerOrb,
  schillerColumn,
  // One film, two thicknesses. Adjacent on purpose.
  nacreousOrb,
  nacreousColumn,
  pointillistOrb,
  pointillistColumn,
  // Where the light goes, the wrong way round.
  tenebrescentOrb,
  tenebrescentColumn,
  // What the surface is looking at.
  quickmetalOrb,
  quickmetalColumn,
  voidstoneOrb,
  voidstoneColumn,
];

export const materialsGallery2Plan: GalleryPlan = {
  id: ZONE_MATERIALS_GALLERY_2,
  group: 'general',
  name: 'Materials 2',
  builders: MATERIAL_BUILDERS,
};
