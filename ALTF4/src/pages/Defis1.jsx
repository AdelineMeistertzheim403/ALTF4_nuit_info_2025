import { useState } from "react";
import "../styles/Defis1.css";

export default function Defis1() {
    const [activeWindow, setActiveWindow] = useState(null);
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [messageClass, setMessageClass] = useState("");

    function handleClick(type) {
        setActiveWindow(type);

        if (type === "windows") {
            setMessage("⚠ MAUVAIS CHOIX ⚠");
            setMessageClass("bad");
        } else {
            setMessage("✓ VOUS AVEZ DEBLOQUÉ LA CLÉ ✓");
            setMessageClass("good");

            // --- ⬇⬇ NOUVELLE LOGIQUE DE STOCKAGE ---
            const keys = JSON.parse(localStorage.getItem("unlockedKeys") || "[]");

            if (!keys.includes("bronze")) {
                keys.push("bronze");
                localStorage.setItem("unlockedKeys", JSON.stringify(keys));
            }
            // --- ⬆⬆ ---
        }

        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 1500);
    }

    return (
        <div className="page">
            <div className="container">
                <h1>▌CHOIX SYSTEME▌</h1>

                <div className="windows-container">
                    {/* ---- WINDOWS ---- */}
                    <div className="window-wrapper">
                        <div
                            className={`window ${activeWindow === "windows" ? "active" : ""}`}
                            onClick={() => handleClick("windows")}
                            tabIndex={0}
                            onKeyDown={(e) =>
                                (e.key === "Enter" || e.key === " ") && handleClick("windows")
                            }
                        >
                            <div className="window-frame">
                                <div className="window-title">&gt; WINDOWS.EXE</div>
                                <div className="window-content">
                                    <img
                                        src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/65b00cd1-ead2-4b27-8ab2-253ba9a87658.png"
                                        alt="Windows"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="window-texte">
                            Ça coûte cher<br />
                            Ton PC devient lent<br />
                            Tes données voyagent<br />
                            T'es prisonnier
                        </div>
                    </div>

                    {/* ---- LINUX ---- */}
                    <div className="window-wrapper">
                        <div
                            className={`window ${activeWindow === "linux" ? "active" : ""}`}
                            onClick={() => handleClick("linux")}
                            tabIndex={0}
                            onKeyDown={(e) =>
                                (e.key === "Enter" || e.key === " ") && handleClick("linux")
                            }
                        >
                            <div className="window-frame">
                                <div className="window-title">&gt; LINUX.SH</div>
                                <div className="window-content">
                                    <img
                                        src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/65aa3498-04e3-4af2-9ed5-53be806db45d.png"
                                        alt="Linux"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="window-texte">
                            C'est GRATUIT<br />
                            Ton PC devient rapide<br />
                            Tes données RESTENT chez toi<br />
                            T'es libre et autonome
                        </div>
                    </div>
                </div>

                <div className="click-hint">▼ CLIQUEZ SUR UNE FENETRE ▼</div>

                <div className="nav-link">
                    <a href="/">← Retour aux portails</a>
                </div>
            </div>

            <div className={`message ${showMessage ? "show" : ""} ${messageClass}`}>
                {message}
            </div>
        </div>
    );
}
