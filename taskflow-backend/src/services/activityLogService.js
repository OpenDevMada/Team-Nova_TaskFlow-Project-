const { ActivityLog } = require('../models');

class ActivityLogService {
  static async log({ projectId, userId, action, description, meta, req }) {
    return await ActivityLog.create({
      projectId,
      userId,
      action,
      description,
      meta: meta || null,
      ipAddress: req?.ip || null,
      userAgent: req?.get('User-Agent') || null
    });
  }

  static async logProjectCreated(project, user, req) {
    return await this.log({
      projectId: project.id,
      userId: user.id,
      action: 'project.created',
      description: `Projet "${project.name}" créé`,
      req
    });
  }

  static async logProjectUpdated(project, user, changes, req) {
    return await this.log({
      projectId: project.id,
      userId: user.id,
      action: 'project.updated',
      description: `Projet "${project.name}" modifié`,
      meta: { changes },
      req
    });
  }

  static async logProjectDeleted(project, user, req) {
    return await this.log({
      projectId: project.id,
      userId: user.id,
      action: 'project.deleted',
      description: `Projet "${project.name}" supprimé`,
      req
    });
  }

  static async logTaskCreated(task, user, req) {
    return await this.log({
      projectId: task.projectId,
      userId: user.id,
      action: 'task.created',
      description: `Tâche "${task.title}" créée`,
      meta: { taskId: task.id },
      req
    });
  }

  static async logTaskUpdated(task, user, changes, req) {
    return await this.log({
      projectId: task.projectId,
      userId: user.id,
      action: 'task.updated',
      description: `Tâche "${task.title}" modifiée`,
      meta: { taskId: task.id, changes },
      req
    });
  }

  static async logTaskCompleted(task, user, req) {
    return await this.log({
      projectId: task.projectId,
      userId: user.id,
      action: 'task.completed',
      description: `Tâche "${task.title}" terminée`,
      meta: { taskId: task.id },
      req
    });
  }

  static async logTaskDeleted(task, user, req) {
    return await this.log({
      projectId: task.projectId,
      userId: user.id,
      action: 'task.deleted',
      description: `Tâche "${task.title}" supprimée`,
      req
    });
  }

  static async logMemberAdded(project, member, addedBy, req) {
    return await this.log({
      projectId: project.id,
      userId: addedBy.id,
      action: 'member.added',
      description: `${member.firstName} ${member.lastName} a rejoint le projet "${project.name}"`,
      meta: { memberId: member.id },
      req
    });
  }

  static async logMemberRemoved(project, member, removedBy, req) {
    return await this.log({
      projectId: project.id,
      userId: removedBy.id,
      action: 'member.removed',
      description: `${member.firstName} ${member.lastName} retiré du projet "${project.name}"`,
      req
    });
  }

  static async logMemberRoleChanged(project, member, oldRole, newRole, changedBy, req) {
    return await this.log({
      projectId: project.id,
      userId: changedBy.id,
      action: 'member.role_changed',
      description: `Rôle de ${member.firstName} ${member.lastName} passé de "${oldRole}" à "${newRole}"`,
      meta: { memberId: member.id, oldRole, newRole },
      req
    });
  }

  static async logCommentAdded(comment, task, user, req) {
    return await this.log({
      projectId: task.projectId,
      userId: user.id,
      action: 'comment.added',
      description: `Commentaire ajouté à la tâche "${task.title}"`,
      meta: { taskId: task.id, commentId: comment.id },
      req
    });
  }
}

module.exports = ActivityLogService;
