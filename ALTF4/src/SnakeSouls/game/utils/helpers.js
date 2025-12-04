// Fonctions utilitaires pour le jeu

/**
 * Génère un nombre aléatoire entre min et max
 */
export const randomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Génère un entier aléatoire entre min et max (inclus)
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Limite une valeur entre min et max
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Interpolation linéaire
 */
export const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

/**
 * Conversion degrés vers radians
 */
export const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Conversion radians vers degrés
 */
export const toDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Vérifier si un point est dans un rectangle
 */
export const pointInRect = (point, rect) => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

/**
 * Vérifier si deux rectangles se chevauchent
 */
export const rectsOverlap = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

/**
 * Vérifier si deux cercles se chevauchent
 */
export const circlesOverlap = (circle1, circle2) => {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
};

/**
 * Choisir un élément aléatoire dans un tableau
 */
export const randomChoice = (array) => {
  return array[randomInt(0, array.length - 1)];
};

/**
 * Mélanger un tableau (Fisher-Yates)
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Formater le temps en MM:SS
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formater le score avec des espaces
 */
export const formatScore = (score) => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
