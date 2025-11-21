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
 *         statusId:
 *           type: integer
 *           description: ID du statut (1=todo, 2=in_progress, 3=done)
 *           example: 1
 *         priorityId:
 *           type: integer
 *           description: ID de la priorité (1=low, 2=medium, 3=high)
 *           example: 2
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Date limite
 *           example: "2025-01-30"
 *         listId:
 *           type: string
 *           format: uuid
 *           description: ID de la liste (colonne Kanban)
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: ID du projet associé
 *         assigneeId:
 *           type: string
 *           format: uuid
 *           description: ID de l'utilisateur assigné
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID du créateur de la tâche
 *     TaskInput:
 *       type: object
 *       required:
 *         - title
 *         - listId
 *       properties:
 *         title:
 *           type: string
 *           example: "Nouvelle tâche"
 *         description:
 *           type: string
 *           example: "Description de la tâche"
 *         listId:
 *           type: string
 *           format: uuid
 *           description: ID de la liste (REQUIS)
 *           example: "d6b63e90-6f5e-4dc3-b0b9-3e3b943a9a12"
 *         priorityId:
 *           type: integer
 *           description: 1=low, 2=medium, 3=high
 *           example: 2
 *         assigneeId:
 *           type: string
 *           format: uuid
 *           description: ID de l'utilisateur à assigner
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2025-01-30"
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
 *           example:
 *             title: "Nouvelle tâche"
 *             description: "Description de la tâche"
 *             listId: "d6b63e90-6f5e-4dc3-b0b9-3e3b943a9a12"
 *             priorityId: 2
 *             dueDate: "2025-01-30"
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Erreur lors de la création
 *       404:
 *         description: Liste non trouvée
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Filtrer par statusId (1, 2, ou 3)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: integer
 *         description: Filtrer par priorityId (1, 2, ou 3)
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrer par assigneeId
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
 *         description: Projet non trouvé
 */
router.get('/projects/:projectId/tasks', TaskController.getProjectTasks);

module.exports = router;