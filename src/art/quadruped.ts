import * as THREE from 'three';
import type { Part } from './assemble';
import { loft, ruffle, type Station } from './loft';
import { lumpySphere } from './blob';
import { finishRigged, type BoneSpec } from './rig';
import type { Rng } from './random';
import type { BuildOptions } from './types';
import { PALETTE } from './palette';
import type { LifeSpec, LifeOptions } from '../life/spec';

/**
 * One body plan, four animals — cow, sheep, pig, dog. Proportion tells them
 * apart: the body is a loft along the spine with a species profile (a cow is
 * boxy with a sagging belly, a pig a torpedo), the legs have a knee and a hock,
 * and every species builds its own head.
 *
 * Built facing +Z with its feet on y = 0, and rigged. Bones:
 *
 *   root ─ body ─ neck ─ head ─ earL/earR
 *        │        └ tail ─ tail2
 *        └ legFLu ─ legFLl   (and FR, BL, BR; u = upper, l = lower)
 *
 * The legs hang off the root rather than the body, so a breathing or bobbing
 * body does not lift the feet off the ground.
 */

/** A ring of the body loft, in units of the animal: z as a fraction of its
 * length (−0.5 rump … +0.5 chest), y offset and radii in girths. */
export interface BodyStation {
  z: number;
  y: number;
  rx: number;
  ry: number;
}

export interface HeadContext {
  /** The scale the head is measured against. */
  size: number;
  coat: Part['color'];
  extremity: number;
  /** The tail tuft colour. */
  hair: number;
  rng: Rng;
}

/**
 * A head, built in its own space: the pivot at the origin is where the neck
 * ends (the poll), the head extends along +Z, y is up. The plan pitches and
 * places it, and binds `parts` to the head bone and `ears` to the ear bones.
 */
export interface Head {
  parts: Part[];
  ears: Part[];
  /** Ear pivots, one per side, in head space. */
  earPivots: readonly [THREE.Vector3, THREE.Vector3];
}

export interface Species {
  /** Nose to rump, metres. */
  length: [number, number];
  /** Depth of the barrel. */
  girth: [number, number];
  /** Ground to belly. */
  legLength: [number, number];
  legThickness: number;
  /** How far the hock sits behind the hip, as a fraction of leg length. */
  hock: number;
  feet: 'hoof' | 'paw';
  body: readonly BodyStation[];
  sides: number;
  woolly: boolean;
  /** Length of the neck, and its rise from horizontal, radians. */
  neck: [number, number];
  neckRise: [number, number];
  /** Neck radius at the shoulder, in girths. */
  neckThick: number;
  headSize: [number, number];
  /** The head's pitch from horizontal, nose-down positive, radians. */
  headPitch: number;
  head: (context: HeadContext) => Head;
  tail: 'switch' | 'curl' | 'carried' | 'dock';
  hide: readonly number[];
  extremity: number;
  hair: readonly number[];
  patch?: readonly number[];
  patchCoverage?: number;
  /** Behaviour. */
  walkSpeed: number;
  call: LifeSpec['call'];
  grazes: boolean;
}

function range(rng: Rng, span: [number, number]): number {
  return rng.range(span[0], span[1]);
}

/** Two-colour coat, sampled per face on a smoothed lattice. */
function marking(base: number, patch: number, rng: Rng, scale: number, coverage: number) {
  const ox = rng.range(0, 100);
  const oy = rng.range(0, 100);
  const oz = rng.range(0, 100);
  const hash = (x: number, y: number, z: number): number => {
    let h = Math.imul(Math.round(x) * 374761393 + Math.round(y) * 668265263, 1);
    h = Math.imul(h ^ (h >>> 13), 1274126177) + Math.round(z) * 951274213;
    h ^= h >>> 16;
    return ((h >>> 0) % 1000) / 1000;
  };
  const smooth = (t: number): number => t * t * (3 - 2 * t);
  const noise = (x: number, y: number, z: number): number => {
    const fx = Math.floor(x);
    const fy = Math.floor(y);
    const fz = Math.floor(z);
    const tx = smooth(x - fx);
    const ty = smooth(y - fy);
    const tz = smooth(z - fz);
    let sum = 0;
    for (let dz = 0; dz <= 1; dz++) {
      for (let dy = 0; dy <= 1; dy++) {
        for (let dx = 0; dx <= 1; dx++) {
          const w = (dx ? tx : 1 - tx) * (dy ? ty : 1 - ty) * (dz ? tz : 1 - tz);
          sum += hash(fx + dx, fy + dy, fz + dz) * w;
        }
      }
    }
    return sum;
  };
  return (x: number, y: number, z: number): number =>
    noise(x * scale + ox, y * scale + oy, z * scale + oz) < coverage ? patch : base;
}

/**
 * A tapered cylinder from `from` to `to`. Built along −Y from the origin, then
 * turned so −Y lands on the segment's direction and moved to `from` — so the
 * top cap sits at `from`, which is the joint.
 */
export function segment(
  from: THREE.Vector3,
  to: THREE.Vector3,
  rTop: number,
  rBottom: number,
  sides: number,
): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const geometry = new THREE.CylinderGeometry(rTop, rBottom, length, sides);
  geometry.translate(0, -length / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, -1, 0),
    dir.divideScalar(length),
  );
  geometry.applyQuaternion(q);
  geometry.translate(from.x, from.y, from.z);
  return geometry;
}

const PALETTE_HOOF = 0x3a332b;

export function buildQuadruped(
  name: string,
  species: Species,
  rng: Rng,
  { scale = 1, roam, seed = 1 }: LifeOptions,
): THREE.SkinnedMesh {
  const parts: Part[] = [];
  const bones: BoneSpec[] = [];

  const L = range(rng, species.length);
  const G = range(rng, species.girth);
  const legLength = range(rng, species.legLength);
  const hide = rng.pick(species.hide);
  const hair = rng.pick(species.hair);
  /** Height of the spine line — the centre of the deepest ring. */
  const mid = legLength + G * 0.5;

  const coat: Part['color'] = species.woolly
    ? PALETTE.WOOL
    : species.patch
      ? marking(hide, rng.pick(species.patch), rng, 2.6 / G, species.patchCoverage ?? 0.45)
      : hide;

  bones.push({ name: 'root', at: [0, 0, 0] });
  bones.push({ name: 'body', parent: 'root', at: [0, mid, 0] });

  // --- body ---------------------------------------------------------------
  const stations: Station[] = species.body.map((s) => ({
    at: [0, mid + s.y * G, s.z * L],
    rx: s.rx * G * rng.range(0.96, 1.04),
    ry: s.ry * G,
  }));
  let body = loft(stations, species.sides);
  if (species.woolly) body = ruffle(body, rng, 0.9, 1.14, mid);
  parts.push({ geometry: body, color: coat, bone: 'body' });

  // --- neck ---------------------------------------------------------------
  const neckLength = range(rng, species.neck);
  const rise = range(rng, species.neckRise);
  // rotateX(−rise) takes +Z to (0, sin rise, cos rise), which is the neck's
  // direction: forward and up out of the shoulder.
  const dir = new THREE.Vector3(0, Math.sin(rise), Math.cos(rise));
  const up = new THREE.Vector3(0, Math.cos(rise), -Math.sin(rise));
  const shoulder = new THREE.Vector3(0, mid + G * 0.16, L * 0.36);
  const neckAt = (t: number, lift = 0): THREE.Vector3 =>
    shoulder.clone().addScaledVector(dir, t * neckLength).addScaledVector(up, lift);
  const thick = species.neckThick * G;
  const neckStations: Station[] = [
    { at: neckAt(0).toArray() as [number, number, number], rx: thick * 0.95, ry: thick * 1.15, axis: dir.toArray() as [number, number, number] },
    {
      at: neckAt(0.5).toArray() as [number, number, number],
      rx: thick * 0.72,
      ry: thick * 0.95,
      axis: dir.toArray() as [number, number, number],
    },
    { at: neckAt(1).toArray() as [number, number, number], rx: thick * 0.55, ry: thick * 0.66, axis: dir.toArray() as [number, number, number] },
  ];
  parts.push({ geometry: loft(neckStations, 6, { start: false, end: false }), color: coat, bone: 'neck' });
  bones.push({ name: 'neck', parent: 'body', at: shoulder.toArray() as [number, number, number] });

  // --- head ---------------------------------------------------------------
  const headSize = range(rng, species.headSize);
  const poll = neckAt(1);
  const pitch = species.headPitch;
  const head = species.head({ size: headSize, coat, extremity: species.extremity, hair, rng });
  // rotateX(pitch) takes the head's +Z to (0, −sin pitch, cos pitch): nose
  // down by `pitch` from horizontal, then carried to the poll.
  const placeHead = (geometry: THREE.BufferGeometry): THREE.BufferGeometry => {
    geometry.rotateX(pitch);
    geometry.translate(poll.x, poll.y, poll.z);
    return geometry;
  };
  bones.push({ name: 'head', parent: 'neck', at: poll.toArray() as [number, number, number] });
  for (const part of head.parts) parts.push({ ...part, geometry: placeHead(part.geometry), bone: 'head' });
  const earPivot = (p: THREE.Vector3): [number, number, number] =>
    p.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch).add(poll).toArray() as [number, number, number];
  bones.push({ name: 'earL', parent: 'head', at: earPivot(head.earPivots[0]) });
  bones.push({ name: 'earR', parent: 'head', at: earPivot(head.earPivots[1]) });
  head.ears.forEach((part, i) => {
    parts.push({ ...part, geometry: placeHead(part.geometry), bone: i % 2 === 0 ? 'earL' : 'earR' });
  });

  // --- legs ---------------------------------------------------------------
  const width = species.body.reduce((w, s) => Math.max(w, s.rx), 0) * G * 2;
  const T = species.legThickness;
  for (const side of [1, -1] as const) {
    for (const end of [1, -1] as const) {
      const tag = `leg${end > 0 ? 'F' : 'B'}${side > 0 ? 'L' : 'R'}`;
      const x = side * width * 0.36;
      const z = end * L * rng.range(0.28, 0.33);
      // Joint inside the body, at the spine line; the upper leg is buried
      // from there to the belly.
      const joint = new THREE.Vector3(x, mid, z);
      const hock = end < 0 ? species.hock * legLength : -0.03 * legLength;
      const knee = new THREE.Vector3(x, legLength * (end < 0 ? 0.42 : 0.5), z - hock);
      const foot = new THREE.Vector3(x, 0, z - hock * 0.55);

      parts.push({ geometry: segment(joint, knee, T * 1.7, T * 1.05, 6), color: hide, bone: `${tag}u` });
      parts.push({ geometry: segment(knee, foot, T * 1.0, T * 0.82, 5), color: hide, bone: `${tag}l` });
      bones.push({ name: `${tag}u`, parent: 'root', at: joint.toArray() as [number, number, number] });
      bones.push({ name: `${tag}l`, parent: `${tag}u`, at: knee.toArray() as [number, number, number] });

      if (species.feet === 'paw') {
        const paw = new THREE.BoxGeometry(T * 2.4, legLength * 0.1, T * 3.4);
        paw.translate(foot.x, legLength * 0.05, foot.z + T * 0.9);
        parts.push({ geometry: paw, color: species.extremity, bone: `${tag}l` });
      } else {
        const hoof = new THREE.CylinderGeometry(T * 1.15, T * 1.05, legLength * 0.12, 5);
        hoof.translate(foot.x, legLength * 0.06, foot.z);
        parts.push({ geometry: hoof, color: PALETTE_HOOF, bone: `${tag}l` });
      }
    }
  }

  // --- tail ---------------------------------------------------------------
  const tailRoot = new THREE.Vector3(0, mid + G * (species.tail === 'switch' ? 0.2 : 0.14), -L * 0.47);
  bones.push({ name: 'tail', parent: 'body', at: tailRoot.toArray() as [number, number, number] });
  buildTail(species, rng, parts, bones, tailRoot, L, G, hide, hair);

  const mesh = finishRigged(parts, { bones }, name, rng() * Math.PI * 2, scale);

  const s = scale;
  const life: LifeSpec = {
    kind: 'quadruped',
    seed,
    legLength: legLength * s,
    bodyLength: L * s,
    height: (mid + G * 0.5) * s,
    headHeight: poll.y * s,
    radius: Math.max(width * 0.5, L * 0.32) * s,
    walkSpeed: species.walkSpeed * s,
    roam: roam ?? 5,
    call: species.call,
    grazes: species.grazes,
    grazeDrop: Math.min(2.6, rise + 1.7),
    // A bigger animal of its kind has a longer throat: below 1 is bigger.
    tone: (species.girth[0] + species.girth[1]) / (2 * G),
  };
  mesh.userData.life = life;
  return mesh;
}

function buildTail(
  species: Species,
  rng: Rng,
  parts: Part[],
  bones: BoneSpec[],
  root: THREE.Vector3,
  L: number,
  G: number,
  hide: number,
  hair: number,
): void {
  const v = (x: number, y: number, z: number): [number, number, number] => [x, y, z];
  switch (species.tail) {
    case 'switch': {
      // Down and a little back, to about the hock; a tuft on the end.
      const length = L * 0.34;
      const angle = rng.range(0.1, 0.3);
      const end = root.clone().add(new THREE.Vector3(0, -Math.cos(angle) * length, -Math.sin(angle) * length));
      const knee = root.clone().lerp(end, 0.5);
      parts.push({ geometry: segment(root, knee, G * 0.06, G * 0.045, 4), color: hide, bone: 'tail' });
      parts.push({ geometry: segment(knee, end, G * 0.045, G * 0.03, 4), color: hide, bone: 'tail2' });
      const tuft = new THREE.IcosahedronGeometry(G * 0.1, 0);
      tuft.scale(0.75, 1.3, 0.75);
      tuft.translate(end.x, end.y - G * 0.04, end.z);
      parts.push({ geometry: tuft, color: hair, bone: 'tail2' });
      bones.push({ name: 'tail2', parent: 'tail', at: v(knee.x, knee.y, knee.z) });
      return;
    }
    case 'curl': {
      const beads = 9;
      const bead = G * 0.06;
      for (let i = 0; i < beads; i++) {
        const t = i / (beads - 1);
        const turn = t * Math.PI * 2.2;
        const sphere = new THREE.IcosahedronGeometry(bead * (1 - t * 0.25), 0);
        sphere.translate(
          root.x + Math.sin(turn) * G * 0.1,
          root.y + t * G * 0.2,
          root.z - G * 0.04 - (1 - Math.cos(turn)) * G * 0.05,
        );
        parts.push({ geometry: sphere, color: species.extremity, bone: 'tail' });
      }
      bones.push({ name: 'tail2', parent: 'tail', at: v(root.x, root.y + G * 0.1, root.z - G * 0.05) });
      return;
    }
    case 'carried': {
      // Up and back in a shallow arc, thick at the root, in two bones.
      const segments = 4;
      const length = L * rng.range(0.28, 0.6);
      const step = length / segments;
      let angle = -rng.range(0.7, 1);
      const cursor = root.clone();
      let mid: THREE.Vector3 | null = null;
      for (let i = 0; i < segments; i++) {
        const next = cursor.clone().add(new THREE.Vector3(0, step * Math.cos(angle), step * Math.sin(angle)));
        const thick = G * 0.075 * (1 - i / (segments + 1));
        parts.push({
          geometry: segment(cursor, next, thick, thick * 0.7, 4),
          color: hide,
          bone: i < 2 ? 'tail' : 'tail2',
        });
        cursor.copy(next);
        if (i === 1) mid = next.clone();
        angle += rng.range(0.15, 0.35);
      }
      bones.push({ name: 'tail2', parent: 'tail', at: v(mid!.x, mid!.y, mid!.z) });
      return;
    }
    case 'dock': {
      const length = L * 0.13;
      const end = root.clone().add(new THREE.Vector3(0, -length * 0.9, -length * 0.4));
      parts.push({ geometry: segment(root, end, G * 0.07, G * 0.05, 5), color: PALETTE.WOOL, bone: 'tail' });
      bones.push({ name: 'tail2', parent: 'tail', at: v(end.x, end.y, end.z) });
      return;
    }
  }
}

// --- heads --------------------------------------------------------------------
//
// All in head space: origin at the poll, +Z toward the nose, y up. Ears are
// returned separately, left then right, with their pivots.

function earPair(
  build: (side: 1 | -1) => THREE.BufferGeometry,
  pivot: (side: 1 | -1) => THREE.Vector3,
  color: Part['color'],
): Pick<Head, 'ears' | 'earPivots'> {
  return {
    ears: [
      { geometry: build(1), color },
      { geometry: build(-1), color },
    ],
    earPivots: [pivot(1), pivot(-1)],
  };
}

/** A flat triangular ear: a three-sided cone flattened, its base at the origin. */
function earBlade(length: number, width: number, thin = 0.3): THREE.BufferGeometry {
  const ear = new THREE.ConeGeometry(width, length, 3);
  ear.translate(0, length / 2, 0);
  ear.scale(1, 1, thin);
  return ear;
}

/** Cattle: broad flat forehead, wide muzzle, ears out level, stub horns. */
export function bovineHead({ size: s, coat, extremity }: HeadContext): Head {
  const parts: Part[] = [];
  const skull = loft(
    [
      { at: [0, 0, 0], rx: s * 0.52, ry: s * 0.5 },
      { at: [0, 0.02 * s, 0.9 * s], rx: s * 0.6, ry: s * 0.56 },
      { at: [0, -0.1 * s, 1.6 * s], rx: s * 0.46, ry: s * 0.44 },
    ],
    6,
    { start: true, end: false },
  );
  parts.push({ geometry: skull, color: coat });
  const muzzle = loft(
    [
      { at: [0, -0.1 * s, 1.5 * s], rx: s * 0.44, ry: s * 0.42 },
      { at: [0, -0.16 * s, 2.15 * s], rx: s * 0.4, ry: s * 0.36 },
    ],
    6,
    { start: false, end: true },
  );
  parts.push({ geometry: muzzle, color: extremity });
  for (const side of [1, -1] as const) {
    const horn = new THREE.ConeGeometry(s * 0.13, s * 0.6, 5);
    horn.translate(0, s * 0.3, 0);
    // rotateZ(−side·1.2): rotation about Z takes +Y toward −X, so the minus
    // lays the horn out toward its own side, tip up a little.
    horn.rotateZ(-side * 1.2);
    horn.translate(side * s * 0.36, s * 0.42, s * 0.35);
    parts.push({ geometry: horn, color: PALETTE.STONE_PALE });
  }
  const pivot = (side: 1 | -1) => new THREE.Vector3(side * s * 0.5, s * 0.22, s * 0.6);
  return {
    parts,
    ...earPair(
      (side) => {
        const ear = earBlade(s * 0.7, s * 0.24);
        // Out to its own side and drooping a little: rotateZ takes +Y toward
        // −X, so −side, and 1.75 is past level.
        ear.rotateZ(-side * 1.75);
        ear.rotateY(side * 0.3);
        const p = pivot(side);
        ear.translate(p.x, p.y, p.z);
        return ear;
      },
      pivot,
      extremity,
    ),
  };
}

/** Pig: a wedge with a disc on the end and big ears flopped forward. */
export function porcineHead({ size: s, coat, extremity, rng }: HeadContext): Head {
  const parts: Part[] = [];
  const skull = loft(
    [
      { at: [0, 0, 0], rx: s * 0.62, ry: s * 0.56 },
      { at: [0, -0.04 * s, 0.8 * s], rx: s * 0.56, ry: s * 0.5 },
      { at: [0, -0.16 * s, 1.55 * s], rx: s * 0.36, ry: s * 0.34 },
    ],
    7,
    { start: true, end: true },
  );
  parts.push({ geometry: skull, color: coat });
  const snout = new THREE.CylinderGeometry(s * 0.34, s * 0.3, s * 0.26, 8);
  // CylinderGeometry stands on +Y; rotateX(π/2) lays it along −Z… and the
  // disc is symmetric, so along the nose either way.
  snout.rotateX(Math.PI / 2);
  snout.translate(0, -0.18 * s, 1.68 * s);
  parts.push({ geometry: snout, color: extremity });
  const pivot = (side: 1 | -1) => new THREE.Vector3(side * s * 0.42, s * 0.42, s * 0.35);
  return {
    parts,
    ...earPair(
      (side) => {
        const ear = earBlade(s * 0.9, s * 0.34, 0.25);
        // Flopped: rotateX(1.9) drops the tip forward past the face; a roll
        // outward so the pair fan.
        ear.rotateX(1.9);
        ear.rotateZ(-side * rng.range(0.15, 0.35));
        const p = pivot(side);
        ear.translate(p.x, p.y, p.z);
        return ear;
      },
      pivot,
      coat,
    ),
  };
}

/** Sheep: a narrow face out of a fleece, ears level, a topknot. */
export function ovineHead({ size: s, extremity, rng }: HeadContext): Head {
  const parts: Part[] = [];
  const face = loft(
    [
      { at: [0, 0, 0], rx: s * 0.5, ry: s * 0.5 },
      { at: [0, -0.08 * s, 1.0 * s], rx: s * 0.4, ry: s * 0.42 },
      { at: [0, -0.2 * s, 1.75 * s], rx: s * 0.27, ry: s * 0.27 },
    ],
    6,
  );
  parts.push({ geometry: face, color: extremity });
  const knot = lumpySphere(rng, s * 0.5, 0, 0.85, 1.15);
  knot.scale(1.1, 0.75, 1.1);
  knot.translate(0, s * 0.4, s * 0.15);
  parts.push({ geometry: knot, color: PALETTE.WOOL });
  const pivot = (side: 1 | -1) => new THREE.Vector3(side * s * 0.4, s * 0.25, s * 0.35);
  return {
    parts,
    ...earPair(
      (side) => {
        const ear = earBlade(s * 0.62, s * 0.2);
        ear.rotateZ(-side * 1.6);
        ear.rotateY(side * 0.25);
        const p = pivot(side);
        ear.translate(p.x, p.y, p.z);
        return ear;
      },
      pivot,
      extremity,
    ),
  };
}

/** Dog: braincase, a stop, muzzle, jaw, nose, and pricked ears. */
export function canineHead({ size, coat, extremity, rng }: HeadContext): Head {
  const parts: Part[] = [];
  const at = new THREE.Vector3(0, 0, size * 0.55);
  const skullW = size * 1.45;
  const skull = new THREE.CylinderGeometry(size * 0.62, size * 0.78, size * 1.5, 4);
  skull.rotateX(Math.PI / 2);
  skull.rotateZ(Math.PI / 4);
  skull.scale(skullW / (size * 1.1), (size * 1.15) / (size * 1.1), 1);
  skull.translate(at.x, at.y, at.z - size * 0.15);
  parts.push({ geometry: skull, color: coat });

  const muzzleLength = size * rng.range(0.45, 1.05);
  const muzzleY = at.y - size * 0.34;
  const muzzleZ = at.z + size * 0.6;
  const muzzle = new THREE.CylinderGeometry(size * 0.3, size * 0.46, muzzleLength, 4);
  muzzle.rotateX(Math.PI / 2);
  muzzle.rotateZ(Math.PI / 4);
  muzzle.scale(1, 0.78, 1);
  muzzle.translate(at.x, muzzleY, muzzleZ + muzzleLength / 2);
  parts.push({ geometry: muzzle, color: coat });

  const jaw = new THREE.BoxGeometry(size * 0.52, size * 0.26, muzzleLength * 0.8);
  jaw.translate(at.x, muzzleY - size * 0.28, muzzleZ + muzzleLength * 0.44);
  parts.push({ geometry: jaw, color: extremity });

  const nose = new THREE.BoxGeometry(size * 0.36, size * 0.3, size * 0.22);
  nose.translate(at.x, muzzleY + size * 0.08, muzzleZ + muzzleLength + size * 0.05);
  parts.push({ geometry: nose, color: 0x241f1c });

  const brow = new THREE.BoxGeometry(skullW * 0.82, size * 0.2, size * 0.28);
  brow.translate(at.x, at.y + size * 0.22, muzzleZ - size * 0.08);
  parts.push({ geometry: brow, color: coat });

  const prick = rng.range(0.75, 1.05);
  const pivot = (side: 1 | -1) =>
    new THREE.Vector3(at.x + side * skullW * 0.34, at.y + size * 0.4, at.z - size * 0.35);
  return {
    parts,
    ...earPair(
      (side) => {
        const ear = earBlade(size * prick, size * 0.34, 0.34);
        ear.rotateZ(-side * rng.range(0.16, 0.34));
        ear.rotateX(-rng.range(0.05, 0.22));
        const p = pivot(side);
        ear.translate(p.x, p.y, p.z);
        return ear;
      },
      pivot,
      extremity,
    ),
  };
}

export type { BuildOptions };
