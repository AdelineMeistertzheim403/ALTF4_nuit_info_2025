import StepButton from "./StepButton";

export default function Track({ name, trackKey, pattern, setPattern }) {
  return (
    <div className="track">
      <div className="label">{name}</div>
      {pattern[trackKey].map((active, index) => (
        <StepButton
          key={index}
          active={active}
          onClick={() => {
            const copy = { ...pattern };
            copy[trackKey][index] = !copy[trackKey][index];
            setPattern(copy);
          }}
        />
      ))}
    </div>
  );
}
