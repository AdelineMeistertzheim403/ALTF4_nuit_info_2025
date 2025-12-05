// Composant principal de l'application Snake
import React, { useState, useCallback } from 'react';
import { WareZone } from './components/WareZone';
import backgroundImage from './assets/images/snakesouls.webp';
import youDiedImage from './assets/images/youdied.png';
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
        position: 'relative',
      }}>
        {/* Image de fond complète */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          zIndex: 0,
        }} />

        <button
          onClick={startGame}
          style={{
            padding: '25px 70px',
            fontSize: '1.8rem',
            fontWeight: '600',
            letterSpacing: '3px',
            color: '#d4af37',
            background: 'linear-gradient(180deg, rgba(40, 40, 40, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%)',
            border: '3px solid #6b5d47',
            borderRadius: '0',
            cursor: 'pointer',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.3)',
            transition: 'all 0.4s ease',
            position: 'relative',
            zIndex: 1,
            textTransform: 'uppercase',
            fontFamily: 'Georgia, serif',
            textShadow: '0 0 10px rgba(212, 175, 55, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.8)',
            marginTop: '750px',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.08)';
            e.target.style.color = '#ffecb3';
            e.target.style.borderColor = '#d4af37';
            e.target.style.boxShadow = 'inset 0 0 25px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.6), 0 0 80px rgba(212, 175, 55, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.color = '#d4af37';
            e.target.style.borderColor = '#6b5d47';
            e.target.style.boxShadow = 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.3)';
          }}
        >
          START
        </button>

        <p style={{ 
          marginTop: '50px', 
          opacity: 0.7, 
          fontSize: '0.95rem', 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 1,
          color: '#b8a68f',
          fontFamily: 'Georgia, serif',
          letterSpacing: '1px',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
        }}>
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
          background: '#000',
        }}>
          {/* You Died background image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${youDiedImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.9,
            zIndex: 0,
          }} />

          <p style={{ 
            fontSize: '1.5rem', 
            marginBottom: '30px', 
            color: '#d4af37',
            position: 'relative',
            zIndex: 1,
            fontFamily: 'Georgia, serif',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)',
            marginTop: '200px'
          }}>
            Score Final: {score}
          </p>
          <button
            onClick={resetGame}
            style={{
              padding: '20px 50px',
              fontSize: '1.5rem',
              fontWeight: '600',
              letterSpacing: '2px',
              color: '#d4af37',
              background: 'linear-gradient(180deg, rgba(40, 40, 40, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%)',
              border: '3px solid #6b5d47',
              borderRadius: '0',
              cursor: 'pointer',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.4s ease',
              position: 'relative',
              zIndex: 1,
              textTransform: 'uppercase',
              fontFamily: 'Georgia, serif',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.08)';
              e.target.style.color = '#ffecb3';
              e.target.style.borderColor = '#d4af37';
              e.target.style.boxShadow = 'inset 0 0 25px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.color = '#d4af37';
              e.target.style.borderColor = '#6b5d47';
              e.target.style.boxShadow = 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.3)';
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
