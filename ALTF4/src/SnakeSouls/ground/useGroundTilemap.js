/**
 * useGroundTilemap.js
 * 
 * Hook React pour utiliser le GroundTilemap.
 * Gère le chargement des textures et l'instance.
 * 
 * Usage:
 * const { ground, isLoading, error } = useGroundTilemap({
 *   textures: ['/textures/concrete_01.jpg', '/textures/concrete_02.jpg'],
 *   tileSize: 128
 * });
 */

import { useState, useEffect, useRef } from 'react';
import { GroundTilemap } from './GroundTilemap';

export function useGroundTilemap(options = {}) {
  const {
    textures = [],      // URLs des textures
    tileSize = 128,     // Taille d'une tile
    chunkSize = 8,      // Tiles par chunk
    seed = null         // Seed pour la génération (null = aléatoire)
  } = options;

  const groundRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Créer l'instance
    groundRef.current = new GroundTilemap({
      tileSize,
      chunkSize,
      seed: seed || Math.floor(Math.random() * 1000000)
    });

    // Charger les textures si fournies
    if (textures.length > 0) {
      setIsLoading(true);
      setError(null);

      groundRef.current.loadTextures(textures)
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      // Pas de textures, utiliser le fallback
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (groundRef.current) {
        groundRef.current.chunks.clear();
      }
    };
  }, [textures.join(','), tileSize, chunkSize, seed]);

  return {
    ground: groundRef.current,
    isLoading,
    error
  };
}

export default useGroundTilemap;
