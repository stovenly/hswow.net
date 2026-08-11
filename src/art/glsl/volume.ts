/**
 * Which effect volume owns this vertex or fragment, and how strongly.
 *
 * Glitch and horror each carried this loop twice — once in the vertex stage and
 * once in the fragment stage — so the rule it encodes lived in four places and
 * was kept in step by hand. It is a rule worth stating once: a volume is a
 * sphere or a box, membership feathers over the outer third, an owned volume
 * ignores geometry entirely and takes its object whole, and the underside is a
 * cut rather than a fade. The strongest volume wins outright; they do not sum.
 * MATERIAL-SYSTEM.md R4.
 *
 * The two banks are not the same shape — glitch folds the owner id into
 * `uGlitchCentre.w` alongside the shape bit, horror keeps it in `uHorrorParams.w`
 * — so how the owner is read is the caller's to say, as is what the winner
 * writes down.
 */

import { reindent } from './text';

export interface VolumeMembership {
  /** The uniform family. `Glitch` reads uGlitchCount, uGlitchCentre, uGlitchSize. */
  system: string;
  /** Local-name prefix, so glitch's loop and horror's can stand in one shader. */
  prefix: string;
  /** Volumes in the bank. */
  max: number;
  /** Where this vertex or fragment is, in world space. */
  world: string;
  /** This object's effect id: the attribute in a vertex stage, a varying below. */
  id: string;
  /** How the owner id is read out of the bank. The loop index is `<prefix>i`. */
  owner: string;
  /**
   * What the strongest volume so far writes down. `<prefix>Feather` is the
   * geometric share before strength, which horror's fit wants and glitch does
   * not. The caller declares these, and `<prefix>Amt`, ahead of the loop.
   */
  capture: string;
}

/**
 * The loop. Leaves `<prefix>Amt` holding the winning strength, zero if no
 * volume reaches here, and whatever `capture` wrote alongside it.
 */
export function volumeMembership(spec: VolumeMembership): string {
  const { system: s, prefix: p, max, world, id, owner } = spec;
  const capture = reindent(spec.capture, 4);
  return /* glsl */ `for (int ${p}i = 0; ${p}i < ${max}; ${p}i++) {
  if (${p}i >= u${s}Count) break;
  float ${p}Own = ${owner};
  float ${p}Feather;
  if (${p}Own > 0.5) {
    // Owned: membership is identity, not geometry — the whole object at full
    // strength, and nothing that is not it. See art/effectId.ts.
    ${p}Feather = abs(${id} - ${p}Own) < 0.5 ? 1.0 : 0.0;
  } else {
    vec3 ${p}rel = (${world} - u${s}Centre[${p}i].xyz) / u${s}Size[${p}i].xyz;
    // The underside is a cut, not a fade. See the note on the store.
    if (${p}rel.y < -1.0) continue;
    vec3 ${p}d = vec3(abs(${p}rel.x), max(${p}rel.y, 0.0), abs(${p}rel.z));
    float ${p}e = u${s}Centre[${p}i].w > 0.5 ? max(${p}d.x, max(${p}d.y, ${p}d.z)) : length(${p}d);
    ${p}Feather = 1.0 - smoothstep(0.7, 1.0, ${p}e);
  }
  float ${p}in = ${p}Feather * u${s}Size[${p}i].w;
  if (${p}in > ${p}Amt) {
    ${p}Amt = ${p}in;
    ${capture}
  }
}`;
}
