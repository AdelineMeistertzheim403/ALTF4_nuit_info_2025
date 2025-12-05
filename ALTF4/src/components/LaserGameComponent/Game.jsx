import React, { useEffect, useRef, useState } from 'react';
import Enemy from './Enemy';
import LeaderBoard from './LeaderBoard'; 

// ... Vos imports d'images et sons (inchangés) ...
import appleImg from '../../SnakeSouls/assets/sprites/enemies/apple.png';
import chromeImg from '../../SnakeSouls/assets/sprites/enemies/chrome.png';
import huaweiImg from '../../SnakeSouls/assets/sprites/enemies/huawei.png';
import ibmImg from '../../SnakeSouls/assets/sprites/enemies/ibm.png';
import nvidiaImg from '../../SnakeSouls/assets/sprites/enemies/nvidia.png';
import oracleImg from '../../SnakeSouls/assets/sprites/enemies/oracle.png';
import samsungImg from '../../SnakeSouls/assets/sprites/enemies/samsung.png';
import windowsImg from '../../SnakeSouls/assets/sprites/enemies/windows.png';
import laser from '../../assets/audio/laser.mp3';
import damage from '../../assets/audio/damage.mp3';

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// --- METHODE UTILITAIRE POUR L'URL ---
const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('adelinemeistertzheim.fr')) {
      return 'https://altf4.adelinemeistertzheim.fr/api/scores';
    }
    return 'http://localhost:4000/api/scores';
};

const GameHUD = ({ score, timeLeft }) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '40px', color: 'white', fontFamily: 'monospace',
            fontSize: '28px', fontWeight: 'bold', zIndex: 10, pointerEvents: 'none',
            textShadow: '2px 2px 0 #000'
        }}>
            <div style={{ color: timeLeft <= 10 ? '#ff4444' : 'white' }}>⏳ {formattedTime}</div>
            <div style={{ color: '#44ff44' }}>★ {score}</div>
        </div>
    );
};

function Game({ pseudo, onShoot, onHit }) {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180); 
    const [isGameOver, setIsGameOver] = useState(false);
    const [scoreSent, setScoreSent] = useState(false);
    const [playerRank, setPlayerRank] = useState(null);

    const [blasts, setBlasts] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [bullets, setBullets] = useState([]);

    const laserSound = new Audio(laser);
    
    const mousePosRef = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
    const onHitRef = useRef(onHit);
    const onShootRef = useRef(onShoot);
    const rafRef = useRef(null);

    const enemyImages = [appleImg, chromeImg, huaweiImg, ibmImg, nvidiaImg, oracleImg, samsungImg, windowsImg];

    useEffect(() => {
        onHitRef.current = onHit;
        onShootRef.current = onShoot;
    }, [onHit, onShoot]);

    // --- ENVOI DU SCORE À LA FIN ---
    useEffect(() => {
        if (isGameOver && !scoreSent) {
            const sendScore = async () => {
                try {
                    // Utilisation de la méthode dynamique ici
                    const url = getApiUrl();
                    console.log("Posting score to:", url);

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pseudo: pseudo,
                            score: score
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Score enregistré:', data);
                        setPlayerRank(data.rang); // Récupérer le rang depuis la réponse
                        setScoreSent(true);
                    } else {
                        console.error('❌ Erreur lors de l\'enregistrement du score');
                    }
                } catch (error) {
                    console.error('❌ Erreur réseau:', error);
                }
            };

            sendScore();
        }
    }, [isGameOver, scoreSent, pseudo, score]);

    // --- LOGIQUE DE REJOUER / QUITTER ---
    const handleReplay = () => {
        setScore(0);
        setTimeLeft(180);
        setEnemies([]);
        setBullets([]);
        setBlasts([]);
        setIsGameOver(false);
        setScoreSent(false);
        setPlayerRank(null); // Reset du rang
    };

    const handleQuit = () => {
        window.location.reload(); 
    };

    // --- GESTION DU TIMER ---
    useEffect(() => {
        if (isGameOver) return;

        const timerInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    setIsGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [isGameOver]);

    // Gestion souris
    useEffect(() => {
        const onMove = (e) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    // Spawning
    useEffect(() => {
        if (isGameOver) return;

        const spawnInterval = 800; 
        const spawnTimer = setInterval(() => {
            setEnemies(prev => {
                if (prev.length >= 10) return prev;
                
                const edge = Math.floor(rand(0, 4));
                const w = window.innerWidth;
                const h = window.innerHeight;
                let x, y;
                switch(edge) {
                    case 0: x = rand(0, w); y = -60; break;
                    case 1: x = w + 60; y = rand(0, h); break;
                    case 2: x = rand(0, w); y = h + 60; break;
                    case 3: x = -60; y = rand(0, h); break;
                    default: x = rand(0, w); y = -60;
                }
                const angleToCenter = Math.atan2((h / 2) - y, (w / 2) - x);
                const angle = angleToCenter + rand(-0.5, 0.5);
                const img = enemyImages[Math.floor(rand(0, enemyImages.length))];
                const speed = rand(2, 4);

                return [...prev, {
                    id: Date.now() + Math.floor(Math.random() * 10000),
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    img,
                    size: rand(34, 60),
                    shootCooldown: rand(1000, 3000),
                    lastShot: Date.now() + rand(0, 500),
                    entered: false
                }];
            });
        }, spawnInterval);

        return () => clearInterval(spawnTimer);
    }, [isGameOver]);

    // Boucle de jeu
    useEffect(() => {
        if (isGameOver) {
            cancelAnimationFrame(rafRef.current);
            return;
        }

        const step = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mx = mousePosRef.current.x;
            const my = mousePosRef.current.y;

            // 1. Mouvement Ennemis
            setEnemies(prev => prev.map(ent => {
                let nx = ent.x + ent.vx;
                let ny = ent.y + ent.vy;
                let hasEntered = ent.entered;

                if (!hasEntered) {
                    if (nx > 0 && nx < width && ny > 0 && ny < height) hasEntered = true;
                } else {
                    const r = ent.size / 2;
                    if (nx < r || nx > width - r) { ent.vx *= -1; nx = Math.max(r, Math.min(nx, width - r)); }
                    if (ny < r || ny > height - r) { ent.vy *= -1; ny = Math.max(r, Math.min(ny, height - r)); }
                }

                if (Math.random() < 0.05) {
                    ent.vx += rand(-0.5, 0.5);
                    ent.vy += rand(-0.5, 0.5);
                }

                const MAX_SPEED = 5;
                const currentSpeed = Math.hypot(ent.vx, ent.vy); 
                if (currentSpeed > MAX_SPEED) {
                    const ratio = MAX_SPEED / currentSpeed;
                    ent.vx *= ratio;
                    ent.vy *= ratio;
                }
                return { ...ent, x: nx, y: ny, entered: hasEntered };
            }));

            const now = Date.now();

            // 2. Tirs Ennemis
            setEnemies(prev => {
                const firingEnemies = [...prev];
                firingEnemies.forEach(ent => {
                    if (now - ent.lastShot > ent.shootCooldown) {
                        const dx = mx - ent.x; 
                        const dy = my - ent.y; 
                        const perfectAngle = Math.atan2(dy, dx);
                        const spread = 0.1; 
                        const angle = perfectAngle + rand(-spread, spread);
                        const speed = 5;
                        
                        setBullets(bPrev => [...bPrev, {
                            id: now + Math.floor(Math.random()*100000),
                            x: ent.x, y: ent.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            from: 'enemy'
                        }]);
                        ent.lastShot = now;
                        ent.shootCooldown = rand(800, 2500);
                    }
                });
                return firingEnemies;
            });

            // 3. Mouvement Balles
            setBullets(prev => prev.map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy })));

            // 4. Collisions
            setBullets(prev => prev.filter(b => {
                if (b.from === 'enemy') {
                    const d = Math.hypot(b.x - mx, b.y - my);
                    if (d < 20) {
                        const hitSound = new Audio(damage);
                        hitSound.volume = 0.5;
                        hitSound.play(); 
                        if (onHitRef.current) onHitRef.current(5);
                        setScore(s => s - 5); 
                        return false; 
                    }
                    if (b.x < -100 || b.x > width + 100 || b.y < -100 || b.y > height + 100) return false;
                }
                return true;
            }));

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [isGameOver]); 

    // Gestion du tir JOUEUR
    const handleClick = (e) => {
        if (isGameOver) return; 

        const id = Date.now();
        const s = laserSound.cloneNode();
        s.play();

        const newBlast = { id, x: e.clientX, y: e.clientY };
        setBlasts((prev) => [...prev, newBlast]);

        const explosionRadius = 60;
        setEnemies(prev => {
            const survivors = [];
            let pointsGained = 0; 

            prev.forEach(ent => {
                const d = Math.hypot(ent.x - newBlast.x, ent.y - newBlast.y);
                if (d < explosionRadius + ent.size/2) {
                    if (onShootRef.current) onShootRef.current();
                    pointsGained += 20; 
                } else {
                    survivors.push(ent);
                }
            });

            if (pointsGained > 0) {
                setScore(s => s + pointsGained);
            }

            return survivors;
        });

        setTimeout(() => setBlasts(p => p.filter(b => b.id !== id)), 400);
    };

    // --- CONDITION DE FIN ---
    if (isGameOver) {
        return (
            <LeaderBoard 
                score={score} 
                pseudo={pseudo}
                rang={playerRank}
                onReplay={handleReplay}
                onQuit={handleQuit}
            />
        );
    }

    // Rendu du jeu (inchangé)
    return (
        <div 
            onClick={handleClick}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                cursor: 'none', zIndex: 1, background: 'transparent', overflow: 'hidden'
            }}
        >
            <GameHUD score={score} timeLeft={timeLeft} />
            <VisualCursor />
            {blasts.map((blast) => (
                <div key={blast.id} style={{
                        position: 'absolute', left: blast.x, top: blast.y,
                        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                    }}>
                    <div className="laser-blast"></div>
                </div>
            ))}
            <style>{`
                @keyframes blastAnim {
                    0% { width: 0px; height: 0px; opacity: 1; background: white; }
                    50% { background: red; }
                    100% { width: 100px; height: 100px; opacity: 0; background: red; }
                }
                .laser-blast {
                    border-radius: 50%;
                    animation: blastAnim 0.4s ease-out forwards;
                    box-shadow: 0 0 10px red, 0 0 20px orange;
                }
            `}</style>
            {enemies.map(ent => (
                <Enemy key={ent.id} x={ent.x} y={ent.y} size={ent.size} img={ent.img} />
            ))}
            {bullets.map(b => {
                const angleRad = Math.atan2(b.vy, b.vx);
                const angleDeg = angleRad * (180 / Math.PI);
                return (
                    <div key={b.id} style={{
                        position: 'absolute', left: b.x, top: b.y, 
                        transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
                        width: 24, height: 4, borderRadius: '2px', backgroundColor: '#ff0000', 
                        boxShadow: '0 0 4px #ff0000, 0 0 8px rgba(255, 50, 50, 0.8)', 
                        pointerEvents: 'none', transformOrigin: 'center center' 
                    }} />
                );
            })}
        </div>
    );
}

const VisualCursor = () => {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    useEffect(() => {
        const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <div style={{
            position: 'absolute', left: pos.x, top: pos.y,
            transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 5
        }}>
            <div style={{ width: 20, height: 20, border: '2px solid red', borderRadius: '50%', backgroundColor: 'rgba(255,0,0,0.2)' }} />
        </div>
    );
};

export default Game;