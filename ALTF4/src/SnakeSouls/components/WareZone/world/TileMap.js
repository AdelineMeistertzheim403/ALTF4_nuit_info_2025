/**
 * TileMap.js
 * 
 * Gère une grille infinie de tuiles générées procéduralement.
 * 
 * Concepts clés :
 * - Génération à la demande : on ne crée que les tuiles visibles
 * - Cache : les tuiles générées sont gardées en mémoire
 * - Seed-based : même position = même tuile (déterministe)
 * - Chunking : le monde est divisé en "chunks" pour optimiser
 * 
 * Pourquoi c'est important ?
 * - Monde infini sans limite de mémoire
 * - Cohérence : revenir à un endroit = même sol
 * - Performance : on ne dessine que le visible
 */

import { TileSet } from './TileSet.js';

export class TileMap {
  /**
   * @param {TileSet} tileSet - Collection de textures
   * @param {Object} options - Configuration
   */
  constructor(tileSet, options = {}) {
    this.tileSet = tileSet;
    
    // Configuration
    this.tileSize = options.tileSize || 256;  // Taille d'une tuile en pixels
    this.seed = options.seed || 12345;         // Seed pour la génération aléatoire
    
    // Cache des tuiles générées : Map<"x,y", TileData>
    this.cache = new Map();
    
    // Limite du cache pour éviter les fuites mémoire
    this.maxCacheSize = options.maxCacheSize || 500;
  }

  /**
   * Génère un nombre pseudo-aléatoire basé sur la position
   * Même position + même seed = même résultat (déterministe)
   * 
   * @param {number} x - Position X de la tuile
   * @param {number} y - Position Y de la tuile  
   * @returns {number} - Nombre entre 0 et 1
   */
  seededRandom(x, y) {
    // Algorithme simple de hash pour générer un nombre pseudo-aléatoire
    // basé sur la position et le seed
    const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
    return n - Math.floor(n);
  }

  /**
   * Génère les données d'une tuile pour une position donnée
   * 
   * @param {number} tileX - Coordonnée X de la tuile (pas en pixels)
   * @param {number} tileY - Coordonnée Y de la tuile
   * @returns {Object} - Données de la tuile
   */
  generateTile(tileX, tileY) {
    const key = `${tileX},${tileY}`;
    
    // Déjà en cache ?
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Génération pseudo-aléatoire basée sur la position
    const rand1 = this.seededRandom(tileX, tileY);
    const rand2 = this.seededRandom(tileX + 100, tileY + 100);
    const rand3 = this.seededRandom(tileX + 200, tileY + 200);

    // Choisir une texture
    const textureIds = this.tileSet.getTextureIds();
    const textureIndex = Math.floor(rand1 * textureIds.length);
    const textureId = textureIds[textureIndex] || textureIds[0];

    // Rotation aléatoire (0, 90, 180, 270 degrés)
    const rotationSteps = Math.floor(rand2 * 4);
    const rotation = rotationSteps * (Math.PI / 2);

    // Flip horizontal/vertical aléatoire (pour plus de variété)
    const flipX = rand3 > 0.5;
    const flipY = this.seededRandom(tileX + 300, tileY + 300) > 0.5;

    // Variation de luminosité légère (-10% à +10%)
    const brightness = 0.9 + (this.seededRandom(tileX + 400, tileY + 400) * 0.2);

    const tileData = {
      x: tileX,
      y: tileY,
      textureId,
      rotation,
      flipX,
      flipY,
      brightness,
      // Position en pixels dans le monde
      worldX: tileX * this.tileSize,
      worldY: tileY * this.tileSize,
    };

    // Ajouter au cache
    this.cache.set(key, tileData);
    
    // Nettoyer le cache si trop grand
    this.pruneCache();

    return tileData;
  }

  /**
   * Récupère les tuiles autour du joueur (grille 4x4 max pour la perf)
   *
   * @param {Object} bounds - Zone visible { left, right, top, bottom } en pixels monde
   * @returns {Array} - Liste des tuiles à dessiner
   */
  getVisibleTiles(bounds) {
    const tiles = [];

    // Centre de la vue (position du joueur)
    const centerX = (bounds.left + bounds.right) / 2;
    const centerY = (bounds.top + bounds.bottom) / 2;

    // Tuile centrale du joueur
    const centerTileX = Math.floor(centerX / this.tileSize);
    const centerTileY = Math.floor(centerY / this.tileSize);

    // Générer une grille 4x4 autour du joueur (-2 à +1 pour couvrir l'écran)
    for (let x = centerTileX - 2; x <= centerTileX + 1; x++) {
      for (let y = centerTileY - 2; y <= centerTileY + 1; y++) {
        const tile = this.generateTile(x, y);
        tiles.push(tile);
      }
    }

    return tiles;
  }

  /**
   * Nettoie le cache en supprimant les tuiles les plus anciennes
   */
  pruneCache() {
    if (this.cache.size <= this.maxCacheSize) return;

    // Supprimer les 20% les plus anciennes
    const toDelete = Math.floor(this.maxCacheSize * 0.2);
    const keys = Array.from(this.cache.keys());
    
    for (let i = 0; i < toDelete; i++) {
      this.cache.delete(keys[i]);
    }
  }

  /**
   * Vide le cache (utile pour changer de seed ou recharger)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Change le seed et régénère
   * @param {number} newSeed 
   */
  setSeed(newSeed) {
    this.seed = newSeed;
    this.clearCache();
  }
}

export default TileMap;
