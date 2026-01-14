const AuthController = require('../../src/controllers/AuthController');
const AuthService = require('../../src/services/AuthService');

jest.mock('../../src/services/AuthService');

describe('AuthController', () => {
  let authController;
  let mockAuthService;
  let mockReq, mockRes;

  beforeEach(() => {
    mockAuthService = new AuthService();
    authController = new AuthController();
    authController.authService = mockAuthService;

    mockReq = {
      body: { email: 'test@email.com', password: 'password123' }
    };

    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('login', () => {
    it('should return success on valid login', async () => {
      const mockResult = { login: true, token: 'fake-token' };
      mockAuthService.login.mockResolvedValue(mockResult);

      await authController.login(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });
  });
});