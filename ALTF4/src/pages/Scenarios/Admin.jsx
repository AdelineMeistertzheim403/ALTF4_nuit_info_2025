import React, { useEffect } from 'react';
import Dialogs from '../../lib/utils/dialogs.js';
import { useNavigate } from 'react-router-dom';

const dialog = new Dialogs();

function App() {
    const [showEnd, setShowEnd] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function runScenario() {
            await dialog.showDialog("", "Pierre a réussi à rendre les écoles moins dépendantes de la Big Tech grâce à l'open source, à Linux et au recyclage.", 30);
            await dialog.changeBackground("./mairie.png");
            await dialog.showDialog("Ministre de l'Éducation", "Grâce à vous, Pierre, vous avez réussi à rendre l'éducation encore meilleure. Et pour vous remercier, je souhaite vous remettre personnellement la médaill—", 30);
            await dialog.showDialog("", "Pierre s'interrompt, le sol se met à trembler, personne ne bouge.", 30);
            await dialog.showDialog("", "Le ministre reste figé, le bras tendu, comme une statue.", 30);
            await dialog.showDialog("", "Pierre sent soudain quelque chose de lourd sur sa tête, une pression.", 30);
            await dialog.changeBackground("");
            await dialog.showDialog("", "Tout devient noir, des voix, lointaines, résonnent, des voix qu'il n'a jamais entendues.", 30);
            await dialog.showDialog("???", "Il est enfin réveillé. Enlevez‑lui le casque de réalité virtuelle.", 30);
            await dialog.showDialog("", "Pierre découvre qu'il était dans un monde virtuel depuis tout ce temps.", 30);
            await dialog.showDialog("", "Étonné, sous le choc, il passe quelques jours en observation, puis quelques semaines à se réhabituer au monde réel.", 30);
            await dialog.showDialog("", "Peu à peu, il remarque quelque chose d'inquiétant..", 30);
            await dialog.showDialog("Pierre", "L'envahissement de la Big Tech qui existait dans le monde virtuel… commence à se produire, pour de vrai, dans le monde réel. On doit combattre.. ", 30);

            setShowEnd(true);
        }

        runScenario();
    }, []);

    async function resetALTF4() {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div>
            {showEnd && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 10000}}>
                    <h1 style={{fontSize: '6rem', color: '#00ff88', fontFamily: "'Courier New', monospace", textShadow: '0 0 20px #00ff88, 0 0 40px #00ff88', letterSpacing: '20px', animation: 'fadeIn 2s ease-in'}}>
                        FIN
                    </h1>
                    <button
                        onClick={() => resetALTF4()}
                        style={{padding: '15px 40px', fontSize: '1.5rem', fontFamily: "'Courier New', monospace", fontWeight: 'bold', color: '#00ff88', backgroundColor: 'transparent', border: '3px solid #00ff88', borderRadius: '5px', cursor: 'pointer', textShadow: '0 0 5px #00ff88', boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)', transition: 'all 0.3s ease', animation: 'fadeIn 3s ease-in'}}
                        onMouseEnter={(e) => {e.target.style.background = 'rgba(0, 255, 136, 0.2)';e.target.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';e.target.style.transform = 'scale(1.05)';}}
                        onMouseLeave={(e) => {e.target.style.background = 'transparent';e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';e.target.style.transform = 'scale(1)';}}
                    >
                        ↻ REJOUER
                    </button>
                </div>
            )}
        </div>
    )
}

export default App;