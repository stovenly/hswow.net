import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';

// Lavender: a mound of narrow spikes, each a stack of whorls — the first flower
// in the kit that says somebody planted this. Two thirds of every spike is naked
// stem, so a clump reads as vertical lines with colour only at the top; flowering
// all the way down would make it a foxglove. The head is rings of tiny flowers
// with visible gaps between them.
function lavenderSpike({ axis, height, rng }: HeadContext): Part[] {
  const parts: Part[] = [];
  // Flowers only over the top third.
  const from = rng.range(0.62, 0.72);
  const whorls = rng.int(4, 7);
  const violet = rng.chance(0.5) ? 0x7c6ba6 : 0x8b7ab8;

  for (let i = 0; i < whorls; i++) {
    const t = from + ((1 - from) * (i + 0.4)) / whorls;
    const at = axis(t);
    // Tapered, but only near the top: a lavender spike is a near-parallel
    // bottlebrush that gathers to a point in its last few rings, not a cone. The
    // exponent keeps the ramp close to 1 over the lower two thirds.
    const u = (t - from) / (1 - from);
    const size = height * 0.028 * (1 - u ** 2.6 * 0.42);

    // Four little flowers to a ring, turned a fraction from the ring below so
    // the stack interleaves rather than lining up into ribs.
    for (let f = 0; f < 4; f++) {
      const a = (f / 4) * Math.PI * 2 + i * 0.7;
      const bud = new THREE.IcosahedronGeometry(size, 0);
      bud.scale(0.8, 1.15, 0.8);
      bud.translate(at.x + Math.cos(a) * size * 0.85, at.y, at.z + Math.sin(a) * size * 0.85);
      parts.push({ geometry: bud, color: violet, sway: t });
    }

    // The calyx between the whorls: greener, and it is what makes the gaps
    // read as gaps rather than as a broken flower.
    const collar = new THREE.CylinderGeometry(size * 0.5, size * 0.6, size * 0.8, 5);
    collar.translate(at.x, at.y - size * 0.9, at.z);
    parts.push({ geometry: collar, color: 0x8b9a7b, sway: t });
  }

  return parts;
}

export const lavender = species(
  'lavender',
  {
    height: [0.5, 0.95],
    stemThickness: 0.007,
    headSize: [0, 0],
    petals: 0,
    reach: 0,
    petalWidth: 0,
    cup: [0, 0],
    petal: [0x7c6ba6],
    centre: 0x8b9a7b,
    // Many, and tightly packed. Lavender grows as a dense mound of stems from
    // one woody stool, so the clump is far tighter than a meadow flower's.
    count: [16, 30],
    spread: 0.26,
    leaves: 1,
    nod: 0,
    head: lavenderSpike,
  },
  0.5,
);
