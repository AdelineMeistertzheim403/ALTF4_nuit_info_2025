import React, { useState } from 'react';
import Join from './Join';
import Pseudo from './Pseudo';
import Leave from './Leave';
import Game from './Game';
import LeaderBoard from './LeaderBoard';

function LaserGame() {
    const [step, setStep] = useState('join'); 
    const [pseudo, setPseudo] = useState('');
    const [score, setScore] = useState(0);

    const goToPseudo = () => { setStep('pseudo'); };

    const handlePseudoValidation = (name) => {
        setPseudo(name);
        setStep('game');
    };

    const handleQuit = () => {
        setPseudo('');
        setScore(0);
        setStep('join');
    };

    // Augmente le score (tir réussi)
    const handleShoot = () => {
        setScore(prev => prev + 10);
    };

    // --- NOUVEAU : Baisse le score (joueur touché) ---
    const handlePlayerHit = (damage) => {
        // On évite les scores négatifs si tu préfères, sinon retire Math.max
        setScore(prev =>  prev - damage);
    };

    return (
        <div>
            {step === 'join' && <Join onStart={goToPseudo} />}

            {step === 'pseudo' && (
                <Pseudo onValidate={handlePseudoValidation} onCancel={handleQuit} />
            )}

            {step === 'game' && (
                <div>
                    {/* On passe onHit au jeu */}
                    <Game 
                        pseudo={pseudo} 
                        onShoot={handleShoot} 
                        onHit={handlePlayerHit} 
                    />
                    
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Leave onQuit={handleQuit} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default LaserGame;