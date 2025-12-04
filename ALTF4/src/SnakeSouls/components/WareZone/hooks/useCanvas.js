// Hook pour gérer le canvas
import { useRef, useEffect, useState } from 'react';

export const useCanvas = (onResize) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Obtenir le contexte 2D
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    // Redimensionner le canvas
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Mettre à jour les dimensions
      setDimensions({ width: rect.width, height: rect.height });

      if (onResize) {
        onResize({ width: rect.width, height: rect.height });
      }
    };

    // Redimensionner au montage
    resizeCanvas();

    // Écouter le redimensionnement
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onResize]);

  // Fonction fill pour remplir le canvas avec une couleur
  const fill = (color) => {
    if (!ctxRef.current) return;
    ctxRef.current.fillStyle = color;
    ctxRef.current.fillRect(0, 0, dimensions.width, dimensions.height);
  };

  return { 
    canvasRef, 
    ctx: ctxRef.current, 
    dimensions,
    fill
  };
};
