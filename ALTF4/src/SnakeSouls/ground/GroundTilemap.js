/**
 * GroundTilemap.js
 * 
 * Génère un sol infini avec des textures variées.
 * 
 * Principe :
 * - Le monde est divisé en "chunks" (grands carrés)
 * - Chaque chunk contient une grille de tiles
 * - Chaque tile a une texture aléatoire + rotation aléatoire
 * - Seuls les chunks visibles sont rendus (optimisation)
 * 
 * Pourquoi des chunks ?
 * - On ne peut pas stocker une map infinie en mémoire
 * - On génère les chunks à la volée quand ils deviennent visibles
 * - On les garde en cache pour ne pas les regénérer
 */

export class GroundTilemap {
  constructor(options = {}) {
    // Configuration
    this.tileSize = options.tileSize || 128;        // Taille d'une tile en pixels
    this.chunkSize = options.chunkSize || 8;        // Nombre de tiles par chunk (8x8)
    this.textures = [];                              // Images des textures
    this.texturesLoaded = false;
    
    // Cache des chunks générés
    // Clé: "chunkX,chunkY" → Valeur: données du chunk
    this.chunks = new Map();
    
    // Seed pour la génération pseudo-aléatoire (reproductible)
    this.seed = options.seed || Math.floor(Math.random() * 1000000);
  }

  /**
   * Charge les textures depuis les URLs
   * @param {string[]} urls - Liste des URLs des images
   * @returns {Promise} - Résolu quand toutes les images sont chargées
   */
  async loadTextures(urls) {
    const loadPromises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load: ${url}`));
        img.src = url;
      });
    });

    try {
      this.textures = await Promise.all(loadPromises);
      this.texturesLoaded = true;
      console.log(`✅ ${this.textures.length} textures loaded`);
    } catch (error) {
      console.error('❌ Error loading textures:', error);
      throw error;
    }
  }

  /**
   * Générateur pseudo-aléatoire basé sur la position
   * Retourne toujours la même valeur pour les mêmes coordonnées
   * 
   * @param {number} x - Coordonnée X
   * @param {number} y - Coordonnée Y
   * @returns {number} - Nombre entre 0 et 1
   */
  seededRandom(x, y) {
    // Algorithme simple de hash
    const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
    return n - Math.floor(n);
  }

  /**
   * Génère les données d'un chunk
   * 
   * @param {number} chunkX - Coordonnée X du chunk
   * @param {number} chunkY - Coordonnée Y du chunk
   * @returns {Object} - Données du chunk
   */
  generateChunk(chunkX, chunkY) {
    const tiles = [];
    
    for (let ty = 0; ty < this.chunkSize; ty++) {
      for (let tx = 0; tx < this.chunkSize; tx++) {
        // Position absolue de cette tile dans le monde
        const worldTileX = chunkX * this.chunkSize + tx;
        const worldTileY = chunkY * this.chunkSize + ty;
        
        // Utiliser le random déterministe
        const rand1 = this.seededRandom(worldTileX, worldTileY);
        const rand2 = this.seededRandom(worldTileX + 1000, worldTileY + 1000);
        
        tiles.push({
          // Index de la texture (0, 1, 2, ou 3)
          textureIndex: Math.floor(rand1 * this.textures.length),
          
          // Rotation (0, 90, 180, ou 270 degrés)
          rotation: Math.floor(rand2 * 4) * 90,
          
          // Position locale dans le chunk
          localX: tx,
          localY: ty
        });
      }
    }
    
    return {
      x: chunkX,
      y: chunkY,
      tiles
    };
  }

  /**
   * Récupère ou génère un chunk
   * 
   * @param {number} chunkX 
   * @param {number} chunkY 
   * @returns {Object} - Données du chunk
   */
  getChunk(chunkX, chunkY) {
    const key = `${chunkX},${chunkY}`;
    
    if (!this.chunks.has(key)) {
      // Génère le chunk et le met en cache
      this.chunks.set(key, this.generateChunk(chunkX, chunkY));
    }
    
    return this.chunks.get(key);
  }

  /**
   * Calcule quels chunks sont visibles
   * 
   * @param {Object} camera - La caméra (avec getBounds())
   * @returns {Array} - Liste des coordonnées de chunks visibles
   */
  getVisibleChunks(camera) {
    const bounds = camera.getBounds();
    const chunkPixelSize = this.tileSize * this.chunkSize;
    
    // Convertir les bounds en coordonnées de chunks
    const startChunkX = Math.floor(bounds.left / chunkPixelSize);
    const endChunkX = Math.floor(bounds.right / chunkPixelSize);
    const startChunkY = Math.floor(bounds.top / chunkPixelSize);
    const endChunkY = Math.floor(bounds.bottom / chunkPixelSize);
    
    const visibleChunks = [];
    
    for (let cy = startChunkY; cy <= endChunkY; cy++) {
      for (let cx = startChunkX; cx <= endChunkX; cx++) {
        visibleChunks.push({ x: cx, y: cy });
      }
    }
    
    return visibleChunks;
  }

  /**
   * Nettoie les chunks trop éloignés (gestion mémoire)
   * 
   * @param {Object} camera - La caméra
   * @param {number} margin - Nombre de chunks à garder autour du visible
   */
  cleanupChunks(camera, margin = 3) {
    const bounds = camera.getBounds();
    const chunkPixelSize = this.tileSize * this.chunkSize;
    
    const centerChunkX = Math.floor((bounds.left + bounds.right) / 2 / chunkPixelSize);
    const centerChunkY = Math.floor((bounds.top + bounds.bottom) / 2 / chunkPixelSize);
    
    // Supprimer les chunks trop loin
    for (const [key, chunk] of this.chunks) {
      const distX = Math.abs(chunk.x - centerChunkX);
      const distY = Math.abs(chunk.y - centerChunkY);
      
      if (distX > margin + 5 || distY > margin + 5) {
        this.chunks.delete(key);
      }
    }
  }

  /**
   * Dessine le sol
   * 
   * @param {CanvasRenderingContext2D} ctx - Contexte 2D
   * @param {Object} camera - La caméra
   */
  render(ctx, camera) {
    if (!this.texturesLoaded || this.textures.length === 0) {
      // Fallback : dessiner une couleur de fond
      this.renderFallback(ctx, camera);
      return;
    }

    const visibleChunks = this.getVisibleChunks(camera);
    
    for (const { x: chunkX, y: chunkY } of visibleChunks) {
      const chunk = this.getChunk(chunkX, chunkY);
      this.renderChunk(ctx, camera, chunk);
    }
  }

  /**
   * Dessine un chunk
   */
  renderChunk(ctx, camera, chunk) {
    const chunkPixelSize = this.tileSize * this.chunkSize;
    const chunkWorldX = chunk.x * chunkPixelSize;
    const chunkWorldY = chunk.y * chunkPixelSize;
    
    for (const tile of chunk.tiles) {
      // Position monde de cette tile
      const worldX = chunkWorldX + tile.localX * this.tileSize;
      const worldY = chunkWorldY + tile.localY * this.tileSize;
      
      // Convertir en position écran
      const screen = camera.worldToScreen(worldX, worldY);
      
      // Ne pas dessiner si hors écran (optimisation)
      if (screen.x + this.tileSize < 0 || screen.x > camera.width ||
          screen.y + this.tileSize < 0 || screen.y > camera.height) {
        continue;
      }
      
      // Récupérer la texture
      const texture = this.textures[tile.textureIndex];
      
      // Dessiner avec rotation
      ctx.save();
      
      // Se positionner au centre de la tile pour la rotation
      const centerX = screen.x + this.tileSize / 2;
      const centerY = screen.y + this.tileSize / 2;
      
      ctx.translate(centerX, centerY);
      ctx.rotate(tile.rotation * Math.PI / 180);
      
      // Dessiner l'image centrée
      ctx.drawImage(
        texture,
        -this.tileSize / 2,
        -this.tileSize / 2,
        this.tileSize,
        this.tileSize
      );
      
      ctx.restore();
    }
  }

  /**
   * Fallback si pas de textures : grille colorée
   */
  renderFallback(ctx, camera) {
    const bounds = camera.getBounds();
    const gridSize = this.tileSize;
    
    const startX = Math.floor(bounds.left / gridSize) * gridSize;
    const startY = Math.floor(bounds.top / gridSize) * gridSize;
    
    for (let y = startY; y <= bounds.bottom; y += gridSize) {
      for (let x = startX; x <= bounds.right; x += gridSize) {
        const screen = camera.worldToScreen(x, y);
        
        // Couleur basée sur la position (damier varié)
        const rand = this.seededRandom(x / gridSize, y / gridSize);
        const shade = 15 + rand * 10; // Entre 15 et 25
        
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade + 5})`;
        ctx.fillRect(screen.x, screen.y, gridSize, gridSize);
      }
    }
    
    // Grille subtile par-dessus
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    
    for (let x = startX; x <= bounds.right; x += gridSize) {
      const screen = camera.worldToScreen(x, 0);
      ctx.beginPath();
      ctx.moveTo(screen.x, 0);
      ctx.lineTo(screen.x, camera.height);
      ctx.stroke();
    }
    
    for (let y = startY; y <= bounds.bottom; y += gridSize) {
      const screen = camera.worldToScreen(0, y);
      ctx.beginPath();
      ctx.moveTo(0, screen.y);
      ctx.lineTo(camera.width, screen.y);
      ctx.stroke();
    }
  }
}

export default GroundTilemap;
