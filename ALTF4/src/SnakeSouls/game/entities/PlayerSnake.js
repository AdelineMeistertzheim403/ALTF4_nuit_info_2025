// Serpent contrôlé par le joueur
import Snake from './Snake.js';

export default class PlayerSnake extends Snake {
  constructor(x, y, initialLength = 10) {
    super(x, y, initialLength);
    this.controls = {
      left: false,
      right: false,
      up: false,
      down: false
    };
  }

  /**
   * Mettre à jour les contrôles
   */
  setControls(controls) {
    this.controls = { ...controls };
  }

  /**
   * Mise à jour du serpent joueur
   */
  update(deltaTime) {
    // Rotation basée sur les contrôles
    if (this.controls.left) {
      this.turn(-1);
    }
    if (this.controls.right) {
      this.turn(1);
    }

    // Vitesse variable
    let speedMultiplier = 1;
    if (this.controls.up) {
      speedMultiplier = 1.8;
    }
    if (this.controls.down) {
      speedMultiplier = 0.5;
    }

    // Appliquer la vitesse
    const originalSpeed = this.speed;
    this.speed = this.speed * speedMultiplier;
    
    // Déplacer
    super.update(deltaTime);
    
    // Restaurer la vitesse
    this.speed = originalSpeed;
  }
}
