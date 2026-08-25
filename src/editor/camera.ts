import * as THREE from 'three';
import type { App } from '../app/boot';
import type { Selection } from './selection';

/**
 * Orbiting and framing. Fly is for placing; this is for looking at one thing.
 *
 * There is no second camera: the game's controller is moved and aimed, so what
 * is on screen is exactly what a player standing there would see.
 */

/** Fraction of a turn per pixel dragged. */
const SENSITIVITY = 0.006;
/** How much of the selection's radius is left round it when framing. */
const MARGIN = 1.7;

const _pivot = new THREE.Vector3();
const _size = new THREE.Vector3();
const _offset = new THREE.Vector3();

export class OrbitCamera {
  private readonly app: App;
  private readonly selection: Selection;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private distance = 6;

  /** True while a drag is turning the camera, so the picker stays out of it. */
  get active(): boolean {
    return this.dragging;
  }

  constructor(app: App, selection: Selection) {
    this.app = app;
    this.selection = selection;
    const canvas = app.viewport.renderer.domElement;

    canvas.addEventListener('pointerdown', (event) => {
      if (!event.shiftKey || event.button !== 0) return;
      const box = this.selection.boundsOf(this.selection.objects);
      if (!box) return;
      box.getCenter(_pivot);
      this.distance = app.player.position.distanceTo(_pivot);
      this.dragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    canvas.addEventListener('pointermove', (event) => {
      if (!this.dragging) return;
      this.turn(event.clientX - this.lastX, event.clientY - this.lastY);
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    });

    const stop = (event: PointerEvent): void => {
      if (!this.dragging) return;
      this.dragging = false;
      canvas.releasePointerCapture(event.pointerId);
    };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);

    canvas.addEventListener(
      'wheel',
      (event) => {
        if (!event.shiftKey) return;
        const box = this.selection.boundsOf(this.selection.objects);
        if (!box) return;
        box.getCenter(_pivot);
        this.distance = Math.max(0.4, this.distance * (event.deltaY > 0 ? 1.12 : 1 / 1.12));
        this.place();
        event.preventDefault();
      },
      { passive: false },
    );
  }

  private turn(dx: number, dy: number): void {
    const yaw = this.app.player.heading - dx * SENSITIVITY;
    const pitch = this.app.player.tilt - dy * SENSITIVITY;
    this.app.player.aim(yaw, pitch);
    this.place();
  }

  /** Puts the camera on the sphere round the pivot at the current aim. */
  private place(): void {
    const yaw = this.app.player.heading;
    const pitch = this.app.player.tilt;
    // The controller looks down −Z at yaw 0, so the eye sits opposite that.
    const cos = Math.cos(pitch);
    _offset.set(Math.sin(yaw) * cos, -Math.sin(pitch), Math.cos(yaw) * cos).multiplyScalar(this.distance);
    const eye = _pivot.clone().add(_offset);
    // `teleport` places the feet, and the camera rides an eye height above them.
    eye.y -= this.app.player.tuning.eyeHeight;
    this.app.player.teleport(eye, yaw);
    this.app.player.aim(yaw, pitch);
  }

  /** Backs off until the selection fits, keeping the current direction. */
  frame(): void {
    const box = this.selection.boundsOf(this.selection.objects);
    if (!box) return;
    box.getCenter(_pivot);
    box.getSize(_size);
    const radius = Math.max(_size.x, _size.y, _size.z) / 2 + 0.2;
    const fov = (this.app.player.tuning.fov * Math.PI) / 180;
    this.distance = (radius * MARGIN) / Math.tan(fov / 2);
    this.place();
  }
}

/**
 * Free look while the mouse is loose: right-drag turns the view. The fly camera
 * cannot take pointer lock, because a left click has to be able to pick.
 */
export class FreeLook {
  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  constructor(app: App, enabled: () => boolean) {
    const canvas = app.viewport.renderer.domElement;
    canvas.addEventListener('contextmenu', (event) => {
      if (enabled()) event.preventDefault();
    });
    canvas.addEventListener('pointerdown', (event) => {
      if (!enabled() || event.button !== 2) return;
      this.dragging = true;
      // The keyboard steers only while this is down, so W is a tool the rest of
      // the time and a step forward while you are flying.
      app.input.freeLook = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!this.dragging) return;
      app.player.aim(
        app.player.heading - (event.clientX - this.lastX) * SENSITIVITY,
        app.player.tilt - (event.clientY - this.lastY) * SENSITIVITY,
      );
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    });
    const stop = (event: PointerEvent): void => {
      if (!this.dragging) return;
      this.dragging = false;
      app.input.freeLook = false;
      canvas.releasePointerCapture(event.pointerId);
    };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    // Letting go outside the window never delivers a pointerup either.
    window.addEventListener('blur', () => {
      if (!this.dragging) return;
      this.dragging = false;
      app.input.freeLook = false;
    });
  }

  /** True while the look button is down, so shortcuts stay out of the way. */
  get flying(): boolean {
    return this.dragging;
  }
}
