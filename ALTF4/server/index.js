import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { scores } from './schema.js';
import { desc } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration MySQL
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const db = drizzle(connection);

console.log('✅ Connexion à MySQL réussie');

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// GET tous les scores (triés par score décroissant avec rang)
app.get('/api/scores', async (req, res) => {
  try {
    const allScores = await db.select().from(scores).orderBy(desc(scores.score));
    
    // Ajouter le rang à chaque score
    const scoresWithRank = allScores.map((score, index) => ({
      ...score,
      rang: index + 1
    }));
    
    res.json(scoresWithRank);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des scores' });
  }
});

// POST ajouter un nouveau score
app.post('/api/scores', async (req, res) => {
  const { pseudo, score } = req.body;
  
  if (!pseudo || score === undefined) {
    return res.status(400).json({ error: 'Le pseudo et le score sont requis' });
  }
  
  if (typeof score !== 'number') {
    return res.status(400).json({ error: 'Le score doit être un nombre' });
  }
  
  try {
    // Insérer le nouveau score
    const result = await db.insert(scores).values({ pseudo, score });
    const insertedId = result[0].insertId;
    
    // Récupérer tous les scores triés pour calculer le rang
    const allScores = await db.select().from(scores).orderBy(desc(scores.score));
    
    // Trouver le rang du score inséré
    const rang = allScores.findIndex(s => s.id === insertedId) + 1;
    
    res.status(201).json({ 
      id: insertedId,
      pseudo, 
      score,
      rang,
      message: 'Score enregistré avec succès' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du score' });
  }
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});