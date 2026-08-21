# Readables — the polish pass

The reading system works. `ui/Reading.ts` opens, paginates against a measured
box, turns pages by arrows, keys and wheel, releases and retakes pointer lock,
and the roster of books, notes, letters and scrolls is complete. What it does
not do is look good.

This is the pass that makes the screen worth stopping for. Nothing here changes
what a note is or where the words live — it is presentation and feel only.

Not scheduled. Written so it does not get forgotten.

---

## 1. The screen itself

The page is a scrim, a box, a title, a body and a footer, and it reads as a
dialog with prose in it rather than as a thing you are holding. Worth trying, in
rough order of how much they would change the impression:

- **A page that looks like a page.** The body sits on a flat panel; paper has a
  tone, an edge and a little weight. Whatever is done here must survive the
  quantizer and the chunky stage without banding.
- **The turn.** A page change is instant. Even a short cross-fade or a slide
  would give the arrows something to mean. Whatever it is, it reads the reduced
  motion switch.
- **Type.** One size, one measure, one leading, for a pamphlet and for a ledger
  alike. Different covers could carry different type without any change to the
  note format — the cover is already known when the screen opens.
- **The footer.** Page count and two arrows, laid out like a form control. This
  is the most obviously unfinished part of the screen.

**The constraint that holds:** the reading screen and the pause menu must read
as one game's interface. Judge them by opening each in turn, not by looking at
either alone.

## 2. Reading state, and holding your place

Three items specified in the closed document's last phase and never built. They
are polish rather than feature, which is why they are here:

- **Read-state dimming** on the tooltip, so a note you have finished looks
  different from one you have not.
- **The read set in the autosave payload.** It is already listed there; nothing
  writes it.
- **Repagination that holds your place by word rather than by page number**, so
  changing text size mid-note does not throw you elsewhere in it. *Done when* a
  note read at one size, resized, and re-read leaves you on the same sentence.

## 3. Accessibility

- **The reduced-motion hold on page turns**, whatever the turn ends up being.
- The `--prose` custom property and the `.is-dyslexic` override exist. A full
  page of prose wants judging at the default size, at the largest size, and in
  OpenDyslexic, and the measure adjusted from what that shows.

## 4. Not in this pass

`[[keyword]]` markup — parsing it, rendering it highlighted, and teaching a
topic from it — belongs with dialogue and the topic pool. It is Phase 8 work and
is recorded in `MASTER-SPEC.md`, not here.

A page-turn sound is fair game any time; the object it needs already exists.
