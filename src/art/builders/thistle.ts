import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';
import { rod } from '../rod';

// Thistle: a bristled globe on a spiked collar, and the only flower here with no
// petals at all. A brush on an egg — the magenta tuft alone is a dandelion clock
// and the green bulb alone is a bud. It is taut: the bracts lie back along the
// bulb under tension and the florets leave it in a tight upward bundle that frays
// only at the top.
function thistleHead({ axis, height, rng }: HeadContext): Part[] {
  const parts: Part[] = [];

  // --- the leaves ----------------------------------------------------------
  // Pinnate, like a fern's fronds, not simple like a nettle's: a thistle's leaf is
  // a long midrib with deep lobes cut nearly to it, each ending in a spine, and it
  // clasps the stem rather than standing off on a stalk. So this builder supplies
  // its own and the species table sets `leaves: 0`.
  //
  // All the way up the stem, and running down it between the tiers as spined wings,
  // so no length of it is unarmed — that continuous cover is most of why the plant
  // reads as dangerous rather than as a flower on a stick.
  const tiers = rng.int(4, 7);
  for (let tier = 0; tier < tiers; tier++) {
    // From just above the ground to just under the head.
    const t = 0.1 + (tier / (tiers - 1)) * 0.78;
    const root = axis(t);
    // Longest at the base and shrinking steadily upward, which is what stops
    // an evenly leafed stem reading as a bottlebrush.
    const long = height * rng.range(0.2, 0.34) * (1 - t * 0.55);
    const bearing = rng.range(0, Math.PI * 2) + tier * 1.9;

    for (const side of [-1, 1]) {
      // The midrib, arching out and down — a thistle leaf droops under its own
      // length, which is what stops the plant reading as a bottle brush.
      const out = long * rng.range(0.85, 1.05);
      const tip = new THREE.Vector3(
        root.x + Math.sin(bearing) * out * side,
        root.y - out * rng.range(0.25, 0.5),
        root.z + Math.cos(bearing) * out * side,
      );
      parts.push({ geometry: rod(root, tip, 0.008, 0.003), color: 0x67794a, sway: t });

      // Lobes along it, in pairs, each a flattened fin ending in a point.
      // Largest in the middle of the leaf and shrinking to the tip, which is
      // the shape of every pinnate leaf there is.
      const lobes = rng.int(3, 5);
      for (let i = 0; i < lobes; i++) {
        const along = (i + 0.6) / (lobes + 0.4);
        const on = new THREE.Vector3().lerpVectors(root, tip, along);
        const size = long * 0.3 * (1 - Math.abs(along - 0.4) * 0.9);

        for (const fan of [-1, 1]) {
          const lobe = new THREE.ConeGeometry(size * rng.range(0.3, 0.42), size * 1.4, 3);
          lobe.translate(0, size * 0.7, 0);
          lobe.scale(1, 1, 0.28);
          // Out to the side of the rib and swept back toward the tip, the same
          // arrangement the fern's pinnae use.
          lobe.rotateZ(fan * rng.range(1.05, 1.4));
          lobe.rotateY(bearing * side + fan * rng.range(0.2, 0.5));
          lobe.translate(on.x, on.y, on.z);
          parts.push({
            geometry: lobe,
            // Pale along the midrib, which is the one marking on a thistle
            // leaf anybody would notice.
            color: rng.chance(0.25) ? 0x8b9a6a : 0x5f7a3a,
            sway: t,
          });
        }
      }
    }
  }

  const at = axis(1);
  const size = height * rng.range(0.055, 0.085);

  // --- the involucre -------------------------------------------------------
  // An egg, not a cup. A spear thistle's base is a taut ovoid a good deal taller
  // than it is wide, and it is the proportion that makes it look like it is under
  // pressure from the bud inside.
  const bulb = new THREE.IcosahedronGeometry(size * 0.72, 1);
  bulb.scale(0.86, 1.25, 0.86);
  bulb.translate(at.x, at.y + size * 0.85, at.z);
  parts.push({ geometry: bulb, color: 0x5f7a3a, sway: 1 });

  // The collar of a head that has opened: the top ring of bracts pushed back and
  // outward by the florets coming through, so the head widens sharply right where
  // the colour starts. That step is visible much further away than the florets.
  const collar = 9;
  for (let i = 0; i < collar; i++) {
    const a = (i / collar) * Math.PI * 2 + rng.around(0, 0.2);
    const long = size * rng.range(0.5, 0.8);
    const petalBract = new THREE.ConeGeometry(size * rng.range(0.07, 0.1), long, 3);
    petalBract.translate(0, long * 0.45, 0);
    petalBract.scale(1, 1, 0.4);
    // Well past horizontal — turned back down over the bulb, which is exactly
    // what an opening thistle's outer bracts do.
    petalBract.rotateZ(rng.range(1.7, 2.1));
    petalBract.rotateY(a);
    petalBract.translate(at.x, at.y + size * 1.35, at.z);
    parts.push({ geometry: petalBract, color: 0x6b8742, sway: 1 });
  }

  // Spines laid *along* the bulb rather than sticking out of it, sweeping up
  // and back. Flat against the surface is how they actually sit, and it stops
  // the head reading as a hedgehog.
  const spines = 18;
  for (let i = 0; i < spines; i++) {
    const a = (i / spines) * Math.PI * 2 + rng.around(0, 0.15);
    const up = rng.range(0.35, 0.85);
    // Long, fine and standing off the bulb: laid flat against it they are invisible,
    // and the whole reason to draw a thistle's bracts is that they bristle.
    const long = size * rng.range(0.8, 1.3);
    const spine = new THREE.ConeGeometry(size * rng.range(0.035, 0.055), long, 3);
    spine.translate(0, long * 0.42, 0);
    spine.scale(1, 1, 0.55);
    spine.rotateZ(Math.PI / 2 - up * 0.8);
    spine.rotateY(a);
    spine.translate(at.x, at.y + size * rng.range(0.55, 1), at.z);
    parts.push({ geometry: spine, color: 0x51692f, sway: 1 });
  }

  // --- the floret tuft -----------------------------------------------------
  // A brush, not a ball, and an open one: the florets leave the bud pointing upward
  // rather than spraying over a hemisphere, which is what stops it being a
  // puffball, but the bundle fans out — a thistle in flower is a shaving brush in
  // use. With the turned-back collar, that is the difference between bud and bloom.
  const florets = rng.int(26, 38);
  const mouth = at.y + size * 1.5;
  for (let i = 0; i < florets; i++) {
    const a = rng.range(0, Math.PI * 2);
    // Splay grows with distance from the middle of the tuft, so the bundle is
    // dense at the centre and frayed at the edge.
    const away = Math.sqrt(rng());
    const splay = away * 0.95;
    const long = size * rng.range(0.75, 1.15) * (1 - away * 0.2);

    const floret = new THREE.ConeGeometry(size * rng.range(0.035, 0.055), long, 3);
    floret.translate(0, long * 0.5 - long * rng.range(0.1, 0.3), 0);
    floret.rotateZ(splay);
    floret.rotateY(a);
    floret.translate(
      at.x + Math.sin(a) * size * 0.22 * away,
      mouth,
      at.z + Math.cos(a) * size * 0.22 * away,
    );
    // Pinker toward the tips. A thistle's florets are pale magenta at the top and
    // deepen almost to purple where they leave the bud.
    parts.push({
      geometry: floret,
      color: (_x, y) => (y > mouth + long * 0.35 ? 0xe07ac8 : 0xa84c96),
      sway: 1,
    });
  }

  // The base the florets emerge from, which also keeps them from all sharing
  // one point — coincident base discs weld into edges belonging to four faces.
  const pith = new THREE.IcosahedronGeometry(size * 0.34, 0);
  pith.scale(1, 0.6, 1);
  pith.translate(at.x, mouth, at.z);
  parts.push({ geometry: pith, color: 0x8e3f7e, sway: 1 });

  return parts;
}

export const thistle = species(
  'thistle',
  {
    // Knee to thigh high, which is where it belongs against everything else here. A
    // spear thistle does reach a metre in good ground, and at that height in this
    // kit it stands level with the small trees and reads as a shrub.
    height: [0.42, 0.9],
    stemThickness: 0.012,
    headSize: [0, 0],
    petals: 0,
    reach: 0,
    petalWidth: 0,
    cup: [0, 0],
    petal: [0xe07ac8],
    centre: 0xa84c96,
    count: [1, 4],
    spread: 0.35,
    // Supplied by `thistleHead` instead — see the note there. The shared
    // plan's simple opposed blades are the wrong leaf for this plant.
    leaves: 0,
    nod: 0,
    head: thistleHead,
  },
  0.55,
);
