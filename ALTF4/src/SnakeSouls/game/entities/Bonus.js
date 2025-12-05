// Item bonus (nourriture)
import Entity from './Entity.js';
import Vector2 from '../utils/Vector2.js';

export default class Bonus extends Entity {
  constructor(x, y, bonusData = null) {
    super(x, y);
    this.radius = 12;
    this.data = bonusData || {
      id: 'food',
      name: 'Food',
      color: '#F472B6',
      points: 10
    };
    this.color = this.data.color || '#F472B6';
    this.points = this.data.points || 10;
  }

  /**
   * Rendu du bonus
   */
  render(ctx) {
    // Cercle principal
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Effet glow
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Vérifier collision avec le serpent
   */
  checkCollision(snake) {
    const headPos = snake.getHeadPosition();
    const distance = this.position.distance(headPos);
    return distance < this.radius + snake.segmentRadius;
  }
}
