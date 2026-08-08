import * as THREE from 'three';
import type { MeshBuilder } from './types';
import { assemble, finish, type Part } from './assemble';
import { createRng } from './random';
import { PALETTE } from './palette';
import type { Finish, FinishName, Grain } from './finish';

/**
 * Gallery fixtures for the finish stage (SHADERS-AND-MATERIALS.md, M0–M2): a
 * faceted orb on a plinth, a slab, and a cloth drape. Built only as far as
 * judging a finish needs — the facets are the point, because a flat-shaded
 * highlight is caught and released a facet at a time.
 *
 * Fixtures rather than props, and the difference is the shape: nothing in the
 * world is a sphere, which is exactly why a sphere is the thing to tune
 * against — it presents every angle at once, so one look answers what a whole
 * walk around a prop would.
 */

/** An orb of the given finish on a plain stone plinth. */
export function finishOrb(name: string, color: number, coat: FinishName | Finish): MeshBuilder {
  return {
    name,
    category: 'objects',
    radius: 0.7,

    build({ seed = 1, scale = 1 } = {}) {
      const rng = createRng(seed);
      const parts: Part[] = [];

      const stand = rng.range(0.45, 0.7);
      const across = rng.range(0.34, 0.46);
      const plinth = new THREE.BoxGeometry(across, stand, across);
      plinth.translate(0, stand / 2, 0);
      plinth.rotateY(rng.around(0, 0.4));
      parts.push({ geometry: plinth, color: PALETTE.STONE_DARK, sway: 0 });

      // **Subdivided twice, and the count is doing real work.** At eighty
      // faces the facets are twenty degrees apart, which is wider than any
      // specular lobe worth having — so a highlight lands between facets and
      // the metal reads as painted clay with a lumpy silhouette. Three hundred
      // and twenty faces is where a reflection becomes a gradient instead of a
      // patchwork. Still flat-shaded, still faceted up close; a fixture is
      // where a finish is judged, and it should not be fighting its own shape.
      const radius = rng.range(0.26, 0.36);
      const orb = new THREE.IcosahedronGeometry(radius, 2);
      orb.rotateY(rng() * Math.PI);
      orb.translate(0, stand + radius * 0.82, 0);
      parts.push({ geometry: orb, color, sway: 0, finish: coat });

      const geometry = assemble(parts);
      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, name, 0);
    },
  };
}

/**
 * A cloth panel hung in a timber frame.
 *
 * Cloth wants folds, not a sphere: the anisotropic stretch and the sheen rim
 * are both about a surface turning, and a drape turns in one direction over and
 * over. The folds are a sine on a subdivided box — a pure function of position,
 * so both faces move together and the solid stays closed, which a sheet of
 * quads would not.
 *
 * Hung taut rather than swaying. The sway shader scales displacement by height
 * above the origin, so a cloth fixed at its *top* would move most where it is
 * nailed down; grain stability under sway is by construction anyway, since the
 * axis rides the normal matrix and sway never touches it.
 */
export function finishDrape(
  name: string,
  color: number,
  coat: FinishName | Finish,
  grain?: Grain,
): MeshBuilder {
  return {
    name,
    category: 'objects',
    radius: 1.0,

    build({ seed = 1, scale = 1 } = {}) {
      const rng = createRng(seed);
      const parts: Part[] = [];

      const span = rng.range(1.1, 1.5);
      const stand = rng.range(1.7, 2.1);
      const post = 0.07;

      for (const side of [-1, 1]) {
        const leg = new THREE.BoxGeometry(post, stand, post);
        leg.translate((side * span) / 2, stand / 2, 0);
        parts.push({ geometry: leg, color: PALETTE.TIMBER_DARK, sway: 0 });
      }
      // **Not flush with the posts, in any of the three dimensions.** A rail
      // exactly as wide as the posts' outer faces shares their corner vertices
      // exactly, and two closed boxes sharing a vertex make an edge that
      // belongs to four faces — which is a watertightness failure and looks
      // completely correct. Overhanging is both sounder and what a rail does.
      const rail = new THREE.BoxGeometry(span + post * 1.7, post * 0.85, post * 1.25);
      rail.translate(0, stand - post * 0.55, 0);
      parts.push({ geometry: rail, color: PALETTE.TIMBER_DARK, sway: 0 });

      // Enough segments across to carry folds, few enough that each facet is a
      // face you can see catch the light.
      const width = span - post * 2;
      const drop = stand * rng.range(0.66, 0.76);
      const cloth = new THREE.BoxGeometry(width, drop, 0.02, 14, 5, 1);
      // Hung from inside the rail rather than level with its underside, so the
      // top edge is buried and there is no seam to notice.
      const top = stand - post * 0.8;
      cloth.translate(0, top - drop / 2, 0);

      const folds = rng.range(3.2, 4.6);
      const phase = rng() * Math.PI;
      const depth = rng.range(0.05, 0.085);
      const position = cloth.getAttribute('position');
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        // Deeper toward the hem, where a hung cloth has slack to gather.
        const slack = 0.25 + 0.75 * Math.min(Math.max((top - y) / drop, 0), 1);
        position.setZ(i, position.getZ(i) + Math.sin(x * folds + phase) * depth * slack);
      }
      // Stale normals would be the edge detector's, not the surface's — flat
      // shading takes its normal from derivatives, the normal pass does not.
      cloth.computeVertexNormals();
      parts.push({ geometry: cloth, color, sway: 0, finish: coat, grain });

      const geometry = assemble(parts);
      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, name, 0);
    },
  };
}

/**
 * A standing column, for reading a finish across large flat faces rather than
 * across facets.
 *
 * Everything varies with the seed: the shaft profile, how many drums it is
 * stacked from, the ornament between them, the capital and the finial. The
 * whole column takes one rotation, not one per piece — square drums turned
 * independently do not line up and the column reads as broken.
 */
export function finishColumn(name: string, color: number, coat: FinishName | Finish): MeshBuilder {
  return {
    name,
    category: 'objects',
    radius: 0.9,

    build({ seed = 1, scale = 1 } = {}) {
      const rng = createRng(seed);
      const parts: Part[] = [];
      const add = (geometry: THREE.BufferGeometry, y: number): void => {
        geometry.translate(0, y, 0);
        parts.push({ geometry, color, sway: 0, finish: coat });
      };

      const width = rng.range(0.26, 0.36);
      // 4 is a square shaft; the rest are turned. Which it is decides the
      // ornament, because a torus round a square shaft reads as a mistake.
      const sides = rng.pick([4, 4, 6, 8, 12]);
      const square = sides === 4;
      const turn = rng.around(0, 0.35);

      // --- base: stepped slabs, widest first ---------------------------------
      let y = 0;
      const steps = rng.int(2, 3);
      for (let i = 0; i < steps; i++) {
        const spread = 2.0 - i * 0.28;
        const thick = rng.range(0.07, 0.12);
        add(new THREE.BoxGeometry(width * spread, thick, width * spread), y + thick / 2);
        y += thick;
      }

      // --- shaft -------------------------------------------------------------
      const drums = rng.int(2, 4);
      const drumHeight = rng.range(0.32, 0.5);

      for (let drum = 0; drum < drums; drum++) {
        const taper = 1 - drum * rng.range(0.02, 0.05);
        const half = (width / 2) * taper;

        if (square) {
          add(new THREE.BoxGeometry(width * taper, drumHeight, width * taper), y + drumHeight / 2);
          // Chamfer: the same block turned an eighth, slightly narrower, so
          // the corners read as cut back rather than sharp.
          if (rng.chance(0.5)) {
            const chamfer = new THREE.BoxGeometry(
              width * taper * 1.06,
              drumHeight * 0.98,
              width * taper * 1.06,
            );
            chamfer.rotateY(Math.PI / 4);
            add(chamfer, y + drumHeight / 2);
          }
        } else {
          add(new THREE.CylinderGeometry(half, half * 1.03, drumHeight, sides), y + drumHeight / 2);
        }

        // Flutes up the faces.
        if (rng.chance(0.5)) {
          const count = square ? 4 : sides;
          const reach = half * (square ? 1.02 : 0.98);
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (square ? Math.PI / 4 : Math.PI / count);
            const flute = new THREE.BoxGeometry(
              rng.range(0.022, 0.04),
              drumHeight * rng.range(0.7, 0.86),
              rng.range(0.022, 0.04),
            );
            flute.translate(Math.cos(angle) * reach, 0, Math.sin(angle) * reach);
            add(flute, y + drumHeight / 2);
          }
        }

        y += drumHeight;

        // --- ornament between drums ------------------------------------------
        if (drum < drums - 1) {
          const kind = rng.int(0, 3);
          if (square || kind === 0) {
            // A squared collar, and a second one turned an eighth over it.
            const thick = rng.range(0.05, 0.08);
            add(new THREE.BoxGeometry(width * 1.3, thick, width * 1.3), y + thick / 2);
            const cap = new THREE.BoxGeometry(width * 1.16, thick * 0.7, width * 1.16);
            cap.rotateY(Math.PI / 4);
            add(cap, y + thick);
            y += thick * 1.35;
          } else if (kind === 1) {
            const ring = new THREE.TorusGeometry(width * 0.58, rng.range(0.03, 0.05), 6, sides * 2);
            ring.rotateX(Math.PI / 2);
            add(ring, y);
            y += 0.01;
          } else if (kind === 2) {
            // A knot, sitting proud of the shaft.
            const knot = new THREE.TorusKnotGeometry(width * 0.42, width * 0.1, 48, 5, 2, 3);
            knot.rotateX(Math.PI / 2);
            add(knot, y + width * 0.1);
            y += width * 0.2;
          } else {
            // A pinched waist: two cones meeting.
            const h = rng.range(0.1, 0.16);
            add(new THREE.ConeGeometry(width * 0.62, h, sides), y + h / 2);
            const under = new THREE.ConeGeometry(width * 0.62, h, sides);
            under.rotateX(Math.PI);
            add(under, y + h * 1.5);
            y += h * 2;
          }
        }
      }

      // --- capital -----------------------------------------------------------
      const flare = rng.range(0.1, 0.16);
      add(
        new THREE.CylinderGeometry(width * 0.88, width * 0.46, flare, square ? 4 : sides * 2),
        y + flare / 2,
      );
      y += flare;
      // Corbels: stepped slabs out to the abacus.
      const corbels = rng.int(1, 2);
      for (let i = 0; i < corbels; i++) {
        const thick = rng.range(0.05, 0.08);
        const spread = 1.45 + i * 0.22;
        add(new THREE.BoxGeometry(width * spread, thick, width * spread), y + thick / 2);
        y += thick;
      }

      // --- finial ------------------------------------------------------------
      const lift = rng.range(0.1, 0.17);
      const crown = rng.int(0, 4);
      if (crown === 0) {
        add(new THREE.DodecahedronGeometry(lift), y + lift * 0.95);
      } else if (crown === 1) {
        add(new THREE.OctahedronGeometry(lift * 1.15), y + lift);
      } else if (crown === 2) {
        add(new THREE.ConeGeometry(lift * 0.78, lift * 2.6, square ? 4 : sides), y + lift * 1.3);
      } else if (crown === 3) {
        const knot = new THREE.TorusKnotGeometry(lift * 0.6, lift * 0.2, 64, 8, 3, 4);
        add(knot, y + lift * 0.85);
      } else {
        const cube = new THREE.BoxGeometry(lift * 1.35, lift * 1.35, lift * 1.35);
        cube.rotateY(Math.PI / 4);
        cube.rotateZ(Math.PI / 4);
        add(cube, y + lift);
      }

      const geometry = assemble(parts);
      // One turn for the whole column, applied last.
      geometry.rotateY(turn);
      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, name, 0);
    },
  };
}

/** A low slab — the flat face a sheet highlight sweeps across. */
export function finishSlab(name: string, color: number, coat: FinishName | Finish): MeshBuilder {
  return {
    name,
    category: 'objects',
    radius: 0.9,

    build({ seed = 1, scale = 1 } = {}) {
      const rng = createRng(seed);

      const width = rng.range(1.0, 1.4);
      const height = rng.range(0.22, 0.32);
      const depth = rng.range(0.6, 0.9);
      const slab = new THREE.BoxGeometry(width, height, depth);
      slab.translate(0, height / 2, 0);
      slab.rotateY(rng.around(0, 0.3));

      const geometry = assemble([{ geometry: slab, color, sway: 0, finish: coat }]);
      if (scale !== 1) geometry.scale(scale, scale, scale);
      return finish(geometry, name, 0);
    },
  };
}
