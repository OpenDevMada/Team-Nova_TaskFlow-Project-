const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/stats', DashboardController.getStats);
router.get('/recent-projects', DashboardController.getRecentProjects);
router.get('/recent-tasks', DashboardController.getRecentTasks);

module.exports = router;
