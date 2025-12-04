import { atom } from "jotai";

export const patternAtom = atom({
  kick:  new Array(16).fill(false),
  snare: new Array(16).fill(false),
  hat:   new Array(16).fill(false),
  clap:  new Array(16).fill(false),
  bass:  new Array(16).fill(false),
  kick808:   new Array(16).fill(false),
  snare909:  new Array(16).fill(false),
  fmBass:    new Array(16).fill(false),
  pad:       new Array(16).fill(false),
  keys:      new Array(16).fill(false),
});

export const playingAtom = atom(false);

export const soundControlsAtom = atom({
  reverbWet: 0.2,
  delayFeedback: 0.18,
  hatTone: 450,
  bassCutoff: 180,
  padCutoff: 900,
  keysTranspose: 0,
  arpOn: false,
});

export const currentStepAtom = atom(0);

export const muteAtom = atom({
  kick: false,
  kick808: false,
  snare: false,
  snare909: false,
  hat: false,
  clap: false,
  bass: false,
  fmBass: false,
  pad: false,
  keys: false,
});
