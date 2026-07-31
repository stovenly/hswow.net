// A room, as a parameter set rather than as a recording.
//
// The engine's original reverb renders three impulse responses at boot and
// crossfades two convolvers. That is the right shape for three fixed rooms and
// it does not extend: an IR cannot be adjusted, so "a cave whose tail lengthens
// as the passage opens out" would mean rendering a new one and swapping it,
// which cuts the tail dead at the moment of the swap.
//
// A feedback delay network has no such problem. It *is* the parameters — delay
// lines with a unitary feedback matrix, decay set by gain and frequency-dependent
// damping — so RT60, damping and size are live controls, and the literature puts
// it around fifty times cheaper than direct convolution for the same tail.
//
// zita_rev1 rather than a hand-rolled FDN: it is Fons Adriaensen's, it is the
// reference implementation everyone else is measured against, and its low/mid
// split with separate decay times is exactly the control a stone room needs —
// a cathedral's bass rings far longer than its treble, and a single RT60 cannot
// say that.

import("stdfaust.lib");

// Names must stay stable: the loader looks parameters up by path, so renaming
// one here is a runtime failure, not a compile error.
rt60Low  = hslider("decayLow",  2.0, 0.2, 12.0, 0.01);
rt60Mid  = hslider("decayMid",  2.0, 0.2, 12.0, 0.01);
// Where "low" stops. Below this the long decay applies.
crossover = hslider("crossover", 200.0, 50.0, 1000.0, 1.0);
// Damping, as the frequency above which the tail falls away fastest. Low is a
// room full of soft furnishings; high is bare stone.
hfDamping = hslider("damping", 6000.0, 700.0, 16000.0, 1.0);
// Reads as the size of the room — the gap before the first reflections arrive.
preDelay  = hslider("preDelay", 20.0, 0.0, 100.0, 1.0);

// Fully wet. The dry path never enters here: the engine keeps its own dry bus
// and crossfades the wet one, so a zone change fades between rooms instead of
// muting and restarting a convolver.
process = _ <: re.zita_rev1_stereo(preDelay, crossover, rt60Low, rt60Mid, hfDamping, ma.SR);
