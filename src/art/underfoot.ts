import * as THREE from 'three';
import { PALETTE } from './palette';
import type { SurfaceName } from '../audio/models/footsteps';

/**
 * What a prop sounds like when you stand on it — **measured, not declared**.
 *
 * The obvious way to do this is a table from builder name to surface, in the
 * shape of `flex.ts`: ninety entries, hand-written, and every new prop owes one.
 * It is also the wrong way, because the answer is already in the geometry. A
 * builder that makes a plank walkway has already said the planks are `TIMBER`
 * and the nails are `IRON`, and it said so in the only place that cannot drift
 * from what was actually built.
 *
 * So the material is read off the mesh: every triangle's colour is matched to a
 * palette family, its area is added to that family's total, and the largest
 * total wins. That is what *the majority of the object* means, stated as
 * arithmetic — and it costs nothing at runtime because it happens once, at
 * build, alongside the sway weights.
 *
 * Two things fall out of doing it this way that a table would not give:
 *
 * - **A prop that changes material changes its sound.** Re-colour a hut door
 *   from timber to iron and it stops sounding like wood, without anyone
 *   remembering there is a second place to edit.
 * - **Trim does not count.** A stone stair with an iron handrail is stone,
 *   because the treads are most of its area and the rail is not, and nobody had
 *   to make that judgement.
 *
 * ## Matching a shaded colour back to its family
 *
 * Nothing in the kit uses palette entries raw — everything is `shade(X, 0.9)`
 * or similar, which multiplies all three channels by a constant. That invites
 * normalising the colour and comparing directions, so the shading divides out.
 *
 * **Do not.** `IRON` is `0x5a5f63` and `STONE_DARK` is `0x757a80`: the same
 * hue, thirty per cent apart in brightness, and identical to four decimal
 * places once normalised. Throwing brightness away makes iron and stone the
 * same material, which is exactly what happened — every railing and every
 * machine in the works came back as masonry.
 *
 * So the comparison keeps brightness and happens in full linear RGB, in the
 * space three writes the attribute in. Shading does move a colour away from
 * its own entry, but the entries are laid out so that a shaded one lands on
 * another member of its *own* family — a dark timber finds `TIMBER_DARK`, a
 * pale one finds `TIMBER_PALE` — and every member maps to the same surface. The
 * palette's own note explains why that holds: the families were spaced to stay
 * apart through the render pipeline's per-channel quantization, and that is the
 * same separation this needs.
 */

/**
 * Palette families, and what standing on one sounds like.
 *
 * Anything absent is a material nobody walks on — cloth, skin, wool, a flame —
 * and contributes no vote. A prop made entirely of those simply has no surface,
 * and the ground under it answers instead, which is right: you are not standing
 * on a lantern's light.
 */
const FAMILIES: Record<string, SurfaceName> = {
  BARK: 'wood',
  BARK_PALE: 'wood',
  TIMBER: 'wood',
  TIMBER_DARK: 'wood',
  TIMBER_PALE: 'wood',

  STONE: 'stone',
  STONE_DARK: 'stone',
  STONE_PALE: 'stone',

  // Sheet and plate, which is what props are made of. `metal-ring` is a
  // walkway fixed at its ends and `metal-hollow-*` is a container, and neither
  // is inferable from a colour — a builder that wants one says so through
  // `MeshBuilder.underfoot`.
  IRON: 'metal-solid',
  IRON_DARK: 'metal-solid',
  IRON_PALE: 'metal-solid',
  RUST: 'metal-solid',
  BRONZE: 'metal-solid',
  PATINA: 'metal-solid',

  EARTH: 'soil',
  GRASS: 'grass',
  GRASS_DRY: 'grass',
  LEAF: 'grass',
  LEAF_DARK: 'grass',
  LEAF_DRY: 'grass',
};

/**
 * **The whole palette, linearised once, as unit vectors** — not just the
 * families that vote.
 *
 * Offering only the walkable ones as candidates is the obvious shortcut and it
 * is badly wrong: every colour then matches *something*, so a cow's hide gets
 * pulled to whichever of earth, timber or stone happens to be nearest and the
 * animal reports as ground. Letting hide match `HIDE` and then finding it has
 * no surface is the same work and gives the right answer, because the palette
 * already contains the thing it actually is.
 */
const REFERENCE = (Object.keys(PALETTE) as (keyof typeof PALETTE)[]).map((key) => {
  const colour = new THREE.Color(PALETTE[key]);
  return { surface: FAMILIES[key] ?? null, r: colour.r, g: colour.g, b: colour.b };
});

/**
 * How far off a colour may be and still count as a family, as a squared
 * distance in linear RGB.
 *
 * Wide enough that a shaded entry still finds its own family and narrow enough
 * that a colour belonging to no family finds nothing. Linear space is heavily
 * compressed at the dark end, where most of this kit lives, so this is a larger
 * fraction of the useful range than it looks.
 */
const TOLERANCE = 0.05;

/**
 * The material most of a mesh is made of, or null if most of it is nothing
 * anyone stands on.
 *
 * Weighted by area rather than by vertex count, and the difference is not
 * academic: a box is thirty-six vertices whether it is a floorboard or a nail
 * head, so counting vertices would let a handful of fittings outvote the thing
 * they are fitted to.
 */
export function underfootOf(geometry: THREE.BufferGeometry): SurfaceName | null {
  const position = geometry.getAttribute('position');
  const colour = geometry.getAttribute('color');
  if (!position || !colour) return null;

  const totals = new Map<SurfaceName, number>();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  for (let i = 0; i + 2 < position.count; i += 3) {
    // Flat-shaded and un-indexed, so a triangle's three vertices always carry
    // the same colour — the first one speaks for the face.
    const r = colour.getX(i);
    const g = colour.getY(i);
    const bb = colour.getZ(i);

    let best: SurfaceName | null = null;
    let closest = TOLERANCE;
    for (const family of REFERENCE) {
      const dr = r - family.r;
      const dg = g - family.g;
      const db = bb - family.b;
      const distance = dr * dr + dg * dg + db * db;
      if (distance < closest) {
        closest = distance;
        best = family.surface;
      }
    }
    // Either nothing was near enough, or the nearest thing was a material
    // nobody stands on. Both abstain.
    if (!best) continue;

    a.fromBufferAttribute(position, i);
    b.fromBufferAttribute(position, i + 1);
    c.fromBufferAttribute(position, i + 2);
    const area = b.sub(a).cross(c.sub(a)).length() * 0.5;
    totals.set(best, (totals.get(best) ?? 0) + area);
  }

  let winner: SurfaceName | null = null;
  let most = 0;
  for (const [surface, area] of totals) {
    if (area > most) {
      most = area;
      winner = surface;
    }
  }
  return winner;
}
