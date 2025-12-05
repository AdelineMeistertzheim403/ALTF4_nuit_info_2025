// Configuration des bonus du jeu
export const BONUSES = [
  {
    id: 'bird',
    name: 'Thunderbird',
    description: '+1 Vie',
    color: '#0A84FF',
    effect: 'extraLife',
    value: 1,
    duration: 0, // permanent
    points: 100,
    sprite: 'bird.png'
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    description: 'Augmente la vitesse',
    color: '#E95420',
    effect: 'speed',
    value: 1.5,
    duration: 5000, // ms
    points: 50,
    sprite: 'ubuntu.png'
  },
  {
    id: 'fedora',
    name: 'Fedora',
    description: 'Invincibilité temporaire',
    color: '#294172',
    effect: 'invincible',
    value: 1,
    duration: 3000,
    points: 75,
    sprite: 'fedora.png'
  },
  {
    id: 'debian',
    name: 'Debian',
    description: 'Double les points',
    color: '#D70751',
    effect: 'doublePoints',
    value: 2,
    duration: 10000,
    points: 100,
    sprite: 'debian.png'
  },
  {
    id: 'arch',
    name: 'Arch Linux',
    description: 'Augmente la taille',
    color: '#1793D1',
    effect: 'grow',
    value: 3,
    duration: 0, // permanent
    points: 30,
    sprite: 'arch.png'
  },
  {
    id: 'mint',
    name: 'Linux Mint',
    description: 'Ralentit les ennemis',
    color: '#87CF3E',
    effect: 'slowEnemies',
    value: 0.5,
    duration: 7000,
    points: 60,
    sprite: 'mint.png'
  },
  {
    id: 'linux',
    name: 'Linux',
    description: 'Attire les déchets',
    color: '#FCC133',
    effect: 'magnetism',
    value: 300, // Rayon d'attraction en pixels
    duration: 8000,
    points: 80,
    sprite: 'linux.png'
  }
];

// Types d'effets disponibles
export const EFFECT_TYPES = {
  SPEED: 'speed',
  INVINCIBLE: 'invincible',
  DOUBLE_POINTS: 'doublePoints',
  GROW: 'grow',
  SLOW_ENEMIES: 'slowEnemies',
  MAGNETISM: 'magnetism',
  EXTRA_LIFE: 'extraLife'
};

// Probabilités d'apparition (total = 100)
export const BONUS_SPAWN_RATES = {
  bird: 5,      // Rare - vie extra
  ubuntu: 18,
  fedora: 12,
  debian: 10,
  arch: 25,
  mint: 15,
  linux: 15
};
