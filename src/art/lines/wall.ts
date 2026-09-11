import * as THREE from 'three';
import type { Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { shade } from '../palette';
import { SKIN, hearting, patch, pointing, polygonPlan, quoinedPolygon, skin, stoneColours, tapered, throughStone, upright, wander } from '../masonry';
import { stoneChunk } from '../stone';
import { CORNER_DEGREES, Walk, chordBoxes, footprintOf, hashOf, yawAlong, type Laid, type Line, type LineBuilder, type LayContext, type OrientedBox, type PlacedProp, type Station } from './walk';

// A field wall along a painted line: stones bedded on a hearting, two cut skins,
// battered, coped with through stones lying flat, and a quoined pier at each
// open end, sharp corner and gate cheek. Each run between those is cut as one
// panel over its arc length and bent onto the walk, so it rides hills and
// follows a gentle turn with no join anywhere along it.

interface Build {
  readonly height: readonly [number, number];
  readonly coping: readonly [number, number];
  readonly stone: readonly [number, number];
  readonly depth: number;
}

const WALL_DEPTH = 0.48;

const TALL: Build = { height: [1.3, 2], coping: [0.15, 0.22], stone: [0.44, 0.58], depth: WALL_DEPTH };
const LOW: Build = { height: [0.6, 0.95], coping: [0.13, 0.18], stone: [0.34, 0.44], depth: WALL_DEPTH * 0.84 };

const STYLES: Record<string, Build> = { tall: TALL, cotswold: TALL, low: LOW };

/** How much of the thickness is gone by the top. */
const BATTER = 0.26;
/** How far the stonework runs on past where the coping starts. */
const UNDER = 0.04;
/** How far the hearting is carried below the datum, so a run on a slope stands on stone. */
const FOUNDATION = 0.4;
/** Metres of arc between ground samples for the datum the courses ride. */
const DATUM = 2.5;
/** The opening a creep mark leaves at the foot, metres. */
const SMOOT = 0.45;

const seeded = (seed: number, index: number, channel: number): Rng => createRng(Math.floor(hashOf(seed, index, channel) * 2147483647));

export const wallLine: LineBuilder = {
  name: 'wall',
  styles: ['tall', 'low'],
  props: ['gate', 'stone-wall-archway', 'stile'],
  options: {
    height: { type: 'number', min: 0.4, max: 2.5, step: 0.05 },
  },

  lay(line: Line, ctx: LayContext): Laid {
    const made = STYLES[line.style ?? 'tall'] ?? TALL;
    const walk = new Walk(line);
    const parts: Part[] = [];
    const colliders: OrientedBox[] = [];
    const props: PlacedProp[] = [];

    // Everything the whole line has to agree on comes off its own seed, in this order.
    const along = createRng(line.seed);
    const rolled = along.range(made.height[0], made.height[1]);
    const height = typeof line.options?.height === 'number' ? line.options.height : rolled;
    const dry = along.chance(0.5);
    const point = pointing(along, dry);
    const fill = hearting(along, dry);
    const copingH = along.range(made.coping[0], made.coping[1]);
    const base = along.range(made.stone[0], made.stone[1]);
    const amount = along.range(0.016, 0.026);
    const colour = stoneColours(along);
    const pierHeight = height + along.range(0.1, 0.6);
    const pierFace = made.depth * along.range(1.32, 1.56);

    const masonry = height - copingH;
    const depthAt = (y: number): number => made.depth * (1 - BATTER * (y / masonry));
    const faceAt = (y: number): number => depthAt(y) / 2 - SKIN;
    const core = masonry + copingH * 0.65;
    const sizeAt = (y: number): number => base * (1 - 0.32 * (y / masonry));
    let runs = 0;
    let piers = 0;

    /** The wall's datum along a run: the ground sampled every few metres and eased between, so the courses ride the slope without stepping. */
    const datumFor = (s0: number, s1: number): ((s: number) => number) => {
      const length = s1 - s0;
      const count = Math.max(1, Math.ceil(length / DATUM));
      const step = length / count;
      const heights: number[] = [];
      for (let k = 0; k <= count; k++) {
        const st = walk.at(walk.wrap(s0 + k * step));
        heights.push(ctx.groundAt(st.x, st.z));
      }
      return (s) => {
        const u = Math.min(count - 1e-9, Math.max(0, (s - s0) / step));
        const k = Math.floor(u);
        return heights[k] + (heights[k + 1] - heights[k]) * (u - k);
      };
    };

    // Masonry is built in the run's own frame and bent onto the walk: x is arc
    // length along T, y rides the datum, and z goes to -N, the right of the walk,
    // because (T, up, -N) is right-handed like (X, Y, Z); +N would mirror every
    // face inside out.
    const bend = (geometry: THREE.BufferGeometry, datum: (s: number) => number): void => {
      const pos = geometry.getAttribute('position');
      for (let i = 0; i < pos.count; i++) {
        const s = pos.getX(i);
        const st = walk.at(walk.wrap(s));
        const z = pos.getZ(i);
        pos.setXYZ(i, st.x - st.nx * z, datum(s) + pos.getY(i), st.z - st.nz * z);
      }
      geometry.computeVertexNormals();
    };

    /** The hearting and its foundation between two arc lengths, in short tapered lengths so it follows a curve. */
    const heart = (s0: number, s1: number, from: number, top: number, datum: (s: number) => number): void => {
      const length = s1 - s0;
      const count = Math.max(1, Math.ceil(length / 0.8));
      for (let i = 0; i < count; i++) {
        const a = s0 + (length * i) / count;
        const b = s0 + (length * (i + 1)) / count;
        const foot = tapered(b - a, FOUNDATION + from, faceAt(0), faceAt(0));
        foot.translate((a + b) / 2, -FOUNDATION, 0);
        bend(foot, datum);
        parts.push({ geometry: foot, color: fill, sway: 0 });
        const core = tapered(b - a, top - from, faceAt(from), faceAt(top));
        core.translate((a + b) / 2, from, 0);
        bend(core, datum);
        parts.push({ geometry: core, color: fill, sway: 0 });
      }
    };

    /**
     * Both skins over a panel of the run, cut once and bent on, so there is no
     * join anywhere along it. The far skin is cut over the negative arc range and
     * turned a half turn about the vertical, which carries it onto s0..s1 on the
     * far side with its seat still pointing outward.
     */
    const skins = (rng: Rng, s0: number, s1: number, from: number, top: number, size: (y: number) => number, datum: (s: number) => number, level?: { at: number; over: number }): void => {
      for (const facing of [1, -1]) {
        const stones: Part[] = [];
        skin(rng, patch(facing > 0 ? s0 : -s1, from, s1 - s0, top - from), size, point, faceAt, wander(rng, amount, undefined, level), colour, stones);
        for (const part of stones) {
          if (facing < 0) part.geometry.rotateY(Math.PI);
          bend(part.geometry, datum);
          parts.push(part);
        }
      }
    };

    /** A standing run: hearting, two skins and the coping, continuous from end to end. */
    const standing = (s0: number, s1: number, from: number): void => {
      const rng = seeded(line.seed, runs++, 12);
      const datum = datumFor(s0, s1);
      heart(s0, s1, from, core, datum);
      skins(rng, s0, s1, from, masonry + UNDER, sizeAt, datum, { at: masonry, over: 0.14 });

      // Coping: through stones lying flat, bedded down onto one line.
      const top = depthAt(masonry);
      const copeW = rng.range(0.26, 0.42);
      const move = wander(rng, amount, undefined, { at: masonry, over: 0.14 });
      let x = s0;
      while (s1 - x > 1e-6) {
        let w = copeW * rng.range(0.8, 1.3);
        if (s1 - (x + w) < copeW * 0.55) w = s1 - x;
        w = Math.min(w, s1 - x);
        const cope = throughStone(rng, patch(x, masonry, w, copingH * rng.range(0.9, 1.08)).map(move), { ...point, chamfer: 0.04 }, top * rng.range(1.1, 1.2), rng.range(0.01, 0.022), masonry - 0.006);
        bend(cope, datum);
        parts.push({ geometry: cope, color: colour(), sway: 0 });
        x += w;
      }
    };

    /** A run that has come down: bays stepping away from the `s0` end, no coping, what fell lying at the foot. */
    const ruined = (s0: number, s1: number): void => {
      const rng = seeded(line.seed, runs++, 12);
      const datum = datumFor(s0, s1);
      const span = s1 - s0;
      const stand = masonry;
      const bays = Math.max(2, Math.round(span / 0.6));
      const bite = rng.range(0.7, 1.3);
      const farEnd = rng.chance(0.35) ? rng.range(0.4, 0.85) : 0;
      const heights: number[] = [];
      for (let i = 0; i < bays; i++) {
        const t = i / (bays - 1);
        let level = (1 - t) ** bite;
        if (farEnd > 0) level = Math.max(level, farEnd * Math.max(0, (t - 0.55) / 0.45) ** 0.8);
        const held = rng.chance(0.22) ? rng.range(0.12, 0.3) : 0;
        heights.push(Math.max(0.12, stand * (level * rng.range(0.85, 1.12) + held)));
      }
      const bayWidth = span / bays;
      for (let i = 0; i < bays; i++) {
        const a = s0 + i * bayWidth;
        const b = a + bayWidth;
        const bayHeight = heights[i];
        heart(a, b, 0, bayHeight, datum);
        skins(rng, a, b, 0, bayHeight, (y) => base * (1 - 0.3 * (y / Math.max(stand, 0.1))), datum);
        if (bayHeight > 0.3) {
          for (let k = rng.int(0, 2); k > 0; k--) {
            const size = base * rng.range(0.5, 0.9);
            const loose = stoneChunk(rng, { width: size / 2, height: size * rng.range(0.24, 0.36), depth: made.depth * rng.range(0.24, 0.34), sides: rng.int(5, 7), rough: 0.2, skew: 0.35, bury: 0.5 });
            loose.rotateY(rng.around(0, 0.35));
            loose.rotateZ(rng.around(0, 0.18));
            loose.translate((a + b) / 2 + rng.around(0, bayWidth * 0.3), bayHeight - size * rng.range(0.1, 0.2), rng.around(0, made.depth * 0.12));
            bend(loose, datum);
            parts.push({ geometry: loose, color: colour(), sway: 0 });
          }
        }
      }
      const gone = heights.map((h) => Math.max(0.05, stand - h));
      const total = gone.reduce((sum, n) => sum + n, 0);
      const fallenIn = (): number => {
        let roll = rng() * total;
        for (let i = 0; i < gone.length; i++) {
          roll -= gone[i];
          if (roll <= 0) return s0 + (i + rng()) * bayWidth;
        }
        return rng.range(s0, s1);
      };
      const shed = rng.chance(0.5) ? 1 : -1;
      for (let i = rng.int(6, 12); i > 0; i--) {
        const size = base * rng.range(0.4, 0.95);
        const block = stoneChunk(rng, { width: size / 2, height: size * rng.range(0.2, 0.34), depth: size * rng.range(0.3, 0.5), sides: rng.int(5, 7), rough: 0.24, skew: 0.4, bury: rng.range(0.2, 0.45) });
        block.rotateY(rng.range(0, Math.PI * 2));
        block.rotateX(rng.around(0, 0.25));
        block.rotateZ(rng.around(0, 0.25));
        block.translate(fallenIn(), rng.range(0, 0.06), shed * rng.range(made.depth * 0.5, made.depth * 1.9) * (rng.chance(0.75) ? 1 : -1));
        bend(block, datum);
        parts.push({ geometry: block, color: colour(), sway: 0 });
      }
    };

    /** A square quoined pier at a station, one face looking along the wall's bearing there. */
    const pier = (st: Station, tx: number, tz: number): void => {
      const rng = seeded(line.seed, piers++, 13);
      // Face 0 of the pier looks along (cos phase, 0, sin phase).
      const phase = Math.atan2(tz, tx);
      const capH = rng.range(0.13, 0.19) * (made === LOW ? 0.85 : 1);
      const shaft = pierHeight - capH;
      const local = quoinedPolygon(rng, {
        sides: 4,
        face: pierFace,
        height: shaft,
        quoin: 0.13,
        stone: made === LOW ? rng.range(0.24, 0.3) : rng.range(0.28, 0.36),
        point,
        fill,
        colour,
        phase,
      });
      const apothem = pierFace / 2;
      local.push({ geometry: upright(polygonPlan(4, apothem * rng.range(1.14, 1.24), phase), shaft, shaft + capH), color: shade(colour(), rng.around(1.06, 0.05)), sway: 0 });
      local.push({ geometry: upright(polygonPlan(4, apothem - SKIN, phase), -FOUNDATION, 0.01), color: fill, sway: 0 });
      const ground = ctx.groundAt(st.x, st.z);
      for (const part of local) {
        part.geometry.translate(st.x, ground, st.z);
        parts.push(part);
      }
    };

    /** A pier at `s`, facing along the wall as it arrives there, so at a corner one face lies along the leg before it. */
    const pierAt = (s: number): void => {
      const st = walk.at(walk.wrap(s));
      const before = walk.at(walk.wrap(s - 0.05));
      pier(st, before.tx, before.tz);
    };

    // A sharp corner gets a pier and the wall ends on it from both sides. On a
    // smoothed line only a point flagged `corner` is sharp; the rest are bent through.
    const threshold = line.smooth ? Infinity : CORNER_DEGREES;
    const ends = walk.closed ? [] : [0, walk.length];
    const corners = walk.hardPoints([], threshold).filter((c) => !ends.some((e) => Math.abs(e - c) < 1e-3));
    const cornerAt = (s: number): boolean => corners.some((c) => Math.abs(c - s) < 0.05 || Math.abs(c - s - walk.length) < 0.05);

    const layRun = (s0: number, s1: number, mode: 'ruin' | 'creep' | null): void => {
      if (s1 - s0 < 0.15) return;
      if (mode === 'ruin') ruined(s0, s1);
      else standing(s0, s1, mode === 'creep' ? SMOOT : 0);
      colliders.push(...chordBoxes(walk, s0, s1, made.depth, mode === 'ruin' ? masonry * 0.6 : height, ctx.groundAt, 2));
    };

    for (const run of walk.runs(line.marks, threshold)) {
      if (run.mark) {
        const at = walk.at(walk.wrap(run.mark.at));
        const seed = run.mark.seed ?? line.seed + Math.round(run.mark.at * 10);
        const kind = run.mark.kind;
        if (kind === 'gate') {
          props.push({ builder: run.mark.builder ?? 'gate', at: [at.x, at.z], yaw: yawAlong(at), seed, options: { width: run.mark.width ?? 3, ...(run.mark.options ?? {}) } });
        } else if (kind === 'arch') {
          props.push({ builder: run.mark.builder ?? 'stone-wall-archway', at: [at.x, at.z], yaw: yawAlong(at) + Math.PI / 2, seed, options: run.mark.options });
        } else if (kind === 'stile') {
          // Slabs through both faces at 0.3 m rises: the steps over the wall.
          const ground = ctx.groundAt(at.x, at.z);
          const w = made.depth + 0.5;
          for (let i = 0; i < 3; i++) {
            const y = ground + 0.3 * (i + 1);
            if (y > ground + height) break;
            const slab = new THREE.BoxGeometry(0.28, 0.06, w);
            slab.translate(0, y - 0.03, 0);
            // rotateY(yaw) takes +X to the tangent at the stile.
            slab.rotateY(yawAlong(at));
            slab.translate(at.x, 0, at.z);
            parts.push({ geometry: slab, color: shade(colour(), 1.05), sway: 0 });
          }
          layRun(run.s0, run.s1, null);
        } else if (kind === 'creep') {
          layRun(run.s0, run.s1, 'creep');
        } else if (kind === 'ruin') {
          layRun(run.s0, run.s1, 'ruin');
        } else if (run.mark.builder) {
          props.push({ builder: run.mark.builder, at: [at.x, at.z], yaw: yawAlong(at), seed, options: run.mark.options });
        }
        if (kind === 'gate' || kind === 'gap' || kind === 'arch') {
          pierAt(run.s0);
          pierAt(run.s1);
        }
        continue;
      }
      layRun(run.s0, run.s1, null);
      if (cornerAt(run.s0)) pierAt(run.s0);
      if (!walk.closed) {
        if (Math.abs(run.s0) < 1e-3) pierAt(run.s0);
        if (Math.abs(run.s1 - walk.length) < 1e-3) pierAt(run.s1);
      }
    }

    return {
      parts,
      colliders,
      props,
      footprint: footprintOf(walk, made.depth / 2 + 0.1),
      underfoot: 'stone',
    };
  },
};
