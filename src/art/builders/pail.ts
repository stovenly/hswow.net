import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

// A milking pail: a coopered bucket with a swing handle, standing out in the
// yard. Two things make it a pail and not a barrel. It tapers hard, about four to
// three, because a bucket is a truncated cone that has to nest and be tipped with
// one hand. And it is open: turned from a profile running up the outside, over the
// rim and back down the inside to a floor, so it is one closed solid with a hollow
// in it. The bail is drawn hanging to one side, which is a pail somebody put down.
export const pail: MeshBuilder = {
  name: 'pail',
  category: 'objects',
  radius: 0.35,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const rim = rng.range(0.14, 0.19);
    const foot = rim * rng.range(0.72, 0.82);
    const tall = rim * rng.range(1.7, 2.1);
    const sides = 9;
    const wall = rim * 0.09;

    const timber = shade(PALETTE.TIMBER, rng.range(0.92, 1.08));
    const iron = shade(PALETTE.IRON, rng.range(0.9, 1.1));

    // Up the outside, over the rim, down the inside, and across the floor. One
    // closed solid with a hollow in it — see the header.
    const profile = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(foot, 0),
      new THREE.Vector2(rim, tall),
      new THREE.Vector2(rim - wall, tall),
      new THREE.Vector2(foot - wall, wall * 1.6),
      new THREE.Vector2(0, wall * 1.6),
    ];
    parts.push({
      geometry: new THREE.LatheGeometry(profile, sides),
      // Shadowed timber down the inside, which sells the hollow at a glance:
      // evaluated per face at its centroid, so the change lands on the rim. Timber
      // and not metal — the staves are the same wood inside and out.
      color: (x, y, z) =>
        y < tall * 0.98 && Math.hypot(x, z) < rim - wall * 0.5
          ? shade(timber, 0.42)
          : shade(timber, rng.range(0.94, 1.06)),
      sway: 0,
    });

    // It has milk in it, which is what stops the inside reading as a dark metal cup:
    // a flat disc a little below the rim, in `WATER`. It is the one horizontal
    // surface on the object.
    const level = tall * rng.range(0.62, 0.78);
    const surface = new THREE.CylinderGeometry(
      foot + (rim - foot) * (level / tall) - wall * 0.6,
      foot + (rim - foot) * (level / tall) - wall * 0.6,
      0.006,
      sides,
    );
    surface.translate(0, level, 0);
    parts.push({ geometry: surface, color: shade(PALETTE.WATER, rng.range(1.15, 1.35)), sway: 0 });

    // Hoops. Two, near the top and the bottom, standing proud.
    for (const at of [0.16, 0.82]) {
      const radius = foot + (rim - foot) * at;
      const hoop = new THREE.CylinderGeometry(radius * 1.05, radius * 1.05, tall * 0.06, sides);
      hoop.translate(0, tall * at, 0);
      parts.push({ geometry: hoop, color: iron, sway: 0 });
    }

    // --- the bail ------------------------------------------------------------
    // Two ears at the rim on opposite sides, and a handle hung between them, lying
    // over to one side. Every point of it is derived from the ear positions.
    const bearing = rng.range(0, Math.PI * 2);
    const ears: THREE.Vector3[] = [];
    for (const side of [-1, 1]) {
      const ex = Math.cos(bearing) * side * rim;
      const ez = Math.sin(bearing) * side * rim;
      const ear = new THREE.BoxGeometry(rim * 0.16, tall * 0.13, rim * 0.16);
      ear.translate(ex, tall * 0.93, ez);
      parts.push({ geometry: ear, color: iron, sway: 0 });
      ears.push(new THREE.Vector3(ex, tall * 0.96, ez));
    }

    // How far over it has fallen: nearly flat on the rim, or part way up.
    const fallen = rng.range(0.55, 1.15) * (rng.chance(0.5) ? 1 : -1);
    // The axis the bail swings about is the line between the ears; the arc is
    // perpendicular to it. Rotating that perpendicular by `fallen` is where the
    // top of the handle has got to.
    const axis = new THREE.Vector3().subVectors(ears[1], ears[0]).normalize();
    const swing = new THREE.Vector3(0, 1, 0).applyAxisAngle(axis, fallen);

    // A round bail, not two rods meeting at a point: the bail is the whole of the
    // object's silhouette from above, and a triangle standing on a bucket reads as a
    // coat hanger. Built in the XY plane spanning ±`bail` with the arc bulging
    // toward +y, then set on a basis whose x is the line between the ears and whose
    // y is the direction it has fallen, so the ends land on the ears at any angle.
    const across = new THREE.Vector3().subVectors(ears[1], ears[0]);
    const bail = across.length() / 2;
    const ex = across.clone().normalize();
    const ey = swing.clone().normalize();
    const ez = new THREE.Vector3().crossVectors(ex, ey).normalize();
    const middle = new THREE.Vector3().addVectors(ears[0], ears[1]).multiplyScalar(0.5);

    const hoop = new THREE.TorusGeometry(bail, rim * 0.035, 4, 12, Math.PI);
    hoop.applyMatrix4(new THREE.Matrix4().makeBasis(ex, ey, ez));
    hoop.translate(middle.x, middle.y, middle.z);
    parts.push({ geometry: hoop, color: iron, sway: 0 });

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'pail', 0);
  },
};
