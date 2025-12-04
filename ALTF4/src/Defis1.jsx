<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Arcade Window</title>
    <style>
        :root {
            --color-background: #0a0e27;
            --color-primary: #00ff88;
            --color-secondary: #00ffff;
            --color-accent: #ff00ff;
            --color-text: #ffffff;
            --color-dark-accent: #1a1a4e;
            --color-glow-primary: rgba(0, 255, 136, 0.8);
            --color-glow-secondary: rgba(0, 255, 255, 0.8);
            --color-glow-accent: rgba(255, 0, 136, 0.8);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1a4e 50%, #2a0a3e 100%);
            background-attachment: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Courier New', monospace;
            overflow: hidden;
            position: relative;
        }

        body::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(0deg, transparent 24%, rgba(0, 255, 136, .08) 25%, rgba(0, 255, 136, .08) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, .08) 75%, rgba(0, 255, 136, .08) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(0, 255, 136, .08) 25%, rgba(0, 255, 136, .08) 26%, transparent 27%, transparent 74%, rgba(0, 255, 136, .08) 75%, rgba(0, 255, 136, .08) 76%, transparent 77%, transparent);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: 0;
            animation: gridPulse 4s ease-in-out infinite;
        }

        @keyframes gridPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
        }

        .container {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
        }

        h1 {
            color: var(--color-primary);
            font-size: 3rem;
            text-shadow: 
                0 0 10px var(--color-primary), 
                0 0 20px var(--color-accent),
                0 0 40px var(--color-glow-primary),
                0 0 60px var(--color-glow-accent);
            text-align: center;
            letter-spacing: 4px;
            animation: flicker 0.15s infinite, glow 2s ease-in-out infinite;
            font-weight: bold;
        }

        @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }

        @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px var(--color-primary), 0 0 20px var(--color-accent), 0 0 40px var(--color-glow-primary), 0 0 60px var(--color-glow-accent); }
            50% { text-shadow: 0 0 20px var(--color-primary), 0 0 30px var(--color-accent), 0 0 50px var(--color-glow-primary), 0 0 80px var(--color-glow-accent); }
        }

        .windows-container {
            display: flex;
            gap: 60px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .window-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .window {
            width: 280px;
            height: 330px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            transform-style: preserve-3d;
            filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3));
        }

        .window:hover {
            transform: scale(1.08) rotateY(8deg) rotateX(-5deg);
            filter: drop-shadow(0 0 30px rgba(0, 255, 136, 0.6));
        }

        .window-frame {
            width: 100%;
            height: 100%;
            border: 4px solid;
            border-image: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent)) 1;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 255, 255, 0.12));
            box-shadow: 
                0 0 30px rgba(0, 255, 136, 0.6),
                inset 0 0 30px rgba(0, 255, 255, 0.15),
                0 0 60px var(--color-accent),
                inset 0 0 60px rgba(255, 0, 136, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            border-radius: 8px;
        }

        .window-frame::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 255, 136, 0.05) 0px,
                rgba(0, 255, 136, 0.05) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            animation: scan 6s linear infinite;
        }

        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }

        .window-title {
            position: absolute;
            top: 10px;
            left: 15px;
            color: var(--color-primary);
            font-size: 0.9rem;
            font-weight: bold;
            letter-spacing: 2px;
            text-shadow: 0 0 5px var(--color-primary);
        }

        .window-content {
            z-index: 2;
            text-align: center;
            color: var(--color-secondary);
            text-shadow: 
                0 0 15px var(--color-secondary),
                0 0 30px var(--color-glow-secondary);
            animation: pulse 2s ease-in-out infinite, float 3s ease-in-out infinite;
        }

        .window-content img {
            max-width: 120px;
            height: auto;
            filter: drop-shadow(0 0 10px var(--color-glow-secondary));
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .window-label {
            position: absolute;
            bottom: 15px;
            left: 0;
            right: 0;
            color: var(--color-secondary);
            font-size: 1.1rem;
            font-weight: bold;
            letter-spacing: 2px;
            text-shadow: 0 0 8px var(--color-secondary);
        }

        .window-texte {
            color: var(--color-secondary);
            font-size: 0.9rem;
            text-align: center;
            text-shadow: 0 0 8px var(--color-secondary);
            letter-spacing: 1px;
            line-height: 1.6;
        }

        .window.active .window-frame {
            border-image: linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--color-secondary)) 1;
            box-shadow: 
                0 0 50px rgba(255, 0, 136, 1),
                inset 0 0 50px rgba(255, 0, 136, 0.3),
                0 0 100px var(--color-primary);
            animation: windowPulse 0.6s ease;
        }

        @keyframes windowPulse {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.03); }
            50% { transform: scale(1.05); }
            75% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }

        .click-hint {
            color: var(--color-primary);
            font-size: 0.8rem;
            margin-top: 60px;
            opacity: 0.7;
            animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.3; }
        }

        .message {
            color: var(--color-primary);
            font-size: 1.5rem;
            text-shadow: 
                0 0 10px var(--color-primary),
                0 0 20px var(--color-glow-primary),
                0 0 40px var(--color-accent);
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            pointer-events: none;
            z-index: 10;
            letter-spacing: 2px;
            font-weight: bold;
        }

        .message.show {
            animation: messageShow 0.8s ease forwards;
        }

        @keyframes messageShow {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0) rotateZ(-20deg);
            }
            25% {
                opacity: 1;
            }
            75% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1) rotateZ(0deg);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>▌CHOIX SYSTEME▌</h1>
        
        <div class="windows-container">
            <div class="window-wrapper">
                <div class="window" data-window="windows">
                    <div class="window-frame">
                        <div class="window-title">&gt; WINDOWS.EXE</div>
                        <div class="window-content"><img src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/65b00cd1-ead2-4b27-8ab2-253ba9a87658.png" alt="Windows"></div>
                        <div class="window-label">WINDOWS</div>
                    </div>
                </div>
                <div class="window-texte">Ça coûte cher<br>Ton PC devient lent<br>Tes données voyagent<br>T'es prisonner</div>
            </div>

            <div class="window-wrapper">
                <div class="window" data-window="linux">
                    <div class="window-frame">
                        <div class="window-title">&gt; LINUX.SH</div>
                        <div class="window-content"><img src="https://user-gen-media-assets.s3.amazonaws.com/seedream_images/65aa3498-04e3-4af2-9ed5-53be806db45d.png" alt="Linux"></div>
                        <div class="window-label">LINUX</div>
                    </div>
                </div>
                <div class="window-texte">C'est GRATUIT<br>Ton PC devient rapide<br>Tes données RESTENT chez toi<br>T'es libre et autonome</div>
            </div>
        </div>

        <div class="click-hint">▼ CLIQUEZ SUR UNE FENETRE ▼</div>
    </div>

    <div class="message" id="message"></div>

    <script>
        const windows = document.querySelectorAll('.window');
        const messageElement = document.getElementById('message');

        windows.forEach(windowEl => {
            windowEl.addEventListener('click', function(e) {
                e.preventDefault();
                
                const windowType = this.getAttribute('data-window');
                
                windows.forEach(w => w.classList.remove('active'));
                
                this.classList.add('active');

                const messages = {
                    windows: '⚠ MAUVAIS CHOIX ⚠',
                    linux: '✓ BON CHOIX ✓'
                };
                
                messageElement.textContent = messages[windowType];
                
                if (windowType === 'windows') {
                    messageElement.style.color = '#ff1744';
                    messageElement.style.textShadow = '0 0 10px #ff1744, 0 0 20px #ff1744, 0 0 40px #ff1744';
                } else {
                    messageElement.style.color = '#00ff88';
                    messageElement.style.textShadow = '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88';
                }

                messageElement.classList.add('show');

                setTimeout(() => {
                    messageElement.classList.remove('show');
                }, 1500);
                
                console.log('Clicked on:', windowType);
            });

            windowEl.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        windows.forEach(w => w.setAttribute('tabindex', '0'));
    </script>
</body>
</html>
