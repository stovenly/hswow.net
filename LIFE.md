# Life: animals and figures that move

The rewrite of everything in *Countryside Village Life* — `figure`, `bovine`,
`ovine`, `porcine`, `dog`, `poultry` — plus the first animation and behaviour
systems they run on. (There was a horse; it was cut.)

## 1. Goals

1. **Video-game, not zoology.** Recognisable at a glance and pleasant to look at.
   Realism informs proportion and gait; aesthetics decide.
2. **Alive.** Walk, roam, turn to face the player, greet with a noise. Idle
   business. Player collides with them; they do not walk through the world.
3. **Polish.** The animals were among the first builders written — a stretched
   icosahedron on four cylinders. Same fidelity band as the rest of the kit,
   but built with the care the buildings now get.
4. **Figures matter most.** People are how the game is talked to. No faces and
   no facial features — but a *structure* where the face would be, one that
   can be animated when a figure looks, greets and talks.
5. **Animation set.** Animals: walk, idle business. Figures: walk, idle,
   greet, talk. Nothing runs.

## 2. Research: expression without a face

What was looked at, and what decided things:

- **Journey / Sky.** A dark hollow under a hood, expression carried by hood
  orientation, scarf light and a wordless chirp. Read as *kind*, never blank.
- **Ashen.** Entirely blank ovoid heads — the devs kept it because players
  judged each other by actions. Reviewers called first meetings "uncanny,
  pre-linguistic". **Superhot** blank red heads read as hostile. A pure blank
  is a tonal risk in a cosy village.
- **Sable / Hollow Knight / Sky masks.** A pale featureless *plate* or mask
  that tilts as one rigid piece. Legitimate, warm, not a face.
- **Astro Bot / EVE / Daft Punk.** A visor band with lit shapes — the shapes
  are eyes, so out; the *band* and the colour-language are usable.
- **Noh masks.** *terasu* (tilt up → lit → smile) and *kumorasu* (tilt down →
  shadowed → sorrow). A brim over a recessed face plane makes head pitch an
  expression under our directional sun.
- **Bunraku.** Sadness/hesitation is a slight roll of the head, a hand toward
  the chest, a lowering of the body, a slow turn. All doable on rigid parts.
- **Kodama.** A rattling head on a neck pivot is a whole personality.
- **Portal turrets / Wheatley.** Something on the head that *opens* on noticing
  you.
- **Voices.** Banjo-Kazooie (3–4 syllable samples per character, random
  order), Celeste (formant-synth syllables, emotion picks the set), Animalese.
  See §2.1 for the second, closer look.
- **NPC behaviour** (Animal Crossing, Skyrim, Stardew): head-track first at a
  long radius, body turn at a short radius, greeting gesture, then a visible
  cooldown that refuses to re-greet.
- **Rigid-part walks** (Rosen/Overgrowth, Little Polygon): a walk is a
  *contact* pose and a *passing* pose, mirrored; torso bobs at twice stride
  frequency, lowest at contact; arms counter-phase to legs; body leans into
  acceleration. Quadruped **walk** is four-beat lateral (LF, LH, RF, RH at
  25 % offsets); diagonal pairs is a trot. Chicken head stays fixed in space
  then thrusts forward — not a sine bob.

### 2.1 Second round: liveliness, faces, voices

- **Procedural animation** (Rosen/Overgrowth GDC 2014, Holden's springs and
  inertialisation, Little Polygon's locomotion notes, Rain World, Goose
  Game): the biggest single anti-slide fix is *foot targets and IK* rather
  than swung legs; blend drivers not clips; state changes carry an offset
  that decays instead of cross-fading; springs on everything that follows;
  attention is the animation (Trico) — a prioritised look target, ballistic
  head turns, glances every few seconds; the head stays level while the
  body walks under it. Numbers used: cadence ~2.4 steps/s scaled by
  √(leg/0.55); lift ~0.11 leg; bob 0.03 leg; pelvis roll/yaw ~3°; head lag
  half-life 0.09 s; gaze 0.1 s; ears 0.14 s under-damped ζ 0.45; settle 0.14 s.
- **Faceless-and-cute** (Ida, kokeshi/peg dolls, KRZ, Ashen, Astroneer,
  Waldorf dolls, Sky): what works is a smooth pale convex head with one hard
  cap of colour framing a bare face patch, big cranium, low features, short
  neck; motion sells it — a head tilt on attention, a nod on speech. What
  fails: recesses, dark shapes, and a protruding snout.
- **Animalese and its kin** (animalese.js and the fan generators, Undertale's
  `OBJ_WRITER`, Celeste, Banjo, Splatoon): one sound per unit of displayed
  text at ~10–15 units/s, pitch by character with a little per-unit jitter,
  punctuation as silence (comma ~0.3 s, stop ~0.6 s), a rise on the last
  units of a question. Formant advice: glottal pulse not sawtooth, Klatt
  flutter, aspiration, bandwidths 60–120 Hz, locus transitions of 30–60 ms,
  and for "small": higher F0, formants ×1.2, faster, breathier.

## 3. The figure

Not a person. The first pass was a human silhouette with a hidden face — too
simple and too human. The second was a fat pillow-body with a sunk head under
a rigid cowl — better, but the fat ones were ugly, the cowl was low effort and
moved too much, and the poncho clipped. The third, current one:

### 3.1 Body

- **A rounded torso that ends at the waist**, built as **one piece on one
  bone**. Five profiles that move the mass around (round, broad-shouldered,
  barrel, slight, round-bellied); never fat. It is a *torso only* — an earlier
  version had a second lobe below the waist and it hung over the legs and read
  as a skirt, which is the one silhouette this must not have.
- **Limbs are shaped, not tubes.** Each segment is a loft with an anatomical
  profile: a deltoid over the shoulder, a taper to the elbow, a swell below
  it, a narrow wrist; a hip, a thigh, a calf, a narrow ankle. Forearms and
  shins are slightly flattened in section.
- **Arms hang clear of the chest.** The torso is narrower at the shoulder than
  it is below, so an arm dropped straight from the shoulder sinks into the
  ribs. The hanging line is measured off the widest part of the body at or
  below the shoulder, and the elbow is placed on it.
- **Joint heads belong to the segment below**, built as a rounded dome centred
  exactly on the pivot — centred there it cannot swing off the joint however
  far the limb bends, so the pair never opens a gap. The segment above simply
  arrives thinner and is swallowed. (The version before this plugged the gaps
  with balls stuck on the outside, which read as lumps on the knees.)
- **Boots** carry straight on from the trouser leg: the collar starts on the
  *same ring* the shin ended on, with neither piece capped there, so the two
  are one surface with a colour change at a ring. A collar that was its own
  tube overlapping the shin at about the same radius made two faceted surfaces
  cut through each other, which is what drew a star at the ankle.
- **Height is chosen first** — 1.28–1.46 m — and torsos are kept slim; a barrel chest reads as a different creature.
- Proportion: and the head, neck, body and legs
  are fitted into it, so a squat head makes a differently proportioned
  villager rather than a taller one.
- **Hide** (sand, sage, dusty rose, slate, ochre, mauve, sea-green) shows at
  the head and the hands and nowhere else. **Cloth is never near a hide
  colour** — it is picked darker and more saturated and checked against the
  villager's own hide, because a collar or a hem in something close to skin
  reads as a bare patch rather than a garment.
- **Always dressed, and never in its own skin.** The torso carries no hide at
  all: a shirt from the collar down to a hem, a second cloth below it, and
  trousers on the legs. A collar ring, sleeves ending at the elbow or the
  wrist, sometimes a bib down the front in the accent colour. Small rigid pieces hug the surface
  (all placed on the body's own ellipse at a height and bearing, so nothing
  clips): belt with buckle, sash with knot and tail, a row of buttons, hip
  pouches, a satchel, a pack, shoulder pads, a scarf, forearm cuffs. Zero to
  three per villager. **No skirts, robes, ponchos or aprons, and no body wider at its bottom than the legs under it.**

### 3.2 The head — a hood, and a carved mask over it

**No face, and no head under it.** Rejected on the way here: a dark socket
(horror); a pale snout with a nose (a bear) and without it (a puffball); a
hair cap round bare hide; visors, plates, discs and jaws (accessories);
sculpted face-fronts on a bare skull; and two rounds of covered heads that
were ornament arranged on a dome rather than anything carved.

**There is a neck, and none of it is skin.** The join is the one place a seam
can open, and it did — so it is three overlapping solids, each centred on the
pivot it turns about: a **collar** on the torso flaring off the shoulders, a
**gorget** on the neck bone whose bottom is a dome centred on the neck's own
pivot, and the **hood** on the head bone, whose bottom ring runs *below* its
base and swallows the top of the gorget. Nothing is a surface split across
two bones.

The hood is plain and carries nothing on the front. Everything to look at
there is a **mask**, built by `art/mask.ts`:

- the **outline** is cut first — oval, shield, plank, disc, gable, long — and
  is what reads from across a field;
- the **front** is a height field over it: a vault bowing forward, a border
  left proud inside the rim, and on some boards one ledge right across. There
  is no anatomy on any of them — no brow, sockets, keel, cheeks or mouth. What
  covers a board instead is ornament and construction, all raised off the
  front;
- the **back** is dished out so the board clears the hood;
- the **rim** between the two is the plank's own thickness, and shows all
  round.

Nothing is ever a hole. The front is cut into six horizontal registers, each
its own geometry over shared vertices, so the colour boundaries are mesh
edges (§3.3).

**The back is furnished, not decorated.** Every mask carries battens, a bar to
grip and iron anchors on its hollow, and the cord from those anchors runs
round the hood to a knot at the nape. The hood's own back takes a seam to
match the harness — a spine, ledger bars, a line of stitches, or a pair of
bosses. All of it is plainly gear rather than ornament, so which way the head
faces is never in doubt.

**Three families**, nine designs in `art/builders/figure-head.ts`, one per row
of the villager gallery:

*A round cut across the grain* — 1. **Cut Round**, heartwood rings standing
where the saw went through. 2. **Burr Round**, rings crowded tight at the
centre with knots budding round them, each a ring with a dark eye. 3. **Bough
Round**, a limb out of each side of the head, spreading wide, with twigs off
every joint.

*Built from parts* — 4. **Lapped Boards**, clinker fashion, each with a bead
along its lapping edge, chamfered ends, iron pegs and notches in every second
face. 5. **Twig Crown**, five staves beaded, nicked and studded between their
two withies, inside thirteen twigs stood all round the rim.

*Carrying a rack* — 6. **Antler Gable**, three dogtooth bands under a beam back
and out of each top corner with two tines forward off it. 7. **Palmate Rack**,
three bands under a flat blade lofted along an arc out of each temple, five
tines rising off its outer edge and a brow tine forward beneath. 8. **Briar
Canes**, a thorned cane ring with a briar rose at its middle, and six canes
reaching out low from the temples on their own bones, swaying as it talks. 9.
**Withy Wheel**, two rims and a hub standing round the whole board in one
plane, ten spokes struck in that same plane so they meet them, bound at every
crossing.

Dogtooth bands carry a constant tooth size and take their count from how wide
the board is at that row, so the teeth are the same on every band and never
crowd into one another — which they did when the size came from the board's
full width and the spacing from the row's.

The hood rides the `head` bone, the collar the `torso`, the gorget the
`neck`, the mask `face`, and anything sprung off its sides `face0…faceN`.
`gaits.faceTalk` / `faceIdle` / `faceGreet` move them by kind. The countryside
uses `round`.

### 3.3 Mesh, and why colour boundaries are edges

Colour is per face and a builder cannot tint half a triangle. A loft quad is
two triangles whose centroids sit a third and two thirds of the way up it — so
a threshold *inside a colour function* takes one triangle from each quad and
leaves the other, and the edge comes out as a sawtooth. More rings do not fix
it; they make the teeth smaller.

**So every coloured region is its own geometry.** The garment is built as
bands of loft — one per region, cut at the hem, the collar and the bone split
— over shared rings, so a hem is a ring of the mesh and comes out as a
straight line. A bib is a run of *columns* of those same rings (`Columns` in
`art/loft`), so its sides are equally clean and it shares exact vertices with
the piece beside it. The face swell and the blush are separate forms for the
same reason.

Fourteen sides on the body, sixteen on the head, a ring at every profile knot
and every 5 %. The head is three bands — hide up to the lowest hairline with
the bottom cap, hair from the highest with the top cap, and between them each
run of columns split at its own line — so a bob's sides and a bowl's fringe
are all edges. Hands are mitts with a thumb; boots have a collar on the shin
and a foot on its own ankle bone; tunics get a collar ring. Nothing is a
one-sided skin — bands and cuffs are closed solids.

### 3.4 Figure animations

- **Feet are planted, legs are solved** (`life/legs.ts`). Each foot is a
  point in the world. A planted foot stays exactly where it is while the body
  moves over it; when its slot on the stride clock comes round and it has
  somewhere to go — the body has moved, or turned — it lifts, arcs to a
  predicted landing ahead of the hip, and plants. The two legs are then
  solved from hip to ankle by two-bone IK every frame, knees forward, soles
  held level and pointing where they planted. So feet never slide, a turn on
  the spot is a shuffle of real steps, and stopping settles into a stance;
  a standing figure's feet do not march.
- **The body rides the feet** (`bipedWalk`): two bobs a cycle, lowest at
  contact, with a touch of squash; sway toward the stance foot; the pelvis
  drops and comes forward on the swing side; the torso counter-turns and
  leans into the walk; the head holds level; arms swing against the legs,
  elbows bending on the way forward. A lean into acceleration and a roll
  into turns come from springs on the speed and yaw rate.
- **Idle**: a breath in quicker than the breath out, in the chest and a
  little in the shoulders; weight from hip to hip with the knees kept soft;
  a moving hold on the head; arm drift; ear twitches — and, about as often
  as it walks, a **fidget**: a stretch, a scratch at the side of the head,
  arms folded, a slow look-around, weight onto one leg (the legs take the
  bend from the feet).
- **Springs everywhere something follows something** (`life/spring.ts`,
  Holden's closed forms): the head lags a body turn and catches up, the
  gaze arrives ballistically and settles, the ears trail the head with a
  wobble, the lean softens.
- **State changes are inertialised**: when the state changes, the difference
  between the last pose and the new one is kept as an offset and decayed
  (half-life 0.14 s), so a gesture interrupted by a greeting does not pop.
- **Greet**: wave / bow / raise, 2 s. **Talk**: the whole line — head dips
  and cheeks puff on the voice's own syllables, hands beat on the stresses,
  and the ears dip. **Look**: within 10 m, clamped, with glances away and
  back every few seconds; the body turns to face while greeting or talking.

## 4. The animals

One body plan still, but the plan is better. Cow, sheep, pig share it; dog
uses it with its own head; poultry has its own.

- **Body is a loft** along the spine — stations at rump, loin, barrel, chest,
  withers — with per-species profiles: cow boxy with a high tail-head and a
  sagging belly, pig a torpedo, sheep a loaf under a lumpy fleece (fleece is
  the loft's own vertices displaced, as before).
- **Two-segment legs** with a knee/hock: upper leg thick and angled, lower leg
  thin and vertical. Hind legs get the hock angle.
- Cattle are built well under life size — about 1.4 m nose to tail. At full
  size they dwarfed the village and the villagers beside them.
- **Species heads.** Cow: broad flat forehead, wide muzzle, ears out, stub
  horns. Pig: wedge head, disc snout, floppy ears. Sheep: narrow face, ears
  out, topknot of fleece. Dog: the existing stop head (it works). No eyes on
  any of them, to match the figures.
- **Tails**: cow switch with tuft, pig curl, sheep short dock, dog carried —
  each its own bone so it moves.
- **Poultry**: lofted body tipped nose-down, wings as plates (they lift in the
  idle flap), tail fan, neck + head with comb, wattle and beak, legs with
  three-toed feet.

### 4.1 Animal animations

- **Walk**: 0.5–0.8 m/s by species. Four-beat lateral walk (LF, LH, RF, RH
  each a quarter cycle apart), lower leg flexes on the swing, head bob follows
  the forelegs, tail swings. Chicken: head thrust — the head holds still in
  world space then snaps forward.
- **Idle**: breathing; **graze** (head down for 4–10 s, about half the idle
  time, the head lifting when it looks at you), ear flicks, tail switch and
  swish, weight shift. Dog: no graze; a tail wag with the bark. Poultry: peck
  in bursts, an occasional flap.
- **Greet**: the call, head up and forward with it, bobbing on the syllables.
- **Look**: neck and head toward the player within notice range (8 m, fowl
  5 m); the body turns only when greeting.

## 5. Rig: how a builder becomes animatable

`assemble` still merges every part into **one geometry** — a creature is one
draw call. What changed (`src/art/rig.ts`, `src/art/loft.ts`):

- `Part.bone?: string`; `assemble(parts, boneNames)` writes `skinIndex` /
  `skinWeight` with one bone at weight one per vertex. Rigid on purpose: a
  hinge is the look.
- `finishRigged(parts, rig, name, phase, scale)` returns a `SkinnedMesh` bound
  to a `Skeleton` built from `{ name, parent, at }` bone specs, pivots in the
  creature's own space. Every bone starts at identity rotation, so the built
  pose is the rest pose and animation writes deltas. `mesh.userData.rig` is
  the handle; `mesh.userData.life` the `LifeSpec`; `userData.noCollide` is
  set so the static octree never holds a bind-pose ghost.
- Three's `MeshLambertMaterial`, `MeshDepthMaterial`, `MeshNormalMaterial` and
  `MeshBasicMaterial` all skin when the object is a `SkinnedMesh`, so the art
  material, the shadow pass, the pixel-pass normal buffer and the effect mask
  needed no shader change. Sway runs before the skinning chunk.
- **Vertex attributes are the scarce resource.** `skinIndex` and `skinWeight`
  took the art material from fourteen active attributes to sixteen, and on
  ANGLE/D3D that is one over the limit — the beauty program failed to link
  ("Too many attributes") while the shadow program, with fewer, drew, so the
  figures were shadows and nothing else. `sway`, `wear` and `detail` are now
  one `vec3` attribute, `aField` (`art/fields.ts`), declared once by the sway
  patch and read by lane: fourteen with skinning, two spare.
- `loft(stations, sides)` — rings along a spine skinned with quads — is the
  body of every animal and the trunk of every figure; `ruffle` displaces an
  indexed loft for the fleece.

Bones: quadruped `root ─ body ─ neck ─ head ─ earL/earR; body ─ tail ─ tail2;
root ─ leg{FL,FR,BL,BR}{u,l}`. Figure `root ─ hips ─ torso ─ neck ─ head ─ cheeks (+ nubL/R);
torso ─ arm{L,R}{u,l}; hips ─ leg{L,R}{u,l,f}`. Fowl `root ─ body ─ neck ─ head;
body ─ wingL/wingR/tail; root ─ legL/legR`. Animal legs hang off the root so a
breathing body never lifts the feet; a figure's hang off the hips, and the
feet are solved back to the ground from wherever the pelvis goes.

## 6. Runtime: `src/life/` and `src/engine/LifeActivity.ts`

- `life/spec.ts` — `LifeSpec` (kind, leg length, height, radius, walk speed,
  roam, call, tone, graze drop, handedness) and `LifeOptions { roam }` that
  every life builder accepts.
- `life/pose.ts` — `Pose`: per-bone deltas (Euler `YXZ`, offset, scale),
  `blend`, `applyPose`; the small curves (`bump`, `envelope`, `wobble`,
  `pulse`). `life/spring.ts` — `damp`, `Spring.to` (critically damped),
  `Spring.bounce` (under-damped). `life/legs.ts` — planted feet and two-bone
  IK for bipeds.
- `life/gaits.ts` — the layers: `quadrupedWalk` (four-beat lateral, lower leg
  folds on the swing, body bob at 2×, head nods with the forelegs, tail
  swings), `quadrupedIdle` (breath, weight shift, tail switch and swish, ear
  flicks), `graze`, `call`; `bipedWalk` (the body over the feet: bob, sway,
  pelvis roll and yaw, torso counter-twist, level head, arms counter-phase),
  `bipedIdle` (breath, weight on one hip, moving hold, arm drift, ear
  twitch), `bipedGreet` (wave / bow / raise, ears perk, head tilt, cheeks),
  `bipedFidget`, `bipedTalk` (head dips and cheeks puff on the syllables,
  hands beat on the stresses); `fowlWalk` (head thrust sawtooth), `fowlIdle`
  (flap), `peck`; `look` (torso, neck, head with a tilt; the ears' swing).
- `life/Creature.ts` — the state machine (idle → walk to a point in the home
  disc / graze / greet / talk), attention (head-track within notice range
  with glances away and back, greet once inside greeting range with a
  30–60 s cooldown that resets when the player leaves, figures say a line
  if you stay), springs for head lag, lean and ears, the transition offset,
  the stride clock that runs while moving or while the feet have anything
  to settle, ground and slope pitch, path planning by two
  `Collider.raycast`s at knee and chest, a probe every 0.3 s while walking,
  keeping apart from other creatures, and a positional `Emitter` per voice
  moved with the head.
- `engine/LifeActivity.ts` — collect / release / update per zone, 55 m range,
  hands the player the awake creatures' cylinders.

## 7. Hooks into the existing engine

- `main.ts` → `zones.updateLife(dt, retestOcclusion)` after `updateSound`.
- `ZoneManager.dress()` collects after `freezeMatrices`; `Creature` turns
  auto-update back on for the mesh and its bones (the `LightActivity`
  precedent). Eviction disposes creatures and their emitters.
- `Controller.obstacles` — cylinders resolved after the static capsule pass,
  sideways only.
- **Speech** (`audio/speech.ts`, `audio/oneshots/voice.ts`). The Animal
  Crossing idea, synthesised: a line is scored into syllables — onset (stop,
  hiss, hush, breath, hum, glide), place in the mouth, a vowel and the vowel
  it moves to, a coda, stress on the first syllable of a word, a pause after
  punctuation, the sentence's tune — and sung as automation on one persistent
  glottal oscillator and one noise source through a four-formant bank. What
  keeps it from a machine: a **glottal pulse** source (Rosenberg, as a
  `PeriodicWave` — `dsp/glottal.ts`) not a sawtooth; **flutter** (Klatt's
  three slow sines) with jitter and shimmer; **breath** through the formants,
  up at word starts; consonants that begin at their **place in the mouth** and
  slide into the vowel; a pitch that is a **line** — carried on from the last
  syllable, lifting through each, falling across a statement, rising into a
  question. Each voice has a seeded character (rate, breathiness, flutter,
  vibrato, range, tract). Today the creatures **babble** — `babbleScore` makes
  up the syllables, no words anywhere — and `say(text)` is the hook for a
  dialogue box when there is one: it returns a unit per syllable on the audio
  clock with the character range each reveals. `hush` cuts a line cleanly.
- Life builders are `solid: false`; `place()` calls in the countryside pass
  `roam`; the animal gallery rows mill within 1.2 m of their spots so the rank
  still reads as a rank.
- The fabrics gallery lost its worn-cloth column: no cloth on the new models.
- No weathering on any life builder.

## 8. What to look at first

- Countryside Animal Life gallery: eight of each, idling; walk up to a row
  and it turns to call. Countryside Villagers gallery: ten rows, one face
  option each, same seeds down every row; walk up and they greet and talk.
- The village green: three figures wander and greet; the paddock stock graze
  and drift; the dog patrols its patch and barks when you come.

Not done, on purpose: no cloth on figures, no eyes on animals, no running.
