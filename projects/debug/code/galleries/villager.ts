import type { GalleryPlan } from './layout';
import type { MeshBuilder } from '@engine/art/types';
import { figure } from '@engine/art/builders/figure';
import { HEAD_KINDS, type HeadKind } from '@engine/art/builders/figure-head';

/**
 * The villagers, one row of eight per mask, same seeds down every row, so the
 * only thing that differs between rows is the head. Walk up to a row and it
 * turns and talks.
 */

export const ZONE_GALLERY_VILLAGER = 'gallery-villager';

const NAMES: Record<HeadKind, string> = {
  round: 'Cut Round',
  burr: 'Burr Round',
  bough: 'Bough Round',
  lapped: 'Lapped Boards',
  crown: 'Twig Crown',
  antler: 'Antler Gable',
  palm: 'Elk Rack',
  briar: 'Briar Canes',
  wheel: 'Withy Wheel',
};

/** One builder per option: the figure with its face fixed. */
function withHead(face: HeadKind): MeshBuilder {
  return {
    ...figure,
    name: `figure-${face}`,
    display: NAMES[face],
    build: (options = {}) => figure.build({ ...options, face }),
  };
}

const BUILDERS = HEAD_KINDS.map(withHead);

export const villagerGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_VILLAGER,
  group: 'countryside',
  name: 'Countryside Villagers',
  builders: BUILDERS,
};
