// Gestion des entrées clavier et souris
export default class InputManager {
  constructor() {
    this.keys = new Map();
    this.mousePosition = { x: 0, y: 0 };
    this.mouseDown = false;

    this.init();
  }

  /**
   * Initialiser les écouteurs d'événements
   */
  init() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mousedown', () => this.mouseDown = true);
    document.addEventListener('mouseup', () => this.mouseDown = false);
  }

  /**
   * Gérer l'appui d'une touche
   */
  handleKeyDown(event) {
    this.keys.set(event.code, true);
  }

  /**
   * Gérer le relâchement d'une touche
   */
  handleKeyUp(event) {
    this.keys.set(event.code, false);
  }

  /**
   * Gérer le mouvement de la souris
   */
  handleMouseMove(event) {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  /**
   * Vérifier si une touche est pressée
   */
  isKeyPressed(keyCode) {
    return this.keys.get(keyCode) || false;
  }

  /**
   * Obtenir la position de la souris
   */
  getMousePosition() {
    return { ...this.mousePosition };
  }

  /**
   * Vérifier si la souris est pressée
   */
  isMouseDown() {
    return this.mouseDown;
  }

  /**
   * Réinitialiser toutes les touches
   */
  reset() {
    this.keys.clear();
    this.mouseDown = false;
  }

  /**
   * Nettoyer les écouteurs
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
}
