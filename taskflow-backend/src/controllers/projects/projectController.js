const { asyncHandler } = require('../../middleware/errorHandler');
const ProjectService = require('../../services/projects/projectService');
const ActivityLogService = require('../../services/activityLogService');

class ProjectController {
    static create = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const project = await ProjectService.create(req.body, currentUser);
        await ActivityLogService.logProjectCreated(project, currentUser, req);
        res.status(201).json({
            success: true,
            message: "Projet créé avec succès",
            data: project
        });
    });

    static findAll = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const projects = await ProjectService.findAll(currentUser);
        res.json({ success: true, data: projects });
    });

    static findById = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const project = await ProjectService.findById(req.params.id, currentUser);
        res.json({ success: true, data: project });
    });

    static update = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const project = await ProjectService.update(req.params.id, req.body, currentUser);
        await ActivityLogService.logProjectUpdated(project, currentUser, req.body, req);
        res.json({
            success: true,
            message: "Projet modifié avec succès",
            data: project
        });
    });

    static delete = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const project = await ProjectService.findById(req.params.id, currentUser);
        await ActivityLogService.logProjectDeleted(project, currentUser, req);
        const result = await ProjectService.delete(req.params.id, currentUser);
        res.json({ success: true, message: result.message });
    });
}

module.exports = ProjectController;
