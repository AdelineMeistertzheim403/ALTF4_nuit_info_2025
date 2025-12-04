import React from 'react';

function LeaderBoard({ pseudo, score }) {
    return (
        <div style={{ 
            background: 'rgba(0, 0, 0, 0.8)', 
            color: 'white', 
            padding: '10px', 
            textAlign: 'center' 
        }}>
            <h2>Classement</h2>
            <p>Agent : <strong style={{ color: '#4CAF50' }}>{pseudo}</strong></p>
            <p>Score actuel : <strong style={{ color: '#ffeb3b' }}>{score}</strong></p>
        </div>
    );
}

export default LeaderBoard;