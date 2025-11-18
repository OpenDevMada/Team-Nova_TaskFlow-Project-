const bcrypt = require('bcryptjs');
const { User, PasswordReset } = require('../models');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../utils/jwtUtils');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
    /**
     * Inscription d'un nouvel utilisateur
     * @param {object} userData - Données de l'utilisateur (email, password, firstName, lastName)
     * @returns {Promise<Object>} Utilisateur créé et tokens
     */
    static async register(userData) {
        const { email, password, firstName, lastName, roleGlobal } = userData;       

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new AppError('Un utilisateur avec cet email existe déjà', 409);

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({ email, passwordHash, firstName, lastName, roleGlobal });
        const tokens = await this.generateTokens(user);
        
        return {
            user: this.getUserResponse(user),
            ...tokens
        };
    }

    /**
     * Connexion
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} Données utilisateur et tokens JWT
    **/
    static async login(email, password) {
        // Trouver l'utilisateur
        const user = await User.findOne({ where: { email, isActive: true } });
        if (!user) throw new AppError('Email ou mot de passe incorrect', 401);

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) throw new AppError('Email ou mot de passe incorrect', 401);

        // Mettre à jour la dernière connexion
        await user.update({ lastLoginAt: new Date() });
        const tokens = await this.generateTokens(user);

        return { user: this.getUserResponse(user), ...tokens };
    }

    /**
     * Rafraîchir le token d'accès
     * @param {string} refreshToken - Token de rafraîchissement
     * @returns {Promise<Object>} Nouveaux tokens et données utilisateur
     */
    static async refreshToken(refreshToken) {
        if (!refreshToken) throw new AppError('Refresh token manquant', 401);

        // Vérifier le refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new AppError('Refresh token invalide', 401);
        }

        // Trouver l'utilisateur avec ce refresh token
        const user = await User.findOne({
            where: {
                id: decoded.userId,
                refreshToken: refreshToken,
                isActive: true
            }
        });
        if (!user) throw new AppError('Refresh token invalide', 401);

        const tokens = await this.generateTokens(user);
        return { user: this.getUserResponse(user), ...tokens };
    }

    /**
     * Déconnexion de la session actuelle
     * @param {string} userId - ID utilisateur
     * @returns {Promise<Object>} Message de confirmation
     */
    static async logout(userId) {
        const user = await User.findByPk(userId);
        // Supprimer le refresh token
        if (user) await user.update({ refreshToken: null }); 

        return { message: 'Déconnexion réussie' };
    }

    /**
     * Déconnexion de tous les appareils
     * @param {string} userId 
     * @returns {Promise<Object>} Message de confirmation
     */
    static async logoutAllDevices(userId) {
        const user = await User.findByPk(userId);
        if (user) await user.update({ refreshToken: null }); 

        return { message: 'Déconnexion de tous les appareils réussie' };
    }

    /**
     * Générer les tokens d’authentification
     * @param {Object} user - Objet utilisateur Sequelize
     * @returns {Promise<Object>} Access token et refresh token
     */
    static async generateTokens(user) {
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.roleGlobal
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Stocker le refresh token dans la base de données
        await user.update({ refreshToken });

        return { accessToken, refreshToken };
    }

    /**
     * Formater la réponse utilisateur (sans mot de passe)
     * @param {Object} user - Objet utilisateur Sequelize
     * @returns {Object} Données utilisateur formatées
     */
    static getUserResponse(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            roleGlobal: user.roleGlobal,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt
        };
    }

    /**
     * Récupérer le profil utilisateur
     * @param {string} userId - ID utilisateur
     * @returns {Promise<Object>} Profil utilisateur
     */
    static async getProfile(userId) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['passwordHash', 'refreshToken'] }
        });

        if (!user) throw new AppError('Utilisateur non trouvé', 404);
        return user;
    }

    /**
     * Mettre à jour le profil
     * @param {string} userId - ID utilisateur
     * @param {Object} updateData - Champs à mettre à jour
     * @returns {Promise<Object>} Profil mis à jour
     */
    static async updateProfile(userId, updateData) {
        const user = await User.findByPk(userId);
        if (!user) throw new AppError('Utilisateur non trouvé', 404);

        // Champs autorisés pour la mise à jour
        const allowed = ['firstName', 'lastName', 'avatarUrl'];
        const updates = {};

        allowed.forEach(field => {
            if (updateData[field] !== undefined) updates[field] = updateData[field];
        });

        await user.update(updates);

        // Retourner l'utilisateur mis à jour sans le mot de passe
        return await User.findByPk(userId, {
            attributes: { exclude: ['passwordHash', 'refreshToken'] }
        });
    }

    /**
     * Changer le mot de passe
     * @param {string} userId - ID utilisateur
     * @param {string} currentPassword - Ancien mot de passe
     * @param {string} newPassword - Nouveau mot de passe
     * @returns {Promise<Object>} Message de confirmation
     */
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) throw new AppError('Utilisateur non trouvé', 404);

        // Vérifier l'ancien mot de passe
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) throw new AppError('Mot de passe actuel incorrect', 400);

        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        await user.update({ passwordHash: newPasswordHash });

        return { message: 'Mot de passe mis à jour avec succès' };
    }

    /**
     * Demander une réinitialisation du mot de passe
     * @param {string} email - Email de l'utilisateur
     * @returns {Promise<Object>} Message ou token pour dev
     */
    static async forgotPassword(email) {
        const user = await User.findOne({ where: { email, isActive: true } });
        if (!user) return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };

        // Générer un token de réinitialisation
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        // Créer ou mettre à jour l'entrée de réinitialisation
        await PasswordReset.upsert({
            userId: user.id,
            token: hashedToken,
            expiresAt,
            usedAt: null
        });

        // En production, enverriez un email ici
        console.log(`Lien de réinitialisation pour ${email}: ${resetToken}`);

        // Pour le développement, on retourne le token
        if (process.env.NODE_ENV === 'development') {
            return {
                message: 'Lien de réinitialisation généré',
                resetToken
            };
        }

        return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    /**
     * Réinitialiser le mot de passe
     * @param {string} token - Token de réinitialisation reçu
     * @param {string} newPassword - Nouveau mot de passe
     * @returns {Promise<Object>} Message de confirmation
     */
    static async resetPassword(token, newPassword) {
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Trouver la demande de réinitialisation valide
        const { Op } = require('sequelize');
        const passwordReset = await PasswordReset.findOne({
            where: {
                token: hashedToken,
                expiresAt: { [Op.gt]: new Date() },
                usedAt: null
            },
            include: [{ model: User, as: 'user' }]
        });

        if (!passwordReset) throw new AppError('Token invalide ou expiré', 400);

        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        await passwordReset.user.update({ passwordHash: newPasswordHash });

        // Marquer le token comme utilisé
        await passwordReset.update({ usedAt: new Date() });

        return { message: 'Mot de passe réinitialisé avec succès' };
    }
}

module.exports = AuthService;