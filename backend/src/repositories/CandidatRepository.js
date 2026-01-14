const BaseRepository = require('./BaseRepository');
const Candidat = require('../models/Candidat');
const db = require('../config/database');

class CandidatRepository extends BaseRepository {
  constructor() {
    super(Candidat);
  }

  async findByBesoin(besoinId) {
    // Simulation de l'algorithme de matching IA
    // Dans la réalité, vous implémenteriez ici la logique de matching
    const query = 'SELECT * FROM candidats ORDER BY RANDOM() LIMIT 5';
    const result = await db.query(query);
    
    // Ajout d'un pourcentage de compatibilité simulé
    return result.rows.map((row, index) => {
      const candidat = new Candidat(...Object.values(row));
      return {
        ...candidat.toJSON(),
        percent: Math.floor(Math.random() * 30) + 70 // Simulation: 70-100%
      };
    });
  }
}

module.exports = CandidatRepository;