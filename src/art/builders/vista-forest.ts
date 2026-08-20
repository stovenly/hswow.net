import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { landWash, markVista, vistaMass } from '../vista';

// A treeline: five overlapped blobs and a ragged skyline. Not trees — at a
// hundred metres a wood is a lumpy dark edge against the sky and nothing else
// survives. Heights and offsets are rolled independently, because a treeline's
// whole read is that its top edge is irregular while its base is level.
// Subdivision 0, since a blob this small in the frame has no interior.

/** Canopy in shade. Dark, and close, so the mass stays one mass. */
const CANOPY = [
  shade(PALETTE.LEAF_DARK, 0.68),
  shade(PALETTE.LEAF_DARK, 0.85),
  PALETTE.LEAF_DARK,
] as const;

export const vistaForest: MeshBuilder = {
  name: 'vista-forest',
  category: 'vista',
  radius: 34,
  solid: false,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);

    const clumps = rng.int(4, 5);
    // How far the line runs, and which way it lies.
    const spread = rng.range(46, 68);
    const turn = rng.range(0, Math.PI * 2);
    const along = { x: Math.cos(turn), z: Math.sin(turn) };

    // One wash across the whole mass rather than one per blob, so the clumps
    // read as a single wood lit from one side instead of as a row of objects.
    const color = landWash(seed ^ 0x0f07, CANOPY, { scale: rng.range(34, 60), crown: 11 });

    const parts: Part[] = [];
    for (let i = 0; i < clumps; i++) {
      // Evenly spaced along the line, then jittered — evenly spaced alone reads
      // as a hedge, jittered alone leaves holes.
      const t = (i + 0.5) / clumps - 0.5;
      const offset = t * spread + rng.range(-spread * 0.08, spread * 0.08);
      const radius = rng.range(9, 14);
      const squash = rng.range(0.62, 0.95);

      const geometry = vistaMass(rng, {
        radius,
        detail: 0,
        rough: rng.range(0.2, 0.34),
        squash,
        stretch: rng.range(0.8, 1.3),
        // Deep. Canopy sits on the ground with no trunk showing at this range,
        // and a blob resting on its own equator reads as a boulder.
        bury: rng.range(0.5, 0.62),
      });
      geometry.translate(
        along.x * offset + rng.range(-5, 5),
        // Varied, so the skyline is ragged where the base is not.
        rng.range(-1.5, 3.5),
        along.z * offset + rng.range(-5, 5),
      );
      parts.push({ geometry, color, sway: 0 });
    }

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return markVista(finish(merged, 'vista-forest', 0));
  },
};
