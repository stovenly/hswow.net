import * as THREE from 'three';

/**
 * What the sky is worth as light, sampled once a frame and handed to whatever
 * draws a beam of it indoors.
 *
 * A resultant of both bodies rather than a choice between them: the sun and the
 * moon are each weighed by how high they stand and how strongly they shine, and
 * what comes out is one direction, one colour and two magnitudes. Both up at
 * once is the ordinary case — a moon still out at dawn — and it resolves to a
 * beam between them carrying some of each one's colour. This is a formula, not
 * a simulation; nothing here claims to be a light transport.
 */
export interface Daylight {
  /** Toward the resultant. World, unit. */
  direction: THREE.Vector3;
  /** What the light is, the two bodies mixed by their weight. */
  colour: THREE.Color;
  /** How strong the shaft through a hole is, 0..1. Nothing under a shut sky. */
  beam: number;
  /** How bright the hole itself is, 0..1. Nothing on a moonless midnight. */
  glow: number;
}

/** Full noon, straight overhead. What it reads as before the clock has run. */
export function createDaylight(): Daylight {
  return {
    direction: new THREE.Vector3(0, 1, 0),
    colour: new THREE.Color(1, 1, 1),
    beam: 1,
    glow: 1,
  };
}
