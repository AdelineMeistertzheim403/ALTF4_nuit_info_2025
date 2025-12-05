import { useAtom } from "jotai";
import { patternAtom, currentStepAtom, muteAtom } from "../../state/grooveState";
import Track from "./Track";
import "./groovebox.css";

export default function GrooveBox() {
  const [pattern, setPattern] = useAtom(patternAtom);
  const [currentStep] = useAtom(currentStepAtom);
  const [mutes, setMutes] = useAtom(muteAtom);
  const tracks = [
    { name: "Kick", trackKey: "kick" },
    { name: "808 Kick", trackKey: "kick808" },
    { name: "Snare", trackKey: "snare" },
    { name: "909 Snare", trackKey: "snare909" },
    { name: "Hi-Hat", trackKey: "hat" },
    { name: "Clap", trackKey: "clap" },
    { name: "Bass", trackKey: "bass" },
    { name: "FM Bass", trackKey: "fmBass" },
    { name: "Pad", trackKey: "pad" },
  ];

  return (
    <div className="groovebox">
      {tracks.map(({ name, trackKey }) => (
        <Track
          key={trackKey}
          name={name}
          trackKey={trackKey}
          pattern={pattern}
          currentStep={currentStep}
          mute={mutes[trackKey]}
          setMute={(val) =>
            setMutes((prev) => ({
              ...prev,
              [trackKey]: typeof val === "boolean" ? val : !prev[trackKey],
            }))
          }
          setPattern={setPattern}
        />
      ))}
    </div>
  );
}
