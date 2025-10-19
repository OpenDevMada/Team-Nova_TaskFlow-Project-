const { Task, TaskList, Project, ProjectMember, TaskStatus, PriorityLevel, User, TaskComment } = require('../../models');
const { AppError } = require('../../middleware/errorHandler');

class TaskService {
  // Créer une nouvelle tâche
  static async createTask(taskData, userId) {
    const { listId, projectId, title, description, priorityId, assigneeId, dueDate } = taskDazta;

    // Vérifier que la liste existe et que l'utilisateur a accès
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
      throw new AppError('Permissions insuffisantes pour créer une tâche', 403);
    }

    // Vérifier l'assignee s'il est spécifié
    if (assigneeId) {
      const assigneeMember = await ProjectMember.findOne({
        where: { projectId: list.project.id, userId: assigneeId }
      });

      if (!assigneeMember) {
        throw new AppError('La personne assignée doit être membre du projet', 400);
      }
    }

    // Trouver la position la plus élevée dans la liste
    const lastTask = await Task.findOne({
      where: { listId },
      order: [['position', 'DESC']]
    });

    const position = lastTask ? lastTask.position + 1 : 1;

    const task = await Task.create({
      listId,
      projectId: list.project.id,
      title,
      description,
      priorityId: priorityId || 2, // Medium par défaut
      statusId: 1, // Todo par défaut
      assigneeId,
      dueDate,
      position,
      createdBy: userId
    });

    // Retourner la tâche avec les relations
    return await Task.findByPk(task.id, {
      include: [
        { model: TaskList, as: 'list' },
        { model: Project, as: 'project' },
        { model: TaskStatus, as: 'status' },
        { model: PriorityLevel, as: 'priority' },
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ]
    });
  }

  // Récupérer une tâche par ID
  static async getTask(taskId, userId) {
    const task = await Task.findByPk(taskId, {
      include: [
        { 
          model: TaskList, 
          as: 'list',
          include: [{ model: Project, as: 'project' }]
        },
        { model: Project, as: 'project' },
        { model: TaskStatus, as: 'status' },
        { model: PriorityLevel, as: 'priority' },
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { 
          model: TaskComment, 
          as: 'comments',
          include: [
            { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
          ],
          order: [['created_at', 'ASC']]
        }
      ]
    });

    if (!task) {
      throw new AppError('Tâche non trouvée', 404);
    }

    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { projectId: task.project.id, userId }
    });

    if (!member) {
      throw new AppError('Accès non autorisé à cette tâche', 403);
    }

    return task;
  }

  // Mettre à jour une tâche
  static async updateTask(taskId, updateData, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!task) {
      throw new AppError('Tâche non trouvée', 404);
    }

    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { 
        projectId: task.project.id, 
        userId, 
        role: ['admin', 'member'] 
      }
    });

    if (!member) {
      throw new AppError('Permissions insuffisantes pour modifier cette tâche', 403);
    }

    // Vérifier l'assignee s'il est modifié
    if (updateData.assigneeId && updateData.assigneeId !== task.assigneeId) {
      const assigneeMember = await ProjectMember.findOne({
        where: { projectId: task.project.id, userId: updateData.assigneeId }
      });

      if (!assigneeMember) {
        throw new AppError('La personne assignée doit être membre du projet', 400);
      }
    }

    await task.update(updateData);

    // Retourner la tâche mise à jour avec les relations
    return await Task.findByPk(taskId, {
      include: [
        { model: TaskList, as: 'list' },
        { model: Project, as: 'project' },
        { model: TaskStatus, as: 'status' },
        { model: PriorityLevel, as: 'priority' },
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ]
    });
  }

  // Supprimer une tâche
  static async deleteTask(taskId, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!task) {
      throw new AppError('Tâche non trouvée', 404);
    }

    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { 
        projectId: task.project.id, 
        userId, 
        role: ['admin', 'member'] 
      }
    });

    if (!member) {
      throw new AppError('Permissions insuffisantes pour supprimer cette tâche', 403);
    }

    await task.destroy();
    return { message: 'Tâche supprimée avec succès' };
  }

  // Récupérer les tâches d'un projet
  static async getProjectTasks(projectId, userId, filters = {}) {
    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { projectId, userId }
    });

    if (!member) {
      throw new AppError('Accès non autorisé à ce projet', 403);
    }

    const whereClause = { projectId };
    
    // Appliquer les filtres
    if (filters.statusId) whereClause.statusId = filters.statusId;
    if (filters.priorityId) whereClause.priorityId = filters.priorityId;
    if (filters.assigneeId) whereClause.assigneeId = filters.assigneeId;

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        { model: TaskList, as: 'list' },
        { model: TaskStatus, as: 'status' },
        { model: PriorityLevel, as: 'priority' },
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ],
      order: [['position', 'ASC']]
    });

    return tasks;
  }

  // Marquer une tâche comme terminée
  static async completeTask(taskId, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!task) {
      throw new AppError('Tâche non trouvée', 404);
    }

    // Vérifier les permissions
    const member = await ProjectMember.findOne({
      where: { projectId: task.project.id, userId }
    });

    if (!member) {
      throw new AppError('Accès non autorisé', 403);
    }

    await task.update({
      statusId: 3, // Done
      completedAt: new Date()
    });

    return task;
  }
}

module.exports = TaskService;