/**
 * WorldRenderer.js
 * 
 * Responsable du rendu du monde (sol).
 * Dessine les tuiles visibles avec leurs transformations.
 * 
 * Séparation des responsabilités :
 * - TileSet : charge les images
 * - TileMap : génère les données des tuiles
 * - WorldRenderer : dessine les tuiles à l'écran
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
  }

  /**
   * Dessine toutes les tuiles visibles
   * 
   * @param {CanvasRenderingContext2D} ctx - Contexte de dessin
   * @param {Camera} camera - Caméra pour la conversion world→screen
   */
  render(ctx, camera) {
    // Vérifier que les textures sont chargées
    if (!this.tileSet.isLoaded()) {
      this.renderLoading(ctx, camera);
      return;
    }

    // Récupérer les bounds de la caméra
    const bounds = camera.getBounds();
    
    // Récupérer les tuiles visibles
    const tiles = this.tileMap.getVisibleTiles(bounds);
    
    // Dessiner chaque tuile
    tiles.forEach(tile => {
      this.renderTile(ctx, camera, tile);
    });

    // Debug : grille
    if (this.showGrid) {
      this.renderGrid(ctx, camera, bounds);
    }
  }

  /**
   * Dessine une tuile individuelle
   * 
   * @param {CanvasRenderingContext2D} ctx
   * @param {Camera} camera
   * @param {Object} tile - Données de la tuile
   */
  renderTile(ctx, camera, tile) {
    const texture = this.tileSet.getTexture(tile.textureId);
    
    // Fallback si texture non trouvée
    if (!texture) {
      this.renderFallbackTile(ctx, camera, tile);
      return;
    }

    const tileSize = this.tileMap.tileSize;
    
    // Convertir position monde → écran
    const screenPos = camera.worldToScreen(tile.worldX, tile.worldY);
    
    // Centre de la tuile (pour les rotations)
    const centerX = screenPos.x + tileSize / 2;
    const centerY = screenPos.y + tileSize / 2;

    // Sauvegarder l'état du contexte
    ctx.save();

    // Appliquer les transformations
    ctx.translate(centerX, centerY);
    ctx.rotate(tile.rotation);
    ctx.scale(tile.flipX ? -1 : 1, tile.flipY ? -1 : 1);
    
    // Variation de luminosité
    if (tile.brightness !== 1) {
      ctx.filter = `brightness(${tile.brightness})`;
    }

    // Dessiner la texture
    ctx.drawImage(
      texture,
      -tileSize / 2,
      -tileSize / 2,
      tileSize,
      tileSize
    );

    // Reset filter
    ctx.filter = 'none';

    // Restaurer l'état
    ctx.restore();

    // Debug : afficher les infos de tuile
    if (this.debug) {
      this.renderTileDebug(ctx, screenPos, tile);
    }
  }

  /**
   * Dessine une tuile de fallback (quand la texture n'est pas chargée)
   */
  renderFallbackTile(ctx, camera, tile) {
    const tileSize = this.tileMap.tileSize;
    const screenPos = camera.worldToScreen(tile.worldX, tile.worldY);
    
    // Damier pour visualiser
    const isEven = (tile.x + tile.y) % 2 === 0;
    ctx.fillStyle = isEven ? '#1a1a2e' : '#16162a';
    ctx.fillRect(screenPos.x, screenPos.y, tileSize, tileSize);
    
    // Bordure
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

    // Lignes verticales
    for (let x = startX; x <= bounds.right; x += tileSize) {
      const screen = camera.worldToScreen(x, 0);
      ctx.beginPath();
      ctx.moveTo(screen.x, 0);
      ctx.lineTo(screen.x, ctx.canvas.height);
      ctx.stroke();
    }

    // Lignes horizontales
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
    const tileSize = this.tileMap.tileSize;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px monospace';
    ctx.fillText(
      `${tile.x},${tile.y}`,
      screenPos.x + 5,
      screenPos.y + 15
    );
    ctx.fillText(
      tile.textureId.substring(0, 10),
      screenPos.x + 5,
      screenPos.y + 25
    );
  }

  /**
   * Active/désactive le mode debug
   */
  setDebug(enabled) {
    this.debug = enabled;
  }

  /**
   * Active/désactive la grille
   */
  setShowGrid(enabled) {
    this.showGrid = enabled;
  }
}

export default WorldRenderer;
