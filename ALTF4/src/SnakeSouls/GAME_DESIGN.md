# SnakeSouls - Game Design Document

---

## Concept

**SnakeSouls** est un jeu de survie Snake souls-like où le joueur incarne un serpent open source luttant contre l'invasion des technologies propriétaires. Plus vous survivez longtemps, plus le chaos s'intensifie.

**Pitch** : *"Dans un monde numérique dominé par les géants du propriétaire, un serpent open source se dresse. Mangez, grandissez, survivez. Mais attention : le temps joue contre vous."*

---

## Philosophie de design

### 1. Difficulté souls-like
- **Punition** : Chaque erreur coûte cher (perte de segments, de vies, de points)
- **Progression du danger** : La difficulté augmente exponentiellement, pas linéairement
- **Pas de répit** : Plus vous survivez, plus c'est difficile
- **Équité** : Les mêmes règles s'appliquent à tous (joueur et ennemis)

### 2. Thématique Open Source vs Propriétaire
- **Déchets & Bonus** = Logos open source (Linux, Fedora, Arch, etc.) = BIEN
- **Malus & Ennemis** = Logos propriétaires (Windows, Apple, Oracle, etc.) = MAL
- **Message** : Le logiciel libre est la nourriture, le propriétaire est le poison

### 3. Chaos émergent
- Les ennemis ont des comportements variés et imprévisibles
- Les ennemis se battent entre eux
- Les débris créent des opportunités et des dangers
- Chaque partie est unique

---

## Mécaniques de jeu

### Boucle de jeu principale

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   MANGER → GRANDIR → SURVIVRE → DOMINER → CHAOS        │
│      ↑                                      │          │
│      └──────────────────────────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

1. **Manger** des déchets open source pour grandir
2. **Éviter** les malus (logos propriétaires avec halo rouge)
3. **Affronter** les ennemis (le plus grand gagne)
4. **Survivre** le plus longtemps possible
5. **Scorer** : segments + bonus + ennemis détruits

### Système de taille

**LA RÈGLE D'OR : Le plus grand gagne.**

```
Taille = Nombre de segments + 1 (tête)

Collision entre deux snakes :
├── Taille A > Taille B → A détruit/coupe B
├── Taille A < Taille B → B détruit/coupe A
└── Taille A = Taille B → Les deux perdent 1 segment
```

Cette mécanique simple crée une stratégie profonde :
- Dois-je attaquer maintenant ou grandir encore ?
- Cet ennemi est-il plus grand que moi ?
- Puis-je récupérer ses débris après l'avoir détruit ?

### Croissance exponentielle des ennemis

**Le temps est votre ennemi.**

Plus le temps passe, plus les ennemis grandissent vite :

| Niveau | Croissance par déchet |
|--------|----------------------|
| 1-2 | +1 segment |
| 3-4 | +1.5-2 segments |
| 5-6 | +2-2.5 segments |
| 7-9 | +3-3.5 segments |
| 10-12 | +4-5 segments |
| 13-15 | +5-6 segments |
| 16-18 | +7-8 segments |
| 19-20 | +9-10 segments |

Au niveau 20, un ennemi qui mange UN déchet gagne DIX segments !

### Système de vies

- 3 vies initiales
- Perte de vie = collision avec ennemi plus grand
- Bonus BIRD (rare) = +1 vie
- 0 vies = Game Over

### Système de points

| Action | Points |
|--------|--------|
| Déchet ramassé | +10 |
| Segment d'ennemi détruit | +10 par segment |
| Débris ramassé | +5 par débris |
| Bonus ramassé | Variable (+10 à +50) |
| Malus touché | -15 à -50 |
| Perte de vie | -50 |

---

## Système de malus (Le Poison Propriétaire)

Les malus sont les pièges du jeu. Ils sont visuellement distincts avec un **HALO ROUGE INTENSE**.

### Malus classiques

| Malus | Inspiration | Effet |
|-------|-------------|-------|
| **Windows** | BSOD | Contrôles inversés 6s |
| **Apple** | Jardin fermé | Vitesse -60% 6s |
| **Oracle** | Licences abusives | Perd 3 segments |
| **IBM** | Legacy code | Vision fog 7s |
| **Nvidia** | Drivers bugués | Input lag 200ms 5s |
| **Samsung** | Explosion Note 7 | Tours aléatoires 5s |
| **Huawei** | Restrictions | Bloque bonus 8s |
| **Chrome** | Memory hog | Ralentit tout 6s |

### Malus Souls-Like (DÉVASTATEURS)

| Malus | Nom | Effet |
|-------|-----|-------|
| **BSOD** | Windows | Paralysie totale 2s |
| **Oracle Tax** | Oracle | Perd 50% des segments |
| **Walled Garden** | Apple | Murs invisibles 8s |
| **Driver Crash** | Nvidia | Contrôles intermittents 6s |
| **Legacy Code** | IBM | Vitesse inversée 5s |
| **Battery Explosion** | Samsung | Attire les ennemis 5s |
| **Surveillance Mode** | Huawei | Position révélée 8s |
| **Memory Leak** | Chrome | Perd 1 seg/2s pendant 10s |

---

## Intelligence Artificielle

### Philosophie IA
*"Chaque ennemi a une personnalité."*

L'IA n'est pas un bloc monolithique. Chaque type d'ennemi a un profil comportemental qui influence ses décisions.

### Profils IA

| Profil | Stratégie | Danger |
|--------|-----------|--------|
| **Collector** | Ramasse les déchets, évite les combats | Faible |
| **Coward** | Fuit tout danger, collecte prudemment | Faible |
| **Opportunist** | Balance collecte/chasse selon taille | Moyen |
| **Hunter** | Chasse le joueur quand assez grand | Élevé |
| **Stalker** | Suit à distance, attend une ouverture | Élevé |
| **Aggressive** | Attaque constamment | Élevé |
| **Interceptor** | Prédit les mouvements, intercepte | Très élevé |
| **Berserker** | Charge en boost de vitesse | Très élevé |
| **Flanker** | Attaque par les côtés | Élevé |
| **Ambusher** | Attend immobile puis surgit | Très élevé |
| **Swarm** | Se regroupe avec d'autres ennemis | Variable |
| **Erratic** | Mouvements imprévisibles | Imprévisible |

### Décisions IA

À chaque frame, l'IA évalue :
1. Où sont les déchets les plus proches ?
2. Où est le joueur ?
3. Suis-je plus grand que le joueur ?
4. Y a-t-il des dangers (autres ennemis, murs) ?
5. Mon profil me dit de faire quoi ?

---

## Progression de difficulté

### Les 20 niveaux de l'enfer

| Phase | Niveaux | Ambiance |
|-------|---------|----------|
| **Apprentissage** | 1-2 | Calme, peu d'ennemis |
| **Éveil** | 3-5 | Malus apparaissent, tension |
| **Combat** | 6-9 | Ennemis nombreux et rapides |
| **Chaos** | 10-14 | Croissance explosive, survie |
| **Apocalypse** | 15-19 | Horde d'ennemis géants |
| **CHAOS TOTAL** | 20 | 100 ennemis, x10 croissance |

### Courbe de difficulté

```
Difficulté
    │
100 │                                    ████████
    │                              ██████
 80 │                        ██████
    │                  ██████
 60 │            ██████
    │        ████
 40 │      ██
    │    ██
 20 │  ██
    │██
  0 └──────────────────────────────────────────── Temps
    0s   60s  120s  180s  240s  300s+
```

---

## Direction artistique

### Palette de couleurs

| Élément | Couleur | Hex |
|---------|---------|-----|
| Fond | Noir profond | #0a0a0f |
| Joueur | Vert vif | #4ade80 |
| Joueur invincible | Or | #ffd700 |
| Bonus | Variable (glow) | - |
| Malus | Rouge intense | #FF0000 |
| Ennemis | Selon type | Variable |

### Style visuel
- **Cyberpunk** : Néons, grilles, vignettes sombres
- **Blade Runner** : Atmosphère oppressante, pluie de données
- **Rétro-gaming** : Sprites pixelisés, effets simples mais efficaces

### Feedback visuel
- **Halo coloré** sur les bonus (couleur = type)
- **Halo ROUGE PULSANT** sur les malus (danger évident)
- **Cercles d'expansion** à la collecte
- **Traînée de segments** fluide

---

## Contrôles

| Touche | Action |
|--------|--------|
| ← | Tourner à gauche |
| → | Tourner à droite |
| ↑ | Accélérer (vitesse x1.7) |
| ↓ | Ralentir (vitesse x0.5) |
| ESPACE | Pause |

*Note : Les contrôles peuvent être inversés par le malus Windows !*

---

## Stratégies recommandées

### Début de partie (0-60s)
1. Ramasser les déchets rapidement
2. Éviter les ennemis (trop risqué)
3. Ignorer les malus (pas encore actifs)
4. Construire une taille confortable (15+ segments)

### Milieu de partie (60-180s)
1. Être opportuniste : attaquer les petits ennemis
2. Récupérer les débris des combats IA vs IA
3. Éviter les malus à tout prix
4. Chercher les bonus BIRD (vies)

### Fin de partie (180s+)
1. Prioriser la survie sur la croissance
2. Éviter les gros ennemis (croissance x5+)
3. Les malus souls-like peuvent être fatals
4. Chaque seconde compte pour le score

---

## Métriques de succès

| Métrique | Objectif |
|----------|----------|
| Survie 60s | Facile |
| Survie 120s | Moyen |
| Survie 180s | Difficile |
| Survie 240s | Expert |
| Survie 300s | Légende |
| Score 1000+ | Bon |
| Score 5000+ | Excellent |
| Score 10000+ | Maître |

---

## Crédits thématiques

### Open Source (Les Alliés)
- Linux, Fedora, Ubuntu, Debian, Arch, Mint
- Représentent la liberté, la communauté, le partage

### Propriétaire (Les Ennemis)
- Windows, Apple, Oracle, IBM, Nvidia, Samsung, Huawei, Chrome
- Représentent les restrictions, le contrôle, les abus

*Ce jeu est une satire humoristique et n'a pas vocation à dénigrer réellement ces entreprises.*

---

## Évolutions futures possibles

- [ ] Mode multijoueur local
- [ ] Leaderboard en ligne
- [ ] Boss fights (Microsoft, Google, etc.)
- [ ] Power-ups permanents (roguelike)
- [ ] Skins pour le joueur
- [ ] Mode infini sans malus
- [ ] Succès/Achievements