const CandidatService = require('../../src/services/CandidatService');
const CandidatRepository = require('../../src/repositories/CandidatRepository');
const BesoinRepository = require('../../src/repositories/BesoinRepository');

jest.mock('../../src/repositories/CandidatRepository');
jest.mock('../../src/repositories/BesoinRepository');

describe('CandidatService', () => {
  let candidatService;
  let mockCandidatRepository;
  let mockBesoinRepository;

  beforeEach(() => {
    mockCandidatRepository = new CandidatRepository();
    mockBesoinRepository = new BesoinRepository();
    candidatService = new CandidatService();
    candidatService.candidatRepository = mockCandidatRepository;
    candidatService.besoinRepository = mockBesoinRepository;
  });

  describe('getCandidatsByBesoin', () => {
    it('should return null if no candidats', async () => {
      const mockBesoin = { 
        id: 1, 
        poste: 'Test',
        toJSON: () => ({ id: 1, poste: 'Test' })
      };
      mockBesoinRepository.findById.mockResolvedValue(mockBesoin);
      mockCandidatRepository.findAll.mockResolvedValue([]);

      const result = await candidatService.getCandidatsByBesoin(1);

      expect(result).toBeNull();
    });

    it('should return best candidat when candidats exist', async () => {
      const mockBesoin = { 
        id: 1, 
        poste: 'Développeur',
        competences: ['JavaScript'],
        niveau: 2,
        toJSON: () => ({ id: 1, poste: 'Développeur' })
      };
      
      const mockCandidat = {
        id: 1,
        name: 'Test Candidat',
        experience: 5,
        toJSON: () => ({ id: 1, name: 'Test Candidat' })
      };
      
      mockBesoinRepository.findById.mockResolvedValue(mockBesoin);
      mockCandidatRepository.findAll.mockResolvedValue([mockCandidat]);

      const result = await candidatService.getCandidatsByBesoin(1);

      expect(result).toBeTruthy();
    });
  });

  describe('sendInterviewEmail', () => {
    it('should send email successfully', async () => {
      const mockCandidat = {
        id: 1,
        name: 'Test',
        email: 'test@email.com',
        proposition: 'PROP-001',
        profil: 0,
        statut: 2,
        experience: 5,
        toJSON: () => ({ 
          id: 1, 
          name: 'Test', 
          email: 'test@email.com' 
        })
      };

      mockCandidatRepository.findById.mockResolvedValue(mockCandidat);

      const result = await candidatService.sendInterviewEmail(1);

      expect(result.success).toBe(true);
      expect(result.message).toContain('test@email.com');
    }, 10000); // Timeout de 10 secondes

    it('should throw error if candidat not found', async () => {
      mockCandidatRepository.findById.mockResolvedValue(null);

      await expect(candidatService.sendInterviewEmail(999))
        .rejects
        .toThrow('Candidat non trouvé');
    });
  });

  describe('getAllCandidats', () => {
    it('should return all candidats', async () => {
      const mockCandidats = [
        { id: 1, name: 'Candidat 1', toJSON: () => ({ id: 1, name: 'Candidat 1' }) },
        { id: 2, name: 'Candidat 2', toJSON: () => ({ id: 2, name: 'Candidat 2' }) }
      ];
      
      mockCandidatRepository.findAll.mockResolvedValue(mockCandidats);

      const result = await candidatService.getAllCandidats();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Candidat 1');
    });
  });
});