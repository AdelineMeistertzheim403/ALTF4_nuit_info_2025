/**
 * EnemyAI.js
 *
 * Système d'IA modulaire pour les ennemis.
 * Définit différents profils de comportement.
 */

// ============================================
// PROFILS D'IA
// ============================================
export const AI_PROFILES = {
  // Chasseur : Focus sur la collecte de déchets
  hunter: {
    id: 'hunter',
    name: 'Chasseur',
    description: 'Se concentre sur la collecte de déchets',
    aggressiveness: 0.2,
    huntingPriority: 1.0,
    blockingPriority: 0.2,
    evadePriority: 0.8,
    decisionInterval: 0.4,
    lookAheadDistance: 60,
    collisionAvoidanceRadius: 40,
  },

  // Agressif : Cherche à bloquer le joueur
  aggressive: {
    id: 'aggressive',
    name: 'Agressif',
    description: 'Cherche activement à bloquer le joueur',
    aggressiveness: 0.8,
    huntingPriority: 0.5,
    blockingPriority: 1.0,
    evadePriority: 0.6,
    decisionInterval: 0.3,
    lookAheadDistance: 100,
    collisionAvoidanceRadius: 30,
  },

  // Prudent : Évite les dangers, collecte prudemment
  cautious: {
    id: 'cautious',
    name: 'Prudent',
    description: 'Évite les dangers et collecte prudemment',
    aggressiveness: 0.1,
    huntingPriority: 0.7,
    blockingPriority: 0.1,
    evadePriority: 1.0,
    decisionInterval: 0.6,
    lookAheadDistance: 120,
    collisionAvoidanceRadius: 60,
  },

  // Opportuniste : S'adapte à la situation
  opportunist: {
    id: 'opportunist',
    name: 'Opportuniste',
    description: "S'adapte selon la situation",
    aggressiveness: 0.5,
    huntingPriority: 0.8,
    blockingPriority: 0.6,
    evadePriority: 0.7,
    decisionInterval: 0.5,
    lookAheadDistance: 80,
    collisionAvoidanceRadius: 45,
  },

  // Kamikaze : Fonce dans le tas sans trop réfléchir
  kamikaze: {
    id: 'kamikaze',
    name: 'Kamikaze',
    description: 'Fonce sans réfléchir',
    aggressiveness: 1.0,
    huntingPriority: 0.6,
    blockingPriority: 1.0,
    evadePriority: 0.2,
    decisionInterval: 0.2,
    lookAheadDistance: 40,
    collisionAvoidanceRadius: 20,
  },
};

// Liste des profils pour accès facile
export const AI_PROFILE_IDS = Object.keys(AI_PROFILES);

/**
 * Récupère un profil AI aléatoire
 */
export function getRandomAIProfile() {
  const randomIndex = Math.floor(Math.random() * AI_PROFILE_IDS.length);
  return AI_PROFILES[AI_PROFILE_IDS[randomIndex]];
}

// ============================================
// CLASSE ENEMY AI
// ============================================
export class EnemyAI {
  constructor(enemy, profile = null) {
    this.enemy = enemy;
    this.profile = profile || getRandomAIProfile();

    // État de l'IA
    this.state = 'hunting'; // 'hunting' | 'blocking' | 'evading'
    this.stateTimer = 0;
    this.targetWaste = null;
    this.targetPlayer = null;

    // Appliquer le profil
    this.applyProfile(this.profile);
  }

  /**
   * Applique un profil à l'IA
   */
  applyProfile(profile) {
    this.profile = profile;
    this.decisionInterval = profile.decisionInterval;
    this.lookAheadDistance = profile.lookAheadDistance;
    this.collisionAvoidanceRadius = profile.collisionAvoidanceRadius;
  }

  /**
   * Met à jour l'IA
   */
  update(deltaTime, gameState) {
    const { wastes, playerPos, playerSegments, otherEnemies } = gameState;

    // Timer pour les décisions
    this.stateTimer += deltaTime;

    if (this.stateTimer >= this.decisionInterval) {
      this.stateTimer = 0;
      this.makeDecision(wastes, playerPos, playerSegments);
    }

    // Vérifier les collisions imminentes
    if (this.shouldEvade(otherEnemies)) {
      this.state = 'evading';
    }

    // Exécuter le comportement
    return this.executeBehavior(deltaTime, wastes, playerPos);
  }

  /**
   * Prend une décision basée sur le profil
   */
  makeDecision(wastes, playerPos, playerSegments) {
    const enemy = this.enemy;
    const profile = this.profile;
    const distToPlayer = this.distanceTo(playerPos.x, playerPos.y);

    // Score pour chaque action
    let huntScore = profile.huntingPriority;
    let blockScore = profile.blockingPriority;

    // Ajuster selon la situation
    if (enemy.segments.length < 3) {
      // Pas assez de segments, priorité à la chasse
      huntScore *= 1.5;
      blockScore *= 0.3;
    }

    if (distToPlayer < 300) {
      // Joueur proche, potentiel blocage
      blockScore *= 1.5;
    }

    if (distToPlayer > 600) {
      // Joueur loin, pas la peine de bloquer
      blockScore *= 0.2;
    }

    // Aléatoire basé sur l'agressivité
    const aggroRoll = Math.random();
    if (aggroRoll < profile.aggressiveness) {
      blockScore *= 1.3;
    }

    // Choisir l'action
    if (enemy.segments.length >= 3 && blockScore > huntScore && distToPlayer < 500) {
      this.state = 'blocking';
      this.targetPlayer = playerPos;
    } else {
      this.state = 'hunting';
      this.targetWaste = this.findBestWaste(wastes, playerPos);
    }
  }

  /**
   * Vérifie si l'ennemi doit éviter un danger
   */
  shouldEvade(otherEnemies) {
    const enemy = this.enemy;
    const profile = this.profile;

    // Vérifier collision avec soi-même
    if (this.willCollideWithSelf()) {
      return true;
    }

    // Vérifier collision avec autres ennemis (selon le profil)
    if (otherEnemies && Math.random() < profile.evadePriority) {
      if (this.willCollideWithOthers(otherEnemies)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Prédit collision avec soi-même
   */
  willCollideWithSelf() {
    const enemy = this.enemy;
    if (enemy.segments.length < 3) return false;

    const futureX = enemy.x + Math.cos(enemy.angle) * this.lookAheadDistance;
    const futureY = enemy.y + Math.sin(enemy.angle) * this.lookAheadDistance;

    const segmentPositions = enemy.getSegmentPositions();
    const collisionRadius = enemy.segmentSize * 0.8;

    for (let i = 2; i < segmentPositions.length; i++) {
      const seg = segmentPositions[i];
      const dist = Math.sqrt(
        Math.pow(futureX - seg.x, 2) + Math.pow(futureY - seg.y, 2)
      );
      if (dist < collisionRadius) return true;
    }

    return false;
  }

  /**
   * Prédit collision avec autres ennemis
   */
  willCollideWithOthers(otherEnemies) {
    const enemy = this.enemy;

    const futureX = enemy.x + Math.cos(enemy.angle) * this.lookAheadDistance;
    const futureY = enemy.y + Math.sin(enemy.angle) * this.lookAheadDistance;

    for (const other of otherEnemies) {
      if (!other.alive) continue;

      // Tête de l'autre ennemi
      const headDist = Math.sqrt(
        Math.pow(futureX - other.x, 2) + Math.pow(futureY - other.y, 2)
      );
      if (headDist < this.collisionAvoidanceRadius) return true;

      // Segments de l'autre ennemi
      const segments = other.getSegmentPositions();
      for (const seg of segments) {
        const dist = Math.sqrt(
          Math.pow(futureX - seg.x, 2) + Math.pow(futureY - seg.y, 2)
        );
        if (dist < this.collisionAvoidanceRadius) return true;
      }
    }

    return false;
  }

  /**
   * Exécute le comportement actuel
   * @returns {number|null} L'angle cible ou null pour évitement
   */
  executeBehavior(deltaTime, wastes, playerPos) {
    switch (this.state) {
      case 'hunting':
        return this.hunt(deltaTime);
      case 'blocking':
        return this.block(deltaTime, playerPos);
      case 'evading':
        return this.evade(deltaTime);
      default:
        return null;
    }
  }

  /**
   * Comportement de chasse
   */
  hunt(deltaTime) {
    if (!this.targetWaste) return null;

    return Math.atan2(
      this.targetWaste.y - this.enemy.y,
      this.targetWaste.x - this.enemy.x
    );
  }

  /**
   * Comportement de blocage
   */
  block(deltaTime, playerPos) {
    if (!playerPos) return null;

    // Prédire où le joueur va
    const predictDistance = 150 + this.enemy.segments.length * 10;
    const targetX = playerPos.x + Math.cos(playerPos.angle || 0) * predictDistance;
    const targetY = playerPos.y + Math.sin(playerPos.angle || 0) * predictDistance;

    return Math.atan2(targetY - this.enemy.y, targetX - this.enemy.x);
  }

  /**
   * Comportement d'évitement
   */
  evade(deltaTime) {
    // Retourne null pour indiquer un évitement aléatoire
    return null;
  }

  /**
   * Trouve le meilleur déchet à cibler
   */
  findBestWaste(wastes, playerPos) {
    if (!wastes || wastes.length === 0) return null;

    const enemy = this.enemy;
    const profile = this.profile;

    let best = null;
    let bestScore = -Infinity;

    wastes.forEach(waste => {
      const distToEnemy = this.distanceTo(waste.x, waste.y);
      const distToPlayer = Math.sqrt(
        Math.pow(waste.x - playerPos.x, 2) + Math.pow(waste.y - playerPos.y, 2)
      );

      // Score basé sur la proximité
      let score = 1000 - distToEnemy;

      // Bonus si le déchet est loin du joueur (moins de compétition)
      if (profile.aggressiveness < 0.5) {
        score += distToPlayer * 0.5;
      }

      // Bonus si le déchet est proche du joueur (pour le gêner)
      if (profile.aggressiveness > 0.6) {
        score -= distToPlayer * 0.3;
      }

      if (score > bestScore) {
        bestScore = score;
        best = waste;
      }
    });

    return best;
  }

  /**
   * Distance depuis l'ennemi
   */
  distanceTo(x, y) {
    const dx = x - this.enemy.x;
    const dy = y - this.enemy.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Change le profil de l'IA
   */
  setProfile(profileId) {
    if (AI_PROFILES[profileId]) {
      this.applyProfile(AI_PROFILES[profileId]);
    }
  }
}

export default EnemyAI;