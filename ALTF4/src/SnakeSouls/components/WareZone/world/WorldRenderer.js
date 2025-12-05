/**
 * WorldRenderer.js
 *
 * Responsable du rendu du monde (sol).
 * Dessine les tuiles visibles avec un effet naturel et organique.
 *
 * Techniques utilisées :
 * - Scatter : plusieurs passes de tuiles décalées
 * - Overlap : les tuiles se chevauchent légèrement
 * - Variations : taille, rotation, opacité aléatoires
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

    // Paramètres pour le rendu naturel
    this.overlap = 0.15; // 15% de chevauchement entre tuiles
    this.scatterLayers = 2; // Nombre de couches de tuiles
    this.scatterOffset = 0.3; // Décalage max des couches (en % de tileSize)
  }

  /**
   * Génère un nombre pseudo-aléatoire déterministe
   */
  seededRandom(x, y, offset = 0) {
    const n = Math.sin((x + offset) * 12.9898 + (y + offset) * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  /**
   * Dessine toutes les tuiles visibles avec effet naturel
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

    // Dessiner plusieurs couches pour un effet plus naturel
    for (let layer = 0; layer < this.scatterLayers; layer++) {
      tiles.forEach(tile => {
        this.renderTileNatural(ctx, camera, tile, layer);
      });
    }

    // Debug : grille
    if (this.showGrid) {
      this.renderGrid(ctx, camera, bounds);
    }
  }

  /**
   * Dessine une tuile avec effet naturel (scatter, overlap, variations)
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Camera} camera
   * @param {Object} tile - Données de la tuile
   * @param {number} layer - Couche de rendu (0 = base, 1+ = scatter)
   */
  renderTileNatural(ctx, camera, tile, layer) {
    const texture = this.tileSet.getTexture(tile.textureId);

    // Fallback si texture non trouvée
    if (!texture) {
      if (layer === 0) {
        this.renderFallbackTile(ctx, camera, tile);
      }
      return;
    }

    const baseSize = this.tileMap.tileSize;

    // Taille avec overlap (légèrement plus grand pour couvrir les bords)
    const overlapSize = baseSize * (1 + this.overlap);

    // Décalage pour centrer l'overlap
    const overlapOffset = (overlapSize - baseSize) / 2;

    // Position de base
    let worldX = tile.worldX - overlapOffset;
    let worldY = tile.worldY - overlapOffset;

    // Pour les couches supplémentaires, ajouter un décalage aléatoire
    let opacity = 1;
    let sizeMultiplier = 1;

    if (layer > 0) {
      // Décalage pseudo-aléatoire basé sur la position
      const offsetX = (this.seededRandom(tile.x, tile.y, layer * 100) - 0.5) * baseSize * this.scatterOffset;
      const offsetY = (this.seededRandom(tile.x, tile.y, layer * 200) - 0.5) * baseSize * this.scatterOffset;

      worldX += offsetX;
      worldY += offsetY;

      // Opacité réduite pour les couches supérieures
      opacity = 0.3 + this.seededRandom(tile.x, tile.y, layer * 300) * 0.3;

      // Légère variation de taille
      sizeMultiplier = 0.9 + this.seededRandom(tile.x, tile.y, layer * 400) * 0.2;
    }

    const finalSize = overlapSize * sizeMultiplier;

    // Convertir position monde → écran
    const screenPos = camera.worldToScreen(worldX, worldY);

    // Centre de la tuile (pour les rotations)
    const centerX = screenPos.x + finalSize / 2;
    const centerY = screenPos.y + finalSize / 2;

    // Rotation plus variée (pas seulement 90°)
    let rotation = tile.rotation;
    if (layer > 0) {
      // Ajouter une rotation supplémentaire pour les couches scatter
      rotation += (this.seededRandom(tile.x, tile.y, layer * 500) - 0.5) * 0.5;
    }

    // Sauvegarder l'état du contexte
    ctx.save();

    // Appliquer l'opacité
    ctx.globalAlpha = opacity;

    // Appliquer les transformations
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.scale(tile.flipX ? -1 : 1, tile.flipY ? -1 : 1);

    // Variation de luminosité
    if (tile.brightness !== 1) {
      ctx.filter = `brightness(${tile.brightness})`;
    }

    // Dessiner la texture
    ctx.drawImage(
      texture,
      -finalSize / 2,
      -finalSize / 2,
      finalSize,
      finalSize
    );

    // Reset
    ctx.filter = 'none';
    ctx.globalAlpha = 1;

    // Restaurer l'état
    ctx.restore();

    // Debug : afficher les infos de tuile (seulement layer 0)
    if (this.debug && layer === 0) {
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
