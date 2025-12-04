// Système de gestion du score
export default class ScoreSystem {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
  }

  /**
   * Ajouter des points
   */
  addPoints(points) {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  /**
   * Obtenir le score actuel
   */
  getScore() {
    return this.score;
  }

  /**
   * Obtenir le meilleur score
   */
  getHighScore() {
    return this.highScore;
  }

  /**
   * Réinitialiser le score
   */
  reset() {
    this.score = 0;
  }

  /**
   * Charger le meilleur score depuis localStorage
   */
  loadHighScore() {
    try {
      const saved = localStorage.getItem('snakesouls_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Sauvegarder le meilleur score
   */
  saveHighScore() {
    try {
      localStorage.setItem('snakesouls_highscore', this.highScore.toString());
    } catch (e) {
      // Ignore errors
    }
  }
}
