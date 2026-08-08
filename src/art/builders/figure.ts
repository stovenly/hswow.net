import * as THREE from 'three';
import type { BuildOptions, BuilderWith } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng, type Rng } from '../random';
import { PALETTE } from '../palette';
import { ClothSim, type ClothCollider } from '../cloth';
import { clothPanel } from '../clothMesh';

/**
 * A standing figure. Person-shaped, person-sized, and not quite a person.
 *
 * Built to human measurements — around 1.7 m, eyes near 1.62, the same figure
 * the first-person controller uses — so doorways sized against one fit the
 * other. Everything above that measurement is allowed to drift.
 *
 * Two kinds of variation, at deliberately different rates:
 *
 * - **Shape, on every figure.** The head is drawn from six forms, the torso
 *   from four, the limbs from two. Nothing about that is strange in itself; a
 *   coned head is a hood, a drum head is a helmet. But a crowd assembled from
 *   these does not repeat, and the eye reads a crowd that does not repeat as a
 *   crowd of individuals.
 * - **Fittings.** Most carry or wear something on one side: something held,
 *   a shoulder plate, a pack, a single horn. This is where
 *   the asymmetry lives, and it is deliberately *not* mismatched limbs — a
 *   figure with one arm longer than the other reads as injured, while the same
 *   imbalance made of a staff and a pauldron reads as a person who does
 *   something. One is a defect, the other is a biography.
 *
 *   Kept rare on purpose. Common asymmetry stops being asymmetry and becomes
 *   the style, and a whole population of odd things is far less unsettling
 *   than one odd thing among many ordinary ones.
 *
 * Never a face. Features would make the proportions read as caricature; the
 * absence of them keeps it merely unfamiliar.
 *
 * **Merged but not final.** Phase 7 needs the limbs as separate objects to
 * animate. Each limb is built about its own pivot at the origin and then moved
 * into place, so a jointed version is a matter of not merging rather than of
 * rebuilding.
 */

type HeadShape = 'cone' | 'orb' | 'block' | 'drum' | 'spike' | 'wedge';

/** Weighted. Cones are the commonest — the hooded silhouette is the anchor. */
const HEADS: readonly { shape: HeadShape; weight: number }[] = [
  { shape: 'cone', weight: 0.3 },
  { shape: 'orb', weight: 0.2 },
  { shape: 'wedge', weight: 0.16 },
  { shape: 'drum', weight: 0.14 },
  { shape: 'block', weight: 0.11 },
  { shape: 'spike', weight: 0.09 },
];

function pickHead(rng: Rng): HeadShape {
  let roll = rng();
  for (const entry of HEADS) {
    roll -= entry.weight;
    if (roll <= 0) return entry.shape;
  }
  return 'cone';
}

/**
 * How far a head sinks onto the neck, as a fraction of its own size.
 *
 * Shapes widest at the bottom need only a little; shapes that come to a point
 * down there need a lot, or the neck emerges from a vertex and the head
 * appears to balance on it. Every value here overlaps rather than meets — two
 * surfaces that exactly touch will show a seam at some angle, and a floating
 * head is the most obviously wrong thing a figure can do.
 */
const HEAD_SINK: Record<HeadShape, number> = {
  cone: 0.3,
  wedge: 0.3,
  drum: 0.4,
  block: 0.4,
  orb: 0.5,
  spike: 0.85,
};

function buildHead(shape: HeadShape, size: number, rng: Rng): THREE.BufferGeometry {
  switch (shape) {
    case 'cone':
      return new THREE.ConeGeometry(size * 1.15, size * rng.range(2.2, 3.2), rng.int(5, 8));
    case 'wedge':
      // Four sides makes a distinctly faceted, beaked form rather than a hood.
      return new THREE.ConeGeometry(size * 1.3, size * rng.range(1.6, 2.2), 4);
    case 'drum':
      return new THREE.CylinderGeometry(size * 1.1, size * 1.15, size * rng.range(1.1, 1.7), 7);
    case 'block':
      return new THREE.BoxGeometry(size * 1.7, size * rng.range(1.6, 2.3), size * 1.5);
    case 'spike':
      // A bipyramid: two cones base to base, which an octahedron already is.
      return new THREE.OctahedronGeometry(size * 1.3, 0);
    case 'orb':
    default:
      return new THREE.IcosahedronGeometry(size, 0);
  }
}

/**
 * A torso, and how deep it is.
 *
 * The depth is returned rather than assumed because anything worn *on* the
 * chest has to know where the chest surface is, and that differs by a factor
 * of two between a box torso and a round one. Guessing produces fittings that
 * float in front of some figures and are swallowed by others.
 */
function buildTorso(
  rng: Rng,
  chest: number,
  waist: number,
  length: number,
): { geometry: THREE.BufferGeometry; halfDepth: number } {
  switch (rng.int(0, 3)) {
    case 0:
      return {
        geometry: new THREE.BoxGeometry(chest * 2, length, chest * 1.3),
        halfDepth: chest * 0.65,
      };
    case 1:
      // Inverted taper — broad at the hip, narrow at the shoulder. Reads as
      // stooped without any bending.
      return {
        geometry: new THREE.CylinderGeometry(waist, chest, length, rng.int(5, 7)),
        halfDepth: chest * 0.85,
      };
    case 2:
      return {
        geometry: new THREE.CylinderGeometry(chest, waist, length, 4),
        halfDepth: chest * 0.75,
      };
    default:
      return {
        geometry: new THREE.CylinderGeometry(chest, waist, length, rng.int(5, 7)),
        halfDepth: chest * 0.85,
      };
  }
}

function buildLimb(boxy: boolean, top: number, bottom: number, length: number): THREE.BufferGeometry {
  return boxy
    ? new THREE.BoxGeometry(top * 2, length, top * 2)
    : new THREE.CylinderGeometry(top, bottom, length, 5);
}

/**
 * Things a figure is carrying or wearing, always on one side.
 *
 * This is where the asymmetry lives. A mismatched pair of arms reads as an
 * injury and invites sympathy or alarm; a staff in one hand, a pauldron on one
 * shoulder, a pack slung on one side reads as a *person who does something* —
 * the same visual imbalance carrying an entirely different meaning. One is a
 * defect, the other is a biography.
 *
 * Each returns geometry positioned in the figure's own space, given the
 * measurements it needs to hang off.
 */
interface Fitting {
  name: string;
  weight: number;
  build(rng: Rng, m: Measurements, side: number): Part[];
}

export interface Measurements {
  height: number;
  shoulder: number;
  hip: number;
  chest: number;
  /** Out to the outside of the arm — roughly where a hand would be. */
  reach: number;
  /** Height a hanging hand sits at. */
  hold: number;
  /** Half-depth of the torso — where the front of the chest is. */
  depth: number;
}

/**
 * A collider capsule worn cloth is projected out of, declared relative to a
 * named node. On today's static figure both nodes are the mesh root; when
 * Phase 7 splits the figure into animated objects the capsules ride their
 * nodes with zero changes here.
 */
export interface FigureCollider {
  node: 'torso' | 'head';
  a: readonly [number, number, number];
  b: readonly [number, number, number];
  radius: number;
}

/**
 * Held in the hand, on the dominant side, at about hip height.
 *
 * Possessions, not equipment. Nobody in a town carries an implement at all
 * times, but almost everybody is carrying *something* — and the difference
 * between a figure with a tool and a figure with a cup is the difference
 * between a role and a life. A tool says what someone is for; a loaf, a stone,
 * a sprig of something says only that they were somewhere before this.
 *
 * **Carried out in front of the hip, not flat against it.** The first version
 * placed everything at the arm's own offset, where the arm sat directly in
 * front of it from most angles and the object was half inside the limb — the
 * geometry was all there and effectively invisible. Objects are also sized and
 * coloured to separate from the body: a pale cup against a pale tunic at this
 * polygon count and this palette is not a cup, it is a slightly odd elbow.
 */

/**
 * Where a carried object is centred.
 *
 * `half` is the object's own half-width, and passing it is not optional in
 * practice. `reach` is where the *hand* is, so centring an object there puts
 * half of it further in than the hand — and half of a cloth bundle is a good
 * deal wider than the gap between the hand and the ribs. Large objects ended
 * up buried in the chest while small ones sat correctly, which is exactly the
 * signature of an offset that ignores the size of the thing being offset.
 *
 * Clearing by the half-width instead puts every object's *inner edge* just
 * outside the arm, whatever its size.
 */
function handAt(m: Measurements, side: number, half = 0): THREE.Vector3 {
  // Forward of the body as well, so the arm never stands in front of it.
  return new THREE.Vector3(side * (m.reach + 0.03 + half), m.hold, 0.16);
}
const HELD: readonly ((rng: Rng, m: Measurements, side: number) => Part[])[] = [
  // A cup, narrow at the base.
  (rng, m, side) => {
    const h = rng.range(0.11, 0.16);
    const hand = handAt(m, side, h * 0.6);
    const cup = new THREE.CylinderGeometry(h * 0.6, h * 0.4, h, 7);
    cup.translate(hand.x, hand.y + h / 2, hand.z);
    return [{ geometry: cup, color: rng.pick([PALETTE.WOOL, PALETTE.RUST]), sway: 0 }];
  },

  // A jug: belly and a narrow neck. Two primitives is enough to read as one.
  (rng, m, side) => {
    const body = rng.range(0.14, 0.2);
    const hand = handAt(m, side, body);
    const belly = new THREE.IcosahedronGeometry(body, 0);
    belly.scale(1, 1.15, 1);
    belly.translate(hand.x, hand.y + body * 0.7, hand.z);
    const neck = new THREE.CylinderGeometry(body * 0.32, body * 0.45, body * 0.8, 6);
    neck.translate(hand.x, hand.y + body * 1.8, hand.z);
    const clay = rng.pick([PALETTE.RUST, PALETTE.COW_BLACK]);
    return [
      { geometry: belly, color: clay, sway: 0 },
      { geometry: neck, color: clay, sway: 0 },
    ];
  },

  // A stone, carried for no reason anyone has explained.
  (rng, m, side) => {
    const size = rng.range(0.1, 0.15);
    const hand = handAt(m, side, size);
    const stone = new THREE.IcosahedronGeometry(size, 0);
    stone.scale(1, rng.range(0.7, 0.95), rng.range(0.8, 1.1));
    stone.rotateX(rng.range(0, Math.PI));
    stone.rotateY(rng.range(0, Math.PI));
    stone.translate(hand.x, hand.y, hand.z);
    return [{ geometry: stone, color: rng.pick([PALETTE.STONE_DARK, PALETTE.COW_BLACK]), sway: 0 }];
  },

  // A sprig — leaves on a stem, held upright. The only carried thing with any
  // sway weight on it, so it moves when the wind does.
  (rng, m, side) => {
    const parts: Part[] = [];
    // The sprig is narrow at the hand; its leaves fan out above, clear of the
    // body regardless.
    const hand = handAt(m, side, 0.04);
    const stemLength = rng.range(0.28, 0.45);
    const stem = new THREE.CylinderGeometry(0.012, 0.016, stemLength, 4);
    stem.translate(hand.x, hand.y + stemLength / 2, hand.z);
    parts.push({ geometry: stem, color: PALETTE.BARK, sway: 0.45 });

    const leaves = rng.int(3, 6);
    for (let i = 0; i < leaves; i++) {
      const leaf = new THREE.IcosahedronGeometry(rng.range(0.055, 0.085), 0);
      leaf.scale(1, 0.4, 0.85);
      leaf.rotateY(rng.range(0, Math.PI));
      leaf.rotateZ(rng.around(0, 0.5));
      leaf.translate(
        hand.x + rng.around(0, 0.07),
        hand.y + stemLength * rng.range(0.6, 1.05),
        hand.z + rng.around(0, 0.06),
      );
      parts.push({ geometry: leaf, color: PALETTE.LEAF, sway: 0.7 });
    }
    return parts;
  },

  // A loaf, or something wrapped that is shaped like one.
  (rng, m, side) => {
    const size = rng.range(0.11, 0.16);
    // Widest along its own x after the 1.5 stretch, so that is the clearance.
    const hand = handAt(m, side, size * 1.5);
    const loaf = new THREE.IcosahedronGeometry(size, 0);
    loaf.scale(1.5, 0.75, 0.9);
    loaf.rotateY(rng.around(0, 0.4));
    loaf.translate(hand.x, hand.y + 0.03, hand.z);
    return [{ geometry: loaf, color: rng.pick([PALETTE.BARK_PALE, PALETTE.MARKER_YELLOW]), sway: 0 }];
  },

  // A bundle of cloth, carried in the crook of the arm.
  (rng, m, side) => {
    const size = rng.range(0.16, 0.23);
    const hand = handAt(m, side, size);
    const bundle = new THREE.IcosahedronGeometry(size, 0);
    bundle.scale(1, rng.range(0.8, 1.05), 0.9);
    bundle.rotateX(rng.range(0, Math.PI));
    bundle.translate(hand.x, hand.y + 0.06, hand.z);
    return [{ geometry: bundle, color: rng.pick([PALETTE.WOOL, PALETTE.RUST]), sway: 0 }];
  },

  // A flat slab — a board, a tablet, something written on.
  (rng, m, side) => {
    const w = rng.range(0.2, 0.28);
    // Tilted, so its swept half-width is the diagonal rather than half the
    // board — a slab held at an angle is wider than a slab held flat.
    const hand = handAt(m, side, w * 0.55);
    const slab = new THREE.BoxGeometry(w * 0.75, w, 0.03);
    slab.rotateZ(side * rng.range(0.15, 0.45));
    slab.translate(hand.x, hand.y + w * 0.3, hand.z);
    return [
      { geometry: slab, color: rng.pick([PALETTE.COW_BLACK, PALETTE.WOOL]), sway: 0 },
    ];
  },

  // A lantern on a wire. Arguably equipment, kept because an unlit lamp
  // carried in daylight says something about where its owner has been.
  (rng, m, side) => {
    const hand = handAt(m, side, 0.07);
    const drop = rng.range(0.1, 0.18);
    const hanger = new THREE.CylinderGeometry(0.01, 0.01, drop, 4);
    hanger.translate(hand.x, hand.y + drop / 2, hand.z);
    const box = new THREE.BoxGeometry(0.12, 0.15, 0.12);
    box.translate(hand.x, hand.y - 0.07, hand.z);
    const cap = new THREE.ConeGeometry(0.095, 0.06, 4);
    cap.translate(hand.x, hand.y + 0.02, hand.z);
    return [
      { geometry: hanger, color: PALETTE.IRON, sway: 0 },
      { geometry: box, color: PALETTE.MARKER_YELLOW, sway: 0 },
      { geometry: cap, color: PALETTE.IRON, sway: 0 },
    ];
  },

  // A fish. Someone has been to the water.
  (rng, m, side) => {
    const length = rng.range(0.24, 0.36);
    // Held at an angle across the body, so what matters is how far the
    // rotated fish reaches back toward the ribs.
    const hand = handAt(m, side, length * 0.5);
    const body = new THREE.OctahedronGeometry(length * 0.36, 0);
    body.scale(1.9, 0.85, 0.5);
    body.rotateZ(side * 0.8);
    body.translate(hand.x, hand.y - length * 0.25, hand.z);
    const tail = new THREE.ConeGeometry(length * 0.16, length * 0.24, 3);
    tail.scale(1, 1, 0.4);
    tail.rotateZ(side * 0.8 + Math.PI);
    tail.translate(
      hand.x + side * length * 0.32,
      hand.y - length * 0.25 - length * 0.42,
      hand.z,
    );
    return [
      { geometry: body, color: PALETTE.STONE_PALE, sway: 0 },
      { geometry: tail, color: PALETTE.STONE, sway: 0 },
    ];
  },
];

const FITTINGS: readonly Fitting[] = [
  {
    name: 'held',
    // By far the commonest, and the point of the whole set.
    weight: 0.52,
    build: (rng, m, side) => rng.pick(HELD)(rng, m, side),
  },
  {
    name: 'pauldron',
    weight: 0.18,
    build: (rng, m, side) => {
      const cap = new THREE.IcosahedronGeometry(rng.range(0.09, 0.14), 0);
      cap.scale(1.15, 0.65, 1.05);
      cap.rotateY(rng.range(0, Math.PI));
      cap.translate(side * (m.chest + 0.04), m.shoulder - 0.02, 0);
      return [{ geometry: cap, color: PALETTE.IRON, sway: 0 }];
    },
  },
  {
    name: 'pack',
    weight: 0.19,
    build: (rng, m, side) => {
      const w = rng.range(0.2, 0.32);
      const h = rng.range(0.24, 0.4);
      const thickness = rng.range(0.12, 0.2);
      // Seated against the *back* — measured, not guessed from the chest's
      // half-width. A box torso is barely two-thirds as deep as it is wide, so
      // a pack placed by width floats behind the narrow figures and sinks into
      // the round ones. The same mistake the sash was made of, at a smaller
      // scale and correspondingly harder to notice.
      const pack = new THREE.BoxGeometry(w, h, thickness);
      pack.rotateY(rng.around(0, 0.2));
      pack.translate(
        side * rng.range(0, 0.07),
        m.shoulder - h * 0.55,
        -(m.depth + thickness * 0.4),
      );
      // No strap.
      //
      // It was a thin box running front to back over the shoulder, which means
      // straight through the torso — so what showed from the front was a bar
      // protruding from the chest with a block behind it. A hammer, basically.
      //
      // Any strap that reads correctly has to wrap the body, and wrapping is
      // not something a box does. It could be built from stepped plates like
      // the baldric was, but that was the second fitting to be rebuilt for
      // this reason and then cut anyway: at this distance and this polygon
      // count a pack on the back is legible on its own, and the strap was only
      // ever an explanation of how it stayed there.
      return [{ geometry: pack, color: PALETTE.TIMBER_DARK, sway: 0 }];
    },
  },
  {
    name: 'horn',
    weight: 0.08,
    build: (rng, m, side) => {
      // One horn, never two. A pair is a costume; a single one is wrong.
      const length = rng.range(0.14, 0.3);
      const horn = new THREE.ConeGeometry(rng.range(0.02, 0.035), length, 4);
      horn.translate(0, length / 2, 0);
      horn.rotateZ(side * rng.range(0.5, 1.1));
      horn.rotateX(rng.around(0, 0.3));
      horn.translate(side * 0.05, m.height * 0.97, 0);
      return [{ geometry: horn, color: PALETTE.SKIN, sway: 0 }];
    },
  },
];

function pickFitting(rng: Rng): Fitting {
  let roll = rng() * FITTINGS.reduce((sum, f) => sum + f.weight, 0);
  for (const fitting of FITTINGS) {
    roll -= fitting.weight;
    if (roll <= 0) return fitting;
  }
  return FITTINGS[0];
}

export interface FigureOptions extends BuildOptions {
  /** One worn item at most — a cape or a scarf, simulated. See CLOTH.md §7. */
  wearing?: 'cape' | 'scarf';
  /** A `FABRICS` name. Cape defaults to canvas, scarf to sheer. */
  fabric?: string;
}

export const figure: BuilderWith<FigureOptions> = {
  name: 'figure',
  category: 'people',
  radius: 0.55,

  build({ seed = 1, scale = 1, wearing, fabric }: FigureOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(1.55, 2.05);
    const build = rng.range(0.72, 1.24);
    const hip = height * rng.range(0.44, 0.58);
    const shoulder = height * rng.range(0.78, 0.87);

    const cloth = rng.pick([PALETTE.CLOTH, PALETTE.TIMBER_DARK, PALETTE.STONE_DARK]);
    const covered = rng.chance(0.45);

    // Which way it is turned out. Fittings all hang off this one side, so a
    // figure reads as consistently handed rather than as decorated at random.
    const dominant = rng.chance(0.5) ? 1 : -1;

    // --- torso --------------------------------------------------------------
    const chest = 0.19 * build * rng.range(0.8, 1.25);
    const waist = 0.15 * build * rng.range(0.8, 1.3);
    const { geometry: torso, halfDepth } = buildTorso(rng, chest, waist, shoulder - hip);
    torso.translate(0, (shoulder + hip) / 2, 0);
    torso.rotateY(rng.around(0, 0.25));
    parts.push({ geometry: torso, color: cloth, sway: 0 });

    // --- head ---------------------------------------------------------------
    const neckLength = rng.range(0.04, 0.22);
    const neck = new THREE.CylinderGeometry(0.045, 0.06, neckLength, 5);
    neck.translate(0, shoulder + neckLength / 2, 0);
    parts.push({ geometry: neck, color: PALETTE.SKIN, sway: 0 });

    const headSize = rng.range(0.085, 0.15);
    const shape = pickHead(rng);
    const head = buildHead(shape, headSize, rng);
    head.scale(rng.range(0.82, 1.08), rng.range(0.95, 1.3), rng.range(0.85, 1.12));
    // Never quite square to the shoulders.
    head.rotateZ(rng.around(0, 0.16));
    head.rotateY(rng.range(0, Math.PI));

    // Seated on the neck by measurement, not by a guessed offset.
    //
    // The head is scaled and rotated before this, so where its underside ends
    // up is not predictable from `headSize` — which is why a fixed offset left
    // so many of them hovering. Measuring the transformed bounds and dropping
    // the lowest point below the neck top guarantees an overlap for every
    // shape, scale and tilt. No lateral jitter either: an offset head slides
    // off the neck rather than sitting askew on it.
    head.computeBoundingBox();
    const sink = headSize * HEAD_SINK[shape];
    head.translate(0, shoulder + neckLength - sink - (head.boundingBox?.min.y ?? 0), 0);
    head.computeBoundingBox();
    // Where the head actually ends, measured — the head-and-neck collider and
    // anything worn against it are placed off this rather than a guess.
    const headTop = head.boundingBox?.max.y ?? shoulder + neckLength + headSize * 2;
    parts.push({ geometry: head, color: covered ? cloth : PALETTE.SKIN, sway: 0 });

    // --- limbs --------------------------------------------------------------
    const legThickness = rng.range(0.045, 0.075) * build;
    const armThickness = rng.range(0.03, 0.055) * build;
    const armLength = (shoulder - hip) * rng.range(0.95, 1.5);

    // Limbs come in matched pairs: shape, size, splay and stance are chosen
    // once and mirrored. All the asymmetry a figure has is in what it carries.
    const legBoxy = rng.chance(0.25);
    const legSplay = rng.range(-0.02, 0.09);
    const legStance = rng.range(0.06, 0.11) * build;
    const armBoxy = rng.chance(0.25);
    const armSplay = rng.range(0.04, 0.22);

    for (const side of [-1, 1]) {
      const legLength = hip;
      const leg = buildLimb(legBoxy, legThickness, legThickness * 0.8, legLength);
      leg.translate(0, -legLength / 2, 0);
      leg.rotateZ(side * legSplay);
      leg.translate(side * legStance, hip, 0);
      parts.push({ geometry: leg, color: PALETTE.TIMBER_DARK, sway: 0 });

      const arm = buildLimb(armBoxy, armThickness, armThickness * 0.82, armLength);
      arm.translate(0, -armLength / 2, 0);
      arm.rotateZ(side * armSplay);
      arm.translate(side * (chest + armThickness * 1.4), shoulder - 0.03, 0);
      parts.push({ geometry: arm, color: cloth, sway: 0 });
    }

    // --- fittings -----------------------------------------------------------
    const measurements: Measurements = {
      height,
      shoulder,
      hip,
      chest,
      reach: chest + armThickness * 2.6,
      // Where a hanging hand ends up — everything held is placed against this.
      hold: shoulder - armLength * 0.82,
      depth: halfDepth,
    };
    // Most of them carry or wear something.
    //
    // Raised twice, from a third. The lesson is about small samples rather
    // than about taste: eight is all anyone ever sees at once, and at p = 0.5
    // eight draws come up with one or none about four times in a hundred —
    // which is exactly what happened, and a feature that is absent from the
    // only sample on screen is indistinguishable from a feature that is
    // broken. Rare things need to be commoner than "rare" to survive being
    // looked at a handful at a time.
    if (rng.chance(0.62)) {
      parts.push(...pickFitting(rng).build(rng, measurements, dominant));
      if (rng.chance(0.22)) {
        parts.push(...pickFitting(rng).build(rng, measurements, dominant));
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    const mesh = finish(geometry, 'figure', 0);

    // Measured anatomy, exported: worn cloth — and eventually anything else —
    // is placed against these rather than guessed offsets. The capsules
    // overlap deliberately, torso through neck through head; gaps between
    // colliders are where cloth edges get through, and the rule is no gaps.
    const s = scale;
    const torsoRadius = (Math.max(chest * 1.05, halfDepth) + 0.02) * s;
    const headRadius = Math.max(headSize * 1.25, 0.09) * s;
    const headCapTop = Math.max(headTop - headRadius / s * 0.6, shoulder + 0.05) * s;
    const figureColliders: FigureCollider[] = [
      {
        node: 'torso',
        a: [0, (hip - 0.05) * s, 0],
        b: [0, shoulder * s, 0],
        radius: torsoRadius,
      },
      {
        node: 'head',
        a: [0, (shoulder - 0.02) * s, 0],
        b: [0, headCapTop, 0],
        radius: headRadius,
      },
    ];
    mesh.userData.measurements = {
      height: height * s,
      shoulder: shoulder * s,
      hip: hip * s,
      chest: chest * s,
      reach: measurements.reach * s,
      hold: measurements.hold * s,
      depth: halfDepth * s,
    } satisfies Measurements;
    mesh.userData.colliders = figureColliders;

    if (wearing) {
      const clothColliders: ClothCollider[] = [
        ...figureColliders.map(
          (capsule): ClothCollider => ({
            kind: 'capsule',
            a: capsule.a,
            b: capsule.b,
            radius: capsule.radius,
          }),
        ),
        { kind: 'ground', y: 0 },
      ];
      const worn =
        wearing === 'cape'
          ? buildCape(rng, fabric ?? 'canvas', s, {
              shoulder: shoulder * s,
              hip: hip * s,
              reach: measurements.reach * s,
              torsoRadius,
            })
          : buildScarf(rng, fabric ?? 'sheer', s, {
              neckY: (shoulder + neckLength * 0.5) * s,
              headRadius,
              chest: chest * s,
              torsoRadius,
              hold: measurements.hold * s,
            });
      const sim = new ClothSim({ ...worn, colliders: clothColliders, seed });
      // Worn cloth pre-drapes longer than a hanging sheet: it has a body to
      // find its way around before it is ever seen.
      sim.settle(48);
      const panel = clothPanel(sim, { name: 'figure', color: worn.color });
      mesh.add(panel.mesh);
    }

    return mesh;
  },
};

/** The cape: pinned across the shoulder line at the torso's measured back face. */
function buildCape(
  rng: Rng,
  fabric: string,
  s: number,
  m: { shoulder: number; hip: number; reach: number; torsoRadius: number },
): { cols: number; rows: number; rest: Float32Array; pins: number[]; fabric: string; color: number } {
  const COLS = 9;
  const ROWS = 10;
  const width = Math.max(m.reach * 1.9, 0.46 * s);
  const top = m.shoulder + 0.02 * s;
  const bottom = m.hip * 0.3;
  const back = -(m.torsoRadius + 0.02 * s);
  const rest = new Float32Array(COLS * ROWS * 3);
  const pins: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      rest[i * 3] = -width / 2 + (c / (COLS - 1)) * width;
      rest[i * 3 + 1] = top - (r / (ROWS - 1)) * (top - bottom);
      rest[i * 3 + 2] = back;
      if (r === 0) pins.push(i);
    }
  }
  const color = rng.pick([PALETTE.RUST, PALETTE.CLOTH, PALETTE.STONE_DARK]);
  return { cols: COLS, rows: ROWS, rest, pins, fabric, color };
}

/**
 * The scarf: a strip whose middle wraps the back of the neck — those rows are
 * the pins — with both ends hanging free down the chest. The liveliest thing
 * in the set, and the best stress test of the margin rule, because it lies
 * directly on the smallest colliders.
 */
function buildScarf(
  rng: Rng,
  fabric: string,
  s: number,
  m: { neckY: number; headRadius: number; chest: number; torsoRadius: number; hold: number },
): { cols: number; rows: number; rest: Float32Array; pins: number[]; fabric: string; color: number } {
  const COLS = 3;
  const ROWS = 14;
  const width = 0.11 * s;
  const wrapR = m.headRadius + 0.015 * s;
  // Rows 0..3 are one tail, 4..9 the wrap, 10..13 the other tail — authored
  // as a path; the settle finds the real drape.
  const wrapStart = 4;
  const wrapEnd = 9;
  const tailDrop = Math.max(m.neckY - m.hold, 0.5 * s);
  const rest = new Float32Array(COLS * ROWS * 3);
  const pins: number[] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const across = (c - 1) * (width / 2);
      if (r >= wrapStart && r <= wrapEnd) {
        // Around the back: φ sweeps from one side of the neck to the other.
        const t = (r - wrapStart) / (wrapEnd - wrapStart);
        const phi = Math.PI * (0.5 + t);
        rest[i * 3] = Math.sin(phi) * wrapR;
        rest[i * 3 + 1] = m.neckY + across;
        rest[i * 3 + 2] = Math.cos(phi) * wrapR;
        pins.push(i);
      } else {
        // A tail, hanging in front of the chest from its own side of the neck.
        const first = r < wrapStart;
        const side = first ? 1 : -1;
        const t = first ? (wrapStart - r) / wrapStart : (r - wrapEnd) / (ROWS - 1 - wrapEnd);
        rest[i * 3] = side * (m.chest * 0.55) + across;
        rest[i * 3 + 1] = m.neckY - t * tailDrop;
        rest[i * 3 + 2] = m.torsoRadius + 0.02 * s;
      }
    }
  }
  const color = rng.pick([PALETTE.RUST, PALETTE.MARKER_YELLOW, PALETTE.WOOL]);
  return { cols: COLS, rows: ROWS, rest, pins, fabric, color };
}
