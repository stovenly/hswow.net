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

/**
 * Everything a bespoke head needs to know about the animal it belongs to.
 *
 * Passed to `Species.head`, which exists because the shared plan genuinely
 * cannot stretch far enough for every animal. A cow, a pig, a sheep and a horse
 * are one head — a blob with a snout on the front — at different proportions,
 * and that is a real observation rather than a shortcut. A dog is not: it has a
 * *stop*, a hinge between skull and muzzle that none of the livestock has, and
 * without it the head reads as a calf's however the numbers are set. Rather
 * than push dog-shaped special cases into this file, a species that needs a
 * different head brings one.
 */
export interface HeadContext {
  /** Where the head sits, in the animal's own space. It faces +Z. */
  at: THREE.Vector3;
  /** The rolled `headSize`, which everything should be measured against. */
  size: number;
  /** The body's colour, so the head matches it. May be a marking function. */
  coat: Part['color'];
  /** The darker colour used for ears, muzzle and feet. */
  extremity: number;
  rng: Rng;
}

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
  /**
   * What the legs end in. Hooves unless stated.
   *
   * A hoof is a hard block narrower than the leg above it and set slightly
   * forward; a paw is a soft pad *wider* than the leg, sitting flat and
   * spreading in front of it. Every grazing animal here has the first and a dog
   * has the second, and a dog on hooves is the sort of thing the eye catches
   * long before it can say why.
   */
  feet?: 'hoof' | 'paw';
  horns: 'none' | 'stub' | 'curved';
  tail: 'none' | 'switch' | 'curl' | 'flowing' | 'carried';
  /** Lumps of fleece over the body. */
  woolly: boolean;
  hide: readonly number[];
  extremity: number;
  /**
   * Builds the head, replacing the shared blob-and-snout entirely.
   *
   * When present, `headStretch`, `snout` and `ears` are not consulted — the
   * whole head including its ears is this function's business.
   */
  head?: (context: HeadContext) => Part[];
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

  if (species.head) {
    parts.push(
      ...species.head({
        at: headAt,
        size: headSize,
        coat,
        extremity: species.extremity,
        rng,
      }),
    );
  } else {
  const head = new THREE.IcosahedronGeometry(headSize, 0);
  head.scale(0.85, 0.9, species.headStretch);
  head.rotateY(rng.around(0, 0.2));
  head.translate(headAt.x, headAt.y, headAt.z);
  // Also the coat: the marking function is evaluated in the animal's own
  // space, so a patch that reaches the shoulder carries on up the neck and
  // over the head as one continuous marking rather than stopping at a seam.
  parts.push({ geometry: head, color: coat, sway: 0 });

  if (species.snout > 0) {
    // **Smaller, and set back into the head.** Both numbers were wrong and in
    // ways that compounded: the muzzle was as wide as the skull, and it was
    // centred on the head's *front vertex* — so half its length stood out past
    // the face and, because an icosahedron falls away sharply from that vertex,
    // its sides met nothing at all. The result was a barrel floating a
    // centimetre off the front of every cow, pig and horse.
    //
    // Two thirds of the width, and centred two thirds of the way out instead of
    // at the tip, buries the back of it inside the skull where the join belongs.
    const snout = new THREE.CylinderGeometry(
      headSize * species.snout * 0.52,
      headSize * species.snout * 0.66,
      headSize * 0.62,
      6,
    );
    snout.rotateX(Math.PI / 2);
    snout.translate(
      headAt.x,
      headAt.y - headSize * 0.13,
      headAt.z + headSize * species.headStretch * 0.66,
    );
    parts.push({ geometry: snout, color: species.extremity, sway: 0 });
  }
  }

  for (const side of [-1, 1]) {
    // A bespoke head brings its own ears. The three rotations below are the
    // livestock vocabulary and none of them is a dog's.
    if (!species.head && species.ears !== 'none') {
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

      if (species.feet === 'paw') {
        // Wider than the leg and pushed forward of it, because a paw is a flat
        // foot that the animal stands *on* rather than a nail it stands on the
        // tip of. Low and squarish: at this scale toes are two triangles that
        // nobody resolves, and the outline does the work.
        const paw = new THREE.BoxGeometry(
          species.legThickness * 2.4,
          legLength * 0.11,
          species.legThickness * 3.6,
        );
        paw.translate(
          side * width * 0.34,
          legLength * 0.055,
          end * length * 0.3 + species.legThickness * 0.9,
        );
        parts.push({ geometry: paw, color: species.extremity, sway: 0 });
      } else {
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
  }

  // --- tail ---------------------------------------------------------------
  if (species.tail !== 'none') {
    // Rooted just inside the rump rather than on its surface, so the tail
    // emerges from the body instead of being stuck to the back of it.
    const root = new THREE.Vector3(0, belly + girth * 0.16, -length * 0.42);

    if (species.tail === 'carried') {
      // Up and back, in a shallow arc, tapering to a point.
      //
      // Not `curl`, which is the pig's tight spiral and reads as a corkscrew on
      // anything else; and not `switch`, which hangs. A dog carries its tail
      // *above* the line of its back, and that is the single most recognisable
      // thing about it from behind — which is the angle a dog in a village is
      // most often seen from.
      const segments = 4;
      // A very wide range. A stump and a full plume are both dogs, and the
      // difference between them is more visible from behind than anything else
      // about the animal — so this is where the variety is worth spending.
      const tailLength = length * rng.range(0.16, 0.6);
      const step = tailLength / segments;
      // Starts rising steeply and flattens off, so the arc is a sweep rather
      // than a bend at one joint.
      let angle = -rng.range(0.7, 1);
      let x = root.x;
      let y = root.y;
      let z = root.z;
      for (let i = 0; i < segments; i++) {
        const thick = girth * 0.075 * (1 - i / (segments + 1));
        const piece = new THREE.CylinderGeometry(thick * 0.7, thick, step * 1.15, 4);
        piece.translate(0, step / 2, 0);
        piece.rotateX(angle);
        piece.translate(x, y, z);
        // One weight for every segment, for the reason the switch has one:
        // a graded weight shears a jointed tail apart in the wind.
        parts.push({ geometry: piece, color: hide, sway: TAIL_SWAY });
        // Advance to the end of the piece just placed. Rotating (0, step, 0)
        // about X by `a` lands at (0, step·cos a, step·sin a) — taken from the
        // transform rather than guessed, for the reason the flowers' heads are.
        y += step * Math.cos(angle);
        z += step * Math.sin(angle);
        angle += rng.range(0.15, 0.35);
      }
    } else if (species.tail === 'curl') {
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
      // Shorter than it was. A cow's tail reaches roughly to the hock, not to
      // the ground, and at 0.42 of body length it was hanging past the hooves —
      // which reads as a rope somebody tied on.
      const tailLength = length * (species.tail === 'flowing' ? 0.4 : 0.3);
      // Down and *back*, never forward. The old range allowed negative angles,
      // which swung the tail under the animal and through its own hind legs.
      const angle = rng.range(0.08, 0.42);

      // **Thick at the root, thin at the tip**, which is the way round it was
      // not. `CylinderGeometry` takes the top radius first and the geometry is
      // then pushed down so its top is at the rump — so the first argument is
      // the dock and the second is the end. They were 0.035 and 0.06, giving a
      // tail that got fatter the further it went from the animal, and a tip
      // wide enough to burst out through the sides of its own switch.
      const tail = new THREE.CylinderGeometry(girth * 0.07, girth * 0.028, tailLength, 4);
      tail.translate(0, -tailLength / 2, 0);
      tail.rotateX(angle);
      tail.translate(root.x, root.y, root.z);
      // **The same weight as the tuft below, and that is the point.** Sway is
      // a per-vertex displacement applied in the shader, so two parts with
      // different weights move by different amounts — the tail was at 0.35 and
      // the switch at 0.6, so in any wind at all the tuft slid off the end of
      // the tail it is supposed to be on. Anything that has to stay joined has
      // to sway as one.
      parts.push({ geometry: tail, color: hide, sway: TAIL_SWAY });

      // **The tuft follows the same rotation the tail did.**
      //
      // It used to be placed straight down from the root while the tail itself
      // was rotated away, so the further the tail swung the further the switch
      // floated off the end of it. Rotating a point about X by `a` sends
      // (0, −L, 0) to (0, −L·cos a, −L·sin a) — so that is where the end of
      // the tail actually is, and 0.92 of the way along puts the tuft over the
      // join rather than balanced on the tip.
      // Just short of the tip, so the end of the tail sits *inside* the switch
      // rather than being centred in it. Centred, half the cylinder projects
      // out the far side; at 0.94 the join is buried and the fluff still reads
      // as the end of the tail.
      const along = tailLength * 0.94;
      // Comfortably fatter than the tail it caps. An icosahedron's faces sit
      // well inside its circumscribed radius — about 0.79 of it — so a switch
      // whose nominal radius merely matches the tail is *narrower* than the
      // tail everywhere except at its twelve points, and the cylinder shows
      // through in between.
      const tuft = new THREE.IcosahedronGeometry(girth * 0.115, 0);
      tuft.scale(0.75, species.tail === 'flowing' ? 1.7 : 1.05, 0.75);
      tuft.rotateX(angle);
      tuft.translate(
        root.x,
        root.y - along * Math.cos(angle),
        root.z - along * Math.sin(angle),
      );
      parts.push({ geometry: tuft, color: PALETTE_HORN, sway: TAIL_SWAY });
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
/**
 * How much a tail moves in the wind.
 *
 * One number, shared by every part of every tail. A tail is several pieces that
 * have to stay attached to each other, and sway is applied per vertex from a
 * per-vertex weight — so any two pieces that disagree about their weight come
 * apart under load. There is no mechanism keeping them together but this.
 */
const TAIL_SWAY = 0.4;
