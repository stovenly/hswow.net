import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A louvred vent: a housing, a hood, and a stack of angled blades.
 *
 * **It has no base, and should not.** The first version stood on a short duct so
 * it would hold itself up in a gallery, which is not a thing a vent does — they
 * are set into walls, and a floor-mounted one reads as a radiator. It is built
 * about a fixed height instead and simply hangs there in an empty room, which
 * is the honest picture of a fitting waiting for a wall.
 *
 * **The blades have to overlap, and the overlap has to be visible.** A louvre
 * whose slats sit edge to edge in one plane is a grille, and reads as a flat
 * panel with lines drawn on it. Real ones step *back* as they go up so rain
 * cannot drive through, which means each blade throws a shadow onto the one
 * below and the whole face has depth in it. That stagger is two extra numbers
 * and it is the difference between a vent and a decal.
 *
 * The blades are boxes rather than a single subdivided surface because the gaps
 * between them are the point: something built as one mesh would need holes cut
 * in it, and there is no constructive solid geometry here.
 */
export const vent: MeshBuilder = {
  name: 'vent',
  category: 'structures',
  radius: 0.7,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const width = rng.range(0.55, 0.85);
    const faceH = rng.range(0.45, 0.7);
    const depth = rng.range(0.16, 0.26);
    const frame = rng.range(0.035, 0.055);
    // Where the sill sits. Fixed rather than rolled: vents go at head height
    // because that is where the ductwork runs, and a rank of them at differing
    // heights would read as a mistake rather than as variety.
    const sill = 1.7;

    const steel = shade(0x878e93, rng.range(0.9, 1.08));
    const rusty = rng.chance(0.4);

    const base = sill;
    const top = base + faceH;

    // --- the housing ---------------------------------------------------------
    //
    // Four sides of frame, and no back or front — the blades fill the front and
    // the back is open because that is where the air comes from.
    for (const side of [-1, 1]) {
      const jamb = new THREE.BoxGeometry(frame, faceH, depth);
      jamb.translate((side * (width - frame)) / 2, base + faceH / 2, 0);
      parts.push({ geometry: jamb, color: steel, sway: 0 });

      // Head and sill run the full width so they lap over the jambs rather
      // than butting flush against them — coincident faces z-fight and read as
      // holes to any test of the solid.
      const rail = new THREE.BoxGeometry(width, frame * 0.92, depth * 0.98);
      rail.translate(0, side < 0 ? base + frame * 0.46 : top - frame * 0.46, 0);
      parts.push({ geometry: rail, color: shade(steel, 0.94), sway: 0 });
    }

    // --- the hood ------------------------------------------------------------
    //
    // A weather lip proud of the head. Small, and it is what stops the top of
    // the housing reading as a cut edge.
    const hood = new THREE.BoxGeometry(width * 1.14, frame * 0.8, depth * 1.5);
    hood.rotateX(-0.14);
    hood.translate(0, top + frame * 0.4, depth * 0.2);
    parts.push({ geometry: hood, color: shade(steel, 1.12), sway: 0 });

    // --- the louvres ---------------------------------------------------------
    const inner = faceH - frame * 2.2;
    const blades = Math.max(3, Math.round(inner / rng.range(0.055, 0.085)));
    const pitch = inner / blades;
    const bladeT = pitch * 0.42;

    for (let i = 0; i < blades; i++) {
      const y = base + frame * 1.1 + pitch * (i + 0.5);
      const blade = new THREE.BoxGeometry(width - frame * 2.2, bladeT, depth * 0.66);
      // Tipped down and forward. The tilt sheds water and, more usefully here,
      // turns every blade into a surface at a different angle to the light
      // from the wall it is set in.
      blade.rotateX(rng.range(0.5, 0.72));
      // Stepped back as they climb, so each one shows against the gap behind
      // the one below rather than lining up into a flat face.
      blade.translate(0, y, depth * 0.1 - (i / blades) * depth * 0.24);
      parts.push({
        geometry: blade,
        color: rusty && rng.chance(0.3) ? shade(PALETTE.RUST, 0.95) : shade(steel, 1.06),
        sway: 0,
      });
    }

    // A centre mullion on the wider ones, because a metre of unsupported slat
    // would sag and the eye expects to see what is stopping it.
    if (width > 0.7) {
      const mullion = new THREE.BoxGeometry(frame * 0.7, inner, depth * 0.5);
      mullion.translate(0, base + faceH / 2, -depth * 0.06);
      parts.push({ geometry: mullion, color: shade(steel, 0.88), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'vent', 0, 'metal-hollow-small');
  },
};
