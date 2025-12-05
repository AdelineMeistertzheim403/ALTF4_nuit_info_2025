import { useState } from "react";
import styles from "../styles/Defis2.module.css";

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

        if (!unlocked.includes("silver")) unlocked.push("silver");

        localStorage.setItem("unlockedKeys", JSON.stringify(unlocked));
        localStorage.setItem("buildingCompleted", 2);

        setKeyObtained(true);

        setTimeout(() => {
            window.location.href = "/keys";
        }, 2500);
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>▌CONTRAT CACHE▌</h1>

                <div className={styles.contractContainer}>
                    <div className={`${styles.contractBox} ${revealed ? styles.revealed : ""}`}>
                        <div className={styles.contractTitle}>CONDITIONS D'UTILISATION</div>

                        {!revealed && (
                            <div className={styles.contractContent}>
                                "Vos données peuvent être utilisées pour améliorer nos services"
                                <br />
                                <br />
                                Nous nous engageons à protéger votre vie privée...
                            </div>
                        )}

                        {revealed && (
                            <div className={`${styles.hiddenContent} ${styles.revealed}`}>
                                <strong>LA VRAIE HISTOIRE...</strong>
                                <br />
                                <br />
                                Vos données voyagent dans le monde entier et sont :
                                <br />
                                <br />
                                <ul className={styles.locationList}>
                                    <li>Revendues à des tiers</li>
                                    <li>Utilisées pour la publicité ciblée</li>
                                    <li>Stockées sur des serveurs étrangers</li>
                                    <li>Partagées sans consentement réel</li>
                                    <li>Jamais réellement supprimées</li>
                                    <li>Vendues au plus offrant</li>
                                </ul>

                                <div className={styles.worldMap}>
                                    <div className={styles.dataPoint} style={{ left: "10%", top: "20%" }}></div>
                                    <div className={styles.dataPoint} style={{ left: "30%", top: "50%" }}></div>
                                    <div className={styles.dataPoint} style={{ left: "50%", top: "30%" }}></div>
                                    <div className={styles.dataPoint} style={{ left: "70%", top: "60%" }}></div>
                                    <div className={styles.dataPoint} style={{ left: "85%", top: "40%" }}></div>
                                </div>

                                {!keyObtained ? (
                                    <button className={styles.btnKey} onClick={obtainKey}>
                                        🔑 RÉCUPÉRER LA CLÉ 🔑
                                    </button>
                                ) : (
                                    <div className={styles.keyBox} id="keyDisplay">
                                        ✔ Clé Argent récupérée !
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonContainer}>
                        {!revealed ? (
                            <button className={styles.btnReveal} onClick={revealTruth}>
                                ⚠ DÉCOUVRIR LA VÉRITÉ ⚠
                            </button>
                        ) : (
                            <button className={styles.btnBack} onClick={hideTruth}>
                                ← RETOUR
                            </button>
                        )}
                    </div>

                    <div className={styles.disclaimer}>
                        ▼ ATTENTION: CONTENU HAUT RÉALISME ▼
                    </div>
                </div>

                <div className={styles.navLink}>
                    <a href="/">← Retour aux portails</a>
                </div>
            </div>
        </div>
    );
}