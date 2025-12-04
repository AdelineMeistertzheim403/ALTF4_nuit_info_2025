// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // Assure-toi de créer ce fichier

export default function AdminLogin() {
  const navigate = useNavigate();
  const [input, setInput] = useState([]);
  const [error, setError] = useState(false);

  const correctSequence = [0, 3, 2, 5, 1, 8]; // Indices corrects

  const handlePress = (index) => {
    const newInput = [...input, index];
    setInput(newInput);

    if (newInput.length === correctSequence.length) {
      const isCorrect = newInput.every((val, i) => val === correctSequence[i]);
      if (isCorrect) {
        setError(false);
        setInput([]);
        navigate("/admin/conclusion");
      } else {
        setError(true);
        setInput([]);
      }
    }
  };

  const handleReset = () => {
    setInput([]);
    setError(false);
  };

  return (
    <div className="container">
      <h1>Entrez le code</h1>
      {error && <p className="error">Séquence incorrecte !</p>}

      <div className="grid">
        {[...Array(9)].map((_, index) => {
          const isActive = input.includes(index);
          return (
            <button
              key={index}
              onClick={() => handlePress(index)}
              className={`cell ${isActive ? "active" : ""}`}
            />
          );
        })}
      </div>

      {/* <button className="reset-button" onClick={handleReset}>
        Réinitialiser
      </button> */}
    </div>
  );
}