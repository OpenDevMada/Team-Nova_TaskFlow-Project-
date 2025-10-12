require('dotenv').config();
const { app, syncDatabase } = require('./src/app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(`Serveur TaskFlow démarré sur le port ${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();