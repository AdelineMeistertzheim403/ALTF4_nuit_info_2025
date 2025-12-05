/**
 * DebrisSystem.js
 *
 * Gère les débris qui apparaissent quand un snake est détruit.
 * Les débris peuvent être ramassés pour grandir.
 */

export class DebrisSystem {
  constructor() {
    this.debris = []; // { x, y, vx, vy, size, color, lifetime, maxLifetime }
  }

  /**
   * Crée des débris à partir d'un snake détruit
   * @param {Object} snake - Le snake détruit (ennemi ou joueur)
   * @param {Array} segmentPositions - Positions des segments
   */
  createFromSnake(snake, segmentPositions) {
    const color = snake.type?.color || '#ff6b6b';

    // Créer un débris pour chaque segment
    segmentPositions.forEach((pos, index) => {
      // Vélocité aléatoire pour l'explosion
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;

      this.debris.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 25 + Math.random() * 10,
        color: color,
        lifetime: 0,
        maxLifetime: 15 + Math.random() * 10, // 15-25 secondes
        value: 1, // Points de croissance
        sprite: pos.segment?.image || null,
        spriteData: pos.segment?.spriteData || null
      });
    });

    // Ajouter aussi un débris pour la tête
    const headAngle = Math.random() * Math.PI * 2;
    const headSpeed = 80 + Math.random() * 60;

    this.debris.push({
      x: snake.x,
      y: snake.y,
      vx: Math.cos(headAngle) * headSpeed,
      vy: Math.sin(headAngle) * headSpeed,
      size: 30,
      color: color,
      lifetime: 0,
      maxLifetime: 20,
      value: 2, // La tête vaut plus
      sprite: snake.headImage || null,
      spriteData: null
    });
  }

  /**
   * Met à jour les débris
   */
  update(deltaTime) {
    this.debris.forEach(d => {
      // Appliquer la vélocité avec friction
      d.x += d.vx * deltaTime;
      d.y += d.vy * deltaTime;

      // Friction pour ralentir
      d.vx *= 0.98;
      d.vy *= 0.98;

      // Augmenter le lifetime
      d.lifetime += deltaTime;
    });

    // Supprimer les débris expirés
    this.debris = this.debris.filter(d => d.lifetime < d.maxLifetime);
  }

  /**
   * Vérifie les collisions avec un point (joueur ou ennemi)
   * @returns {{ picked: Array, remaining: Array }}
   */
  checkCollision(x, y, pickupDistance = 30) {
    const picked = [];
    const remaining = [];

    this.debris.forEach(d => {
      const dx = d.x - x;
      const dy = d.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < pickupDistance) {
        picked.push(d);
      } else {
        remaining.push(d);
      }
    });

    this.debris = remaining;
    return { picked, remaining };
  }

  /**
   * Dessine les débris
   */
  render(ctx, camera) {
    this.debris.forEach(d => {
      const screenPos = camera.worldToScreen(d.x, d.y);

      // Calculer l'opacité (fade out vers la fin)
      const fadeStart = d.maxLifetime * 0.7;
      let alpha = 1;
      if (d.lifetime > fadeStart) {
        alpha = 1 - (d.lifetime - fadeStart) / (d.maxLifetime - fadeStart);
      }

      // Pulsation
      const pulse = 1 + Math.sin(d.lifetime * 5) * 0.1;
      const size = d.size * pulse;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Si on a un sprite, l'utiliser
      if (d.sprite && d.sprite.complete) {
        ctx.drawImage(
          d.sprite,
          screenPos.x - size / 2,
          screenPos.y - size / 2,
          size,
          size
        );
      } else {
        // Sinon, dessiner un cercle coloré
        // Aura externe
        ctx.fillStyle = d.color;
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Centre
        ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  /**
   * Retourne le nombre de débris
   */
  get count() {
    return this.debris.length;
  }

  /**
   * Supprime tous les débris
   */
  clear() {
    this.debris = [];
  }
}

export default DebrisSystem;
