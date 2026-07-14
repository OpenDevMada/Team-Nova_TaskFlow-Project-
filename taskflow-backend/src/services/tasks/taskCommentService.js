const { TaskComment, Task, ProjectMember, User, Project } = require('../../models');
const { AppError } = require('../../middleware/errorHandler');
const NotificationService = require('../notificationService');
const { Op } = require('sequelize');

class TaskCommentService {
  static async getComments(taskId, userId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new AppError('Tâche non trouvée', 404);

    const member = await ProjectMember.findOne({
      where: { projectId: task.projectId, userId }
    });
    if (!member) throw new AppError('Accès non autorisé', 403);

    return await TaskComment.findAll({
      where: { taskId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ],
      order: [['created_at', 'ASC']]
    });
  }

  static async createComment(taskId, content, userId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new AppError('Tâche non trouvée', 404);

    const member = await ProjectMember.findOne({
      where: { projectId: task.projectId, userId, role: ['admin', 'member'] }
    });
    if (!member) throw new AppError('Permissions insuffisantes', 403);

    const comment = await TaskComment.create({
      taskId,
      content,
      authorId: userId
    });

    // Parsing des @mentions
    const mentionRegex = /@(\w+(?:\s+\w+)?)/g;
    let match;
    const mentionedNames = [];
    while ((match = mentionRegex.exec(content)) !== null) {
      mentionedNames.push(match[1].trim().toLowerCase());
    }

    if (mentionedNames.length > 0) {
      const author = await User.findByPk(userId, {
        attributes: ['id', 'firstName', 'lastName']
      });

      for (const name of mentionedNames) {
        const [firstName, lastName] = name.split(' ');
        const whereClause = lastName
          ? { firstName: { [Op.iLike]: firstName }, lastName: { [Op.iLike]: lastName } }
          : { firstName: { [Op.iLike]: name } };

        const mentionedUsers = await User.findAll({
          where: { ...whereClause, id: { [Op.ne]: userId } }
        });

        for (const mentionedUser of mentionedUsers) {
          const isProjectMember = await ProjectMember.findOne({
            where: { projectId: task.projectId, userId: mentionedUser.id }
          });

          if (isProjectMember) {
            await NotificationService.create({
              userId: mentionedUser.id,
              type: 'mention',
              title: 'Vous avez été mentionné',
              message: `${author.firstName} ${author.lastName} vous a mentionné dans un commentaire sur "${task.title}"`,
              payload: { taskId: task.id, projectId: task.projectId, commentId: comment.id },
              relatedEntity: 'comment',
              relatedEntityId: comment.id
            });
          }
        }
      }
    }

    return await TaskComment.findByPk(comment.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
      ]
    });
  }

  static async updateComment(commentId, content, userId) {
    const comment = await TaskComment.findByPk(commentId, {
      include: [{ model: Task, as: 'task' }]
    });
    if (!comment) throw new AppError('Commentaire non trouvé', 404);

    if (comment.authorId !== userId) {
      throw new AppError('Vous ne pouvez modifier que vos propres commentaires', 403);
    }

    await comment.update({ content });
    return comment;
  }

  static async deleteComment(commentId, userId) {
    const comment = await TaskComment.findByPk(commentId, {
      include: [{ model: Task, as: 'task' }]
    });
    if (!comment) throw new AppError('Commentaire non trouvé', 404);

    if (comment.authorId !== userId) {
      const member = await ProjectMember.findOne({
        where: { projectId: comment.task.projectId, userId, role: ['admin'] }
      });
      if (!member) throw new AppError('Vous ne pouvez supprimer que vos propres commentaires', 403);
    }

    await comment.destroy();
    return { message: 'Commentaire supprimé avec succès' };
  }
}

module.exports = TaskCommentService;
