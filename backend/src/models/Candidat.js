const BaseModel = require('./BaseModel');

class Candidat extends BaseModel {
  static get tableName() {
    return 'candidats';
  }

  static get columns() {
    return [
      'id', 'proposition', 'name', 'profil', 'statut',
      'experience', 'commentaire', 'email', 'created_at', 'updated_at'
    ];
  }

  constructor(id, proposition, name, profil, statut, experience, commentaire, email) {
    super();
    this.id = id;
    this.proposition = proposition;
    this.name = name;
    this.profil = profil;
    this.statut = statut;
    this.experience = experience;
    this.commentaire = commentaire;
    this.email = email;
  }

  toJSON() {
    return {
      id: this.id,
      proposition: this.proposition,
      name: this.name,
      profil: this.profil,
      statut: this.statut,
      experience: this.experience,
      commentaire: this.commentaire,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  static getProfilLabel(profil) {
    const labels = {
      0: 'Développeur',
      1: 'Designer',
      2: 'Chef de projet',
      3: 'Analyste',
      4: 'Architecte'
    };
    return labels[profil] || 'Autre';
  }

  static getStatutLabel(statut) {
    const labels = {
      0: 'Junior',
      1: 'Intermédiaire',
      2: 'Senior',
      3: 'Expert'
    };
    return labels[statut] || 'Non spécifié';
  }
}

module.exports = Candidat;