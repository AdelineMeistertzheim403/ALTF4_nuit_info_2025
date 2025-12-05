/**
 * Système de chargement des sprites de malus
 * Utilise les sprites d'ennemis (logos propriétaires)
 */

import windowsSprite from '../../assets/sprites/enemies/windows.png';
import appleSprite from '../../assets/sprites/enemies/apple.png';
import oracleSprite from '../../assets/sprites/enemies/oracle.png';
import ibmSprite from '../../assets/sprites/enemies/ibm.png';
import nvidiaSprite from '../../assets/sprites/enemies/nvidia.png';
import samsungSprite from '../../assets/sprites/enemies/samsung.png';
import huaweiSprite from '../../assets/sprites/enemies/huawei.png';
import chromeSprite from '../../assets/sprites/enemies/chrome.png';
import { MALUS, MALUS_SPAWN_RATES } from './malus.js';

// Mapping des sprites par ID
const MALUS_SPRITE_MAP = {
  windows: windowsSprite,
  apple: appleSprite,
  oracle: oracleSprite,
  ibm: ibmSprite,
  nvidia: nvidiaSprite,
  samsung: samsungSprite,
  huawei: huaweiSprite,
  chrome: chromeSprite
};

/**
 * Classe pour gérer les sprites de malus
 */
class MalusSpriteLoader {
  constructor() {
    this.sprites = [];
    this.loaded = false;
  }

  /**
   * Charger tous les sprites de malus
   */
  async loadAll() {
    if (this.loaded) return;

    this.sprites = MALUS.map(malusData => ({
      id: malusData.id,
      name: malusData.name,
      src: MALUS_SPRITE_MAP[malusData.id],
      type: 'image',
      data: malusData,
      isMalus: true
    }));

    this.loaded = true;
  }

  /**
   * Obtenir un sprite de malus aléatoire selon les probabilités
   */
  getRandomSprite() {
    if (this.sprites.length === 0) return null;

    const random = Math.random() * 100;
    let cumulative = 0;

    for (const sprite of this.sprites) {
      const spawnRate = MALUS_SPAWN_RATES[sprite.id] || 10;
      cumulative += spawnRate;

      if (random <= cumulative) {
        return sprite;
      }
    }

    return this.sprites[0];
  }

  /**
   * Obtenir un sprite par ID
   */
  getSpriteById(id) {
    return this.sprites.find(s => s.id === id);
  }

  /**
   * Obtenir tous les sprites
   */
  getAllSprites() {
    return this.sprites;
  }
}

// Export singleton
export const malusSpriteLoader = new MalusSpriteLoader();