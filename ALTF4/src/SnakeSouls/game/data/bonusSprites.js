/**
 * Système de chargement des sprites de bonus
 */

import birdSprite from '../../assets/sprites/bonus/bird.png';
import ubuntuSprite from '../../assets/sprites/bonus/ubuntu.png';
import fedoraSprite from '../../assets/sprites/bonus/fedora.png';
import debianSprite from '../../assets/sprites/bonus/debian.png';
import archSprite from '../../assets/sprites/bonus/arch.png';
import mintSprite from '../../assets/sprites/bonus/mint.png';
import linuxSprite from '../../assets/sprites/bonus/linux.png';
import { BONUSES, BONUS_SPAWN_RATES } from './bonuses.js';

// Mapping des sprites par ID
const SPRITE_MAP = {
    bird: birdSprite,
    ubuntu: ubuntuSprite,
    fedora: fedoraSprite,
    debian: debianSprite,
    arch: archSprite,
    mint: mintSprite,
    linux: linuxSprite
};

/**
 * Classe pour gérer les sprites de bonus
 */
class BonusSpriteLoader {
    constructor() {
        this.sprites = [];
        this.loaded = false;
    }

    /**
     * Charger tous les sprites de bonus
     */
    async loadAll() {
        if (this.loaded) return;

        // Créer un sprite pour chaque bonus avec sa propre image
        this.sprites = BONUSES.map(bonusData => ({
            id: bonusData.id,
            name: bonusData.name,
            src: SPRITE_MAP[bonusData.id],
            type: 'image',
            data: bonusData
        }));

        this.loaded = true;
    }

    /**
     * Obtenir un sprite de bonus aléatoire selon les probabilités
     */
    getRandomSprite() {
        if (this.sprites.length === 0) return null;

        // Utiliser les probabilités définies dans bonuses.js
        const random = Math.random() * 100;
        let cumulative = 0;

        for (const sprite of this.sprites) {
            const bonusId = sprite.id;
            const spawnRate = this.getBonusSpawnRate(bonusId);
            cumulative += spawnRate;

            if (random <= cumulative) {
                return sprite;
            }
        }

        // Fallback au premier sprite
        return this.sprites[0];
    }

    /**
     * Obtenir le taux de spawn d'un bonus
     */
    getBonusSpawnRate(bonusId) {
        return BONUS_SPAWN_RATES[bonusId] || 10;
    }

    /**
     * Obtenir un sprite par ID
     */
    getSpriteById(id) {
        return this.sprites.find(s => s.id === id);
    }

    /**
     * Obtenir tous les sprites
     */
    getAllSprites() {
        return this.sprites;
    }
}

// Export singleton
export const bonusSpriteLoader = new BonusSpriteLoader();
