// Composant principal de l'application Snake
import React, { useState, useCallback } from 'react';
import { WareZone } from './components/WareZone';
import '../index.css';

const SnakeSoulsApp = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setIsGameOver(false);
    setScore(0);
    setLives(3);
    setIsPaused(false);
  };

  const handleScoreChange = useCallback((newScore) => {
    setScore(newScore);
  }, []);

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const resetGame = () => {
    setGameStarted(false);
    setIsGameOver(false);
    setScore(0);
    setLives(3);
    setIsPaused(false);
  };

  // Écran de démarrage
  if (!gameStarted) {
    return (
      <div style={{
        background: '#0a0a0f',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        color: 'white',
      }}>
        <h1 style={{ marginBottom: '10px', color: '#60A5FA', fontSize: '3rem' }}>
          SnakeSouls
        </h1>
        <p style={{ marginBottom: '40px', opacity: 0.7 }}>
          Déplacement libre - Rotation 360°
        </p>

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
          START
        </button>

        <p style={{ marginTop: '40px', opacity: 0.6, fontSize: '0.9rem', textAlign: 'center' }}>
          Flèches pour tourner | Espace pour pause
        </p>
      </div>
    );
  }

  // Zone de jeu avec WareZone
  return (
    <WareZone
      onScoreChange={handleScoreChange}
      onGameOver={handleGameOver}
      isPaused={isPaused}
      debug={true}
    >
      {/* HUD au-dessus du jeu */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '1.2rem',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>
        <div style={{ color: '#60A5FA', fontWeight: 'bold' }}>
          Score: {score}
        </div>
        <div style={{ marginTop: '5px' }}>
          Vies: {lives}
        </div>
      </div>

      {/* Bouton pause */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontFamily: 'Segoe UI, sans-serif'
        }}
      >
        {isPaused ? 'Reprendre' : 'Pause'}
      </button>

      {/* Game Over overlay */}
      {isGameOver && (
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
        }}>
          <h2 style={{ color: '#EF4444', fontSize: '3rem', marginBottom: '20px' }}>
            GAME OVER
          </h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '30px', color: 'white' }}>
            Score Final: {score}
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
            REJOUER
          </button>
        </div>
      )}
    </WareZone>
  );
};

export default SnakeSoulsApp;
