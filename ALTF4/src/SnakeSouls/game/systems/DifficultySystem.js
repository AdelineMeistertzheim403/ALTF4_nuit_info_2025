/**
 * DifficultySystem.js
 *
 * Gère la difficulté progressive du jeu basée sur le temps de survie.
 *
 * Niveaux de difficulté :
 * - Niveau 1 (0-1min) : 3 ennemis max, spawn lent
 * - Niveau 2 (1-2min) : 5 ennemis max, spawn moyen
 * - Niveau 3 (2-3min) : 7 ennemis max, malus rares
 * - Niveau 4 (3-5min) : 10 ennemis max, malus fréquents
 * - Niveau 5 (5min+) : 15 ennemis max, chaos total
 */

export const DIFFICULTY_LEVELS = [
  {
    level: 1,
    name: 'Débutant',
    minTime: 0,
    maxTime: 60,
    maxEnemies: 3,
    spawnInterval: 10,
    enemyMinSegments: 1,
    enemyMaxSegments: 2,
    malusEnabled: false,
    malusSpawnRate: 0,
    bonusSpawnRate: 1.0,
    enemySpeedMultiplier: 0.9,
    aggressiveness: 0.3
  },
  {
    level: 2,
    name: 'Normal',
    minTime: 60,
    maxTime: 120,
    maxEnemies: 5,
    spawnInterval: 8,
    enemyMinSegments: 1,
    enemyMaxSegments: 3,
    malusEnabled: false,
    malusSpawnRate: 0,
    bonusSpawnRate: 1.1,
    enemySpeedMultiplier: 1.0,
    aggressiveness: 0.4
  },
  {
    level: 3,
    name: 'Difficile',
    minTime: 120,
    maxTime: 180,
    maxEnemies: 7,
    spawnInterval: 6,
    enemyMinSegments: 2,
    enemyMaxSegments: 4,
    malusEnabled: true,
    malusSpawnRate: 0.15,
    bonusSpawnRate: 1.2,
    enemySpeedMultiplier: 1.1,
    aggressiveness: 0.5
  },
  {
    level: 4,
    name: 'Expert',
    minTime: 180,
    maxTime: 300,
    maxEnemies: 10,
    spawnInterval: 5,
    enemyMinSegments: 2,
    enemyMaxSegments: 5,
    malusEnabled: true,
    malusSpawnRate: 0.25,
    bonusSpawnRate: 1.3,
    enemySpeedMultiplier: 1.2,
    aggressiveness: 0.6
  },
  {
    level: 5,
    name: 'Chaos',
    minTime: 300,
    maxTime: Infinity,
    maxEnemies: 15,
    spawnInterval: 3,
    enemyMinSegments: 3,
    enemyMaxSegments: 7,
    malusEnabled: true,
    malusSpawnRate: 0.35,
    bonusSpawnRate: 1.5,
    enemySpeedMultiplier: 1.3,
    aggressiveness: 0.8
  }
];

export class DifficultySystem {
  constructor() {
    this.survivalTime = 0;
    this.currentLevel = DIFFICULTY_LEVELS[0];
    this.previousLevel = null;
    this.onLevelChange = null; // Callback quand le niveau change
  }

  /**
   * Met à jour le temps de survie et la difficulté
   */
  update(deltaTime) {
    this.survivalTime += deltaTime;

    // Trouver le niveau actuel
    const newLevel = this.getLevelForTime(this.survivalTime);

    if (newLevel.level !== this.currentLevel.level) {
      this.previousLevel = this.currentLevel;
      this.currentLevel = newLevel;

      console.log(`[DifficultySystem] Level up! Now at level ${newLevel.level} (${newLevel.name})`);

      if (this.onLevelChange) {
        this.onLevelChange(newLevel, this.previousLevel);
      }
    }
  }

  /**
   * Retourne le niveau de difficulté pour un temps donné
   */
  getLevelForTime(time) {
    for (let i = DIFFICULTY_LEVELS.length - 1; i >= 0; i--) {
      if (time >= DIFFICULTY_LEVELS[i].minTime) {
        return DIFFICULTY_LEVELS[i];
      }
    }
    return DIFFICULTY_LEVELS[0];
  }

  /**
   * Retourne le temps formaté (MM:SS)
   */
  getFormattedTime() {
    const minutes = Math.floor(this.survivalTime / 60);
    const seconds = Math.floor(this.survivalTime % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Retourne le pourcentage de progression vers le prochain niveau
   */
  getProgressToNextLevel() {
    const current = this.currentLevel;
    if (current.maxTime === Infinity) return 1;

    const timeInLevel = this.survivalTime - current.minTime;
    const levelDuration = current.maxTime - current.minTime;

    return Math.min(1, timeInLevel / levelDuration);
  }

  /**
   * Vérifie si les malus sont actifs
   */
  areMalusEnabled() {
    return this.currentLevel.malusEnabled;
  }

  /**
   * Retourne la probabilité de spawn de malus
   */
  getMalusSpawnRate() {
    return this.currentLevel.malusSpawnRate;
  }

  /**
   * Retourne les paramètres actuels pour les ennemis
   */
  getEnemyParams() {
    return {
      maxEnemies: this.currentLevel.maxEnemies,
      spawnInterval: this.currentLevel.spawnInterval,
      minSegments: this.currentLevel.enemyMinSegments,
      maxSegments: this.currentLevel.enemyMaxSegments,
      speedMultiplier: this.currentLevel.enemySpeedMultiplier,
      aggressiveness: this.currentLevel.aggressiveness
    };
  }

  /**
   * Reset le système
   */
  reset() {
    this.survivalTime = 0;
    this.currentLevel = DIFFICULTY_LEVELS[0];
    this.previousLevel = null;
  }
}

export default DifficultySystem;