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
    duration: 6000,
    points: -15,
    sprite: 'windows.png'
  },
  {
    id: 'apple',
    name: 'Apple',
    description: 'Vitesse réduite de 60%',
    color: '#A2AAAD',
    effect: 'slowPlayer',
    value: 0.4,
    duration: 6000,
    points: -15,
    sprite: 'apple.png'
  },
  {
    id: 'oracle',
    name: 'Oracle',
    description: 'Perd 3 segments',
    color: '#F80000',
    effect: 'loseSegments',
    value: 3,
    duration: 0, // Instant
    points: -30,
    sprite: 'oracle.png'
  },
  {
    id: 'ibm',
    name: 'IBM',
    description: 'Vision réduite (fog intense)',
    color: '#006699',
    effect: 'fog',
    value: 150, // Rayon de vision réduit
    duration: 7000,
    points: -15,
    sprite: 'ibm.png'
  },
  {
    id: 'nvidia',
    name: 'Nvidia',
    description: 'Lag artificiel intense',
    color: '#76B900',
    effect: 'inputDelay',
    value: 200, // Délai en ms plus fort
    duration: 5000,
    points: -15,
    sprite: 'nvidia.png'
  },
  {
    id: 'samsung',
    name: 'Samsung',
    description: 'Snake tourne aléatoirement',
    color: '#1428A0',
    effect: 'randomTurn',
    value: 0.7, // Fréquence des turns augmentée
    duration: 5000,
    points: -15,
    sprite: 'samsung.png'
  },
  {
    id: 'huawei',
    name: 'Huawei',
    description: 'Ne peut plus manger de bonus',
    color: '#FF0000',
    effect: 'blockBonus',
    value: 1,
    duration: 8000,
    points: -20,
    sprite: 'huawei.png'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'RAM overload - ralentit tout',
    color: '#4285F4',
    effect: 'slowAll',
    value: 0.5,
    duration: 6000,
    points: -15,
    sprite: 'chrome.png'
  },
  // NOUVEAUX MALUS SOULS-LIKE
  {
    id: 'windows',
    name: 'BSOD',
    description: 'Écran bleu - paralysie totale',
    color: '#0078D7',
    effect: 'freeze',
    value: 1,
    duration: 2000, // 2 secondes paralysé
    points: -25,
    sprite: 'windows.png'
  },
  {
    id: 'oracle',
    name: 'Oracle Tax',
    description: 'Perd 50% des segments',
    color: '#F80000',
    effect: 'loseHalfSegments',
    value: 0.5,
    duration: 0, // Instant
    points: -50,
    sprite: 'oracle.png'
  },
  {
    id: 'apple',
    name: 'Walled Garden',
    description: 'Murs invisibles aléatoires',
    color: '#555555',
    effect: 'invisibleWalls',
    value: 5, // Nombre de murs
    duration: 8000,
    points: -20,
    sprite: 'apple.png'
  },
  {
    id: 'nvidia',
    name: 'Driver Crash',
    description: 'Contrôles gelés par intermittence',
    color: '#76B900',
    effect: 'controlStutter',
    value: 0.3, // Probabilité de stutter
    duration: 6000,
    points: -20,
    sprite: 'nvidia.png'
  },
  {
    id: 'ibm',
    name: 'Legacy Code',
    description: 'Vitesse inversée (avant=arrière)',
    color: '#006699',
    effect: 'reverseSpeed',
    value: 1,
    duration: 5000,
    points: -20,
    sprite: 'ibm.png'
  },
  {
    id: 'samsung',
    name: 'Battery Explosion',
    description: 'Ennemis autour de vous attirés',
    color: '#FF4500',
    effect: 'attractEnemies',
    value: 300, // Rayon d attraction
    duration: 5000,
    points: -25,
    sprite: 'samsung.png'
  },
  {
    id: 'huawei',
    name: 'Surveillance Mode',
    description: 'Position révélée - ennemis vous chassent',
    color: '#CC0000',
    effect: 'revealPosition',
    value: 1,
    duration: 8000,
    points: -30,
    sprite: 'huawei.png'
  },
  {
    id: 'chrome',
    name: 'Memory Leak',
    description: 'Perd 1 segment toutes les 2 secondes',
    color: '#DE5246',
    effect: 'bleed',
    value: 2000, // Intervalle en ms
    duration: 10000,
    points: -35,
    sprite: 'chrome.png'
  }
];

// Types d'effets malus
export const MALUS_EFFECT_TYPES = {
  INVERT_CONTROLS: 'invertControls',
  SLOW_PLAYER: 'slowPlayer',
  LOSE_SEGMENTS: 'loseSegments',
  LOSE_HALF_SEGMENTS: 'loseHalfSegments',
  FOG: 'fog',
  INPUT_DELAY: 'inputDelay',
  RANDOM_TURN: 'randomTurn',
  BLOCK_BONUS: 'blockBonus',
  SLOW_ALL: 'slowAll',
  // Nouveaux effets souls-like
  FREEZE: 'freeze',
  INVISIBLE_WALLS: 'invisibleWalls',
  CONTROL_STUTTER: 'controlStutter',
  REVERSE_SPEED: 'reverseSpeed',
  ATTRACT_ENEMIES: 'attractEnemies',
  REVEAL_POSITION: 'revealPosition',
  BLEED: 'bleed'
};

// Probabilités d'apparition - nouveaux malus ont moins de chances
export const MALUS_SPAWN_RATES = {
  windows: 12,
  apple: 12,
  oracle: 8,
  ibm: 10,
  nvidia: 8,
  samsung: 10,
  huawei: 8,
  chrome: 10,
  // Les malus souls-like sont plus rares
  freeze: 4,
  loseHalfSegments: 3,
  invisibleWalls: 4,
  controlStutter: 4,
  reverseSpeed: 3,
  attractEnemies: 2,
  revealPosition: 2,
  bleed: 2
};

export default MALUS;