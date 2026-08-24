import fs from 'node:fs';
import path from 'node:path';

/**
 * The editor's save endpoint, mounted on the dev server.
 *
 * Writes go to a temp file and are renamed, and every write carries the mtime
 * the client loaded at: a second tab or a git checkout is refused with a 409
 * rather than silently clobbered.
 */

const PREFIX = '/__editor/projects/';

/** File names the editor may write, so a path cannot walk out of the project. */
const SAFE = /^[a-z0-9][a-z0-9._-]*$/i;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

function text(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'text/plain');
  res.end(body);
}

function mtimeOf(file) {
  try {
    return Math.floor(fs.statSync(file).mtimeMs);
  } catch {
    return 0;
  }
}

function writeAtomic(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, data);
  fs.renameSync(temp, file);
  return mtimeOf(file);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/**
 * @param root repo root
 * @param onWrite called with each written path, so the reload banner can ignore it
 */
export function editorRoutes(root, onWrite = () => {}) {
  return async function middleware(req, res, next) {
    const url = req.url ?? '';
    if (!url.startsWith(PREFIX)) return next();

    const parts = url.split('?')[0].slice(PREFIX.length).split('/').filter(Boolean).map(decodeURIComponent);
    const project = parts.shift();
    if (!project || !SAFE.test(project)) return text(res, 400, 'bad project');

    const content = path.join(root, 'projects', project, 'content');
    const zones = path.join(content, 'zones');

    try {
      // GET /zones — ids and mtimes
      if (parts[0] === 'zones' && parts.length === 1 && req.method === 'GET') {
        if (!fs.existsSync(zones)) return json(res, 200, []);
        const listing = fs
          .readdirSync(zones)
          .filter((name) => name.endsWith('.json'))
          .map((name) => ({ id: name.slice(0, -5), mtime: mtimeOf(path.join(zones, name)) }));
        return json(res, 200, listing);
      }

      // /world
      if (parts[0] === 'world' && parts.length === 1) {
        const file = path.join(content, 'world.json');
        if (req.method === 'GET') {
          const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '{"portals":[]}';
          res.setHeader('x-mtime', String(mtimeOf(file)));
          res.setHeader('content-type', 'application/json');
          return res.end(body);
        }
        if (req.method === 'PUT') {
          const known = Number(req.headers['x-mtime'] ?? 0);
          const now = mtimeOf(file);
          if (now && known && now > known) {
            return json(res, 409, JSON.parse(fs.readFileSync(file, 'utf8')));
          }
          const stamp = writeAtomic(file, await readBody(req));
          onWrite(file);
          res.setHeader('x-mtime', String(stamp));
          return json(res, 200, { ok: true });
        }
      }

      if (parts[0] === 'zones' && parts[1] && SAFE.test(parts[1])) {
        const id = parts[1];
        const file = path.join(zones, `${id}.json`);

        // POST /zones/:id/rename
        if (parts[2] === 'rename' && req.method === 'POST') {
          const { to } = JSON.parse((await readBody(req)).toString('utf8'));
          if (!to || !SAFE.test(to)) return text(res, 400, 'bad id');
          fs.renameSync(file, path.join(zones, `${to}.json`));
          for (const name of fs.readdirSync(zones)) {
            if (!name.startsWith(`${id}.`) || name.endsWith('.json')) continue;
            fs.renameSync(path.join(zones, name), path.join(zones, `${to}.${name.slice(id.length + 1)}`));
          }
          const world = path.join(content, 'world.json');
          if (fs.existsSync(world)) {
            const manifest = JSON.parse(fs.readFileSync(world, 'utf8'));
            for (const portal of manifest.portals ?? []) {
              if (portal.a?.zone === id) portal.a.zone = to;
              if (portal.b?.zone === id) portal.b.zone = to;
            }
            writeAtomic(world, JSON.stringify(manifest, null, 2));
          }
          onWrite(file);
          return json(res, 200, { ok: true });
        }

        // PUT /zones/:id/:layer — a sidecar raster, raw bytes
        if (parts[2] && SAFE.test(parts[2]) && req.method === 'PUT') {
          const sidecar = path.join(zones, `${id}.${parts[2]}`);
          writeAtomic(sidecar, await readBody(req));
          onWrite(sidecar);
          return json(res, 200, { ok: true });
        }

        // GET /zones/:id/:layer
        if (parts[2] && SAFE.test(parts[2]) && req.method === 'GET') {
          const sidecar = path.join(zones, `${id}.${parts[2]}`);
          if (!fs.existsSync(sidecar)) return text(res, 404, 'no such raster');
          res.setHeader('content-type', 'application/octet-stream');
          return res.end(fs.readFileSync(sidecar));
        }

        if (req.method === 'GET') {
          if (!fs.existsSync(file)) return text(res, 404, 'no such zone');
          res.setHeader('x-mtime', String(mtimeOf(file)));
          res.setHeader('content-type', 'application/json');
          return res.end(fs.readFileSync(file, 'utf8'));
        }

        if (req.method === 'PUT') {
          const known = Number(req.headers['x-mtime'] ?? 0);
          const now = mtimeOf(file);
          if (now && known && now > known) {
            return json(res, 409, JSON.parse(fs.readFileSync(file, 'utf8')));
          }
          const stamp = writeAtomic(file, await readBody(req));
          onWrite(file);
          res.setHeader('x-mtime', String(stamp));
          return json(res, 200, { ok: true });
        }

        if (req.method === 'DELETE') {
          if (fs.existsSync(file)) fs.unlinkSync(file);
          for (const name of fs.readdirSync(zones)) {
            if (name.startsWith(`${id}.`) && !name.endsWith('.json')) {
              fs.unlinkSync(path.join(zones, name));
            }
          }
          const world = path.join(content, 'world.json');
          if (fs.existsSync(world)) {
            const manifest = JSON.parse(fs.readFileSync(world, 'utf8'));
            manifest.portals = (manifest.portals ?? []).filter(
              (portal) => portal.a?.zone !== id && portal.b?.zone !== id,
            );
            writeAtomic(world, JSON.stringify(manifest, null, 2));
          }
          onWrite(file);
          return json(res, 200, { ok: true });
        }
      }

      return text(res, 404, 'no such editor route');
    } catch (error) {
      return text(res, 500, error instanceof Error ? error.message : String(error));
    }
  };
}
