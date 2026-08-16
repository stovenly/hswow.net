import * as THREE from 'three';
import type { BuilderWith } from '../types';
import type { Part } from '../assemble';
import { loft, type Columns, type Station } from '../loft';
import { finishRigged, type BoneSpec } from '../rig';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import type { LifeOptions, LifeSpec } from '../../life/spec';
import { buildHead, type HeadKind } from './figure-head';

/**
 * A villager. Friendly, bipedal, and not a person.
 *
 * A rounded torso that **ends at the waist**, with the legs coming straight
 * out of it into rounded boots, small arms that do not do much, and a head
 * held up on a short neck. 1.28–1.46 m tall. It is always dressed: a shirt at
 * least, over a hide of its own colour.
 *
 * **The head is covered, and it is a whole form of its own.** No skull, no
 * neck, no skin above the collar: one of the shells in `figure-head.ts` — a
 * lantern, a basket, a skep, a kiln, a bell, a crystal, thatch, a honeycomb,
 * a rose window, a fringed cowl — chosen by the `face` option and under
 * judgement in the villager gallery. Each carries a **motif** on its front,
 * a frame and lattice that is what the player looks at and what works when
 * the villager talks. LIFE.md §3.
 *
 * ## Colour boundaries are edges of the mesh, never thresholds
 *
 * Colour is per face and a builder cannot tint half a triangle. A loft quad's
 * two triangles have centroids a third and two thirds of the way up it, so a
 * threshold *between* rings takes one triangle from each quad and leaves the
 * other — a sawtooth. So every coloured region here is its own geometry: the
 * garment bands are separate lofts over shared rings, the bib is a run of
 * columns of those same rings (see `Columns` in `art/loft`), and the blush
 * and the face piece are their own forms. Every seam is
 * a straight line because it is an edge.
 *
 * ## Joints are shaped, not patched
 *
 * A limb is not a tube. Each segment is a loft with an anatomical profile —
 * a deltoid over the shoulder, a taper to the elbow, a calf, a narrow ankle —
 * and **the joint head belongs to the segment below it**, built as a rounded
 * dome centred exactly on the pivot. Centred there, it cannot swing away from
 * the joint however far the limb bends, so the pair never opens a gap and
 * nothing has to be plugged with a ball stuck on the outside. The segment
 * above simply arrives at the pivot thinner than the dome and is swallowed.
 *
 * The same argument is why the torso is **one piece on one bone**: a surface
 * split across two bones comes apart the moment they disagree, and a seam at
 * the waist is a hole you can see through when the body breathes.
 *
 * Rigged, facing +Z, feet on y = 0. Bones:
 *
 *   root ─ hips ─ torso ─ neck ─ head ─ face (or face0…faceN)
 *               │       ├ armLu ─ armLl          (and R)
 *               └ legLu ─ legLl ─ legLf          (and R)
 *
 * The legs hang from the hips, so the pelvis is the thing that moves and the
 * legs are solved to feet planted on the ground — see `life/legs`.
 */

// --- palettes -------------------------------------------------------------------

/**
 * A villager's own colour. Pale and desaturated — this is what shows at the
 * head, the hands and nowhere else.
 */
const HIDES = [0xc9b79c, 0xa8b08e, 0xb99a8f, 0x8f9aa3, 0xc2a374, 0x9c8f9e, 0xb0a48a, 0x8fa89a];
/**
 * Cloth. **Deliberately darker and more saturated than any hide**, and
 * checked against the villager's own hide before use — a collar or a hem in
 * something near skin colour does not read as a garment, it reads as a bare
 * patch, which is exactly what it looked like.
 */
const CLOTHS = [
  PALETTE.TIMBER_DARK,
  PALETTE.STONE_DARK,
  PALETTE.RUST,
  PALETTE.CLOTH_DEEP,
  0x4a5a48,
  0x5c4a68,
  0x8a5a2a,
  0x3f5a68,
  0x7a3f3a,
  0x2f4a3f,
  0x6a5a2a,
  0x4a4658,
];
const LEATHERS = [PALETTE.HIDE_DARK, PALETTE.BARK, 0x5a3a28, 0x4a3f36];
const METALS = [PALETTE.IRON, PALETTE.BRONZE, PALETTE.IRON_PALE];

/** How far apart two sRGB hexes are, as the largest channel difference. */
function apart(a: number, b: number): number {
  return Math.max(
    Math.abs(((a >> 16) & 255) - ((b >> 16) & 255)),
    Math.abs(((a >> 8) & 255) - ((b >> 8) & 255)),
    Math.abs((a & 255) - (b & 255)),
  );
}

/** A cloth colour clear of the hide and of everything already worn. */
function pickCloth(rng: Rng, hide: number, taken: readonly number[]): number {
  const clear = CLOTHS.filter(
    (c) => apart(c, hide) > 55 && taken.every((t) => apart(c, t) > 45),
  );
  return rng.pick(clear.length ? clear : CLOTHS);
}

/** Sides on the body. Vertical colour borders snap to these. */
const BODY_SIDES = 14;
const LIMB_SIDES = 8;

function pickWeighted<T extends { weight: number }>(rng: Rng, table: readonly T[]): T {
  let roll = rng() * table.reduce((sum, t) => sum + t.weight, 0);
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return table[0];
}

/** Piecewise-linear radius from (t, r) rings. */
function profile(rings: readonly [number, number][], t: number): number {
  const c = Math.max(0, Math.min(1, t));
  for (let i = 1; i < rings.length; i++) {
    if (c <= rings[i][0]) {
      const [t0, r0] = rings[i - 1];
      const [t1, r1] = rings[i];
      return r0 + ((r1 - r0) * (c - t0)) / (t1 - t0);
    }
  }
  return rings[rings.length - 1][1];
}

/** Ring heights for a dense loft: every knot of the profile plus a fixed spacing between. */
function rungs(rings: readonly [number, number][], spacing: number, extra: readonly number[] = []): number[] {
  const set = new Set<number>([0, 1, ...extra]);
  for (const [t] of rings) set.add(t);
  for (let t = spacing; t < 1; t += spacing) set.add(Math.round(t * 1000) / 1000);
  return [...set].sort((a, b) => a - b);
}


/**
 * A limb segment: a loft along the line from `from` to `to`, with a profile
 * given as (t along the segment, radius). `t` may run below zero, which puts
 * a rounded joint head *above* the pivot — see the header. `flat` squashes
 * the section across the limb, which is what makes a forearm read as an arm
 * rather than a pipe.
 */
function limb(
  from: THREE.Vector3,
  to: THREE.Vector3,
  stations: readonly (readonly [number, number])[],
  flat = 1,
  caps: { start?: boolean; end?: boolean } = { start: true, end: true },
): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const axis = dir.clone().divideScalar(length);
  const at = axis.toArray() as [number, number, number];
  return loft(
    stations.map(([t, r]) => ({
      at: [
        from.x + axis.x * t * length,
        from.y + axis.y * t * length,
        from.z + axis.z * t * length,
      ] as [number, number, number],
      rx: r,
      ry: r * flat,
      axis: at,
    })),
    LIMB_SIDES,
    caps,
  );
}

// --- the body ---------------------------------------------------------------------

/**
 * Body profiles as (height fraction, radius) in units of the body's radius.
 *
 * **The body is a torso and nothing else: it starts at the waist, where the
 * legs start.** An earlier version was a full hourglass with a second lobe
 * below the waist, and that lobe hung out over the legs and read as a
 * *skirt* — exactly the silhouette this is supposed to avoid. So every
 * profile here is narrow at t = 0 and the legs come straight out of it, the
 * way they do on anything that walks.
 */
const BUILDS: readonly { rings: readonly [number, number][]; depth: number }[] = [
  // Round.
  { depth: 0.9, rings: [[0, 0.58], [0.15, 0.74], [0.42, 0.88], [0.68, 0.9], [0.88, 0.74], [1, 0.4]] },
  // Shouldered: the mass rides high, and not much of it.
  { depth: 0.88, rings: [[0, 0.54], [0.15, 0.64], [0.45, 0.78], [0.72, 0.9], [0.9, 0.8], [1, 0.46]] },
  // Straight: little taper either way.
  { depth: 0.9, rings: [[0, 0.6], [0.12, 0.74], [0.4, 0.82], [0.7, 0.84], [0.9, 0.74], [1, 0.42]] },
  // Slight: narrow all the way up.
  { depth: 0.92, rings: [[0, 0.5], [0.18, 0.6], [0.45, 0.7], [0.72, 0.72], [0.9, 0.6], [1, 0.34]] },
  // Round-bellied: fullest low, tapering to the shoulders.
  { depth: 0.9, rings: [[0, 0.6], [0.14, 0.82], [0.38, 0.9], [0.66, 0.78], [0.88, 0.66], [1, 0.38]] },
];

// --- the head ---------------------------------------------------------------------

// --- outfits ----------------------------------------------------------------------

interface Body {
  radius: number;
  bottom: number;
  top: number;
  at(y: number): { rx: number; ry: number };
  waistY: number;
  hide: number;
  cloth: number;
  accent: number;
  leather: number;
  metal: number;
  side: 1 | -1;
}

/**
 * A band right round the body at a height, standing `proud` off its surface.
 * A closed frustum, scaled to the body's section — so it has a top and an
 * inside, and reads as a strap from any angle rather than a skin.
 */
function band(m: Body, y: number, height: number, proud: number): THREE.BufferGeometry {
  const lo = m.at(y - height / 2);
  const hi = m.at(y + height / 2);
  const g = new THREE.CylinderGeometry(hi.rx + proud, lo.rx + proud, height, BODY_SIDES);
  // The body's section is an ellipse; the cylinder is scaled to match at the middle.
  const mid = m.at(y);
  g.scale(1, 1, (mid.ry + proud) / (mid.rx + proud));
  g.translate(0, y, 0);
  return g;
}

/** A small thing stuck on the body's surface at a height and bearing (radians from +Z, toward +X). */
function stuck(m: Body, geometry: THREE.BufferGeometry, y: number, bearing: number, proud: number): THREE.BufferGeometry {
  const { rx, ry } = m.at(y);
  const x = Math.sin(bearing) * (rx + proud);
  const z = Math.cos(bearing) * (ry + proud);
  // rotateY(bearing) takes +Z to (sin, 0, cos): the piece faces out.
  geometry.rotateY(bearing);
  geometry.translate(x, y, z);
  return geometry;
}

interface Wear {
  weight: number;
  bone: 'torso';
  build(rng: Rng, m: Body): Part[];
}

const WEARS: readonly Wear[] = [
  // A belt at the waist, with a buckle and a keeper.
  {
    weight: 0.4,
    bone: 'torso',
    build: (rng, m) => {
      const y = m.waistY + rng.range(-0.015, 0.025);
      const h = rng.range(0.03, 0.045);
      const buckle = new THREE.BoxGeometry(h * 1.4, h * 1.1, 0.012);
      const keeper = new THREE.BoxGeometry(0.014, h * 1.15, 0.014);
      return [
        { geometry: band(m, y, h, 0.012), color: m.leather },
        { geometry: stuck(m, buckle, y, 0, 0.018), color: m.metal },
        { geometry: stuck(m, keeper, y, 0.35, 0.016), color: shade(m.leather, 0.8) },
      ];
    },
  },
  // A sash, knotted at one side with a tail.
  {
    weight: 0.3,
    bone: 'torso',
    build: (rng, m) => {
      const y = m.waistY + rng.range(0, 0.04);
      const knot = new THREE.IcosahedronGeometry(0.032, 1);
      knot.scale(1, 0.8, 0.7);
      const tail = new THREE.BoxGeometry(0.028, 0.11, 0.014);
      return [
        { geometry: band(m, y, rng.range(0.045, 0.07), 0.014), color: m.accent },
        { geometry: stuck(m, knot, y, m.side * 1.4, 0.018), color: m.accent },
        { geometry: stuck(m, tail, y - 0.07, m.side * 1.45, 0.012), color: m.accent },
      ];
    },
  },
  // A row of buttons up the front.
  {
    weight: 0.3,
    bone: 'torso',
    build: (rng, m) => {
      const parts: Part[] = [];
      const count = rng.int(3, 5);
      const top = m.top - 0.06;
      const bottom = m.waistY + 0.03;
      for (let i = 0; i < count; i++) {
        const y = top - ((top - bottom) * i) / (count - 1);
        const button = new THREE.CylinderGeometry(0.013, 0.013, 0.01, 8);
        // CylinderGeometry stands on +Y; rotateX(π/2) faces it along +Z.
        button.rotateX(Math.PI / 2);
        parts.push({ geometry: stuck(m, button, y, 0, 0.004), color: m.metal });
      }
      return parts;
    },
  },
  // Pouches on the hip, one or two.
  {
    weight: 0.28,
    bone: 'torso',
    build: (rng, m) => {
      const parts: Part[] = [];
      const y = m.waistY + 0.01;
      const bearings = rng.chance(0.5) ? [m.side * 1.2] : [1.2, -1.2];
      for (const bearing of bearings) {
        const w = rng.range(0.055, 0.08);
        const pouch = new THREE.BoxGeometry(w, rng.range(0.055, 0.08), 0.045);
        const flap = new THREE.BoxGeometry(w * 1.05, 0.028, 0.05);
        flap.translate(0, 0.032, 0.002);
        parts.push({ geometry: stuck(m, pouch, y, bearing, 0.018), color: m.leather });
        parts.push({ geometry: stuck(m, flap, y, bearing, 0.018), color: shade(m.leather, 0.85) });
      }
      return parts;
    },
  },
  // A satchel slung on one hip.
  {
    weight: 0.22,
    bone: 'torso',
    build: (rng, m) => {
      const y = m.waistY + 0.02;
      const bag = new THREE.BoxGeometry(rng.range(0.12, 0.15), rng.range(0.11, 0.14), 0.055);
      const flap = new THREE.BoxGeometry(0.13, 0.055, 0.065);
      flap.translate(0, 0.05, 0.005);
      const clasp = new THREE.BoxGeometry(0.018, 0.022, 0.01);
      clasp.translate(0, 0.018, 0.036);
      return [
        { geometry: stuck(m, bag, y, m.side * 1.5, 0.022), color: m.leather },
        { geometry: stuck(m, flap, y, m.side * 1.5, 0.022), color: shade(m.leather, 0.85) },
        { geometry: stuck(m, clasp, y, m.side * 1.5, 0.022), color: m.metal },
      ];
    },
  },
  // A pack on the back.
  {
    weight: 0.14,
    bone: 'torso',
    build: (rng, m) => {
      const y = m.waistY + (m.top - m.waistY) * 0.45;
      const w = rng.range(0.15, 0.2);
      const h = rng.range(0.16, 0.24);
      const pack = new THREE.BoxGeometry(w, h, 0.09);
      const lid = new THREE.BoxGeometry(w * 1.05, 0.032, 0.1);
      lid.translate(0, h / 2, 0);
      const strap = new THREE.BoxGeometry(0.018, h * 0.9, 0.012);
      strap.translate(0, 0, 0.05);
      return [
        { geometry: stuck(m, pack, y, Math.PI, 0.045), color: m.leather },
        { geometry: stuck(m, lid, y, Math.PI, 0.045), color: shade(m.leather, 0.85) },
        { geometry: stuck(m, strap, y, Math.PI, 0.045), color: shade(m.leather, 0.7) },
      ];
    },
  },
  // A scarf: a band at the top with a tail down the front.
  {
    weight: 0.2,
    bone: 'torso',
    build: (rng, m) => {
      const y = m.top - 0.03;
      const drop = rng.range(0.1, 0.17);
      const tail = new THREE.BoxGeometry(0.045, drop, 0.015);
      return [
        { geometry: band(m, y, rng.range(0.035, 0.055), 0.018), color: m.accent },
        { geometry: stuck(m, tail, y - drop / 2 - 0.01, m.side * 0.35, 0.012), color: m.accent },
      ];
    },
  },
];

// --- the builder ------------------------------------------------------------------

export const figure: BuilderWith<LifeOptions> = {
  name: 'figure',
  category: 'people',
  radius: 0.5,
  solid: false,

  build({ seed = 1, scale = 1, roam, face = 'round' }: LifeOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const bones: BoneSpec[] = [];

    // --- proportions ------------------------------------------------------
    //
    // The standing height is chosen first and everything is fitted into it, so
    // a squat head does not make a taller villager — it makes a differently
    // proportioned one of the same height.
    const height = rng.range(1.28, 1.46);
    // The head is a shell about twice as tall as it is wide, on a short
    // covered neck.
    const headR = rng.range(0.135, 0.172);
    const rest = height - headR * 2.6;
    const bodyH = rest * rng.range(0.54, 0.61);
    const legLength = rest - bodyH;
    const radius = bodyH * rng.range(0.23, 0.28);

    const build = rng.pick(BUILDS);
    const hide = rng.pick(HIDES);
    // Three cloths, each clear of the hide and of each other: the shirt, the
    // lower half, and the accent that trim is picked out in.
    const cloth = pickCloth(rng, hide, []);
    const lower = pickCloth(rng, hide, [cloth]);
    const accent = pickCloth(rng, hide, [cloth, lower]);
    const leather = rng.pick(LEATHERS);
    const metal = rng.pick(METALS);
    const dominant: 1 | -1 = rng.chance(0.5) ? 1 : -1;

    const bottom = legLength;
    const top = bottom + bodyH;
    // The belt line, just above the waist rather than half way up a barrel.
    const waistY = bottom + bodyH * 0.14;
    bones.push({ name: 'root', at: [0, 0, 0] });
    bones.push({ name: 'hips', parent: 'root', at: [0, bottom, 0] });
    // **At the waist, not the middle of the body.** The whole torso is one
    // piece on this bone, so a lean rotates it about its own base — which is
    // where a body bends — and its bottom ring stays sat on the legs.
    bones.push({ name: 'torso', parent: 'hips', at: [0, bottom + bodyH * 0.05, 0] });

    const at = (y: number): { rx: number; ry: number } => {
      const r = radius * profile(build.rings, (y - bottom) / bodyH);
      return { rx: r, ry: r * build.depth };
    };

    // **The legs are sized from the waist they come out of**, so the pair of
    // them fills the bottom of the torso and nothing hangs over them. A body
    // wider at the bottom than its own legs is a skirt, whatever it is called.
    const waistR = at(bottom).rx;
    const legR = waistR * rng.range(0.4, 0.46);
    const stance = waistR - legR * rng.range(1.0, 1.12);

    // --- garment ----------------------------------------------------------
    //
    // **Always dressed, and never in its own skin.** The torso carries no hide
    // at all: the shirt runs from the collar down to a hem, and below the hem
    // is the lower half in a second cloth. An earlier version left the strip
    // below the hem bare, and a ring of skin round the waist read as a rim of
    // the garment in the wrong colour.
    const bib = rng.chance(0.3);
    const hemT = rng.range(0.1, 0.26);

    // --- body: bands of loft, one per coloured region, all on one bone -----
    const ts = rungs(build.rings, 0.05, [hemT, 0.88]);
    const ring = (t: number): Station => {
      const y = bottom + t * bodyH;
      const { rx, ry } = at(y);
      return { at: [0, y, 0], rx, ry, axis: [0, 1, 0] };
    };
    // The front column of the ring, so a bib is centred: vertex i sits at
    // angle (2i+1)·π/sides and the front is at 3π/2.
    const frontVertex = Math.round((3 * BODY_SIDES - 2) / 4);
    const bibHalf = rng.int(1, 2);
    const bibColumns: Columns = { from: frontVertex - bibHalf, to: frontVertex + bibHalf - 1 };
    const backColumns: Columns = { from: frontVertex + bibHalf, to: frontVertex - bibHalf + BODY_SIDES - 1 };

    // The bib stops short of the shoulders, which also keeps it off the band
    // that carries the top cap: a partial ring is not a loop and cannot be
    // closed by a fan, so a capped band must never be split into columns.
    const bibTop = 0.88;
    const cuts = [0, hemT, bibTop, 1];
    for (let i = 0; i < cuts.length - 1; i++) {
      const from = cuts[i];
      const to = cuts[i + 1];
      if (to - from < 1e-3) continue;
      const stations = ts.filter((t) => t >= from - 1e-6 && t <= to + 1e-6).map(ring);
      if (stations.length < 2) continue;
      const caps = { start: from <= 1e-6, end: to >= 1 - 1e-6 };
      const shirt = from >= hemT - 1e-6;
      const base = shirt ? cloth : lower;
      if (bib && shirt && !caps.end) {
        // Two pieces of one surface: the bib's columns, and the rest.
        parts.push({ geometry: loft(stations, BODY_SIDES, caps, bibColumns), color: accent, bone: 'torso' });
        parts.push({ geometry: loft(stations, BODY_SIDES, caps, backColumns), color: base, bone: 'torso' });
      } else {
        parts.push({ geometry: loft(stations, BODY_SIDES, caps), color: base, bone: 'torso' });
      }
    }

    // --- the head ---------------------------------------------------------
    //
    // **The head is a covered thing, and the whole of it.** No skull, no neck
    // and no skin above the collar: a shell — a lantern, a basket, a hive —
    // sits straight on the shoulders with a cowl over the join, and the motif
    // on its front is what the player looks at and what moves when the
    // villager talks. See `figure-head.ts`.
    const neckLength = headR * 0.5;
    bones.push({ name: 'neck', parent: 'torso', at: [0, top + 0.005, 0] });
    bones.push({ name: 'head', parent: 'neck', at: [0, top + 0.005 + neckLength, 0] });
    const built = buildHead(
      face as HeadKind,
      {
        rng,
        base: top + 0.005 + neckLength,
        neck: neckLength,
        shoulderR: at(top - 0.02).rx,
        size: headR,
        cloth,
        accent,
        leather,
        metal,
        side: dominant,
      },
      parts,
      bones,
    );
    const crown = built.crown;
    const faceY = built.faceY;

    // --- arms -------------------------------------------------------------
    //
    // Small, and not much use. The shoulder is a deltoid on the upper arm and
    // the elbow is a head on the forearm — both centred on their pivots, so
    // neither can swing off its joint.
    const armR = headR * rng.range(0.17, 0.22);
    const shoulderY = bottom + bodyH * rng.range(0.78, 0.86);
    const armLength = bodyH * rng.range(0.4, 0.5);
    const upperLen = armLength * 0.5;
    const foreLen = armLength * 0.42;
    // **The arm has to hang outside the widest part of the chest.** The body
    // is narrower at the shoulder than it is below it, so an arm dropped
    // straight from the shoulder goes *into* the ribs — which is what it was
    // doing. The hanging line is measured off the body rather than guessed
    // from an angle.
    let clearR = 0;
    for (let t = 0; t <= 1.0001; t += 0.04) {
      const y = bottom + t * bodyH;
      if (y > shoulderY) break;
      clearR = Math.max(clearR, at(y).rx);
    }
    const hangX = clearR + armR * 1.05;
    // The shoulder is under the collar on every build, so there is always a
    // sleeve; how far down the arm it reaches is what varies.
    const sleeve = cloth;
    const sleeveEnd = rng.range(0.35, 0.9);
    for (const side of [1, -1] as const) {
      const tag = side > 0 ? 'armL' : 'armR';
      const { rx } = at(shoulderY);
      // The shoulder sits on the body's surface, but never so far in that the
      // upper arm cannot reach the hanging line.
      const jointX = Math.max(rx * 0.86, hangX - upperLen * 0.5);
      const joint = new THREE.Vector3(side * jointX, shoulderY, 0);
      const outward = Math.min(hangX - jointX, upperLen * 0.55);
      const elbow = new THREE.Vector3(
        side * (jointX + outward),
        shoulderY - Math.sqrt(Math.max(upperLen * upperLen - outward * outward, 0.0001)),
        0,
      );
      const wrist = elbow.clone().add(
        new THREE.Vector3(side * foreLen * 0.06, -Math.cos(0.3) * foreLen, Math.sin(0.3) * foreLen),
      );

      // Upper arm: a shoulder cap over the pivot, then a taper to the elbow.
      parts.push({
        geometry: limb(joint, elbow, [
          [-0.34, armR * 0.5],
          [-0.2, armR * 1.12],
          [-0.06, armR * 1.42],
          [0.06, armR * 1.36],
          [0.3, armR * 1.02],
          [0.7, armR * 0.94],
          [1, armR * 0.86],
        ]),
        color: sleeve,
        bone: `${tag}u`,
      });
      // Forearm: an elbow head centred on the pivot, a swell below it, a
      // narrow wrist. Slightly flattened, which is what stops it reading as a
      // pipe.
      const bare = sleeveEnd < 0.5 ? hide : sleeve;
      parts.push({
        geometry: limb(
          elbow,
          wrist,
          [
            [-0.26, armR * 0.5],
            [-0.13, armR * 0.86],
            [0, armR * 1.0],
            [0.16, armR * 0.98],
            [0.45, armR * 0.88],
            [0.78, armR * 0.68],
            [1, armR * 0.58],
          ],
          0.88,
        ),
        color: bare,
        bone: `${tag}l`,
      });
      // The hand: a mitt with a thumb, sunk onto the wrist.
      const hand = wrist.clone().add(new THREE.Vector3(0, -armR * 0.5, armR * 0.15));
      const mitt = new THREE.IcosahedronGeometry(armR * 1.15, 1);
      mitt.scale(0.9, 1.25, 1.0);
      mitt.translate(hand.x, hand.y, hand.z);
      parts.push({ geometry: mitt, color: shade(hide, 0.92), bone: `${tag}l` });
      const thumb = new THREE.IcosahedronGeometry(armR * 0.5, 1);
      thumb.scale(0.8, 1, 0.8);
      thumb.translate(hand.x - side * armR * 0.85, hand.y + armR * 0.35, hand.z + armR * 0.35);
      parts.push({ geometry: thumb, color: shade(hide, 0.92), bone: `${tag}l` });
      // A cuff where the sleeve ends, when it ends on the forearm.
      if (sleeveEnd >= 0.5) {
        const cuffAt = elbow.clone().lerp(wrist, 0.1);
        const cuff = new THREE.CylinderGeometry(armR * 1.08, armR * 1.12, armR * 0.7, LIMB_SIDES);
        cuff.translate(cuffAt.x, cuffAt.y, cuffAt.z);
        parts.push({ geometry: cuff, color: accent, bone: `${tag}l` });
      }

      bones.push({ name: `${tag}u`, parent: 'torso', at: joint.toArray() as [number, number, number] });
      bones.push({ name: `${tag}l`, parent: `${tag}u`, at: elbow.toArray() as [number, number, number] });
    }

    // --- legs -------------------------------------------------------------
    //
    // A hip head on the thigh, a knee head on the shin, a calf, and a narrow
    // ankle that the boot swallows.
    const trouser = lower;
    for (const side of [1, -1] as const) {
      const tag = side > 0 ? 'legL' : 'legR';
      const joint = new THREE.Vector3(side * stance, bottom + legR * 0.35, 0);
      const knee = new THREE.Vector3(side * stance * 1.02, legLength * 0.46, 0.008);
      const ankle = new THREE.Vector3(side * stance * 1.05, legR * 1.15, 0);
      // Where the trouser leg stops and the boot begins. The two meet on a
      // shared ring rather than overlapping — see `boot`.
      const cuffR = legR * 0.72;
      const ankleTop = new THREE.Vector3(ankle.x, ankle.y + legR * 0.6, ankle.z);

      parts.push({
        geometry: limb(joint, knee, [
          [-0.3, legR * 0.55],
          [-0.16, legR * 1.05],
          [-0.05, legR * 1.28],
          [0.08, legR * 1.2],
          [0.35, legR * 1.02],
          [0.75, legR * 0.94],
          [1, legR * 0.88],
        ]),
        color: trouser,
        bone: `${tag}u`,
      });
      parts.push({
        geometry: limb(
          knee,
          ankleTop,
          [
            [-0.24, legR * 0.55],
            [-0.12, legR * 0.9],
            [0, legR * 1.02],
            [0.14, legR * 1.0],
            // The calf, and then away to the ankle.
            [0.36, legR * 1.06],
            [0.72, legR * 0.8],
            [1, cuffR],
          ],
          0.94,
          // Open at the bottom: the boot's collar carries on from this exact
          // ring, so the two are one surface.
          { start: true, end: false },
        ),
        color: trouser,
        bone: `${tag}l`,
      });
      parts.push(...boot(ankle, ankleTop, cuffR, legR, leather, `${tag}l`, `${tag}f`));
      // Off the hips, so the pelvis carries the legs and the feet are solved
      // back to the ground from wherever it goes.
      bones.push({ name: `${tag}u`, parent: 'hips', at: joint.toArray() as [number, number, number] });
      bones.push({ name: `${tag}l`, parent: `${tag}u`, at: knee.toArray() as [number, number, number] });
      bones.push({ name: `${tag}f`, parent: `${tag}l`, at: ankle.toArray() as [number, number, number] });
    }
    const legJoint = new THREE.Vector3(stance, bottom + legR * 0.35, 0);
    const legKnee = new THREE.Vector3(stance * 1.02, legLength * 0.46, 0.008);
    const legAnkle = new THREE.Vector3(stance * 1.05, legR * 1.15, 0);

    // --- worn pieces ------------------------------------------------------
    const body: Body = { radius, bottom, top, at, waistY, hide, cloth, accent, leather, metal, side: dominant };
    const worn = new Set<Wear>();
    const count = rng.chance(0.12) ? 0 : rng.chance(0.42) ? 1 : rng.chance(0.62) ? 2 : 3;
    for (let i = 0; i < count; i++) {
      const wear = pickWeighted(rng, WEARS);
      if (worn.has(wear)) continue;
      worn.add(wear);
      for (const part of wear.build(rng, body)) parts.push({ ...part, bone: wear.bone });
    }

    const mesh = finishRigged(parts, { bones }, 'figure', 0, scale);
    const life: LifeSpec = {
      kind: 'biped',
      seed,
      legLength: legLength * scale,
      bodyLength: radius * 2 * scale,
      height: crown * scale,
      headHeight: faceY * scale,
      radius: (radius + 0.12) * scale,
      walkSpeed: 0.7 * scale,
      roam: roam ?? 6,
      call: 'voice',
      tone: 0.72 / bodyH,
      grazes: false,
      grazeDrop: 0,
      handed: dominant,
      face,
      legs: {
        thigh: legJoint.distanceTo(legKnee) * scale,
        shin: legKnee.distanceTo(legAnkle) * scale,
        ankle: legAnkle.y * scale,
      },
    };
    mesh.userData.life = life;
    return mesh;
  },
};

/**
 * A boot: a collar carrying straight on from the trouser leg, and a foot.
 *
 * **The collar is not a separate thing pushed over the ankle.** It starts on
 * the *same ring* the shin ended on, with the same radius and the same
 * section, and neither piece is capped there — so the two are one continuous
 * surface with a colour change at a ring, and there is nothing to intersect.
 * The version before this was a tube of its own overlapping the shin at about
 * the same radius, and two faceted surfaces cutting through each other at a
 * shallow angle is what produced the star at the ankle.
 *
 * The foot's rear rings stay inside the collar for the same reason: it only
 * emerges forward, where the collar has nothing to argue with. The collar
 * rides the shin with the trouser leg it continues; the foot rides the ankle
 * bone, and turns inside the collar when the sole is held flat to the ground.
 */
function boot(
  ankle: THREE.Vector3,
  ankleTop: THREE.Vector3,
  cuffR: number,
  legR: number,
  color: number,
  shinBone: string,
  footBone: string,
): Part[] {
  const w = legR * 1.3;
  const h = legR * 1.5;
  const length = legR * 3.7;
  const back = ankle.z - legR * 1.2;

  const collar = limb(
    ankleTop,
    new THREE.Vector3(ankle.x, ankle.y - legR * 0.5, ankle.z),
    [
      [0, cuffR],
      [0.3, legR * 1.14],
      [0.6, legR * 1.1],
      [1, legR * 1.0],
    ],
    0.94,
    { start: false, end: true },
  );

  const foot = loft(
    [
      { at: [ankle.x, h * 0.5, back], rx: w * 0.66, ry: h * 0.5 },
      { at: [ankle.x, h * 0.5, back + length * 0.34], rx: w, ry: h * 0.5 },
      { at: [ankle.x, h * 0.45, back + length * 0.66], rx: w * 0.96, ry: h * 0.45 },
      { at: [ankle.x, h * 0.36, back + length * 0.88], rx: w * 0.78, ry: h * 0.36 },
      { at: [ankle.x, h * 0.3, back + length], rx: w * 0.44, ry: h * 0.28 },
    ],
    LIMB_SIDES + 1,
  );

  const strap = new THREE.BoxGeometry(w * 2.06, legR * 0.26, legR * 0.42);
  strap.translate(ankle.x, h * 0.6, back + length * 0.36);

  return [
    { geometry: collar, color, bone: shinBone },
    { geometry: foot, color, bone: footBone },
    { geometry: strap, color: shade(color, 0.75), bone: footBone },
  ];
}
