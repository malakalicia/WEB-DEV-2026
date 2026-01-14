const BesoinRepository = require('../repositories/BesoinRepository');
const {
  VALID_NIVEAUX,
  VALID_STATUTS_BESOIN,
  NIVEAU_URGENCE,
  STATUT_BESOIN
} = require('../constants');

class BesoinService {
  constructor(besoinRepository = new BesoinRepository()) {
    this.besoinRepository = besoinRepository;
  }

  /**
   * Parse les competences depuis une chaine ou un tableau
   * @param {string|array} competences - Competences a parser
   * @returns {array} Tableau de competences
   */
  parseCompetences(competences) {
    if (Array.isArray(competences)) {
      return competences;
    }

    if (typeof competences === 'string') {
      return competences
        .split(',')
        .map(comp => comp.trim())
        .filter(comp => comp.length > 0);
    }

    return [];
  }

  async getAllBesoins() {
    return await this.besoinRepository.findAll();
  }

  async getBesoinById(id) {
    return await this.besoinRepository.findById(id);
  }

  async createBesoin(besoinData) {
    const competencesArray = this.parseCompetences(besoinData.competences);
    const validNiveau = VALID_NIVEAUX.includes(besoinData.niveau)
      ? besoinData.niveau
      : NIVEAU_URGENCE.LOW;
    const validStatut = VALID_STATUTS_BESOIN.includes(besoinData.statut)
      ? besoinData.statut
      : STATUT_BESOIN.CLOSED;

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
      throw new Error('Besoin non trouve');
    }

    // Parser les competences si fournies
    if (besoinData.competences) {
      besoinData.competences = this.parseCompetences(besoinData.competences);
    }

    return await this.besoinRepository.update(id, besoinData);
  }

  async deleteBesoin(id) {
    const deleted = await this.besoinRepository.delete(id);

    if (!deleted) {
      throw new Error('Besoin non trouve');
    }

    return { success: true, message: 'Besoin supprime avec succes' };
  }
}

module.exports = BesoinService;
