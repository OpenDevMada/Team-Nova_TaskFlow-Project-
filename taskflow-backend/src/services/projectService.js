const { Project, User, ProjectMember, Task, TaskList, ActivityLog } = require('../models');
const { hasAccess } = require('../utils/roleHierarchy');

class ProjectService {
  
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

  static async findAll(currentUser) {

    if (!hasAccess(currentUser.roleGlobal, ['viewer'])) {
      throw new Error("Accès refusé");
    }

    return await Project.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'lastName', 'firstName', 'email'] },
        { model: ProjectMember, as: 'members' },
        { model: TaskList, as: 'taskLists' },
        { model: Task, as: 'tasks' },
        { model: ActivityLog, as: 'activities' }
      ]
    });
  }

  static async findById(id, currentUser) {

    if (!hasAccess(currentUser.roleGlobal, ['viewer'])) {
      throw new Error("Accès refusé");
    }

    const project = await Project.findByPk(id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'lastName', 'firstName', 'email'] },
        { model: ProjectMember, as: 'members' },
        { model: TaskList, as: 'taskLists' },
        { model: Task, as: 'tasks' },
        { model: ActivityLog, as: 'activities' }
      ]
    });

    if (!project) {
      throw new Error('Projet non trouvé');
    }

    return project;
  }

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
