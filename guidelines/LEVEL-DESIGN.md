# Level design

What makes a level worth walking through, and how that applies to a cell of this
world. Read this before laying out a zone, and run the checklist at the end
before reporting one built. `ENVIRONMENT-DESIGN.md` is the companion: this file
is about *where things are and why the player moves*, that one is about *what
the place looks like and why nature put it there*.

The game these rules serve: first person, no combat, no danger, no HUD markers.
Hand-authored cells of roughly 160–180 m a side, joined by gates in their walls,
with the world beyond drawn as a vista ring. The player walks at 4.2 m/s, sprints
at 7.35, and looks from 1.35 m. A cell is crossed in about forty seconds. Every
number below is scaled to that.

---

## 1. What makes a level fun

### Fun is a decision the player gets to make

A level is fun in proportion to the number of decisions it offers and the
quality of the information behind them. Every fork, every "over or around",
every "that or this first" is a decision. A corridor with no decisions is a
loading screen the player walks through. A field with a hundred equal choices is
a decision with no information, which is the same thing.

Dan Taylor's ten principles are the standard summary and they hold here:

- **Fun to navigate.** The player should be able to work out where to go from
  light, geometry and landmarks, and should sometimes have to work at it. Clear
  is not the same as obvious.
- **Tells the player what to do, never how.** Objectives crisp, methods open.
- **Doesn't rely on words.** Story is implicit (the place), explicit (text and
  dialogue) and emergent (what the player did). The place carries most of it.
- **Constantly teaches something.** A new place, a new way of reading a place,
  a thing recontextualised.
- **Is surprising.** Not jump scares: a pacing break, a setting change, a view
  that was hidden until now.
- **Empowers.** Actions have visible consequences.
- **Lets the player set difficulty.** Here that means effort: the long way round
  the bay or the scramble over the rocks, both marked honestly.
- **Is efficient.** Spaces seen twice, differently.
- **Creates emotion.** Decide the feeling first, then choose the shapes.
- **Is driven by mechanics.** Ours are walking, looking, listening, reading and
  talking. A level is a delivery system for those.

### Curiosity is the engine, and it runs on withheld information

Exploration games are pulled, not pushed. Every pull is the same trick: show
part of a thing and hide the rest.

- **Partial visibility.** A roof over a ridge. A stack seen past a headland. A
  light through trees. The player fills in the rest and walks to check.
- **Denied access.** A door, a gap too narrow, a ledge just too high, a far bank.
  Denial is only a pull if the way in is somewhere else and findable.
- **Anomaly.** One thing that does not belong: a standing stone in a field, a
  boat in a meadow, one lit window. Anomaly is spent by repetition; one per cell.
- **Sightline to a goal.** Empty space along which something worth reaching is
  seen. The player uses a sightline only when it is relevant to what they want
  now, so put the want in the view.
- **Sound.** Water heard before seen, a bell, a voice. Low certainty on its own,
  strong with anything else.
- **Tropes.** Something behind the waterfall, something on top of the tower. The
  player already knows these; honour them or deliberately break them, never
  ignore them.

Breath of the Wild's field design gives the shape rule: **triangles at three
scales**. A big triangle is a landmark and a horizon. A medium triangle hides
what is behind it and offers over-or-around. A small triangle changes the rhythm
of walking. The scales must be clearly distinct or the field reads as mush. And
the corollary: **the player should not see a whole landmark from where they
start toward it**. Paths curve, the view opens in stages, the last reveal is
close.

The same designers' **gravity** rule: going down is easier than going up, so a
destination in a hollow pulls and one on a summit is a climb the player must
choose. Put what everyone should reach low, and what rewards effort high.

### Cadence

The Witcher 3 set a rule that the player sees something to focus on every forty
seconds; Breath of the Wild lands near the same figure. Those are open worlds on
horseback. Scaled to a cell crossed in forty seconds on foot, **something new
should enter the player's attention every eight to fifteen seconds of walking,
about every 35–60 m**. "Something" is a change: a view opening, a track
bending, a sound, a prop that is not the last prop, the ground changing under
foot. It is not another instance of the thing just passed.

Diversity matters more than count. Five kinds of thing at long spacing beat
twenty of one kind close together. Categories to spread a cell across: a
landmark, a hidden thing, a secret, a person or creature, a view, a sound, a
place to stop.

### Pacing is contrast

A level is beats: small self-contained chunks with a rhythm between them.
Pulse (the recurring pattern), accent (a beat made stronger), rest (one made
weaker), motif (a repeated sequence), syncopation (an expected beat withheld).
Players adapt to any sustained intensity, so the tools are contrast and
alternation:

- **Open then closed.** Field, then lane between hedges, then field again.
  Enclosure is the intensity axis in a game with no combat, along with effort
  (climb), density (clutter), sound (quiet after loud) and light (shade after
  sun).
- **Start slow.** The first beat after a gate is orientation, not the payoff.
- **The end is inevitable, not maximal.** The landmark the player walked toward
  should be reached calmly. The reward is being there.
- **Rest is a beat.** A bench, a view point, a still pool. A place with nothing
  to do is a place to stop, and stopping is a mechanic here.

### Layout patterns

- **Linear** — a corridor of beats. Only fun if bent, so the far end is a
  discovery, and with pockets off it.
- **Hub and spoke** — a centre with a landmark, ways out in each direction that
  lead back. The village. Spokes should differ in length and character.
- **Loop** — a route that returns to a known place from an unexpected side. The
  strongest layout there is; a loop reframes the space already walked. Aim for
  one loop in every cell that is not a corridor.
- **Gated loop** — the loop exists but a segment is closed until something is
  done. Dark Souls's whole world is this. Without keys or combat our gates are
  knowledge (where the gap is), tide, or a person.
- **Branch and rejoin** — two ways to the same place, each with one thing the
  other lacks. Never two ways with nothing between them.
- **Dead end** — legal only with a reward at the end, and a reward is a view, a
  readable, a secret, a person, never nothing.

Backtracking is fine when the return shows something the way out hid. Design
the return as its own walk: what is seen going north is not what is seen going
south.

### Wayfinding

Kevin Lynch's five elements are how people hold a place in their heads, and a
cell needs all five:

| | In a cell |
|---|---|
| **Paths** | The tracks. Where feet go. |
| **Edges** | The walls, hedges, water, treelines, cliffs. What cannot be crossed. |
| **Districts** | Areas with one character: the dunes, the marsh, the yard. |
| **Nodes** | Where paths meet or a district is entered: a gate, a ford, a yard. |
| **Landmarks** | The one thing seen from most of the cell and from nowhere else. |

Rules of thumb about how players actually look, all confirmed in testing by
others and worth taking on faith:

- Players **look where they move**. What is beside the path is seen; what is
  behind them is not, until they turn.
- Players **do not look up** unless something draws the eye there.
- Players **look at contrast**: colour, shape, light, motion.
- Leading lines drawn on a screenshot mean almost nothing. **Sightlines** (real
  empty space toward a real thing) mean a lot. Compose space, not screenshots.

Disney's **weenie** is the landmark done properly: large, distinct in
silhouette, visible down a long sightline, promising something, and paying off
on arrival. One per district, and the district is arranged around it. Staging
matters: the weenie is shown when it is wanted and hidden when another is
speaking.

Signposting has a cost. Heavy wayfinding is the "architecture of reassurance":
readable and artificial. A wilderness is authentic because it under-signs. This
world is a countryside, not a theme park: wayfinding by landmarks, tracks,
light, sound and the vista. **No signs unless asked for by name.** No arrows, no
markers, no birds leading the way.

### Mechanics, platforming and affordance, where they apply

- **Teach, test, twist.** Introduce a thing plainly, ask for it again with a
  prompt, then ask for it somewhere it is not prompted.
- **Shape language is a promise.** Rounded shapes read safe and inert. Square
  shapes read solid and usable. Pointed and diagonal shapes read hostile and
  unusable. Use them consistently or the player stops trusting the world.
- **Buffer metrics.** If a 1.2 m step can be climbed and a 1.6 m one cannot,
  never build a 1.4 m one. Every height between "yes" and "no" is a lie.
- **Blocked must look blocked; open must look open.** The most common
  playtest bug in landscape levels is a slope that looks walkable and is not.
  Rock angle, wall height and hedge density are the honest signals.
- **Risk-reward routes.** A shortcut with a cost, a scramble with a view, a
  wade with a wetting. The player chooses the difficulty by choosing the route,
  and both routes are visibly what they are.

---

## 2. A cell of this world

### One cell, one idea

A cell is a level. It has one idea that could be said in a sentence, one
landmark that is the idea made visible, one reason to come, one loop, and one
or two secrets. If the sentence needs "and", it is two cells or a cell with a
district structure that must be made explicit on the plan.

The name belongs to the owner. So does the fiction. Design to the sentence
agreed, not past it.

### The gates and the compass

`+X` is east and `+Z` is south everywhere outdoors. Gates sit in the wall
facing the neighbour; walking out south arrives at the neighbour's north. A
gate is a gap walked through (an arch, two crags, two trees) with the far
zone's name over the crosshair on approach. The gates are the fixed points;
everything else is arranged between them.

### The arrival shot

The first frame after a gate is the one shot in the cell that is composed.
Face the player at the landmark or at a framed partial view of it. Never at a
wall, never at nothing, never at the whole cell laid flat. The first ten metres
after a gate are a threshold: enclosed, then opening.

### Cadence at our scale

A cell is 40 s across at a walk. Plan **five to eight beats** across it, no two
alike, spaced 35–60 m along the route the player is most likely to take. A beat
is a change, not an object count. Set the beats down on the plan as a list
before any coordinates are written.

### Landmark hierarchy

One big thing seen from most of the cell and from the neighbour's vista. Two
or three medium things that each own a district and hide what is behind them.
Small things at the rhythm of walking. If two medium things are the same
builder they must differ in size, spacing and company; three of anything in a
row is a colonnade and reads as a wall of copies.

### Path zones

The corridor cells follow the rule already decided: an open hallway 10–16 m
wide between banks the controller cannot climb, bent so the far gate is never
seen from the near one, a pocket at each bend with one thing in it, the vista
showing over the bank at every bend, and **the player always sees the next
landmark before losing the last**. The walls are ground and trees, never a line
that can be tested.

### Tracks are the story of feet

A track goes where people would actually walk: the dry line, the gentle
gradient, the gap in the hedge, the corner cut. Desire paths form when the
built route is twenty to thirty percent longer than the straight one; if the
plan has a track that nobody would take, they would have worn another, so draw
that one. Tracks curve with the ground. Straight tracks are engineering and
belong to people with resources; a farm lane bends.

### Boundaries

Boundaries are walls, hedges, treelines, water and rock. **Never a rim of
hills.** The vista goes beyond and says what is next: roofs toward the
village, a treeline toward the wood, water toward the river and the sea. A
boundary must look like one and must be the same kind of thing the player has
already learnt they cannot cross.

### Reward space

There is no loot. The rewards for going somewhere are: a view that was not
available elsewhere, a readable, a person, a sound, a shortcut, a still place.
Every branch off the route ends in one of those. A viewpoint is a reward only
if what it shows was hidden from the route.

### People and quests

Anyone the player must find must be reachable: trace cast → home cell → gate
before writing the quest, and give directions that name real landmarks the
player has seen. A quest that says "the cove" must be about a cove the player
can recognise as such from its landmark.

### Water and the walkable rule

Every walkable point inside a water plane's box stands above its surface. The
sea is wadeable to chest depth and barred there; the bed beyond drops so the
colour deepens.

### One system, one picture

A cell reads as one place or it fails. Four good pieces that do not agree
(a beach, a path, a sea and a heath each doing its own thing) are worse than
three plain ones that do. Before adding a system ask what the cell already
reads as, and make the new thing serve that. When the report on a cell is "it
looks bad", the answer is a redesign from the sentence, not a tuning pass.

### Do not invent

Build what was agreed. No props, sounds, signs, creatures, weathering or
"dressing" that were not asked for by name. A builder builds one object and
nothing around it. Ambience is the soundscape's job, not a bird placed in a
tree.

---

## 3. Process

1. **Sentence.** The cell's one idea, agreed.
2. **Diagram.** Gates, the landmark, districts, the route most players take,
   the loop, the beats as a numbered list, the secrets. On paper before JSON.
3. **Blockout in landforms.** Terrain masses first, at the sizes that make the
   route work. Walk it in the head at 4.2 m/s. Check the arrival shot, the
   sightlines to the landmark from each gate, that the far gate is hidden,
   that every branch ends in a reward.
4. **Sum the landforms.** Add up every landform that reaches a spot before
   placing another there; every pit so far has been a sum.
5. **Dress.** Environment pass per `ENVIRONMENT-DESIGN.md`.
6. **Report.** The owner's look is the playtest. Say what was built and what
   was left out. Then stop.

---

## 4. Checklist

- [ ] The cell's idea is one sentence, agreed, without "and".
- [ ] One landmark, seen from most of the cell and from the neighbour's vista,
      not visible whole from where the walk toward it begins.
- [ ] Gates in the compass walls; the far gate hidden from the near one.
- [ ] Arrival shot faces something composed.
- [ ] Five to eight beats, listed, no two alike, 35–60 m apart on the main route.
- [ ] One loop, or a corridor with pockets.
- [ ] Every dead end pays with a view, a readable, a person, a sound or a shortcut.
- [ ] Medium landmarks differ in size and company; nothing three in a row.
- [ ] Tracks take the line feet would take; they bend.
- [ ] Boundaries are walls, hedges, trees, water or rock; nothing looks
      walkable that is not.
- [ ] No sign, sound emitter, creature or prop that was not asked for.
- [ ] Anyone the player must find is reachable and directions name real things.
- [ ] Every walkable point inside a water box is above the surface.
- [ ] Landform sums checked at every overlap.
- [ ] The cell reads as one place from the landmark and from each gate.

---

## Sources

- Dan Taylor, *Ten Principles of Good Level Design*, GDC 2013 —
  https://www.gamedeveloper.com/design/ten-principles-of-good-level-design-part-1-
- The Level Design Book: *Wayfinding*, *Composition*, *Pacing*, *Landscape*,
  *Metrics*, *Disneyland* — https://book.leveldesignbook.com
- Fujibayashi and Yonezu, *Field Level Design in Breath of the Wild*, CEDEC
  2017, via https://www.blog.radiator.debacle.us/2017/10/open-world-level-design-spatial.html
  and https://www.gamedeveloper.com/design/breath-of-the-wild-open-world-analysis-gravity-to-go-forward
- Kevin Lynch, *The Image of the City* (1960)
- Witcher 3's forty-second rule —
  https://www.tweaktown.com/news/59420/witcher-3s-40-second-rule-kept-players-engaged/index.html
- *Elden Ring and Overworlds: line of sight and density* —
  https://idlecartulary.com/2024/01/07/how-to-make-a-world-hostile/
- Wheeler, *What Mario Learned from Mickey Mouse: Decision Making and Weenies* —
  https://www.gamedeveloper.com/design/what-mario-learned-from-mickey-mouse---part-3-decision-making-and-weenies
- Schatz, *Defining Environment Language for Video Games* —
  https://80.lv/articles/defining-environment-language-for-video-games
- Gómez-Maureira et al., *Level Design Patterns That Invoke Curiosity-Driven
  Exploration*, CHI PLAY 2021 — https://dl.acm.org/doi/10.1145/3474698
- Desire paths — https://en.wikipedia.org/wiki/Desire_path
- Christopher Totten, *An Architectural Approach to Level Design* (2014)
