import type * as THREE from 'three';
import { builderByName } from '../art/registry';

/**
 * The item and container tables: which builders make one hand-sized thing a
 * person could stow in a pack, which of those are tools, and which builders
 * make something stock is kept in. Comparative judgements, so they live in one
 * list, not on the builders.
 */

export type ItemKind = 'tool' | 'accessory' | 'stuff';

export interface Item {
  /** What the player reads: the list row and the crosshair tooltip. */
  name: string;
  /** Which slots it fits: only a tool in the tool slot, only an accessory in an accessory slot. */
  kind: ItemKind;
  /** The builder that makes its mesh. Absent for stock with no art yet. */
  builder?: string;
  /** The seed the world mesh carried, so a drop rebuilds the same object. */
  seed?: number;
  /** Everything else the thing knows about itself. Plain JSON; see ITEM_STATE. */
  state?: Record<string, unknown>;
}

/** The pickups with pages in them: E opens the reading screen, bound note or not. */
const READABLES = new Set([
  'leather-book',
  'cloth-book',
  'vellum-book',
  'gilt-book',
  'board-book',
  'battered-book',
  'clasped-tome',
  'ledger',
  'pamphlet',
  'folded-letter',
  'loose-note',
  'roller-scroll',
  'scroll-case',
]);

/** One complete thing, hand-sized. Piles, furniture and arrangements stay out. */
const PICKUPS = new Set([
  'lantern',
  'candle',
  'broom',
  'rake',
  'pitchfork',
  'pail',
  'pinecone',
  'voidstone-orb',
  'gold-orb',
  'pearl-orb',
  'quicksilver-orb',
  'oceanglass-orb',
  ...READABLES,
]);

/** The pickups that fit the primary tool slot. */
const TOOLS = new Set(['broom', 'rake', 'pitchfork', 'pail', 'lantern', 'candle']);

/** Things stock is kept in, big enough to hold it, by builder name. The value is the tooltip. */
export const CONTAINERS: Record<string, string> = {
  crate: 'Crate',
  barrel: 'Barrel',
  chest: 'Chest',
  dresser: 'Dresser',
  sack: 'Sack',
  'crate-stack': 'Crate Pile',
  'barrel-stack': 'Barrel Pile',
};

export function isPickup(builder: string): boolean {
  return PICKUPS.has(builder);
}

export function isReadable(builder: string): boolean {
  return READABLES.has(builder);
}

export function kindOf(builder: string): ItemKind {
  return TOOLS.has(builder) ? 'tool' : 'stuff';
}

export function displayOf(builder: string, seed?: number): string {
  const made = builderByName(builder);
  // Derived from the seed, never from a mesh: container stock is named before
  // anything is built, and has to agree with the thing once it is.
  if (seed !== undefined && made?.nameFor) return made.nameFor(seed);
  if (made?.display) return made.display;
  return builder
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Item state that travels: each key knows how to read itself off a built mesh
 * at pickup and write itself back at drop. Keys a build does not know still
 * round-trip through the pack and the saves untouched.
 */
const ITEM_STATE: Record<
  string,
  {
    capture(mesh: THREE.Object3D): unknown;
    restore(mesh: THREE.Object3D, value: unknown): void;
  }
> = {
  // A readable's note binding — `userData.text`, the contract with Interaction.
  text: {
    capture: (mesh) => (typeof mesh.userData.text === 'string' ? mesh.userData.text : undefined),
    restore: (mesh, value) => {
      if (typeof value === 'string') mesh.userData.text = value;
    },
  },
};

export function captureState(mesh: THREE.Object3D): Record<string, unknown> | undefined {
  let state: Record<string, unknown> | undefined;
  for (const [key, row] of Object.entries(ITEM_STATE)) {
    const value = row.capture(mesh);
    if (value === undefined) continue;
    state ??= {};
    state[key] = value;
  }
  return state;
}

export function restoreState(mesh: THREE.Object3D, state: Record<string, unknown> | undefined): void {
  if (!state) return;
  for (const [key, value] of Object.entries(state)) {
    ITEM_STATE[key]?.restore(mesh, value);
  }
}
