const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Rechercher des utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Terme de recherche (nom, prénom, email)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       roleGlobal:
 *                         type: string
 *                 count:
 *                   type: integer
 *       400:
 *         description: Erreur de recherche
 */
router.get('/search', authenticate, userController.searchUsers);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       roleGlobal:
 *                         type: string
 *                 count:
 *                   type: integer
 *       400:
 *         description: Erreur lors de la récupération
 */
router.get('/', authenticate, userController.getAllUsers);

module.exports = router;