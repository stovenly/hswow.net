import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Builds one project into its own site repo and pushes it.
 *
 * `docs/<id>` is a clone of that project's site repo, made once by hand:
 *   git clone <site-repo> docs/<id>
 * The engine repo carries no built output at all — each game is hosted from
 * its own repo, with its own Pages settings, domain and history.
 */

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) {
  console.error('usage: npm run deploy -- <project id>');
  process.exit(1);
}

const project = path.join(ROOT, 'projects', id, 'project.json');
if (!fs.existsSync(project)) {
  console.error(`no projects/${id}/project.json`);
  process.exit(1);
}

const out = path.join(ROOT, 'docs', id);
if (!fs.existsSync(path.join(out, '.git'))) {
  console.error(`docs/${id} is not a git clone. Run: git clone <site-repo> docs/${id}`);
  process.exit(1);
}

const run = (cmd, args, cwd = ROOT) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });

run('npm', ['run', 'worklets']);
run('npx', ['tsc', '--noEmit']);
run('npx', ['vite', 'build', '--mode', id]);

run('git', ['add', '-A'], out);
const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: out }).toString().trim();
if (!dirty) {
  console.log('nothing changed');
  process.exit(0);
}
run('git', ['commit', '-m', `Build ${id}`], out);
run('git', ['push'], out);
