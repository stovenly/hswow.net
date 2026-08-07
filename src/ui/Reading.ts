import { onFontChange, offFontChange } from './options/font';
import type { Note } from '../content/notes';

/**
 * The reading screen.
 *
 * The first interface the game has that is *in* the game rather than around it.
 * It shares the pause menu's register — flat dark panel, hard one-pixel border,
 * small letterspaced chrome — and shares none of its classes, because the two
 * are answerable to different things: that one is a settings dialog and this one
 * is a page of prose, and the day the settings panel changes shape is not a day
 * a book should.
 *
 * **One screen for everything.** A scroll, a letter and a folio all open here.
 * That is not diegetic and it is the right trade: three layouts would be three
 * pagination bugs, and the object the player just looked at is still on the
 * screen behind saying which of the three it was.
 *
 * **Nothing scrolls.** A note longer than the box is paginated, not scrolled.
 * Scrolling has no end state — you never know whether you have read the thing —
 * and a page count does.
 *
 * **The pagination is measured, not estimated.** Characters per page is a guess
 * that is wrong for every typeface, every text size and every window, and the
 * dyslexia-friendly face is substantially wider than the default at the same
 * size. So the words go into the real box and the browser is asked how tall
 * they came out. The cost is a run of synchronous layouts when a note opens,
 * which is once per note and invisible.
 */

interface Handlers {
  /** Called on the way in — where the pointer lock is given up. */
  onOpen: () => void;
  /** Called on the way out — where it is taken back. */
  onClose: () => void;
}

/**
 * One word, or a piece of one.
 *
 * Pagination breaks between tokens, so a token is the smallest thing that can
 * be moved to the next page — which means an unbroken run of characters longer
 * than a page would have nowhere to go and would be quietly clipped. Long runs
 * are therefore cut into pieces at parse time and rejoined with no space, so
 * the text reads exactly as written and the paginator still has somewhere to
 * break. See `CHUNK`.
 */
interface Token {
  readonly text: string;
  /** Which paragraph it belongs to. Consecutive tokens sharing one share a `<p>`. */
  readonly block: number;
  /** Set on the pieces of a split run: appended with no space before it. */
  readonly joined: boolean;
}

/** Longest run of non-space characters kept whole. */
const CHUNK = 32;

/** How far a wheel has to travel before it turns a page. */
const WHEEL_STEP = 60;

export class Reading {
  private readonly root: HTMLDivElement;
  private readonly titleEl: HTMLDivElement;
  private readonly bodyEl: HTMLDivElement;
  private readonly countEl: HTMLDivElement;
  private readonly prevEl: HTMLButtonElement;
  private readonly nextEl: HTMLButtonElement;
  private readonly handlers: Handlers;
  private readonly resize: ResizeObserver;

  private tokens: Token[] = [];
  /** Token indices a page is forced to start at — the `---` marks. */
  private hard: number[] = [];
  /** The token each page starts at. Its length is the page count. */
  private starts: number[] = [0];
  /** Tokens on the last page fitted, as the opening guess for the next. */
  private span = 64;

  private page = 0;
  private wheel = 0;
  private open_ = false;
  /** The box as it was when the current pagination was measured against it. */
  private measured = '';

  constructor(overlay: HTMLElement, handlers: Handlers) {
    this.handlers = handlers;

    this.root = document.createElement('div');
    this.root.id = 'reading';
    this.root.hidden = true;

    // Invisible and necessary, for the options panel's reason: without it every
    // click outside the page lands on the canvas, takes pointer lock, and the
    // note disappears mid-sentence.
    const scrim = document.createElement('div');
    scrim.className = 'reading-scrim';
    scrim.addEventListener('click', () => this.close());

    const book = document.createElement('div');
    book.className = 'reading-book';
    book.setAttribute('role', 'dialog');
    book.setAttribute('aria-modal', 'true');

    this.titleEl = document.createElement('div');
    this.titleEl.className = 'reading-title';

    this.bodyEl = document.createElement('div');
    this.bodyEl.className = 'reading-body';

    const foot = document.createElement('div');
    foot.className = 'reading-foot';

    this.prevEl = this.turn('‹', -1, 'Previous page');
    this.nextEl = this.turn('›', 1, 'Next page');

    this.countEl = document.createElement('div');
    this.countEl.className = 'reading-count';

    foot.append(this.prevEl, this.countEl, this.nextEl);
    book.append(this.titleEl, this.bodyEl, foot);
    this.root.append(scrim, book);
    overlay.append(this.root);

    window.addEventListener('keydown', this.handleKeyDown);
    this.root.addEventListener('wheel', this.handleWheel, { passive: true });
    // Catches the window resizing and the text-size slider in one, since both
    // reach the box as a change in its measurements. The typeface arriving does
    // not — the box is the same size in a different face — so that is listened
    // for separately.
    this.resize = new ResizeObserver(this.handleResize);
    this.resize.observe(this.bodyEl);
    onFontChange(this.reflow);
  }

  get shown(): boolean {
    return this.open_;
  }

  /**
   * Opens a note at its first page.
   *
   * The panel is unhidden *before* the note is laid out, because a hidden box
   * has no height and pagination measured against no height is one page of
   * nothing.
   */
  open(note: Note): void {
    this.titleEl.textContent = note.title;
    const parsed = parse(note.body);
    this.tokens = parsed.tokens;
    this.hard = parsed.hard;

    // Only on the way in from closed. Opening a second note over the first is
    // one screen showing something else, not a second screen — and telling the
    // caller it opened again would have it record a pointer-lock state it had
    // already given up, so closing would leave the mouse free.
    const entering = !this.open_;
    this.open_ = true;
    this.root.hidden = false;
    document.body.classList.add('is-reading');
    if (entering) this.handlers.onOpen();

    this.span = 64;
    this.repaginate();
    this.turnTo(0);
  }

  close(): void {
    if (!this.open_) return;
    this.open_ = false;
    this.root.hidden = true;
    document.body.classList.remove('is-reading');
    this.handlers.onClose();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.root.removeEventListener('wheel', this.handleWheel);
    this.resize.disconnect();
    offFontChange(this.reflow);
    this.root.remove();
  }

  // --- pagination -----------------------------------------------------------

  /**
   * Walks the note, one page at a time, asking the box what fits.
   *
   * Every page is found by galloping out from the length of the last one and
   * then bisecting the bracket that overshot. A plain bisection over the whole
   * remaining note would work and would cost `log(words)` layouts a page rather
   * than `log(page)`; on a long note that is the difference between a few dozen
   * measurements and a few hundred.
   */
  private repaginate(): void {
    this.starts = [0];
    let at = 0;
    while (at < this.tokens.length) {
      const end = this.fitFrom(at);
      // Cannot happen with runs chunked, and the loop must terminate anyway: a
      // page that fits nothing would otherwise be found forever.
      at = Math.max(end, at + 1);
      if (at < this.tokens.length) this.starts.push(at);
    }
    this.measured = `${this.bodyEl.clientWidth}x${this.bodyEl.clientHeight}`;
  }

  /** Where the page starting at `start` ends. */
  private fitFrom(start: number): number {
    // A hard break is a page end whatever else would have fitted.
    const limit = this.hard.find((mark) => mark > start) ?? this.tokens.length;
    if (start >= limit) return limit;

    let fits = start;
    let over = limit + 1;
    let step = Math.max(16, this.span);
    let probe = Math.min(limit, start + step);
    for (;;) {
      if (!this.fitsFrom(start, probe)) {
        over = probe;
        break;
      }
      fits = probe;
      if (probe === limit) break;
      step *= 2;
      probe = Math.min(limit, probe + step);
    }

    let lo = fits + 1;
    let hi = over - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (this.fitsFrom(start, mid)) {
        fits = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    this.span = Math.max(8, fits - start);
    return fits;
  }

  /** Lays out `[from, to)` in the real box and asks whether it overflowed. */
  private fitsFrom(from: number, to: number): boolean {
    this.paint(from, to);
    // A pixel of tolerance. Line boxes and margins are fractional, and a page
    // rejected for a third of a pixel loses a whole line of type.
    return this.bodyEl.scrollHeight - this.bodyEl.clientHeight <= 1;
  }

  private paint(from: number, to: number): void {
    const fragment = document.createDocumentFragment();
    let paragraph: HTMLParagraphElement | null = null;
    let block = -1;
    for (let i = from; i < to; i++) {
      const token = this.tokens[i];
      if (paragraph === null || token.block !== block) {
        paragraph = document.createElement('p');
        paragraph.className = 'reading-para';
        paragraph.textContent = token.text;
        fragment.append(paragraph);
        block = token.block;
      } else {
        paragraph.textContent += (token.joined ? '' : ' ') + token.text;
      }
    }
    this.bodyEl.replaceChildren(fragment);
  }

  // --- turning --------------------------------------------------------------

  private turnTo(page: number): void {
    const last = this.starts.length - 1;
    this.page = Math.min(Math.max(page, 0), last);
    const from = this.starts[this.page];
    const to = this.starts[this.page + 1] ?? this.tokens.length;
    this.paint(from, to);

    this.countEl.textContent = `${this.page + 1} / ${this.starts.length}`;
    // Held in place and dimmed rather than removed: a control that disappears
    // on the first page moves the count sideways under the cursor, and a
    // one-page note would lose the whole footer.
    this.prevEl.disabled = this.page === 0;
    this.nextEl.disabled = this.page === last;
  }

  private turn(glyph: string, direction: number, label: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'reading-turn';
    button.textContent = glyph;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => this.turnTo(this.page + direction));
    return button;
  }

  /**
   * Re-measures, keeping the reader on the words they were looking at.
   *
   * By the first word of the page rather than by the page number, which is the
   * whole reason this is not two lines: making the text bigger cuts the note
   * into more pages, so page four of nine is somewhere else entirely in page
   * six of fourteen. The word is the thing that did not move.
   */
  private readonly handleResize = (): void => {
    // The observer fires once on its own the moment the panel is unhidden, and
    // that is the pagination that has just been done. Comparing against what
    // was measured turns that into a no-op instead of a second full pass.
    if (!this.open_) return;
    if (`${this.bodyEl.clientWidth}x${this.bodyEl.clientHeight}` === this.measured) return;
    this.reflow();
  };

  private readonly reflow = (): void => {
    if (!this.open_ || this.bodyEl.clientHeight === 0) return;
    const anchor = this.starts[this.page] ?? 0;
    this.span = 64;
    this.repaginate();
    let page = 0;
    while (page + 1 < this.starts.length && this.starts[page + 1] <= anchor) page++;
    this.turnTo(page);
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.open_ || event.repeat) return;
    switch (event.code) {
      case 'Escape':
      case 'KeyE':
        this.close();
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.turnTo(this.page + 1);
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.turnTo(this.page - 1);
        break;
      default:
        return;
    }
    // Only for keys this actually took. Anything else is somebody else's.
    event.preventDefault();
  };

  private readonly handleWheel = (event: WheelEvent): void => {
    if (!this.open_) return;
    this.wheel += event.deltaY;
    while (this.wheel >= WHEEL_STEP) {
      this.wheel -= WHEEL_STEP;
      this.turnTo(this.page + 1);
    }
    while (this.wheel <= -WHEEL_STEP) {
      this.wheel += WHEEL_STEP;
      this.turnTo(this.page - 1);
    }
  };
}

/**
 * The note body's markup, which is three marks and no more.
 *
 * A blank line starts a paragraph, a line of three or more hyphens forces a
 * page, and that is the lot. There is deliberately no way to say *bold* or
 * *centred*: the reading screen decides how a note looks, and a format that
 * lets one note style itself is a format where two notes disagree.
 */
function parse(body: string): { tokens: Token[]; hard: number[] } {
  const tokens: Token[] = [];
  const hard: number[] = [];
  let block = 0;
  let lines: string[] = [];

  const flush = (): void => {
    if (lines.length === 0) return;
    block++;
    for (const word of lines.join(' ').split(/\s+/)) {
      if (word === '') continue;
      if (word.length <= CHUNK) {
        tokens.push({ text: word, block, joined: false });
        continue;
      }
      for (let i = 0; i < word.length; i += CHUNK) {
        tokens.push({ text: word.slice(i, i + CHUNK), block, joined: i > 0 });
      }
    }
    lines = [];
  };

  for (const line of body.replace(/\r\n?/g, '\n').split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '') {
      flush();
    } else if (/^-{3,}$/.test(trimmed)) {
      flush();
      // Recorded after the flush, so the mark lands between the paragraph that
      // ended and the one that follows rather than inside either.
      hard.push(tokens.length);
    } else {
      lines.push(trimmed);
    }
  }
  flush();

  return { tokens, hard };
}
