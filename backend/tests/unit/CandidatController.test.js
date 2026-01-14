const CandidatController = require('../../src/controllers/CandidatController');
const CandidatService = require('../../src/services/CandidatService');

jest.mock('../../src/services/CandidatService');

describe('CandidatController', () => {
  let candidatController;
  let mockCandidatService;

  beforeEach(() => {
    mockCandidatService = new CandidatService();
    candidatController = new CandidatController();
    candidatController.candidatService = mockCandidatService;
  });

  describe('getByBesoin', () => {
    it('should return candidat for besoin', async () => {
      const mockReq = { params: { id_besoin: 1 } };
      const mockRes = { json: jest.fn() };

      const mockCandidat = { id: 1, name: 'Test', percent: 85 };
      mockCandidatService.getCandidatsByBesoin.mockResolvedValue(mockCandidat);

      await candidatController.getByBesoin(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockCandidat);
    });
  });
});