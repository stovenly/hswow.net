import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, heightRamp, type Part } from '../assemble';
import { lumpySphere } from '../blob';
import { createRng } from '../random';
import { rod } from '../rod';
import { PALETTE, shade } from '../palette';

/**
 * Gorse: a dense spiny mound with yellow blossom all over the outside of it.
 *
 * Heath, cliff top, common land and the sour end of any field — gorse takes the
 * ground nothing else wants, and it is what a bank of it looks like from two
 * hundred metres that matters here.
 *
 * **The blossom is the plant, and the spines are the trim.** That is a
 * correction. The first version had it exactly the other way round: the spines
 * stood a fifth of the plant's height clear of the mass — roughly three times
 * further than botany allows — on the reasoning that the furred *edge* of the
 * mound is what separates gorse from the generic bush, and that anything only
 * breaking the outline by a centimetre is not there at all once the render
 * chunks to three-pixel blocks. Every word of that is true and the result was
 * still wrong, because a hundred and twenty thorns each standing fifteen
 * centimetres proud does not read as gorse. It reads as a threat: a sea urchin,
 * a caltrop, something with an opinion about being approached.
 *
 * The exaggeration has been pulled back to about a third of what it was — still
 * roughly twice life size, which is the allowance the quantizer genuinely needs
 * — and the count roughly halved, so the rim is furred rather than armed. What
 * carries the plant instead is the flower, which is both cheaper to read and
 * more honest: **gorse in bloom is more yellow than green**, famously and from
 * a great distance, and the previous ratio of thirty-odd blossoms to a hundred
 * and twenty spines had it as a dark spiky thing with some yellow specks. It is
 * now nearer two flowers to every spine.
 *
 * Colour is the right thing to lean on anyway. It survives quantization far
 * better than fine geometry does — a saturated yellow mass is still a saturated
 * yellow mass at two hundred metres, where a fifteen-centimetre thorn is one
 * ambiguous pixel of green.
 *
 * The mound itself is unchanged. That part was right.
 */

/**
 * Gorse yellow, and the palette has nothing like it.
 *
 * `MARKER_YELLOW` is the closest and it is a muted ochre meant to be read as
 * painted wood, which is exactly wrong: gorse flowers are the most saturated
 * thing on an English hillside in April, and a dull one reads as a dying bush.
 * Two shades because a mass of one flat yellow goes to a single quantized block
 * and loses all its internal shape.
 */
const BLOSSOM = 0xd9a41b;
const BLOSSOM_PALE = 0xe8c451;

export const gorse: MeshBuilder = {
  name: 'gorse',
  category: 'foliage',
  // Unchanged in spirit, nudged for measurement: the mound reaches about 1.15 m
  // off its axis. The spines used to contribute a fifth of the plant's height
  // to that figure and now contribute a fifteenth, so the number comes from the
  // foliage rather than from the thorns — which is a better thing for a spacing
  // hint to be made of.
  radius: 1.2,
  // Solid, and the one plant in the kit that most deserves to be. Bramble is
  // walked through because a tangle's real collision volume is the tangle and
  // a box round it catches the player on air; a gorse bush is not a tangle, it
  // is a *mass* — dense enough all the way through that a box round it is very
  // nearly the truth. It is the cheapest honest wall a landscape has.
  solid: true,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Nudged up from 0.9..1.35 to hold the plant's overall envelope where it
    // was. Shortening the spines took fifteen centimetres off the top and the
    // sides of every instance, because the halo of thorns *was* part of the
    // bounding box; the mass has to grow by about that much or the bush quietly
    // shrinks — and this is the one plant in the kit the player actually
    // collides with, so its size is not only a matter of looks.
    const height = rng.range(0.98, 1.5);
    const spread = rng.range(0.62, 0.9);
    // Woody through and through, so the whole plant leans from the ground
    // rather than bending anywhere in particular. Steep curve: gorse is stiff.
    const ramp = heightRamp(0, height, 1.6);

    // --- the mass ------------------------------------------------------------
    //
    // Kept as data rather than only as geometry, because the spines and the
    // blossom both have to be planted *on the surface* — scattering them near
    // the middle and hoping is how the first bramble ended up with a third of
    // its leaves hanging in clear air.
    const lumps: { at: THREE.Vector3; radius: number }[] = [];
    const count = rng.int(5, 7);
    for (let i = 0; i < count; i++) {
      const middle = i === 0;
      const bearing = (i / count) * Math.PI * 2 + rng.around(0, 0.55);
      const out = middle ? 0 : spread * rng.range(0.16, 0.44);
      // Each lump is sized from where its *top* should land rather than given a
      // radius directly. Radii drawn independently give a row of separate balls
      // with a scalloped skyline; sizing to a shared ceiling gives one outline
      // with lumps in it, which is what a mound is.
      const crown = height * (middle ? rng.range(0.9, 1) : rng.range(0.58, 0.9));
      const centre = crown * rng.range(0.44, 0.6);
      lumps.push({
        at: new THREE.Vector3(Math.sin(bearing) * out, centre, Math.cos(bearing) * out),
        radius: crown - centre,
      });
    }

    for (const lump of lumps) {
      // Displaced rather than plain icosahedra, and every one gets its own
      // draws from the rng — two congruent lumps landing on each other weld
      // into edges belonging to four faces, which is a hole by the checker's
      // reckoning and a z-fight by the eye's.
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
    //
    // Down from 95..135. The count was doing as much of the damage as the
    // length was: at a hundred and twenty the thorns are dense enough to be a
    // *surface* in their own right, and the dark green mass underneath stops
    // being what you see. Halved, they are texture on the rim, which is the job.
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

      // How far the thorn stands clear of the mass, and this one number was the
      // whole complaint. It was 0.12..0.21 of the plant's height — thirteen to
      // twenty-three centimetres of bare spike beyond the foliage, which is
      // longer than some of the lumps are wide. At 0.035..0.075 it is four to
      // nine centimetres: still about double a real furze spine, because the
      // quantizer eats anything finer, but the mound is now clearly a mound
      // with bristles on it rather than a ball of skewers.
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
        // Radius zero at the far end, so `rod` builds a true cone and the spine
        // comes to a point instead of stopping in a blunt disc. Three sides is
        // all a thorn ever needs.
        //
        // Thinner as well as shorter. At 0.007..0.012 of height these were up
        // to twenty-six millimetres across the base — a thorn as thick as a
        // pencil, which is a large part of why they read as aggressive rather
        // than as prickly.
        geometry: rod(from, to, height * rng.range(0.005, 0.0085), 0, 3),
        color: shade(0x556b33, rng.range(0.85, 1.2)),
        sway: ramp,
      });
    }

    // --- the blossom ---------------------------------------------------------
    //
    // Only on the upper and outer surface. Gorse flowers where the light is,
    // and a bush evenly speckled all round reads as diseased rather than as in
    // bloom.
    //
    // Up from 26..48, which is roughly a trebling, and it is where nearly all
    // of this builder's triangles now go. That is the correct place for them:
    // the whole point of a gorse bush in a landscape is that it is the yellow
    // thing on the hill, and a plant whose defining feature is a minority of
    // its own surface is not the plant. Between this and the halved spines the
    // ratio has gone from roughly one flower per three-and-a-half spines to
    // nearly two flowers per spine.
    const flowers = rng.int(70, 100);

    // **Shared out by surface area, and laid on a spiral rather than scattered.**
    //
    // Two faults, both of which showed as clumping. Picking a lump at random
    // per flower gives some lumps a dozen and others none — with eight lumps
    // and eighty flowers the spread of counts is wide enough to see. And a
    // uniform random bearing genuinely clusters: that is what random looks
    // like, and it is not what an evenly flowering bush looks like.
    //
    // So each lump gets a share proportional to its own area, and within a lump
    // the directions come off a Fibonacci spiral — the golden angle, 2.399963
    // rad per step, which is the same trick the oak's limbs use. Even coverage
    // by construction, with a jitter under one step so it still reads as
    // organic rather than as a pattern.
    const area = lumps.map((l) => l.radius * l.radius);
    const totalArea = area.reduce((a, b) => a + b, 0) || 1;
    for (let li = 0; li < lumps.length; li++) {
      const lump = lumps[li];
      const share = Math.max(3, Math.round((flowers * area[li]) / totalArea));

      for (let k = 0; k < share; k++) {
        // Down to a little below the equator. Gorse in full bloom carries
        // flower right down its sunny flank, and stopping higher left a dark
        // skirt that read as the yellow being painted on afterwards. The
        // absolute height guard below still keeps blossom off the underside.
        const rise = 1 - ((k + 0.5) / share) * 1.06;
        const flat = Math.sqrt(Math.max(0, 1 - rise * rise));
        const bearing = k * 2.399963 + rng.around(0, 0.55);
        const dir = new THREE.Vector3(
          Math.sin(bearing) * flat,
          Math.min(1, rise + rng.around(0, 0.06)),
          Math.cos(bearing) * flat,
        );

        // **Inside the nominal radius, not outside it.** These sat at
        // 0.98–1.12, which floats: `lumpySphere` pushes its vertices anywhere
        // between 0.82 and 1.14 of nominal and the lump is then squashed on Y,
        // so the *actual* surface under a given direction can be well inside
        // the nominal sphere — and a bloom placed past it hangs in clear air
        // off the side of the bush. Sitting a little proud of the true surface
        // is worth having; sitting proud of the largest surface it could have
        // had is what was happening.
        const at = lump.at
          .clone()
          .addScaledVector(dir, lump.radius * rng.range(0.74, 0.88));
        if (at.y < height * 0.14) continue;

      // A cluster, not a flower. Gorse blooms in bunches of three or four pea
      // flowers on one short shoot, and at this size a single squashed lump is
      // that bunch — modelling the wings and keel of something a centimetre
      // across would be triangles nobody could ever resolve.
      // Bigger, and deliberately bigger than life. A gorse bloom is three
      // centimetres across and these are nearer fifteen — but the same argument
      // that justified the elder's oversized umbels applies with more force
      // here, because there is nothing else to look at: three-pixel blocks
      // cannot resolve a truthful flower at all, so a truthful one is a plant
      // with no blossom on it. Each of these is a *patch* of bloom, not a
      // flower, and patches are what the eye reads at any distance the player
      // will ever stand.
      //
      // Size is also the cheapest yellow there is. Twenty triangles buys a
      // sphere of any radius, so growing the blooms raises the fraction of the
      // surface that reads yellow without costing anything at all, where adding
      // more of them costs twenty apiece against a 2600 ceiling.
      const size = height * rng.range(0.05, 0.078);
      const bloom = new THREE.IcosahedronGeometry(size, 0);
      bloom.scale(rng.range(0.9, 1.25), rng.range(0.6, 0.88), rng.range(0.9, 1.25));
      bloom.rotateY(rng.range(0, Math.PI));
      bloom.rotateX(rng.range(0, Math.PI));
      bloom.translate(at.x, at.y, at.z);
      parts.push({
        geometry: bloom,
        // Nearly half of them on the pale shade now rather than a third. With
        // three times as many blooms the mass was going to one flat quantized
        // block of the darker yellow; the paler ones are what keep internal
        // shape in a surface that is mostly one colour.
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
