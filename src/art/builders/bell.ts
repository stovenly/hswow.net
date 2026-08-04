import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A bell in a timber frame.
 *
 * The bell one-shot has been ringing over Arkstin from six and a half metres up
 * with nothing there at all. This is the thing making the noise.
 *
 * **It comes with its own frame rather than expecting a tower.** A bell is not
 * a prop that stands on the ground — it is a mass hung from something, and
 * modelled on its own it reads as a hat. A tower is a *structure*, and the
 * village structure kit does not exist yet; a two-post frame is the smallest
 * honest answer, it stands anywhere, and a tower later can drop the frame and
 * keep the bell. Placement runs object → sound, so where this ends up is what
 * decides where the ringing comes from, not the other way round.
 *
 * ## The profile is a closed loop, and it has to be
 *
 * The bell is a lathe. The obvious profile is the outside curve alone, which
 * gives a surface with no thickness — and the art material is single-sided, so
 * a bell built that way is invisible from underneath, which is the one angle
 * you look at a hanging bell from. The profile below runs *down the outside,
 * across the lip, and back up the inside*, closing on itself, so the lathe
 * sweeps a solid with a real wall and a real mouth.
 */

/**
 * Half-profile of the bell, as radius against height above the mouth.
 *
 * Ten segments of revolution, which is few enough to face the surface visibly
 * and enough that the mouth still reads as round. The waist above the lip is
 * what makes it a bell rather than a cone — a straight taper is a hat, and no
 * amount of colour fixes it.
 */
const PROFILE: readonly (readonly [number, number])[] = [
  // Outside, mouth upwards.
  [0.3, 0],
  [0.275, 0.05],
  [0.225, 0.14],
  [0.195, 0.25],
  [0.178, 0.36],
  [0.172, 0.44],
  [0.125, 0.51],
  [0.062, 0.56],
  // Across the crown.
  [0.045, 0.56],
  // And back down the inside, staying inboard of the outside all the way.
  [0.05, 0.5],
  [0.092, 0.43],
  [0.122, 0.35],
  [0.146, 0.25],
  [0.175, 0.14],
  [0.222, 0.05],
  [0.258, 0],
  // And across the lip, back to where it started. `LatheGeometry` connects
  // consecutive points and stops — it does not close a loop for you, so
  // without this repeat the mouth is a ring of unshared edges and the solid is
  // not watertight. Nothing in the profile touches the axis, so the result is
  // a torus topologically: closed, with the hole up the middle that a bell
  // actually has.
  [0.3, 0],
];

export const bell: MeshBuilder = {
  name: 'bell',
  category: 'objects',
  radius: 0.75,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    const size = rng.range(0.85, 1.25);
    const bellHeight = 0.56 * size;
    const mouth = 0.3 * size;

    const postHeight = bellHeight + rng.range(0.55, 0.85);
    const postThickness = rng.range(0.09, 0.12);
    const span = mouth * 2 + rng.range(0.28, 0.44);

    // --- the frame ---------------------------------------------------------
    for (const side of [-1, 1]) {
      // Raked outwards a little at the foot. Two vertical posts read as a
      // doorway; splayed ones read as something built to take a load that
      // swings, which is what a bell frame is for.
      const post = new THREE.BoxGeometry(postThickness, postHeight, postThickness * 0.92);
      post.translate(0, postHeight / 2, 0);
      post.rotateZ(side * -0.055);
      post.translate((side * span) / 2, 0, 0);
      parts.push({ geometry: post, color: PALETTE.TIMBER, sway: 0 });

      // A brace from post to beam, so the frame is triangulated rather than
      // being two sticks and a hope.
      const brace = new THREE.BoxGeometry(postThickness * 0.62, span * 0.42, postThickness * 0.6);
      brace.translate(0, span * 0.21, 0);
      brace.rotateZ(side * 0.72);
      brace.translate((side * span) / 2, postHeight - span * 0.3, 0);
      parts.push({ geometry: brace, color: PALETTE.TIMBER_DARK, sway: 0 });
    }

    // The head beam runs past the posts on both sides, so the joint is a lap
    // rather than two ends meeting in the same plane.
    const beam = new THREE.BoxGeometry(span + postThickness * 2.4, postThickness, postThickness);
    beam.translate(0, postHeight - postThickness / 2, 0);
    parts.push({ geometry: beam, color: PALETTE.TIMBER, sway: 0 });

    // --- the bell ----------------------------------------------------------
    const crown = postHeight - postThickness;
    const hangs = crown - bellHeight - rng.range(0.05, 0.1);

    const points = PROFILE.map(([r, y]) => new THREE.Vector2(r * size, y * size));
    const shell = new THREE.LatheGeometry(points, 10);
    shell.translate(0, hangs, 0);

    const bronze = shade(PALETTE.BRONZE, rng.range(0.9, 1.1));
    // Patina takes the top, where rain sits and never quite dries, and the
    // bright metal is kept low where the clapper and the weather work on it.
    // Painted as a function of height on one mesh rather than as two parts,
    // which would need a seam exactly where the colour is meant to be vague.
    const waterline = hangs + bellHeight * rng.range(0.42, 0.62);
    parts.push({
      geometry: shell,
      color: (_x, y) => (y > waterline ? PALETTE.PATINA : bronze),
      sway: 0,
    });

    // The canon: the loop the bell hangs by. A short bar rather than a ring —
    // a torus at this size is thirty triangles nobody will resolve.
    const canon = new THREE.BoxGeometry(0.055 * size, 0.12 * size, 0.055 * size);
    canon.translate(0, hangs + bellHeight + 0.05 * size, 0);
    parts.push({ geometry: canon, color: shade(bronze, 0.85), sway: 0 });

    // The clapper, hung inside and visible through the mouth. Small, and the
    // only reason it is here at all is that a bell with nothing in it reads as
    // a lampshade from below.
    const clapper = new THREE.IcosahedronGeometry(0.055 * size, 0);
    clapper.translate(rng.around(0, 0.02), hangs + 0.09 * size, rng.around(0, 0.02));
    parts.push({ geometry: clapper, color: PALETTE.IRON_DARK, sway: 0 });

    const geometry = assemble(parts);
    geometry.rotateY(rng.range(0, Math.PI * 2));
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'bell', 0, 'metal-ring');
  },
};

/**
 * How high the bell's mouth hangs above the frame's base, for placing the ring.
 *
 * The sound of a bell comes from the mouth, not from the crown and not from the
 * middle of the frame. Roughly the middle of the rolled range, which is within
 * a few centimetres on any instance.
 */
export const BELL_MOUTH_HEIGHT = 0.72;
