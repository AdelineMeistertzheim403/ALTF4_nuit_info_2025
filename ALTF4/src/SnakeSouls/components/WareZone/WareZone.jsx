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
import { createWorld } from './world';
import InputManager from '../../game/core/InputManager';
import { spriteLoader } from '../../game/data/wasteSprites';
import CollisionSystem from '../../game/systems/CollisionSystem';
import { EnemyManager } from '../../game/systems/EnemyManager';
import './WareZone.css';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Couleurs
    BACKGROUND_COLOR: '#0a0a0f',
    GRID_COLOR: 'rgba(255, 255, 255, 0.03)',
    GRID_SIZE: 50,  // Taille des cases de la grille

    // Déchets
    WASTE_COUNT: 20,           // Nombre de déchets sur la map
    WASTE_SIZE: 40,            // Taille des sprites de déchets
    WASTE_SPAWN_RADIUS: 1500,  // Rayon de spawn autour du joueur
    WASTE_MIN_DISTANCE: 200,   // Distance minimale de spawn (éviter de spawn trop près)
    PICKUP_DISTANCE: 35,       // Distance pour ramasser un déchet

    // Snake
    SEGMENT_SPACING: 35,       // Espacement entre les segments (augmenté pour plus d'air)
    SEGMENT_SIZE: 30,          // Taille des segments

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
    const currentSpacingRef = useRef(35); // Espacement actuel (dynamique)

    // Historique des positions pour les segments
    const positionHistoryRef = useRef([]);

    // Segments du snake (déchets ramassés)
    const segmentsRef = useRef([]); // { x, y, sprite, image }

    // Déchets sur la map
    const wastesRef = useRef([]); // { x, y, sprite, image }
    const wastesInitializedRef = useRef(false);

    // Monde (sol avec textures)
    const worldRef = useRef(null);
    const worldInitializedRef = useRef(false);

    // Ennemis
    const enemyManagerRef = useRef(new EnemyManager({
        maxEnemies: 3,
        spawnInterval: 8,
        initialDelay: 5,
        spawnRadius: 800,
        minSpawnDistance: 400
    }));

    // ---- State ----
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // 'playing' | 'paused' | 'gameover'
    const [worldReady, setWorldReady] = useState(false);

    // ============================================
    // INITIALISATION DES DÉCHETS
    // ============================================
    const spawnWasteAroundPlayer = useCallback((centerX, centerY) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = CONFIG.WASTE_MIN_DISTANCE + Math.random() * (CONFIG.WASTE_SPAWN_RADIUS - CONFIG.WASTE_MIN_DISTANCE);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const spriteData = spriteLoader.getRandomSprite();
        const image = new Image();
        image.src = spriteData.src;

        return { x, y, spriteData, image };
    }, []);

    const spawnWastes = useCallback(async () => {
        // Charger tous les sprites
        await spriteLoader.loadAll();

        const wastes = [];
        const centerX = playerPositionRef.current.x;
        const centerY = playerPositionRef.current.y;

        for (let i = 0; i < CONFIG.WASTE_COUNT; i++) {
            wastes.push(spawnWasteAroundPlayer(centerX, centerY));
        }
        wastesRef.current = wastes;
    }, [spawnWasteAroundPlayer]);

    // ============================================
    // INITIALISATION DU MONDE (textures de sol)
    // ============================================
    useEffect(() => {
        if (worldInitializedRef.current) return;
        worldInitializedRef.current = true;

        const initWorld = async () => {
            try {
                const world = await createWorld({ tileSize: 2048, seed: 42 });
                worldRef.current = world;
                setWorldReady(true);
                console.log('[WareZone] World initialized with textures');
            } catch (error) {
                console.error('[WareZone] Failed to initialize world:', error);
            }
        };

        initWorld();
    }, []);

    // ============================================
    // INITIALISATION
    // ============================================
    useEffect(() => {
        // Créer l'InputManager une seule fois
        if (!inputRef.current) {
            inputRef.current = new InputManager();
        }

        // Spawner les déchets une seule fois
        if (!wastesInitializedRef.current) {
            spawnWastes();
            wastesInitializedRef.current = true;
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
    }, [dimensions, spawnWastes]);

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
            `Wastes: ${wastesRef.current.length}`,
            `Segments: ${segmentsRef.current.length}`,
            `Enemies: ${enemyManagerRef.current.enemies.length}`,
        ];

        lines.forEach((line, i) => {
            ctx.fillText(line, 10, dimensions.height - 75 + (i * 15));
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
        let targetSpacing = CONFIG.SEGMENT_SPACING; // Espacement cible
        
        if (input && input.isKeyPressed('ArrowUp')) {
            currentSpeed = 250; // Accélérer
            targetSpacing = CONFIG.SEGMENT_SPACING * 1.3; // Augmenter l'espacement de 30%
        } else if (input && input.isKeyPressed('ArrowDown')) {
            currentSpeed = 80; // Ralentir
            targetSpacing = CONFIG.SEGMENT_SPACING * 0.8; // Réduire légèrement l'espacement
        }

        // Interpolation douce de l'espacement (lerp)
        const lerpSpeed = 5; // Vitesse de transition (plus grand = plus rapide)
        currentSpacingRef.current += (targetSpacing - currentSpacingRef.current) * lerpSpeed * deltaTime;

        // Déplacer le joueur dans la direction de l'angle
        playerPositionRef.current.x += Math.cos(playerAngleRef.current) * currentSpeed * deltaTime;
        playerPositionRef.current.y += Math.sin(playerAngleRef.current) * currentSpeed * deltaTime;

        // Sauvegarder la position dans l'historique (pour les segments)
        positionHistoryRef.current.unshift({
            x: playerPositionRef.current.x,
            y: playerPositionRef.current.y,
            angle: playerAngleRef.current
        });

        // Limiter la taille de l'historique basée sur l'espacement dynamique
        const maxHistory = Math.ceil((segmentsRef.current.length + 1) * currentSpacingRef.current * 1.5) + 100;
        if (positionHistoryRef.current.length > maxHistory) {
            positionHistoryRef.current.pop();
        }

        // ---- COLLISION AVEC LES DÉCHETS ----
        const playerPos = { x: playerPositionRef.current.x, y: playerPositionRef.current.y };
        
        const { pickedWastes, remainingWastes } = CollisionSystem.checkWasteCollision(
            playerPos,
            wastesRef.current,
            CONFIG.PICKUP_DISTANCE
        );

        // Traiter les déchets ramassés
        pickedWastes.forEach(waste => {
            // Ajouter comme segment
            segmentsRef.current.push({
                spriteData: waste.spriteData,
                image: waste.image
            });

            // Mettre à jour le score
            setTimeout(() => {
                setScore(prev => {
                    const newScore = prev + 10;
                    if (onScoreChange) onScoreChange(newScore);
                    return newScore;
                });
            }, 0);

            // Spawner un nouveau déchet autour du joueur
            const newWaste = spawnWasteAroundPlayer(
                playerPositionRef.current.x,
                playerPositionRef.current.y
            );
            wastesRef.current.push(newWaste);
        });

        wastesRef.current = remainingWastes;

        // ---- REPOSITIONNER LES DÉCHETS TROP LOIN ----
        // Vérifier si des déchets sont trop loin du joueur et les repositionner
        wastesRef.current.forEach(waste => {
            const dx = waste.x - playerPos.x;
            const dy = waste.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Si le déchet est hors du rayon de spawn, le repositionner
            if (distance > CONFIG.WASTE_SPAWN_RADIUS) {
                const newWaste = spawnWasteAroundPlayer(playerPos.x, playerPos.y);
                waste.x = newWaste.x;
                waste.y = newWaste.y;
                waste.spriteData = newWaste.spriteData;
                waste.image = newWaste.image;
            }
        });

        // ---- COLLISION AVEC SOI-MÊME ----
        const collisionIndex = CollisionSystem.checkSelfCollision(
            playerPos,
            segmentsRef.current,
            positionHistoryRef.current,
            currentSpacingRef.current,
            CONFIG.SEGMENT_SIZE
        );

        if (collisionIndex !== null) {
            // Couper le serpent à cet endroit
            const segmentsLost = segmentsRef.current.length - collisionIndex;
            segmentsRef.current = segmentsRef.current.slice(0, collisionIndex);

            // Soustraire les points (10 points par segment perdu)
            const pointsLost = segmentsLost * 10;

            setTimeout(() => {
                setScore(prev => {
                    const newScore = Math.max(0, prev - pointsLost);
                    if (onScoreChange) onScoreChange(newScore);
                    return newScore;
                });
            }, 0);
        }

        // ---- MISE À JOUR DES ENNEMIS ----
        const enemyManager = enemyManagerRef.current;
        const gameStateForEnemies = {
            wastes: wastesRef.current,
            playerPos: {
                x: playerPositionRef.current.x,
                y: playerPositionRef.current.y,
                angle: playerAngleRef.current
            },
            playerSegments: segmentsRef.current
        };

        enemyManager.update(deltaTime, gameStateForEnemies);

        // Les ennemis peuvent avoir mangé des déchets, mettre à jour la référence
        wastesRef.current = gameStateForEnemies.wastes;

        // Respawn les déchets mangés par les ennemis
        while (wastesRef.current.length < CONFIG.WASTE_COUNT) {
            const newWaste = spawnWasteAroundPlayer(playerPos.x, playerPos.y);
            wastesRef.current.push(newWaste);
        }

        // ---- COLLISION JOUEUR VS ENNEMIS ----
        const enemyCollision = enemyManager.checkPlayerCollision(
            playerPos,
            segmentsRef.current,
            positionHistoryRef.current,
            currentSpacingRef.current
        );

        if (enemyCollision) {
            // Le joueur a touché un ennemi - perdre des points
            setTimeout(() => {
                setScore(prev => {
                    const newScore = Math.max(0, prev - 50);
                    if (onScoreChange) onScoreChange(newScore);
                    return newScore;
                });
            }, 0);
        }

        // Mettre à jour la caméra
        camera.update();

        // ---- RENDER ----

        // 1. Fond
        fill(CONFIG.BACKGROUND_COLOR);

        // 2. Sol avec textures (ou grille de fallback)
        if (worldRef.current) {
            worldRef.current.render(ctx, camera);
        } else {
            drawGrid(ctx, camera);
        }

        // 3. Origine (debug)
        if (debug || CONFIG.DEBUG) {
            drawOrigin(ctx, camera);
        }

        // 4. Dessiner les déchets sur la map
        wastesRef.current.forEach(waste => {
            if (camera.isVisible(waste.x, waste.y, CONFIG.WASTE_SIZE)) {
                const screenPos = camera.worldToScreen(waste.x, waste.y);
                if (waste.image.complete) {
                    const sd = waste.spriteData;
                    if (sd.type === 'spritesheet') {
                        // Découper depuis la spritesheet
                        ctx.drawImage(
                            waste.image,
                            sd.x, sd.y, sd.w, sd.h,  // Source (découpe)
                            screenPos.x - CONFIG.WASTE_SIZE / 2,
                            screenPos.y - CONFIG.WASTE_SIZE / 2,
                            CONFIG.WASTE_SIZE,
                            CONFIG.WASTE_SIZE
                        );
                    } else {
                        // Image complète
                        ctx.drawImage(
                            waste.image,
                            screenPos.x - CONFIG.WASTE_SIZE / 2,
                            screenPos.y - CONFIG.WASTE_SIZE / 2,
                            CONFIG.WASTE_SIZE,
                            CONFIG.WASTE_SIZE
                        );
                    }
                }
            }
        });

        // 5. Dessiner les ennemis
        enemyManagerRef.current.render(ctx, camera);

        // 6. Dessiner les segments du snake (queue)
        segmentsRef.current.forEach((segment, index) => {
            // Calculer la position du segment en parcourant l'historique
            // en utilisant l'espacement dynamique actuel
            let distanceNeeded = (index + 1) * currentSpacingRef.current;
            let accumulatedDistance = 0;
            let pos = null;

            for (let i = 1; i < positionHistoryRef.current.length; i++) {
                const prev = positionHistoryRef.current[i - 1];
                const curr = positionHistoryRef.current[i];
                
                const dx = curr.x - prev.x;
                const dy = curr.y - prev.y;
                const segmentDist = Math.sqrt(dx * dx + dy * dy);
                
                accumulatedDistance += segmentDist;
                
                if (accumulatedDistance >= distanceNeeded) {
                    pos = curr;
                    break;
                }
            }

            if (!pos && positionHistoryRef.current.length > 0) {
                pos = positionHistoryRef.current[positionHistoryRef.current.length - 1];
            }

            if (pos && segment.image.complete) {
                const screenPos = camera.worldToScreen(pos.x, pos.y);
                const sd = segment.spriteData;
                if (sd.type === 'spritesheet') {
                    // Découper depuis la spritesheet
                    ctx.drawImage(
                        segment.image,
                        sd.x, sd.y, sd.w, sd.h,
                        screenPos.x - CONFIG.SEGMENT_SIZE / 2,
                        screenPos.y - CONFIG.SEGMENT_SIZE / 2,
                        CONFIG.SEGMENT_SIZE,
                        CONFIG.SEGMENT_SIZE
                    );
                } else {
                    // Image complète
                    ctx.drawImage(
                        segment.image,
                        screenPos.x - CONFIG.SEGMENT_SIZE / 2,
                        screenPos.y - CONFIG.SEGMENT_SIZE / 2,
                        CONFIG.SEGMENT_SIZE,
                        CONFIG.SEGMENT_SIZE
                    );
                }
            }
        });

        // 6. Dessiner la tête du snake (triangle)
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

        // 7. Debug info
        if (debug || CONFIG.DEBUG) {
            drawDebugInfo(ctx, camera, deltaTime);
        }

    }, [ctx, isPaused, gameState, fill, drawGrid, drawOrigin, drawDebugInfo, debug, onScoreChange, spawnWasteAroundPlayer]);

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