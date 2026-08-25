/**
 * The editor's own controls.
 *
 * lil-gui is a tuning panel: wide rows, a slider track on every number, one
 * accordion. That is right for a developer's scratchpad and wrong for the thing
 * you place a village with — so the panels the editor owns are built from these
 * instead, and lil-gui is left holding the game's own tuning folders.
 *
 * A number is scrubbed by dragging its label and typed by clicking its field.
 */

export type Cleanup = () => void;

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export interface NumberOptions {
  min?: number;
  max?: number;
  step?: number;
  /** Units per pixel dragged. Defaults to `step`, or a hundredth of the range. */
  scrub?: number;
  suffix?: string;
}

export class Panel {
  readonly element = element('div', 'ed-panel');
  private readonly body = element('div', 'ed-body');

  constructor(title?: string) {
    if (title) this.element.append(element('div', 'ed-panel-title', title));
    this.element.append(this.body);
  }

  clear(): void {
    this.body.replaceChildren();
  }

  get empty(): boolean {
    return this.body.childElementCount === 0;
  }

  /** A collapsible group. Sections remember nothing; the panel is rebuilt. */
  section(name: string, open = true): Section {
    const wrap = element('div', 'ed-section');
    const head = element('button', 'ed-section-head');
    const caret = element('span', 'ed-caret', open ? '▾' : '▸');
    head.append(caret, element('span', 'ed-section-name', name));
    const rows = element('div', 'ed-rows');
    if (!open) rows.classList.add('is-shut');
    head.addEventListener('click', () => {
      const shut = rows.classList.toggle('is-shut');
      caret.textContent = shut ? '▸' : '▾';
      head.blur();
    });
    wrap.append(head, rows);
    this.body.append(wrap);
    return new Section(rows);
  }

  /** A group with no heading, for the two or three things above the first one. */
  loose(): Section {
    const rows = element('div', 'ed-rows');
    this.body.append(rows);
    return new Section(rows);
  }
}

export class Section {
  private readonly rows: HTMLElement;

  constructor(rows: HTMLElement) {
    this.rows = rows;
  }

  private row(label: string): HTMLElement {
    const row = element('div', 'ed-row');
    row.append(element('label', 'ed-label', label));
    const cell = element('div', 'ed-cell');
    row.append(cell);
    this.rows.append(row);
    return cell;
  }

  /** A line of text, for what a control cannot say itself. */
  note(text: string): void {
    this.rows.append(element('div', 'ed-note', text));
  }

  /** Read-only, for an id or a count. */
  readout(label: string, value: string): void {
    const cell = this.row(label);
    cell.append(element('span', 'ed-readout', value));
  }

  text(label: string, value: string, onChange: (value: string) => void): HTMLInputElement {
    const cell = this.row(label);
    const input = element('input', 'ed-input');
    input.type = 'text';
    input.value = value;
    input.addEventListener('change', () => onChange(input.value));
    cell.append(input);
    return input;
  }

  toggle(label: string, value: boolean, onChange: (value: boolean) => void): HTMLInputElement {
    const cell = this.row(label);
    const input = element('input', 'ed-check');
    input.type = 'checkbox';
    input.checked = value;
    input.addEventListener('change', () => onChange(input.checked));
    cell.append(input);
    return input;
  }

  select(
    label: string,
    value: string,
    options: readonly string[],
    onChange: (value: string) => void,
  ): HTMLSelectElement {
    const cell = this.row(label);
    const select = optionList(options, value);
    select.addEventListener('change', () => {
      onChange(select.value);
      select.blur();
    });
    cell.append(select);
    return select;
  }

  /** A dropdown of entry ids with a crosshair beside it. */
  ref(
    label: string,
    value: string,
    options: readonly string[],
    onChange: (value: string) => void,
    onPick: (accept: (id: string) => void) => void,
  ): void {
    const cell = this.row(label);
    const select = optionList(['', ...options], value);
    select.addEventListener('change', () => onChange(select.value));
    const pick = element('button', 'ed-pick', '⌖');
    pick.title = 'pick it in the view';
    pick.addEventListener('click', () => {
      pick.blur();
      onPick((id) => {
        select.value = id;
        onChange(id);
      });
    });
    cell.append(select, pick);
  }

  /**
   * A number. Drag the label to scrub it, click the field to type one.
   *
   * No slider track: a track spends the width of the row saying what two
   * numbers already say, and it cannot be nudged by a hundredth.
   */
  number(
    label: string,
    value: number,
    options: NumberOptions,
    onChange: (value: number) => void,
  ): HTMLInputElement {
    const cell = this.row(label);
    const input = element('input', 'ed-input ed-number');
    input.type = 'text';
    input.inputMode = 'decimal';

    const step = options.step ?? 0.01;
    const decimals = Math.max(0, -Math.floor(Math.log10(step)));
    const show = (n: number): void => {
      input.value = n.toFixed(decimals);
    };
    const clamp = (n: number): number =>
      Math.min(Math.max(n, options.min ?? -Infinity), options.max ?? Infinity);

    let held = clamp(value);
    show(held);

    const commit = (n: number): void => {
      const next = clamp(Math.round(n / step) * step);
      if (next === held) return;
      held = next;
      show(held);
      onChange(held);
    };

    input.addEventListener('change', () => {
      const typed = Number.parseFloat(input.value);
      if (Number.isFinite(typed)) commit(typed);
      else show(held);
    });

    // The label is the scrub handle: the field stays clickable for typing, and
    // there is nothing else on the row to grab.
    const handle = cell.previousElementSibling as HTMLElement;
    handle.classList.add('ed-scrub');
    const perPixel =
      options.scrub ??
      (options.min !== undefined && options.max !== undefined
        ? (options.max - options.min) / 300
        : step);

    let from = 0;
    let start = 0;
    let scrubbing = false;
    handle.addEventListener('pointerdown', (event) => {
      scrubbing = true;
      from = event.clientX;
      start = held;
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener('pointermove', (event) => {
      if (!scrubbing) return;
      const fine = event.shiftKey ? 0.15 : 1;
      commit(start + (event.clientX - from) * perPixel * fine);
    });
    const stop = (event: PointerEvent): void => {
      if (!scrubbing) return;
      scrubbing = false;
      handle.releasePointerCapture(event.pointerId);
    };
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);

    if (options.suffix) cell.append(element('span', 'ed-suffix', options.suffix));
    cell.append(input);
    return input;
  }

  /** Two or three numbers on one row, for a position or a size. */
  vector(
    label: string,
    values: readonly number[],
    names: readonly string[],
    options: NumberOptions,
    onChange: (index: number, value: number) => void,
  ): void {
    const cell = this.row(label);
    cell.classList.add('ed-vector');
    values.forEach((value, index) => {
      const axis = element('div', 'ed-axis');
      const tag = element('span', 'ed-axis-name ed-scrub', names[index] ?? String(index));
      const input = element('input', 'ed-input ed-number');
      input.type = 'text';
      input.inputMode = 'decimal';

      const step = options.step ?? 0.01;
      const decimals = Math.max(0, -Math.floor(Math.log10(step)));
      let held = value;
      input.value = held.toFixed(decimals);

      const commit = (n: number): void => {
        const next = Math.round(n / step) * step;
        if (next === held) return;
        held = next;
        input.value = held.toFixed(decimals);
        onChange(index, held);
      };
      input.addEventListener('change', () => {
        const typed = Number.parseFloat(input.value);
        if (Number.isFinite(typed)) commit(typed);
        else input.value = held.toFixed(decimals);
      });

      let from = 0;
      let start = 0;
      let scrubbing = false;
      tag.addEventListener('pointerdown', (event) => {
        scrubbing = true;
        from = event.clientX;
        start = held;
        tag.setPointerCapture(event.pointerId);
        event.preventDefault();
      });
      tag.addEventListener('pointermove', (event) => {
        if (!scrubbing) return;
        commit(start + (event.clientX - from) * (options.scrub ?? step) * (event.shiftKey ? 0.15 : 1));
      });
      const stop = (event: PointerEvent): void => {
        if (!scrubbing) return;
        scrubbing = false;
        tag.releasePointerCapture(event.pointerId);
      };
      tag.addEventListener('pointerup', stop);
      tag.addEventListener('pointercancel', stop);

      axis.append(tag, input);
      cell.append(axis);
    });
  }

  /** A row of buttons, which is how an action reads next to a form. */
  actions(...buttons: { label: string; title?: string; onClick: () => void }[]): void {
    const row = element('div', 'ed-actions');
    for (const spec of buttons) {
      const button = element('button', 'ed-button', spec.label);
      if (spec.title) button.title = spec.title;
      button.addEventListener('click', () => {
        spec.onClick();
        button.blur();
      });
      row.append(button);
    }
    this.rows.append(row);
  }
}

function optionList(options: readonly string[], value: string): HTMLSelectElement {
  const select = element('select', 'ed-select');
  for (const option of options) {
    const item = element('option');
    item.value = option;
    item.textContent = option === '' ? '—' : option;
    select.append(item);
  }
  select.value = value;
  return select;
}
