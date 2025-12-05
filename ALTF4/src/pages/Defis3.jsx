import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Defis3.module.css";

export default function CostPC() {
    const [modal, setModal] = useState({
        open: false,
        type: "success",
    });

    const openModal = (type) => {
        setModal({ open: true, type });

        if (type === "success") {
            const keys = JSON.parse(localStorage.getItem("unlockedKeys") || "[]");

            if (!keys.includes("gold")) {
                keys.push("gold");
                localStorage.setItem("unlockedKeys", JSON.stringify(keys));
                localStorage.setItem("buildingCompleted", 3);
            }
            setTimeout(() => {
                window.location.href = "/keys";
            }, 2500);
        }
    };

    const closeModal = () => {
        setModal((m) => ({ ...m, open: false }));
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>▌COÛT DU PC▌</h1>

                <div className={styles.comparisonContainer}>
                    <div className={`${styles.pcCard} ${styles.windows}`}>
                        <div className={styles.pcTitle}>WINDOWS PC</div>

                        <div className={styles.pcSpecs}>
                            <div className={styles.specItem}>💰 Coût initial: 1200€</div>
                            <div className={styles.specItem}>📉 Ralentit avec le temps</div>
                            <div className={styles.specItem}>🔧 Mise à jour coûteuse</div>
                            <div className={styles.specItem}>⏰ Durée de vie: 3-4 ans</div>
                            <div className={styles.specItem}>❌ Support limité</div>
                        </div>

                        <div className={styles.priceTag}>
                            TOTAL: 2500€<br />(-5 ans)
                        </div>

                        <button
                            className={styles.actionButton}
                            onClick={() => openModal("error")}
                        >
                            ACHETER
                        </button>
                    </div>

                    <div className={`${styles.pcCard} ${styles.ubuntu}`}>
                        <div className={styles.pcTitle}>UBUNTU PC</div>

                        <div className={styles.pcSpecs}>
                            <div className={styles.specItem}>💚 Coût initial: 1000€</div>
                            <div className={styles.specItem}>⚡ Reste rapide toujours</div>
                            <div className={styles.specItem}>🆓 Mises à jour gratuites</div>
                            <div className={styles.specItem}>♻️ Durée de vie: 10+ ans</div>
                            <div className={styles.specItem}>🔄 Support communautaire</div>
                        </div>

                        <div className={styles.priceTag}>
                            TOTAL: 1000€<br />(5+ ans)
                        </div>

                        <button
                            className={styles.actionButton}
                            onClick={() => openModal("success")}
                        >
                            CHOISIR
                        </button>
                    </div>
                </div>

                <div className={styles.disclaimer}>
                    ▼ ÉCONOMISEZ ET GAGNEZ EN PERFORMANCE ▼
                </div>

                <div className={styles.navLink}>
                    <Link to="/">← Retour aux portails</Link>
                </div>

                {modal.open && (
                    <div className={`${styles.modalOverlay} ${styles.show}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
                        <div className={`${styles.modalContent} ${modal.type === "error" ? styles.error : ""}`}>
                            <span className={styles.modalClose} onClick={closeModal}>
                                &times;
                            </span>

                            <div className={`${styles.modalTitle} ${modal.type === "error" ? styles.error : ""}`}>
                                {modal.type === "error" ? "⚠ MAUVAIS CHOIX ⚠" : "✓ CLÉ DÉVERROUILLÉE"}
                            </div>

                            <div className={`${styles.modalMessage} ${modal.type === "error" ? styles.error : ""}`}>
                                {modal.type === "error"
                                    ? "Windows vous ruinera. Vous avez perdu!"
                                    : "Vous avez récupéré la clé or !"}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}