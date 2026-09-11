import * as THREE from 'three';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';
import { solveCatenary } from '../water/flotilla';
import { FENCE_POST } from '../posts';
import { Walk, chordBoxes, drift, hashOf, spacing, yawAlong, type Laid, type Line, type LineBuilder, type LayContext, type PlacedProp, type OrientedBox } from './walk';

// A fence along a painted line: posts vertical at their own ground at even
// spacing per run, rails post top to post top, a gate or a stile at its mark.

interface FenceStyle {
  pitch: number;
  rails: readonly number[];
  pales?: number;
  rope?: boolean;
}

const STYLES: Record<string, FenceStyle> = {
  'post-and-rail': { pitch: 2.4, rails: [0.35, 0.75, 1.15] },
  picket: { pitch: 1.8, rails: [0.3, 0.85], pales: 0.14 },
  rope: { pitch: 3.0, rails: [] , rope: true },
};

/** Posts stand this tall above their own ground. */
const POST_HEIGHT = 1.25;
const RAIL_HEIGHT = 0.075;
const RAIL_DEPTH = 0.05;

interface Post {
  x: number;
  z: number;
  y: number;
  size: number;
  lean: number;
  tx: number;
  tz: number;
}

/** A rail from one post to the next, sagging in the middle when cleft. */
function rail(a: Post, b: Post, height: number, sag: number, colour: number, side: number): Part {
  const from = new THREE.Vector3(a.x + a.tz * side, a.y + height, a.z - a.tx * side);
  const to = new THREE.Vector3(b.x + b.tz * side, b.y + height, b.z - b.tx * side);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const run = Math.hypot(dx, dz);
  const length = Math.hypot(run, dy);
  const geometry = new THREE.BoxGeometry(length, RAIL_HEIGHT, RAIL_DEPTH);
  // Pitched to the two post tops, then swung to the chord: rotateY(yaw) takes +X to (cos yaw, 0, −sin yaw).
  geometry.rotateZ(Math.atan2(dy, run));
  geometry.rotateY(Math.atan2(-dz, dx));
  geometry.translate((from.x + to.x) / 2, (from.y + to.y) / 2 - sag, (from.z + to.z) / 2);
  return { geometry, color: colour, sway: 0 };
}

export const fenceLine: LineBuilder = {
  name: 'fence',
  styles: Object.keys(STYLES),
  props: ['gate', 'stile'],
  options: {
    stepped: { type: 'boolean', label: 'level rails' },
    slack: { type: 'number', min: 0, max: 0.6, step: 0.01 },
  },

  lay(line: Line, ctx: LayContext): Laid {
    const style = STYLES[line.style ?? 'post-and-rail'] ?? STYLES['post-and-rail'];
    const rng = createRng(line.seed);
    const walk = new Walk(line);
    const parts: Part[] = [];
    const colliders: OrientedBox[] = [];
    const props: PlacedProp[] = [];
    const postWood = shade(PALETTE.TIMBER_DARK, rng.range(0.9, 1.05));
    const railWood = shade(PALETTE.TIMBER, rng.range(0.9, 1.06));
    const cleft = rng.chance(0.6);
    const stepped = line.options?.stepped === true;
    const slack = typeof line.options?.slack === 'number' ? line.options.slack : 0.12;
    let index = 0;

    for (const run of walk.runs(line.marks)) {
      const length = run.s1 - run.s0;
      if (run.mark) {
        const at = walk.at(walk.wrap(run.mark.at));
        const seed = run.mark.seed ?? line.seed + Math.round(run.mark.at * 10);
        if (run.mark.kind === 'gate') {
          const width = run.mark.width ?? 3;
          props.push({ builder: run.mark.builder ?? 'gate', at: [at.x, at.z], yaw: yawAlong(at), seed, options: { width, ...(run.mark.options ?? {}) } });
        } else if (run.mark.kind === 'stile') {
          props.push({ builder: run.mark.builder ?? 'stile', at: [at.x, at.z], yaw: yawAlong(at), seed, options: run.mark.options });
        } else if (run.mark.builder) {
          props.push({ builder: run.mark.builder, at: [at.x, at.z], yaw: yawAlong(at), seed, options: run.mark.options });
        }
        continue;
      }

      // Corner and end posts first, then the run divided equally.
      const { count, step } = spacing(length, style.pitch);
      const posts: Post[] = [];
      for (let k = 0; k <= count; k++) {
        const s = walk.wrap(run.s0 + step * k);
        const st = walk.at(s);
        const terminal = k === 0 || k === count;
        const y = ctx.groundAt(st.x, st.z);
        const lean = terminal ? 0 : drift(s, line.seed) * 0.052 * (0.4 + 0.6 * hashOf(line.seed, index, 1));
        const post: Post = { x: st.x, z: st.z, y, size: FENCE_POST * (terminal ? 1.33 : 1), lean, tx: st.tx, tz: st.tz };
        posts.push(post);
        const shaft = new THREE.BoxGeometry(post.size, POST_HEIGHT + 0.5, post.size);
        shaft.translate(0, (POST_HEIGHT - 0.5) / 2, 0);
        shaft.rotateY(hashOf(line.seed, index, 2) * 0.1 - 0.05);
        // Leaning along the run: rotateZ takes +Y toward +X, then the yaw carries +X onto the tangent.
        shaft.rotateZ(lean);
        shaft.rotateY(Math.atan2(-st.tz, st.tx));
        shaft.translate(st.x, y, st.z);
        parts.push({ geometry: shaft, color: shade(postWood, 0.94 + hashOf(line.seed, index, 3) * 0.12), sway: 0 });
        index++;
      }

      for (let k = 0; k + 1 < posts.length; k++) {
        const a = posts[k];
        const b = posts[k + 1];
        const span = Math.hypot(b.x - a.x, b.z - a.z);
        if (style.rope) {
          const from = new THREE.Vector3(a.x, a.y + POST_HEIGHT - 0.1, a.z);
          const to = new THREE.Vector3(b.x, b.y + POST_HEIGHT - 0.1, b.z);
          const points = Array.from({ length: 13 }, () => new THREE.Vector3());
          solveCatenary(from, to, from.distanceTo(to) * (1 + slack), points);
          for (let i = 0; i + 1 < points.length; i++) {
            parts.push({ geometry: rod(points[i], points[i + 1], 0.022, 0.022, 5), color: 0x8a7550, sway: 0 });
          }
          continue;
        }
        const sag = cleft ? 0.006 * span * span : 0;
        for (const h of style.rails) {
          if (stepped) {
            const level = Math.max(a.y, b.y);
            const flat: Post = { ...a, y: level };
            const flatB: Post = { ...b, y: level };
            parts.push(rail(flat, flatB, h, sag, railWood, FENCE_POST / 2 + RAIL_DEPTH / 2 - 0.01));
          } else {
            parts.push(rail(a, b, h, sag, railWood, FENCE_POST / 2 + RAIL_DEPTH / 2 - 0.01));
          }
        }
        if (style.pales) {
          const pales = Math.max(1, Math.round(span / style.pales));
          for (let p = 1; p < pales; p++) {
            const t = p / pales;
            const x = a.x + (b.x - a.x) * t;
            const z = a.z + (b.z - a.z) * t;
            const y = a.y + (b.y - a.y) * t;
            const tall = style.rails[style.rails.length - 1] + 0.18 + (hashOf(line.seed, index, 4) - 0.5) * 0.04;
            const pale = new THREE.BoxGeometry(0.07, tall, 0.02);
            pale.translate(0, tall / 2, 0);
            const point = new THREE.ConeGeometry(0.05, 0.06, 4);
            point.rotateY(Math.PI / 4);
            point.translate(0, tall + 0.03, 0);
            for (const g of [pale, point]) {
              g.rotateY(Math.atan2(-a.tz, a.tx));
              g.translate(x + a.tz * 0.045, y, z - a.tx * 0.045);
              parts.push({ geometry: g, color: shade(PALETTE.TIMBER_PALE, 0.92 + hashOf(line.seed, index, 5) * 0.14), sway: 0 });
            }
            index++;
          }
        }
      }
      colliders.push(...chordBoxes(walk, run.s0, run.s1, FENCE_POST, POST_HEIGHT, ctx.groundAt));
    }

    return { parts, colliders, props, underfoot: 'wood' };
  },
};
