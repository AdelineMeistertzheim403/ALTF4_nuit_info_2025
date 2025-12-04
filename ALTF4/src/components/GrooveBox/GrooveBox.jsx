import { useAtom } from "jotai";
import { patternAtom } from "../../state/grooveState";
import Track from "./Track";

export default function GrooveBox() {
  const [pattern, setPattern] = useAtom(patternAtom);

  return (
    <div className="groovebox">
      <Track name="Kick"  trackKey="kick" pattern={pattern} setPattern={setPattern} />
      <Track name="Snare" trackKey="snare" pattern={pattern} setPattern={setPattern} />
      <Track name="Hi-Hat" trackKey="hat" pattern={pattern} setPattern={setPattern} />
    </div>
  );
}
