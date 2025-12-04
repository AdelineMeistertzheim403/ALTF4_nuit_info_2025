// Composant principal de l'application Snake
import React, { useEffect, useRef, useState } from 'react';
import Game from './game/core/Game';
import '../index.css';

const SnakeSoulsApp = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    gameOver: false,
    paused: false
  });

  const startGame = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Créer le jeu
    const game = new Game(800, 600);
    game.setCanvas(canvas, ctx);
    
    // Écouter les changements d'état
    game.onStateChange = (newState) => {
      setGameState(prev => ({ ...prev, ...newState }));
    };
    
    // Démarrer
    game.start();
    gameRef.current = game;
    setGameStarted(true);
  };

  const resetGame = () => {
    if (gameRef.current) {
      gameRef.current.destroy();
      gameRef.current = null;
    }
    setGameStarted(false);
    setGameState({
      score: 0,
      lives: 3,
      gameOver: false,
      paused: false
    });
  };

  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy();
      }
    };
  }, []);

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
        Déplacement libre - Rotation 360°
      </p>
      
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            border: '3px solid #60A5FA',
            borderRadius: '8px',
            background: '#0F0F1A',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}
        />
        
        {!gameStarted && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 15, 26, 0.95)',
            borderRadius: '8px'
          }}>
            <button
              onClick={startGame}
              style={{
                padding: '20px 60px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 8px 16px rgba(96, 165, 250, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 12px 24px rgba(96, 165, 250, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 16px rgba(96, 165, 250, 0.3)';
              }}
            >
              ▶ START
            </button>
            <p style={{ marginTop: '30px', opacity: 0.6, fontSize: '0.9rem' }}>
              Prêt à jouer ?
            </p>
          </div>
        )}

        {gameState.gameOver && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '8px'
          }}>
            <h2 style={{ color: '#EF4444', fontSize: '3rem', marginBottom: '20px' }}>
              GAME OVER
            </h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
              Score Final: {gameState.score}
            </p>
            <button
              onClick={resetGame}
              style={{
                padding: '15px 40px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(96, 165, 250, 0.3)'
              }}
            >
              🔄 REJOUER
            </button>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '1.5rem', fontWeight: 'bold', color: '#60A5FA' }}>
        Score: {gameState.score} | Vies: {gameState.lives}
      </div>
      
      <p style={{ marginTop: '15px', opacity: 0.6, fontSize: '0.9rem', textAlign: 'center' }}>
        ← → pour tourner | ↑ accélérer | ↓ ralentir | ESPACE pour pause
      </p>
    </div>
  );
};

export default SnakeSoulsApp;
