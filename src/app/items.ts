import * as THREE from 'three';
import type { App } from './boot';
import { Inventory } from '../player/Inventory';
import { HeldTool } from '../player/HeldTool';
import { ItemWorld } from '../world/ItemWorld';
import { InventoryUI } from '../ui/Inventory';
import { ItemIcons, PACE_IDLE, PACE_OPEN } from '../ui/ItemIcons';
import { SaveSlots } from '../ui/SaveSlots';
import { displayOf, isReadable, kindOf, type Item } from '../world/items';
import { holdSatchel } from '../world/dialogue';
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
 * interact key, the pack on Tab, the held tool on left click, and the save
 * slots on the pause screen. Installed by the game page and not by the editor,
 * whose Tab already means something else.
 */

const _origin = new THREE.Vector3();
const _direction = new THREE.Vector3();

export interface GameItems {
  /** The slot picker's load path: seed, delta and pack restored, then a hard reset into the saved zone. */
  loadSlot(slot: number): Promise<boolean>;
  /** Opens the slot picker in load mode — the title screen's load button. */
  showLoad(): void;
  /** Drops the pack, the records and the seed, so the next new game is as fresh as one after a reload. */
  resetWorld(): void;
}

export function installGameItems(app: App, overlay: HTMLElement): GameItems {
  const inventory = new Inventory();
  const world = new ItemWorld(app.zones, app.collider, inventory);
  app.zones.onDressed = (zone, root) => world.dressed(zone, root);

  // What a line of dialogue reaches for when it hands something over.
  holdSatchel({
    give: (builder, seed = 0) =>
      inventory.add({ name: displayOf(builder, seed), kind: kindOf(builder), builder, seed }),
    take: (builder) => {
      const at = inventory.items.findIndex((item) => item.builder === builder);
      return at >= 0 && inventory.takeAt(at) !== null;
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

  let wasPlaying = false;
  let resumeAfterReading = false;
  const ui = new InventoryUI(overlay, inventory, icons, {
    onOpen: () => {
      wasPlaying = app.input.locked;
      document.exitPointerLock();
    },
    // Not a bare `requestPointerLock` — see the reading screen, which is the
    // same dance for the same reason.
    onClose: () => {
      if (!wasPlaying) return;
      document.body.classList.add('is-capturing');
      void app.input.capture().finally(() => document.body.classList.remove('is-capturing'));
    },
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
      // Already owned, so the page opens with nothing to take. The pack window
      // must not recapture on the way down — the book holds the mouse free, and
      // play resumes when it closes.
      resumeAfterReading = wasPlaying;
      wasPlaying = false;
      ui.hide();
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
  });
  icons.paced = () => (ui.shown ? PACE_OPEN : PACE_IDLE);

  const loadSlot = async (slot: number): Promise<boolean> => {
    const data = readSave(slot);
    if (!data || !app.zones.zones.has(data.zone)) return false;
    setWorldSeed(data.worldSeed);
    worldDelta.replace(data.delta);
    worldState.restore(data.state);
    // A load re-seats every slot at once; that is restoration, not a gesture.
    restoring = true;
    inventory.replace(data.items, data.tool, data.accessories);
    restoring = false;
    ui.hide();
    await app.zones.hardReset(data.zone, {
      position: new THREE.Vector3(data.at[0], data.at[1], data.at[2]),
      yaw: data.yaw,
    });
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

  window.addEventListener('keydown', (event) => {
    if (event.code !== 'Tab' || event.repeat) return;
    if (app.reading.shown) return;
    if (ui.shown) {
      event.preventDefault();
      ui.hide();
      return;
    }
    if (!app.input.locked || app.zones.isTransitioning) return;
    event.preventDefault();
    ui.show();
  });

  app.reading.closed = () => {
    if (!resumeAfterReading) return;
    resumeAfterReading = false;
    document.body.classList.add('is-capturing');
    void app.input.capture().finally(() => document.body.classList.remove('is-capturing'));
  };

  app.onFrame((dt) => {
    if (app.input.takeAttack() && held.swing()) sounds.swing();
    held.update(app.player.camera, dt);
  });

  const resetWorld = (): void => {
    worldDelta.replace({ removed: [], placed: [], containers: [] });
    worldState.clear();
    restoring = true;
    inventory.replace([], null, []);
    restoring = false;
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    setWorldSeed(bytes[0] || 1);
  };

  return { loadSlot, showLoad: () => slots.show('load'), resetWorld };
}
