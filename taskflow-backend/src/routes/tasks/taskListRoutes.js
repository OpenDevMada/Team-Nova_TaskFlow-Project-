const express = require('express');
const router = express.Router();
const TaskListController = require('../../controllers/tasks/taskListController');
const { authenticate } = require('../../middleware/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les listes
router.get('/projects/:projectId/lists', TaskListController.getProjectLists);
router.post('/projects/:projectId/lists', TaskListController.createList);
router.put('/lists/:listId', TaskListController.updateList);
router.delete('/lists/:listId', TaskListController.deleteList);

// Routes pour le déplacement des tâches
router.patch('/tasks/:taskId/move', TaskListController.moveTask);
router.patch('/lists/:listId/reorder', TaskListController.reorderTasks);

module.exports = router;