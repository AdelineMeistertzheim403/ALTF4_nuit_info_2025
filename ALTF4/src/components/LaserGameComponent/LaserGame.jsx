import React, { useState } from 'react';
import Join from './Join';
import Pseudo from './Pseudo';
import Leave from './Leave';
import Game from './Game';
import LeaderBoard from './LeaderBoard'; // J'ai retiré Score qui semblait inutile ici

function LaserGame() {
    // États
    const [step, setStep] = useState('join'); 
    const [pseudo, setPseudo] = useState('');
    const [score, setScore] = useState(0); // Nouvel état pour le score

    // --- Fonctions de gestion ---

    const goToPseudo = () => {
        setStep('pseudo');
    };

    const handlePseudoValidation = (name) => {
        setPseudo(name);
        setStep('game');
    };

    const handleQuit = () => {
        setPseudo('');
        setScore(0); // On remet le score à zéro en quittant
        setStep('join');
    };

    // Fonction passée à Game pour augmenter le score
    const handleShoot = () => {
        setScore(prevScore => prevScore + 10); // +10 points par tir, par exemple
    };

    return (
        <div>
            {step === 'join' && (
                <Join onStart={goToPseudo} />
            )}

            {step === 'pseudo' && (
                <Pseudo 
                    onValidate={handlePseudoValidation} 
                    onCancel={handleQuit} 
                />
            )}

            {step === 'game' && (
                <div>
                    {/* On passe le score et le pseudo au LeaderBoard */}
                    {/* Z-index élevé pour qu'il soit au-dessus du jeu */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <LeaderBoard pseudo={pseudo} score={score} />
                    </div>

                    {/* On passe la fonction handleShoot au Jeu */}
                    <Game pseudo={pseudo} onShoot={handleShoot} />
                    
                    {/* Bouton quitter au-dessus du jeu */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Leave onQuit={handleQuit} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LaserGame;