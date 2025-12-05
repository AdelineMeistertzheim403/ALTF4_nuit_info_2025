import React, { useEffect, useState } from 'react';

// --- METHODE UTILITAIRE ---
const getApiUrl = () => {
  // On récupère le nom de domaine actuel (ex: localhost ou altf4.adelinemeistertzheim.fr)
  const hostname = window.location.hostname;

  // Si l'URL contient ton domaine de prod
  if (hostname.includes('adelinemeistertzheim.fr')) {
    return 'https://altf4.adelinemeistertzheim.fr/api/scores';
  }

  // Sinon, on est probablement en local, on tape sur le port 4000
  return 'http://localhost:4000/api/scores';
};

export default function LeaderBoard({ pseudo, score, rang, onReplay, onQuit }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les scores depuis l'API
  useEffect(() => {
    const fetchScores = async () => {
      try {
        // --- UTILISATION DE LA METHODE ICI ---
        const url = getApiUrl();
        console.log("Fetching URL:", url); // Petit log pour vérifier

        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        } else {
          console.error('❌ Erreur lors de la récupération des scores');
        }
      } catch (error) {
        console.error('❌ Erreur réseau:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={styles.card}>
        <h3 style={styles.title}>Mission Terminée</h3>

        {/* --- LIGNE DU JOUEUR (Votre résultat) --- */}
        <div style={styles.playerRow}>
          <div style={{...styles.colRank, color: '#0cc151ff'}}>#{rang}</div>
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

            {/* Liste des scores réels depuis l'API */}
            <div style={styles.list}>
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#9fb0c8' }}>
                    Chargement...
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#9fb0c8' }}>
                    Aucun score disponible
                  </div>
                ) : (
                  leaderboard.map((player) => (
                    <div key={player.id || Math.random()} style={styles.listRow}>
                        <span style={styles.colRank}>{player.rang}</span>
                        <span style={styles.colPseudo}>{player.pseudo}</span>
                        <span style={styles.colScore}>{player.score}</span>
                    </div>
                  ))
                )}
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
    width: 380,
    maxWidth: "95%",
    background: "#0b0f14", color: "#e6eef6", padding: 20,
    borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.8)",
    display: "flex", flexDirection: "column", gap: 12, border: "1px solid #1f2937"
  },
  title: {
    margin: 0, fontSize: 22, fontWeight: 700, textAlign: "center", color: "#f3f7fb", marginBottom: 5
  },
  
  colRank: { width: '15%', textAlign: 'left', fontWeight: 'bold' },
  colPseudo: { width: '60%', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  colScore: { width: '25%', textAlign: 'right', fontWeight: '600' },

  playerRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "rgba(12, 193, 81, 0.1)",
    border: "1px solid #0cc151ff",
    padding: "12px", borderRadius: 8, fontSize: 16
  },

  divider: { height: 1, background: "#1f2937", margin: "5px 0" },

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
    maxHeight: 180,
    overflowY: "auto",
    padding: "0 12px"
  },
  listRow: {
    display: "flex", padding: "8px 0",
    borderBottom: "1px solid #1f2937",
    fontSize: 14, color: "#9fb0c8"
  },

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