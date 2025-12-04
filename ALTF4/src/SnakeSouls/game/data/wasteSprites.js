/**
 * Liste des sprites de déchets disponibles
 * Ces déchets seront mangés par le snake et formeront sa queue
 *
 * Certains fichiers sont des spritesheets qu'on découpe
 */

// Import des spritesheets
import displaySheet from '../../assets/sprites/wastes/displays/display.png';
import electronics1Sheet from '../../assets/sprites/wastes/electronics/electronics1.png';
import electronics2Sheet from '../../assets/sprites/wastes/electronics/electronics2.png';

// Import des sprites individuels (hardware)
const hardwareModules = import.meta.glob('/src/SnakeSouls/assets/sprites/wastes/computer_hardware/separated/**/*.png', { eager: true });
export const HARDWARE_SPRITES = Object.values(hardwareModules).map(mod => mod.default);

// Configuration des spritesheets (positions des sprites dans chaque sheet)
export const SPRITESHEETS = {
    displays: {
        src: displaySheet,
        // Grille approximative basée sur l'image (5 colonnes, 4 lignes)
        sprites: [
            // Ligne 1
            { x: 0, y: 0, w: 48, h: 48 },
            { x: 48, y: 0, w: 32, h: 32 },
            { x: 80, y: 0, w: 48, h: 32 },
            { x: 128, y: 0, w: 32, h: 32 },
            { x: 160, y: 0, w: 48, h: 48 },
            { x: 208, y: 0, w: 32, h: 40 },
            // Ligne 2
            { x: 0, y: 56, w: 64, h: 56 },
            { x: 72, y: 56, w: 48, h: 48 },
            { x: 128, y: 48, w: 48, h: 48 },
            { x: 184, y: 48, w: 48, h: 48 },
            // Ligne 3
            { x: 0, y: 120, w: 48, h: 48 },
            { x: 56, y: 120, w: 48, h: 48 },
            { x: 112, y: 112, w: 40, h: 48 },
            { x: 160, y: 112, w: 48, h: 40 },
            // Ligne 4
            { x: 0, y: 176, w: 64, h: 48 },
            { x: 72, y: 176, w: 48, h: 48 },
            { x: 128, y: 168, w: 32, h: 48 },
            { x: 168, y: 168, w: 48, h: 48 },
            { x: 216, y: 176, w: 40, h: 48 },
        ]
    },
    electronics1: {
        src: electronics1Sheet,
        // Grille 4x5 de 32x32 pixels environ
        gridSize: 24,
        cols: 5,
        rows: 6
    },
    electronics2: {
        src: electronics2Sheet,
        gridSize: 24,
        cols: 5,
        rows: 6
    }
};

// Classe pour gérer le découpage des spritesheets
export class SpriteLoader {
    constructor() {
        this.loadedSprites = [];
        this.isLoaded = false;
    }

    async loadAll() {
        if (this.isLoaded) return this.loadedSprites;

        // Charger les sprites hardware individuels
        HARDWARE_SPRITES.forEach(src => {
            this.loadedSprites.push({
                type: 'image',
                src: src
            });
        });

        // Ajouter les spritesheets avec leurs découpes
        // Electronics 1 - grille régulière
        const e1 = SPRITESHEETS.electronics1;
        for (let row = 0; row < e1.rows; row++) {
            for (let col = 0; col < e1.cols; col++) {
                this.loadedSprites.push({
                    type: 'spritesheet',
                    src: e1.src,
                    x: col * e1.gridSize,
                    y: row * e1.gridSize,
                    w: e1.gridSize,
                    h: e1.gridSize
                });
            }
        }

        // Electronics 2 - grille régulière
        const e2 = SPRITESHEETS.electronics2;
        for (let row = 0; row < e2.rows; row++) {
            for (let col = 0; col < e2.cols; col++) {
                this.loadedSprites.push({
                    type: 'spritesheet',
                    src: e2.src,
                    x: col * e2.gridSize,
                    y: row * e2.gridSize,
                    w: e2.gridSize,
                    h: e2.gridSize
                });
            }
        }

        // Displays - positions manuelles
        SPRITESHEETS.displays.sprites.forEach(sprite => {
            this.loadedSprites.push({
                type: 'spritesheet',
                src: SPRITESHEETS.displays.src,
                ...sprite
            });
        });

        this.isLoaded = true;
        return this.loadedSprites;
    }

    getRandomSprite() {
        if (this.loadedSprites.length === 0) {
            // Fallback si pas encore chargé
            return { type: 'image', src: HARDWARE_SPRITES[0] || '' };
        }
        const index = Math.floor(Math.random() * this.loadedSprites.length);
        return this.loadedSprites[index];
    }
}

// Instance globale
export const spriteLoader = new SpriteLoader();

// Fonction legacy pour compatibilité
export function getRandomWasteSprite() {
    return spriteLoader.getRandomSprite();
}

export default spriteLoader;
