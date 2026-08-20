import * as THREE from 'three';
import type { BuilderWith } from '../types';
import type { Part } from '../assemble';
import { loft } from '../loft';
import { finishRigged, type BoneSpec } from '../rig';
import { createRng, type Rng } from '../random';
import { PALETTE, shade } from '../palette';
import type { LifeOptions, LifeSpec } from '../../life/spec';
import { buildHead, type AnyHeadKind } from './figure-head';
import { U_CHEST, U_WAIST, drawFrame, makeTrunk } from './figure-trunk';
import { OVERLAYERS, SHOULDERS, WAISTS, dressBase, pickWeighted, wearExtras, type Ball, type Body } from './figure-wear';
import { CITY_GARMENTS, CITY_OVERLAYERS, CITY_SHOULDERS, CITY_WAISTS, dressCity, wearCityExtras } from './figure-finery';

/**
 * A villager, or a cityfolk. Friendly, bipedal, and not a person. `folk` picks
 * the people: the same body in the countryside's dress and carved masks, or
 * the city's finery (`figure-finery.ts`) and helms (`figure-head-city.ts`).
 *
 * The trunk is one modelled surface (`figure-trunk.ts`): pelvis, waist,
 * ribcage and shoulders, skinned across `hips`, `torso`, `chest` and
 * the clavicles. Everything worn on it is a layer of that same surface
 * (`figure-wear.ts`). Limbs are rigid lofts with a joint head on the segment
 * below each pivot, so a bend never opens a gap. Human proportion in the
 * limbs — the wrist hangs at the crotch — under a head that is not.
 *
 * **The head is covered, and it is a whole form of its own**: a hood and one
 * of the carved masks in `figure-head.ts`, chosen by `face`. LIFE.md §3.
 *
 * Rigged, facing +Z, feet on y = 0. Bones:
 *
 *   root ─ hips ─ torso ─ chest ─ neck ─ head ─ face
 *               │        ├ clavL ─ armLu ─ armLl     (and R)
 *               └ legLu ─ legLl ─ legLf              (and R)
 */

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

/** The three cloths: a family, not a set — the lower half and the accent are mostly the shirt taken up or down. */
function outfit(rng: Rng, hide: number): { cloth: number; lower: number; accent: number } {
  const cloth = pickCloth(rng, hide, []);
  const lower = rng.chance(0.66) ? shade(cloth, rng.range(0.68, 0.82)) : pickCloth(rng, hide, [cloth]);
  const accent = rng.chance(0.4)
    ? pickCloth(rng, hide, [cloth, lower], WARMS)
    : rng.chance(0.55)
      ? shade(cloth, rng.chance(0.5) ? rng.range(0.5, 0.62) : rng.range(1.2, 1.34))
      : pickCloth(rng, hide, [cloth, lower]);
  return { cloth, lower, accent };
}

/** A cityfolk's house and everything drawn from it: the accent is the contrast or the pale, never a second hue. */
function outfitCity(rng: Rng, hide: number, hose: 'plain' | 'dark'): { house: House; cloth: number; lower: number; accent: number; contrast: number; metal: number } {
  const house = pickWeighted(rng, HOUSES);
  const clear = house.contrasts.filter((c) => apart(c.color, hide) > 45);
  const { color: contrast, metal } = rng.pick(clear.length ? clear : house.contrasts);
  const cloth = house.mid;
  const accent = rng.chance(0.6) ? contrast : house.pale;
  const lower = hose === 'dark' ? house.dark : rng.chance(0.5) ? house.dark : shade(house.mid, 0.8);
  return { house, cloth, lower, accent, contrast, metal };
}

const LIMB_SIDES = 8;

/**
 * A limb segment: a loft along the line from `from` to `to`, with a profile
 * given as (t along the segment, radius). `t` may run below zero, which puts
 * a rounded joint head *above* the pivot. `flat` squashes the section across
 * the limb.
 */
function limb(
  from: THREE.Vector3,
  to: THREE.Vector3,
  stations: readonly (readonly [number, number])[],
  flat = 1,
  caps: { start?: boolean; end?: boolean } = { start: true, end: true },
): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const axis = dir.clone().divideScalar(length);
  const at = axis.toArray() as [number, number, number];
  return loft(
    stations.map(([t, r]) => ({
      at: [from.x + axis.x * t * length, from.y + axis.y * t * length, from.z + axis.z * t * length] as [number, number, number],
      rx: r,
      ry: r * flat,
      axis: at,
    })),
    LIMB_SIDES,
    caps,
  );
}

/**
 * A joint head: the stations of a ball of radius `R` about a segment's start
 * pivot, for a segment `length` long, ending at the pivot itself. The segment
 * above must end thinner than `R` — then it is inside the ball whatever the
 * bend, and nothing pokes out or fights the surface.
 */
function head(R: number, length: number): [number, number][] {
  return [0.95, 0.75, 0.45, 0].map((k) => [(-k * R) / length, R * Math.sqrt(1 - k * k)]);
}

/** Radius of a limb profile at `t`, for wrapping things round it. */
function radiusAt(stations: readonly (readonly [number, number])[], t: number): number {
  for (let i = 1; i < stations.length; i++) {
    if (t <= stations[i][0]) {
      const [t0, r0] = stations[i - 1];
      const [t1, r1] = stations[i];
      return r0 + ((r1 - r0) * (t - t0)) / (t1 - t0);
    }
  }
  return stations[stations.length - 1][1];
}

// --- the builder ------------------------------------------------------------------

export const figure: BuilderWith<LifeOptions> = {
  name: 'figure',
  category: 'people',
  radius: 0.5,
  solid: false,

  build({ seed = 1, scale = 1, roam, folk = 'country', face = folk === 'city' ? 'greathelm' : 'round' }: LifeOptions = {}) {
    const rng = createRng(seed);
    const city = folk === 'city';
    const parts: Part[] = [];
    const bones: BoneSpec[] = [];
    // Names for the debug picker: everything pushed since the last mark, unless it named itself.
    let marked = 0;
    const mark = (name: string): void => {
      for (; marked < parts.length; marked++) parts[marked].name ??= name;
    };

    // --- proportions ------------------------------------------------------
    //
    // Height first, and everything fitted into it. The head is big — a shell
    // about twice as tall as it is wide — and under it the legs take more
    // than half, as they do on anything that walks upright.
    const height = rng.range(1.28, 1.68);
    const headR = rng.range(0.135, 0.172);
    const rest = height - headR * 2.6;
    const legLength = rest * rng.range(0.53, 0.58);
    const T = rest - legLength;
    const bottom = legLength;
    const top = bottom + T;

    const frame = drawFrame(rng, T, bottom);
    // The shoulder pivot hangs just inside the acromion, so the deltoid ball
    // is seated under the shoulder cap with the cap's tip reaching over it;
    // where the upper arm needs more room to clear the ribs and a coat over
    // them, the shoulders broaden to give it.
    const armR = T * 0.068;
    const out = T * 0.1;
    const ribsNeed = T * 0.25 * frame.chest + 0.024 + armR * 1.04 - out * 0.25;
    const jointX = Math.max(ribsNeed, T * 0.3 * frame.breadth - T * 0.02);
    frame.breadth = (jointX + T * 0.02) / (T * 0.3);
    const trunk = makeTrunk(frame);
    const hide = rng.pick(HIDES);
    // The city's base garment is drawn first: the hose under it follow its cut.
    const garment = city ? pickWeighted(rng, CITY_GARMENTS) : undefined;
    const dressed = garment ? outfitCity(rng, hide, garment.hose) : undefined;
    const { cloth, lower, accent } = dressed ?? outfit(rng, hide);
    const leather = dressed ? dressed.house.leather : rng.pick(LEATHERS);
    const metal = dressed ? dressed.metal : rng.pick(METALS);
    const trim = dressed ? dressed.contrast : accent;
    const fur = dressed ? dressed.house.fur : shade(leather, 1.25);
    const house = dressed ? { dark: dressed.house.dark, mid: dressed.house.mid, pale: dressed.house.pale, contrast: dressed.contrast, metal, fur } : undefined;
    const dominant: 1 | -1 = rng.chance(0.5) ? 1 : -1;
    const waistY = trunk.yOf(U_WAIST);

    bones.push({ name: 'root', at: [0, 0, 0] });
    bones.push({ name: 'hips', parent: 'root', at: [0, bottom, 0] });
    bones.push({ name: 'torso', parent: 'hips', at: [0, waistY, trunk.extent(U_WAIST).cz] });
    bones.push({ name: 'chest', parent: 'torso', at: [0, trunk.yOf(U_CHEST), trunk.extent(U_CHEST).cz] });
    // The clavicles pivot beside the sternum and carry the arms.
    for (const side of [1, -1] as const) {
      bones.push({ name: side > 0 ? 'clavL' : 'clavR', parent: 'chest', at: [side * T * 0.06, trunk.yOf(0.97), trunk.extent(0.97).cz] });
    }

    // --- the head ---------------------------------------------------------
    const neckLength = headR * 0.5;
    bones.push({ name: 'neck', parent: 'chest', at: [0, top + 0.005, 0] });
    bones.push({ name: 'head', parent: 'neck', at: [0, top + 0.005 + neckLength, 0] });
    const built = buildHead(
      face as AnyHeadKind,
      {
        rng,
        base: top + 0.005 + neckLength,
        neck: neckLength,
        size: headR,
        cloth,
        accent,
        leather,
        metal,
        side: dominant,
        house,
      },
      parts,
      bones,
    );
    mark('mask ornament');

    // --- arms -------------------------------------------------------------
    //
    // Human in proportion: the upper arm half the trunk from the acromion, the
    // forearm two fifths, so the wrist hangs about the crotch. The deltoid on
    // the upper arm is the shoulder, centred on the pivot so it cannot swing
    // off it, hung under the acromion with its top just under the shoulder
    // cap, whose thin tip reaches over it. Hung a few degrees
    // out from the side, elbows a touch forward — a stance, not a plumb line.
    const deltoidR = armR * 1.25;
    const upperLen = T * 0.49;
    const foreLen = T * 0.4;
    // The city is always sleeved, sometimes in the second cloth below the elbow, and often gloved.
    const sleeveEnd = city ? rng.range(0.6, 0.95) : rng.range(0.35, 0.9);
    const armWraps = city ? false : rng.chance(0.25);
    const foreCloth = city && rng.chance(0.35) ? accent : cloth;
    const glove = city && rng.chance(0.45) ? rng.pick([IVORY, leather, trim]) : undefined;
    const deltoids: Ball[] = [];
    for (const side of [1, -1] as const) {
      const tag = side > 0 ? 'armL' : 'armR';
      const a = trunk.acromion;
      const joint = new THREE.Vector3(side * jointX, a.y - T * 0.09, a.z);
      const elbow = new THREE.Vector3(joint.x + side * out, joint.y - Math.sqrt(upperLen * upperLen - out * out), joint.z + T * 0.01);
      const wrist = elbow.clone().add(new THREE.Vector3(side * T * 0.015, -Math.cos(0.22) * foreLen, Math.sin(0.22) * foreLen));
      deltoids.push({ x: joint.x, y: joint.y, z: joint.z, r: deltoidR });

      // The deltoid is a ball on the pivot, its top just under the shoulder cap.
      const upper: [number, number][] = [
        ...head(deltoidR, upperLen),
        [0.12, armR * 1.2],
        [0.3, armR * 1.04],
        [0.7, armR * 0.94],
        [1, armR * 0.78],
      ];
      parts.push({ geometry: limb(joint, elbow, upper), color: cloth, bone: `${tag}u`, name: `${tag} upper + deltoid` });
      const fore: [number, number][] = [
        ...head(armR * 1.02, foreLen),
        [0.16, armR * 0.94],
        [0.45, armR * 0.84],
        [0.78, armR * 0.66],
        [1, armR * 0.56],
      ];
      const bare = sleeveEnd < 0.5;
      parts.push({ geometry: limb(elbow, wrist, fore, 0.88), color: bare ? hide : foreCloth, bone: `${tag}l`, name: `${tag} forearm` });
      // The hand: a mitt with a thumb, sunk onto the wrist.
      const hand = wrist.clone().add(new THREE.Vector3(0, -armR * 0.55, armR * 0.15));
      const mitt = new THREE.IcosahedronGeometry(armR * 1.05, 1);
      mitt.scale(0.85, 1.3, 1.0);
      mitt.translate(hand.x, hand.y, hand.z);
      const handColor = glove ?? shade(hide, 0.92);
      parts.push({ geometry: mitt, color: handColor, bone: `${tag}l`, name: `${tag} hand` });
      const thumb = new THREE.IcosahedronGeometry(armR * 0.45, 1);
      thumb.scale(0.8, 1, 0.8);
      thumb.translate(hand.x - side * armR * 0.8, hand.y + armR * 0.4, hand.z + armR * 0.35);
      parts.push({ geometry: thumb, color: handColor, bone: `${tag}l`, name: `${tag} thumb` });
      if (glove !== undefined) {
        // The glove's gauntlet cuff, up over the wrist.
        const r = radiusAt(fore, 0.9) + 0.004;
        parts.push({ geometry: limb(elbow, wrist, [[0.84, r * 1.12], [1.02, r * 0.98]], 0.88), color: shade(glove, 0.88), bone: `${tag}l` });
      }
      if (!bare) {
        // A cuff where the sleeve ends on the forearm.
        const cuffAt = elbow.clone().lerp(wrist, 0.1);
        const cuff = new THREE.CylinderGeometry(armR * 1.02, armR * 1.06, armR * 0.7, LIMB_SIDES);
        cuff.translate(cuffAt.x, cuffAt.y, cuffAt.z);
        parts.push({ geometry: cuff, color: trim, bone: `${tag}l` });
      }
      if (armWraps) {
        // Wraps wound up the forearm: bands standing a little off it.
        for (let i = 0; i < 4; i++) {
          const t = 0.34 + i * 0.15;
          const r = radiusAt(fore, t) + 0.004;
          parts.push({
            geometry: limb(elbow, wrist, [[t - 0.05, r], [t + 0.05, r * 0.98]], 0.88),
            color: shade(accent, i % 2 ? 0.9 : 1),
            bone: `${tag}l`,
          });
        }
      }

      bones.push({ name: `${tag}u`, parent: side > 0 ? 'clavL' : 'clavR', at: joint.toArray() as [number, number, number] });
      bones.push({ name: `${tag}l`, parent: `${tag}u`, at: elbow.toArray() as [number, number, number] });
    }

    mark('arms');

    // --- legs -------------------------------------------------------------
    //
    // Hip joints just above the crotch, the thigh's head sat inside the
    // pelvis, and the pair of them filling the seat's width — a body wider at
    // the bottom than its own legs is a skirt.
    const legR = T * 0.095;
    const seatW = trunk.extent(0.06).w;
    const stance = seatW - legR * 1.28 * 1.02;
    const hipY = bottom + T * 0.06;
    const hipZ = trunk.extent(0.06).cz;
    // The city wears hose, gartered under the knee or not, in pointed shoes or in boots.
    const lowerStyle = city
      ? pickWeighted(rng, [
          { weight: 0.6, kind: 'hose' as const },
          { weight: 0.4, kind: 'garters' as const },
        ]).kind
      : pickWeighted(rng, [
          { weight: 0.5, kind: 'trousers' as const },
          { weight: 0.28, kind: 'wraps' as const },
          { weight: 0.22, kind: 'breeches' as const },
        ]).kind;
    const shoes = city && rng.chance(0.6);
    for (const side of [1, -1] as const) {
      const tag = side > 0 ? 'legL' : 'legR';
      const joint = new THREE.Vector3(side * stance, hipY, hipZ);
      const ankle = new THREE.Vector3(side * stance * 1.05, legR * 1.15, 0);
      const knee = new THREE.Vector3(side * stance * 1.02, ankle.y + (hipY - ankle.y) * 0.5, 0.008);
      const cuffR = legR * 0.72;
      const ankleTop = new THREE.Vector3(ankle.x, ankle.y + legR * 0.6, ankle.z);

      // A hip head inside the pelvis, a taper to the knee; a knee head on the
      // shin, a calf, and a narrow ankle the boot swallows.
      const thighLen = joint.distanceTo(knee);
      parts.push({
        geometry: limb(joint, knee, [
          ...head(legR * 1.22, thighLen),
          [0.1, legR * 1.16],
          [0.35, legR * 1.02],
          [0.75, legR * 0.92],
          [1, legR * 0.8],
        ]),
        color: lower,
        bone: `${tag}u`,
      });
      const shin: [number, number][] = [
        ...head(legR * 1.1, knee.distanceTo(ankleTop)),
        [0.14, legR * 1.0],
        [0.36, legR * 1.06],
        [0.72, legR * 0.8],
        [1, cuffR],
      ];
      // Open at the bottom: the boot's collar carries on from this exact ring.
      parts.push({
        geometry: limb(knee, ankleTop, shin, 0.94, { start: true, end: false }),
        color: lowerStyle === 'breeches' ? accent : lower,
        bone: `${tag}l`,
      });
      if (lowerStyle === 'garters') {
        // A garter tied under the knee, its ends hanging.
        const r = radiusAt(shin, 0.16) + 0.004;
        parts.push({ geometry: limb(knee, ankleTop, [[0.11, r], [0.2, r * 0.98]], 0.94), color: trim, bone: `${tag}l` });
        const tail = new THREE.BoxGeometry(legR * 0.16, legR * 0.5, legR * 0.05);
        const kneeOut = knee.clone().lerp(ankleTop, 0.16).add(new THREE.Vector3(side * r * 0.9, -legR * 0.28, r * 0.3));
        tail.translate(kneeOut.x, kneeOut.y, kneeOut.z);
        parts.push({ geometry: tail, color: shade(trim, 0.9), bone: `${tag}l` });
      } else if (lowerStyle === 'breeches') {
        // The breeches' cuff, gathered under the knee.
        parts.push({ geometry: limb(knee, ankleTop, [[0.04, legR * 1.1], [0.2, legR * 1.06]], 0.94), color: lower, bone: `${tag}l` });
      } else if (lowerStyle === 'wraps') {
        for (let i = 0; i < 4; i++) {
          const t = 0.2 + i * 0.18;
          const r = radiusAt(shin, t) + 0.005;
          parts.push({
            geometry: limb(knee, ankleTop, [[t - 0.06, r], [t + 0.06, r * 0.98]], 0.94),
            color: shade(accent, i % 2 ? 0.88 : 1),
            bone: `${tag}l`,
          });
        }
      }
      parts.push(...boot(ankle, ankleTop, cuffR, legR, leather, `${tag}l`, `${tag}f`, shoes ? lower : undefined));
      // Off the hips, so the pelvis carries the legs and the feet are solved
      // back to the ground from wherever it goes.
      bones.push({ name: `${tag}u`, parent: 'hips', at: joint.toArray() as [number, number, number] });
      bones.push({ name: `${tag}l`, parent: `${tag}u`, at: knee.toArray() as [number, number, number] });
      bones.push({ name: `${tag}f`, parent: `${tag}l`, at: ankle.toArray() as [number, number, number] });
    }
    const legJoint = new THREE.Vector3(stance, hipY, hipZ);
    const legAnkle = new THREE.Vector3(stance * 1.05, legR * 1.15, 0);
    const legKnee = new THREE.Vector3(stance * 1.02, legAnkle.y + (hipY - legAnkle.y) * 0.5, 0.008);

    mark('legs');

    // --- the outfit -------------------------------------------------------
    const body: Body = {
      trunk,
      hide,
      cloth,
      lower,
      accent,
      leather,
      metal,
      side: dominant,
      deltoids,
      layer: 0,
      neck: 0,
      hemU: garment ? garment.hem(rng) : rng.range(0.24, 0.36),
      trim,
      fur,
    };
    if (garment) {
      dressCity(body, parts, garment);
      mark('base garment');
      const over = pickWeighted(rng, CITY_OVERLAYERS);
      body.layer = over.proud ?? 0;
      parts.push(...over.build(rng, body));
      mark(`overlayer #${CITY_OVERLAYERS.indexOf(over)}`);
      const waist = pickWeighted(rng, CITY_WAISTS);
      parts.push(...waist.build(rng, body));
      mark(`waist #${CITY_WAISTS.indexOf(waist)}`);
      // Over a bulky coat (the surcoat or the cote) no cloak goes on top: one coat at a time.
      const shoulderTable = body.layer >= 0.018 ? CITY_SHOULDERS.filter((s) => s !== CITY_SHOULDERS[1]) : CITY_SHOULDERS;
      const shoulder = pickWeighted(rng, shoulderTable);
      parts.push(...shoulder.build(rng, body));
      mark(`shoulders #${CITY_SHOULDERS.indexOf(shoulder)}`);
      wearCityExtras(rng, body, parts);
      mark('extras');
    } else {
      dressBase(rng, body, parts);
      mark('base garment');
      const over = pickWeighted(rng, OVERLAYERS);
      body.layer = over.proud ?? 0;
      parts.push(...over.build(rng, body));
      mark(`overlayer #${OVERLAYERS.indexOf(over)}`);
      const waist = pickWeighted(rng, WAISTS);
      parts.push(...waist.build(rng, body));
      mark(`waist #${WAISTS.indexOf(waist)}`);
      const shoulder = pickWeighted(rng, SHOULDERS);
      parts.push(...shoulder.build(rng, body));
      mark(`shoulders #${SHOULDERS.indexOf(shoulder)}`);
      wearExtras(rng, body, parts);
      mark('extras');
    }

    const mesh = finishRigged(parts, { bones }, 'figure', 0, scale);
    const life: LifeSpec = {
      kind: 'biped',
      seed,
      legLength: legLength * scale,
      bodyLength: trunk.extent(0.06).w * 2 * scale,
      height: built.crown * scale,
      headHeight: built.faceY * scale,
      radius: (trunk.acromion.x + 0.1) * scale,
      walkSpeed: 0.7 * scale,
      roam: roam ?? 6,
      call: 'voice',
      tone: 0.72 / T,
      grazes: false,
      grazeDrop: 0,
      handed: dominant,
      face,
      legs: {
        thigh: legJoint.distanceTo(legKnee) * scale,
        shin: legKnee.distanceTo(legAnkle) * scale,
        ankle: legAnkle.y * scale,
      },
    };
    mesh.userData.life = life;
    return mesh;
  },
};

/**
 * A boot: a collar carrying straight on from the trouser leg, and a foot.
 * The collar starts on the *same ring* the shin ended on, with neither piece
 * capped there, so the two are one surface with a colour change at a ring.
 * The foot's rear rings stay inside the collar and it emerges forward only.
 * The collar rides the shin; the foot rides the ankle bone.
 */
function boot(
  ankle: THREE.Vector3,
  ankleTop: THREE.Vector3,
  cuffR: number,
  legR: number,
  color: number,
  shinBone: string,
  footBone: string,
  hose?: number,
): Part[] {
  // With `hose` given this is a shoe: the collar is the hose down to the
  // ankle, and the foot is low and long, drawn to a point.
  const shoe = hose !== undefined;
  const w = legR * 1.3;
  const h = legR * (shoe ? 1.2 : 1.5);
  const length = legR * (shoe ? 4.4 : 3.7);
  const back = ankle.z - legR * 1.2;

  const collar = limb(
    ankleTop,
    new THREE.Vector3(ankle.x, ankle.y - legR * 0.5, ankle.z),
    shoe
      ? [
          [0, cuffR],
          [0.5, legR * 0.78],
          [1, legR * 0.78],
        ]
      : [
          [0, cuffR],
          [0.3, legR * 1.14],
          [0.6, legR * 1.1],
          [1, legR * 1.0],
        ],
    0.94,
    { start: false, end: true },
  );

  const foot = loft(
    shoe
      ? [
          { at: [ankle.x, h * 0.5, back], rx: w * 0.62, ry: h * 0.5 },
          { at: [ankle.x, h * 0.5, back + length * 0.3], rx: w * 0.94, ry: h * 0.5 },
          { at: [ankle.x, h * 0.42, back + length * 0.56], rx: w * 0.9, ry: h * 0.42 },
          { at: [ankle.x, h * 0.3, back + length * 0.78], rx: w * 0.6, ry: h * 0.3 },
          { at: [ankle.x, h * 0.2, back + length * 0.92], rx: w * 0.3, ry: h * 0.18 },
          { at: [ankle.x, h * 0.16, back + length], rx: w * 0.1, ry: h * 0.1 },
        ]
      : [
          { at: [ankle.x, h * 0.5, back], rx: w * 0.66, ry: h * 0.5 },
          { at: [ankle.x, h * 0.5, back + length * 0.34], rx: w, ry: h * 0.5 },
          { at: [ankle.x, h * 0.45, back + length * 0.66], rx: w * 0.96, ry: h * 0.45 },
          { at: [ankle.x, h * 0.36, back + length * 0.88], rx: w * 0.78, ry: h * 0.36 },
          { at: [ankle.x, h * 0.3, back + length], rx: w * 0.44, ry: h * 0.28 },
        ],
    LIMB_SIDES + 1,
  );

  const strap = new THREE.BoxGeometry(w * (shoe ? 1.9 : 2.06), legR * (shoe ? 0.2 : 0.26), legR * 0.42);
  strap.translate(ankle.x, h * (shoe ? 0.7 : 0.6), back + length * (shoe ? 0.3 : 0.36));

  return [
    { geometry: collar, color: hose ?? color, bone: shinBone },
    { geometry: foot, color, bone: footBone },
    { geometry: strap, color: shoe ? shade(color, 1.3) : shade(color, 0.75), bone: footBone },
  ];
}
