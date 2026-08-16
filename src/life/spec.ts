import type { BuildOptions } from '../art/types';

/**
 * What a life builder tells the runtime about the creature it built. Stamped
 * on `mesh.userData.life` beside the rig; `LifeActivity` reads both.
 */
export interface LifeSpec {
  kind: 'quadruped' | 'biped' | 'fowl';
  seed: number;
  /** Ground to the leg's top joint. Sets stride length and swing pivot. */
  legLength: number;
  /** Nose to tail, for the slope pitch and the collision footprint. */
  bodyLength: number;
  /** Top of the body, for the player's collision cylinder. */
  height: number;
  /** Where the voice comes from, and roughly where the head is. */
  headHeight: number;
  /** Footprint, for the player and for keeping creatures apart. */
  radius: number;
  walkSpeed: number;
  /** How far it wanders from where it was placed. Zero stands still. */
  roam: number;
  /** Which sound it makes when it greets. `voice` is a person. */
  call?: 'cow' | 'sheep' | 'dog' | 'pig' | 'fowl' | 'voice';
  /** Throat length as a multiplier; below 1 is bigger. */
  tone: number;
  /** Lowers the head to the ground while idle. */
  grazes: boolean;
  /** How far the neck pitches to reach the ground, radians. */
  grazeDrop: number;
  /** Which hand a figure waves with: +1 is +X. */
  handed?: 1 | -1;
  /**
   * The leg, for feet that are planted and solved rather than swung: hip to
   * knee, knee to ankle, and how high the ankle sits with the sole on the
   * ground. Bones `legLu/legLl/legLf` (and R), the hips under `hips`.
   */
  legs?: { thigh: number; shin: number; ankle: number };
  /** What a figure has on the front of its head, for the animator. */
  face?: string;
}

/** What every life builder accepts beyond seed and scale. */
export interface LifeOptions extends BuildOptions {
  /** Metres it may wander from its placement. Default is per species; 0 stays. */
  roam?: number;
  /** A figure's face option — see `art/builders/figure-face`. */
  face?: string;
}
