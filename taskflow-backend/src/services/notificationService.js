const { Notification, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class NotificationService {
  static async getUserNotifications(userId) {
    return await Notification.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      limit: 50
    });
  }

  static async getUnreadCount(userId) {
    return await Notification.count({
      where: { userId, isRead: false }
    });
  }

  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });
    if (!notification) throw new AppError('Notification non trouvée', 404);

    await notification.update({ isRead: true });
    return notification;
  }

  static async markAllAsRead(userId) {
    await Notification.update({ isRead: true }, {
      where: { userId, isRead: false }
    });
    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  static async create(data) {
    return await Notification.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      payload: data.payload || null,
      relatedEntity: data.relatedEntity || null,
      relatedEntityId: data.relatedEntityId || null
    });
  }

  static async notifyTaskAssigned(task, assigneeId, assignedBy) {
    await this.create({
      userId: assigneeId,
      type: 'task_assigned',
      title: 'Nouvelle tâche assignée',
      message: `${assignedBy.firstName} ${assignedBy.lastName} vous a assigné la tâche : "${task.title}"`,
      payload: { taskId: task.id, projectId: task.projectId },
      relatedEntity: 'task',
      relatedEntityId: task.id
    });
  }

  static async notifyStatusChanged(task, oldStatus, newStatus, changedBy) {
    if (!task.assigneeId) return;

    await this.create({
      userId: task.assigneeId,
      type: 'status_changed',
      title: 'Statut de tâche modifié',
      message: `${changedBy.firstName} ${changedBy.lastName} a changé le statut de "${task.title}" de "${oldStatus}" à "${newStatus}"`,
      payload: { taskId: task.id, projectId: task.projectId, oldStatus, newStatus },
      relatedEntity: 'task',
      relatedEntityId: task.id
    });
  }

  static async notifyNewComment(comment, task, taskOwnerId, author) {
    if (taskOwnerId === author.id) return;

    await this.create({
      userId: taskOwnerId,
      type: 'new_comment',
      title: 'Nouveau commentaire',
      message: `${author.firstName} ${author.lastName} a commenté votre tâche "${task.title}"`,
      payload: { taskId: task.id, projectId: task.projectId, commentId: comment.id },
      relatedEntity: 'comment',
      relatedEntityId: comment.id
    });
  }

  static async notifyProjectInvite(project, invitedUser, invitedBy) {
    await this.create({
      userId: invitedUser.id,
      type: 'project_invite',
      title: 'Invitation à un projet',
      message: `${invitedBy.firstName} ${invitedBy.lastName} vous a invité au projet "${project.name}"`,
      payload: { projectId: project.id },
      relatedEntity: 'project',
      relatedEntityId: project.id
    });
  }
}

module.exports = NotificationService;
