# Time — the clock screen and waiting

**Built, all three phases.** What came out differently is under *Built* at
the end. This is the plan for a fifth tab in the menu, `Time`,
opened with T, that shows the day and the hour as a clock face and lets the
player wait up to twenty-four hours while the world runs on behind it. Names
are working names; the fiction and the naming are yours.

---

## 0. What exists

- **The clock** is `Climate` (`src/world/climate.ts`): `day` (integer) and
  `timeOfDay` (0..1, 0 at midnight), advanced every frame by
  `dt / settings.dayLength`. `dayLength` is 24 × 60 s, so one game hour is
  one real minute. `elapsedDays` is the axis every weather field, the sun, the
  moon, the stars and the seasons run on; `setTimeOfDay` scrubs it, `frozen`
  holds it.
- **The world does not pause** while the menu is open. The frame loop in
  `boot.ts` runs the player, the creatures, the audio, the wind, the weather
  rig, the sky and the render every frame regardless; the menu is a window
  over a live world. The sun, the shadow camera and the dome are per frame and
  bake nothing, which is what makes a Morrowind-style wait possible without
  new rendering work.
- **The menu** (`src/ui/Menu.ts`) is one floating window with four tabs along
  its head, each with a key: inventory I, journal J, map M, world map N. Tab
  opens it on the tab last chosen by hand; a tab's own key opens it there;
  Tab, Escape or the current tab's key close it. While it is up the pause stack
  and the prompt are hidden (`body.is-menu`), the pointer lock is released and
  taken back on close. The window is 82 % of the screen and its body is 94 %
  opaque black, so almost none of the world shows through it today.
- **Saves** carry `clock: elapsedDays`, restored into `day` and `timeOfDay`
  on load. The world starts at `day = 38`, `timeOfDay = 0.42`. **A new game
  after quitting to the title does not reset the clock**; `resetWorld` clears
  the delta, the state, the chart and the pack, and the climate runs on from
  wherever the last run left it.
- **The loading screen** already draws a day as a wheel: the sun and the moon
  on one disc turning about the middle of the horizon, hard-edged orbs, the
  sky's tint following them. That is the visual language the clock face
  borrows.
- **Nothing keys off the hour** except the weather and the sky. There are no
  villager schedules, no shop hours, no curfews; creatures animate at real
  time whatever the clock says. The ambience conditions sample the hour
  (dawn, dusk, night beds) rather than counting frames.

## 1. Research

The three Elder Scrolls games do the same thing three ways, and the request is
for Morrowind's.

- **Morrowind.** Rest from the menu anywhere (a bed lets you sleep; the open
  air only lets you wait). A slider picks one to twenty-four hours, plus
  "until healed". The menu goes away, the world stays on screen with a light
  darkening, the sky wheels through the hours with the weather changing as it
  goes, and a bar counts `3/8` hours. OpenMW's port advances one hour every
  0.05 s of real time, so the whole day passes in about a second; the original
  was slower and the sky was watchable. Resting in the open can be interrupted
  by a creature. This is the one where the world is visibly alive behind the
  count, and it is the one we want.
- **Oblivion.** T opens a dialog showing the current time and a slider of one
  to twenty-four hours. Time passes behind a fade to a near-black screen with
  the hour count ticking; the world is not shown. Refused near enemies.
- **Skyrim.** T, a slider of one to twenty-four hours, a fade to black with the
  hours ticking, and back. Refused near enemies, in the air, underwater, or
  when trespassing. The mod scene has replaced its slider with a time wheel
  more than once, which says something about what people want from this
  screen: a clock, not a form.

What carries across: the range is one to twenty-four hours; the choice is one
control, not a form; the count is visible while it runs; the sky is the
show. What we drop: the black fade, "until healed" (nothing heals), enemy
checks (there is no combat).

Sources: [OpenMW `waitdialog.cpp`](https://github.com/OpenMW/openmw/blob/master/apps/openmw/mwgui/waitdialog.cpp),
[Elder Scrolls wiki, Wait](https://elderscrolls.fandom.com/wiki/Wait),
[UESP, Oblivion time](https://en.uesp.net/wiki/Oblivion:Time),
[Skyrim Modern Wait Menu](https://www.nexusmods.com/skyrimspecialedition/mods/117661),
[Bethesda support, resting in Morrowind](https://help.bethesda.net/app/answers/detail/a_id/17403/~/how-do-i-rest-/-sleep-in-morrowind).

## 2. The screen

### 2a. The tab

`TABS` in `Menu.ts` gains a fifth entry at the end: `time`, label `time`,
key T, code `KeyT`. It behaves like the other four: T opens the menu on it,
Tab remembers it, T or Tab or Escape closes it. The editor keeps its own T;
the menu is only installed on the game page.

### 2b. The window lets the world through

The Time tab is the one tab whose contents are not the point; the sky behind
it is. While `time` is the current tab the window's body drops its black
background to a light tint (about 35 % black, from 94 %) and the pane draws a
single **clock card** centred in it, so most of the window is a view of the
world with a frame round it. The tabs and the window border stay so it still
reads as the menu. Switching to another tab restores the opaque body.

### 2c. The clock face

One disc, the size of the shorter side of the window less margins, drawn as
SVG in the pane. From the outside in:

1. **The hour ring**: twenty-four ticks with the four quarters (midnight, six,
   noon, six) longer and labelled `12`, `6`, `12`, `6` in the menu's caps
   type. Midnight at the bottom, noon at the top, so the sun's position on the
   ring is the sun's position in the sky.
2. **The day arc**: the ring's band is shaded night-dark from dusk round the
   bottom to dawn and left pale over the day, with the two boundaries placed
   where today's sunrise and sunset actually fall (from `Climate`, which knows
   the season). In midwinter the pale arc is short; in midsummer it is most of
   the ring. This is the one piece of the face that changes through the year.
3. **The orbs**: the sun and the moon as on the loading screen, hard-edged,
   riding the ring at the current hour and twelve hours from it. The moon's
   disc shows tonight's phase (`moonPhase` is already known) as a simple
   crescent mask.
4. **The hand**: one long hand from the centre to the current hour on the
   ring, thin, ink-coloured. It is the thing that moves while waiting.
5. **The face**: the time in large numerals, `9:42 am`, twelve-hour, minutes
   floored, `12:00 am` at midnight and `12:00 pm` at noon; beneath it in the
   caps type, `Day 12`; beneath that, small, the moon's name (`moonName`)
   and the season word. Nothing else.

The card carries one line of key caps under the disc, as the other panes do:
`← → hours`, `Enter wait`, `Esc back`.

### 2d. Choosing how long

The choice is made on the ring. A **wait arc** runs clockwise from the hand
to the target hour, drawn as a bright band on the inside of the ring, and a
ghost hand marks the target. Beneath the disc a single line reads
`Wait 8 hours · until 5:42 pm`. Controls:

- **← / →** (and A / D, and the mouse wheel over the disc) move the target
  by one hour; held, they repeat. Range one to twenty-four; twenty-four brings
  the ghost hand round to the hand.
- **Dragging on the ring** sets the target to the hour under the pointer.
- **Enter**, or a click on the `Wait` button under the line, starts the wait.
- **Escape** or T closes the tab as usual.

The target is remembered while the menu is open and resets to one hour when
it closes.

### 2e. Waiting

On `Wait`:

1. The tabs, the window border, the readouts and the key caps fade to nothing
   over 300 ms. What stays is the disc, the wait arc, the hand, and a
   **progress bar** under the disc: a plain bar filling left to right with
   `3 of 8 hours` above it, the count ticking as each hour lands. The card's
   tint is dropped too, so the whole screen is the world with the clock over
   it.
2. The clock runs fast. One game hour passes in **0.5 s** of real time, so a
   full day takes twelve seconds, one hour half a second. The rate ramps over
   the first and last 0.4 s so the sun does not lurch. One constant, in one
   place.
3. The sound goes. The audio engine's master gain ramps to zero over 300 ms
   when the wait starts and back over 300 ms when it ends. Nothing else about
   the audio is touched; the beds keep evaluating silently and are correct for
   the new hour when the gain returns.
4. The world does what it does. The sun crosses, the shadows swing, the stars
   turn, the moon rises, the clouds change deck and the weather arrives and
   leaves, because all of that is sampled from `elapsedDays`. The wet and
   snow eases and the cloud deck ease run at the fast rate too so the ground
   dries and the deck changes at the pace of the sky, not at real time.
   Creatures, cloth, the wind and the player keep real time: a sheep grazing
   through a sped-up sunset is the Morrowind look and is wanted.
5. When the last hour lands the rate ramps back to one, the sound comes back,
   the card's chrome fades in, and the screen is the clock at the new time
   with the target reset to one hour. The menu stays open; a second T or Tab
   closes it.
6. **Escape during the wait** stops it at the next whole hour. The clock keeps
   what it reached; nothing is rolled back.

Nothing about the wait touches saves: `clock` is already saved. A wait is
just the clock moving.

### 2f. Day X

`Day 1` is the day a new game begins. The count is
`floor(elapsedDays) − START_DAY + 1` with `START_DAY` the climate's boot day
(38 now), so a save made on the first evening says `Day 1` and one loaded
after a wait through midnight says `Day 2`. For that to be true **a new game
must reset the clock**: `newGame` in `main.ts` puts the climate back to the
boot day and hour before the first zone begins. That is a fix this spec
carries; today the second run of a session starts wherever the first left
off.

## 3. Plumbing

- `Climate` gains `rate` (default 1), a multiplier on the clock's advance and
  on the rig's clock-paced eases. Only the wait sets it. The dev panel's
  `frozen` and `scrubbing` win over it.
- `WeatherRig.update` passes `dt * climate.rate` to `easeDecks`, the wet and
  snow eases and `climate.update`; the strike clock, the falling-particle
  step and the sound keep real `dt`.
- `AudioEngine` gains `hush(on: boolean)`: a ramp on `master.gain` to zero and
  back, kept separate from the settings' master volume so it restores the
  right value.
- A `Time` pane (`src/ui/Time.ts`) mounted like the journal
  (`src/app/time.ts` installs it), reading `Climate` each frame while active
  through `app.onFrame`, owning the SVG face and the wait state machine
  (`idle`, `choosing`, `waiting`, `stopping`).
- `formatClock(timeOfDay): string` and `dayNumber(elapsedDays): number` are
  small pure functions beside the pane, since the HUD will want them later.
- One body class, `is-waiting`, so the stylesheet can fade the chrome.

## 4. Open questions

1. **Pace.** Half a second an hour makes a day a twelve-second show. Faster
   feels like a skip; slower feels like a wait. Say if you want a different
   number, or a pace that depends on the hours chosen.
2. **What the wait is called.** `Wait` as the verb and `Time` as the tab, per
   the request. If the world has its own word for it, say.
3. **A notice on landing.** A line from `Notices` such as `You waited eight
   hours` when it ends. Cheap; also maybe noise. Left out unless wanted.
4. **A clock on the HUD.** Not in this spec. The formatter is written so that
   adding one later is one line.
5. **Interruptions.** Nothing interrupts a wait now. When weather events or
   visitors exist, the wait should stop at the hour they arrive, the way
   Morrowind's does; the state machine has a `stopping` state for it.

## 5. Phases

Each ends with a look from you.

| phase | work | you look at |
|---|---|---|
| 1. Clock | `rate` on `Climate`, the rig's scaled eases, `hush` on the audio, the new-game clock reset, the two formatters | the dev panel with the clock run at the fast rate: the sky, the shadows, the weather |
| 2. Face | the `time` tab, the see-through body, the clock card with the ring, arcs, orbs, hand and readouts, the hour choice | the tab from the village at three times of day |
| 3. Wait | the wait run: the chrome fade, the progress bar, the ramp, the silence, Escape | a full day waited from the plains, and a one-hour wait |

## Built

What came out differently from the plan above, by the owner's call:

- The window is the same window as every other tab: no lighter tint. It goes
  transparent only while a wait runs.
- No keyboard controls on the pane, and Escape does nothing to it. The hours
  are chosen by dragging on the ring or with the wheel; the one button waits
  and, while waiting, stops at the next whole hour.
- The wait is linear at one game hour per 0.65 s, no ramp. The sound runs on
  through it; nothing is hushed.
- The time and the day stand under the ring, not in it. No season, no moon
  name. The moon on the ring still shows its phase.
- The band is not a grey ring with a dark night arc: it is a sky turning
  slowly behind the ring, blue with cloud, with a grey sheet drawn over it as
  the cloud cover builds and a darkening as rain falls, both read off the
  climate. The night still lies over it from dusk to dawn, in deep blue.
- The four marks on the face read midnight, dawn, noon and dusk, not 12 and 6.
- The wait arc and its dotted hand sit at half the ring's radius.
- While a wait runs the tabs and the window vanish, but the card behind the
  ring and its readouts keeps a backing, so the face does not sink into the
  world. The bar under the readouts holds its place whether or not a wait
  runs, so the ring never moves.
- The ring takes a grabbing cursor while it is dragged.
- The menu names its current tab on its root as `is-tab-<id>`; the
  stylesheet reads that. `Climate` gains `rate`, `reset()` and `daylight()`;
  `START_DAY` and `START_TIME` are exported. A wait under the dev panel's held
  clock ends at once; closing the menu mid-wait keeps what the clock reached.
