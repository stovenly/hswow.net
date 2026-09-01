import type { ZoneDocument, PortalManifest } from '../world/document';

/**
 * The editor's half of the save endpoint. Same origin as the dev server, so
 * there is no CORS, no port and no second process.
 */

const ROOT = '/__editor/projects';

export interface Listing {
  id: string;
  mtime: number;
}

/** A content family that is one flat directory of documents. Zones are not one. */
export type Family = 'people' | 'traits' | 'quests';

/** Anything with an id, which is every document in a family. */
export interface Named {
  id: string;
}

export class SaveConflict extends Error {
  readonly theirs: unknown;
  constructor(theirs: unknown) {
    super('the file on disk is newer');
    this.name = 'SaveConflict';
    this.theirs = theirs;
  }
}

export class Api {
  private readonly project: string;
  /** The mtime each document was loaded at, so a stale write is refused. */
  private readonly stamps = new Map<string, number>();

  constructor(project: string) {
    this.project = project;
  }

  private url(path: string): string {
    return `${ROOT}/${encodeURIComponent(this.project)}${path}`;
  }

  async zones(): Promise<Listing[]> {
    const response = await fetch(this.url('/zones'));
    if (!response.ok) throw new Error(await response.text());
    const listing = (await response.json()) as Listing[];
    for (const entry of listing) this.stamps.set(entry.id, entry.mtime);
    return listing;
  }

  async zone(id: string): Promise<ZoneDocument> {
    const response = await fetch(this.url(`/zones/${encodeURIComponent(id)}`));
    if (!response.ok) throw new Error(await response.text());
    const mtime = Number(response.headers.get('x-mtime') ?? 0);
    this.stamps.set(id, mtime);
    return (await response.json()) as ZoneDocument;
  }

  async saveZone(doc: ZoneDocument): Promise<void> {
    const response = await fetch(this.url(`/zones/${encodeURIComponent(doc.id)}`), {
      method: 'PUT',
      headers: { 'content-type': 'application/json', 'x-mtime': String(this.stamps.get(doc.id) ?? 0) },
      body: JSON.stringify(doc, null, 2),
    });
    if (response.status === 409) throw new SaveConflict(await response.json());
    if (!response.ok) throw new Error(await response.text());
    this.stamps.set(doc.id, Number(response.headers.get('x-mtime') ?? 0));
  }

  async list(family: Family): Promise<Listing[]> {
    const response = await fetch(this.url(`/${family}`));
    if (!response.ok) throw new Error(await response.text());
    const listing = (await response.json()) as Listing[];
    for (const entry of listing) this.stamps.set(`${family}/${entry.id}`, entry.mtime);
    return listing;
  }

  async read<T extends Named>(family: Family, id: string): Promise<T> {
    const response = await fetch(this.url(`/${family}/${encodeURIComponent(id)}`));
    if (!response.ok) throw new Error(await response.text());
    this.stamps.set(`${family}/${id}`, Number(response.headers.get('x-mtime') ?? 0));
    return (await response.json()) as T;
  }

  async write(family: Family, doc: Named): Promise<void> {
    const key = `${family}/${doc.id}`;
    const response = await fetch(this.url(`/${family}/${encodeURIComponent(doc.id)}`), {
      method: 'PUT',
      headers: { 'content-type': 'application/json', 'x-mtime': String(this.stamps.get(key) ?? 0) },
      body: JSON.stringify(doc, null, 2),
    });
    if (response.status === 409) throw new SaveConflict(await response.json());
    if (!response.ok) throw new Error(await response.text());
    this.stamps.set(key, Number(response.headers.get('x-mtime') ?? 0));
  }

  async rename(family: Family, from: string, to: string): Promise<void> {
    const response = await fetch(this.url(`/${family}/${encodeURIComponent(from)}/rename`), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ to }),
    });
    if (!response.ok) throw new Error(await response.text());
    this.stamps.delete(`${family}/${from}`);
  }

  async remove(family: Family, id: string): Promise<void> {
    const response = await fetch(this.url(`/${family}/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(await response.text());
    this.stamps.delete(`${family}/${id}`);
  }

  async world(): Promise<PortalManifest> {
    const response = await fetch(this.url('/world'));
    if (!response.ok) throw new Error(await response.text());
    this.stamps.set('__world', Number(response.headers.get('x-mtime') ?? 0));
    return (await response.json()) as PortalManifest;
  }

  async saveWorld(manifest: PortalManifest): Promise<void> {
    const response = await fetch(this.url('/world'), {
      method: 'PUT',
      headers: { 'content-type': 'application/json', 'x-mtime': String(this.stamps.get('__world') ?? 0) },
      body: JSON.stringify(manifest, null, 2),
    });
    if (response.status === 409) throw new SaveConflict(await response.json());
    if (!response.ok) throw new Error(await response.text());
    this.stamps.set('__world', Number(response.headers.get('x-mtime') ?? 0));
  }

  async renameZone(from: string, to: string): Promise<void> {
    const response = await fetch(this.url(`/zones/${encodeURIComponent(from)}/rename`), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ to }),
    });
    if (!response.ok) throw new Error(await response.text());
    this.stamps.delete(from);
  }

  async deleteZone(id: string): Promise<void> {
    const response = await fetch(this.url(`/zones/${encodeURIComponent(id)}`), { method: 'DELETE' });
    if (!response.ok) throw new Error(await response.text());
    this.stamps.delete(id);
  }

  /** A sidecar raster, as raw bytes. */
  async saveRaster(zone: string, layer: string, bytes: ArrayBuffer): Promise<void> {
    const response = await fetch(
      this.url(`/zones/${encodeURIComponent(zone)}/${encodeURIComponent(layer)}`),
      { method: 'PUT', headers: { 'content-type': 'application/octet-stream' }, body: bytes },
    );
    if (!response.ok) throw new Error(await response.text());
  }

  /** Takes a mtime the client did not get from a load — after a conflict reload. */
  accept(id: string, mtime: number): void {
    this.stamps.set(id, mtime);
  }
}
