/**
 * Guards on the Faust tier.
 *
 * `npm run check:faust`
 *
 * Three of these protect against failures that are invisible until they are
 * catastrophic, and one against a mistake that would cost seven megabytes
 * without breaking anything at all.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { buildFaust } from './faust-build';

const SOURCE = path.join(process.cwd(), 'src/audio/faust');
const BUILT = path.join(SOURCE, 'built');

let failures = 0;

function check(label: string, ok: boolean, detail: string): void {
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label.padEnd(38)} ${detail}`);
}

const sources = fs.readdirSync(SOURCE).filter((f) => f.endsWith('.dsp')).sort();

// --- the committed artifacts match their sources --------------------------
//
// The whole point of committing the wasm is that a build machine never needs
// the Faust toolchain — which only holds if the committed bytes are the ones
// the committed source produces. Recompiling and comparing is the only honest
// way to know. Note that this *overwrites* the artifacts: a failure here has
// already been repaired on disk, and the failure exists to make the drift show
// up as a diff rather than passing silently.
const before = new Map<string, Buffer>();
for (const file of sources) {
  const wasm = path.join(BUILT, `${file.replace(/\.dsp$/, '')}.wasm`);
  if (fs.existsSync(wasm)) before.set(file, fs.readFileSync(wasm));
}

const built = buildFaust();

check(
  'every .dsp has a committed .wasm',
  sources.length === built.length && sources.every((f) => before.has(f)),
  `${built.length} modules: ${built.map((b) => b.name).join(', ')}`,
);

for (const result of built) {
  const file = `${result.name}.dsp`;
  const now = fs.readFileSync(path.join(BUILT, `${result.name}.wasm`));
  const was = before.get(file);
  check(
    `${result.name} artifact is current`,
    was !== undefined && was.equals(now),
    was === undefined
      ? 'no committed wasm — it has been generated, commit it'
      : was.equals(now)
        ? `${(now.length / 1024).toFixed(1)} kB, unchanged`
        : 'REBUILT AND DIFFERENT — the committed wasm was stale, commit the new one',
  );
}

// --- nothing needs SharedArrayBuffer --------------------------------------
//
// **This is the one that decides whether any of it can ship.** SharedArrayBuffer
// requires the page to be cross-origin isolated, which requires COOP and COEP
// response headers, which GitHub Pages cannot set and has no plan to. A module
// that imported shared memory would work perfectly in dev and be dead on
// deploy, so it is asserted rather than assumed.
for (const result of built) {
  const bytes = fs.readFileSync(path.join(BUILT, `${result.name}.wasm`));
  const module = new WebAssembly.Module(bytes);
  const imports = WebAssembly.Module.imports(module);
  const shared = imports.filter((i) => i.kind === 'memory');
  check(
    `${result.name} needs no shared memory`,
    shared.length === 0,
    shared.length === 0
      ? `${imports.length} imports, all ${[...new Set(imports.map((i) => i.kind))].join('/')}`
      : 'imports memory — cannot be cross-origin isolated on Pages',
  );

  // Every import has to be satisfied by hand in `processor.js`. An unknown one
  // is a `LinkError` at node-creation time, which surfaces as a sound that
  // silently never plays.
  const unknown = imports.filter((i) => i.module !== 'env' || !i.name.startsWith('_'));
  check(
    `${result.name} imports only libm`,
    unknown.length === 0,
    unknown.length === 0
      ? imports.map((i) => i.name).join(', ')
      : `unhandled: ${unknown.map((i) => `${i.module}.${i.name}`).join(', ')}`,
  );
}

// --- the compiler does not ship -------------------------------------------
//
// `@grame/faustwasm` has two entry points that differ by a factor of forty:
// `dist/esm` is the runtime, `dist/esm-bundle` inlines the whole Faust
// compiler at 7.26 MB. Importing the wrong one is one character of difference,
// produces no error, and would quietly quadruple the bundle. Nothing under
// `src/` should import the package at all — it is a build-time dependency, and
// the worklet glue is hand-written precisely so that stays true.
function sourceFiles(dir: string, into: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, into);
    else if (/\.(ts|js)$/.test(entry.name)) into.push(full);
  }
  return into;
}

// Matched as an *import*, not as a mention. The first version of this grepped
// for the package name anywhere in the file and duly failed on `processor.js`,
// whose header explains at length why it does not use the package.
const IMPORTS_FAUSTWASM = /(?:from|import|require)\s*\(?\s*['"]@grame\/faustwasm/;
const offenders = sourceFiles(path.join(process.cwd(), 'src')).filter((file) =>
  IMPORTS_FAUSTWASM.test(fs.readFileSync(file, 'utf8')),
);
check(
  'no runtime source imports faustwasm',
  offenders.length === 0,
  offenders.length === 0
    ? 'build-time dependency only'
    : offenders.map((f) => path.relative(process.cwd(), f)).join(', '),
);

// --- the tier stays small -------------------------------------------------
const total = built.reduce((sum, b) => sum + b.bytes, 0);
const CEILING = 512 * 1024;
check(
  'compiled modules stay under budget',
  total < CEILING,
  `${(total / 1024).toFixed(1)} kB of ${(CEILING / 1024).toFixed(0)} kB across ${built.length}`,
);

console.log(`\n${failures === 0 ? 'all checks passed' : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
