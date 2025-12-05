import { useState, useEffect, useRef } from "react";

// --- ICONES ---
const MoveIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ imageRendering: "pixelated" }}>
        <polygon points="20,2 26,10 22,10 22,18 18,18 18,10 14,10" fill="#ffd700" />
        <polygon points="20,38 14,30 18,30 18,22 22,22 22,30 26,30" fill="#ffd700" />
        <polygon points="2,20 10,14 10,18 18,18 18,22 10,22 10,26" fill="#ffd700" />
        <polygon points="38,20 30,26 30,22 22,22 22,18 30,18 30,14" fill="#ffd700" />
    </svg>
);

const RotateIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ imageRendering: "pixelated" }}>
        <circle cx="20" cy="20" r="12" stroke="#f48c06" strokeWidth="4" fill="none" />
        <polygon points="28,12 32,8 32,16" fill="#f48c06" />
        <polygon points="12,28 8,32 16,32" fill="#f48c06" />
    </svg>
);

export default function DraggableKey({
                                         filename,
                                         initialX,
                                         initialY,
                                         onMove,
                                         onRotate,
                                         locked,
                                         rotation: rotationProp, // 🔥 rotation contrôlée par KeysPage
                                     }) {
    const imgRef = useRef(null);

    // position en pixels
    const [pos, setPos] = useState({
        x: (window.innerWidth * initialX) / 100,
        y: (window.innerHeight * initialY) / 100,
    });

    const [dragging, setDragging] = useState(false);
    const [rotating, setRotating] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // rotation interne → synchronisée avec rotationProp
    const [rotation, setRotation] = useState(rotationProp);

    // utilisé pour calculer delta
    const [startRotation, setStartRotation] = useState(0);
    const [startMouseAngle, setStartMouseAngle] = useState(0);

    // 👉 synchroniser DraggableKey avec KeysPage (ex : quand tu remets à 0°)
    useEffect(() => {
        setRotation(rotationProp);
    }, [rotationProp]);

    // utile pour calculer où on clique (haut/bas)
    function getLocalClickCoords(e, rect, rotationDeg) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        const rad = (-rotationDeg * Math.PI) / 180;

        return {
            localX: dx * Math.cos(rad) - dy * Math.sin(rad),
            localY: dx * Math.sin(rad) + dy * Math.cos(rad),
        };
    }

    const handleMouseDown = (e) => {
        if (locked) return;

        e.preventDefault();
        const rect = imgRef.current.getBoundingClientRect();

        const { localY } = getLocalClickCoords(e, rect, rotation);
        const zone = rect.height * 0.35;

        // --- ROTATION (haut ou bas) ---
        if (localY < -zone || localY > zone) {
            setRotating(true);

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const angleDeg = (angleRad * 180) / Math.PI;

            setStartRotation(rotation);
            setStartMouseAngle(angleDeg);
            return;
        }

        // --- DRAG ---
        setDragging(true);
        setOffset({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        });
    };

    // drag + rotate
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (locked) return;

            // --- ROTATION ---
            if (rotating && imgRef.current) {
                const rect = imgRef.current.getBoundingClientRect();

                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const angleDeg = (angleRad * 180) / Math.PI;

                let delta = angleDeg - startMouseAngle;
                if (delta > 180) delta -= 360;
                if (delta < -180) delta += 360;

                const newRot = startRotation + delta;

                setRotation(newRot);
                onRotate && onRotate(newRot);
            }

            // --- DRAG ---
            if (dragging) {
                const newX = e.clientX - offset.x;
                const newY = e.clientY - offset.y;

                setPos({ x: newX, y: newY });

                const rect = imgRef.current.getBoundingClientRect();

                onMove &&
                onMove({
                    px: rect.left,
                    py: rect.top,
                    w: rect.width,
                    h: rect.height,
                    x: (rect.left / window.innerWidth) * 100,
                    y: (rect.top / window.innerHeight) * 100,
                });
            }
        };

        const stopAll = () => {
            setDragging(false);
            setRotating(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopAll);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopAll);
        };
    }, [dragging, rotating, offset, startMouseAngle, startRotation, locked]);

    return (
        <div
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: "8vw",
                pointerEvents: "none",
                zIndex: 10,
            }}
        >
            {(!locked && (dragging || rotating)) && (
                <div
                    style={{
                        position: "absolute",
                        top: "35%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        opacity: 0.75,
                        background: "rgba(0,0,0,0.6)",
                        padding: "4px 6px",
                        borderRadius: "6px",
                        zIndex: 11,
                        pointerEvents: "none",
                    }}
                >
                    {rotating ? <RotateIcon /> : <MoveIcon />}
                </div>
            )}

            <img
                ref={imgRef}
                src={`/keys/${filename}`}
                onMouseDown={handleMouseDown}
                draggable={false}
                style={{
                    width: "100%",
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center",
                    transition: locked ? "transform 0.25s ease-out" : "none", // 🔥 réalignement smooth
                    userSelect: "none",
                    cursor: locked
                        ? "default"
                        : dragging || rotating
                            ? "grabbing"
                            : "grab",
                    pointerEvents: "auto",
                }}
            />
        </div>
    );
}
