const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gestion des projets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du projet
 *         name:
 *           type: string
 *           description: Nom du projet
 *           example: "Nova TaskFlow"
 *         description:
 *           type: string
 *           description: Description du projet
 *           example: "Application de gestion de tâches et de projets"
 *         color:
 *           type: string
 *           description: Couleur associée au projet (format hexadécimal)
 *           example: "#FF5733"
 *         isArchived:
 *           type: boolean
 *           description: Indique si le projet est archivé
 *           example: false
 *         ownerId:
 *           type: string
 *           format: uuid
 *           description: ID du propriétaire du projet
 *     ProjectInput:
 *       type: object
 *       required:
 *         - name
 *         - ownerId
 *       properties:
 *         name:
 *           type: string
 *           example: "Nouveau projet"
 *         description:
 *           type: string
 *           example: "Ceci est un projet de test"
 *         color:
 *           type: string
 *           example: "#33C1FF"
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Erreur lors de la création du projet
 */
router.post('/', authenticate, projectController.create);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Récupérer tous les projets
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des projets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticate, projectController.findAll);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Récupérer un projet par ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projet à récupérer
 *     responses:
 *       200:
 *         description: Projet trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
 */
router.get('/:id', authenticate, projectController.findById);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Mettre à jour un projet existant
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projet à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Erreur lors de la mise à jour
 */
router.put('/:id', authenticate, projectController.update);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projet à supprimer
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
 *       404:
 *         description: Projet non trouvé
 */
router.delete('/:id', authenticate, projectController.delete);

module.exports = router;
