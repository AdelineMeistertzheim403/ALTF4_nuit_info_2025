// Classe de base pour les serpents (joueur et IA)
import Entity from './Entity.js';
import Segment from './Segment.js';
import Vector2 from '../utils/Vector2.js';

export default class Snake extends Entity {
  constructor(x, y, initialLength = 10) {
    super(x, y);
    this.segments = [];
    this.angle = 0;
    this.speed = 2;
    this.turnSpeed = 0.08;
    this.segmentRadius = 8;
    this.segmentSpacing = 10; // Réduit de 12 à 10 pour segments plus serrés
    this.lives = 3;
    this.score = 0;
    this.activeEffects = new Map();

    this.initSegments(x, y, initialLength);
  }

  /**
   * Initialiser les segments
   */
  initSegments(startX, startY, length) {
    this.segments = [];
    for (let i = 0; i < length; i++) {
      const segment = new Segment(
        startX - i * this.segmentSpacing,
        startY,
        this.segmentRadius
      );
      this.segments.push(segment);
    }
  }

  /**
   * Obtenir la tête du serpent
   */
  getHead() {
    return this.segments[0];
  }

  /**
   * Obtenir la position de la tête
   */
  getHeadPosition() {
    return this.getHead().position;
  }

  /**
   * Faire tourner le serpent
   */
  turn(direction) {
    this.angle += direction * this.turnSpeed;
  }

  /**
   * Déplacer le serpent
   */
  move() {
    const head = this.getHead();
    const newX = head.position.x + Math.cos(this.angle) * this.speed;
    const newY = head.position.y + Math.sin(this.angle) * this.speed;

    // Déplacer la tête
    head.position.x = newX;
    head.position.y = newY;

    // Faire suivre le corps
    this.updateBody();
  }

  /**
   * Mettre à jour le corps du serpent
   */
  updateBody() {
    for (let i = this.segments.length - 1; i > 0; i--) {
      const current = this.segments[i];
      const target = this.segments[i - 1].position;
      current.follow(target, this.segmentSpacing);
    }
  }

  /**
   * Grandir le serpent
   */
  grow(amount = 3) {
    for (let i = 0; i < amount; i++) {
      const tail = this.segments[this.segments.length - 1];
      const newSegment = new Segment(
        tail.position.x,
        tail.position.y,
        this.segmentRadius
      );
      this.segments.push(newSegment);
    }
  }

  /**
   * Vérifier collision avec soi-même
   */
  checkSelfCollision(startIndex = 10) {
    const head = this.getHeadPosition();
    
    for (let i = startIndex; i < this.segments.length; i++) {
      const segment = this.segments[i];
      if (head.distance(segment.position) < this.segmentRadius * 1.5) {
        return true;
      }
    }
    return false;
  }

  /**
   * Vérifier collision avec les murs
   */
  checkWallCollision(canvasWidth, canvasHeight) {
    const head = this.getHeadPosition();
    return (
      head.x < this.segmentRadius ||
      head.x > canvasWidth - this.segmentRadius ||
      head.y < this.segmentRadius ||
      head.y > canvasHeight - this.segmentRadius
    );
  }

  /**
   * Appliquer un effet
   */
  applyEffect(effect, value, duration) {
    this.activeEffects.set(effect, {
      value,
      endTime: Date.now() + duration
    });
  }

  /**
   * Mettre à jour les effets actifs
   */
  updateEffects() {
    const now = Date.now();
    for (const [effect, data] of this.activeEffects.entries()) {
      if (now >= data.endTime) {
        this.activeEffects.delete(effect);
      }
    }
  }

  /**
   * Mise à jour du serpent
   */
  update(deltaTime) {
    this.move();
    this.updateEffects();
  }

  /**
   * Rendu du serpent
   */
  render(ctx) {
    // Dessiner les segments du dernier au premier
    for (let i = this.segments.length - 1; i >= 0; i--) {
      this.segments[i].render(ctx, i, this.segments.length);
    }

    // Dessiner la tête avec des yeux
    this.renderHead(ctx);
  }

  /**
   * Dessiner la tête avec des yeux
   */
  renderHead(ctx) {
    const head = this.getHead();
    const eyeOffset = 4;
    const eyeAngle1 = this.angle - 0.5;
    const eyeAngle2 = this.angle + 0.5;

    // Yeux blancs
    ctx.fillStyle = 'white';
    
    ctx.beginPath();
    ctx.arc(
      head.position.x + Math.cos(eyeAngle1) * eyeOffset,
      head.position.y + Math.sin(eyeAngle1) * eyeOffset,
      3, 0, Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      head.position.x + Math.cos(eyeAngle2) * eyeOffset,
      head.position.y + Math.sin(eyeAngle2) * eyeOffset,
      3, 0, Math.PI * 2
    );
    ctx.fill();

    // Pupilles
    ctx.fillStyle = '#0F0F1A';
    
    ctx.beginPath();
    ctx.arc(
      head.position.x + Math.cos(eyeAngle1) * (eyeOffset + 1),
      head.position.y + Math.sin(eyeAngle1) * (eyeOffset + 1),
      1.5, 0, Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      head.position.x + Math.cos(eyeAngle2) * (eyeOffset + 1),
      head.position.y + Math.sin(eyeAngle2) * (eyeOffset + 1),
      1.5, 0, Math.PI * 2
    );
    ctx.fill();
  }
}
