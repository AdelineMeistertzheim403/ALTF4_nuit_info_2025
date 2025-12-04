import * as Tone from "tone";
import { kick, snare, hat } from "./instruments";

export function startTransport(pattern) {
  Tone.Transport.bpm.value = 120;

  Tone.Transport.scheduleRepeat((time) => {
    const step = Math.floor((Tone.Transport.ticks / Tone.Transport.PPQ) % 16);

    // Kick
    if (pattern.kick[step]) kick.triggerAttackRelease("C2", "8n", time);
    // Snare
    if (pattern.snare[step]) snare.triggerAttackRelease("8n", time);
    // Hat
    if (pattern.hat[step]) hat.triggerAttackRelease("16n", time);

  }, "16n");

  Tone.Transport.start();
}

export function stopTransport() {
  Tone.Transport.stop();
  Tone.Transport.cancel();
}
