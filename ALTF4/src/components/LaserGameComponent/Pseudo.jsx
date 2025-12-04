import React, { useState } from "react";

const Pseudo = ({ onValidate, onCancel }) => {
  const [val, setVal] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const cleaned = val.trim();

    if (!cleaned) {
      setError("Veuillez entrer un pseudo.");
      return;
    }

    setError("");
    onValidate(cleaned);
  };

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <form onSubmit={submit} style={styles.card}>
        <h3 style={styles.title}>Entrez votre nom</h3>

        <input
          style={{
            ...styles.input,
            borderColor: error ? "#c15151" : "#1f2937"
          }}
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            if (error) setError("");
          }}
          autoFocus
          placeholder="Votre pseudo"
          aria-label="Pseudo"
        />

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.row}>
          <button type="button" onClick={onCancel} style={styles.btnMuted}>
            Annuler
          </button>
          <button type="submit" style={styles.btnPrimary}>
            Valider
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(2,6,23,0.66)",
    zIndex: 9999,
    padding: 20,
  },
  card: {
    width: 320,
    maxWidth: "90%",
    background: "#0b0f14",
    color: "#e6eef6",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
    color: "#f3f7fb",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #1f2937",
    background: "#0f1720",
    color: "#eef6ff",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  error: {
    margin: 0,
    fontSize: 13,
    color: "#ff6b6b",
    textAlign: "left",
  },
  row: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    marginTop: 6,
  },
  btnMuted: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid #263242",
    color: "#9fb0c8",
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "8px 12px",
    borderRadius: 8,
    background: "#0cc151ff",
    border: "none",
    color: "#042027",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Pseudo;
