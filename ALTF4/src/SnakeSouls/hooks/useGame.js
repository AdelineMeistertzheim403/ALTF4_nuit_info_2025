// Hook personnalisé pour lier le moteur de jeu à React
import { useEffect, useRef, useState } from 'react';

export const useGame = (GameClass, config = {}) => {
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    paused: false
  });

  useEffect(() => {
    // Créer l'instance du jeu
    if (!gameRef.current) {
      gameRef.current = new GameClass(config);
      
      // Abonner aux changements d'état du jeu
      gameRef.current.onStateChange = (newState) => {
        setGameState(prev => ({ ...prev, ...newState }));
      };
    }

    return () => {
      // Cleanup
      if (gameRef.current) {
        gameRef.current.destroy();
      }
    };
  }, [GameClass, config]);

  const start = () => {
    if (gameRef.current) {
      gameRef.current.start();
    }
  };

  const pause = () => {
    if (gameRef.current) {
      gameRef.current.pause();
      setGameState(prev => ({ ...prev, paused: true }));
    }
  };

  const resume = () => {
    if (gameRef.current) {
      gameRef.current.resume();
      setGameState(prev => ({ ...prev, paused: false }));
    }
  };

  const reset = () => {
    if (gameRef.current) {
      gameRef.current.reset();
      setGameState({
        score: 0,
        lives: 3,
        level: 1,
        gameOver: false,
        paused: false
      });
    }
  };

  return {
    game: gameRef.current,
    gameState,
    start,
    pause,
    resume,
    reset
  };
};

export default useGame;
