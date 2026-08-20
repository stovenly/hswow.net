import * as THREE from 'three';
import type { Part } from '../assemble';
import type { Rng } from '../random';
import type { GestureFit } from '../../life/spec';
import { PALETTE, shade } from '../palette';
import type { Catalogs } from './figure-layers';
import { LIMB_SIDES, limbBand, type Limb } from './figure-limbs';
import { pickWeighted } from './figure-surface';
import type { Body, FrameRanges } from './figure-trunk';
import { HEAD_KINDS } from './figure-head';
import { CITY_HEAD_KINDS, type HouseColours } from './figure-head-city';
import { COUNTRY_CATALOGS, dressBase } from './figure-wear';
import { CITY_CATALOGS, CITY_GARMENTS, dressCity } from './figure-finery';

/**
 * The peoples: everything that makes a villager a villager and a cityfolk a
 * cityfolk, as data — physique, head kinds, outfit colours, base garment and
 * dress catalogs. `figure.ts` is a driver over one entry; a new people is a
 * new entry here, not new machinery.
 */

// --- the shapes -------------------------------------------------------------------

/** The proportions a body is drawn from. The scalars are in units of the trunk height T. */
export interface Physique {
  height: [number, number];
  headR: [number, number];
  /** The legs' share of the height under the head. */
  legFraction: [number, number];
  armR: number;
  legR: number;
  upperArm: number;
  forearm: number;
  frame: FrameRanges;
  /** How the contact gestures are scaled to land on this shape; 1 and 1 here. */
  gestures: GestureFit;
}

/** What one figure is dealt to wear: its colours and its base garment. */
export interface Outfit {
  cloth: number;
  lower: number;
  accent: number;
  trim: number;
  leather: number;
  metal: number;
  fur: number;
  /** A cityfolk's house, which its helm is fitted in. */
  house?: HouseColours;
  /** Where the base garment ends over the lower half; drawn when the body is dressed. */
  hem(rng: Rng): number;
  /** The base garment, built first by `dress()`. */
  base(rng: Rng, m: Body, parts: Part[]): void;
}

/** How the arms are covered. */
export interface Sleeves {
  /** Where the sleeve ends down the arm; under 0.5 the forearm is bare. */
  sleeveEnd: number;
  foreCloth: number;
  glove?: number;
  armWraps: boolean;
}

export type LowerStyle = 'trousers' | 'wraps' | 'breeches' | 'hose' | 'garters';

export interface People {
  physique: Physique;
  hides: readonly number[];
  heads: { kinds: readonly string[]; default: string };
  outfit(rng: Rng, hide: number): Outfit;
  sleeves(rng: Rng, o: Outfit): Sleeves;
  lowerStyles: readonly { weight: number; kind: LowerStyle }[];
  shoes(rng: Rng): boolean;
  catalogs: Catalogs<Body>;
  /** Dressing wound onto the limbs, over the `Limb` handles the driver hands over. */
  limbs: {
    /** The forearm's, from what `sleeves` drew. */
    arm(l: Limb, s: Sleeves, o: Outfit): Part[];
    /** The shin's, by the lower style drawn; a style not listed wears nothing. */
    leg: Partial<Record<LowerStyle, (l: Limb, o: Outfit) => Part[]>>;
  };
}

// --- palettes -------------------------------------------------------------------

/** A villager's own colour: pale and desaturated, at the hands and nowhere else. */
const HIDES = [0xc9b79c, 0xa8b08e, 0xb99a8f, 0xcdb197, 0xc2a374, 0x9c8f9e, 0xb0a48a, 0x8fa89a];
/**
 * Cloth. One low-chroma earth palette for every villager, deliberately darker
 * than any hide and checked against it, so a crowd reads as one people and a
 * collar never reads as a bare patch.
 */
const CLOTHS = [
  PALETTE.BARK,
  PALETTE.BARK_PALE,
  PALETTE.TIMBER_DARK,
  0x3a342b,
  0x453d31,
  0x4a4237,
  0x554b42,
  0x5a4e3e,
  0x6b5b46,
  0x6d5a4c,
  0x7a6142,
  0x7d6c53,
  0x8a7458,
  0x4e5344,
  0x5f6650,
  0x6f7562,
  0x7a5a4a,
];
/** The one warmer note a villager may carry as its accent: dyed, but with earth in it. */
const WARMS = [0x9a6b2f, 0x7a3b32, 0x4f5e34, 0x3f4a5a, 0x8a4a2a, 0x6b5a2a, 0x5b4a6a];
const LEATHERS = [PALETTE.HIDE_DARK, PALETTE.BARK, 0x5a3a28, 0x4a3f36];
const METALS = [PALETTE.IRON, PALETTE.BRONZE, PALETTE.IRON_PALE];

/**
 * The city dresses by house: one hue taken down and up — the same dye dark,
 * mid and pale — and one contrast against it, gold, ivory, silver or black.
 * Black is only ever a contrast, never a house.
 * Everything a cityfolk wears, carries and is helmed in comes from its house,
 * so an outfit is one tone and one note, never a heap of colours.
 */
interface House {
  dark: number;
  mid: number;
  pale: number;
  /** The contrasts the house allows, each with the metal that goes with it. */
  contrasts: readonly { color: number; metal: number }[];
  fur: number;
  leather: number;
  weight: number;
}
const GILT = 0xd8b45a;
const SILVER = 0xc4c2ba;
const GOLD = 0xc9a24a;
const IVORY = 0xe4d9bd;
const BLACK = 0x2b2926;
const HOUSES: readonly House[] = [
  // Purple.
  { dark: 0x2e1a45, mid: 0x4b2a6b, pale: 0x7a5a99, contrasts: [{ color: GOLD, metal: GILT }, { color: IVORY, metal: GILT }], fur: 0xb19cb4, leather: 0x2a1a38, weight: 3 },
  // Crimson.
  { dark: 0x4a1218, mid: 0x7a1f2a, pale: 0xa8434c, contrasts: [{ color: GOLD, metal: GILT }, { color: BLACK, metal: GILT }], fur: 0x713a3e, leather: 0x3a1014, weight: 3 },
  // Azure.
  { dark: 0x182a58, mid: 0x2b4a86, pale: 0x5a78b0, contrasts: [{ color: IVORY, metal: SILVER }, { color: SILVER, metal: SILVER }], fur: 0xa1abbf, leather: 0x1a2440, weight: 3 },
  // Murrey.
  { dark: 0x3a1830, mid: 0x5c2a4a, pale: 0x8a5474, contrasts: [{ color: IVORY, metal: GILT }, { color: GOLD, metal: GILT }], fur: 0xb999a1, leather: 0x2c1424, weight: 2 },
];

/** How far apart two sRGB hexes are, as the largest channel difference. */
function apart(a: number, b: number): number {
  return Math.max(
    Math.abs(((a >> 16) & 255) - ((b >> 16) & 255)),
    Math.abs(((a >> 8) & 255) - ((b >> 8) & 255)),
    Math.abs((a & 255) - (b & 255)),
  );
}

/** A cloth colour clear of the hide and of everything already worn. */
function pickCloth(rng: Rng, hide: number, taken: readonly number[], from: readonly number[] = CLOTHS, apartBy = 34): number {
  const clear = from.filter((c) => apart(c, hide) > 55 && taken.every((t) => apart(c, t) > apartBy));
  return rng.pick(clear.length ? clear : from);
}

// --- limb dressing ----------------------------------------------------------------

/** Wraps wound along the limb: four bands standing `lift` off it, alternating shades. */
function windings(l: Limb, color: number, start: number, step: number, half: number, lift: number, dim: number): Part[] {
  const parts: Part[] = [];
  for (let i = 0; i < 4; i++) {
    const t = start + i * step;
    const r = l.radiusAt(t) + lift;
    parts.push(limbBand(l, [[t - half, r], [t + half, r * 0.98]], shade(color, i % 2 ? dim : 1)));
  }
  return parts;
}

/** The forearm's dressing: a gauntlet cuff over a glove, a cuff where the sleeve ends, wraps. */
function forearmWear(l: Limb, s: Sleeves, o: Outfit): Part[] {
  const parts: Part[] = [];
  if (s.glove !== undefined) {
    const r = l.radiusAt(0.9) + 0.004;
    parts.push(limbBand(l, [[0.84, r * 1.12], [1.02, r * 0.98]], shade(s.glove, 0.88)));
  }
  if (s.sleeveEnd >= 0.5) {
    const cuffAt = l.from.clone().lerp(l.to, 0.1);
    const cuff = new THREE.CylinderGeometry(l.r * 1.02, l.r * 1.06, l.r * 0.7, LIMB_SIDES);
    cuff.translate(cuffAt.x, cuffAt.y, cuffAt.z);
    parts.push({ geometry: cuff, color: o.trim, bone: l.bone });
  }
  if (s.armWraps) parts.push(...windings(l, o.accent, 0.34, 0.15, 0.05, 0.004, 0.9));
  return parts;
}

/** A garter tied under the knee, its ends hanging. */
function garter(l: Limb, o: Outfit): Part[] {
  const r = l.radiusAt(0.16) + 0.004;
  const tail = new THREE.BoxGeometry(l.r * 0.16, l.r * 0.5, l.r * 0.05);
  const kneeOut = l.from.clone().lerp(l.to, 0.16).add(new THREE.Vector3(l.side * r * 0.9, -l.r * 0.28, r * 0.3));
  tail.translate(kneeOut.x, kneeOut.y, kneeOut.z);
  return [limbBand(l, [[0.11, r], [0.2, r * 0.98]], o.trim), { geometry: tail, color: shade(o.trim, 0.9), bone: l.bone }];
}

/** The breeches' cuff, gathered under the knee. */
function breechCuff(l: Limb, o: Outfit): Part[] {
  return [limbBand(l, [[0.04, l.r * 1.1], [0.2, l.r * 1.06]], o.lower)];
}

function legWraps(l: Limb, o: Outfit): Part[] {
  return windings(l, o.accent, 0.2, 0.18, 0.06, 0.005, 0.88);
}

// --- the two peoples -------------------------------------------------------------

/** The one body plan both peoples share today: human in the limbs, not in the head. */
const VILLAGER: Physique = {
  height: [1.28, 1.68],
  headR: [0.135, 0.172],
  legFraction: [0.53, 0.58],
  armR: 0.068,
  legR: 0.095,
  upperArm: 0.49,
  forearm: 0.4,
  frame: {
    breadth: [0.92, 1.1],
    chest: [0.94, 1.06],
    waist: [0.9, 1.08],
    hip: [0.95, 1.12],
    depth: [0.92, 1.08],
    belly: [0.94, 1.14],
  },
  gestures: { reachIn: 1, reachUp: 1 },
};

export const PEOPLE: Record<'country' | 'city', People> = {
  country: {
    physique: VILLAGER,
    hides: HIDES,
    heads: { kinds: HEAD_KINDS, default: 'round' },
    // The three cloths are a family, not a set — the lower half and the accent
    // are mostly the shirt taken up or down.
    outfit: (rng, hide) => {
      const cloth = pickCloth(rng, hide, []);
      const lower = rng.chance(0.66) ? shade(cloth, rng.range(0.68, 0.82)) : pickCloth(rng, hide, [cloth]);
      const accent = rng.chance(0.4)
        ? pickCloth(rng, hide, [cloth, lower], WARMS)
        : rng.chance(0.55)
          ? shade(cloth, rng.chance(0.5) ? rng.range(0.5, 0.62) : rng.range(1.2, 1.34))
          : pickCloth(rng, hide, [cloth, lower]);
      const leather = rng.pick(LEATHERS);
      return {
        cloth,
        lower,
        accent,
        trim: accent,
        leather,
        metal: rng.pick(METALS),
        fur: shade(leather, 1.25),
        hem: (r) => r.range(0.24, 0.36),
        base: dressBase,
      };
    },
    sleeves: (rng, o) => {
      const sleeveEnd = rng.range(0.35, 0.9);
      return { sleeveEnd, armWraps: rng.chance(0.25), foreCloth: o.cloth };
    },
    lowerStyles: [
      { weight: 0.5, kind: 'trousers' },
      { weight: 0.28, kind: 'wraps' },
      { weight: 0.22, kind: 'breeches' },
    ],
    shoes: () => false,
    catalogs: COUNTRY_CATALOGS,
    limbs: { arm: forearmWear, leg: { wraps: legWraps, breeches: breechCuff } },
  },
  city: {
    physique: VILLAGER,
    hides: HIDES,
    heads: { kinds: CITY_HEAD_KINDS, default: 'greathelm' },
    // The base garment is drawn first: the hose under it follow its cut. The
    // accent is the contrast or the pale, never a second hue.
    outfit: (rng, hide) => {
      const garment = pickWeighted(rng, CITY_GARMENTS);
      const house = pickWeighted(rng, HOUSES);
      const clear = house.contrasts.filter((c) => apart(c.color, hide) > 45);
      const { color: contrast, metal } = rng.pick(clear.length ? clear : house.contrasts);
      const accent = rng.chance(0.6) ? contrast : house.pale;
      const lower = garment.hose === 'dark' ? house.dark : rng.chance(0.5) ? house.dark : shade(house.mid, 0.8);
      return {
        cloth: house.mid,
        lower,
        accent,
        trim: contrast,
        leather: house.leather,
        metal,
        fur: house.fur,
        house: { dark: house.dark, mid: house.mid, pale: house.pale, contrast, metal, fur: house.fur },
        hem: (r) => garment.hem(r),
        base: (r, m, p) => dressCity(r, m, p, garment),
      };
    },
    // Always sleeved, sometimes in the second cloth below the elbow, and often gloved.
    sleeves: (rng, o) => {
      const sleeveEnd = rng.range(0.6, 0.95);
      const foreCloth = rng.chance(0.35) ? o.accent : o.cloth;
      const glove = rng.chance(0.45) ? rng.pick([IVORY, o.leather, o.trim]) : undefined;
      return { sleeveEnd, foreCloth, glove, armWraps: false };
    },
    lowerStyles: [
      { weight: 0.6, kind: 'hose' },
      { weight: 0.4, kind: 'garters' },
    ],
    shoes: (rng) => rng.chance(0.6),
    catalogs: CITY_CATALOGS,
    limbs: { arm: forearmWear, leg: { garters: garter } },
  },
};

/**
 * The thickest coat in any people's catalog, from what each overlayer declares
 * at the waist: what a hanging arm must clear, so a thicker coat can never
 * desync from the arms that must clear it.
 */
export const COAT_PROUD = Math.max(
  ...Object.values(PEOPLE).flatMap((p) => p.catalogs.overlayers.map((o) => o.regions?.waist ?? 0)),
);
