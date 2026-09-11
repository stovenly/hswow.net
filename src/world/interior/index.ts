import * as THREE from 'three';
import { buildInteriorFromSpec } from './generate';
import { HOUSE_STYLE, KITS, registerInteriorStyle, type InteriorStyle } from './kits';
import { CELL, interiorOfShell, type InteriorSpec } from './spec';

// Interiors: cells, edge marks and kits. The old box builder remains as a
// one-room interior for the code zones that still call it.

export * from './spec';
export * from './kits';
export * from './plan';
export { buildInteriorFromSpec, interiorBuilders, type BuiltInterior, type InteriorProp } from './generate';

/** Wall thickness, for anything measuring how far an interior reaches. */
export { WALL as SHELL_THICKNESS } from './spec';

export interface InteriorOptions {
  width: number;
  depth: number;
  height: number;
  seed?: number;
  style?: InteriorStyle;
  planks?: boolean;
  beams?: number;
  thickness?: number;
}

let anonymous = 0;

/**
 * A sealed one-room interior centred on the origin, floor at y = 0: the shell
 * the code zones ask for, built by the generator as one storey of one room.
 */
export function buildInterior(options: InteriorOptions): THREE.Mesh {
  let styleName: string | undefined;
  if (options.style && options.style !== HOUSE_STYLE) {
    styleName = Object.entries(KITS.house.styles).find(([, s]) => s === options.style || (s.floor === options.style?.floor && s.wall === options.style?.wall && s.ceiling === options.style?.ceiling))?.[0];
    if (!styleName) {
      styleName = `anonymous-${anonymous++}`;
      registerInteriorStyle(styleName, options.style);
    }
  }
  const cols = Math.max(1, Math.round(options.width / CELL));
  const rows = Math.max(1, Math.round(options.depth / CELL));
  const spec: InteriorSpec = {
    kit: 'house',
    seed: options.seed,
    storeys: [{ height: options.height, cells: Array.from({ length: rows }, () => 'A'.repeat(cols)), origin: [-Math.floor(cols / 2), -Math.floor(rows / 2)] }],
    rooms: { A: { style: styleName, planks: options.planks, beams: options.beams } },
  };
  return buildInteriorFromSpec(spec).mesh;
}

export { interiorOfShell };
