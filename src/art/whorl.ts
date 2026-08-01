import * as THREE from 'three';
import type { Rng } from './random';

/**
 * One tier of conifer branches: a **ring of separate boughs**, not a cone.
 *
 * A conifer is the one tree in the kit that cannot be built out of blobs. A
 * spruce is not a mass with a trunk under it — it is a stack of flat, drooping
 * plates spaced up a single straight stem, and that stack is the whole reason
 * you can name the species from three hundred metres away in fog.
 *
 * ## The cone was the mistake, and it took art direction to see it
 *
 * The first version of this was a scalloped `ConeGeometry` per tier: a closed
 * rim, pulled in and out a few times around its circumference to break the
 * outline up. It passed every check and it read, correctly, as *a stack of
 * cones* — because that is what it was. Two failures came out of it and they
 * are both structural rather than cosmetic:
 *
 * - **A closed rim has no sky in it.** A real whorl is four to seven separate
 *   arms with daylight between them, and the gaps are most of what says
 *   conifer: a broadleaf's crown is opaque, a spruce's is a grid you can see
 *   the hillside through. Scalloping a disc makes a wavy disc, never a gap.
 * - **Turning each tier at random is not staggering it.** The old build did
 *   rotate every cone by a fresh angle, and it was not enough — partly because
 *   there was nothing to stagger while the rim was closed, and partly because
 *   independent random turns land two tiers nearly on top of each other about
 *   as often as chance says they should. Staggering is a statement about
 *   *neighbours*, so the offset has to be measured from the ring below and
 *   sized against its own bough spacing.
 *
 * Both are fixed by the same change: build the boughs individually, and let the
 * caller carry an `azimuth` forward from tier to tier instead of drawing one.
 * Gaps are then free — leave a slot empty — and the stagger is one addition.
 *
 * ## A bough is two flattened blades, not a stick
 *
 * A spruce branch is wide and thin — a horizontal spray of needles — so a round
 * rod comes out as a spoke on a wheel. Each blade is therefore a four-sided
 * cylinder squashed on its cross-section before it is aimed, which costs
 * nothing and is the difference between a branch and a knitting needle. Two of
 * them per bough, hinged at a knee, because the sweep of a spruce bough is the
 * shape: near-level where it leaves the trunk and falling away at the tip.
 *
 * **The blade is the foliage, and it has to be fat.** The first separate-bough
 * build made each one the thickness of the wood — six centimetres — and art
 * direction's verdict was *where are the leaves, it's just branches*. It was
 * right, and measuring afterwards agreed: seven per cent of the compass
 * occupied at any height. That is a wire armature, not a tree, and the closed
 * cone it replaced was at least *opaque* — trading a wrong solid for a correct
 * skeleton is not progress.
 *
 * A spruce bough is **clothed**. You do not see the branch; you see a dense
 * dark mass with a branch implied inside it, heaviest out toward the tip and
 * thinning back to where it leaves the trunk. There is therefore no stick here
 * at all: the wedge *is* the needle mass, narrow at the leader, widest at about
 * a quarter of its own reach across the knee, and still well over a tenth of it
 * at the tip rather than pinched to a point. Half a dozen of those close most
 * of the circle near the trunk and about a third of it at the rim — dense
 * inside, ragged at the edge, which is what a spruce is.
 *
 * The gaps this file exists to make are therefore *between boughs and between
 * whorls*, never between needles. Read the two notes together or they pull in
 * opposite directions: sky around the circle and sky in the bare leader, solid
 * everywhere a bough actually is.
 *
 * ## Thick in all three axes, not two
 *
 * Widening the blade was still only two thirds of the fix. It stayed a *fin* —
 * long, broad and a hand thick — and the second note back was that the foliage
 * was thin. Two reasons that matters more here than the shape suggests, and
 * both are properties of this project rather than of spruces:
 *
 * - **Flat shading, no textures.** A part thinner than it is wide presents one
 *   face to the light and collapses to a single flat dark shape. Depth is what
 *   gives a bough a lit top and a shaded underside, and that contrast is the
 *   entire read of a conifer past thirty metres.
 * - **The pipeline quantizes to three-pixel blocks.** Anything narrower than a
 *   block at normal viewing distance does not soften, it *aliases* — it flickers
 *   in and out between frames as the tree crosses block boundaries.
 *
 * So the cross-section is now only mildly squashed — about four to one wide
 * against three tall rather than three to one against one — and the count came
 * down to pay for it. Fewer, chunkier parts is the right trade every time here:
 * a spruce is a heavy dark mass and does not need many pieces to say so, and
 * the callers dropped a third of their tiers to make room, which also stopped
 * the fatter boughs closing the bare leader up.
 *
 * **The outer blade starts thinner than the inner one ended.** Two pieces
 * meeting end to end at equal radii and equal side counts make two rings of
 * coincident vertices, every edge in them then belongs to four triangles
 * instead of two, and the watertight check calls that a hole. The bend at the
 * knee usually saves it; on a nearly straight bough it does not, so the radii
 * are mismatched by construction rather than by luck. Same trap, same fix, as
 * `withy.ts`.
 *
 * The old cone version also carried two rules that this one simply does not
 * have — a whole number of lobes, and displacement sampled by angle only — both
 * of which existed to stop the per-vertex rim displacement unzipping the cap
 * from the side. Nothing here displaces a vertex after the fact, so there is
 * nothing left to unzip. That is worth more than it sounds: those were the two
 * ways this file could break silently.
 */
export interface WhorlOptions {
  /** Height on the leader the ring hangs from. */
  y: number;
  /** Nominal reach of a bough. Individual boughs vary a long way either side. */
  radius: number;
  /** How far a tip falls below its attachment, as a fraction of its reach. */
  droop: number;
  /** How many slots the ring is divided into. Some are left empty. */
  slots: number;
  /** Bearing of slot zero. The stagger between one tier and the next lives here. */
  azimuth: number;
  /**
   * Half-width of a bough where it leaves the leader — the woody end, before
   * the needles start. The spray it widens into is sized from the bough's own
   * reach, not from this.
   */
  thickness: number;
  /** Chance a slot is left empty, 0..1 — the sky between the arms. */
  gaps: number;
  /** Height no part of a bough's *surface* may fall below — its depth is allowed for. */
  floor: number;
}

export function whorl(rng: Rng, options: WhorlOptions): THREE.BufferGeometry[] {
  const { y, radius, droop, slots, azimuth, thickness, gaps, floor } = options;
  const pieces: THREE.BufferGeometry[] = [];

  const base = new THREE.Vector3();
  const knee = new THREE.Vector3();
  const tip = new THREE.Vector3();

  for (let s = 0; s < slots; s++) {
    // Sky. A whorl with every slot filled is a disc again, and a spruce that
    // has never lost a branch does not exist.
    if (rng.chance(gaps)) continue;

    // Jittered off the slot, so even a full ring is not a rosette. The jitter
    // is kept under half a slot so two boughs cannot swap places and leave a
    // sixty-degree hole where the eye expects regularity.
    const bearing = azimuth + ((s + rng.around(0, 0.3)) / slots) * Math.PI * 2;
    // **Reach varies hard on purpose.** A clean cone edge is the thing being
    // fixed; the outline wants to be frayed, and a bough two thirds the length
    // of its neighbour is what frays it. The floor is absolute rather than
    // proportional so the topmost tiers still have boughs long enough to build.
    const reach = Math.max(0.1, radius * rng.range(0.66, 1.16));
    const fall = reach * droop * rng.range(0.75, 1.25);

    const cos = Math.cos(bearing);
    const sin = Math.sin(bearing);
    // Started off the axis rather than on it. Boughs all beginning at one
    // coordinate is the standard way to make a mesh that is not closed, and the
    // leader is fat enough to swallow the inset anyway.
    const inset = thickness * 0.8;
    // Where the bough stops being level and starts falling away.
    const bend = rng.range(0.4, 0.6);

    // How much the wedge is squashed against its width, and how far it is
    // rolled off level. Both per bough: a whorl of identically proportioned
    // parts reads as a machine part. Note how close to one this now sits — a
    // bough is a cushion of needles, not a leaf.
    // **A conifer spray is flat.** This sat at 0.72–0.95, which is very nearly
    // round, and combined with a waist a quarter of the bough's reach it made
    // each arm a thirty-centimetre log. That is the note that came back: fat
    // ugly chunks.
    //
    // The correction is not simply "thinner" — an earlier version had these at
    // the thickness of the wood, six centimetres, and they read as bare sticks.
    // What was wrong both times is that only one number was moving. A spruce
    // bough is a *frond*: broad across, shallow through, tapering, and hanging.
    // So the depth comes down hard while the width stays, which is the ratio
    // rather than the size, and it is the ratio that reads.
    const flat = rng.range(0.26, 0.4);
    const roll = rng.around(0, 0.22);
    // The widest point, at the knee. Sized from the bough's reach so a stunted
    // top-tier arm stays in proportion, and floored on the wood so it can never
    // come out thinner than the branch it is growing on.
    const waist = Math.max(thickness * 1.4, reach * rng.range(0.17, 0.23));

    // **The floor holds the surface, not the centreline.** These are drawn
    // before the points are placed for exactly this reason: once a bough became
    // a cushion half a metre deep, clamping its axis to ground level buried a
    // quarter of a metre of it, and the ground plane sliced the bottom of the
    // skirt off in the dead straight line the clamp existed to prevent. Half the
    // vertical depth is added back here so callers can go on passing the height
    // they actually mean.
    const clear = floor + waist * flat;

    base.set(cos * inset, y, sin * inset);
    knee.set(
      cos * (inset + reach * bend),
      Math.max(clear, y - fall * rng.range(0.14, 0.3)),
      sin * (inset + reach * bend),
    );
    tip.set(cos * (inset + reach), Math.max(clear, y - fall), sin * (inset + reach));

    pieces.push(blade(base, knee, thickness, waist, flat, roll));
    pieces.push(
      blade(
        knee,
        tip,
        // Narrower than the piece that ended here — see the note above. The step
        // is small enough to read as the mass thinning rather than as a joint.
        waist * 0.88,
        // **A point, or very nearly.** This was an eighth of the bough's reach
        // — on a metre-long arm, a fifteen-centimetre radius at the very tip —
        // on the argument that a needle mass ends bluntly and that tapering to
        // a point made it read as bare branches. The argument was right about
        // the failure and wrong about the cure: what made it read as sticks was
        // the boughs being *thin all over*, not their ends being sharp. Left
        // blunt and then fattened, the result is a rounded tube with a domed
        // end, which is the wet sock.
        //
        // A real spruce bough narrows steadily and finishes in a fine spray.
        // The mass now lives at the knee, where it belongs, and runs out.
        Math.max(thickness * 0.55, reach * 0.03),
        flat * rng.range(0.92, 1.08),
        roll + rng.around(0, 0.12),
      ),
    );
  }

  return pieces;
}

/**
 * One tapered wedge of needle mass running from a point to another point.
 *
 * Five-sided rather than four. An even count puts a vertex dead centre on the
 * top and the bottom, so a squashed cross-section comes out as a symmetrical
 * roof ridge over a matching keel; an odd one lands the faces asymmetrically and
 * the flat shading gets a different tone on nearly every one of them, which is
 * where a lump of dark green stops looking extruded. Twenty triangles a piece,
 * against sixteen — cheap, and the tier counts came down to pay for it.
 *
 * **Aimed by explicit bearing and pitch rather than by `rod`.** `rod` uses the
 * shortest rotation taking +Y to the direction, which is right for anything
 * with a round cross-section and wrong for anything without one: for a
 * near-horizontal target that rotation leaves the squashed axis lying
 * *sideways*, so the bough comes out as a vertical fin instead of a horizontal
 * cushion. Building the turn as pitch-then-bearing pins the squashed axis to
 * vertical by construction, whatever direction the bough points.
 */
function blade(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radiusFrom: number,
  radiusTo: number,
  flat: number,
  roll: number,
): THREE.BufferGeometry {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const run = Math.hypot(dx, dz);
  const length = Math.hypot(run, dy);

  // Four-sided rather than five. An odd count rounds the cross-section off;
  // four gives a flat top, a flat underside and two crisp side edges, which is
  // what a flattened spray of needles actually presents — and the crisp edge is
  // most of what stops it reading as a tube.
  const geometry = new THREE.CylinderGeometry(radiusTo, radiusFrom, length, 4);
  geometry.translate(0, length / 2, 0);
  // Squash the cross-section while it is still axis-aligned. Doing it after the
  // turn would squash the bough's *droop* as well as its thickness.
  geometry.scale(1, 1, flat);
  // Twist about the bough's own axis, then lay it down, then swing it to its
  // bearing. In that order the squashed axis ends up vertical.
  geometry.rotateY(roll);
  geometry.rotateX(Math.PI / 2 + Math.atan2(-dy, run));
  geometry.rotateY(Math.PI / 2 - Math.atan2(dz, dx));
  geometry.translate(from.x, from.y, from.z);
  return geometry;
}
