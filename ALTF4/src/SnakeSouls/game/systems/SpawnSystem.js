// Système de spawn des bonus
import Bonus from '../entities/Bonus.js';
import { randomRange } from '../utils/helpers.js';

export default class SpawnSystem {
  constructor(canvasWidth = 800, canvasHeight = 600) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.margin = 30;
  }

  /**
   * Générer une position aléatoire
   */
  getRandomPosition() {
    return {
      x: randomRange(this.margin, this.canvasWidth - this.margin),
      y: randomRange(this.margin, this.canvasHeight - this.margin)
    };
  }

  /**
   * Spawner un bonus
   */
  spawnBonus(bonusData = null) {
    const pos = this.getRandomPosition();
    return new Bonus(pos.x, pos.y, bonusData);
  }

  /**
   * Définir les dimensions du canvas
   */
  setCanvasSize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
}
