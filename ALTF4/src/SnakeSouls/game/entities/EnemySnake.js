/**
 * EnemySnake.js
 *
 * Snake ennemi contrôlé par l'IA.
 *
 * Comportement :
 * - Se déplace vers les déchets pour les consommer et grandir
 * - Essaie de bloquer le joueur quand il est assez grand
 * - Évite de se mordre lui-même
 */

import { ENEMY_TYPES, loadEnemySprite, calculateEnemySpeed } from '../data/enemySprites.js';

export class EnemySnake {
  constructor(options = {}) {
    // Type d'ennemi
    this.type = options.type || ENEMY_TYPES.chrome;
    this.id = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Position et mouvement
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.angle = options.angle || Math.random() * Math.PI * 2;
    this.speed = calculateEnemySpeed(); // Vitesse aléatoire basée sur la difficulté
    this.rotationSpeed = 3.5; // Plus réactif

    // Segments (queue)
    this.segments = [];
    this.positionHistory = [];
    this.segmentSpacing = 35;
    this.segmentSize = 30;

    // Sprite
    this.headImage = loadEnemySprite(this.type.id);
    this.segmentImage = loadEnemySprite(this.type.id);

    // IA
    this.aggressiveness = this.type.aggressiveness || 0.5;
    this.targetWaste = null;
    this.targetPlayer = null;
    this.aiState = 'hunting'; // 'hunting' | 'blocking' | 'evading'
    this.stateTimer = 0;
    this.decisionInterval = 0.5; // Prendre une décision toutes les 0.5s

    // Stats
    this.alive = true;
    this.headSize = 20;
  }

  /**
   * Met à jour l'ennemi
   */
  update(deltaTime, gameState) {
    if (!this.alive) return;

    const { wastes, playerPos, playerSegments } = gameState;

    // Timer pour les décisions IA
    this.stateTimer += deltaTime;

    if (this.stateTimer >= this.decisionInterval) {
      this.stateTimer = 0;
      this.makeDecision(wastes, playerPos, playerSegments);
    }

    // Exécuter le comportement selon l'état
    this.executeBehavior(deltaTime, wastes, playerPos);

    // Déplacer le snake
    this.move(deltaTime);

    // Sauvegarder l'historique des positions
    this.positionHistory.unshift({ x: this.x, y: this.y, angle: this.angle });

    // Limiter l'historique
    const maxHistory = Math.ceil((this.segments.length + 1) * this.segmentSpacing * 1.5) + 100;
    if (this.positionHistory.length > maxHistory) {
      this.positionHistory.pop();
    }
  }

  /**
   * Prend une décision IA
   */
  makeDecision(wastes, playerPos, playerSegments) {
    const distToPlayer = this.distanceTo(playerPos.x, playerPos.y);

    // Si on a assez de segments et qu'on est agressif, essayer de bloquer le joueur
    if (this.segments.length >= 5 && Math.random() < this.aggressiveness && distToPlayer < 500) {
      this.aiState = 'blocking';
      this.targetPlayer = playerPos;
    }
    // Sinon, chasser les déchets
    else {
      this.aiState = 'hunting';
      this.targetWaste = this.findNearestWaste(wastes);
    }
  }

  /**
   * Exécute le comportement selon l'état
   */
  executeBehavior(deltaTime, wastes, playerPos) {
    switch (this.aiState) {
      case 'hunting':
        this.huntWaste(deltaTime);
        break;
      case 'blocking':
        this.blockPlayer(deltaTime, playerPos);
        break;
      case 'evading':
        this.evade(deltaTime);
        break;
    }
  }

  /**
   * Chasse le déchet le plus proche
   */
  huntWaste(deltaTime) {
    if (!this.targetWaste) return;

    const targetAngle = Math.atan2(
      this.targetWaste.y - this.y,
      this.targetWaste.x - this.x
    );

    this.turnTowards(targetAngle, deltaTime);
  }

  /**
   * Essaie de bloquer le joueur en se mettant devant lui
   */
  blockPlayer(deltaTime, playerPos) {
    if (!playerPos) return;

    // Prédire où le joueur va aller (devant lui)
    const predictDistance = 200;
    const targetX = playerPos.x + Math.cos(playerPos.angle || 0) * predictDistance;
    const targetY = playerPos.y + Math.sin(playerPos.angle || 0) * predictDistance;

    const targetAngle = Math.atan2(targetY - this.y, targetX - this.x);
    this.turnTowards(targetAngle, deltaTime);
  }

  /**
   * Évite un danger
   */
  evade(deltaTime) {
    // Tourner aléatoirement pour éviter
    this.angle += (Math.random() - 0.5) * this.rotationSpeed * deltaTime;
  }

  /**
   * Tourne progressivement vers un angle cible
   */
  turnTowards(targetAngle, deltaTime) {
    let angleDiff = targetAngle - this.angle;

    // Normaliser l'angle entre -PI et PI
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // Tourner progressivement
    const maxTurn = this.rotationSpeed * deltaTime;
    if (Math.abs(angleDiff) < maxTurn) {
      this.angle = targetAngle;
    } else if (angleDiff > 0) {
      this.angle += maxTurn;
    } else {
      this.angle -= maxTurn;
    }
  }

  /**
   * Déplace le snake
   */
  move(deltaTime) {
    this.x += Math.cos(this.angle) * this.speed * deltaTime;
    this.y += Math.sin(this.angle) * this.speed * deltaTime;
  }

  /**
   * Trouve le déchet le plus proche
   */
  findNearestWaste(wastes) {
    if (!wastes || wastes.length === 0) return null;

    let nearest = null;
    let nearestDist = Infinity;

    wastes.forEach(waste => {
      const dist = this.distanceTo(waste.x, waste.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = waste;
      }
    });

    return nearest;
  }

  /**
   * Distance jusqu'à un point
   */
  distanceTo(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Ajoute un segment (quand il mange un déchet)
   */
  addSegment() {
    this.segments.push({
      image: this.segmentImage
    });
  }

  /**
   * Vérifie la collision avec un déchet
   */
  checkWasteCollision(wastes, pickupDistance = 35) {
    const picked = [];
    const remaining = [];

    wastes.forEach(waste => {
      if (this.distanceTo(waste.x, waste.y) < pickupDistance) {
        picked.push(waste);
        this.addSegment();
      } else {
        remaining.push(waste);
      }
    });

    return { picked, remaining };
  }

  /**
   * Calcule les positions des segments
   */
  getSegmentPositions() {
    const positions = [];

    this.segments.forEach((segment, index) => {
      const distanceNeeded = (index + 1) * this.segmentSpacing;
      let accumulatedDistance = 0;
      let pos = null;

      for (let i = 1; i < this.positionHistory.length; i++) {
        const prev = this.positionHistory[i - 1];
        const curr = this.positionHistory[i];

        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const segmentDist = Math.sqrt(dx * dx + dy * dy);

        accumulatedDistance += segmentDist;

        if (accumulatedDistance >= distanceNeeded) {
          pos = curr;
          break;
        }
      }

      if (!pos && this.positionHistory.length > 0) {
        pos = this.positionHistory[this.positionHistory.length - 1];
      }

      if (pos) {
        positions.push({ ...pos, segment });
      }
    });

    return positions;
  }

  /**
   * Dessine l'ennemi
   */
  render(ctx, camera) {
    if (!this.alive) return;

    // Dessiner les segments
    const segmentPositions = this.getSegmentPositions();

    segmentPositions.forEach(({ x, y, segment }) => {
      const screenPos = camera.worldToScreen(x, y);

      if (segment.image && segment.image.complete) {
        ctx.drawImage(
          segment.image,
          screenPos.x - this.segmentSize / 2,
          screenPos.y - this.segmentSize / 2,
          this.segmentSize,
          this.segmentSize
        );
      } else {
        // Fallback : cercle coloré
        ctx.fillStyle = this.type.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, this.segmentSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Dessiner la tête
    const headScreen = camera.worldToScreen(this.x, this.y);

    ctx.save();
    ctx.translate(headScreen.x, headScreen.y);
    ctx.rotate(this.angle);

    if (this.headImage && this.headImage.complete) {
      ctx.drawImage(
        this.headImage,
        -this.headSize,
        -this.headSize,
        this.headSize * 2,
        this.headSize * 2
      );
    } else {
      // Fallback : triangle coloré
      ctx.fillStyle = this.type.color;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-10, -12);
      ctx.lineTo(-10, 12);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Tue l'ennemi
   */
  kill() {
    this.alive = false;
  }
}

export default EnemySnake;