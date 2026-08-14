import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A thicket: an overgrown shrub, head high and too dense to push through. The
 * soft counterpart to a boulder, and always a big one — the small case is
 * `bush`'s.
 *
 * A stool, three to five stems arching out and back in, and foliage hung in
 * lumps **along** each stem rather than as one crown at its tip, so the leaves
 * cover the wood that carries them and merge with their neighbours.
 */
export const thicket: MeshBuilder = {
  name: 'thicket',
  category: 'foliage',
  radius: 1.9,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const height = rng.range(2.2, 2.9);
    /** Half-width of the mass at its widest. */
    const spread = height * rng.range(0.38, 0.58);
    /** How much bare stem shows under it. */
    const clear = height * rng.range(0.1, 0.18);
    /** How far up the widest point sits. */
    const waist = rng.range(0.34, 0.56);
    /** How hard it draws back in above the waist. */
    const crown = rng.range(0.3, 0.72);
    const leaf = rng.chance(0.4) ? PALETTE.LEAF_DARK : PALETTE.LEAF;
    const dry = PALETTE.LEAF_DRY;
    const live = rng.chance(0.5) ? PALETTE.BARK : shade(PALETTE.BARK_PALE, 0.94);
    const dead = shade(PALETTE.BARK_PALE, 1.12);
    // Which way it has grown into the light.
    const lean = rng.range(0, Math.PI * 2);
    const pull = rng.range(0.08, 0.2);

    const stems = rng.int(3, 5);
    const start = rng.range(0, Math.PI * 2);
    const UP = new THREE.Vector3(0, 1, 0);

    /**
     * Where a stem is at a given **height**.
     *
     * By height, not by fraction-along: the foliage starts just above the clear
     * stem and that is a height.
     */
    const atHeight = (knee: THREE.Vector3, top: THREE.Vector3, y: number): THREE.Vector3 =>
      y <= knee.y
        ? new THREE.Vector3().copy(knee).multiplyScalar(y / Math.max(knee.y, 1e-3))
        : new THREE.Vector3().lerpVectors(knee, top, (y - knee.y) / Math.max(top.y - knee.y, 1e-3));

    const limb = (from: THREE.Vector3, to: THREE.Vector3, thick: number, wood: number): void => {
      const along = new THREE.Vector3().subVectors(to, from);
      const run = along.length();
      if (run < 0.02) return;
      const piece = new THREE.CylinderGeometry(thick * 0.78, thick, run * 1.08, 5);
      piece.translate(0, run / 2, 0);
      piece.applyQuaternion(
        new THREE.Quaternion().setFromUnitVectors(UP, along.divideScalar(run)),
      );
      piece.translate(from.x, from.y, from.z);
      parts.push({
        geometry: piece,
        color: shade(wood, rng.range(0.88, 1.1)),
        sway: (_x, y) => Math.min(1, Math.max(0, y / height - 0.45)) * 0.4,
      });
    };

    for (let i = 0; i < stems; i++) {
      // Dealt evenly rather than drawn, so no two land on top of each other.
      const bearing = start + (i / stems) * Math.PI * 2 + rng.around(0, 0.35);
      const rise = height * rng.range(0.8, 0.96) * (i === 0 ? 1 : rng.range(0.88, 1));
      const girth = rng.range(0.028, 0.055);
      const bare = rng.chance(0.25);

      // Arches out to `out` at the waist and back in above it.
      const out = spread * rng.range(0.62, 0.9);
      const knee = new THREE.Vector3(
        Math.cos(bearing) * out + Math.cos(lean) * pull * rise * waist,
        rise * waist,
        Math.sin(bearing) * out + Math.sin(lean) * pull * rise * waist,
      );
      const top = new THREE.Vector3(
        Math.cos(bearing) * out * crown + Math.cos(lean) * pull * rise,
        rise,
        Math.sin(bearing) * out * crown + Math.sin(lean) * pull * rise,
      );

      limb(new THREE.Vector3(rng.around(0, 0.06), 0, rng.around(0, 0.06)), knee, girth, bare ? dead : live);
      limb(knee, top, girth * 0.8, bare ? dead : live);

      // Foliage up the wood, fullest at the waist and tapering both ways.
      const lumps = rng.int(4, 5);
      const foot = clear + spread * 0.24;
      for (let k = 0; k < lumps; k++) {
        const t = k / (lumps - 1);
        const y = foot + (rise - foot) * t;
        const at = atHeight(knee, top, y);
        const swell = 1 - 0.4 * Math.abs(t - waist) / Math.max(waist, 1 - waist);
        const rx = spread * swell * (bare ? rng.range(0.44, 0.55) : rng.range(0.52, 0.68));
        const ry = rx * rng.range(0.62, 0.9);
        const rz = rx * rng.range(0.82, 1.16);

        const lump = new THREE.IcosahedronGeometry(1, 0);
        lump.rotateY(rng.range(0, Math.PI * 2));
        lump.rotateX(rng.range(0, Math.PI));
        lump.scale(rx, ry, rz);
        lump.translate(
          at.x + rng.around(0, rx * 0.16),
          at.y + rng.around(0, ry * 0.14),
          at.z + rng.around(0, rz * 0.16),
        );
        parts.push({
          geometry: lump,
          color: shade(rng.chance(bare ? 0.75 : 0.16) ? dry : leaf, rng.range(0.86, 1.14)),
          sway: (_x, y) => Math.min(1, Math.max(0, (y / height - 0.35) / 0.65)) * 0.7,
        });
      }
    }

    // A few up the middle, binding the stems' foliage into one body.
    for (let i = rng.int(2, 4); i > 0; i--) {
      const t = rng.range(0.25, 0.9);
      const swell = 1 - 0.4 * Math.abs(t - waist) / Math.max(waist, 1 - waist);
      const rx = spread * swell * rng.range(0.55, 0.75);
      const lump = new THREE.IcosahedronGeometry(1, 0);
      lump.rotateY(rng.range(0, Math.PI * 2));
      lump.scale(rx, rx * rng.range(0.62, 0.8), rx * rng.range(0.9, 1.1));
      lump.translate(
        rng.around(Math.cos(lean) * pull * height * t, spread * 0.12),
        clear + (height - clear) * t,
        rng.around(Math.sin(lean) * pull * height * t, spread * 0.12),
      );
      parts.push({
        geometry: lump,
        color: shade(rng.chance(0.16) ? dry : leaf, rng.range(0.84, 1.12)),
        sway: (_x, y) => Math.min(1, Math.max(0, (y / height - 0.35) / 0.65)) * 0.7,
      });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'thicket', rng.range(0, Math.PI * 2));
  },
};
