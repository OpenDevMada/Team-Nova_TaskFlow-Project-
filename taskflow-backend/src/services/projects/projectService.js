const { Project, User, ProjectMember, Task, TaskList, TaskStatus, ActivityLog } = require('../../models');
const { hasAccess } = require('../../utils/roleHierarchy');

class ProjectService {

  /**
   * Crée un nouveau projet 
   * @param {Object} data 
   * @param {Object} currentUser 
   * @returns 
   */
  static async create(data, currentUser) {

    if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
      throw new Error("Accès refusé : seuls les administrateurs peuvent créer un projet");
    }

    const project = await Project.create({
      ...data,
      ownerId: currentUser.id
    });

    await ProjectMember.create({
      projectId: project.id,
      userId: currentUser.id,
      role: 'admin',
      invitedBy: currentUser.id
    });

    return project;
  }

  /**
   * Récupère tous les projets
   * @param {Object} currentUser 
   * @returns 
   */
  static async findAll(currentUser) {

    if (!hasAccess(currentUser.roleGlobal, ['viewer'])) {
      throw new Error("Accès refusé");
    }

    return await Project.findAll({
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

  /**
   * Récupère un projet par son ID
   * @param {number} id 
   * @param {Object} currentUser 
   * @returns 
   */
  static async findById(id, currentUser) {

    if (!hasAccess(currentUser.roleGlobal, ['viewer'])) {
      throw new Error("Accès refusé");
    }

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
      throw new Error('Projet non trouvé');
    }

    return project;
  }

  /**
   * Met à jour un projet
   * @param {number} id 
   * @param {Object} data 
   * @param {Object} currentUser 
   * @returns 
   */
  static async update(id, data, currentUser) {
    const project = await Project.findByPk(id);

    if (!project) {
      throw new Error('Projet non trouvé');
    }

    if (project.ownerId !== currentUser.id && !hasAccess(currentUser.roleGlobal, ['admin'])) {
      throw new Error("Accès refusé : seuls le propriétaire ou les administrateurs peuvent modifier ce projet");
    }

    await project.update(data);
    return project;
  }

  /**
   * Supprime un projet
   * @param {number} id 
   * @param {Object} currentUser 
   * @returns 
   */
  static async delete(id, currentUser) {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error('Projet non trouvé');
    }

    if (project.ownerId !== currentUser.id && !hasAccess(currentUser.roleGlobal, ['admin'])) {
      throw new Error("Accès refusé : seuls le propriétaire ou les administrateurs peuvent supprimer ce projet");
    }

    await project.destroy();
    return { message: 'Projet supprimé !' };
  }
}

module.exports = ProjectService;
