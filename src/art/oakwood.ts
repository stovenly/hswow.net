import * as THREE from 'three';
import { heightRamp, type Part } from './assemble';
import type { Rng } from './random';
import { PALETTE, shade } from './palette';
import { LEAVES, cloud, heightWeight, type Cloud, type LeafColour, type Species, type Twig } from './foliage';
import { OAK_GROWTH, growLimb, limbBranch, limbGeometry, type GrowForm, type Limb } from './limbs';

// A broadleaf's wood, shared by the oak and the beech: a buttressed lathe
// trunk, then limbs grown as smooth tubes from it — the trunk carrying on
// as the leader, limbs forking off and forking again — each big limb ending
// inside its own cloud, with the twigs handed back for the cards to sit on.
// Stands on y = 0.

const TAU = Math.PI * 2;

/**
 * A lathe's ring. A tube starting on a lathe's top ring is grown with this many
 * sides, from `latheTop` outward, so the two share that ring exactly. The ring
 * runs +X toward +Z; a tube on a +Y tangent with `LATHE_NORMAL` cuts the same
 * ten points, mirrored in z, which for a uniform ring is the same set.
 */
export const LATHE_SIDES = 10;
export const LATHE_NORMAL = new THREE.Vector3(1, 0, 0);

/**
 * A trunk as a lathe: ten sides, a row every half metre, buttress ribs swelling
 * the foot by `flute[0]` and fading out over `flute[1]` metres, a taper to
 * `thin` of the butt at the top, the spine's bend. Non-indexed so every face
 * shades flat and takes its own bark colour. `capTop` false leaves the top ring
 * open for the limb that continues the trunk to start on.
 */
export function lathe(spine: (y: number) => THREE.Vector3, butt: number, top: number, ribs: number, ribPhase: number, thin = 0.3, flute: readonly [number, number] = [0.6, 1.5], capTop = true): THREE.BufferGeometry {
  const sides = LATHE_SIDES;
  const foot = -0.08;
  const rows = Math.max(4, Math.ceil((top - foot) / 0.45));
  const ring: THREE.Vector3[][] = [];
  for (let r = 0; r <= rows; r++) {
    const y = foot + ((top - foot) * r) / rows;
    const flare = flute[0] * Math.max(0, 1 - (y - foot) / flute[1]) ** 2;
    const taper = 1 - thin * Math.max(0, y / top);
    const c = spine(y);
    const verts: THREE.Vector3[] = [];
    for (let i = 0; i < sides; i++) {
      const theta = (i / sides) * TAU;
      const radius = butt * taper * (1 + flare * (0.5 + 0.5 * Math.cos(ribs * theta + ribPhase)));
      verts.push(new THREE.Vector3(c.x + Math.cos(theta) * radius, y, c.z + Math.sin(theta) * radius));
    }
    ring.push(verts);
  }
  const positions: number[] = [];
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): void => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };
  // Round the ring, +X toward +Z: (a, d, b) and (b, d, c) face outward.
  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < sides; i++) {
      const a = ring[r][i];
      const b = ring[r][(i + 1) % sides];
      const c = ring[r + 1][(i + 1) % sides];
      const d = ring[r + 1][i];
      tri(a, d, b);
      tri(b, d, c);
    }
  }
  const crown = spine(top);
  const base = spine(foot);
  for (let i = 0; i < sides; i++) {
    if (capTop) tri(crown, ring[rows][(i + 1) % sides], ring[rows][i]);
    tri(base, ring[0][i], ring[0][(i + 1) % sides]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** How a broadleaf's wood is grown; every range is rolled. Metres, or fractions of the height where named. */
export interface WoodForm {
  height: readonly [number, number];
  butt: readonly [number, number];
  /** Fraction of the height the trunk forks at. */
  forkAt: readonly [number, number];
  /** Fraction of the height the crown cloud reaches out. */
  spread: readonly [number, number];
  /** The root limb's length as a fraction of what is left of the height above the lathe. */
  rootLength: readonly [number, number];
  /** Root limbs leaving the top of the lathe, splayed off the spine; one is a single leader. */
  stems?: readonly [number, number];
  ribs: readonly [number, number];
  /** How much the ribs swell the foot, and over how many metres that fades. A yew is fluted well up its bole. */
  flute?: readonly [number, number];
  /** The lathe's taper: the fraction of the butt lost by the top. A poplar's bole barely narrows. */
  thin?: number;
  /** How far the bark's fissures darken, against the oak's; under 1 is a smoother, more even bole. */
  fissure?: number;
  /** The crown's clouds against the dome every broadleaf has: under 1 is a pine's plate, over it a poplar's spire. */
  crownFlat?: number;
  /** Keeps its leaves through the winter weeks. */
  evergreen?: boolean;
  /** The bark's hue up the trunk, `t` the fraction of the height. A flat colour is the same all the way up. */
  bark: number | ((t: number) => number);
  pale: number;
  colour: LeafColour;
  growth: GrowForm;
}

export const OAK_FORM: WoodForm = {
  height: [8.5, 10.5],
  butt: [0.42, 0.55],
  forkAt: [0.22, 0.28],
  spread: [0.3, 0.36],
  rootLength: [0.7, 0.85],
  ribs: [3, 5],
  bark: PALETTE.BARK,
  pale: PALETTE.BARK_PALE,
  colour: LEAVES.broadleaf,
  growth: OAK_GROWTH,
};

export interface OakWood {
  species: Species;
  clouds: Cloud[];
  /** Every twig, base to tip: where a branch card grows from. */
  twigs: Twig[];
  height: number;
}

/** Builds the wood into `parts` and returns what a crown needs to hang on it. */
export function oakWood(rng: Rng, parts: Part[], form: WoodForm = OAK_FORM): OakWood {
  const height = rng.range(form.height[0], form.height[1]);
  const butt = rng.range(form.butt[0], form.butt[1]);
  const forkAt = height * rng.range(form.forkAt[0], form.forkAt[1]);
  const spread = height * rng.range(form.spread[0], form.spread[1]);
  const bendAt = rng.range(0, TAU);
  const bend = rng.range(0.05, 0.15);
  const wobble = rng.range(0.04, 0.1);
  const wobblePhase = rng.range(0, TAU);
  const spine = (y: number): THREE.Vector3 => {
    const t = Math.max(0, y / height);
    const off = bend * t * t + wobble * Math.sin(y * 1.3 + wobblePhase) * t;
    return new THREE.Vector3(Math.cos(bendAt) * off, y, Math.sin(bendAt) * off);
  };
  const species: Species = { colour: form.colour, deciduous: !form.evergreen, bark: form.pale, weight: heightWeight(height, 1.3) };
  const barkAt = typeof form.bark === 'function' ? form.bark : (): number => form.bark as number;

  const thin = form.thin ?? 0.3;
  const depth = form.fissure ?? 1;
  const ribs = rng.int(form.ribs[0], form.ribs[1]);
  const ribPhase = rng.range(0, TAU);
  const fissurePhase = rng.range(0, TAU);
  const trunkTop = forkAt * 1.08;
  // The flute is fitted to end by the top, so the top ring is a plain circle of
  // this radius and the limb that continues the trunk starts on it exactly.
  const stems = form.stems ? rng.int(form.stems[0], form.stems[1]) : 1;
  const topRadius = butt * (1 - thin);
  parts.push({
    geometry: lathe(spine, butt, trunkTop, ribs, ribPhase, thin, form.flute && [form.flute[0], Math.min(form.flute[1], trunkTop)], stems > 1),
    color: (x, y, z) => {
      const c = spine(y);
      const theta = Math.atan2(z - c.z, x - c.x);
      const cut = Math.sin(theta * 5 + y * 0.35 + fissurePhase) * 0.5 + Math.sin(theta * 11 - y * 0.6 + fissurePhase * 2) * 0.3 + Math.sin(y * 2.1 + theta * 2) * 0.2;
      // Faces this big read every step as a patch, so the fissures are a few percent, not a stripe.
      const step = cut > 0.45 ? 0.09 : cut > 0.12 ? 0.04 : 0;
      const grain = Math.sin(x * 37.1 + y * 91.7 + z * 53.3) * 0.5 + 0.5;
      return shade(barkAt(y / height), (1 - step * depth) * (1 + (0.04 * grain - 0.02) * depth));
    },
    sway: heightRamp(0, height, 2.4),
  });

  // The trunk goes on above the lathe as the root limb, its first limbs
  // leaving low along it and the rest of it carrying on up as the leader.
  // More than one root limb is a tree standing on several stems from one base.
  const limbs: Limb[] = [];
  const twigs: Twig[] = [];
  const rootFrom = spine(trunkTop);
  const rootLength = (height - trunkTop) * rng.range(form.rootLength[0], form.rootLength[1]);
  // Stems share the top's cross-section, so each is the top radius over root n,
  // standing that far in from the rim: their union then covers the whole top.
  const stemRadius = topRadius / Math.sqrt(stems);
  const splay = rng.range(0, TAU);
  for (let i = 0; i < stems; i++) {
    const dir = new THREE.Vector3(0, 1, 0);
    const from = rootFrom.clone();
    if (stems > 1) {
      const bearing = splay + (i / stems) * TAU + rng.around(0, 0.3);
      const out = new THREE.Vector3(Math.cos(bearing), 0, Math.sin(bearing));
      dir.add(out.clone().multiplyScalar(rng.range(0.12, 0.26))).normalize();
      from.addScaledVector(out, topRadius - stemRadius);
    }
    growLimb(rng, from, dir, rootLength * rng.range(0.88, 1.06), stemRadius, 0, form.growth, limbs, twigs, null, null, stems > 1 ? undefined : LATHE_SIDES, stems > 1 ? null : LATHE_NORMAL);
  }
  // One ramp for the lathe and every limb: two tubes sharing a ring have to be
  // pulled by the same weight there, or the wind opens the seam between them.
  const sway = heightRamp(0, height, 2.4);
  for (const limb of limbs) {
    const level = Math.min(limb.level, 3);
    parts.push({
      geometry: limbGeometry(limb),
      color: shade(level < 2 ? barkAt(limb.points[0].y / height) : form.pale, rng.range(0.97, 1.03) * (1 + level * 0.03)),
      sway,
      branch: limbBranch(limb),
    });
  }

  // A cloud per big limb, round the twig ends that grew from it, and one over the whole.
  const flat = form.crownFlat ?? 1;
  const clouds: Cloud[] = [];
  const heads = limbs.filter((limb) => limb.level === 1).map((limb) => limb.points[limb.points.length - 1]);
  const tips = twigs.map((twig) => twig.to);
  for (const head of heads) {
    const mine = tips.filter((tip) => {
      let nearest = head;
      let best = Infinity;
      for (const other of heads) {
        const d = other.distanceToSquared(tip);
        if (d < best) {
          best = d;
          nearest = other;
        }
      }
      return nearest === head;
    });
    if (mine.length === 0) continue;
    const centre = new THREE.Vector3();
    for (const tip of mine) centre.add(tip);
    centre.divideScalar(mine.length);
    let extent = 0;
    for (const tip of mine) extent = Math.max(extent, tip.distanceTo(centre));
    const r = Math.max(height * 0.14, extent * 1.4 + 0.6);
    centre.y += r * 0.2;
    clouds.push(cloud(rng, centre, new THREE.Vector3(r, r * 0.8 * flat, r), 0.16));
  }
  const middle = new THREE.Vector3();
  for (const c of clouds) middle.add(c.centre);
  middle.divideScalar(Math.max(1, clouds.length));
  middle.y += spread * 0.2;
  clouds.push(cloud(rng, middle, new THREE.Vector3(spread * 0.9, spread * 0.6 * flat, spread * 0.9), 0.18));

  return { species, clouds, twigs, height };
}
