import * as THREE from 'three';

/** The water colours every pond, river and sea shares. sRGB hex; mutable, and `applyWaterTints` pushes them into the materials. */
export const WATER_TINTS = {
  shallow: 0x67948e,
  deep: 0x1b3a43,
  foam: 0xecf2f2,
};

const materials = new Set<THREE.ShaderMaterial>();

/** Registers a material with uShallow, uDeep and uFoam uniforms and colours it now. */
export function tintWater(material: THREE.ShaderMaterial): void {
  materials.add(material);
  applyWaterTints();
}

export function applyWaterTints(): void {
  for (const material of materials) {
    const u = material.uniforms;
    (u.uShallow.value as THREE.Color).set(WATER_TINTS.shallow);
    (u.uDeep.value as THREE.Color).set(WATER_TINTS.deep);
    (u.uFoam.value as THREE.Color).set(WATER_TINTS.foam);
  }
}
