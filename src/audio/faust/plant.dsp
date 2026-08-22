// Heavy machinery under load: a plant floor, a press hall, a pumping station.
//
// The wrong way to build this — and the way it always gets built — is a stack
// of detuned oscillators through a lowpass. That gives you a *tone*, and a
// factory is not a tone. It is a lot of noise being coloured by a lot of metal,
// with a few periodic events in it, and the difference is audible within about
// two seconds: an oscillator stack is fatiguing at any level, because every
// partial is perfectly steady and the ear gets no new information after the
// first cycle.
//
// **The number that makes this a Faust module.** The casing is modelled as
// coupled feedback resonators with a saturating nonlinearity *inside the loop*.
// That cannot be done in a node graph at all: Web Audio's minimum feedback
// delay is one render quantum, 128 samples, which puts a hard 375 Hz ceiling on
// any loop you build out of nodes — and every resonance that matters here is
// above it. More importantly, the nonlinearity has to sit inside the loop to do
// anything. Outside it, saturation is a distortion pedal on a drone. Inside it,
// the resonances *interact*: they pull each other, they intermodulate, and the
// result wanders and grinds the way loaded metal does.
//
// ## Load is the whole instrument
//
// Machinery is only interesting because it is working. Under load the speed
// drops slightly, the casing is driven harder into its nonlinearity, and the
// spectrum shifts up and gets rougher — three things at once from one control,
// exactly as in the real object. A plant that holds one setting is a fan.

import("stdfaust.lib");

// --- controls -------------------------------------------------------------
//
// Names must stay stable: the loader looks parameters up by path.

/** Revolutions per minute. The clank fires once per turn. */
rpm    = hslider("rpm",     220.0, 10.0, 3000.0, 1.0) : si.smoo;
/**
 * How hard it is working, 0..1. Drives the loop harder, drops the speed a
 * little, and roughens the spectrum. One control, three consequences.
 */
load   = hslider("load",      0.5,  0.0,    1.0, 0.001) : si.smoo;
/**
 * The casing's size, as its lowest resonance in Hz. Below 60 is a ship's
 * engine room; above 300 is a bench machine.
 */
size   = hslider("size",     90.0, 30.0,  600.0, 0.1) : si.smoo;
/** How much metal against how much air, 0..1. High is a bare hall. */
metal  = hslider("metal",     0.6,  0.0,    1.0, 0.001) : si.smoo;
/** The once-per-revolution knock, 0..1. Zero is something well maintained. */
clank  = hslider("clank",     0.4,  0.0,    1.0, 0.001) : si.smoo;
/** Bearing and airflow hiss, 0..1. Most of what says worn rather than new. */
wear   = hslider("wear",      0.4,  0.0,    1.0, 0.001) : si.smoo;
level  = hslider("gain",      0.4,  0.0,    1.0, 0.001) : si.smoo;

MAXD = 4096;

// --- what drives it -------------------------------------------------------

/** Turns per second, sagging slightly under load as any real machine does. */
turns = rpm / 60.0 * (1.0 - load * 0.06);

/**
 * A slow wander on the speed, so nothing ever sits exactly still. Two noise
 * sources at incommensurable rates, because one is a tremolo and two is drift.
 */
wander = (no.lfnoise(0.37) * 0.6 + no.lfnoise(0.13) * 0.4) * 0.02;

/** The excitation: broadband, and it is nearly all of the sound. */
breath = no.pink_noise * (0.25 + wear * 0.75);

/**
 * The once-per-revolution impulse. One loose part, once per turn, and without
 * it the speed is ambiguous — a machine with no periodic event in it could be
 * turning at any rate.
 */
tick = os.lf_imptrain(turns * (1.0 + wander));
knock = tick : fi.lowpass(1, 2000.0 + load * 4000.0) : *(clank * 4.0);

/** Rotating things present a different face every turn. */
face = 1.0 + 0.35 * os.osc(turns * (1.0 + wander));

// --- the casing -----------------------------------------------------------

/**
 * A resonant loop with saturation inside it.
 *
 * `fb` stays comfortably under unity — this has to be stable at every setting,
 * unlike the friction model where instability is the point. `ma.tanh` is what
 * makes it grind: as `load` drives the loop harder the peaks flatten, which
 * both limits the loop and generates the intermodulation between resonances
 * that a bank of parallel filters can never produce, because parallel filters
 * by definition do not know about each other.
 */
drive = 0.6 + load * 3.2;
fb = 0.72 + metal * 0.24;

casing(hz, x) = x : (+ : ma.tanh(_ * drive) / drive : de.fdelay4(MAXD, dlen)) ~ *(fb * damping)
with {
  dlen = max(4.0, min(MAXD - 8.0, ma.SR / max(hz, 20.0)));
  // Metal holds its top; a lagged and boxed-in machine does not.
  damping = 0.55 + metal * 0.4;
};

/**
 * Three lengths at irrational ratios, so the casing has no pitch.
 *
 * Small integers would make this a chord. The whole point of a big steel box is
 * that its resonances do not agree with one another, and it is why a factory
 * reads as a *place* rather than as a note.
 */
body(x) = casing(size, x) * 0.5
        + casing(size * 2.37, x) * 0.3
        + casing(size * 4.11, x) * 0.2;

/** The mass of the thing, under everything else. Felt more than heard. */
rumble = breath : fi.lowpass(2, 55.0 + size * 0.4) : *(1.2);

// --- assembly -------------------------------------------------------------
//
// The order matters: the knock goes into the casing rather than beside it, so
// the clank is the *room* being struck and not a click laid over a drone.

driven = (breath * (0.3 + load * 0.7) + knock) * face;

process = (driven : body : fi.dcblocker) + rumble
        : fi.lowpass(2, 900.0 + load * 5200.0 + metal * 3000.0)
        : *(level);
