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
  baseSpeed: 200,
  // Variation aléatoire de la vitesse (+/- ce pourcentage)
  speedVariation: 0.2, // 20%
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

// Configuration des ennemis avec leurs sprites et profils AI
export const ENEMY_TYPES = {
  apple: {
    id: 'apple',
    name: 'Apple',
    sprite: appleSprite,
    color: '#A2AAAD',
    aiProfile: 'cautious', // Apple est prudent et méthodique
  },
  chrome: {
    id: 'chrome',
    name: 'Chrome',
    sprite: chromeSprite,
    color: '#4285F4',
    aiProfile: 'opportunist', // Chrome s'adapte à tout
  },
  huawei: {
    id: 'huawei',
    name: 'Huawei',
    sprite: huaweiSprite,
    color: '#FF0000',
    aiProfile: 'aggressive', // Huawei est agressif
  },
  ibm: {
    id: 'ibm',
    name: 'IBM',
    sprite: ibmSprite,
    color: '#006699',
    aiProfile: 'hunter', // IBM focus sur la collecte
  },
  nvidia: {
    id: 'nvidia',
    name: 'Nvidia',
    sprite: nvidiaSprite,
    color: '#76B900',
    aiProfile: 'kamikaze', // Nvidia fonce dans le tas
  },
  oracle: {
    id: 'oracle',
    name: 'Oracle',
    sprite: oracleSprite,
    color: '#F80000',
    aiProfile: 'aggressive', // Oracle est très agressif
  },
  samsung: {
    id: 'samsung',
    name: 'Samsung',
    sprite: samsungSprite,
    color: '#1428A0',
    aiProfile: 'opportunist', // Samsung s'adapte
  },
  windows: {
    id: 'windows',
    name: 'Windows',
    sprite: windowsSprite,
    color: '#00A4EF',
    aiProfile: 'hunter', // Windows collecte
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