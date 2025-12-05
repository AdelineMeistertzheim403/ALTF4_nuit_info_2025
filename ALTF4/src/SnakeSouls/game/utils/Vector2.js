// Classe Vector2 pour les calculs de position et de direction
export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  // Addition de vecteurs
  add(vector) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  // Soustraction de vecteurs
  subtract(vector) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  // Multiplication par un scalaire
  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  // Division par un scalaire
  divide(scalar) {
    if (scalar === 0) return new Vector2(0, 0);
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  // Distance entre deux vecteurs
  distance(vector) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Longueur du vecteur (magnitude)
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Normaliser le vecteur (longueur = 1)
  normalize() {
    const len = this.length();
    if (len === 0) return new Vector2(0, 0);
    return this.divide(len);
  }

  // Produit scalaire
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  // Angle en radians
  angle() {
    return Math.atan2(this.y, this.x);
  }

  // Angle entre deux vecteurs
  angleTo(vector) {
    return Math.atan2(vector.y - this.y, vector.x - this.x);
  }

  // Rotation du vecteur
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  // Clone
  clone() {
    return new Vector2(this.x, this.y);
  }

  // Vérifier l'égalité
  equals(vector) {
    return this.x === vector.x && this.y === vector.y;
  }

  // Créer un vecteur depuis un angle
  static fromAngle(angle, length = 1) {
    return new Vector2(
      Math.cos(angle) * length,
      Math.sin(angle) * length
    );
  }

  // Vecteur zéro
  static zero() {
    return new Vector2(0, 0);
  }

  // Vecteurs directionnels
  static up() {
    return new Vector2(0, -1);
  }

  static down() {
    return new Vector2(0, 1);
  }

  static left() {
    return new Vector2(-1, 0);
  }

  static right() {
    return new Vector2(1, 0);
  }
}
