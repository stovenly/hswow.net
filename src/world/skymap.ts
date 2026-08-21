import * as THREE from 'three';

/**
 * What the sky can reach. One orthographic pass straight down over a zone, baked
 * once when the zone is built, giving the height of the highest surface above
 * every square of ground. The finish stage reads it to decide whether a fragment
 * stands in the weather or under something — which is the difference between
 * snow lying on a roof and snow lying under the eave it hangs over.
 */

/** Texels a side. Over a hundred and sixty metres this is a third of a metre. */
const SIZE = 512;

/** Metres of headroom above the tallest thing in the zone. */
const HEADROOM = 4;

export const skyMapUniforms = {
  uSkyMap: { value: null as THREE.Texture | null },
  /** World xz to 0..1: scale in xy, offset in zw. */
  uSkyMapPlane: { value: new THREE.Vector4(1, 1, 0, 0) },
  /** The top and bottom of the pass, in metres. Depth 0 is the top. */
  uSkyMapRange: { value: new THREE.Vector2(0, 0) },
  uSkyMapOn: { value: 0 },
};

/**
 * Requires `packing` in scope, which every lambert fragment shader already has.
 * Returns 1 in the open and 0 under a roof, feathered over the half metre in
 * between so a wall's own thickness does not cut a hard line across the ground.
 */
export const SKY_MAP_GLSL = /* glsl */ `
  #ifndef SKY_MAP_INCLUDED
  #define SKY_MAP_INCLUDED

  uniform sampler2D uSkyMap;
  uniform vec4 uSkyMapPlane;
  uniform vec2 uSkyMapRange;
  uniform float uSkyMapOn;

  float skyReach(vec3 world) {
    if (uSkyMapOn < 0.5) return 1.0;
    vec2 uv = world.xz * uSkyMapPlane.xy + uSkyMapPlane.zw;
    // Off the map is open sky, not shelter. A zone's edge is where the world
    // stops being described, and the answer there has to be the harmless one.
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 1.0;
    float depth = unpackRGBAToDepth(texture2D(uSkyMap, uv));
    float above = mix(uSkyMapRange.x, uSkyMapRange.y, depth);
    return 1.0 - smoothstep(0.2, 0.7, above - world.y);
  }

  #endif
`;

const DEPTH_MATERIAL = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

const BAKE_SCENE = new THREE.Scene();
BAKE_SCENE.overrideMaterial = DEPTH_MATERIAL;

const CAMERA = new THREE.OrthographicCamera();
// Layer 0 only. Groundcover and particles build their geometry in their own
// vertex shaders, so under an override material they would land at the origin
// and write depth over the middle of the map.
CAMERA.layers.set(0);
const BOUNDS = new THREE.Box3();

let target: THREE.WebGLRenderTarget | null = null;

/**
 * Bakes the shelter map for one zone. Called once when the zone is built, and
 * never again — the sun moves, but nothing this describes does.
 *
 * The group is re-parented into a scene of its own for the pass rather than the
 * world being rendered with an override material: the dome writes no depth and
 * tests none, and an override material would give it both.
 */
export function bakeSkyMap(renderer: THREE.WebGLRenderer, root: THREE.Object3D): void {
  BOUNDS.setFromObject(root);
  if (BOUNDS.isEmpty()) {
    skyMapUniforms.uSkyMapOn.value = 0;
    return;
  }

  if (target === null) {
    target = new THREE.WebGLRenderTarget(SIZE, SIZE, {
      // Nearest, and it has to be: the depth is packed across four bytes, and
      // a bilinear blend of two packed values is not a depth between them.
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
      generateMipmaps: false,
    });
    skyMapUniforms.uSkyMap.value = target.texture;
  }

  const width = Math.max(BOUNDS.max.x - BOUNDS.min.x, 1);
  const depth = Math.max(BOUNDS.max.z - BOUNDS.min.z, 1);
  const top = BOUNDS.max.y + HEADROOM;
  const bottom = BOUNDS.min.y - 1;

  CAMERA.left = BOUNDS.min.x;
  CAMERA.right = BOUNDS.min.x + width;
  // Straight down means +Z on the film runs the other way to +Z in the world.
  CAMERA.top = -BOUNDS.min.z;
  CAMERA.bottom = -(BOUNDS.min.z + depth);
  CAMERA.near = 0;
  CAMERA.far = top - bottom;
  CAMERA.position.set(0, top, 0);
  CAMERA.rotation.set(-Math.PI / 2, 0, 0);
  CAMERA.updateMatrixWorld(true);
  CAMERA.updateProjectionMatrix();

  const parent = root.parent;
  BAKE_SCENE.add(root);
  BAKE_SCENE.updateMatrixWorld(true);

  const previousTarget = renderer.getRenderTarget();
  const previousClear = renderer.getClearColor(new THREE.Color());
  const previousAlpha = renderer.getClearAlpha();
  renderer.setRenderTarget(target);
  // Nothing drawn packs as the far plane, which reads back as ground level and
  // therefore as open sky.
  renderer.setClearColor(0x000000, 1);
  renderer.clear(true, true, false);
  renderer.render(BAKE_SCENE, CAMERA);
  renderer.setRenderTarget(previousTarget);
  renderer.setClearColor(previousClear, previousAlpha);

  if (parent) parent.add(root);
  else BAKE_SCENE.remove(root);

  skyMapUniforms.uSkyMapPlane.value.set(
    1 / width,
    -1 / depth,
    -BOUNDS.min.x / width,
    (BOUNDS.min.z + depth) / depth,
  );
  skyMapUniforms.uSkyMapRange.value.set(top, bottom);
  skyMapUniforms.uSkyMapOn.value = 1;
}

/** Indoors there is no weather to shelter from, and no map worth keeping. */
export function clearSkyMap(): void {
  skyMapUniforms.uSkyMapOn.value = 0;
}
