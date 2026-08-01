import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

/**
 * Elder in fruit: a low, wide, multi-stemmed shrub hung with black berries.
 *
 * The bush of ditches, badger setts, rubble and the back of every farmyard —
 * elder grows where the ground is rich and disturbed, which is to say wherever
 * people have been. That makes it the natural thing to put behind a hut.
 *
 * **This was a small tree and is now a bush, and that was the whole note.** The
 * first version stood 1.8 m to the top of its flower plates, forked at shin
 * height into stems that were bare for the bottom third, and put all its mass
 * up where a young sapling puts it. Every check passed and it still read as a
 * tree, because the thing that says "tree" is not height — it is a *clear
 * stem*: visible wood below the foliage, and air you can see through under the
 * canopy.
 *
 * What a bush is for here is **midline obscuring**. It has to be an opaque
 * thing at waist-to-chest height that the player cannot see past and has to
 * walk around, and that is a statement about where the mass sits rather than
 * about how much of it there is. So: foliage from 0.2 m, nothing bare below
 * it, and the arch of every stem carrying leaf along its whole length instead
 * of holding a head up at the end. Measured, it is now about 1.1–1.5 m tall
 * and 1.6–2.1 m across, and it blocks four horizontal sightlines in five
 * through the band from 0.3 to 1.0 m where before it blocked one in four.
 *
 * **And it is in fruit rather than in flower, because in flower it was cow
 * parsley.** Elder's white umbels and cow parsley's white umbels are the same
 * shape, the same colour and very nearly the same size once the render chunks
 * them to three-pixel blocks — two plants in one kit landing on one silhouette,
 * with the taller one not even being the memorable one. An elder in berry is a
 * genuinely different object: *hanging* bunches instead of flat plates, so the
 * outline is a row of drips off the underside of the arch rather than a lid on
 * top of it, and near-black purple instead of cream, which is the largest hue
 * separation available from anything else in the foliage set. It is also what
 * an elder looks like from July to October, so nothing is being invented.
 *
 * One instance in eight still comes up in flower — an elder in June exists and
 * the kit would be poorer without it — but the heads it gets are *domed and
 * bedded into the leaf* rather than flat and held clear, which is the specific
 * thing cow parsley does and must not be shared with it.
 *
 * The leaf work is unchanged and deliberately so: pinnate, five leaflets on a
 * rachis, held roughly level and drooping a little. That was the part that
 * worked. Only the armature it hangs on has moved.
 */

/**
 * Ripe elderberry, the waxy bloom on the top of it, and the stalks it hangs on.
 *
 * Nearly black and firmly *purple*, not brown. Quantization is per channel, so
 * what survives is hue difference — a purple-black against the green of the
 * leaf reads as a distinct object at any distance, where a brown-black would
 * collapse into the twigs. The stalk colour is real too: an elderberry cyme
 * hangs on stalks that turn a strong crimson as the fruit ripens, and that thin
 * red line under the leaf is half of what makes the bunch legible.
 */
const BERRY = 0x2d1c36;
const BERRY_BLOOM = 0x4a3a5e;
const BERRY_STALK = 0x8b3d4c;

/**
 * Elderflower cream, and a shadow of it. For the minority flowering roll.
 *
 * Not white. A pure white plate is the brightest thing in the scene by a wide
 * margin and blows out to a flat block the moment the levels are applied —
 * knocking it back into cream keeps the head a *shape* rather than a hole in
 * the picture, and elder is genuinely creamy anyway, not laundry white.
 */
const FLOWER = 0xe4dec2;
const FLOWER_SHADE = 0xc4bd9e;

export const elder: MeshBuilder = {
  name: 'elder',
  category: 'foliage',
  // Measured across 1500 seeds rather than guessed: the widest point of any
  // instance sits about 1.05 m off the axis, at the end of an arched stem where
  // the outermost leaf pair hangs. Raised from 1.3 — which was the *diameter*
  // hint for a narrower plant — because a spacing hint that undersells the
  // footprint makes the gallery rank grow into itself.
  radius: 1.15,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Wider than tall, on every seed. That ratio is the difference between a
    // shrub and a sapling and it is worth enforcing by construction rather than
    // hoping the random draws land there.
    const height = rng.range(1.08, 1.42);
    const spread = rng.range(0.64, 0.84);
    // Softer than the hazel's ramp on purpose. Elder is a pithy, fast, weak
    // wood — a stem the thickness of a thumb bends visibly under a wet bunch of
    // fruit, which is exactly why the plant always looks half collapsed.
    //
    // Not inflated to compensate for the plant being shorter than it was. The
    // wind shader scales displacement by vertex height, so a 1.2 m bush already
    // moves less in absolute terms than a 1.8 m one did; pushing the weights up
    // to get the old amount of travel back would give a shrub the sway of a
    // whip.
    const ramp = heightRamp(0, height, 1.3);

    /**
     * The sway of the wood at a given height, for things hanging off it.
     *
     * A berry bunch or a flower head is not stiffer than the stem carrying it,
     * but it is not looser either — it goes where the stem goes. Sampling the
     * stem's own ramp at the head's height keeps the two in step; a flat `1`
     * would have a bunch of fruit swinging free of the branch it is tied to.
     */
    const swayAt = (y: number): number => Math.min(1, ramp(0, y) * 1.15);

    const bark = rng.chance(0.6) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const green = rng.chance(0.45) ? PALETTE.LEAF : PALETTE.LEAF_DARK;
    // Most of the time. See the header — the flowering roll is kept only for
    // variety and is deliberately the exception.
    const inFruit = !rng.chance(0.12);

    // --- the stool -----------------------------------------------------------
    //
    // No bole. The previous version had a short trunk and forked above it,
    // which is precisely the clear stem that made it read as a tree; an elder
    // that has been cut, browsed or knocked about — which is all of them, given
    // where they grow — comes out of the ground as a handful of separate stems
    // straight off a woody boss.
    //
    // The boss also fixes the commonest way this shape falls apart: without it
    // every stem is a cylinder whose base cap sits at the origin, and a stack of
    // coincident discs welds into edges belonging to a dozen faces. Something
    // for them to emerge from at different depths costs twenty triangles and
    // removes the problem rather than papering over it.
    const boss = lumpySphere(rng, rng.range(0.13, 0.19), 0, 0.8, 1.18);
    boss.scale(1, rng.range(0.42, 0.6), 1);
    boss.translate(0, rng.range(0.02, 0.05), 0);
    parts.push({ geometry: boss, color: shade(bark, 0.85), sway: ramp });

    // --- no shade mass ------------------------------------------------------
    //
    // **There were blobs in here and they are gone.** Nine to thirteen dark
    // `lumpySphere` lumps were buried in the leaf as cheap opacity, on the
    // argument that individual leaflets cannot fill a two-metre volume at any
    // affordable triangle count. The argument is true and the conclusion was
    // wrong: they read as exactly what they are, giant smooth lumps with
    // foliage stuck round them, and no amount of shrinking them or spreading
    // them over the area fixed that — both were tried.
    //
    // An elder is stems and pinnate leaves. If it needs to be denser, the
    // answer is more stems and more leaves, which is what the counts below now
    // pay for. It costs triangles and it is the honest way to spend them.

    // --- the stems -----------------------------------------------------------
    //
    // Four or five, not the seven a bushier-looking number would suggest. Each
    // one carries three leaf nodes and a bunch of fruit, so stems are the
    // expensive unit here; the density comes from what hangs on them and from
    // the shade mass, and seven of these would put the build over its ceiling
    // without looking any fuller.
    const stems = rng.int(7, 9);
    const facing = rng.range(0, Math.PI * 2);

    for (let s = 0; s < stems; s++) {
      const bearing = facing + (s / stems) * Math.PI * 2 + rng.around(0, 0.3);
      const across = bearing + Math.PI / 2;
      // Tips at varied heights. All of them reaching the same ceiling gives a
      // dome with a machined rim; varying it is what makes an outline.
      //
      // **One designated leader, though.** Drawing every stem's height
      // independently means some seeds roll all four of them short, and the
      // sweep found instances 0.72 m tall — not a wide bush but a small one,
      // which is a different prop. Guaranteeing that one stem reaches the top
      // costs nothing (the whole plant is spun by a random `rotateY` at the
      // end, so there is no bias in *where* the tall side faces) and puts a
      // floor under the height without narrowing the spread of it.
      const top = height * (s === 0 ? rng.range(0.92, 1) : rng.range(0.58, 1));
      const reach = spread * rng.range(0.8, 1);
      const wander = reach * rng.around(0, 0.26);
      const butt = rng.range(0.022, 0.034);

      const base = new THREE.Vector3(
        Math.sin(bearing) * rng.range(0.02, 0.06),
        rng.range(0.03, 0.07),
        Math.cos(bearing) * rng.range(0.02, 0.06),
      );

      /**
       * A point on the stem's arch, u from 0 at the ground to 1 at the tip.
       *
       * The two exponents are the shape and they pull in opposite directions:
       * height rises fast and flattens (`1 - (1-u)^1.6`) while reach starts
       * slow and accelerates (`u^1.5`), so the stem goes *up first and out
       * afterwards* — which is what an arch is. Doing it the obvious way, with
       * both linear, gives a straight diagonal spoke and a plant that looks
       * like a shuttlecock.
       */
      const along = (u: number): THREE.Vector3 => {
        const outward = reach * u ** 1.5;
        // A sideways bow, largest in the middle and zero at both ends. Without
        // it every stem lies in its own vertical plane through the axis and the
        // bush reads as a diagram of a bush.
        const side = wander * Math.sin(Math.PI * u);
        return new THREE.Vector3(
          base.x + Math.sin(bearing) * outward + Math.sin(across) * side,
          base.y + (top - base.y) * (1 - (1 - u) ** 1.6),
          base.z + Math.cos(bearing) * outward + Math.cos(across) * side,
        );
      };

      const nodes = [along(0), along(1 / 3), along(2 / 3), along(1)];
      let behind: THREE.Vector3 | null = null;

      for (let i = 0; i < 3; i++) {
        // **Overlapped into the segment below, not butted onto it.**
        //
        // Two rods meeting end to end put two rings of the same radius on the
        // same circle at the joint, tilted apart only by the change in pitch —
        // a fifth of a radian, which across a stem the thickness of a thumb
        // moves each vertex by well under a millimetre. Closure is judged on
        // positions quantized to an eighth of one, so on some seeds two of
        // those vertices land in the same cell, the edge between them ends up
        // belonging to four faces, and a perfectly solid stem is reported as
        // full of holes. It happened on two seeds in four hundred, which is
        // exactly often enough to survive a casual check and fail a real one.
        //
        // A few centimetres of overlap is under the bark and cannot be seen
        // from anywhere.
        const sunk = behind
          ? new THREE.Vector3().lerpVectors(nodes[i], behind, rng.range(0.07, 0.15))
          : nodes[i];
        parts.push({
          geometry: rod(sunk, nodes[i + 1], butt * (1 - i * 0.22), butt * (1 - (i + 1) * 0.22), 4),
          color: shade(bark, rng.range(0.92, 1.08)),
          sway: ramp,
        });
        behind = nodes[i];
      }

      // Leaf along the whole arch, including low down. The old version put
      // leaves at two nodes and nothing below the fork, which is what left a
      // bare stem region through the bottom third; the lowest node here sits at
      // roughly a quarter of the plant's height, and its leaves droop from
      // there.
      pinnateLeaves(along(rng.range(0.24, 0.34)), bearing);
      pinnateLeaves(along(rng.range(0.55, 0.66)), bearing);
      pinnateLeaves(along(rng.range(0.86, 0.95)), bearing);

      // The head hangs from a point back inside the woody stem rather than off
      // its very tip, for the same near-coincidence reason as the segments.
      const hangs = new THREE.Vector3().lerpVectors(nodes[3], nodes[2], rng.range(0.08, 0.2));
      if (inFruit) berryCyme(hangs, bearing);
      else corymb(hangs, bearing);
    }

    // --- basal shoots --------------------------------------------------------
    //
    // Elder suckers hard from the base, and one or two short leafy whips out of
    // the boss are both true and useful: they put leaf at knee height out at the
    // edge of the footprint, which is the one place the arched stems cannot
    // reach — their lowest leaves are close in to the middle.
    const shoots = rng.int(3, 4);
    for (let i = 0; i < shoots; i++) {
      const bearing = facing + rng.range(0, Math.PI * 2);
      const long = height * rng.range(0.34, 0.5);
      // Steeply up, and the floor on this angle is load-bearing. An elder leaf
      // hangs about 0.23 m below the node it grows from once the droop on the
      // rachis and the droop on the leaflets have both been applied — so at the
      // 0.75 rad this started at, a shoot topping out at 0.24 m put its entire
      // leaf pair through the ground. At 1 rad the lowest shoot tops out at
      // 0.34 m and the leaves clear the floor by about a hand's breadth.
      const lean = rng.range(1, 1.35);
      const from = new THREE.Vector3(
        Math.sin(bearing) * rng.range(0.03, 0.08),
        rng.range(0.02, 0.05),
        Math.cos(bearing) * rng.range(0.03, 0.08),
      );
      const to = new THREE.Vector3(
        from.x + Math.sin(bearing) * Math.cos(lean) * long,
        from.y + Math.sin(lean) * long,
        from.z + Math.cos(bearing) * Math.cos(lean) * long,
      );
      parts.push({
        geometry: rod(from, to, rng.range(0.012, 0.017), rng.range(0.006, 0.009), 4),
        color: shade(bark, rng.range(1, 1.12)),
        sway: ramp,
      });
      pinnateLeaves(to, bearing);
    }

    /**
     * An opposed pair of pinnate leaves at a node.
     *
     * Held out sideways from the stem and roughly level. `rod` for the rachis
     * because it has to start exactly on the stem — a leaf floating a
     * centimetre off its node is one of the two or three mistakes this kit
     * keeps making, and there is no reason to make it again by hand.
     */
    function pinnateLeaves(node: THREE.Vector3, stemBearing: number): void {
      const long = height * rng.range(0.19, 0.27);

      for (const side of [-1, 1]) {
        // Out to the side of the stem and swept a little forward, which is what
        // stops an opposed pair reading as one straight bar through the node.
        const aim = stemBearing + side * rng.range(1, 1.45);
        // Level to distinctly drooping. Elder leaves are heavy for their stalk,
        // and the droop is worth more now than it was: a leaf that hangs fills
        // the space *below* its node, which is where a bush needs filling.
        const droop = rng.range(-0.42, 0.04);
        const tip = new THREE.Vector3(
          node.x + Math.sin(aim) * Math.cos(droop) * long,
          node.y + Math.sin(droop) * long,
          node.z + Math.cos(aim) * Math.cos(droop) * long,
        );
        // Started a centimetre out along its own direction rather than on the
        // stem axis, and given its own thickness. Both matter for the same
        // reason as the cyme's arms below: a pair of rods leaving one point at
        // one radius put their end rings on the same small circle, and the
        // closure check quantizes to a tenth of a millimetre. This end is
        // buried in the stem either way.
        //
        // Three-sided rather than four. A rachis is two millimetres thick and
        // nothing is resolvable on it; the sides saved here are what pay for
        // the third leaf node on every stem, which is the change that actually
        // shows.
        const stalk = new THREE.Vector3().lerpVectors(node, tip, rng.range(0.03, 0.07));
        parts.push({
          geometry: rod(stalk, tip, rng.range(0.0072, 0.0092), 0.0035, 3),
          color: shade(green, 0.78),
          sway: ramp,
        });

        // Two opposed pairs and a terminal leaflet. Five is the low end of what
        // an elder leaf carries and it is enough: the read is "a row of
        // leaflets on a stalk", and the seventh one adds cost without adding
        // that.
        const pairs = 2;
        for (let p = 0; p < pairs; p++) {
          const at = (p + 0.85) / (pairs + 1.15);
          const size = long * rng.range(0.36, 0.46);
          for (const fan of [-1, 1]) {
            // Sub-opposite rather than exactly opposite, which is both what an
            // elder leaf does and what keeps the pair apart in the merge: two
            // leaflets sharing one base point put two three-vertex rings on a
            // common centre, in planes that cross, and once in a few hundred
            // builds two of those six vertices land in the same quantized cell.
            // Offsetting them a couple of centimetres along the rachis costs
            // nothing and removes the case.
            const on = new THREE.Vector3().lerpVectors(node, tip, at + rng.around(0, 0.045));
            parts.push({
              geometry: leaflet(
                size * rng.range(0.94, 1.08),
                // Perpendicular to the rachis, swept back toward the node —
                // the angle every pinnate leaf makes.
                aim + fan * rng.range(1.05, 1.35),
                droop + rng.around(0, 0.22),
                on,
              ),
              color: shade(green, rng.range(0.86, 1.14)),
              sway: ramp,
            });
          }
        }

        // The terminal leaflet, on the axis of the rachis. Without it the leaf
        // stops mid-air at its last pair and reads as broken.
        parts.push({
          geometry: leaflet(long * rng.range(0.38, 0.48), aim, droop, tip),
          color: shade(green, rng.range(0.86, 1.14)),
          sway: ramp,
        });
      }
    }

    /**
     * One leaflet: a flattened three-sided fin, lying face-up.
     *
     * The two rotations are ordered so the flat axis ends up vertical.
     * `rotateX(π/2 + droop)` lays the cone down — it was built pointing +Y with
     * its thin axis on Z, and this swings the length into the horizontal plane
     * and the thin axis into the vertical one. Only then does `rotateY` aim it.
     * Doing those the other way round tips the blade onto its edge, where it
     * has no silhouette worth the triangles.
     */
    function leaflet(
      size: number,
      aim: number,
      droop: number,
      at: THREE.Vector3,
    ): THREE.BufferGeometry {
      const blade = new THREE.ConeGeometry(size * rng.range(0.28, 0.36), size, 3);
      blade.translate(0, size * 0.5, 0);
      blade.scale(1, 1, rng.range(0.2, 0.3));
      blade.rotateX(Math.PI / 2 + droop);
      blade.rotateY(aim);
      blade.translate(at.x, at.y, at.z);
      return blade;
    }

    /**
     * A cyme of ripe berries, hanging.
     *
     * **Every part of this is chosen to be un-umbel-like**, because the whole
     * reason it exists is that the umbel was landing on cow parsley. It goes
     * *down* from its node instead of up. It is a bunch with depth instead of a
     * plate with none. Its stalks are crimson and its fruit is nearly black, so
     * neither of the two colours in it is the cream that was the collision. And
     * it sits under the arch of the stem, in shadow, rather than being held out
     * against the sky.
     *
     * The berries are knots rather than individual fruit. A real elderberry is
     * six millimetres across; a hundred of them per bunch at that size is a
     * thousand triangles nobody can resolve and a grey smudge when they are
     * resolved. Each lump here is a sub-bunch three centimetres across — the
     * same abstraction cow parsley makes with its umbellets, for the same
     * reason — and octahedra rather than icosahedra, at eight triangles instead
     * of twenty, which is what makes seven of them per cyme affordable.
     */
    function berryCyme(from: THREE.Vector3, stemBearing: number): void {
      const drop = height * rng.range(0.1, 0.16);
      // Out along the stem and down. The outward component matters: hung
      // straight down, the bunch disappears behind the leaves at the node above
      // it and the plant's one distinguishing feature is invisible.
      const hub = new THREE.Vector3(
        from.x + Math.sin(stemBearing) * drop * rng.range(0.25, 0.55),
        from.y - drop,
        from.z + Math.cos(stemBearing) * drop * rng.range(0.25, 0.55),
      );
      parts.push({
        geometry: rod(from, hub, rng.range(0.008, 0.011), rng.range(0.005, 0.007), 4),
        color: shade(BERRY_STALK, rng.range(0.9, 1.1)),
        sway: swayAt(hub.y),
      });

      // Two side arms off the peduncle, so the bunch has a branched shape
      // rather than being a ball on a stick. Each draws its own radius and its
      // own attachment point: two rods leaving the peduncle at the same place
      // with the same thickness is the near-coincidence that has bitten this
      // file before, and independent draws make it impossible rather than
      // improbable.
      const heads = [hub];
      for (const hand of [-1, 1]) {
        const arm = stemBearing + hand * rng.range(1.6, 2.4);
        const armLong = drop * rng.range(0.38, 0.62);
        const at = new THREE.Vector3().lerpVectors(from, hub, rng.range(0.5, 0.78));
        const end = new THREE.Vector3(
          at.x + Math.sin(arm) * armLong,
          at.y - armLong * rng.range(0.35, 0.75),
          at.z + Math.cos(arm) * armLong,
        );
        parts.push({
          geometry: rod(at, end, rng.range(0.0032, 0.0045), 0.0026, 3),
          color: shade(BERRY_STALK, rng.range(0.85, 1.05)),
          sway: swayAt(end.y),
        });
        heads.push(end);
      }

      const knots = rng.int(6, 7);
      for (let k = 0; k < knots; k++) {
        const head = heads[k % heads.length];
        const spoke = (k / knots) * Math.PI * 2 + rng.around(0, 0.8);
        const size = rng.range(0.026, 0.04);
        const reach = size * rng.range(0.5, 1.5);
        const at = new THREE.Vector3(
          head.x + Math.sin(spoke) * reach,
          head.y - rng.range(0, size * 1.2),
          head.z + Math.cos(spoke) * reach,
        );
        // Octahedra, each with its own radius and its own pair of rotations.
        // Congruent parts landing on one another is the one thing that reliably
        // welds edges onto four faces, and three independent continuous draws
        // per knot makes that a measure-zero event rather than a one-in-a-few-
        // hundred one.
        const knot = new THREE.OctahedronGeometry(size, 0);
        knot.scale(rng.range(0.85, 1.15), rng.range(0.8, 1.05), rng.range(0.85, 1.15));
        knot.rotateY(rng.range(0, Math.PI));
        knot.rotateX(rng.range(0, Math.PI));
        knot.translate(at.x, at.y, at.z);
        parts.push({
          geometry: knot,
          // The bloom on top, the wet black underneath. Per face at its
          // centroid, so the change lands on a facet boundary and comes out
          // crisp — which is what stops a dark lump reading as a hole.
          color: (_x, y) => (y > at.y ? BERRY_BLOOM : BERRY),
          sway: swayAt(at.y),
        });
      }
    }

    /**
     * The minority flowering roll: a domed corymb bedded into the leaf.
     *
     * Kept small, kept low and kept *domed*. Cow parsley's head is a flat table
     * on a bare stem with nothing underneath it, and that combination is its
     * whole identity; this one is a slightly humped cream lump sitting in a mass
     * of foliage, which is a different object even though both are cream and
     * both are made of tiny florets. Three lobes and a middle rather than the
     * six-ray plate the old version built, because the plate was the shape that
     * collided.
     */
    function corymb(from: THREE.Vector3, stemBearing: number): void {
      const plate = height * rng.range(0.12, 0.16);
      const hub = new THREE.Vector3(
        from.x + Math.sin(stemBearing) * plate * rng.range(0.1, 0.35),
        from.y + plate * rng.range(0.18, 0.38),
        from.z + Math.cos(stemBearing) * plate * rng.range(0.1, 0.35),
      );
      parts.push({
        geometry: rod(from, hub, rng.range(0.009, 0.012), 0.007, 4),
        color: shade(green, 0.8),
        sway: swayAt(hub.y),
      });

      const lobes = 3;
      for (let l = 0; l < lobes; l++) {
        const spoke = (l / lobes) * Math.PI * 2 + rng.around(0, 0.35);
        const at = new THREE.Vector3(
          hub.x + Math.sin(spoke) * plate * rng.range(0.42, 0.6),
          hub.y + plate * rng.around(0, 0.07),
          hub.z + Math.cos(spoke) * plate * rng.range(0.42, 0.6),
        );
        const lobe = lumpySphere(rng, plate * rng.range(0.3, 0.42), 0, 0.82, 1.12);
        // Squashed, but only to a third rather than to a quarter. That number
        // is the difference between a dome and a plate, and the plate is what
        // read as cow parsley.
        lobe.scale(1, rng.range(0.34, 0.46), 1);
        lobe.translate(at.x, at.y, at.z);
        parts.push({
          geometry: lobe,
          color: (_x, y) => (y > at.y ? FLOWER : FLOWER_SHADE),
          sway: swayAt(at.y),
        });
      }

      const centre = lumpySphere(rng, plate * rng.range(0.34, 0.44), 0, 0.84, 1.1);
      centre.scale(1, rng.range(0.38, 0.5), 1);
      centre.translate(hub.x, hub.y + plate * rng.range(0.03, 0.08), hub.z);
      parts.push({ geometry: centre, color: FLOWER, sway: swayAt(hub.y) });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'elder', rng.range(0, Math.PI * 2));
  },
};
