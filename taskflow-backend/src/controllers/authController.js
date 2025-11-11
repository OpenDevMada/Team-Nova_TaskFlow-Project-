const AuthService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorHandler');

class AuthController {
    // Inscription
    static register = asyncHandler(async (req, res) => {
        const result = await AuthService.register(req.body);

        // Set refresh token in httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        });
    });

    // Connexion
    static login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);

        // Set refresh token in httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        });
    });

    // Rafraîchir le token
    static refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        const result = await AuthService.refreshToken(refreshToken);

        // Set nouveau refresh token in httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/api/auth/refresh-token'
        });

        res.json({
            success: true,
            message: 'Token rafraîchi avec succès',
            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        });
    });

    // Déconnexion
    static logout = asyncHandler(async (req, res) => {
        await AuthService.logout(req.user.id);

        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    });

    // Déconnexion de tous les appareils
    static logoutAll = asyncHandler(async (req, res) => {
        await AuthService.logoutAllDevices(req.user.id);

        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Déconnexion de tous les appareils réussie'
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
            ...(result.resetToken && { resetToken: result.resetToken })
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