import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A fern: arched fronds, each one a rib hung with paired leaflets.
 *
 * The plant that makes a wood look like a wood rather than trees on a lawn.
 * Grass covers open ground; this covers *shaded* ground, and the two are almost
 * never in the same place.
 *
 * **A frond is not a blade, and the first version built it as one.** A tapered
 * cone bent over is a leaf — a single continuous shape with a smooth outline —
 * and a fern read as a clump of oversized grass because of it. What actually
 * identifies a fern is that its outline is *serrated*: a bare midrib with rows
 * of small leaflets stepping off it at right angles, so the silhouette has
 * teeth all the way along. That has to be geometry. There are no textures here
 * and no alpha, so a feathered edge is either modelled or absent.
 *
 * Cost is the reason it was avoided and the reason it is affordable now: the
 * ribs are four short segments each, and a leaflet is a three-sided cone
 * flattened to a fin. Seven fronds comes to a few hundred triangles, which is
 * less than the bramble and about the same as a single flower clump.
 */
export const fern: MeshBuilder = {
  name: 'fern',
  category: 'foliage',
  radius: 0.8,
  // Walked through, like the grass. Being stopped by a fern is the fastest way
  // to make a wood feel like a floor with obstacles on it.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // **Wider on both counts.** A rank of these came out as one plant at one
    // size: six to nine fronds is a two-thirds spread at best, and 0.42–0.72
    // means the largest is under twice the smallest — neither is enough to
    // read as variety when eight of them stand side by side.
    //
    // A real stand of ferns is mostly *young* plants with a few big ones over
    // them, so the size roll is skewed rather than flat: squaring a uniform
    // draw puts twice as many at the small end, which is what a colony looks
    // like. The frond count then follows the size, because a small fern is not
    // a big fern shrunk — it is a big fern with fewer fronds on it, and letting
    // the two vary independently is what produced dense little pincushions and
    // sparse giants in the same row.
    const vigour = rng() ** 2;
    const reach = 0.3 + vigour * 0.62;
    const fronds = Math.max(3, Math.round(4 + vigour * 8 + rng.around(0, 1.2)));
    const green = rng.chance(0.4) ? PALETTE.LEAF_DARK : PALETTE.LEAF;

    for (let f = 0; f < fronds; f++) {
      // Bearings spread evenly with jitter rather than drawn at random. A
      // random scatter of eight leaves a bare sector on nearly every instance,
      // and a fern with a gap in it reads as damaged rather than as a fern.
      const bearing = (f / fronds) * Math.PI * 2 + rng.range(-0.22, 0.22);
      const grown = reach * rng.range(0.72, 1.15);
      const segments = 4;
      const step = grown / segments;

      // Leaves the crown steeply and rolls over to level or below. The arch is
      // what a fern is: straight fronds are a palm and flat ones are a weed.
      let pitch = rng.range(1.1, 1.45);
      let x = 0;
      let y = rng.range(0.02, 0.08);
      let z = 0;

      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        // The rib. Thin, and it barely shows — its job is to be the line the
        // leaflets hang off, and a thick one turns the frond into a branch.
        const rib = new THREE.CylinderGeometry(0.006, 0.009, step * 1.1, 4);
        rib.translate(0, step / 2, 0);
        rib.rotateX(Math.PI / 2 - pitch);
        rib.rotateY(bearing);
        rib.translate(x, y, z);
        parts.push({ geometry: rib, color: shade(green, 0.82), sway: t ** 1.2 });

        // Leaflets in opposed pairs along this segment, standing out sideways
        // from the rib and swept back toward the tip. Longest near the base of
        // the frond and shortest at the end, which is what tapers the outline.
        const pairs = 3;
        for (let p = 0; p < pairs; p++) {
          const along = (p + 0.5) / pairs;
          const at = t + along / segments;
          const leaf = grown * 0.2 * (1 - at * 0.75);
          if (leaf < 0.012) continue;

          // Where along this segment the pair sits, taken from the rotation the
          // rib actually got rather than worked out separately.
          const out = Math.cos(pitch) * step * along;
          const lx = x + Math.sin(bearing) * out;
          const ly = y + Math.sin(pitch) * step * along;
          const lz = z + Math.cos(bearing) * out;

          for (const side of [-1, 1]) {
            // A per-leaflet size, so no two are congruent. Identical parts
            // merged into one mesh occasionally land exactly on each other, and
            // two coincident faces z-fight forever.
            const long = leaf * rng.range(0.88, 1.12);
            const pinna = new THREE.ConeGeometry(long * 0.3, long, 3);
            pinna.translate(0, long * 0.5, 0);
            // Flattened into a fin. A round leaflet is a bud.
            pinna.scale(1, 1, 0.22);
            // Out to the side of the rib, and swept back along it.
            pinna.rotateZ(side * rng.range(1.2, 1.45));
            pinna.rotateY(bearing + side * rng.range(0.1, 0.35));
            pinna.translate(lx, ly, lz);
            parts.push({ geometry: pinna, color: shade(green, rng.range(0.9, 1.14)), sway: at ** 1.2 });
          }
        }

        // Advance to the end of the segment just placed, and roll the pitch
        // over for the next one.
        const out = Math.cos(pitch) * step;
        x += Math.sin(bearing) * out;
        y += Math.sin(pitch) * step;
        z += Math.cos(bearing) * out;
        pitch -= rng.range(0.3, 0.5);
      }
    }

    // A knot of tight new growth at the middle, so the centre is not a hole the
    // fronds radiate out of. Real ferns unroll from exactly this.
    const crown = new THREE.IcosahedronGeometry(reach * 0.1, 0);
    crown.scale(1, 1.5, 1);
    crown.translate(0, reach * 0.1, 0);
    parts.push({ geometry: crown, color: shade(green, 0.75), sway: 0.3 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'fern', rng.range(0, Math.PI * 2));
  },
};
