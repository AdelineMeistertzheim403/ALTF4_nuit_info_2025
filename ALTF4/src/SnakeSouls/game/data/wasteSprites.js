/**
 * Liste des sprites de déchets disponibles
 * Ces déchets seront mangés par le snake et formeront sa queue
 *
 * Détection automatique des sprites dans les spritesheets
 */

// Import des spritesheets
import displaySheet from '../../assets/sprites/wastes/displays/display.png';
import electronics1Sheet from '../../assets/sprites/wastes/electronics/electronics1.png';
import electronics2Sheet from '../../assets/sprites/wastes/electronics/electronics2.png';

// Import des sprites individuels (hardware)
const hardwareModules = import.meta.glob('/src/SnakeSouls/assets/sprites/wastes/computer_hardware/separated/**/*.png', { eager: true });
export const HARDWARE_SPRITES = Object.values(hardwareModules).map(mod => mod.default);

// Liste des spritesheets à analyser
export const SPRITESHEET_SOURCES = [
    displaySheet,
    electronics1Sheet,
    electronics2Sheet
];

/**
 * Détecte automatiquement les sprites dans une image
 * en trouvant les "îles" de pixels non-transparents
 */
async function detectSpritesInImage(imageSrc, minSize = 8) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            // Créer un canvas pour analyser les pixels
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            const width = img.width;
            const height = img.height;

            // Créer une grille de pixels non-transparents
            const visited = new Array(width * height).fill(false);
            const sprites = [];

            // Fonction pour vérifier si un pixel est non-transparent
            const isOpaque = (x, y) => {
                if (x < 0 || x >= width || y < 0 || y >= height) return false;
                const idx = (y * width + x) * 4;
                return data[idx + 3] > 10; // Alpha > 10
            };

            // Flood fill pour trouver une île de pixels
            const floodFill = (startX, startY) => {
                const stack = [[startX, startY]];
                let minX = startX, maxX = startX;
                let minY = startY, maxY = startY;

                while (stack.length > 0) {
                    const [x, y] = stack.pop();
                    const idx = y * width + x;

                    if (x < 0 || x >= width || y < 0 || y >= height) continue;
                    if (visited[idx]) continue;
                    if (!isOpaque(x, y)) continue;

                    visited[idx] = true;

                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);

                    // Ajouter les voisins (4-connectivité)
                    stack.push([x + 1, y]);
                    stack.push([x - 1, y]);
                    stack.push([x, y + 1]);
                    stack.push([x, y - 1]);
                }

                return { minX, maxX, minY, maxY };
            };

            // Scanner l'image pour trouver tous les sprites
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;
                    if (!visited[idx] && isOpaque(x, y)) {
                        const bounds = floodFill(x, y);
                        const w = bounds.maxX - bounds.minX + 1;
                        const h = bounds.maxY - bounds.minY + 1;

                        // Filtrer les sprites trop petits (bruit)
                        if (w >= minSize && h >= minSize) {
                            sprites.push({
                                x: bounds.minX,
                                y: bounds.minY,
                                w: w,
                                h: h
                            });
                        }
                    }
                }
            }

            resolve(sprites);
        };

        img.onerror = () => resolve([]);
        img.src = imageSrc;
    });
}

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

        // Détecter automatiquement les sprites dans chaque spritesheet
        for (const sheetSrc of SPRITESHEET_SOURCES) {
            const detectedSprites = await detectSpritesInImage(sheetSrc, 10);

            detectedSprites.forEach(sprite => {
                this.loadedSprites.push({
                    type: 'spritesheet',
                    src: sheetSrc,
                    x: sprite.x,
                    y: sprite.y,
                    w: sprite.w,
                    h: sprite.h
                });
            });
        }

        console.log(`SpriteLoader: ${this.loadedSprites.length} sprites chargés`);
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
