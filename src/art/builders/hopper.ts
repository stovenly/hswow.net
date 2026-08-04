import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * A hopper on a trestle: a steel funnel on raked legs, with a chute out of it.
 *
 * Holds coal, ore or sand above whatever is being fed, and empties by gravity.
 * The reason to have one is that it is *top-heavy* — a wide mass carried high
 * on thin legs, which is a silhouette nothing else in the kit makes and a hard
 * contrast against `tank`, whose whole shape is a long horizontal cylinder
 * sitting low.
 *
 * **The inverted funnel is the read.** A square box on legs is a water tower or
 * a shed; what says hopper is that the sides slope inward to a small opening,
 * so it visibly narrows toward the point where the contents leave it.
 *
 * Built as a lathe from a closed profile that never touches the axis, which is
 * the only way a solid of revolution comes out watertight — a profile reaching
 * radius zero revolves into a fan of degenerate slivers at the pole.
 */
export const hopper: MeshBuilder = {
  name: 'hopper',
  category: 'structures',
  radius: 1.3,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // Wide ranges on all of them. A rank of hoppers at one size is a product
    // line, and in a works the coal bunker and the sand hopper share nothing
    // but the shape.
    const mouth = rng.range(0.45, 1.1);
    const throat = mouth * rng.range(0.14, 0.26);
    const taper = mouth * rng.range(1.1, 1.9);
    const collar = mouth * rng.range(0.25, 0.6);
    const stand = rng.range(1.1, 2.6);
    const wall = mouth * 0.05;

    const steel = shade(0x6d757b, rng.range(0.88, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    const rusty = rng.chance(0.45);

    // --- the body ------------------------------------------------------------
    //
    // Up the outside, across the rim, down the inside, across the throat, and
    // closed. Six sides of revolution, so it reads as the folded sheet it would
    // actually be rather than as a turned cone.
    const y0 = stand;
    const y1 = stand + taper;
    const y2 = y1 + collar;
    const profile = [
      new THREE.Vector2(throat, y0),
      new THREE.Vector2(mouth, y1),
      new THREE.Vector2(mouth, y2),
      new THREE.Vector2(mouth - wall, y2),
      new THREE.Vector2(mouth - wall, y1),
      new THREE.Vector2(throat - wall * 0.6, y0),
      // Closing the loop. `LatheGeometry` joins consecutive points and stops.
      new THREE.Vector2(throat, y0),
    ];
    const body = new THREE.LatheGeometry(profile, 6);
    parts.push({
      geometry: body,
      // Streaked below the shoulder on the rusty ones. Evaluated per face at
      // its centroid, so the staining lands on facet boundaries and stays
      // crisp instead of smearing into a gradient.
      color: rusty ? (_x, y) => (y < y1 ? shade(PALETTE.RUST, 0.9) : steel) : steel,
      sway: 0,
    });

    // A stiffening band round the rim, which is what a sheet-steel hopper needs
    // to keep its mouth from folding and what reads as *sheet* rather than cast.
    // **Same facet phase as the body.** The lathe below is six-sided starting
    // at zero; this was turned a further thirtieth of a turn, so the hexagonal
    // rim sat with its corners over the body's flats — a lid off a different
    // bucket. Six-sided cylinders and six-segment lathes only agree if neither
    // is rotated.
    const band = new THREE.CylinderGeometry(mouth * 1.06, mouth * 1.06, wall * 2.4, 6);
    band.translate(0, y2 - wall, 0);
    parts.push({ geometry: band, color: shade(iron, 1.05), sway: 0 });

    // --- the chute -----------------------------------------------------------
    // **Wider than the throat, not narrower.** At 0.92 of it the chute's wall
    // ran up inside the hopper's own wall thickness — two surfaces a couple of
    // millimetres apart, which is a coincident face for every practical purpose
    // and reads as a hole to any test of the solid. A spout collar clamped
    // *round* the outlet is both correct and unambiguous.
    const chute = new THREE.CylinderGeometry(throat * 1.28, throat * 1.28, stand * 0.45, 6);
    chute.translate(0, y0 - stand * 0.18, 0);
    parts.push({ geometry: chute, color: shade(iron, 0.95), sway: 0 });

    // A gate on the side of it. The one moving part, and the thing that says
    // the hopper is *operated* rather than merely full.
    const gate = new THREE.BoxGeometry(throat * 2.4, throat * 0.9, throat * 0.28);
    gate.rotateY(rng.range(0, Math.PI));
    gate.translate(0, y0 - stand * 0.34, 0);
    parts.push({ geometry: gate, color: shade(PALETTE.RUST, 1.08), sway: 0 });

    // --- the trestle ---------------------------------------------------------
    //
    // Raked outward at the foot. Vertical legs under a wide mass look like they
    // are about to fold; splayed ones read as bracing a load.
    // **Legs that reach the hopper.**
    //
    // They did not. They were vertical posts of a fixed height standing on a
    // circle of their own, and the hopper above them narrows to a throat — so
    // the tops of the legs finished out at the mouth's radius while the body at
    // that height was a fifth of it. Four posts under a funnel, touching
    // nothing.
    //
    // The fix is to name the point each leg is carrying: the underside of the
    // rim, where a hopper is actually slung from. Each leg runs from its own
    // foot on the ground to that point, and `rod` spans them exactly.
    const legs = 4;
    const spread = mouth * 1.05;
    const carry = y1 + collar * 0.25;

    for (let i = 0; i < legs; i++) {
      const a = (i / legs) * Math.PI * 2 + Math.PI / 4;
      const foot = new THREE.Vector3(Math.sin(a) * spread, 0, Math.cos(a) * spread);
      // Raked: the foot stands wider than the point it carries, which is what
      // makes a trestle look like it is bracing a load rather than balancing it.
      const top = new THREE.Vector3(Math.sin(a) * mouth * 0.88, carry, Math.cos(a) * mouth * 0.88);

      parts.push({ geometry: rod(foot, top, 0.05, 0.042), color: iron, sway: 0 });

      const pad = new THREE.BoxGeometry(0.18, 0.05, 0.18);
      pad.translate(foot.x, 0.025, foot.z);
      parts.push({ geometry: pad, color: shade(iron, 0.84), sway: 0 });
    }

    // A ring of bracing partway down, tying the legs into a frame. Run between
    // the legs' own midpoints, so it meets them instead of passing near.
    for (let i = 0; i < legs; i++) {
      const a = (i / legs) * Math.PI * 2 + Math.PI / 4;
      const b = ((i + 1) / legs) * Math.PI * 2 + Math.PI / 4;
      const mid = (angle: number): THREE.Vector3 =>
        new THREE.Vector3(
          Math.sin(angle) * (spread + mouth * 0.88) * 0.5,
          carry * 0.45,
          Math.cos(angle) * (spread + mouth * 0.88) * 0.5,
        );
      parts.push({ geometry: rod(mid(a), mid(b), 0.032, 0.03), color: shade(iron, 0.88), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hopper', 0, 'metal-hollow-big');
  },
};
