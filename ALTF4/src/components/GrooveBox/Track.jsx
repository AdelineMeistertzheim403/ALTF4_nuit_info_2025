import StepButton from "./StepButton";

export default function Track({
  name,
  trackKey,
  pattern,
  setPattern,
  currentStep,
  mute,
  setMute,
}) {
  return (
    <div className="track">
      <div className="label">{name}</div>
      {pattern[trackKey].map((active, index) => (
        <StepButton
          key={index}
          active={active}
          isPlaying={currentStep === index}
          onClick={() => {
            const copy = { ...pattern };
            copy[trackKey][index] = !copy[trackKey][index];
            setPattern(copy);
          }}
        />
      ))}
      <button
        className={`mute-btn ${mute ? "muted" : ""}`}
        onClick={() => setMute(!mute)}
        aria-pressed={mute}
      >
        {mute ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}
