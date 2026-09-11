import type { LineBuilder } from './walk';
import { fenceLine } from './fence';
import { wallLine } from './wall';
import { hedgeLine } from './hedge';
import { kerbLine, jettyLine, ropeLine } from './small';

// Every line builder, by name. `track` is not here: the track network lays
// itself for the whole zone at once and the line kind hands it over.

export const LINE_BUILDERS: Record<string, LineBuilder> = Object.fromEntries(
  [fenceLine, wallLine, hedgeLine, kerbLine, jettyLine, ropeLine].map((builder) => [builder.name, builder]),
);

export function lineBuilderByName(name: string): LineBuilder | undefined {
  return LINE_BUILDERS[name];
}

export * from './walk';
