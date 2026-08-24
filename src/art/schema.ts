/**
 * What a form has to know about a field to draw a control for it.
 *
 * Types alone cannot carry this — a section count and a seed are both `number`
 * and want completely different controls — so an extended builder states its
 * extras here and the inspector renders from it. A builder with no extras needs
 * nothing.
 */

export type Field =
  | { type: 'number'; min?: number; max?: number; step?: number; label?: string }
  | { type: 'int'; min?: number; max?: number; label?: string }
  | { type: 'string'; label?: string }
  | { type: 'boolean'; label?: string }
  | { type: 'choice'; options: readonly string[] | (() => readonly string[]); label?: string }
  /** An entry id in the same zone. Rendered as a dropdown with a pick-in-view button. */
  | { type: 'ref'; label?: string }
  | { type: 'color'; label?: string }
  | { type: 'point'; label?: string }
  | { type: 'vector'; label?: string };

export type Fields = Record<string, Field>;

/** Clamps and coerces a value to what its field says it is. Unknown keys are dropped. */
export function coerceFields(fields: Fields, value: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (typeof value !== 'object' || value === null) return out;
  const source = value as Record<string, unknown>;
  for (const [key, field] of Object.entries(fields)) {
    const given = source[key];
    if (given === undefined) continue;
    switch (field.type) {
      case 'number':
      case 'int': {
        if (typeof given !== 'number' || !Number.isFinite(given)) break;
        const min = field.min ?? -Infinity;
        const max = field.max ?? Infinity;
        const clamped = Math.min(Math.max(given, min), max);
        out[key] = field.type === 'int' ? Math.round(clamped) : clamped;
        break;
      }
      case 'boolean':
        if (typeof given === 'boolean') out[key] = given;
        break;
      case 'choice': {
        const options = typeof field.options === 'function' ? field.options() : field.options;
        if (typeof given === 'string' && options.includes(given)) out[key] = given;
        break;
      }
      case 'string':
      case 'ref':
      case 'color':
        if (typeof given === 'string') out[key] = given;
        break;
      case 'point':
      case 'vector':
        if (Array.isArray(given) && given.every((n) => typeof n === 'number')) out[key] = given;
        break;
    }
  }
  return out;
}
