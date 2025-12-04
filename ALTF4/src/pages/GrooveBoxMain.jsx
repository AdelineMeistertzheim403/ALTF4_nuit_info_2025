import { useEffect } from "react";
import { useAtom } from "jotai";
import GrooveBox from "../components/GrooveBox/GrooveBox";
import ToneControls from "../components/GrooveBox/ToneControls";
import CanvasVisualizer from "../components/Visualizer/CanvasVisualizer";
import { patternAtom, playingAtom, soundControlsAtom, currentStepAtom } from "../state/grooveState";
import { initTone } from "../audio/toneInit";
import { applyControls } from "../audio/instruments";
import { startTransport, stopTransport, updateTransportControls } from "../audio/transport";
import "./groovebox.css";

export default function GrooveBoxMain() {
  const [pattern] = useAtom(patternAtom);
  const [playing, setPlaying] = useAtom(playingAtom);
  const [controls] = useAtom(soundControlsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);

  useEffect(() => {
    applyControls(controls);
    updateTransportControls(controls);
  }, [controls]);

  async function togglePlay() {
    if (!playing) {
      await initTone();
      startTransport(pattern, controls, setCurrentStep);
    } else {
      stopTransport(setCurrentStep);
    }
    setPlaying(!playing);
  }

  return (
    <div className="groove-page">
      <div className="visualizer-bg" aria-hidden="true">
        <CanvasVisualizer />
      </div>

      <div className="groove-content">
        <h1 className="groove-title">GrooveBox Visualizer</h1>
        <GrooveBox />
        <ToneControls />
        <button className="play-toggle" onClick={togglePlay}>
          {playing ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}
