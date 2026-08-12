/** The union program, scanned for identifiers GLSL will not accept. */
import * as THREE from 'three';
import { applyFinish, FINISH_MASK_ALL } from '../src/art/finish';

const material = new THREE.MeshLambertMaterial();
applyFinish(material, FINISH_MASK_ALL);
const shader = {
  uniforms: {} as Record<string, unknown>,
  vertexShader: THREE.ShaderLib.lambert.vertexShader,
  fragmentShader: THREE.ShaderLib.lambert.fragmentShader,
};
(material.onBeforeCompile as unknown as (s: typeof shader, r: unknown) => void)(shader, null);

/**
 * GLSL ES 3.00 keywords and reserved words.
 *
 * The scanner that existed before carried eight of these, chosen from memory.
 * `out` was not among them, and `float out` inside a scene cost the entire
 * finished material: the union failed to compile, so every mesh wearing a
 * finish drew nothing while the lean ones carried on.
 */
const RESERVED =
  `const uniform buffer shared attribute varying coherent volatile restrict readonly writeonly
   layout centroid flat smooth noperspective patch sample break continue do for while switch
   case default if else subroutine in out inout float int void bool true false invariant
   precise discard return mat2 mat3 mat4 vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4
   uint uvec2 uvec3 uvec4 lowp mediump highp precision struct common partition active asm
   class union enum typedef template this resource goto inline noinline public static extern
   external interface long short half fixed unsigned superp input output filter sizeof cast
   namespace using`
    .trim()
    .split(/\s+/);

const TYPES =
  'float|int|uint|bool|vec2|vec3|vec4|ivec2|ivec3|ivec4|bvec2|bvec3|bvec4|mat2|mat3|mat4';

/** A declaration: a type, then the word as a whole identifier. */
function declares(word: string): RegExp {
  return new RegExp(String.raw`\b(?:${TYPES})\s+${word}\b`, 'g');
}

let bad = 0;

// The scan has to fire on a planted one, or a broken pattern reads as clean —
// which is exactly how the miss above got through.
if (!declares('out').test('float out = 1.0;')) {
  bad++;
  console.log('  FAIL scanner self-test did not fire');
}
if (declares('out').test('vec4 recipeCell(vec3 p, out float border) {')) {
  bad++;
  console.log('  FAIL scanner flags a legal out parameter');
}

for (const [stage, src] of [
  ['vertex', shader.vertexShader],
  ['fragment', shader.fragmentShader],
] as const) {
  const code = src
    .split(String.fromCharCode(10))
    .filter((line) => !line.trimStart().startsWith('//'))
    .join(String.fromCharCode(10));
  for (const word of RESERVED) {
    const hits = code.match(declares(word));
    if (hits) {
      bad++;
      console.log(`  FAIL ${stage}: declares '${word}' (${hits.length}x) — ${hits[0].trim()}`);
    }
  }
}

console.log(
  bad === 0
    ? `clean: ${RESERVED.length} reserved words checked over both stages`
    : `${bad} failures`,
);
process.exit(bad === 0 ? 0 : 1);
