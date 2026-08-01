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
/**
 * Crouch.
 *
 * Caps Lock, which is unusual and worth a note. It is a *locking* key: the
 * browser reports `keydown` and `keyup` for it like any other, but on some
 * platforms the physical key latches, and either way the operating system is
 * also toggling a mode nobody asked it to. Held-to-crouch is still the right
 * behaviour and it is what is implemented — the key is read as held, not as
 * toggled, so a latched Caps Lock releases the moment it is pressed again.
 *
 * Left Control is the conventional alternative and is deliberately not bound:
 * the browser hands most Ctrl combinations to the page or the OS, so a player
 * crouching while doing anything else fires shortcuts.
 */
const CROUCH_KEYS = ['CapsLock'];
const JUMP_KEYS = ['Space'];
/**
 * Interact.
 *
 * A key rather than a mouse button, deliberately. Left click is already how
 * pointer lock is acquired, so a click-to-interact scheme has to distinguish
 * "click that captured the mouse" from "click that meant something", and the
 * first click after every alt-tab lands in the ambiguous case. `E` has no such
 * overload and is where every player's hand already is.
 */
const INTERACT_KEYS = ['KeyE'];

/**
 * Pointer lock occasionally delivers one enormous delta on the frame capture is
 * granted. Clamping per event costs nothing and avoids a violent camera snap.
 */
const MAX_LOOK_DELTA = 200;

/**
 * How long to keep trying for pointer lock after a click, in milliseconds.
 *
 * The browser's cooldown after a user-initiated exit is around a second; this
 * is comfortably past it, and bounded so a refused click cannot leave a retry
 * loop running for the rest of the session.
 */
const RELOCK_WINDOW = 3000;
/** Gap between attempts. Short enough to feel immediate once the gate lifts. */
const RELOCK_INTERVAL = 120;

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
  /** Edge-triggered and consumed by the reader — see `takeInteract`. */
  private interactPressed = false;
  /** True until the first mouse move after capture, which is always garbage. */
  private settling = false;
  /** Guards against a second click starting a parallel retry loop. */
  private relocking = false;

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

  /** True while crouch is held. Never latched — see `CROUCH_KEYS`. */
  get crouching(): boolean {
    return this.pressed(CROUCH_KEYS);
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

  /**
   * True once per press of the interact key, then false until it is released
   * and pressed again.
   *
   * Consumed rather than sampled, so holding `E` in a doorway uses the door
   * once instead of firing a transition on every frame until the fade starts.
   * Unlike the jump buffer there is no time window: an interaction that
   * arrived a moment too early should be dropped, not replayed at whatever the
   * player happens to be looking at by the time it lands.
   */
  takeInteract(): boolean {
    if (!this.interactPressed) return false;
    this.interactPressed = false;
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

  /** Touch taps route here, so glass and keyboard share one path. */
  pressInteract(): void {
    this.interactPressed = true;
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
    // Only while captured. With the cursor free the player is using the tuning
    // panel, and typing an `e` into a numeric field should not open a door
    // behind them.
    if (INTERACT_KEYS.includes(event.code) && this.locked) this.pressInteract();
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

  /**
   * Asks for pointer lock, and keeps asking until the browser allows it.
   *
   * **This is why clicking back in after Escape used to do nothing.** Browsers
   * enforce a cooldown of about a second after a *user-initiated* exit from
   * pointer lock, so that a page cannot simply re-grab the cursor the instant
   * you try to get it back. A click inside that window is refused. Alt-tabbing
   * out never felt slow because losing the lock to a focus change is not
   * user-initiated and carries no cooldown — the difference between the two
   * cases is entirely in how the lock was lost.
   *
   * The old code caught that rejection and gave up, with a comment calling it
   * harmless. It was not: the player's click was silently discarded and they
   * had to click again, which reads as the game hanging for two seconds.
   * Retrying turns the cooldown into exactly what it should be — a short wait
   * that resolves itself — and the capture panel stays up meanwhile, so there
   * is something on screen the whole time.
   */
  private async requestLock(): Promise<void> {
    if (this.relocking) return;
    this.relocking = true;

    const deadline = performance.now() + RELOCK_WINDOW;
    while (!this.locked && performance.now() < deadline) {
      await this.tryLock();
      // Even a successful request resolves before `pointerlockchange` fires,
      // and on browsers where `requestPointerLock` returns nothing at all there
      // is no promise to wait on. Pausing and re-reading `locked` covers both.
      await wait(RELOCK_INTERVAL);
    }

    this.relocking = false;
  }

  /** One attempt, swallowing the refusal. */
  private async tryLock(): Promise<void> {
    try {
      // unadjustedMovement bypasses OS mouse acceleration, which is what makes
      // aim consistent. Chrome-only, and it rejects rather than ignoring the
      // option elsewhere, so the fallback is a plain request.
      await this.canvas.requestPointerLock({ unadjustedMovement: true });
    } catch {
      try {
        await this.canvas.requestPointerLock();
      } catch {
        // Refused. The caller decides whether to try again.
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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function axis(positive: boolean, negative: boolean): number {
  return (positive ? 1 : 0) - (negative ? 1 : 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
