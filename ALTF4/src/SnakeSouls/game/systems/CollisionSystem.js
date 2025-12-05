// Système de gestion des collisions
export default class CollisionSystem {
  /**
   * Vérifier la collision avec les déchets et retourner les déchets ramassés
   * @param {Object} playerPos - Position du joueur {x, y}
   * @param {Array} wastes - Liste des déchets
   * @param {number} pickupDistance - Distance de ramassage
   * @returns {Object} - {pickedWastes: Array, remainingWastes: Array}
   */
  static checkWasteCollision(playerPos, wastes, pickupDistance) {
    const pickedWastes = [];
    const remainingWastes = [];

    wastes.forEach(waste => {
      const dx = waste.x - playerPos.x;
      const dy = waste.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < pickupDistance) {
        pickedWastes.push(waste);
      } else {
        remainingWastes.push(waste);
      }
    });

    return { pickedWastes, remainingWastes };
  }

  /**
   * Vérifier la collision avec soi-même
   * @param {Object} playerPos - Position du joueur {x, y}
   * @param {Array} segments - Liste des segments
   * @param {Array} positionHistory - Historique des positions
   * @param {number} currentSpacing - Espacement actuel
   * @param {number} segmentSize - Taille des segments
   * @param {number} skipSegments - Nombre de segments à ignorer (cou)
   * @returns {number|null} - Index du segment touché ou null
   */
  static checkSelfCollision(playerPos, segments, positionHistory, currentSpacing, segmentSize, skipSegments = 5) {
    const headRadius = 15;
    const segmentRadius = segmentSize / 2;

    for (let i = skipSegments; i < segments.length; i++) {
      // Calculer la position du segment
      let distanceNeeded = (i + 1) * currentSpacing;
      let accumulatedDistance = 0;
      let segmentPos = null;

      for (let j = 1; j < positionHistory.length; j++) {
        const prev = positionHistory[j - 1];
        const curr = positionHistory[j];
        
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const segmentDist = Math.sqrt(dx * dx + dy * dy);
        
        accumulatedDistance += segmentDist;
        
        if (accumulatedDistance >= distanceNeeded) {
          segmentPos = curr;
          break;
        }
      }

      if (segmentPos) {
        const dx = playerPos.x - segmentPos.x;
        const dy = playerPos.y - segmentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Collision détectée
        if (distance < headRadius + segmentRadius) {
          return i; // Retourner l'index du segment touché
        }
      }
    }

    return null; // Pas de collision
  }
}

