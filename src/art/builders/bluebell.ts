import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';
import { rod } from '../rod';

// Bluebell: six or eight big bells hung along a stem that arches right over under
// their weight, so the tip finishes pointing at the ground. The bend is the
// silhouette, and what separates it from a foxglove's straight column. The bells
// curl back at their mouths.
function bluebellRaceme({ axis, height, rng }: HeadContext): Part[] {
  const parts: Part[] = [];
  const bells = rng.int(4, 6);
  const face = rng.range(0, Math.PI * 2);
  const from = rng.range(0.5, 0.62);
  const white = rng.chance(0.06);
  const petal = white ? 0xf0eee8 : 0x5a6fb5;

  for (let i = 0; i < bells; i++) {
    const u = bells === 1 ? 0 : i / (bells - 1);
    const t = from + (1 - from) * u;
    const joint = axis(t);
    // The arch: flowers hang further out and lower the closer they are to the
    // tip, which is what reads as the stem being pulled over by them.
    const arch = u * u * height * 0.3;
    const size = height * 0.12 * (1 - u * 0.3);
    const bearing = face + rng.range(-0.22, 0.22);
    const out = size * 0.9 + arch;

    // Where the bell hangs. One point, used by the stalk *and* the bell, so
    // there is nothing for them to disagree about.
    const hang = new THREE.Vector3(
      joint.x + Math.sin(bearing) * out,
      joint.y - arch * 0.5,
      joint.z + Math.cos(bearing) * out,
    );

    // Stem to bell, spanning exactly. This used to be a cylinder rotated by a
    // hand-written angle and translated to a hand-written midpoint, and it
    // reliably left a gap at one end or the other.
    parts.push({ geometry: rod(joint, hang, 0.0035, 0.0025), color: 0x5d7440, sway: t });

    // One part per bell, not two: a cone wider at the bottom than the top is the
    // flare, and a bluebell has no waist to lose.
    const bell = new THREE.CylinderGeometry(size * 0.3, size * 0.62, size * 1.4, 6);
    bell.translate(0, -size * 0.7, 0);
    bell.rotateZ(rng.around(0, 0.16));
    bell.translate(hang.x, hang.y, hang.z);
    parts.push({ geometry: bell, color: petal, sway: t });
  }

  return parts;
}

export const bluebell = species(
  'bluebell',
  {
    height: [0.35, 0.62],
    stemThickness: 0.008,
    headSize: [0, 0],
    petals: 0,
    reach: 0,
    petalWidth: 0,
    cup: [0, 0],
    petal: [0x5a6fb5],
    centre: 0x5a6fb5,
    // The densest clump in the kit, and deliberately — bluebells are only
    // themselves in quantity. Density in a wood comes from placing many clumps,
    // which is free; density inside one costs geometry nobody can resolve.
    count: [9, 16],
    spread: 0.5,
    leaves: 0,
    nod: 0,
    head: bluebellRaceme,
  },
  0.65,
);
