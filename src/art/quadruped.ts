import * as THREE from 'three';
import { assemble, finish, type Part } from './assemble';
import { lumpySphere } from './blob';
import type { Rng } from './random';
import type { BuildOptions } from './types';

/**
 * One body plan, five animals.
 *
 * A cow, a pig, a sheep and a horse are the same arrangement of parts at
 * different proportions — and proportion is nearly all of what tells them
 * apart at a glance. A horse is legs and neck; a pig is body and no legs; a
 * sheep is a cow's outline made of wool. Writing four builders would mean
 * fixing the same bug four times and would still not make them any more
 * distinct than the numbers below do.
 *
 * Every animal is built facing +Z with its feet on y = 0, then turned as a
 * whole, so a herd scattered across a field faces every which way.
 *
 * This file is not in `builders/`, so the registry does not pick it up as a
 * builder in its own right — only the species that use it are.
 */

export interface Species {
  /** Nose to rump, in metres. */
  length: [number, number];
  /** Depth of the barrel of the body. */
  girth: [number, number];
  /** Ground to belly. The single most species-defining number here. */
  legLength: [number, number];
  legThickness: number;
  /** Length of the neck, and how far it rises from horizontal, in radians. */
  neck: [number, number];
  neckRise: [number, number];
  headSize: [number, number];
  /** Stretch of the head along its own axis. A horse is long, a pig is not. */
  headStretch: number;
  /** Extra cone on the front of the head. */
  snout: number;
  ears: 'none' | 'floppy' | 'perked' | 'side';
  horns: 'none' | 'stub' | 'curved';
  tail: 'none' | 'switch' | 'curl' | 'flowing';
  /** Lumps of fleece over the body. */
  woolly: boolean;
  hide: readonly number[];
  extremity: number;
  /**
   * Second hide colour for markings, painted per face. Omit for a plain coat.
   * `patchCoverage` is the fraction of the body it takes, roughly.
   */
  patch?: readonly number[];
  patchCoverage?: number;
}

function range(rng: Rng, span: [number, number]): number {
  return rng.range(span[0], span[1]);
}

/**
 * Markings, as colour rather than as geometry.
 *
 * A patched cow is one mesh in two colours, not a mesh with blobs stuck to it.
 * Extra geometry for a flat marking is wrong twice over: it costs triangles
 * for something with no volume, and it reads as *lumps* rather than as
 * patches, because that is what it is.
 *
 * The pattern is a hashed 3-D lattice sampled at each face's centroid, so
 * patches are irregular, hold together across the body, and land exactly on
 * facet edges — which suits a faceted animal far better than any smooth
 * boundary would.
 */
function marking(base: number, patch: number, rng: Rng, scale: number, coverage: number) {
  // Random phase per animal, so no two are patched alike.
  const ox = rng.range(0, 100);
  const oy = rng.range(0, 100);
  const oz = rng.range(0, 100);

  const hash = (x: number, y: number, z: number): number => {
    let h = Math.imul(Math.round(x) * 374761393 + Math.round(y) * 668265263, 1);
    h = Math.imul(h ^ (h >>> 13), 1274126177) + Math.round(z) * 951274213;
    h ^= h >>> 16;
    return ((h >>> 0) % 1000) / 1000;
  };

  const noise = (x: number, y: number, z: number): number => {
    // Trilinear on a lattice, smoothed — enough structure to read as a patch
    // and cheap enough to run per face.
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
          const w =
            (dx ? tx : 1 - tx) * (dy ? ty : 1 - ty) * (dz ? tz : 1 - tz);
          sum += hash(fx + dx, fy + dy, fz + dz) * w;
        }
      }
    }
    return sum;
  };

  return (x: number, y: number, z: number): number =>
    noise(x * scale + ox, y * scale + oy, z * scale + oz) < coverage ? patch : base;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

export function buildQuadruped(
  name: string,
  species: Species,
  rng: Rng,
  { scale = 1 }: BuildOptions,
): THREE.Mesh {
  const parts: Part[] = [];

  const length = range(rng, species.length);
  const girth = range(rng, species.girth);
  const legLength = range(rng, species.legLength);
  const width = girth * rng.range(0.62, 0.78);
  const hide = rng.pick(species.hide);
  const belly = legLength + girth / 2;

  // --- body ---------------------------------------------------------------
  //
  // A fleece is the body's own surface made lumpy, not lumps added to it.
  //
  // Scattering separate blobs over a torso cannot give even coverage: random
  // placement clusters in some places and leaves bare patches in others, which
  // is a property of randomness rather than of the parameters, so no amount of
  // adjusting the count or the size fixes it. Displacing the vertices of the
  // body itself gives a fleece that is lumpy *everywhere* and nowhere gapped,
  // for fewer triangles than the blobs cost.
  //
  // Detail 1 for anything sizeable: twelve vertices is too few to read as a
  // torso once it has been stretched this far along one axis, and too few to
  // carry a fleece at all.
  const detail = species.woolly || length > 1.2 ? 1 : 0;
  const body = species.woolly
    ? lumpySphere(rng, girth / 2, detail, 0.86, 1.24)
    : new THREE.IcosahedronGeometry(girth / 2, detail);
  body.scale(width / girth, 1, length / girth);
  body.rotateZ(rng.around(0, 0.05));
  body.translate(0, belly, 0);

  // Patched animals get a two-colour coat on the same geometry. The lattice is
  // scaled against the animal so a cow and a pig get patches of comparable
  // size relative to themselves rather than in absolute metres.
  const coat = species.woolly
    ? PALETTE_WOOL
    : species.patch
      ? marking(hide, rng.pick(species.patch), rng, 2.6 / girth, species.patchCoverage ?? 0.45)
      : hide;
  parts.push({ geometry: body, color: coat, sway: 0 });

  // --- neck and head ------------------------------------------------------
  const neckLength = range(rng, species.neck);
  const rise = range(rng, species.neckRise);
  const shoulder = new THREE.Vector3(0, belly + girth * 0.18, length * 0.4);

  // The neck runs *back into* the body, not up out of it.
  //
  // A cylinder starting exactly at the shoulder leaves its base cap exposed,
  // and on an animal that carries its head low — a cow — that cap is a flat
  // disc standing up behind the withers in plain view. Extending it half a
  // girth backwards buries the cap inside the torso where no one can see it,
  // and costs nothing: the head is still placed `neckLength` along the axis,
  // so the visible neck is exactly as long as it was.
  const burial = girth * 0.45;
  const neckTotal = neckLength + burial;
  const neck = new THREE.CylinderGeometry(girth * 0.17, girth * 0.24, neckTotal, 6);
  neck.translate(0, neckTotal / 2 - burial, 0);
  // Rotated about X so it leans forward out of the shoulders rather than
  // standing straight up out of the back.
  neck.rotateX(Math.PI / 2 - rise);
  neck.translate(shoulder.x, shoulder.y, shoulder.z);
  parts.push({ geometry: neck, color: coat, sway: 0 });

  const headAt = new THREE.Vector3(
    0,
    shoulder.y + Math.sin(rise) * neckLength,
    shoulder.z + Math.cos(rise) * neckLength,
  );

  const headSize = range(rng, species.headSize);
  const head = new THREE.IcosahedronGeometry(headSize, 0);
  head.scale(0.85, 0.9, species.headStretch);
  head.rotateY(rng.around(0, 0.2));
  head.translate(headAt.x, headAt.y, headAt.z);
  // Also the coat: the marking function is evaluated in the animal's own
  // space, so a patch that reaches the shoulder carries on up the neck and
  // over the head as one continuous marking rather than stopping at a seam.
  parts.push({ geometry: head, color: coat, sway: 0 });

  if (species.snout > 0) {
    const snout = new THREE.CylinderGeometry(
      headSize * species.snout * 0.8,
      headSize * species.snout,
      headSize * 0.5,
      6,
    );
    snout.rotateX(Math.PI / 2);
    snout.translate(headAt.x, headAt.y - headSize * 0.15, headAt.z + headSize * species.headStretch);
    parts.push({ geometry: snout, color: species.extremity, sway: 0 });
  }

  for (const side of [-1, 1]) {
    if (species.ears !== 'none') {
      const ear = new THREE.ConeGeometry(headSize * 0.28, headSize * 0.85, 4);
      ear.translate(0, headSize * 0.42, 0);
      // Floppy hangs, perked stands, side sticks out level — three rotations
      // off one cone, and each reads as a different animal.
      if (species.ears === 'floppy') ear.rotateZ(side * 2.4);
      else if (species.ears === 'side') ear.rotateZ(side * 1.5);
      else ear.rotateZ(side * 0.35);
      ear.translate(headAt.x + side * headSize * 0.6, headAt.y + headSize * 0.4, headAt.z);
      parts.push({ geometry: ear, color: species.extremity, sway: 0 });
    }

    if (species.horns !== 'none') {
      const hornLength = headSize * (species.horns === 'curved' ? 1.5 : 0.7);
      const horn = new THREE.ConeGeometry(headSize * 0.16, hornLength, 5);
      horn.translate(0, hornLength / 2, 0);
      horn.rotateZ(side * (species.horns === 'curved' ? 1.1 : 0.5));
      horn.translate(headAt.x + side * headSize * 0.45, headAt.y + headSize * 0.55, headAt.z);
      parts.push({ geometry: horn, color: PALETTE_HORN, sway: 0 });
    }

    // --- legs -------------------------------------------------------------
    for (const end of [-1, 1]) {
      // Run right up to the centre of the body, not to its lowest point.
      //
      // The torso is an ellipsoid, so its underside is *much* higher out at
      // the shoulders and haunches than it is under the middle — at the leg
      // positions here, roughly half a body-radius higher. Legs cut to the
      // belly's lowest point therefore stopped in mid-air under an animal that
      // curved away above them. Ending them at the body's centre buries the
      // top of each leg inside the torso, where it is never seen, and the
      // visible length below the body is unchanged.
      const legTotal = belly;
      const leg = new THREE.CylinderGeometry(
        species.legThickness * 0.78,
        species.legThickness,
        legTotal,
        5,
      );
      leg.translate(0, legTotal / 2, 0);
      // A little splay, and a little stagger fore and aft, so it stands rather
      // than being suspended on four identical posts.
      leg.rotateZ(side * rng.range(-0.02, 0.07));
      leg.translate(side * width * 0.34, 0, end * length * rng.range(0.26, 0.34));
      parts.push({ geometry: leg, color: hide, sway: 0 });

      const hoof = new THREE.CylinderGeometry(
        species.legThickness * 1.15,
        species.legThickness * 1.05,
        legLength * 0.13,
        5,
      );
      hoof.translate(side * width * 0.34, legLength * 0.06, end * length * 0.3);
      parts.push({ geometry: hoof, color: PALETTE_HOOF, sway: 0 });
    }
  }

  // --- tail ---------------------------------------------------------------
  if (species.tail !== 'none') {
    // Rooted just inside the rump rather than on its surface, so the tail
    // emerges from the body instead of being stuck to the back of it.
    const root = new THREE.Vector3(0, belly + girth * 0.16, -length * 0.42);

    if (species.tail === 'curl') {
      // A tight spiral — unmistakably a pig from behind. Beads overlap by
      // design: spaced at their own diameter they read as a string of separate
      // balls, which is not a tail.
      const beads = 9;
      const bead = girth * 0.06;
      for (let i = 0; i < beads; i++) {
        const t = i / (beads - 1);
        const turn = t * Math.PI * 2.2;
        const sphere = new THREE.IcosahedronGeometry(bead * (1 - t * 0.25), 0);
        sphere.translate(
          Math.sin(turn) * girth * 0.1,
          root.y + t * girth * 0.2,
          root.z - girth * 0.04 - (1 - Math.cos(turn)) * girth * 0.05,
        );
        parts.push({ geometry: sphere, color: species.extremity, sway: 0 });
      }
    } else {
      const tailLength = length * (species.tail === 'flowing' ? 0.55 : 0.42);
      // Down and *back*, never forward. The old range allowed negative angles,
      // which swung the tail under the animal and through its own hind legs.
      const angle = rng.range(0.08, 0.42);

      const tail = new THREE.CylinderGeometry(girth * 0.035, girth * 0.06, tailLength, 4);
      tail.translate(0, -tailLength / 2, 0);
      tail.rotateX(angle);
      tail.translate(root.x, root.y, root.z);
      parts.push({ geometry: tail, color: hide, sway: 0.35 });

      // **The tuft follows the same rotation the tail did.**
      //
      // It used to be placed straight down from the root while the tail itself
      // was rotated away, so the further the tail swung the further the switch
      // floated off the end of it. Rotating a point about X by `a` sends
      // (0, −L, 0) to (0, −L·cos a, −L·sin a) — so that is where the end of
      // the tail actually is, and 0.92 of the way along puts the tuft over the
      // join rather than balanced on the tip.
      const along = tailLength * 0.92;
      const tuft = new THREE.IcosahedronGeometry(girth * 0.09, 0);
      tuft.scale(0.75, species.tail === 'flowing' ? 1.7 : 1.05, 0.75);
      tuft.rotateX(angle);
      tuft.translate(
        root.x,
        root.y - along * Math.cos(angle),
        root.z - along * Math.sin(angle),
      );
      // The switch at the end is the part that moves.
      parts.push({ geometry: tuft, color: PALETTE_HORN, sway: 0.6 });
    }
  }

  const geometry = assemble(parts);
  geometry.rotateY(rng.range(0, Math.PI * 2));
  if (scale !== 1) geometry.scale(scale, scale, scale);
  return finish(geometry, name, rng() * Math.PI * 2);
}

// Imported by value rather than through the palette module's namespace so the
// hot loop above is not doing a property lookup per part.
const PALETTE_WOOL = 0xbdb6a4;
const PALETTE_HORN = 0x8a8069;
const PALETTE_HOOF = 0x3a332b;
