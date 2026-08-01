import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';

/**
 * Foxglove: a tall spire with bells hanging down one side of it.
 *
 * Woodland edge and hedge bank, and the tallest thing in the flower kit. It
 * earns its place for a reason none of the others do: it gives a wood a
 * *vertical* flower, so the storey between the ground cover and the canopy has
 * something in it with colour.
 *
 * ## Two rules, and everything else was noise
 *
 * This is the third attempt. The first two failed in the same way — by adding
 * detail to a shape that was wrong underneath. There were sepals, lobed lips,
 * spotted throats and pedicels, and none of it helped, because the thing being
 * decorated did not read as a foxglove in the first place.
 *
 * What actually identifies one, at every distance anybody sees it from:
 *
 * 1. **The bells are fixed at the stem and swing out at the mouth.** Both of
 *    those halves matter and the second version got the first one wrong: the
 *    shoulder was offset several stem-widths into open air and *then* leaned
 *    further, so the top swung away and the attachment was the loose end —
 *    backwards. A bell is joined to the spire at its shoulder and hangs from
 *    it, and the angle is what carries the mouth clear.
 *
 *    The angle stays modest. The first two attempts tipped them a radian or
 *    more so the mouths could be seen, and that single number is what made
 *    them read as trumpets stuck on a pole: a foxglove seen from the side
 *    shows almost no mouth at all, and that is correct. Forty degrees at the
 *    most open, sixteen at a bud.
 * 2. **They are all on one side.** A spire flowered evenly round its stem is a
 *    hyacinth.
 *
 * Two parts to a flower — a tube and the ring at its mouth — and nothing else.
 * At the size these are ever seen, more parts have never once bought more
 * flower.
 */

const PETAL = 0xb0538f;
const PETAL_PALE = 0xc76fa4;
const LIP = 0x8d3d73;
const BUD = 0x7d4a72;

function foxgloveSpire({ axis, height, rng }: HeadContext): Part[] {
  const parts: Part[] = [];

  const bells = rng.int(11, 16);
  // One bearing for the whole spire, barely scattered. See rule 2.
  const face = rng.range(0, Math.PI * 2);
  // Flowering starts about halfway up; below that is bare stem and leaves.
  const from = rng.range(0.4, 0.5);

  for (let i = 0; i < bells; i++) {
    const u = i / (bells - 1);
    const t = from + (1 - from) * u;
    const joint = axis(t);
    // Widened from ±0.16. That was a nine-degree fan, so consecutive bells sat
    // almost directly above one another and the big lower ones intersected
    // whatever the lean did. A real spike spirals as it climbs; ±0.38 is still
    // unmistakably one-sided — which is rule 2 and non-negotiable, a foxglove
    // flowered evenly round its stem is a hyacinth — while giving each bell its
    // own column to hang in.
    const bearing = face + rng.range(-0.38, 0.38);

    // Big at the bottom, small at the top. A spike flowers from the base
    // upward over weeks, so at any moment it is graded — and the grading is
    // most of what makes it read as growing rather than as ornament.
    const size = height * 0.09 * (1 - u * 0.55);
    // The top few are still shut: shorter, narrower, and standing closer in.
    const open = Math.min(1, Math.max(0, 1.35 - u * 1.8));

    // `outward` is the horizontal direction away from the spire at this
    // bearing. **Both the offset and the lean below are derived from it** —
    // that is the point of naming it. They were computed separately once, and
    // disagreed by a sign.
    const outward = { x: Math.sin(bearing), z: Math.cos(bearing) };

    // **The shoulder attaches to the stem. It does not stand off it.**
    //
    // This was `size * (0.45 + open * 0.35)`, which for a spire whose stem is
    // about 11 mm in radius put the top of every bell 50–90 mm out — four to
    // eight stem-widths clear, hanging in air with a visible gap. The flower
    // then leaned further out from there, so the *top* swung away and the
    // attachment was the loose end. Exactly backwards: a foxglove bell is
    // fixed at the stem and swings out at the mouth.
    //
    // Kept below the tube's own top radius (`size * 0.22`) so the shoulder
    // always straddles the stem axis and is buried in it, whatever the roll.
    // Being *inside* the stem is right — the pedicel is short enough to be
    // invisible at this scale, so the join wants to be closed, not bridged.
    const out = size * 0.12;
    const hx = joint.x + outward.x * out;
    const hz = joint.z + outward.z * out;

    const long = size * (0.8 + open * 0.9);
    const mouth = size * (0.2 + open * 0.28);

    // Hung from its shoulder, pointing down and swinging out.
    //
    // **The angle is now doing the work the offset was doing wrongly.** With
    // the shoulder buried in the stem, the only thing that carries a bell
    // clear of its neighbours is how far it tips — so this is up from
    // 0.18–0.48 rad. Sixteen to forty degrees: enough that an open bell
    // plainly swings away and a bud barely does, which is also the truth of
    // it, since a bud has not opened out yet.
    //
    // Still well short of the radian that sank the first two attempts. Past
    // about sixty degrees the mouth comes into view from the side and the
    // flower stops being a bell on a spire and becomes a trumpet on a pole.
    const lean = 0.28 + open * 0.42;

    /**
     * The Y rotation that carries the lean out along `outward`.
     *
     * **This had the wrong sign, and the wrong sign is not obviously wrong.**
     * `rotateZ(lean)` tips a downward bell toward +X. `rotateY(θ)` then sends
     * +X to `(cos θ, 0, −sin θ)`, and for that to equal `outward`, which is
     * `(sin b, 0, cos b)`, needs `cos θ = sin b` and `sin θ = −cos b` — so
     * `θ = b − π/2`. It was `π/2 − b`, the negation, which mirrors the lean in
     * Z: correct near `b = π/2`, and at `b = 0` leaning the flowers *into* the
     * stem instead of away from it.
     *
     * One bearing is shared by the whole spire, so a plant was either right or
     * entirely wrong — which is why it read as "some of them", and why those
     * ones had their bells colliding with the stem and each other.
     */
    const swing = bearing - Math.PI / 2;

    const tube = new THREE.CylinderGeometry(size * 0.22, mouth, long, 7);
    tube.translate(0, -long / 2, 0);
    tube.rotateZ(lean);
    tube.rotateY(swing);
    tube.translate(hx, joint.y, hz);
    parts.push({
      geometry: tube,
      // Paler at the shoulder where the light falls on it, deeper toward the
      // mouth. One flat magenta reads as plastic at any size.
      color: (_x, y) => (y > joint.y - long * 0.45 ? PETAL_PALE : PETAL),
      sway: t,
    });

    // The mouth: a short wider ring at the open end. On the buds it is the
    // closed tip instead — same part, different proportion, so a bud and a
    // bloom are one flower at two ages rather than two models.
    const rim = new THREE.CylinderGeometry(
      mouth * (open > 0.3 ? 1.22 : 0.4),
      mouth * (open > 0.3 ? 1.05 : 0.15),
      size * 0.26,
      7,
    );
    rim.translate(0, -long - size * 0.06, 0);
    rim.rotateZ(lean);
    rim.rotateY(swing);
    rim.translate(hx, joint.y, hz);
    parts.push({ geometry: rim, color: open > 0.3 ? LIP : BUD, sway: t });
  }

  // A cluster of tight buds crowning the tip, so the spire finishes in a point
  // rather than stopping at its last flower.
  const tip = axis(1);
  for (let i = 0; i < 3; i++) {
    const bud = new THREE.IcosahedronGeometry(height * 0.014 * (1 - i * 0.22), 0);
    bud.scale(0.75, 1.5, 0.75);
    bud.translate(
      tip.x + Math.sin(face) * height * 0.01,
      tip.y - i * height * 0.02,
      tip.z + Math.cos(face) * height * 0.01,
    );
    parts.push({ geometry: bud, color: BUD, sway: 1 });
  }

  return parts;
}

export const foxglove = species(
  'foxglove',
  {
    height: [1, 1.8],
    stemThickness: 0.014,
    headSize: [0, 0],
    petals: 0,
    reach: 0,
    petalWidth: 0,
    cup: [0, 0],
    petal: [PETAL],
    centre: PETAL_PALE,
    // Sparse. A foxglove is a biennial that comes up singly where the ground
    // has been disturbed; a bed of them reads as a garden border.
    count: [1, 4],
    spread: 0.3,
    leaves: 2,
    nod: 0,
    head: foxgloveSpire,
  },
  0.6,
);
