import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * Birch: a white pole with a thin, drooping crown near the top of it.
 *
 * The kit had one tree and every wood built from it was the same wood. Two
 * species is the smallest number that makes a treeline read as a *place* rather
 * than as a repeated asset, and birch is the obvious first one to add because
 * it is the only common tree you can identify from a distance at which you
 * cannot see a single leaf.
 *
 * **Three things carry it, in this order.**
 *
 * 1. *The trunk is white and most of the tree is trunk.* The render pipeline
 *    chunks to three-pixel blocks and quantizes; a pale vertical bar against
 *    dark foliage survives that intact when nothing about a leaf does. The
 *    trunk therefore runs to full height and is bare for the lower half.
 * 2. *It is narrow.* Crown spread is about half the height, where the broad
 *    deciduous next door is nearly as wide as it is tall. Silhouette is the
 *    only channel with any bandwidth left after quantization, and two trees
 *    that differ only in colour are one tree.
 * 3. *The outer twigs hang.* Birch branches climb and their fine ends fall back
 *    down, which is what gives the crown its ragged, weeping top edge. Leave
 *    that out and you have a poplar. Each branch now ends in one or two of
 *    those falling twigs rather than always one, because the crown has to be
 *    **open enough to see sky through**: a birch is the lightest-crowned tree
 *    in the wood, and the way to draw that is many small hanging masses, never
 *    a few big ones.
 *
 * ## Why the bands are geometry rather than a colour ramp
 *
 * The dark lenticel bands are made by **cutting the trunk into segments of
 * unequal length** — long pale ones, short dark ones — instead of colouring a
 * tall cylinder with a function of height. `Part.color` is sampled once per
 * face at its centroid, so on a cylinder with one row of faces up its side the
 * smallest band that can exist is the whole segment. Getting thin bands out of
 * that would mean subdividing the sides, which `rod` cannot do and which would
 * spend four times the triangles to draw a stripe that the chunking is going to
 * flatten to two pixels anyway. Varying the *cut* costs nothing: the segments
 * had to exist regardless.
 *
 * There are roughly three times as many cuts as there were. The first version
 * banded at a flat 30% per segment with every pale run half a metre or more,
 * which gives about three marks up a seven-metre trunk and a spacing regular
 * enough to read as a pattern. Real banding clusters: two or three scars within
 * a hand's width, then a long clean stretch, then nothing for a metre. That is
 * a two-state walk rather than a per-segment coin flip, and it is what the
 * loop below runs — the cluster size is rolled *after* a clean run so that a
 * failed roll gives two clean runs back to back and the gaps vary by more than
 * one draw's worth.
 *
 * Each segment is `rod`ded between two spine points and overrun into the next,
 * because two cylinders meeting at coplanar caps of equal radius put four
 * triangles on the same edge and the watertight check calls that a hole. The
 * overrun used to be a flat percentage of the segment, which was safe at half a
 * metre and is under three millimetres on a four-centimetre scar — so it now
 * has an absolute floor too. More stripes means more joints, and every joint is
 * a chance to open the trunk up.
 */

const TAU = Math.PI * 2;

/**
 * Birch bark's own colours, kept local rather than added to `PALETTE`.
 *
 * Nothing else in the kit is this pale and nothing else wants to be — the
 * palette's job is to hold materials that recur, and "the specific white of one
 * species of tree" is a fact about this builder. `BIRCH_WHITE` is warm rather
 * than neutral so it separates from `STONE_PALE`, which it would otherwise sit
 * almost exactly on top of after quantization.
 */
const BIRCH_WHITE = 0xd7d2c3;
const BIRCH_BAND = 0x3a352d;
/**
 * The fissured black foot an old birch develops. Absent on `small-birch`.
 *
 * Used sparingly, and it was not before. See `foot` below — this colour over a
 * long enough stretch of trunk stops reading as bark at all.
 */
const BIRCH_FOOT = 0x4b463d;

export const birch: MeshBuilder = {
  name: 'birch',
  category: 'foliage',
  // Generous. The crown only reaches about 2.2 m, but `radius` is a spacing
  // hint and a birch planted flush against its own outline looks planted.
  radius: 2.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(6.0, 8.2);
    const butt = rng.range(0.13, 0.19);
    // Bare for the lower half. This is not stylisation — a birch in a wood
    // self-prunes to well above head height, and it is the single measurement
    // that most affects whether the trunk reads at distance.
    const crownBase = height * rng.range(0.5, 0.6);
    // How far up the black rough bark climbs — **a fixed short distance, not a
    // fraction of the height.**
    //
    // It was `height * 0.06..0.13`, which on a tall roll is a metre and a half
    // of unbroken dark at the bottom of a trunk whose entire job is the
    // banding, and at that size it reads as a modelling error rather than as
    // rough bark. A real birch does blacken at the very base, but by a few tens
    // of centimetres, and it does it raggedly. Scaling it with the tree was the
    // mistake: the foot of a birch is where the bark has been rubbed and
    // cracked by things standing at ground level, and the ground is the same
    // height whatever the tree is.
    const foot = rng.range(0.14, 0.38);

    // The lean, as a closed form rather than an accumulated drift, so that a
    // branch attached at any height can be put on the trunk by evaluating it
    // rather than by remembering where the trunk got to. Accumulating was the
    // first version and the branches sat a few centimetres off the bark near
    // the top, which is exactly the failure `rod` exists to stop.
    const bendAt = rng.range(0, TAU);
    const bend = rng.range(0.08, 0.3);
    const spine = (y: number): THREE.Vector3 => {
      const t = y / height;
      // Cubed, so the foot is genuinely vertical and the lean is all in the
      // upper trunk. A birch bends where it is thin.
      const off = bend * t ** 2.4;
      return new THREE.Vector3(Math.cos(bendAt) * off, y, Math.sin(bendAt) * off);
    };

    // Taper, with a small flare in the bottom half-metre. Birch has far less
    // buttressing than a broadleaf and overdoing it here is the quickest way to
    // lose the slenderness the species is for.
    const radiusAt = (y: number): number => {
      const t = y / height;
      const flare = 1 + 0.35 * Math.max(0, 1 - y / 0.55);
      return butt * (1 - 0.72 * t) * flare;
    };

    // --- the trunk -----------------------------------------------------------
    //
    // **The banding is painted per face, not cut per segment.** The previous
    // version built a short rod for every mark and coloured each one whole,
    // which can only ever produce a *ring*: the mark went the entire way round
    // the trunk because the segment did. Forty of those up a pole is a zebra,
    // and no amount of varying their spacing or their darkness fixes it,
    // because the fault is the shape of the mark rather than its placement.
    //
    // Real birch lenticels are **streaks**. Each one is a short horizontal dash
    // that wraps part of the way round and stops; a few run right round, and
    // those are the minority. Getting that needs marks narrower than the trunk
    // is round, which a whole-segment colour cannot express.
    //
    // It can be expressed, and the old header said otherwise — it claimed the
    // smallest possible band on a rod is the whole segment. That is simply
    // untrue: `assemble` evaluates `Part.color` **once per triangle**, at its
    // centroid, so every face around the circumference can take its own colour.
    // The trunk is therefore back to a few long segments, and the marks are a
    // function of where a face sits.
    const streaks: { y: number; phi: number; half: number; tone: number }[] = [];
    {
      let at = foot;
      while (at < height - 0.05) {
        // Denser low down, where a birch carries the scar of every branch it
        // has ever shed. The top of the trunk is the youngest and whitest part
        // of the tree and wants to stay that way.
        const up = at / height;
        const rate = 0.8 - 0.3 * up;
        if (rng.chance(rate)) {
          // How far round it goes, and this distribution is the whole point.
          // Mostly a partial dash; sometimes broad; occasionally a true ring.
          // Weighted toward the long arc rather than the short dash. Measured
          // at the first attempt this ran 80% short, and that reads as flecks
          // rather than as banding — the mark has to travel far enough round
          // to be seen as a *ring with a break in it*, which is what a birch
          // actually has. Roughly a third short, half long, a fifth closing
          // right round.
          const roll = rng();
          const half =
            roll < 0.32
              ? rng.range(0.5, 1.2)
              : roll < 0.8
                ? rng.range(1.2, 2.5)
                : rng.range(Math.PI, Math.PI * 1.25);
          streaks.push({
            y: at,
            phi: rng.range(0, TAU),
            half,
            // Some lenticels are near-black slashes and some are grey smudges.
            // Drawn all at one value they read as printed on.
            tone: rng.range(0.75, 1.4),
          });
        }
        // Clustered rather than evenly spaced: two or three marks within a
        // hand's width, then a long clean stretch. A constant step is a ruler.
        at += rng.chance(0.45) ? rng.range(0.03, 0.09) : rng.range(0.12, 0.5);
      }
    }

    /** Half-height of a mark. Thin — a lenticel is a dash, not a belt. */
    const STREAK_H = 0.026;

    /**
     * Bark colour at a point on the trunk.
     *
     * Angle is measured about the spine at that height rather than about the
     * world axis, so the marks stay put as the trunk leans away rather than
     * sliding round it.
     */
    const bark = (x: number, y: number, z: number): number => {
      if (y < foot) {
        // The foot. Ragged rather than a slab: dark in patches, with pale
        // cracks through it, keyed off position so it is stable per tree.
        const grain = Math.sin(y * 90 + x * 40) * Math.cos(z * 55 + y * 20);
        return grain > -0.15
          ? shade(BIRCH_FOOT, 0.85 + (grain + 1) * 0.2)
          : shade(BIRCH_WHITE, 0.72);
      }
      const axis = spine(y);
      const angle = Math.atan2(z - axis.z, x - axis.x);
      for (const s of streaks) {
        if (Math.abs(y - s.y) > STREAK_H) continue;
        // Shortest way round, so a mark centred near ±π does not break in two.
        let d = Math.abs(angle - s.phi) % TAU;
        if (d > Math.PI) d = TAU - d;
        if (d < s.half) return shade(BIRCH_BAND, s.tone);
      }
      // A few percent either way on the white. One flat colour up a six-sided
      // pole reads as a painted dowel; a little variation reads as weathering.
      return shade(BIRCH_WHITE, 0.94 + Math.sin(y * 31 + x * 17) * 0.06);
    };

    // **One cylinder with a real grid on it, not a stack of rods.**
    //
    // Painting per face only helps if the faces are small enough to paint on.
    // Built as rods the trunk had six sides and 36 cm segments, so the smallest
    // paintable area was a sixty-degree quad a third of a metre tall — and a
    // "streak" came out as one enormous triangle pair down the side of the
    // tree. The mark cannot be finer than the mesh, and the mesh was coarse in
    // both directions at once.
    //
    // So: one closed cylinder, subdivided around *and* up, then bent and
    // tapered by moving its vertices. That gives rows about nine centimetres
    // tall and faces about twenty-six degrees wide, which is fine enough for a
    // band to read as a band and for it to stop part of the way round.
    //
    // A vertical stack of separate rods could not have done this at any
    // subdivision, because each rod needs its own cap rings and an overrun into
    // the next; eighty of them is eighty pairs of caps buried in the trunk.
    // One cylinder has two.
    const RADIAL = 14;
    const rows = Math.max(24, Math.round(height / 0.09));
    const trunk = new THREE.CylinderGeometry(1, 1, height, RADIAL, rows, false);
    trunk.translate(0, height / 2, 0);
    {
      const pos = trunk.getAttribute('position');
      for (let i = 0; i < pos.count; i++) {
        const y = Math.min(height, Math.max(0, pos.getY(i)));
        const axis = spine(y);
        const r = radiusAt(y);
        pos.setXYZ(i, pos.getX(i) * r + axis.x, pos.getY(i), pos.getZ(i) * r + axis.z);
      }
      // Stale after the displacement, and `assemble` only fills them in when
      // they are absent.
      trunk.deleteAttribute('normal');
    }
    parts.push({ geometry: trunk, color: bark, sway: heightRamp(0, height, 2.4) });

    // --- branches and the crown ---------------------------------------------
    //
    // The whole crown is drawn *lighter* than it was: more branches, each
    // carrying one or two thin falling twigs instead of always one, and every
    // leaf clump about a fifth smaller. The old crown had the right shape and
    // was too solid — the sag and the taper were there but the masses hanging
    // off the twigs met each other, and a birch you cannot see sky through is
    // just a narrow tree. Subdividing the same volume of leaf into more, smaller
    // pieces buys the gaps back without changing the outline.
    const branches = rng.int(8, 11);
    const lean = rng.range(0, TAU);
    const leaf = rng.chance(0.3) ? PALETTE.LEAF_DRY : PALETTE.LEAF;

    for (let i = 0; i < branches; i++) {
      const t = branches > 1 ? i / (branches - 1) : 0;
      const at = Math.min(height * 0.985, crownBase + (height - crownBase) * t * rng.range(0.88, 1));
      const root = spine(at);

      // Golden angle. Stepping by a fraction of a turn puts every third or
      // fourth branch on the same side and the crown comes out with flat faces
      // in it; an irrational step never repeats.
      const bearing = lean + i * 2.399963 + rng.around(0, 0.45);
      // Shorter toward the top, which is what tapers the crown instead of
      // leaving it a cylinder — and the falloff is steeper than linear now, so
      // the last third of the crown is genuinely fine rather than merely
      // shorter. A birch does not end in a point so much as thin out of
      // existence.
      const reach = (0.45 + 0.85 * (1 - t) ** 1.2) * rng.range(0.85, 1.12);
      // Steeply up. The droop happens further out, at the twig.
      const rise = rng.range(0.85, 1.2);

      const tip = new THREE.Vector3(
        root.x + Math.cos(bearing) * Math.cos(rise) * reach,
        root.y + Math.sin(rise) * reach,
        root.z + Math.sin(bearing) * Math.cos(rise) * reach,
      );
      parts.push({
        geometry: rod(root, tip, butt * 0.26, butt * 0.15, 4),
        color: shade(BIRCH_WHITE, rng.range(0.72, 0.86)),
        sway: heightRamp(0, height, 1.5),
      });

      // The twigs, and the whole reason this is a birch: out further and
      // *falling*. Everything hanging off them inherits the sag. Half the
      // branches fork into two, which is what a birch actually does and is also
      // the cheapest airiness there is — two thin hanging lines with a gap
      // between them, instead of one thicker one.
      const twigs = rng.chance(0.55) ? 2 : 1;
      for (let w = 0; w < twigs; w++) {
        // The second twig is thrown well off the branch's bearing so a pair
        // reads as a fork rather than as one twig drawn twice.
        const aside = w === 0 ? 0 : rng.chance(0.5) ? 0.8 : -0.8;
        const swing = bearing + rng.around(aside, 0.35);
        // Steeper than it was. The drooping tip is most of what says "birch"
        // at the distance the render pipeline leaves you with, and at the old
        // shallow angles half the twigs were near enough level to read as a
        // hazel's.
        const droop = rng.range(-0.85, -0.35);
        const twigLength = reach * rng.range(0.6, 0.95);
        const end = new THREE.Vector3(
          tip.x + Math.cos(swing) * Math.cos(droop) * twigLength,
          tip.y + Math.sin(droop) * twigLength,
          tip.z + Math.sin(swing) * Math.cos(droop) * twigLength,
        );
        // Started back down the branch rather than at its tip, and a shade
        // fatter, so the twig sleeves over the branch instead of butting onto
        // it. Two rods meeting end to end at the same radius put identical
        // rings in the same place whenever their directions agree closely
        // enough, and four triangles on one edge fails the watertight check. It
        // showed up on `small-birch` seed 16 and on nothing in the first four
        // seeds tried — which is why the sweep runs to fifteen hundred.
        //
        // **The two twigs of a pair must not share a joint either**, for
        // exactly the same reason: same point, same radius, and any seed that
        // happens to line their directions up opens a hole. Each gets its own
        // depth down the branch and its own radius, and both radii still clear
        // the branch's radius where they sit on it (0.170 at a tenth back,
        // 0.172 at a fifth), or the sleeve would be inside out.
        const back = w === 0 ? 0.1 : 0.2;
        const joint = tip.clone().lerp(root, back);
        parts.push({
          geometry: rod(joint, end, butt * (w === 0 ? 0.17 : 0.195), butt * 0.07, 4),
          color: shade(PALETTE.BARK_PALE, rng.range(0.9, 1.1)),
          sway: 0.9,
        });

        // Leaf mass: small clumps strung along the twig, sagging more the
        // further out they are. Not one blob at the end — a birch crown is
        // see-through, and a solid lump per twig closes it up.
        const clumps = rng.int(1, 3);
        for (let c = 0; c < clumps; c++) {
          const u = (c + 1) / clumps;
          const size = rng.range(0.18, 0.3) * (1.15 - 0.4 * t);
          const clump = lumpySphere(rng, size, 0, 0.7, 1.3);
          // Taller than wide. Birch foliage hangs in curtains off the twig
          // rather than sitting on it as a ball.
          clump.scale(0.85, rng.range(1.2, 1.5), 0.85);
          clump.translate(
            tip.x + (end.x - tip.x) * u,
            tip.y + (end.y - tip.y) * u - u * u * rng.range(0.08, 0.2),
            tip.z + (end.z - tip.z) * u,
          );
          parts.push({
            geometry: clump,
            color: rng.chance(0.3) ? PALETTE.LEAF_DARK : shade(leaf, rng.range(0.92, 1.08)),
            sway: rng.range(0.9, 1),
          });
        }
      }
    }

    // The leader. A birch does not stop in a dome, it fades out — two or three
    // small clumps around the top of the trunk, no bigger than the rest.
    const apex = spine(height);
    const leaders = rng.int(2, 3);
    for (let i = 0; i < leaders; i++) {
      const clump = lumpySphere(rng, rng.range(0.16, 0.26), 0, 0.72, 1.28);
      clump.scale(0.85, rng.range(1.15, 1.4), 0.85);
      const a = lean + i * 2.399963;
      const out = rng.range(0.05, 0.28);
      clump.translate(
        apex.x + Math.cos(a) * out,
        apex.y - rng.range(0.05, 0.35),
        apex.z + Math.sin(a) * out,
      );
      parts.push({ geometry: clump, color: shade(leaf, rng.range(0.9, 1.06)), sway: 1 });
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, TAU));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'birch', rng.range(0, TAU));
  },
};
