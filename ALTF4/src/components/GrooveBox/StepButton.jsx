export default function StepButton({ active, onClick, isPlaying }) {
  return (
    <button
      onClick={onClick}
      className={`step ${active ? "active" : ""} ${isPlaying ? "playing" : ""}`}
    />
  );
}
