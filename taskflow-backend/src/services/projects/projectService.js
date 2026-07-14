const { Op } = require('sequelize');
const { Project, User, ProjectMember, Task, TaskList, TaskStatus, ActivityLog } = require('../../models');
const { hasAccess } = require('../../utils/roleHierarchy');
const { AppError } = require('../../middleware/errorHandler');
const TaskListService = require('../tasks/taskListService');

class ProjectService {

  static async create(data, currentUser) {

    if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
      throw new AppError("Accès refusé : seuls les administrateurs peuvent créer un projet", 403);
    }

    const project = await Project.create({
      ...data,
      ownerId: currentUser.id
    });

    // 2. Ajouter le créateur comme admin du projet
    await ProjectMember.create({
      projectId: project.id,
      userId: currentUser.id,
      role: 'admin',
      invitedBy: currentUser.id
    });

    // 3. Créer les listes par défaut (Backlog, À faire, En cours, En révision, Terminé)
    await TaskListService.createDefaultLists(project.id);

    return project;
  }

  static async findAll(currentUser) {
    const whereClause = {};

    // Si l'utilisateur n'est pas admin global, filtrer par ses projets
    if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
      const projectIds = await ProjectMember.findAll({
        where: { userId: currentUser.id },
        attributes: ['projectId']
      }).then(members => members.map(m => m.projectId));

      whereClause.id = { [Op.in]: projectIds };
    }

    return await Project.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'lastName', 'firstName', 'email']
        },
        {
          model: ProjectMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }]
        },
        {
          model: TaskList,
          as: 'taskLists'
        },
        {
          model: Task,
          as: 'tasks'
        },
        {
          model: ActivityLog,
          as: 'activities'
        }
      ]
    });
  }

  static async findById(id, currentUser) {
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'lastName', 'firstName', 'email']
        },
        {
          model: ProjectMember,
          as: 'members',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }]
        },
        {
          model: TaskList,
          as: 'taskLists',
          include: [{
            model: Task,
            as: 'tasks',
            include: [{
              model: TaskStatus,
              as: 'status',
              attributes: ['id', 'name', 'description', 'color']
            }],
            attributes: ['id', 'title', 'statusId']
          }]
        },
        {
          model: Task,
          as: 'tasks'
        },
        {
          model: ActivityLog,
          as: 'activities',
          order: [['created_at', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!project) {
      throw new AppError('Projet non trouvé', 404);
    }

    // Vérifier que l'utilisateur est membre du projet ou admin global
    if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
      const membership = await ProjectMember.findOne({
        where: { projectId: id, userId: currentUser.id }
      });
      if (!membership) {
        throw new AppError('Accès refusé : vous n\'êtes pas membre de ce projet', 403);
      }
    }

    return project;
  }

  static async update(id, data, currentUser) {
    const project = await Project.findByPk(id);

    if (!project) {
      throw new AppError('Projet non trouvé', 404);
    }

    // Vérifier les permissions : owner OU admin du projet OU admin global
    const isOwner = project.ownerId === currentUser.id;
    const isGlobalAdmin = hasAccess(currentUser.roleGlobal, ['admin']);
    const isProjectAdmin = await ProjectMember.findOne({
      where: { projectId: id, userId: currentUser.id, role: 'admin' }
    });

    if (!isOwner && !isGlobalAdmin && !isProjectAdmin) {
      throw new AppError("Accès refusé : seuls le propriétaire ou les administrateurs du projet peuvent le modifier", 403);
    }

    await project.update(data);
    return project;
  }

  static async delete(id, currentUser) {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new AppError('Projet non trouvé', 404);
    }

    const isOwner = project.ownerId === currentUser.id;
    const isGlobalAdmin = hasAccess(currentUser.roleGlobal, ['admin']);
    const isProjectAdmin = await ProjectMember.findOne({
      where: { projectId: id, userId: currentUser.id, role: 'admin' }
    });

    if (!isOwner && !isGlobalAdmin && !isProjectAdmin) {
      throw new AppError("Accès refusé : seuls le propriétaire ou les administrateurs du projet peuvent le supprimer", 403);
    }

    await project.destroy();
    return { message: 'Projet supprimé !' };
  }
}

module.exports = ProjectService;
