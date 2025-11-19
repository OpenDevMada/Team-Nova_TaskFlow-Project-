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
 *         role:
 *           type: string
 *           enum: [admin, member, viewer]
 *           example: "member"
 */

// ROUTES SPÉCIFIQUES - Utiliser le même préfixe cohérent
/**
 * @swagger
 * /project-members/projects/{projectId}/members:
 *   get:
 *     summary: Récupérer tous les membres d'un projet
 *     tags: [Projects members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des membres récupérée avec succès
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
 *                     $ref: '#/components/schemas/ProjectMember'
 *       400:
 *         description: Erreur de validation
 */
router.get('/projects/:projectId/members', authenticate, projectMemberController.getProjectMembers);

/**
 * @swagger
 * /project-members/projects/{projectId}/members:
 *   post:
 *     summary: Ajouter un membre à un projet
 *     tags: [Projects members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 enum: [admin, member, viewer]
 *                 default: member
 *     responses:
 *       201:
 *         description: Membre ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProjectMember'
 *       400:
 *         description: Erreur lors de l'ajout du membre
 */
router.post('/projects/:projectId/members', authenticate, projectMemberController.create);

/**
 * @swagger
 * /project-members/{id}/role:
 *   patch:
 *     summary: Mettre à jour le rôle d'un membre
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
 *         description: ID du membre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, member, viewer]
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProjectMember'
 *       400:
 *         description: Erreur lors de la mise à jour
 */
router.patch('/:id/role', authenticate, projectMemberController.updateRole);

// CORRECTION : Utiliser le même préfixe "/project-members" pour toutes les routes
/**
 * @swagger
 * /project-members:
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProjectMember'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticate, projectMemberController.findAll);

/**
 * @swagger
 * /project-members/{id}:
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ProjectMember'
 *       404:
 *         description: Assignation non trouvé
 */
router.get('/:id', authenticate, projectMemberController.findById);

/**
 * @swagger
 * /project-members/{id}:
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