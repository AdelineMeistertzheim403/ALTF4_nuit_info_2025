export default function StepButton({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`step ${active ? "active" : ""}`}
    />
  );
}
