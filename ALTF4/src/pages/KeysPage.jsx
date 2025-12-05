import DraggableKey from "../components/DraggableKey";
import { useState } from "react";

export default function KeysPage() {
    const [keyData, setKeyData] = useState({
        gold: null,
        silver: null,
        bronze: null,
    });

    const [rotations, setRotations] = useState({
        gold: 0,
        silver: 0,
        bronze: 0,
    });

    const [lockedKeys, setLockedKeys] = useState({
        gold: false,
        silver: false,
        bronze: false,
    });

    const locks = [
        { type: "gold", x: 45, y: 35 },
        { type: "silver", x: 65, y: 20 },
        { type: "bronze", x: 25, y: 18 },
    ];


    function isHorizontal(angle) {

        let corrected = (angle + 90) % 360;

        // Normalize (-180 → +180)
        if (corrected > 180) corrected -= 360;
        if (corrected < -180) corrected += 360;

        const tolerance = 10;
        return Math.abs(corrected) <= tolerance;
    }

    // Collision based on centers
    function isOnLock(lock, key) {
        if (!key) return false;

        const lockX = (lock.x / 100) * window.innerWidth;
        const lockY = (lock.y / 100) * window.innerHeight;

        const lockSize = window.innerWidth * 0.08;

        const lockCenter = {
            x: lockX + lockSize / 2,
            y: lockY + lockSize / 2,
        };

        const keyCenter = {
            x: key.px + key.w / 2,
            y: key.py + key.h / 2,
        };

        const dist = Math.hypot(lockCenter.x - keyCenter.x, lockCenter.y - keyCenter.y);

        return dist < lockSize * 0.85;
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* KEYS */}
            <DraggableKey
                filename="golden_key.png"
                initialX={10}
                initialY={30}
                locked={lockedKeys.gold}
                rotation={rotations.gold}
                onMove={(p) => setKeyData((o) => ({ ...o, gold: p }))}
                onRotate={(deg) => setRotations((o) => ({ ...o, gold: deg }))}
            />

            <DraggableKey
                filename="silver_key.png"
                initialX={0}
                initialY={50}
                locked={lockedKeys.silver}
                rotation={rotations.silver}
                onMove={(p) => setKeyData((o) => ({ ...o, silver: p }))}
                onRotate={(deg) => setRotations((o) => ({ ...o, silver: deg }))}
            />

            <DraggableKey
                filename="bronze_key.png"
                initialX={0}
                initialY={10}
                locked={lockedKeys.bronze}
                rotation={rotations.bronze}
                onMove={(p) => setKeyData((o) => ({ ...o, bronze: p }))}
                onRotate={(deg) => setRotations((o) => ({ ...o, bronze: deg }))}
            />

            {/* LOCKS */}
            {locks.map((lock) => {
                const key = keyData[lock.type];
                const angle = rotations[lock.type];

                const near = isOnLock(lock, key);
                const horizontal = isHorizontal(angle);

                const valid = near && horizontal;

                if (valid && !lockedKeys[lock.type]) {
                    // 1. Lock la clé
                    setLockedKeys((old) => ({ ...old, [lock.type]: true }));

                    // 2. Remet la clé parfaitement droite
                    setRotations((old) => ({ ...old, [lock.type]: -90 }));
                }


                return (
                    <img
                        key={lock.type}
                        src={`/locks/lock-${lock.type}.png`}
                        style={{
                            position: "absolute",
                            left: `${lock.x}%`,
                            top: `${lock.y}%`,
                            width: "8%",
                            pointerEvents: "none",
                            transition: "0.2s",
                            filter:
                                lockedKeys[lock.type]
                                    ? "drop-shadow(0 0 20px #00ff00)"
                                    : valid
                                        ? "drop-shadow(0 0 20px #ffd700)"
                                        : near
                                            ? "drop-shadow(0 0 20px red)"
                                            : "none",
                        }}
                    />
                );
            })}
        </div>
    );
}
