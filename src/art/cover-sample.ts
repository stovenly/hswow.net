import * as THREE from 'three';
import {
  COVER_TYPES,
  COVER_ORDER,
  coverSwell,
  coverThickness,
  coverMound,
  type CoverName,
  type CoverType,
  type BladeLayer,
  type PropLayer,
} from '../world/ground';

/**
 * Where a field of groundcover is decided: the CPU sampler, and nothing else.
 *
 * Split out of `art/cover.ts` so it can run somewhere other than the main
 * thread. Nothing here touches a material, a uniform or a compiled geometry —
 * it reads a ground mesh's attributes and returns numbers — which is what lets
 * `cover.worker.ts` import it without dragging the whole art kit, and three's
 * renderer, into a worker bundle.
 *
 * It is also why the sampler is worth moving at all: it is the longest purely
 * arithmetic step in building a zone, it depends on nothing but the terrain and
 * a seed, and it already produces typed arrays that can be handed back without
 * a copy.
 */

/** `vec4` per terrain vertex: type index, feather, swell, thickness. */
export const COVER_ATTRIBUTE = 'cover';

/** `vec2` per terrain vertex: neighbouring type index, how much of it to mix in. */
export const COVER_BLEND_ATTRIBUTE = 'coverBlend';

/** Clump cell, metres. What stops a field reading as a lawn. */
const CLUMP = 0.9;

/** Cull tile, metres. Instances are grouped so the frustum can drop them. */
const CHUNK = 24;

/** How far off its face a wall prop is rooted. See `PROP_TURN`. */
export const WALL_LIFT = 0.02;

/** The backlight each kind carries — see the tuft fragment's glow term. */
export const PROP_GLOW: Record<PropLayer['kind'], number> = {
  plume: 1,
  bloom: 0.25,
  leaf: 0.1,
  ivy: 0.05,
  posy: 0.2,
  raceme: 0.35,
};

/**
 * Which kinds spin freely in the wall plane. A crawl points any way; a
 * raceme hangs, and must keep hanging.
 */
export const PROP_ROLLS: Record<PropLayer['kind'], boolean> = {
  plume: false,
  bloom: false,
  leaf: false,
  ivy: true,
  posy: true,
  raceme: false,
};

/**
 * How far a wall prop turns about the vertical, radians either side of facing
 * its wall.
 *
 * A crawl gets none: it is a flat sheet half a metre wide lying in the wall
 * plane, and turning it about the vertical is what takes its far end *behind*
 * the wall, where it silently stops drawing. Its variety comes from the roll,
 * which stays in the plane. A raceme is the opposite case — compact, cannot
 * roll, but free to turn on the thing it hangs from, which shows a different
 * face of the same mesh. `check:art` measures each against its own turn.
 */
export const PROP_TURN: Record<PropLayer['kind'], number> = {
  plume: 0,
  bloom: 0,
  leaf: 0,
  ivy: 0,
  posy: 0.3,
  raceme: 1.5,
};


/** Deterministic 0..1 from three integers — the same field on every visit. */
export function hat(a: number, b: number, c: number): number {
  let h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export interface BladeChunk {
  place: number[];
  shape: number[];
  tint: number[];
  wild: number[];
  normal: number[];
}

export interface PropChunk {
  kind: PropLayer['kind'];
  place: number[];
  prop: number[];
  tint: number[];
  normal: number[];
  roll: number[];
}

export interface CoverSample {
  blades: Map<string, BladeChunk>;
  props: Map<string, PropChunk>;
  bladeCount: number;
  propCount: number;
  maxLen: number;
}

/**
 * Walks the ground's triangles and rolls every blade and prop.
 *
 * Hash-driven throughout, keyed on face and blade index, so the same mesh
 * grows the same field every time a zone is rebuilt. A mesh with no painted
 * attribute grows a single stated type everywhere, with the broad fields
 * sampled at its world position — a slab beside the terrain sweeps with it.
 */
export function sampleCover(ground: THREE.Mesh, uniform?: CoverName): CoverSample | null {
  const source = ground.geometry;
  const painted = source.getAttribute(COVER_ATTRIBUTE);
  const blended = painted ? source.getAttribute(COVER_BLEND_ATTRIBUTE) : null;
  const stated = uniform ?? (ground.userData.cover as CoverName | undefined);
  if (!painted && (!stated || stated === 'none')) return null;

  const position = source.getAttribute('position');
  const colors = source.getAttribute('color');
  const index = source.getIndex();
  const faces = (index ? index.count : position.count) / 3;
  const statedIndex = stated ? COVER_ORDER.indexOf(stated) : 0;

  ground.updateWorldMatrix(true, false);
  const toWorld = ground.matrixWorld;

  const sample: CoverSample = {
    blades: new Map(),
    props: new Map(),
    bladeCount: 0,
    propCount: 0,
    maxLen: 0,
  };

  const va = new THREE.Vector3();
  const vb = new THREE.Vector3();
  const vc = new THREE.Vector3();
  const wa = new THREE.Vector3();
  const wb = new THREE.Vector3();
  const wc = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const cross = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const tint = new THREE.Color();
  const faceTint = new THREE.Color();

  for (let f = 0; f < faces; f++) {
    const i0 = index ? index.getX(f * 3) : f * 3;
    const i1 = index ? index.getX(f * 3 + 1) : f * 3 + 1;
    const i2 = index ? index.getX(f * 3 + 2) : f * 3 + 2;

    const typeIndex = painted ? Math.round(painted.getX(i0)) : statedIndex;
    if (typeIndex <= 0) continue;
    const spec: CoverType = COVER_TYPES[COVER_ORDER[typeIndex]];
    if (!spec || (!spec.blades && !spec.props)) continue;
    const walls = spec.walls === true;

    va.fromBufferAttribute(position, i0);
    vb.fromBufferAttribute(position, i1);
    vc.fromBufferAttribute(position, i2);
    wa.copy(va).applyMatrix4(toWorld);
    wb.copy(vb).applyMatrix4(toWorld);
    wc.copy(vc).applyMatrix4(toWorld);

    ab.subVectors(wb, wa);
    ac.subVectors(wc, wa);
    const area = cross.crossVectors(ab, ac).length() / 2;
    if (area <= 0) continue;

    // Wall cover grows only on faces that are actually wall-like, and stays
    // oriented to them: yaw turns an authored prop's +Z out along the face.
    if (walls && Math.abs(cross.y) / (2 * area) > 0.55) continue;
    const yawWall = Math.atan2(-cross.x, cross.z);

    // Object-space face normal, for the shader's lighting. A wall face keeps
    // its own way out; ground is always lit from above.
    ab.subVectors(vb, va);
    ac.subVectors(vc, va);
    normal.crossVectors(ab, ac).normalize();
    if (!walls && normal.y < 0) normal.negate();

    if (colors) faceTint.setRGB(colors.getX(i0), colors.getY(i0), colors.getZ(i0));
    else faceTint.setRGB(1, 1, 1);

    // Per-corner feather and the two broad fields.
    let f0 = 1;
    let f1 = 1;
    let f2 = 1;
    let s0: number;
    let s1: number;
    let s2: number;
    let k0: number;
    let k1: number;
    let k2: number;
    if (painted) {
      f0 = painted.getY(i0);
      f1 = painted.getY(i1);
      f2 = painted.getY(i2);
      s0 = painted.getZ(i0);
      s1 = painted.getZ(i1);
      s2 = painted.getZ(i2);
      k0 = painted.getW(i0);
      k1 = painted.getW(i1);
      k2 = painted.getW(i2);
    } else {
      s0 = coverSwell(wa.x, wa.z);
      s1 = coverSwell(wb.x, wb.z);
      s2 = coverSwell(wc.x, wc.z);
      k0 = coverThickness(wa.x, wa.z);
      k1 = coverThickness(wb.x, wb.z);
      k2 = coverThickness(wc.x, wc.z);
    }

    // Who is across the nearest soft boundary, and how much of them to roll.
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    if (blended) {
      n0 = Math.round(blended.getX(i0));
      n1 = Math.round(blended.getX(i1));
      n2 = Math.round(blended.getX(i2));
      b0 = blended.getY(i0);
      b1 = blended.getY(i1);
      b2 = blended.getY(i2);
    }

    const blades = spec.blades;
    if (blades && !walls) {
      const n = Math.floor(area * blades.density + hat(f, 0, 17));
      for (let i = 0; i < n; i++) {
        let r1 = hat(f, i, 29);
        let r2 = hat(f, i, 31);
        if (r1 + r2 > 1) {
          r1 = 1 - r1;
          r2 = 1 - r2;
        }
        const w0 = 1 - r1 - r2;

        const feather = f0 * w0 + f1 * r1 + f2 * r2;
        const thick = k0 * w0 + k1 * r1 + k2 * r2;
        const keep = Math.min(1, feather * (0.4 + 1.2 * thick));
        if (hat(f, i, 37) >= keep) continue;

        const wx = wa.x * w0 + wb.x * r1 + wc.x * r2;
        const wz = wa.z * w0 + wb.z * r1 + wc.z * r2;

        // Near a soft boundary, some of this face's blades are rolled as the
        // neighbouring type instead — from both sides, so the boundary is an
        // interleaved band rather than a line.
        let layer: BladeLayer = blades;
        const mix = b0 * w0 + b1 * r1 + b2 * r2;
        if (mix > 0 && hat(f, i, 109) < mix) {
          const other = w0 >= r1 && w0 >= r2 ? n0 : r1 >= r2 ? n1 : n2;
          const swapped: CoverType = COVER_TYPES[COVER_ORDER[other]];
          if (!swapped?.blades || swapped.walls) continue;
          layer = swapped.blades;
        }

        const cx = Math.floor(wx / CLUMP);
        const cz = Math.floor(wz / CLUMP);
        const clumpTall = 0.7 + 0.6 * hat(cx, cz, 3);
        const clumpYaw = hat(cx, cz, 5) * Math.PI * 2;
        const clumpShade = 0.9 + 0.2 * hat(cx, cz, 7);

        const swell = s0 * w0 + s1 * r1 + s2 * r2;
        const h1 = hat(f, i, 41);
        const h2 = hat(f, i, 43);
        const h3 = hat(f, i, 47);
        const h4 = hat(f, i, 53);
        const vary = layer.vary ?? 0.3;
        // The swell field carries most of the range, so height reads as
        // sweeping areas of a field rather than as noise between neighbours.
        let length =
          layer.length * (0.55 + 0.95 * swell) * clumpTall * (1 - 0.5 * vary + vary * h1);
        // A mounded layer rolls instead: height follows its own smooth field,
        // plateaued into chunks — thick masses with quick sides and a low nap
        // between, rather than gentle swells.
        const mound = layer.mound ?? 0;
        let crest = 0;
        if (mound > 0) {
          const t = Math.min(Math.max((coverMound(wx, wz) - 0.38) / 0.24, 0), 1);
          crest = t * t * (3 - 2 * t);
          // Even a hollow is a pad of moss, not bare — the chunks stand out of
          // it rather than off the ground.
          length += (layer.length * (0.62 + 1.0 * crest) * (0.9 + 0.2 * h1) - length) * mound;
        }
        sample.maxLen = Math.max(sample.maxLen, length);

        // How much of the ground's own colour bleeds through, so a patch reads
        // as standing on what it stands on. Moss keeps its own green: it grows
        // on stone and mud, and inheriting those turns it black.
        tint.set(layer.tint).lerp(faceTint, layer.blend ?? 0.25);
        // Crests catch more light than hollows lose — a mass lit from above,
        // not a field of pits.
        const shade =
          clumpShade * (0.92 + 0.16 * h2) * (1 + mound * (crest - 0.3) * 0.45);

        const key = `${Math.floor(wx / CHUNK)},${Math.floor(wz / CHUNK)}`;
        let chunk = sample.blades.get(key);
        if (!chunk) {
          chunk = { place: [], shape: [], tint: [], wild: [], normal: [] };
          sample.blades.set(key, chunk);
        }
        chunk.place.push(
          va.x * w0 + vb.x * r1 + vc.x * r2,
          va.y * w0 + vb.y * r1 + vc.y * r2,
          va.z * w0 + vb.z * r1 + vc.z * r2,
          clumpYaw + (h3 - 0.5) * 2.6,
        );
        chunk.shape.push(
          length,
          // Wider still on a mound's crest, so the chunk fuses into one mass.
          layer.width * (0.85 + 0.3 * h2) * (1 + 0.5 * mound * crest),
          layer.sprawl * (0.25 + 0.75 * h4),
          // Blunt for mounds, so neighbours merge into a mass.
          0.8 - 0.5 * mound,
        );
        chunk.tint.push(tint.r * shade, tint.g * shade, tint.b * shade);
        chunk.wild.push(h1 * 6.2831, h4 * 31, layer.give, 0);
        chunk.normal.push(normal.x, normal.y, normal.z);
        sample.bladeCount++;
      }
    }

    const propLayers: readonly PropLayer[] = !spec.props
      ? []
      : Array.isArray(spec.props)
        ? spec.props
        : [spec.props];
    for (let layer = 0; layer < propLayers.length; layer++) {
      const props = propLayers[layer];
      const salt = layer * 131;
      const n = Math.floor(area * props.density + hat(f, salt, 71));
      for (let i = 0; i < n; i++) {
        let r1 = hat(f, i, 73 + salt);
        let r2 = hat(f, i, 79 + salt);
        if (r1 + r2 > 1) {
          r1 = 1 - r1;
          r2 = 1 - r2;
        }
        const w0 = 1 - r1 - r2;
        const feather = f0 * w0 + f1 * r1 + f2 * r2;
        // Props cross-fade at a soft boundary: ours thin out as the
        // neighbour's thin in from their own side.
        const mix = b0 * w0 + b1 * r1 + b2 * r2;
        if (hat(f, i, 83 + salt) >= feather * (1 - mix)) continue;

        const wx = wa.x * w0 + wb.x * r1 + wc.x * r2;
        const wz = wa.z * w0 + wb.z * r1 + wc.z * r2;
        const h1 = hat(f, i, 89 + salt);
        const h2 = hat(f, i, 97 + salt);
        const h3 = hat(f, i, 101 + salt);

        const palette = props.tints ?? [props.tint];
        tint.set(palette[Math.floor(h3 * palette.length) % palette.length]);
        const shade = 0.9 + 0.2 * hat(f, i, 103 + salt);

        const key = `${props.kind}:${Math.floor(wx / CHUNK)},${Math.floor(wz / CHUNK)}`;
        let chunk = sample.props.get(key);
        if (!chunk) {
          chunk = { kind: props.kind, place: [], prop: [], tint: [], normal: [], roll: [] };
          sample.props.set(key, chunk);
        }
        // Wall props sit just off their face and yaw to it, give or take;
        // ground props spin freely.
        const lift = walls ? WALL_LIFT : 0;
        chunk.place.push(
          va.x * w0 + vb.x * r1 + vc.x * r2 + normal.x * lift,
          va.y * w0 + vb.y * r1 + vc.y * r2 + normal.y * lift,
          va.z * w0 + vb.z * r1 + vc.z * r2 + normal.z * lift,
          walls ? yawWall + (h2 - 0.5) * PROP_TURN[props.kind] : h2 * Math.PI * 2,
        );
        chunk.prop.push(props.scale * (0.8 + 0.4 * h1), 0.8 + 0.9 * h3, h3, PROP_GLOW[props.kind]);
        chunk.tint.push(tint.r * shade, tint.g * shade, tint.b * shade);
        if (walls) chunk.normal.push(normal.x, normal.y, normal.z);
        else chunk.normal.push(0, 1, 0);
        chunk.roll.push(
          walls && PROP_ROLLS[props.kind] ? hat(f, i, 107 + salt) * Math.PI * 2 : 0,
        );
        sample.propCount++;
      }
    }
  }

  return sample;
}

/**
 * A sample as it crosses a thread boundary: typed arrays instead of Maps of
 * plain arrays, with every buffer in `transfer` so the crossing is a handover
 * rather than a copy.
 */
export interface CoverChunks {
  blades: {
    place: Float32Array;
    shape: Float32Array;
    tint: Float32Array;
    wild: Float32Array;
    normal: Float32Array;
  }[];
  props: {
    kind: PropLayer['kind'];
    place: Float32Array;
    prop: Float32Array;
    tint: Float32Array;
    normal: Float32Array;
    roll: Float32Array;
  }[];
  maxLen: number;
}

/** Every buffer in a packed sample, for the transfer list. */
export function buffersOf(chunks: CoverChunks): ArrayBufferLike[] {
  const out: ArrayBufferLike[] = [];
  for (const chunk of chunks.blades) {
    out.push(chunk.place.buffer, chunk.shape.buffer, chunk.tint.buffer, chunk.wild.buffer, chunk.normal.buffer);
  }
  for (const chunk of chunks.props) {
    out.push(chunk.place.buffer, chunk.prop.buffer, chunk.tint.buffer, chunk.normal.buffer, chunk.roll.buffer);
  }
  return out;
}

/** Packs a sample for the crossing. Chunk order is the Maps' insertion order. */
export function packSample(sample: CoverSample): CoverChunks {
  return {
    blades: [...sample.blades.values()].map((chunk) => ({
      place: new Float32Array(chunk.place),
      shape: new Float32Array(chunk.shape),
      tint: new Float32Array(chunk.tint),
      wild: new Float32Array(chunk.wild),
      normal: new Float32Array(chunk.normal),
    })),
    props: [...sample.props.values()].map((chunk) => ({
      kind: chunk.kind,
      place: new Float32Array(chunk.place),
      prop: new Float32Array(chunk.prop),
      tint: new Float32Array(chunk.tint),
      normal: new Float32Array(chunk.normal),
      roll: new Float32Array(chunk.roll),
    })),
    maxLen: sample.maxLen,
  };
}
