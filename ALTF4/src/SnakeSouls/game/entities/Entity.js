// Classe abstraite de base pour toutes les entités du jeu
import Vector2 from '../utils/Vector2.js';

export default class Entity {
  constructor(x, y) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.active = true;
    this.radius = 10; // Pour les collisions circulaires
  }

  /**
   * Mise à jour de l'entité (à surcharger)
   * @param {number} deltaTime - Temps écoulé depuis la dernière frame
   */
  update(deltaTime) {
    // À implémenter dans les classes enfants
  }

  /**
   * Rendu de l'entité (à surcharger)
   * @param {CanvasRenderingContext2D} ctx - Contexte de rendu
   */
  render(ctx) {
    // À implémenter dans les classes enfants
  }

  /**
   * Déplacer l'entité
   */
  move(deltaTime) {
    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  /**
   * Vérifier si l'entité est hors des limites
   */
  isOutOfBounds(width, height) {
    return (
      this.position.x < 0 ||
      this.position.x > width ||
      this.position.y < 0 ||
      this.position.y > height
    );
  }

  /**
   * Détruire l'entité
   */
  destroy() {
    this.active = false;
  }

  /**
   * Vérifier si l'entité est active
   */
  isActive() {
    return this.active;
  }
}
