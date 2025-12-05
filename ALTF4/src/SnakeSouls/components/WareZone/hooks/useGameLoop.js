/**
 * useGameLoop.js
 *
 * Hook pour gérer la boucle de jeu :
 * - Appelle update() et render() à ~60 FPS
 * - Calcule le delta time (temps entre frames)
 * - Gère pause/resume
 * - Cleanup automatique au unmount
 *
 * CONCEPT CLÉ - Delta Time :
 * Le jeu doit tourner à la même vitesse sur tous les PC.
 * Au lieu de "bouge de 5 pixels par frame", on fait :
 * "bouge de 300 pixels par SECONDE × deltaTime"
 *
 * USAGE :
 * useGameLoop({
 *   update: (deltaTime) => { ... },
 *   render: () => { ... },
 *   isRunning: true
 * });
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * @param {Object} options
 * @param {Function} options.update - Fonction appelée chaque frame (logique)
 * @param {Function} options.render - Fonction appelée chaque frame (dessin)
 * @param {boolean} options.isRunning - Si false, la boucle est en pause
 */
export function useGameLoop({ update, render, isRunning = true }) {
    // Référence pour l'ID de requestAnimationFrame (pour cancel)
    const frameIdRef = useRef(null);

    // Timestamp de la dernière frame
    const lastTimeRef = useRef(0);

    // Stocker les callbacks dans des refs pour éviter les re-renders
    const updateRef = useRef(update);
    const renderRef = useRef(render);

    // Mettre à jour les refs quand les callbacks changent
    useEffect(() => {
        updateRef.current = update;
        renderRef.current = render;
    }, [update, render]);

    /**
     * La boucle principale
     */
    const loop = useCallback((currentTime) => {
        // Calculer le delta time en secondes
        // Première frame : lastTime = 0, donc on force un petit delta
        const deltaTime = lastTimeRef.current
            ? (currentTime - lastTimeRef.current) / 1000  // ms → secondes
            : 1 / 60;  // ~16ms par défaut

        lastTimeRef.current = currentTime;

        // Limiter le delta time (évite les gros sauts si l'onglet était inactif)
        const clampedDelta = Math.min(deltaTime, 0.1); // Max 100ms

        // Appeler les callbacks
        if (updateRef.current) {
            updateRef.current(clampedDelta);
        }

        if (renderRef.current) {
            renderRef.current();
        }

        // Planifier la prochaine frame
        frameIdRef.current = requestAnimationFrame(loop);
    }, []);

    /**
     * Démarrer/stopper la boucle selon isRunning
     */
    useEffect(() => {
        if (isRunning) {
            // Réinitialiser le timer au démarrage
            lastTimeRef.current = 0;
            frameIdRef.current = requestAnimationFrame(loop);
        } else {
            // Arrêter la boucle
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
                frameIdRef.current = null;
            }
        }

        // Cleanup au unmount
        return () => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, [isRunning, loop]);

    /**
     * Retourne des fonctions utilitaires
     */
    return {
        // FPS actuel (approximatif, pour debug)
        getFPS: useCallback(() => {
            if (!lastTimeRef.current) return 60;
            return Math.round(1000 / (performance.now() - lastTimeRef.current));
        }, [])
    };
}

export default useGameLoop;