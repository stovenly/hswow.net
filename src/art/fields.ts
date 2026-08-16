/**
 * The three per-vertex fields — sway weight, wear, detail size — packed as one
 * `vec3` attribute: `.x` sway, `.y` wear, `.z` detail. One attribute rather
 * than three because vertex attributes are the scarce resource: the kit sat at
 * fourteen, and a rigged creature adds two for skinning against a common limit
 * of sixteen. Declared once, by the sway patch, and read by all three stages.
 *
 * A leaf module, so the stages and `assemble` can all import it without a cycle.
 */
export const FIELD_ATTRIBUTE = 'aField';
/** Which lane of `FIELD_ATTRIBUTE` each field lives in. */
export const FIELD_SWAY = 0;
export const FIELD_WEAR = 1;
export const FIELD_DETAIL = 2;
