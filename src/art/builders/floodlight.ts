import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * A halogen floodlight on a bracket, with a visible beam.
 *
 * The fourth light in the kit, and the only one that is *aimed*. A candle and a
 * lantern mark a place; a street lamp fills the space under itself; this one
 * throws a hard cone at something, and everything about it follows from that.
 *
 * ## A cone, and this time it is right
 *
 * The street lamp used to be a `SpotLight` and it was wrong — a cone aimed at
 * the pavement is a modern shielded reflector, and a mediaeval lantern is a box
 * with openings on all four sides that spills light sideways as readily as
 * down. That argument is recorded in `streetlamp.ts` and it is worth restating
 * here, because this fixture is the exact case it was excluding: a floodlight
 * *is* a reflector housing, its whole purpose is to send light one way, and a
 * point light in it would throw the beam out of the back of the wall it is
 * bolted to.
 *
 * So: a `SpotLight` for what it does, and additive cone geometry for the shaft
 * you can see. The shaft's colour ramps to black along its length, and
 * `GLOW_MATERIAL` is additive — black adds nothing — so the fade needs no alpha
 * channel and creates no sorting problem with anything it passes through.
 *
 * Built aiming toward **+Z and downward**, standing on y = 0 on its own short
 * mast, so it works on a gallery floor and on a wall bracket alike.
 *
 * **No random facing.** Every other prop in the kit may spin on its own seed
 * because nothing depends on which way it ended up. This one is *aimed*: the
 * whole point of it is what the beam lands on, and a fixture that chooses its
 * own bearing cannot be pointed at anything. The caller's `rotation.y` is the
 * only thing that decides where it looks.
 */

/**
 * Intensity, in candela.
 *
 * Physical decay here, unlike the candle and the lantern: those had to abandon
 * inverse-square because at hand distance it blows out to a flat white blob,
 * and nothing gets its eye within a hand's width of a floodlight. Far enough
 * away for d² to behave, and the hard falloff is part of what makes it read as
 * a modern fitting rather than as a flame.
 */
const LIGHT_INTENSITY = 60;
const LIGHT_RANGE = 22;
/** Cool, and slightly green. Halogen is not firelight and should not look it. */
const LIGHT_COLOR = 0xf2f4e6;

export const floodlight: MeshBuilder = {
  name: 'floodlight',
  category: 'structures',
  radius: 0.6,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    const mast = rng.range(1.9, 2.7);
    const housingW = rng.range(0.3, 0.42);
    const housingH = housingW * rng.range(0.58, 0.72);
    const housingD = housingW * rng.range(0.34, 0.46);
    // Downward tilt. Shallow — a floodlight aimed steeply at its own feet lights
    // a disc of floor and nothing else, which is a lamp post, not a flood.
    const tilt = rng.range(0.32, 0.6);

    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    const shell = shade(0x7c8288, rng.range(0.9, 1.1));

    // --- mast and bracket ----------------------------------------------------
    const mastR = rng.range(0.035, 0.05);
    const pole = new THREE.CylinderGeometry(mastR, mastR * 1.1, mast, 6);
    pole.translate(0, mast / 2, 0);
    parts.push({ geometry: pole, color: iron, sway: 0 });

    const foot = new THREE.CylinderGeometry(mastR * 3.2, mastR * 3.6, mastR * 1.1, 8);
    foot.translate(0, mastR * 0.55, 0);
    parts.push({ geometry: foot, color: shade(iron, 0.85), sway: 0 });

    // The knuckle the housing pivots on. Visible, because a fixture that can be
    // aimed has to have somewhere it is aimed *from*, and without it the
    // housing appears welded on at a strange angle.
    const knuckle = new THREE.CylinderGeometry(mastR * 1.5, mastR * 1.5, mastR * 2.6, 6);
    knuckle.rotateZ(Math.PI / 2);
    knuckle.translate(0, mast, 0);
    parts.push({ geometry: knuckle, color: shade(iron, 1.1), sway: 0 });

    // --- the housing ---------------------------------------------------------
    //
    // Built about the origin, tilted, then carried up to the knuckle — so the
    // tilt is about the pivot and not about the middle of the mast.
    const aim = (geometry: THREE.BufferGeometry): void => {
      geometry.rotateX(tilt);
      geometry.translate(0, mast, housingD * 0.6);
    };

    const body = new THREE.BoxGeometry(housingW, housingH, housingD);
    aim(body);
    parts.push({ geometry: body, color: shell, sway: 0 });

    // A hood over the front, and a deeper back — the two things that make the
    // silhouette read as a reflector rather than as a box.
    const hood = new THREE.BoxGeometry(housingW * 1.12, housingH * 0.16, housingD * 1.5);
    hood.translate(0, housingH * 0.56, housingD * 0.22);
    aim(hood);
    parts.push({ geometry: hood, color: shade(shell, 1.14), sway: 0 });

    const back = new THREE.BoxGeometry(housingW * 0.72, housingH * 0.62, housingD * 0.5);
    back.translate(0, 0, -housingD * 0.68);
    aim(back);
    parts.push({ geometry: back, color: shade(shell, 0.84), sway: 0 });

    // The lens: a flat panel across the front, painted the light's own colour
    // so it reads as lit rather than as glass. Additive glow behind it does the
    // brightness; this is what it is stuck to.
    const lens = new THREE.BoxGeometry(housingW * 0.86, housingH * 0.7, housingD * 0.12);
    lens.translate(0, 0, housingD * 0.52);
    aim(lens);
    parts.push({ geometry: lens, color: LIGHT_COLOR, sway: 0 });

    // --- the beam ------------------------------------------------------------
    const throwLength = rng.range(5.5, 8);
    const spread = rng.range(0.22, 0.34);
    const mouth = housingW * 0.42;

    // A cone opening away from the lens. `ConeGeometry` builds point-up, so it
    // is turned to point along the aim and its wide end is the far one.
    const shaft = new THREE.ConeGeometry(mouth + Math.tan(spread) * throwLength, throwLength, 10, 1, true);
    shaft.rotateX(-Math.PI / 2);
    shaft.translate(0, 0, housingD * 0.55 + throwLength / 2);
    aim(shaft);
    glow.push({
      geometry: shaft,
      // Faded along the beam. Bright at the lens, nothing at the far end —
      // which is the only way a visible shaft reads as air lit by a lamp
      // instead of as a solid cone of plastic.
      //
      // Measured from the fixture in world space after the aim, so the ramp
      // follows the beam whatever angle it was tilted to.
      color: (x, y, z) => {
        const along = Math.hypot(x, y - mast, z) / throwLength;
        return dim(LIGHT_COLOR, 0.3 * Math.max(0, 1 - along) ** 1.6);
      },
      sway: 0,
    });

    // A bright disc at the lens itself, so the source is hotter than the shaft
    // leaving it — otherwise the brightest point of a beam is somewhere out in
    // the middle of the air.
    const core = new THREE.OctahedronGeometry(mouth * 0.9, 0);
    core.scale(1, 0.8, 0.5);
    core.translate(0, 0, housingD * 0.56);
    aim(core);
    glow.push({ geometry: core, color: LIGHT_COLOR, sway: 0 });

    // --- assembly ------------------------------------------------------------
    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
    }

    const mesh = finish(geometry, 'floodlight', 0, 'metal-solid');
    mesh.add(finishGlow(glowGeometry, 'floodlight:glow'));

    const light = new THREE.SpotLight(
      LIGHT_COLOR,
      LIGHT_INTENSITY * rng.around(1, 0.1) * scale * scale,
      LIGHT_RANGE * scale,
      spread * 1.15,
      // Soft edge. A hard-edged spot under a pipeline that quantizes to a few
      // levels gives a stair-stepped ellipse on the floor, which is far more
      // conspicuous than the beam it is meant to be drawing.
      0.55,
      2,
    );
    light.position.set(0, mast * scale, 0);
    // A spot aims at its target rather than by rotation, and the target has to
    // be in the graph to be updated — parenting it to the mesh means the whole
    // fixture can be moved and turned as one object.
    const target = new THREE.Object3D();
    target.position.set(
      0,
      (mast - Math.sin(tilt) * throwLength) * scale,
      Math.cos(tilt) * throwLength * scale,
    );
    mesh.add(target);
    light.target = target;
    light.castShadow = false;
    mesh.add(light);

    return mesh;
  },
};

/** Scales a packed hex toward black. Additive, so this is an amount of light. */
function dim(hex: number, factor: number): number {
  const r = Math.round(((hex >> 16) & 0xff) * factor);
  const g = Math.round(((hex >> 8) & 0xff) * factor);
  const b = Math.round((hex & 0xff) * factor);
  return (r << 16) | (g << 8) | b;
}
