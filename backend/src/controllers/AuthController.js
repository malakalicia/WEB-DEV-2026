const AuthService = require('../services/AuthService');

class AuthController {
  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe sont requis'
        });
      }

      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe sont requis'
        });
      }

      const result = await this.authService.register(email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController;
