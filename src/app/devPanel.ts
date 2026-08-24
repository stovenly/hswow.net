import * as THREE from 'three';
import type GUI from 'lil-gui';
import { fogUniforms } from '../engine/fog';
import type { SurfaceName } from '../debug/ProvingGround';
import { ZONE_GROUPS } from '../world/Zone';
import type { WindModel } from '../audio/models/wind';
import type { FoliageModel } from '../audio/models/foliage';
import type { MachineModel } from '../audio/models/machine';
import type { FireModel } from '../audio/models/fire';
import type { WaterModel } from '../audio/models/water';
import type { FrictionModel } from '../audio/models/friction';
import type { WaveguideModel } from '../audio/models/waveguide';
import { VOICE_TUNING, pushVoiceTuning, type VoiceTuning } from '../audio/voice/tuning';
import { WEATHER_KINDS } from '../world/climate';
import { DECK_LEVELS, GENERA } from '../art/glsl/clouds';
import { STAGE_STATIONS } from '../debug/SoundStage';
import { VIBES, VIBE_NAMES, musicFor, type VibeName } from '../audio/vibes';
import { AMBIENCE_VOICES } from '../audio/ambience/voices';
import type { AmbienceVoice } from '../audio/ambience/spec';
import { auditionToConsole } from '../debug/Audition';
import { createMeter } from '../debug/Meter';
import { windUniforms } from '../art/sway';
import { finishUniforms } from '../art/finish';
import { RECIPES, RECIPE_KNOBS, RECIPE_PARAMS, uploadRecipeKnobs } from '../art/recipes';
import { RAMPS, uploadRamps } from '../art/glsl/ramp';
import { setClothWindOverride, setClothFrozen } from '../engine/ClothActivity';
import { setGlitchOverride, setGlitchFrozen } from '../engine/GlitchActivity';
import { setHorrorOverride, setHorrorFrozen } from '../engine/HorrorActivity';
import { voiceLabels } from '../debug/VoiceLabel';
import { attachFaustPanel } from '../debug/FaustPanel';
import { READING_FIXTURES } from '../debug/reading-fixtures';
import { NOTES } from '../content/notes';
import type { App } from './boot';

/**
 * Every tuning folder the game has, mounted into whichever GUI is passed. The
 * game hands it the `?debug` panel; the editor hands it its own.
 */
export function installDevPanel(gui: GUI, app: App): void {
  const { viewport, postfx, collider, player, zones, audio, climate, weather, options, settings, reading, provingGround, loop } =
    app;
/** Read back into the panel each frame. The climate names the sky; nobody sets it. */
const deckNames = { high: '—', mid: '—', low: '—' };
/** What the pickers call handing the choice back to the day. */
const ROLLED = 'as the day rolls it';
/** And holding a deck slot empty, which is not the same answer. */
const CLEAR = 'none';

/** The panel's per-deck genus pickers. */
const deckHold: Record<string, { genus: string; amount: number }> = {
  high: { genus: 'as the day rolls it', amount: 0.8 },
  mid: { genus: 'as the day rolls it', amount: 0.8 },
  low: { genus: 'as the day rolls it', amount: 0.8 },
};

/** The panel's moon slider, and whether it is driving or reporting. */
const moonHold = { on: false, phase: 0.5 };

/** What the last strike was, and how far off its peal still is. */
const strikeReadout = { lightning: 'none' };
/** The fog the zone and the weather settled on this frame, for the climate panel. */
const fogReadout = { fog: '' };
/** The fog folder's distances: reporting the zone's, or holding over them. */
const fogHold = { on: false, near: 25, far: 140 };

/** The panel's weather sliders, and whether they are driving or reporting. */
const weatherHold = { on: false };
const weatherLevels: Record<string, number> = {};
for (const kind of WEATHER_KINDS) weatherLevels[kind.name] = 0;

/**
 * Base leaf articulation per foliage emitter, so one slider can scale them all.
 * Read off the specs rather than guessed: a hedge ticks where a canopy hushes,
 * and one absolute value applied to both flattens that distinction.
 *
 * Looked up by id against whatever zone is current, so entries for a zone you
 * are not standing in simply find nothing.
 */
const FOLIAGE_BASE = new Map<string, number>([
  ['canopy', 0.22],
  ['foliage', 0.4],
  ['shrub-a', 0.34],
  ['shrub-b', 0.34],
  ['wood-north', 0.2],
  ['wood-east', 0.22],
  ['hedge', 0.34],
]);

  const r = postfx.settings;
  const refresh = (): void => postfx.apply();

  // Dev-only, and held here rather than in the settings because it is a switch
  // on the pass rather than a value in the preset — the same shape the fog
  // volumes' dev toggle has.
  const particleState = {
    enabled: true,
    apply: (): void => postfx.setParticles(particleState.enabled),
  };

  // At the top and outside any folder, because it is the one control here that
  // changes what the world *is* rather than how it looks, and the one most
  // often reached for.
  gui.add(player, 'noclip').name('noclip fly');
  gui.add({ identify: () => app.identify.start(app.clock) }, 'identify').name('identify mesh');

  const look = gui.addFolder('look');
  // The same boolean the options menu edits, not a parallel one. Bound with
  // `.listen()` so a change made in the menu moves the control here, and routed
  // through `commit` so it lands in the engine and in storage the same way.
  look.add(options, 'shadows').name('cast shadows').listen().onChange(settings.commit);
  look.add({ open: settings.open }, 'open').name("open the player's menu");
  look.add(r, 'pixelSize', 1, 12, 1).onChange(refresh);
  // The player's switch is in the options menu; this is how many. Clamped to
  // what the driver offers, so the top of the slider may not be reachable —
  // and under 2 it is off, which is what the switch is for.
  look.add(options, 'antialias').listen().onChange(settings.commit);
  look.add(r, 'samples', 0, 8, 1).onChange(refresh);
  // The other half, and the half samples cannot buy: fine detail dissolving
  // into its surroundings once a pixel is too coarse to resolve it. Counted in
  // pixels per feature, so it is independent of resolution and view distance.
  look.add(r.detail, 'start', 0.25, 4, 0.05).name('detail fade start').onChange(refresh);
  // Ceiling well above the default of 16, which is where it sits after being
  // dialled in — a slider whose default is its own maximum can only go one way.
  look.add(r.detail, 'span', 1, 48, 0.5).name('detail fade span').onChange(refresh);
  look.add(r, 'quantize', ['off', 'levels']).onChange(refresh);
  // Up to 64. The output is eight bits a channel, so past there the steps are
  // finer than the display and the quantizer stops being visible at all —
  // which is what `quantize: off` is for.
  look.add(r, 'levels', 2, 64, 1).onChange(refresh);
  // Counted in *steps*, so what it does on screen depends on `levels` — at 32
  // a step is half as wide as at 16, and the same number here spreads the
  // dither across half as much colour. Ceiling raised to match.
  look.add(r, 'ditherScale', 0, 4, 0.05).name('dither (steps)').onChange(refresh);
  // Counted in chunky pixels, so this and `pixelSize` multiply — a period of 4
  // at pixel size 3 is the same size on screen as 3 at pixel size 4.
  look.add(r, 'screenPeriod', 2, 32, 1).name('screen period').onChange(refresh);

  // The same switch the options menu edits, plus the tuning the menu does not
  // show — the player's switch, the developer's dials, one folder.
  const ao = gui.addFolder('ambient occlusion');
  ao.add(options, 'ambientOcclusion').name('enabled').listen().onChange(settings.commit);
  ao.add(r.ao, 'strength', 0, 1, 0.05).onChange(refresh);
  ao.add(r.ao, 'radius', 0.1, 2, 0.05).name('radius (m)').onChange(refresh);

  // The same switch the options menu edits, plus the tuning it does not show.
  const bloom = gui.addFolder('bloom');
  bloom.add(options, 'bloom').name('enabled').listen().onChange(settings.commit);
  bloom.add(r.bloom, 'strength', 0, 2, 0.05).onChange(refresh);
  bloom.add(r.bloom, 'radius', 0.25, 4, 0.05).onChange(refresh);

  // Dev-only, like the fog volumes: a finish is what a prop is made of. The
  // profiles themselves live in `FINISHES`; these scale the two lobes globally.
  const finishState = {
    enabled: true,
    // The recipes, separately. Off leaves the finish they are added to,
    // which is the only useful thing to compare them against — see
    // `PostFX.setRecipes`.
    recipes: true,
    apply: (): void => {
      postfx.setFinish(finishState.enabled);
      postfx.setRecipes(finishState.recipes);
    },
  };
  const finishFolder = gui.addFolder('material finish');
  finishFolder.add(finishState, 'enabled').onChange(finishState.apply);
  finishFolder.add(finishState, 'recipes').name('recipes').onChange(finishState.apply);
  finishFolder.add(r.finish, 'specular', 0, 2, 0.05).onChange(refresh);
  finishFolder.add(r.finish, 'environment', 0, 2, 0.05).onChange(refresh);

  // Every look, under the field whose shader it drives. Nothing in here
  // recompiles: the knobs and the params are uniform table rows.
  //
  // **The params are where a new colorway gets designed.** Drag them with the
  // ramp folder open beside this one and what comes out is a table row.
  const lookFolder = finishFolder.addFolder('recipe looks').close();
  for (const recipe of RECIPES) {
    const field = lookFolder.addFolder(recipe.name).close();
    for (const variant of recipe.variants) {
      const knobs = RECIPE_KNOBS[variant.name];
      // Indexed by position, so lil-gui writes straight into the row the
      // uploader reads. The labels come from the field, because `p1` on a
      // slider is a number nobody can check.
      const params = RECIPE_PARAMS[variant.name] as unknown as Record<string, number>;
      const row = field.addFolder(variant.name).close();
      row.add(knobs, 'gloss', 0, 1, 0.01).onChange(uploadRecipeKnobs);
      row.add(knobs, 'rim', 0, 1, 0.01).onChange(uploadRecipeKnobs);
      row.add(knobs, 'sunGlare', 0, 1, 0.01).name('sun glare').onChange(uploadRecipeKnobs);
      row.add(knobs, 'envGain', 0, 2, 0.01).name('env gain').onChange(uploadRecipeKnobs);
      recipe.params.forEach((label, i) => {
        row.add(params, String(i), 0, 4, 0.01).name(label).onChange(uploadRecipeKnobs);
      });
    }
  }

  // The colour tables. A stop arrives over a window of t and is mixed over
  // everything before it, so the windows overlap on purpose — dragging one
  // start past the previous end opens a gap where the ramp holds one colour.
  const rampFolder = finishFolder.addFolder('ramps').close();
  for (const ramp of RAMPS) {
    const row = rampFolder.addFolder(ramp.name).close();
    row.addColor(ramp, 'base').onChange(uploadRamps);
    row.add(ramp, 'grey', 0, 1, 0.01).name('toward grey').onChange(uploadRamps);
    ramp.stops.forEach((stop, i) => {
      const at = row.addFolder(`stop ${i + 1}`).close();
      at.addColor(stop, 'rgb').name('colour').onChange(uploadRamps);
      at.add(stop, 'start', 0, 1, 0.01).onChange(uploadRamps);
      at.add(stop, 'end', 0, 1, 0.01).onChange(uploadRamps);
    });
  }

  // Not in the player's menu: a pond is part of the place. Both of these are
  // global because water is one material — how rough a particular pool is rides
  // on the geometry. See `art/water.ts`.
  const water = gui.addFolder('water');
  water.add(r.water, 'waves', 0, 2, 0.05).onChange(refresh);
  water
    .add(r.water, 'reflections')
    .name('screen-space reflections')
    .onChange(refresh);

  // Dev-only for water's reason — a crystal is part of the place. The recipes
  // live in `GLASSES`; this scales how far the image behind is bent, and the
  // march rides water's own switch above rather than growing a second one.
  const glass = gui.addFolder('glass');
  glass.add(r.glass, 'refraction', 0, 2, 0.05).onChange(refresh);

  // The player has one dropdown; the shape is tuned here, as multipliers over
  // the type table in world/ground.ts, which is authored in real units.
  const cover = gui.addFolder('groundcover');
  cover
    .add(options, 'groundcoverDensity', ['low', 'medium', 'high', 'ultra'])
    .name('player setting')
    .listen()
    .onChange(settings.commit);
  cover.add(r.cover, 'density', 0, 1, 0.05).name('fraction drawn').onChange(refresh);
  cover.add(r.cover, 'height', 0.25, 2, 0.05).onChange(refresh);
  cover.add(r.cover, 'width', 0.25, 3, 0.05).onChange(refresh);
  // Distance LOD. Per blade and stochastic, never per pixel — see `art/cover.ts`.
  const lod = cover.addFolder('distance');
  lod.add(r.cover.lod, 'blades', 0.25, 8, 0.05).name('blades per pixel').onChange(refresh);
  lod.add(r.cover.lod, 'grazing', 0, 1, 0.05).name('by view angle').onChange(refresh);
  lod.add(r.cover.lod, 'sprout', 0, 0.6, 0.01).name('sprout band').onChange(refresh);
  lod.add(r.cover.lod, 'sheen', -0.6, 0.6, 0.01).name('far wind sheen').onChange(refresh);
  lod.add(r.cover.lod, 'swapAt', 0, 80, 1).name('one triangle past (m)').onChange(refresh);

  // No player video option here on purpose — snow in a snowy zone is the place,
  // like a pond or a mist pool (PARTICLES.md §8). What the player does get is
  // the accessibility switch, which is in the menu beside head bob.
  const particles = gui.addFolder('particles');
  particles.add(particleState, 'enabled').name('draw particles').onChange(particleState.apply);
  particles
    .add(options, 'precipitation')
    .name('player: precipitation')
    .listen()
    .onChange(settings.commit);
  particles.add(r.particles, 'density', 0, 1, 0.05).name('fraction drawn').onChange(refresh);
  particles.add(r.particles, 'size', 0.25, 3, 0.05).onChange(refresh);
  // In seconds. A streak is `speed × shutter`, so this is the one knob that
  // decides whether rain reads as rain or as falling dots.
  particles.add(r.particles, 'shutter', 0, 0.05, 0.001).name('shutter (s)').onChange(refresh);

  // The player's slider, and the one number behind it they do not get: how far
  // inside the view distance the grass stops. See VIEW-DISTANCE.md.
  const distance = gui.addFolder('view distance');
  distance
    .add(options, 'viewDistance', 40, 300, 20)
    .name('metres (300 = off)')
    .listen()
    .onChange(settings.commit);
  distance.add(r, 'clutterCull', 0.3, 1, 0.05).name('clutter at ×').onChange(refresh);

  // Inspection state, session-only and deliberately not a player setting: with
  // parallax live, walking slides the band under the prop being looked at, so
  // there is no way to tell a placement that is wrong from one that is merely
  // moving.
  const vista = gui.addFolder('vista');
  vista.add(zones, 'freezeVista').name('freeze parallax');
  // Not vista-only despite living here: it reveals any collision that is never
  // drawn, a stair's walkway included. See `ZoneManager.showBarriers`.
  vista.add(zones, 'showBarriers').name('show invisible walls');

  // Shape only. Every colour in the sky comes off the sun's elevation and is a
  // row of the table in `engine/atmosphere.ts`.
  const sky = gui.addFolder('sky');
  sky.add(r.sky, 'curve', 0.1, 3, 0.05).name('curve up').onChange(refresh);
  sky.add(r.sky, 'underCurve', 0.1, 4, 0.05).name('curve down').onChange(refresh);
  // The fog's own, and nothing to do with the two above — see `SkySettings.airCurve`.
  // Below about 2 distant props start taking a blue ramp that matches the sky
  // behind them, and go see-through.
  sky.add(r.sky, 'airCurve', 0.3, 6, 0.1).name('curve for fog').onChange(refresh);

  sky.add(r.sky, 'moonSize', 0.2, 4, 0.05).name('moon radius (deg)').onChange(refresh);

  const clouds = gui.addFolder('sky clouds');
  clouds.add(r.sky, 'cloudOpacity', 0, 1, 0.01).name('opacity').onChange(refresh);
  clouds.add(r.sky, 'cloudDrift', 0, 2, 0.02).name('drift').onChange(refresh);
  clouds.add(r, 'cloudShadow', 0, 1, 0.02).name('shadow on ground').onChange(refresh);
  clouds.add(r.sky, 'cloudHaze', 0, 0.5, 0.005).name('haze into horizon').onChange(refresh);
  // Which genus is overhead is the climate's to decide; the readout names what
  // it chose, so a sky can be identified without guessing at it.
  for (const level of ['high', 'mid', 'low'] as const) {
    clouds.add(deckNames, level).name(level).listen().disable();
  }

  // Owned by the zone manager and overwritten on every crossing, so these are
  // for looking at a zone's lighting rather than for dialling one in — that
  // belongs in the zone's environment, in data.
  const lights = gui.addFolder('light').close();
  lights.add(zones.lights.sun, 'intensity', 0, 5, 0.1).name('sun');
  lights.add(zones.lights.ambient, 'intensity', 0, 5, 0.1).name('ambient');

  // Placed volumes, as opposed to the distance fog below. Only a switch, and
  // deliberately: a volume's density, tint and size belong to the zone that
  // placed it, so there is nothing global here to tune. Not in the player's
  // menu either; see `PostFX.setFogVolumes`.
  const volumetric = { enabled: true };
  const fogVolumes = gui.addFolder('fog volumes');
  fogVolumes
    .add(volumetric, 'enabled')
    .name('enabled')
    .onChange(() => postfx.setFogVolumes(volumetric.enabled));

  const fogFolder = gui.addFolder('fog').close();
  fogFolder.add(r, 'linkFogToSky').name('match horizon').onChange(refresh);
  fogFolder.addColor(r, 'fogColor').onChange(refresh);
  // Off, the distances read back what the zone set. On, they are the fog,
  // until released.
  fogFolder
    .add(fogHold, 'on')
    .name('hold the zone fog')
    .listen()
    .onChange((on: boolean) => postfx.holdFog(on ? fogHold : null));
  const holdFogNow = (): void => {
    fogHold.on = true;
    postfx.holdFog(fogHold);
  };
  fogFolder.add(fogHold, 'near', 0, 200, 1).listen().onChange(holdFogNow);
  fogFolder.add(fogHold, 'far', 0, 400, 1).listen().onChange(holdFogNow);
  // Aerial perspective — see `engine/fog.ts`. `sky colour` at 0 and `thins
  // above` at its ceiling is flat distance fog, exactly, which is the honest
  // A/B for whether any of it is an improvement.
  //
  // The low end of this range is not a setting, it is a demonstration: under a
  // hundred or so, distant props visibly fade out from the bottom.
  fogFolder.add(r, 'fogHeight', 20, 1200, 10).name('thins above (m)').onChange(refresh);
  fogFolder.add(r, 'fogSky', 0, 1, 0.05).name('sky colour').onChange(refresh);
  fogFolder.add(r, 'fogRamp', 0.5, 4, 0.1).name('curve').onChange(refresh);
  fogFolder.add(r, 'fogCeiling', 0.5, 1, 0.01).name('most it can hide').onChange(refresh);

  // Surface colours, live. Contrast between the floor and everything standing
  // on it is a quantization question as much as an art one, so it wants to be
  // adjustable against the filters rather than guessed at in a constant.
  const surfaces = gui.addFolder('surfaces').close();
  for (const name of Object.keys(provingGround.colors) as SurfaceName[]) {
    surfaces.addColor(provingGround.colors, name).onChange(() => provingGround.applyColors());
  }
  surfaces.add(
    {
      reset: () => {
        provingGround.resetColors();
        gui.controllersRecursive().forEach((c) => c.updateDisplay());
      },
    },
    'reset',
  );

  const preset = gui.addFolder('preset');
  preset.add(
    {
      save: () => {
        const ok = postfx.save();
        preset.title(ok ? 'preset · saved' : 'preset · SAVE FAILED');
      },
    },
    'save',
  );
  preset.add(
    {
      reset: () => {
        postfx.reset();
        gui.controllersRecursive().forEach((c) => c.updateDisplay());
      },
    },
    'reset',
  );
  preset.add(
    {
      copy: () => {
        void navigator.clipboard?.writeText(JSON.stringify(postfx.settings, null, 2));
      },
    },
    'copy',
  ).name('copy JSON');

  const t = player.tuning;
  const move = gui.addFolder('player movement');
  move.add(t, 'walkSpeed', 1, 12, 0.1);
  move.add(t, 'sprintScale', 1, 3, 0.05);
  move.add(t, 'groundAccel', 1, 60, 0.5);
  move.add(t, 'airAccel', 0, 20, 0.1);
  move.add(t, 'friction', 0, 30, 0.5);
  move.add(t, 'gravity', 5, 60, 0.5);
  move.add(t, 'jumpSpeed', 2, 14, 0.1);
  move.add(t, 'autoHop');

  const contact = gui.addFolder('player contact').close();
  contact.add(t, 'slopeLimitDeg', 5, 85, 1);
  contact.add(t, 'stepHeight', 0, 1, 0.01);
  contact.add(t, 'coyoteTime', 0, 0.5, 0.01);
  contact.add(t, 'jumpBuffer', 0, 0.5, 0.01);

  const view = gui.addFolder('player view');
  view.add(t, 'lookSensitivity', 0.0002, 0.008, 0.0001);
  view.add(t, 'invertY');
  view.add(t, 'eyeHeight', 1, 2, 0.01);
  view.add(t, 'fov', 50, 110, 1);
  view.add(t, 'sprintFovBoost', 0, 30, 1).name('sprint fov +');

  const bob = gui.addFolder('player head bob').close();
  bob.add(t, 'bobAmount', 0, 0.15, 0.001);
  bob.add(t, 'bobSway', 0, 0.15, 0.001);
  bob.add(t, 'bobRoll', 0, 0.05, 0.0005);
  bob.add(t, 'bobStepsPerSecond', 0.5, 5, 0.05);
  bob.add(t, 'bobSpeedInfluence', 0, 1, 0.05);
  bob.add(t, 'landDip', 0, 0.1, 0.001);

  const sound = gui.addFolder('audio');
  sound.add(audio.settings, 'masterVolume', 0, 1, 0.01).name('volume');
  sound.add(audio.settings, 'musicVolume', 0, 1, 0.01).name('music');
  sound.add(audio.settings, 'ambienceVolume', 0, 1, 0.01).name('ambience');
  sound.add(audio.settings, 'weatherVolume', 0, 1, 0.01).name('weather');
  sound.add(audio.settings, 'footstepVolume', 0, 1, 0.01).name('footsteps');
  sound.add(audio.settings, 'creatureVolume', 0, 1, 0.01).name('creatures');
  sound.add(audio.settings, 'npcVolume', 0, 1, 0.01).name('voices');
  sound
    .add(audio.settings, 'reverbAmount', 0, 2, 0.01)
    .name('reverb')
    .onChange(() => audio.applyReverbAmount());
  sound.add(audio.settings, 'airAbsorption', 0, 1, 0.01).name('air absorption');
  sound.add(audio.settings, 'occlusion', 0, 1, 0.01).name('occlusion');

  // The throat, live, on every villager at once. These are the numbers that
  // decide how a voice *sounds*, and they cannot be reasoned to — so they move
  // while it is talking and the ear picks. Whatever sticks goes into
  // `villagerBody`. The top four change how bright it is.
  const throat = gui.addFolder('voice');
  const dial = (key: keyof VoiceTuning, min: number, max: number, step: number, label: string): void => {
    throat.add(VOICE_TUNING, key, min, max, step).name(label).onChange(() => pushVoiceTuning(key));
  };
  dial('head', 0.15, 1, 0.01, 'head lowpass (1 = off)');
  dial('rdBias', -0.5, 1, 0.01, 'Rd bias (up = darker)');
  dial('wallDamp', 0.2, 1, 0.01, 'wall damp (1 = off)');
  dial('wallLoss', 0.99, 1, 0.0002, 'wall loss');
  dial('glottalReflect', 0.4, 0.98, 0.01, 'glottal reflect');
  dial('lipReflect', -0.98, -0.4, 0.01, 'lip reflect');
  dial('aspiration', 0, 1, 0.01, 'aspiration');
  dial('turbulence', 0, 1.5, 0.01, 'turbulence');
  dial('gain', 0.05, 1.5, 0.01, 'model gain');
  throat.add(voiceLabels, 'on').name('dialogue labels');

  // The clock, and one hold per registered kind. A hold overrides the field; the
  // release beside it hands the day back to the climate.
  const climateFolder = gui.addFolder('climate');
  climateFolder
    .add(climate, 'timeOfDay', 0, 1, 0.001)
    .name('time of day')
    .listen()
    .onChange((value: number) => {
      climate.scrubbing = true;
      climate.setTimeOfDay(value);
    })
    .onFinishChange(() => {
      climate.scrubbing = false;
    });
  climateFolder.add(climate, 'frozen').name('hold the clock');
  climateFolder.add(climate, 'day', 0, 200, 1).name('day').listen();
  climateFolder.add(climate.settings, 'dayLength', 60, 3600, 10).name('day length (s)');
  climateFolder.add(climate.settings, 'yearLength', 8, 365, 1).name('year (days)');
  climateFolder.add(climate.settings, 'latitude', 0, 70, 1).name('latitude');
  climateFolder.add(climate.settings, 'moonMonth', 2, 60, 0.5).name('month (days)');
  // Off, the slider reads back where the month has got to. On, it is the phase,
  // and the moon moves in the sky to match — a full moon stands opposite the sun.
  climateFolder
    .add(moonHold, 'on')
    .name('hold the moon')
    .listen()
    .onChange((on: boolean) => climate.holdMoon(on ? moonHold.phase : null));
  climateFolder
    .add(moonHold, 'phase', 0, 1, 0.005)
    .name('moon phase')
    .listen()
    .onChange((value: number) => {
      moonHold.on = true;
      climate.holdMoon(value);
    });
  climateFolder.add(climate.settings, 'baseWind', 0, 1, 0.01).name('baseline wind');
  climateFolder.add(climate.settings, 'pace', 0.1, 20, 0.1).name('weather pace');
  // Off, the sliders read back what the climate decided. On, they *are* what
  // the weather is — including zero, which is the whole reason the toggle
  // exists: a slider that means nothing at one end is not a control.
  climateFolder
    .add(weatherHold, 'on')
    .name('hold the weather')
    .listen()
    .onChange((on: boolean) => {
      for (const kind of WEATHER_KINDS) climate.force(kind.name, on ? weatherLevels[kind.name] : null);
    });
  for (const kind of WEATHER_KINDS) {
    climateFolder
      .add(weatherLevels, kind.name, 0, 1, 0.01)
      .listen()
      .onChange((value: number) => {
        // Moving one takes the hold: otherwise the first drag does nothing and
        // the reason why is in a checkbox above it.
        weatherHold.on = true;
        climate.force(kind.name, value);
      });
  }

  climateFolder.add(strikeReadout, 'lightning').name('last strike').listen().disable();

  // What each kind does to the zone's fog, live, so a day can be tuned with
  // the weather held and the numbers carried back into `climate.ts`.
  climateFolder.add(fogReadout, 'fog').name('fog now').listen().disable();
  for (const kind of WEATHER_KINDS) {
    const air = kind.air;
    if (!air) continue;
    air.near ??= 1;
    air.far ??= 1;
    air.curve ??= 1;
    air.ceiling ??= 1;
    const airFolder = climateFolder.addFolder(`${kind.name} air`).close();
    airFolder.add(air, 'near', 0, 1, 0.01).name('near ×');
    airFolder.add(air, 'far', 0, 1, 0.01).name('far ×');
    airFolder.add(air, 'curve', 0.1, 3, 0.05).name('curve ×');
    airFolder.add(air, 'ceiling', 0.3, 1, 0.01).name('most it can hide ×');
  }

  // A kind with a palette gets a picker: what smog is made of is not a
  // constant, and which week's pollution this is should be visible and pinnable.
  for (const kind of WEATHER_KINDS) {
    if (!kind.tones || kind.tones.length === 0) continue;
    const names = [ROLLED, ...kind.tones.map((tone) => tone.name)];
    const pick = { tone: ROLLED };
    climateFolder
      .add(pick, 'tone', names)
      .name(`${kind.name} tone`)
      .onChange((value: string) => {
        const at = kind.tones ? kind.tones.findIndex((tone) => tone.name === value) : -1;
        climate.pinTone(kind.name, at < 0 ? null : at);
      });
  }

  // One picker per deck. The sky still works out what it would have chosen, so
  // letting go drops straight back into whatever the day was doing.
  for (const level of DECK_LEVELS) {
    const here = deckHold[level];
    const names = [
      ROLLED,
      CLEAR,
      ...Object.keys(GENERA).filter((n) => GENERA[n as keyof typeof GENERA].level === level),
    ];
    const pick = (genus: string, amount: number): void => {
      if (genus === ROLLED) climate.releaseDeck(level);
      else if (genus === CLEAR) climate.holdDeck(level, null, 0);
      else climate.holdDeck(level, genus as keyof typeof GENERA, amount);
    };
    climateFolder
      .add(here, 'genus', names)
      .name(`${level} deck`)
      .onChange((value: string) => pick(value, here.amount));
    climateFolder
      .add(here, 'amount', 0, 1, 0.01)
      .name(`${level} amount`)
      .onChange((value: number) => pick(here.genus, value));
  }

  // What the weather does to what it lands on. Held apart from the climate,
  // which decides *whether* it is raining; this is what raining looks like.
  const lying = gui.addFolder('weather surfaces');
  lying.addColor({ snow: '#dde5f0' }, 'snow')
    .name('snow colour')
    .onChange((value: string) => (finishUniforms.uSnowColour.value as THREE.Color).set(value));
  lying.add(finishUniforms.uSnowDepth, 'value', 0, 1, 0.02).name('snow depth');
  lying.add(finishUniforms.uFinishEnv, 'value', 0, 2, 0.05).name('sky in surfaces');

  const gusts = gui.addFolder('wind');
  gusts.add(audio.weather.settings, 'gustDepth', 0, 1, 0.01).name('gust depth');
  gusts.add(audio.weather.settings, 'gustRate', 0.01, 0.6, 0.01).name('gust rate');
  gusts
    .add(audio.weather.settings, 'windDirection', 0, Math.PI * 2, 0.01)
    .name('wind direction');
  // How fast a gust crosses the world. The control that decides whether the
  // wind reads as weather or as a global parameter being turned: at the top of
  // this range the front is near enough instant and everything moves together.
  gusts
    .add(climate.settings, 'frontSpeed', 1, 60, 0.5)
    .name('front speed (m/s)');
  // One global scale over the vertex sway, so the whole world's motion can be
  // judged — or turned off — without re-tuning seventy builders against each
  // other. `art/flex.ts` holds the per-species part.
  gusts.add(windUniforms.swayAmount, 'value', 0, 2, 0.01).name('sway');

  // The fabrics gallery's station controls: a wind override so calm, breeze and
  // gale can be reproduced on demand, the collider wireframes behind the
  // no-clipping test, and a freeze switch mirroring the options toggle without
  // fighting it.
  const clothFolder = gui.addFolder('cloth');
  const clothState = { wind: 'live', frozen: false, wireframes: false };
  clothFolder
    .add(clothState, 'wind', ['live', 'calm', 'breeze', 'gale'])
    .onChange((wind: string) =>
      setClothWindOverride(wind === 'live' ? null : wind === 'calm' ? 0 : wind === 'breeze' ? 0.45 : 0.7),
    );
  clothFolder.add(clothState, 'frozen').onChange((on: boolean) => setClothFrozen(on));
  clothFolder
    .add(clothState, 'wireframes')
    .name('collider wireframes')
    .onChange((on: boolean) => zones.setClothWireframes(on));

  // The glitch showcase's station controls: a steady strength override so any
  // rung of the ladder can be judged without waiting on a burst, a freeze that
  // holds the clock mid-burst, and the pass switch. Not in the player's menu.
  const glitchFolder = gui.addFolder('glitch');
  const glitchState = { enabled: true, override: false, strength: 0.5, frozen: false };
  const applyGlitchOverride = (): void =>
    setGlitchOverride(glitchState.override ? glitchState.strength : null);
  glitchFolder
    .add(glitchState, 'enabled')
    .onChange((on: boolean) => postfx.setGlitch(on));
  glitchFolder.add(glitchState, 'override').name('steady override').onChange(applyGlitchOverride);
  glitchFolder.add(glitchState, 'strength', 0, 1, 0.01).onChange(applyGlitchOverride);
  glitchFolder.add(glitchState, 'frozen').onChange((on: boolean) => setGlitchFrozen(on));

  // The horror showcase's station controls — glitch's, one system over.
  const horrorFolder = gui.addFolder('horror');
  const horrorState = { enabled: true, override: false, strength: 0.5, frozen: false };
  const applyHorrorOverride = (): void =>
    setHorrorOverride(horrorState.override ? horrorState.strength : null);
  horrorFolder.add(horrorState, 'enabled').onChange((on: boolean) => postfx.setHorror(on));
  horrorFolder.add(horrorState, 'override').name('steady override').onChange(applyHorrorOverride);
  horrorFolder.add(horrorState, 'strength', 0, 1, 0.01).onChange(applyHorrorOverride);
  horrorFolder.add(horrorState, 'frozen').onChange((on: boolean) => setHorrorFrozen(on));
  // Bound through the active zone's soundscape rather than to a model directly.
  // A zone declares its sound as data and the models are built on entry, so a
  // panel that captured one at startup would be tuning the proving ground's
  // tree while the player stands in the countryside. `find` looks it up by the
  // `id` the spec declared, every time the slider moves.
  const tuning = {
    windTone: 3400,
    leaves: 1,
    machineRpm: 52,
    fireIntensity: 0.85,
    water: 1,
    // Scatter events are minutes apart by design, so tuning one by waiting for
    // it means changing a parameter twice between hearings.
    strike: () => zones.sound?.findField('smith')?.trigger(),
    drop: () => zones.sound?.findField('yards')?.trigger(),
    // Ninety-five seconds is a long time to wait to hear whether a tail is
    // right.
    toll: () => zones.sound?.findField('bell')?.trigger(),
  };
  gusts
    .add(tuning, 'windTone', 700, 9000, 50)
    .name('wind tone (Hz)')
    .onChange((value: number) => {
      zones.sound?.find<WindModel>('wind')?.setTone(value);
    });
  gusts
    .add(tuning, 'leaves', 0, 2, 0.01)
    .name('leaf articulation')
    .onChange((value: number) => {
      // Every foliage model in the zone, whatever it is called. Their base
      // articulations differ — a stiff bush ticks where a canopy hushes — so
      // this scales what the spec asked for rather than replacing it.
      for (const [id, base] of FOLIAGE_BASE) {
        zones.sound?.find<FoliageModel>(id)?.setArticulation(base * value);
      }
    });
  gusts
    .add(tuning, 'machineRpm', 0, 200, 1)
    .name('mill rpm')
    .onChange((value: number) => {
      zones.sound?.find<MachineModel>('mill')?.setRpm(value);
    });
  gusts
    .add(tuning, 'fireIntensity', 0, 1, 0.01)
    .name('forge intensity')
    .onChange((value: number) => {
      zones.sound?.find<FireModel>('forge')?.setIntensity(value);
    });
  gusts
    .add(tuning, 'water', 0, 1, 0.01)
    .name('water flow')
    .onChange((value: number) => {
      zones.sound?.find<WaterModel>('cistern')?.setRate(value);
    });
  gusts.add(tuning, 'strike').name('hammer now');
  gusts.add(tuning, 'drop').name('clatter now');
  gusts.add(tuning, 'toll').name('bell now');

  // A readout rather than a control: what the controller thinks is happening,
  // which is the only way to tell a tuning problem from a collision problem.
  const readout = {
    speed: '0.00',
    grounded: 'no',
    position: '',
    triangles: collider.triangles,
    // What the frame actually costs. Accumulated across every pass in the frame
    // and including the shadow draws — see `Viewport`, which turns `autoReset`
    // off to make that true.
    draws: 0,
    drawn: '0',
    // Should plateau after the first few zones of a cold walk — a count that
    // climbs with every doorway means the light tiers are not holding.
    programs: 0,
    heap: '—',
    // Zones currently holding memory, and how many have been released. Together
    // these are the readable form of the residency policy: the first should
    // settle rather than climb across a long session, and the second proves the
    // first is settling because eviction is *working*.
    resident: '—',
    buffers: '—',
    zone: '—',
    crossings: 0,
    // Sun elevation and the temperature where you stand — the two numbers that
    // decide the whole atmosphere table and whether it rains or snows.
    sun: '—',
    /** How wet the world is, and how much snow is lying on it. */
    soaked: '—',
    /** Tonight's moon, and how much of it is lit. */
    moon: '—',
    /** Which colour the smog is running in today. */
    haze: '—',
    room: '—',
    // Audio has no visible output at all, so a readout of what it thinks is
    // happening is the only way to tell "occlusion is broken" apart from
    // "occlusion is working and that wall is thick".
    audio: 'waiting for a click',
    gust: '0.00',
    swell: '0.00',
    machine: '—',
    emitters: '—',
    // The scarcity machine has no visible output either, and its timescale is
    // minutes — without this line, "working" and "broken" look identical for
    // the length of a rest.
    music: '—',
    // The same argument, for the layer that is never supposed to stop: a
    // silent wood and a broken director look identical from inside one.
    ambience: '—',
  };
  const state = gui.addFolder('state');
  state.add(readout, 'speed').listen().disable();
  state.add(readout, 'grounded').listen().disable();
  state.add(readout, 'position').listen().disable();
  state.add(readout, 'zone').listen().disable();
  state.add(readout, 'crossings').listen().disable();
  state.add(readout, 'room').listen().disable();
  state.add(readout, 'audio').listen().disable();
  state.add(readout, 'gust').listen().disable();
  state.add(readout, 'swell').listen().disable();
  state.add(readout, 'machine').listen().disable();
  state.add(readout, 'music').listen().disable();
  state.add(readout, 'ambience').listen().disable();
  state.add(readout, 'emitters').name('hrtf / panned / virtual').listen().disable();
  state.add(readout, 'draws').name('draw calls').listen().disable();
  state.add(readout, 'drawn').name('drawn tris').listen().disable();
  state.add(readout, 'programs').name('shader programs').listen().disable();
  state.add(readout, 'heap').listen().disable();
  state.add(readout, 'resident').name('zones built / evicted').listen().disable();
  // **The number that says whether a long walk is leaking.** Geometries and
  // textures the renderer is holding, which is not the same question as the JS
  // heap: a buffer freed on the GPU and still referenced in JS shows up in one
  // and not the other, and the reverse happens too. Walk a wing of galleries
  // and come back — this should settle, not climb.
  state.add(readout, 'buffers').name('geometries / textures').listen().disable();
  // Triangles change with the zone, so this is watched rather than read once —
  // it is also the first place a collider leak would show up.
  //
  // Named rather than left as `triangles`: beside the renderer's count it is
  // two numbers of the same name measuring different things, and the one that
  // matters here is *collision* geometry.
  state.add(readout, 'triangles').name('collider tris').listen().disable();
  state.add({ respawn: () => zones.respawn() }, 'respawn');

  // Jumping straight to a zone, without walking to its door. Mostly for getting
  // back out of an interior after breaking the door that leads there, and the
  // only way into the sound stage, which deliberately has no door.
  //
  // Grouped the way the world is: a family per hall, with the hub and anything
  // that belongs to no setting sitting loose at the top. The grouping is the
  // zone's own (`ZoneDefinition.group`) rather than a second list here.
  const travel = gui.addFolder('zones');
  const all = [...zones.zones.values()];
  const go = (folder: typeof travel, id: string, name: string): void => {
    folder.add({ go: () => void zones.travel(id) }, 'go').name(name);
  };

  for (const zone of all) {
    if (!zone.definition.group) go(travel, zone.id, zone.name);
  }
  for (const group of ZONE_GROUPS) {
    const members = all.filter((zone) => zone.definition.group === group);
    if (members.length === 0) continue;
    const folder = travel.addFolder(group);
    folder.close();
    for (const zone of members) go(folder, zone.id, zone.name);
  }

  // --- the reading screen ---------------------------------------------------
  //
  // A way in that is not a walk across a room. Everything here is also bound to
  // a book in the Readables Showcase and reachable the way a player reaches it;
  // this is for tuning the type without the walk between one look and the next.
  const read = gui.addFolder('reading').close();
  for (const note of [...NOTES, ...READING_FIXTURES]) {
    read.add({ open: () => reading.open(note) }, 'open').name(note.title.toLowerCase());
  }

  // --- the sound stage ------------------------------------------------------
  //
  // Closed by default, and everything in it acts on whatever soundscape is
  // current rather than on the stage specifically. Solo is as useful standing
  // in the countryside working out which of six sources is the harsh one, and
  // the room controls are the only way to tune an acoustic at all.
  //
  // Built here rather than at boot: it taps an analyser off the master bus, and
  // nothing outside `?debug` should be paying for an FFT.
  const meter = createMeter(audio);
  loop.add(() => meter.update());

  const stage = gui.addFolder('sound stage').close();
  const stageState = {
    solo: 'all',
    reverb: '—',
    audition: () => {
      void auditionToConsole();
    },
  };
  stage
    .add(stageState, 'solo', ['all', ...STAGE_STATIONS])
    .name('solo')
    .onChange((value: string) => {
      zones.sound?.setSolo(value === 'all' ? null : value);
    });
  stage.add(stageState, 'reverb').listen().disable();
  // Renders the whole library offline and prints the table. A few seconds, and
  // it does not touch what you are listening to — a separate context entirely.
  stage.add(stageState, 'audition').name('audition the library');
  stage.add(meter, 'visible').name('spectrum');

  // --- the music stage --------------------------------------------------------
  //
  // Controls meant to be used together: pick a vibe, press play, and the whole
  // thing is stated within seconds. The vibe control hands the director a spec
  // exactly as a border crossing does, so switching mid-piece *is* the retune,
  // demonstrated on demand. `zone` hands back whatever the current zone
  // declares; the night toggle is the same spec under a different touch. None
  // of it follows the player through doors — any crossing re-applies the zone's
  // own spec over the vibe control.
  //
  // No solo control for the instrument stations, because distance already is
  // one: a station's reach ends before its neighbour begins.
  const music = gui.addFolder('music stage').close();
  const musicState = {
    vibe: 'zone',
    night: false,
    play: () => zones.music?.playNow(),
    stop: () => zones.music?.stopNow(),
  };
  music
    .add(musicState, 'vibe', ['zone', ...VIBE_NAMES])
    .onChange((value: string) => {
      const director = zones.music;
      if (!director) return;
      director.setZone(
        value === 'zone'
          ? musicFor(zones.current?.environment.vibe)
          : VIBES[value as VibeName].music,
      );
    });
  // A hold like the moon's: ticked forces night, cleared hands it back to the
  // sun. Taken up at the next piece, so `play the vibe` is what shows it now.
  music
    .add(musicState, 'night')
    .name('hold night')
    .onChange((value: boolean) => {
      zones.music?.holdNight(value ? 1 : null);
    });
  music.add(musicState, 'play').name('play the vibe');
  music.add(musicState, 'stop').name('stop the vibe');

  // The ambience has no play button and never will: it is the layer that does
  // not stop. What it needs instead is a way to stand in a place out of season
  // and out of hours, which the climate folder already provides, and a way to
  // hear a source that speaks every ninety seconds without waiting for it.
  const air = gui.addFolder('ambience').close();
  const airState = {
    vibe: 'zone',
    voice: 'robin' as AmbienceVoice,
    say: () => zones.ambience?.say(airState.voice),
    hush: () => zones.ambience?.hush(),
  };
  air
    .add(airState, 'vibe', ['zone', ...VIBE_NAMES])
    .onChange((value: string) => {
      const director = zones.ambience;
      if (!director) return;
      if (value === 'zone') {
        director.setZone(zones.current?.environment.vibe, zones.current?.id ?? '');
      } else {
        director.setVibe(value as VibeName);
      }
    });
  air.add(airState, 'voice', [...AMBIENCE_VOICES]);
  air.add(airState, 'say').name('say it');
  air.add(airState, 'hush').name('hush the place');

  // --- generated Faust panels ----------------------------------------------
  //
  // Not written, read. Every compiled module declares its controls' ranges and
  // the build tool carries them through, so these folders build themselves —
  // which is how the reverb panel comes to have `decayLow` and `decayMid`
  // separately, and the crossover between them, which is the control a stone
  // room actually needs.
  //
  // Each follows its model through zone changes and disappears with it, so the
  // panel always reflects what is currently audible.
  const panels = [
    attachFaustPanel(stage, 'reverb', () => audio.reverbControls),
    // Every friction source in the game, by declared id. A lookup that finds
    // nothing simply has no folder, so this list can name sources that only
    // exist in one zone without the others carrying an empty control.
    ...['gantry', 'gate', 'limb', 'friction'].map((id) =>
      attachFaustPanel(stage, id, () => zones.sound?.find<FrictionModel>(id)?.loop ?? null),
    ),
    ...['pipe-air', 'waveguide'].map((id) =>
      attachFaustPanel(stage, id, () => zones.sound?.find<WaveguideModel>(id)?.loop ?? null),
    ),
  ];
  loop.add(() => {
    for (const panel of panels) panel.sync();
  });

  loop.add(() => {
    readout.speed = player.speed.toFixed(2);
    readout.grounded = player.isGrounded ? 'yes' : 'no';
    const p = player.position;
    readout.position = `${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`;
    readout.zone = zones.current?.name ?? '—';
    readout.crossings = zones.crossings;
    readout.triangles = collider.triangles;
    // Read here rather than after the render: this runs at the top of the
    // frame, so it reports the frame just drawn. `info.reset()` happens inside
    // `postfx.render`, which is later in the same loop.
    const info = viewport.renderer.info.render;
    readout.draws = info.calls;
    readout.drawn = info.triangles.toLocaleString();
    readout.programs = viewport.renderer.info.programs?.length ?? 0;
    // Chrome only, and behind a flag on some builds. Absent is a normal answer
    // rather than an error — this is the one number in the panel that says
    // whether a long session is leaking, and it is worth showing when it exists.
    const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
    readout.heap = memory ? `${(memory.usedJSHeapSize / 1048576).toFixed(0)} MB` : 'unavailable';
    readout.resident = `${zones.builtZones.length} / ${zones.evictions}`;
    const held = viewport.renderer.info.memory;
    readout.buffers = `${held.geometries} / ${held.textures}`;
    readout.room = audio.room ?? 'open';
    stageState.reverb = audio.reverbKind === 'fdn' ? 'fdn — tunable' : 'convolution — fixed';
    readout.audio = app.footsteps === null ? 'rendering…' : audio.context.state;
    readout.gust = `${audio.weather.strength.toFixed(2)} of ${audio.weather.settings.windSpeed.toFixed(2)}`;
    readout.swell = audio.weather.swell.toFixed(2);
    readout.sun = `${climate.sunElevation.toFixed(1)}°  ${climate.temperature.toFixed(0)}°C`;
    readout.moon = `${climate.moonName} ${(climate.moonLight * 100).toFixed(0)}%`;
    const smog = WEATHER_KINDS.find((kind) => kind.name === 'smog');
    readout.haze = smog ? (climate.toneOf(smog)?.name ?? '—') : '—';
    readout.soaked = `${weather.wet.toFixed(2)} / ${weather.lying.toFixed(2)}`;
    for (let i = 0; i < 3; i++) {
      const deck = weather.decks[i];
      deckNames[(['high', 'mid', 'low'] as const)[i]] =
        deck.genus ? `${deck.genus} ${deck.amount.toFixed(2)}` : '—';
    }
    if (!moonHold.on) moonHold.phase = climate.moonPhase;
    if (!weatherHold.on) {
      for (const kind of WEATHER_KINDS) weatherLevels[kind.name] = climate.amountOf(kind.name);
    }
    strikeReadout.lightning = weather.storming;
    if (!fogHold.on) Object.assign(fogHold, postfx.zoneFog());
    {
      const fog = viewport.scene.fog as THREE.Fog;
      fogReadout.fog = `${fog.near.toFixed(1)}–${fog.far.toFixed(1)} m, curve ${
        fogUniforms.uFogRamp.value.toFixed(2)}, hides ${fogUniforms.uFogCeiling.value.toFixed(2)}`;
    }
    readout.machine = zones.sound?.find<MachineModel>('mill')?.phase ?? '—';
    readout.music = zones.music?.status ?? '—';
    readout.ambience = zones.ambience?.status ?? '—';
    // The voice budget, made visible. HRTF panning is the most expensive node in
    // the API, so "how many are running one" is the number that decides whether
    // a dense zone is affordable.
    const voices = audio.voiceCounts;
    readout.emitters =
      zones.sound === null
        ? '—'
        : `${voices.hrtf} / ${voices.panned} / ${voices.virtual} · ${zones.sound.occludedCount} occl`;
  });

  // **Sorted and shut, last of all.**
  //
  // Thirty-odd folders and a few hundred controls. Alphabetical is not better
  // ordering, it is *predictable* ordering, which is the only kind that helps
  // at this count. Closed for the same reason: opened, it is several screens
  // tall and whatever is being looked for is below the fold.
  //
  // Done here rather than at each `addFolder` so both apply to a folder added
  // later without anybody having to remember, and recursively so a nested wing
  // is sorted and shut inside its parent too. Re-appending a node already in
  // the DOM moves it, so appending every folder in sorted order is the reorder;
  // loose controllers are left where they are, which keeps `noclip fly` at the
  // top.
  //
  // Names are load-bearing now that the order comes from them: a folder that
  // belongs beside another has to be *named* beside it. Hence `sky clouds` and
  // the `player …` set.
  const sortFolders = (root: GUI): void => {
    const byName = [...root.folders].sort((a, b) =>
      (a.$title.textContent ?? '').localeCompare(b.$title.textContent ?? ''),
    );
    for (const folder of byName) {
      root.$children.appendChild(folder.domElement);
      sortFolders(folder);
    }
  };
  sortFolders(gui);
  for (const folder of gui.foldersRecursive()) folder.close();
}
