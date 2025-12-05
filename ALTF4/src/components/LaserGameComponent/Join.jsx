import React from "react";

function Join({ onStart }) {
  return (
    <div style={styles.container}>
      <button onClick={onStart} style={styles.button}>
        Start Laser Game
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
    background: "#0cc151",
    color: "#042027",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
  },
};

export default Join;
