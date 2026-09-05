import * as THREE from 'three';
import type { App } from './boot';
import { Inventory } from '../player/Inventory';
import { HeldTool } from '../player/HeldTool';
import { ItemWorld } from '../world/ItemWorld';
import { InventoryUI } from '../ui/Inventory';
import { Notices } from '../ui/Notices';
import { ItemIcons, PACE_IDLE, PACE_OPEN } from '../ui/ItemIcons';
import { SaveSlots } from '../ui/SaveSlots';
import type { Menu } from '../ui/Menu';
import { displayOf, isReadable, isUnique, itemById, itemFrom, kindOf, type Item } from '../world/items';
import { holdSatchel } from '../world/dialogue';
import { worldChart } from '../world/chart';
import { worldState } from '../world/state';
import { noteById } from '../world/notes';
import { ItemAudio } from '../audio/models/items';
import {
  currentWorldSeed,
  readSave,
  setWorldSeed,
  worldDelta,
  writeSave,
} from '../world/save';

/**
 * The item systems, wired to a running app: pickup and containers on the
 * interact key, the pack as a tab of the menu, the held tool on left click,
 * and the save slots on the pause screen. Installed by the game page and not
 * by the editor.
 */

const _origin = new THREE.Vector3();
const _direction = new THREE.Vector3();

/** Nothing in the item tables starts with a silent h or a sounded u. */
function an(name: string): string {
  return `${'aeiouAEIOU'.includes(name[0]) ? 'an' : 'a'} ${name}`;
}

export interface GameItems {
  /** The slot picker's load path: seed, delta and pack restored, then a hard reset into the saved zone. */
  loadSlot(slot: number): Promise<boolean>;
  /** Opens the slot picker in load mode — the title screen's load button. */
  showLoad(): void;
  /** Drops the pack, the records and the seed, so the next new game is as fresh as one after a reload. */
  resetWorld(): void;
  /** The one line of notices, for anything else that has something to say. */
  notices: Notices;
}

export function installGameItems(app: App, overlay: HTMLElement, menu: Menu): GameItems {
  const inventory = new Inventory();
  const world = new ItemWorld(app.zones, app.collider, inventory);
  app.zones.onDressed = (zone, root) => world.dressed(zone, root);

  // What a line of dialogue reaches for when it hands something over. The pack
  // is behind a key and the speech box covers the middle, so it says so.
  const notices = new Notices(overlay);
  const some = (matches: (item: Item) => boolean): boolean => {
    for (const item of inventory.carried()) if (matches(item)) return true;
    return false;
  };
  worldState.pack = {
    carries: (builder) => some((item) => item.builder === builder),
    holds: (id) => some((item) => item.id === id),
  };
  holdSatchel({
    give: (what, from) => {
      let item: Item;
      if ('item' in what) {
        const doc = itemById(what.item);
        if (!doc) return console.warn(`items: no item "${what.item}" is written`);
        if (isUnique(doc) && some((held) => held.id === doc.id)) return;
        item = itemFrom(doc);
      } else {
        const seed = what.seed ?? 0;
        item = { name: displayOf(what.builder, seed), kind: kindOf(what.builder), builder: what.builder, seed };
      }
      inventory.add(item);
      // A written item is named as itself; a rolled one is one of its kind.
      const named = item.id ? item.name : an(item.name);
      notices.say(from ? `${from} gave you ${named}` : `You received ${named}`, 'gain');
    },
    // Out of the hand or off the body as readily as out of the pack: a
    // candle carried to its owner is handed over from wherever it is.
    take: (what, from) => {
      const taken = inventory.takeWhere((item) =>
        'item' in what ? item.id === what.item : item.builder === what.builder,
      );
      if (taken) {
        const named = taken.id ? taken.name : an(taken.name);
        notices.say(from ? `${from} took ${named}` : `You lost ${named}`, 'loss');
      }
      return taken !== null;
    },
  });

  const held = new HeldTool(app.viewport.scene);
  const sounds = new ItemAudio(app.audio);
  const icons = new ItemIcons(app);

  // Equip and unequip are read off slot transitions rather than announced by
  // the UI, so a swap, a drag and a displacement all resolve to the same cue.
  let prevTool = inventory.tool;
  let prevAccessories = [...inventory.accessories];
  let restoring = false;
  inventory.onChange(() => {
    held.setItem(inventory.tool);
    app.postfx.setHeldItem(held.visible);
    app.postfx.setHeldFlame(held.sparks, held.heat);
    // Warming: everything carried gets its icon rendered as it arrives, so
    // the grid is warm by construction. Cache hits cost a map lookup.
    for (const item of inventory.items) icons.request(item);
    if (inventory.tool) icons.request(inventory.tool);
    for (const worn of inventory.accessories) if (worn) icons.request(worn);
    let equipped: Item | null = null;
    let unequipped: Item | null = null;
    if (inventory.tool !== prevTool) {
      if (inventory.tool) equipped = inventory.tool;
      else if (prevTool) unequipped = prevTool;
    }
    inventory.accessories.forEach((now, i) => {
      const was = prevAccessories[i];
      if (now === was) return;
      if (now) equipped = now;
      else if (was) unequipped = was;
    });
    prevTool = inventory.tool;
    prevAccessories = [...inventory.accessories];
    if (restoring) return;
    if (equipped) sounds.equip(equipped);
    else if (unequipped) sounds.unequip(unequipped);
  });

  const ui = new InventoryUI(menu, inventory, icons, {
    open: () => menu.show('inventory'),
    close: () => menu.hide(),
    dropToWorld: (item, ndc) => {
      const camera = app.player.camera;
      _origin.copy(camera.position);
      _direction.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(_origin).normalize();
      const landed = world.drop(item, _origin, _direction, app.player.position);
      if (landed) sounds.drop(item);
      return landed;
    },
    containerChanged: (key, items) => world.setContainer(key, items),
    readItem: (item) => {
      if (!item.builder || !isReadable(item.builder)) return false;
      const bound = typeof item.state?.text === 'string' ? noteById(item.state.text) : undefined;
      // Already owned, so the page opens with nothing to take; and over the pack
      // rather than instead of it, so closing the page is back to the pack.
      app.reading.open(bound ?? { id: '', title: item.name, body: '' });
      return true;
    },
    hoverWorld: (ndc) => app.zones.cursorHover(ndc.x, ndc.y),
    grabWorld: (ndc) => {
      const found = app.zones.cursorItem(ndc.x, ndc.y);
      if (!found) return null;
      return {
        item: found.pickup.item,
        take: () => {
          const taken = world.takeFromWorld(found.object);
          if (taken) sounds.pickup(taken);
          return taken;
        },
        move: (at) => {
          const camera = app.player.camera;
          _origin.copy(camera.position);
          _direction.set(at.x, at.y, 0.5).unproject(camera).sub(_origin).normalize();
          const moved = world.move(found.object, _origin, _direction, app.player.position);
          if (moved) sounds.drop(found.pickup.item);
          return moved;
        },
      };
    },
    tookAll: () => sounds.pickup(),
    moved: (item) => sounds.pickup(item),
  });
  icons.paced = () => (ui.shown ? PACE_OPEN : PACE_IDLE);

  const loadSlot = async (slot: number): Promise<boolean> => {
    const data = readSave(slot);
    if (!data || !app.zones.zones.has(data.zone)) return false;
    setWorldSeed(data.worldSeed);
    worldDelta.replace(data.delta);
    worldState.restore(data.state);
    worldChart.restore(data.chart);
    if (data.clock !== undefined) {
      app.climate.day = Math.floor(data.clock);
      app.climate.timeOfDay = data.clock - Math.floor(data.clock);
    }
    notices.clear();
    // A load re-seats every slot at once; that is restoration, not a gesture.
    restoring = true;
    inventory.replace(data.items, data.tool, data.accessories);
    restoring = false;
    menu.hide();
    // A save from a place that has since been replaced lands at the new
    // place's spawn rather than at a point that may now be inside a dune.
    await app.zones.hardReset(
      data.zone,
      data.relocated
        ? undefined
        : { position: new THREE.Vector3(data.at[0], data.at[1], data.at[2]), yaw: data.yaw },
    );
    void app.input.capture();
    return true;
  };

  const slots = new SaveSlots(overlay, {
    save: (slot) => {
      const zone = app.zones.current;
      if (!zone) return false;
      const at = app.player.position;
      return writeSave(slot, {
        version: 1,
        savedAt: Date.now(),
        zoneName: zone.name,
        worldSeed: currentWorldSeed(),
        items: inventory.items,
        tool: inventory.tool,
        accessories: inventory.accessories,
        delta: worldDelta.serialize(),
        state: worldState.save(),
        chart: worldChart.save(),
        clock: app.climate.elapsedDays,
        zone: zone.id,
        at: [at.x, at.y, at.z],
        yaw: app.player.heading,
      });
    },
    load: loadSlot,
  });

  app.interceptInteract = (focus) => {
    if (focus.kind === 'item') {
      const taken = world.pickup(focus.object);
      if (taken) sounds.pickup(taken);
      return true;
    }
    if (focus.kind === 'container') {
      const opened = focus.container;
      const items = world.containerContents(opened.key, opened.kind);
      sounds.open(opened.kind);
      for (const item of items) icons.request(item);
      ui.openContainer({
        key: opened.key,
        kind: opened.kind,
        display: opened.display,
        items,
      });
      return true;
    }
    if (focus.kind === 'read') {
      let node: THREE.Object3D | null = focus.object;
      while (node && !node.userData.pickup) node = node.parent;
      if (!node) return false;
      const taken = node;
      app.reading.open(focus.note, () => {
        const got = world.pickup(taken);
        if (got) sounds.pickup(got);
      });
      return true;
    }
    return false;
  };

  app.onFrame((dt) => {
    if (app.input.takeAttack() && held.swing()) sounds.swing();
    held.update(app.player.camera, dt);
  });

  const resetWorld = (): void => {
    worldDelta.replace({ removed: [], placed: [], containers: [] });
    worldState.clear();
    worldChart.clear();
    notices.clear();
    restoring = true;
    inventory.replace([], null, []);
    restoring = false;
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    setWorldSeed(bytes[0] || 1);
  };

  return { loadSlot, showLoad: () => slots.show('load'), resetWorld, notices };
}
