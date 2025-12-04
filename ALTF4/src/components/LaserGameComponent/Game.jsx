import React, { useState } from 'react';

function Game({ pseudo, onShoot }) {
    // État pour stocker les impacts de laser temporaires
    const [blasts, setBlasts] = useState([]);

    const handleClick = (e) => {
        // 1. Incrémenter le score via le parent
        onShoot();

        // 2. Créer un identifiant unique pour ce tir
        const id = Date.now();

        // 3. Ajouter l'impact à la liste avec les coordonnées de la souris
        const newBlast = {
            id: id,
            x: e.clientX,
            y: e.clientY
        };

        setBlasts((prev) => [...prev, newBlast]);

        // 4. Supprimer l'impact après 500ms (durée de l'animation)
        setTimeout(() => {
            setBlasts((prev) => prev.filter((blast) => blast.id !== id));
        }, 500);
    };

    return (
        // Conteneur INVISIBLE qui prend toute la page
        <div 
            onClick={handleClick}
            style={{
                position: 'fixed', // Fixe par rapport à la fenêtre
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                cursor: 'crosshair', // Curseur en forme de viseur
                zIndex: 1, // En dessous du leaderboard et du bouton quitter
                background: 'transparent', // Invisible
                overflow: 'hidden'
            }}
        >
            {/* Rendu des impacts de laser */}
            {blasts.map((blast) => (
                <div
                    key={blast.id}
                    style={{
                        position: 'absolute',
                        left: blast.x,
                        top: blast.y,
                        transform: 'translate(-50%, -50%)', // Centrer sur la souris
                        pointerEvents: 'none', // Le clic passe au travers si on clique vite
                    }}
                >
                    {/* Le cercle animé */}
                    <div className="laser-blast"></div>
                    
                    {/* Style CSS injecté directement pour l'exemple (ou à mettre dans ton .css) */}
                    <style>
                        {`
                            @keyframes blastAnim {
                                0% { width: 0px; height: 0px; opacity: 1; background: white; }
                                50% { background: red; }
                                100% { width: 100px; height: 100px; opacity: 0; background: red; }
                            }
                            .laser-blast {
                                border-radius: 50%;
                                animation: blastAnim 0.4s ease-out forwards;
                                box-shadow: 0 0 10px red, 0 0 20px orange;
                            }
                        `}
                    </style>
                </div>
            ))}
        </div>
    );
}

export default Game;