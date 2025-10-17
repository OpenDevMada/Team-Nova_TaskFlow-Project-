// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Nova TaskFlow API',
      version: '1.0.0',
      description: 'Documentation de l’API Nova TaskFlow',
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Serveur local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      { bearerAuth: [] }
    ],
  },
  apis: ['./src/routes/*.js','./src/routes/*/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec }; 
