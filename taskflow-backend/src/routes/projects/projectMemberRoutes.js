const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/authMiddleware');
const projectMemberController = require('../../controllers/projects/projectMemberController');

/**
 * @swagger
 * tags:
 *   name: Projects members
 *   description: Gestion des assignations de projet aux membres
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du projet_membre
 *         role:
 *           type: string
 *           description: role du membre dans le projet
 *           example: "member"
 *         joinedAt:
 *           type: date
 *           description: date d'assignation d'un projet a un membre
 *           example: "2025-10-16 06:41:16.09+03"
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: identifiant du projet assigner
 *     ProjectMemberInput:
 *       type: object
 *       required:
 *         - projectId
 *         - userId
 *       properties:
 *         projectId:
 *           type: uuid
 *           example: "xxxx-xxxx-xxxx-xxxx"
 *         userId:
 *           type: string
 *           example: "xxxx-xxxx-xxxx-xxxx"
 */

/**
 * @swagger
 * /projects-member:
 *   post:
 *     summary: assigner un projet a un membre
 *     tags: [Projects members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectMemberInput'
 *     responses:
 *       201:
 *         description: Projet assigné avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectMember'
 *       400:
 *         description: Erreur lors de l'assignation du projet'
 */
router.post('/', authenticate, projectMemberController.create);

/**
 * @swagger
 * /projects-member:
 *   get:
 *     summary: Récupérer tous les assignation de projet a un membre
 *     tags: [Projects members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des assignations de projets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectMember'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticate, projectMemberController.findAll);

/**
 * @swagger
 * /projects-member/{id}:
 *   get:
 *     summary: Récupérer un assignation de projet par ID
 *     tags: [Projects members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projectMember à récupérer
 *     responses:
 *       200:
 *         description: assignation trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectMember'
 *       404:
 *         description: Assignation non trouvé
 */
router.get('/:id', authenticate, projectMemberController.findById);

/**
 * @swagger
 * /projects-member/{id}:
 *   delete:
 *     summary: Supprimer un assignation de projet
 *     tags: [Projects members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projectMember à supprimer
 *     responses:
 *       200:
 *         description: Assignation supprimé avec succès
 *       404:
 *         description: Assignation non trouvé
 */
router.delete('/:id', authenticate, projectMemberController.delete);

module.exports = router;