import * as THREE from 'three';
import { markCollidable } from '../player/Collider';
import { createRng } from '../art/random';
import type { MeshBuilder } from '../art/types';
import { outlineBounds, type Skirt } from './vista';
import type { Terrain } from './terrain';

/**
 * Band 1 of the vista: ordinary props at real scale along the level's boundary,
 * the ones the player can walk up to. Its job is to break the sightline into the
 * seam — ground cover thins to nothing before the edge and a little past that the
 * level's own mesh gives out and the skirt takes over at a ninth of the
 * resolution. Neither can be made invisible on its own, so what works is not
 * looking at it: masses standing across the line of sight.
 *
 * It straddles the boundary on purpose. Props inside the wall are ordinary world
 * objects; props outside it are the same builders as scenery, unreachable, so
 * their collision would only cost octree. `solidWithin` is where that line falls.
 * Placement is the ring's own idiom — distance from the level's outline, negative
 * inside — so a winding level dresses its whole length.
 */

export interface DressingKind {
  builder: MeshBuilder;
  /** How many clumps to try for. Fewer may land if the band is tight. */
  count: number;
  /**
   * Metres from the outline this kind lives in. Defaults to the whole band, and it
   * is the lever that makes dressing affordable: a gorse is 2,200 triangles against
   * 78 for a bush, which is worth paying where the player stands next to it and
   * pure waste on the far side of a boundary they can never cross. The costly kinds
   * get a band inside the wall and the cheap ones do the massing beyond it.
   */
  band?: { inner: number; outer: number };
  /**
   * Props per clump. Clumps, not a sprinkle: scattered evenly, boundary dressing
   * reads as a fence of bushes planted at one-metre centres, and the regularity is
   * more visible than the seam it was hiding.
   */
  clump?: readonly [number, number];
  /** How far a clump's members spread from its middle, in metres. */
  huddle?: number;
  scale?: readonly [number, number];
  /** Keep clumps this far apart, centre to centre. */
  spacing?: number;
}

export interface DressingOptions {
  /** Ground inside the level. */
  terrain: Terrain;
  /** Ground outside it, and the outline everything is measured from. */
  skirt: Skirt;
  seed: number;
  /** Metres from the level's outline. Negative is inside. */
  band: { inner: number; outer: number };
  /**
   * Props at or inside this distance from the outline go in the collider;
   * anything further out is scenery the player cannot reach. Set it to the
   * boundary. Omitted, everything is solid.
   */
  solidWithin?: number;
  kinds: readonly DressingKind[];
}

/**
 * Builds the dressing. Not merged, unlike the ring: these are ordinary props at
 * ordinary scale, half of them are in the collider, and several move in the wind —
 * all three of which want a mesh of their own.
 */
export function edgeDressing(options: DressingOptions): THREE.Group {
  const { terrain, skirt, band } = options;
  const rng = createRng(options.seed);
  const bounds = outlineBounds(skirt.outline, Math.max(band.outer, 0));

  const root = new THREE.Group();
  root.name = 'edge-dressing';
  const taken: { x: number; z: number; keep: number }[] = [];

  for (const kind of options.kinds) {
    const range = kind.band ?? band;
    const [least, most] = kind.clump ?? [2, 4];
    const huddle = kind.huddle ?? kind.builder.radius * 2.4;
    const spacing = kind.spacing ?? huddle * 2;
    let landed = 0;

    // Rejection sampling over the bounding box, as the ring does: the band is a thin
    // shell around an arbitrary outline and there is no cheap way to sample it
    // directly. Capped rather than looped until full, so a band that cannot hold
    // `count` finishes short instead of spinning.
    for (let attempt = 0; attempt < kind.count * 60 && landed < kind.count; attempt++) {
      const cx = rng.range(bounds.min[0], bounds.max[0]);
      const cz = rng.range(bounds.min[1], bounds.max[1]);
      const out = skirt.outside(cx, cz);
      if (out < range.inner || out > range.outer) continue;

      let clear = true;
      for (const other of taken) {
        // A floor rather than a sum, as the ring does — see `vistaRing`.
        if (Math.hypot(cx - other.x, cz - other.z) < Math.max(other.keep, spacing)) {
          clear = false;
          break;
        }
      }
      if (!clear) continue;

      taken.push({ x: cx, z: cz, keep: huddle });
      landed++;

      for (let i = rng.int(least, most); i > 0; i--) {
        // Square-rooted, so members gather toward the middle of the clump
        // rather than spreading evenly over its disc.
        const angle = rng.range(0, Math.PI * 2);
        const away = Math.sqrt(rng()) * huddle;
        const x = cx + Math.cos(angle) * away;
        const z = cz + Math.sin(angle) * away;

        const distance = skirt.outside(x, z);
        if (distance > range.outer + huddle) continue;

        const scale = kind.scale ? rng.range(kind.scale[0], kind.scale[1]) : 1;
        const mesh = kind.builder.build({ seed: rng.int(1, 0x7fffffff), scale });
        // Inside the level it stands on the level; outside it stands on the
        // skirt. The collar makes the two agree across the boundary, so a clump
        // straddling the line does not step.
        mesh.position.set(x, distance <= 0 ? terrain.heightAt(x, z) : skirt.heightAt(x, z), z);
        mesh.rotation.y = rng.range(0, Math.PI * 2);

        const reachable =
          options.solidWithin === undefined || distance <= options.solidWithin;
        if (reachable && kind.builder.solid !== false) markCollidable(mesh);
        else mesh.userData.noCollide = true;
        root.add(mesh);
      }
    }
  }

  return root;
}
