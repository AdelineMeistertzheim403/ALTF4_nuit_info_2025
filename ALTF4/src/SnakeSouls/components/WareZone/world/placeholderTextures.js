/**
 * placeholderTextures.js
 * 
 * Génère des textures placeholder quand les vraies images ne sont pas disponibles.
 * Utile pour le développement et les tests.
 * 
 * Ces textures sont générées dynamiquement avec Canvas.
 */

/**
 * Crée une texture canvas de béton stylisée
 * @param {number} size - Taille en pixels
 * @param {string} baseColor - Couleur de base
 * @param {number} crackDensity - Densité des fissures (0-1)
 * @returns {HTMLCanvasElement}
 */
export function generateConcreteTexture(size = 256, baseColor = '#3a3a4a', crackDensity = 0.3) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fond de base
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Ajouter du bruit/grain
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
  }
  ctx.putImageData(imageData, 0, 0);

  // Ajouter des fissures
  const numCracks = Math.floor(crackDensity * 10);
  ctx.strokeStyle = 'rgba(20, 20, 25, 0.6)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < numCracks; i++) {
    drawCrack(ctx, size);
  }

  // Ajouter des taches sombres
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 10 + Math.random() * 30;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(20, 20, 25, 0.2)');
    gradient.addColorStop(1, 'rgba(20, 20, 25, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

/**
 * Dessine une fissure aléatoire
 */
function drawCrack(ctx, size) {
  // Point de départ sur un bord
  let x, y;
  const side = Math.floor(Math.random() * 4);
  
  switch (side) {
    case 0: x = Math.random() * size; y = 0; break;
    case 1: x = size; y = Math.random() * size; break;
    case 2: x = Math.random() * size; y = size; break;
    case 3: x = 0; y = Math.random() * size; break;
  }

  ctx.beginPath();
  ctx.moveTo(x, y);

  // Dessiner la fissure avec des segments
  const segments = 5 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < segments; i++) {
    x += (Math.random() - 0.5) * 50;
    y += (Math.random() - 0.5) * 50;
    
    // Garder dans les limites
    x = Math.max(0, Math.min(size, x));
    y = Math.max(0, Math.min(size, y));
    
    ctx.lineTo(x, y);
    
    // Parfois, ajouter une branche
    if (Math.random() > 0.7) {
      const branchX = x + (Math.random() - 0.5) * 30;
      const branchY = y + (Math.random() - 0.5) * 30;
      ctx.lineTo(branchX, branchY);
      ctx.moveTo(x, y);
    }
  }

  ctx.stroke();
}

/**
 * Crée une texture d'asphalte usé
 */
export function generateAsphaltTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fond gris foncé
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, size, size);

  // Grain plus prononcé
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 40;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  // Patches plus clairs (usure)
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = 30 + Math.random() * 50;
    const h = 20 + Math.random() * 40;
    
    ctx.fillStyle = 'rgba(60, 60, 60, 0.5)';
    ctx.fillRect(x, y, w, h);
  }

  return canvas;
}

/**
 * Crée un TileSet avec des textures placeholder
 * @param {TileSet} tileSet - Le TileSet à remplir
 */
export function addPlaceholderTextures(tileSet) {
  // Générer les textures
  const textures = {
    'concrete_base': generateConcreteTexture(256, '#3a3a4a', 0.1),
    'concrete_cracked': generateConcreteTexture(256, '#353540', 0.5),
    'concrete_damaged': generateConcreteTexture(256, '#2a2a35', 0.8),
    'asphalt_worn': generateAsphaltTexture(256),
  };

  // Convertir les canvas en images et les ajouter au TileSet
  Object.entries(textures).forEach(([id, canvas]) => {
    // Créer une image à partir du canvas
    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    
    // Ajouter directement au TileSet (bypass du chargement normal)
    tileSet.textures.set(id, {
      src: 'placeholder',
      image: img,
      loaded: true
    });
  });

  tileSet.loaded = true;
  
  return tileSet;
}

export default {
  generateConcreteTexture,
  generateAsphaltTexture,
  addPlaceholderTextures
};
