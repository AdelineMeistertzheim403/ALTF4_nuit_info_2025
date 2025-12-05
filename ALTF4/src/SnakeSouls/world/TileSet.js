/**
 * TileSet.js
 * 
 * Gère une collection de textures pour le sol.
 * Charge les images et les rend disponibles pour le TileMap.
 * 
 * Pourquoi une classe séparée ?
 * - Séparation des responsabilités (chargement vs rendu)
 * - Réutilisable pour différents types de sols
 * - Gestion centralisée du cache d'images
 */

export class TileSet {
  constructor() {
    // Map des textures chargées : { id: HTMLImageElement }
    this.textures = new Map();
    
    // État de chargement
    this.loaded = false;
    this.loadPromise = null;
    
    // Taille d'une tuile (en pixels monde)
    this.tileSize = 256;
  }

  /**
   * Ajoute une texture au set
   * @param {string} id - Identifiant unique (ex: 'concrete_cracked')
   * @param {string} src - Chemin vers l'image
   */
  addTexture(id, src) {
    // Crée un placeholder, sera chargé par loadAll()
    this.textures.set(id, { src, image: null, loaded: false });
  }

  /**
   * Charge toutes les textures de manière asynchrone
   * @returns {Promise} - Résolu quand tout est chargé
   */
  async loadAll() {
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      const entries = Array.from(this.textures.entries());
      let loadedCount = 0;
      const total = entries.length;

      if (total === 0) {
        this.loaded = true;
        resolve();
        return;
      }

      entries.forEach(([id, data]) => {
        const img = new Image();
        
        img.onload = () => {
          data.image = img;
          data.loaded = true;
          loadedCount++;
          
          console.log(`[TileSet] Loaded ${id} (${loadedCount}/${total})`);
          
          if (loadedCount === total) {
            this.loaded = true;
            resolve();
          }
        };

        img.onerror = () => {
          console.error(`[TileSet] Failed to load: ${id} (${data.src})`);
          loadedCount++;
          
          if (loadedCount === total) {
            this.loaded = true;
            resolve(); // On continue même avec des erreurs
          }
        };

        img.src = data.src;
      });
    });

    return this.loadPromise;
  }

  /**
   * Récupère une texture par son ID
   * @param {string} id 
   * @returns {HTMLImageElement|null}
   */
  getTexture(id) {
    const data = this.textures.get(id);
    return data?.image || null;
  }

  /**
   * Récupère une texture aléatoire
   * @returns {{ id: string, image: HTMLImageElement }}
   */
  getRandomTexture() {
    const entries = Array.from(this.textures.entries())
      .filter(([_, data]) => data.loaded && data.image);
    
    if (entries.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * entries.length);
    const [id, data] = entries[randomIndex];
    
    return { id, image: data.image };
  }

  /**
   * Récupère tous les IDs de textures disponibles
   * @returns {string[]}
   */
  getTextureIds() {
    return Array.from(this.textures.keys());
  }

  /**
   * Vérifie si toutes les textures sont chargées
   * @returns {boolean}
   */
  isLoaded() {
    return this.loaded;
  }
}

// ============================================
// FACTORY : Crée un TileSet pré-configuré
// ============================================

/**
 * Crée un TileSet pour le sol urbain délabré
 * @param {string} basePath - Chemin vers le dossier des textures
 * @returns {TileSet}
 */
export function createUrbanFloorTileSet(basePath = '/assets/textures/floor') {
  const tileSet = new TileSet();
  
  // Ajoute les textures de sol
  // Tu remplaceras ces chemins par tes vraies textures téléchargées
  tileSet.addTexture('concrete_base', `${basePath}/concrete_base.jpg`);
  tileSet.addTexture('concrete_cracked', `${basePath}/concrete_cracked.jpg`);
  tileSet.addTexture('concrete_damaged', `${basePath}/concrete_damaged.jpg`);
  tileSet.addTexture('asphalt_worn', `${basePath}/asphalt_worn.jpg`);
  
  return tileSet;
}

export default TileSet;
