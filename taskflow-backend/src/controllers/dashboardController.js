const DashboardService = require('../services/dashboardService');
const { asyncHandler } = require('../middleware/errorHandler');

class DashboardController {
  static getStats = asyncHandler(async (req, res) => {
    const stats = await DashboardService.getStats(req.user.id);

    res.json({ success: true, data: stats });
  });

  static getRecentProjects = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const projects = await DashboardService.getRecentProjects(req.user.id, limit);

    res.json({ success: true, data: projects });
  });

  static getRecentTasks = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const tasks = await DashboardService.getRecentTasks(req.user.id, limit);

    res.json({ success: true, data: tasks });
  });
}

module.exports = DashboardController;
