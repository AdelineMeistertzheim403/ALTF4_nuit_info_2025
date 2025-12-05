<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coût PC - Arcade Portal</title>
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
            max-width: 900px;
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

        .comparison-container {
            display: flex;
            gap: 30px;
            justify-content: center;
            flex-wrap: wrap;
            width: 100%;
        }

        .pc-card {
            flex: 1;
            min-width: 280px;
            max-width: 400px;
            border: 4px solid;
            border-radius: 8px;
            padding: 30px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            animation: cardFloat 3s ease-in-out infinite;
        }

        @keyframes cardFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .pc-card.windows {
            border-image: linear-gradient(135deg, #ff1744, var(--color-danger)) 1;
            background: linear-gradient(135deg, rgba(255, 23, 68, 0.15), rgba(255, 23, 68, 0.08));
            box-shadow: 
                0 0 30px rgba(255, 23, 68, 0.6),
                inset 0 0 30px rgba(255, 23, 68, 0.1),
                0 0 60px rgba(255, 23, 68, 0.4);
        }

        .pc-card.ubuntu {
            border-image: linear-gradient(135deg, var(--color-primary), var(--color-secondary)) 1;
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 255, 255, 0.12));
            box-shadow: 
                0 0 30px rgba(0, 255, 136, 0.6),
                inset 0 0 30px rgba(0, 255, 255, 0.15),
                0 0 60px var(--color-accent);
        }

        .pc-card::before {
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

        .pc-title {
            font-size: 1.8rem;
            font-weight: bold;
            letter-spacing: 2px;
            position: relative;
            z-index: 2;
            margin-bottom: 15px;
        }

        .pc-card.windows .pc-title {
            color: #ff1744;
            text-shadow: 0 0 10px #ff1744;
        }

        .pc-card.ubuntu .pc-title {
            color: var(--color-primary);
            text-shadow: 0 0 10px var(--color-primary);
        }

        .pc-specs {
            position: relative;
            z-index: 2;
            text-align: center;
            width: 100%;
        }

        .spec-item {
            margin: 12px 0;
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .pc-card.windows .spec-item {
            color: #ff1744;
            text-shadow: 0 0 5px #ff1744;
        }

        .pc-card.ubuntu .spec-item {
            color: var(--color-secondary);
            text-shadow: 0 0 5px var(--color-secondary);
        }

        .price-tag {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 15px 0;
            padding: 10px 20px;
            border-radius: 5px;
            position: relative;
            z-index: 2;
        }

        .pc-card.windows .price-tag {
            background: rgba(255, 23, 68, 0.2);
            color: #ff1744;
            text-shadow: 0 0 5px #ff1744;
        }

        .pc-card.ubuntu .price-tag {
            background: rgba(0, 255, 136, 0.2);
            color: var(--color-primary);
            text-shadow: 0 0 5px var(--color-primary);
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }

        .action-button {
            position: relative;
            z-index: 2;
            padding: 12px 30px;
            font-size: 1rem;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            letter-spacing: 2px;
            border: 3px solid;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            margin-top: 15px;
        }

        .pc-card.windows .action-button {
            color: #ff1744;
            border-color: #ff1744;
            background: transparent;
            text-shadow: 0 0 5px #ff1744;
            box-shadow: 0 0 15px rgba(255, 23, 68, 0.3);
        }

        .pc-card.windows .action-button:hover {
            background: rgba(255, 23, 68, 0.2);
            box-shadow: 0 0 30px rgba(255, 23, 68, 0.6);
            transform: scale(1.05);
        }

        .pc-card.ubuntu .action-button {
            color: var(--color-primary);
            border-color: var(--color-primary);
            background: transparent;
            text-shadow: 0 0 5px var(--color-primary);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
        }

        .pc-card.ubuntu .action-button:hover {
            background: rgba(0, 255, 136, 0.2);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
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

        /* Modal Styles */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 100;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }

        .modal-overlay.show {
            display: flex;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 255, 255, 0.12));
            border: 4px solid;
            border-image: linear-gradient(135deg, var(--color-primary), var(--color-secondary)) 1;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            box-shadow: 
                0 0 50px rgba(0, 255, 136, 0.8),
                inset 0 0 50px rgba(0, 255, 255, 0.2),
                0 0 100px var(--color-accent);
            animation: popupSlide 0.5s ease;
            max-width: 500px;
            position: relative;
        }

        @keyframes popupSlide {
            from {
                opacity: 0;
                transform: scale(0.5) rotateZ(-10deg);
            }
            to {
                opacity: 1;
                transform: scale(1) rotateZ(0deg);
            }
        }

        .modal-title {
            color: var(--color-primary);
            font-size: 2rem;
            text-shadow: 
                0 0 10px var(--color-primary),
                0 0 20px var(--color-glow-primary);
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .modal-close {
            color: var(--color-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            position: absolute;
            top: 15px;
            right: 20px;
            transition: all 0.3s ease;
            text-shadow: 0 0 5px var(--color-secondary);
        }

        .modal-close:hover {
            color: var(--color-primary);
            transform: scale(1.3);
            text-shadow: 0 0 10px var(--color-primary);
        }

        .modal-message {
            color: var(--color-secondary);
            font-size: 1.1rem;
            text-shadow: 0 0 5px var(--color-secondary);
            line-height: 1.8;
        }

        .modal-content.error {
            border-image: linear-gradient(135deg, #ff1744, var(--color-primary)) 1;
            box-shadow: 
                0 0 50px rgba(255, 23, 68, 0.8),
                inset 0 0 50px rgba(255, 23, 68, 0.2),
                0 0 100px #ff1744;
        }

        .modal-title.error {
            color: #ff1744;
            text-shadow: 
                0 0 10px #ff1744,
                0 0 20px #ff1744;
        }

        .modal-message.error {
            color: #ff1744;
            text-shadow: 0 0 5px #ff1744;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>▌COÛT DU PC▌</h1>
        
        <div class="comparison-container">
            <!-- Windows PC -->
            <div class="pc-card windows">
                <div class="pc-title">WINDOWS PC</div>
                <div class="pc-specs">
                    <div class="spec-item">💰 Coût initial: 1200€</div>
                    <div class="spec-item">📉 Ralentit avec le temps</div>
                    <div class="spec-item">🔧 Mise à jour coûteuse</div>
                    <div class="spec-item">⏰ Durée de vie: 3-4 ans</div>
                    <div class="spec-item">❌ Support limité</div>
                </div>
                <div class="price-tag">TOTAL: 2500€<br>(-5 ans)</div>
                <button class="action-button" onclick="openModal('error')">ACHETER</button>
            </div>

            <!-- Ubuntu PC -->
            <div class="pc-card ubuntu">
                <div class="pc-title">UBUNTU PC</div>
                <div class="pc-specs">
                    <div class="spec-item">💚 Coût initial: 1000€</div>
                    <div class="spec-item">⚡ Reste rapide toujours</div>
                    <div class="spec-item">🆓 Mises à jour gratuites</div>
                    <div class="spec-item">♻️ Durée de vie: 10+ ans</div>
                    <div class="spec-item">🔄 Support communautaire</div>
                </div>
                <div class="price-tag">TOTAL: 1000€<br>(5+ ans)</div>
                <button class="action-button" onclick="openModal('success')">CHOISIR</button>
            </div>
        </div>

        <div class="disclaimer">
            ▼ ÉCONOMISEZ ET GAGNEZ EN PERFORMANCE ▼
        </div>

        <div class="nav-link">
            <a href="index.html">← Retour aux portails</a>
        </div>
    </div>

    <!-- Modal Popup -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content" id="modalContent">
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <div class="modal-title" id="modalTitle">✓ CLÉ DÉVERROUILLÉE ✓</div>
            <div class="modal-message" id="modalMessage">Vous avez récupéré la clé!</div>
        </div>
    </div>

    <script>
        function openModal(type = 'success') {
            const modalContent = document.getElementById('modalContent');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');

            if (type === 'error') {
                modalContent.classList.add('error');
                modalTitle.classList.add('error');
                modalMessage.classList.add('error');
                modalTitle.textContent = '⚠ MAUVAIS CHOIX ⚠';
                modalMessage.textContent = 'Windows vous ruinera. Vous avez perdu!';
            } else {
                modalContent.classList.remove('error');
                modalTitle.classList.remove('error');
                modalMessage.classList.remove('error');
                modalTitle.textContent = '✓ CLÉ DÉVERROUILLÉE ✓';
                modalMessage.textContent = 'Vous avez récupéré la clé Linux!';
            }

            document.getElementById('modalOverlay').classList.add('show');
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('show');
        }

        document.getElementById('modalOverlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    </script>
</body>
</html>
