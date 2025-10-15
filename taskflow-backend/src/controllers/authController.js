const AuthService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorHandler');

class AuthController {
    // Inscription
    static register = asyncHandler(async (req, res) => {
        const result = await AuthService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: result
        });
    });

    // Connexion
    static login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: result
        });
    });

    // Récupérer le profil
    static getProfile = asyncHandler(async (req, res) => {
        const user = await AuthService.getProfile(req.user.id);

        res.json({
            success: true,
            data: user
        });
    });

    // Mettre à jour le profil
    static updateProfile = asyncHandler(async (req, res) => {
        const user = await AuthService.updateProfile(req.user.id, req.body);

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            data: user
        });
    });

    // Changer le mot de passe
    static changePassword = asyncHandler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword);

        res.json({
            success: true,
            message: result.message
        });
    });

    // Mot de passe oublié
    static forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const result = await AuthService.forgotPassword(email);

        res.json({
            success: true,
            message: result.message,
            ...(result.resetToken && { resetToken: result.resetToken }) // Uniquement en dev
        });
    });

    // Réinitialiser le mot de passe
    static resetPassword = asyncHandler(async (req, res) => {
        const { token, newPassword } = req.body;
        const result = await AuthService.resetPassword(token, newPassword);

        res.json({
            success: true,
            message: result.message
        });
    });
}

module.exports = AuthController;