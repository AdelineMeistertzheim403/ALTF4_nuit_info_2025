/**
 * WareZone.jsx
 *
 * Composant principal de la zone de jeu.
 *
 * Responsabilités :
 * - Afficher le canvas fullscreen
 * - Gérer la boucle de jeu (update/render)
 * - Coordonner la caméra
 * - Dessiner la grille de fond infinie
 *
 * Usage :
 * <WareZone onScoreChange={setScore} onGameOver={handleGameOver} />
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCanvas } from './hooks/useCanvas';
import { useGameLoop } from './hooks/useGameLoop';
import { Camera } from './camera/Camera';
import './WareZone.css';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Couleurs
    BACKGROUND_COLOR: '#0a0a0f',
    GRID_COLOR: 'rgba(255, 255, 255, 0.03)',
    GRID_SIZE: 50,  // Taille des cases de la grille

    // Debug
    DEBUG: true,  // Affiche des infos de debug
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export function WareZone({
                             onScoreChange,
                             onGameOver,
                             isPaused = false,
                             debug = false
                         }) {
    // ---- Hooks ----
    const { canvasRef, ctx, dimensions, fill } = useCanvas();

    // ---- Refs (persistantes entre les renders) ----
    const cameraRef = useRef(new Camera());
    const playerPositionRef = useRef({ x: 0, y: 0 }); // Simulé pour l'instant

    // ---- State ----
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // 'playing' | 'paused' | 'gameover'

    // ============================================
    // INITIALISATION
    // ============================================
    useEffect(() => {
        const camera = cameraRef.current;

        // La caméra suit la position du joueur
        camera.setTarget(playerPositionRef.current);
        camera.resize(dimensions.width, dimensions.height);
        camera.centerOnTarget();
    }, [dimensions]);

    // ============================================
    // DESSIN DE LA GRILLE INFINIE
    // ============================================
    const drawGrid = useCallback((ctx, camera) => {
        const { GRID_SIZE, GRID_COLOR } = CONFIG;

        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;

        // Calculer les bornes visibles
        const bounds = camera.getBounds();

        // Trouver la première ligne de grille visible
        const startX = Math.floor(bounds.left / GRID_SIZE) * GRID_SIZE;
        const startY = Math.floor(bounds.top / GRID_SIZE) * GRID_SIZE;

        // Dessiner les lignes verticales
        for (let x = startX; x <= bounds.right; x += GRID_SIZE) {
            const screenPos = camera.worldToScreen(x, 0);
            ctx.beginPath();
            ctx.moveTo(screenPos.x, 0);
            ctx.lineTo(screenPos.x, dimensions.height);
            ctx.stroke();
        }

        // Dessiner les lignes horizontales
        for (let y = startY; y <= bounds.bottom; y += GRID_SIZE) {
            const screenPos = camera.worldToScreen(0, y);
            ctx.beginPath();
            ctx.moveTo(0, screenPos.y);
            ctx.lineTo(dimensions.width, screenPos.y);
            ctx.stroke();
        }
    }, [dimensions]);

    // ============================================
    // DESSIN DE L'ORIGINE (debug)
    // ============================================
    const drawOrigin = useCallback((ctx, camera) => {
        const origin = camera.worldToScreen(0, 0);

        // Croix à l'origine
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(origin.x - 20, origin.y);
        ctx.lineTo(origin.x + 20, origin.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y - 20);
        ctx.lineTo(origin.x, origin.y + 20);
        ctx.stroke();

        // Label
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.font = '12px monospace';
        ctx.fillText('(0, 0)', origin.x + 5, origin.y - 5);
    }, []);

    // ============================================
    // DESSIN DES INFOS DEBUG
    // ============================================
    const drawDebugInfo = useCallback((ctx, camera, deltaTime) => {
        const fps = Math.round(1 / deltaTime);
        const player = playerPositionRef.current;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px monospace';

        const lines = [
            `FPS: ${fps}`,
            `Camera: (${Math.round(camera.x)}, ${Math.round(camera.y)})`,
            `Player: (${Math.round(player.x)}, ${Math.round(player.y)})`,
            `Viewport: ${dimensions.width}x${dimensions.height}`,
        ];

        lines.forEach((line, i) => {
            ctx.fillText(line, 10, dimensions.height - 60 + (i * 15));
        });
    }, [dimensions]);

    // ============================================
    // BOUCLE DE JEU
    // ============================================
    const gameLoop = useCallback((deltaTime) => {
        if (!ctx || isPaused || gameState !== 'playing') return;

        const camera = cameraRef.current;

        // ---- UPDATE ----

        // Simuler un mouvement de joueur (à remplacer par le vrai snake)
        const time = Date.now() / 1000;
        playerPositionRef.current.x = Math.cos(time * 0.5) * 200;
        playerPositionRef.current.y = Math.sin(time * 0.5) * 200;

        // Mettre à jour la caméra
        camera.update();

        // ---- RENDER ----

        // 1. Fond
        fill(CONFIG.BACKGROUND_COLOR);

        // 2. Grille infinie
        drawGrid(ctx, camera);

        // 3. Origine (debug)
        if (debug || CONFIG.DEBUG) {
            drawOrigin(ctx, camera);
        }

        // 4. [ICI] Dessiner les entités (snakes, bonus, etc.)
        // ... sera ajouté plus tard

        // 5. Placeholder : cercle représentant le "joueur"
        const playerScreen = camera.worldToScreen(
            playerPositionRef.current.x,
            playerPositionRef.current.y
        );
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(playerScreen.x, playerScreen.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // 6. Debug info
        if (debug || CONFIG.DEBUG) {
            drawDebugInfo(ctx, camera, deltaTime);
        }

    }, [ctx, isPaused, gameState, fill, drawGrid, drawOrigin, drawDebugInfo, debug]);

    // Démarrer la boucle
    const { pause, resume } = useGameLoop(gameLoop, [ctx, gameState]);

    // Gérer la pause externe
    useEffect(() => {
        if (isPaused) {
            pause();
        } else {
            resume();
        }
    }, [isPaused, pause, resume]);

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className={`warezone ${debug ? 'warezone--debug' : ''}`}>
            <canvas
                ref={canvasRef}
                className="warezone__canvas"
            />

            {/* Overlay pour UI */}
            <div className="warezone__overlay">
                {/* HUD */}
                <div className="warezone__hud">
                    <div className="warezone__score">
                        Score: {score}
                    </div>
                </div>

                {/* Écran de pause */}
                {gameState === 'paused' && (
                    <div className="warezone__pause">
                        <h2>⏸️ PAUSE</h2>
                        <p>Appuie sur ESPACE pour continuer</p>
                    </div>
                )}

                {/* Game Over */}
                {gameState === 'gameover' && (
                    <div className="warezone__gameover">
                        <h2>💀 GAME OVER</h2>
                        <p className="score">Score final: {score}</p>
                        <button onClick={() => setGameState('playing')}>
                            Rejouer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WareZone;