import type { SurfaceName } from '../audio/models/footsteps';

/**
 * What a pickup is made of in the hand — declared, one line each, like
 * `underfoot.ts` but answering a different question: not what standing on a
 * thing sounds like, what the thing itself says when lifted or set down. The
 * names are the footstep surfaces, so handling a pail strikes the very metal
 * a boot would. Only `PICKUPS` and `CONTAINERS` names belong here; absent or
 * null keeps the generic cue.
 */
export const HANDLING: Record<string, SurfaceName | null> = {
  // --- stone ---------------------------------------------------------------
  'voidstone-orb': 'stone',
  'pearl-orb': 'stone',
  'oceanglass-orb': 'stone',

  // --- metal ---------------------------------------------------------------
  lantern: 'metal-hollow-small',
  candle: 'metal-ring',
  pail: 'metal-hollow-small',
  'gold-orb': 'metal-solid',
  'quicksilver-orb': 'metal-ring',

  // --- wood ----------------------------------------------------------------
  broom: 'wood',
  rake: 'wood',
  pitchfork: 'wood',
  pinecone: 'wood',
  'scroll-case': 'wood',
  crate: 'wood',
  barrel: 'wood',
  chest: 'wood',
  dresser: 'wood',
  'crate-stack': 'wood',
  'barrel-stack': 'wood',

  // --- cloth ---------------------------------------------------------------
  sack: 'cloth',

  // --- paper ---------------------------------------------------------------
  'leather-book': 'paper',
  'cloth-book': 'paper',
  'vellum-book': 'paper',
  'gilt-book': 'paper',
  'board-book': 'paper',
  'battered-book': 'paper',
  'clasped-tome': 'paper',
  ledger: 'paper',
  pamphlet: 'paper',
  'folded-letter': 'paper',
  'loose-note': 'paper',
  'roller-scroll': 'paper',
};
