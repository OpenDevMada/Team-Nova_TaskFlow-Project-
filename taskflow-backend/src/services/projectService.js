const { Project, User, ProjectMember, Task, TaskList, ActivityLog } = require('../models');

class ProjectService {
  
  static async create(data) {
    return await Project.create(data);
  }

  static async findAll() {
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

  static async findById(id) {
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

  static async update(id, data) {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error('Projet non trouvé');
    }

    await project.update(data);
    return project;
  }

  static async delete(id) {
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error('Projet non trouvé');
    }

    await project.destroy();
    return { message: 'Projet supprimé !' };
  }
}

module.exports = ProjectService;
