import * as THREE from 'three';
import { createRng, type Rng } from './random';
import { rod } from './rod';

// The branch sheet: a sprite sheet of whole branches, rendered once at boot
// from geometry into a render target. A crown is a few dozen cards that each
// wear one of these branches, so the leaves come from the picture and the
// geometry stays a handful of quads. Red is the leaf's tone, green marks wood,
// alpha is the cut-out. One row of six tiles per kind, so a kind is added by
// adding it to `KIND_ORDER` and the sheet grows a row.

export type SheetKind = 'broadleaf' | 'birch' | 'conifer' | 'willow' | 'pinnate' | 'pine' | 'smallleaf' | 'blossom' | 'frond';
const KIND_ORDER: readonly SheetKind[] = ['broadleaf', 'birch', 'conifer', 'willow', 'pinnate', 'pine', 'smallleaf', 'blossom', 'frond'];
const PER_KIND = 6;

/** A kind is a row, so the columns are its tiles and the rows are the kinds. */
export const SHEET_COLUMNS = PER_KIND;
export const SHEET_ROWS = KIND_ORDER.length;
export const SHEET_TILES = SHEET_COLUMNS * SHEET_ROWS;
/** The card's width as a fraction of its length, for a kind that does not say. */
export const BRANCH_ASPECT = 0.72;

/**
 * Per kind, because a frond is a blade and a broadleaf branch is a spray: a card
 * drawn at one aspect for both makes the frond two metres across. The tile is
 * square and the frame is not, so this is the frame's width and the card's alike.
 */
export const SHEET_ASPECT: Record<SheetKind, number> = {
  broadleaf: BRANCH_ASPECT,
  birch: BRANCH_ASPECT,
  conifer: BRANCH_ASPECT,
  willow: BRANCH_ASPECT,
  pinnate: BRANCH_ASPECT,
  pine: BRANCH_ASPECT,
  smallleaf: BRANCH_ASPECT,
  blossom: BRANCH_ASPECT,
  frond: 0.72,
};

/** The aspect of the row a tile lies in. */
export function aspectOf(tile: number): number {
  return SHEET_ASPECT[KIND_ORDER[Math.min(SHEET_ROWS - 1, Math.floor(tile / PER_KIND))]];
}

/** Which tiles a kind draws from: first tile and count. */
export const SHEET_OF = Object.fromEntries(KIND_ORDER.map((kind, row) => [kind, [row * PER_KIND, PER_KIND] as const])) as Record<SheetKind, readonly [number, number]>;
export const SHEET_BROADLEAF = SHEET_OF.broadleaf;
export const SHEET_CONIFER = SHEET_OF.conifer;

/** How each kind's branch is grown, in the unit branch's metres. */
interface BranchForm {
  shoots: readonly [number, number];
  /** Where along the stem the shoots start, and how much of it they cover. */
  start: number;
  span: number;
  /** A shoot's angle off the stem, radians, rolled between. */
  angle: readonly [number, number];
  /** A shoot's end as (out, up) per unit length at that angle. */
  reach: (angle: number) => readonly [number, number];
  /** A shoot's length in the unit branch's metres, rolled between and shortened toward the tip. */
  shootLength: readonly [number, number];
  /** Shoots fork once more. */
  sub: boolean;
  /** Leaves scattered over the twigs; a `rachis` form places them instead and does not want it. */
  leaves?: readonly [number, number];
  length: readonly [number, number];
  /** Leaf width as a fraction of its length, rolled between. */
  width: readonly [number, number];
  /** Where along the stem its own leaves start. */
  stemFrom: number;
  /** How far a leaf strays off its twig, metres. */
  jitter: number;
  /** Leaves lie along their shoot rather than at any angle. */
  aligned: boolean;
  /** Needles rather than blades: (along, across) the shoot, so the pair is the fan they leave it in. */
  needle?: readonly [number, number];
  /** `stemFrom` holds on every twig and not just the card's own stem, so the leaves are in tufts at the shoot ends. */
  tufted?: boolean;
  /** Flowers instead of leaves: loose clusters of round blobs scattered this far from each cluster's own point. */
  blossom?: number;
  /** Shoots leave in opposite pairs from one point rather than alternately up the stem. */
  paired?: boolean;
  /**
   * Leaflets in opposed ranks along every twig instead of scattered over it:
   * `step` metres between ranks, `sweep` how far a leaflet leans toward the tip.
   * `leaves` is then a count the geometry decides, not one rolled.
   */
  rachis?: { step: number; sweep: number };
  /** The darkest a leaf's tone goes. */
  tone: number;
  /**
   * A fixed curve on the card's own stem instead of the rolled lean, as the tile-x
   * the tip reaches. A pinned upright card carries +x upward, so a negative bow
   * is a blade that arches over. Ranks then follow the curve, not the chord.
   */
  bow?: number;
}

const FORMS: Record<SheetKind, BranchForm> = {
  broadleaf: { shoots: [7, 9], start: 0.15, span: 0.75, angle: [0.6, 1.05], reach: (a) => [Math.sin(a), Math.cos(a)], shootLength: [0.22, 0.4], sub: true, leaves: [430, 520], length: [0.1, 0.15], width: [0.42, 0.56], stemFrom: 0.2, jitter: 0.045, aligned: false, tone: 0.62 },
  // Small round leaves on shoots that rise and then hang.
  birch: { shoots: [8, 11], start: 0.1, span: 0.85, angle: [0.55, 0.95], reach: (a) => [Math.sin(a), Math.cos(a) * 0.5 - 0.2], shootLength: [0.22, 0.4], sub: true, leaves: [520, 620], length: [0.05, 0.075], width: [0.7, 0.85], stemFrom: 0.15, jitter: 0.045, aligned: false, tone: 0.66 },
  // Needled shoots hanging a little below level.
  conifer: { shoots: [12, 15], start: 0.03, span: 0.93, angle: [0.85, 1.2], reach: (a) => [Math.sin(a), -0.12], shootLength: [0.2, 0.34], sub: false, leaves: [1900, 2300], length: [0.06, 0.095], width: [0.14, 0.14], stemFrom: 0.02, jitter: 0.03, aligned: false, needle: [0.45, 0.9], tone: 0.55 },
  // A broom: shoots run on up the card close to the stem, so a card hung downward hangs them.
  willow: { shoots: [9, 12], start: 0.05, span: 0.9, angle: [0.12, 0.38], reach: (a) => [Math.sin(a), Math.cos(a)], shootLength: [0.22, 0.4], sub: false, leaves: [700, 900], length: [0.09, 0.13], width: [0.14, 0.2], stemFrom: 0.05, jitter: 0.045, aligned: true, tone: 0.6 },
  // Opposite shoots, each a rachis of paired leaflets: rows of narrow blades with sky between the rows.
  pinnate: {
    shoots: [11, 14],
    start: 0.08,
    span: 0.86,
    angle: [0.65, 1.0],
    reach: (a) => [Math.sin(a), Math.cos(a) * 0.85],
    shootLength: [0.22, 0.4],
    sub: true,
    length: [0.055, 0.085],
    width: [0.3, 0.4],
    stemFrom: 0.1,
    jitter: 0.045,
    aligned: false,
    paired: true,
    rachis: { step: 0.04, sweep: 0.55 },
    tone: 0.6,
  },
  // Long needles bunched at the ends of the shoots only, the wood behind them bare, which is the whole of a pine at distance.
  pine: {
    shoots: [7, 10],
    start: 0.06,
    span: 0.9,
    angle: [0.5, 0.95],
    reach: (a) => [Math.sin(a), Math.cos(a) * 0.55],
    shootLength: [0.26, 0.42],
    sub: false,
    leaves: [1400, 1800],
    length: [0.1, 0.15],
    width: [0.075, 0.075],
    stemFrom: 0.68,
    jitter: 0.025,
    aligned: false,
    needle: [0.85, 0.5],
    tufted: true,
    tone: 0.5,
  },
  // The same shoot in flower, or in berry: the leaves replaced by loose clusters of small round blobs.
  blossom: {
    shoots: [8, 11],
    start: 0.12,
    span: 0.8,
    angle: [0.55, 1.0],
    reach: (a) => [Math.sin(a), Math.cos(a) * 0.8],
    shootLength: [0.2, 0.36],
    sub: true,
    leaves: [110, 150],
    length: [0.032, 0.05],
    width: [0.6, 0.8],
    stemFrom: 0.18,
    jitter: 0.04,
    aligned: false,
    blossom: 0.03,
    tone: 0.78,
  },
  // One arching blade, no shoots: the card's own stem is the midrib and the
  // leaflets rank down it in opposed pairs, so a whole card is one palm frond.
  frond: {
    shoots: [0, 0],
    start: 0.1,
    span: 0.8,
    angle: [0.6, 1.0],
    reach: (a) => [Math.sin(a), Math.cos(a)],
    shootLength: [0.2, 0.3],
    sub: false,
    length: [0.11, 0.17],
    width: [0.1, 0.16],
    stemFrom: 0.7,
    jitter: 0.02,
    aligned: true,
    rachis: { step: 0.022, sweep: 0.5 },
    bow: -0.085,
    tone: 0.56,
  },
  // Small stiff blades packed close: a shoot that reads as a solid dark edge rather than as leaves with sky between them.
  smallleaf: {
    shoots: [10, 13],
    start: 0.1,
    span: 0.86,
    angle: [0.7, 1.1],
    reach: (a) => [Math.sin(a), Math.cos(a) * 0.7],
    shootLength: [0.18, 0.34],
    sub: true,
    leaves: [760, 900],
    length: [0.04, 0.062],
    width: [0.6, 0.78],
    stemFrom: 0.12,
    jitter: 0.03,
    aligned: false,
    tone: 0.5,
  },
};

const TILE = 384;
/** The branch is drawn this much smaller than its tile, so nothing is cut flat at the tile's edge. */
const FIT = 0.8;

/** The whole sheet in texels, so a shader can tell how far down the mip chain a card is sampling. */
export const SHEET_PIXELS: readonly [number, number] = [TILE * SHEET_COLUMNS, TILE * SHEET_ROWS];

/** Bound by the canopy material's twins; filled the first time a zone is raised. */
export const branchSheetUniforms = {
  tBranch: { value: null as THREE.Texture | null },
  uBark: { value: new THREE.Color(0x463b30) },
  /** One per row, in `KIND_ORDER`: the shader reads its card's from the tile. */
  uSheetAspect: { value: KIND_ORDER.map((kind) => SHEET_ASPECT[kind]) },
};

interface Twig {
  from: THREE.Vector3;
  to: THREE.Vector3;
}

/** A lobed leaf as twelve vertices, centred at `at`, lying in the plane of `d` and `s`. */
function leaf(positions: number[], colors: number[], at: THREE.Vector3, d: THREE.Vector3, s: THREE.Vector3, length: number, width: number, tone: number): void {
  const b = at.clone().addScaledVector(d, -length * 0.5);
  const p1l = b.clone().addScaledVector(d, length * 0.35).addScaledVector(s, width);
  const p1r = b.clone().addScaledVector(d, length * 0.35).addScaledVector(s, -width);
  const p2l = b.clone().addScaledVector(d, length * 0.72).addScaledVector(s, width * 0.8);
  const p2r = b.clone().addScaledVector(d, length * 0.72).addScaledVector(s, -width * 0.8);
  const tip = b.clone().addScaledVector(d, length);
  for (const v of [b, p1r, p1l, p1l, p1r, p2r, p1l, p2r, p2l, p2l, p2r, tip]) {
    positions.push(v.x, v.y, v.z);
    colors.push(tone, 0, 0);
  }
}

/**
 * A unit branch: one metre long up +Y, its width `BRANCH_ASPECT` across x,
 * nearly flat in z, seen from +Z, grown to its kind's form.
 */
function branchGeometry(rng: Rng, kind: SheetKind): THREE.BufferGeometry {
  const form = FORMS[kind];
  const positions: number[] = [];
  const colors: number[] = [];
  const push = (geometry: THREE.BufferGeometry, tone: number, wood: number): void => {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    const p = g.getAttribute('position');
    for (let i = 0; i < p.count; i++) {
      positions.push(p.getX(i), p.getY(i), p.getZ(i));
      colors.push(tone, wood, 0);
    }
    g.dispose();
  };
  const halfWidth = SHEET_ASPECT[kind] / 2;
  // Twigs stop well inside the frame so the leaves on their ends still fit; a
  // leaf shaved off at the frame is a straight edge on the sprite.
  const reach = halfWidth * 0.68;

  const lean = form.bow === undefined ? rng.around(0, 0.06) : form.bow * rng.range(0.82, 1.2);
  const spine = (t: number): THREE.Vector3 => new THREE.Vector3(lean * t * t * 3 + Math.sin(t * 2.4) * 0.02, t, 0);
  const main: THREE.Vector3[] = [];
  for (let i = 0; i <= 4; i++) main.push(spine(i / 4));
  for (let i = 0; i < 4; i++) {
    push(rod(main[i], main[i + 1].clone().lerp(main[i], -0.05), 0.02 - i * 0.0035, 0.016 - i * 0.0035, 4), 0.85, 1);
  }
  // A bowed stem ranks its leaflets along the curve; one chord from base to tip
  // would walk them off the midrib by the whole of the bow.
  const twigs: Twig[] = form.bow === undefined ? [{ from: main[0], to: main[4] }] : [0, 1, 2, 3].map((i) => ({ from: main[i], to: main[i + 1] }));
  const count = rng.int(form.shoots[0], form.shoots[1]);
  for (let i = 0; i < count; i++) {
    // Paired shoots take the height of their partner, so the two leave one point on opposite sides.
    const rank = form.paired ? Math.floor(i / 2) * 2 + 0.5 : i + 0.5;
    const t = form.start + (form.span * rank) / count;
    const from = spine(t);
    const side = i % 2 === 0 ? 1 : -1;
    const angle = rng.range(form.angle[0], form.angle[1]);
    const [out, up] = form.reach(angle);
    const maxOut = Math.max(0.05, (reach - Math.abs(from.x)) / Math.max(Math.abs(out), 0.05));
    const length = Math.min(maxOut, rng.range(form.shootLength[0], form.shootLength[1]) * (1 - t * 0.45));
    const to = new THREE.Vector3(from.x + side * out * length, Math.min(1, from.y + up * length), rng.around(0, 0.03));
    push(rod(from, to, 0.011, 0.005, 3), 0.85, 1);
    twigs.push({ from, to });
    if (form.sub && rng.chance(0.6)) {
      const at = from.clone().lerp(to, rng.range(0.45, 0.7));
      const sub = new THREE.Vector3(at.x + side * Math.sin(angle + 0.7) * length * 0.45, at.y + Math.cos(angle + 0.7) * length * 0.45, rng.around(0, 0.03));
      if (Math.abs(sub.x) < reach) {
        push(rod(at, sub, 0.007, 0.004, 3), 0.85, 1);
        twigs.push({ from: at, to: sub });
      }
    }
  }

  // Foliage along every twig, thick toward the ends, mostly facing +Z so the
  // sheet sees it full on; tone as a fixed light from above would give it.
  const d = new THREE.Vector3();
  const s = new THREE.Vector3();
  const n = new THREE.Vector3();
  const at = new THREE.Vector3();
  const shoot = new THREE.Vector3();
  /** One leaflet at `at`, its plane rolled about `d`, tone as a light from above. */
  const blade = (length: number, width: number): void => {
    d.addScaledVector(n, -d.dot(n)).normalize();
    s.crossVectors(n, d).normalize();
    const tone = form.tone + 0.42 * Math.min(1, Math.max(0, (n.y * 0.5 + 0.5) * 0.7 + d.y * 0.2 + rng.range(0, 0.35)));
    leaf(positions, colors, at, d, s, length, width, tone);
  };

  if (form.rachis) {
    const { step, sweep } = form.rachis;
    for (const twig of twigs) {
      shoot.subVectors(twig.to, twig.from);
      const span = shoot.length();
      if (span < step * 2) continue;
      shoot.divideScalar(span);
      // The card's own stem is bare at the base, where it stands in the wood.
      const bare = twig === twigs[0] ? form.stemFrom : 0;
      const ranks = Math.floor((span * (1 - bare)) / step);
      for (let i = 1; i <= ranks; i++) {
        const t = bare + (1 - bare) * (i / (ranks + 0.7));
        at.copy(twig.from).addScaledVector(shoot, t * span);
        // Widest across the middle of a rachis and shortest at both ends, which is the shape of the leaf.
        const taper = 0.6 + 0.4 * Math.sin(Math.PI * Math.min(1, t));
        for (const side of [1, -1] as const) {
          n.set(rng.around(0, 0.4), rng.around(0, 0.4), 1).normalize();
          // Across the shoot, then leaned toward its tip: (-y, x) is the shoot turned a quarter turn in the sheet's plane.
          d.set(-shoot.y * side, shoot.x * side, rng.around(0, 0.3)).normalize().addScaledVector(shoot, sweep).normalize();
          at.z += rng.around(0, 0.04);
          const length = rng.range(form.length[0], form.length[1]) * taper;
          blade(length, length * rng.range(form.width[0], form.width[1]));
        }
      }
      // The terminal leaflet: a rachis ends in one blade on its own axis, and a row that just stops does not read as a leaf.
      at.copy(twig.to);
      n.set(rng.around(0, 0.4), rng.around(0, 0.4), 1).normalize();
      d.copy(shoot);
      const length = rng.range(form.length[0], form.length[1]);
      blade(length, length * rng.range(form.width[0], form.width[1]));
    }
    return finishBranch(positions, colors);
  }

  const leaves = form.leaves ? rng.int(form.leaves[0], form.leaves[1]) : 0;

  if (form.blossom) {
    const spill = form.blossom;
    for (let c = Math.max(1, Math.round(leaves / 7)); c > 0; c--) {
      const twig = twigs[rng.int(0, twigs.length - 1)];
      const t = twig === twigs[0] ? rng.range(form.stemFrom, 1) : Math.sqrt(rng.range(0.05, 1));
      const centre = twig.from.clone().lerp(twig.to, t);
      for (let p = rng.int(5, 8); p > 0; p--) {
        at.copy(centre);
        at.x += rng.around(0, spill);
        at.y += rng.around(0, spill);
        at.z += rng.around(0, spill * 0.8);
        n.set(rng.around(0, 0.5), rng.around(0, 0.5), 1).normalize();
        d.set(rng.range(-1, 1), rng.range(-1, 1), rng.range(-0.3, 0.3)).normalize();
        const length = rng.range(form.length[0], form.length[1]);
        blade(length, length * rng.range(form.width[0], form.width[1]));
      }
    }
    return finishBranch(positions, colors);
  }

  for (let i = 0; i < leaves; i++) {
    const twig = twigs[rng.int(0, twigs.length - 1)];
    const along = twig === twigs[0] || form.tufted ? rng.range(form.stemFrom, 1) : Math.sqrt(rng.range(0.03, 1));
    at.copy(twig.from).lerp(twig.to, along);
    at.x += rng.around(0, form.jitter);
    at.y += rng.around(0, form.jitter);
    at.z += rng.around(0, 0.05);
    n.set(rng.around(0, 0.5), rng.around(0, 0.5), 1).normalize();
    shoot.subVectors(twig.to, twig.from).normalize();
    if (form.needle) {
      // Needles fan off the shoot in one plane: (-y, x) is the shoot turned a quarter turn, so `across` leaves it either side.
      const [alongShoot, across] = form.needle;
      const flip = rng.chance(0.5) ? 1 : -1;
      d.set(shoot.x * alongShoot - shoot.y * flip * across, shoot.y * alongShoot + shoot.x * flip * across, rng.range(-0.4, 0.4)).normalize();
    } else if (form.aligned) {
      d.copy(shoot).multiplyScalar(rng.chance(0.5) ? 1 : -1).add(new THREE.Vector3(rng.around(0, 0.35), rng.around(0, 0.35), rng.around(0, 0.3))).normalize();
    } else {
      d.set(rng.range(-1, 1), rng.range(-1, 1), rng.range(-0.3, 0.3)).normalize();
    }
    const length = rng.range(form.length[0], form.length[1]);
    blade(length, length * rng.range(form.width[0], form.width[1]));
  }
  return finishBranch(positions, colors);
}

/** Drawn smaller than the tile from its base, so the margin round it is empty and the base meets the card's root. */
function finishBranch(positions: number[], colors: number[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.scale(FIT, FIT, FIT);
  geometry.translate(0, 0.02, 0);
  return geometry;
}

let sheet: THREE.WebGLRenderTarget | null = null;

/** Renders the sheet once and binds it for every crown. Cheap to call again. */
export function ensureBranchSheet(renderer: THREE.WebGLRenderer): void {
  if (sheet) return;
  sheet = new THREE.WebGLRenderTarget(TILE * SHEET_COLUMNS, TILE * SHEET_ROWS, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
    depthBuffer: true,
    stencilBuffer: false,
  });
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
  const scene = new THREE.Scene();
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), material);
  mesh.frustumCulled = false;
  scene.add(mesh);
  // An orthographic frame is offsets from the camera, so a camera at half height
  // frames 0..1 with the row's own half either way.
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
  camera.position.set(0, 0.5, 4);
  camera.lookAt(0, 0.5, 0);
  camera.updateMatrixWorld(true);

  const prior = renderer.getRenderTarget();
  const priorClear = new THREE.Color();
  renderer.getClearColor(priorClear);
  const priorAlpha = renderer.getClearAlpha();
  const priorAutoClear = renderer.autoClear;
  const priorScissor = renderer.getScissorTest();
  const priorViewport = renderer.getViewport(new THREE.Vector4());
  const priorScissorBox = renderer.getScissor(new THREE.Vector4());
  renderer.setRenderTarget(sheet);
  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(true);
  renderer.setScissor(0, 0, sheet.width, sheet.height);
  renderer.setViewport(0, 0, sheet.width, sheet.height);
  renderer.clear(true, true, false);
  renderer.autoClear = false;
  for (let tile = 0; tile < SHEET_TILES; tile++) {
    const x = (tile % SHEET_COLUMNS) * TILE;
    const y = Math.floor(tile / SHEET_COLUMNS) * TILE;
    mesh.geometry.dispose();
    const kind = KIND_ORDER[Math.floor(tile / PER_KIND)];
    mesh.geometry = branchGeometry(createRng(7001 + tile * 131), kind);
    camera.left = -SHEET_ASPECT[kind] / 2;
    camera.right = SHEET_ASPECT[kind] / 2;
    camera.updateProjectionMatrix();
    renderer.setViewport(x, y, TILE, TILE);
    renderer.setScissor(x, y, TILE, TILE);
    renderer.render(scene, camera);
  }
  mesh.geometry.dispose();
  material.dispose();
  renderer.setViewport(priorViewport);
  renderer.setScissor(priorScissorBox);
  renderer.setScissorTest(priorScissor);
  renderer.autoClear = priorAutoClear;
  renderer.setClearColor(priorClear, priorAlpha);
  renderer.setRenderTarget(prior);
  branchSheetUniforms.tBranch.value = sheet.texture;
}
