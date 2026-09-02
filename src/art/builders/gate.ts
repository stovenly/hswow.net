import * as THREE from 'three';
import type { BuildOptions, MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import type { Fields } from '../schema';
import { FENCE_POST, fenceHeight } from './fence';

// A five-bar field gate: a hanging post, a slamming post, and the leaf hung
// between them, swung open by `open`. Built facing +Z with the gap along X and
// centred on it, so it drops into a fence run's gap; the leaf swings out toward
// +Z from the -X post.

export interface GateOptions extends BuildOptions {
  /** Metres between the posts. */
  width?: number;
  /** 0 shut, 1 swung fully back against the fence line. */
  open?: number;
}

const BAR = 0.06;

export const gate: MeshBuilder = {
  name: 'gate',
  category: 'structures',
  options: {
    width: { type: 'number', min: 1.6, max: 4, step: 0.1 },
    open: { type: 'number', min: 0, max: 1, step: 0.05 },
  } satisfies Fields,
  radius: 2,

  build({ seed = 1, scale = 1, width = 3, open = 0.75 }: GateOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const postWood = shade(PALETTE.TIMBER_DARK, rng.range(0.9, 1.05));
    const leafWood = shade(PALETTE.TIMBER_PALE, rng.range(0.88, 1.02));
    const height = fenceHeight(rng) + 0.1;
    const half = width / 2;

    // The hanging post is stouter: it carries the leaf.
    for (const [x, size] of [
      [-half, FENCE_POST * 1.5],
      [half, FENCE_POST * 1.1],
    ]) {
      const post = new THREE.BoxGeometry(size, height + 0.15, size);
      post.translate(x, (height + 0.15) / 2, 0);
      parts.push({ geometry: post, color: postWood, sway: 0 });
    }

    // The leaf, built shut along +X from the hanging post, then swung.
    const leaf: Part[] = [];
    const span = width - FENCE_POST * 1.5;
    const bars = 5;
    for (let i = 0; i < bars; i++) {
      const y = 0.18 + ((height - 0.22) * i) / (bars - 1);
      const bar = new THREE.BoxGeometry(span, BAR, BAR * 0.7);
      bar.translate(span / 2, y, 0);
      leaf.push({ geometry: bar, color: shade(leafWood, rng.range(0.95, 1.05)), sway: 0 });
    }
    const stile = (x: number, w: number): void => {
      const upright = new THREE.BoxGeometry(w, height - 0.04, BAR * 0.9);
      upright.translate(x, height / 2 + 0.02, BAR * 0.8);
      leaf.push({ geometry: upright, color: leafWood, sway: 0 });
    };
    stile(0.05, 0.09);
    stile(span - 0.05, 0.07);
    stile(span * 0.5, 0.06);
    // The brace, from the heel to the head, which is what keeps a gate square.
    const brace = new THREE.BoxGeometry(Math.hypot(span, height - 0.3), 0.06, BAR * 0.9);
    brace.rotateZ(Math.atan2(height - 0.3, span));
    brace.translate(span / 2, height / 2, -BAR * 0.8);
    leaf.push({ geometry: brace, color: leafWood, sway: 0 });

    // rotateY(-swing) takes the leaf's +X toward +Z: the gate opens outward.
    const swing = open * rng.range(1.35, 1.56);
    for (const part of leaf) {
      part.geometry.rotateY(-swing);
      part.geometry.translate(-half + FENCE_POST * 0.75, 0, 0);
    }
    parts.push(...leaf);

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return finish(merged, 'gate', 0);
  },
};
