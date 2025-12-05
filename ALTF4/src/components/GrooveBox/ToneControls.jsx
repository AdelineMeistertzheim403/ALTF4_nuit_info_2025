import { useAtom } from "jotai";
import { soundControlsAtom } from "../../state/grooveState";

const sliders = [
  { key: "reverbWet", label: "Reverb", min: 0, max: 0.8, step: 0.01, suffix: "" },
  { key: "delayFeedback", label: "Delay fb", min: 0, max: 0.7, step: 0.01, suffix: "" },
  { key: "hatTone", label: "Hat tone", min: 150, max: 1200, step: 10, suffix: "Hz" },
  { key: "bassCutoff", label: "Bass cutoff", min: 80, max: 800, step: 10, suffix: "Hz" },
  { key: "padCutoff", label: "Pad cutoff", min: 200, max: 4000, step: 20, suffix: "Hz" },
  { key: "keysTranspose", label: "Transpose", min: -12, max: 12, step: 1, suffix: "st" },
];

export default function ToneControls({ action }) {
  const [controls, setControls] = useAtom(soundControlsAtom);

  function onChange(key, value) {
    setControls((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="tone-panel">
      <div className="tone-panel__header">
        <div>
          <h3 className="tone-panel__title">Potentiomètres</h3>
          <p className="tone-panel__subtitle">Façonne la couleur des sons en temps réel.</p>
        </div>
        <div className="tone-panel__right">
          <label className="tone-toggle">
            <input
              type="checkbox"
              checked={controls.arpOn}
              onChange={(e) => onChange("arpOn", e.target.checked)}
            />
            <span>Arpégiateur</span>
          </label>
          {action ? <div className="tone-panel__actions">{action}</div> : null}
        </div>
      </div>

      <div className="tone-grid">
        {sliders.map(({ key, label, min, max, step, suffix }) => {
          const value = controls[key];
          return (
            <label key={key} className="tone-control">
              <div className="tone-control__row">
                <span>{label}</span>
                <span className="tone-control__value">
                  {suffix === "st" ? `${value} st` : `${value}${suffix}`}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(key, Number(e.target.value))}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
