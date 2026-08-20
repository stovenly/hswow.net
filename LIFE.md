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
- **Height is chosen first** — 1.28–1.68 m — and torsos are kept slim; a barrel chest reads as a different creature. The head's size is picked on its own, so a tall one is long in the leg and the body rather than scaled up.
- Proportion: and the head, neck, body and legs
  are fitted into it, so a squat head makes a differently proportioned
  villager rather than a taller one.
- **Hide** (sand, sage, dusty rose, slate, ochre, mauve, sea-green) shows at
  the head and the hands and nowhere else. **Cloth is never near a hide
  colour** — it is picked darker and checked against the villager's own hide,
  because a collar or a hem in something close to skin reads as a bare patch
  rather than a garment.
- **One low-chroma earth palette for all of them.** Umber, bark, taupe, dust,
  tan, drab, olive-grey, sage-grey — the same range the masks are cut from, so
  a crowd reads as one people rather than a fancy-dress rail. Nothing in it is
  a colour first: the saturated greens, blues, reds and purples that were here
  made villagers look dressed up.
- **The three cloths are a family, not a set.** The shirt is picked and most of
  the time the lower half and the accent are the same cloth taken down or up.
  Three unrelated colours on one small figure is a costume; a tonal outfit is
  what makes cloth read as cloth.
- **Always dressed, and never in its own skin.** The torso carries no hide at
  all, and the **style** decides where the cloth changes: a plain hem, a yoke
  across the shoulders, a girdle round the middle, an open coat with the shirt
  showing in a strip up the front, or a long tunic with a trimmed hem —
  sometimes with a bib panel. Every change is a ring of the loft or a run of
  its columns. The hem always carries a **lip**, standing a little proud and
  flared, so the shirt is a layer worn over the lower half rather than a colour
  change on one surface. A collar ring,
  sleeves ending at the elbow or the wrist, trousers on the legs. Small rigid
  pieces hug the surface (all placed on the body's own ellipse at a height and
  bearing, so nothing clips): belt with buckle, sash with knot and tail, hip
  pouches, a satchel, a pack, a short shoulder mantle, a blanket rolled
  shoulder to hip, a scarf, forearm cuffs. **No buttons.** Zero to three per
  villager. Anything worn on the shoulder keeps its flare inside the line the
  arms hang on, or it goes through them. **No skirts, robes, ponchos or aprons,
  and no body wider at its bottom than the legs under it.**

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

**The back is furnished, not decorated.** Every mask carries battens — a spine
and a rail, three ledgers, or a corner-to-corner cross-brace — with a bar to
grip and iron anchors on its hollow, and the cord from those anchors runs
round the hood to a knot at the nape. The hood's own back takes a seam to
match the harness — a spine, ledger bars, or a pair of bosses. All of it is
plainly gear rather than ornament, so which way the head faces is never in
doubt. Nothing back there may fall into two-things-over-a-third: the socket
harness used to, and read as a face.

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
and out of each top corner with two tines forward off it. 7. **Elk Rack**,
three bands under a real elk's rack: a burr at each top corner, one main beam
sweeping up, out and back over the head, and six points off it — brow and bez
forward over the face, trez off the side, the royal (the longest) off the top
where the beam turns back, then two at the end, every one curling up over its
length. 8. **Briar Canes**, a thorned cane ring with a briar rose at its middle,
and eight canes rooted along the rim, four a side with the crown left clear.
Each leaves the rim nearly on its side and straightens as it goes, so it reaches
out and then climbs. Every cane leans further out than the one inside it and
they all straighten by the same factor, so the order across the fan holds at
every height and no two can cross. 9.
**Withy Wheel**, two rims and a hub standing round the whole board in one
plane, ten spokes struck in that same plane so they meet them, bound at every
crossing.

**The timber is drawn per villager**: birch, ash, oak, mahogany or walnut, four
tones from the one log in the same order of lightness whichever it is. A design
asks for its lightest or its darkest and gets that wood's, so the same mask
turns up pale and dark down a row and everything on it — ornament, rim, back,
harness — is cut from the same log. Antler, cord and iron are not wood and do
not move. Nothing goes darker than walnut's bark: the hollow back is shaded
down from the board and must not read as a hole.

Dogtooth bands carry a constant tooth size and take their count from how wide
the board is at that row, so the teeth are the same on every band and never
crowd into one another — which they did when the size came from the board's
full width and the spacing from the row's.

The hood rides the `head` bone, the collar the `torso`, the gorget the `neck`,
and the mask `face` — rack and all, one bone, nothing sprung.
`gaits.faceTalk` / `faceIdle` / `faceGreet` move them by kind. The countryside
uses `round`.

**The cityfolk** (`folk: 'city'`, gallery *Countryside Cityfolk*) are the same
people — same body, rig, gaits and voice — from a big city, and nothing of the
villager's head is on them. A cityfolk's head is its own, in
`figure-head-city.ts`, at the villager's scale — as wide as the hood, dropping
below the head's base and drawn in at the rim the same way, so it covers the
neck and clears the shoulders on a look down as the hood does. A helm is
reminiscent of armour, not armour: a liner in the house's dark with a flat
face plate set back into its front, and a few plates in the house's mid lapped
over it — skull, cheeks, bevor, brow, visor — each its own solid, edged in the
metal. On the face plate stands the house's device: big flat shapes in the
pale and the contrast, as plain and bold as a villager's board. Everything on
a curved surface is built along it, so nothing floats and nothing passes
through. The devices are abstract geometry in relief on a coloured field, three
colours and the metal in every one. Eleven designs:

*Helms* — 1. **Great Helm**, a flat-topped drum of plates banded at brow, chin
and crown, a torse; a **cross pattée** in the pale with a smaller in the contrast on it. 2. **Bascinet**, a pointed skull over
cheek plates, a bevor and brow band, the visor split and slid back along the
sides like shutters, a row of spikes over the crown splitting into two down
the back; a **fret** of woven bars about a quatrefoil. 3. **Frog-mouth Helm**, the mouth thrust forward under an
arched lip, a comb with ribs down the sides, finials; an **escallop** of ribs in turning colours. 4.
**Winged Burgonet**, peaked brim, tall comb, hinged cheeks, wings turned to the
front; a **compass rose**. 5. **Tourney Helm**, a rounded great helm with a torse and
a fan crest spread across the head, rosettes at the temples, ribs down the nape; a
**swirl** of curved rays. 6. **Morion**, a very tall comb with ribs down the sides, a
brim swept up before and behind with finials, cheek guards; a **triskele**. 7. **Bellows Visor**, a close helm whose ridged visor has slid up along
the skull, fleurons and scrolls at the temples; **barry wavy**. 8. **Spangenhelm**, a
cone of four segments under raised bands, a nasal, cheek flaps and a nape
guard; a **ziggurat** of stepped lozenges. 9. **Escutcheon Helm**, the
house's shield filling the front, a **sun of spikes** on it.

*Cloth* (a wound veil closed over the face) — 10. **Chaperon and Veil**, a
medallion of open rings low over the face, their openings stepping down, the bourrelet, cornette and patte
hanging from under it. 11. **Wound Coif**, a rosette of broad petals low over
the face, three bands wound about the skull, a brooch and a plume at the brow.

**They dress by house.** One hue taken down and up — the same dye dark, mid and
pale — and one contrast against it: purple, crimson, azure or murrey; the
contrast gold, ivory, silver or black as the house allows, and black is only
ever a contrast. Cloth is the mid, hose the dark, the accent the contrast
or the pale, trim the contrast, fur, leather and metal the house's own, and the
head fitted in the same. Nothing on a cityfolk is asymmetrical in colour — no
parti-colour, no counterchanged hose — which is what separates a noble from a
jester.

Their dress is `figure-finery.ts`: a base garment — doublet and hose,
livery gown with a broad front panel, houppelande, robe of office with a
stole — then a surcoat, tabard with a
device, fur-trimmed cote, pleated skirt or rolled-shoulder jacket; a girdle,
hip belt with purse and knife, sash with a bow, or belt with a tongue; an open
front-clasped cloak with a shoulder cape, baldric with a badge, or liripipe;
and extras — scroll, purse and keys, paternoster, pomander. Sleeves
always, often gloved; hose gartered or not; pointed shoes or boots. Everything
is a colour of a mesh: gilt, silver and fur are paint, not materials.

### 3.3 Mesh, and why colour boundaries are edges

Colour is per face and a builder cannot tint half a triangle. A loft quad is
two triangles whose centroids sit a third and two thirds of the way up it — so
a threshold *inside a colour function* takes one triangle from each quad and
leaves the other, and the edge comes out as a sawtooth. More rings do not fix
it; they make the teeth smaller.

**So every coloured region is its own geometry.** The garment is built as
bands of loft — one per region, cut wherever the style says — over shared
rings, so a hem is a ring of the mesh and comes out as a straight line. A bib is a run of *columns* of those same rings (`Columns` in
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
  a standing figure's feet do not march. A foot the body has turned out from
  under — more than `TWISTED` off its plant — does not wait for its slot; it
  steps as soon as the other foot is down, and lifts higher the further it has
  to go. Without that a figure turning on the spot winds its legs round each
  other until the clock comes round.
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
- **Greet**: ten of them, from what people do when they meet — a wave, a bow
  from the waist, both arms hailed up, a hand flat on the chest, palms pressed
  together with a dip, fingertips off the brow, a scoop of the hand to call you
  over, a touch to the brim of the mask, both hands offered forward, two claps.
  About two seconds each, and never the one just used. They are whole-arm
  shapes: the hands are mitts and none of this can be finger work.
- **Talk**: the whole line — head dips and cheeks puff on the voice's own
  syllables and the ears dip — over one of six ways of holding the hands, the
  gesture families people actually talk with: beats on the stress, a listing
  roll of the forearm, a broad sweep, both hands clasped at the waist and none
  of it, a point at the listener, two hands open. Picked fresh each time.
- **Look**: within 10 m, with glances away and back every few seconds. A figure
  that is not walking looks **whatever the angle** — someone stood behind you
  does not wait for you to turn round before they look at you — twisting up to
  `BIPED_YAW_LIMIT`, which `look` shares out as a little torso, some neck and
  most head. All rotation; nothing extends.
- **The head goes first and the body follows it.** The shoulders wait, ease in,
  and stop `SHOULDER_EASE` short of square, because nobody squares up to
  someone they are talking to and the head holds the rest. **How far it has to
  go decides both the wait and the speed**: a quarter turn is leisurely, but
  someone behind you is not — the head cannot get there alone, so the shoulders
  go almost at once and go fast. Swinging the whole figure onto you the instant
  it notices read as a machine on a target.
- **Nothing is greeted until it has been turned to.** The gesture clock and the
  voice both wait on the turn (or 2.5 s, whichever comes first). Hailing the
  air behind it, arms up, before it has come round was worse than greeting a
  moment late.

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
  twitch), `bipedGreet` (ten greetings, ears perk, head tilt),
  `bipedFidget`, `bipedTalk` (six hand styles over the head's own dips);
  `fowlWalk` (head thrust sawtooth), `fowlIdle`
  (flap), `peck`; `look` (torso, neck, head with a tilt; the ears' swing).
- `life/Creature.ts` — the state machine (idle → walk to a point in the home
  disc / graze / greet / talk), attention (head-track **the camera**, not a
  nominal height over the player's feet, so it holds your eye through a crouch
  or a jump, within notice range
  with glances away and back, greet once inside greeting range *and only
  while the player is looking that way* — `GREET_GAZE`, so walking past a
  row of them does not set all of them off at once — with a 30–60 s cooldown
  that resets when the player leaves, figures say a line
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
- **Speech** (`audio/speech.ts`, `audio/voice/`). The Animal Crossing idea,
  synthesised: a line is scored into syllables — onset (stop, hiss, hush,
  breath, hum, glide), place in the mouth, a vowel and the vowel it moves to,
  a coda, stress on the first syllable of a word, a pause after punctuation,
  the sentence's tune — and then **spoken by a throat**. The scoring is
  unchanged; what plays it is not a filter bank any more but an articulatory
  model in an `AudioWorklet`, run per sample: a **Liljencrants–Fant glottal
  pulse** whose one shape control `Rd` moves open quotient, skew and return
  phase together, so spectral tilt follows effort the way it physically does;
  **per-cycle** jitter and shimmer rolled once a period rather than lowpassed
  noise on a detune; a 1/f **drift** and an optional old-age tremor; a
  **Kelly–Lochbaum waveguide** with a nasal branch on a velum, run at twice
  the context rate; **turbulence made at the narrowest place in the tube**, so
  a burst, a hiss and an aspiration are all the same mechanism and none of
  them is a filtered blip; **source–tract coupling**, F1 shifting and widening
  in the open phase; and a **breath reservoir** that empties as a long line
  runs on and is filled by an audible inhale. See `VOICE.md`.
  The three layers do not reach past each other: `speech.ts` knows words,
  `voice/writer.ts` knows what a vowel is and turns one into a jaw and a
  tongue, and `voice/processor.js` knows neither and takes only physical
  parameters on twelve tracks. Adding a voice — a person, an animal, a laugh —
  is a body preset and a writer, never a branch in the DSP.
  Consonants are gestures now: a stop is a **closure that is held and let go**,
  with prevoicing behind it and the burst falling out of the tube; a nasal is
  the **velum open** over a shut mouth; an h is the vowel's own shape with the
  folds apart. A line that comes to rest goes down into **creak** — period
  doubling, not a widened wobble. The pitch still **arrives and then holds**
  through the middle of a vowel rather than moving at every instant, and is
  otherwise a **line** — carried on from the last syllable, falling across a
  statement, rising into a question — and the dynamics between syllables are
  still eight or nine dB, not two.
  Each voice has a seeded identity: **tract length in centimetres** (so it is
  the same person at 44.1 k and 48 k), note, range, `Rd` baseline, jitter,
  shimmer, drift, nasal leak and rate. The seed carries **where the villager
  stands**, so two built the same still sound like two people.
  The old node-graph voice stays as the fallback: `addModule` can fail, and a
  villager with an older voice is better than a villager with none.
  Today the creatures **babble** — `babbleScore` makes
  up the syllables, no words anywhere. Its inventory is a little language of
  its own: consonant-vowel only, no fricatives and nothing that shuts, the
  onset repeating and the vowel holding across a word, so it comes out mimi,
  tuka, nanona and cannot be mistaken for English. A greeting is not made up:
  there are **twenty-five hellos** written in that language, each villager has
  one, and the last few said anywhere are stepped over so none comes round
  twice running. The mark each is written with is its shape — `!` throws it out
  and lets it fall, `?` lifts the end, plain climbs on the **lilt** tune, which
  is quick, even, sits high and goes out on its top note. Nothing said is long.
  `say(text)` is the hook for a
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
