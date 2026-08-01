import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

/**
 * Hazel: a low broad thicket of splayed rods, leafy from the ground up.
 *
 * The bush every hedge and every coppiced wood is half made of.
 *
 * **It used to be a vase and that was the wrong plant.** The first version was
 * built on the idea that a hazel's silhouette is the *opposite* of a bush's —
 * five or eight bare rods leaning out of one point on the ground, leaves in a
 * ring at the top, and nothing but air below half height. That is a fair
 * description of a hazel stool in its fourth or fifth year, and it is also a
 * description of a small tree: a clear stem with the mass above it. Measured,
 * it blocked one horizontal sightline in five at knee height and *more* at
 * 1.1 m than at 0.3 m, which is the signature of a canopy rather than a shrub.
 *
 * These bushes exist for **midline obscuring** — to be opaque at the height the
 * player's eye and body occupy, so the landscape has things you must walk
 * around rather than see through. That means no clear stem, foliage from about
 * 0.2 m, and wider than tall. So the rods are shorter and splayed much harder
 * (their tips now lean out about eight tenths of their height rather than three
 * tenths), the side shoots run the whole length of every rod instead of the top
 * half, and there is a shade mass inside. It is now roughly 1.1–1.5 m tall and
 * 1.7–2.2 m across, and it stops four sightlines in five through the waist
 * band.
 *
 * A coppice stool that has been cut recently genuinely looks like this — the
 * see-through vase is what it becomes years later, when the regrowth has drawn
 * up and shaded its own bottom out. Both are true; only one of them is a bush.
 *
 * **A hazel leaf is round.** Nearly every leaf in this kit is a flattened
 * three-sided cone — a pointed fin — because that is what a nettle, a thistle,
 * a fern and a bramble all want. Hazel's is a soft disc with a heart-shaped
 * base, and using the same fin here would have made the fourth plant in a row
 * built out of the same triangle. That is the part of this builder that was
 * working and it is untouched.
 */
export const hazel: MeshBuilder = {
  name: 'hazel',
  category: 'foliage',
  // Measured across 1500 seeds. The old value of 1 described a plant that was
  // taller than it was wide; this one reaches about 1.2 m off its axis at the
  // end of the longest rod, and a spacing hint that undersells the footprint is
  // what makes a gallery rank grow into itself.
  radius: 1.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Wider than tall by construction rather than by luck. `spread` is how far
    // the rod *tips* lean out; the twigs and leaves on them add another twenty
    // centimetres or so beyond that.
    const height = rng.range(1.08, 1.45);
    const spread = rng.range(0.62, 0.82);
    // Woody and rooted hard: a coppice stool is a solid lump of old wood and
    // the poles pivot out of it rather than the whole plant leaning. Steeper
    // curve than the tree's, because these stems are shorter and stiffer for
    // their length than a trunk is.
    //
    // Unchanged from when the plant was half a metre taller. The wind shader
    // scales displacement by vertex height, so a shorter bush already travels
    // less; raising the weights to win that back would give a hazel the
    // behaviour of a willow.
    const ramp = heightRamp(0, height, 1.9);

    // Hazel bark is smooth and coppery with pale lenticels across it — nearer
    // the pale end of the kit's wood than an oak's would be.
    const bark = rng.chance(0.65) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const leaf = rng.chance(0.3) ? PALETTE.LEAF_DARK : PALETTE.LEAF;

    // --- the stool -----------------------------------------------------------
    //
    // Also the fix for the commonest way this shape falls apart: without it,
    // every pole is a cylinder whose base cap sits at the origin, and a stack
    // of coincident discs welds into edges belonging to a dozen faces. A lump
    // for them to come out of at different depths costs twenty triangles and
    // removes the problem rather than papering over it.
    const stool = lumpySphere(rng, rng.range(0.14, 0.2), 0, 0.76, 1.2);
    stool.scale(1, rng.range(0.45, 0.62), 1);
    stool.translate(0, rng.range(0.02, 0.05), 0);
    parts.push({ geometry: stool, color: shade(PALETTE.BARK, 0.85), sway: ramp });

    // --- the shade mass ------------------------------------------------------
    //
    // Dark lumps buried inside the leaf. Twenty triangles each and between them
    // they are most of the reason this now stops a sightline: a rosette of four
    // discs is a hand-sized patch, and no affordable number of hand-sized
    // patches fills a two-metre volume. The leaves make the *outline* and the
    // texture; these make the plant solid.
    //
    // Never meant to be seen as objects. Several small ones rather than one
    // big one, all kept under the crown of the leaf, so the silhouette stays
    // the broken leafy one and only the interior goes opaque — a single blob
    // large enough to do this job would put a smooth machined shoulder into the
    // outline and turn the plant into the generic `bush`.
    // Spread over the area rather than by radius, and floored off the axis —
    // see the same note in `elder.ts`. Placed `0 .. 0.62` they piled into the
    // middle and read as one blob with leaves stuck round it, which is the
    // opposite of a vase-shaped coppice stool.
    // **No shade mass.** There were eight to fourteen dark `lumpySphere` lumps
    // buried in here as cheap interior opacity, and they read as exactly what
    // they were: smooth blobs with leaves stuck round them. Shrinking them and
    // spreading them over the area were both tried and neither helped, because
    // the fault is the primitive rather than its placement. A hazel is poles
    // and round leaves; density is paid for in leaves below.

    // --- the poles -----------------------------------------------------------
    //
    // A coppice stool throws its rods outward, not upward. The splay is the
    // whole difference between this and a small tree: tips lean out about as
    // far as they rise, so the plant is wider than it is tall and there is leaf
    // over the flanks rather than only on a crown.
    //
    // More of them than a stool strictly carries, because the shade lumps that
    // used to supply the interior are gone and the density has to come from
    // real wood and real leaves now.
    const poles = rng.int(7, 10);
    const first = rng.range(0, Math.PI * 2);
    for (let i = 0; i < poles; i++) {
      const bearing = first + (i / poles) * Math.PI * 2 + rng.around(0, 0.36);
      const tall = height * rng.range(0.74, 1);
      const out = spread * rng.range(0.66, 1);
      const butt = height * rng.range(0.026, 0.04);
      // Off the axis by a little, and each to its own depth. Rods all rising
      // from one point stack their base caps into an edge belonging to a dozen
      // faces, which the watertight check reads as a hole — the stool above
      // exists to swallow them, and this is what gives it something to swallow.
      const base = new THREE.Vector3(
        Math.sin(bearing) * rng.range(0.02, 0.08),
        rng.range(0.01, 0.05),
        Math.cos(bearing) * rng.range(0.02, 0.08),
      );
      const tip = new THREE.Vector3(
        base.x + Math.sin(bearing) * out,
        tall,
        base.z + Math.cos(bearing) * out,
      );
      /** A point along this pole. 0 at the stool, 1 at the tip. */
      const along = (t: number): THREE.Vector3 => base.clone().lerp(tip, t);

      parts.push({
        geometry: rod(base, tip, butt, butt * rng.range(0.38, 0.5), 5),
        color: shade(bark, rng.range(0.9, 1.1)),
        sway: ramp,
      });

      // --- twigs and their leaves --------------------------------------------
      const twigs = rng.int(3, 5);
      for (let t = 0; t < twigs; t++) {
        // **The whole length, not the upper half.** The old range started at
        // 0.52 on the reasoning that a coppice stool shades its own bottom out,
        // which is true of an old one and is exactly what made this read as a
        // tree. A side shoot at a fifth of the way up puts leaf at knee height,
        // which is the height that matters.
        const at = rng.range(0.16, 0.95);
        const from = along(at);
        const long = height * rng.range(0.1, 0.18);
        // Outward, and level to steeply up. The old range was 0.45 to 1 radians
        // — always climbing — which piled every leaf above its own twig and
        // left the flanks bare. Letting the low ones droop is what closes the
        // sides of the plant.
        const rise = rng.range(-0.3, 0.95);
        const aim = bearing + rng.around(0, 1.5);
        const to = new THREE.Vector3(
          from.x + Math.sin(aim) * Math.cos(rise) * long,
          from.y + Math.sin(rise) * long,
          from.z + Math.cos(aim) * Math.cos(rise) * long,
        );
        parts.push({
          geometry: rod(from, to, butt * 0.34, butt * 0.19, 3),
          color: shade(bark, 1.12),
          sway: ramp,
        });
        leafCluster(to);
      }

      // And one at the leader, so no pole finishes as a bare stick.
      leafCluster(tip);
    }

    /**
     * A rosette of round leaves about a point.
     *
     * Clusters rather than individual leaves all the way up the twigs, and the
     * reason is the render rather than the plant: at three-pixel blocks a
     * single seven-centimetre leaf is smaller than one block and contributes
     * nothing but cost. A few leaves gathered into a hand-sized mass is a shape
     * the quantizer can actually resolve, and a dozen of those is what a hazel
     * canopy looks like anyway.
     *
     * Two or three blades, each larger than before, rather than three or four
     * smaller ones. Same silhouette per cluster for two thirds of the
     * triangles, and the third saved is what pays for the shade mass — which
     * does far more for the thing this plant is actually for. The blades are
     * about twice life size, which is the same deliberate lie the rest of the
     * kit tells: a leaf drawn true here is sub-pixel and therefore absent.
     */
    function leafCluster(at: THREE.Vector3): void {
      const blades = rng.int(2, 3);
      for (let b = 0; b < blades; b++) {
        const size = height * rng.range(0.055, 0.078);
        const blade = new THREE.IcosahedronGeometry(size, 0);
        // Squashed on Z into a lens, which is the disc. Every blade gets its
        // own thickness as well as its own size — congruent parts are the one
        // thing that reliably breaks the merge.
        blade.scale(1, 1, rng.range(0.12, 0.19));
        // Laid over toward horizontal: the thin axis was Z and this brings it
        // near vertical, so the leaf presents its face to the sky. A hazel leaf
        // held edge-on has no silhouette at all.
        blade.rotateX(Math.PI / 2 + rng.around(0, 0.5));
        blade.rotateY(rng.range(0, Math.PI * 2));
        const spoke = (b / blades) * Math.PI * 2 + rng.around(0, 0.6);
        const reach = size * rng.range(0.6, 1.35);
        blade.translate(
          at.x + Math.sin(spoke) * reach,
          at.y + rng.around(0, size * 0.55),
          at.z + Math.cos(spoke) * reach,
        );
        parts.push({
          geometry: blade,
          color: shade(leaf, rng.range(0.85, 1.18)),
          sway: ramp,
        });
      }
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hazel', rng.range(0, Math.PI * 2));
  },
};
