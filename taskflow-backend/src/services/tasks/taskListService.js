const { TaskList, Task, Project, ProjectMember, TaskStatus, PriorityLevel, User } = require('../../models');
const { AppError } = require('../../middleware/errorHandler');

class TaskListService {
  // Créer les listes par défaut pour un nouveau projet
  static async createDefaultLists(projectId) {
    const defaultLists = [
      { name: 'Backlog', position: 1.0 },
      { name: 'À faire', position: 2.0 },
      { name: 'En cours', position: 3.0 },
      { name: 'En révision', position: 4.0 },
      { name: 'Terminé', position: 5.0 }
    ];

    const lists = [];
    for (const listData of defaultLists) {
      const list = await TaskList.create({
        ...listData,
        projectId
      });
      lists.push(list);
    }

    return lists;
  }

  // Récupérer toutes les listes d'un projet
  static async getProjectLists(projectId, userId) {
    // Vérifier que l'utilisateur a accès au projet
    const member = await ProjectMember.findOne({
      where: { projectId, userId }
    });

    if (!member) {
      throw new AppError('Accès non autorisé à ce projet', 403);
    }

    const lists = await TaskList.findAll({
      where: { projectId },
      include: [{
        model: Task,
        as: 'tasks',
        include: [
          { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
          { model: TaskStatus, as: 'status' },
          { model: PriorityLevel, as: 'priority' },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
        ],
        order: [['position', 'ASC']]
      }],
      order: [['position', 'ASC']]
    });

    return lists;
  }

  // Créer une nouvelle liste
  static async createList(projectId, listData, userId) {
    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { projectId, userId, role: ['admin', 'member'] }
    });

    if (!member) {
      throw new AppError('Permissions insuffisantes pour créer une liste', 403);
    }

    const list = await TaskList.create({
      ...listData,
      projectId
    });

    return list;
  }

  // Mettre à jour une liste
  static async updateList(listId, updateData, userId) {
    const list = await TaskList.findByPk(listId, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!list) {
      throw new AppError('Liste non trouvée', 404);
    }

    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { 
        projectId: list.project.id, 
        userId, 
        role: ['admin', 'member'] 
      }
    });

    if (!member) {
      throw new AppError('Permissions insuffisantes pour modifier cette liste', 403);
    }

    await list.update(updateData);
    return list;
  }

  // Supprimer une liste
  static async deleteList(listId, userId) {
    const list = await TaskList.findByPk(listId, {
      include: [
        { model: Project, as: 'project' },
        { model: Task, as: 'tasks' }
      ]
    });

    if (!list) {
      throw new AppError('Liste non trouvée', 404);
    }

    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { 
        projectId: list.project.id, 
        userId, 
        role: ['admin'] 
      }
    });

    if (!member) {
      throw new AppError('Permissions admin requises pour supprimer une liste', 403);
    }

    // Vérifier s'il y a des tâches dans la liste
    if (list.tasks && list.tasks.length > 0) {
      throw new AppError('Impossible de supprimer une liste contenant des tâches', 400);
    }

    await list.destroy();
    return { message: 'Liste supprimée avec succès' };
  }

  // Déplacer une tâche entre les listes
  static async moveTask(taskId, targetListId, newPosition, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{ model: TaskList, as: 'list' }]
    });

    if (!task) {
      throw new AppError('Tâche non trouvée', 404);
    }

    const targetList = await TaskList.findByPk(targetListId);
    if (!targetList) {
      throw new AppError('Liste de destination non trouvée', 404);
    }

    // Vérifier les permissions sur les deux projets
    const sourceProjectMember = await ProjectMember.findOne({
      where: { projectId: task.list.projectId, userId }
    });

    const targetProjectMember = await ProjectMember.findOne({
      where: { projectId: targetList.projectId, userId }
    });

    if (!sourceProjectMember || !targetProjectMember) {
      throw new AppError('Accès non autorisé', 403);
    }

    // Mettre à jour la liste et la position
    await task.update({
      listId: targetListId,
      position: newPosition
    });

    return task;
  }

  // Réorganiser les positions dans une liste
  static async reorderTasks(listId, taskOrders, userId) {
    const list = await TaskList.findByPk(listId);
    if (!list) {
      throw new AppError('Liste non trouvée', 404);
    }

    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { projectId: list.projectId, userId }
    });

    if (!member) {
      throw new AppError('Accès non autorisé', 403);
    }

    for (const order of taskOrders) {
      await Task.update(
        { position: order.position },
        { 
          where: { 
            id: order.taskId, 
            listId 
          } 
        }
      );
    }

    return { message: 'Tâches réorganisées avec succès' };
  }
}

module.exports = TaskListService;