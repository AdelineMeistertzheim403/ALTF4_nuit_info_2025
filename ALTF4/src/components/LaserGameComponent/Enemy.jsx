import React, { useMemo } from 'react';

const Enemy = ({ x, y, size, img }) => {
    // Génération d'une couleur néon aléatoire
    const neonColor = useMemo(() => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 100%, 50%)`;
    }, []);

    return (
        <img
            src={img}
            alt="enemy"
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                userSelect: 'none',

                // Effet néon : teinte + glow
                filter: `drop-shadow(0 0 8px ${neonColor}) drop-shadow(0 0 16px ${neonColor})`,
            }}
        />
    );
};

export default Enemy;
