/**
 * EnemyAI.js
 *
 * Système d'IA modulaire pour les ennemis.
 * Définit différents profils de comportement.
 */

// ============================================
// PROFILS D'IA (12 comportements différents)
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
    speedModifier: 1.0,
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
    speedModifier: 1.1,
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
    speedModifier: 0.9,
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
    speedModifier: 1.0,
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
    speedModifier: 1.3,
  },

  // Stalker : Suit le joueur à distance
  stalker: {
    id: 'stalker',
    name: 'Stalker',
    description: 'Suit le joueur en gardant ses distances',
    aggressiveness: 0.4,
    huntingPriority: 0.3,
    blockingPriority: 0.9,
    evadePriority: 0.5,
    decisionInterval: 0.35,
    lookAheadDistance: 150,
    collisionAvoidanceRadius: 50,
    speedModifier: 1.05,
    followDistance: 200, // Distance idéale du joueur
  },

  // Interceptor : Prédit et coupe la route
  interceptor: {
    id: 'interceptor',
    name: 'Intercepteur',
    description: 'Anticipe les mouvements et coupe la route',
    aggressiveness: 0.7,
    huntingPriority: 0.4,
    blockingPriority: 1.0,
    evadePriority: 0.4,
    decisionInterval: 0.25,
    lookAheadDistance: 200,
    collisionAvoidanceRadius: 35,
    speedModifier: 1.2,
    predictionDistance: 300, // Distance de prédiction
  },

  // Berserker : Devient plus agressif quand blessé
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    description: 'Plus agressif quand il a peu de segments',
    aggressiveness: 0.6,
    huntingPriority: 0.7,
    blockingPriority: 0.8,
    evadePriority: 0.3,
    decisionInterval: 0.3,
    lookAheadDistance: 70,
    collisionAvoidanceRadius: 25,
    speedModifier: 1.15,
    berserkThreshold: 2, // Active le mode berserk sous ce nombre de segments
  },

  // Flanker : Attaque par les côtés
  flanker: {
    id: 'flanker',
    name: 'Flanker',
    description: 'Attaque par les côtés',
    aggressiveness: 0.65,
    huntingPriority: 0.5,
    blockingPriority: 0.85,
    evadePriority: 0.6,
    decisionInterval: 0.35,
    lookAheadDistance: 100,
    collisionAvoidanceRadius: 40,
    speedModifier: 1.1,
    flankAngle: Math.PI / 2, // 90 degrés
  },

  // Swarm : Suit les autres ennemis
  swarm: {
    id: 'swarm',
    name: 'Essaim',
    description: 'Se déplace en groupe avec les autres',
    aggressiveness: 0.45,
    huntingPriority: 0.6,
    blockingPriority: 0.5,
    evadePriority: 0.7,
    decisionInterval: 0.4,
    lookAheadDistance: 80,
    collisionAvoidanceRadius: 50,
    speedModifier: 1.0,
    swarmRadius: 150, // Rayon pour trouver les alliés
  },

  // Ambusher : Attend et attaque soudainement
  ambusher: {
    id: 'ambusher',
    name: 'Embusqué',
    description: 'Attend puis attaque soudainement',
    aggressiveness: 0.9,
    huntingPriority: 0.8,
    blockingPriority: 0.7,
    evadePriority: 0.5,
    decisionInterval: 0.5,
    lookAheadDistance: 60,
    collisionAvoidanceRadius: 35,
    speedModifier: 0.8, // Lent normalement
    ambushSpeedBoost: 1.8, // Boost quand attaque
    ambushRange: 250, // Distance pour déclencher l'embuscade
  },

  // Erratic : Mouvements imprévisibles
  erratic: {
    id: 'erratic',
    name: 'Erratique',
    description: 'Mouvements imprévisibles et chaotiques',
    aggressiveness: 0.55,
    huntingPriority: 0.6,
    blockingPriority: 0.6,
    evadePriority: 0.4,
    decisionInterval: 0.15, // Décisions très rapides
    lookAheadDistance: 50,
    collisionAvoidanceRadius: 30,
    speedModifier: 1.1,
    erraticChance: 0.3, // Chance de mouvement aléatoire
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

/**
 * Récupère un profil agressif aléatoire (pour les niveaux difficiles)
 */
export function getAggressiveAIProfile() {
  const aggressiveProfiles = ['aggressive', 'kamikaze', 'interceptor', 'berserker', 'ambusher'];
  const randomIndex = Math.floor(Math.random() * aggressiveProfiles.length);
  return AI_PROFILES[aggressiveProfiles[randomIndex]];
}

// ============================================
// CLASSE ENEMY AI
// ============================================
export class EnemyAI {
  constructor(enemy, profile = null) {
    this.enemy = enemy;
    this.profile = profile || getRandomAIProfile();

    // État de l'IA
    this.state = 'hunting'; // 'hunting' | 'blocking' | 'evading' | 'ambushing' | 'flanking'
    this.stateTimer = 0;
    this.targetWaste = null;
    this.targetPlayer = null;

    // États spéciaux
    this.isAmbushing = false;
    this.ambushTimer = 0;
    this.lastErraticAngle = 0;

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

    // Comportements spéciaux basés sur le profil
    this.updateSpecialBehaviors(deltaTime, gameState);

    if (this.stateTimer >= this.decisionInterval) {
      this.stateTimer = 0;
      this.makeDecision(wastes, playerPos, playerSegments, otherEnemies);
    }

    // Vérifier les collisions imminentes
    if (this.shouldEvade(otherEnemies)) {
      this.state = 'evading';
    }

    // Exécuter le comportement
    return this.executeBehavior(deltaTime, wastes, playerPos, otherEnemies);
  }

  /**
   * Met à jour les comportements spéciaux
   */
  updateSpecialBehaviors(deltaTime, gameState) {
    const profile = this.profile;
    const { playerPos } = gameState;

    // Berserker mode
    if (profile.id === 'berserker') {
      if (this.enemy.segments.length <= (profile.berserkThreshold || 2)) {
        this.profile = { ...profile, aggressiveness: 1.0, speedModifier: 1.4 };
      }
    }

    // Ambusher mode
    if (profile.id === 'ambusher') {
      const distToPlayer = this.distanceTo(playerPos.x, playerPos.y);
      if (!this.isAmbushing && distToPlayer < (profile.ambushRange || 250)) {
        this.isAmbushing = true;
        this.ambushTimer = 2; // 2 secondes de boost
      }
      if (this.isAmbushing) {
        this.ambushTimer -= deltaTime;
        if (this.ambushTimer <= 0) {
          this.isAmbushing = false;
        }
      }
    }
  }

  /**
   * Prend une décision basée sur le profil
   */
  makeDecision(wastes, playerPos, playerSegments, otherEnemies) {
    const enemy = this.enemy;
    const profile = this.profile;
    const distToPlayer = this.distanceTo(playerPos.x, playerPos.y);

    // Score pour chaque action
    let huntScore = profile.huntingPriority;
    let blockScore = profile.blockingPriority;

    // Ajuster selon la situation
    if (enemy.segments.length < 3) {
      huntScore *= 1.5;
      blockScore *= 0.3;
    }

    if (distToPlayer < 300) {
      blockScore *= 1.5;
    }

    if (distToPlayer > 600) {
      blockScore *= 0.2;
    }

    // Aléatoire basé sur l'agressivité
    const aggroRoll = Math.random();
    if (aggroRoll < profile.aggressiveness) {
      blockScore *= 1.3;
    }

    // Comportements spéciaux par profil
    if (profile.id === 'stalker') {
      // Maintenir une distance
      if (distToPlayer < (profile.followDistance || 200)) {
        this.state = 'evading';
        return;
      }
      blockScore *= 1.2;
    }

    if (profile.id === 'flanker') {
      this.state = 'flanking';
      this.targetPlayer = playerPos;
      return;
    }

    if (profile.id === 'swarm' && otherEnemies && otherEnemies.length > 0) {
      // Suivre les autres ennemis
      const nearbyEnemy = this.findNearbyAlly(otherEnemies);
      if (nearbyEnemy && Math.random() < 0.5) {
        this.targetWaste = { x: nearbyEnemy.x, y: nearbyEnemy.y };
        this.state = 'hunting';
        return;
      }
    }

    if (profile.id === 'erratic' && Math.random() < (profile.erraticChance || 0.3)) {
      this.lastErraticAngle = Math.random() * Math.PI * 2;
      this.state = 'erratic';
      return;
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
   * Trouve un allié proche (pour swarm)
   */
  findNearbyAlly(otherEnemies) {
    const swarmRadius = this.profile.swarmRadius || 150;
    let closest = null;
    let closestDist = Infinity;

    for (const other of otherEnemies) {
      if (!other.alive) continue;
      const dist = this.distanceTo(other.x, other.y);
      if (dist < swarmRadius && dist < closestDist) {
        closestDist = dist;
        closest = other;
      }
    }

    return closest;
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
  executeBehavior(deltaTime, wastes, playerPos, otherEnemies) {
    switch (this.state) {
      case 'hunting':
        return this.hunt(deltaTime);
      case 'blocking':
        return this.block(deltaTime, playerPos);
      case 'evading':
        return this.evade(deltaTime);
      case 'flanking':
        return this.flank(deltaTime, playerPos);
      case 'erratic':
        return this.erraticMove(deltaTime);
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

    const profile = this.profile;

    // Intercepteur : prédit plus loin
    let predictDistance = 150 + this.enemy.segments.length * 10;
    if (profile.id === 'interceptor') {
      predictDistance = profile.predictionDistance || 300;
    }

    const targetX = playerPos.x + Math.cos(playerPos.angle || 0) * predictDistance;
    const targetY = playerPos.y + Math.sin(playerPos.angle || 0) * predictDistance;

    return Math.atan2(targetY - this.enemy.y, targetX - this.enemy.x);
  }

  /**
   * Comportement de flanking (attaque par le côté)
   */
  flank(deltaTime, playerPos) {
    if (!playerPos) return null;

    const flankAngle = this.profile.flankAngle || Math.PI / 2;
    const playerAngle = playerPos.angle || 0;

    // Alterner entre gauche et droite
    const side = Math.sin(Date.now() / 1000) > 0 ? 1 : -1;
    const targetAngle = playerAngle + (flankAngle * side);

    const distance = 150;
    const targetX = playerPos.x + Math.cos(targetAngle) * distance;
    const targetY = playerPos.y + Math.sin(targetAngle) * distance;

    return Math.atan2(targetY - this.enemy.y, targetX - this.enemy.x);
  }

  /**
   * Mouvement erratique
   */
  erraticMove(deltaTime) {
    return this.lastErraticAngle;
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
   * Retourne le modificateur de vitesse actuel
   */
  getSpeedModifier() {
    const profile = this.profile;

    // Ambusher boost
    if (profile.id === 'ambusher' && this.isAmbushing) {
      return profile.ambushSpeedBoost || 1.8;
    }

    return profile.speedModifier || 1.0;
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
