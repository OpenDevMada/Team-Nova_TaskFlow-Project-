const { asyncHandler } = require('../../middleware/errorHandler');
const projectMemberService = require('../../services/projects/projectMemberService');
const ActivityLogService = require('../../services/activityLogService');
const { Project } = require('../../models');

class ProjectMemberController {
    static create = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const { projectId } = req.params;

        const data = {
            ...req.body,
            projectId: projectId
        };

        const projectMember = await projectMemberService.create(data, currentUser);
        const project = await Project.findByPk(projectId, { attributes: ['id', 'name'] });
        await ActivityLogService.logMemberAdded(project, projectMember.user, currentUser, req);
        res.status(201).json({
            success: true,
            message: "Membre ajouté au projet avec succès",
            data: projectMember
        });
    });

    static getProjectMembers = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const { projectId } = req.params;
        const members = await projectMemberService.getProjectMembers(projectId, currentUser);
        res.json({ success: true, data: members });
    });

    static updateRole = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const { id } = req.params;
        const { role } = req.body;
        const updatedMember = await projectMemberService.updateRole(id, role, currentUser);
        const project = await Project.findByPk(updatedMember.projectId, { attributes: ['id', 'name'] });
        const memberUser = await require('../../models').User.findByPk(updatedMember.userId, {
          attributes: ['id', 'firstName', 'lastName']
        });
        await ActivityLogService.logMemberRoleChanged(
          project, memberUser,
          updatedMember._previousDataValues?.role || 'inconnu', role,
          currentUser, req
        );
        res.json({
            success: true,
            message: "Rôle mis à jour avec succès",
            data: updatedMember
        });
    });

    static findAll = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const projectsMember = await projectMemberService.findAll(currentUser);
        res.json({ success: true, data: projectsMember });
    });

    static findById = asyncHandler(async (req, res) => {
        const projectMember = await projectMemberService.findById(req.params.id, req.user);
        res.json({ success: true, data: projectMember });
    });

    static delete = asyncHandler(async (req, res) => {
        const currentUser = req.user;
        const removedMember = await projectMemberService.findById(req.params.id, currentUser);
        const result = await projectMemberService.delete(req.params.id, currentUser);
        await ActivityLogService.logMemberRemoved(removedMember.project, removedMember.user, currentUser, req);
        res.json({ success: true, message: result.message });
    });
}

module.exports = ProjectMemberController;
