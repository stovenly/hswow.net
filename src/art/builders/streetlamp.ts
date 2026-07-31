import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { finishGlow } from '../glow';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';

/**
 * An iron street lamp: a footed mast, a bracket, and a lantern hanging off it.
 *
 * **The first builder that returns something other than geometry.** Everything
 * else in the kit merges down to one mesh with one shared material; this one
 * hangs two more objects off that mesh, because the two things a lamp is for
 * are neither of them geometry:
 *
 * - a `PointLight` at the flame, which is the light that lands on the ground
 *   and on whatever walks past, and
 * - the flame itself, drawn with the additive `GLOW_MATERIAL`, which is the
 *   light you can *see*.
 *
 * Both are children of the returned mesh, so a lamp is still one object to
 * place, rotate and throw away.
 *
 * **It was a spot light, and it should not have been.** A cone aimed at the
 * pavement is a modern shielded street light — a reflector housing that throws
 * everything downward. This lantern is a box with a lid on it and openings on
 * all four sides, so the light leaves it sideways as readily as down, and a
 * beam falling out of the underside gave the game away immediately. A point
 * light is both simpler and the honest description of the shape.
 *
 * Built with the lantern hanging toward **+X** before its random facing is
 * applied, and standing on y = 0.
 */

/**
 * Intensity at the flame, in candela.
 *
 * Three has been physically-based since r155, so this is not a 0..1 dial: with
 * `decay` 2 the irradiance at distance d is intensity/d². The lantern sits
 * about 2.6 m up, so this lands a little over 3 at the player's feet — roughly
 * the exterior sun's 2.2, which is what it takes to read as a lamp in daylight.
 * Under a night sky it will be far too much; that is a number to move once
 * there is a night sky to judge it against.
 */
const LIGHT_INTENSITY = 22;
/** Hard cutoff. Past this the lamp contributes nothing and costs nothing. */
const LIGHT_RANGE = 12;
const LIGHT_COLOR = 0xffd9a0;

/** Corner-to-corner over face-to-face for a square. See the hood, below. */
const S2 = Math.SQRT2;

export const streetlamp: MeshBuilder = {
  name: 'streetlamp',
  category: 'structures',
  radius: 0.9,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];
    const glow: Part[] = [];

    const height = rng.range(2.9, 3.6);
    /** Half-thickness of the mast at its foot. */
    const mast = rng.range(0.046, 0.062);
    /** How far the bracket carries the lantern out from the mast. */
    const reach = rng.range(0.34, 0.5);
    const iron = rng.chance(0.35) ? PALETTE.RUST : PALETTE.IRON;
    const stone = rng.chance(0.5) ? PALETTE.STONE : PALETTE.STONE_DARK;

    // Parts overlap each other by a centimetre or two throughout, never abut
    // exactly. Two boxes sharing a face put four triangles on every edge of it,
    // and the art check counts an edge as sound only when exactly two meet —
    // so a perfectly flush joint reads to it as a hole.

    // --- footing -------------------------------------------------------------
    // A lamp needs to be set in something. Standing a mast straight in the mud
    // reads as a stake; a plinth reads as street furniture, which is the whole
    // difference between this and `post`.
    const plinthW = mast * 6.2;
    const plinth = new THREE.BoxGeometry(plinthW, 0.15, plinthW);
    plinth.translate(0, 0.075, 0);
    parts.push({ geometry: plinth, color: shade(stone, rng.around(1, 0.06)), sway: 0 });

    const collar = new THREE.BoxGeometry(mast * 4.2, 0.12, mast * 4.2);
    collar.translate(0, 0.2, 0);
    parts.push({ geometry: collar, color: shade(iron, 1.05), sway: 0 });

    // --- mast ----------------------------------------------------------------
    // Stacked and tapering rather than one long box. The joints are what give
    // the flat shading something to catch on a shape that is otherwise four
    // unbroken faces three metres tall.
    const foot = 0.24;
    const segments = rng.int(3, 4);
    const segH = (height - foot) / segments;
    for (let i = 0; i < segments; i++) {
      const taper = 1 - 0.28 * (i / segments);
      const width = mast * 2 * taper;
      const box = new THREE.BoxGeometry(width, segH * 1.06, width);
      box.translate(0, foot + segH * (i + 0.5), 0);
      parts.push({ geometry: box, color: shade(iron, rng.around(1, 0.07)), sway: 0 });
    }
    const topW = mast * 2 * (1 - (0.28 * (segments - 1)) / segments);

    // --- bracket -------------------------------------------------------------
    const armW = topW * 0.78;
    const armY = height - armW * 0.62;
    const arm = new THREE.BoxGeometry(reach + armW, armW, armW);
    arm.translate(reach / 2, armY, 0);
    parts.push({ geometry: arm, color: shade(iron, 0.94), sway: 0 });

    // A strut from the mast up to the arm. Without it the lantern hangs off a
    // cantilever with nothing carrying its weight, and the eye notices — an
    // arm that could not hold what is on the end of it looks wrong long before
    // anyone works out why.
    const ax = mast * 0.5;
    const ay = armY - rng.range(0.36, 0.5);
    const bx = reach * 0.72;
    const by = armY - armW * 0.5;
    const dx = bx - ax;
    const dy = by - ay;
    const strutLength = Math.hypot(dx, dy) * 1.18;
    const strut = new THREE.BoxGeometry(mast * 1.05, strutLength, mast * 1.05);
    // Built along +Y with its start a little behind the origin, then swung onto
    // the A→B line and dropped on A. `rotateZ(-θ)` takes +Y toward +X, so the
    // angle is measured from vertical: `atan2(dx, dy)`, not the other way round.
    strut.translate(0, strutLength * 0.41, 0);
    strut.rotateZ(-Math.atan2(dx, dy));
    strut.translate(ax, ay, 0);
    parts.push({ geometry: strut, color: shade(iron, 0.88), sway: 0 });

    // --- finial --------------------------------------------------------------
    const cap = new THREE.BoxGeometry(topW * 1.9, 0.07, topW * 1.9);
    cap.translate(0, height - 0.02, 0);
    parts.push({ geometry: cap, color: shade(iron, 1.1), sway: 0 });

    if (rng.chance(0.5)) {
      const spike = new THREE.ConeGeometry(topW * 0.6, 0.16, 4);
      spike.rotateY(Math.PI / 4);
      spike.translate(0, height + 0.07, 0);
      parts.push({ geometry: spike, color: shade(iron, 1.0), sway: 0 });
    }

    // --- lantern -------------------------------------------------------------
    const hx = reach;
    const armBottom = armY - armW / 2;
    const hangerH = rng.range(0.05, 0.1);
    const hanger = new THREE.BoxGeometry(mast * 0.8, hangerH * 1.6, mast * 0.8);
    hanger.translate(hx, armBottom - hangerH * 0.5, 0);
    parts.push({ geometry: hanger, color: shade(iron, 0.86), sway: 0 });

    const cage = rng.range(0.115, 0.145);
    const bodyH = rng.range(0.26, 0.34);
    const lidY = armBottom - hangerH;

    // A pyramid hood. Four-sided cylinders put their *corners* on the radius, so
    // matching the square cage below means a radius of half-width × √2 and a
    // 45° turn — otherwise the hood sits diamond-wise across the posts.
    const hoodH = 0.13;
    const hood = new THREE.CylinderGeometry(cage * 0.45 * S2, cage * 1.28 * S2, hoodH, 4);
    hood.rotateY(Math.PI / 4);
    hood.translate(hx, lidY - hoodH / 2 + 0.01, 0);
    parts.push({ geometry: hood, color: shade(iron, 1.02), sway: 0 });

    // Four corner posts and nothing between them. The sides are left open
    // deliberately: glass would have to be a lit surface, which in a dark zone
    // means a dark lantern, and the flame inside has to be visible from every
    // direction for the lamp to look like it is the thing doing the lighting.
    const postW = mast * 0.75;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const upright = new THREE.BoxGeometry(postW, bodyH * 1.1, postW);
        upright.translate(
          hx + sx * (cage - postW * 0.5),
          lidY - hoodH - bodyH / 2 + 0.02,
          sz * (cage - postW * 0.5),
        );
        parts.push({ geometry: upright, color: shade(iron, 0.9), sway: 0 });
      }
    }

    // The bottom is a frame, not a floor — a drip pan with its middle out.
    // Four bars, so the lantern is a cage all the way round rather than a
    // sealed box with holes cut in its sides.
    const plateY = lidY - hoodH - bodyH;
    const railW = mast * 0.9;
    const span = cage * 2.2;
    for (const along of [0, 1]) {
      for (const side of [-1, 1]) {
        const lengthwise = along === 0;
        // The pair running the other way is cut short and overlapped into the
        // first pair rather than meeting it flush — a shared face would put
        // four triangles on every edge of it, which the art check reads as a
        // hole rather than as a joint.
        const bar = new THREE.BoxGeometry(
          lengthwise ? span : railW,
          0.06,
          lengthwise ? railW : span - railW * 1.8,
        );
        const offset = span / 2 - railW / 2;
        bar.translate(
          hx + (lengthwise ? 0 : side * offset),
          plateY - 0.01,
          lengthwise ? side * offset : 0,
        );
        parts.push({ geometry: bar, color: shade(iron, 0.8), sway: 0 });
      }
    }

    // --- the flame -----------------------------------------------------------
    const lampY = plateY + bodyH * 0.5;

    // Stretched vertically, and drawn additively, so it stays bright inside a
    // housing that is not lit from anywhere. This is the whole of the visible
    // light now: no shaft, no cone, just the thing that is burning.
    const core = new THREE.OctahedronGeometry(cage * 0.5, 0);
    core.scale(1, 1.6, 1);
    core.translate(hx, lampY, 0);
    glow.push({ geometry: core, color: PALETTE.LAMPLIGHT, sway: 0 });

    // --- assembly ------------------------------------------------------------
    const geometry = assemble(parts);
    const glowGeometry = assemble(glow);

    // Turned as a whole, so a row of lamps does not all hang their lanterns the
    // same way. Applied to the geometry rather than to the mesh so that callers
    // are still free to rotate the object itself into a street.
    const facing = rng.range(0, Math.PI * 2);
    geometry.rotateY(facing);
    glowGeometry.rotateY(facing);

    if (scale !== 1) {
      geometry.scale(scale, scale, scale);
      glowGeometry.scale(scale, scale, scale);
    }

    const mesh = finish(geometry, 'streetlamp', 0);
    mesh.add(finishGlow(glowGeometry, 'streetlamp:glow'));

    // Where the lantern ended up after that rotation. `rotateY` maps
    // (x, 0) to (x·cos, −x·sin).
    const lightX = Math.cos(facing) * hx * scale;
    const lightZ = -Math.sin(facing) * hx * scale;

    const light = new THREE.PointLight(
      LIGHT_COLOR,
      // Squared, because intensity is candela and the distances it falls off
      // over are scaling linearly. Without this a lamp built at half size would
      // be four times as bright at its own feet.
      LIGHT_INTENSITY * rng.around(1, 0.12) * scale * scale,
      LIGHT_RANGE * scale,
      2,
    );
    light.position.set(lightX, lampY * scale, lightZ);
    // No shadow map. One per lamp is the single most expensive thing this kit
    // could ask for, and a point light needs six faces of it — worth revisiting
    // only if a zone is ever lit by lamps alone.
    light.castShadow = false;
    mesh.add(light);

    return mesh;
  },
};
