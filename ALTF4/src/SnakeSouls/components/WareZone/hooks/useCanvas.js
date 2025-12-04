/**
 * useCanvas.js
 *
 * Hook personnalisé pour gérer un canvas HTML5 :
 * - Crée une référence au canvas
 * - Gère le resize responsive (plein écran)
 * - Fournit le contexte 2D pour dessiner
 * - Gère le ratio pixel (écrans Retina)
 *
 * USAGE :
 * const { canvasRef, ctx, dimensions } = useCanvas();
 */

import { useRef, useState, useEffect, useCallback } from 'react';

export function useCanvas() {
    // Référence vers l'élément <canvas>
    const canvasRef = useRef(null);

    // Contexte 2D (initialisé après le mount)
    const [ctx, setCtx] = useState(null);

    // Dimensions actuelles du canvas
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    /**
     * Redimensionne le canvas pour matcher la taille de l'écran
     * Gère aussi le devicePixelRatio pour les écrans Retina
     */
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Taille CSS (ce qu'on voit)
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        // Ratio pixel (2 sur Retina, 1 sinon)
        const dpr = window.devicePixelRatio || 1;

        // Taille réelle du buffer (pour la netteté sur Retina)
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        // Taille CSS
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        // Récupérer le contexte et scaler pour le DPR
        const context = canvas.getContext('2d');
        context.scale(dpr, dpr);

        setCtx(context);
        setDimensions({ width: displayWidth, height: displayHeight });
    }, []);

    /**
     * Initialisation au mount
     */
    useEffect(() => {
        handleResize();

        // Écouter les resize de la fenêtre
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    /**
     * Efface tout le canvas (appelé au début de chaque frame)
     */
    const clear = useCallback(() => {
        if (!ctx) return;
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    }, [ctx, dimensions]);

    /**
     * Remplit le canvas avec une couleur de fond
     */
    const fill = useCallback((color = '#0f0f1a') => {
        if (!ctx) return;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }, [ctx, dimensions]);

    return {
        canvasRef,     // À mettre sur <canvas ref={canvasRef} />
        ctx,           // Contexte 2D pour dessiner
        dimensions,    // { width, height } actuelles
        clear,         // Fonction pour effacer
        fill           // Fonction pour remplir le fond
    };
}

export default useCanvas;