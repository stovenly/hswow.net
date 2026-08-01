import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * A peg rail with a coat, a hat and whatever else got hung up.
 *
 * **The only soft mass in the room, and it is at head height.** Everything else
 * a hut contains is hard, flat-sided and either on the floor or on a shelf; a
 * hanging coat is a lumpy vertical blob with no straight edge anywhere on it,
 * which is exactly the silhouette the rest of the set cannot produce. It also
 * says a *person* lives here rather than a household — a coat on a peg is one
 * specific absent human being.
 *
 * **Not every peg is used, and that is the point.** A rail with something on
 * every hook is a shop display; a rail with two things on six pegs is a rail
 * somebody hangs their coat on. The empty ones are free — they are already
 * drawn — and they do more work than a third coat would.
 *
 * The coat is a stack of boxes that widen at the shoulder and taper to the hem,
 * each turned a little off its neighbour. It was one tall box first, which
 * reads as a plank painted brown; the give-away is that cloth has no vertical
 * edges, so every slab here disagrees with the one above it about which way it
 * faces.
 *
 * Built against a wall at z = 0, hanging into +Z.
 */

/** What can be on a peg. Weighted by repetition — coats are the common case. */
const KINDS = ['coat', 'coat', 'hat', 'bag', 'rope'] as const;
type Load = (typeof KINDS)[number];

const _up = new THREE.Vector3(0, 1, 0);
const _turn = new THREE.Quaternion();
export const wallPegs: MeshBuilder = {
  name: 'wall-pegs',
  category: 'furniture',
  radius: 0.65,
  // A coat hanging off a wall is not a thing to be stopped by, and the rail is
  // flat against the wall the player is already stopped by.
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const railY = rng.range(1.5, 1.76);
    const railLength = rng.range(0.7, 1.3);
    const timber = rng.chance(0.5) ? PALETTE.TIMBER_DARK : PALETTE.BARK_PALE;

    const rail = new THREE.BoxGeometry(railLength, rng.range(0.08, 0.11), 0.028);
    rail.translate(0, railY, 0.014);
    parts.push({ geometry: rail, color: timber, sway: 0 });

    // Two blocks holding the rail off the wall — the small step that stops it
    // reading as a stripe painted on the plaster.
    for (const sx of [-1, 1]) {
      const block = new THREE.BoxGeometry(rng.range(0.05, 0.07), 0.14, 0.02);
      block.translate((sx * railLength * 0.86) / 2, railY, 0.008);
      parts.push({ geometry: block, color: shade(timber, 0.82), sway: 0 });
    }

    const pegCount = rng.int(3, 6);
    const pegSpan = railLength * 0.78;
    const xs = Array.from({ length: pegCount }, (_, i) =>
      pegCount === 1 ? 0 : -pegSpan / 2 + (i / (pegCount - 1)) * pegSpan,
    );

    // At least one peg is loaded, chosen before the loop. A rail that rolls
    // empty is a rail, and there is no shortage of rails in this world.
    const mustLoad = rng.int(0, pegCount - 1);

    // **What goes on a peg is decided before anything is built, because it
    // depends on the neighbours.** Six pegs on a short rail are a hand's width
    // apart, and a hat brim is 36 cm across — so two loaded pegs side by side
    // put a hat through a coat, a coat through a bag, or two brims through each
    // other, which is what every one of the reported clashes was. Rolling each
    // peg independently cannot see that coming.
    //
    // Measured in metres rather than in pegs. "Not adjacent" is the wrong rule:
    // on a long rail with three pegs, adjacent is fine, and on a short one with
    // six, every other peg still collides. What matters is whether the two
    // things actually reach each other, so each kind declares how far it hangs
    // out from its peg and a candidate is refused if it would come within
    // three centimetres of anything already up.
    const REACH: Record<Load, number> = { coat: 0.22, hat: 0.19, rope: 0.17, bag: 0.14 };
    const load = new Array<Load | null>(pegCount).fill(null);
    const hang = (i: number, kind: Load): void => {
      for (let j = 0; j < pegCount; j++) {
        const other = load[j];
        if (!other) continue;
        if (Math.abs(xs[i] - xs[j]) < REACH[kind] + REACH[other] + 0.03) return;
      }
      load[i] = kind;
    };

    // The guaranteed one first, so it can never be the one crowded out.
    hang(mustLoad, rng.pick(KINDS));
    for (let i = 0; i < pegCount; i++) {
      // **More generous than it was, because the clearance test is now the
      // thing keeping a rail from looking cluttered.** At 0.4 — the old odds,
      // set when every roll landed something — half of all rails came out with
      // a single item on them, because most candidates were now being refused
      // for room. Rolling more often and letting the spacing say no puts the
      // count back where it was.
      if (i === mustLoad || !rng.chance(0.62)) continue;
      hang(i, rng.pick(KINDS));
    }

    for (let i = 0; i < pegCount; i++) {
      const x = xs[i];

      // Sticking out and canted upward, which is what stops a coat sliding off.
      // Turned, so the tip is fatter than the root — every peg that ever held
      // anything is.
      const root = new THREE.Vector3(x, railY - rng.range(0, 0.012), 0.02);
      const tip = new THREE.Vector3(x, railY + rng.range(0.02, 0.04), rng.range(0.09, 0.13));
      const pegRoot = rng.range(0.013, 0.017);
      const pegTip = rng.range(0.017, 0.022);
      parts.push({
        geometry: rod(root, tip, pegRoot, pegTip, 6),
        color: shade(timber, rng.range(0.95, 1.15)),
        sway: 0,
      });

      const kind = load[i];
      if (!kind) continue;

      const hangZ = tip.z * 0.72;

      if (kind === 'coat') {
        const cloth = rng.pick([PALETTE.CLOTH, PALETTE.WOOL, PALETTE.LEAF_DARK, PALETTE.HIDE, PALETTE.STONE_DARK]);
        const drop = rng.range(0.45, 0.8);
        const shoulder = rng.range(0.24, 0.34);
        const slabs = rng.int(3, 5);

        // Sway weight rises toward the hem, which is the free end. Nothing
        // indoors should move much and cloth in a hut moves least of all, so
        // this tops out low — and it is multiplied to nothing anyway until
        // `wall-pegs` appears in `FLEX`.
        const stir = (_x: number, y: number): number => {
          const t = Math.max(0, Math.min(1, (railY - y) / drop));
          return t * t * (3 - 2 * t) * 0.12;
        };

        for (let s = 0; s < slabs; s++) {
          const t = s / (slabs - 1);
          const top = railY - 0.02 - t * drop * 0.92;
          const height = (drop * 1.06) / slabs;
          const slab = new THREE.BoxGeometry(
            shoulder * (1 - t * rng.range(0.18, 0.34)),
            height,
            rng.range(0.07, 0.12) * (1 - t * 0.3),
          );
          slab.rotateY(rng.around(0, 0.22));
          slab.rotateZ(rng.around(0, 0.09));
          slab.translate(x + rng.around(0, 0.02), top - height / 2, hangZ + rng.around(0, 0.012));
          parts.push({ geometry: slab, color: shade(cloth, rng.range(0.88, 1.1)), sway: stir });
        }

        // A collar, so the top of the coat is not simply the widest slab.
        const collar = new THREE.BoxGeometry(shoulder * 0.42, 0.06, 0.09);
        collar.rotateY(rng.around(0, 0.2));
        collar.translate(x, railY + 0.005, hangZ);
        parts.push({ geometry: collar, color: shade(cloth, 1.14), sway: 0 });
      } else if (kind === 'hat') {
        const feltColor = shade(rng.pick([PALETTE.HIDE_DARK, PALETTE.CLOTH, PALETTE.EARTH]), rng.range(0.9, 1.1));
        const brimR = rng.range(0.13, 0.18);
        const crownH = rng.range(0.1, 0.15);
        // Felt, and the brim's own thickness. The one number the whole shape
        // hangs off: it is what makes the crown a shell rather than a plug.
        const felt = 0.011;
        const brimT = rng.range(0.014, 0.02);
        // Crown radius where it meets the brim.
        const Rb = brimR * 0.66;

        // **A hollow shell, threaded onto the peg.** Two versions of this were
        // wrong in the same way: the crown was a solid cylinder and the brim a
        // solid disc, so wherever the hat was put the peg went *through felt*.
        // There was no hole for it to go through — nothing here was hollow.
        //
        // So the crown is turned as one closed profile that goes out across the
        // mouth, up the outside, over the top and back down the inside: a real
        // cavity, open toward the wall, with the peg inside it. Watertight
        // because the profile is a closed loop that never reaches the axis,
        // which is the rule this kit learned the hard way about lathes.
        const profile = [
          // Out across the mouth face, from the inner rim to the brim edge.
          new THREE.Vector2(Rb - felt, 0),
          new THREE.Vector2(brimR, 0),
          // The brim's edge and its room-side face.
          new THREE.Vector2(brimR * 0.985, brimT),
          new THREE.Vector2(Rb, brimT),
          // Up the outside of the crown and over the dome.
          new THREE.Vector2(Rb * 0.95, crownH * 0.62),
          new THREE.Vector2(Rb * 0.7, crownH * 0.93),
          new THREE.Vector2(0.006, crownH),
          // And back down the inside, a felt's thickness in.
          new THREE.Vector2(0.005, crownH - felt * 0.8),
          new THREE.Vector2(Rb * 0.7 - felt * 0.8, crownH * 0.93 - felt * 0.5),
          new THREE.Vector2(Rb * 0.95 - felt, crownH * 0.62),
          new THREE.Vector2(Rb - felt, brimT),
          // Closing the loop on the first point.
          new THREE.Vector2(Rb - felt, 0),
        ];

        // **Nearly face-on to the wall, drooping a little.** A hat dangling off
        // one point of its rim does not line up with the peg it is on — it
        // hangs where gravity leaves it — and lining it up is in any case
        // ruinous here, because the pegs cant upward by twenty to thirty
        // degrees and a brim swung round to match reaches a full
        // `brimR·sin(30°)` back into the plaster. Six to eight degrees of droop
        // off horizontal is the whole tilt.
        const droop = rng.range(0.06, 0.14);
        const axis = new THREE.Vector3(0, -Math.sin(droop), Math.cos(droop));

        // Far enough off the wall that the lowest point of the tilted brim ring
        // still clears it. This is the term the last version got wrong: the
        // ring reaches `brimR·sin(tilt)` back along Z, and the tilt that
        // matters is the hat's own, not any part of the peg's.
        const zMouth = brimR * Math.sin(droop) + 0.014;
        // How far the peg gets in. Under half the crown's depth, so the tip is
        // always well short of the dome.
        const reach = Math.min(tip.z - zMouth, crownH * 0.45);
        const t = (zMouth - root.z) / (tip.z - root.z);
        const pegR = pegRoot + (pegTip - pegRoot) * t;

        // **How far it hangs is whatever is left over after the peg fits.** The
        // peg rises as it leaves the wall and the hat's axis falls, so the two
        // pull apart along the whole of the peg's travel; the cavity meanwhile
        // narrows toward the dome. Solved at the deepest point rather than
        // guessed: cavity radius there, less the peg, less the divergence. When
        // that comes out at nothing the hat simply sits on the peg square,
        // which is a hat pushed right on rather than a hat with the peg through
        // the side of its crown.
        const spread = reach * ((tip.y - root.y) / (tip.z - root.z) + Math.tan(droop));
        const narrow = (Rb - felt) * (1 - 0.35 * (reach / crownH) ** 2);
        const drop = Math.max(0, narrow - pegR - spread - 0.004);
        const mouth = new THREE.Vector3(x, root.y + (tip.y - root.y) * t - drop, zMouth);

        const crown = new THREE.LatheGeometry(profile, 8);
        crown.applyQuaternion(_turn.setFromUnitVectors(_up, axis));
        crown.translate(mouth.x, mouth.y, mouth.z);
        parts.push({ geometry: crown, color: feltColor, sway: 0 });

        // The profile stops a few millimetres short of the axis, so the turned
        // shell has a small hole through the very top of the crown. Plugged
        // with a button, which hats have anyway — cheaper and safer than a
        // profile that touches the axis and turns every triangle at the pole
        // degenerate.
        const apex = mouth.clone().addScaledVector(axis, crownH - felt * 0.4);
        const button = new THREE.SphereGeometry(0.015, 6, 4);
        button.translate(apex.x, apex.y, apex.z);
        parts.push({ geometry: button, color: shade(feltColor, 0.86), sway: 0 });
      } else if (kind === 'bag') {
        const leather = shade(rng.pick([PALETTE.HIDE, PALETTE.HIDE_DARK, PALETTE.TIMBER_DARK]), rng.range(0.9, 1.1));
        const bagW = rng.range(0.17, 0.24);
        const bagH = rng.range(0.18, 0.26);
        const top = railY - rng.range(0.14, 0.24);

        // **A satchel hangs by a loop over the hook, and the loop has to be
        // there.** The two runs of strap used to rise straight up from the
        // bag's corners and stop at rail height, side by side, touching
        // nothing — a bag suspended from thin air next to a peg that was not
        // holding it. They now converge on a gathering point just in front of
        // and below the peg, and a separate piece goes up from there, over the
        // peg and down behind it, which is the part that does the hanging.
        //
        // Where the strap crosses the timber, and how far above the peg's axis
        // its own surface has to sit to lie *on* the peg rather than through
        // it: the peg's radius there plus the strap's own.
        const cross = root.clone().lerp(tip, 0.55);
        const strapR = 0.009;
        const overR = pegRoot + (pegTip - pegRoot) * 0.55 + strapR;
        const gather = new THREE.Vector3(x, cross.y - 0.05, cross.z + 0.028);

        // Both runs start *inside* the bag and end at slightly different points
        // on the gather, at different radii. Two rods ending on one point at
        // one radius share a vertex ring, which is the congruent-parts failure
        // `art-check` exists to catch.
        for (const sx of [-1, 1]) {
          parts.push({
            geometry: rod(
              new THREE.Vector3(x + sx * bagW * 0.34, top - 0.02, hangZ + 0.012),
              gather.clone().add(new THREE.Vector3(sx * 0.006, sx * 0.003, 0)),
              strapR,
              strapR * 0.85,
              4,
            ),
            color: shade(leather, sx > 0 ? 1.04 : 0.96),
            sway: 0,
          });
        }

        // Up the front of the peg, over the top of it, and down the back. The
        // second run starts back inside the first rather than at its end, for
        // the same reason as above — a chain of rods meeting at equal radii
        // leaves two coincident rings at the joint.
        const crest = new THREE.Vector3(x, cross.y + overR, cross.z + 0.004);
        parts.push({
          geometry: rod(gather, crest, strapR, strapR * 0.9, 4),
          color: shade(leather, 1.08),
          sway: 0,
        });
        parts.push({
          geometry: rod(
            gather.clone().lerp(crest, 0.82),
            new THREE.Vector3(x, cross.y - 0.03, Math.max(cross.z - 0.042, 0.012)),
            strapR * 0.78,
            strapR * 0.7,
            4,
          ),
          color: shade(leather, 0.92),
          sway: 0,
        });

        const bag = new THREE.BoxGeometry(bagW, bagH, rng.range(0.07, 0.1));
        bag.rotateY(rng.around(0, 0.16));
        bag.translate(x, top - bagH / 2 + 0.02, hangZ + 0.012);
        parts.push({ geometry: bag, color: leather, sway: 0 });

        // The flap. A satchel without one is a box on two strings.
        const flap = new THREE.BoxGeometry(bagW * 1.04, bagH * 0.4, 0.02);
        flap.translate(x, top - bagH * 0.2 + 0.02, hangZ + 0.012 + rng.range(0.04, 0.055));
        parts.push({ geometry: flap, color: shade(leather, 1.15), sway: 0 });
      } else {
        // A coil of rope. The torus is the cheapest closed shape in three that
        // is unmistakably not furniture — and the only thing here with a hole
        // already in it, so the peg has somewhere to go.
        const coilR = rng.range(0.09, 0.13);
        const tube = rng.range(0.02, 0.03);

        // **Hung so the peg is through the hole.** It used to drop by a rolled
        // 0.8–1.0 of its own radius, which put the peg squarely through the
        // rope at the top of the ring rather than through the gap in the middle
        // — the coil was pierced, not hung.
        //
        // The peg crosses the coil's plane at an angle, since it cants upward
        // as it leaves the wall, so its cross-section there is an ellipse
        // rather than a circle and the clearance needed is a little more than
        // its radius. Everything left over after that is how far the coil
        // hangs, which is what makes it look like it is resting on something.
        const t = (hangZ - root.z) / (tip.z - root.z);
        const pegR = pegRoot + (pegTip - pegRoot) * t;
        const hole = coilR - tube;
        const drop = Math.max(0, hole - pegR * 1.2 - 0.006);

        const coil = new THREE.TorusGeometry(coilR, tube, 4, 9);
        // About Y only, which leaves the top of the ring — the part resting on
        // the peg — exactly where it was.
        coil.rotateY(rng.around(0, 0.25));
        coil.translate(x, root.y + (tip.y - root.y) * t - drop, hangZ);
        parts.push({ geometry: coil, color: shade(PALETTE.CLOTH, rng.range(0.85, 1.05)), sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'wall-pegs', 0);
  },
};
