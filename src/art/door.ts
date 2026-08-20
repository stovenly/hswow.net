import * as THREE from 'three';
import type { BuildOptions } from './types';
import { createRng } from './random';
import type { DoorMaterial } from '../audio/models/door';
import { buildHutDoor } from './builders/hut-door';
import { buildFactoryDoor } from './builders/factory-door';

/**
 * What the portal system knows about doors, gathered in one place: a `PortalEnd`
 * says `material`, and the material chooses both the mesh and, downstream in
 * `audio/models/door`, the sound of using it. Neither builder knows portals exist.
 */

/** What a portal needs to know about the door it just built. */
export interface DoorMetrics {
  width: number;
  height: number;
  /** How far the leaf's face stands out from the wall behind it. */
  depth: number;
  material: DoorMaterial;
}

/** Reads the metrics back off a mesh built by either door builder. */
export function doorMetrics(mesh: THREE.Mesh): DoorMetrics {
  return mesh.userData.door as DoorMetrics;
}

/**
 * What a door is called when the player looks at it. Descriptive rather than
 * evocative, on purpose: this is the top line of the tooltip and it names the
 * object, while the line beneath names the place. Both wooden voices answer to
 * the same name — the timber/plank split is acoustic, not one the player needs a
 * word for. Named for what it is made of rather than for the builder, which says
 * where a door belongs and not what it is.
 */
const NAMES: Record<DoorMaterial, string> = {
  timber: 'Wood Door',
  plank: 'Wood Door',
  iron: 'Metal Door',
};

export function doorName(material: DoorMaterial): string {
  return NAMES[material];
}

export interface PortalDoorOptions extends BuildOptions {
  /** Chooses the builder and the voice. Rolled from the seed if omitted. */
  material?: DoorMaterial;
}

const MATERIALS: readonly DoorMaterial[] = ['timber', 'iron', 'plank'];

/**
 * The door for a portal end: iron is a factory door, wood is a hut door. The
 * material rolls from the seed when a portal does not say — first, from its own
 * stream, so what a seed's door is made of does not change when either builder
 * grows new details.
 */
export function buildDoor(options: PortalDoorOptions = {}): THREE.Mesh {
  const { seed = 1, scale = 1 } = options;
  const material = options.material ?? createRng(seed).pick(MATERIALS);
  return material === 'iron'
    ? buildFactoryDoor({ seed, scale })
    : buildHutDoor({ seed, scale, material });
}
