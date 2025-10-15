const { body, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Middleware de validation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.param,
            message: error.msg
        }));
        throw new AppError('Données de validation invalides', 400).withDetails(errorMessages);
    }
    next();
};

// Règles de validation pour l'inscription
const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email invalide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
    body('firstName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Le prénom est requis')
        .isAlpha('fr-FR', { ignore: ' -' })
        .withMessage('Le prénom ne doit contenir que des lettres'),
    body('lastName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Le nom est requis')
        .isAlpha('fr-FR', { ignore: ' -' })
        .withMessage('Le nom ne doit contenir que des lettres'),
    handleValidationErrors
];

// Règles de validation pour la connexion
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email invalide'),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis'),
    handleValidationErrors
];

// Règles de validation pour la mise à jour du profil
const validateUpdateProfile = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Le prénom ne peut pas être vide')
        .isAlpha('fr-FR', { ignore: ' -' })
        .withMessage('Le prénom ne doit contenir que des lettres'),
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Le nom ne peut pas être vide')
        .isAlpha('fr-FR', { ignore: ' -' })
        .withMessage('Le nom ne doit contenir que des lettres'),
    body('avatarUrl')
        .optional()
        .isURL()
        .withMessage('URL d\'avatar invalide'),
    handleValidationErrors
];

// Règles de validation pour le changement de mot de passe
const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Le mot de passe actuel est requis'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
    handleValidationErrors
];

// Règles de validation pour "mot de passe oublié"
const validateForgotPassword = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email invalide'),
    handleValidationErrors
];

// Règles de validation pour la réinitialisation de mot de passe
const validateResetPassword = [
    body('token')
        .notEmpty()
        .withMessage('Le token de réinitialisation est requis'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword
};