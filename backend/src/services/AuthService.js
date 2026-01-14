const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
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
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
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