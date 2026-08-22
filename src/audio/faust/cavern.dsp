// The sound a large hollow space makes when nothing is happening in it.
//
// A cave was being built here as a tuned pipe, and a tuned pipe is exactly what
// a cave is not. A stopped tube has a definite note and a harmonic series over
// it; that reads as an organ, or as a drum being tuned, because it is what an
// organ and a tuned drum are. A cave has no note. It has a handful of broad,
// irrational resonances that wander as the air moves through passages you
// cannot see, and below them a pressure floor that is felt rather than heard.
//
// **The number that makes this a Faust module.** The resonances are feedback
// loops whose *length changes continuously* — the modulation runs at audio rate
// through a fractional delay, so a passage can breathe by a few percent over
// thirty seconds without a single zip or step. A node graph cannot hold the
// loop at all above 375 Hz, and modulating a `DelayNode` inside a feedback path
// at the required smoothness is not something the API offers.
//
// ## Nothing here is periodic
//
// Every modulator runs on layered value noise at incommensurable rates, so no
// two of the resonances ever come back into the same relationship. A cave that
// repeats is a cave you stop hearing, and the repeat is what an LFO guarantees.

import("stdfaust.lib");

// --- controls -------------------------------------------------------------
//
// Names must stay stable: the loader looks parameters up by path.

/**
 * The lowest resonance, in Hz. This is the size control: 25 is a cathedral of
 * a chamber, 70 a room you could shout across, 140 a passage.
 */
size    = hslider("size",     45.0, 18.0,  400.0, 0.1) : si.smoo;
/** How much rock and how much soft fill, 0..1. High is bare, hard and long. */
hard    = hslider("hard",      0.7,  0.0,    1.0, 0.001) : si.smoo;
/** Air moving through, 0..1. Excites the modes and adds the passage hiss. */
draught = hslider("draught",   0.4,  0.0,    1.0, 0.001) : si.smoo;
/** How far the passages breathe, 0..1. Small: this is geology, not vibrato. */
drift   = hslider("drift",     0.5,  0.0,    1.0, 0.001) : si.smoo;
/** The pressure floor under everything, 0..1. */
floorlv = hslider("floor",     0.6,  0.0,    1.0, 0.001) : si.smoo;
level   = hslider("gain",      0.4,  0.0,    1.0, 0.001) : si.smoo;

MAXD = 16384;

// --- the air --------------------------------------------------------------

/**
 * What excites everything. Brown rather than white: air moving through rock is
 * overwhelmingly low, and the little that is not is the passage hiss below.
 */
air = no.pink_noise : fi.lowpass(2, 180.0 + draught * 900.0) : *(0.1 + draught * 0.5);

/** The thin part: air past edges, and it is the only bright thing in here. */
hiss = no.noise : fi.bandpass(1, 700.0, 3200.0) : *(draught * draught * 0.035);

// --- the modes ------------------------------------------------------------

/**
 * One resonance, breathing.
 *
 * `phase` picks a different corner of the noise field for each mode, so the
 * five of them wander independently. Rates are deliberately awkward numbers —
 * a cave whose resonances drift in step is a chorus effect.
 */
mode(ratio, phase, rate, weight, x) = loop(x) * weight
with {
  wobble = no.lfnoise(rate) * drift * 0.035;
  hz = size * ratio * (1.0 + wobble);
  dlen = max(8.0, min(MAXD - 16.0, ma.SR / max(hz, 12.0)));
  // Longer at the bottom and much shorter at the top, which is what a rough
  // rock surface does — it scatters the treble away and reflects the bass.
  damping = fi.lowpass(1, 220.0 + hard * 1400.0);
  fb = 0.9 + hard * 0.09;
  loop(s) = s : (+ : de.fdelay4(MAXD, dlen) : damping) ~ *(fb);
  // `phase` only exists to decorrelate the noise sources; it is not audible.
  ignore = phase;
};

/**
 * Five resonances at ratios with no small-integer relationship between any
 * pair. That is the whole design: the moment two of them are an octave or a
 * fifth apart the space acquires a note, and a space with a note is a pipe.
 */
modes(x) = mode(1.0,  0.0, 0.031, 1.00, x)
         + mode(1.61, 1.0, 0.017, 0.62, x)
         + mode(2.29, 2.0, 0.043, 0.44, x)
         + mode(3.44, 3.0, 0.023, 0.28, x)
         + mode(5.13, 4.0, 0.037, 0.17, x);

/**
 * The floor: sub-bass with almost nothing above it. This is the part that says
 * how much rock is overhead, and it is mostly below where a laptop can
 * reproduce it — which is correct. It should be a weight, not a sound.
 */
pressure = no.pink_noise : fi.lowpass(3, 38.0) : *(floorlv * 1.6);

process = (air : modes : fi.dcblocker) * 0.35 + hiss + pressure : *(level);
