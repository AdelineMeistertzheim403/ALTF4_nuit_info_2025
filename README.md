# ALTF4_nuit_info_2025

## Prérequis

- Docker
- Docker Compose

## Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/AdelineMeistertzheim403/ALTF4_nuit_info_2025.git
cd ALTF4_nuit_info_2025
```

### 2. Lancer l'application avec Docker

Assurez-vous que Docker est en cours d'exécution, puis lancez la commande suivante depuis la racine du projet :

```bash
cd ALTF4
docker-compose up --build
```

Cette commande va construire les images Docker pour le frontend et le backend, puis démarrer les conteneurs.

### 3. Accéder à l'application

Une fois les conteneurs démarrés, l'application sera accessible aux adresses suivantes :

- **Frontend (Jeu)** : [http://localhost:8083](http://localhost:8083)
- **Backend (Serveur)** : [http://localhost:4000](http://localhost:4000)

## Arrêter l'application

Pour arrêter les conteneurs Docker, utilisez la commande suivante dans le dossier `ALTF4` :

```bash
docker-compose down
```