const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', NotificationController.getNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/:notificationId/read', NotificationController.markAsRead);
router.post('/mark-all-read', NotificationController.markAllAsRead);

module.exports = router;
