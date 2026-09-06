# Loading paintings: a framed picture, a different one each wait

The loading screen as a painting hung on black, after Fable's: a sheet of aged
paper with a scorched, torn edge, an ornate frame on it, a picture inside, and
a small plaque under the picture carrying the caption and the bar. Every wait
in the game goes through the one screen, so this is boot, new game, an unbuilt
zone and a long compile alike.

Nothing here may need the main thread while a step runs. The picture is static
markup drawn before the step blocks; anything that moves is a compositor
animation, which is what says the game has not hung.

## Layout

- **Black all round.** The page stays `--void`.
- **The sheet.** One rectangle, aspect about 4:3, sized to fit the viewport
  with a margin (`min(88vw, 92vh × 4/3)`). Parchment-coloured, with an
  irregular edge that reads as burnt and torn: an SVG clip path with a few
  large bites out of the corners and a ragged run along each side, and a
  darker scorch band just inside the edge. The bites are drawn once and never
  change. Fixed, not random: a torn edge that differs each time reads as a
  glitch, not a prop.
- **The frame.** A border inset from the sheet's edge, around the picture.
  Rendered as one SVG: a double rule with scrollwork at the four corners and a
  flourish at the middle of the top and bottom rails, in ink on the parchment,
  slightly darker than the sheet. It is drawn, not photographed; there is no
  bitmap anywhere in this.
- **The picture.** Fills the frame's opening. See below.
- **The plaque.** Centred in the band under the picture: the step caption and
  the bar, as text and a row of cells on the sheet with no box of their own. The bar keeps its quantised blocks
  and its `--lit` transform. The game's title line moves to the sheet's top
  margin, above the frame, in the same small spaced type it has now.
- **Failure** keeps the plaque up with the message in it and the bar red, as
  now.

## The pictures

Real paintings, public domain, chosen by hand: ten landscapes under
`public/paintings/`, each 2400 wide and cropped to a band no taller than 2:1,
shown as a 16:9 cover crop that a `focus` on the entry can move. The title and
artist stand under the frame in faint ink. The list lives in
`src/ui/loadingScenes.ts` and again in the page's inline script, which hangs
the first one before any module has run.

Nothing in the picture moves. The bar's next unlit cell blinks, which is the
liveness signal.

## Not in this

- No text on the painting, no captions over the scene.
- No parallax, no drifting clouds, no animated figures, no day and night.
- No photographs, textures or bitmaps. Everything is CSS and SVG so the screen
  is up on the first frame with nothing to fetch, exactly as now.

## Decisions

Taken 2026-09-05. The frame, sheet and title placement follow the game's own
interface rather than Fable's: a dark sheet dissolving into the void through
two bands of two-pixel dither, a double ink rule with square corner knots, the
title centred in the sheet's top margin, and the plaque in the pause buttons'
dress. A wait gets a random painting, never the same one twice running.
