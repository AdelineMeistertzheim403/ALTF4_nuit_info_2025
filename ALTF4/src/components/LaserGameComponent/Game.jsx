import React, { useEffect, useRef, useState } from 'react';
import Enemy from './Enemy';

// Tes imports d'images...
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

function Game({ pseudo, onShoot, onHit }) {
    const [blasts, setBlasts] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [bullets, setBullets] = useState([]);

    const laserSound = new Audio(laser);
    const damageSound = new Audio(damage);
    
    // 1. CORRECTION BUG : On utilise useRef pour la souris et les callbacks
    // Cela évite de redémarrer la boucle useEffect à chaque mouvement ou changement de score
    const mousePosRef = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });
    const onHitRef = useRef(onHit);
    const onShootRef = useRef(onShoot);

    const enemyImages = [appleImg, chromeImg, huaweiImg, ibmImg, nvidiaImg, oracleImg, samsungImg, windowsImg];
    const rafRef = useRef(null);

    // Mettre à jour les refs quand les props changent
    useEffect(() => {
        onHitRef.current = onHit;
        onShootRef.current = onShoot;
    }, [onHit, onShoot]);

    // Gestion de la souris via Ref (ne déclenche pas de re-render du composant, juste maj de la valeur)
    useEffect(() => {
        const onMove = (e) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    // Spawning des ennemis (Limité à 10)
    // Spawning des ennemis (Objectif : toujours 10 visibles)
    useEffect(() => {
        // On réduit l'intervalle (800ms au lieu de 1200ms) pour remplir l'écran plus vite
        const spawnInterval = 800; 
        
        const spawnTimer = setInterval(() => {
            setEnemies(prev => {
                // Si on a déjà 10 ennemis, on ne fait rien
                if (prev.length >= 10) return prev;

                const edge = Math.floor(rand(0, 4));
                const w = window.innerWidth;
                const h = window.innerHeight;
                let x, y;

                // Position de départ (Hors écran)
                switch(edge) {
                    case 0: x = rand(0, w); y = -60; break; // Haut
                    case 1: x = w + 60; y = rand(0, h); break; // Droite
                    case 2: x = rand(0, w); y = h + 60; break; // Bas
                    case 3: x = -60; y = rand(0, h); break; // Gauche
                    default: x = rand(0, w); y = -60;
                }

                // --- CORRECTION MAJEURE ICI ---
                // Au lieu d'un angle au hasard, on vise le centre de l'écran !
                // Math.atan2(dy, dx) donne l'angle entre le point de spawn et le centre
                const angleToCenter = Math.atan2((h / 2) - y, (w / 2) - x);
                
                // On ajoute un peu de variation (-0.5 à +0.5 radians) pour qu'ils ne foncent pas tous pile au milieu
                const angle = angleToCenter + rand(-0.5, 0.5);

                const img = enemyImages[Math.floor(rand(0, enemyImages.length))];
                const speed = rand(2, 4); // Un peu plus rapide pour entrer vite

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
    }, []);

    // Boucle de jeu principale
    useEffect(() => {
        const step = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            // On lit la position souris depuis la Ref
            const mx = mousePosRef.current.x;
            const my = mousePosRef.current.y;

            // 1. Ennemis
            setEnemies(prev => prev.map(ent => {
                let nx = ent.x + ent.vx;
                let ny = ent.y + ent.vy;
                let hasEntered = ent.entered;

                // (Code de gestion des murs et entrée d'écran... inchangé)
                if (!hasEntered) {
                    if (nx > 0 && nx < width && ny > 0 && ny < height) hasEntered = true;
                } else {
                    const r = ent.size / 2;
                    if (nx < r || nx > width - r) {
                        ent.vx *= -1;
                        nx = Math.max(r, Math.min(nx, width - r));
                    }
                    if (ny < r || ny > height - r) {
                        ent.vy *= -1;
                        ny = Math.max(r, Math.min(ny, height - r));
                    }
                }

                // --- MODIFICATION ICI : Ajout d'aléatoire + Limitation de vitesse ---

                // 1. On ajoute la variation aléatoire (comme avant)
                if (Math.random() < 0.05) { // J'ai augmenté un peu la proba (0.01 -> 0.05) pour qu'ils bougent plus
                    ent.vx += rand(-0.5, 0.5);
                    ent.vy += rand(-0.5, 0.5);
                }

                // 2. On impose la vitesse max (C'est nouveau)
                const MAX_SPEED = 5; // Tu peux ajuster cette valeur (par ex: 4, 6, 8)
                
                // Math.hypot calcule la longueur du vecteur vitesse (racine carrée de x²+y²)
                const currentSpeed = Math.hypot(ent.vx, ent.vy); 

                if (currentSpeed > MAX_SPEED) {
                    // On calcule le ratio de réduction nécessaire
                    const ratio = MAX_SPEED / currentSpeed;
                    // On applique ce ratio pour ralentir sans changer la direction
                    ent.vx *= ratio;
                    ent.vy *= ratio;
                }

                // ------------------------------------------------------------------

                return { ...ent, x: nx, y: ny, entered: hasEntered };
            }));

            const now = Date.now();

            // 2. Tirs Ennemis
            setEnemies(prev => {
                const firingEnemies = [...prev];
                firingEnemies.forEach(ent => {
                    if (now - ent.lastShot > ent.shootCooldown) {
                        
                        // 1. Calculer la distance et l'angle vers la souris (ref)
                        const dx = mx - ent.x; 
                        const dy = my - ent.y; 
                        
                        // Math.atan2 donne l'angle exact (en radians) vers le joueur
                        const perfectAngle = Math.atan2(dy, dx);

                        // 2. Ajouter de l'imprécision (Spread)
                        // Une valeur de 0.2 correspond environ à +/- 11 degrés d'erreur.
                        // Plus le chiffre est grand, moins ils sont précis.
                        const spread = 0.1; 
                        const angle = perfectAngle + rand(-spread, spread);

                        const speed = 5;
                        
                        setBullets(bPrev => [...bPrev, {
                            id: now + Math.floor(Math.random()*100000),
                            x: ent.x,
                            y: ent.y,
                            // 3. Convertir l'angle final en vitesse X et Y
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
                    // Vérification collision avec la souris (ref)
                    const d = Math.hypot(b.x - mx, b.y - my);
                    
                    if (d < 20) {
                        // --- CORRECTION SONORE ICI ---
                        // On crée une nouvelle instance audio et on la joue directement
                        // Cela permet de jouer le son même si le précédent n'est pas fini (superposition)
                        const hitSound = new Audio(damage);
                        hitSound.volume = 0.5; // Optionnel : baisser un peu le volume si c'est trop fort
                        hitSound.play(); 

                        if (onHitRef.current) onHitRef.current(5);
                        return false; // Supprime la balle IMMÉDIATEMENT
                    }
                    
                    if (b.x < -100 || b.x > width + 100 || b.y < -100 || b.y > height + 100) return false;
                }
                return true;
            }));

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, []); // Dépendance vide = boucle stable qui ne reset pas

    const handleClick = (e) => {
        const id = Date.now();
        laserSound.play();
        const newBlast = { id, x: e.clientX, y: e.clientY };
        setBlasts((prev) => [...prev, newBlast]);

        const explosionRadius = 60;
        setEnemies(prev => {
            const survivors = [];
            prev.forEach(ent => {
                const d = Math.hypot(ent.x - newBlast.x, ent.y - newBlast.y);
                if (d < explosionRadius + ent.size/2) {
                    if (onShootRef.current) onShootRef.current();
                } else {
                    survivors.push(ent);
                }
            });
            return survivors;
        });

        setTimeout(() => setBlasts(p => p.filter(b => b.id !== id)), 400);
    };

    return (
        <div 
            onClick={handleClick}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                cursor: 'none', zIndex: 1, background: 'transparent', overflow: 'hidden'
            }}
        >
            {/* Curseur Joueur : On utilise mousePosRef.current directement ? 
               Non, React ne re-rend pas le visuel si on change une ref. 
               ASTUCE : Pour l'affichage du curseur SEULEMENT, on peut utiliser un petit state local 
               ou une div qui suit la souris via CSS direct si on veut perf max, 
               mais ici on va utiliser un petit listener dédié pour l'affichage visuel */}
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

            // ... dans le return du composant Game ...

            {enemies.map(ent => (
                <Enemy key={ent.id} x={ent.x} y={ent.y} size={ent.size} img={ent.img} />
            ))}

            {/* --- MODIFICATION ICI : Rendu des balles --- */}
            {bullets.map(b => {
                // 1. Calculer l'angle de rotation basé sur la direction (vx, vy)
                // Math.atan2(y, x) donne l'angle en radians.
                const angleRad = Math.atan2(b.vy, b.vx);
                // On convertit en degrés pour le CSS
                const angleDeg = angleRad * (180 / Math.PI);

                return (
                    <div key={b.id} style={{
                        position: 'absolute', 
                        left: b.x, 
                        top: b.y, 
                        // 2. On applique la rotation. Important : translate d'abord pour centrer, puis rotate.
                        transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
                        // 3. Nouveau style : un trait rouge long et fin
                        width: 24,     // Longueur du laser
                        height: 4,      // Épaisseur du laser
                        borderRadius: '2px', // Légèrement arrondi aux bouts
                        backgroundColor: '#ff0000', // Rouge vif
                        // Une lueur rouge plus intense et un peu plus "étalée" pour l'effet laser
                        boxShadow: '0 0 4px #ff0000, 0 0 8px rgba(255, 50, 50, 0.8)', 
                        pointerEvents: 'none',
                        // Optionnel : pour que le point d'origine du tir soit un peu devant
                        transformOrigin: 'center center' 
                    }} />
                );
            })}
        </div>
    );
}

// Petit composant séparé pour gérer l'affichage du curseur sans impacter la boucle de jeu
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