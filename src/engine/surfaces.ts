import { setGlowVisible } from '../art/glow';
import { COVER_MATERIAL, TUFT_MATERIAL } from '../art/cover';
import { BOLT_MATERIAL } from '../art/bolt';

/**
 * Keeps glow, groundcover and the bolt out of the passes that read geometry —
 * the normal pass the ambient occlusion reads, the effect mask. Neither has a
 * concept of transparency, and cover builds its blades in its own vertex
 * shader, so both come back wrong. Flipped only by the two passes that differ.
 */

let shown = true;

export function showSurfaces(on: boolean): void {
  if (on === shown) return;
  shown = on;
  setGlowVisible(on);
  COVER_MATERIAL.visible = on;
  TUFT_MATERIAL.visible = on;
  BOLT_MATERIAL.visible = on;
}
