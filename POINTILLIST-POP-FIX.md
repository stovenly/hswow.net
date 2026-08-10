# Pointillist pop fix

Spec only. No code changed.

## The problem

`exoticCellDensity()` (`src/art/exotic.ts:520`) snaps the Worley density to discrete
octaves:

```glsl
float exoticCellDensity() {
  float finest = 1.0 / 26.0;
  float steps = clamp(log2(max(exoticFootprint() * 2.0, finest) / finest), 0.0, 3.0);
  return 26.0 / exp2(floor(steps));
}
```

Density snaps 26 → 13 → 6.5 → 3.25 at footprints of about 0.019, 0.038 and 0.077
metres per pixel. Three hard jumps, no hysteresis, so a camera sitting near a
threshold flaps between two states.

The jumps are ugly rather than merely visible because this is not a mip chain.
`exoticCell` hashes `floor(p)` at the already-scaled position (`src/art/exotic.ts:140`),
so halving the density regenerates the entire lattice — new cell boundaries, new
per-cell colours everywhere. Each step is a different skin, not a coarser one.

The intent behind the LOD is sound: at density 26 the cells fall under a pixel a few
metres out and the field turns to crawling speckle.

## The change

Stop scaling the lattice. Keep one lattice locked to the surface and let the pixel
footprint fade the cell structure toward its flat average, which is the idiom the
other exotics in this file already use (`src/art/exotic.ts:232`, `:393`, `:451`).

1. **Delete the octave snapping.** `exoticCellDensity()` returns the constant `26.0`,
   or is removed and the constant inlined at the one call site
   (`src/art/finish.ts:902`). Nothing else calls it.

2. **Fade the cell toward flat in `exoticBerryCell`** (`src/art/exotic.ts:527`). Compute
   the fade once from the footprint and apply it to the two structural components
   before returning:

   ```glsl
   float flat = smoothstep(0.006, 0.024, exoticFootprint());
   ```

   - `thickness` → mix toward `0.34`, its expected value over the hash (uniform
     hashes give `0.06 + 0.44·E[x³] + 0.24·E[cluster] + 0.10·E[deep.x]`). Landing
     there keeps the distant body in the blue part of `exoticBerryTint`, which is
     where four cells in five already sit.
   - `shade` → mix toward `1.0`. This also retires the rare-cell `flash` term, which
     rides on `shade` and is the loudest thing at range.
   - `film` → mix toward `0.85`. This is the polygon edge; it is what actually
     aliases, so it must reach flat, not merely soften.

   Both fade thresholds are starting points and are a look call, not a correctness
   one.

3. **Leave `soft` alone** (`src/art/exotic.ts:560`). It already widens the edge with
   the footprint, and it is what makes the approach to flat land smoothly instead of
   snapping off at the top of the smoothstep.

## Cost

None. One lattice evaluated once, same as today. Strictly cheaper than the current
shader at close range, where the constant is identical, and cheaper at range, where
the fade lets the same work produce a calmer result.

## What is given up

At distance the material converges to a smooth blue-green body. It stops reading as
pointillist once the cells are sub-pixel, rather than staying cellular with larger
cells. If it should still read as cells from far away, that is the two-fixed-scale
variant instead, and this spec is the wrong one.

## Acceptance

Walk out from a pointillist piece — `src/art/builders/pointillist-column.ts`,
`src/art/builders/pointillist-orb.ts`, or the second materials gallery
(`src/debug/galleries/materials2.ts`).

- No discrete change in the pattern at any distance, from contact to fade-out.
- Standing at any distance and stepping back and forth produces no flapping.
- No crawling or fizzing speckle at range; the field goes quiet, not busy.
- Close range is pixel-identical to today.
