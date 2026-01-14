const BesoinController = require('../../src/controllers/BesoinController');
const BesoinService = require('../../src/services/BesoinService');

jest.mock('../../src/services/BesoinService');

describe('BesoinController', () => {
  let besoinController;
  let mockBesoinService;
  let mockReq, mockRes;

  beforeEach(() => {
    mockBesoinService = new BesoinService();
    besoinController = new BesoinController();
    besoinController.besoinService = mockBesoinService;

    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()  // ← CORRECTION ICI
    };
  });

  describe('getAll', () => {
    it('should return all besoins', async () => {
      const mockBesoins = [
        { 
          id: 1, 
          poste: 'Test',
          toJSON: () => ({ id: 1, poste: 'Test' })
        }
      ];
      mockBesoinService.getAllBesoins.mockResolvedValue(mockBesoins);

      await besoinController.getAll(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ 
        besoins: [{ id: 1, poste: 'Test' }] 
      });
    });

    it('should handle error', async () => {
      mockBesoinService.getAllBesoins.mockRejectedValue(new Error('DB error'));

      await besoinController.getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        result: false,
        message: 'Erreur lors de la récupération des besoins'
      });
    });
  });
});