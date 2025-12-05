import { useState } from "react";
import { Link } from "react-router-dom";
import "./Defis3.css";

export default function CostPC() {
    const [modal, setModal] = useState({
        open: false,
        type: "success",
    });

    const openModal = (type) => {
        setModal({ open: true, type });
    };

    const closeModal = () => {
        setModal((m) => ({ ...m, open: false }));
    };

    return (
        <div className="container">

            <h1>▌COÛT DU PC▌</h1>

            <div className="comparison-container">

                {/* Windows PC */}
                <div className="pc-card windows">
                    <div className="pc-title">WINDOWS PC</div>

                    <div className="pc-specs">
                        <div className="spec-item">💰 Coût initial: 1200€</div>
                        <div className="spec-item">📉 Ralentit avec le temps</div>
                        <div className="spec-item">🔧 Mise à jour coûteuse</div>
                        <div className="spec-item">⏰ Durée de vie: 3-4 ans</div>
                        <div className="spec-item">❌ Support limité</div>
                    </div>

                    <div className="price-tag">
                        TOTAL: 2500€<br />(-5 ans)
                    </div>

                    <button
                        className="action-button"
                        onClick={() => openModal("error")}
                    >
                        ACHETER
                    </button>
                </div>

                {/* Ubuntu PC */}
                <div className="pc-card ubuntu">
                    <div className="pc-title">UBUNTU PC</div>

                    <div className="pc-specs">
                        <div className="spec-item">💚 Coût initial: 1000€</div>
                        <div className="spec-item">⚡ Reste rapide toujours</div>
                        <div className="spec-item">🆓 Mises à jour gratuites</div>
                        <div className="spec-item">♻️ Durée de vie: 10+ ans</div>
                        <div className="spec-item">🔄 Support communautaire</div>
                    </div>

                    <div className="price-tag">
                        TOTAL: 1000€<br />(5+ ans)
                    </div>

                    <button
                        className="action-button"
                        onClick={() => openModal("success")}
                    >
                        CHOISIR
                    </button>
                </div>
            </div>

            <div className="disclaimer">
                ▼ ÉCONOMISEZ ET GAGNEZ EN PERFORMANCE ▼
            </div>

            <div className="nav-link">
                <Link to="/">← Retour aux portails</Link>
            </div>

            {/* Modal */}
            {modal.open && (
                <div className="modal-overlay show" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className={`modal-content ${modal.type === "error" ? "error" : ""}`}>
                        <span className="modal-close" onClick={closeModal}>
                            &times;
                        </span>

                        <div className={`modal-title ${modal.type === "error" ? "error" : ""}`}>
                            {modal.type === "error" ? "⚠ MAUVAIS CHOIX ⚠" : "✓ CLÉ DÉVERROUILLÉE ✓"}
                        </div>

                        <div className={`modal-message ${modal.type === "error" ? "error" : ""}`}>
                            {modal.type === "error"
                                ? "Windows vous ruinera. Vous avez perdu!"
                                : "Vous avez récupéré la clé Linux!"}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}