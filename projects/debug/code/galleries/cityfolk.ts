import type { GalleryPlan } from './layout';
import type { MeshBuilder } from '@engine/art/types';
import { figure } from '@engine/art/builders/figure';
import { CITY_HEAD_KINDS, type CityHeadKind } from '@engine/art/builders/figure-head-city';

/**
 * The cityfolk: the villagers' body in the city's dress and helms, one row of
 * eight per head, the same seeds down every row as the villager gallery,
 * so the only thing that differs between rows is the head.
 */

export const ZONE_GALLERY_CITYFOLK = 'gallery-cityfolk';

const NAMES: Record<CityHeadKind, string> = {
  greathelm: 'Great Helm',
  bascinet: 'Bascinet',
  frogmouth: 'Frog-mouth Helm',
  burgonet: 'Winged Burgonet',
  tourney: 'Tourney Helm',
  morion: 'Morion',
  bellows: 'Bellows Visor',
  spangen: 'Spangenhelm',
  escutcheon: 'Escutcheon Helm',
  chaperon: 'Chaperon and Veil',
  coif: 'Wound Coif',
};

/** One builder per option: the figure from the city, with its face fixed. */
function withHead(face: CityHeadKind): MeshBuilder {
  return {
    ...figure,
    name: `cityfolk-${face}`,
    display: NAMES[face],
    build: (options = {}) => figure.build({ ...options, folk: 'city', face }),
  };
}

const BUILDERS = CITY_HEAD_KINDS.map(withHead);

export const cityfolkGalleryPlan: GalleryPlan = {
  id: ZONE_GALLERY_CITYFOLK,
  group: 'countryside',
  name: 'Countryside Cityfolk',
  builders: BUILDERS,
};
