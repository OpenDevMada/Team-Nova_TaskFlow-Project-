const { verifyAccessToken  } = require('../utils/jwtUtils');
const { User } = require('../models');
const { AppError } = require('./errorHandler');

/**
 * Middleware d'authentification
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const authenticate = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Token d\'authentification manquant', 401);
        }

        const accessToken = authHeader.substring(7);

        // Vérifier le token
        const decoded = verifyAccessToken(accessToken);

        // Vérifier que l'utilisateur existe toujours
        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['passwordHash', 'refreshToken'] }
        });

        if (!user || !user.isActive) {
            throw new AppError('Utilisateur non trouvé ou désactivé', 401);
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new AppError('Token invalide', 401));
        } else if (error.name === 'TokenExpiredError') {
            next(new AppError('Token expiré', 401));
        } else {
            next(error);
        }
    }
};

// Middleware optionnel pour rafraîchir le token
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      const decoded = verifyAccessToken(accessToken);
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['passwordHash', 'refreshToken'] }
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continuer sans utilisateur si l'authentification échoue
    next();
  }
};

// Middleware d'autorisation (vérifier les rôles)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Accès non autorisé', 403));
        }

        if (!roles.includes(req.user.roleGlobal)) {
            return next(new AppError('Droits insuffisants pour accéder à cette ressource', 403));
        }

        next();
    };
};

// Middleware pour vérifier la propriété (optionnel)
const checkOwnership = (modelName, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const model = require(`../models`)[modelName];
            const resource = await model.findByPk(req.params[paramName]);

            if (!resource) {
                return next(new AppError('Ressource non trouvée', 404));
            }

            // Vérifier si l'utilisateur est le propriétaire
            if (resource.userId !== req.user.id && req.user.roleGlobal !== 'admin') {
                return next(new AppError('Accès non autorisé à cette ressource', 403));
            }

            req.resource = resource;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    authenticate,
    authorize,
    optionalAuthenticate,
    checkOwnership
};