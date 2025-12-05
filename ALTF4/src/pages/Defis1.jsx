import { useState } from "react";
import styles from "../styles/Defis1.module.css";

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
            setMessage("✓ VOUS AVEZ DEBLOQUÉ LA CLÉ BRONZE");
            setMessageClass("good");

            const keys = JSON.parse(localStorage.getItem("unlockedKeys") || "[]");

            if (!keys.includes("bronze")) {
                keys.push("bronze");
                localStorage.setItem("unlockedKeys", JSON.stringify(keys));
                localStorage.setItem("buildingCompleted", 1);
            }
            setTimeout(() => {
                window.location.href = "/keys";
            }, 2500);
        }

        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 1500);
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>▌CHOIX SYSTEME▌</h1>

                <div className={styles.windowsContainer}>
                    <div className={styles.windowWrapper}>
                        <div
                            className={`${styles.window} ${activeWindow === "windows" ? styles.active : ""}`}
                            onClick={() => handleClick("windows")}
                            tabIndex={0}
                            onKeyDown={(e) =>
                                (e.key === "Enter" || e.key === " ") && handleClick("windows")
                            }
                        >
                            <div className={styles.windowFrame}>
                                <div className={styles.windowTitle}>&gt; WINDOWS.EXE</div>
                                <div className={styles.windowContent}>
                                    <img
                                        src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/65b00cd1-ead2-4b27-8ab2-253ba9a87658.png"
                                        alt="Windows"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.windowTexte}>
                            Ça coûte cher<br />
                            Ton PC devient lent<br />
                            Tes données voyagent<br />
                            T'es prisonnier
                        </div>
                    </div>

                    <div className={styles.windowWrapper}>
                        <div
                            className={`${styles.window} ${activeWindow === "linux" ? styles.active : ""}`}
                            onClick={() => handleClick("linux")}
                            tabIndex={0}
                            onKeyDown={(e) =>
                                (e.key === "Enter" || e.key === " ") && handleClick("linux")
                            }
                        >
                            <div className={styles.windowFrame}>
                                <div className={styles.windowTitle}>&gt; LINUX.SH</div>
                                <div className={styles.windowContent}>
                                    <img
                                        src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/65aa3498-04e3-4af2-9ed5-53be806db45d.png"
                                        alt="Linux"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.windowTexte}>
                            C'est GRATUIT<br />
                            Ton PC devient rapide<br />
                            Tes données RESTENT chez toi<br />
                            T'es libre et autonome
                        </div>
                    </div>
                </div>

                <div className={styles.clickHint}>▼ CLIQUEZ SUR UNE FENETRE ▼</div>

                <div className={styles.navLink}>
                    <a href="/">← Retour aux portails</a>
                </div>
            </div>

            <div className={`${styles.message} ${showMessage ? styles.show : ""} ${styles[messageClass]}`}>
                {message}
            </div>
        </div>
    );
}