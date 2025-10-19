const jwt = require('jsonwebtoken');

// Valeurs par défaut pour le développement
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default_access_secret_dev_123456';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_dev_789012';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Access token invalide');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Refresh token invalide');
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken
};