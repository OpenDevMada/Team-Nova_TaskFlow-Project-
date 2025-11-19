const { User, Op } = require('../models');

class UserService {
    static async searchUsers(query = '', currentUser) {
        try {
            const whereCondition = {};

            // Si une requête est fournie, chercher dans les noms et email
            if (query && query.trim().length > 0) {
                whereCondition[Op.or] = [
                    { firstName: { [Op.iLike]: `%${query}%` } },
                    { lastName: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ];
            }

            const users = await User.findAll({
                where: whereCondition,
                attributes: ['id', 'firstName', 'lastName', 'email', 'roleGlobal'],
                // Exclure l'utilisateur courant de la recherche
                // where: { id: { [Op.ne]: currentUser.id } },
                limit: 50, // Limite raisonnable
                order: [['firstName', 'ASC'], ['lastName', 'ASC']]
            });

            return users;
        } catch (error) {
            console.error('Erreur dans UserService.searchUsers:', error);
            throw new Error('Erreur lors de la recherche des utilisateurs');
        }
    }

    // Méthode pour récupérer tous les utilisateurs (sans filtre)
    static async getAllUsers(currentUser) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'roleGlobal'],
                // Exclure l'utilisateur courant si nécessaire
                // where: { id: { [Op.ne]: currentUser.id } },
                order: [['firstName', 'ASC'], ['lastName', 'ASC']],
                limit: 100 // Limite pour éviter de charger trop d'utilisateurs
            });

            return users;
        } catch (error) {
            console.error('Erreur dans UserService.getAllUsers:', error);
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }
    }
}

module.exports = UserService;