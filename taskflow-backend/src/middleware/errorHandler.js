/**
 * Middleware de gestion centralisée des erreurs
 * Capture toutes les erreurs de l'application et renvoie des réponses standardisées
 */

import { Sequelize } from 'sequelize';
import { ValidationError, DatabaseError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

/**
 * Log des erreurs avec différents niveaux selon l'environnement
 */
const logError = (error, req) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.error(`[${timestamp}] ERROR: ${method} ${url}`);
  console.error(`IP: ${ip} - User-Agent: ${userAgent}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', error.stack);
    console.error('Full error:', error);
  } else {
    console.error('Message:', error.message);
    
    // En production, on log plus d'infos pour les erreurs serveur
    if (!error.isOperational) {
      console.error('Stack trace (production):', error.stack);
    }
  }
};

/**
 * Création d'erreur opérationnelle
 */
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }

  withDetails(details) {
    this.details = details;
    return this;
  }
}

/**
 * Gestion des erreurs Sequelize
 */
const handleSequelizeError = (error) => {
  // Erreur de validation (champs requis, format email, etc.)
  if (error instanceof ValidationError) {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));
    
    return new AppError(
      'Données de validation invalides',
      400,
      true
    ).withDetails(errors);
  }
  
  // Violation de contrainte d'unicité
  if (error instanceof UniqueConstraintError) {
    const field = error.errors[0]?.path || 'champ';
    return new AppError(
      `La valeur du ${field} est déjà utilisée`,
      409,
      true
    );
  }
  
  // Erreur de clé étrangère
  if (error instanceof ForeignKeyConstraintError) {
    return new AppError(
      'Référence à une ressource inexistante',
      400,
      true
    );
  }
  
  // Erreur générale de base de données
  if (error instanceof DatabaseError) {
    return new AppError(
      'Erreur de base de données',
      500,
      false
    );
  }
  
  // Timeout de la base de données
  if (error instanceof Sequelize.TimeoutError) {
    return new AppError(
      'Timeout de la base de données',
      503,
      true
    );
  }
  
  return null;
};

/**
 * Gestion des erreurs JWT
 */
const handleJWTError = () => {
  return new AppError('Token invalide. Veuillez vous reconnecter.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Votre session a expiré. Veuillez vous reconnecter.', 401);
};

/**
 * Gestion des erreurs de limite de taux
 */
const handleRateLimitError = (error) => {
  return new AppError(
    'Trop de requêtes. Veuillez réessayer plus tard.',
    429
  );
};

/**
 * Gestion des erreurs de syntaxe JSON
 */
const handleJsonSyntaxError = (error) => {
  return new AppError(
    'JSON mal formé dans le corps de la requête',
    400
  );
};

/**
 * Gestion des erreurs Multer (upload de fichiers)
 */
const handleMulterError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new AppError('Fichier trop volumineux', 413);
  }
  if (error.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Trop de fichiers uploadés', 413);
  }
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Type de fichier non autorisé', 415);
  }
  
  return new AppError('Erreur lors de l\'upload du fichier', 500);
};

/**
 * Middleware principal de gestion d'erreurs
 */
export const errorHandler = (error, req, res, next) => {
  // Définition des valeurs par défaut
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erreur interne du serveur';
  let details = error.details || null;
  let isOperational = error.isOperational !== undefined ? error.isOperational : true;
  
  // Log de l'erreur
  logError(error, req);
  
  // Gestion spécifique selon le type d'erreur
  let handledError = null;
  
  switch (error.constructor) {
    case Sequelize.ValidationError:
    case Sequelize.UniqueConstraintError:
    case Sequelize.DatabaseError:
    case Sequelize.ForeignKeyConstraintError:
    case Sequelize.TimeoutError:
      handledError = handleSequelizeError(error);
      break;
      
    case SyntaxError:
      if (error.type === 'entity.parse.failed') {
        handledError = handleJsonSyntaxError(error);
      }
      break;
      
    case AppError:
      // Déjà une AppError, on la conserve
      handledError = error;
      break;
  }
  
  // Gestion par nom d'erreur (pour les erreurs JWT)
  if (error.name === 'JsonWebTokenError') {
    handledError = handleJWTError();
  }
  
  if (error.name === 'TokenExpiredError') {
    handledError = handleJWTExpiredError();
  }
  
  // Gestion des erreurs de limite de taux
  if (error.statusCode === 429) {
    handledError = handleRateLimitError(error);
  }
  
  // Gestion des erreurs Multer
  if (error.code && error.code.startsWith('LIMIT_')) {
    handledError = handleMulterError(error);
  }
  
  // Si l'erreur a été traitée spécifiquement, on utilise ses valeurs
  if (handledError) {
    statusCode = handledError.statusCode;
    message = handledError.message;
    details = handledError.details;
    isOperational = handledError.isOperational;
  }
  
  // Construction de la réponse d'erreur
  const errorResponse = {
    success: false,
    message: message,
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };
  
  // Ajout des détails si présents
  if (details) {
    errorResponse.details = details;
  }
  
  // En développement, on ajoute plus d'informations
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.fullError = {
      name: error.name,
      message: error.message,
      code: error.code
    };
  }
  
  // En production, on masque les erreurs internes
  if (process.env.NODE_ENV === 'production' && !isOperational) {
    errorResponse.message = 'Une erreur interne est survenue';
    // On log l'erreur complète pour investigation
    console.error('Erreur interne non opérationnelle:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method
    });
  }
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route non trouvée: ${req.method} ${req.originalUrl}`,
    404
  );
  next(error);
};

/**
 * Wrapper async pour éviter les try/catch dans les contrôleurs
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};