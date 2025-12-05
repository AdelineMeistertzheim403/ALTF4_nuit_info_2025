/**
 * EnemyManager.js
 *
 * Gère le spawn et la mise à jour des ennemis.
 */

import { EnemySnake } from '../entities/EnemySnake.js';
import { ENEMY_TYPES, ENEMY_IDS, getRandomEnemyType } from '../data/enemySprites.js';

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
      enemy.update(deltaTime, gameState);

      // Vérifier si l'ennemi mange des déchets
      const { picked, remaining } = enemy.checkWasteCollision(gameState.wastes);
      if (picked.length > 0) {
        // Mettre à jour la liste des déchets dans gameState
        gameState.wastes = remaining;
      }
    });

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

    const enemy = new EnemySnake({
      x,
      y,
      type,
      angle: Math.random() * Math.PI * 2
    });

    // Donner quelques segments de départ (1-3)
    const initialSegments = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < initialSegments; i++) {
      enemy.addSegment();
    }

    this.enemies.push(enemy);
    console.log(`[EnemyManager] Spawned ${type.name} at (${Math.round(x)}, ${Math.round(y)})`);

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