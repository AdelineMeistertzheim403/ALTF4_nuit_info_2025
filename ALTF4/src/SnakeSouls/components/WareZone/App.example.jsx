/**
 * Exemple d'utilisation de WareZone dans ton app React
 *
 * Ce fichier montre comment intégrer la zone de jeu
 * dans une page de ton site.
 */

import React from 'react';
import { WareZone } from './components/WareZone';

function App() {
    // Callback quand le jeu est initialisé
    const handleGameReady = ({ ctx, dimensions, camera }) => {
        console.log('🎮 WareZone prête !');
        console.log('📐 Dimensions:', dimensions);
        console.log('🎥 Camera:', camera);

        // Ici tu pourras initialiser tes snakes, etc.
    };

    return (
        <div className="App">
            {/*
        La WareZone prend tout l'écran.
        Les children sont rendus par-dessus (pour le HUD).
      */}
            <WareZone
                debug={true}  // Affiche FPS et position caméra
                onReady={handleGameReady}
            >
                {/*
          Ici tu peux ajouter ton HUD, menus, etc.
          Ils seront positionnés AU-DESSUS du canvas.
        */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    color: 'white',
                    fontFamily: 'system-ui',
                    fontSize: '1.5rem'
                }}>
                    Score: 0
                </div>
            </WareZone>
        </div>
    );
}

export default App;

/**
 * NOTES D'INTÉGRATION:
 * --------------------
 *
 * 1. Si tu veux que WareZone soit sur UNE page spécifique (pas tout le site):
 *    → Crée une route /game et mets WareZone dedans
 *
 * 2. Si tu utilises React Router:
 *    <Routes>
 *      <Route path="/" element={<HomePage />} />
 *      <Route path="/game" element={<WareZone debug />} />
 *    </Routes>
 *
 * 3. Pour sortir du jeu:
 *    → Un bouton dans le HUD qui navigue ailleurs
 *    → Ou touche Escape qui affiche un menu
 *
 * 4. Prochaines étapes:
 *    → Créer les classes Snake, PlayerSnake, EnemySnake
 *    → Les instancier dans handleGameReady
 *    → Les stocker dans un ref ou context
 *    → Les dessiner dans WareZone
 */