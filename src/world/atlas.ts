import type { HorizonProp, PortalManifest, ZoneDocument } from './document';

/**
 * The world as the vista sees it: where every zone stands on the map and what
 * its icon is, which pairs a portal joins, and the far layer every horizon
 * shares. Held once per project by `contentWorld`, read by the ring when a
 * zone's document asks for its neighbours.
 */

/** Metres within which a neighbour is put on the horizon; a portal pair always is. */
export const NEIGHBOUR_REACH = 3000;

export interface Neighbour {
  zone: string;
  icon: string;
  /** World metres from this zone's origin to the neighbour's. +X east, +Z south. */
  dx: number;
  dz: number;
  distance: number;
}

let documents: readonly ZoneDocument[] = [];
let manifest: PortalManifest = {};

export function holdAtlas(docs: readonly ZoneDocument[], portals: PortalManifest): void {
  documents = docs;
  manifest = portals;
}

/** Every other zone with a place and an icon that this one should show. */
export function neighboursOf(zone: string): Neighbour[] {
  const here = documents.find((doc) => doc.id === zone);
  if (!here?.place) return [];
  const linked = new Set<string>();
  for (const portal of manifest.portals ?? []) {
    if (portal.a.zone === zone) linked.add(portal.b.zone);
    if (portal.b.zone === zone) linked.add(portal.a.zone);
  }
  const found: Neighbour[] = [];
  for (const doc of documents) {
    if (doc.id === zone || !doc.place || !doc.vista?.icon) continue;
    const dx = (doc.place.at[0] - here.place.at[0]) * 1000;
    const dz = (doc.place.at[1] - here.place.at[1]) * 1000;
    const distance = Math.hypot(dx, dz);
    if (distance > NEIGHBOUR_REACH && !linked.has(doc.id)) continue;
    found.push({ zone: doc.id, icon: doc.vista.icon, dx, dz, distance });
  }
  return found;
}

/**
 * Every icon and far-layer piece any ring can stand. Two dozen of them, taken
 * whole rather than per cell: which neighbours a ring shows depends on where it
 * is, and this is read where only the entry is in hand.
 */
export function atlasBuilders(): readonly string[] {
  const names = new Set<string>();
  for (const doc of documents) if (doc.vista?.icon) names.add(doc.vista.icon);
  for (const far of manifest.horizon ?? []) names.add(far.builder);
  return [...names];
}

/** The far layer, the same from every cell. */
export function horizonLayer(): readonly HorizonProp[] {
  return manifest.horizon ?? [];
}

/** Where a zone stands on the map, in kilometres, or nowhere. */
export function placeOf(zone: string): readonly [number, number] | null {
  const at = documents.find((doc) => doc.id === zone)?.place?.at;
  return at && at.length >= 2 ? [at[0], at[1]] : null;
}
