/**
 * EnemySnake.js
 *
 * Snake ennemi contrôlé par l'IA.
 *
 * Comportement :
 * - Se déplace vers les déchets pour les consommer et grandir
 * - Essaie de bloquer le joueur quand il est assez grand
 * - Évite de se mordre lui-même et les autres ennemis
 */

import { ENEMY_TYPES, loadEnemySprite, calculateEnemySpeed } from '../data/enemySprites.js';
import { EnemyAI, getRandomAIProfile } from '../ai/EnemyAI.js';

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

    // IA - Utilise le nouveau système modulaire
    const aiProfile = options.aiProfile || getRandomAIProfile();
    this.ai = new EnemyAI(this, aiProfile);

    // Stats
    this.alive = true;
    this.headSize = 20;

    // Croissance exponentielle - plus le temps passe, plus ils grandissent vite
    this.growthMultiplier = 1; // Sera mis à jour par DifficultySystem
  }

  /**
   * Met à jour l'ennemi
   */
  update(deltaTime, gameState, speedMultiplier = 1) {
    if (!this.alive) return;

    // Déléguer la logique de décision à l'IA
    const targetAngle = this.ai.update(deltaTime, gameState);

    // Si l'IA retourne un angle, tourner vers celui-ci
    if (targetAngle !== null) {
      this.turnTowards(targetAngle, deltaTime);
    } else {
      // Mode évitement : tourner aléatoirement
      this.evade(deltaTime);
    }

    // Déplacer le snake (avec le multiplicateur de vitesse)
    this.move(deltaTime, speedMultiplier);

    // Vérifier la collision avec soi-même après le déplacement
    this.checkSelfCollision();

    // Sauvegarder l'historique des positions
    this.positionHistory.unshift({ x: this.x, y: this.y, angle: this.angle });

    // Limiter l'historique
    const maxHistory = Math.ceil((this.segments.length + 1) * this.segmentSpacing * 1.5) + 100;
    if (this.positionHistory.length > maxHistory) {
      this.positionHistory.pop();
    }
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
  move(deltaTime, speedMultiplier = 1) {
    const effectiveSpeed = this.speed * speedMultiplier;
    this.x += Math.cos(this.angle) * effectiveSpeed * deltaTime;
    this.y += Math.sin(this.angle) * effectiveSpeed * deltaTime;
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
   * Avec croissance exponentielle basée sur growthMultiplier
   */
  addSegment() {
    // Ajouter plusieurs segments selon le multiplicateur de croissance
    const segmentsToAdd = Math.max(1, Math.floor(this.growthMultiplier));
    for (let i = 0; i < segmentsToAdd; i++) {
      this.segments.push({
        image: this.segmentImage
      });
    }
  }

  /**
   * Met à jour le multiplicateur de croissance depuis DifficultySystem
   */
  setGrowthMultiplier(multiplier) {
    this.growthMultiplier = multiplier;
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
   * Prédit si on va se mordre dans les prochaines frames
   * @returns {boolean} true si collision imminente
   */
  willCollideWithSelf() {
    if (this.segments.length < 3) return false;

    // Prédire la position future (dans ~0.3 secondes)
    const lookAhead = 60; // pixels devant
    const futureX = this.x + Math.cos(this.angle) * lookAhead;
    const futureY = this.y + Math.sin(this.angle) * lookAhead;

    // Vérifier la distance avec chaque segment (en ignorant les premiers)
    const segmentPositions = this.getSegmentPositions();
    const collisionRadius = this.segmentSize * 0.8;

    for (let i = 2; i < segmentPositions.length; i++) {
      const seg = segmentPositions[i];
      const dx = futureX - seg.x;
      const dy = futureY - seg.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < collisionRadius) {
        return true;
      }
    }

    return false;
  }

  /**
   * Vérifie la collision avec soi-même et coupe si nécessaire
   */
  checkSelfCollision() {
    if (this.segments.length < 4) return;

    const segmentPositions = this.getSegmentPositions();
    const collisionRadius = this.segmentSize * 0.5;

    // Ignorer les 3 premiers segments (trop proches de la tête)
    for (let i = 3; i < segmentPositions.length; i++) {
      const seg = segmentPositions[i];
      const dx = this.x - seg.x;
      const dy = this.y - seg.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < collisionRadius) {
        // Couper le serpent à cet endroit
        this.segments = this.segments.slice(0, i);
        return;
      }
    }
  }

  /**
   * Prédit si on va rentrer dans un autre ennemi
   * @param {Array} otherEnemies - Liste des autres ennemis
   * @returns {boolean} true si collision imminente
   */
  willCollideWithOtherEnemy(otherEnemies) {
    if (!otherEnemies || otherEnemies.length === 0) return false;

    // Prédire la position future
    const lookAhead = 80; // pixels devant
    const futureX = this.x + Math.cos(this.angle) * lookAhead;
    const futureY = this.y + Math.sin(this.angle) * lookAhead;

    const collisionRadius = 40;

    for (const enemy of otherEnemies) {
      if (!enemy.alive) continue;

      // Vérifier collision avec la tête de l'autre ennemi
      const headDist = Math.sqrt(
        Math.pow(futureX - enemy.x, 2) +
        Math.pow(futureY - enemy.y, 2)
      );

      if (headDist < collisionRadius) {
        return true;
      }

      // Vérifier collision avec les segments de l'autre ennemi
      const segments = enemy.getSegmentPositions();
      for (const seg of segments) {
        const dist = Math.sqrt(
          Math.pow(futureX - seg.x, 2) +
          Math.pow(futureY - seg.y, 2)
        );

        if (dist < collisionRadius) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Tue l'ennemi
   */
  kill() {
    this.alive = false;
  }
}

export default EnemySnake;