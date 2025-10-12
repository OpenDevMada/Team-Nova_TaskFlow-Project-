const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models/index');
const apiDocs = require('./config/docs');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Limiteur de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par windowMs
});
app.use(limiter);

// Middleware standard
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Route de santé
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

app.get('/docs', (req, res) => {
  res.json({
    message: 'TaskFlow API Documentation',
    version: '1.0.0',
    endpoints: apiDocs.endpoints
  });
});

app.use(notFoundHandler); // Gère les 404

// Gestion des erreurs
app.use(errorHandler);

// Synchronisation de la base de données
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie.');

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Base de données synchronisée.');
        }
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
};

module.exports = { app, syncDatabase };