const { Project, ProjectMember, Task, User } = require('../models');
const { Op } = require('sequelize');
const { AppError } = require('../middleware/errorHandler');

class DashboardService {
  static async getStats(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('Utilisateur non trouvé', 404);

    const projectIds = await ProjectMember.findAll({
      where: { userId },
      attributes: ['projectId']
    }).then(members => members.map(m => m.projectId));

    const totalProjects = await Project.count({
      where: { id: { [Op.in]: projectIds }, isArchived: false }
    });

    const totalTasks = await Task.count({
      where: { projectId: { [Op.in]: projectIds } }
    });

    const completedTasks = await Task.count({
      where: {
        projectId: { [Op.in]: projectIds },
        statusId: 3
      }
    });

    const tasksByStatus = await Task.findAll({
      where: { projectId: { [Op.in]: projectIds } },
      attributes: ['statusId'],
      group: ['statusId']
    });

    const myTasks = await Task.count({
      where: { assigneeId: userId, statusId: { [Op.ne]: 3 } }
    });

    const overdueTasks = await Task.count({
      where: {
        assigneeId: userId,
        dueDate: { [Op.lt]: new Date() },
        statusId: { [Op.ne]: 3 }
      }
    });

    const totalMembers = await ProjectMember.count({
      where: { projectId: { [Op.in]: projectIds } },
      distinct: true,
      col: 'userId'
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      completionRate,
      tasksByStatus: tasksByStatus.map(t => ({
        statusId: t.statusId,
        count: Number(t.count)
      })),
      myTasks,
      overdueTasks,
      totalMembers
    };
  }

  static async getRecentProjects(userId, limit = 5) {
    const projectIds = await ProjectMember.findAll({
      where: { userId },
      attributes: ['projectId']
    }).then(members => members.map(m => m.projectId));

    return await Project.findAll({
      where: { id: { [Op.in]: projectIds }, isArchived: false },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ],
      order: [['updated_at', 'DESC']],
      limit
    });
  }

  static async getRecentTasks(userId, limit = 5) {
    const projectIds = await ProjectMember.findAll({
      where: { userId },
      attributes: ['projectId']
    }).then(members => members.map(m => m.projectId));

    return await Task.findAll({
      where: { projectId: { [Op.in]: projectIds } },
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name', 'color'] },
        { model: User, as: 'assignee', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ],
      order: [['updated_at', 'DESC']],
      limit
    });
  }
}

module.exports = DashboardService;
