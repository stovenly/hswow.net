import * as THREE from 'three';
import type { MeshBuilder } from '../types';
import { assemble, finish, type Part } from '../assemble';
import { createRng } from '../random';
import { PALETTE, shade } from '../palette';
import { rod } from '../rod';

/**
 * A gantry beam with a chain hoist hanging off it.
 *
 * For lifting castings between machines. The reason to have one is the hook:
 * it is the only thing in the kit that hangs freely in mid-air at chest height,
 * so it puts an object where the eye does not expect one and immediately
 * implies a *use* for the empty floor underneath it.
 *
 * **The dangling chain is the silhouette.** A beam on legs is a doorway; a beam
 * on legs with a line falling out of the middle of it is a crane, and that
 * reads from any distance and any angle. Everything above the trolley is
 * scaffolding for it.
 *
 * The chain is a stack of short alternating links rather than a smooth
 * cylinder. Two orientations, turned a quarter from each other, is what a chain
 * actually looks like — and at a dozen links it costs less than the hook does.
 */
export const hoist: MeshBuilder = {
  name: 'hoist',
  category: 'structures',
  radius: 2.4,

  build({ seed = 1, scale = 1 } = {}) {
    const rng = createRng(seed);
    const parts: Part[] = [];

    // A wide range on both. A rank of these at one size reads as a product
    // line — and in a real works the gantry over the lathe and the one over the
    // furnace are nothing like each other.
    const span = rng.range(2.8, 5.4);
    const height = rng.range(2.5, 4.2);
    const iron = shade(PALETTE.IRON, rng.range(0.85, 1.05));
    const legR = rng.range(0.08, 0.11);

    // --- the runway ----------------------------------------------------------
    //
    // An I-beam, built as three boxes: two flanges and a web. Three primitives
    // for a cross-section is worth it — the flanges are what make it read as
    // rolled steel rather than as a length of timber.
    const beamY = height;
    for (const [y, w, t] of [
      [beamY + 0.11, 0.3, 0.05],
      [beamY - 0.11, 0.3, 0.05],
    ] as const) {
      const flange = new THREE.BoxGeometry(span, t, w);
      flange.translate(0, y, 0);
      parts.push({ geometry: flange, color: shade(iron, 1.06), sway: 0 });
    }
    const web = new THREE.BoxGeometry(span * 0.995, 0.24, 0.07);
    web.translate(0, beamY, 0);
    parts.push({ geometry: web, color: iron, sway: 0 });

    // --- legs ----------------------------------------------------------------
    for (const side of [-1, 1]) {
      const x = (side * span) / 2 - side * 0.3;
      const leg = new THREE.CylinderGeometry(legR * 0.85, legR, height, 6);
      leg.translate(x, height / 2, 0);
      parts.push({ geometry: leg, color: iron, sway: 0 });

      const foot = new THREE.BoxGeometry(legR * 4.4, 0.07, legR * 4.4);
      foot.translate(x, 0.035, 0);
      parts.push({ geometry: foot, color: shade(iron, 0.84), sway: 0 });

      // A knee brace from the leg **inward and up to the beam**, spanning two
      // known points so it lands on both.
      //
      // It used to be a box rotated by a fixed angle and nudged, which put it
      // at the right slope and the wrong place — it hung off the outside of the
      // leg pointing at nothing. A brace exists to triangulate the corner
      // between a leg and the beam it carries, so it has to run *across* that
      // corner, and the only way to be sure of that is to name both ends.
      const foot2 = new THREE.Vector3(x, height - 0.75, 0);
      const knee = new THREE.Vector3(x - side * 0.7, beamY - 0.16, 0);
      parts.push({ geometry: rod(foot2, knee, 0.045, 0.04), color: shade(iron, 0.9), sway: 0 });
    }

    // --- trolley and chain ---------------------------------------------------
    const carriage = rng.range(-span * 0.28, span * 0.28);

    const trolley = new THREE.BoxGeometry(0.38, 0.26, 0.3);
    trolley.translate(carriage, beamY - 0.28, 0);
    parts.push({ geometry: trolley, color: shade(iron, 1.14), sway: 0 });

    // The gearbox on the side, which is what makes it a hoist rather than a
    // pulley block.
    const gear = new THREE.CylinderGeometry(0.13, 0.13, 0.12, 8);
    gear.rotateX(Math.PI / 2);
    gear.translate(carriage, beamY - 0.28, 0.2);
    parts.push({ geometry: gear, color: shade(PALETTE.RUST, 1.05), sway: 0 });

    // Not every gantry has tackle hanging on it. A bare runway is a perfectly
    // ordinary thing to walk under and it is what half of them look like
    // between jobs.
    if (rng.chance(0.72)) {
      const hookY = rng.range(0.8, Math.max(1, beamY - 1.4));

      // **Spaced closer than a link is long, so consecutive rings interlock.**
      //
      // They were pitched at 0.09, which is exactly `2 * (ring + tube)` — the
      // full length of a link — so each one ended precisely where the next
      // began and the chain came out as a row of rings touching end to end.
      // A real chain overlaps: the pitch is a little under the ring's *outer
      // diameter*, so every link passes through the two either side of it.
      const ring = 0.035;
      const tube = 0.011;
      const step = ring * 1.35;

      // --- where the hook is, worked out before the chain ---------------------
      //
      // **The chain stops at the hook; the hook does not climb into the chain.**
      // These were laid out in the other order — the chain filled the whole
      // drop and the shank was then drawn upward from the hook — and a shank
      // 0.12 long against a link pitch of 0.047 ran straight through the last
      // three rings. It read as a hook impaled on its own chain.
      //
      // So the hook's geometry is solved from the bottom up first, and the
      // chain is given what is left. The one deliberate overlap is the last
      // link and the top of the eye, which is how a chain is actually attached
      // to a hook: the ring passes through it.
      const bend = 0.075;
      const curlY = hookY + bend;
      const eyeBottom = curlY + bend;
      const eyeTop = eyeBottom + 0.11;

      const chainTop = beamY - 0.42;
      // Half a ring below the top of the eye, so exactly one link threads it.
      const chainBottom = eyeTop - ring * 0.5;
      const drop = Math.max(step * 2, chainTop - chainBottom);
      const links = Math.max(3, Math.round(drop / step) + 1);
      for (let i = 0; i < links; i++) {
        const y = chainTop - (i * drop) / (links - 1);
        const link = new THREE.TorusGeometry(ring, tube, 4, 6);
        // **Both orientations vertical.** A torus is built in the XY plane,
        // which is already the right plane for a hanging link — the extra
        // quarter turn about X that used to be here laid every one of them
        // flat, so the chain came out as a stack of rings threaded on nothing.
        // Alternating about Y is the whole trick: a chain is links at right
        // angles to each other, and a stack all facing one way is a strip of
        // washers.
        link.rotateY(i % 2 === 0 ? 0 : Math.PI / 2);
        link.translate(carriage, y, 0);
        parts.push({ geometry: link, color: shade(iron, 0.92), sway: 0 });
      }

      // The hook: a shank, and a curl swept from rods between named points.
      //
      // The curl was a row of short cylinders each rotated and then nudged to a
      // hand-computed spot, and they did not join — what hung on the end of the
      // chain was a scatter of loose bars. Points on a circle joined end to end
      // cannot come apart, because each segment starts where the last one
      // finished.
      parts.push({
        geometry: rod(
          new THREE.Vector3(carriage, eyeTop, 0),
          new THREE.Vector3(carriage, eyeBottom, 0),
          0.03,
          0.026,
          6,
        ),
        color: shade(iron, 1.1),
        sway: 0,
      });

      const centre = new THREE.Vector3(carriage, curlY, 0);
      const steps = 6;
      const on = (k: number): THREE.Vector3 => {
        // Three quarters of a turn, opening forward. Starting at the top and
        // sweeping down and round is the shape of a lifting hook; a full circle
        // is a ring and half of one is a claw.
        const a = (k / steps) * Math.PI * 1.55;
        return new THREE.Vector3(
          centre.x + Math.sin(a) * bend,
          centre.y + Math.cos(a) * bend,
          centre.z,
        );
      };
      for (let i = 0; i < steps; i++) {
        parts.push({
          geometry: rod(on(i), on(i + 1), 0.024 * (1 - i / (steps * 2.4)), 0.022, 5),
          color: shade(iron, 1.05),
          sway: 0,
        });
      }

      // The point, tapering off the end of the curl.
      const last = on(steps);
      const tip = new THREE.Vector3(last.x - bend * 0.5, last.y + bend * 0.55, last.z);
      parts.push({ geometry: rod(last, tip, 0.021, 0.005, 5), color: shade(iron, 1.15), sway: 0 });
    }

    const geometry = assemble(parts);
    if (scale !== 1) geometry.scale(scale, scale, scale);
    return finish(geometry, 'hoist', 0, 'metal-ring');
  },
};
