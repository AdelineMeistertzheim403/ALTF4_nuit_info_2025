/**
 * EnemyManager.js
 *
 * Gère le spawn et la mise à jour des ennemis.
 *
 * NOUVEAU SYSTÈME DE COLLISION :
 * - La taille (nombre de segments) détermine qui gagne
 * - Le plus grand détruit le plus petit
 * - Le détruit explose en débris récupérables
 */

import { EnemySnake } from '../entities/EnemySnake.js';
import { ENEMY_TYPES, ENEMY_IDS, getRandomEnemyType } from '../data/enemySprites.js';
import { AI_PROFILES } from '../ai/EnemyAI.js';

export class EnemyManager {
  constructor(options = {}) {
    this.enemies = [];

    // Configuration de base
    this.maxEnemies = options.maxEnemies || 3;
    this.spawnRadius = options.spawnRadius || 800;
    this.minSpawnDistance = options.minSpawnDistance || 400;
    this.spawnInterval = options.spawnInterval || 10; // secondes
    this.initialDelay = options.initialDelay || 5; // secondes avant le premier spawn

    // Configuration dynamique (mise à jour par DifficultySystem)
    this.enemyMinSegments = options.enemyMinSegments || 1;
    this.enemyMaxSegments = options.enemyMaxSegments || 3;
    this.enemySpeedMultiplier = options.enemySpeedMultiplier || 1.0;
    this.aggressiveness = options.aggressiveness || 0.4;

    // Timers
    this.spawnTimer = -this.initialDelay; // Commence négatif pour le délai initial
    this.active = true;

    // Callback pour créer des débris (sera set par WareZone)
    this.onEnemyDestroyed = null;
  }

  /**
   * Met à jour les paramètres depuis le système de difficulté
   */
  updateDifficultyParams(params) {
    if (params.maxEnemies !== undefined) this.maxEnemies = params.maxEnemies;
    if (params.spawnInterval !== undefined) this.spawnInterval = params.spawnInterval;
    if (params.minSegments !== undefined) this.enemyMinSegments = params.minSegments;
    if (params.maxSegments !== undefined) this.enemyMaxSegments = params.maxSegments;
    if (params.speedMultiplier !== undefined) this.enemySpeedMultiplier = params.speedMultiplier;
    if (params.aggressiveness !== undefined) this.aggressiveness = params.aggressiveness;
  }

  /**
   * Retourne la taille d'un snake (nombre de segments + 1 pour la tête)
   */
  getSnakeSize(snake) {
    if (Array.isArray(snake)) {
      // C'est un tableau de segments (joueur)
      return snake.length + 1;
    }
    // C'est un EnemySnake
    return snake.segments.length + 1;
  }

  /**
   * Met à jour tous les ennemis
   */
  update(deltaTime, gameState) {
    if (!this.active) return;

    const { wastes, playerPos, playerSegments, enemySpeedMultiplier = 1 } = gameState;

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
      enemy.update(deltaTime, { ...gameState, otherEnemies }, enemySpeedMultiplier);

      // Vérifier si l'ennemi mange des déchets
      const { picked, remaining } = enemy.checkWasteCollision(gameState.wastes);
      if (picked.length > 0) {
        // Mettre à jour la liste des déchets dans gameState
        gameState.wastes = remaining;
      }
    });

    // Vérifier les collisions entre ennemis (basé sur la taille)
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

    // Donner des segments selon la difficulté
    const segmentRange = this.enemyMaxSegments - this.enemyMinSegments;
    const initialSegments = this.enemyMinSegments + Math.floor(Math.random() * (segmentRange + 1));
    for (let i = 0; i < initialSegments; i++) {
      enemy.addSegment();
    }

    // Appliquer le multiplicateur de vitesse selon la difficulté
    enemy.speed *= this.enemySpeedMultiplier;

    this.enemies.push(enemy);
    const profileName = aiProfile ? aiProfile.name : 'Random';
    console.log(`[EnemyManager] Spawned ${type.name} (${profileName}) with ${initialSegments} segments at (${Math.round(x)}, ${Math.round(y)})`);

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
   * NOUVEAU : Basé sur la taille - le plus grand gagne
   *
   * @returns {Object|null} { type: 'player_wins'|'player_loses'|'draw', enemy, points }
   */
  checkPlayerCollision(playerPos, playerSegments, positionHistory, segmentSpacing) {
    const playerSize = playerSegments.length + 1; // +1 pour la tête

    for (const enemy of this.enemies) {
      const enemySize = enemy.segments.length + 1;

      // Collision avec la tête de l'ennemi
      const headDist = Math.sqrt(
        Math.pow(playerPos.x - enemy.x, 2) +
        Math.pow(playerPos.y - enemy.y, 2)
      );

      if (headDist < 25) {
        // Collision tête à tête - comparer les tailles
        if (playerSize > enemySize) {
          // Joueur gagne - détruire l'ennemi
          const points = enemySize;
          this.destroyEnemy(enemy);
          return { type: 'player_wins', enemy, points };
        } else if (playerSize < enemySize) {
          // Joueur perd
          return { type: 'player_loses', enemy, points: 0 };
        } else {
          // Égalité - les deux perdent un segment
          return { type: 'draw', enemy, points: 0 };
        }
      }

      // Collision de la tête du joueur avec les segments de l'ennemi
      const segmentPositions = enemy.getSegmentPositions();
      for (let i = 0; i < segmentPositions.length; i++) {
        const seg = segmentPositions[i];
        const segDist = Math.sqrt(
          Math.pow(playerPos.x - seg.x, 2) +
          Math.pow(playerPos.y - seg.y, 2)
        );

        if (segDist < 20) {
          // Le joueur touche un segment ennemi
          if (playerSize > enemySize) {
            // Joueur plus grand - coupe l'ennemi à cet endroit
            const segmentsDestroyed = enemy.segments.length - i;
            this.cutEnemy(enemy, i);
            return { type: 'player_wins', enemy, points: segmentsDestroyed };
          } else {
            // Joueur plus petit ou égal - le joueur perd
            return { type: 'player_loses', enemy, points: 0 };
          }
        }
      }
    }

    return null;
  }

  /**
   * Vérifie si un ennemi touche les segments du joueur
   * @returns {Object|null} { type: 'player_wins'|'player_loses', enemy, segmentIndex }
   */
  checkEnemyHitsPlayerSegments(playerSegments, positionHistory, segmentSpacing) {
    const playerSize = playerSegments.length + 1;

    for (const enemy of this.enemies) {
      const enemySize = enemy.segments.length + 1;

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
            // L'ennemi touche un segment du joueur
            if (enemySize > playerSize) {
              // Ennemi plus grand - le joueur est coupé
              return { type: 'player_loses', enemy, segmentIndex: i };
            } else {
              // Joueur plus grand ou égal - l'ennemi est détruit
              const points = enemySize;
              this.destroyEnemy(enemy);
              return { type: 'player_wins', enemy, points };
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Vérifie les collisions entre ennemis (basé sur la taille)
   */
  checkEnemyCollisions() {
    const collisionRadius = 20;

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy1 = this.enemies[i];
      if (!enemy1.alive) continue;

      const size1 = enemy1.segments.length + 1;

      for (let j = i + 1; j < this.enemies.length; j++) {
        const enemy2 = this.enemies[j];
        if (!enemy2.alive) continue;

        const size2 = enemy2.segments.length + 1;

        // Collision tête à tête
        const headDist = Math.sqrt(
          Math.pow(enemy1.x - enemy2.x, 2) +
          Math.pow(enemy1.y - enemy2.y, 2)
        );

        if (headDist < collisionRadius) {
          if (size1 > size2) {
            // Enemy1 gagne
            this.destroyEnemy(enemy2);
          } else if (size2 > size1) {
            // Enemy2 gagne
            this.destroyEnemy(enemy1);
          } else {
            // Égalité - les deux perdent un segment
            if (enemy1.segments.length > 0) enemy1.segments.pop();
            if (enemy2.segments.length > 0) enemy2.segments.pop();
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
            if (size1 > size2) {
              // Enemy1 plus grand - coupe enemy2
              this.cutEnemy(enemy2, k);
            } else if (size1 < size2) {
              // Enemy1 plus petit - enemy1 est détruit
              this.destroyEnemy(enemy1);
            } else {
              // Égalité - enemy2 est coupé
              this.cutEnemy(enemy2, k);
            }
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
            if (size2 > size1) {
              // Enemy2 plus grand - coupe enemy1
              this.cutEnemy(enemy1, k);
            } else if (size2 < size1) {
              // Enemy2 plus petit - enemy2 est détruit
              this.destroyEnemy(enemy2);
            } else {
              // Égalité - enemy1 est coupé
              this.cutEnemy(enemy1, k);
            }
            break;
          }
        }
      }
    }
  }

  /**
   * Détruit complètement un ennemi et génère des débris
   */
  destroyEnemy(enemy) {
    if (!enemy.alive) return;

    // Récupérer les positions des segments avant destruction
    const segmentPositions = enemy.getSegmentPositions();

    // Appeler le callback pour créer les débris
    if (this.onEnemyDestroyed) {
      this.onEnemyDestroyed(enemy, segmentPositions);
    }

    // Marquer comme mort
    enemy.kill();

    console.log(`[EnemyManager] Enemy ${enemy.type.name} destroyed!`);
  }

  /**
   * Coupe un ennemi à un index donné et génère des débris pour la partie coupée
   */
  cutEnemy(enemy, segmentIndex) {
    if (!enemy.alive) return;

    // Récupérer les positions des segments qui vont être coupés
    const allPositions = enemy.getSegmentPositions();
    const cutPositions = allPositions.slice(segmentIndex);

    // Appeler le callback pour créer les débris de la partie coupée
    if (this.onEnemyDestroyed && cutPositions.length > 0) {
      // Créer un faux snake juste pour les débris
      const fakeSnake = {
        x: cutPositions[0]?.x || enemy.x,
        y: cutPositions[0]?.y || enemy.y,
        type: enemy.type,
        headImage: null
      };
      this.onEnemyDestroyed(fakeSnake, cutPositions);
    }

    // Couper les segments
    enemy.segments = enemy.segments.slice(0, segmentIndex);

    console.log(`[EnemyManager] Enemy ${enemy.type.name} cut at segment ${segmentIndex}`);
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