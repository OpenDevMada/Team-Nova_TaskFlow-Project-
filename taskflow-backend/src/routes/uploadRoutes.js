const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authenticate);

router.post('/avatar', upload.single('avatar'), UploadController.uploadAvatar);
router.post('/tasks/:taskId/attachments', upload.single('file'), UploadController.uploadTaskAttachment);

module.exports = router;
