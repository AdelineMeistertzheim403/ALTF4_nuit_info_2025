import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { scores } from './schema.js';
import { desc } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const db = drizzle(connection);

console.log('✅ Connexion à MySQL réussie');

// Création de la table au démarrage
await connection.query(`
  CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('✅ Table scores prête');

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.get('/api/scores', async (req, res) => {
  try {
    const allScores = await db.select().from(scores).orderBy(desc(scores.score));
    res.json(allScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des scores' });
  }
});

app.post('/api/scores', async (req, res) => {
  const { pseudo, score } = req.body;
  
  if (!pseudo || score === undefined) {
    return res.status(400).json({ error: 'Le pseudo et le score sont requis' });
  }
  
  if (typeof score !== 'number') {
    return res.status(400).json({ error: 'Le score doit être un nombre' });
  }
  
  try {
    const result = await db.insert(scores).values({ pseudo, score });
    res.status(201).json({ 
      id: result[0].insertId,
      pseudo, 
      score,
      message: 'Score enregistré avec succès' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du score' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});