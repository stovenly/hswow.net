import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

// Hazel: a low broad thicket of splayed rods, leafy from the ground up. No clear
// stem — these bushes exist to obscure the midline, so foliage starts about 0.2 m
// and the plant is wider than tall. The rods' tips lean out about eight tenths of
// their height, the side shoots run the whole length of every rod, and there is a
// shade mass inside. A hazel leaf is a soft disc with a heart-shaped base, not the
// flattened three-sided fin every other leaf in the kit uses.
export const hazel: MeshBuilder = {
  name: 'hazel',
  category: 'foliage',
  // The plant reaches about 1.2 m off its axis at the end of the longest rod, and a
  // spacing hint that undersells the footprint makes a gallery rank grow into itself.
  radius: 1.2,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Wider than tall by construction rather than by luck. `spread` is how far
    // the rod *tips* lean out; the twigs and leaves on them add another twenty
    // centimetres or so beyond that.
    const height = rng.range(1.08, 1.45);
    const spread = rng.range(0.62, 0.82);
    // Woody and rooted hard: a coppice stool is a solid lump of old wood and the
    // poles pivot out of it rather than the whole plant leaning. A steeper curve
    // than the tree's, because these stems are shorter and stiffer for their length.
    const ramp = heightRamp(0, height, 1.9);

    // Hazel bark is smooth and coppery with pale lenticels across it — nearer
    // the pale end of the kit's wood than an oak's would be.
    const bark = rng.chance(0.65) ? PALETTE.BARK_PALE : PALETTE.BARK;
    const leaf = rng.chance(0.3) ? PALETTE.LEAF_DARK : PALETTE.LEAF;

    // --- the stool -----------------------------------------------------------
    // Also what stops every pole's base cap sitting at the origin: a stack of
    // coincident discs welds into edges belonging to a dozen faces, and a lump for
    // them to come out of at different depths costs twenty triangles.
    const stool = lumpySphere(rng, rng.range(0.14, 0.2), 0, 0.76, 1.2);
    stool.scale(1, rng.range(0.45, 0.62), 1);
    stool.translate(0, rng.range(0.02, 0.05), 0);
    parts.push({ geometry: stool, color: shade(PALETTE.BARK, 0.85), sway: ramp });

    // No shade mass. A hazel is poles and round leaves, and dark lumps buried in
    // the foliage read as exactly what they are — smooth blobs with leaves stuck
    // round them. Density is paid for in leaves below.

    // --- the poles -----------------------------------------------------------
    // A coppice stool throws its rods outward, not upward: the tips lean out about
    // as far as they rise, so the plant is wider than tall and there is leaf over
    // the flanks rather than only on a crown.
    const poles = rng.int(7, 10);
    const first = rng.range(0, Math.PI * 2);
    for (let i = 0; i < poles; i++) {
      const bearing = first + (i / poles) * Math.PI * 2 + rng.around(0, 0.36);
      const tall = height * rng.range(0.74, 1);
      const out = spread * rng.range(0.66, 1);
      const butt = height * rng.range(0.026, 0.04);
      // Off the axis by a little, and each to its own depth. Rods all rising from
      // one point stack their base caps into an edge belonging to a dozen faces.
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
        // The whole length, not the upper half: a side shoot at a fifth of the way
        // up puts leaf at knee height, which is the height that matters.
        const at = rng.range(0.16, 0.95);
        const from = along(at);
        const long = height * rng.range(0.1, 0.18);
        // Outward, and level to steeply up. Always climbing piles every leaf above
        // its own twig and leaves the flanks bare; letting the low ones droop is
        // what closes the sides of the plant.
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
     * A rosette of round leaves about a point. Clusters rather than individual
     * leaves, and the reason is the render: at three-pixel blocks a single
     * seven-centimetre leaf is smaller than one block and contributes nothing but
     * cost, where a hand-sized mass is a shape the quantizer can resolve. Two or
     * three blades, about twice life size — a leaf drawn true here is absent.
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
