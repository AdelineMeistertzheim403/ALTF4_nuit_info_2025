/**
 * WorldRenderer.js
 *
 * Responsable du rendu du monde (sol).
 * Dessine les tuiles visibles avec un effet naturel et organique.
 *
 * Techniques utilisées :
 * - Scatter : plusieurs passes de tuiles décalées
 * - Overlap : les tuiles se chevauchent largement
 * - Variations : taille, rotation, opacité aléatoires
 * - Feathering : dégradé sur les bords pour transitions douces (PRE-RENDERED)
 *
 * OPTIMISATIONS :
 * - Pre-render des textures avec feathering au chargement
 * - Cache des tuiles pré-rendues
 * - Réduction du nombre de layers
 */

export class WorldRenderer {
  /**
   * @param {TileMap} tileMap - Le gestionnaire de tuiles
   * @param {TileSet} tileSet - La collection de textures
   */
  constructor(tileMap, tileSet) {
    this.tileMap = tileMap;
    this.tileSet = tileSet;

    // Options de rendu
    this.debug = false;
    this.showGrid = false;

    // Paramètres pour le rendu organique (optimisés)
    this.overlap = 0.35; // 35% de chevauchement entre tuiles
    this.scatterLayers = 2; // Réduit à 2 pour la perf
    this.scatterOffset = 0.4; // Décalage max des couches

    // Cache pour les textures pré-rendues avec feathering
    this.featheredTextureCache = new Map();
    this.featherMask = null;
    this.cacheReady = false;
  }

  /**
   * Génère un nombre pseudo-aléatoire déterministe
   */
  seededRandom(x, y, offset = 0) {
    const n = Math.sin((x + offset) * 12.9898 + (y + offset) * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  /**
   * Initialise le cache des textures avec feathering
   * Appelé une seule fois quand les textures sont chargées
   */
  initFeatheredCache() {
    if (this.cacheReady) return;

    const textures = this.tileSet.getAllTextures();
    if (!textures || textures.length === 0) return;

    // Créer le masque de feathering une seule fois
    const size = 512; // Taille fixe pour le cache
    this.featherMask = this.createFeatherMask(size);

    // Pré-rendre chaque texture avec le feathering
    textures.forEach(({ id, image }) => {
      if (image && image.complete) {
        const feathered = this.createFeatheredTexture(image, size);
        this.featheredTextureCache.set(id, feathered);
      }
    });

    this.cacheReady = true;
    console.log(`[WorldRenderer] Cache initialisé avec ${this.featheredTextureCache.size} textures`);
  }

  /**
   * Crée un masque de feathering (dégradé radial)
   */
  createFeatherMask(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const centerX = size / 2;
    const centerY = size / 2;
    const innerRadius = size * 0.25;
    const outerRadius = size * 0.5;

    const gradient = ctx.createRadialGradient(
      centerX, centerY, innerRadius,
      centerX, centerY, outerRadius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return canvas;
  }

  /**
   * Crée une version pré-rendue d'une texture avec feathering
   */
  createFeatheredTexture(texture, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Dessiner la texture
    ctx.drawImage(texture, 0, 0, size, size);

    // Appliquer le masque de feathering
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(this.featherMask, 0, 0, size, size);

    return canvas;
  }

  /**
   * Dessine toutes les tuiles visibles avec effet naturel
   */
  render(ctx, camera) {
    // Vérifier que les textures sont chargées
    if (!this.tileSet.isLoaded()) {
      this.renderLoading(ctx, camera);
      return;
    }

    // Initialiser le cache si pas encore fait
    if (!this.cacheReady) {
      this.initFeatheredCache();
    }

    // Récupérer les bounds de la caméra
    const bounds = camera.getBounds();

    // Récupérer les tuiles visibles (avec marge pour le scatter)
    const margin = this.tileMap.tileSize * 0.5;
    const extendedBounds = {
      left: bounds.left - margin,
      right: bounds.right + margin,
      top: bounds.top - margin,
      bottom: bounds.bottom + margin
    };
    const tiles = this.tileMap.getVisibleTiles(extendedBounds);

    // Dessiner les couches
    for (let layer = 0; layer < this.scatterLayers; layer++) {
      tiles.forEach(tile => {
        this.renderTileOptimized(ctx, camera, tile, layer);
      });
    }

    // Debug : grille
    if (this.showGrid) {
      this.renderGrid(ctx, camera, bounds);
    }
  }

  /**
   * Dessine une tuile avec effet organique (version optimisée)
   */
  renderTileOptimized(ctx, camera, tile, layer) {
    // Utiliser la texture pré-rendue avec feathering
    const featheredTexture = this.featheredTextureCache.get(tile.textureId);

    // Fallback sur texture normale si cache pas prêt
    const texture = featheredTexture || this.tileSet.getTexture(tile.textureId);

    if (!texture) {
      if (layer === 0) {
        this.renderFallbackTile(ctx, camera, tile);
      }
      return;
    }

    const baseSize = this.tileMap.tileSize;
    const overlapSize = baseSize * (1 + this.overlap);
    const overlapOffset = (overlapSize - baseSize) / 2;

    // Position avec variations déterministes
    const baseOffsetX = (this.seededRandom(tile.x, tile.y, 1) - 0.5) * baseSize * 0.08;
    const baseOffsetY = (this.seededRandom(tile.x, tile.y, 2) - 0.5) * baseSize * 0.08;

    let worldX = tile.worldX - overlapOffset + baseOffsetX;
    let worldY = tile.worldY - overlapOffset + baseOffsetY;

    let opacity = 1;
    let sizeMultiplier = 1;

    if (layer === 0) {
      opacity = 0.9 + this.seededRandom(tile.x, tile.y, 10) * 0.1;
      sizeMultiplier = 1.0 + this.seededRandom(tile.x, tile.y, 11) * 0.08;
    } else {
      // Scatter layers
      const offsetX = (this.seededRandom(tile.x, tile.y, layer * 100) - 0.5) * baseSize * this.scatterOffset;
      const offsetY = (this.seededRandom(tile.x, tile.y, layer * 200) - 0.5) * baseSize * this.scatterOffset;
      worldX += offsetX;
      worldY += offsetY;

      opacity = 0.25 + this.seededRandom(tile.x, tile.y, layer * 300) * 0.35;
      sizeMultiplier = 0.75 + this.seededRandom(tile.x, tile.y, layer * 400) * 0.4;
    }

    const finalSize = overlapSize * sizeMultiplier;
    const screenPos = camera.worldToScreen(worldX, worldY);
    const centerX = screenPos.x + finalSize / 2;
    const centerY = screenPos.y + finalSize / 2;

    // Rotation libre
    const rotation = this.seededRandom(tile.x, tile.y, layer * 500 + 50) * Math.PI * 2;

    // Flip aléatoire
    const flipX = this.seededRandom(tile.x, tile.y, layer * 600) > 0.5 ? -1 : 1;
    const flipY = this.seededRandom(tile.x, tile.y, layer * 700) > 0.5 ? -1 : 1;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.scale(flipX, flipY);

    // Dessiner directement la texture pré-rendue (pas de filter pour la perf)
    ctx.drawImage(texture, -finalSize / 2, -finalSize / 2, finalSize, finalSize);

    ctx.globalAlpha = 1;
    ctx.restore();

    if (this.debug && layer === 0) {
      this.renderTileDebug(ctx, screenPos, tile);
    }
  }

  /**
   * Dessine une tuile de fallback
   */
  renderFallbackTile(ctx, camera, tile) {
    const tileSize = this.tileMap.tileSize;
    const screenPos = camera.worldToScreen(tile.worldX, tile.worldY);

    const isEven = (tile.x + tile.y) % 2 === 0;
    ctx.fillStyle = isEven ? '#1a1a2e' : '#16162a';
    ctx.fillRect(screenPos.x, screenPos.y, tileSize, tileSize);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenPos.x, screenPos.y, tileSize, tileSize);
  }

  /**
   * Affiche un écran de chargement
   */
  renderLoading(ctx, camera) {
    const bounds = camera.getBounds();
    const centerX = (bounds.right - bounds.left) / 2;
    const centerY = (bounds.bottom - bounds.top) / 2;

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, bounds.right - bounds.left, bounds.bottom - bounds.top);

    ctx.fillStyle = 'white';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Chargement des textures...', centerX, centerY);
  }

  /**
   * Dessine une grille de debug
   */
  renderGrid(ctx, camera, bounds) {
    const tileSize = this.tileMap.tileSize;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    const startX = Math.floor(bounds.left / tileSize) * tileSize;
    const startY = Math.floor(bounds.top / tileSize) * tileSize;

    for (let x = startX; x <= bounds.right; x += tileSize) {
      const screen = camera.worldToScreen(x, 0);
      ctx.beginPath();
      ctx.moveTo(screen.x, 0);
      ctx.lineTo(screen.x, ctx.canvas.height);
      ctx.stroke();
    }

    for (let y = startY; y <= bounds.bottom; y += tileSize) {
      const screen = camera.worldToScreen(0, y);
      ctx.beginPath();
      ctx.moveTo(0, screen.y);
      ctx.lineTo(ctx.canvas.width, screen.y);
      ctx.stroke();
    }
  }

  /**
   * Affiche les infos de debug d'une tuile
   */
  renderTileDebug(ctx, screenPos, tile) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px monospace';
    ctx.fillText(`${tile.x},${tile.y}`, screenPos.x + 5, screenPos.y + 15);
    ctx.fillText(tile.textureId.substring(0, 10), screenPos.x + 5, screenPos.y + 25);
  }

  setDebug(enabled) {
    this.debug = enabled;
  }

  setShowGrid(enabled) {
    this.showGrid = enabled;
  }
}

export default WorldRenderer;