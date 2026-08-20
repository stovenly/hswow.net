import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

// Birch: a white pole with a thin, drooping crown near the top of it. The trunk
// runs to full height and is bare for the lower half; the crown spreads about half
// the height; the outer twigs hang. The dark bands are cuts in the trunk rather
// than a colour ramp, because `Part.color` is sampled once per face and a band
// cannot be finer than a segment. Each segment overruns into the next, with an
// absolute floor on the overrun as well as a proportional one.

const TAU = Math.PI * 2;

/**
 * Birch bark's own colours, kept local rather than added to `PALETTE`: the
 * specific white of one species is a fact about this builder. Warm rather than
 * neutral, so it separates from `STONE_PALE` after quantization.
 */
const BIRCH_WHITE = 0xd7d2c3;
const BIRCH_BAND = 0x3a352d;
/** The fissured black foot an old birch develops. Absent on `small-birch`, and used sparingly — over a long stretch it stops reading as bark at all. */
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
    // A fixed short distance, not a fraction of the height: the foot of a birch is
    // where the bark has been rubbed and cracked by things standing at ground
    // level, and the ground is the same height whatever the tree is.
    const foot = rng.range(0.14, 0.38);

    // The lean as a closed form rather than an accumulated drift, so a branch
    // attached at any height is put on the trunk by evaluating it.
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
    // The banding is painted per face, not cut per segment. `assemble` evaluates
    // `Part.color` once per triangle at its centroid, so every face around the
    // circumference takes its own colour — which is what lets a lenticel be a short
    // horizontal dash that wraps part of the way round and stops, rather than a
    // ring going the whole way because the segment did.
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
          // How far round it goes: roughly a third short, half long, a fifth closing
          // right round. Weighted toward the long arc, because a mark has to travel
          // far enough to read as a ring with a break in it rather than as a fleck.
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

    /** Bark colour at a point on the trunk. Angle is measured about the spine at that height rather than the world axis, so marks stay put as the trunk leans. */
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

    // One closed cylinder with a real grid on it, subdivided around and up, then
    // bent and tapered by moving its vertices — rows about nine centimetres tall and
    // faces about twenty-six degrees wide. A mark cannot be finer than the mesh, and
    // a stack of rods is coarse in both directions and buries cap rings at every
    // joint; one cylinder has two.
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
    // Many branches, each carrying one or two thin falling twigs, and small leaf
    // clumps: a birch you cannot see sky through is just a narrow tree, and
    // subdividing the same volume of leaf buys the gaps back without changing the
    // outline.
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
      // Shorter toward the top, falling off steeper than linear, so the last third
      // of the crown is genuinely fine. A birch thins out of existence.
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

      // The twigs, and the whole reason this is a birch: out further and falling.
      // Half the branches fork into two, which is the cheapest airiness there is.
      const twigs = rng.chance(0.55) ? 2 : 1;
      for (let w = 0; w < twigs; w++) {
        // The second twig is thrown well off the branch's bearing so a pair
        // reads as a fork rather than as one twig drawn twice.
        const aside = w === 0 ? 0 : rng.chance(0.5) ? 0.8 : -0.8;
        const swing = bearing + rng.around(aside, 0.35);
        // Steep. The drooping tip is most of what says birch at the distance the
        // pipeline leaves you with; near-level twigs read as a hazel's.
        const droop = rng.range(-0.85, -0.35);
        const twigLength = reach * rng.range(0.6, 0.95);
        const end = new THREE.Vector3(
          tip.x + Math.cos(swing) * Math.cos(droop) * twigLength,
          tip.y + Math.sin(droop) * twigLength,
          tip.z + Math.sin(swing) * Math.cos(droop) * twigLength,
        );
        // Started back down the branch and a shade fatter, so the twig sleeves over
        // it rather than butting on: two rods meeting end to end at the same radius
        // put identical rings in the same place whenever their directions agree. The
        // two twigs of a pair must not share a joint either, so each gets its own
        // depth and radius, both still clearing the branch where they sit.
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
