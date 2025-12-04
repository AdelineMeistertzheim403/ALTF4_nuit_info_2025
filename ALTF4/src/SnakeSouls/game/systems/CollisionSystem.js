// Système de gestion des collisions
export default class CollisionSystem {
  constructor() {
    this.canvasWidth = 800;
    this.canvasHeight = 600;
  }

  /**
   * Définir les dimensions du canvas
   */
  setCanvasSize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  /**
   * Vérifier collision serpent avec les murs
   */
  checkWallCollision(snake) {
    return snake.checkWallCollision(this.canvasWidth, this.canvasHeight);
  }

  /**
   * Vérifier collision serpent avec lui-même
   */
  checkSelfCollision(snake) {
    return snake.checkSelfCollision();
  }

  /**
   * Vérifier collision serpent avec bonus
   */
  checkBonusCollision(snake, bonus) {
    return bonus.checkCollision(snake);
  }

  /**
   * Vérifier toutes les collisions pour le joueur
   */
  checkPlayerCollisions(player, bonuses) {
    const result = {
      wall: false,
      self: false,
      bonus: null
    };

    // Vérifier murs
    result.wall = this.checkWallCollision(player);
    
    // Vérifier collision avec soi-même
    result.self = this.checkSelfCollision(player);

    // Vérifier bonus
    for (const bonus of bonuses) {
      if (bonus.active && this.checkBonusCollision(player, bonus)) {
        result.bonus = bonus;
        break;
      }
    }

    return result;
  }
}
