const AuthService = require('../services/AuthService');

const authService = new AuthService();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ result: false, message: 'Token manquant' });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ result: false, message: 'Token invalide' });
  }
};

module.exports = authenticateToken;