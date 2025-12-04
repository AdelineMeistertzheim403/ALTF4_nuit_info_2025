// Composant principal de l'application Snake
import React from 'react';
import GameCanvas from './components/GameCanvas';
import '../index.css';

const SnakeSoulsApp = () => {
  return (
    <div style={{
      background: '#1A1A2E',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '10px', color: '#60A5FA', fontSize: '2rem' }}>
        🌊 SnakeSouls
      </h1>
      <p style={{ marginBottom: '20px', opacity: 0.7 }}>
        Jeu en cours de développement...
      </p>
      
      <div style={{
        border: '3px solid #60A5FA',
        borderRadius: '8px',
        padding: '40px',
        background: '#0F0F1A',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
          Architecture du projet créée ✅
        </p>
        <div style={{ textAlign: 'left', opacity: 0.8, fontSize: '0.9rem' }}>
          <p>📁 Structure mise en place :</p>
          <ul style={{ marginTop: '10px', lineHeight: '1.8' }}>
            <li>✅ game/core/ - Moteur de jeu</li>
            <li>✅ game/entities/ - Entités (Snake, Segment)</li>
            <li>✅ game/utils/ - Utilitaires (Vector2, helpers)</li>
            <li>✅ game/data/ - Configuration (bonus, ennemis)</li>
            <li>✅ components/ - Composants React</li>
            <li>✅ hooks/ - Hooks personnalisés</li>
          </ul>
          <p style={{ marginTop: '20px', color: '#F472B6' }}>
            🚧 À implémenter : Game.js, PlayerSnake.js, systèmes IA...
          </p>
        </div>
      </div>

      <p style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.6 }}>
        Prochaine étape : Implémenter le moteur de jeu principal
      </p>
    </div>
  );
};

export default SnakeSoulsApp;
