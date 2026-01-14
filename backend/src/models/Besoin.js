const BaseModel = require('./BaseModel');

class Besoin extends BaseModel {
  static get tableName() {
    return 'besoins';
  }

  static get columns() {
    return ['id', 'poste', 'competences', 'niveau', 'statut', 'created_at', 'updated_at'];
  }

  constructor(id, poste, competences, niveau, statut) {
    super();
    this.id = id;
    this.poste = poste;
    this.competences = Array.isArray(competences) ? competences : [];
    this.niveau = niveau;
    this.statut = statut;
  }

  toJSON() {
    return {
      id: this.id,
      poste: this.poste,
      competences: this.competences,
      niveau: this.niveau,
      statut: this.statut,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  static getNiveauLabel(niveau) {
    const labels = {
      0: 'faible',
      1: 'moyen',
      2: 'urgent'
    };
    return labels[niveau] || 'inconnu';
  }

  static getStatutLabel(statut) {
    return statut === 1 ? 'ouvert' : 'clôturé';
  }
}

module.exports = Besoin;