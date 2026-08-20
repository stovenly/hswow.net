/**
 * The motion envelope: per bone, the largest rotation any biped layer in
 * `gaits.ts` applies about each axis, read out of the layers themselves —
 * walk, idle, the greetings, the fidgets, talk, and `look` taken at a
 * full-radian target. It is the contract between animation and clothing: a
 * garment cleared against these numbers stays clear under every animation,
 * and a new animation stays inside them or widens the entry it exceeds —
 * the widened entry is the list of what to recheck.
 *
 * One entry per left-side bone; the right side mirrors it. The legs are
 * absent on purpose: they are solved from planted feet (`legs.ts`), not
 * turned by a layer. Contact gestures scale with `GestureFit`; these are
 * the values at fit 1.
 */
export const BIPED_ENVELOPE: Record<string, { rx: number; ry: number; rz: number }> = {
  hips: { rx: 0, ry: 0.06, rz: 0.06 }, // walk sway; the shift fidget
  torso: { rx: 0.28, ry: 0.15, rz: 0.05 }, // the bow; the look-around sweep
  chest: { rx: 0.16, ry: 0.03, rz: 0.01 }, // the bow folding on
  clavL: { rx: 0, ry: 0.05, rz: 0.14 }, // walk swing; raise and stretch
  neck: { rx: 0.25, ry: 0.2, rz: 0 }, // look's share of a full-radian turn
  head: { rx: 0.65, ry: 0.75, rz: 0.15 }, // look down; the look-around sweep
  armLu: { rx: 1.1, ry: 0.55, rz: 1.7 }, // the doff; the heart; the raise
  armLl: { rx: 2.3, ry: 0.8, rz: 0.85 }, // the heart's fold; press; the wave
  nubL: { rx: 0.5, ry: 0.35, rz: 0.5 }, // greeting perk; look; idle flicks
  face: { rx: 0.16, ry: 0.05, rz: 0.25 }, // the mask greeting and talking
};

/**
 * How far any layer turns a *hanging* arm in toward the body: none. The
 * layers that turn an upper arm inward (heart, clap, fold) fold it forward
 * across the chest first, clear of the ribs, so the rest gap between arm
 * and coat is the smallest the animation ever makes it. Widen this if a new
 * animation sweeps a hanging arm inward — the builder broadens the
 * shoulders to keep the gap.
 */
export const ARM_HANG_INWARD = 0;
