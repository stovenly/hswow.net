import * as THREE from 'three';
import type { MeshBuilder, BuildOptions } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { near, weatherTint } from '../weathering';

/**
 * A steel floor hatch in an angle-iron curb.
 *
 * The factory door turned on its back, exactly as `hut-trapdoor` is the hut
 * door's — one plate, stud rows, barrel hinges, and wear where the wooden one
 * has stain. Access pits, service voids, coal drops: the works' holes in the
 * floor.
 *
 * Deliberately plain, all of it. There was a hazard-striped curb variant —
 * alternating yellow warning blocks — and it was cut: alternating yellow is
 * the loudest signal the palette can make, and a floor hatch scattered as
 * dressing must not shout like a focal point. If a specific hatch in content
 * ever marks a genuinely live drop, that is a decision for that hatch, made
 * in zone code where the fiction lives.
 *
 * No voice and no metrics, for the trapdoor's shared reason: portals do not
 * open downward, so this is dressing until a zone teaches it otherwise.
 *
 * Built lying flat, standing on y = 0, face up; the curb is kerb-height and
 * walked over.
 */

export type FactoryTrapdoorOptions = BuildOptions;

export function buildFactoryTrapdoor(options: FactoryTrapdoorOptions = {}): THREE.Mesh {
  const { seed = 1, scale = 1 } = options;
  const rng = createRng(seed);
  const parts: Part[] = [];

  // Same two wear populations as the factory door, rolled first for the same
  // reason: a seed's state of repair must survive the builder growing detail.
  const wear = rng.chance(0.35) ? rng.range(0.5, 0.85) : rng.range(0.08, 0.3);

  const width = rng.range(0.95, 1.3);
  const depth = rng.range(0.85, 1.15);
  const curb = rng.range(0.07, 0.09);
  const curbHeight = rng.range(0.07, 0.1);

  const iron = shade(PALETTE.IRON, rng.range(0.9, 1.05));
  const curbTone = shade(PALETTE.IRON_DARK, rng.range(0.9, 1.05));
  /** Rust the colour of the metal it grows on — see `weatherTint`. */
  const rustOn = (surface: number): number => weatherTint(PALETTE.RUST, surface, PALETTE.IRON);

  /**
   * Where things are bolted through the plate. Filled as the tread and
   * fittings are built below, *after* the plate part is pushed — safe,
   * because wear fields are only evaluated inside `assemble`, by which time
   * the list is complete.
   */
  const fixings: [number, number][] = [];
  const nearFixings = near(fixings, 0.13);

  /**
   * Rust on a horizontal plate: no gravity to streak along, so the story is
   * where water *sits* — around every fixing, and toward the perimeter where
   * it drains last. This is only the field; the speckle is the shader's.
   */
  const corroded = (x: number, z: number): number => {
    const edge = Math.max(Math.abs(x) / (width / 2), Math.abs(z) / (depth / 2));
    return Math.min(wear * (0.1 + 0.24 * edge * edge) + wear * 0.45 * nearFixings(x, z), 0.85);
  };


  // --- curb ----------------------------------------------------------------
  // Plain angle iron, weathered like the rest. The side pieces run past half
  // a curb into the end rails rather than butting flush, for the
  // hut-trapdoor's reason: flush-butted boxes share their corner vertices
  // exactly, and coincident vertices fail the watertight accounting.
  const rail = (w: number, d: number, x: number, z: number): void => {
    const geometry = new THREE.BoxGeometry(w, curbHeight, d);
    geometry.translate(x, curbHeight / 2, z);
    parts.push({
      geometry,
      color: curbTone,
      sway: 0,
      wear: wear * 0.35,
      wearTint: rustOn(curbTone),
    });
  };
  for (const side of [-1, 1]) {
    rail(width + curb * 2, curb, 0, side * (depth / 2 + curb / 2));
    rail(curb, depth + curb * 1.3, side * (width / 2 + curb / 2), 0);
  }

  // --- leaf ----------------------------------------------------------------
  // One plate, recessed into the curb, coarsely segmented: the grid only has
  // to carry the wear field's bends around the fixings — the speckle is per
  // pixel and needs no geometry.
  const leafTop = curbHeight - 0.015;
  const plateThickness = 0.035;
  const plate = new THREE.BoxGeometry(width, plateThickness, depth, 9, 1, 9);
  plate.translate(0, leafTop - plateThickness / 2, 0);
  parts.push({
    geometry: plate,
    color: iron,
    sway: 0,
    wear: (x, _y, z) => corroded(x, z),
    wearTint: rustOn(iron),
  });

  // --- tread ---------------------------------------------------------------
  // Either stud rows — the cast pattern you stand on — or a pair of stiffener
  // ribs. Both exist to break the plate's one flat plane; a bare quad lying
  // in the ground reads as paint however it is coloured.
  if (rng.chance(0.6)) {
    const cols = 4;
    const rows = 4;
    for (let cx = 0; cx < cols; cx++) {
      for (let cz = 0; cz < rows; cz++) {
        const sx = -width * 0.36 + (width * 0.72 * cx) / (cols - 1);
        const sz = -depth * 0.36 + (depth * 0.72 * cz) / (rows - 1);
        const stud = new THREE.BoxGeometry(0.045, 0.012, 0.045);
        stud.translate(sx, leafTop + 0.006, sz);
        // Hardware weathers on its own schedule, later than the plate it
        // stands proud of — the factory door's rivet rule.
        parts.push({
          geometry: stud,
          color: shade(iron, 0.86),
          sway: 0,
          wear: wear * 0.3,
          wearTint: rustOn(shade(iron, 0.86)),
        });
        fixings.push([sx, sz]);
      }
    }
  } else {
    for (const sx of [-width * 0.22, width * 0.22]) {
      const rib = new THREE.BoxGeometry(0.05, 0.014, depth * 0.86);
      rib.translate(sx, leafTop + 0.007, 0);
      parts.push({
        geometry: rib,
        color: shade(iron, 0.86),
        sway: 0,
        wear: wear * 0.3,
        wearTint: rustOn(shade(iron, 0.86)),
      });
      // Ribs are bolted through at their ends; that is where the water sits.
      fixings.push([sx, -depth * 0.4], [sx, depth * 0.4]);
    }
  }

  // --- hinges and pull ------------------------------------------------------
  // Barrel hinges lying along one edge, and a fold-flat lifting handle on the
  // other — standing proud enough to grab, low enough to barrow over.
  const hingeSign = rng.chance(0.5) ? -1 : 1;
  for (const sx of [-width * 0.28, width * 0.28]) {
    const barrel = new THREE.CylinderGeometry(0.024, 0.024, 0.14, 6);
    barrel.rotateZ(Math.PI / 2);
    barrel.translate(sx, leafTop, hingeSign * (depth / 2 + curb * 0.35));
    parts.push({
      geometry: barrel,
      color: shade(curbTone, 0.9),
      sway: 0,
      wear: wear * 0.3,
      wearTint: rustOn(shade(curbTone, 0.9)),
    });
    fixings.push([sx, hingeSign * (depth / 2 - 0.04)]);
  }

  const pullZ = -hingeSign * depth * 0.32;
  for (const dx of [-0.08, 0.08]) {
    const standoff = new THREE.BoxGeometry(0.03, 0.045, 0.03);
    standoff.translate(dx, leafTop + 0.018, pullZ);
    parts.push({
      geometry: standoff,
      color: shade(iron, 0.8),
      sway: 0,
      wear: wear * 0.25,
      wearTint: rustOn(shade(iron, 0.8)),
    });
    fixings.push([dx, pullZ]);
  }
  // The grip stays bright — it is the one piece of this hatch that hands
  // polish, and clean metal in a rusty assembly is what says "still used".
  const grip = new THREE.CylinderGeometry(0.015, 0.015, 0.19, 6);
  grip.rotateZ(Math.PI / 2);
  grip.translate(0, leafTop + 0.042, pullZ);
  parts.push({ geometry: grip, color: shade(iron, 1.12), sway: 0 });

  const geometry = assemble(parts);
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return finish(geometry, 'factory-trapdoor', 0, 'metal-solid');
}

export const factoryTrapdoor: MeshBuilder = {
  name: 'factory-trapdoor',
  display: 'Metal Trapdoor',
  category: 'structures',
  radius: 0.8,
  build: buildFactoryTrapdoor,
};
