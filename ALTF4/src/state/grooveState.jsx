import { atom } from "jotai";

export const patternAtom = atom({
  kick:  new Array(16).fill(false),
  snare: new Array(16).fill(false),
  hat:   new Array(16).fill(false)
});

export const playingAtom = atom(false);
