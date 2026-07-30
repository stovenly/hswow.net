import type { AudioEngine } from '../AudioEngine';

/**
 * Footsteps, played at the listener rather than in the world.
 *
 * A step is a noise burst through a resonant filter with a fast decay — the
 * material decides the filter, and that is essentially all it decides. Stone
 * rings high and briefly, earth is a dull low thud with no ring at all, wood
 * sits between them and rings longest because it is a hollow box.
 *
 * Not routed through a `PannerNode`: these happen at your own feet, and
 * spatialising something at zero distance from the listener makes the panner
 * produce nonsense. They go straight to the dry bus with a fixed stereo
 * position, which is also what stops them swinging around when you turn your
 * head.
 */

export interface Material {
  /** Resonance the burst is filtered through. */
  frequency: number;
  /** How much it rings. Low is a thud, high is a ring. */
  q: number;
  /** Decay time constant in seconds. */
  decay: number;
  gain: number;
  /** How much low-end body sits under the burst, 0..1. */
  body: number;
}

export const MATERIALS = {
  earth: { frequency: 260, q: 0.8, decay: 0.035, gain: 0.5, body: 0.55 },
  stone: { frequency: 1500, q: 2.4, decay: 0.075, gain: 0.65, body: 0.3 },
  wood: { frequency: 640, q: 3.4, decay: 0.11, gain: 0.6, body: 0.45 },
  grass: { frequency: 3200, q: 1.1, decay: 0.05, gain: 0.34, body: 0.2 },
} as const satisfies Record<string, Material>;

export type MaterialName = keyof typeof MATERIALS;

export class Footsteps {
  /** Surface underfoot. Phase 5 sets this from the zone the player is in. */
  material: MaterialName = 'earth';

  private readonly engine: AudioEngine;
  private readonly output: GainNode;
  private readonly panner: StereoPannerNode;

  constructor(engine: AudioEngine, gain = 0.5) {
    this.engine = engine;
    const context = engine.context;

    this.output = context.createGain();
    this.output.gain.value = gain;
    this.panner = context.createStereoPanner();

    this.output.connect(this.panner);
    this.panner.connect(engine.dry);
    // A little reverb, so your own steps tell you what room you are in. This
    // is most of why walking into the hall lands as an event.
    this.panner.connect(engine.send);
  }

  /** Fired by the controller's head-bob phase, so steps land with the camera. */
  step(speed: number): void {
    if (this.engine.context.state !== 'running') return;

    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;

    const at = context.currentTime + 0.005;
    const settings = MATERIALS[this.material];
    // Alternate left and right, slightly. Steps dead centre sound like one
    // foot hopping.
    this.panner.pan.setValueAtTime(this.left ? -0.22 : 0.22, at);
    this.left = !this.left;

    const source = context.createBufferSource();
    source.buffer = noise.white;

    const resonator = context.createBiquadFilter();
    resonator.type = 'bandpass';
    // Every step varies a little. Identical steps are the single most
    // recognisable artefact in game audio.
    resonator.frequency.value = settings.frequency * (0.85 + Math.random() * 0.3);
    resonator.Q.value = settings.q;

    const thud = context.createBiquadFilter();
    thud.type = 'lowpass';
    thud.frequency.value = 170;
    const thudGain = context.createGain();
    thudGain.gain.value = settings.body;

    const envelope = context.createGain();
    // Running lands harder than walking, but not proportionally — the ear
    // reads loudness logarithmically and a linear map sounds like stomping.
    const force = settings.gain * (0.55 + Math.min(speed / 6, 1) * 0.6);
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(force, at + 0.002);
    envelope.gain.setTargetAtTime(0, at + 0.002, settings.decay);

    source.connect(resonator).connect(envelope);
    source.connect(thud).connect(thudGain).connect(envelope);
    envelope.connect(this.output);

    source.start(at, Math.random() * 3, 0.5);
    source.stop(at + 0.55);
  }

  private left = false;

  dispose(): void {
    this.output.disconnect();
    this.panner.disconnect();
  }
}
