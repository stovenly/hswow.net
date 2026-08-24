/** True while a form control has focus, so editor shortcuts stay out of the way. */
export function isTyping(): boolean {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return false;
  if (active.isContentEditable) return true;
  const tag = active.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export type KeyHandler = (event: KeyboardEvent) => boolean | void;

/**
 * One keydown listener for the whole editor, in registration order. A handler
 * returning true has consumed the key and stops the rest.
 */
export class Keys {
  private readonly handlers: KeyHandler[] = [];

  constructor(target: EventTarget = window) {
    target.addEventListener('keydown', (event) => {
      if (isTyping()) return;
      const key = event as KeyboardEvent;
      for (const handler of this.handlers) {
        if (handler(key) === true) {
          key.preventDefault();
          return;
        }
      }
    });
  }

  add(handler: KeyHandler): () => void {
    this.handlers.push(handler);
    return () => {
      const at = this.handlers.indexOf(handler);
      if (at >= 0) this.handlers.splice(at, 1);
    };
  }
}
