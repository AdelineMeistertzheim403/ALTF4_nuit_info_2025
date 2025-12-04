import * as Tone from "tone";

// Master bus to avoid clipping/saturation
const limiter = new Tone.Limiter(-4).toDestination();
const masterCompressor = new Tone.Compressor({
  threshold: -8,
  ratio: 2.5,
  attack: 0.002,
  release: 0.12,
}).connect(limiter);
const masterGain = new Tone.Gain(1.1).connect(masterCompressor);

const reverb = new Tone.Reverb({
  decay: 2.4,
  wet: 0.18,
  preDelay: 0.025,
}).connect(masterGain);

const delay = new Tone.FeedbackDelay("8n", 0.14).connect(reverb);
delay.wet.value = 0.2;

const padFilter = new Tone.Filter(1200, "lowpass", { Q: 0.8 });
const padChorus = new Tone.Chorus(1.5, 0.4, 0.35).start();
const keysVibrato = new Tone.Vibrato(6, 0.08);

export const kick = new Tone.MembraneSynth({
  pitchDecay: 0.015,
  octaves: 8,
  oscillator: { type: "sine" },
  envelope: { attack: 0.0005, decay: 0.6, sustain: 0 },
}).connect(masterGain);
kick.volume.value = 4; // bring the main kick forward

// Short transient layer to add click/punch to the kick
export const kickTransient = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.0004, decay: 0.05, sustain: 0, release: 0.03 },
}).connect(masterGain);
kickTransient.volume.value = 6;

export const kick808 = new Tone.MembraneSynth({
  pitchDecay: 0.01,
  octaves: 7,
  oscillator: { type: "sine" },
  envelope: { attack: 0.0008, decay: 1.4, sustain: 0 },
}).connect(masterGain);
kick808.volume.value = 3;

export const kick808Transient = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.0006, decay: 0.08, sustain: 0, release: 0.04 },
}).connect(masterGain);
kick808Transient.volume.value = 5;

export const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.002, decay: 0.18, sustain: 0 }
}).connect(masterGain);
snare.volume.value = 1;

export const snare909 = new Tone.NoiseSynth({
  noise: { type: "pink" },
  envelope: { attack: 0.001, decay: 0.28, sustain: 0, release: 0.02 },
  filterEnvelope: { baseFrequency: 800, octaves: 2.5 }
}).connect(masterGain);
snare909.volume.value = 1.5;

export const hat = new Tone.MetalSynth({
  frequency: 450,
  envelope: { attack: 0.0008, decay: 0.08, release: 0.01 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 5000,
  octaves: 2
}).connect(masterGain);

export const clap = new Tone.NoiseSynth({
  noise: { type: "pink" },
  envelope: { attack: 0.002, decay: 0.25 },
  filterEnvelope: { baseFrequency: 800, octaves: 1.5 }
}).connect(masterGain);

export const bass = new Tone.MonoSynth({
  oscillator: { type: "triangle" },
  filter: { Q: 1, type: "lowpass", frequency: 360 },
  envelope: { attack: 0.008, decay: 0.18, sustain: 0.7, release: 0.3 },
  filterEnvelope: { attack: 0.008, decay: 0.15, sustain: 0.35, release: 0.28, baseFrequency: 80, octaves: 2.4 }
}).connect(masterGain);
bass.volume.value = 2;

export const fmBass = new Tone.FMSynth({
  harmonicity: 0.6,
  modulationIndex: 10,
  oscillator: { type: "sawtooth" },
  envelope: { attack: 0.008, decay: 0.22, sustain: 0.45, release: 0.12 },
  modulation: { type: "triangle" },
  modulationEnvelope: { attack: 0.008, decay: 0.18, sustain: 0.25, release: 0.12 }
}).connect(masterGain);
fmBass.volume.value = 1.8;

export const pad = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "triangle" },
  envelope: { attack: 0.16, decay: 0.32, sustain: 0.6, release: 1.3 },
}).chain(padFilter, padChorus, delay);
pad.volume.value = -2;

export const keys = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "sine" },
  envelope: { attack: 0.015, decay: 0.16, sustain: 0.65, release: 0.45 },
}).connect(keysVibrato).connect(reverb);
keys.volume.value = 1.5;

export function applyControls({
  reverbWet,
  delayFeedback,
  hatTone,
  bassCutoff,
  padCutoff,
  keysTranspose,
} = {}) {
  if (typeof reverbWet === "number") {
    reverb.wet.value = Math.min(Math.max(reverbWet, 0), 0.8);
  }
  if (typeof delayFeedback === "number") {
    delay.feedback.value = Math.min(Math.max(delayFeedback, 0), 0.6);
  }
  if (typeof hatTone === "number") {
    hat.frequency.value = Math.min(Math.max(hatTone, 100), 1200);
  }
  if (typeof bassCutoff === "number") {
    bass.filter.frequency.value = Math.min(Math.max(bassCutoff, 80), 800);
  }
  if (typeof padCutoff === "number") {
    padFilter.frequency.value = Math.min(Math.max(padCutoff, 200), 4000);
  }
  if (typeof keysTranspose === "number") {
    keys.set({ detune: keysTranspose * 100 });
    pad.set({ detune: keysTranspose * 100 });
  }
}
