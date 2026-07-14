const TaskCommentService = require('../../services/tasks/taskCommentService');
const NotificationService = require('../../services/notificationService');
const ActivityLogService = require('../../services/activityLogService');
const { Task, User } = require('../../models');
const { asyncHandler } = require('../../middleware/errorHandler');

class TaskCommentController {
  static getComments = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const comments = await TaskCommentService.getComments(taskId, req.user.id);

    res.json({ success: true, data: comments });
  });

  static createComment = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Le contenu du commentaire est requis' });
    }

    const comment = await TaskCommentService.createComment(taskId, content, req.user.id);

    const task = await Task.findByPk(taskId);
    await ActivityLogService.logCommentAdded(comment, task, req.user, req);
    if (task && task.assigneeId && task.assigneeId !== req.user.id) {
      const author = await User.findByPk(req.user.id, {
        attributes: ['id', 'firstName', 'lastName']
      });
      await NotificationService.notifyNewComment(comment, task, task.assigneeId, author);
    }

    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté avec succès',
      data: comment
    });
  });

  static updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await TaskCommentService.updateComment(commentId, content, req.user.id);

    res.json({ success: true, message: 'Commentaire mis à jour', data: comment });
  });

  static deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const result = await TaskCommentService.deleteComment(commentId, req.user.id);

    res.json({ success: true, message: result.message });
  });
}

module.exports = TaskCommentController;
