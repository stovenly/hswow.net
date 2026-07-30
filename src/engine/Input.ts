import { flags } from '../debug/flags';

/**
 * Aggregated player input.
 *
 * Keyboard and mouse write into it directly; `TouchControls` writes into the
 * same fields. The controller reads the result and never learns which device
 * is driving it, which is the only reason one movement implementation can
 * serve both a desktop pointer lock and a thumb on glass.
 */

const FORWARD_KEYS = ['KeyW', 'ArrowUp'];
const BACK_KEYS = ['KeyS', 'ArrowDown'];
const LEFT_KEYS = ['KeyA', 'ArrowLeft'];
const RIGHT_KEYS = ['KeyD', 'ArrowRight'];
const SPRINT_KEYS = ['ShiftLeft', 'ShiftRight'];
const JUMP_KEYS = ['Space'];

/**
 * Pointer lock occasionally delivers one enormous delta on the frame capture is
 * granted. Clamping per event costs nothing and avoids a violent camera snap.
 */
const MAX_LOOK_DELTA = 200;

export class Input {
  /** Raw look delta in device pixels, accumulated between frames. */
  lookX = 0;
  lookY = 0;

  /** True when the mouse is captured, or when capture isn't a concept here. */
  locked = false;

  /**
   * Whether the controller has to wait for pointer lock before it will move.
   * Pointer lock does not exist on mobile Safari or Chrome for Android, so on
   * touch devices the answer has to be no — otherwise the game never starts.
   */
  readonly needsCapture: boolean;

  /** Fires whenever capture is gained or lost, for cursor and HUD state. */
  onLockChange: ((locked: boolean) => void) | null = null;

  private readonly canvas: HTMLCanvasElement;
  private readonly keys = new Set<string>();

  /** Touch stick, in the same -1..1 space as the keyboard axes. */
  private stickX = 0;
  private stickZ = 0;
  private stickSprint = false;

  /** `performance.now()` of the most recent jump press, or 0 if consumed. */
  private jumpPressedAt = 0;
  private jumpHeld = false;
  /** True until the first mouse move after capture, which is always garbage. */
  private settling = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.needsCapture = !isTouchDevice();

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    // Alt-tabbing away never delivers the keyup, so without this you come back
    // to the tab already sprinting forward.
    window.addEventListener('blur', this.handleBlur);

    if (this.needsCapture) {
      canvas.addEventListener('pointerdown', this.handleCanvasPointerDown);
      document.addEventListener('pointerlockchange', this.handleLockChange);
      document.addEventListener('mousemove', this.handleMouseMove);
    } else {
      this.locked = true;
    }
  }

  /** -1 left .. +1 right. Analog, because a thumb stick is not a key. */
  get moveX(): number {
    const keyed = axis(this.pressed(RIGHT_KEYS), this.pressed(LEFT_KEYS));
    return clamp(keyed + this.stickX, -1, 1);
  }

  /** -1 back .. +1 forward. */
  get moveZ(): number {
    const keyed = axis(this.pressed(FORWARD_KEYS), this.pressed(BACK_KEYS));
    return clamp(keyed + this.stickZ, -1, 1);
  }

  get sprint(): boolean {
    return this.pressed(SPRINT_KEYS) || this.stickSprint;
  }

  /** True while the jump control is held, for the bunny-hop option. */
  get jumping(): boolean {
    return this.jumpHeld;
  }

  /**
   * Takes a pending jump if one was pressed within `buffer` seconds. Buffering
   * means a press a few frames before landing still jumps, which is the
   * difference between a controller that feels responsive and one that eats
   * inputs.
   */
  takeJump(buffer: number): boolean {
    if (this.jumpPressedAt === 0) return false;
    if ((performance.now() - this.jumpPressedAt) / 1000 > buffer) return false;
    this.jumpPressedAt = 0;
    return true;
  }

  /** Returns the accumulated look delta and resets it. Call once per frame. */
  drainLook(out: { x: number; y: number }): void {
    out.x = this.lookX;
    out.y = this.lookY;
    this.lookX = 0;
    this.lookY = 0;
  }

  // --- written to by TouchControls ----------------------------------------

  setStick(x: number, z: number, sprint: boolean): void {
    this.stickX = x;
    this.stickZ = z;
    this.stickSprint = sprint;
  }

  addLook(dx: number, dy: number): void {
    this.lookX += dx;
    this.lookY += dy;
  }

  pressJump(): void {
    this.jumpPressedAt = performance.now();
    this.jumpHeld = true;
  }

  releaseJump(): void {
    this.jumpHeld = false;
  }

  // --- internals ----------------------------------------------------------

  private pressed(codes: readonly string[]): boolean {
    return codes.some((code) => this.keys.has(code));
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    // Tab moves focus, and moving focus out of a pointer-locked canvas makes
    // the browser drop the lock. Reacquiring it delivers a mouse position that
    // has nothing to do with where the player was looking, so the camera
    // snaps — which is exactly the jolt, and exactly why Escape never causes
    // it: Escape releases the lock deliberately and nothing is reacquired.
    //
    // Swallowed only while locked, so tabbing around the tuning panel with the
    // cursor free still works.
    if (event.code === 'Tab' && this.locked) {
      event.preventDefault();
      return;
    }

    if (event.repeat) return;
    this.keys.add(event.code);
    if (JUMP_KEYS.includes(event.code)) {
      // Space scrolls the page otherwise, which is a very ugly way to jump.
      event.preventDefault();
      this.pressJump();
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
    if (JUMP_KEYS.includes(event.code)) this.releaseJump();
  };

  private readonly handleBlur = (): void => {
    this.keys.clear();
    this.releaseJump();
  };

  private readonly handleCanvasPointerDown = (event: PointerEvent): void => {
    if (this.locked || event.button !== 0) return;
    void this.requestLock();
  };

  private async requestLock(): Promise<void> {
    try {
      // unadjustedMovement bypasses OS mouse acceleration, which is what makes
      // aim consistent. Chrome-only, and it rejects rather than ignoring the
      // option elsewhere, so the fallback is a plain request.
      await this.canvas.requestPointerLock({ unadjustedMovement: true });
    } catch {
      try {
        await this.canvas.requestPointerLock();
      } catch {
        // Denied — usually a second request too soon after Escape. Harmless.
      }
    }
  }

  private readonly handleLockChange = (): void => {
    this.locked = document.pointerLockElement === this.canvas;
    if (!this.locked) this.keys.clear();
    // Anything accumulated across a lock change is stale by definition — it
    // describes a cursor that was somewhere else, under different rules.
    this.lookX = 0;
    this.lookY = 0;
    this.settling = this.locked;
    this.onLockChange?.(this.locked);
  };

  private readonly handleMouseMove = (event: MouseEvent): void => {
    if (!this.locked) return;
    // The first event after capture is discarded. Browsers commonly report the
    // jump from the cursor's old screen position to the centre as a single
    // enormous movement, and honouring it spins the camera on every click.
    if (this.settling) {
      this.settling = false;
      return;
    }
    this.lookX += clamp(event.movementX, -MAX_LOOK_DELTA, MAX_LOOK_DELTA);
    this.lookY += clamp(event.movementY, -MAX_LOOK_DELTA, MAX_LOOK_DELTA);
  };

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    this.canvas.removeEventListener('pointerdown', this.handleCanvasPointerDown);
    document.removeEventListener('pointerlockchange', this.handleLockChange);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
}

/** `?touch` forces the mobile path on so it can be tested with a mouse. */
export function isTouchDevice(): boolean {
  return flags.touch || window.matchMedia('(pointer: coarse)').matches;
}

function axis(positive: boolean, negative: boolean): number {
  return (positive ? 1 : 0) - (negative ? 1 : 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
