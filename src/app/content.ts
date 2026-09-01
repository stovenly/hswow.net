import { content } from 'virtual:project';
import {
  holdSidecar,
  portalsFromManifest,
  zoneFromDocument,
  type PortalManifest,
  type ZoneDocument,
} from '../world/document';
import type { ZoneDefinition } from '../world/Zone';
import type { PortalDefinition } from '../world/Portal';
import type { WorldState } from '../world/entry';
import { holdCast, type PersonDocument, type TraitDocument } from '../world/people';

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
  manifest: PortalManifest;
}

/**
 * Interpreted once per project. The editor edits the document objects the world
 * is already reading, so a second interpretation would hand it copies and every
 * change would go nowhere.
 */
const interpreted = new Map<string, ContentWorld>();

/**
 * Fetches every sidecar raster a project carries. Awaited before any document is
 * interpreted, because a terrain built without its sculpt layer is the wrong
 * ground and everything settled onto it is in the wrong place.
 */
export async function loadSidecars(project: string): Promise<void> {
  const bundle = content[project];
  if (!bundle) return;
  await Promise.all(
    Object.entries(bundle.sidecars).map(async ([path, url]) => {
      const file = path.split('/').pop();
      if (!file) return;
      try {
        const response = await fetch(url);
        if (response.ok) holdSidecar(file, await response.arrayBuffer());
      } catch {
        // A missing raster is a level with no sculpting in it, which is a real
        // answer: the shapes still build.
      }
    }),
  );
}

export function contentWorld(project: string, state?: WorldState): ContentWorld {
  const held = interpreted.get(project);
  if (held) return held;
  const world = interpret(project, state);
  interpreted.set(project, world);
  return world;
}

function interpret(project: string, state?: WorldState): ContentWorld {
  const bundle = content[project];
  if (!bundle) return { zones: [], portals: [], documents: [], manifest: { portals: [] } };

  const documents = Object.entries(bundle.zones)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, doc]) => doc as ZoneDocument);

  // Before any zone is interpreted: a creature entry naming a person reads its
  // body off that person, and the warm pass runs before the walk.
  holdCast(
    Object.values(bundle.people) as PersonDocument[],
    Object.values(bundle.traits) as TraitDocument[],
  );

  // Definitions first: a portal end reads the zone it stands in, and both
  // zones have to be registered before either door is placed.
  const zones = documents.map((doc) => zoneFromDocument(doc, state));

  const manifest = (Object.values(bundle.world)[0] as PortalManifest | undefined) ?? { portals: [] };
  return { zones, portals: portalsFromManifest(manifest), documents, manifest };
}

/** A sidecar raster's URL, by the file name a document names. */
export function sidecarUrl(project: string, file: string): string | undefined {
  const bundle = content[project];
  if (!bundle) return undefined;
  const match = Object.entries(bundle.sidecars).find(([path]) => path.endsWith(`/${file}`));
  return match?.[1];
}
