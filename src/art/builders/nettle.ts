import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { shade } from '../palette';

/**
 * A stand of nettles: straight stems in opposed leaf pairs.
 *
 * Ubiquitous wherever ground has been disturbed and left — hedge banks, the
 * back of a barn, the edge of a midden. Nettles growing somewhere say that
 * people were there and are not there now, which is a useful thing for a set of
 * ruins or an abandoned yard to be able to say without a note.
 *
 * **Upright and regular is the silhouette**, which is unusual here — nearly
 * every other plant in the kit is identified by how it *leans*. A nettle stand
 * is a set of near-vertical stalks of roughly equal height with leaves in
 * matched pairs at regular intervals up them, and that mechanical repetition is
 * exactly what tells it apart from a wildflower clump at ten metres.
 */
export const nettle: MeshBuilder = {
  name: 'nettle',
  category: 'foliage',
  radius: 0.6,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Half what it was. A nettle bed *is* dense, but a clump built at real
    // density is a solid green mass with no stalks visible in it — and the
    // upright repeating stems are the entire silhouette. Density here has to be
    // made by placing several clumps, not by thickening one.
    const stalks = rng.int(4, 8);
    const spread = rng.range(0.26, 0.42);
    const green = rng.chance(0.5) ? 0x46603a : 0x3d5533;

    for (let s = 0; s < stalks; s++) {
      const at = rng.range(0, Math.PI * 2);
      const away = Math.sqrt(rng()) * spread;
      const ox = Math.cos(at) * away;
      const oz = Math.sin(at) * away;

      // Tight height range, unlike the flowers. A nettle bed comes up all at
      // once and stands level; a ragged one reads as weeds in general.
      const height = rng.range(0.62, 1.05) * (1 - (away / spread) * 0.18);
      const lean = rng.range(0, 0.09);
      const leanAt = rng.range(0, Math.PI * 2);

      const thick = rng.range(0.0055, 0.0095);
      const stem = new THREE.CylinderGeometry(thick * 0.7, thick, height, 4);
      stem.translate(0, height / 2, 0);
      stem.rotateX(Math.cos(leanAt) * lean);
      stem.rotateZ(Math.sin(leanAt) * lean);
      stem.translate(ox, 0, oz);
      parts.push({
        geometry: stem,
        color: shade(green, 0.85),
        sway: (_x, y) => Math.max(0, y / height) ** 1.4,
      });

      // Leaves in opposed pairs, each pair turned a quarter from the one below
      // — which is how they actually grow, and it is what stops the stalk
      // reading as a flat cut-out from the side.
      const tiers = 2 + Math.floor(height * 2);
      for (let t = 1; t <= tiers; t++) {
        const up = (t / (tiers + 0.6)) * height;
        // **Shrinking hard toward the top.** This taper was 0.35, so the
        // topmost leaves were still two thirds the size of the bottom ones and
        // the stalk read as a ladder of near-identical pairs. A real nettle
        // grades steeply — big coarse leaves at the base, and by the growing
        // tip they are barely more than bracts. Steeper here also gives the
        // plant a *point*, which is most of what says nettle in a silhouette.
        const tier = height * rng.range(0.1, 0.16) * (1 - (t / tiers) * 0.72);
        for (const side of [-1, 1]) {
          // A per-leaf size rather than a per-pair one. Two blades built to
          // identical dimensions and merged occasionally land exactly on each
          // other, and two coincident faces z-fight against themselves forever
          // — a few percent of variation makes the collision impossible rather
          // than merely unlikely. The flowers hit the same thing.
          const size = tier * rng.range(0.9, 1.1);
          const blade = new THREE.ConeGeometry(size * 0.5, size * 1.7, 3);
          blade.translate(0, size * 0.85, 0);
          blade.scale(1, 1, 0.3);
          // Out and slightly down, which is the nettle's droop.
          blade.rotateZ(side * rng.range(1.15, 1.5));
          blade.rotateY(t * (Math.PI / 2) + rng.around(0, 0.2));
          blade.translate(ox, up, oz);
          parts.push({
            geometry: blade,
            color: shade(green, rng.range(0.92, 1.12)),
            sway: Math.max(0, up / height) ** 1.4,
          });
        }
      }

      // --- the crown ----------------------------------------------------------
      //
      // A tight rosette of very small leaves at the growing tip. A nettle does
      // not simply stop at its last full-sized pair — the shoot finishes in a
      // knot of half-made leaves crowded together, and that little dark cluster
      // is the top of the plant's silhouette. Without it the stalk ends on a
      // pair of leaves and a bare centimetre of stem, which reads as cut.
      const crown = rng.int(3, 5);
      for (let c = 0; c < crown; c++) {
        const size = height * rng.range(0.022, 0.04);
        const blade = new THREE.ConeGeometry(size * 0.5, size * 1.6, 3);
        blade.translate(0, size * 0.8, 0);
        blade.scale(1, 1, 0.3);
        // Steeply up and barely out — the tip leaves are still folded against
        // the shoot rather than opened away from it.
        blade.rotateZ(rng.range(0.25, 0.6));
        blade.rotateY(c * 2.399963 + rng.around(0, 0.4));
        // Each to its own height in the last few centimetres, so the cluster is
        // a spiral rather than a whorl and no two share a base point.
        blade.translate(ox, height * (0.9 + c * 0.022), oz);
        parts.push({
          geometry: blade,
          // Paler and yellower than the mature leaf. New growth on a nettle is
          // visibly lighter, and it lifts the tip out of the mass below it.
          color: shade(green, rng.range(1.1, 1.25)),
          sway: 1,
        });
      }

      // The flower spikes: thin trails hanging where the top leaves join. Dull
      // and pale, and the one part anybody could name.
      if (rng.chance(0.6)) {
        for (const side of [-1, 1]) {
          // Every dimension rolled per spike. A square-section prism rotated by
          // ±0.8 rad differs from its opposite number by 1.6 — which is within
          // two hundredths of the π/2 that would make the two *identical*, and
          // at these sizes that lands inside the tolerance any weld or test
          // uses. Near-degenerate coincidences are worth designing out rather
          // than relying on the numbers to miss.
          const spike = new THREE.CylinderGeometry(
            rng.range(0.0035, 0.0048),
            rng.range(0.007, 0.0092),
            height * rng.range(0.14, 0.19),
            4,
          );
          spike.translate(0, -height * 0.08, 0);
          spike.rotateZ(side * rng.range(0.66, 0.94));
          spike.translate(ox, height * 0.86, oz);
          parts.push({ geometry: spike, color: 0xa8a882, sway: 0.9 });
        }
      }
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'nettle', rng.range(0, Math.PI * 2));
  },
};
