import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE } from '../palette';

// A stool: a seat and three or four legs. Three never rocks on an uneven floor,
// which is why a milking stool has three; four is what a joiner makes to match a
// table. So three-legged stools get a round seat and splayed legs and four-legged
// ones a squarer seat and straighter legs. Legs splay outward either way — a stool
// with vertical legs looks like a box on stilts.
export const stool: MeshBuilder = {
  name: 'stool',
  category: 'furniture',
  radius: 0.42,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const legCount = rng.chance(0.45) ? 3 : 4;
    const height = rng.range(0.42, 0.56);
    const seatRadius = rng.range(0.16, 0.23);
    const seatThickness = rng.range(0.04, 0.07);
    const timber = rng.chance(0.5) ? PALETTE.TIMBER : PALETTE.TIMBER_DARK;
    const legTimber = timber === PALETTE.TIMBER ? PALETTE.TIMBER_DARK : PALETTE.TIMBER;

    // Round seat on three legs, squarer on four. Six sides rather than a true
    // circle: at this polygon count a cylinder with more segments costs
    // triangles nobody can see, and the facets are the look.
    const seat =
      legCount === 3
        ? new THREE.CylinderGeometry(seatRadius, seatRadius * 0.96, seatThickness, 6)
        : new THREE.BoxGeometry(seatRadius * 1.9, seatThickness, seatRadius * 1.9);
    seat.translate(0, height - seatThickness / 2, 0);
    if (legCount === 4) seat.rotateY(rng.around(0, 0.2));
    parts.push({ geometry: seat, color: timber, sway: 0 });

    const drop = height - seatThickness;
    /**
     * Splay angle, from vertical. Legs are wider at the floor than at the seat: the
     * footprint has to be bigger than the seat or the stool tips when you lean.
     * Each leg is rotated about its top, so the joint with the seat stays where it
     * was put and the foot is what swings out.
     */
    const splay = rng.range(0.14, 0.26);
    // Where the legs meet the underside of the seat. Inside the rim, so the
    // joint is covered rather than poking out of the edge.
    const topRadius = seatRadius * 0.66;
    // Longer than the drop, because a tilted leg has further to travel to
    // reach the floor. Without this the stool hangs above the ground.
    const legLength = drop / Math.cos(splay);

    for (let i = 0; i < legCount; i++) {
      const angle = (i / legCount) * Math.PI * 2 + (legCount === 4 ? Math.PI / 4 : 0);
      const thickness = rng.range(0.035, 0.05);
      // Outward direction for this leg. Paired with `rotateY(-angle)` below,
      // which is what maps the tilt's +X onto it.
      const outX = Math.cos(angle);
      const outZ = Math.sin(angle);

      const leg = new THREE.BoxGeometry(thickness, legLength, thickness);
      // Hangs *below* the origin, so the origin is the leg's top and the
      // rotations that follow pivot there.
      leg.translate(0, -legLength / 2, 0);
      // Swings the foot toward +X, then turns that onto the leg's own bearing.
      leg.rotateZ(splay);
      leg.rotateY(-angle);
      leg.translate(outX * topRadius, drop, outZ * topRadius);
      parts.push({ geometry: leg, color: legTimber, sway: 0 });
    }

    // Where the feet ended up, for the stretcher below.
    const footRadius = topRadius + legLength * Math.sin(splay);

    // A stretcher ring low down on some of them, which is what stops a stool
    // racking itself apart. Only on four legs — a three-legged stool does not
    // need one and does not get one.
    if (legCount === 4 && rng.chance(0.45)) {
      const at = rng.range(0.28, 0.38);
      // Sized to where the legs actually are at that height, rather than to
      // the seat — the legs are splayed, so a rail cut to the seat's width
      // stops short in mid-air.
      const spread = topRadius + (footRadius - topRadius) * (1 - at);
      for (const axis of [0, Math.PI / 2]) {
        const rail = new THREE.BoxGeometry(spread * 2, 0.028, 0.028);
        rail.translate(0, drop * at, 0);
        rail.rotateY(axis + Math.PI / 4);
        parts.push({ geometry: rail, color: legTimber, sway: 0 });
      }
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'stool', 0);
  },
};
