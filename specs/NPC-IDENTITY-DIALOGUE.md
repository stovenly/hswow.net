# Who an NPC is, and what they can say — spec

A villager is currently a body and a `folk`. Pressing E on one runs
`SCRIPTS[mark.folk]`, a two-entry table in `src/world/talk.ts`, so every
countryside figure in the world is the same person with a different seed.

This gives them identity, gives that identity things it alone knows, and puts
both in project content the editor can change. It also lays the condition layer
a quest system will hang off, without building the quest system's content.

**The short version.** Four layers where there is one: the **body** (what the
builder makes), the **person** (who this is), their **traits** (what they are),
and the **placement** (where they stand). Dialogue is contributed by traits,
people and quests alike into one pool, each line gated by a condition and
carrying a priority, and the highest-priority line that holds wins.

---

## What is already here

`src/world/entry.ts` has a `Condition` union — `flag`, `quest` with a stage
range, `not`/`all`/`any` — and `holds()` evaluating it against a `WorldState`.
`src/world/state.ts` has `WorldFlags`, holding flags and quest stages in memory,
with a preview mode that forces every condition true or false for the editor.
Zone layers and entries are gated on this already.

It is described in its own docstring as a stub until the quest system exists.
Nothing below invents a second condition language; it grows this one.

## The model

**A trait** is what somebody is: `villager`, `cityfolk`, `trader`, `farmhand`.
It carries topics anyone holding it can talk about, and later a schedule and a
list of abilities.

**A person** is who somebody is: a name, the body they wear, the traits they
carry, and the topics only they know.

**A quest** is a run of state with stages, a cast, and topics that appear while
it is at particular stages.

All three contribute topics to one pool with a priority: a trait is 0, a person
20, a live quest 60, and a topic may name its own to jump the order. The gaps
are there to be filled. Resolution is: collect every topic whose owner is live
and whose condition holds for this speaker, sort by priority, keep the highest
per `key`.

That is the whole mechanism. There is no separate system for generic dialogue
and specific dialogue — the difference is a number.

## Traits come from four places

The zone grants them, a region inside it grants them, the placement adds one,
and the person carries their own. Union of the four. Anyone standing in the
village is a `villager` without being written as one; Mark is a `trader`
wherever you put him.

## One gate, and two things that answer it

A trait is not a second system beside the conditions. It is a case in the same
union, next to `flag` and `zone` and `ambient`, which is why the mixed forms
need no combining logic — they were already the same kind of thing.

**The union names the question; something else answers it, and there are two
things that can.** The world answers `flag`, `quest`, `ambient` and, when there
is an inventory, `carrying`. The subject answers `trait`, `person`, `doing`,
`atHome` and, when there are stats, `health` and `stat`. Every condition worth
wanting lands on one of those two surfaces, so `holds` never learns what health
is: it dispatches to `WorldState` or to the subject, and each grows one method.
A new kind of question is a row in the union and a method on one surface.

**A condition nothing can answer is false, not an error.** A line gated on stats
before stats exist simply does not show, which is what lets content be written
against a system that is not built. The cost is that a misspelt condition hides
a line silently and forever, so the *editor* checks names against the known set
and says so. The runtime stays quiet; the tool complains.

**Topics resolve when the choices are offered**, which is after every reply and
not during one. Walking into the shade does not rewrite the menu mid-sentence,
and an effect that changes the speaker re-resolves the list before they next
speak.

## Where, when, and what somebody is doing

None of these is a trait. A trait is durable and granted; the hour and the
weather change every minute and the zone changes at every doorway, and nothing
would ever grant them. They are conditions, and `all`/`any`/`not` are already
in the union, so "in the woods at night" costs nothing beyond the leaf cases.

The ambient half is already gathered. `src/audio/ambience/conditions.ts` holds a
`Conditions` snapshot the ambience director reads every frame — the sun's angle,
the hour, the season, rain, snow, storm, wind, warmth, whether the listener is
under a roof. Dialogue reads that snapshot rather than growing a second clock.

Night is `{ ambient: 'sun', max: -6 }`, not an hour range. This world has a
moving sun with a latitude and a season in it, so the sun's angle is night
everywhere and all year, and an hour range is night in one month at one place.

The interesting form of "why are you here?" is not about the hour at all — it is
*you are not where you belong*, so a person carries a `home` and the condition
is `{ atHome: false }`. Time and place are the flavour on top of it.

**Prefer an ambient condition on an info over one on a topic.** A topic that
disappears because it started raining reads as a bug; a reply that changes with
the weather reads as a world that is awake. A line gated on three ambient axes
at once is a line written for nobody.

## Topics and infos

A **topic** is the option the player sees. An **info** is the reply. Conditions
sit on both: on the topic, whether the option appears at all; on each info,
which reply comes out. Infos are tried in order and the first whose condition
holds is used.

So "Village" stays one topic whose answer changes with the world, rather than
four topics fighting over a label.

**A topic whose infos all fail does not appear.** Having nothing to say is not
the same as saying you have nothing to say: "I would not know about that" is a
line somebody decided to write, so it is an info with no condition at the end of
the list, which always holds. A topic that must always be offered ends with one.

```json
{
  "key": "goat",
  "label": "About your goat",
  "when": { "quest": "missing-goat", "stage": { "min": 10 } },
  "infos": [
    {
      "when": { "quest": "missing-goat", "stage": { "max": 10 } },
      "reply": "She is out past the stile, if she is anywhere.",
      "then": [{ "do": "setStage", "quest": "missing-goat", "stage": 20 }]
    },
    { "reply": "You found her. That is that." }
  ]
}
```

`then` is what replaces the Creation Kit's per-line scripts: a short list of
declarative effects, not a scripting language.

## No aliases

A quest names the people it is about. What it carries instead is a `cast` map
from a role name to a person id, so recasting is one edit rather than twelve
scattered conditions, and a condition may name either. Filling a role by
condition at runtime is what radiant quest generation needs and this world does
not do it.

## Step 1 — a condition can ask about a person

**Built.** The union is `{ quest, stage?, done?, failed? }` — one case with
optional clauses that all have to hold, rather than three quest cases — and the
cast case is `{ cast: role, of: quest }` so it does not collide with it.
`ZoneDefinition` gained `regions`, and `WeatherRig.applyAmbience` pushes the
ambient snapshot, the zone id and the listener's position into `worldState`
beside the copy it already hands the ambience director. Nothing constructs a
`Subject` yet; Step 2 is where people and traits arrive to fill one.

`Condition` gains `{ trait }`, `{ person }` and `{ cast }`; the quest case gains
`done` (a stage ever visited, which is not the same question as the highest
reached) and `failed`. `WorldState` gains `stageDone(quest, index)` and
`failed(quest)`, and `WorldFlags` implements them.

It also gains the world's own state: `{ zone }`, `{ region }`, `{ atHome }`,
`{ doing }` for what the speaker is up to, and `{ ambient, min?, max? }` over any
field of the `Conditions` snapshot in `src/audio/ambience/conditions.ts`. That
one case covers the clock, the season, every weather field and whether the
speaker is under a roof, and it reads the snapshot the ambience director already
builds instead of a second one. `doing` answers from `Creature`'s existing state
machine for now — idle, walk, business, greet, talk — and is where a schedule
will later answer from instead.

`holds` takes an optional third argument, the subject it is being asked about.
Every existing caller passes nothing, and a condition that needs a subject and
has none is false.

*Done when* a zone layer can still be gated on a flag, `holds` can answer "does
this person carry `trader`" when handed one, and "in the woods after dark"
evaluates without a second clock existing anywhere.

## Step 2 — people and traits, in content

**Built, and it took Step 3's resolver with it.** The village's visitor stands
in a zone that grants `villager` and carries `cityfolk` of its own, so the two
sets of topics collide on the same keys from the first commit — which cannot be
answered by concatenation. So `dialogue.ts` arrived here with the pool, the
ranks and the conditions in it, and Step 3 is left holding the `then` effects
and the wiring that fires them.

Ranks needed one thing the model above does not say: **a trait granted later
outranks one granted earlier**, so the placement's `cityfolk` beats the zone's
`villager` and the visitor keeps their own greetings. Grants are a list in
grant order, not a set.

Two things are not built. Nothing authors a **person** — the mechanism is there
and unexercised, because naming somebody is content, not code. And a **region**
does not grant traits yet: a creature roams, so that grant has to be evaluated
where the resolver runs rather than where the mesh is built.

Three new content families under `projects/<id>/content/`: `people/`, `traits/`,
`quests/`. Three globs in `vite.config.ts` beside the one for `zones/`, read off
the bundle in `src/app/content.ts`. An absent directory is an empty family.

`CreatureEntry` gains `person`. A named person pins the body — builder, folk,
seed, face, scale, voice all come with them, and the entry keeps its own as the
fallback for the unnamed crowd, so the six creature entries in
`countryside-village.json` do not move. A person also carries a `home`, the zone
they belong in, which is what makes "you are a long way from the village"
askable.

`folk` stops picking dialogue and goes back to meaning origin: dress, mask,
lect. The `country` and `city` scripts in `src/world/talk.ts` become
`traits/villager.json` and `traits/cityfolk.json`, the zone grants the matching
trait, and `talk.ts` is deleted. `NpcMark` in `src/world/Interaction.ts` grows
from `{ folk, name }` to `{ person, name, folk, traits }`.

*Done when* the village plays exactly as it does now with no `SCRIPTS` table in
the codebase, and one villager named as a person keeps their face across a
rebuild.

## Step 3 — the pool, the priority and the reply

The resolver: gather the speaker's traits, collect topics from every live owner
whose condition holds, sort by priority, keep the highest per `key`, and for
each walk its infos to the first that holds. Greetings and farewells resolve the
same way out of the same owners.

`Dialogue.ts` barely moves — its `Speaker` already takes
`topics: { key, label, reply }[]`. What changes is that choosing a topic now
also fires that info's `then`, so `boot.ts` hands it a chosen-callback rather
than a bare reply string.

Effects in this pass: `setStage`, `setFlag`, `startQuest`, `failQuest`,
`grantTrait`, `revokeTrait`, `giveItem`, `takeItem`. The last two are the only
ones with an outside dependency; if the inventory is not ready they refuse
loudly rather than silently.

*Done when* a villager and a named person standing next to each other offer
different options out of the same trait, and a reply gated on a flag appears
when the dev panel raises it.

## Step 4 — quests

A quest document: `id`, `name`, `priority`, `cast`, `stages`, `topics`. A stage
is a sparse index — authored 10, 20, 30, so there is room to insert — with a log
line, optional `completes`/`fails` flags, and its own `then`.

`WorldFlags` grows from a dev stub into the thing that actually holds quest
state: stage, the set of stages visited, completed, failed. It is what a save
file writes and reads, which is the first time anything in it is persisted.

*Done when* a quest can be started from a line of dialogue, advanced by another,
and its topics appear and disappear at the right stages across a save and load.

## Step 5 — the editor

The expensive step, and the reason it is last. `scripts/editor-middleware.mjs`
routes `zones` and `world` by name; it needs a generic family route with the
same list/read/write/rename it already gives zones, minus the sidecars.
`src/editor/api.ts` and `Session.commit` are both zone-keyed and take a family.

Then two panels beside `zonePanel` and `layerPanel`: one for people and traits,
one for quests and their topics. Assigning a person is one field on the creature
inspector.

`WorldFlags.preview` and `setStage` already exist as inspection state driven
from the layer panel. Wiring the quest panel to them means setting a quest to
stage 20, walking up to Mark and hearing what he says at stage 20 — which is the
thing the Creation Kit is actually good at, and it is two panels away.

*Done when* a person can be created, named, given a trait and placed without
touching a file by hand, and a quest stage can be forced to preview the dialogue
at it.

## What this is not

- Not a scripting language. Effects are a fixed vocabulary of declarative
  records, and a line that needs more than they offer is a line to reconsider.
- Not radiant content. Every quest is written for the people it is about.
- Not a dialogue graph. Topics are a flat pool resolved by condition and
  priority; nothing points at anything else.
- Not a change to the body, the voice or the animation. `LifeSpec`, the
  builders, `gaits.ts` and the speech stack are all below this line.
