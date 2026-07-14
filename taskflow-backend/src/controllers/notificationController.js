const NotificationService = require('../services/notificationService');
const { asyncHandler } = require('../middleware/errorHandler');

class NotificationController {
  static getNotifications = asyncHandler(async (req, res) => {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    const unreadCount = await NotificationService.getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: { notifications, unreadCount }
    });
  });

  static getUnreadCount = asyncHandler(async (req, res) => {
    const count = await NotificationService.getUnreadCount(req.user.id);

    res.json({ success: true, data: { unreadCount: count } });
  });

  static markAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const notification = await NotificationService.markAsRead(notificationId, req.user.id);

    res.json({ success: true, message: 'Notification marquée comme lue', data: notification });
  });

  static markAllAsRead = asyncHandler(async (req, res) => {
    const result = await NotificationService.markAllAsRead(req.user.id);

    res.json({ success: true, message: result.message });
  });
}

module.exports = NotificationController;
