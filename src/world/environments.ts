import { INDOOR_ENVIRONMENT, OUTDOOR_ENVIRONMENT, type ZoneEnvironment } from './Zone';

/**
 * Named environments a document's `environment.base` can point at.
 *
 * Presets stay code — an environment is a look, tuned once and shared by a
 * family of zones — and the choice plus the deltas are data. A project registers
 * whatever its own families need.
 */

const presets = new Map<string, ZoneEnvironment>([
  ['outdoor', OUTDOOR_ENVIRONMENT],
  ['indoor', INDOOR_ENVIRONMENT],
]);

export function registerEnvironment(name: string, environment: ZoneEnvironment): void {
  presets.set(name, environment);
}

export function environmentByName(name: string): ZoneEnvironment | undefined {
  return presets.get(name);
}

export function environmentNames(): readonly string[] {
  return [...presets.keys()];
}
