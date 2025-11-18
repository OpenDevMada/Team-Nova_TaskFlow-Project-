const express = require('express');
const router = express.Router();
const TaskController = require('../../controllers/tasks/taskController');
const { authenticate } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gestion des tâches
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unique de la tâche
 *         title:
 *           type: string
 *           description: Titre de la tâche
 *           example: "Créer le module d'authentification"
 *         description:
 *           type: string
 *           description: Description détaillée de la tâche
 *           example: "Implémenter login, signup et refresh token"
 *         status:
 *           type: string
 *           description: Statut de la tâche
 *           example: "pending"
 *         priority:
 *           type: string
 *           description: Niveau de priorité
 *           example: "high"
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Date limite
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: ID du projet associé
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID de l'utilisateur à qui est assignée la tâche
 *     TaskInput:
 *       type: object
 *       required:
 *         - title
 *         - projectId
 *       properties:
 *         title:
 *           type: string
 *           example: "Nouvelle tâche"
 *         description:
 *           type: string
 *           example: "Description de la tâche"
 *         priority:
 *           type: string
 *           example: "medium"
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2025-01-30"
 *         projectId:
 *           type: string
 *           format: uuid
 */


// Toutes les routes nécessitent une authentification
router.use(authenticate);


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Erreur lors de la création
 */
router.post('/', TaskController.createTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Récupérer une tâche par ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tâche trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 */
router.get('/:taskId', TaskController.getTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Mettre à jour une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *       400:
 *         description: Erreur de mise à jour
 */
router.put('/:taskId', TaskController.updateTask);

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 *       404:
 *         description: Tâche non trouvée
 */
router.delete('/:taskId', TaskController.deleteTask);

/**
 * @swagger
 * /tasks/{taskId}/complete:
 *   patch:
 *     summary: Marquer une tâche comme complétée
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tâche complétée
 *       404:
 *         description: Tâche non trouvée
 */
router.patch('/:taskId/complete', TaskController.completeTask);

/**
 * @swagger
 * /tasks/projects/{projectId}/tasks:
 *   get:
 *     summary: Récupérer toutes les tâches d'un projet
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des tâches du projet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Projet non trouvé ou aucune tâche
 */
router.get('/projects/:projectId/tasks', TaskController.getProjectTasks);

module.exports = router;