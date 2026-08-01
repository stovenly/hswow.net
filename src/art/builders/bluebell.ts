import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';
import { rod } from '../rod';

/**
 * Bluebell: a few big bells nodding off one side of a bent stem.
 *
 * The woodland floor in April, and the only flower in the kit that is properly
 * a *carpet* — the clump count here is the highest of any species, because a
 * dozen bluebells is not a bluebell wood and the whole read depends on there
 * being far too many of them.
 *
 * Deliberately cheap. It was the most expensive thing in the kit by a factor
 * of three — three parts per bell, nine bells, thirty-four plants — for a
 * flower whose whole job is to appear in hundreds. Two parts and half the
 * counts reads identically at the distance a carpet is ever seen from.
 *
 * **The bend is the silhouette**, and it is what separates it from a foxglove
 * at any distance. A foxglove is a straight column of many small bells; a
 * bluebell is a *comma* — six or eight much larger ones hung along a stem that
 * arches right over under their weight, so the tip finishes pointing at the
 * ground.
 *
 * The bells curl back at their mouths, which is the detail everyone would name
 * and costs one extra ring apiece.
 */
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

    // **One part per bell, not two.** It was a tube with a separate flared ring
    // stuck under it — twice the geometry, and one more join that could miss.
    // A cone wider at the bottom than the top *is* the flare, and a bluebell
    // has no waist to lose.
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
    // The densest clump in the kit, and deliberately. Bluebells are only
    // themselves in quantity — a handful is a hyacinth that got out.
    // Enough to read as a carpet without a single clump costing five thousand
    // triangles. Density in a wood comes from placing many clumps, which is
    // free; density *inside* one costs geometry that nobody can resolve.
    count: [9, 16],
    spread: 0.5,
    leaves: 0,
    nod: 0,
    head: bluebellRaceme,
  },
  0.65,
);
