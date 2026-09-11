import * as THREE from 'three';
import type { Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { roughBox, stoneColours } from '../masonry';
import { rod } from '../rod';
import { solveCatenary } from '../water/flotilla';
import { Walk, chordBoxes, footprintOf, hashOf, spacing, yawAlong, type Laid, type Line, type LineBuilder, type LayContext, type OrientedBox, type PlacedProp } from './walk';

// The small line builders: a kerb of long stones, a jetty on piles into the
// water, a rope between posts.

export const kerbLine: LineBuilder = {
  name: 'kerb',
  props: [],
  lay(line: Line, ctx: LayContext): Laid {
    const rng = createRng(line.seed);
    const walk = new Walk(line);
    const parts: Part[] = [];
    const stone = stoneColours(rng, 0.1);
    for (const run of walk.runs(line.marks)) {
      if (run.mark) continue;
      let s = run.s0;
      let i = 0;
      while (s < run.s1 - 0.05) {
        const len = Math.min(run.s1 - s, 0.6 + hashOf(line.seed, i, 1) * 0.3);
        const a = walk.at(walk.wrap(s));
        const b = walk.at(walk.wrap(s + len));
        const cx = (a.x + b.x) / 2;
        const cz = (a.z + b.z) / 2;
        const chord = Math.hypot(b.x - a.x, b.z - a.z);
        const y = ctx.groundAt(cx, cz);
        const box = roughBox(rng, [-chord / 2 + 0.008, chord / 2 - 0.008], [y - 0.12, y + 0.16], [-0.08, 0.08], 0.008);
        // rotateY(yaw) takes +X to (cos yaw, 0, −sin yaw), the chord.
        box.rotateY(Math.atan2(-(b.z - a.z), b.x - a.x));
        box.translate(cx, 0, cz);
        parts.push({ geometry: box, color: stone(), sway: 0 });
        s += len;
        i++;
      }
    }
    return { parts, colliders: [], props: [], footprint: footprintOf(walk, 0.12), underfoot: 'stone' };
  },
};

interface JettyStyle {
  pilePitch: number;
  freeboard: number;
  boards: boolean;
}

const JETTY_STYLES: Record<string, JettyStyle> = {
  pier: { pilePitch: 2.0, freeboard: 0.6, boards: true },
  pontoon: { pilePitch: 3.0, freeboard: 0.25, boards: true },
};

/**
 * A jetty: piles at even spacing standing on the bed and reaching the deck, a
 * boarded deck at the water's level plus freeboard, read from the water under
 * it; a mooring post at each `post` mark. Piles are emitted as `wades`.
 */
export const jettyLine: LineBuilder = {
  name: 'jetty',
  styles: Object.keys(JETTY_STYLES),
  props: ['post'],
  options: { width: { type: 'number', min: 0.8, max: 6, step: 0.1 } },
  lay(line: Line, ctx: LayContext): Laid {
    const style = JETTY_STYLES[line.style ?? 'pier'] ?? JETTY_STYLES.pier;
    const width = typeof line.options?.width === 'number' ? line.options.width : 2;
    const rng = createRng(line.seed);
    const walk = new Walk(line);
    const parts: Part[] = [];
    const wades: (readonly [number, number, number])[] = [];
    const props: PlacedProp[] = [];
    const colliders: OrientedBox[] = [];
    const timber = shade(PALETTE.TIMBER_DARK, rng.range(0.85, 1));
    const plank = shade(PALETTE.TIMBER, rng.range(0.9, 1.05));

    // The deck level: the water's level plus freeboard where the line meets water, else the shore's ground.
    let level = -Infinity;
    for (let s = 0; s <= walk.length; s += 1) {
      const st = walk.at(s);
      const water = ctx.waterAt?.(st.x, st.z);
      if (water) level = Math.max(level, water.level + style.freeboard);
    }
    if (level === -Infinity) {
      const start = walk.at(0);
      level = ctx.groundAt(start.x, start.z) + 0.4;
    }

    for (const mark of line.marks) {
      if (mark.kind !== 'post') continue;
      const at = walk.at(walk.wrap(mark.at));
      const side = typeof mark.options?.side === 'number' ? (mark.options.side as number) : 1;
      props.push({ builder: mark.builder ?? 'post', at: [at.x + at.nx * (width / 2 + 0.2) * side, at.z + at.nz * (width / 2 + 0.2) * side], yaw: yawAlong(at), seed: mark.seed ?? line.seed + Math.round(mark.at * 10) });
    }

    const { count, step } = spacing(walk.length, style.pilePitch);
    for (let k = 0; k <= count; k++) {
      const st = walk.at(step * k);
      for (const side of [-1, 1] as const) {
        const x = st.x + st.nx * (width / 2 - 0.1) * side;
        const z = st.z + st.nz * (width / 2 - 0.1) * side;
        const bed = ctx.groundAt(x, z);
        const pile = new THREE.CylinderGeometry(0.11, 0.13, level + 0.15 - bed + 0.5, 7);
        pile.translate(x, (level + 0.15 + bed - 0.5) / 2, z);
        parts.push({ geometry: pile, color: shade(timber, 0.9 + hashOf(line.seed, k * 2 + (side > 0 ? 1 : 0), 1) * 0.2), sway: 0 });
        wades.push([x, z, 0.14]);
      }
      // A cross beam under the deck at each pair.
      const beam = new THREE.BoxGeometry(0.16, 0.14, width - 0.1);
      beam.translate(0, level - 0.07, 0);
      beam.rotateY(yawAlong(st));
      beam.translate(st.x, 0, st.z);
      parts.push({ geometry: beam, color: timber, sway: 0 });
    }
    // Bearers along each edge, per chord.
    const chords = Math.max(1, Math.ceil(walk.length / 3));
    for (let i = 0; i < chords; i++) {
      const a = walk.at((walk.length * i) / chords);
      const b = walk.at((walk.length * (i + 1)) / chords);
      const len = Math.hypot(b.x - a.x, b.z - a.z) + 0.1;
      const yaw = Math.atan2(-(b.z - a.z), b.x - a.x);
      for (const side of [-1, 1] as const) {
        const bearer = new THREE.BoxGeometry(len, 0.12, 0.12);
        bearer.translate(0, level - 0.14, side * (width / 2 - 0.16));
        bearer.rotateY(yaw);
        bearer.translate((a.x + b.x) / 2, 0, (a.z + b.z) / 2);
        parts.push({ geometry: bearer, color: timber, sway: 0 });
      }
    }
    // Boards across, at their own pitch.
    if (style.boards) {
      const boards = Math.max(1, Math.round(walk.length / 0.24));
      for (let k = 0; k < boards; k++) {
        const s = (walk.length * (k + 0.5)) / boards;
        const st = walk.at(s);
        const board = new THREE.BoxGeometry(0.2, 0.05, width + (hashOf(line.seed, k, 3) - 0.5) * 0.06);
        board.translate(0, level + 0.025, 0);
        board.rotateY(yawAlong(st));
        board.translate(st.x, 0, st.z);
        parts.push({ geometry: board, color: shade(plank, 0.9 + hashOf(line.seed, k, 4) * 0.2), sway: 0 });
      }
    }
    return { parts, colliders, props, wades, underfoot: 'wood' };
  },
};

/** A rope from post to post along the line, sagging on the catenary, a post at every point. */
export const ropeLine: LineBuilder = {
  name: 'rope',
  props: [],
  options: { slack: { type: 'number', min: 0, max: 0.6, step: 0.01 } },
  lay(line: Line, ctx: LayContext): Laid {
    const rng = createRng(line.seed);
    const walk = new Walk(line);
    const parts: Part[] = [];
    const slack = typeof line.options?.slack === 'number' ? line.options.slack : 0.15;
    const arcs = walk.pointArcs();
    const tops: THREE.Vector3[] = [];
    for (const s of arcs) {
      const st = walk.at(s);
      const y = ctx.groundAt(st.x, st.z);
      const post = new THREE.CylinderGeometry(0.06, 0.075, 1.5, 6);
      post.translate(st.x, y + 0.5, st.z);
      parts.push({ geometry: post, color: shade(PALETTE.TIMBER_DARK, rng.range(0.85, 1.05)), sway: 0 });
      tops.push(new THREE.Vector3(st.x, y + 1.15, st.z));
    }
    const pairs = line.closed ? tops.length : tops.length - 1;
    for (let i = 0; i < pairs; i++) {
      const a = tops[i];
      const b = tops[(i + 1) % tops.length];
      const points = Array.from({ length: 13 }, () => new THREE.Vector3());
      solveCatenary(a, b, a.distanceTo(b) * (1 + slack), points);
      for (let k = 0; k + 1 < points.length; k++) parts.push({ geometry: rod(points[k], points[k + 1], 0.02, 0.02, 5), color: 0x8a7550, sway: 0 });
    }
    return { parts, colliders: chordBoxes(walk, 0, walk.length, 0.1, 1.1, ctx.groundAt), props: [], underfoot: 'wood' };
  },
};
