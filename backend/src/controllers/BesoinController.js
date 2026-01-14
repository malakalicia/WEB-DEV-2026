const BesoinService = require('../services/BesoinService');

class BesoinController {
  constructor() {
    this.besoinService = new BesoinService();
  }

  async getAll(req, res) {
    try {
      const besoins = await this.besoinService.getAllBesoins();
      res.json({ besoins: besoins.map(b => b.toJSON()) });
    } catch (error) {
      res.status(500).json({ 
        result: false, 
        message: 'Erreur lors de la récupération des besoins' 
      });
    }
  }

  async getById(req, res) {
    try {
      const besoin = await this.besoinService.getBesoinById(req.params.id);
      
      if (!besoin) {
        return res.status(404).json({ 
          result: false, 
          message: 'Besoin non trouvé' 
        });
      }

      res.json(besoin.toJSON());
    } catch (error) {
      res.status(500).json({ 
        result: false, 
        message: error.message 
      });
    }
  }

  async create(req, res) {
    try {
      const besoinData = req.body;
      const besoin = await this.besoinService.createBesoin(besoinData);
      
      res.status(201).json(besoin.toJSON());
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
      const besoinData = req.body;
      
      const besoin = await this.besoinService.updateBesoin(id, besoinData);
      
      if (!besoin) {
        return res.status(404).json({ 
          result: false, 
          message: 'Besoin non trouvé' 
        });
      }

      res.json(besoin.toJSON());
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
      const result = await this.besoinService.deleteBesoin(id);
      
      res.json(result);
    } catch (error) {
      res.status(404).json({ 
        result: false, 
        message: error.message 
      });
    }
  }
}

module.exports = BesoinController;