import * as Tone from "tone";

export const kick = new Tone.MembraneSynth().toDestination();
export const snare = new Tone.NoiseSynth().toDestination();
export const hat = new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.1, release: 0.01 }
}).toDestination();
