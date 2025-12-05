/**
 * DifficultySystem.js
 *
 * Gère la difficulté progressive du jeu basée sur le temps de survie.
 * 20 niveaux de difficulté - DIFFICULTÉ x2 + ENNEMIS x2
 */

export const DIFFICULTY_LEVELS = [
  {
    level: 1,
    name: 'Débutant',
    minTime: 0,
    maxTime: 15,
    maxEnemies: 8,
    spawnInterval: 4,
    enemyMinSegments: 1,
    enemyMaxSegments: 2,
    malusEnabled: false,
    malusSpawnRate: 0,
    bonusSpawnRate: 1.0,
    enemySpeedMultiplier: 0.9,
    aggressiveness: 0.3,
    enemyGrowthMultiplier: 1 // Croissance normale
  },
  {
    level: 2,
    name: 'Facile',
    minTime: 15,
    maxTime: 30,
    maxEnemies: 12,
    spawnInterval: 3.5,
    enemyMinSegments: 1,
    enemyMaxSegments: 3,
    malusEnabled: false,
    malusSpawnRate: 0,
    bonusSpawnRate: 1.0,
    enemySpeedMultiplier: 0.95,
    aggressiveness: 0.35,
    enemyGrowthMultiplier: 1
  },
  {
    level: 3,
    name: 'Normal',
    minTime: 30,
    maxTime: 45,
    maxEnemies: 16,
    spawnInterval: 3,
    enemyMinSegments: 1,
    enemyMaxSegments: 3,
    malusEnabled: true,
    malusSpawnRate: 0.15,
    bonusSpawnRate: 1.1,
    enemySpeedMultiplier: 1.0,
    aggressiveness: 0.4,
    enemyGrowthMultiplier: 1.5 // +1.5 segments par déchet
  },
  {
    level: 4,
    name: 'Modéré',
    minTime: 45,
    maxTime: 60,
    maxEnemies: 20,
    spawnInterval: 2.5,
    enemyMinSegments: 2,
    enemyMaxSegments: 4,
    malusEnabled: true,
    malusSpawnRate: 0.2,
    bonusSpawnRate: 1.1,
    enemySpeedMultiplier: 1.05,
    aggressiveness: 0.45,
    enemyGrowthMultiplier: 2 // +2 segments par déchet
  },
  {
    level: 5,
    name: 'Difficile',
    minTime: 60,
    maxTime: 75,
    maxEnemies: 24,
    spawnInterval: 2.5,
    enemyMinSegments: 2,
    enemyMaxSegments: 4,
    malusEnabled: true,
    malusSpawnRate: 0.25,
    bonusSpawnRate: 1.2,
    enemySpeedMultiplier: 1.1,
    aggressiveness: 0.5,
    enemyGrowthMultiplier: 2
  },
  {
    level: 6,
    name: 'Intense',
    minTime: 75,
    maxTime: 90,
    maxEnemies: 28,
    spawnInterval: 2,
    enemyMinSegments: 2,
    enemyMaxSegments: 5,
    malusEnabled: true,
    malusSpawnRate: 0.28,
    bonusSpawnRate: 1.2,
    enemySpeedMultiplier: 1.15,
    aggressiveness: 0.55,
    enemyGrowthMultiplier: 2.5 // +2.5 segments
  },
  {
    level: 7,
    name: 'Expert',
    minTime: 90,
    maxTime: 105,
    maxEnemies: 32,
    spawnInterval: 2,
    enemyMinSegments: 3,
    enemyMaxSegments: 5,
    malusEnabled: true,
    malusSpawnRate: 0.3,
    bonusSpawnRate: 1.3,
    enemySpeedMultiplier: 1.2,
    aggressiveness: 0.6,
    enemyGrowthMultiplier: 3 // +3 segments par déchet
  },
  {
    level: 8,
    name: 'Hardcore',
    minTime: 105,
    maxTime: 120,
    maxEnemies: 36,
    spawnInterval: 1.8,
    enemyMinSegments: 3,
    enemyMaxSegments: 6,
    malusEnabled: true,
    malusSpawnRate: 0.33,
    bonusSpawnRate: 1.3,
    enemySpeedMultiplier: 1.25,
    aggressiveness: 0.65,
    enemyGrowthMultiplier: 3
  },
  {
    level: 9,
    name: 'Extrême',
    minTime: 120,
    maxTime: 135,
    maxEnemies: 40,
    spawnInterval: 1.5,
    enemyMinSegments: 3,
    enemyMaxSegments: 6,
    malusEnabled: true,
    malusSpawnRate: 0.35,
    bonusSpawnRate: 1.4,
    enemySpeedMultiplier: 1.3,
    aggressiveness: 0.7,
    enemyGrowthMultiplier: 3.5 // +3.5 segments
  },
  {
    level: 10,
    name: 'Cauchemar',
    minTime: 135,
    maxTime: 150,
    maxEnemies: 44,
    spawnInterval: 1.5,
    enemyMinSegments: 4,
    enemyMaxSegments: 7,
    malusEnabled: true,
    malusSpawnRate: 0.38,
    bonusSpawnRate: 1.4,
    enemySpeedMultiplier: 1.35,
    aggressiveness: 0.75,
    enemyGrowthMultiplier: 4 // +4 segments par déchet
  },
  {
    level: 11,
    name: 'Infernal',
    minTime: 150,
    maxTime: 165,
    maxEnemies: 50,
    spawnInterval: 1.2,
    enemyMinSegments: 4,
    enemyMaxSegments: 7,
    malusEnabled: true,
    malusSpawnRate: 0.4,
    bonusSpawnRate: 1.5,
    enemySpeedMultiplier: 1.4,
    aggressiveness: 0.8,
    enemyGrowthMultiplier: 4
  },
  {
    level: 12,
    name: 'Démoniaque',
    minTime: 165,
    maxTime: 180,
    maxEnemies: 55,
    spawnInterval: 1.2,
    enemyMinSegments: 4,
    enemyMaxSegments: 8,
    malusEnabled: true,
    malusSpawnRate: 0.42,
    bonusSpawnRate: 1.5,
    enemySpeedMultiplier: 1.45,
    aggressiveness: 0.85,
    enemyGrowthMultiplier: 5 // +5 segments par déchet
  },
  {
    level: 13,
    name: 'Apocalypse',
    minTime: 180,
    maxTime: 195,
    maxEnemies: 60,
    spawnInterval: 1,
    enemyMinSegments: 5,
    enemyMaxSegments: 8,
    malusEnabled: true,
    malusSpawnRate: 0.45,
    bonusSpawnRate: 1.6,
    enemySpeedMultiplier: 1.5,
    aggressiveness: 0.88,
    enemyGrowthMultiplier: 5
  },
  {
    level: 14,
    name: 'Armageddon',
    minTime: 195,
    maxTime: 210,
    maxEnemies: 65,
    spawnInterval: 1,
    enemyMinSegments: 5,
    enemyMaxSegments: 9,
    malusEnabled: true,
    malusSpawnRate: 0.48,
    bonusSpawnRate: 1.6,
    enemySpeedMultiplier: 1.55,
    aggressiveness: 0.9,
    enemyGrowthMultiplier: 6 // +6 segments par déchet
  },
  {
    level: 15,
    name: 'Ragnarok',
    minTime: 210,
    maxTime: 225,
    maxEnemies: 70,
    spawnInterval: 0.8,
    enemyMinSegments: 5,
    enemyMaxSegments: 9,
    malusEnabled: true,
    malusSpawnRate: 0.5,
    bonusSpawnRate: 1.7,
    enemySpeedMultiplier: 1.6,
    aggressiveness: 0.92,
    enemyGrowthMultiplier: 6
  },
  {
    level: 16,
    name: 'Cataclysme',
    minTime: 225,
    maxTime: 240,
    maxEnemies: 75,
    spawnInterval: 0.8,
    enemyMinSegments: 6,
    enemyMaxSegments: 10,
    malusEnabled: true,
    malusSpawnRate: 0.52,
    bonusSpawnRate: 1.7,
    enemySpeedMultiplier: 1.65,
    aggressiveness: 0.94,
    enemyGrowthMultiplier: 7 // +7 segments par déchet
  },
  {
    level: 17,
    name: 'Extinction',
    minTime: 240,
    maxTime: 255,
    maxEnemies: 80,
    spawnInterval: 0.6,
    enemyMinSegments: 6,
    enemyMaxSegments: 10,
    malusEnabled: true,
    malusSpawnRate: 0.55,
    bonusSpawnRate: 1.8,
    enemySpeedMultiplier: 1.7,
    aggressiveness: 0.95,
    enemyGrowthMultiplier: 7
  },
  {
    level: 18,
    name: 'Néant',
    minTime: 255,
    maxTime: 270,
    maxEnemies: 85,
    spawnInterval: 0.6,
    enemyMinSegments: 6,
    enemyMaxSegments: 11,
    malusEnabled: true,
    malusSpawnRate: 0.58,
    bonusSpawnRate: 1.8,
    enemySpeedMultiplier: 1.75,
    aggressiveness: 0.96,
    enemyGrowthMultiplier: 8 // +8 segments par déchet
  },
  {
    level: 19,
    name: 'Oblivion',
    minTime: 270,
    maxTime: 300,
    maxEnemies: 90,
    spawnInterval: 0.5,
    enemyMinSegments: 7,
    enemyMaxSegments: 12,
    malusEnabled: true,
    malusSpawnRate: 0.6,
    bonusSpawnRate: 2.0,
    enemySpeedMultiplier: 1.8,
    aggressiveness: 0.98,
    enemyGrowthMultiplier: 9 // +9 segments par déchet
  },
  {
    level: 20,
    name: 'CHAOS TOTAL',
    minTime: 300,
    maxTime: Infinity,
    maxEnemies: 100,
    spawnInterval: 0.4,
    enemyMinSegments: 8,
    enemyMaxSegments: 15,
    malusEnabled: true,
    malusSpawnRate: 0.65,
    bonusSpawnRate: 2.0,
    enemySpeedMultiplier: 2.0,
    aggressiveness: 1.0,
    enemyGrowthMultiplier: 10 // +10 segments par déchet !
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
      aggressiveness: this.currentLevel.aggressiveness,
      growthMultiplier: this.currentLevel.enemyGrowthMultiplier || 1
    };
  }

  /**
   * Retourne le multiplicateur de croissance des ennemis
   */
  getEnemyGrowthMultiplier() {
    return this.currentLevel.enemyGrowthMultiplier || 1;
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
