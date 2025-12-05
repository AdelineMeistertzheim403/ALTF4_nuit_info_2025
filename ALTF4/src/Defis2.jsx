<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrat Caché - Arcade Portal</title>
    <style>
        :root {
            --color-background: #0a0e27;
            --color-primary: #00ff88;
            --color-secondary: #00ffff;
            --color-accent: #ff00ff;
            --color-danger: #ff1744;
            --color-text: #ffffff;
            --color-dark-accent: #1a1a4e;
            --color-glow-primary: rgba(0, 255, 136, 0.8);
            --color-glow-secondary: rgba(0, 255, 255, 0.8);
            --color-glow-accent: rgba(255, 0, 136, 0.8);
            --color-glow-danger: rgba(255, 23, 68, 0.8);
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
            gap: 30px;
            max-width: 800px;
            margin: 0 20px;
            max-height: 90vh;
            overflow-y: auto;
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

        .contract-container {
            position: relative;
            width: 100%;
        }

        .contract-box {
            border: 4px solid;
            border-image: linear-gradient(135deg, var(--color-primary), var(--color-secondary)) 1;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 255, 255, 0.12));
            box-shadow: 
                0 0 30px rgba(0, 255, 136, 0.6),
                inset 0 0 30px rgba(0, 255, 255, 0.15),
                0 0 60px var(--color-accent),
                inset 0 0 60px rgba(255, 0, 136, 0.1);
            padding: 30px;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .contract-box::before {
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

        .contract-title {
            color: var(--color-primary);
            font-size: 1.3rem;
            font-weight: bold;
            text-shadow: 0 0 10px var(--color-primary);
            margin-bottom: 20px;
            text-align: center;
            letter-spacing: 2px;
            position: relative;
            z-index: 2;
        }

        .contract-content {
            color: var(--color-secondary);
            font-size: 0.9rem;
            line-height: 1.8;
            text-align: center;
            text-shadow: 0 0 5px var(--color-secondary);
            position: relative;
            z-index: 2;
            transition: all 0.5s ease;
        }

        .hidden-content {
            display: none;
            color: var(--color-danger);
            text-shadow: 0 0 5px var(--color-danger), 0 0 15px var(--color-danger);
        }

        .hidden-content.revealed {
            display: block;
            animation: revealContent 1s ease forwards;
        }

        @keyframes revealContent {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .contract-box.revealed {
            border-image: linear-gradient(135deg, var(--color-danger), var(--color-primary)) 1;
            box-shadow: 
                0 0 50px rgba(255, 23, 68, 0.8),
                inset 0 0 50px rgba(255, 23, 68, 0.2),
                0 0 100px var(--color-danger);
        }

        .world-map {
            position: relative;
            width: 100%;
            height: 200px;
            margin: 20px 0;
            border: 2px solid var(--color-secondary);
            background: radial-gradient(circle at 30% 30%, rgba(0, 255, 136, 0.1), rgba(0, 0, 0, 0.3));
            border-radius: 5px;
            overflow: hidden;
        }

        .data-point {
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--color-danger), transparent);
            box-shadow: 0 0 10px var(--color-danger);
            animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        .button-container {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            position: relative;
            z-index: 2;
        }

        button {
            padding: 15px 40px;
            font-size: 1rem;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            letter-spacing: 2px;
            border: 3px solid;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }

        .btn-reveal {
            color: var(--color-danger);
            border-color: var(--color-danger);
            background: transparent;
            text-shadow: 0 0 5px var(--color-danger);
            box-shadow: 0 0 15px rgba(255, 23, 68, 0.3);
        }

        .btn-reveal:hover {
            background: rgba(255, 23, 68, 0.2);
            box-shadow: 0 0 30px rgba(255, 23, 68, 0.6);
            transform: scale(1.05);
        }

        .btn-back {
            color: var(--color-primary);
            border-color: var(--color-primary);
            background: transparent;
            text-shadow: 0 0 5px var(--color-primary);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .btn-back:hover {
            background: rgba(0, 255, 136, 0.2);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
            transform: scale(1.05);
        }

        .btn-key {
            color: var(--color-primary);
            border-color: var(--color-primary);
            background: transparent;
            text-shadow: 0 0 5px var(--color-primary);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
            padding: 12px 30px;
            font-size: 0.9rem;
        }

        .btn-key:hover {
            background: rgba(0, 255, 136, 0.2);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
            transform: scale(1.05);
        }

        .btn-copy {
            color: var(--color-secondary);
            border-color: var(--color-secondary);
            background: transparent;
            text-shadow: 0 0 5px var(--color-secondary);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
            padding: 10px 25px;
            font-size: 0.85rem;
            margin-top: 10px;
        }

        .btn-copy:hover {
            background: rgba(0, 255, 255, 0.2);
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
            transform: scale(1.05);
        }

        .disclaimer {
            color: var(--color-accent);
            font-size: 0.8rem;
            text-align: center;
            margin-top: 20px;
            text-shadow: 0 0 5px var(--color-accent);
            animation: pulse-text 2s ease-in-out infinite;
        }

        @keyframes pulse-text {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }

        .location-list {
            position: relative;
            z-index: 2;
            margin: 20px 0;
            text-align: left;
            display: inline-block;
        }

        .location-list li {
            margin: 8px 0;
            list-style: none;
            padding-left: 20px;
            position: relative;
        }

        .location-list li::before {
            content: '📡';
            position: absolute;
            left: 0;
            text-shadow: 0 0 5px var(--color-danger);
        }

        .key-box {
            border: 2px solid var(--color-primary);
            padding: 15px;
            background: rgba(0, 255, 136, 0.1);
            border-radius: 5px;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            color: var(--color-primary);
            text-shadow: 0 0 5px var(--color-primary);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
            user-select: all;
        }

        #keyDisplay {
            position: relative;
            z-index: 2;
            text-align: center;
            animation: popIn 0.5s ease forwards;
        }

        @keyframes popIn {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        .nav-link {
            text-align: center;
            margin-top: 20px;
        }

        .nav-link a {
            color: var(--color-primary);
            text-decoration: none;
            text-shadow: 0 0 5px var(--color-primary);
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .nav-link a:hover {
            color: var(--color-secondary);
            text-shadow: 0 0 10px var(--color-secondary);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>▌CONTRAT CACHE▌</h1>
        
        <div class="contract-container">
            <div class="contract-box" id="contractBox">
                <div class="contract-title">CONDITIONS D'UTILISATION</div>
                
                <div class="contract-content" id="innocentText">
                    "Vos données peuvent être utilisées pour améliorer nos services"
                    <br><br>
                    Nous nous engageons à protéger votre vie privée...
                </div>

                <div class="hidden-content" id="hiddenContent">
                    <strong>LA VRAIE HISTOIRE...</strong>
                    <br><br>
                    Vos données voyagent dans le monde entier et sont :
                    <br><br>
                    <ul class="location-list">
                        <li>Revendues à des tiers</li>
                        <li>Utilisées pour la publicité ciblée</li>
                        <li>Stockées sur des serveurs étrangers</li>
                        <li>Partagées sans consentement réel</li>
                        <li>Jamais réellement supprimées</li>
                        <li>Vendues au plus offrant</li>
                    </ul>
                    <br>
                    Et finalement... JETÉES ou revendues encore !
                    <br><br>
                    <div class="world-map" id="worldMap">
                        <div class="data-point" style="left: 10%; top: 20%;"></div>
                        <div class="data-point" style="left: 30%; top: 50%;"></div>
                        <div class="data-point" style="left: 50%; top: 30%;"></div>
                        <div class="data-point" style="left: 70%; top: 60%;"></div>
                        <div class="data-point" style="left: 85%; top: 40%;"></div>
                    </div>
                    <br><br>
                    <button class="btn-key" id="keyBtn" onclick="">🔑 RÉCUPÉRER LA CLÉ 🔑</button>
                </div>
            </div>

            <div class="button-container">
                <button class="btn-reveal" id="revealBtn" onclick="revealTruth()">⚠ DÉCOUVRIR LA VÉRITÉ ⚠</button>
                <button class="btn-back" id="hideBtn" onclick="hideTruth()" style="display: none;">← RETOUR</button>
            </div>

            <div class="disclaimer">
                ▼ ATTENTION: CONTENU HAUT RÉALISME ▼
            </div>
        </div>

        <div class="nav-link">
            <a href="index.html">← Retour aux portails</a>
        </div>
    </div>

    <script>
        function revealTruth() {
            const contractBox = document.getElementById('contractBox');
            const innocentText = document.getElementById('innocentText');
            const hiddenContent = document.getElementById('hiddenContent');
            const revealBtn = document.getElementById('revealBtn');
            const hideBtn = document.getElementById('hideBtn');

            innocentText.style.display = 'none';
            hiddenContent.classList.add('revealed');
            contractBox.classList.add('revealed');
            revealBtn.style.display = 'none';
            hideBtn.style.display = 'block';
        }

        function hideTruth() {
            const contractBox = document.getElementById('contractBox');
            const innocentText = document.getElementById('innocentText');
            const hiddenContent = document.getElementById('hiddenContent');
            const revealBtn = document.getElementById('revealBtn');
            const hideBtn = document.getElementById('hideBtn');

            innocentText.style.display = 'block';
            hiddenContent.classList.remove('revealed');
            contractBox.classList.remove('revealed');
            revealBtn.style.display = 'block';
            hideBtn.style.display = 'none';
        }
    </script>
</body>
</html>
