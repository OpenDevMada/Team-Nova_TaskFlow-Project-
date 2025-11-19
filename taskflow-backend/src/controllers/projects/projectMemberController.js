const { asyncHandler } = require('../../middleware/errorHandler');
const projectMemberService = require('../../services/projects/projectMemberService');

class ProjectMemberController {

    static create = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const { projectId } = req.params;

            // Inclure le projectId dans le body
            const data = {
                ...req.body,
                projectId: projectId
            };

            const projectMember = await projectMemberService.create(data, currentUser);
            res.status(201).json({
                success: true,
                message: "Membre ajouté au projet avec succès",
                data: projectMember
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });

    static getProjectMembers = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const { projectId } = req.params;
            const members = await projectMemberService.getProjectMembers(projectId, currentUser);
            res.json({
                success: true,
                data: members
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });

    static updateRole = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const { id } = req.params;
            const { role } = req.body;

            const updatedMember = await projectMemberService.updateRole(id, role, currentUser);
            res.json({
                success: true,
                message: "Rôle mis à jour avec succès",
                data: updatedMember
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    });

    static findAll = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const projectsMember = await projectMemberService.findAll(currentUser);
            res.json({
                success: true,
                data: projectsMember
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    })

    static findById = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const projectMember = await projectMemberService.findById(req.params.id, currentUser);
            res.json({
                success: true,
                data: projectMember
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    })

    static delete = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const result = await projectMemberService.delete(req.params.id, currentUser);
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    })
}

module.exports = ProjectMemberController;