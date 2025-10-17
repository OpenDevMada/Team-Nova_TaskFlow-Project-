const { ProjectMember, Project, User } = require('../../models');
const { hasAccess } = require('../../utils/roleHierarchy');

class ProjectMemberService
{
    static async create(data, currentUser) {
    
        if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
          throw new Error("Accès refusé : seuls les administrateurs peuvent créer un projet");
        }

        const project = await Project.findByPk(data.projectId);

        if(!project)
        {
            throw new Error('Projet non trouvé');
        }

        const user = await User.findByPk(data.userId);

        if(!user)
        {
            throw new Error('Membre a assigné au projet non trouvé');
        }

        const existingAssignment = await ProjectMember.findOne({
            where: {
                projectId: data.projectId,
                userId: data.userId
            }
        });

        if (existingAssignment) {
            throw new Error('Ce membre est déjà assigné à ce projet');
        }
    
        const projectMember = await ProjectMember.create({
          projectId: project.id,
          userId: user.id,
          role: user.roleGlobal,
          invitedBy: currentUser.id
        });
        
        return projectMember;
    }

    static async findAll(currentUser) {

        if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new Error("Accès refusé, seul l'administrateur peux consulter toute la liste !");
        }

        return await ProjectMember.findAll({
            include: [
                { model: Project, as: 'project', attributes: ['id', 'name', 'description'] },
                { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: User, as: 'inviter', attributes: ['id', 'firstName', 'lastName', 'email'] }
            ]
        });
    }

    static async findById(id, currentUser) {

        const projectMember = await ProjectMember.findByPk(id, {
          include: [
            { model: Project, as: 'project', attributes: ['id', 'name', 'description'] },
            { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: User, as: 'inviter', attributes: ['id', 'firstName', 'lastName', 'email'] }
        ]
        });

        if (!projectMember) {
          throw new Error('Projet non trouvé');
        }

        if (projectMember.userId !== currentUser.id || !hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new Error("Accès refusé : seuls le membre affécté ou les administrateurs peuvent voir ce detail d'afféctation !");
        }   
    
        return projectMember;
      }

    static async delete(id, currentUser) {
        const projectMember = await ProjectMember.findByPk(id);
        if (!projectMember) {
            throw new Error('Afféctation non trouvé');
        }

        if (!hasAccess(currentUser.roleGlobal, ['admin'])) {
            throw new Error("Accès refusé : seuls les administrateurs peuvent retirer un membre d'un projet");
        }

        await projectMember.destroy();
        return { message: 'Membre retirer du projet !' };
    }
}

module.exports = ProjectMemberService;