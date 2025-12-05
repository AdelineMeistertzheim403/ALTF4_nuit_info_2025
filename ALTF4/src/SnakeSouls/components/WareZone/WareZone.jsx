/**
 * WareZone.jsx
 *
 * Composant principal de la zone de jeu.
 *
 * SYSTÈME DE GAMEPLAY :
 * - Collision basée sur la taille (le plus grand gagne)
 * - Système de vies (3 vies, bonus BIRD pour +1 vie)
 * - Système de points (+X quand détruit ennemi, -50 quand perd vie)
 * - Débris récupérables quand un snake explose
 * - Difficulté progressive basée sur le temps de survie
 * - Malus (logos propriétaires = effets négatifs)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCanvas } from './hooks/useCanvas';
import { useGameLoop } from './hooks/useGameLoop';
import { Camera } from './camera/Camera';
import { createWorld } from './world';
import InputManager from '../../game/core/InputManager';
import { spriteLoader } from '../../game/data/wasteSprites';
import { bonusSpriteLoader } from '../../game/data/bonusSprites';
import { malusSpriteLoader } from '../../game/data/malusSprites';
import CollisionSystem from '../../game/systems/CollisionSystem';
import { EnemyManager } from '../../game/systems/EnemyManager';
import { DebrisSystem } from '../../game/systems/DebrisSystem';
import { DifficultySystem } from '../../game/systems/DifficultySystem';
import { MALUS_EFFECT_TYPES } from '../../game/data/malus';
import './WareZone.css';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Couleurs
    BACKGROUND_COLOR: '#0a0a0f',
    GRID_COLOR: 'rgba(255, 255, 255, 0.03)',
    GRID_SIZE: 50,

    // Déchets
    WASTE_COUNT: 20,
    WASTE_SIZE: 40,
    WASTE_SPAWN_RADIUS: 1500,
    WASTE_MIN_DISTANCE: 200,
    PICKUP_DISTANCE: 35,

    // Bonus
    BONUS_COUNT: 6,
    BONUS_SIZE: 50,
    BONUS_SPAWN_RADIUS: 1500,
    BONUS_MIN_DISTANCE: 300,
    BONUS_PICKUP_DISTANCE: 40,

    // Snake
    SEGMENT_SPACING: 35,
    SEGMENT_SIZE: 30,

    // Gameplay
    INITIAL_LIVES: 3,
    POINTS_PER_SEGMENT: 10,
    POINTS_LOST_ON_DEATH: 50,

    // Debug
    DEBUG: true,
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export function WareZone({
                             onScoreChange,
                             onGameOver,
                             onLivesChange,
                             isPaused = false,
                             debug = false,
                             children
                         }) {
    // ---- Hooks ----
    const { canvasRef, ctx, dimensions, fill } = useCanvas();

    // ---- Refs ----
    const cameraRef = useRef(new Camera());
    const inputRef = useRef(null);
    const playerPositionRef = useRef({ x: 0, y: 0 });
    const playerAngleRef = useRef(0);
    const playerSpeedRef = useRef(150);
    const currentSpacingRef = useRef(35);
    const positionHistoryRef = useRef([]);
    const segmentsRef = useRef([]);
    const wastesRef = useRef([]);
    const wastesInitializedRef = useRef(false);
    const bonusesRef = useRef([]);
    const bonusesInitializedRef = useRef(false);
    const activeBonusEffectsRef = useRef([]);
    const bonusPickupEffectsRef = useRef([]);
    const worldRef = useRef(null);
    const worldInitializedRef = useRef(false);

    // Système de débris
    const debrisSystemRef = useRef(new DebrisSystem());

    // Système de difficulté
    const difficultySystemRef = useRef(new DifficultySystem());

    // Ennemis
    const enemyManagerRef = useRef(new EnemyManager({
        maxEnemies: 3,
        spawnInterval: 10,
        initialDelay: 5,
        spawnRadius: 800,
        minSpawnDistance: 400
    }));

    // Malus
    const malusesRef = useRef([]);
    const malusesInitializedRef = useRef(false);
    const activeMalusEffectsRef = useRef([]);
    const randomTurnTimerRef = useRef(0);

    // ---- State ----
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(CONFIG.INITIAL_LIVES);
    const [gameState, setGameState] = useState('playing');
    const [worldReady, setWorldReady] = useState(false);
    const [survivalTime, setSurvivalTime] = useState('00:00');
    const [difficultyLevel, setDifficultyLevel] = useState(1);

    // Connecter le callback de destruction d'ennemi
    useEffect(() => {
        enemyManagerRef.current.onEnemyDestroyed = (enemy, segmentPositions) => {
            debrisSystemRef.current.createFromSnake(enemy, segmentPositions);
        };
    }, []);

    // ============================================
    // GESTION DES VIES ET GAME OVER
    // ============================================
    const loseLife = useCallback(() => {
        setLives(prev => {
            const newLives = prev - 1;
            if (onLivesChange) onLivesChange(newLives);

            if (newLives <= 0) {
                setGameState('gameover');
                if (onGameOver) onGameOver(score);
            }

            return newLives;
        });

        // Perdre des points
        setScore(prev => {
            const newScore = Math.max(0, prev - CONFIG.POINTS_LOST_ON_DEATH);
            if (onScoreChange) onScoreChange(newScore);
            return newScore;
        });
    }, [onLivesChange, onGameOver, onScoreChange, score]);

    const gainLife = useCallback(() => {
        setLives(prev => {
            const newLives = prev + 1;
            if (onLivesChange) onLivesChange(newLives);
            return newLives;
        });
    }, [onLivesChange]);

    // ============================================
    // SPAWN FUNCTIONS
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
        await spriteLoader.loadAll();

        const wastes = [];
        const centerX = playerPositionRef.current.x;
        const centerY = playerPositionRef.current.y;

        for (let i = 0; i < CONFIG.WASTE_COUNT; i++) {
            wastes.push(spawnWasteAroundPlayer(centerX, centerY));
        }
        wastesRef.current = wastes;
    }, [spawnWasteAroundPlayer]);

    const spawnBonusAroundPlayer = useCallback((centerX, centerY) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = CONFIG.BONUS_MIN_DISTANCE + Math.random() * (CONFIG.BONUS_SPAWN_RADIUS - CONFIG.BONUS_MIN_DISTANCE);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const spriteData = bonusSpriteLoader.getRandomSprite();
        const image = new Image();
        image.src = spriteData.src;

        return { x, y, spriteData, image, active: true };
    }, []);

    const spawnBonuses = useCallback(async () => {
        await bonusSpriteLoader.loadAll();

        const bonuses = [];
        const centerX = playerPositionRef.current.x;
        const centerY = playerPositionRef.current.y;

        for (let i = 0; i < CONFIG.BONUS_COUNT; i++) {
            bonuses.push(spawnBonusAroundPlayer(centerX, centerY));
        }
        bonusesRef.current = bonuses;
    }, [spawnBonusAroundPlayer]);

    // Spawn de malus (selon difficulté)
    const spawnMalusAroundPlayer = useCallback((centerX, centerY) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = CONFIG.BONUS_MIN_DISTANCE + Math.random() * (CONFIG.BONUS_SPAWN_RADIUS - CONFIG.BONUS_MIN_DISTANCE);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const spriteData = malusSpriteLoader.getRandomSprite();
        if (!spriteData) return null;

        const image = new Image();
        image.src = spriteData.src;

        return { x, y, spriteData, image, active: true, isMalus: true };
    }, []);

    const initMaluses = useCallback(async () => {
        await malusSpriteLoader.loadAll();
        malusesRef.current = [];
    }, []);

    // ============================================
    // INITIALISATION DU MONDE
    // ============================================
    useEffect(() => {
        if (worldInitializedRef.current) return;
        worldInitializedRef.current = true;

        const initWorld = async () => {
            try {
                const world = await createWorld({ tileSize: 2048, seed: 42 });
                worldRef.current = world;
                setWorldReady(true);
                console.log('[WareZone] World initialized');
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
        if (!inputRef.current) {
            inputRef.current = new InputManager();
        }

        if (!wastesInitializedRef.current) {
            spawnWastes();
            wastesInitializedRef.current = true;
        }

        if (!bonusesInitializedRef.current) {
            spawnBonuses();
            bonusesInitializedRef.current = true;
        }

        if (!malusesInitializedRef.current) {
            initMaluses();
            malusesInitializedRef.current = true;
        }

        // Callback quand le niveau change
        difficultySystemRef.current.onLevelChange = (newLevel, prevLevel) => {
            setDifficultyLevel(newLevel.level);
            console.log(`[WareZone] Difficulty changed: ${prevLevel?.name || 'N/A'} -> ${newLevel.name}`);
        };

        const camera = cameraRef.current;
        camera.setTarget(playerPositionRef.current);
        camera.resize(dimensions.width, dimensions.height);
        camera.centerOnTarget();

        // Notifier les vies initiales
        if (onLivesChange) onLivesChange(CONFIG.INITIAL_LIVES);

        return () => {
            if (inputRef.current) {
                inputRef.current.destroy();
                inputRef.current = null;
            }
        };
    }, [dimensions, spawnWastes, spawnBonuses, initMaluses, onLivesChange]);

    // ============================================
    // DESSIN
    // ============================================
    const drawGrid = useCallback((ctx, camera) => {
        const { GRID_SIZE, GRID_COLOR } = CONFIG;
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;

        const bounds = camera.getBounds();
        const startX = Math.floor(bounds.left / GRID_SIZE) * GRID_SIZE;
        const startY = Math.floor(bounds.top / GRID_SIZE) * GRID_SIZE;

        for (let x = startX; x <= bounds.right; x += GRID_SIZE) {
            const screenPos = camera.worldToScreen(x, 0);
            ctx.beginPath();
            ctx.moveTo(screenPos.x, 0);
            ctx.lineTo(screenPos.x, dimensions.height);
            ctx.stroke();
        }

        for (let y = startY; y <= bounds.bottom; y += GRID_SIZE) {
            const screenPos = camera.worldToScreen(0, y);
            ctx.beginPath();
            ctx.moveTo(0, screenPos.y);
            ctx.lineTo(dimensions.width, screenPos.y);
            ctx.stroke();
        }
    }, [dimensions]);

    const drawOrigin = useCallback((ctx, camera) => {
        const origin = camera.worldToScreen(0, 0);
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

        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.font = '12px monospace';
        ctx.fillText('(0, 0)', origin.x + 5, origin.y - 5);
    }, []);

    const drawDebugInfo = useCallback((ctx, camera, deltaTime) => {
        const fps = Math.round(1 / deltaTime);
        const player = playerPositionRef.current;
        const playerSize = segmentsRef.current.length + 1;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px monospace';

        const lines = [
            `FPS: ${fps}`,
            `Player Size: ${playerSize}`,
            `Lives: ${lives}`,
            `Score: ${score}`,
            `Enemies: ${enemyManagerRef.current.enemies.length}`,
            `Debris: ${debrisSystemRef.current.count}`,
            `Active Effects: ${activeBonusEffectsRef.current.map(e => e.effect).join(', ') || 'None'}`,
        ];

        lines.forEach((line, i) => {
            ctx.fillText(line, 10, dimensions.height - 90 + (i * 15));
        });
    }, [dimensions, lives, score]);

    // ============================================
    // BOUCLE DE JEU
    // ============================================
    const gameLoop = useCallback((deltaTime) => {
        if (!ctx || isPaused || gameState !== 'playing') return;

        const camera = cameraRef.current;
        const input = inputRef.current;
        const debrisSystem = debrisSystemRef.current;
        const difficultySystem = difficultySystemRef.current;
        const enemyManager = enemyManagerRef.current;
        const now = Date.now();

        // ---- UPDATE ----

        // ---- SYSTÈME DE DIFFICULTÉ ----
        difficultySystem.update(deltaTime);
        setSurvivalTime(difficultySystem.getFormattedTime());

        // Mettre à jour les paramètres des ennemis selon la difficulté
        enemyManager.updateDifficultyParams(difficultySystem.getEnemyParams());

        // ---- SPAWN MALUS (selon difficulté) ----
        if (difficultySystem.areMalusEnabled()) {
            const malusSpawnRate = difficultySystem.getMalusSpawnRate();
            const targetMalusCount = Math.floor(CONFIG.BONUS_COUNT * malusSpawnRate);

            // Spawner des malus si nécessaire
            if (malusesRef.current.length < targetMalusCount) {
                const newMalus = spawnMalusAroundPlayer(playerPositionRef.current.x, playerPositionRef.current.y);
                if (newMalus) {
                    malusesRef.current.push(newMalus);
                }
            }
        }

        // ---- EFFETS MALUS ACTIFS ----
        // Nettoyer les effets malus expirés
        activeMalusEffectsRef.current = activeMalusEffectsRef.current.filter(effect => effect.endTime > now);

        // Vérifier si les contrôles sont inversés
        const invertControls = activeMalusEffectsRef.current.some(e => e.effect === MALUS_EFFECT_TYPES.INVERT_CONTROLS);

        // Vérifier si le joueur est ralenti (malus Apple)
        const slowMalus = activeMalusEffectsRef.current.find(e => e.effect === MALUS_EFFECT_TYPES.SLOW_PLAYER);

        // Vérifier si tout est ralenti (malus Chrome)
        const slowAllMalus = activeMalusEffectsRef.current.find(e => e.effect === MALUS_EFFECT_TYPES.SLOW_ALL);

        // Vérifier si les bonus sont bloqués (malus Huawei)
        const bonusBlocked = activeMalusEffectsRef.current.some(e => e.effect === MALUS_EFFECT_TYPES.BLOCK_BONUS);

        // Effet random turn (Samsung)
        const randomTurnMalus = activeMalusEffectsRef.current.find(e => e.effect === MALUS_EFFECT_TYPES.RANDOM_TURN);
        if (randomTurnMalus) {
            randomTurnTimerRef.current += deltaTime;
            if (randomTurnTimerRef.current > randomTurnMalus.value) {
                randomTurnTimerRef.current = 0;
                // Tourner aléatoirement
                playerAngleRef.current += (Math.random() - 0.5) * Math.PI * 0.5;
            }
        }

        // Rotation (avec inversion possible)
        const rotationSpeed = 3;
        const leftKey = invertControls ? 'ArrowRight' : 'ArrowLeft';
        const rightKey = invertControls ? 'ArrowLeft' : 'ArrowRight';

        if (input && input.isKeyPressed(leftKey)) {
            playerAngleRef.current -= rotationSpeed * deltaTime;
        }
        if (input && input.isKeyPressed(rightKey)) {
            playerAngleRef.current += rotationSpeed * deltaTime;
        }

        // Vitesse
        let currentSpeed = playerSpeedRef.current;
        let targetSpacing = CONFIG.SEGMENT_SPACING;

        if (input && input.isKeyPressed('ArrowUp')) {
            currentSpeed = 250;
            targetSpacing = CONFIG.SEGMENT_SPACING * 1.3;
        } else if (input && input.isKeyPressed('ArrowDown')) {
            currentSpeed = 80;
            targetSpacing = CONFIG.SEGMENT_SPACING * 0.8;
        }

        // Bonus de vitesse
        const speedBonus = activeBonusEffectsRef.current.find(e => e.effect === 'speed');
        if (speedBonus) {
            currentSpeed *= speedBonus.value;
        }

        // Malus de vitesse (Apple - slow player)
        if (slowMalus) {
            currentSpeed *= slowMalus.value;
        }

        // Malus global (Chrome - slow all)
        if (slowAllMalus) {
            currentSpeed *= slowAllMalus.value;
        }

        // Interpolation de l'espacement
        const lerpSpeed = 5;
        currentSpacingRef.current += (targetSpacing - currentSpacingRef.current) * lerpSpeed * deltaTime;

        // Déplacer le joueur
        playerPositionRef.current.x += Math.cos(playerAngleRef.current) * currentSpeed * deltaTime;
        playerPositionRef.current.y += Math.sin(playerAngleRef.current) * currentSpeed * deltaTime;

        // Historique des positions
        positionHistoryRef.current.unshift({
            x: playerPositionRef.current.x,
            y: playerPositionRef.current.y,
            angle: playerAngleRef.current
        });

        const maxHistory = Math.ceil((segmentsRef.current.length + 1) * currentSpacingRef.current * 1.5) + 100;
        if (positionHistoryRef.current.length > maxHistory) {
            positionHistoryRef.current.pop();
        }

        const playerPos = { x: playerPositionRef.current.x, y: playerPositionRef.current.y };
        const isInvincible = activeBonusEffectsRef.current.some(e => e.effect === 'invincible');

        // ---- COLLISION AVEC LES DÉCHETS ----
        const { pickedWastes, remainingWastes } = CollisionSystem.checkWasteCollision(
            playerPos,
            wastesRef.current,
            CONFIG.PICKUP_DISTANCE
        );

        pickedWastes.forEach(waste => {
            segmentsRef.current.push({
                spriteData: waste.spriteData,
                image: waste.image
            });

            const doublePointsBonus = activeBonusEffectsRef.current.find(e => e.effect === 'doublePoints');
            const multiplier = doublePointsBonus ? doublePointsBonus.value : 1;

            setScore(prev => {
                const newScore = prev + (CONFIG.POINTS_PER_SEGMENT * multiplier);
                if (onScoreChange) onScoreChange(newScore);
                return newScore;
            });

            const newWaste = spawnWasteAroundPlayer(playerPos.x, playerPos.y);
            wastesRef.current.push(newWaste);
        });

        wastesRef.current = remainingWastes;

        // ---- COLLISION AVEC LES DÉBRIS ----
        const { picked: pickedDebris } = debrisSystem.checkCollision(playerPos.x, playerPos.y, 35);

        pickedDebris.forEach(debris => {
            // Ajouter un segment pour chaque débris ramassé
            if (debris.sprite) {
                segmentsRef.current.push({
                    spriteData: debris.spriteData || { type: 'image' },
                    image: debris.sprite
                });
            } else {
                // Créer un segment avec une image aléatoire
                const randomWaste = wastesRef.current[Math.floor(Math.random() * wastesRef.current.length)];
                if (randomWaste) {
                    segmentsRef.current.push({
                        spriteData: randomWaste.spriteData,
                        image: randomWaste.image
                    });
                }
            }

            // Points pour ramasser des débris
            setScore(prev => {
                const newScore = prev + (debris.value * 5);
                if (onScoreChange) onScoreChange(newScore);
                return newScore;
            });
        });

        // ---- EFFET MAGNETISM ----
        const magnetismBonus = activeBonusEffectsRef.current.find(e => e.effect === 'magnetism');
        if (magnetismBonus) {
            const magnetRadius = magnetismBonus.value;
            const magnetStrength = 200;

            wastesRef.current.forEach(waste => {
                const dx = waste.x - playerPos.x;
                const dy = waste.y - playerPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < magnetRadius && distance > CONFIG.PICKUP_DISTANCE) {
                    const dirX = -dx / distance;
                    const dirY = -dy / distance;
                    waste.x += dirX * magnetStrength * deltaTime;
                    waste.y += dirY * magnetStrength * deltaTime;
                }
            });

            // Attirer aussi les débris
            debrisSystem.debris.forEach(debris => {
                const dx = debris.x - playerPos.x;
                const dy = debris.y - playerPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < magnetRadius && distance > 35) {
                    const dirX = -dx / distance;
                    const dirY = -dy / distance;
                    debris.x += dirX * magnetStrength * deltaTime;
                    debris.y += dirY * magnetStrength * deltaTime;
                }
            });
        }

        // ---- REPOSITIONNER LES DÉCHETS TROP LOIN ----
        wastesRef.current.forEach(waste => {
            const dx = waste.x - playerPos.x;
            const dy = waste.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > CONFIG.WASTE_SPAWN_RADIUS) {
                const newWaste = spawnWasteAroundPlayer(playerPos.x, playerPos.y);
                waste.x = newWaste.x;
                waste.y = newWaste.y;
                waste.spriteData = newWaste.spriteData;
                waste.image = newWaste.image;
            }
        });

        // ---- COLLISION AVEC SOI-MÊME ----
        const collisionIndex = !isInvincible ? CollisionSystem.checkSelfCollision(
            playerPos,
            segmentsRef.current,
            positionHistoryRef.current,
            currentSpacingRef.current,
            CONFIG.SEGMENT_SIZE
        ) : null;

        if (collisionIndex !== null) {
            segmentsRef.current = segmentsRef.current.slice(0, collisionIndex);
        }

        // ---- COLLISION AVEC LES BONUS ----
        const { pickedWastes: pickedBonuses } = CollisionSystem.checkWasteCollision(
            playerPos,
            bonusesRef.current.filter(b => b.active),
            CONFIG.BONUS_PICKUP_DISTANCE
        );

        pickedBonuses.forEach(bonus => {
            const bonusData = bonus.spriteData.data;

            bonusPickupEffectsRef.current.push({
                x: bonus.x,
                y: bonus.y,
                color: bonusData.color,
                startTime: Date.now(),
                duration: 800
            });

            // Points du bonus
            const doublePointsBonus = activeBonusEffectsRef.current.find(e => e.effect === 'doublePoints');
            const multiplier = doublePointsBonus ? doublePointsBonus.value : 1;

            setScore(prev => {
                const newScore = prev + (bonusData.points * multiplier);
                if (onScoreChange) onScoreChange(newScore);
                return newScore;
            });

            // Effet du bonus
            if (bonusData.effect === 'extraLife') {
                // BIRD bonus - +1 vie
                gainLife();
            } else if (bonusData.duration > 0) {
                activeBonusEffectsRef.current.push({
                    effect: bonusData.effect,
                    value: bonusData.value,
                    endTime: Date.now() + bonusData.duration
                });
            } else if (bonusData.effect === 'grow') {
                for (let i = 0; i < bonusData.value; i++) {
                    const randomWaste = wastesRef.current[Math.floor(Math.random() * wastesRef.current.length)];
                    if (randomWaste) {
                        segmentsRef.current.push({
                            spriteData: randomWaste.spriteData,
                            image: randomWaste.image
                        });
                    }
                }
            }

            // Respawn bonus
            const newBonus = spawnBonusAroundPlayer(playerPos.x, playerPos.y);
            bonus.x = newBonus.x;
            bonus.y = newBonus.y;
            bonus.spriteData = newBonus.spriteData;
            bonus.image = newBonus.image;
        });

        // ---- COLLISION AVEC LES MALUS ----
        if (!bonusBlocked) {
            const { pickedWastes: pickedMaluses } = CollisionSystem.checkWasteCollision(
                playerPos,
                malusesRef.current.filter(m => m.active),
                CONFIG.BONUS_PICKUP_DISTANCE
            );

            pickedMaluses.forEach(malus => {
                const malusData = malus.spriteData.data;

                // Effet visuel de pickup (rouge)
                bonusPickupEffectsRef.current.push({
                    x: malus.x,
                    y: malus.y,
                    color: malusData.color || '#FF0000',
                    startTime: now,
                    duration: 800,
                    isMalus: true
                });

                // Points négatifs
                setScore(prev => {
                    const newScore = Math.max(0, prev + malusData.points);
                    if (onScoreChange) onScoreChange(newScore);
                    return newScore;
                });

                // Appliquer l'effet du malus
                if (malusData.effect === MALUS_EFFECT_TYPES.LOSE_SEGMENTS) {
                    // Oracle - perd des segments
                    const segmentsToLose = Math.min(malusData.value, segmentsRef.current.length);
                    for (let i = 0; i < segmentsToLose; i++) {
                        segmentsRef.current.pop();
                    }
                } else if (malusData.duration > 0) {
                    // Effet temporaire
                    activeMalusEffectsRef.current.push({
                        effect: malusData.effect,
                        value: malusData.value,
                        endTime: now + malusData.duration
                    });
                }

                // Respawn malus
                const newMalus = spawnMalusAroundPlayer(playerPos.x, playerPos.y);
                if (newMalus) {
                    malus.x = newMalus.x;
                    malus.y = newMalus.y;
                    malus.spriteData = newMalus.spriteData;
                    malus.image = newMalus.image;
                } else {
                    malus.active = false;
                }
            });
        }

        // ---- REPOSITIONNER LES MALUS TROP LOIN ----
        malusesRef.current.forEach(malus => {
            if (!malus.active) return;

            const dx = malus.x - playerPos.x;
            const dy = malus.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > CONFIG.BONUS_SPAWN_RADIUS) {
                const newMalus = spawnMalusAroundPlayer(playerPos.x, playerPos.y);
                if (newMalus) {
                    malus.x = newMalus.x;
                    malus.y = newMalus.y;
                    malus.spriteData = newMalus.spriteData;
                    malus.image = newMalus.image;
                }
            }
        });

        // Nettoyer les malus inactifs
        malusesRef.current = malusesRef.current.filter(m => m.active);

        // Nettoyer les effets expirés
        activeBonusEffectsRef.current = activeBonusEffectsRef.current.filter(effect => effect.endTime > now);
        bonusPickupEffectsRef.current = bonusPickupEffectsRef.current.filter(effect => {
            return (now - effect.startTime) < effect.duration;
        });

        // ---- REPOSITIONNER LES BONUS TROP LOIN ----
        bonusesRef.current.forEach(bonus => {
            if (!bonus.active) return;

            const dx = bonus.x - playerPos.x;
            const dy = bonus.y - playerPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > CONFIG.BONUS_SPAWN_RADIUS) {
                const newBonus = spawnBonusAroundPlayer(playerPos.x, playerPos.y);
                bonus.x = newBonus.x;
                bonus.y = newBonus.y;
                bonus.spriteData = newBonus.spriteData;
                bonus.image = newBonus.image;
            }
        });

        // ---- MISE À JOUR DES ENNEMIS ----
        const slowEnemiesBonus = activeBonusEffectsRef.current.find(e => e.effect === 'slowEnemies');
        const enemySpeedMultiplier = slowEnemiesBonus ? slowEnemiesBonus.value : 1;

        const gameStateForEnemies = {
            wastes: wastesRef.current,
            playerPos: {
                x: playerPositionRef.current.x,
                y: playerPositionRef.current.y,
                angle: playerAngleRef.current
            },
            playerSegments: segmentsRef.current,
            enemySpeedMultiplier
        };

        enemyManager.update(deltaTime, gameStateForEnemies);
        wastesRef.current = gameStateForEnemies.wastes;

        // Respawn déchets mangés par ennemis
        while (wastesRef.current.length < CONFIG.WASTE_COUNT) {
            const newWaste = spawnWasteAroundPlayer(playerPos.x, playerPos.y);
            wastesRef.current.push(newWaste);
        }

        // ---- MISE À JOUR DES DÉBRIS ----
        debrisSystem.update(deltaTime);

        // ---- COLLISION JOUEUR VS ENNEMIS (NOUVEAU SYSTÈME) ----
        if (!isInvincible) {
            // Vérifier si le joueur touche un ennemi (tête du joueur)
            const headCollision = enemyManager.checkPlayerCollision(
                playerPos,
                segmentsRef.current,
                positionHistoryRef.current,
                currentSpacingRef.current
            );

            if (headCollision) {
                if (headCollision.type === 'player_wins') {
                    // Joueur gagne - points bonus
                    setScore(prev => {
                        const newScore = prev + (headCollision.points * CONFIG.POINTS_PER_SEGMENT);
                        if (onScoreChange) onScoreChange(newScore);
                        return newScore;
                    });
                } else if (headCollision.type === 'player_loses') {
                    // Joueur perd - perte de vie
                    loseLife();
                } else if (headCollision.type === 'draw') {
                    // Égalité - perdre un segment si possible
                    if (segmentsRef.current.length > 0) {
                        segmentsRef.current.pop();
                    }
                }
            }

            // Vérifier si un ennemi touche les segments du joueur
            const segmentCollision = enemyManager.checkEnemyHitsPlayerSegments(
                segmentsRef.current,
                positionHistoryRef.current,
                currentSpacingRef.current
            );

            if (segmentCollision) {
                if (segmentCollision.type === 'player_loses') {
                    // Ennemi plus grand - couper le joueur
                    segmentsRef.current = segmentsRef.current.slice(0, segmentCollision.segmentIndex);
                } else if (segmentCollision.type === 'player_wins') {
                    // Joueur plus grand - points bonus
                    setScore(prev => {
                        const newScore = prev + (segmentCollision.points * CONFIG.POINTS_PER_SEGMENT);
                        if (onScoreChange) onScoreChange(newScore);
                        return newScore;
                    });
                }
            }
        }

        // Vérifier si le score est négatif ou nul après une perte
        if (score <= 0 && segmentsRef.current.length === 0) {
            // Pas de segments et pas de points = risque de perte de vie
            // (géré par le système de points)
        }

        // Mettre à jour la caméra
        camera.update();

        // ---- RENDER ----

        // 1. Fond
        fill(CONFIG.BACKGROUND_COLOR);

        // 2. Sol
        if (worldRef.current) {
            worldRef.current.render(ctx, camera);
        } else {
            drawGrid(ctx, camera);
        }

        // 3. Origine (debug)
        if (debug || CONFIG.DEBUG) {
            drawOrigin(ctx, camera);
        }

        // 4. Déchets
        wastesRef.current.forEach(waste => {
            if (camera.isVisible(waste.x, waste.y, CONFIG.WASTE_SIZE)) {
                const screenPos = camera.worldToScreen(waste.x, waste.y);
                if (waste.image.complete) {
                    const sd = waste.spriteData;
                    if (sd.type === 'spritesheet') {
                        ctx.drawImage(
                            waste.image,
                            sd.x, sd.y, sd.w, sd.h,
                            screenPos.x - CONFIG.WASTE_SIZE / 2,
                            screenPos.y - CONFIG.WASTE_SIZE / 2,
                            CONFIG.WASTE_SIZE,
                            CONFIG.WASTE_SIZE
                        );
                    } else {
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

        // 5. Bonus
        bonusesRef.current.forEach((bonus, index) => {
            if (!bonus.active) return;

            if (camera.isVisible(bonus.x, bonus.y, CONFIG.BONUS_SIZE)) {
                const screenPos = camera.worldToScreen(bonus.x, bonus.y);
                if (bonus.image.complete) {
                    const bonusData = bonus.spriteData.data;

                    const time = Date.now() / 1000;
                    const pulse = Math.sin(time * 3 + index) * 0.3 + 0.7;

                    ctx.shadowColor = bonusData.color;
                    ctx.shadowBlur = 25 * pulse;

                    ctx.globalAlpha = 0.15 * pulse;
                    ctx.fillStyle = bonusData.color;
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, CONFIG.BONUS_SIZE / 2 + 15 * pulse, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.globalAlpha = 0.25 * pulse;
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, CONFIG.BONUS_SIZE / 2 + 8 * pulse, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.globalAlpha = 1;

                    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    ctx.shadowBlur = 8;
                    ctx.shadowOffsetX = 3;
                    ctx.shadowOffsetY = 3;

                    const imgWidth = bonus.image.naturalWidth || bonus.image.width;
                    const imgHeight = bonus.image.naturalHeight || bonus.image.height;
                    const scale = Math.max(imgWidth, imgHeight);
                    const targetSize = CONFIG.BONUS_SIZE;

                    const drawWidth = (imgWidth / scale) * targetSize;
                    const drawHeight = (imgHeight / scale) * targetSize;

                    ctx.drawImage(
                        bonus.image,
                        screenPos.x - drawWidth / 2,
                        screenPos.y - drawHeight / 2,
                        drawWidth,
                        drawHeight
                    );

                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
            }
        });

        // 5.2 Malus (glow rouge pulsant)
        malusesRef.current.forEach((malus, index) => {
            if (!malus.active) return;

            if (camera.isVisible(malus.x, malus.y, CONFIG.BONUS_SIZE)) {
                const screenPos = camera.worldToScreen(malus.x, malus.y);
                if (malus.image.complete) {
                    const malusData = malus.spriteData.data;
                    const malusColor = malusData?.color || '#FF0000';

                    const time = Date.now() / 1000;
                    // Pulsation plus rapide et plus intense pour les malus
                    const pulse = Math.sin(time * 5 + index) * 0.4 + 0.6;

                    // Glow rouge
                    ctx.shadowColor = malusColor;
                    ctx.shadowBlur = 30 * pulse;

                    // Cercles de danger
                    ctx.globalAlpha = 0.2 * pulse;
                    ctx.fillStyle = malusColor;
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, CONFIG.BONUS_SIZE / 2 + 20 * pulse, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.globalAlpha = 0.3 * pulse;
                    ctx.beginPath();
                    ctx.arc(screenPos.x, screenPos.y, CONFIG.BONUS_SIZE / 2 + 10 * pulse, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.globalAlpha = 1;

                    // Ombre
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    ctx.shadowBlur = 8;
                    ctx.shadowOffsetX = 3;
                    ctx.shadowOffsetY = 3;

                    const imgWidth = malus.image.naturalWidth || malus.image.width;
                    const imgHeight = malus.image.naturalHeight || malus.image.height;
                    const scale = Math.max(imgWidth, imgHeight);
                    const targetSize = CONFIG.BONUS_SIZE;

                    const drawWidth = (imgWidth / scale) * targetSize;
                    const drawHeight = (imgHeight / scale) * targetSize;

                    ctx.drawImage(
                        malus.image,
                        screenPos.x - drawWidth / 2,
                        screenPos.y - drawHeight / 2,
                        drawWidth,
                        drawHeight
                    );

                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                }
            }
        });

        // 5.5. Effets de pickup
        bonusPickupEffectsRef.current.forEach(effect => {
            const elapsed = Date.now() - effect.startTime;
            const progress = elapsed / effect.duration;

            if (camera.isVisible(effect.x, effect.y, 100)) {
                const screenPos = camera.worldToScreen(effect.x, effect.y);

                const radius = 20 + (progress * 60);
                const alpha = 1 - progress;

                ctx.strokeStyle = effect.color;
                ctx.globalAlpha = alpha * 0.6;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.globalAlpha = alpha * 0.8;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenPos.x, screenPos.y, radius * 0.6, 0, Math.PI * 2);
                ctx.stroke();

                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI * 2 * i) / 8;
                    const particleRadius = radius * 1.2;
                    const px = screenPos.x + Math.cos(angle) * particleRadius;
                    const py = screenPos.y + Math.sin(angle) * particleRadius;

                    ctx.fillStyle = effect.color;
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.globalAlpha = 1;
            }
        });

        // 5.6. Effet magnetism
        const magnetismEffect = activeBonusEffectsRef.current.find(e => e.effect === 'magnetism');
        if (magnetismEffect) {
            const magnetRadius = magnetismEffect.value;
            const screenPos = camera.worldToScreen(playerPositionRef.current.x, playerPositionRef.current.y);

            const time = Date.now() / 1000;
            const pulse = Math.sin(time * 2) * 0.2 + 0.8;

            ctx.globalAlpha = 0.15 * pulse;
            ctx.strokeStyle = '#FCC133';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, magnetRadius * camera.zoom * pulse, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.globalAlpha = 1;
        }

        // 6. Débris
        debrisSystem.render(ctx, camera);

        // 7. Ennemis
        enemyManagerRef.current.render(ctx, camera);

        // 8. Segments du snake
        segmentsRef.current.forEach((segment, index) => {
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
                    ctx.drawImage(
                        segment.image,
                        sd.x, sd.y, sd.w, sd.h,
                        screenPos.x - CONFIG.SEGMENT_SIZE / 2,
                        screenPos.y - CONFIG.SEGMENT_SIZE / 2,
                        CONFIG.SEGMENT_SIZE,
                        CONFIG.SEGMENT_SIZE
                    );
                } else {
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

        // 9. Tête du snake
        const playerScreen = camera.worldToScreen(
            playerPositionRef.current.x,
            playerPositionRef.current.y
        );

        ctx.save();
        ctx.translate(playerScreen.x, playerScreen.y);
        ctx.rotate(playerAngleRef.current);

        // Couleur selon invincibilité
        ctx.fillStyle = isInvincible ? '#ffd700' : '#4ade80';

        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-10, -12);
        ctx.lineTo(-10, 12);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 10. Debug info
        if (debug || CONFIG.DEBUG) {
            drawDebugInfo(ctx, camera, deltaTime);
        }

    }, [ctx, isPaused, gameState, fill, drawGrid, drawOrigin, drawDebugInfo, debug, onScoreChange, spawnWasteAroundPlayer, spawnBonusAroundPlayer, spawnMalusAroundPlayer, loseLife, gainLife, score, lives]);

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

            <div className="warezone__overlay">
                {children}

                {gameState === 'paused' && (
                    <div className="warezone__pause">
                        <h2>PAUSE</h2>
                        <p>Appuie sur ESPACE pour continuer</p>
                    </div>
                )}
            </div>

            {/* Overlay cyberpunk Blade Runner */}
            <div className="warezone__dark-vignette"></div>
            <div className="warezone__cyberpunk-overlay">
                <div className="warezone__neon-border-top"></div>
                <div className="warezone__neon-border-bottom"></div>
                <div className="warezone__neon-border-left"></div>
                <div className="warezone__neon-border-right"></div>
            </div>
        </div>
    );
}

export default WareZone;
