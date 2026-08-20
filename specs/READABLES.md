# Books, letters and notes — spec

**Not built.** This is the plan for things in the world that carry writing, the screen you
read them on, and where the words live. Names throughout are provisional — file name,
builder slugs, key names, and every word of fiction are yours.

SPEC.md already commits to most of the shape: Phase 8 lists *"readable notes and letters
found in the world — these teach keywords too"*, `[[keyword]]` markup that highlights and
teaches as lines are read, a `NoteUI`, and `content/notes/` as data. EDITOR.md's delineation
paragraph already reserves the directory: *"`content/notes/` — readable text, teaching
keywords."* So this document is not opening a question; it is answering one that was left
one line long, and building the half that does not need quests to exist.

## The one decision everything else falls out of

**Three things, and each is edited on its own: the object, the text, and the binding
between them.**

You proposed the text be stored independently of books, with each readable mapping to one
text entry, and the editor setting the two separately. That is right, and it is worth
saying *why* it is right, because the alternative looks cheaper right up until it isn't:

- **A text outlives its object.** A pamphlet nailed up in three villages is one piece of
  writing and three props. Inlined, it is three copies, and the third one keeps the typo.
- **A prop outlives its text.** Deciding a book on a shelf should say something different
  is a content edit; it must not be a placement edit, or every rewrite risks moving
  furniture.
- **Prose does not belong in a coordinate file.** A zone document is `at`, `yaw`, `seed`.
  Four hundred words of a letter in the middle of that is unreadable as data *and*
  unwritable as prose, and whoever writes the fiction will not go looking for it there.
- **The checks want it.** `check:world` grows a cross-reference pass the moment ids point
  across files. A dangling `text` id becomes a failed check instead of a book that opens
  blank.

So an entry names a text and does not contain one:

```jsonc
{ "prop": "leather-book", "seed": 12, "at": [1.2, 0.78, -0.4], "yaw": 0.4,
  "text": "treatise-on-prague" }
```

**And the binding is optional, which is the part that is easy to miss.** A shelf wants
thirty books and one of them readable. An entry with no `text` is furniture: no tooltip
beyond its own name, nothing to press, no note file, no check. Readable is a thing a prop
*is given*, not a thing a book *is*. Get this wrong and either every book in the world
demands a piece of writing, or you need a second set of "fake book" builders that are the
same geometry with the verb sanded off.

**Rejected: an inline shorthand.** `"text": { "title": …, "body": … }` for one-line scraps
is tempting and costs a fork in every consumer — the loader, the editor, the keyword
cross-reference, the "where is this note used" query. One way to say it. A two-word note
gets a two-line file.

## The text document

```jsonc
// content/notes/treatise-on-prague.json
{
  "id": "treatise-on-prague",
  "title": "A Treatise On Prague",
  "body": "..."
}
```

- **`title`** is what the player sees on the tooltip and at the head of the page. It is the
  name of the *work*, not of the object — see the tooltip section.
- There is **no `kind` field**, and there was one in the first draft of this document. It
  picked a page layout per sort of writing — spread for books, sheet for letters, column for
  scrolls — and that is three layouts to build, three to keep working at every text size, and
  a question ("is this a letter or a note?") asked of every piece of writing for no gain the
  reader can see. One screen reads everything. See the reading section.
- **`body`** is prose with three pieces of markup and no more: a blank line is a paragraph
  break, `[[keyword]]` marks a topic (rendered highlighted now, taught when Phase 8 exists),
  and a lone `---` on its own line is a **hard page break** the writer asked for. Everything
  else — where lines fall, where pages break — is measured at read time, and the section
  below says why.
- No styling markup. No bold, no italic, no headings. The interface has none anywhere
  (`font.ts` downloads regular only, and says so), and a note that needs a heading is two
  notes.

**Where the files live before the editor exists.** `content/notes/` as JSON is the
destination, and the zone interpreter is not built yet. That is not a reason to wait: the
shape above is sourced from a plain TypeScript module today (`content/notes.ts`, one
exported record, typed), and the interpreter later reads JSON into the identical shape. One
sentence of cost, and the format is exercised by real content a phase before the loader
exists.

## Naming: two lines over the crosshair

`Reticle` already draws exactly the block you described, for doors:

```
     Wooden Door
          to
   Arkstin Village
```

A readable is the same block with the joiner suppressed:

```
  Leather Bound Book
  A Treatise On Prague
```

The upper line is the *object* and comes from the builder — `MeshBuilder.display` is
already the field for "what the player calls this when the identifier would not help", and
it is exactly the right home for "Leather Bound Book". The lower line is the *work* and
comes from the note's `title`. So neither name is stored on the placement, and the tooltip
is built from the two things it is already made of.

The cost is one field on `Prompt` and one CSS modifier. Today `.prompt-target` is set
*slightly dimmer* than `.prompt-title` (92 % against full), because for a door the object is
the thing under the crosshair and the destination is the consequence. For a readable the
emphasis inverts — the object is a book, and the title is what you are deciding whether to
read — so `#prompt.is-readable` drops the object line's size and lifts the title's. Same
three-line grid, same centring, one class.

**The binding is the tooltip.** Assign a text to a book and it gets the two-line prompt,
always — there is no second switch, no per-placement opt-in, nothing to forget. A book with
writing assigned announces itself; a book with none is furniture and says nothing under the
crosshair unless somebody deliberately labelled it as scenery through the existing
`markLabelled` path. That is the whole rule, and it means the shelf sorts itself out: the one
book that has something to say is the one that speaks.

## The verb: a third kind of thing under the crosshair

Today the crosshair resolves to exactly two states, and the second one is a dead end:

- a **door**, which `ZoneManager.update` returns so `main.ts` can act on `E`;
- something **labelled**, which shows a tooltip and returns `null` — *"Readable and not
  usable is a real state, and the one a caption is in."*

A readable is the third: labelled **and** usable, and not a portal. So `update()` stops
returning `PortalSide | null` and returns a small union — `{ kind: 'door', … } | { kind:
'read', … } | null` — and `main.ts`'s one line becomes a two-arm switch. This is a change
worth making deliberately rather than by special-casing, because the gallery sign, the door
and the book are three points on a line that will get a fourth (a container, a lever) and
the shape should hold when it does.

Everything else the interaction system already gives for free:

- **Reach gates it.** `DEFAULT_REACH` is 3.2 m and `Interaction`'s doc states the contract —
  *if you can read it, you can use it.* A book you can see across a room does not offer
  itself, which is correct: reading is a thing you walk up to.
- **Occlusion is handled.** The second raycast against the collider already stops you
  reading a book through a wall.
- **Registration is automatic.** Zone entry walks the tree collecting `userData.label`, so a
  readable is picked up by carrying a label — no builder needs a handle on the interaction
  system. `markReadable(object, { text })` is `markLabelled` plus one more key.

**Do not merge a readable into scenery.** A `book-stack` prop is one mesh of six books and
you cannot read one of them — the raycast returns the stack. This is VISTA.md's merged-chunk
picking problem in miniature, and here the fix is free: a stack is furniture, and a readable
is placed as its own entry standing on or beside it.

## The reading screen

This is the first UI the game has that is *in* the fiction, and the pause menu is
deliberately not. They should share a system and not a stylesheet.

**What they share.** The CSS custom properties (`--ink`, `--void`), the rem-based sizing so
the accessibility text-size option moves both, the `.is-dyslexic` override, the rule that
DOM stays sharp above a canvas that is chunked and dithered (`Reticle`'s header states this,
and it applies double to a page of prose), and the discipline of building rows from a schema
rather than hand-wiring DOM.

**What they must not share.** The options panel's classes. It is a settings dialog with tab
strips and sliders; a book is a page. Copying `.options-panel` and deleting two thirds of it
produces a page that inherits every future change to a settings panel, which is the marriage
you said to avoid.

### The typeface

The interface stack is `ui-monospace, "SF Mono", Menlo, Consolas, monospace`. That is right
for a settings panel — it reads as machinery — and wrong for four hundred words of a letter,
which in monospace reads as a terminal dump.

Three options:

- **A — a system serif for prose, monospace for chrome (recommended).** A second custom
  property, `--prose: Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman",
  serif`. Nothing is downloaded, which is the project's whole standing rule — the entire
  build is code, and OpenDyslexic is the single deliberate exception, fetched only when
  asked for. Serif is the one register that reads as *a page* with no asset at all, and the
  contrast against the monospace chrome does real work: the diegetic layer and the settings
  layer are visibly different systems, without either being decorated.
- **B — monospace everywhere.** One typeface, zero new decisions, and every note in the game
  reads like a log file.
- **C — the stroke font from `art/lettering`.** No. It is caps-only geometry meant for signs
  at two metres, and `lettering.ts` says so itself: *fine print stays where it always was,
  in the tooltip layer.*

**A** — and `.is-dyslexic` **must** swap `--prose` as well as `--type`. Today it swaps
`--type` only, which would leave the switch changing the settings menu and not the books.
Sustained prose is the entire point of a dyslexia-friendly typeface; a page of a book is the
single place in this game where it matters most, and an accessibility option that skips the
one screen it exists for is a no-op wearing a label.

### One screen, and it pages

**Every readable opens the same screen.** A scroll, a letter, a scrap and a bound tome are
one pane with one page in it, a page count, and an affordance either side to move between
pages. It is not diegetic and that is a deliberate trade: three layouts would each need
building, each need proving at every text size and in the dyslexic face, and each need the
writer to answer a question ("is this a letter or a note?") whose answer the reader cannot
see. One screen is one thing to get right, and getting it right is worth more than a shape
that matches the prop.

**No scrolling anywhere.** A long note becomes more pages, never a taller column. Scrolling
inside a fixed box is the failure mode pagination exists to avoid: it hides how much is left,
it fights the mouse wheel against page turns, and it makes "where was I" a scroll offset
instead of a number.

- **Pagination is measured, not authored.** Fill the page box until it overflows, back off to
  the last break, start the next page. Paragraph-granularity first, word-granularity within
  the paragraph that straddles the break. Honour `---` as a break the writer asked for.
- **Repaginate on resize, on font-size change, and when the dyslexic face lands** — that face
  is substantially wider, and the options panel already had to grow for it. Hold the reader's
  position across a repagination by remembering the *word*, not the page number, or changing
  the text size while reading throws you to a different part of the note.
- **Authored pages are rejected** for the same reason: a writer choosing breaks is choosing
  them for one font at one size in one window, and cannot see the two clicks that break it.
  The forced `---` buys back what authored pagination was actually for — the postscript that
  should start a page, the line that should stand alone.
- **The count is shown** — *3 / 7* or the like — and it is the reason no scrollbar is needed:
  the reader can always see how much is left.
- **A one-page note shows no arrows and no count.** Most notes are one page, and chrome that
  says *1 / 1* is chrome teaching the reader nothing.

### Behaviour

- **No pause.** The options menu's header is blunt about this — *"There is no pause.
  Releasing the mouse stops you steering and nothing else."* A book keeps that rule: the
  wind still blows behind the page. Which also means the page must not cover the whole
  screen; you keep the room in your peripheral vision.
- **Pointer lock releases**, as the options menu does, and is retaken on close. That single
  fact buys the movement gate for free: `Input` already refuses the entire keyboard while
  the mouse is free, so you cannot walk out of the room while reading, and nobody has to
  write a "reading" state into the controller.
- **Body class `is-reading`** hides the crosshair and the prompt, exactly as `is-playing`
  already gates both.
- **Turn** on `←`/`→`, `A`/`D`, the two arrow affordances either side of the page, and the
  mouse wheel — which is free to mean *turn the page* precisely because nothing scrolls.
  **Close** on `Esc` and on `E`. Page turns are instant or a short cross-fade, and the
  cross-fade is held by the reduced-motion option like every other movement in the game.
- `[[keyword]]` renders highlighted from day one and calls a `teach()` that is a stub until
  Phase 8. Per house rule that is a sentence, not a gate — and having the markup rendered
  and looked at long before quests exist is how the highlight gets judged at all.
- **Read state.** Autosave already lists "read notes" in its payload. A note you have read
  can dim its title on the tooltip, the way asked topics dim in the dialogue plan. Cheap,
  and the thing that makes a shelf of eight readables navigable on a second visit.

## The builders

### One builder per cover, and the builder handles its own states

**A cover style is a builder.** `leather-book` is one style of book and gets its own file;
so does every other cover. That builder then knows how to pose its own object — shut, open,
face down — through options, because opening a leather book and opening a limp-bound
pamphlet are different operations on different geometry, and the builder that made the
covers is the only thing that knows how they fall.

The tooltip agrees, which is a useful check rather than the reason: the upper line comes from
`MeshBuilder.display`, a fixed string per builder, so "Leather Bound Book" is only sayable if
leather is a builder and not a flag.

States ride in through `BuilderWith<Options>` — the interface that already exists for this,
and that `signboard` already uses to take its text.

### How the family is built

`art/quadruped.ts` carries bovine, ovine, equine and dog; `art/flower.ts` carries eight
flowers; `art/rod.ts` and `art/whorl.ts` are the same pattern. So: **one `art/book.ts`
holding the shared construction — block of leaves, cover boards, spine, the open-book fan —
and ten thin builders that are silhouette and material policy over it.** Not ten independent
files that drift.

One requirement the shelf adds, and it is the reason to get this right at the start: the
shared module must expose each cover as **parts, not only as a finished mesh**. A bookshelf
fills itself from the same ten profiles and merges the lot into its own carcass — if the only
way to get a leather book is a finished `THREE.Mesh` on the shared material, a filled shelf
is thirty draw calls instead of one.

### Roster (provisional, and the naming is yours)

Ten covers, because a shelf is judged as a *row* and a row of three repeated spines reads as
wallpaper. All ten take `state: shut | open | face-down` unless the entry says otherwise.

| slug | display | what owns its silhouette |
| --- | --- | --- |
| `leather-book` | Leather Bound Book | dark hide, raised bands across a rounded spine |
| `board-book` | Book | pale boards, cloth spine, square and plain — the shelf's filler |
| `cloth-book` | Cloth Bound Book | coloured cloth over thin boards; the colour note |
| `vellum-book` | Vellum Book | limp, pale, no boards, edges curling outward |
| `clasped-tome` | Clasped Tome | thick, iron clasps and corner bosses; clasp shut or hanging |
| `gilt-book` | Gilt Book | pale calf, bright bands — the one spine that catches light |
| `ledger` | Ledger | tall and narrow, limp cover, ties instead of clasps |
| `pamphlet` | Pamphlet | thin stitched sheets, no boards, floppy |
| `battered-book` | Battered Book | cocked boards, torn spine, leaves not square |
| `chained-book` | Chained Book | a ring and a short chain off the fore-edge |

And the rest of the family, which are not covers:

| slug | display | options |
| --- | --- | --- |
| `book-stack` | Stack of Books | count; **never readable** — see the merge note above |
| `bookshelf` | Bookshelf | fills itself; see below |
| `loose-note` | Note | `state: flat \| creased \| pinned` |
| `folded-letter` | Letter | `state: sealed \| folded \| open`; a wax seal when sealed |
| `scroll` | Scroll | `state: rolled \| unfurled \| part` |
| `lectern` | Lectern | slope; **standalone furniture, carries nothing** |

**The ten differ where a shelved book is visible, which is the spine and nothing else.**
Front boards, clasps on the face, tooled corners — all invisible the moment the book is
stood in a row. So the discriminator budget goes to height, thickness, spine curve, spine
bands, colour, and whatever pokes out past the fore-edge: ties, a hanging clasp, a chain.
A cover whose whole idea lives on its front board is a cover that does not exist on a shelf.

**Their size ranges must not overlap into one mid-sized average.** Ten builders each rolling
18–22 cm gives a shelf of ten near-identical spines, which is the failure this list exists to
avoid. The tome is the tall thick anchor, the ledger is tall and thin, the pamphlet is short
and almost flat, and the rest spread between. The spread is the deliverable, not the count.

Three notes on the roster:

- **Small and not collidable.** These are 15–30 cm objects. `solid: false` keeps them out of
  the collider's octree, where they would cost real time and buy nothing — and it costs the
  interaction *nothing*, because `Interaction` runs its own raycast against registered
  targets and never consults the collider for identity. A book you can walk through and can
  still read is the correct trade.
- **Open books earn their triangles.** A shut book is a box with a spine and reads at any
  distance. An open one is the only pose where the writing is visible, which makes it the
  pose the illegible marks are judged on.
- **The lectern is standalone and stays that way.** It is a stand, built and placed like any
  other piece of furniture, and it does not know books exist. A book goes on one the way a
  candle goes on a table — a second entry, positioned on top, and eventually EDITOR.md's
  `on: ref` stacking does it by measurement. No `lectern({ book })` option: that welds two
  builders together, and the book on it then cannot be swapped, opened, re-bound to a
  different note or picked separately by the interaction ray.

### The bookshelf, and why it fills itself

**The shelf is one builder that comes full.** It rolls its own row of spines from the ten
cover profiles and merges them into its own carcass: one entry to place, one draw call, and
a library that exists the moment somebody writes `bookshelf` in a document.

This is the opposite call from the one `dresser.ts` made, and the difference is worth
stating because the dresser's note is the first thing anyone will cite against it. The
dresser cut its shelves and its crockery on the grounds that *"a room needs plain things in
it for the interesting ones to be interesting against"*, and that a Welsh dresser was not
what a hut needed — the crockery was decoration on a thing for storing clothes. Books on a
bookshelf are not decoration on a thing; **an empty bookshelf is not a plain object, it is a
missing one.** The dresser's restraint holds; a bookcase full of nothing is the flat-pack
reading that note was worried about in the first place.

The alternative — thirty individually placed book entries per shelf — is rejected on three
counts, any one of which is enough. It is thirty draw calls where one will do. It is thirty
lines of document per piece of furniture, which no one will author twice. And it is thirty
raycast targets standing in front of the one book that actually has something to say.

- **Scaled to the books, and derived rather than chosen.** Shelf pitch comes from the tallest
  cover profile plus clearance, depth from the deepest, and the carcass from the pitch times
  the row count. Nothing here is a number typed in twice — a cover that grows taller later
  must push the shelf apart, not poke through it, and the only way to guarantee that is for
  the shelf to ask the profiles their size.
- **Options**: rows, width, and how full — `packed | worked | sparse`. Sparse is what makes a
  shelf look used: gaps, a few leaning against their neighbours, one lying flat across the
  tops. Full-to-the-ends on every row reads as a wall of stripes.
- **A readable goes in a gap, as its own entry.** The shelf leaves them; the placer stands a
  real `leather-book` in one and binds a note to it. That is the same rule as the stack and
  the lectern — the shelf's own books are scenery and can never be read, and the one that can
  is a separate object standing among them.
- **Solid, unlike the books.** The carcass is furniture and goes into the collider; its
  merged spines ride along with it, which is fine, because a shelf is one convex-ish box and
  not thirty small ones.
- **It is not a `book-stack` with legs.** The stack is a small prop for a table; this is
  furniture, and the two do not share a builder even though they share the profiles.

## Illegible writing

The requirement — *writing that suggests text without being any* — is already solved once in
this codebase, in `debug/galleries/layout.ts`, and the reasoning there is the reasoning here:

> *The point is the invitation, not the illusion. It has to survive being walked up to, so
> it must not resolve into fake glyphs; ragged word-lengths on a ragged right margin is
> exactly as much as the trick can bear.*

That function is a debug fixture — it returns loose `THREE.Mesh`es on their own materials,
which is not kit-legal for a prop. **Promote it to `art/writing.ts` returning `Part[]`,** and
move the sign post onto the promoted version, so there is one implementation of "marks that
read as text" rather than two that drift.

Two things change in the move, and both are about scale:

- **Seeded off the note, not the prop.** The gallery seeds its scribble off the row's name so
  a row's marks are a stable landmark. A book should seed off the bound text's id where there
  is one, so the same note always looks the same, and two different notes on the same shelf
  never look identical. Unbound books seed off the placement seed.
- **Coarser than a real page, and that is fine.** The marks are not a scale model of
  writing. Their whole job is to say *this has text on it* from across a room and to keep
  saying it when you walk up — three or four thick lines beat eight thin ones, because the
  thin ones fall under the pipeline's floor and turn to shimmer without ever having read as
  writing. Pick the weight that survives, not the weight that is to scale.

## Two rooms: a gallery and a showcase

These are different jobs and they get different doors. **Both doors stand in the general
props room**, side by side on the grid, the way the Text Showcase's door already does — that
room is where the doors that belong to no one setting live, and readables belong to every
setting.

### The Readables Gallery — the objects, alone

An ordinary `GalleryPlan`: the rank, eight seeds a builder, a sign post at the head of each
row, nothing else in the room. Every gallery in the game is exactly this and this one has no
reason to be the exception. It satisfies `check:art` (which fails on any builder in no
gallery), it is where you go to ask whether the covers hang together as a family and whether
a ledger and a pamphlet share a scale, and it says nothing at all about reading.

The gallery rank only ever calls `build({ seed })`, so it shows every builder in its default
state and no other. That is the correct limit of what a gallery is for.

### The Readables Showcase — the system, demonstrated

A separate zone, built the way the Light, Dark and Fog showcases are: stations, each making
one claim. No rank, no sign posts at the head of rows, none of the gallery's furniture.

**Books float.** Every station stands its objects in the air at a height you can read them
at — no desks, no shelves, no lectern staging. A showcase is a rig, and hanging one prop off
another means judging two things at once and moving both when one is wrong. The lectern is in
the gallery like every other builder; it is not the showcase's furniture.

1. **The state matrix.** Every builder in every state it has, in a grid, floating. The only
   place the options are visible at all, and the reason this room exists at all separately
   from the gallery.
2. **The reading station.** One bound readable at eye height with a real note behind it. Walk
   up, read the two-line tooltip, press `E`, read it, close it, walk away. The end-to-end
   test and the screenshot that proves the feature exists.
3. **The findability row.** Twenty unbound books and one bound one, side by side in the air.
   The bound one is the only one that speaks when you cross it, which is the rule working —
   this is where you check that walking a row is enough to find it, and that twenty silent
   books do not read as twenty broken ones.
4. **The legibility run.** The same open book hanging at 0.5, 1, 2 and 4 m. Where the weight
   of the marks is settled.
5. **The pagination extremes.** Notes bound to fixtures built to break it: one word; forty
   pages; a paragraph with no spaces; a title long enough to overflow the tooltip; an empty
   body.
6. **The accessibility pass.** The same note read at the largest text size and with the
   dyslexic face on — which is when measured pagination has to prove it measured.

Fixture text is engineering text — the Text Showcase's rule, stated in its own header:
*"The specimen strings are engineering fixtures, not fiction. What real signs in the world
say is content, and none of it is written in here."* Same here. No fiction in either room.

## Fitting the editor

EDITOR.md's inspector is per-*entry*, and a note is not an entry — it is a document in
`content/notes/`. So this system asks the editor for one thing it does not currently plan:

- **A note library pane.** List every note, create, rename, edit the body, see where each is
  bound. This is a sibling of E3 (*"the menus for everything that isn't a prop"*) rather
  than a new stage.
- **One field on the entry inspector**: `text`, a searchable dropdown over that library, plus
  *clear*. Exactly the independence you described — the prop and the words are set on two
  different screens and joined by an id.
- **The reading screen is the preview.** Editing a note and pressing *read* opens the same UI
  the player gets. It should not be a second renderer, and a preview pane that approximates
  it would be wrong precisely where it matters — pagination is measured against the real box.
- **`check:world` gains the cross-reference**: every `text` on an entry resolves to a note;
  every `[[keyword]]` resolves once a topic manifest exists (stub until then); no note is
  bound nowhere *and* referenced nowhere (dead prose is a content bug, and a warning rather
  than a failure — a note may legitimately be written before it is placed).

None of this conflicts with the merged-chunk range tables VISTA.md forced into that document.
Readables are never merged, by the rule two sections up.

## Ways to get it wrong

1. **Prose in the zone file.** The whole point of the split. Once one note is inlined
   "just because it is short", the loader has two paths forever.
2. **Every book readable.** The shelf becomes a writing assignment, and the player learns
   that a tooltip means nothing.
3. **Authored page breaks.** They are choices made for one font at one size, and the
   accessibility options exist specifically to change all three.
4. **The reading screen built out of the options panel's classes.** Share the variables,
   never the classes. They are different systems and the second one is diegetic.
5. **The pose rolled by the seed.** Which state a readable is in is a placement decision —
   whoever put it there left it open or shut. A seed that decides it makes the same entry
   look different for reasons nobody chose.
6. **A readable merged into a shelf.** Picking returns the shelf, and no amount of tooltip
   work fixes it after the merge.
7. **Marks tuned by argument.** Whether the writing reads as writing is the one claim in
   here that only a screenshot settles. It does not have to be to scale; it has to survive.
8. **Teaching keywords now.** The markup renders now; the topic pool is Phase 8. Rendering
   without teaching is a stub, not a gap.
9. **Making the reading screen a zone.** It is a panel over a running world, not a place.
10. **A note's title doing double duty as the object's name.** They are two different facts
    from two different files, which is what makes "Leather Bound Book / A Treatise On
    Prague" possible at all.
11. **A scrollbar appearing anywhere.** Overflow that scrolls is a page that should have
    been two pages, and the day one box scrolls, the wheel stops meaning *turn*.
12. **A second reading layout, for any reason.** The scroll will ask for one, and the answer
    is no. One screen reads everything.
13. **Ten covers that are one cover in ten colours.** If the differences do not survive being
    stood in a row and looked at from two metres, the count bought nothing.
14. **A shelf sized by hand.** Type the shelf pitch as a literal and the first cover that
    grows a centimetre pokes through the shelf above it. Derive it from the profiles.

## What needs an eyeball

- A shut book at 1 m, 3 m and across a room. Does a 20 cm object survive the pipeline as a
  *book*, or as a brown lump?
- **The library shot: the `bookshelf` row in the gallery, eight seeds side by side.** Eight
  filled shelves is the only test of whether ten covers were ten covers. Does it read as a
  library, or as eight copies of the same wall? This is the deciding screenshot for the whole
  roster, and the gallery gives it away for free — no showcase station needed.
- The ten spines in a row at 1 m and at 3 m, with the shelf's own timber behind them.
- The marks on an open page at 0.5–4 m. Does it say *this has text on it* at every one of
  them? That is the whole bar.
- The reading screen against the pause menu, both open in turn. Do they read as one game's
  interface and two different systems?
- A full page of prose at the default size, the largest size, and in OpenDyslexic.
- The two-line tooltip beside a door's three-line one, so the emphasis inversion can be
  judged against the thing it is inverting.

## Phases

Eight phases, and **every one of them ends with something you can walk up to and look at**
— SPEC.md's rule for its own phases, and the reason this order is what it is rather than
schema-first. R-numbered so they cannot be confused with SPEC.md's global phases; the whole
sequence is a slice of that document's Phase 8, taken without the quests.

The order is picture-first: the two claims most likely to change the design — *does a
20 cm object read as a book* and *do the marks read as writing* — are settled in R1 and R2,
before a single line of format or UI depends on them.

### Phase R1 — One book, one room

`art/book.ts` with the shared construction and, critically, the **parts contract** the
bookshelf will need later. `leather-book`, shut only. The Readables Gallery as an ordinary
`GalleryPlan` with one row in it, and its door standing in the general props room.

No reading screen, no text, no binding, no other state. This phase exists to answer whether
the object is viable at all, and to stand up the room every later builder lands in.

*Done when a leather book reads as a book at 1 m, at 3 m and across the room, and the gallery
door opens onto a rank of eight seeds that are visibly eight different books.*

### Phase R2 — Writing you cannot read

`art/writing.ts`, promoted out of `debug/galleries/layout.ts` and returning `Part[]` instead
of loose meshes. `leather-book` gains `state: open`. The gallery sign post moves onto the
shared version in the same phase, so a second implementation never exists for even one
commit.

The riskiest visual claim in the document, and the cheapest to walk back if it fails —
nothing is built on it yet.

**The showcase zone opens here rather than at R7**, carrying its legibility run and nothing
else. This phase's whole job is a judgement about weight at four distances, that judgement
needs a rig, and the alternative was a rig in the gallery — where the room's own header says
nothing but the rank belongs. R7 fills the room in rather than building it.

*Done when an open page says* this has text on it *at 0.5, 1, 2 and 4 m, and the gallery's
sign boards look exactly as they did before the move.*

### Phase R3 — The reading screen, standalone

`ui/Reading.ts`, opened by a dev-panel button with hardcoded prose. No props, no binding, no
content files. The `--prose` custom property and the `.is-dyslexic` override for it, measured
pagination, the page count, the two arrow affordances, `←`/`→`, `A`/`D`, the wheel, `Esc`
and `E` to close, `is-reading`, pointer-lock release and re-take.

Built against the fixtures before the fixtures have a home: one word, forty pages, a
paragraph with no spaces, an empty body.

*Done when a long note pages cleanly at the smallest and largest text sizes and in
OpenDyslexic; when nothing anywhere scrolls; and when the screen and the options panel read
as one game's interface while sharing no CSS class.*

### Phase R4 — The loop closes

The note document type and its loader out of `content/notes.ts`. `markReadable`. The union
return from `ZoneManager.update`, the two-arm switch in `main.ts`, `#prompt.is-readable`.
`check:world` grows the `text → note` cross-reference.

One book in the countryside, bound to one note. This is the phase the feature becomes real
in, and the first screenshot of the whole thing working end to end.

*Done when you can walk up to a book, read two lines over the crosshair, press `E`, read it,
close it, walk away — and when a `text` id pointing at nothing fails a check rather than
opening blank.*

### Phase R5 — Five covers and the shelf

Four more covers chosen for range rather than for taste: the tome, the ledger, the pamphlet,
the plain board book. Then `bookshelf`, filling itself from those five, with its pitch and
depth derived from the profiles.

**The shelf comes at five covers and not at ten, deliberately.** If a filled shelf is going
to tell you that the covers need to be taller, thinner or further apart, it should say so
while there are five left to write rather than none.

*Done when the gallery's `bookshelf` row — eight filled shelves side by side — reads as a
library rather than as eight copies of one wall.*

### Phase R6 — The rest of the family

The remaining five covers, aimed at whatever gap the library shot showed. Then `loose-note`,
`folded-letter`, `scroll`, `book-stack` and `lectern`, with their states.

**The aim is the part that needs the eyeball.** The five were written to the roster rather
than to a gap, because R5 and R6 were built back to back and nobody had stood in front of a
filled shelf in between. If the library shot says the range is wrong, these five are where it
gets fixed — they are a table each.

*Done when every builder in the roster has a gallery row and `check:art` passes — which it
will not until every one of them is in a gallery, by its own rule.*

### Phase R7 — The showcase

The rest of the Readables Showcase, whose room and legibility run went up at R2: the state
matrix, the reading station, the findability row, the pagination extremes, the accessibility
pass. Everything floating, no staging furniture.

Last among the visual phases because a showcase is a room built to argue with finished
systems, and until R6 there is nothing finished to argue with.

*Done when every claim this document makes has a station standing under it.*

### Phase R8 — Keywords, memory and the accessibility pass

`[[keyword]]` rendered highlighted against a `teach()` that is a stub until SPEC.md's
Phase 8 exists. Read-state dimming on the tooltip, and the read set added to the autosave
payload it is already listed in. Repagination that holds the reader's place **by word rather
than by page number**, so changing text size mid-note does not throw you elsewhere in it.
The reduced-motion hold on page turns.

*Done when a note read at one text size, resized, and re-read leaves you on the same
sentence.*

### Optional, unscheduled

A page-turn sound in `audio/oneshots/`. The standing rule that a sound needs an object is
already satisfied — the builders arrive with this system rather than after it — so this can
land any time after R3 or never.

### What can move

R1 → R2 → R5 → R6 is one chain (each builder needs the shared module, the shelf needs the
covers). R3 → R4 is the other, and **R3 depends on nothing in the first chain** — the reading
screen can be built alongside the builders by anyone not building them. R4 is the only phase
that needs both chains landed. R7 and R8 are strictly last, in either order.

## Decisions that are yours

- **Every name**: this file, the builder slugs and their `display` strings, the note file
  layout, the key names in the note document, and all fiction.
- **Which ten covers.** The count is settled; the list above is a first cut aimed at spine
  variety, and swapping two of them for something the fiction wants instead costs nothing at
  this stage. `gilt-book` and `chained-book` are the two most worth a second look — both
  imply a wealth and an institution this setting may not have.
- **Whether reading dims the world behind the page.** The no-pause rule says leave it alone;
  a book is a stronger claim on attention than a settings panel, and this is a taste call.

Settled, and recorded here so they are not reopened by accident: both doors hang in the
general props room; every readable opens the same paged screen with no scrolling anywhere;
there is no per-sort layout and therefore no `kind` field; **a readable carries the two-line
tooltip whenever it has text assigned** — no opt-in, no exceptions; and there are **ten cover
styles**, one builder each, with a `bookshelf` that fills itself from all ten.
