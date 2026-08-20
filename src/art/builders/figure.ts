import * as THREE from 'three';
import type { BuilderWith } from '../types';
import type { Part } from '../assemble';
import { loft } from '../loft';
import { finishRigged, type BoneSpec } from '../rig';
import { createRng } from '../random';
import { shade } from '../palette';
import type { LifeOptions, LifeSpec } from '../../life/spec';
import { buildHead, type AnyHeadKind } from './figure-head';
import { U_CHEST, U_WAIST, drawFrame, makeTrunk, trunkSurface, type Body } from './figure-trunk';
import { pickWeighted, type BoneBall } from './figure-surface';
import { LayerStack, dress } from './figure-layers';
import { COAT_PROUD, PEOPLE } from './figure-people';

/**
 * A villager, or a cityfolk. Friendly, bipedal, and not a person. `folk` picks
 * a `People` entry (`figure-people.ts`): the same body in the countryside's
 * dress and carved masks, or the city's finery and helms.
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

  build({ seed = 1, scale = 1, roam, folk = 'country', face }: LifeOptions = {}) {
    const rng = createRng(seed);
    const people = PEOPLE[folk];
    const kind = (face ?? people.heads.default) as AnyHeadKind;
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
    const phy = people.physique;
    const height = rng.range(...phy.height);
    const headR = rng.range(...phy.headR);
    const rest = height - headR * 2.6;
    const legLength = rest * rng.range(...phy.legFraction);
    const T = rest - legLength;
    const bottom = legLength;
    const top = bottom + T;

    const frame = drawFrame(rng, T, bottom, phy.frame);
    // The shoulder pivot hangs just inside the acromion, so the deltoid ball
    // is seated under the shoulder cap with the cap's tip reaching over it;
    // where the upper arm needs more room to clear the ribs and a coat over
    // them, the shoulders broaden to give it.
    const armR = T * phy.armR;
    const out = T * 0.1;
    const ribsNeed = T * 0.25 * frame.chest + COAT_PROUD + armR * 1.04 - out * 0.25;
    const jointX = Math.max(ribsNeed, T * 0.3 * frame.breadth - T * 0.02);
    frame.breadth = (jointX + T * 0.02) / (T * 0.3);
    const trunk = makeTrunk(frame);
    const hide = rng.pick(people.hides);
    const o = people.outfit(rng, hide);
    const { cloth, lower, accent, trim, leather, metal, fur } = o;
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
      kind,
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
        house: o.house,
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
    const upperLen = T * phy.upperArm;
    const foreLen = T * phy.forearm;
    const { sleeveEnd, armWraps, foreCloth, glove } = people.sleeves(rng, o);
    const deltoids: BoneBall[] = [];
    for (const side of [1, -1] as const) {
      const tag = side > 0 ? 'armL' : 'armR';
      const a = trunk.acromion;
      const joint = new THREE.Vector3(side * jointX, a.y - T * 0.09, a.z);
      const elbow = new THREE.Vector3(joint.x + side * out, joint.y - Math.sqrt(upperLen * upperLen - out * out), joint.z + T * 0.01);
      const wrist = elbow.clone().add(new THREE.Vector3(side * T * 0.015, -Math.cos(0.22) * foreLen, Math.sin(0.22) * foreLen));
      deltoids.push({ x: joint.x, y: joint.y, z: joint.z, r: deltoidR, bone: `${tag}u` });

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
    const legR = T * phy.legR;
    const seatW = trunk.extent(0.06).w;
    const stance = seatW - legR * 1.28 * 1.02;
    const hipY = bottom + T * 0.06;
    const hipZ = trunk.extent(0.06).cz;
    const lowerStyle = pickWeighted(rng, people.lowerStyles).kind;
    const shoes = people.shoes(rng);
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
      surface: trunkSurface(trunk, deltoids),
      layers: new LayerStack(),
      cloth,
      lower,
      accent,
      leather,
      metal,
      side: dominant,
      hemU: o.hem(rng),
      trim,
      fur,
    };
    dress(rng, body, parts, o.base, people.catalogs, mark);

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
      face: kind,
      gestures: phy.gestures,
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
