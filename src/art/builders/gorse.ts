import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

// Gorse: a dense spiny mound with yellow blossom all over the outside of it. The
// blossom is the plant and the spines are the trim — gorse in bloom is more yellow
// than green, famously and from a great distance, and colour survives quantization
// where a fifteen-centimetre thorn is one ambiguous pixel. The spines stand about
// twice life size, which is the allowance the quantizer needs, at roughly one to
// every two flowers.

/**
 * Gorse yellow, and the palette has nothing like it — `MARKER_YELLOW` is a muted
 * ochre meant to read as painted wood. Two shades, because a mass of one flat
 * yellow goes to a single quantized block and loses all its internal shape.
 */
const BLOSSOM = 0xd9a41b;
const BLOSSOM_PALE = 0xe8c451;

export const gorse: MeshBuilder = {
  name: 'gorse',
  category: 'foliage',
  // The mound reaches about 1.15 m off its axis. The figure comes from the foliage
  // rather than the thorns, which is a better thing for a spacing hint to be.
  radius: 1.2,
  // Solid, and the one plant in the kit that most deserves to be: a gorse bush is
  // not a tangle but a mass, dense enough all the way through that a box round it
  // is very nearly the truth.
  solid: true,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // The mass carries the plant's whole envelope, since the thorns barely add to
    // it — and this is the one plant the player actually collides with.
    const height = rng.range(0.98, 1.5);
    const spread = rng.range(0.62, 0.9);
    // Woody through and through, so the whole plant leans from the ground
    // rather than bending anywhere in particular. Steep curve: gorse is stiff.
    const ramp = heightRamp(0, height, 1.6);

    // --- the mass ------------------------------------------------------------
    // Kept as data rather than only as geometry, because the spines and the blossom
    // both have to be planted on the surface rather than near it.
    const lumps: { at: THREE.Vector3; radius: number }[] = [];
    const count = rng.int(5, 7);
    for (let i = 0; i < count; i++) {
      const middle = i === 0;
      const bearing = (i / count) * Math.PI * 2 + rng.around(0, 0.55);
      const out = middle ? 0 : spread * rng.range(0.16, 0.44);
      // Each lump is sized from where its top should land rather than given a radius
      // directly: radii drawn independently give a row of separate balls with a
      // scalloped skyline, where a shared ceiling gives one outline with lumps in it.
      const crown = height * (middle ? rng.range(0.9, 1) : rng.range(0.58, 0.9));
      const centre = crown * rng.range(0.44, 0.6);
      lumps.push({
        at: new THREE.Vector3(Math.sin(bearing) * out, centre, Math.cos(bearing) * out),
        radius: crown - centre,
      });
    }

    for (const lump of lumps) {
      // Displaced rather than plain icosahedra, each with its own draws — two
      // congruent lumps landing on each other weld into edges belonging to four
      // faces.
      const mass = lumpySphere(rng, lump.radius, 0, 0.82, 1.14);
      mass.scale(1, rng.range(0.82, 1), 1);
      mass.translate(lump.at.x, lump.at.y, lump.at.z);
      parts.push({
        geometry: mass,
        // Dark, and darker than the leaf green everything else uses. Gorse
        // reads almost black-green against grass, which is half of why the
        // blossom on it looks as violent as it does.
        color: shade(PALETTE.LEAF_DARK, rng.range(0.82, 1.02)),
        sway: ramp,
      });
    }

    // --- the spines ----------------------------------------------------------
    // Few enough to be texture on the rim: at a hundred and twenty the thorns are a
    // surface in their own right and the dark green mass stops being what you see.
    const spines = rng.int(38, 55);
    for (let s = 0; s < spines; s++) {
      const lump = lumps[rng.int(0, lumps.length - 1)];

      // A direction on the lump's surface, biased upward. The underside of a
      // gorse bush is dead wood and leaf litter and is never seen; spines aimed
      // into it are triangles spent on nothing.
      const rise = rng.range(-0.22, 1);
      const flat = Math.sqrt(Math.max(0, 1 - rise * rise));
      const bearing = rng.range(0, Math.PI * 2);
      const dir = new THREE.Vector3(Math.sin(bearing) * flat, rise, Math.cos(bearing) * flat);

      // How far the thorn stands clear of the mass: four to nine centimetres, about
      // double a real furze spine because the quantizer eats anything finer, but
      // short enough that the mound is a mound with bristles rather than a ball of
      // skewers.
      const long = height * rng.range(0.035, 0.075);
      // Rooted well inside the mass, so no spine can be seen to start in air
      // however the lumps ended up overlapping.
      const from = lump.at.clone().addScaledVector(dir, lump.radius * rng.range(0.5, 0.78));
      const to = lump.at.clone().addScaledVector(dir, lump.radius + long);
      // A spine that would end underground is dropped rather than clamped:
      // clamping it flattens it against the ground, and a ring of horizontal
      // spikes round the foot of the bush reads as a sea urchin.
      if (to.y < 0.06) continue;

      parts.push({
        // Radius zero at the far end, so `rod` builds a true cone and the spine comes
        // to a point instead of stopping in a blunt disc. Three sides is all a thorn
        // needs, and thin: a thorn as thick as a pencil reads as aggressive.
        geometry: rod(from, to, height * rng.range(0.005, 0.0085), 0, 3),
        color: shade(0x556b33, rng.range(0.85, 1.2)),
        sway: ramp,
      });
    }

    // --- the blossom ---------------------------------------------------------
    // Only on the upper and outer surface: gorse flowers where the light is, and a
    // bush evenly speckled all round reads as diseased rather than as in bloom.
    // This is where nearly all of the builder's triangles go, which is the right
    // place for them — the point of a gorse bush is that it is the yellow thing.
    const flowers = rng.int(70, 100);

    // Shared out by surface area, and laid on a spiral rather than scattered.
    // Picking a lump at random per flower gives some a dozen and others none, and a
    // uniform random bearing genuinely clusters. So each lump gets a share
    // proportional to its area, and within a lump the directions come off a
    // Fibonacci spiral, with a jitter under one step.
    const area = lumps.map((l) => l.radius * l.radius);
    const totalArea = area.reduce((a, b) => a + b, 0) || 1;
    for (let li = 0; li < lumps.length; li++) {
      const lump = lumps[li];
      const share = Math.max(3, Math.round((flowers * area[li]) / totalArea));

      for (let k = 0; k < share; k++) {
        // Down to a little below the equator: gorse in full bloom carries flower
        // right down its sunny flank, and stopping higher leaves a dark skirt.
        const rise = 1 - ((k + 0.5) / share) * 1.06;
        const flat = Math.sqrt(Math.max(0, 1 - rise * rise));
        const bearing = k * 2.399963 + rng.around(0, 0.55);
        const dir = new THREE.Vector3(
          Math.sin(bearing) * flat,
          Math.min(1, rise + rng.around(0, 0.06)),
          Math.cos(bearing) * flat,
        );

        // Inside the nominal radius, not outside it. `lumpySphere` pushes its
        // vertices anywhere between 0.82 and 1.14 of nominal and the lump is then
        // squashed on Y, so the actual surface can be well inside the nominal
        // sphere — and a bloom placed past it hangs in clear air off the side.
        const at = lump.at
          .clone()
          .addScaledVector(dir, lump.radius * rng.range(0.74, 0.88));
        if (at.y < height * 0.14) continue;

      // A cluster, not a flower: gorse blooms in bunches of three or four pea
      // flowers on one short shoot, and at this size a squashed lump is that bunch.
      // Deliberately larger than life, because three-pixel blocks cannot resolve a
      // truthful flower at all — and size is the cheapest yellow there is, since
      // twenty triangles buys a sphere of any radius.
      const size = height * rng.range(0.05, 0.078);
      const bloom = new THREE.IcosahedronGeometry(size, 0);
      bloom.scale(rng.range(0.9, 1.25), rng.range(0.6, 0.88), rng.range(0.9, 1.25));
      bloom.rotateY(rng.range(0, Math.PI));
      bloom.rotateX(rng.range(0, Math.PI));
      bloom.translate(at.x, at.y, at.z);
      parts.push({
        geometry: bloom,
        // Nearly half on the pale shade: with this many blooms the mass would go to
        // one flat quantized block of the darker yellow.
          color: rng.chance(0.45) ? BLOSSOM_PALE : BLOSSOM,
          sway: ramp,
        });
      }
    }

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'gorse', rng.range(0, Math.PI * 2));
  },
};
