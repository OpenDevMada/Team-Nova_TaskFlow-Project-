const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { sequelize, TaskStatus, PriorityLevel } = require('./models/index');
const apiDocs = require('./config/docs');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { swaggerUi, swaggerSpec } = require('./config/swagger'); 

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

// Limiteur de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
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

// Documentation API
app.get('/docs', (req, res) => {
  res.json({
    message: 'TaskFlow API Documentation',
    version: '1.0.0',
    endpoints: apiDocs.endpoints
  });
});

// Route de l'exposition d'api sur swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================================
// ROUTES API
// =============================================

// Authentification et gestion des utilisateurs
app.use('/api/auth', require('./routes/authRoutes'));

// Route des gestions de project
app.use('/api/projects', require('./routes/projects/projectRoutes'));

// Route d'affectation des projets aux membres'
app.use('/api/projects-member', require('./routes/projects/projectMemberRoutes'));

app.use('/api/task-lists', require('./routes/tasks/taskListRoutes'));
app.use('/api/tasks', require('./routes/tasks/taskRoutes'));


// Gestion des routes non trouvées
app.use(notFoundHandler);

// Gestion des erreurs
app.use(errorHandler);

// Synchronisation de la base de données
const syncDatabase = async () => {
    try {
         // 1. Authentification
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie.');

        // 2. Synchronisation des modèles
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ 
                force: false, // recrée les tables
                alter: false  // modifie juste la structure
            });
            console.log('Base de données synchronisée.');
        }

        // 3. Données de référence
        console.log('Vérification des données de référence...');
        await TaskStatus.initData();
        await PriorityLevel.initData();
        console.log('Données de référence prêtes.');

    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
};

module.exports = { app, syncDatabase };