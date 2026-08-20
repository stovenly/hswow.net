import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';
import { rod } from '../rod';

// Cow parsley: a flat white table carried on forked rays — the only flower in the
// kit whose head is horizontal, so a stand of it reads as a layer of white at knee
// height. Every ray reaches the same height, which is the whole umbel; rays ending
// at their own heights give a dome, which is a different plant. One flattened blob
// per ray tip, because the florets are far too small to model.
function cowParslyUmbel({ axis, height, rng }: HeadContext): Part[] {
  const parts: Part[] = [];
  const at = axis(1);
  const rays = rng.int(6, 11);
  const reach = height * rng.range(0.1, 0.16);
  // The plate sits a little above the fork, and *level*.
  const table = at.y + reach * rng.range(0.5, 0.8);

  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + rng.range(-0.2, 0.2);
    // Deliberately uneven. Equal rays give a wheel; unequal ones that all
    // arrive at the same height give an umbel.
    const out = reach * rng.range(0.5, 1.15);
    // One point for the end of the ray, used by the ray and by the head on it.
    // Computed separately they did not always agree, and the heads floated.
    const tip = new THREE.Vector3(at.x + Math.cos(a) * out, table, at.z + Math.sin(a) * out);

    parts.push({ geometry: rod(at, tip, 0.0028, 0.0018), color: 0x6a7a44, sway: 1 });

    // The umbellet: a flat pad of florets. Squashed hard, because the one thing
    // it must not be is a ball.
    const pad = new THREE.IcosahedronGeometry(reach * rng.range(0.16, 0.26), 0);
    pad.scale(1, 0.32, 1);
    pad.translate(tip.x, tip.y, tip.z);
    parts.push({ geometry: pad, color: 0xf7f5ec, sway: 1 });

    // A few paler centres showing through, so the plate is not one flat white
    // shape — it is a hundred tiny ones and the variation is what says so.
    if (rng.chance(0.55)) {
      const centre = new THREE.IcosahedronGeometry(reach * 0.1, 0);
      centre.scale(1, 0.3, 1);
      centre.translate(tip.x + rng.around(0, 0.008), tip.y + 0.004, tip.z + rng.around(0, 0.008));
      parts.push({ geometry: centre, color: 0xd8d6a0, sway: 1 });
    }
  }

  return parts;
}

export const cowparsley = species(
  'cowparsley',
  {
    height: [0.55, 1.15],
    stemThickness: 0.009,
    headSize: [0, 0],
    petals: 0,
    reach: 0,
    petalWidth: 0,
    cup: [0, 0],
    petal: [0xf7f5ec],
    centre: 0xd8d6a0,
    count: [5, 12],
    spread: 0.5,
    leaves: 2,
    nod: 0,
    head: cowParslyUmbel,
  },
  0.7,
);
