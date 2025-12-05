import { useEffect } from "react";
import { useAtom } from "jotai";
import GrooveBox from "../components/GrooveBox/GrooveBox";
import ToneControls from "../components/GrooveBox/ToneControls";
import TempoSlider from "../components/Controls/TempoSlider";
import CanvasVisualizer from "../components/Visualizer/CanvasVisualizer";
import ThreeVisualizer from "../components/Visualizer/ThreeVisualizer";
import { patternAtom, playingAtom, soundControlsAtom, currentStepAtom, muteAtom } from "../state/grooveState";
import { initTone } from "../audio/toneInit";
import { applyControls } from "../audio/instruments";
import { startTransport, stopTransport, updateTransportControls, updateMutes } from "../audio/transport";
import { useNavigate } from "react-router-dom";
import "./groovebox.css";

export default function GrooveBoxMain() {
  const [pattern] = useAtom(patternAtom);
  const [playing, setPlaying] = useAtom(playingAtom);
  const [controls, setControls] = useAtom(soundControlsAtom);
  const [, setCurrentStep] = useAtom(currentStepAtom);
  const [mutes] = useAtom(muteAtom);
  const navigate = useNavigate();

  useEffect(() => {
    applyControls(controls);
    updateTransportControls(controls);
  }, [controls]);

  useEffect(() => {
    updateMutes(mutes);
  }, [mutes]);

  async function togglePlay() {
    if (!playing) {
      await initTone();
      startTransport(pattern, controls, mutes, setCurrentStep);
    } else {
      stopTransport(setCurrentStep);
    }
    setPlaying(!playing);
  }

  return (
    <div className="groove-page">
      <div className="visualizer-bg" aria-hidden="true">
        <div className="visualizer-3d-row">
          <div className="visualizer-3d-pane left">
            <ThreeVisualizer />
          </div>
          <div className="visualizer-3d-pane right">
            <ThreeVisualizer />
          </div>
        </div>
        <div className="visualizer-bars">
          <CanvasVisualizer />
        </div>
      </div>

      <div className="groove-content">
        <div className="groove-header">
          <div className="groove-title-row">
            <h1 className="groove-title">GrooveBox Visualizer</h1>
            <button className="exit-btn" onClick={() => navigate("/")}>
              Retour Scénario
            </button>
          </div>
          <div className="tempo-inline">
            <TempoSlider
              initialBpm={controls.bpm}
              onBpmChange={(val) => setControls((prev) => ({ ...prev, bpm: val }))}
            />
          </div>
        </div>
        <GrooveBox />
        <ToneControls
          action={
            <button className="play-toggle" onClick={togglePlay}>
              {playing ? "Stop" : "Start"}
            </button>
          }
        />
      </div>
    </div>
  );
}
