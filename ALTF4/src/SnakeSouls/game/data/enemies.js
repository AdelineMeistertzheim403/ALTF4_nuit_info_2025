// Configuration des ennemis du jeu
export const ENEMIES = [
  {
    id: 'microsoft',
    name: 'Microsoft',
    color: '#00A4EF',
    ai: 'aggressive',
    speed: 2,
    length: 8,
    points: 100,
    sprite: 'microsoft.png'
  },
  {
    id: 'apple',
    name: 'Apple',
    color: '#A2AAAD',
    ai: 'passive',
    speed: 1.5,
    length: 6,
    points: 75,
    sprite: 'apple.png'
  },
  {
    id: 'google',
    name: 'Google',
    color: '#4285F4',
    ai: 'random',
    speed: 1.8,
    length: 7,
    points: 80,
    sprite: 'google.png'
  },
  {
    id: 'oracle',
    name: 'Oracle',
    color: '#F80000',
    ai: 'aggressive',
    speed: 2.2,
    length: 10,
    points: 150,
    sprite: 'oracle.png'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    color: '#FF9900',
    ai: 'passive',
    speed: 1.6,
    length: 9,
    points: 90,
    sprite: 'amazon.png'
  }
];

// Vagues d'ennemis par niveau
export const ENEMY_WAVES = {
  1: ['apple', 'google'],
  2: ['apple', 'microsoft', 'google'],
  3: ['microsoft', 'google', 'amazon'],
  4: ['microsoft', 'oracle', 'amazon'],
  5: ['microsoft', 'oracle', 'apple', 'google', 'amazon']
};

// Configuration du spawn
export const SPAWN_CONFIG = {
  initialDelay: 5000, // Délai avant le premier spawn (ms)
  spawnInterval: 10000, // Intervalle entre les spawns (ms)
  maxEnemies: 5, // Nombre maximum d'ennemis simultanés
  spawnRate: 0.7 // Probabilité de spawn (0-1)
};
