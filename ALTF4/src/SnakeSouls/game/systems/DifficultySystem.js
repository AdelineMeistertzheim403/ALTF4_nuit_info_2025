/**
 * DifficultySystem.js
 *
 * Gère la difficulté progressive du jeu basée sur le temps de survie.
 * 20 niveaux de difficulté avec progression exponentielle.
 */

export const DIFFICULTY_LEVELS = [
  {
    level: 1,
    name: 'Débutant',
    minTime: 0,
    maxTime: 30,
    maxEnemies: 4,
    spawnInterval: 8,
    enemyMinSegments: 1,
    enemyMaxSegments: 2,
    malusEnabled: false,
    malusSpawnRate: 0,
    bonusSpawnRate: 1.0,
    enemySpeedMultiplier: 0.8,
    aggressiveness: 0.2
  },
  {
    level: 2,
    name: 'Facile',
    minTime: 30,
    maxTime: 60,
    maxEnemies: 6,
    spawnInterval: 7,
    enemyMinSegments: 1,
    enemyMaxSegments: 2,
    malusEnabled: false,
    malusSpawnRate: 0,
    bonusSpawnRate: 1.0,
    enemySpeedMultiplier: 0.85,
    aggressiveness: 0.25
  },
  {
    level: 3,
    name: 'Normal',
    minTime: 60,
    maxTime: 90,
    maxEnemies: 8,
    spawnInterval: 6,
    enemyMinSegments: 1,
    enemyMaxSegments: 3,
    malusEnabled: false,
    malusSpawnRate: 0,
    bonusSpawnRate: 1.1,
    enemySpeedMultiplier: 0.9,
    aggressiveness: 0.3
  },
  {
    level: 4,
    name: 'Modéré',
    minTime: 90,
    maxTime: 120,
    maxEnemies: 10,
    spawnInterval: 5,
    enemyMinSegments: 1,
    enemyMaxSegments: 3,
    malusEnabled: true,
    malusSpawnRate: 0.1,
    bonusSpawnRate: 1.1,
    enemySpeedMultiplier: 0.95,
    aggressiveness: 0.35
  },
  {
    level: 5,
    name: 'Difficile',
    minTime: 120,
    maxTime: 150,
    maxEnemies: 12,
    spawnInterval: 5,
    enemyMinSegments: 2,
    enemyMaxSegments: 4,
    malusEnabled: true,
    malusSpawnRate: 0.15,
    bonusSpawnRate: 1.2,
    enemySpeedMultiplier: 1.0,
    aggressiveness: 0.4
  },
  {
    level: 6,
    name: 'Intense',
    minTime: 150,
    maxTime: 180,
    maxEnemies: 14,
    spawnInterval: 4,
    enemyMinSegments: 2,
    enemyMaxSegments: 4,
    malusEnabled: true,
    malusSpawnRate: 0.18,
    bonusSpawnRate: 1.2,
    enemySpeedMultiplier: 1.05,
    aggressiveness: 0.45
  },
  {
    level: 7,
    name: 'Expert',
    minTime: 180,
    maxTime: 210,
    maxEnemies: 16,
    spawnInterval: 4,
    enemyMinSegments: 2,
    enemyMaxSegments: 5,
    malusEnabled: true,
    malusSpawnRate: 0.2,
    bonusSpawnRate: 1.3,
    enemySpeedMultiplier: 1.1,
    aggressiveness: 0.5
  },
  {
    level: 8,
    name: 'Hardcore',
    minTime: 210,
    maxTime: 240,
    maxEnemies: 18,
    spawnInterval: 3.5,
    enemyMinSegments: 2,
    enemyMaxSegments: 5,
    malusEnabled: true,
    malusSpawnRate: 0.22,
    bonusSpawnRate: 1.3,
    enemySpeedMultiplier: 1.15,
    aggressiveness: 0.55
  },
  {
    level: 9,
    name: 'Extrême',
    minTime: 240,
    maxTime: 270,
    maxEnemies: 20,
    spawnInterval: 3,
    enemyMinSegments: 3,
    enemyMaxSegments: 5,
    malusEnabled: true,
    malusSpawnRate: 0.25,
    bonusSpawnRate: 1.4,
    enemySpeedMultiplier: 1.2,
    aggressiveness: 0.6
  },
  {
    level: 10,
    name: 'Cauchemar',
    minTime: 270,
    maxTime: 300,
    maxEnemies: 22,
    spawnInterval: 3,
    enemyMinSegments: 3,
    enemyMaxSegments: 6,
    malusEnabled: true,
    malusSpawnRate: 0.28,
    bonusSpawnRate: 1.4,
    enemySpeedMultiplier: 1.25,
    aggressiveness: 0.65
  },
  {
    level: 11,
    name: 'Infernal',
    minTime: 300,
    maxTime: 330,
    maxEnemies: 24,
    spawnInterval: 2.5,
    enemyMinSegments: 3,
    enemyMaxSegments: 6,
    malusEnabled: true,
    malusSpawnRate: 0.3,
    bonusSpawnRate: 1.5,
    enemySpeedMultiplier: 1.3,
    aggressiveness: 0.7
  },
  {
    level: 12,
    name: 'Démoniaque',
    minTime: 330,
    maxTime: 360,
    maxEnemies: 26,
    spawnInterval: 2.5,
    enemyMinSegments: 3,
    enemyMaxSegments: 7,
    malusEnabled: true,
    malusSpawnRate: 0.32,
    bonusSpawnRate: 1.5,
    enemySpeedMultiplier: 1.35,
    aggressiveness: 0.75
  },
  {
    level: 13,
    name: 'Apocalypse',
    minTime: 360,
    maxTime: 390,
    maxEnemies: 28,
    spawnInterval: 2,
    enemyMinSegments: 4,
    enemyMaxSegments: 7,
    malusEnabled: true,
    malusSpawnRate: 0.35,
    bonusSpawnRate: 1.6,
    enemySpeedMultiplier: 1.4,
    aggressiveness: 0.8
  },
  {
    level: 14,
    name: 'Armageddon',
    minTime: 390,
    maxTime: 420,
    maxEnemies: 30,
    spawnInterval: 2,
    enemyMinSegments: 4,
    enemyMaxSegments: 8,
    malusEnabled: true,
    malusSpawnRate: 0.38,
    bonusSpawnRate: 1.6,
    enemySpeedMultiplier: 1.45,
    aggressiveness: 0.85
  },
  {
    level: 15,
    name: 'Ragnarok',
    minTime: 420,
    maxTime: 450,
    maxEnemies: 32,
    spawnInterval: 1.8,
    enemyMinSegments: 4,
    enemyMaxSegments: 8,
    malusEnabled: true,
    malusSpawnRate: 0.4,
    bonusSpawnRate: 1.7,
    enemySpeedMultiplier: 1.5,
    aggressiveness: 0.88
  },
  {
    level: 16,
    name: 'Cataclysme',
    minTime: 450,
    maxTime: 480,
    maxEnemies: 34,
    spawnInterval: 1.5,
    enemyMinSegments: 5,
    enemyMaxSegments: 9,
    malusEnabled: true,
    malusSpawnRate: 0.42,
    bonusSpawnRate: 1.7,
    enemySpeedMultiplier: 1.55,
    aggressiveness: 0.9
  },
  {
    level: 17,
    name: 'Extinction',
    minTime: 480,
    maxTime: 510,
    maxEnemies: 36,
    spawnInterval: 1.5,
    enemyMinSegments: 5,
    enemyMaxSegments: 9,
    malusEnabled: true,
    malusSpawnRate: 0.45,
    bonusSpawnRate: 1.8,
    enemySpeedMultiplier: 1.6,
    aggressiveness: 0.92
  },
  {
    level: 18,
    name: 'Néant',
    minTime: 510,
    maxTime: 540,
    maxEnemies: 38,
    spawnInterval: 1.2,
    enemyMinSegments: 5,
    enemyMaxSegments: 10,
    malusEnabled: true,
    malusSpawnRate: 0.48,
    bonusSpawnRate: 1.8,
    enemySpeedMultiplier: 1.65,
    aggressiveness: 0.94
  },
  {
    level: 19,
    name: 'Oblivion',
    minTime: 540,
    maxTime: 600,
    maxEnemies: 40,
    spawnInterval: 1,
    enemyMinSegments: 6,
    enemyMaxSegments: 10,
    malusEnabled: true,
    malusSpawnRate: 0.5,
    bonusSpawnRate: 2.0,
    enemySpeedMultiplier: 1.7,
    aggressiveness: 0.96
  },
  {
    level: 20,
    name: 'CHAOS TOTAL',
    minTime: 600,
    maxTime: Infinity,
    maxEnemies: 50,
    spawnInterval: 0.8,
    enemyMinSegments: 6,
    enemyMaxSegments: 12,
    malusEnabled: true,
    malusSpawnRate: 0.55,
    bonusSpawnRate: 2.0,
    enemySpeedMultiplier: 1.8,
    aggressiveness: 1.0
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