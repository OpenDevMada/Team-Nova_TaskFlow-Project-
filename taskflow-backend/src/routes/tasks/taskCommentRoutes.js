const express = require('express');
const router = express.Router({ mergeParams: true });
const TaskCommentController = require('../../controllers/tasks/taskCommentController');
const { authenticate } = require('../../middleware/authMiddleware');

router.use(authenticate);

router.get('/', TaskCommentController.getComments);
router.post('/', TaskCommentController.createComment);
router.put('/:commentId', TaskCommentController.updateComment);
router.delete('/:commentId', TaskCommentController.deleteComment);

module.exports = router;
