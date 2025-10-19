const TaskListService = require('../../services/tasks/taskListService');
const { asyncHandler } = require('../../middleware/errorHandler');

class TaskListController {
    // Récupérer toutes les listes d'un projet
    static getProjectLists = asyncHandler(async (req, res) => {
        const { projectId } = req.params;
        const lists = await TaskListService.getProjectLists(projectId, req.user.id);

        res.json({
            success: true,
            data: lists
        });
    });

    // Créer une nouvelle liste
    static createList = asyncHandler(async (req, res) => {
        const { projectId } = req.params;
        const list = await TaskListService.createList(projectId, req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: 'Liste créée avec succès',
            data: list
        });
    });

    // Mettre à jour une liste
    static updateList = asyncHandler(async (req, res) => {
        const { listId } = req.params;
        const list = await TaskListService.updateList(listId, req.body, req.user.id);

        res.json({
            success: true,
            message: 'Liste mise à jour avec succès',
            data: list
        });
    });

    // Supprimer une liste
    static deleteList = asyncHandler(async (req, res) => {
        const { listId } = req.params;
        const result = await TaskListService.deleteList(listId, req.user.id);

        res.json({
            success: true,
            message: result.message
        });
    });

    // Déplacer une tâche entre les listes
    static moveTask = asyncHandler(async (req, res) => {
        const { taskId } = req.params;
        const { targetListId, position } = req.body;

        const task = await TaskListService.moveTask(taskId, targetListId, position, req.user.id);

        res.json({
            success: true,
            message: 'Tâche déplacée avec succès',
            data: task
        });
    });

    // Réorganiser les tâches dans une liste
    static reorderTasks = asyncHandler(async (req, res) => {
        const { listId } = req.params;
        const { taskOrders } = req.body;

        const result = await TaskListService.reorderTasks(listId, taskOrders, req.user.id);

        res.json({
            success: true,
            message: result.message
        });
    });
}

module.exports = TaskListController;