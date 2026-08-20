import * as THREE from 'three';
import type { Part } from '../assemble';
import { species, type HeadContext } from '../flower';

// Foxglove: a tall spire with bells hanging down one side of it — the kit's
// vertical flower. Two rules carry it. The bells are joined to the spire at the
// shoulder and hang from it, with the angle carrying the mouth clear: forty
// degrees at the most open, sixteen at a bud, because a foxglove seen from the
// side shows almost no mouth at all. And they are all on one side — a spire
// flowered evenly round its stem is a hyacinth. Two parts to a flower, a tube and
// the ring at its mouth.

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
    // ±0.38 rather than ±0.16: a nine-degree fan puts consecutive bells almost
    // directly above one another and the big lower ones intersect. Still
    // unmistakably one-sided, which is the rule, but each bell gets its own column.
    const bearing = face + rng.range(-0.38, 0.38);

    // Big at the bottom, small at the top. A spike flowers from the base
    // upward over weeks, so at any moment it is graded — and the grading is
    // most of what makes it read as growing rather than as ornament.
    const size = height * 0.09 * (1 - u * 0.55);
    // The top few are still shut: shorter, narrower, and standing closer in.
    const open = Math.min(1, Math.max(0, 1.35 - u * 1.8));

    // `outward` is the horizontal direction away from the spire at this bearing.
    // Both the offset and the lean below are derived from it, which is the point of
    // naming it — computed separately, they disagreed by a sign.
    const outward = { x: Math.sin(bearing), z: Math.cos(bearing) };

    // The shoulder attaches to the stem and does not stand off it: kept below the
    // tube's own top radius, so it always straddles the stem axis and is buried in
    // it. The pedicel is invisible at this scale, so the join wants to be closed.
    const out = size * 0.12;
    const hx = joint.x + outward.x * out;
    const hz = joint.z + outward.z * out;

    const long = size * (0.8 + open * 0.9);
    const mouth = size * (0.2 + open * 0.28);

    // Hung from its shoulder, pointing down and swinging out. With the shoulder
    // buried in the stem, the angle is the only thing carrying a bell clear of its
    // neighbours — sixteen degrees at a bud, forty at the most open. Past about
    // sixty the mouth comes into view from the side and a bell becomes a trumpet.
    const lean = 0.28 + open * 0.42;

    /**
     * The Y rotation that carries the lean out along `outward`. `rotateZ(lean)` tips
     * a downward bell toward +X, and `rotateY(θ)` sends +X to `(cos θ, 0, −sin θ)`;
     * for that to equal `(sin b, 0, cos b)` needs `θ = b − π/2`. The negation,
     * `π/2 − b`, mirrors the lean in Z — right near `b = π/2` and, at `b = 0`,
     * leaning the flowers into the stem instead of away from it.
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
