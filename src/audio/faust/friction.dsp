// Stick-slip friction: the sound of one surface dragging over another.
//
// A rope on a windlass, a cart axle, a portcullis chain, a hinge, a tree
// leaning on its own branches. All the same event — two surfaces in contact,
// one moving, held by static friction until the force exceeds it, released,
// caught again — repeated anywhere from a few times a second (a groan) to
// several hundred (a squeal).
//
// **This is the one thing in the library that Web Audio nodes genuinely cannot
// do.** The whole effect is a loop: the friction force depends on the relative
// velocity, the relative velocity depends on how the body is already moving,
// and the body is moving because of the force. That is a feedback path that has
// to close every sample. The shortest loop a node graph can express is one
// render quantum — 128 samples, 2.7 ms — which is longer than an entire slip
// cycle at any pitch worth hearing. Nothing about the sound survives it.
//
// The rest of the tier is a matter of taste; this is a matter of arithmetic,
// and it is why Faust is here at all.
//
// ## The curve that does the work
//
// Everything follows from one fact: **kinetic friction is lower than static
// friction, and between them it *falls* as speed rises.** That falling region —
// the Stribeck effect — is negative damping. A body sitting in it is being fed
// energy rather than losing it, so any resonance it has grows until the
// nonlinearity clips it, and what you hear is the body's own modes singing.
// Push the sliding speed past the dip and the slope turns positive again, the
// energy source becomes a damper, and the sing collapses into a rub.
//
// So `speed` is not a volume control and not a rate control. It walks the
// contact across that curve, and the change from groan to squeal to rush falls
// out of the physics instead of being three sounds crossfaded. That is the
// whole reason to model it rather than to sample it.
//
// ## What it is not
//
// Not an elasto-plastic bristle model (Dahl, Dupont, and what the Sound Design
// Toolkit implements). Those track a contact's microscopic pre-sliding
// displacement and are the right answer if you need the sound of a finger
// stopping on glass. Here the contact is always already sliding — ropes,
// axles, hinges — and the added state buys nothing audible for a good deal of
// arithmetic per sample.

import("stdfaust.lib");

// --- controls -------------------------------------------------------------
//
// Names must stay stable: the loader looks parameters up by path, so renaming
// one here is a runtime failure rather than a compile error.

// Normal force — how hard the two surfaces are pressed together. Scales the
// friction force, so it is loudness *and* how hard the loop is driven, which
// is why a heavily-loaded rope squeals and a slack one does not.
force     = hslider("force",     0.5,  0.0,   1.0,   0.001) : si.smoo;
// Sliding speed. See the note above — this is the interesting one.
speed     = hslider("speed",     0.3,  0.0,   1.0,   0.001) : si.smoo;
// Grain of the surface passing under the contact. Zero is polished steel and
// sounds synthetic; some is always wanted.
roughness = hslider("roughness", 0.4,  0.0,   1.0,   0.001) : si.smoo;
// The resonating body's first mode. What is squealing, not how fast.
pitch     = hslider("pitch",   180.0, 30.0, 1400.0,  0.1)   : si.smoo;
// Ring-down of the body. Long is metal, short is wood.
decay     = hslider("decay",     0.5,  0.02,   3.0,  0.001) : si.smoo;
// Weight of the upper modes. Low is a heavy timber, high is a thin plate.
bright    = hslider("bright",    0.5,  0.0,   1.0,   0.001) : si.smoo;
level     = hslider("gain",      0.5,  0.0,   1.0,   0.001) : si.smoo;

// --- the friction curve ---------------------------------------------------
//
// Coulomb with a Stribeck term and a viscous tail:
//
//     mu(v) = sign(v)·[ muK + (muS − muK)·exp(−(v/vs)²) ] + muV·v
//
// At v = 0 it is the static coefficient; by v ≈ 2·vs the exponential is spent
// and only the kinetic term and the viscous slope remain. The dip between them
// is the negative-damping region, and `vs` is where it sits.

/** Stribeck velocity — where static gives way to kinetic. */
vs  = 0.06;
/** Static coefficient. The peak at zero velocity. */
muS = 1.0;
/** Kinetic coefficient. Where the curve settles once properly sliding. */
muK = 0.28;
/** Viscous slope. Restores positive damping at speed, and bounds the curve. */
muV = 0.35;
/**
 * Regularisation velocity — how wide the sign change at zero is spread.
 *
 * Textbook Coulomb friction uses `sign(v)`, and inside a feedback loop that is
 * a disaster: the relative velocity crosses zero on every slip cycle, and each
 * crossing steps the force by twice the static coefficient in one sample. The
 * result is broadband hash at every setting, with the modes buried under it —
 * measurably so, as an eight-kilohertz zero-crossing rate on a body pitched at
 * 180.
 *
 * Smoothing the transition is the standard fix and it is not a fudge: the
 * steep positive slope it leaves behind *is* sticking. Near zero relative
 * velocity the contact is now heavily damped, which is precisely what being
 * stuck to the surface means, and the slip half of stick-slip survives intact
 * because the Stribeck dip sits well outside this width.
 */
vr = 0.012;

mu(v) = ma.tanh(v / vr) * (muK + (muS - muK) * exp(0 - z * z)) + muV * v
with {
    z = v / vs;
};

// --- what is being dragged ------------------------------------------------
//
// The commanded velocity at the contact: a steady pull, and the grain of the
// surface passing under it. The grain is not dressing — a perfectly smooth
// drive puts the contact at exactly one point on the curve forever, and a
// squeal that never wavers reads as an oscillator rather than as an object.
//
// **Multiplied, not added.** Added roughness was the first version and it was
// wrong twice over. A surface only passes under the contact when something is
// moving, so at rest an additive term leaves the model chattering against
// stationary ground; and a fixed noise amplitude larger than `vs` swings the
// contact back and forth across the whole curve — through zero, where the
// Coulomb term changes sign — so every setting came out as broadband hash and
// the Stribeck region was never reached. Scaling the grain by the speed fixes
// both: silent at rest, and the noise stays a perturbation of wherever on the
// curve the contact is sitting instead of overwhelming it.
//
// The 0.25 puts the dip at `vs` around a fifth of the slider, so the bottom of
// the range squeals, the middle groans, and the top rubs.
surface = no.noise : fi.lowpass(2, 60.0 + roughness * 2600.0);
vdrive  = speed * 0.25 * (1.0 + surface * roughness * 0.6);

// --- the body -------------------------------------------------------------
//
// Four modes on a mildly inharmonic series — a hinge pin, a rope-worn timber
// and an axle box are all stiff, irregular things, and exact harmonics would
// make the loop sing a musical note.
//
// Q is clamped well below what the decay would ask for. In an ordinary modal
// bank the resonator carries the ring-down and a high Q is merely thin; inside
// a feedback loop that is *already* being fed energy by the friction curve, a
// resonator sharp enough to ring for a second is a screaming oscillator with
// no timbre and a real risk of running away. The sustain here comes from the
// loop, which is where it comes from in the physical system too — so the
// filters only have to say what the body is made of.
q(f) = min(90.0, max(2.0, ma.PI * f * decay));

/** Kept clear of Nyquist, or a high `pitch` folds the upper modes back down. */
safe(f) = min(f, ma.SR * 0.45);

mode(ratio, amp) = fi.resonbp(safe(pitch * ratio), q(pitch * ratio), amp);

body = _ <: mode(1.00, 1.0),
            mode(2.41, 0.06 + 0.40 * bright),
            mode(4.17, 0.02 + 0.20 * bright),
            mode(6.83, 0.01 + 0.10 * bright)
         :> _;

// --- the tilt -------------------------------------------------------------
//
// **Without this the upper modes win, and the model screams.** The levels
// above say the fundamental is five to twenty times the others, and that is
// not what comes out: a constant-Q resonator's *bandwidth* is proportional to
// its centre frequency, so the mode at 4.17× collects four times as much of a
// broadband force as the one at 1×. The level says quiet and the arithmetic
// says loud, and the arithmetic wins. A gate pitched at 240 came out as a
// thousand-hertz whistle with almost nothing below it — which is exactly what
// it sounded like.
//
// One pole is enough. Everything this model represents — a hinge, a rope on a
// drum, a loaded tree limb — is a heavy object with its energy in the first
// mode or two, and `bright` now opens the tilt rather than merely raising
// levels that the bandwidth was going to undo anyway.
//
// Inside the loop rather than after it, so it damps the high-frequency
// self-oscillation instead of hiding it.
tilt = fi.lowpass(1, min(pitch * (1.8 + bright * 4.0), ma.SR * 0.45));

// --- the loop -------------------------------------------------------------
//
// `vres` is the body's own velocity, one sample old. The contact sees the
// difference between what is being dragged and how the body is already
// moving, and that difference is what the friction curve is evaluated at.
// Take the feedback away and this becomes noise through a filter bank.
contact(vres) = force * mu(vdrive - vres);

// The nonlinearity that stops it. Negative damping grows the oscillation
// without bound; something has to be the limit, and in the physical system it
// is the friction curve flattening out. `tanh` is the cheap stand-in, and
// being smooth it saturates into warmth rather than into a square wave.
//
// Qualified as `ma.tanh`. Bare `tanh` is both a Faust primitive and a
// maths.lib definition, and with `stdfaust.lib` imported the name is ambiguous
// — which the compiler reports as a redefinition rather than as an ambiguity,
// so the error points at the library and not at this line.
saturate(x) = ma.tanh(x * 1.8) * 0.55;

// How much of the body's motion the contact actually sees. Below about 0.3 the
// loop cannot sustain and the model is only ever a rub; above about 0.8 it
// squeals at every setting and `speed` stops meaning anything.
coupling = 0.55;

loop = (contact : body : tilt : saturate) ~ *(coupling);

// --- silence at the bottom ------------------------------------------------
//
// **The loop has a corner at very low speed, and it whistles.** Down there the
// contact is spending nearly all of its time in the steep regularised region
// around zero, which is high positive damping, and what survives is a thin
// high partial with no body under it — measurably so: four fifths of the
// energy above 5 kHz and a crest factor of 3 dB, which is a sine. Every source
// in the game passes through this range on its way up, so every one of them
// whistles on the way in and out of a gust or a stroke.
//
// It is not worth chasing with parameters, because the physical answer is
// simply that a contact creeping this slowly is *stuck*, and a stuck contact
// does not sing. So the output is gated below it. Smoothed, or the gate is
// itself a click.
open = min(1.0, max(0.0, speed - 0.03) / 0.05) : si.smoo;

// The friction force has a large DC component whenever the thing is sliding
// steadily. The bandpasses reject most of it and the saturator puts some back
// as an offset, which would otherwise ride into the panner and eat headroom
// for a sound nobody can hear.
process = loop : fi.dcblocker : *(open) : *(level);
