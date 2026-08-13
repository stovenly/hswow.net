import type { AudioEngine } from '../../AudioEngine';
import type { MusicVoice } from '../director';
import type { Instrument } from './voice';
import { createStrings } from './strings';
import { createBrass, createTrumpet, createTuba } from './brass';
import { createFlute, createOcarina, createPipe } from './flute';
import { createGlass } from './glass';
import { createHum } from './hum';
import { createChoir, createMonks } from './choir';
import { createBass } from './bass';
import { createBells } from './bell';
import { createPluck, createHarp, createDulcimer } from './pluck';
import { createGuitar } from './guitar';
import { createAccordion, createOrgan, createHarmonica } from './reeds';
import { createFiddle, createSaw, createViol } from './bowed';
import { createGurdy } from './gurdy';
import { createWhistler } from './whistler';
import { createBanjo } from './banjo';
import { createJawHarp } from './jawharp';
import { createWaterphone } from './waterphone';
import {
  createMusicBox,
  createKalimba,
  createTongueDrum,
  createMarimba,
  createChimes,
  createAnvil,
  createOilDrum,
  createVibraphone,
  createDeepDrum,
} from './struck';
import { createKick, createSnare, createHat } from './drums';

/**
 * The one voice registry. The director builds racks through it and the music
 * stage builds its bench through it, so a voice name means the same
 * instrument everywhere and a new name is added in exactly one place.
 *
 * The role is the register of intent: a drone wants the slow front, an upper
 * stratum speaks sooner, and the bench takes every default so the stage
 * flatters nothing.
 */

export type BenchVoice = MusicVoice | 'kick' | 'snare' | 'hat';
export type VoiceRole = 'drone' | 'upper' | 'bench';

export function buildVoice(
  engine: AudioEngine,
  name: BenchVoice,
  role: VoiceRole = 'bench',
): Instrument {
  const slow = role === 'drone';
  const upper = role === 'upper';
  switch (name) {
    case 'strings':
      return createStrings(
        engine,
        slow ? { attack: 2, release: 3 } : upper ? { attack: 0.4, release: 1.2 } : {},
      );
    case 'brass':
      return createBrass(engine, slow ? { attack: 0.8, release: 1.5 } : {});
    case 'trumpet':
      return createTrumpet(engine, slow ? { attack: 0.5, release: 1 } : {});
    case 'tuba':
      return createTuba(engine, slow ? { attack: 0.6, release: 1.2 } : {});
    case 'flute':
      return createFlute(engine, slow ? { attack: 0.6, release: 1.2 } : {});
    case 'ocarina':
      return createOcarina(engine, slow ? { attack: 0.5, release: 1 } : {});
    case 'choir':
      return createChoir(engine, slow ? { release: 2 } : {});
    case 'monks':
      return createMonks(engine, slow ? { release: 2 } : {});
    case 'accordion':
      return createAccordion(engine, slow ? { attack: 0.5, release: 1 } : {});
    case 'organ':
      return createOrgan(engine, slow ? { attack: 0.7, release: 1.2 } : {});
    case 'bass':
      return createBass(engine, slow ? { release: 1.5 } : upper ? { release: 0.5, sweep: true } : {});
    case 'bells':
      return createBells(engine);
    case 'chimes':
      return createChimes(engine);
    case 'musicbox':
      return createMusicBox(engine);
    case 'kalimba':
      return createKalimba(engine);
    case 'tonguedrum':
      return createTongueDrum(engine);
    case 'marimba':
      return createMarimba(engine);
    case 'pluck':
      return createPluck(engine, upper ? { gain: 0.3 } : {});
    case 'harp':
      return createHarp(engine, upper ? { gain: 0.35 } : {});
    case 'dulcimer':
      return createDulcimer(engine, upper ? { gain: 0.3 } : {});
    case 'guitar':
      return createGuitar(engine);
    case 'anvil':
      return createAnvil(engine);
    case 'oildrum':
      return createOilDrum(engine);
    case 'vibraphone':
      return createVibraphone(engine);
    case 'glass':
      return createGlass(engine, slow ? { attack: 3.5, release: 3 } : {});
    case 'hum':
      return createHum(engine, slow ? { attack: 1.4, release: 2 } : {});
    case 'pipe':
      return createPipe(engine, slow ? { attack: 0.8, release: 1.4 } : {});
    case 'fiddle':
      return createFiddle(engine, slow ? { attack: 0.6, release: 1.2 } : {});
    case 'gurdy':
      return createGurdy(engine, slow ? { attack: 0.8, release: 1.5 } : {});
    case 'saw':
      return createSaw(engine, slow ? { attack: 0.8, release: 1.6 } : {});
    case 'harmonica':
      return createHarmonica(engine, slow ? { attack: 0.4, release: 0.8 } : {});
    case 'viol':
      return createViol(engine, slow ? { attack: 1.6, release: 2.4 } : {});
    case 'whistler':
      return createWhistler(engine, slow ? { attack: 0.4, release: 0.8 } : {});
    case 'banjo':
      return createBanjo(engine);
    case 'jawharp':
      return createJawHarp(engine);
    case 'waterphone':
      return createWaterphone(engine, slow ? { attack: 2.2, release: 3 } : {});
    case 'deepdrum':
      return createDeepDrum(engine);
    case 'kick':
      return createKick(engine);
    case 'snare':
      return createSnare(engine);
    case 'hat':
      return createHat(engine);
  }
}
