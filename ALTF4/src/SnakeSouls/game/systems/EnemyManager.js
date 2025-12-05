/**
 * EnemyManager.js
 *
 * Gère le spawn et la mise à jour des ennemis.
 */

import { EnemySnake } from '../entities/EnemySnake.js';
import { ENEMY_TYPES, ENEMY_IDS, getRandomEnemyType } from '../data/enemySprites.js';
import { AI_PROFILES } from '../ai/EnemyAI.js';

export class EnemyManager {
  constructor(options = {}) {
    this.enemies = [];

    // Configuration
    this.maxEnemies = options.maxEnemies || 3;
    this.spawnRadius = options.spawnRadius || 800;
    this.minSpawnDistance = options.minSpawnDistance || 400;
    this.spawnInterval = options.spawnInterval || 10; // secondes
    this.initialDelay = options.initialDelay || 5; // secondes avant le premier spawn

    // Timers
    this.spawnTimer = -this.initialDelay; // Commence négatif pour le délai initial
    this.active = true;
  }

  /**
   * Met à jour tous les ennemis
   */
  update(deltaTime, gameState) {
    if (!this.active) return;

    const { wastes, playerPos, playerSegments } = gameState;

    // Timer de spawn
    this.spawnTimer += deltaTime;

    if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
      this.spawnEnemy(playerPos);
      this.spawnTimer = 0;
    }

    // Mettre à jour chaque ennemi
    this.enemies.forEach(enemy => {
      // Passer les autres ennemis pour l'évitement
      const otherEnemies = this.enemies.filter(e => e.id !== enemy.id);
      enemy.update(deltaTime, { ...gameState, otherEnemies });

      // Vérifier si l'ennemi mange des déchets
      const { picked, remaining } = enemy.checkWasteCollision(gameState.wastes);
      if (picked.length > 0) {
        // Mettre à jour la liste des déchets dans gameState
        gameState.wastes = remaining;
      }
    });

    // Vérifier les collisions entre ennemis et couper si nécessaire
    this.checkEnemyCollisions();

    // Nettoyer les ennemis morts
    this.enemies = this.enemies.filter(enemy => enemy.alive);
  }

  /**
   * Spawn un nouvel ennemi
   */
  spawnEnemy(playerPos) {
    // Position aléatoire autour du joueur
    const angle = Math.random() * Math.PI * 2;
    const distance = this.minSpawnDistance + Math.random() * (this.spawnRadius - this.minSpawnDistance);

    const x = playerPos.x + Math.cos(angle) * distance;
    const y = playerPos.y + Math.sin(angle) * distance;

    // Type aléatoire
    const type = getRandomEnemyType();

    // Récupérer le profil AI associé au type
    const aiProfile = type.aiProfile ? AI_PROFILES[type.aiProfile] : null;

    const enemy = new EnemySnake({
      x,
      y,
      type,
      angle: Math.random() * Math.PI * 2,
      aiProfile
    });

    // Donner quelques segments de départ (1-3)
    const initialSegments = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < initialSegments; i++) {
      enemy.addSegment();
    }

    this.enemies.push(enemy);
    const profileName = aiProfile ? aiProfile.name : 'Random';
    console.log(`[EnemyManager] Spawned ${type.name} (${profileName}) at (${Math.round(x)}, ${Math.round(y)})`);

    return enemy;
  }

  /**
   * Dessine tous les ennemis
   */
  render(ctx, camera) {
    this.enemies.forEach(enemy => {
      enemy.render(ctx, camera);
    });
  }

  /**
   * Vérifie les collisions entre le joueur et les ennemis
   */
  checkPlayerCollision(playerPos, playerSegments, positionHistory, segmentSpacing) {
    for (const enemy of this.enemies) {
      // Collision avec la tête de l'ennemi
      const headDist = Math.sqrt(
        Math.pow(playerPos.x - enemy.x, 2) +
        Math.pow(playerPos.y - enemy.y, 2)
      );

      if (headDist < 25) {
        return { type: 'head', enemy };
      }

      // Collision avec les segments de l'ennemi
      const segmentPositions = enemy.getSegmentPositions();
      for (let i = 0; i < segmentPositions.length; i++) {
        const seg = segmentPositions[i];
        const segDist = Math.sqrt(
          Math.pow(playerPos.x - seg.x, 2) +
          Math.pow(playerPos.y - seg.y, 2)
        );

        if (segDist < 20) {
          return { type: 'segment', enemy, segmentIndex: i };
        }
      }
    }

    return null;
  }

  /**
   * Vérifie si un ennemi touche les segments du joueur
   */
  checkEnemyHitsPlayerSegments(playerSegments, positionHistory, segmentSpacing) {
    for (const enemy of this.enemies) {
      // Pour chaque segment du joueur
      for (let i = 0; i < playerSegments.length; i++) {
        const distanceNeeded = (i + 1) * segmentSpacing;
        let accumulatedDistance = 0;
        let pos = null;

        for (let j = 1; j < positionHistory.length; j++) {
          const prev = positionHistory[j - 1];
          const curr = positionHistory[j];

          const dx = curr.x - prev.x;
          const dy = curr.y - prev.y;
          const segmentDist = Math.sqrt(dx * dx + dy * dy);

          accumulatedDistance += segmentDist;

          if (accumulatedDistance >= distanceNeeded) {
            pos = curr;
            break;
          }
        }

        if (pos) {
          const dist = Math.sqrt(
            Math.pow(enemy.x - pos.x, 2) +
            Math.pow(enemy.y - pos.y, 2)
          );

          if (dist < 25) {
            return { enemy, segmentIndex: i };
          }
        }
      }
    }

    return null;
  }

  /**
   * Vérifie les collisions entre ennemis
   */
  checkEnemyCollisions() {
    const collisionRadius = 20;

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy1 = this.enemies[i];
      if (!enemy1.alive) continue;

      for (let j = i + 1; j < this.enemies.length; j++) {
        const enemy2 = this.enemies[j];
        if (!enemy2.alive) continue;

        // Collision tête à tête
        const headDist = Math.sqrt(
          Math.pow(enemy1.x - enemy2.x, 2) +
          Math.pow(enemy1.y - enemy2.y, 2)
        );

        if (headDist < collisionRadius) {
          // Les deux perdent des segments
          if (enemy1.segments.length > 0) {
            enemy1.segments.pop();
          }
          if (enemy2.segments.length > 0) {
            enemy2.segments.pop();
          }
          continue;
        }

        // Collision tête de enemy1 avec segments de enemy2
        const segments2 = enemy2.getSegmentPositions();
        for (let k = 0; k < segments2.length; k++) {
          const seg = segments2[k];
          const dist = Math.sqrt(
            Math.pow(enemy1.x - seg.x, 2) +
            Math.pow(enemy1.y - seg.y, 2)
          );

          if (dist < collisionRadius) {
            // Couper enemy2 à cet endroit
            enemy2.segments = enemy2.segments.slice(0, k);
            break;
          }
        }

        // Collision tête de enemy2 avec segments de enemy1
        const segments1 = enemy1.getSegmentPositions();
        for (let k = 0; k < segments1.length; k++) {
          const seg = segments1[k];
          const dist = Math.sqrt(
            Math.pow(enemy2.x - seg.x, 2) +
            Math.pow(enemy2.y - seg.y, 2)
          );

          if (dist < collisionRadius) {
            // Couper enemy1 à cet endroit
            enemy1.segments = enemy1.segments.slice(0, k);
            break;
          }
        }
      }
    }
  }

  /**
   * Supprime tous les ennemis
   */
  clear() {
    this.enemies = [];
  }

  /**
   * Pause/Resume
   */
  setActive(active) {
    this.active = active;
  }
}

export default EnemyManager;