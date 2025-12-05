# SnakeSouls - Documentation Technique

## Vue d'ensemble

**SnakeSouls** est un jeu de type Snake survivaliste inspiré des souls-like, où le joueur doit survivre le plus longtemps possible face à des ennemis IA de plus en plus agressifs et nombreux.

---

## Architecture du projet

```
src/SnakeSouls/
├── App.jsx                 # Point d'entrée du jeu
├── components/
│   └── WareZone/
│       ├── WareZone.jsx    # Composant principal du jeu (canvas, game loop)
│       ├── WareZone.css    # Styles cyberpunk
│       ├── camera/
│       │   └── Camera.js   # Système de caméra avec suivi du joueur
│       ├── hooks/
│       │   ├── useCanvas.js    # Hook pour gérer le canvas
│       │   └── useGameLoop.js  # Hook pour la boucle de jeu (60 FPS)
│       └── world/
│           └── index.js    # Génération du monde (sol texturé)
├── game/
│   ├── core/
│   │   └── InputManager.js # Gestion des entrées clavier
│   ├── entities/
│   │   └── EnemySnake.js   # Entité snake ennemi
│   ├── ai/
│   │   └── EnemyAI.js      # Système d'IA modulaire (12 profils)
│   ├── systems/
│   │   ├── CollisionSystem.js   # Détection des collisions
│   │   ├── EnemyManager.js      # Spawn et gestion des ennemis
│   │   ├── DebrisSystem.js      # Gestion des débris récupérables
│   │   └── DifficultySystem.js  # Progression de difficulté (20 niveaux)
│   └── data/
│       ├── wasteSprites.js    # Sprites des déchets (logos open source)
│       ├── bonusSprites.js    # Sprites des bonus
│       ├── malusSprites.js    # Sprites des malus (logos propriétaires)
│       ├── enemySprites.js    # Sprites des ennemis
│       ├── bonus.js           # Configuration des bonus
│       └── malus.js           # Configuration des malus (16 effets)
└── assets/
    └── sprites/
        ├── enemies/      # Logos propriétaires (ennemis)
        ├── bonus/        # Logos open source (bonus)
        └── wastes/       # Logos open source (déchets)
```

---

## Systèmes principaux

### 1. Système de jeu (WareZone.jsx)

Le composant central qui gère :
- La boucle de jeu (60 FPS via requestAnimationFrame)
- Le rendu canvas 2D
- Les états du jeu (playing, paused, gameover)
- La gestion des collisions
- Le spawn des entités

### 2. Système de difficulté (DifficultySystem.js)

20 niveaux de difficulté progressifs basés sur le temps de survie :

| Niveau | Nom | Temps | Ennemis | Croissance |
|--------|-----|-------|---------|------------|
| 1 | Débutant | 0-15s | 8 | x1 |
| 5 | Difficile | 60-75s | 24 | x2 |
| 10 | Cauchemar | 135-150s | 44 | x4 |
| 15 | Ragnarok | 210-225s | 70 | x6 |
| 20 | CHAOS TOTAL | 300s+ | 100 | x10 |

**Paramètres dynamiques :**
- `maxEnemies` : Nombre maximum d'ennemis simultanés
- `spawnInterval` : Intervalle de spawn (4s → 0.4s)
- `enemySpeedMultiplier` : Vitesse des ennemis (0.9 → 2.0)
- `enemyGrowthMultiplier` : Segments gagnés par déchet mangé (1 → 10)
- `malusSpawnRate` : Probabilité de spawn de malus (0 → 65%)

### 3. Système d'IA (EnemyAI.js)

12 profils de comportement IA :

| Profil | Comportement |
|--------|--------------|
| Collector | Cherche les déchets, évite les confrontations |
| Hunter | Chasse le joueur quand assez grand |
| Opportunist | Équilibre entre collecte et chasse |
| Coward | Fuit les dangers, collecte prudemment |
| Aggressive | Attaque constamment le joueur |
| Stalker | Suit le joueur à distance |
| Interceptor | Prédit et intercepte le joueur |
| Berserker | Attaque en boost de vitesse |
| Flanker | Attaque par les côtés |
| Swarm | Se regroupe avec les autres ennemis |
| Ambusher | Attend puis attaque par surprise |
| Erratic | Mouvements imprévisibles |

### 4. Système de collision (CollisionSystem.js + EnemyManager.js)

**Règle principale : Le plus grand gagne !**

- Collision tête-à-tête : Le snake avec plus de segments détruit l'autre
- Collision tête-corps : Le plus grand coupe ou détruit le plus petit
- Égalité : Les deux perdent un segment

### 5. Système de débris (DebrisSystem.js)

Quand un snake est détruit, il explose en débris récupérables :
- Chaque segment devient un débris
- Les débris peuvent être ramassés pour grandir
- Animation de dispersion avec vélocité

---

## Entités

### Joueur
- Contrôlé au clavier (flèches directionnelles)
- ↑ : Accélérer | ↓ : Ralentir | ← → : Tourner
- 3 vies initiales
- Peut ramasser déchets, bonus, débris
- Éviter les malus (halo rouge)

### Ennemis (EnemySnake.js)
- Contrôlés par IA
- Spawn autour du joueur
- Mangent les déchets pour grandir
- Croissance exponentielle selon le niveau
- Peuvent se battre entre eux

### Déchets
- Logos open source (Linux, Fedora, Arch, etc.)
- Donnent +1 segment et +10 points
- Respawn automatique autour du joueur

### Bonus (logos open source)
| Bonus | Effet | Durée |
|-------|-------|-------|
| Speed | Vitesse x1.5 | 5s |
| Invincible | Immunité | 5s |
| Magnetism | Attire les déchets | 8s |
| Double Points | Points x2 | 10s |
| Slow Enemies | Ennemis x0.5 | 6s |
| Grow | +3 segments | Instant |
| BIRD | +1 vie | Instant |

### Malus (logos propriétaires - HALO ROUGE)
| Malus | Effet | Durée |
|-------|-------|-------|
| Windows | Contrôles inversés | 6s |
| Apple | Vitesse -60% | 6s |
| Oracle | Perd 3 segments | Instant |
| IBM | Vision réduite (fog) | 7s |
| Nvidia | Input lag 200ms | 5s |
| Samsung | Tours aléatoires | 5s |
| Huawei | Bloque les bonus | 8s |
| Chrome | Ralentit tout | 6s |
| **BSOD** | Paralysie totale | 2s |
| **Oracle Tax** | Perd 50% segments | Instant |
| **Walled Garden** | Murs invisibles | 8s |
| **Driver Crash** | Contrôles intermittents | 6s |
| **Legacy Code** | Vitesse inversée | 5s |
| **Battery Explosion** | Attire les ennemis | 5s |
| **Surveillance Mode** | Ennemis vous chassent | 8s |
| **Memory Leak** | Perd 1 seg/2s | 10s |

---

## Configuration (WareZone.jsx)

```javascript
const CONFIG = {
    // Couleurs
    BACKGROUND_COLOR: '#0a0a0f',
    GRID_COLOR: 'rgba(255, 255, 255, 0.03)',

    // Déchets
    WASTE_COUNT: 20,
    WASTE_SIZE: 40,
    WASTE_SPAWN_RADIUS: 1500,
    PICKUP_DISTANCE: 35,

    // Bonus
    BONUS_COUNT: 6,
    BONUS_SIZE: 50,

    // Snake
    SEGMENT_SPACING: 35,
    SEGMENT_SIZE: 30,

    // Gameplay
    INITIAL_LIVES: 3,
    POINTS_PER_SEGMENT: 10,
    POINTS_LOST_ON_DEATH: 50,
};
```

---

## Rendu visuel

### Style Cyberpunk/Blade Runner
- Fond sombre (#0a0a0f)
- Grille subtile
- Effets de glow sur les bonus
- Vignette sombre sur les bords
- Bordures néon animées

### Différenciation visuelle
- **Bonus** : Halo coloré selon le type
- **Malus** : Halo ROUGE INTENSE avec cercles concentriques pulsants
- **Joueur** : Triangle vert (doré si invincible)
- **Ennemis** : Sprites avec rotation

---

## Accès au jeu

Route : `/snake`

```jsx
<Route path="/snake" element={<SnakeSoulsApp />} />
```

---

## Dépendances

- React 18+
- react-router-dom
- Canvas API (natif)
- Aucune bibliothèque de jeu externe

---

## Performance

- 60 FPS ciblés
- Culling : seules les entités visibles sont rendues
- Historique de positions limité dynamiquement
- Nettoyage automatique des entités mortes/expirées