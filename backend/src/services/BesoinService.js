const BesoinRepository = require('../repositories/BesoinRepository');

class BesoinService {
  constructor() {
    this.besoinRepository = new BesoinRepository();
  }

  async getAllBesoins() {
    return await this.besoinRepository.findAll();
  }

  async getBesoinById(id) {
    return await this.besoinRepository.findById(id);
  }

  async createBesoin(besoinData) {
    // Convertir les compétences si c'est une chaîne
    let competencesArray = besoinData.competences;
    
    if (typeof competencesArray === 'string') {
      // Supprimer les espaces et split par virgule
      competencesArray = besoinData.competences
        .split(',')
        .map(comp => comp.trim())
        .filter(comp => comp.length > 0);
    }
    
    // Si ce n'est pas un tableau, le convertir
    if (!Array.isArray(competencesArray)) {
      competencesArray = [];
    }

    const validNiveau = [0, 1, 2].includes(besoinData.niveau) ? besoinData.niveau : 0;
    const validStatut = [0, 1].includes(besoinData.statut) ? besoinData.statut : 0;

    const besoin = await this.besoinRepository.create({
      poste: besoinData.poste,
      competences: competencesArray,
      niveau: validNiveau,
      statut: validStatut
    });

    return besoin;
  }

  async updateBesoin(id, besoinData) {
    const existingBesoin = await this.besoinRepository.findById(id);
    
    if (!existingBesoin) {
      throw new Error('Besoin non trouvé');
    }

    // Même conversion pour update
    if (besoinData.competences && typeof besoinData.competences === 'string') {
      besoinData.competences = besoinData.competences
        .split(',')
        .map(comp => comp.trim())
        .filter(comp => comp.length > 0);
    }

    return await this.besoinRepository.update(id, besoinData);
  }

  async deleteBesoin(id) {
    const deleted = await this.besoinRepository.delete(id);
    
    if (!deleted) {
      throw new Error('Besoin non trouvé');
    }

    return { success: true, message: 'Besoin supprimé avec succès' };
  }
}

module.exports = BesoinService;