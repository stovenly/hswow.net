import * as THREE from 'three';
import type { GalleryPlan } from './layout';
import { signPost } from './layout';
import { markCollidable } from '../../player/Collider';
import { signboard, type SignboardOptions } from '../../art/builders/signboard';
import { banner, type BannerOptions } from '../../art/builders/banner';
import {
  lettering,
  letteringGlow,
  letteringMesh,
  readableCapHeight,
  type LetteringGlowStyle,
  type LetteringStyle,
} from '../../art/lettering';
import { assemble, finish, type Part } from '../../art/assemble';
import { PALETTE } from '../../art/palette';

/**
 * The Text Showcase: where the lettering system is judged.
 *
 * The stroke font in `art/lettering` makes claims — that geometric letters
 * survive the chunky-pixel pipeline, that cap height over distance is the
 * knob that matters, that weight and slant and depth read as styles — and
 * every one of them is a claim about what a thing looks like on screen, which
 * no headless check can settle. This room is where they are looked at.
 *
 * One station per claim, in two columns either side of the builder rank, plus
 * a range test along the east edge. Everything here states what it is in its
 * own lettering — the room documents itself, which is also the first honest
 * use of the system it exists to test.
 *
 * The lettering that *emits* rather than reflects gets a bay of its own to the
 * west, against a wall — its claim is that a line of text can hang in the air
 * and read as a light, and the sky is the one background that cannot show it.
 *
 * The specimen strings are engineering fixtures (pangrams, the charset, the
 * stations' own names), not fiction. What real signs in the world say is
 * content, and none of it is written in here.
 */

export const ZONE_TEXT_SHOWCASE = 'text-showcase';

const BUILDERS = [signboard, banner];

/**
 * A station, split into what the collider may index and what it must not.
 *
 * The lettering goes in its own mesh flagged `noCollide`, never merged with
 * the carpentry: letters are thousands of small triangles in a hand-span of
 * space, and a chart whose ink was swept into the octree cost the frame whole
 * milliseconds the moment the capsule pressed into it — crouch-walking into
 * the eye chart halved the frame rate, which is how this rule was found.
 * Stations that are nothing but ink come back as one uncollidable mesh.
 */
function station(solid: Part[], ink: Part[]): THREE.Object3D {
  const inked = finish(assemble(ink), 'text-station-ink', 0);
  inked.userData.noCollide = true;
  if (solid.length === 0) return inked;

  const group = new THREE.Group();
  group.add(finish(assemble(solid), 'text-station', 0));
  group.add(inked);
  return group;
}

/** A line of lettering as a Part, positioned by its centre. */
function inscription(
  text: string,
  style: LetteringStyle,
  x: number,
  y: number,
  z: number,
  color: number = PALETTE.INK,
): Part {
  const written = lettering(text, style);
  written.geometry.translate(x, y, z);
  return { geometry: written.geometry, color, sway: 0 };
}

/**
 * A backboard on two posts, for the stations that show lettering against a
 * surface. The same carpentry register as the signboard builder, sized to
 * order — a chart is just a very large sign with nothing rolled.
 */
function hoarding(width: number, height: number, top: number): Part[] {
  const parts: Part[] = [];
  const postH = top + 0.1;
  for (const side of [-1, 1]) {
    const post = new THREE.BoxGeometry(0.11, postH, 0.11);
    post.translate(side * (width / 2 + 0.1), postH / 2, -0.05);
    parts.push({ geometry: post, color: PALETTE.TIMBER_DARK, sway: 0 });
  }
  const board = new THREE.BoxGeometry(width, height, 0.05);
  board.translate(0, top - height / 2, 0);
  parts.push({ geometry: board, color: PALETTE.TIMBER_PALE, sway: 0 });
  return parts;
}

/** Front face of a hoarding's board, where inscriptions sit. */
const FACE = 0.05 / 2 + 0.008;

/**
 * The eye chart: one pangram fragment per row, cap height falling by roughly
 * a quarter each line, each row stating its own cap height in centimetres.
 * Stand at the rank and read down until it dissolves — the line where it goes
 * is the pipeline's floor at your distance, measured by eye in the room
 * rather than promised by arithmetic in a comment.
 */
function sizeChart(): THREE.Object3D {
  const rows: [number, string][] = [
    [0.5, '50'],
    [0.34, '34'],
    [0.24, '24 CM'],
    [0.16, '16 THE FOX'],
    [0.11, '11 QUICK BROWN FOX'],
    [0.075, '7 PACK MY BOX WITH JUGS'],
    [0.05, '5 THE FIVE BOXING WIZARDS JUMP'],
  ];

  const top = 2.85;
  const ink: Part[] = [];
  let y = top - 0.18;
  for (const [cap, text] of rows) {
    y -= cap / 2;
    ink.push(inscription(text, { capHeight: cap, fitWidth: 2.26, depth: 0.4 }, 0, y, FACE));
    y -= cap / 2 + 0.12;
  }
  return station(hoarding(2.5, 2.6, top), ink);
}

/** Weight is the family's width axis: the same word from hairline to black. */
function weightStack(): THREE.Object3D {
  const rows: [number, string][] = [
    [0.07, 'HAIRLINE'],
    [0.11, 'LIGHT'],
    [0.16, 'REGULAR'],
    [0.24, 'BOLD'],
    [0.34, 'BLACK'],
  ];
  const ink: Part[] = [];
  rows.forEach(([weight, text], i) => {
    ink.push(inscription(text, { capHeight: 0.26, weight, depth: 0.8 }, 0, 2.3 - i * 0.42, 0));
  });
  return station([], ink);
}

/** Slant is the posture axis. Past ~0.35 the joints start to shear open. */
function slantStack(): THREE.Object3D {
  const rows: [number, string][] = [
    [0, 'UPRIGHT'],
    [0.12, 'OBLIQUE'],
    [0.21, 'ITALIC'],
    [0.35, 'SWEPT'],
  ];
  const ink: Part[] = [];
  rows.forEach(([slant, text], i) => {
    ink.push(inscription(text, { capHeight: 0.26, slant, depth: 0.8 }, 0, 2.1 - i * 0.42, 0));
  });
  return station([], ink);
}

/**
 * Depth against a board, and depth against nothing. Shallow relief reads as
 * paint, unity as raised slab lettering — and the free word beside the board
 * is cut deep enough to have visible sides from an angle, which is what lets
 * letters stand in open air without a surface to be *on*.
 */
function formsStation(): THREE.Object3D {
  const top = 2.0;
  const ink: Part[] = [
    inscription('PAINTED', { capHeight: 0.24, fitWidth: 1.5, depth: 0.15 }, 0, top - 0.32, FACE),
    inscription('RAISED', { capHeight: 0.24, fitWidth: 1.5, depth: 1.0 }, 0, top - 0.74, FACE),
    inscription('FREE', { capHeight: 0.32, weight: 0.2, depth: 2.2 }, 1.75, 1.5, 0),
  ];
  return station(hoarding(1.7, 1.0, top), ink);
}

/**
 * A slab to stand glowing text against.
 *
 * Glowing letters have almost nothing to separate from against the sky dome.
 * Tall, because a wall stops backing the text the moment you are close enough
 * to be looking up at it.
 */
function backdrop(width: number, height: number): THREE.Object3D {
  const parts: Part[] = [];
  const base = 0.5;

  // Standing in the plinth rather than on it, so no two faces are coplanar.
  const panel = new THREE.BoxGeometry(width, height - 0.4, 0.5);
  panel.translate(0, 0.4 + (height - 0.4) / 2, 0);
  parts.push({ geometry: panel, color: PALETTE.STONE_DARK, sway: 0 });

  const plinth = new THREE.BoxGeometry(width + 0.6, base, 1.1);
  plinth.translate(0, base / 2, 0);
  parts.push({ geometry: plinth, color: PALETTE.STONE, sway: 0 });

  return markCollidable(finish(assemble(parts), 'text-backdrop', 0));
}

/** A glowing word, put where it belongs. */
function glowing(
  text: string,
  color: number,
  style: LetteringGlowStyle,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = letteringGlow(text, color, style);
  mesh.position.set(x, y, z);
  return mesh;
}

/**
 * Solid against additive, each on a pale board and again in open air — the
 * difference between the two modes is entirely what they stand in front of.
 * One colour and one intensity throughout, so the mode is the only variable.
 */
function glowModes(): THREE.Object3D {
  const top = 2.4;
  const group = new THREE.Group();
  group.add(markCollidable(finish(assemble(hoarding(2.2, 1.5, top)), 'text-station', 0)));

  const rows: [string, boolean][] = [
    ['SOLID', false],
    ['ADDITIVE', true],
  ];
  rows.forEach(([text, additive], i) => {
    const style: LetteringGlowStyle = {
      capHeight: 0.24,
      fitWidth: 1.9,
      depth: 0.8,
      intensity: 2,
      additive,
    };
    const y = top - 0.48 - i * 0.62;
    group.add(glowing(text, PALETTE.LAMPLIGHT, style, 0, y, FACE));
    group.add(glowing(text, PALETTE.LAMPLIGHT, style, 2.5, y, 0));
  });
  return group;
}

/**
 * What the whole thing is for: a caption in the air with nothing behind it, at
 * the cap height the font's own rule gives for reading from three metres.
 * Solid above, additive below, and an intensity ramp beside them — each line
 * stating its own number, the way the eye chart states its own cap height.
 */
function tutorialText(): THREE.Object3D {
  const group = new THREE.Group();
  const style: LetteringGlowStyle = {
    capHeight: readableCapHeight(3),
    weight: 0.18,
    depth: 1.2,
    intensity: 2,
  };

  group.add(glowing('TUTORIAL TEXT\nAT READING SIZE', PALETTE.LAMPLIGHT, style, 0, 2.5, 0));
  group.add(
    glowing('TUTORIAL TEXT\nAT READING SIZE', PALETTE.LAMPLIGHT, { ...style, additive: true }, 0, 1.7, 0),
  );

  [1, 2, 4, 8].forEach((intensity, i) => {
    group.add(
      glowing(
        `${intensity} INTENSITY`,
        PALETTE.LAMPLIGHT,
        { capHeight: 0.16, depth: 0.8, intensity },
        2.7,
        2.5 - i * 0.36,
        0,
      ),
    );
  });
  return group;
}

/** Every glyph the font has, so a missing or broken one has nowhere to hide. */
function charsetBoard(): THREE.Object3D {
  const top = 2.6;
  const ink: Part[] = [
    inscription(
      'ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\n0123456789\n.,:;!?\'"()/-+&',
      { capHeight: 0.26, fitWidth: 2.26, depth: 0.4, lineHeight: 1.6 },
      0,
      top - 0.85,
      FACE,
    ),
  ];
  return station(hoarding(2.5, 1.7, top), ink);
}

export const textShowcaseGalleryPlan: GalleryPlan = {
  id: ZONE_TEXT_SHOWCASE,
  group: 'general',
  name: 'Text Showcase',
  builders: BUILDERS,

  extras() {
    const extras: THREE.Object3D[] = [];

    /** A station: its specimen, and a marker post naming it for the tooltip. */
    const at = (mesh: THREE.Object3D, name: string, x: number, z: number): void => {
      mesh.position.set(x, 0, z);
      extras.push(mesh);
      const post = signPost(name);
      post.position.set(x, 0, z + 2.5);
      extras.push(post);
    };

    // West column: the metric axes.
    at(markCollidable(sizeChart()), 'sizes', -10, 2);
    at(weightStack(), 'weights', -10, -8);
    at(slantStack(), 'slant', -10, -18);

    // East column: what lettering can sit on, or not sit on.
    at(markCollidable(formsStation()), 'forms', 10, 2);
    const floating = letteringMesh('FLOATING TEXT\nNO BOARD BEHIND IT\nREAD AGAINST THE FOG', PALETTE.INK, {
      capHeight: 0.22,
      weight: 0.18,
      depth: 1.2,
    });
    floating.position.y = 2.1;
    at(floating, 'floating-text', 10, -8);
    at(markCollidable(charsetBoard()), 'character-set', 10, -18);

    // The lettering that emits, in a bay of its own west of the rank: two
    // stations six metres in front of one wall, with nothing behind them that
    // is sky. See `backdrop`.
    const wall = backdrop(18, 7);
    wall.position.set(-22, 0, -12);
    extras.push(wall);
    at(glowModes(), 'glowing-text', -26, -6);
    at(tutorialText(), 'tutorial-text', -18, -6);

    // The range test, along the east edge: stand at the marker post and read
    // up the rank. All three say their distance at the same cap height, so
    // what changes between them is only the pipeline — the far one sitting
    // past the fog's near edge is part of the test, not a defect in it.
    const rangePost = signPost('reading-range');
    rangePost.position.set(20, 0, 6);
    extras.push(rangePost);
    const ranges: [number, string][] = [
      [1, 'FIVE METRES'],
      [-9, 'FIFTEEN METRES'],
      [-19, 'TWENTY FIVE METRES'],
    ];
    for (const [z, text] of ranges) {
      const word = letteringMesh(text, PALETTE.INK, { capHeight: 0.35, depth: 0.8 });
      word.position.set(20, 1.5, z);
      extras.push(word);
    }

    // And one of each builder carrying non-default text, because "the text
    // rides in through the options" is a claim the rank of eight defaults
    // cannot itself test.
    const said: SignboardOptions = { seed: 4101, text: 'ANY TEXT\nON ANY SIGN' };
    const custom = signboard.build(said);
    custom.position.set(-4.5, 0, 6);
    extras.push(markCollidable(custom));
    const shouted: BannerOptions = { seed: 4102, text: 'WORDS AT RANGE' };
    const shout = banner.build(shouted);
    shout.position.set(4.5, 0, 6);
    extras.push(markCollidable(shout));

    return extras;
  },
};
