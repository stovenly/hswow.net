import './styles.css';

/** A toolbar button that can be latched on. */
export interface Toggle {
  readonly element: HTMLButtonElement;
  set pressed(on: boolean);
}

/** The toolbar across the top and the status line along the bottom. */
export class Chrome {
  readonly toolbar = document.createElement('div');
  readonly status = document.createElement('div');
  private readonly fields = new Map<string, HTMLSpanElement>();
  private readonly note = document.createElement('span');

  constructor(parent: HTMLElement = document.body) {
    this.toolbar.className = 'editor-toolbar';
    this.status.className = 'editor-status';
    this.note.className = 'editor-status-note';
    this.status.append(this.note);
    parent.append(this.toolbar, this.status);
  }

  group(): HTMLDivElement {
    const group = document.createElement('div');
    group.className = 'editor-group';
    this.toolbar.append(group);
    return group;
  }

  button(into: HTMLElement, label: string, onClick: () => void, title?: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = label;
    if (title) button.title = title;
    button.addEventListener('click', () => {
      onClick();
      button.blur();
    });
    into.append(button);
    return button;
  }

  toggle(into: HTMLElement, label: string, onClick: () => void, title?: string): Toggle {
    const element = this.button(into, label, onClick, title);
    element.setAttribute('aria-pressed', 'false');
    return {
      element,
      set pressed(on: boolean) {
        element.setAttribute('aria-pressed', on ? 'true' : 'false');
      },
    };
  }

  select(into: HTMLElement, options: string[], onChange: (value: string) => void): HTMLSelectElement {
    const select = document.createElement('select');
    for (const option of options) {
      const item = document.createElement('option');
      item.value = option;
      item.textContent = option;
      select.append(item);
    }
    select.addEventListener('change', () => {
      onChange(select.value);
      select.blur();
    });
    into.append(select);
    return select;
  }

  /** Named readouts, in the order they were first written. */
  set(key: string, text: string, warning = false): void {
    let field = this.fields.get(key);
    if (!field) {
      field = document.createElement('span');
      this.fields.set(key, field);
      this.status.insertBefore(field, this.note);
    }
    if (field.textContent !== text) field.textContent = text;
    field.classList.toggle('is-warning', warning);
  }

  /** The right-hand message: what just happened, or what is in progress. */
  say(text: string): void {
    this.note.textContent = text;
  }
}
