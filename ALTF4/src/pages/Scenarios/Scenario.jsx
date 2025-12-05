import React, { useEffect, useState } from 'react';
import Dialogs from '../../lib/utils/dialogs.js';
import LaserGame from "../../components/LaserGameComponent/LaserGame.jsx";
import PlayMusic from "../../components/GrooveBox/playMusic.tsx";
import './Scenario.css';
import { useNavigate } from 'react-router-dom';

const dialog = new Dialogs();

function App() {
    const [menuButtons, setMenuButtonsVisible] = useState(false);
    const [showSecretButton, setShowSecretButton] = useState(false);
    let [buildingCompleted, setBuildingCompleted] = useState(null);

    const navigate = useNavigate();

  useEffect(() => {
    async function runScenario1() {
      await dialog.showDialog("", "Pierre se réveille dans une ruelle sombre, un monde complètement abstrait pour lui.", 30);
      await dialog.changeBackground("/image_ville.jpeg");
      await dialog.showDialog("Pierre", "Où suis‑je…? *murmure*", 30);
      await dialog.showDialog("", "Complètement perdu, il se relève avec peine et commence à explorer la ville. Les néons vacillent, les panneaux publicitaires diffusent des images qu’il ne comprend pas.  ", 30);
      await dialog.showDialog("Pierre", "Pourquoi suis‑je ici? *souffle‑t‑il, la voix tremblante*", 30);
      await dialog.showDialog("", "Il sort son téléphone: l’écran clignote, la date s’affiche **2150**.", 30);
      await dialog.showDialog("Pierre", "2150…? J’étais dans le coma… depuis tout ce temps?", 30);
      await dialog.showDialog("", "En avançant, il tombe sur un magasin rempli d’écrans 24K diffusant les actualités. Sur toutes les chaînes, la même déclaration tourne en boucle:  ", 30);
      await dialog.changeBackground("/scenario1/tv.png");
      await dialog.showDialog("Ministre de l’Éducation", "L’éducation coûte désormais trop cher. Les écoles n’ont plus de budget pour le matériel informatique. Nous sommes sous le contrôle total des entreprises de la Big Tech.", 30);
      await dialog.showDialog("", "*Pierre serre les poings*", 30);
      await dialog.showDialog("Pierre", "Je dois arranger ça… redonner l’accès au numérique à toutes les écoles.", 30);
    }

        const setupMainScreen = async () => {
            await dialog.changeBackground('/image_ville.jpeg');
        };

        const init = async () => {

            if (localStorage.getItem('scenario1') !== '1') {
                setMenuButtonsVisible(false);
                await runScenario1();
                localStorage.setItem('scenario1', '1');
            }

            setBuildingCompleted(parseInt(localStorage.getItem('buildingCompleted')) || 0);

            await setupMainScreen();
            setMenuButtonsVisible(true);
        };

        init();

        let typedKeys = '';
        const secretCode = 'snake';

        const handleKeyPress = (e) => {
            typedKeys += e.key.toLowerCase();
            if (typedKeys.length > secretCode.length) {
                typedKeys = typedKeys.slice(-secretCode.length);
            }
            if (typedKeys === secretCode) {
                setShowSecretButton(true);
            }
        };

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, []);

    return (
        <div className="scenario-container">
            {menuButtons && (
                <>
                    <button className="building-button" id="building-button-1"
                        style={{opacity: buildingCompleted >= 1 ? 0.5 : 1, cursor: buildingCompleted >= 1 ? 'not-allowed' : 'pointer'}}
                        onClick={(e) => {
                            if (buildingCompleted >= 1) {
                                e.preventDefault();
                            } else {
                                navigate('/defis1');
                            }
                        }}
                    >
                        Défi 1
                    </button>
                    <button className="building-button" id="building-button-2"
                        style={{opacity: buildingCompleted >= 2 || buildingCompleted < 1 ? 0.5 : 1, cursor: buildingCompleted >= 2 || buildingCompleted < 1 ? 'not-allowed' : 'pointer'}}
                        onClick={(e) => {
                            if (buildingCompleted >= 2 || buildingCompleted < 1) {
                                e.preventDefault();
                            } else {
                                navigate('/defis2');
                            }
                        }}
                    >
                        Défi 2
                    </button>
                    <button className="building-button" id="building-button-3"
                            style={{opacity: buildingCompleted >= 3 || buildingCompleted < 2 ? 0.5 : 1, cursor: buildingCompleted >= 3 || buildingCompleted < 2 ? 'not-allowed' : 'pointer'}}
                            onClick={(e) => {
                                if (buildingCompleted >= 3 || buildingCompleted < 2) {
                                    e.preventDefault();
                                } else {
                                    navigate('/defis3');
                                }
                            }}
                    >
                        Défi 3
                    </button>
                    {showSecretButton && (
                        <button className="secret-button" onClick={() => navigate('/snake-souls')}><img src="./Snake.png" alt="Snake game" /></button>
                    )}
                    <LaserGame />
                    <div style={{position: "fixed", top: "64px", right: "16px", zIndex: 9999,}}>
                        <PlayMusic to="/groovebox" label="GrooveBox" containerStyle={{}} buttonStyle={{ width: "100%" }} useDefaultPosition={false}/>
                    </div>
                    <div style={{position: "fixed", top: "112px", right: "16px", zIndex: 9999}}>
                        <button
                            className="keys-btn"
                            onClick={() => navigate('/keys')}

                        >
                            Keys
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;