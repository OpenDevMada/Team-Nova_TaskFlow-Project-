const TaskService = require('../../services/tasks/taskService');
const { asyncHandler } = require('../../middleware/errorHandler');

class TaskController {
  // Créer une nouvelle tâche
  static createTask = asyncHandler(async (req, res) => {
    const task = await TaskService.createTask(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      data: task
    });
  });

  // Récupérer une tâche
  static getTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await TaskService.getTask(taskId, req.user.id);

    res.json({
      success: true,
      data: task
    });
  });

  // Mettre à jour une tâche
  static updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await TaskService.updateTask(taskId, req.body, req.user.id);

    res.json({
      success: true,
      message: 'Tâche mise à jour avec succès',
      data: task
    });
  });

  // Supprimer une tâche
  static deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const result = await TaskService.deleteTask(taskId, req.user.id);

    res.json({
      success: true,
      message: result.message
    });
  });

  // Récupérer les tâches d'un projet
  static getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { status, priority, assignee } = req.query;

    const filters = {};
    if (status) filters.statusId = status;
    if (priority) filters.priorityId = priority;
    if (assignee) filters.assigneeId = assignee;

    const tasks = await TaskService.getProjectTasks(projectId, req.user.id, filters);

    res.json({
      success: true,
      data: tasks
    });
  });

  // Marquer une tâche comme terminée
  static completeTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await TaskService.completeTask(taskId, req.user.id);

    res.json({
      success: true,
      message: 'Tâche marquée comme terminée',
      data: task
    });
  });
}

module.exports = TaskController;