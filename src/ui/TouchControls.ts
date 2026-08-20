import type { Input } from '../engine/Input';

/**
 * Touch controls: left half of the screen is a movement stick, right half a
 * look drag, plus a jump pad. The stick is dynamic — it appears wherever the
 * thumb lands rather than at a fixed spot.
 */

/** Travel in CSS pixels from the stick origin to full deflection. */
const STICK_RADIUS = 64;
/** Fraction of full deflection that counts as a sprint. */
const SPRINT_THRESHOLD = 0.85;
/**
 * A thumb drags far fewer pixels than a mouse moves, so touch look needs its
 * own gain on top of the shared sensitivity.
 */
const LOOK_SCALE = 2.2;

interface Stick {
  pointerId: number;
  originX: number;
  originY: number;
}

export class TouchControls {
  private readonly input: Input;
  private readonly root: HTMLDivElement;
  private readonly stickBase: HTMLDivElement;
  private readonly stickKnob: HTMLDivElement;
  private readonly jumpPad: HTMLDivElement;

  private stick: Stick | null = null;
  private lookPointer: number | null = null;
  private lastLookX = 0;
  private lastLookY = 0;

  constructor(input: Input, overlay: HTMLElement) {
    this.input = input;

    this.root = document.createElement('div');
    this.root.className = 'touch';

    this.stickBase = document.createElement('div');
    this.stickBase.className = 'touch-stick';
    this.stickKnob = document.createElement('div');
    this.stickKnob.className = 'touch-stick-knob';
    this.stickBase.appendChild(this.stickKnob);

    this.jumpPad = document.createElement('div');
    this.jumpPad.className = 'touch-jump';
    this.jumpPad.textContent = '↑';

    this.root.append(this.stickBase, this.jumpPad);
    overlay.appendChild(this.root);

    this.root.addEventListener('pointerdown', this.handleDown);
    window.addEventListener('pointermove', this.handleMove);
    window.addEventListener('pointerup', this.handleUp);
    window.addEventListener('pointercancel', this.handleUp);

    this.jumpPad.addEventListener('pointerdown', this.handleJumpDown);
    this.jumpPad.addEventListener('pointerup', this.handleJumpUp);
    this.jumpPad.addEventListener('pointercancel', this.handleJumpUp);
  }

  private readonly handleDown = (event: PointerEvent): void => {
    const onLeftHalf = event.clientX < window.innerWidth / 2;

    if (onLeftHalf && this.stick === null) {
      this.stick = { pointerId: event.pointerId, originX: event.clientX, originY: event.clientY };
      this.stickBase.style.left = `${event.clientX}px`;
      this.stickBase.style.top = `${event.clientY}px`;
      this.stickBase.classList.add('is-active');
      this.updateStick(event.clientX, event.clientY);
      return;
    }

    if (!onLeftHalf && this.lookPointer === null) {
      this.lookPointer = event.pointerId;
      this.lastLookX = event.clientX;
      this.lastLookY = event.clientY;
    }
  };

  private readonly handleMove = (event: PointerEvent): void => {
    if (this.stick?.pointerId === event.pointerId) {
      this.updateStick(event.clientX, event.clientY);
      return;
    }

    if (this.lookPointer === event.pointerId) {
      this.input.addLook(
        (event.clientX - this.lastLookX) * LOOK_SCALE,
        (event.clientY - this.lastLookY) * LOOK_SCALE,
      );
      this.lastLookX = event.clientX;
      this.lastLookY = event.clientY;
    }
  };

  private readonly handleUp = (event: PointerEvent): void => {
    if (this.stick?.pointerId === event.pointerId) {
      this.stick = null;
      this.input.setStick(0, 0, false);
      this.stickBase.classList.remove('is-active');
      this.stickKnob.style.transform = 'translate(-50%, -50%)';
    }
    if (this.lookPointer === event.pointerId) this.lookPointer = null;
  };

  private readonly handleJumpDown = (event: PointerEvent): void => {
    // Otherwise the pad also opens a look drag underneath it.
    event.stopPropagation();
    this.jumpPad.classList.add('is-active');
    this.input.pressJump();
  };

  private readonly handleJumpUp = (): void => {
    this.jumpPad.classList.remove('is-active');
    this.input.releaseJump();
  };

  private updateStick(x: number, y: number): void {
    if (!this.stick) return;

    let dx = x - this.stick.originX;
    let dy = y - this.stick.originY;
    const distance = Math.hypot(dx, dy);

    if (distance > STICK_RADIUS) {
      const scale = STICK_RADIUS / distance;
      dx *= scale;
      dy *= scale;
    }

    this.stickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    const deflection = Math.min(distance, STICK_RADIUS) / STICK_RADIUS;
    // Screen y grows downward; forward is up the screen, hence the negation.
    this.input.setStick(
      dx / STICK_RADIUS,
      -dy / STICK_RADIUS,
      deflection > SPRINT_THRESHOLD,
    );
  }

  dispose(): void {
    this.root.removeEventListener('pointerdown', this.handleDown);
    window.removeEventListener('pointermove', this.handleMove);
    window.removeEventListener('pointerup', this.handleUp);
    window.removeEventListener('pointercancel', this.handleUp);
    this.root.remove();
  }
}
