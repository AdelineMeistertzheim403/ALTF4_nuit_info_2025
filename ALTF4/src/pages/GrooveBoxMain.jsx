import GrooveBox from "../components/GrooveBox/GrooveBox";
import CanvasVisualizer from "../components/Visualizer/CanvasVisualizer";
import { useAtom } from "jotai";
import { patternAtom, playingAtom } from "../state/grooveState";
import { initTone } from "../audio/toneInit";
import { startTransport, stopTransport } from "../audio/transport";

export default function GrooveBoxMain() {
  const [pattern] = useAtom(patternAtom);
  const [playing, setPlaying] = useAtom(playingAtom);

  async function togglePlay() {
    if (!playing) {
      await initTone();
      startTransport(pattern);
    } else {
      stopTransport();
    }
    setPlaying(!playing);
  }

  return (
    <div>
      <h1>GrooveBox Visualizer</h1>
      <GrooveBox />
      <CanvasVisualizer />
      <button onClick={togglePlay}>{playing ? "Stop" : "Start"}</button>
    </div>
  );
}
