const bcrypt = require('bcryptjs');
const { User, PasswordReset } = require('../models');
const { generateToken } = require('../utils/jwtUtils');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
    // Inscription
    static async register(userData) {
        const { email, password, firstName, lastName } = userData;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError('Un utilisateur avec cet email existe déjà', 409);
        }

        // Hasher le mot de passe
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        const user = await User.create({
            email,
            passwordHash,
            firstName,
            lastName
        });

        // Générer le token JWT
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.roleGlobal
        });

        // Retourner les données sans le mot de passe
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            roleGlobal: user.roleGlobal,
            createdAt: user.createdAt
        };

        return {
            user: userResponse,
            token
        };
    }

    // Connexion
    static async login(email, password) {
        // Trouver l'utilisateur
        const user = await User.findOne({ where: { email, isActive: true } });
        if (!user) {
            throw new AppError('Email ou mot de passe incorrect', 401);
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError('Email ou mot de passe incorrect', 401);
        }

        // Mettre à jour la dernière connexion
        await user.update({ lastLoginAt: new Date() });

        // Générer le token JWT
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.roleGlobal
        });

        // Retourner les données sans le mot de passe
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            roleGlobal: user.roleGlobal,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt
        };

        return {
            user: userResponse,
            token
        };
    }

    // Récupérer le profil
    static async getProfile(userId) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['passwordHash'] }
        });

        if (!user) {
            throw new AppError('Utilisateur non trouvé', 404);
        }

        return user;
    }

    // Mettre à jour le profil
    static async updateProfile(userId, updateData) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError('Utilisateur non trouvé', 404);
        }

        // Champs autorisés pour la mise à jour
        const allowedFields = ['firstName', 'lastName', 'avatarUrl'];
        const updateFields = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updateFields[field] = updateData[field];
            }
        });

        await user.update(updateFields);

        // Retourner l'utilisateur mis à jour sans le mot de passe
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['passwordHash'] }
        });

        return updatedUser;
    }

    // Changer le mot de passe
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError('Utilisateur non trouvé', 404);
        }

        // Vérifier l'ancien mot de passe
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new AppError('Mot de passe actuel incorrect', 400);
        }

        // Hasher le nouveau mot de passe
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Mettre à jour le mot de passe
        await user.update({ passwordHash: newPasswordHash });

        return { message: 'Mot de passe mis à jour avec succès' };
    }

    // Demande de réinitialisation de mot de passe
    static async forgotPassword(email) {
        const user = await User.findOne({ where: { email, isActive: true } });
        if (!user) {
            // Pour des raisons de sécurité, on ne révèle pas si l'email existe
            return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
        }

        // Générer un token de réinitialisation
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hasher le token pour le stockage
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Définir l'expiration (1 heure)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        // Créer ou mettre à jour l'entrée de réinitialisation
        await PasswordReset.upsert({
            userId: user.id,
            token: hashedToken,
            expiresAt,
            usedAt: null
        });

        // En production, vous enverriez un email ici
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

    // Réinitialiser le mot de passe
    static async resetPassword(token, newPassword) {
        // Hasher le token reçu
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Trouver la demande de réinitialisation valide
        const passwordReset = await PasswordReset.findOne({
            where: {
                token: hashedToken,
                expiresAt: { [require('sequelize').Op.gt]: new Date() },
                usedAt: null
            },
            include: [{ model: require('../models').User, as: 'user' }]
        });

        if (!passwordReset) {
            throw new AppError('Token invalide ou expiré', 400);
        }

        // Hasher le nouveau mot de passe
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Mettre à jour le mot de passe de l'utilisateur
        await passwordReset.user.update({ passwordHash: newPasswordHash });

        // Marquer le token comme utilisé
        await passwordReset.update({ usedAt: new Date() });

        return { message: 'Mot de passe réinitialisé avec succès' };
    }
}

module.exports = AuthService;