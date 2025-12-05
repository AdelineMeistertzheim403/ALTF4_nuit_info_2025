/**
 * Configuration des malus du jeu
 * Logos propriétaires = effets négatifs
 */

export const MALUS = [
  {
    id: 'windows',
    name: 'Windows',
    description: 'Contrôles inversés',
    color: '#00A4EF',
    effect: 'invertControls',
    value: 1,
    duration: 5000,
    points: -10,
    sprite: 'windows.png'
  },
  {
    id: 'apple',
    name: 'Apple',
    description: 'Vitesse réduite de 50%',
    color: '#A2AAAD',
    effect: 'slowPlayer',
    value: 0.5,
    duration: 5000,
    points: -10,
    sprite: 'apple.png'
  },
  {
    id: 'oracle',
    name: 'Oracle',
    description: 'Perd 2 segments',
    color: '#F80000',
    effect: 'loseSegments',
    value: 2,
    duration: 0, // Instant
    points: -20,
    sprite: 'oracle.png'
  },
  {
    id: 'ibm',
    name: 'IBM',
    description: 'Vision réduite (fog)',
    color: '#006699',
    effect: 'fog',
    value: 200, // Rayon de vision en pixels
    duration: 5000,
    points: -10,
    sprite: 'ibm.png'
  },
  {
    id: 'nvidia',
    name: 'Nvidia',
    description: 'Lag artificiel',
    color: '#76B900',
    effect: 'inputDelay',
    value: 150, // Délai en ms
    duration: 3000,
    points: -10,
    sprite: 'nvidia.png'
  },
  {
    id: 'samsung',
    name: 'Samsung',
    description: 'Snake tourne aléatoirement',
    color: '#1428A0',
    effect: 'randomTurn',
    value: 0.5, // Fréquence des turns
    duration: 3000,
    points: -10,
    sprite: 'samsung.png'
  },
  {
    id: 'huawei',
    name: 'Huawei',
    description: 'Ne peut plus manger de bonus',
    color: '#FF0000',
    effect: 'blockBonus',
    value: 1,
    duration: 5000,
    points: -15,
    sprite: 'huawei.png'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'RAM overload - ralentit tout',
    color: '#4285F4',
    effect: 'slowAll',
    value: 0.7,
    duration: 4000,
    points: -10,
    sprite: 'chrome.png'
  }
];

// Types d'effets malus
export const MALUS_EFFECT_TYPES = {
  INVERT_CONTROLS: 'invertControls',
  SLOW_PLAYER: 'slowPlayer',
  LOSE_SEGMENTS: 'loseSegments',
  FOG: 'fog',
  INPUT_DELAY: 'inputDelay',
  RANDOM_TURN: 'randomTurn',
  BLOCK_BONUS: 'blockBonus',
  SLOW_ALL: 'slowAll'
};

// Probabilités d'apparition (total = 100)
export const MALUS_SPAWN_RATES = {
  windows: 15,
  apple: 15,
  oracle: 10,
  ibm: 15,
  nvidia: 10,
  samsung: 12,
  huawei: 10,
  chrome: 13
};

export default MALUS;