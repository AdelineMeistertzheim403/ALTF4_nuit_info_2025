/**
 * Camera.js
 *
 * Gère le viewport (ce que le joueur voit à l'écran).
 * Dans un monde infini, la caméra suit le joueur pour qu'il reste centré.
 *
 * Concept clé :
 * - Position MONDE : où sont vraiment les entités (coordonnées absolues)
 * - Position ÉCRAN : où on les dessine (coordonnées relatives au viewport)
 *
 * Conversion : positionÉcran = positionMonde - camera.position
 */

export class Camera {
    constructor() {
        // Position de la caméra dans le monde
        this.x = 0;
        this.y = 0;

        // Taille du viewport (mise à jour par le canvas)
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Cible à suivre (le joueur)
        this.target = null;

        // Lissage du mouvement (0.1 = smooth, 1 = instantané)
        this.smoothing = 0.1;
    }

    /**
     * Définit la cible que la caméra doit suivre
     * @param {Object} target - Objet avec { x, y } (ex: PlayerSnake.head)
     */
    setTarget(target) {
        this.target = target;
    }

    /**
     * Met à jour les dimensions du viewport (appelé au resize)
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * Met à jour la position de la caméra
     * Interpolation linéaire pour un suivi fluide
     */
    update() {
        if (!this.target) return;

        // Position cible : centrer le joueur dans le viewport
        const targetX = this.target.x - this.width / 2;
        const targetY = this.target.y - this.height / 2;

        // Lerp : current + (target - current) * smoothing
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;
    }

    /**
     * Convertit position MONDE → ÉCRAN
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Convertit position ÉCRAN → MONDE (utile pour les clics)
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Vérifie si un point est visible à l'écran (optimisation rendu)
     */
    isVisible(worldX, worldY, margin = 100) {
        const screen = this.worldToScreen(worldX, worldY);
        return (
            screen.x >= -margin &&
            screen.x <= this.width + margin &&
            screen.y >= -margin &&
            screen.y <= this.height + margin
        );
    }

    /**
     * Limites du viewport en coordonnées monde
     */
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    /**
     * Centre instantanément sur la cible (sans lerp)
     */
    centerOnTarget() {
        if (!this.target) return;
        this.x = this.target.x - this.width / 2;
        this.y = this.target.y - this.height / 2;
    }
}

export default Camera;