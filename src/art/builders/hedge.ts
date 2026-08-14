import * as THREE from 'three';
import type { BuilderWith, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A hedge: a run of dense growth, laid to a line.
 *
 * **The single most useful boundary object here, and the one the kit was faking
 * most expensively.** A hedge in this world was four `hazel` placed by hand at
 * 2 700 triangles each — nearly eleven thousand triangles for four metres of
 * boundary, and it still read as four bushes in a row, because that is what it
 * was. This is the same four metres for about three hundred, and it reads as one
 * thing, because it is.
 *
 * What it buys beyond the cost is the *statement*. A fence says somebody built a
 * boundary; a wall says the ground either side belongs to different people; a
 * hedge says the boundary has been there long enough to grow. That is the
 * register a countryside lane actually needs, and there was nothing in the kit
 * that could make it.
 *
 * ## Sectioned, exactly as `fence` and `stone-wall` are
 *
 * The pitch is fixed, so `countryside.ts`'s `laid` can run a hedge along an
 * arbitrary line as a count of sections without knowing what a hedge is. `run`
 * seeds what has to agree across a join — height, thickness, species colour, and
 * whether it has been cut — because a run of two pieces that disagree about how
 * tall a hedge is is two hedges.
 *
 * **The masses are allowed to overhang the join and interpenetrate the next
 * piece.** This is the opposite of the rule `stone-wall` and `rock-shelf`
 * follow, and it is right for the same underlying reason: what matters is
 * whether the join can be *seen*. Two stones that overlap look wrong; two masses
 * of leaves that overlap look like a hedge. Keeping the lumps strictly inside
 * the span would pinch the run at every pitch mark, which is far more visible
 * than the handful of hidden triangles this costs.
 *
 * ## Cut or grown out
 *
 * Rolled off the run. A cut hedge has a flat top and square shoulders and says
 * somebody keeps this; a grown-out one is a ragged billowing mass and says
 * nobody has for years. They are different objects to the eye and one builder,
 * because the difference is entirely in how the same lumps are squashed.
 *
 * **Bare at the bottom**, always. That is what a hedge looks like and it is also
 * what makes it read as a *hedge* rather than as a long bush: a strip of light
 * under the mass with stems crossing it — and since that strip is the one place
 * the structure of the thing is visible, what crosses it is upright stems from
 * stools at an even pitch, rather than a scatter of sticks. See below.
 *
 * ## The mass is built from the gap up, and that is not a detail
 *
 * It was built from the *top* down — the crown was put at `height` and each lump
 * hung below it — while the stems were grown from the ground up to their own
 * unrelated length. Two independent numbers deciding where the same joint is, so
 * about half the time the leaves floated a good handful of centimetres clear of
 * the wood that is supposed to be holding them up. That is the worst kind of
 * wrong: not a proportion anyone could argue about, just a plant in two pieces.
 *
 * So `clear` — how much bare stem shows — is now the *only* input, and both
 * halves are derived from it. The mass fills the band from `clear` to `height`,
 * with each lump given enough vertical radius that its flat faces reach the
 * bottom of that band rather than merely its vertices. The stems run from the
 * ground to somewhere *inside* the band, never merely up to it. There is no roll
 * that can separate them.
 *
 * Built along **+X**, standing on y = 0, centred on its own span.
 */

/** Metres of hedge in one section. The same for every hedge, so runs tile. */
export const HEDGE_SECTION = 1.6;

/** Sections in one piece. */
export const HEDGE_MAX_SECTIONS = 4;

export interface HedgeOptions extends BuildOptions {
  /** How many sections long, 1..4. Rolled from the seed when the caller says nothing. */
  sections?: number;
  /** Seeds what has to agree across a join — height, thickness, species. Defaults to `seed`. */
  run?: number;
}

export const hedge: BuilderWith<HedgeOptions> = {
  name: 'hedge',
  category: 'foliage',
  // Half the longest span, plus the overhang past it — the masses are allowed
  // past the join on purpose, and a placer spacing to the pitch alone would
  // leave the ends of two runs growing through each other.
  radius: (HEDGE_MAX_SECTIONS * HEDGE_SECTION) / 2 + 0.5,

  build({ seed = 1, scale = 1, sections, run }: HedgeOptions = {}) {
    const rng = createRng(seed);
    // Everything a neighbouring piece has to match comes off this one, in this
    // order, before anything else touches it.
    const along = createRng(run ?? seed);
    const parts: Part[] = [];

    const rolled = rng.int(1, HEDGE_MAX_SECTIONS);
    const count = Math.max(1, Math.min(HEDGE_MAX_SECTIONS, Math.round(sections ?? rolled)));
    const span = count * HEDGE_SECTION;
    const cut = along.chance(0.45);
    const height = cut ? along.range(1.1, 1.6) : along.range(1.4, 2.2);
    const thick = along.range(0.55, 0.95);
    const leaf = along.chance(0.35) ? PALETTE.LEAF_DARK : PALETTE.LEAF;
    const stem = along.chance(0.5) ? PALETTE.BARK : shade(PALETTE.BARK_PALE, 0.92);
    // How far up the light gets under it — the underside of the leaf mass, and
    // the one number both halves of the plant are built from.
    const clear = along.range(0.18, 0.34);
    /** The band the leaves fill: from the bare stems up to the top. */
    const body = height - clear;
    const middle = clear + body / 2;

    /**
     * An icosahedron's flat faces lie at about 0.795 of its circumradius.
     *
     * Which matters here and nowhere else in the kit: a lump sized so its
     * *vertices* reach the bottom of the leaf band has faces that stop well
     * short of it, and what shows is a gap with two spikes poking into it.
     * Everything below is sized so the faces arrive, and the vertices overshoot.
     */
    const INRADIUS = 0.7947;

    // --- the stools and their stems ------------------------------------------
    //
    // **A hedge is planted, and this is where that shows.** The stems were
    // scattered along the run at random positions, random leans and random
    // thicknesses, and the result was noise: a fringe of unrelated sticks under
    // a green mass, with no more structure than a handful of dropped matches.
    //
    // What a hedge actually has is **stools** — one plant every half metre or
    // so, each throwing up two or three stems from the same point. That
    // repetition is the structure. It is what tells you at a glance that
    // somebody put this here, and it is the difference between a boundary and a
    // thicket that happens to be long.
    //
    // So: an even pitch, lightly jittered, and the stems standing up.
    const stools = Math.max(2, Math.round(span / along.range(0.42, 0.62)));
    const pitchOf = span / stools;

    for (let i = 0; i <= stools; i++) {
      const at = -span / 2 + i * pitchOf + rng.around(0, pitchOf * 0.16);
      const shoots = rng.int(2, 3);
      // The stool itself sits a little off the line, but its own stems all
      // start from it — that shared root is what makes them read as one plant.
      const rootZ = rng.around(0, thick * 0.16);
      for (let s = 0; s < shoots; s++) {
        // **Up into the leaves, never merely up to them.** A third to two
        // thirds of the way through the mass, so no roll can leave wood and
        // leaf apart.
        const tall = clear + body * rng.range(0.3, 0.6);
        const thickness = rng.range(0.022, 0.045);
        const shoot = new THREE.CylinderGeometry(thickness * 0.7, thickness, tall, 4);
        shoot.translate(0, tall / 2, 0);
        // **Upright.** They were swept along the run at up to thirty degrees, on
        // the reasoning that a laid hedge has its stems bent over — which is
        // true of a hedge in the season it is laid and false of one at any other
        // time, and at this scale it read as a row of leaning sticks rather than
        // as a plant. A stem grows toward the light, which is straight up; a few
        // degrees of wander is all any of them gets.
        shoot.rotateZ(rng.around(0, 0.1));
        shoot.rotateX(rng.around(0, 0.09));
        shoot.translate(at, 0, rootZ + rng.around(0, thick * 0.08));
        parts.push({ geometry: shoot, color: shade(stem, rng.range(0.88, 1.08)), sway: 0 });
      }
    }

    // --- the mass ------------------------------------------------------------
    //
    // A ridge of squashed lumps along the line, centred on the middle of the
    // band and tall enough to fill it. Stepped at rather less than a lump's own
    // half-width, so consecutive masses overlap and the run has no gaps in it —
    // a hedge you can see through in one place is a hedge you can see through.
    const lumps = Math.round(count * (cut ? 4.4 : 3.6));
    const pitch = span / lumps;
    for (let i = 0; i < lumps; i++) {
      const at = -span / 2 + (i + 0.5) * pitch;
      // Cut hedges are shorn to one height and one width; grown ones billow.
      const bulk = cut ? rng.range(0.96, 1.04) : rng.range(0.82, 1.18);
      // **Half-width comfortably over the whole pitch**, so neighbours interlock
      // even at the far end of the jitter below. At 0.62 they only interlocked
      // on average: an icosahedron's faces sit at 0.79 of its radius, so two
      // lumps 1.4 pitches apart with half-widths of 0.62 each had their faces
      // 0.99 pitches apart, and about one hedge in ten had a hole you could see
      // the far side through. A hedge with a gap in it is a gap.
      const rx = pitch * rng.range(0.85, 1.1);
      // Half-height that puts the *faces* on the band, top and bottom.
      const ry = ((body / 2) / INRADIUS) * (cut ? rng.range(0.98, 1.06) : rng.range(0.9, 1.2)) * bulk;
      const rz = (thick / 2 / INRADIUS) * rng.range(0.9, 1.12);

      const lump = new THREE.IcosahedronGeometry(1, 0);
      lump.rotateY(rng.range(0, Math.PI * 2));
      lump.rotateX(rng.range(0, Math.PI));
      lump.scale(rx, ry, rz);
      lump.translate(
        at + rng.around(0, pitch * 0.08),
        // Cut ones sit on one line; grown ones rise and fall along the run.
        middle + (cut ? rng.around(0, body * 0.04) : rng.around(0, body * 0.16)),
        rng.around(0, thick * 0.1),
      );
      parts.push({
        geometry: lump,
        color: shade(leaf, rng.range(0.86, 1.14)),
        // Barely. A hedge is a dense mass of interlocking wood and the top
        // stirs; anything more reads as a green pillow being shaken.
        sway: (_x, y) => Math.max(0, (y - clear) / Math.max(body, 0.1)) * 0.8,
      });
    }

    // A second, lower course on the flanks of the grown-out ones — the skirt of
    // new growth that comes up through a hedge nobody cuts. Set low in the band
    // and only half a thickness out, so it is buried in the main ridge along its
    // whole inner side rather than stuck to it.
    if (!cut) {
      const skirt = Math.round(count * 1.6);
      for (let i = 0; i < skirt; i++) {
        const ry = ((body * rng.range(0.3, 0.45)) / INRADIUS) * 1.1;
        const rz = (thick * rng.range(0.28, 0.38)) / INRADIUS;
        const lump = new THREE.IcosahedronGeometry(1, 0);
        lump.rotateY(rng.range(0, Math.PI * 2));
        lump.scale(pitch * rng.range(0.7, 1.1), ry, rz);
        lump.translate(
          rng.range(-span / 2, span / 2),
          clear + body * rng.range(0.18, 0.34),
          (rng.chance(0.5) ? 1 : -1) * thick * rng.range(0.3, 0.45),
        );
        parts.push({
          geometry: lump,
          color: shade(leaf, rng.range(0.8, 1)),
          sway: (_x, y) => Math.max(0, (y - clear) / Math.max(body, 0.1)) * 0.6,
        });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hedge', rng.range(0, Math.PI * 2));
  },
};
