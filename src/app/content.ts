import { content } from 'virtual:project';
import { zoneFromDocument, portalsFromManifest, type PortalManifest, type ZoneDocument } from '../world/document';
import type { ZoneDefinition } from '../world/Zone';
import type { PortalDefinition } from '../world/Portal';
import type { WorldState } from '../world/entry';

/**
 * A project's documents, as zones.
 *
 * Dropping a file into `content/zones/` is all it takes for a zone to exist:
 * nothing is registered by hand, which is what lets the editor create a zone
 * without anyone touching code.
 */

export interface ContentWorld {
  zones: ZoneDefinition[];
  portals: PortalDefinition[];
  documents: ZoneDocument[];
}

export function contentWorld(project: string, state?: WorldState): ContentWorld {
  const bundle = content[project];
  if (!bundle) return { zones: [], portals: [], documents: [] };

  const documents = Object.entries(bundle.zones)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, doc]) => doc as ZoneDocument);

  // Definitions first: a portal end reads the zone it stands in, and both
  // zones have to be registered before either door is placed.
  const zones = documents.map((doc) => zoneFromDocument(doc, state));

  const manifest = Object.values(bundle.world)[0] as PortalManifest | undefined;
  const portals = manifest ? portalsFromManifest(manifest) : [];
  return { zones, portals, documents };
}

/** A sidecar raster's URL, by the file name a document names. */
export function sidecarUrl(project: string, file: string): string | undefined {
  const bundle = content[project];
  if (!bundle) return undefined;
  const match = Object.entries(bundle.sidecars).find(([path]) => path.endsWith(`/${file}`));
  return match?.[1];
}
