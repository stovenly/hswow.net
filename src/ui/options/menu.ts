import {
  CATEGORIES,
  DEFAULT_OPTIONS,
  clearOptions,
  effective,
  type Category,
  type ChoiceControl,
  type Control,
  type Options,
  type SliderControl,
  type ToggleControl,
} from './model';
import { onFontChange, offFontChange } from './font';

/**
 * The options menu, and the button that opens it.
 *
 * There is no pause. Releasing the mouse stops you steering and nothing else —
 * the wind keeps blowing, the mill keeps turning — so this is a menu reachable
 * while you are not playing rather than a screen the game stops behind. Hence
 * the barely tinted backdrop: half the panel is video settings, and you are
 * meant to watch the dither come off the world as you drag the switch.
 *
 * **Every row is built from the schema in `model.ts`.** Nothing here knows that
 * reduced motion overrides four other switches, or that the correction strength
 * appears only once a correction is chosen; it reads `enabledWhen` and
 * `shownWhen`, displays the value `effective` reports, and redraws. Adding an
 * option is one entry in that file and no change to this one.
 */

/** Which tab the panel opens on. */
const FIRST_TAB = 'video';

interface Row {
  /** Pushes the current option value back into the DOM. */
  sync: () => void;
}

export class OptionsMenu {
  private readonly options: Options;
  private readonly onChange: (options: Options) => void;
  private readonly onResume: () => void;

  private readonly root: HTMLDivElement;
  private readonly opener: HTMLButtonElement;
  private readonly rows: Row[] = [];
  private readonly tabs: { id: string; tab: HTMLButtonElement; page: HTMLElement }[] = [];

  private current = FIRST_TAB;
  private shown = false;

  constructor(
    overlay: HTMLElement,
    options: Options,
    handlers: { onChange: (options: Options) => void; onResume: () => void },
  ) {
    this.options = options;
    this.onChange = handlers.onChange;
    this.onResume = handlers.onResume;

    this.opener = document.createElement('button');
    this.opener.id = 'options-open';
    this.opener.type = 'button';
    this.opener.textContent = 'options';
    this.opener.addEventListener('click', () => this.show());

    this.root = document.createElement('div');
    this.root.id = 'options';
    this.root.hidden = true;

    // Full-screen, and the reason the panel is usable at all: without it a
    // click outside the box lands on the canvas, takes pointer lock, and the
    // menu vanishes mid-adjustment. Clicking it closes the menu.
    const scrim = document.createElement('div');
    scrim.className = 'options-scrim';
    scrim.addEventListener('click', () => this.hide());

    const panel = document.createElement('div');
    panel.className = 'options-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Options');

    const title = document.createElement('div');
    title.className = 'options-title';
    title.textContent = 'options';

    const strip = document.createElement('div');
    strip.className = 'options-tabs';
    strip.setAttribute('role', 'tablist');

    const pages = document.createElement('div');
    pages.className = 'options-pages';

    for (const category of CATEGORIES) {
      const { tab, page } = this.buildCategory(category);
      strip.appendChild(tab);
      pages.appendChild(page);
    }

    const foot = document.createElement('div');
    foot.className = 'options-foot';

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'options-button';
    reset.textContent = 'defaults';
    reset.addEventListener('click', () => this.reset());

    const resume = document.createElement('button');
    resume.type = 'button';
    resume.className = 'options-button is-primary';
    resume.textContent = 'resume';
    resume.addEventListener('click', () => {
      this.hide();
      this.onResume();
    });

    foot.append(reset, resume);
    panel.append(title, strip, pages, foot);
    this.root.append(scrim, panel);
    // Into the pause stack where the page has one; the editor page does not.
    (document.getElementById('pause-buttons') ?? overlay).append(this.opener);
    overlay.append(this.root);

    window.addEventListener('keydown', this.handleKeyDown);
    // The typeface arrives some time after the switch is thrown, and the note
    // under it has to clear itself when it does.
    onFontChange(this.handleFontChange);
    this.sync();
  }

  // --- building -------------------------------------------------------------

  private buildCategory(category: Category): { tab: HTMLButtonElement; page: HTMLElement } {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'options-tab';
    tab.textContent = category.label;
    tab.setAttribute('role', 'tab');
    tab.addEventListener('click', () => {
      this.current = category.id;
      this.syncTabs();
    });

    const page = document.createElement('div');
    page.className = 'options-page';
    page.setAttribute('role', 'tabpanel');
    for (const control of category.controls) page.appendChild(this.buildControl(control));

    this.tabs.push({ id: category.id, tab, page });
    return { tab, page };
  }

  private buildControl(control: Control): HTMLElement {
    const row = document.createElement('div');
    row.className = 'options-row';

    row.appendChild(this.buildRevert(control));

    const label = document.createElement('span');
    label.className = 'options-row-label';
    label.textContent = control.label;
    row.appendChild(label);

    let sync: (options: Options) => void;
    if (control.kind === 'slider') sync = this.buildSlider(row, control);
    else if (control.kind === 'toggle') sync = this.buildToggle(row, control);
    else sync = this.buildChoice(row, control);

    // Built once and left empty when there is nothing to say, so a note
    // appearing does not change the height of the row it belongs to.
    const note = document.createElement('span');
    note.className = 'options-row-note';
    row.appendChild(note);

    this.rows.push({
      sync: () => {
        row.hidden = !(control.shownWhen?.(this.options) ?? true);
        // Marks the row as moved from its default, which is what shows the
        // revert control. Compared against the *stored* value rather than the
        // effective one: what is marked is what the player changed, not what
        // some other switch is overriding.
        row.classList.toggle(
          'is-changed',
          this.options[control.key] !== DEFAULT_OPTIONS[control.key],
        );
        const enabled = control.enabledWhen?.(this.options) ?? true;
        // Greyed rather than hidden. A control that vanishes when something
        // above it is switched off makes the panel jump under the cursor;
        // disabled, it says plainly that it exists and what it is waiting on.
        row.classList.toggle('is-disabled', !enabled);
        const text = control.note?.(this.options) ?? null;
        note.textContent = text ?? '';
        note.hidden = text === null;
        // Shown as the engine has it, not as it is stored — a suppressed
        // switch reads `off` while it is held, and visibly comes back when
        // whatever is holding it is released.
        sync(effective(this.options));
      },
    });
    return row;
  }

  /**
   * The marker to the left of a setting that has been moved: an asterisk that
   * turns into a return arrow under the cursor and puts the setting back when
   * clicked. One element doing both jobs means the mark is exactly where your
   * hand already is when you want to undo it.
   *
   * Always in the document, hidden with `visibility` rather than removed — its
   * column has to hold its width, or every label would shift sideways as
   * settings are changed.
   */
  private buildRevert(control: Control): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'options-revert';
    // The visible tooltip is a styled element below, which screen readers
    // would read as loose text; this is what actually names the control.
    button.setAttribute('aria-label', `Reset ${control.label} to default`);

    const mark = document.createElement('span');
    mark.className = 'options-revert-mark';
    mark.textContent = '*';

    const icon = document.createElement('span');
    icon.className = 'options-revert-icon';
    icon.textContent = '↺';

    const tip = document.createElement('span');
    tip.className = 'options-revert-tip';
    tip.textContent = 'Reset To Default';
    // Already announced by the label above; as a tooltip it would be read a
    // second time.
    tip.setAttribute('aria-hidden', 'true');

    button.append(mark, icon, tip);
    button.addEventListener('click', () => this.set(control.key, DEFAULT_OPTIONS[control.key]));
    return button;
  }

  private buildSlider(row: HTMLElement, control: SliderControl): (options: Options) => void {
    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'options-slider';
    input.min = String(control.min);
    input.max = String(control.max);
    input.step = String(control.step);

    const readout = document.createElement('span');
    readout.className = 'options-row-value';

    // `input` rather than `change`: the whole point is that the world moves
    // while the handle is being dragged.
    input.addEventListener('input', () => this.set(control.key, Number(input.value)));

    row.append(readout, input);
    return (options) => {
      const value = options[control.key];
      input.value = String(value);
      input.disabled = !(control.enabledWhen?.(this.options) ?? true);
      // Where the filled part of the track ends, as a percentage. CSS cannot
      // read an input's value, so a track that fills up to the handle needs
      // this one number handed to it.
      const span = Math.max(control.max - control.min, 1e-6);
      input.style.setProperty('--fill', `${((value - control.min) / span) * 100}%`);
      readout.textContent = control.format ? control.format(value) : String(value);
    };
  }

  private buildToggle(row: HTMLElement, control: ToggleControl): (options: Options) => void {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'options-switch';
    // A switch rather than a checkbox: it carries its own state as a word, so
    // it stays readable when the text size goes up and needs no drawn tick.
    button.setAttribute('role', 'switch');

    const knob = document.createElement('span');
    knob.className = 'options-switch-knob';
    const word = document.createElement('span');
    word.className = 'options-switch-word';
    button.append(knob, word);

    button.addEventListener('click', () => this.set(control.key, !this.options[control.key]));

    row.appendChild(button);
    return (options) => {
      const value = options[control.key];
      word.textContent = value ? 'on' : 'off';
      button.setAttribute('aria-checked', value ? 'true' : 'false');
      button.classList.toggle('is-on', value);
      button.disabled = !(control.enabledWhen?.(this.options) ?? true);
    };
  }

  private buildChoice(row: HTMLElement, control: ChoiceControl): (options: Options) => void {
    const select = document.createElement('select');
    select.className = 'options-select';
    for (const choice of control.choices) {
      const option = document.createElement('option');
      option.value = choice.value;
      option.textContent = choice.label;
      select.appendChild(option);
    }
    // Validated against `choices` when it is read back in `loadOptions`; the
    // only values this element can produce are the ones just added to it.
    select.addEventListener('change', () =>
      this.set(control.key, select.value as Options[typeof control.key]),
    );

    row.appendChild(select);
    return (options) => {
      select.value = options[control.key];
      select.disabled = !(control.enabledWhen?.(this.options) ?? true);
    };
  }

  // --- state ----------------------------------------------------------------

  /**
   * Writes one option and republishes the whole set. The menu redraws from the
   * same object the engine is handed, so there is no moment at which the panel
   * and the game disagree — and because the switches display `effective`
   * values, a row another switch is overriding updates itself instantly.
   */
  private set<K extends keyof Options>(key: K, value: Options[K]): void {
    this.options[key] = value;
    this.sync();
    this.onChange(this.options);
  }

  private reset(): void {
    Object.assign(this.options, DEFAULT_OPTIONS);
    // Cleared as well as overwritten, so "defaults" survives a reload rather
    // than becoming a saved copy of today's defaults that would not move if a
    // default ever changed.
    clearOptions();
    this.sync();
    this.onChange(this.options);
  }

  /** Redraws every row. Cheap, and the only way the panel is ever updated. */
  sync(): void {
    for (const row of this.rows) row.sync();
    this.syncTabs();
  }

  private syncTabs(): void {
    for (const entry of this.tabs) {
      const active = entry.id === this.current;
      entry.tab.classList.toggle('is-active', active);
      entry.tab.setAttribute('aria-selected', active ? 'true' : 'false');
      entry.page.hidden = !active;
    }
  }

  // --- visibility -----------------------------------------------------------

  show(): void {
    if (this.shown) return;
    this.shown = true;
    this.root.hidden = false;
    document.body.classList.add('is-options');
    // Re-read on the way in. The debug panel writes into the same object, so
    // the rows can be stale by the time anybody opens this.
    this.sync();
  }

  hide(): void {
    if (!this.shown) return;
    this.shown = false;
    this.root.hidden = true;
    document.body.classList.remove('is-options');
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.shown) return;
    // Claimed, so the pause stack's own Escape does not also resume.
    event.preventDefault();
    this.hide();
  };

  private readonly handleFontChange = (): void => this.sync();

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    offFontChange(this.handleFontChange);
    this.root.remove();
    this.opener.remove();
  }
}
