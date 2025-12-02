# ALTF4 – Front + API + MySQL

Pile complète avec frontend React/Vite, backend Express/Prisma et base MySQL orchestrés par Docker Compose.

## Démarrage rapide
1. Vérifier/adapter le fichier `.env` à la racine (ports, credentials MySQL, etc.).
2. Lancer la stack : `docker compose up --build`.
3. Frontend disponible sur `http://localhost:8083`, API sur `http://localhost:4000` (`/health`, `/api/messages`).

## Backend (dossier `server/`)
- Express + Prisma. Scripts utiles : `npm run dev`, `npm start`, `npm run prisma:deploy` (pour appliquer les migrations), `npm run prisma:push` (sync schema en dev).
- Routes incluses :
  - `GET /health` pour vérifier l’accès DB.
  - `GET /api/messages` et `POST /api/messages` (création/fetch simples).
- Schéma Prisma et migrations dans `server/prisma/`.

## Base de données
- MySQL 8 (service `db`). Données persistées dans le volume Docker `db_data`.
- Variables `.env` utilisées par Prisma/MySQL : `DATABASE_URL`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.

## Développement local (sans Docker)
1. Installer le frontend : `npm install` (racine).
2. Installer le backend : `cd server && npm install`.
3. Lancer MySQL localement ou via `docker compose up db`.
4. Démarrer l’API : `npm run dev` dans `server/` (veillez à `DATABASE_URL`).
5. Démarrer le front : `npm run dev` à la racine.
