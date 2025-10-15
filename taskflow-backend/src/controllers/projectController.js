const { asyncHandler } = require('../middleware/errorHandler');
const ProjectService = require('../services/projectService');

class ProjectController
{
    static create = asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.create(req.body);
            res.status(201).json({
                success: true,
                message: "Projet créé avec succès",
                data: project
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    static update = asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.update(req.params.id, req.body);
            res.json({
                success: true,
                message: "Projet modifié avec succès",
                data: project
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    static delete = asyncHandler(async (req, res) => {
        try {
            const result = await ProjectService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    })

    static findAll = asyncHandler(async (req, res) => {
        try {
            const projects = await ProjectService.findAll();
            res.json(projects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

    static findById = asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.findById(req.params.id);
            res.json(project);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    })
}

module.exports = ProjectController;