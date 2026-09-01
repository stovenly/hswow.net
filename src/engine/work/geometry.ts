import * as THREE from 'three';

/** A geometry as buffers a worker can hand back, and the way back to one. */

interface AttributeWire {
  name: string;
  array: ArrayBufferView;
  itemSize: number;
  normalized: boolean;
}

export interface GeometryWire {
  index: ArrayBufferView | null;
  attributes: AttributeWire[];
  groups: { start: number; count: number; materialIndex?: number }[];
  userData: Record<string, unknown>;
}

export function toWire(geometry: THREE.BufferGeometry): {
  wire: GeometryWire;
  transfer: Transferable[];
} {
  const attributes: AttributeWire[] = [];
  const buffers = new Set<ArrayBuffer>();
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    if (!(attribute instanceof THREE.BufferAttribute)) continue;
    const array = attribute.array as ArrayBufferView;
    attributes.push({
      name,
      array,
      itemSize: attribute.itemSize,
      normalized: attribute.normalized,
    });
    buffers.add(array.buffer as ArrayBuffer);
  }
  const index = geometry.getIndex();
  const indexArray = index ? (index.array as ArrayBufferView) : null;
  if (indexArray) buffers.add(indexArray.buffer as ArrayBuffer);
  return {
    wire: {
      index: indexArray,
      attributes,
      groups: geometry.groups.map((group) => ({ ...group })),
      // Plain data only — a mask, a part table, a strip of sparkle sites.
      userData: geometry.userData as Record<string, unknown>,
    },
    transfer: [...buffers],
  };
}

export function fromWire(wire: GeometryWire): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  for (const attribute of wire.attributes) {
    geometry.setAttribute(
      attribute.name,
      new THREE.BufferAttribute(
        attribute.array as unknown as THREE.TypedArray,
        attribute.itemSize,
        attribute.normalized,
      ),
    );
  }
  if (wire.index) {
    geometry.setIndex(new THREE.BufferAttribute(wire.index as unknown as THREE.TypedArray, 1));
  }
  for (const group of wire.groups) geometry.addGroup(group.start, group.count, group.materialIndex);
  geometry.userData = wire.userData;
  return geometry;
}
