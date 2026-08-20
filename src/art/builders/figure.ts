import * as THREE from 'three';
import type { BuilderWith } from '../types';
import type { Part } from '../assemble';
import { finishRigged, type BoneSpec } from '../rig';
import { createRng } from '../random';
import { shade } from '../palette';
import type { LifeOptions, LifeSpec } from '../../life/spec';
import { ARM_HANG_INWARD } from '../../life/envelope';
import { buildHead, type AnyHeadKind } from './figure-head';
import { U_CHEST, U_WAIST, drawFrame, makeTrunk, trunkSurface, type Body } from './figure-trunk';
import { pickWeighted, type BoneBall } from './figure-surface';
import { LayerStack, dress } from './figure-layers';
import { boot, head, limb, makeLimb } from './figure-limbs';
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
    // The rest gap is the smallest animation ever makes it: no layer turns a
    // hanging arm inward (`ARM_HANG_INWARD`), so clearing the ribs and the
    // proudest coat at rest clears them always.
    const ribsNeed =
      T * 0.25 * frame.chest + COAT_PROUD + armR * 1.04 - out * 0.25 + Math.sin(ARM_HANG_INWARD) * T * phy.upperArm;
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
    const sleeves = people.sleeves(rng, o);
    const { sleeveEnd, foreCloth, glove } = sleeves;
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
      parts.push(...people.limbs.arm(makeLimb(elbow, wrist, fore, 0.88, `${tag}l`, side, armR), sleeves, o));

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
      parts.push(...(people.limbs.leg[lowerStyle]?.(makeLimb(knee, ankleTop, shin, 0.94, `${tag}l`, side, legR), o) ?? []));
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
