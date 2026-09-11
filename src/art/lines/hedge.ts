import * as THREE from 'three';
import { heightRamp, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { LEAVES, branchCards, cloud, type Cloud, type Species, type Twig } from '../foliage';
import { OAK_GROWTH, growLimb, limbBranch, limbGeometry, type GrowForm, type Limb } from '../limbs';
import { SHEET_OF } from '../branchSheet';
import { Walk, chordBoxes, footprintOf, hashOf, yawAlong, type Laid, type Line, type LineBuilder, type LayContext, type OrientedBox, type PlacedProp } from './walk';

// A hedge along a painted line: a stool every four hundred millimetres, either
// side of the centre, under a crown of small-leaf cards filling an envelope
// that is never drawn. There is no mass inside it — the opacity is card density.

interface HedgeStyle {
  height: number;
  width: number;
  /** Envelope displacement, as a fraction. */
  rough: number;
  /** Cards per metre of line: the one dial over how hard it is to see through. */
  cards: number;
}

const STYLES: Record<string, HedgeStyle> = {
  trimmed: { height: 1.5, width: 1.0, rough: 0.1, cards: 120 },
  wild: { height: 2.1, width: 1.4, rough: 0.3, cards: 170 },
};

/** The share of the loose cards rooted through the body rather than on its skin. */
const CORE = 0.38;

/** Metres of arc between stools. */
const STEP = 0.4;
/** Metres of line under one crown field, so the shading does not run the length of the hedge. */
const CHUNK = 3;

/** A stool forks twice below its twigs. Entered at level 1, so the level-0 entries never apply. */
const HEDGE_GROWTH: GrowForm = {
  ...OAK_GROWTH,
  children: [
    [2, 3],
    [2, 3],
    [2, 3],
  ],
  lengthRatio: [
    [0.5, 0.7],
    [0.45, 0.65],
    [0.4, 0.6],
  ],
  angle: [
    [0.55, 1.0],
    [0.5, 0.95],
    [0.5, 0.95],
  ],
  along: [
    [0.2, 0.9],
    [0.25, 0.95],
    [0.3, 0.95],
  ],
  lift: [0.5, 0.5, 0.4, 0.3],
  wobble: [0.12, 0.3, 0.4, 0.5],
  sides: [4, 4, 3, 3],
  levels: 3,
  swing: [0.05, 0.04],
  minRadius: 0.007,
};

function noise(s: number, theta: number, seed: number): number {
  return Math.sin(s * 1.9 + theta * 2.3 + seed) * 0.5 + Math.sin(s * 0.7 + theta * 5.1 + seed * 1.7) * 0.3 + Math.sin(s * 4.3 + theta * 1.1) * 0.2;
}

export const hedgeLine: LineBuilder = {
  name: 'hedge',
  styles: Object.keys(STYLES),
  props: ['oak', 'gate', 'stile'],
  options: {
    height: { type: 'number', min: 0.6, max: 3, step: 0.05 },
  },

  lay(line: Line, ctx: LayContext): Laid {
    const style = STYLES[line.style ?? 'trimmed'] ?? STYLES.trimmed;
    const H = typeof line.options?.height === 'number' ? line.options.height : style.height;
    const W = style.width * (H / style.height) ** 0.5;
    const rng = createRng(line.seed);
    const walk = new Walk(line);
    const parts: Part[] = [];
    const colliders: OrientedBox[] = [];
    const props: PlacedProp[] = [];
    const leaf = LEAVES.hedge;
    const stem = shade(PALETTE.BARK, 0.95);
    const seedPhase = rng.range(0, 6.28);

    const standards = line.marks.filter((m) => m.kind === 'standard');
    for (const mark of standards) {
      const at = walk.at(walk.wrap(mark.at));
      props.push({ builder: mark.builder ?? 'oak', at: [at.x, at.z], yaw: yawAlong(at), seed: mark.seed ?? line.seed + Math.round(mark.at * 10), options: mark.options });
    }
    /** Suppressed for 1.5 m either side of a standard. */
    const bulge = (s: number): number => {
      let b = 1;
      for (const m of standards) b = Math.min(b, 0.6 + 0.4 * Math.min(1, Math.abs(s - m.at) / 1.5));
      return b;
    };

    for (const run of walk.runs(line.marks)) {
      if (run.mark) {
        const at = walk.at(walk.wrap(run.mark.at));
        const seed = run.mark.seed ?? line.seed + Math.round(run.mark.at * 10);
        if (run.mark.kind === 'gate') {
          props.push({ builder: run.mark.builder ?? 'gate', at: [at.x, at.z], yaw: yawAlong(at), seed, options: { width: run.mark.width ?? 3, ...(run.mark.options ?? {}) } });
        } else if (run.mark.kind === 'stile') {
          props.push({ builder: run.mark.builder ?? 'stile', at: [at.x, at.z], yaw: yawAlong(at), seed, options: run.mark.options });
        } else if (run.mark.kind !== 'standard' && run.mark.builder) {
          props.push({ builder: run.mark.builder, at: [at.x, at.z], yaw: yawAlong(at), seed, options: run.mark.options });
        }
        continue;
      }
      grow(run.s0, run.s1);
      colliders.push(...chordBoxes(walk, run.s0, run.s1, W, H, ctx.groundAt));
    }

    function grow(s0: number, s1: number): void {
      const length = s1 - s0;
      const count = Math.max(2, Math.ceil(length / STEP));
      const chunks = Math.max(1, Math.round(length / CHUNK));
      const perChunk = count / chunks;

      for (let c = 0; c < chunks; c++) {
        const first = Math.round(c * perChunk);
        const last = Math.min(count, Math.round((c + 1) * perChunk));
        const limbs: Limb[] = [];
        const twigs: Twig[] = [];
        const clouds: Cloud[] = [];
        let baseY = 0;
        let stations = 0;
        for (let k = first; k <= last; k++) {
          const s = s0 + (length * k) / count;
          const st = walk.at(walk.wrap(s));
          const ground = ctx.groundAt(st.x, st.z);
          // The ends collapse to a rounded cap over the last station's worth.
          const edge = Math.min(1, Math.min(k, count - k) / 1.2);
          const cap = Math.sqrt(Math.max(0, 1 - (1 - edge) ** 2));
          const scale = cap * bulge(s);
          if (scale < 0.15) continue;
          const d = 1 + style.rough * noise(s, 0, seedPhase) * 0.5;
          baseY += ground;
          stations++;
          // Two rows, not one ellipsoid: a single one pinches to a point at the
          // ground and leaves the hedge's foot see-through. Round in plan, so the
          // union of the stations is a tube of the line's width whatever bearing
          // the line runs at; a cloud's radii are world axes.
          const halfW = (W / 2) * d * scale;
          clouds.push(cloud(rng, new THREE.Vector3(st.x, ground + H * 0.62 * d * scale, st.z), new THREE.Vector3(halfW * 0.96, H * 0.4 * d * scale, halfW * 0.96), 0.18));
          clouds.push(cloud(rng, new THREE.Vector3(st.x, ground + H * 0.3 * d * scale, st.z), new THREE.Vector3(halfW, H * 0.34 * d * scale, halfW), 0.14));

          // The stool: one rod, standing off the centre line and leaning back over it.
          const side = k % 2 === 0 ? 1 : -1;
          const off = side * (0.35 + hashOf(line.seed, k, 15) * 0.65) * (W / 4);
          const from = new THREE.Vector3(st.x + st.nx * off, ground - 0.05, st.z + st.nz * off);
          const dir = new THREE.Vector3(st.nx * -off * 0.6, 1, st.nz * -off * 0.6).normalize();
          growLimb(rng, from, dir, H * rng.range(0.62, 0.8) * scale, rng.range(0.018, 0.03), 1, HEDGE_GROWTH, limbs, twigs);
        }
        if (clouds.length === 0) continue;
        baseY /= Math.max(1, stations);

        const sway = heightRamp(baseY + 0.2, baseY + H, 1.2);
        const species: Species = { colour: leaf, deciduous: false, bark: stem, weight: (_x, y) => sway(0, y) * 0.6 };
        // Only the rod and its first fork are drawn: a twig under a card is never
        // seen, and at this stool spacing there is one every hand's breadth.
        for (const limb of limbs) {
          if (limb.level > 2) continue;
          parts.push({ geometry: limbGeometry(limb), color: shade(stem, rng.range(0.9, 1.1)), sway, branch: limbBranch(limb) });
        }

        const perTwig = 2;
        const span = (length * (last - first)) / count;
        const loose = Math.max(0, Math.round(span * style.cards) - twigs.length * perTwig);
        const core = Math.round(loose * CORE);
        // Down to −0.5, or the loose cards never sample below two fifths of the
        // height and the hedge is a canopy on bare stools.
        parts.push(...branchCards(rng, species, clouds, { twigs, count: loose - core, length: [0.22, 0.34], tiles: SHEET_OF.smallleaf, perTwig, upward: -0.5 }));
        // Rooted through the body rather than on its skin: a hedge is read by not
        // being able to see into it, and a shell is see-through along its own run.
        parts.push(...branchCards(rng, species, clouds, { twigs: [], count: core, length: [0.24, 0.38], tiles: SHEET_OF.smallleaf, upward: -0.5, depth: [0, 0.45] }));
        // The two ends: crossed pinned pairs, so a hedge looked along does not collapse to nothing.
        if (c === 0 || c === chunks - 1) {
          const end = twigs.filter((_, i) => i % 3 === 0);
          parts.push(...branchCards(rng, species, clouds, { twigs: end, count: 0, length: [0.22, 0.34], tiles: SHEET_OF.smallleaf, turn: false, cross: true }));
        }
      }
    }

    return {
      parts,
      colliders,
      props,
      footprint: footprintOf(walk, W / 2 + 0.2),
      footprintSoft: 0.6,
      underfoot: 'grass',
      solid: false,
    };
  },
};
