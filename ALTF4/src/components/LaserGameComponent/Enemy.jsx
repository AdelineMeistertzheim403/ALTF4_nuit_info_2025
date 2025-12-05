import React from 'react';

// On reçoit toutes les données nécessaires en props
const Enemy = ({ x, y, size, img }) => {
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
                transform: 'translate(-50%, -50%)', // Centrer l'image sur ses coordonnées X,Y
                pointerEvents: 'none', // Important pour que le clic traverse l'image vers le div principal
                userSelect: 'none'
            }}
        />
    );
};

export default Enemy;