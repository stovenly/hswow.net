import type { AudioEngine } from '../AudioEngine';
import { createModalBank } from '../dsp/modal';
import { strike } from '../dsp/envelopes';
import { thump } from '../dsp/impact';
import { createClatter } from '../oneshots/clatter';
import {
  SURFACES,
  surfaceChain,
  strikeSurface,
  type Contact,
  type Gesture,
  type SurfaceChain,
  type SurfaceName,
} from './footsteps';
import { HANDLING } from '../../art/inhand';
import { builderByName } from '../../art/registry';
import type { Item } from '../../world/items';

/**
 * The pack's hand gestures: take, put down, equip, unequip, and the tool
 * swing. Voiced by striking the footstep surface `art/inhand.ts` declares for
 * the item, so a pail sounds like the metal a boot would find; the abstract
 * two-tick pair is the fallback where nothing says. First-person: routed to
 * the steps bus and never spatialised, so they belong to the hands rather
 * than to a place.
 */

/** Seconds between the two ticks of a handling gesture. */
const TICK_GAP = 0.035;

/** Audio needs no determinism; nothing here is stored by seed. */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function surfaceOf(item?: Item | null): SurfaceName | null {
  if (!item?.builder) return null;
  return HANDLING[item.builder] ?? null;
}

function toneOf(item?: Item | null): number {
  return toneOfBuilder(item?.builder);
}

/** Above 1 is smaller and brighter — the inverse of the builder's stated radius, metres. */
function toneOfBuilder(builder?: string): number {
  const radius = builder ? builderByName(builder)?.radius : undefined;
  if (!radius) return 1;
  return Math.min(1.3, Math.max(0.85, 0.3 / Math.max(radius, 0.1)));
}

/** A hand's contact at rest: every field a multiplier on the surface, as a footfall's is. */
const TOUCH: Contact = { at: 0, level: 1, stretch: 1, modes: 1, grit: 1, tone: 1 };

export class ItemAudio {
  /** The hands' output, persistent because the surface chains ring down into it. */
  private readonly hand: GainNode;
  private readonly chains = new Map<SurfaceName, SurfaceChain>();

  constructor(private readonly engine: AudioEngine) {
    const context = engine.context;
    this.hand = context.createGain();
    this.hand.gain.value = 1;
    const send = context.createGain();
    send.gain.value = 0.35;
    this.hand.connect(engine.steps);
    this.hand.connect(send);
    send.connect(engine.send);
  }

  /** Lifted out of the world: a light draw across what it is made of, or the rising ticks where nothing says. */
  pickup(item?: Item | null): void {
    const surface = surfaceOf(item);
    if (!surface) return this.pair(540, 1080, 0.36, 0.12);
    this.touch(surface, rand(0.4, 0.5), 0.4, [
      { ...TOUCH, level: 0.8, stretch: 1.5, modes: 0.55, grit: 1.2, tone: toneOf(item) },
    ]);
  }

  /** The seat of a slot: one firm contact in the item's own voice. */
  equip(item?: Item | null): void {
    const surface = surfaceOf(item);
    if (!surface) return this.pair(1050, 480, 0.45, 0.3);
    this.touch(surface, rand(0.65, 0.8), 0.15, [{ ...TOUCH, tone: toneOf(item) }]);
  }

  /** Out of the slot and back in the pack: smaller, and softer. */
  unequip(item?: Item | null): void {
    const surface = surfaceOf(item);
    if (!surface) return this.pair(760, 400, 0.26, 0.1);
    this.touch(surface, rand(0.32, 0.42), 0.25, [
      { ...TOUCH, level: 0.8, stretch: 1.3, modes: 0.5, tone: toneOf(item) },
    ]);
  }

  /** Set down without much care: the landing's two-contact shape on the item's surface. */
  drop(item?: Item | null): void {
    const surface = surfaceOf(item);
    if (!surface) return this.clatterDrop();
    const tone = toneOf(item);
    this.touch(surface, rand(0.55, 0.7), 0.25, [
      { ...TOUCH, tone },
      { ...TOUCH, at: 1, level: rand(0.4, 0.55), modes: 0.7, grit: 1.3, tone: tone * 0.95 },
    ]);
  }

  /**
   * A lid drawn back: the drop's shape reversed — a long shear-heavy scrape of
   * the container's material first, then the light settle of it coming to rest.
   */
  open(kind: string): void {
    const surface = HANDLING[kind] ?? null;
    if (!surface) return this.pair(480, 700, 0.3, 0.15);
    const tone = toneOfBuilder(kind);
    this.touch(
      surface,
      rand(2.1, 2.55),
      0.85,
      [
        { ...TOUCH, level: 0.55, stretch: 2.6, modes: 0.35, grit: 1.5, tone: tone * 1.05 },
        { ...TOUCH, at: 1, level: rand(0.35, 0.5), stretch: 0.9, modes: 0.8, grit: 0.8, tone: tone * 0.95 },
      ],
      rand(0.09, 0.14),
    );
  }

  /** Hand contacts on a footstep surface — the same strike a boot gets, sized by the gesture. */
  private touch(
    name: SurfaceName,
    weight: number,
    drag: number,
    contacts: readonly Contact[],
    gap = rand(0.015, 0.035),
  ): void {
    if (!this.live()) return;
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;
    const surface = SURFACES[name];
    let chain = this.chains.get(name);
    if (!chain) {
      chain = surfaceChain(context, surface, this.hand);
      this.chains.set(name, chain);
    }
    const gesture: Gesture = {
      at: context.currentTime + 0.02,
      gap,
      force: surface.level * weight,
      drag,
    };
    for (const contact of contacts) {
      strikeSurface(context, noise.white, this.hand, chain, surface, gesture, contact);
    }
  }

  /** The builderless fallback: a small wooden clatter, as ever. */
  private clatterDrop(): void {
    if (!this.live()) return;
    const context = this.engine.context;
    const clatter = createClatter(this.engine, {
      material: 'wood',
      pieces: 4,
      heft: 0.7,
      gain: 0.38,
    });
    const send = context.createGain();
    send.gain.value = 0.35;
    clatter.output.connect(this.engine.steps);
    clatter.output.connect(send);
    send.connect(this.engine.send);
    const tail = clatter.fire(context.currentTime + 0.02, rand(0.7, 0.95));
    window.setTimeout(() => {
      clatter.dispose();
      send.disconnect();
    }, tail * 1000 + 250);
  }

  /** Air over the shoulder: one bandpass sweep, felt more than pitched. */
  swing(): void {
    if (!this.live()) return;
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;
    const at = context.currentTime + 0.02;
    const nodes: AudioNode[] = [];
    const output = this.out(0.32, 0.25, nodes);

    const source = context.createBufferSource();
    source.buffer = noise.white;
    source.playbackRate.value = rand(0.9, 1.1);

    const envelope = context.createGain();
    strike(envelope.gain, at, 0.55, 0.06, 0.14);

    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.1;
    filter.frequency.setValueAtTime(360, at);
    filter.frequency.exponentialRampToValueAtTime(1400 * rand(0.9, 1.1), at + 0.2);

    source.connect(envelope).connect(filter).connect(output);
    source.start(at, rand(0, noise.white.duration - 1), 0.5);
    source.stop(at + 0.55);
    nodes.push(source, envelope, filter);

    window.setTimeout(
      () => {
        for (const node of nodes) node.disconnect();
      },
      (at - context.currentTime + 0.7) * 1000,
    );
  }

  private live(): boolean {
    return this.engine.context.state === 'running' && this.engine.noise !== null;
  }

  /**
   * Two ticks a hand-width apart — the whole vocabulary of handling. Which way
   * the pitch steps is the meaning: up is away from the world, down is seated.
   */
  private pair(fromHz: number, toHz: number, level: number, weight: number): void {
    if (!this.live()) return;
    const context = this.engine.context;
    const at = context.currentTime + 0.02;
    const nodes: AudioNode[] = [];
    const output = this.out(level, 0.3, nodes);

    const bank = createModalBank(
      context,
      [
        { hz: fromHz * rand(0.95, 1.05), decay: 0.045, q: 7, level: 1 },
        { hz: toHz * rand(0.95, 1.05), decay: 0.06, q: 8, level: 0.8 },
      ],
      output,
    );
    this.excite(bank.inputs[0], 1, at, nodes);
    this.excite(bank.inputs[1], 0.8, at + TICK_GAP, nodes);
    if (weight > 0) thump(context, output, at, weight, 130, 95, 0.07, 0.003);

    window.setTimeout(
      () => {
        for (const node of nodes) node.disconnect();
        bank.dispose();
      },
      (at - context.currentTime + 0.5) * 1000,
    );
  }

  private out(level: number, roomSend: number, nodes: AudioNode[]): GainNode {
    const context = this.engine.context;
    const output = context.createGain();
    output.gain.value = level;
    const send = context.createGain();
    send.gain.value = roomSend;
    output.connect(this.engine.steps);
    output.connect(send);
    send.connect(this.engine.send);
    nodes.push(output, send);
    return output;
  }

  /** A decaying burst of noise into one resonator input — the door's excite. */
  private excite(target: AudioNode, level: number, at: number, nodes: AudioNode[]): void {
    const context = this.engine.context;
    const noise = this.engine.noise;
    if (!noise) return;
    const source = context.createBufferSource();
    source.buffer = noise.white;
    source.playbackRate.value = rand(0.9, 1.1);
    const envelope = context.createGain();
    strike(envelope.gain, at, level, 0.0008, 0.02);
    source.connect(envelope).connect(target);
    source.start(at, rand(0, noise.white.duration - 1), 0.12);
    source.stop(at + 0.13);
    nodes.push(source, envelope);
  }
}
