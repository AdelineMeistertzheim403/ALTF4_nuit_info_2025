/**
 * world/index.js
 *
 * Point d'entrée pour le système de monde/sol.
 * Exporte toutes les classes nécessaires.
 */

export { TileSet, createUrbanFloorTileSet } from './TileSet.js';
export { TileMap } from './TileMap.js';
export { WorldRenderer } from './WorldRenderer.js';
export { USE_REAL_TEXTURES, createRealTileSet } from './textureConfig.js';
export { addPlaceholderTextures } from './placeholderTextures.js';

import { USE_REAL_TEXTURES, createRealTileSet } from './textureConfig.js';
import { addPlaceholderTextures } from './placeholderTextures.js';
import { TileSet } from './TileSet.js';
import { TileMap } from './TileMap.js';
import { WorldRenderer } from './WorldRenderer.js';

// Factory pour créer un monde complet
export async function createWorld(options = {}) {
  const {
    tileSize = 256,
    seed = Date.now(),
  } = options;

  let tileSet;

  if (USE_REAL_TEXTURES) {
    // Utiliser les vraies textures AmbientCG
    tileSet = await createRealTileSet();
  } else {
    // Utiliser les textures placeholder générées
    tileSet = new TileSet();
    addPlaceholderTextures(tileSet);
  }

  const tileMap = new TileMap(tileSet, { tileSize, seed });
  const renderer = new WorldRenderer(tileMap, tileSet);

  return {
    tileSet,
    tileMap,
    renderer,

    // Méthode pour dessiner
    render(ctx, camera) {
      renderer.render(ctx, camera);
    }
  };
}
