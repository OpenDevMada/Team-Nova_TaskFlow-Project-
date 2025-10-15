const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword,
    validateForgotPassword,
    validateResetPassword
} = require('../middleware/validationMiddleware');

// Routes publiques
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);
router.post('/reset-password', validateResetPassword, AuthController.resetPassword);

// Routes protégées
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, validateUpdateProfile, AuthController.updateProfile);
router.put('/change-password', authenticate, validateChangePassword, AuthController.changePassword);

module.exports = router;