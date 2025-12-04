Structure

```
src/
├── game/
│   ├── core/
│   │   ├── Game.js              # Orchestrateur principal
│   │   ├── GameLoop.js          # Boucle update/render
│   │   └── InputManager.js      # Gestion clavier/souris
│   │
│   ├── entities/
│   │   ├── Entity.js            # Classe abstraite de base
│   │   ├── Snake.js             # Snake générique (joueur ou IA)
│   │   ├── PlayerSnake.js       # Hérite de Snake, contrôles joueur
│   │   ├── EnemySnake.js        # Hérite de Snake, logique IA
│   │   ├── Segment.js           # Un segment du snake
│   │   └── Bonus.js             # Items (Ubuntu, Fedora, etc.)
│   │
│   ├── systems/
│   │   ├── CollisionSystem.js   # Détection des collisions
│   │   ├── SpawnSystem.js       # Spawn ennemis et bonus
│   │   └── ScoreSystem.js       # Gestion du score
│   │
│   ├── ai/
│   │   ├── AIBehavior.js        # Classe abstraite IA
│   │   ├── AggressiveAI.js      # Chasse le joueur
│   │   ├── PassiveAI.js         # Évite, cherche bonus
│   │   └── RandomAI.js          # Mouvement aléatoire
│   │
│   ├── data/
│   │   ├── bonuses.js           # Config des bonus (nom, effet, durée)
│   │   └── enemies.js           # Config ennemis (Microsoft, Apple...)
│   │
│   └── utils/
│       ├── Vector2.js           # Classe vecteur (x, y) + maths
│       └── helpers.js           # Fonctions utilitaires
│
├── components/                   # Composants React
│   ├── GameCanvas.jsx           # Canvas wrapper
│   ├── HUD.jsx                  # Score, vies, buffs actifs
│   ├── GameOver.jsx             # Écran de fin
│   └── PauseMenu.jsx            # Menu pause
│
├── hooks/
│   └── useGame.js               # Hook pour lier Game à React
│
├── assets/
│   ├── sprites/                 # Images PNG des logos
│   └── sounds/                  # Sons (optionnel)
│
└── App.jsx                      # Point d'entrée React
```