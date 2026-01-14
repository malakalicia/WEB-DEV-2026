const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

// Regles de validation du mot de passe
const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
  SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Valide le mot de passe selon les regles de securite
   * @param {string} password - Mot de passe a valider
   * @returns {object} - { isValid: boolean, errors: string[] }
   */
  validatePassword(password) {
    const errors = [];

    if (!password || password.length < PASSWORD_RULES.MIN_LENGTH) {
      errors.push(`Le mot de passe doit contenir au moins ${PASSWORD_RULES.MIN_LENGTH} caracteres`);
    }

    if (PASSWORD_RULES.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (PASSWORD_RULES.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (PASSWORD_RULES.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (PASSWORD_RULES.REQUIRE_SPECIAL) {
      const specialRegex = new RegExp(`[${PASSWORD_RULES.SPECIAL_CHARS.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
      if (!specialRegex.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un caractere special (!@#$%^&*...)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide le format de l'email
   * @param {string} email - Email a valider
   * @returns {boolean}
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      login: true,
      token,
      user: user.toJSON()
    };
  }

  async register(email, password) {
    // Validation de l'email
    if (!this.validateEmail(email)) {
      throw new Error('Format d\'email invalide');
    }

    // Validation du mot de passe
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe deja');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      login: true,
      token,
      user: user.toJSON()
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token invalide');
    }
  }
}

module.exports = AuthService;
