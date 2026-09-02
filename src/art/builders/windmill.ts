import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { stoneColours } from '../masonry';

// A tower mill: a tapered eight-sided tower of stone, a boarded cap, and four
// sails on a windshaft out of the cap's face. The sails are still — a rig is a
// separate thing — and set a hand off vertical, as sails are left. Built facing
// +Z, so the sails face +Z; the door is in the same face at the foot.

const SAIL_LENGTH = 6.2;
const SAIL_WIDTH = 1.3;

export const windmill: MeshBuilder = {
  name: 'windmill',
  category: 'structures',
  radius: 6.5,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const height = rng.range(8.5, 10);
    const foot = rng.range(3, 3.5);
    const top = foot * 0.68;

    // The tower, its stone drifting course to course.
    const tower = new THREE.CylinderGeometry(top, foot, height, 8, 1, true);
    tower.translate(0, height / 2, 0);
    const stone = stoneColours(rng, 0.1);
    const courses: number[] = [];
    for (let i = 0; i < 24; i++) courses.push(stone());
    parts.push({
      geometry: tower,
      color: (_x, y) => courses[Math.min(23, Math.max(0, Math.floor((y / height) * 24)))],
      sway: 0,
    });

    // A ring of stone at the foot, so the tower sits on something.
    const plinth = new THREE.CylinderGeometry(foot + 0.3, foot + 0.4, 0.5, 8);
    plinth.translate(0, 0.25, 0);
    parts.push({ geometry: plinth, color: shade(PALETTE.STONE_DARK, 0.9), sway: 0 });

    // The cap: a boarded drum with a low cone, which is what turns to the wind.
    const capH = 1.1;
    const drum = new THREE.CylinderGeometry(top + 0.35, top + 0.25, capH, 8);
    drum.translate(0, height + capH / 2, 0);
    parts.push({ geometry: drum, color: shade(PALETTE.TIMBER_DARK, 0.9), sway: 0 });
    const cone = new THREE.ConeGeometry(top + 0.45, 1.6, 8);
    cone.translate(0, height + capH + 0.8, 0);
    parts.push({ geometry: cone, color: shade(PALETTE.BARK, 0.85), sway: 0 });

    // The windshaft, out of the cap's face and tilted up a little.
    const shaftY = height + capH * 0.55;
    const shaftOut = top + 1.4;
    const shaft = new THREE.CylinderGeometry(0.16, 0.2, shaftOut + 0.6, 6);
    shaft.rotateX(Math.PI / 2);
    shaft.rotateX(-0.17);
    shaft.translate(0, shaftY + 0.1, shaftOut / 2);
    parts.push({ geometry: shaft, color: PALETTE.TIMBER_DARK, sway: 0 });

    // Four sails in a plane a little off vertical, each a stock with a frame
    // of bars down one side. Turned so no sail stands straight up.
    const hubZ = shaftOut + 0.1;
    const hubY = shaftY + 0.1 + Math.sin(0.17) * shaftOut;
    const lean = rng.range(0.1, 0.35);
    for (let i = 0; i < 4; i++) {
      const angle = lean + (i * Math.PI) / 2;
      const sail: THREE.BufferGeometry[] = [];
      const stock = new THREE.BoxGeometry(0.16, SAIL_LENGTH, 0.14);
      stock.translate(0, SAIL_LENGTH / 2 - 0.4, 0);
      sail.push(stock);
      const bars = 7;
      for (let k = 0; k < bars; k++) {
        const y = 0.9 + ((SAIL_LENGTH - 1.4) * k) / (bars - 1);
        const bar = new THREE.BoxGeometry(SAIL_WIDTH, 0.07, 0.06);
        bar.translate(SAIL_WIDTH / 2 + 0.08, y, 0.02);
        sail.push(bar);
      }
      const hem = new THREE.BoxGeometry(0.07, SAIL_LENGTH - 1.6, 0.06);
      hem.translate(SAIL_WIDTH + 0.08, 0.9 + (SAIL_LENGTH - 1.4) / 2, 0.02);
      sail.push(hem);
      for (const piece of sail) {
        // rotateZ(angle) turns the sail about the shaft; rotateX tilts the plane back with it.
        piece.rotateZ(angle);
        piece.rotateX(-0.17);
        piece.translate(0, hubY, hubZ);
        parts.push({ geometry: piece, color: shade(PALETTE.TIMBER_PALE, rng.range(0.9, 1.05)), sway: 0 });
      }
    }
    const hub = new THREE.CylinderGeometry(0.36, 0.36, 0.4, 8);
    hub.rotateX(Math.PI / 2 - 0.17);
    hub.translate(0, hubY, hubZ);
    parts.push({ geometry: hub, color: shade(PALETTE.IRON, 0.9), sway: 0 });

    // The door, set into the +Z face of the foot.
    const door = new THREE.BoxGeometry(1, 2, 0.12);
    door.translate(0, 1.05, foot - 0.1);
    parts.push({ geometry: door, color: shade(PALETTE.TIMBER_DARK, 0.8), sway: 0 });

    const merged = assemble(parts);
    if (scale !== 1) merged.scale(scale, scale, scale);
    return finish(merged, 'windmill', 0);
  },
};
