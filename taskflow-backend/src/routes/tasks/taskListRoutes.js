const express = require('express');
const router = express.Router();
const TaskListController = require('../../controllers/tasks/taskListController');
const { authenticate } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: TaskLists
 *   description: Gestion des listes de tâches
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskList:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unique de la liste
 *         name:
 *           type: string
 *           description: Nom de la liste
 *           example: "À faire"
 *         position:
 *           type: number
 *           description: Position de la liste dans le projet
 *           example: 1
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: Projet auquel appartient la liste
 *     TaskListInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Nouveau groupe"
 *         position:
 *           type: number
 *           example: 2
 */

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * @swagger
 * /task-lists/projects/{projectId}/lists:
 *   get:
 *     summary: Récupérer toutes les listes d'un projet
 *     tags: [TaskLists]
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
 *         description: Listes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaskList'
 *       404:
 *         description: Projet non trouvé
 */
router.get('/projects/:projectId/lists', TaskListController.getProjectLists);

/**
 * @swagger
 * /task-lists/projects/{projectId}/lists:
 *   post:
 *     summary: Créer une nouvelle liste dans un projet
 *     tags: [TaskLists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskListInput'
 *     responses:
 *       201:
 *         description: Liste créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskList'
 *       400:
 *         description: Données invalides
 */
router.post('/projects/:projectId/lists', TaskListController.createList);

/**
 * @swagger
 * /task-lists/lists/{listId}:
 *   put:
 *     summary: Mettre à jour une liste
 *     tags: [TaskLists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskListInput'
 *     responses:
 *       200:
 *         description: Liste mise à jour
 *       404:
 *         description: Liste non trouvée
 */
router.put('/lists/:listId', TaskListController.updateList);

/**
 * @swagger
 * /task-lists/lists/{listId}:
 *   delete:
 *     summary: Supprimer une liste
 *     tags: [TaskLists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Liste supprimée avec succès
 *       404:
 *         description: Liste non trouvée
 */
router.delete('/lists/:listId', TaskListController.deleteList);

/**
 * @swagger
 * /task-lists/tasks/{taskId}/move:
 *   patch:
 *     summary: Déplacer une tâche vers une autre liste ou une autre position
 *     tags: [TaskLists]
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
 *             type: object
 *             properties:
 *               targetListId:
 *                 type: string
 *                 format: uuid
 *                 example: "d6b63e90-6f5e-4dc3-b0b9-3e3b943a9a12"
 *               newPosition:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Tâche déplacée
 *       404:
 *         description: Tâche ou liste non trouvée
 */
router.patch('/tasks/:taskId/move', TaskListController.moveTask);

/**
 * @swagger
 * /task-lists/lists/{listId}/reorder:
 *   patch:
 *     summary: Réordonner les tâches d’une liste
 *     tags: [TaskLists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskOrder:
 *                 type: array
 *                 description: Nouvel ordre des IDs des tâches
 *                 example: [
 *                   "c1a8f81d-5641-43e6-bc5a-7e136bd9d1f0",
 *                   "a782ec7f-2a00-4b06-b3b9-606c7e4a8ffa"
 *                 ]
 *     responses:
 *       200:
 *         description: Tâches réordonnées avec succès
 *       404:
 *         description: Liste non trouvée
 */
router.patch('/lists/:listId/reorder', TaskListController.reorderTasks);

module.exports = router;