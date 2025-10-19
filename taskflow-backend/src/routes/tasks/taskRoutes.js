const express = require('express');
const router = express.Router();
const TaskController = require('../../controllers/tasks/taskController');
const { authenticate } = require('../../middleware/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les tâches
router.post('/', TaskController.createTask);
router.get('/:taskId', TaskController.getTask);
router.put('/:taskId', TaskController.updateTask);
router.delete('/:taskId', TaskController.deleteTask);
router.patch('/:taskId/complete', TaskController.completeTask);

// Routes pour les tâches d'un projet
router.get('/projects/:projectId/tasks', TaskController.getProjectTasks);

module.exports = router;