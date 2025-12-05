// Boucle principale du jeu (update/render)
export default class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.running = false;
    this.lastTime = 0;
    this.fps = 60;
    this.frameTime = 1000 / this.fps;
    this.deltaTime = 0;
    this.animationId = null;
  }

  /**
   * Démarrer la boucle de jeu
   */
  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  /**
   * Arrêter la boucle de jeu
   */
  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Boucle principale
   */
  loop(currentTime) {
    if (!this.running) return;

    this.animationId = requestAnimationFrame((time) => this.loop(time));

    // Calculer le temps écoulé
    this.deltaTime = (currentTime - this.lastTime) / 1000; // Convertir en secondes
    this.lastTime = currentTime;

    // Limiter le deltaTime pour éviter les gros sauts
    if (this.deltaTime > 0.1) {
      this.deltaTime = 0.1;
    }

    // Update
    if (this.updateCallback) {
      this.updateCallback(this.deltaTime);
    }

    // Render
    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Mettre en pause
   */
  pause() {
    this.running = false;
  }

  /**
   * Reprendre
   */
  resume() {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  /**
   * Vérifier si en cours d'exécution
   */
  isRunning() {
    return this.running;
  }

  /**
   * Obtenir le FPS actuel
   */
  getCurrentFPS() {
    return this.deltaTime > 0 ? Math.round(1 / this.deltaTime) : 0;
  }
}
