// Classe représentant un segment du serpent
import Vector2 from '../utils/Vector2.js';

export default class Segment {
  constructor(x, y, radius = 8) {
    this.position = new Vector2(x, y);
    this.radius = radius;
    this.color = '#60A5FA';
  }

  /**
   * Dessiner le segment
   */
  render(ctx, index, totalLength) {
    // Dégradé de couleur selon la position dans le corps
    const hue = 200 + (index / totalLength) * 40;
    const lightness = 60 - (index / totalLength) * 20;
    
    ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Suivre une position cible
   */
  follow(target, spacing) {
    const distance = this.position.distance(target);
    
    if (distance > spacing) {
      const direction = target.subtract(this.position).normalize();
      this.position = target.subtract(direction.multiply(spacing));
    }
  }

  /**
   * Obtenir les coordonnées
   */
  getPosition() {
    return this.position.clone();
  }

  /**
   * Définir la position
   */
  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }
}
