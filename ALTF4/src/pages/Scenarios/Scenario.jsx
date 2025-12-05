import React, { useEffect, useState } from "react";
import Dialogs from "../../lib/utils/dialogs.js";
import LaserGame from "../../components/LaserGameComponent/LaserGame.jsx";
import PlayMusic from "../../components/GrooveBox/playMusic.tsx";

const dialog = new Dialogs();

function App() {
  const [laserGameVisible, setLaserGameVisible] = useState(false);
  const [showGrooveButton, setShowGrooveButton] = useState(false);

  useEffect(() => {
    async function runScenario1() {
      await dialog.showDialog("", "Pierre se réveille dans une ruelle sombre, un monde complètement abstrait pour lui.", 30);
      await dialog.changeBackground("/image_ville.jpeg");
      await dialog.showDialog("Pierre", "Où suis‑je…? *mumure*", 30);
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

    async function setupMainScreen() {
      await dialog.changeBackground("/image_ville.jpeg");
    }

    async function init() {
      if (localStorage.getItem("scenario1") !== "1") {
        setLaserGameVisible(false);
        await runScenario1();
        localStorage.setItem("scenario1", "1");
      }
      await setupMainScreen();
      setLaserGameVisible(true);
      setShowGrooveButton(true);
    }

    init();
  }, []);

  return (
    <div>
      {laserGameVisible && <LaserGame />}
      <div style={floatingButtons}>
        {showGrooveButton && (
          <PlayMusic
            to="/groovebox"
            label="GrooveBox"
            containerStyle={{ position: "static", marginTop: "48px" }} 
            buttonStyle={{ width: "100%" }}
            useDefaultPosition={false}
          />
        )}
      </div>
    </div>   
  );
}

export default App;

const floatingButtons = {
  position: "fixed",
  top: "16px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  zIndex: 1000,
};
