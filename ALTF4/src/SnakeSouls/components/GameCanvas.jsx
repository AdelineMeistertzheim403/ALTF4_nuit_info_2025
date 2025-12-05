// Composant React pour le canvas du jeu
import React, { useRef, useEffect } from 'react';

const GameCanvas = ({ width = 800, height = 600, game }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !game) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialiser le jeu avec le canvas
    game.setCanvas(canvas, ctx);

    return () => {
      // Cleanup si nécessaire
    };
  }, [game]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '3px solid #60A5FA',
        borderRadius: '8px',
        background: '#0F0F1A',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}
    />
  );
};

export default GameCanvas;
