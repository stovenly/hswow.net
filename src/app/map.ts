import { MapScreen } from '../ui/MapScreen';
import { MapBake } from '../ui/map/bake';
import { chartFrom, layoutWorld, type WorldChart } from '../ui/map/world';
import { pool } from '../engine/work/pool';
import { worldChart } from '../world/chart';
import type { Menu } from '../ui/Menu';
import type { App } from './boot';

/**
 * The map, wired to a running app: the top-down bake on every zone entry, the
 * fog opening around the player once a frame, and the two map tabs of the
 * menu. Installed by the game page and not by the editor, which has the whole
 * world laid out in front of it already.
 */

export function installMap(app: App, menu: Menu): MapScreen {
  const bake = new MapBake(app.viewport.renderer);
  // Laid out here and raised on the pool from the start, so the first look at
  // the map never pays for it: nothing about the chart depends on what the
  // player has found, so it cannot go stale while they play.
  let graph: WorldChart | null = null;
  const layout = layoutWorld(app.zones.zones, app.zones.portals);
  void pool
    .run('world-chart', layout.ask)
    .then((raised) => {
      graph = chartFrom(layout, raised);
      screen.charted();
    })
    .catch((error: unknown) => console.warn('map: the world could not be raised', error));

  const screen = new MapScreen(menu, {
    here: () => app.zones.current?.name ?? 'nowhere',
    local: () => {
      const zone = app.zones.current;
      const plan = zone?.plan;
      if (!zone || !plan) return null;
      const seen = worldChart.raster(zone.id, plan);
      const at = app.player.position;
      return {
        plan,
        bearing: ((zone.environment.bearing ?? 0) * Math.PI) / 180,
        // Already drawn on entry; this only pays for a zone whose picture was
        // dropped when it was evicted.
        picture: bake.bake(zone),
        seen,
        sides: app.zones.portals.in(zone.id),
        at: { x: at.x, z: at.z, heading: app.player.heading },
        lit: (x, z) => worldChart.at(seen, x, z),
      };
    },
    world: () => ({
      chart: graph,
      seen: {
        visited: worldChart.visited,
        found: worldChart.found,
        here: app.zones.current?.id ?? null,
      },
    }),
  });

  app.zones.onZoneChange = (zone) => {
    bake.bake(zone);
    screen.zoneChanged();
  };
  // The picture is rebuilt from the world on the next entry, which is free.
  app.zones.onZoneRelease = (id) => bake.release(id);

  app.onFrame((dt) => {
    const zone = app.zones.current;
    const plan = zone?.plan;
    if (!zone || !plan || app.zones.isTransitioning) return;
    const at = app.player.position;
    // A room opens whole; outdoors it is a disc about the player. Line of sight
    // is not consulted — a disc is enough to say you were here.
    worldChart.stamp(zone.id, plan, at.x, at.z, dt, !zone.environment.sky);
    worldChart.sweep(app.zones.portals, zone.id, plan);
  });

  return screen;
}
