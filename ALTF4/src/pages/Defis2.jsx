import { useState } from "react";
import "../styles/Defis2.css";

export default function Defis2() {
    const [revealed, setRevealed] = useState(false);
    const [keyObtained, setKeyObtained] = useState(false);

    function revealTruth() {
        setRevealed(true);
    }

    function hideTruth() {
        setRevealed(false);
    }

    function obtainKey() {
        const unlocked = JSON.parse(localStorage.getItem("unlockedKeys") || "[]");

        // ajoute seulement si pas déjà dedans
        if (!unlocked.includes("silver")) unlocked.push("silver");

        localStorage.setItem("unlockedKeys", JSON.stringify(unlocked));

        setKeyObtained(true);

        setTimeout(() => {
            window.location.href = "/keys";
        }, 2500);
    }


    return (
        <div className="page">
            <div className="container">
                <h1>▌CONTRAT CACHE▌</h1>

                <div className="contract-container">
                    <div className={`contract-box ${revealed ? "revealed" : ""}`}>
                        <div className="contract-title">CONDITIONS D'UTILISATION</div>

                        {/* Texte innocent */}
                        {!revealed && (
                            <div className="contract-content">
                                "Vos données peuvent être utilisées pour améliorer nos services"
                                <br />
                                <br />
                                Nous nous engageons à protéger votre vie privée...
                            </div>
                        )}

                        {/* Contenu caché */}
                        {revealed && (
                            <div className="hidden-content revealed">
                                <strong>LA VRAIE HISTOIRE...</strong>
                                <br />
                                <br />
                                Vos données voyagent dans le monde entier et sont :
                                <br />
                                <br />
                                <ul className="location-list">
                                    <li>Revendues à des tiers</li>
                                    <li>Utilisées pour la publicité ciblée</li>
                                    <li>Stockées sur des serveurs étrangers</li>
                                    <li>Partagées sans consentement réel</li>
                                    <li>Jamais réellement supprimées</li>
                                    <li>Vendues au plus offrant</li>
                                </ul>

                                {/* Carte */}
                                <div className="world-map">
                                    <div className="data-point" style={{ left: "10%", top: "20%" }}></div>
                                    <div className="data-point" style={{ left: "30%", top: "50%" }}></div>
                                    <div className="data-point" style={{ left: "50%", top: "30%" }}></div>
                                    <div className="data-point" style={{ left: "70%", top: "60%" }}></div>
                                    <div className="data-point" style={{ left: "85%", top: "40%" }}></div>
                                </div>

                                {/* BOUTON CLÉ */}
                                {!keyObtained ? (
                                    <button
                                        className="btn-key"
                                        onClick={obtainKey}
                                    >

                                    🔑 RÉCUPÉRER LA CLÉ 🔑
                                    </button>

                                ) : (
                                    <div className="key-box" id="keyDisplay">
                                        ✔ Clé Argent récupérée !
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="button-container">
                        {!revealed ? (
                            <button className="btn-reveal" onClick={revealTruth}>
                                ⚠ DÉCOUVRIR LA VÉRITÉ ⚠
                            </button>
                        ) : (
                            <button className="btn-back" onClick={hideTruth}>
                                ← RETOUR
                            </button>
                        )}
                    </div>

                    <div className="disclaimer">
                        ▼ ATTENTION: CONTENU HAUT RÉALISME ▼
                    </div>
                </div>

                <div className="nav-link">
                    <a href="/">← Retour aux portails</a>
                </div>
            </div>
        </div>
    );
}
