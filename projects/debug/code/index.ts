import type { ProjectCode } from '@engine/app/project';
// Registers the environments and interior styles the documents name, at import.
import './presets';
import { ProvingGround, type SurfaceName } from './ProvingGround';
import { createTestWorld, ZONE_COUNTRYSIDE } from './zones';
import { STAGE_STATIONS } from './SoundStage';
import { READING_FIXTURES } from './reading-fixtures';
import { NOTES } from './notes';

/**
 * The debug project: every gallery, showcase, rig and demo level this engine
 * has been built against. All of it is code rather than documents on purpose —
 * a gallery derived from the builder list cannot be a saved copy of it.
 */

let ground: ProvingGround | null = null;

export const project: ProjectCode = {
  prebuild: [ZONE_COUNTRYSIDE],
  precompile: [ZONE_COUNTRYSIDE],
  stations: STAGE_STATIONS,

  async world(loader) {
    ground = await loader.step('shaping the ground', 0.12, () => new ProvingGround());
    return createTestWorld(ground);
  },

  panel(gui, app) {
    // Surface colours, live. Contrast between the floor and everything standing
    // on it is a quantization question as much as an art one, so it wants to be
    // adjustable against the filters rather than guessed at in a constant.
    if (ground) {
      const colors = ground.colors;
      const surfaces = gui.addFolder('surfaces').close();
      for (const name of Object.keys(colors) as SurfaceName[]) {
        surfaces.addColor(colors, name).onChange(() => ground?.applyColors());
      }
      surfaces.add(
        {
          reset: () => {
            ground?.resetColors();
            gui.controllersRecursive().forEach((c) => c.updateDisplay());
          },
        },
        'reset',
      );
    }

    // A way in that is not a walk across a room. Everything here is also bound
    // to a book in the Readables Showcase and reachable the way a player
    // reaches it; this is for tuning the type without the walk between one look
    // and the next.
    const read = gui.addFolder('reading').close();
    for (const note of [...NOTES, ...READING_FIXTURES]) {
      read.add({ open: () => app.reading.open(note) }, 'open').name(note.title.toLowerCase());
    }
  },
};
