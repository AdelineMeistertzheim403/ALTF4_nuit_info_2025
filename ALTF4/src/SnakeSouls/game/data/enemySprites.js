/**
 * enemySprites.js
 *
 * Charge et gère les sprites des ennemis (logos des GAFAM).
 */

// Import des sprites ennemis
import appleSprite from '../../assets/sprites/enemies/apple.png';
import chromeSprite from '../../assets/sprites/enemies/chrome.png';
import huaweiSprite from '../../assets/sprites/enemies/huawei.png';
import ibmSprite from '../../assets/sprites/enemies/ibm.png';
import nvidiaSprite from '../../assets/sprites/enemies/nvidia.png';
import oracleSprite from '../../assets/sprites/enemies/oracle.png';
import samsungSprite from '../../assets/sprites/enemies/samsung.png';
import windowsSprite from '../../assets/sprites/enemies/windows.png';

// ============================================
// CONFIGURATION DE DIFFICULTÉ
// ============================================
export const ENEMY_DIFFICULTY = {
  // Vitesse de base des ennemis (modifiable selon la difficulté)
  baseSpeed: 250,
  // Variation aléatoire de la vitesse (+/- ce pourcentage)
  speedVariation: 0.3, // 30%
  // Multiplicateur de difficulté (1 = normal, 1.5 = difficile, 2 = hardcore)
  difficultyMultiplier: 1,
};

/**
 * Calcule la vitesse d'un ennemi avec variation aléatoire
 */
export function calculateEnemySpeed() {
  const { baseSpeed, speedVariation, difficultyMultiplier } = ENEMY_DIFFICULTY;
  const variation = 1 + (Math.random() * 2 - 1) * speedVariation; // Entre 0.7 et 1.3
  return baseSpeed * variation * difficultyMultiplier;
}

/**
 * Change la difficulté des ennemis
 */
export function setDifficulty(multiplier) {
  ENEMY_DIFFICULTY.difficultyMultiplier = multiplier;
}

// Configuration des ennemis avec leurs sprites
export const ENEMY_TYPES = {
  apple: {
    id: 'apple',
    name: 'Apple',
    sprite: appleSprite,
    color: '#A2AAAD',
    speed: 120,
    aggressiveness: 0.3, // 0 = passif, 1 = très agressif
  },
  chrome: {
    id: 'chrome',
    name: 'Chrome',
    sprite: chromeSprite,
    color: '#4285F4',
    speed: 140,
    aggressiveness: 0.5,
  },
  huawei: {
    id: 'huawei',
    name: 'Huawei',
    sprite: huaweiSprite,
    color: '#FF0000',
    speed: 130,
    aggressiveness: 0.6,
  },
  ibm: {
    id: 'ibm',
    name: 'IBM',
    sprite: ibmSprite,
    color: '#006699',
    speed: 100,
    aggressiveness: 0.4,
  },
  nvidia: {
    id: 'nvidia',
    name: 'Nvidia',
    sprite: nvidiaSprite,
    color: '#76B900',
    speed: 150,
    aggressiveness: 0.7,
  },
  oracle: {
    id: 'oracle',
    name: 'Oracle',
    sprite: oracleSprite,
    color: '#F80000',
    speed: 110,
    aggressiveness: 0.8,
  },
  samsung: {
    id: 'samsung',
    name: 'Samsung',
    sprite: samsungSprite,
    color: '#1428A0',
    speed: 125,
    aggressiveness: 0.5,
  },
  windows: {
    id: 'windows',
    name: 'Windows',
    sprite: windowsSprite,
    color: '#00A4EF',
    speed: 135,
    aggressiveness: 0.6,
  },
};

// Liste des IDs pour un accès facile
export const ENEMY_IDS = Object.keys(ENEMY_TYPES);

/**
 * Charge une image de sprite ennemi
 */
export function loadEnemySprite(enemyId) {
  const enemy = ENEMY_TYPES[enemyId];
  if (!enemy) return null;

  const img = new Image();
  img.src = enemy.sprite;
  return img;
}

/**
 * Récupère un type d'ennemi aléatoire
 */
export function getRandomEnemyType() {
  const randomIndex = Math.floor(Math.random() * ENEMY_IDS.length);
  return ENEMY_TYPES[ENEMY_IDS[randomIndex]];
}

export default ENEMY_TYPES;