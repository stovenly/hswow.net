import { createRng } from '../../art/random';

/**
 * Cope's SPEAC as a section grammar. Statement, preparation, extension,
 * antecedent, consequent — roles rather than chord labels, ordered by
 * stability: A is least stable, then P, E, S, and C is most. A section's
 * tension target is *read* from its role instead of being written down.
 *
 * One hard rule carries the shape: an antecedent must reach a consequent, so
 * a plan that opens something has to close it, and every plan lands on C.
 */

export type SpeacId = 'S' | 'P' | 'E' | 'A' | 'C';

/**
 * What may follow what. A consequent answers anything unstable, so it can end
 * any run but never follows itself — twice over is a repetition and not a
 * resolution. It is filtered out of the middle, so a plan reaches it once.
 */
const NEXT: Record<SpeacId, readonly SpeacId[]> = {
  S: ['P', 'E', 'A', 'C'],
  P: ['S', 'A', 'C'],
  E: ['E', 'P', 'A', 'C'],
  A: ['E', 'C'],
  C: ['S', 'E'],
};

/** Instability, 0–1 — the stability order inverted. */
const TENSION: Record<SpeacId, number> = {
  A: 1,
  P: 0.7,
  E: 0.5,
  S: 0.35,
  C: 0.2,
};

/** A seed is a form: the same place plans the same piece on every visit. */
export function speacPlan(seed: number, count: number): readonly SpeacId[] {
  const rng = createRng(seed);
  const plan: SpeacId[] = ['S'];
  while (plan.length < Math.max(3, count) - 1) {
    plan.push(rng.pick(NEXT[plan[plan.length - 1]].filter((id) => id !== 'C')));
  }
  // A plan with nothing unstable in it has no arc, and a consequent with
  // nothing to answer is not a consequent.
  if (!plan.includes('A')) plan[plan.length - 1] = 'A';
  plan.push('C');
  return plan;
}

/**
 * The tension each section carries. An extension takes its predecessor's
 * forward and adds a little — that is what extending is — so the vector is a
 * property of the run and not of the identifiers read one at a time.
 */
export function speacTensions(plan: readonly SpeacId[]): readonly number[] {
  const out: number[] = [];
  plan.forEach((id, i) => {
    out.push(id === 'E' && i > 0 ? Math.min(1, (out[i - 1] + TENSION.E) / 2 + 0.1) : TENSION[id]);
  });
  return out;
}
