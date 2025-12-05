import React from 'react';

// Données JSON étendues pour le faux classement
const fakeLeaderboard = [
  { rank: 1, pseudo: "Viper_X", score: 1250 },
  { rank: 2, pseudo: "Cyber_Neo", score: 980 },
  { rank: 3, pseudo: "GlitchUser", score: 850 },
  { rank: 4, pseudo: "PythonMaster", score: 720 },
  { rank: 5, pseudo: "ByteSlayer", score: 600 },
  { rank: 6, pseudo: "NullPointer", score: 540 },
  { rank: 7, pseudo: "AlgoRhythm", score: 430 },
  { rank: 8, pseudo: "CrashTest", score: 310 },
  { rank: 9, pseudo: "404NotFound", score: 200 },
  { rank: 10, pseudo: "NoobSaibot", score: 100 },
];

export default function LeaderBoard({ pseudo, score, rank = "?", onReplay, onQuit }) {
  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={styles.card}>
        <h3 style={styles.title}>Mission Terminée</h3>

        {/* --- LIGNE DU JOUEUR (Votre résultat) --- */}
        <div style={styles.playerRow}>
          <div style={{...styles.colRank, color: '#0cc151ff'}}>#{rank}</div>
          <div style={{...styles.colPseudo, color: '#fff', fontWeight: 'bold'}}>{pseudo} (Toi)</div>
          <div style={{...styles.colScore, color: '#eab308'}}>★ {score}</div>
        </div>

        {/* --- SEPARATEUR --- */}
        <div style={styles.divider}></div>

        {/* --- TABLEAU CLASSEMENT (Scrollable) --- */}
        <div style={styles.tableContainer}>
            {/* En-têtes du tableau */}
            <div style={styles.tableHeader}>
                <span style={styles.colRank}>#</span>
                <span style={styles.colPseudo}>Agent</span>
                <span style={styles.colScore}>Score</span>
            </div>

            {/* Liste des faux joueurs */}
            <div style={styles.list}>
                {fakeLeaderboard.map((player, index) => (
                    <div key={index} style={styles.listRow}>
                        <span style={styles.colRank}>{player.rank}</span>
                        <span style={styles.colPseudo}>{player.pseudo}</span>
                        <span style={styles.colScore}>{player.score}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* --- BOUTONS --- */}
        <div style={styles.row}>
          <button type="button" onClick={onQuit} style={styles.btnMuted}>
            Quitter
          </button>
          <button type="button" onClick={onReplay} style={styles.btnPrimary}>
            Rejouer
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(2,6,23,0.8)", zIndex: 9999, padding: 20,
  },
  card: {
    width: 380, // Un peu plus large pour le tableau
    maxWidth: "95%",
    background: "#0b0f14", color: "#e6eef6", padding: 20,
    borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.8)",
    display: "flex", flexDirection: "column", gap: 12, border: "1px solid #1f2937"
  },
  title: {
    margin: 0, fontSize: 22, fontWeight: 700, textAlign: "center", color: "#f3f7fb", marginBottom: 5
  },
  
  // --- Styles des Colonnes (Grid like) ---
  colRank: { width: '15%', textAlign: 'left', fontWeight: 'bold' },
  colPseudo: { width: '60%', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  colScore: { width: '25%', textAlign: 'right', fontWeight: '600' },

  // --- Ligne du Joueur ---
  playerRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "rgba(12, 193, 81, 0.1)", // Fond vert très léger
    border: "1px solid #0cc151ff",
    padding: "12px", borderRadius: 8, fontSize: 16
  },

  divider: { height: 1, background: "#1f2937", margin: "5px 0" },

  // --- Tableau ---
  tableContainer: {
    display: "flex", flexDirection: "column",
    background: "#0f1720", borderRadius: 8, border: "1px solid #1f2937",
    overflow: "hidden"
  },
  tableHeader: {
    display: "flex", padding: "8px 12px",
    background: "#161e29", borderBottom: "1px solid #1f2937",
    fontSize: 12, textTransform: "uppercase", color: "#9fb0c8", letterSpacing: "0.05em"
  },
  list: {
    maxHeight: 180, // Limite la hauteur, ajoute le scroll
    overflowY: "auto",
    padding: "0 12px"
  },
  listRow: {
    display: "flex", padding: "8px 0",
    borderBottom: "1px solid #1f2937",
    fontSize: 14, color: "#9fb0c8"
  },

  // --- Boutons (Inchangés) ---
  row: { display: "flex", gap: 10, marginTop: 10 },
  btnMuted: {
    flex: 1, padding: "10px", borderRadius: 8, background: "#f72424ff",
    border: "none", color: "#042027", fontWeight: 600, cursor: "pointer", transition: "0.2s"
  },
  btnPrimary: {
    flex: 1, padding: "10px", borderRadius: 8, background: "#0cc151ff",
    border: "none", color: "#042027", fontWeight: 600, cursor: "pointer", transition: "0.2s"
  },
};