/**
 * world/index.js
 * 
 * Point d'entrée pour le système de monde/sol.
 * Exporte toutes les classes nécessaires.
 */

export { TileSet, createUrbanFloorTileSet } from './TileSet.js';
export { TileMap } from './TileMap.js';
export { WorldRenderer } from './WorldRenderer.js';

// Factory pour créer un monde complet
export function createWorld(options = {}) {
  const {
    basePath = '/assets/textures/floor',
    tileSize = 256,
    seed = Date.now(),
  } = options;

  const tileSet = createUrbanFloorTileSet(basePath);
  const tileMap = new TileMap(tileSet, { tileSize, seed });
  const renderer = new WorldRenderer(tileMap, tileSet);

  return {
    tileSet,
    tileMap,
    renderer,
    
    // Méthode pour charger et initialiser
    async init() {
      await tileSet.loadAll();
      return this;
    },
    
    // Méthode pour dessiner
    render(ctx, camera) {
      renderer.render(ctx, camera);
    }
  };
}
