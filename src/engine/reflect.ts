/**
 * The screen-space reflection march, shared by every surface that mirrors — water
 * and glass both need it, and two copies of a sixty-line march would drift apart
 * the first time either was tuned.
 *
 * The includer owes it four things, all of which any surface drawn in the effect
 * chain already has: a `sceneDistance(vec2)` returning metres along the camera
 * ray, the scene colour as `tScene`, the camera's `uProjectionView`, and three's
 * own `cameraPosition`.
 */
export const REFLECT_GLSL = /* glsl */ `
/**
 * March the depth buffer for what a ray hits, in world space rather than screen
 * space: the depth texture is read as a distance in metres, so the acceptance band
 * can be written in metres too, which is the only unit these shaders are authored
 * in. The stride grows geometrically, so a near hit is found precisely and a far
 * one is still reached inside the step budget.
 *
 * The weight is how much to trust the hit — zero for no hit at all, faded down near
 * the edge of the frame where the ray is about to run out of screen; the caller
 * crossfades that against the analytic sky. A surface using this is off layer 0 and
 * therefore absent from the depth buffer, so none of the usual self-intersection
 * guards are needed.
 */
vec3 marchReflection(
  vec3 origin,
  vec3 direction,
  float jitter,
  out float weight,
  out float travelled
) {
  weight = 0.0;
  travelled = 0.0;
  vec3 found = vec3(0.0);

  float stride = 0.35;
  float t = stride * (0.5 + jitter);

  for (int i = 0; i < 16; i++) {
    t += stride;
    vec3 p = origin + direction * t;

    vec4 clip = uProjectionView * vec4(p, 1.0);
    if (clip.w <= 0.0) break;
    vec2 uv = clip.xy / clip.w * 0.5 + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) break;

    float along = length(p - cameraPosition);
    float behind = along - sceneDistance(uv);

    // Behind the recorded surface, but not so far behind that the ray has
    // passed clean through something thin and come out the other side.
    if (behind > 0.0 && behind < stride * 2.5) {
      // Refine between the last miss and here. Four halvings turns a step that
      // may be metres long into centimetres, which is the difference between a
      // reflection that sits on its object and one that floats.
      float lo = t - stride;
      float hi = t;
      for (int r = 0; r < 4; r++) {
        float mid = (lo + hi) * 0.5;
        vec3 q = origin + direction * mid;
        vec4 qc = uProjectionView * vec4(q, 1.0);
        vec2 quv = qc.xy / qc.w * 0.5 + 0.5;
        if (length(q - cameraPosition) - sceneDistance(quv) > 0.0) hi = mid;
        else lo = mid;
      }

      vec3 q = origin + direction * hi;
      vec4 qc = uProjectionView * vec4(q, 1.0);
      vec2 quv = qc.xy / qc.w * 0.5 + 0.5;
      found = texture2D(tScene, quv).rgb;

      vec2 edge = min(quv, 1.0 - quv);
      weight = smoothstep(0.0, 0.12, min(edge.x, edge.y));
      travelled = hi;
      break;
    }

    stride *= 1.22;
  }

  return found;
}

// Interleaved gradient noise, the same offset the fog march and GTAO use:
// neighbouring pixels get maximally different values, so one pixel's march
// steps interleave with its neighbours' instead of banding.
float reflectJitter(vec2 p) {
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}
`;
