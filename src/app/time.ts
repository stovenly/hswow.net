import { TimePane } from '../ui/Time';
import type { Menu } from '../ui/Menu';
import type { App } from './boot';

/** The time tab of the menu, reading the clock every frame while it is up. Installed by the game page only. */
export function installTime(app: App, menu: Menu): TimePane {
  const pane = new TimePane(menu, app.climate, app.audio);
  app.onFrame((dt) => pane.tick(dt));
  return pane;
}
