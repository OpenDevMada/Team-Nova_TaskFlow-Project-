const { ProjectMember, Project, User } = require('../../models');
const { hasAccess } = require('../../utils/roleHierarchy');
const NotificationService = require('../notificationService');
const { AppError } = require('../../middleware/errorHandler');

class ProjectMemberService {
    /**
     * Create a new project member assignment
     * @param {object} data 
     * @param {object} currentUser 
     * @returns 
     */
    static async create(data, currentUser) {

        const project = await Project.findByPk(data.projectId);
        if (!project) {
            throw new AppError('Projet non trouvé', 404);
        }

        const user = await User.findByPk(data.userId);
        if (!user) {
            throw new AppError('Membre a assigné au projet non trouvé', 404);
        }

        const existingAssignment = await ProjectMember.findOne({
            where: {
                projectId: data.projectId,
                userId: data.userId
            }
        });

        if (existingAssignment) {
            throw new AppError('Ce membre est déjà assigné à ce projet', 409);
        }

        const projectMember = await ProjectMember.create({
            projectId: project.id,
            userId: user.id,
            role: data.role || 'member',
            invitedBy: currentUser.id
        });

        // Notification d'invitation
        await NotificationService.notifyProjectInvite(project, user, currentUser);

        // Charger les relations pour la réponse
        const newMember = await ProjectMember.findByPk(projectMember.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: User,
                    as: 'inviter',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });

        return newMember;
    }

    /**
     * Récupérer tous les membres d'un projet spécifique
     * @param {number} projectId 
     * @param {object} currentUser 
     * @returns 
     */
    static async getProjectMembers(projectId, currentUser) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new AppError('Projet non trouvé', 404);
        }

        // Vérifier que l'utilisateur est membre du projet ou admin global
        const userMembership = await ProjectMember.findOne({
            where: {
                projectId: projectId,
                userId: currentUser.id
            }
        });

        if (!userMembership && !hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new AppError("Accès refusé : vous devez être membre de ce projet", 403);
        }

        return await ProjectMember.findAll({
            where: { projectId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: User,
                    as: 'inviter',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            order: [['created_at', 'ASC']]
        });
    }

    /**
     * Mettre à jour le rôle d'un membre du projet
     * @param {number} memberId 
     * @param {string} role 
     * @param {object} currentUser 
     * @returns 
     */
    static async updateRole(memberId, role, currentUser) {
        const projectMember = await ProjectMember.findByPk(memberId, {
            include: [{ model: Project, as: 'project' }]
        });

        if (!projectMember) {
            throw new AppError('Membre non trouvé', 404);
        }

        // Vérifier les permissions
        const currentUserMembership = await ProjectMember.findOne({
            where: {
                projectId: projectMember.projectId,
                userId: currentUser.id,
                role: 'admin'
            }
        });

        if (!currentUserMembership && !hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new AppError("Accès refusé : seuls les administrateurs du projet peuvent modifier les rôles", 403);
        }

        await projectMember.update({ role });
        return projectMember;
    }

    /**
     * Récupérer tous les membres de tous les projets (admin uniquement)
     * @param {object} currentUser 
     * @returns 
     */
    static async findAll(currentUser) {

        if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new AppError("Accès refusé, seul l'administrateur peux consulter toute la liste !", 403);
        }

        return await ProjectMember.findAll({
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: User,
                    as: 'inviter',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });
    }

    /**
     * Récupérer un membre de projet par son ID
     * @param {number} id 
     * @param {object} currentUser 
     * @returns 
     */
    static async findById(id, currentUser) {

        const projectMember = await ProjectMember.findByPk(id, {
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: User,
                    as: 'inviter',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });

        if (!projectMember) {
            throw new AppError('Assignation non trouvée', 404);
        }

        if (projectMember.userId !== currentUser.id || !hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new AppError("Accès refusé : seuls le membre affécté ou les administrateurs peuvent voir ce detail !", 403);
        }

        return projectMember;
    }

    /**
     * Supprimer un membre d'un projet
     * @param {number} id 
     * @param {object} currentUser 
     * @returns 
     */
    static async delete(id, currentUser) {
        const projectMember = await ProjectMember.findByPk(id, {
            include: [{ model: Project, as: 'project' }]
        });

        if (!projectMember) {
            throw new AppError('Assignation non trouvée', 404);
        }

        // Vérifier les permissions
        const currentUserMembership = await ProjectMember.findOne({
            where: {
                projectId: projectMember.projectId,
                userId: currentUser.id,
                role: 'admin'
            }
        });

        if (!currentUserMembership && !hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new AppError("Accès refusé : seuls les administrateurs du projet peuvent retirer un membre", 403);
        }

        await projectMember.destroy();
        return { message: 'Membre retiré du projet !' };
    }
}

module.exports = ProjectMemberService;