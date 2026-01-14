const AuthService = require('../../src/services/AuthService');
const UserRepository = require('../../src/repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../src/repositories/UserRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    authService = new AuthService();
    authService.userRepository = mockUserRepository;
    
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        password: 'hashed_password',
        toJSON: function() {
          return {
            id: this.id,
            email: this.email,
            created_at: null,
            updated_at: null
          };
        }
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake_token');

      const result = await authService.login('test@email.com', 'password123');

      expect(result.login).toBe(true);
      expect(result.token).toBe('fake_token');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@email.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should throw error with invalid email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('wrong@email.com', 'password123'))
        .rejects
        .toThrow('Email ou mot de passe incorrect');
    });

    it('should throw error with invalid password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        password: 'hashed_password',
        toJSON: function() {
          return {
            id: this.id,
            email: this.email,
            created_at: null,
            updated_at: null
          };
        }
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('test@email.com', 'wrong_password'))
        .rejects
        .toThrow('Email ou mot de passe incorrect');
    });
  });
});