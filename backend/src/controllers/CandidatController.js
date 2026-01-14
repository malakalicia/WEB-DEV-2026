const CandidatService = require('../services/CandidatService');

class CandidatController {
  constructor() {
    this.candidatService = new CandidatService();
  }

  async getAll(req, res) {
    try {
      const candidats = await this.candidatService.getAllCandidats();
      res.json({ candidats: candidats.map(c => c.toJSON()) });
    } catch (error) {
      res.status(500).json({ 
        result: false, 
        message: 'Erreur lors de la récupération des candidats' 
      });
    }
  }

  async getById(req, res) {
    try {
      const candidat = await this.candidatService.getCandidatById(req.params.id);
      
      if (!candidat) {
        return res.status(404).json({ 
          result: false, 
          message: 'Candidat non trouvé' 
        });
      }

      res.json(candidat.toJSON());
    } catch (error) {
      res.status(500).json({ 
        result: false, 
        message: error.message 
      });
    }
  }

  async create(req, res) {
    try {
      const candidatData = req.body;
      const candidat = await this.candidatService.createCandidat(candidatData);
      
      res.status(201).json(candidat.toJSON());
    } catch (error) {
      res.status(400).json({ 
        result: false, 
        message: error.message 
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const candidatData = req.body;
      
      const candidat = await this.candidatService.updateCandidat(id, candidatData);
      
      if (!candidat) {
        return res.status(404).json({ 
          result: false, 
          message: 'Candidat non trouvé' 
        });
      }

      res.json(candidat.toJSON());
    } catch (error) {
      res.status(400).json({ 
        result: false, 
        message: error.message 
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await this.candidatService.deleteCandidat(id);
      
      res.json(result);
    } catch (error) {
      res.status(404).json({ 
        result: false, 
        message: error.message 
      });
    }
  }

  async getByBesoin(req, res) {
    try {
      const { id_besoin } = req.params;
      const candidat = await this.candidatService.getCandidatsByBesoin(id_besoin);
      
      if (!candidat) {
        return res.json({ 
          message: "Aucun candidat disponible pour ce besoin",
          candidat: null 
        });
      }
      
      res.json(candidat);
    } catch (error) {
      res.status(500).json({ 
        result: false, 
        message: error.message 
      });
    }
  }

  async sendInterviewEmail(req, res) {
    try {
      const { id_candidat } = req.params;
      const result = await this.candidatService.sendInterviewEmail(id_candidat);
      
      res.json(result);
    } catch (error) {
      res.status(404).json({ 
        result: false, 
        message: error.message 
      });
    }
  }
}

module.exports = CandidatController;