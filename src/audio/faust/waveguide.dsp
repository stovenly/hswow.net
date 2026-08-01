// A resonant air column or wire, as a delay line that feeds itself.
//
// Chimes, hanging wire, singing bowls, struck tubes, wind through pipework and
// arrow slits. All the same object: something whose length is short enough
// that a wave travelling down it and back arrives in under a hundredth of a
// second, so what you hear is not an echo but a *pitch*.
//
// **The number that makes this a Faust module.** A `DelayNode` inside a Web
// Audio feedback loop is clamped by the spec to at least one render quantum —
// 128 samples, 2.67 ms at 48 kHz. A loop that long resonates at 375 Hz, and
// that is the *ceiling*: the delay cannot be made shorter, so every pitch
// above it is unreachable. Not harder, not worse — unavailable by
// construction. Middle F# is the top of what a node graph can ring at, and a
// wind chime lives an octave or two above that.
//
// Here the loop closes every sample and the delay is fractional, so the pitch
// is continuous rather than quantised to whole samples — which matters more
// than it sounds like it should: at 2 kHz a whole-sample delay step is nearly
// a semitone, so a rank of chimes tuned in integers would be audibly out.
//
// ## It does not make its own excitation, on purpose
//
// One audio input, and the thing that hits it lives in JavaScript. That is not
// laziness — `dsp/impact.ts` already schedules sample-accurate filtered-noise
// bursts, `dsp/clock.ts` already handles lookahead, and both are shared with
// every modal model in the library. Moving excitation in here would duplicate
// them behind a control that cannot be scheduled accurately, because Faust
// parameters arrive by message and land on a quantum boundary at best.
//
// So the division is: **Faust does the part nodes cannot, and nothing else.**
// A strike is `excite()` into this input. A blown tube is a looping noise
// buffer through a gain into the same input. Both stay where the substrate is.

import("stdfaust.lib");

// --- controls -------------------------------------------------------------
//
// Names must stay stable: the loader looks parameters up by path, so renaming
// one here is a runtime failure rather than a compile error.

// The resonant frequency. For a closed tube this is the *loop* frequency and
// the pitch you hear is an octave below it — see `polarity`.
pitch  = hslider("pitch",  440.0, 40.0, 4000.0, 0.1)  : si.smoo;
// Seconds to fall by 60 dB. Wire and bowls run long; a wooden tube does not.
decay  = hslider("decay",    2.0,  0.05,  20.0, 0.01) : si.smoo;
// How much of each round trip survives at the top. Low is a soft, stopped
// sound; high is metal.
bright = hslider("bright",   0.5,  0.0,    1.0, 0.001) : si.smoo;
/**
 * Which end the wave reflects off, as 0 or 1.
 *
 * The cheapest interesting control in the module. A wave reflecting off an
 * open end comes back in phase and the tube rings at every harmonic; off a
 * closed end it comes back inverted, which cancels the even ones and drops
 * the fundamental an octave. That single sign is the difference between a
 * flute and a clarinet, and between a struck wire and a stopped pipe — two
 * instrument families for one multiply.
 */
closed = hslider("closed",   0.0,  0.0,    1.0, 1.0);
/**
 * Where along its length the thing is struck, as a fraction.
 *
 * A wave leaving the contact point travels both ways and one copy returns
 * inverted after twice the distance to the near end, so any harmonic with a
 * node there is cancelled. Striking at a half is hollow, at a fifth is bright,
 * dead centre kills every even harmonic. It is the control that stops a rank
 * of these sounding like one instrument at different pitches.
 */
place  = hslider("place",   0.22,  0.02,   0.5, 0.001) : si.smoo;
level  = hslider("gain",     0.5,  0.0,    1.0, 0.001) : si.smoo;

/** Longest loop the delay memory allows: 40 Hz at 96 kHz, with room to spare. */
MAXD = 4096;

// --- the loop -------------------------------------------------------------

/** Where the damping filter's corner sits. Used by `len` and `fb` as well. */
cutoff = 400.0 + bright * 12000.0;

/**
 * Everything in the loop that delays the wave *besides* the delay line.
 *
 * **Get this wrong and the whole module plays flat.** Three contributions:
 *
 * - The recursion's own unit delay. Faust's `~` inserts exactly one sample.
 * - **The damping filter's phase delay at the pitch being played.** This is
 *   the one that is easy to get wrong twice. It moves with `bright` — at
 *   `bright` 0 the filter is worth nineteen samples and at 1 under one — so a
 *   fixed correction cannot serve both ends. And the textbook `SR / (2π·fc)`
 *   is the *continuous-time* value: for a digital one-pole with a high corner
 *   it over-estimates badly, and it also ignores that phase delay falls as the
 *   signal approaches the corner. Using it left the module 8 cents sharp at
 *   440 Hz and 115 cents sharp at 2.6 kHz — the error growing with pitch is
 *   the signature of a fixed sample error against a shrinking period.
 *   The expression below is the exact phase delay of `y = (1−a)x + a·y[−1]`
 *   evaluated at the pitch, which is right everywhere.
 * - The fractional interpolator's own offset, the constant below. Measured
 *   rather than derived: `de.fdelay4` is a four-point Lagrange and its group
 *   delay is not simply the delay it was handed. Fitted against struck tones
 *   at 80, 200 and 440 Hz, where an interpolated autocorrelation resolves the
 *   period to well under a cent.
 *
 * The first version subtracted a flat 2 and came out 14 cents flat at 440.
 * Inaudible alone; a rank of chimes tuned against each other would have been
 * audibly sour.
 */
/** Pole of the one-pole damping filter. */
lpPole = exp(0.0 - 2.0 * ma.PI * cutoff / ma.SR);
/** Angular frequency of the pitch, in radians per sample. */
lpW = 2.0 * ma.PI * max(pitch, 20.0) / ma.SR;
lpDelay = atan(lpPole * sin(lpW) / (1.0 - lpPole * cos(lpW))) / lpW;

loopExtra = 1.0 + lpDelay + 0.45;

/** Round-trip length in samples, less everything else in the loop. */
len = max(4.0, min(MAXD - 8.0, ma.SR / max(pitch, 20.0) - loopExtra));

/**
 * How much the damping filter takes out at the fundamental, per trip.
 *
 * A one-pole's magnitude at `f` is `1 / sqrt(1 + (f/fc)²)`, which is very
 * nearly 1 and is nowhere near negligible: at 440 Hz through a 6.4 kHz corner
 * it is 0.9977, and over the 1760 round trips in a four-second decay that
 * compounds to −36 dB *on its own*.
 */
lpGain = 1.0 / sqrt(1.0 + (pitch / cutoff) * (pitch / cutoff));

/**
 * Loop gain for the wanted decay.
 *
 * The wave goes round `pitch` times a second and must be 60 dB down after
 * `decay` seconds, so the *whole loop* must keep `0.001 ^ (1/(pitch·decay))`
 * per trip. The filter is part of the loop, so the multiply has to make up
 * what the filter takes — dividing by `lpGain` is what turns the decay control
 * into a promise rather than an aspiration. Without it, four seconds measured
 * as two and ten measured as under four, because the filter was quietly doing
 * most of the damping.
 *
 * Clamped just under unity, which is what keeps this unconditionally stable —
 * unlike the friction model, where instability is the *point* and has to be
 * bounded by hand. The clamp binds only when the corner is below the pitch,
 * i.e. a very dull sound asked to ring for a very long time, which is not a
 * thing a real object does either.
 */
fb = min(0.9995, pow(0.001, 1.0 / max(1.0, pitch * decay)) / max(0.05, lpGain));

/**
 * The damping filter, and where a waveguide gets its realism.
 *
 * A single pole in the loop, so high harmonics lose more on every trip than
 * low ones. That is what real materials do — and it is why a struck object's
 * timbre *changes* as it rings, starting bright and settling to a hum, which
 * no bank of fixed resonators can reproduce however many modes it has.
 */
damp = fi.lowpass(1, cutoff);

/** +1 reflects in phase (all harmonics), −1 inverted (odd only). See `closed`. */
polarity = 1.0 - 2.0 * closed;

resonator = + ~ (de.fdelay4(MAXD, len) : damp : *(fb * polarity));

/** Strike position, as a feedforward comb. See `place`. */
comb(x) = x - (x : de.delay(MAXD, int(place * len)));

// The dc blocker is not decoration here: at `closed` the loop is inverting and
// asymmetric, and a long tail with an offset on it eats headroom for something
// nobody can hear.
process = resonator : comb : fi.dcblocker : *(level);
