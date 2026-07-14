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

// ── Règles de validation pour les Projets ──
const validateCreateProject = [
    body('name')
        .trim()
        .notEmpty().withMessage('Le nom du projet est requis')
        .isLength({ max: 255 }).withMessage('Le nom ne peut pas dépasser 255 caractères'),
    body('description')
        .optional()
        .trim(),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('La couleur doit être au format hexadécimal (#RRGGBB)'),
    handleValidationErrors
];

const validateUpdateProject = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Le nom du projet ne peut pas être vide')
        .isLength({ max: 255 }).withMessage('Le nom ne peut pas dépasser 255 caractères'),
    body('description')
        .optional()
        .trim(),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('La couleur doit être au format hexadécimal (#RRGGBB)'),
    body('isArchived')
        .optional()
        .isBoolean().withMessage('isArchived doit être un booléen'),
    handleValidationErrors
];

// ── Règles de validation pour les Tâches ──
const validateCreateTask = [
    body('title')
        .trim()
        .notEmpty().withMessage('Le titre de la tâche est requis')
        .isLength({ max: 500 }).withMessage('Le titre ne peut pas dépasser 500 caractères'),
    body('description')
        .optional()
        .trim(),
    body('listId')
        .notEmpty().withMessage('L\'ID de la liste est requis')
        .isUUID().withMessage('listId doit être un UUID valide'),
    body('projectId')
        .notEmpty().withMessage('L\'ID du projet est requis')
        .isUUID().withMessage('projectId doit être un UUID valide'),
    body('priorityId')
        .optional()
        .isInt({ min: 1, max: 3 }).withMessage('priorityId doit être 1 (faible), 2 (moyenne) ou 3 (haute)'),
    body('assigneeId')
        .optional()
        .isUUID().withMessage('assigneeId doit être un UUID valide'),
    body('dueDate')
        .optional()
        .isISO8601().withMessage('dueDate doit être une date valide (format ISO 8601)'),
    handleValidationErrors
];

const validateUpdateTask = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Le titre ne peut pas être vide')
        .isLength({ max: 500 }).withMessage('Le titre ne peut pas dépasser 500 caractères'),
    body('description')
        .optional()
        .trim(),
    body('listId')
        .optional()
        .isUUID().withMessage('listId doit être un UUID valide'),
    body('priorityId')
        .optional()
        .isInt({ min: 1, max: 3 }).withMessage('priorityId doit être 1 (faible), 2 (moyenne) ou 3 (haute)'),
    body('assigneeId')
        .optional({ values: 'null' })
        .isUUID().withMessage('assigneeId doit être un UUID valide'),
    body('statusId')
        .optional()
        .isInt({ min: 1, max: 3 }).withMessage('statusId invalide'),
    body('dueDate')
        .optional({ values: 'null' })
        .isISO8601().withMessage('dueDate doit être une date valide (format ISO 8601)'),
    handleValidationErrors
];

// ── Règles de validation pour les Listes de tâches ──
const validateCreateList = [
    body('name')
        .trim()
        .notEmpty().withMessage('Le nom de la liste est requis')
        .isLength({ max: 255 }).withMessage('Le nom ne peut pas dépasser 255 caractères'),
    handleValidationErrors
];

const validateUpdateList = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Le nom ne peut pas être vide')
        .isLength({ max: 255 }).withMessage('Le nom ne peut pas dépasser 255 caractères'),
    handleValidationErrors
];

// ── Règles de validation pour les Membres du projet ──
const validateAddMember = [
    body('userId')
        .notEmpty().withMessage('L\'ID de l\'utilisateur est requis')
        .isUUID().withMessage('userId doit être un UUID valide'),
    body('role')
        .optional()
        .isIn(['admin', 'member', 'viewer']).withMessage('Le rôle doit être admin, member ou viewer'),
    handleValidationErrors
];

const validateUpdateMemberRole = [
    body('role')
        .notEmpty().withMessage('Le rôle est requis')
        .isIn(['admin', 'member', 'viewer']).withMessage('Le rôle doit être admin, member ou viewer'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword,
    validateCreateProject,
    validateUpdateProject,
    validateCreateTask,
    validateUpdateTask,
    validateCreateList,
    validateUpdateList,
    validateAddMember,
    validateUpdateMemberRole
};