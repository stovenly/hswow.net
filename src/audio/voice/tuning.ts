/**
 * The throat's dials, live. `?debug` only.
 *
 * Every one of these is a number that decides how the voice *sounds* rather
 * than what it says, and none of them can be arrived at by reasoning — four
 * rounds of "this must be the muffled one" got it wrong four times. So they
 * move while it is talking, on every voice in the world at once, and the ear
 * decides. The numbers that stick go back into `villagerBody`.
 *
 * Defaults mirror the villager preset. Changing one here overrides the preset
 * on every throat alive and every throat built afterwards.
 */

export interface VoiceTuning {
  /** The model's own level, before the emitter. */
  gain: number;
  /** Per section per pass. With the reflections, this sets formant bandwidth. */
  wallLoss: number;
  glottalReflect: number;
  lipReflect: number;
  /** One-pole on each end reflection: how fast the round trip loses treble. */
  wallDamp: number;
  /** The output lowpass, as a one-pole coefficient. 1 is off. */
  head: number;
  /** Added to whatever `Rd` the writer asks for. Up is breathier and darker. */
  rdBias: number;
  /** How loud aspiration is under the voice. */
  aspiration: number;
  /** How loud a constriction hisses. */
  turbulence: number;
}

export const VOICE_TUNING: VoiceTuning = {
  gain: 0.35,
  wallLoss: 0.999,
  glottalReflect: 0.75,
  lipReflect: -0.85,
  wallDamp: 0.6,
  head: 0.78,
  rdBias: 0,
  aspiration: 0.3,
  turbulence: 0.25,
};

const live = new Set<AudioWorkletNode>();

export function addThroat(node: AudioWorkletNode): void {
  live.add(node);
  for (const key of Object.keys(VOICE_TUNING) as (keyof VoiceTuning)[]) {
    node.port.postMessage({ kind: 'tune', key, value: VOICE_TUNING[key] });
  }
}

export function dropThroat(node: AudioWorkletNode): void {
  live.delete(node);
}

/** Pushes one dial to every throat that exists. */
export function pushVoiceTuning(key: keyof VoiceTuning): void {
  const value = VOICE_TUNING[key];
  for (const node of live) node.port.postMessage({ kind: 'tune', key, value });
}
