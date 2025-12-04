import * as Tone from "tone";
import {
  kick,
  kickTransient,
  kick808,
  kick808Transient,
  snare,
  snare909,
  hat,
  clap,
  bass,
  fmBass,
  pad,
  keys,
} from "./instruments";

const basePadNotes = ["C3", "E3", "G3", "B3", "D4"]; // Cmaj9
const baseKeysNotes = ["C4", "E4", "G4", "B4", "D5"];

let controlsRef = {
  keysTranspose: 0,
  arpOn: false,
};

const instrumentMap = {
  kick: {
    synth: kick,
    note: "C1",
    dur: "8n",
    onTrigger: (time) => kickTransient.triggerAttackRelease("C5", "32n", time),
  },
  kick808: {
    synth: kick808,
    note: "A0",
    dur: "8n",
    onTrigger: (time) => kick808Transient.triggerAttackRelease("E4", "16n", time),
  },
  snare: { synth: snare, note: undefined, dur: "16n" },
  snare909: { synth: snare909, note: undefined, dur: "16n" },
  hat: { synth: hat, note: undefined, dur: "16n" },
  clap: { synth: clap, note: undefined, dur: "16n" },
  bass: { synth: bass, note: "C2", dur: "8n" },
  fmBass: { synth: fmBass, note: "C1", dur: "8n" },
  pad: { synth: pad, note: basePadNotes, dur: "4n" },
  keys: { synth: keys, note: baseKeysNotes, dur: "8n" },
};

export function updateTransportControls(nextControls = {}) {
  controlsRef = { ...controlsRef, ...nextControls };
}

export function startTransport(pattern, controls, setStep) {
  updateTransportControls(controls);
  Tone.Transport.bpm.value = 120;

  Tone.Transport.scheduleRepeat((time) => {
    const ticksPerStep = Tone.Transport.PPQ / 4; // 16th note
    const step = Math.floor((Tone.Transport.ticks / ticksPerStep) % 16);
    if (typeof setStep === "function") setStep(step);
    const transpose = controlsRef.keysTranspose || 0;

    const chord = basePadNotes.map((n) => Tone.Frequency(n).transpose(transpose));
    const keyScale = baseKeysNotes.map((n) => Tone.Frequency(n).transpose(transpose));

    const dynamicMap = {
      ...instrumentMap,
      pad: {
        ...instrumentMap.pad,
        note: controlsRef.arpOn ? [chord[step % chord.length]] : chord,
      },
      keys: {
        ...instrumentMap.keys,
        note: controlsRef.arpOn
          ? [keyScale[step % keyScale.length]]
          : [keyScale[0]],
      },
    };

    Object.entries(dynamicMap).forEach(([key, { synth, note, dur, onTrigger }]) => {
      if (!pattern?.[key]?.[step]) return;
      if (typeof onTrigger === "function") onTrigger(time);
      synth.triggerAttackRelease(note, dur, time);
    });
  }, "16n");

  Tone.Transport.start();
}

export function stopTransport(setStep) {
  Tone.Transport.stop();
  Tone.Transport.cancel();
  if (typeof setStep === "function") setStep(0);
}
