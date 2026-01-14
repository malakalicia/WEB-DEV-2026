const BesoinService = require('../../src/services/BesoinService');
const BesoinRepository = require('../../src/repositories/BesoinRepository');

jest.mock('../../src/repositories/BesoinRepository');

describe('BesoinService', () => {
  let besoinService;
  let mockBesoinRepository;

  beforeEach(() => {
    mockBesoinRepository = new BesoinRepository();
    besoinService = new BesoinService();
    besoinService.besoinRepository = mockBesoinRepository;
  });

  describe('createBesoin', () => {
    it('should create besoin with valid data', async () => {
      const besoinData = {
        poste: 'Développeur',
        competences: ['JavaScript', 'Node.js'],
        niveau: 2,
        statut: 1
      };

      const mockBesoin = {
        id: 1,
        ...besoinData,
        toJSON: () => ({ id: 1, ...besoinData })
      };

      mockBesoinRepository.create.mockResolvedValue(mockBesoin);

      const result = await besoinService.createBesoin(besoinData);

      expect(result.id).toBe(1);
      expect(result.poste).toBe('Développeur');
      expect(mockBesoinRepository.create).toHaveBeenCalledWith(besoinData);
    });
  });
});