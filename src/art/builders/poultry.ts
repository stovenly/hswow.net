import * as THREE from 'three';
import type { BuilderWith } from '../types';
import type { Part } from '../assemble';
import { loft } from '../loft';
import { finishRigged, type BoneSpec } from '../rig';
import { segment } from '../quadruped';
import { createRng } from '../random';
import { PALETTE } from '../palette';
import type { LifeOptions, LifeSpec } from '../../life/spec';

/**
 * A fowl — the only two-legged animal in the kit, so it has its own plan. A body
 * tipped nose-down so the tail rides high, wings as plates on the flanks, a neck
 * up out of the breast, and comb, beak and cocked tail fan on the head. Facing
 * +Z, feet on y = 0. Bones:
 *
 *   root ─ body ─ neck ─ head
 *        │      ├ wingL / wingR
 *        │      └ tail
 *        └ legL / legR
 */
export const poultry: BuilderWith<LifeOptions> = {
  name: 'poultry',
  category: 'animals',
  radius: 0.35,
  solid: false,

  build({ seed = 1, scale = 1, roam }: LifeOptions = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const bones: BoneSpec[] = [];

    const b = rng.range(0.16, 0.22);
    const legLength = rng.range(0.09, 0.15);
    const plumage = rng.pick([PALETTE.FOWL, PALETTE.HIDE_PALE, PALETTE.HIDE_DARK, PALETTE.CLOTH, PALETTE.RUST]);
    const belly = legLength + b * 0.5;

    bones.push({ name: 'root', at: [0, 0, 0] });
    bones.push({ name: 'body', parent: 'root', at: [0, belly, 0] });

    // Body: an egg with its blunt end forward and low, its tail end high.
    const body = loft(
      [
        { at: [0, belly + b * 0.4, -b * 0.62], rx: b * 0.24, ry: b * 0.26 },
        { at: [0, belly + b * 0.24, -b * 0.3], rx: b * 0.42, ry: b * 0.46 },
        { at: [0, belly + b * 0.06, b * 0.05], rx: b * 0.44, ry: b * 0.5 },
        { at: [0, belly - b * 0.04, b * 0.4], rx: b * 0.34, ry: b * 0.4 },
        { at: [0, belly - b * 0.02, b * 0.62], rx: b * 0.18, ry: b * 0.22 },
      ],
      7,
    );
    parts.push({ geometry: body, color: plumage, bone: 'body' });

    // Neck, up and forward out of the breast; head on the end of it.
    const rise = rng.range(0.9, 1.15);
    const neckLength = b * rng.range(0.5, 0.65);
    const dir = new THREE.Vector3(0, Math.sin(rise), Math.cos(rise));
    const neckRoot = new THREE.Vector3(0, belly + b * 0.28, b * 0.4);
    const poll = neckRoot.clone().addScaledVector(dir, neckLength);
    const axis = dir.toArray() as [number, number, number];
    parts.push({
      geometry: loft(
        [
          { at: neckRoot.toArray() as [number, number, number], rx: b * 0.2, ry: b * 0.24, axis },
          { at: poll.toArray() as [number, number, number], rx: b * 0.14, ry: b * 0.16, axis },
        ],
        5,
        { start: false, end: false },
      ),
      color: plumage,
      bone: 'neck',
    });
    bones.push({ name: 'neck', parent: 'body', at: neckRoot.toArray() as [number, number, number] });
    bones.push({ name: 'head', parent: 'neck', at: poll.toArray() as [number, number, number] });

    // The head, in its own space then pitched: rotateX(pitch) takes +Z to
    // (0, −sin, cos), a little nose-down, and carried to the poll.
    const h = b * rng.range(0.42, 0.52);
    const pitch = 0.15;
    const place = (geometry: THREE.BufferGeometry): THREE.BufferGeometry => {
      geometry.rotateX(pitch);
      geometry.translate(poll.x, poll.y, poll.z);
      return geometry;
    };
    const skull = loft(
      [
        { at: [0, 0, -h * 0.3], rx: h * 0.42, ry: h * 0.44 },
        { at: [0, 0.02 * h, h * 0.35], rx: h * 0.5, ry: h * 0.5 },
        { at: [0, -0.06 * h, h * 0.9], rx: h * 0.3, ry: h * 0.3 },
      ],
      6,
    );
    parts.push({ geometry: place(skull), color: plumage, bone: 'head' });
    const beak = new THREE.ConeGeometry(h * 0.28, h * 0.7, 4);
    // ConeGeometry points +Y; rotateX(π/2) takes +Y to +Z, the nose.
    beak.rotateX(Math.PI / 2);
    beak.rotateY(Math.PI / 4);
    beak.translate(0, -h * 0.12, h * 1.15);
    parts.push({ geometry: place(beak), color: PALETTE.MARKER_YELLOW, bone: 'head' });
    const teeth = rng.int(2, 4);
    for (let i = 0; i < teeth; i++) {
      const t = i / Math.max(teeth - 1, 1);
      const blade = new THREE.ConeGeometry(h * 0.16, h * (0.7 - t * 0.3), 3);
      blade.scale(1, 1, 0.4);
      blade.translate(0, h * 0.62, h * 0.55 - t * h * 0.6);
      parts.push({ geometry: place(blade), color: PALETTE.COMB, bone: 'head' });
    }
    if (rng.chance(0.6)) {
      const wattle = new THREE.IcosahedronGeometry(h * 0.22, 0);
      wattle.scale(0.5, 1.1, 0.7);
      wattle.translate(0, -h * 0.5, h * 0.7);
      parts.push({ geometry: place(wattle), color: PALETTE.COMB, bone: 'head' });
    }

    // Wings: a plate on each flank, hanging from a shoulder at its top.
    for (const side of [1, -1] as const) {
      const shoulder = new THREE.Vector3(side * b * 0.3, belly + b * 0.3, b * 0.1);
      const wing = new THREE.IcosahedronGeometry(b * 0.42, 0);
      wing.scale(0.22, 0.65, 1.0);
      wing.translate(0, -b * 0.28, -b * 0.12);
      // Canted so it lies against the flank, tucked in at the bottom.
      wing.rotateZ(-side * 0.18);
      wing.translate(shoulder.x, shoulder.y, shoulder.z);
      const name = side > 0 ? 'wingL' : 'wingR';
      parts.push({ geometry: wing, color: plumage, bone: name });
      bones.push({ name, parent: 'body', at: shoulder.toArray() as [number, number, number] });
    }

    // Tail: a fan of flat feathers, cocked up and back.
    const tailRoot = new THREE.Vector3(0, belly + b * 0.36, -b * 0.62);
    bones.push({ name: 'tail', parent: 'body', at: tailRoot.toArray() as [number, number, number] });
    const feathers = rng.int(3, 5);
    for (let i = 0; i < feathers; i++) {
      const spread = (i / Math.max(feathers - 1, 1) - 0.5) * 0.8;
      const feather = new THREE.ConeGeometry(b * 0.2, b * rng.range(0.9, 1.4), 3);
      feather.scale(1, 1, 0.35);
      feather.translate(0, b * 0.5, 0);
      // rotateX(−1) tips the +Y feather back toward −Z: cocked up and behind.
      feather.rotateX(rng.range(-1.1, -0.7));
      feather.rotateY(spread);
      feather.translate(tailRoot.x, tailRoot.y - b * 0.05, tailRoot.z + b * 0.05);
      parts.push({ geometry: feather, color: plumage, bone: 'tail' });
    }

    // Legs, out of the middle of the body, with a three-toed foot.
    for (const side of [1, -1] as const) {
      const hip = new THREE.Vector3(side * b * 0.24, belly, b * 0.02);
      const foot = new THREE.Vector3(hip.x, 0, hip.z);
      const name = side > 0 ? 'legL' : 'legR';
      parts.push({ geometry: segment(hip, foot, b * 0.05, b * 0.045, 4), color: PALETTE.MARKER_YELLOW, bone: name });
      for (const toe of [-0.45, 0, 0.45]) {
        const t = new THREE.CylinderGeometry(b * 0.02, b * 0.03, b * 0.22, 3);
        t.translate(0, b * 0.11, 0);
        // rotateX(π/2) takes the +Y toe to +Z, forward.
        t.rotateX(Math.PI / 2);
        t.rotateY(toe);
        t.translate(foot.x, b * 0.02, foot.z);
        parts.push({ geometry: t, color: PALETTE.MARKER_YELLOW, bone: name });
      }
      bones.push({ name, parent: 'root', at: hip.toArray() as [number, number, number] });
    }

    const mesh = finishRigged(parts, { bones }, 'poultry', rng() * Math.PI * 2, scale);
    const life: LifeSpec = {
      kind: 'fowl',
      seed,
      legLength: legLength * scale,
      bodyLength: b * 1.3 * scale,
      height: (belly + b * 0.5) * scale,
      headHeight: poll.y * scale,
      radius: b * 0.6 * scale,
      walkSpeed: 0.35 * scale,
      roam: roam ?? 4,
      call: 'fowl',
      tone: 0.19 / b,
      grazes: true,
      grazeDrop: 1.1,
    };
    mesh.userData.life = life;
    return mesh;
  },
};
