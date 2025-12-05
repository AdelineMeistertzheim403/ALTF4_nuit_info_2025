/**
 * textureConfig.js
 * 
 * Configuration des textures du sol.
 * 
 * COMMENT UTILISER :
 * 1. Télécharge les textures depuis AmbientCG (format 1K JPG)
 * 2. Place-les dans public/assets/textures/floor/
 * 3. Met à jour les chemins ci-dessous
 * 4. Change USE_REAL_TEXTURES à true
 */

// ============================================
// CONFIGURATION
// ============================================

// Passe à true quand tu as téléchargé les textures
export const USE_REAL_TEXTURES = true;

// Chemins vers les textures (import statique pour Vite)
import concrete010 from '../../../assets/textures/floor/Concrete010_1K-JPG/Concrete010_1K-JPG_Color.jpg';
import concrete012 from '../../../assets/textures/floor/Concrete012_1K-JPG/Concrete012_1K-JPG_Color.jpg';
import concrete015 from '../../../assets/textures/floor/Concrete015_1K-JPG/Concrete015_1K-JPG_Color.jpg';
import concrete020 from '../../../assets/textures/floor/Concrete020_1K-JPG/Concrete020_1K-JPG_Color.jpg';

// Liste des textures disponibles
export const FLOOR_TEXTURES = {
  'concrete_base':      concrete010,
  'concrete_cracked':   concrete012,
  'concrete_damaged':   concrete015,
  'asphalt_worn':       concrete020,
};

// ============================================
// HELPER : Charge les vraies textures
// ============================================

import { TileSet } from './TileSet';

/**
 * Crée un TileSet avec les vraies textures d'AmbientCG
 * @returns {Promise<TileSet>}
 */
export async function createRealTileSet() {
  const tileSet = new TileSet();

  // Ajouter chaque texture (les imports Vite donnent directement l'URL)
  Object.entries(FLOOR_TEXTURES).forEach(([id, url]) => {
    tileSet.addTexture(id, url);
  });

  // Charger toutes les textures
  await tileSet.loadAll();

  return tileSet;
}

// ============================================
// TÉLÉCHARGEMENT DES TEXTURES
// ============================================
/*
  
  SOURCES RECOMMANDÉES (CC0 - libre de droit) :
  
  🏆 AmbientCG (https://ambientcg.com)
  - Concrete010 : Béton basique          → https://ambientcg.com/view?id=Concrete010
  - Concrete012 : Béton fissuré          → https://ambientcg.com/view?id=Concrete012
  - Concrete015 : Béton très abîmé       → https://ambientcg.com/view?id=Concrete015
  - Concrete020 : Béton vieilli          → https://ambientcg.com/view?id=Concrete020
  
  🏆 Poly Haven (https://polyhaven.com)
  - cracked_concrete      → https://polyhaven.com/a/cracked_concrete
  - damaged_concrete_floor → https://polyhaven.com/a/damaged_concrete_floor
  
  📁 STRUCTURE DES FICHIERS :
  
  public/
  └── assets/
      └── textures/
          └── floor/
              ├── Concrete010_1K_Color.jpg
              ├── Concrete012_1K_Color.jpg
              ├── Concrete015_1K_Color.jpg
              └── Concrete020_1K_Color.jpg
  
  💡 TIPS :
  - Télécharge en 1K (1024x1024) pour le web - c'est suffisant
  - Prends seulement le fichier "_Color.jpg" (pas besoin des normal maps)
  - Renomme les fichiers si tu veux simplifier

*/

export default {
  USE_REAL_TEXTURES,
  FLOOR_TEXTURES,
  createRealTileSet
};
