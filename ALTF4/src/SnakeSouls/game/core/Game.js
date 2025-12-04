// Orchestrateur principal du jeu
import GameLoop from './GameLoop.js';
import InputManager from './InputManager.js';
import PlayerSnake from '../entities/PlayerSnake.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import ScoreSystem from '../systems/ScoreSystem.js';

export default class Game {
  constructor(canvasWidth = 800, canvasHeight = 600) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvas = null;
    this.ctx = null;

    // Systèmes
    this.inputManager = new InputManager();
    this.collisionSystem = new CollisionSystem();
    this.spawnSystem = new SpawnSystem(canvasWidth, canvasHeight);
    this.scoreSystem = new ScoreSystem();

    // Entités
    this.player = new PlayerSnake(canvasWidth / 2, canvasHeight / 2);
    this.bonuses = [];

    // État du jeu
    this.gameOver = false;
    this.paused = false;
    this.lives = 3;

    // Callbacks
    this.onStateChange = null;

    // Boucle de jeu
    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );

    // Initialiser
    this.init();
  }

  /**
   * Initialiser le jeu
   */
  init() {
    this.collisionSystem.setCanvasSize(this.canvasWidth, this.canvasHeight);
    this.spawnBonus();
  }

  /**
   * Définir le canvas
   */
  setCanvas(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Spawner un bonus
   */
  spawnBonus() {
    const bonus = this.spawnSystem.spawnBonus();
    this.bonuses.push(bonus);
  }

  /**
   * Démarrer le jeu
   */
  start() {
    this.gameLoop.start();
  }

  /**
   * Mettre en pause
   */
  pause() {
    this.paused = true;
    this.gameLoop.pause();
    this.notifyStateChange();
  }

  /**
   * Reprendre
   */
  resume() {
    this.paused = false;
    this.gameLoop.resume();
    this.notifyStateChange();
  }

  /**
   * Réinitialiser le jeu
   */
  reset() {
    this.player = new PlayerSnake(this.canvasWidth / 2, this.canvasHeight / 2);
    this.bonuses = [];
    this.gameOver = false;
    this.lives = 3;
    this.scoreSystem.reset();
    this.spawnBonus();
    this.notifyStateChange();
  }

  /**
   * Mise à jour du jeu
   */
  update(deltaTime) {
    if (this.gameOver || this.paused) return;

    // Mettre à jour les contrôles du joueur
    this.player.setControls({
      left: this.inputManager.isKeyPressed('ArrowLeft'),
      right: this.inputManager.isKeyPressed('ArrowRight'),
      up: this.inputManager.isKeyPressed('ArrowUp'),
      down: this.inputManager.isKeyPressed('ArrowDown')
    });

    // Mettre à jour le joueur
    this.player.update(deltaTime);

    // Vérifier les collisions
    const collisions = this.collisionSystem.checkPlayerCollisions(
      this.player,
      this.bonuses
    );

    // Collision avec les murs ou soi-même
    if (collisions.wall || collisions.self) {
      this.lives--;
      if (this.lives <= 0) {
        this.gameOver = true;
        this.gameLoop.stop();
      } else {
        // Réinitialiser la position
        this.player = new PlayerSnake(this.canvasWidth / 2, this.canvasHeight / 2);
      }
      this.notifyStateChange();
    }

    // Collision avec bonus
    if (collisions.bonus) {
      collisions.bonus.destroy();
      this.bonuses = this.bonuses.filter(b => b.active);
      this.scoreSystem.addPoints(collisions.bonus.points);
      this.player.grow(3);
      this.spawnBonus();
      this.notifyStateChange();
    }

    // Gestion de la pause avec Espace
    if (this.inputManager.isKeyPressed('Space') && !this.spaceWasPressed) {
      if (this.gameOver) {
        this.reset();
        this.start();
      } else {
        if (this.paused) {
          this.resume();
        } else {
          this.pause();
        }
      }
      this.spaceWasPressed = true;
    } else if (!this.inputManager.isKeyPressed('Space')) {
      this.spaceWasPressed = false;
    }
  }

  /**
   * Rendu du jeu
   */
  render() {
    if (!this.ctx) return;

    // Fond
    this.ctx.fillStyle = '#0F0F1A';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Bonus
    for (const bonus of this.bonuses) {
      if (bonus.active) {
        bonus.render(this.ctx);
      }
    }

    // Joueur
    this.player.render(this.ctx);

    // Indicateur de direction
    this.drawDirectionIndicator();

    // Game Over
    if (this.gameOver) {
      this.drawGameOver();
    }

    // Pause
    if (this.paused) {
      this.drawPause();
    }
  }

  /**
   * Dessiner l'indicateur de direction
   */
  drawDirectionIndicator() {
    const head = this.player.getHeadPosition();
    this.ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(head.x, head.y);
    this.ctx.lineTo(
      head.x + Math.cos(this.player.angle) * 30,
      head.y + Math.sin(this.player.angle) * 30
    );
    this.ctx.stroke();
  }

  /**
   * Dessiner l'écran Game Over
   */
  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    this.ctx.fillStyle = '#EF4444';
    this.ctx.font = 'bold 48px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('YOU DIED', this.canvasWidth / 2, this.canvasHeight / 2 - 40);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px sans-serif';
    this.ctx.fillText(
      `Score: ${this.scoreSystem.getScore()}`,
      this.canvasWidth / 2,
      this.canvasHeight / 2 + 10
    );
    
    this.ctx.font = '18px sans-serif';
    this.ctx.fillStyle = '#60A5FA';
    this.ctx.fillText(
      'Appuie sur ESPACE pour rejouer',
      this.canvasWidth / 2,
      this.canvasHeight / 2 + 50
    );
  }

  /**
   * Dessiner l'écran de pause
   */
  drawPause() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 48px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSE', this.canvasWidth / 2, this.canvasHeight / 2);
    
    this.ctx.font = '18px sans-serif';
    this.ctx.fillStyle = '#60A5FA';
    this.ctx.fillText(
      'Appuie sur ESPACE pour continuer',
      this.canvasWidth / 2,
      this.canvasHeight / 2 + 40
    );
  }

  /**
   * Notifier le changement d'état
   */
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({
        score: this.scoreSystem.getScore(),
        lives: this.lives,
        gameOver: this.gameOver,
        paused: this.paused
      });
    }
  }

  /**
   * Détruire le jeu
   */
  destroy() {
    this.gameLoop.stop();
    this.inputManager.destroy();
  }
}
