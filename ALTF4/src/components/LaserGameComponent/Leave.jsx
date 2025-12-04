import React from "react";

function Leave({ onQuit }) {
  return (
    <div style={styles.container}>
      <button onClick={onQuit} style={styles.button}>
        Quitter
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: "16px",
    right: "20px",
    zIndex: 1000,
  },
  button: {
    padding: "10px 18px",
    fontSize: "15px",
    borderRadius: "8px",
    background: "#e72323ff",
    color: "#f7eaea",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
  },
};

export default Leave;
