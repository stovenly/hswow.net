# src/world

Places, and what is between them. A zone is one contiguous piece of world you
can walk around in; a portal is a link between two of them.

Describe what this area is and how its pieces fit **now**. No history, no "we
changed X to Y", no rejected alternatives, no tuning notes. If a fact stops
being true, edit the line — do not append a correction.

## The zone lifecycle

Exactly **one** zone is in the scene and in the collider at any moment. The
exterior is a zone and every interior is a zone; they never coexist, which is
what lets every interior be authored about its own origin.

Crossing a threshold, in `ZoneManager.enter`, is: build the zone if it is cold
(async, because a blocked frame cannot paint), compile its programs *before*
anything is swapped, then — with nothing yielding from here to the teleport —
remove the old root, add the new one, rebuild the collider from it, push the
zone's air and acoustics into the pipeline and the audio engine, and drop the
player on the arrival marker. All of it at full black inside one frame.

`evict` runs last, once the arrival has settled, and drops every zone further
than `KEEP_WITHIN` doors away plus the one you just left. It is safe because
builders are seeded: a rebuild gives back the same world down to the blade of
grass. Geometry, the collider's octree, the doors, the soundscape and the warm
mark all go together.

## Dressing, interior, terrain, vista

- **`terrain.ts`** — the walkable heightfield, summed from placed landforms.
  Authored, never noise. The `rim` landform is the boundary: ground past the
  slope limit, made of the same triangles as everything else.
- **`ground.ts`** — what that ground is *made of*, patch by patch. A material is
  a colour **and** a sound **and** what grows on it, in one table, so the three
  cannot drift apart.
- **`interior.ts`** — a sealed shell with no doorway cut in it. Portal doors
  bring their own frame and dark backing panel.
- **`vista*.ts`** — everything past the boundary, in three bands: ordinary props
  along the edge (`dressing.ts`), merged scenery in the ring, and the sky. The
  whole band is written against one signed distance to the level's outline,
  which is why a winding level costs nothing extra.

## Conventions

**Declared or observed, never both.** A fog volume has no geometry, so it is
declared on the `ZoneDefinition`. Water and glass *are* geometry, so they are
observed on the build traversal — a flag that could disagree with what was
built would silently cost a whole-scene walk or leave a pond that never draws.

Positional facts live on the definition (`spawn`, `groundAt`, `fogVolumes`,
`glitches`); facts about a *kind* of place live in `ZoneEnvironment`, which is
why two constants cover nearly every zone.

Two solids that meet exactly share corner vertices, which is a seam a player can
fall through. Walls overlap at corners; floors are inset into them.
