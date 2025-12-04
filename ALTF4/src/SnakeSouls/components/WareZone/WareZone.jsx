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
import InputManager from '../../game/core/InputManager';
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
                             debug = false,
                             children
                         }) {
    // ---- Hooks ----
    const { canvasRef, ctx, dimensions, fill } = useCanvas();

    // ---- Refs (persistantes entre les renders) ----
    const cameraRef = useRef(new Camera());
    const inputRef = useRef(null);
    const playerPositionRef = useRef({ x: 0, y: 0 });
    const playerAngleRef = useRef(0); // Angle en radians
    const playerSpeedRef = useRef(150); // Pixels par seconde

    // ---- State ----
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // 'playing' | 'paused' | 'gameover'

    // ============================================
    // INITIALISATION
    // ============================================
    useEffect(() => {
        // Créer l'InputManager une seule fois
        if (!inputRef.current) {
            inputRef.current = new InputManager();
        }

        const camera = cameraRef.current;

        // La caméra suit la position du joueur
        camera.setTarget(playerPositionRef.current);
        camera.resize(dimensions.width, dimensions.height);
        camera.centerOnTarget();

        // Cleanup
        return () => {
            if (inputRef.current) {
                inputRef.current.destroy();
                inputRef.current = null;
            }
        };
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
        const input = inputRef.current;

        // ---- UPDATE ----

        // Rotation avec les flèches gauche/droite
        const rotationSpeed = 3; // Radians par seconde
        if (input && input.isKeyPressed('ArrowLeft')) {
            playerAngleRef.current -= rotationSpeed * deltaTime;
        }
        if (input && input.isKeyPressed('ArrowRight')) {
            playerAngleRef.current += rotationSpeed * deltaTime;
        }

        // Vitesse avec flèches haut/bas
        let currentSpeed = playerSpeedRef.current;
        if (input && input.isKeyPressed('ArrowUp')) {
            currentSpeed = 250; // Accélérer
        }
        if (input && input.isKeyPressed('ArrowDown')) {
            currentSpeed = 80; // Ralentir
        }

        // Déplacer le joueur dans la direction de l'angle
        playerPositionRef.current.x += Math.cos(playerAngleRef.current) * currentSpeed * deltaTime;
        playerPositionRef.current.y += Math.sin(playerAngleRef.current) * currentSpeed * deltaTime;

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

        // 4. Dessiner le joueur (triangle pointant dans la direction)
        const playerScreen = camera.worldToScreen(
            playerPositionRef.current.x,
            playerPositionRef.current.y
        );

        ctx.save();
        ctx.translate(playerScreen.x, playerScreen.y);
        ctx.rotate(playerAngleRef.current);

        // Triangle (tête du snake)
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.moveTo(20, 0);      // Pointe avant
        ctx.lineTo(-10, -12);   // Arrière gauche
        ctx.lineTo(-10, 12);    // Arrière droite
        ctx.closePath();
        ctx.fill();

        // Cercle central
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 5. Debug info
        if (debug || CONFIG.DEBUG) {
            drawDebugInfo(ctx, camera, deltaTime);
        }

    }, [ctx, isPaused, gameState, fill, drawGrid, drawOrigin, drawDebugInfo, debug]);

    // Démarrer la boucle
    useGameLoop({
        update: gameLoop,
        render: null,
        isRunning: !isPaused && gameState === 'playing' && ctx !== null
    });

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className={`warezone ${debug ? 'warezone--debug' : ''}`}>
            <canvas
                ref={canvasRef}
                className="warezone__canvas"
            />

            {/* Overlay pour UI (children passés par le parent) */}
            <div className="warezone__overlay">
                {children}

                {/* Écran de pause interne */}
                {gameState === 'paused' && (
                    <div className="warezone__pause">
                        <h2>PAUSE</h2>
                        <p>Appuie sur ESPACE pour continuer</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WareZone;