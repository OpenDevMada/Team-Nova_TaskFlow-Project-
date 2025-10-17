const { asyncHandler } = require('../../middleware/errorHandler');
const projectMemberService = require('../../services/projects/projectMemberService');

class ProjectMemberController
{
    static create = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const projectMember = await projectMemberService.create(req.body, currentUser);
            res.status(201).json({
                success: true,
                message: "Membre assigné au projet avec succès",
                data: projectMember
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    static findAll = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const projectsMember = await projectMemberService.findAll(currentUser);
            res.json(projectsMember);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

    static findById = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const projectMember = await projectMemberService.findById(req.params.id, currentUser);
            res.json(projectMember);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    })

    static delete = asyncHandler(async (req, res) => {
        try {
            const currentUser = req.user;
            const result = await projectMemberService.delete(req.params.id, currentUser);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    })
}

module.exports = ProjectMemberController;