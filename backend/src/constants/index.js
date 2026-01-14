/**
 * SmartHR - Constantes et Enumerations
 * Centralise toutes les valeurs magiques du projet
 */

// =============================================================================
// TYPES DE PROFIL CANDIDAT
// =============================================================================
const PROFIL_TYPES = {
  DEVELOPER: 0,
  DATA_SCIENTIST: 1,
  DEVOPS: 2,
  PROJECT_MANAGER: 3,
  DESIGNER: 4
};

const PROFIL_LABELS = {
  [PROFIL_TYPES.DEVELOPER]: 'Developpeur',
  [PROFIL_TYPES.DATA_SCIENTIST]: 'Data Scientist',
  [PROFIL_TYPES.DEVOPS]: 'DevOps',
  [PROFIL_TYPES.PROJECT_MANAGER]: 'Chef de Projet',
  [PROFIL_TYPES.DESIGNER]: 'Designer'
};

const VALID_PROFILS = Object.values(PROFIL_TYPES);

// =============================================================================
// STATUTS CANDIDAT (Niveau d'experience)
// =============================================================================
const STATUT_CANDIDAT = {
  JUNIOR: 0,
  INTERMEDIATE: 1,
  SENIOR: 2,
  EXPERT: 3
};

const STATUT_CANDIDAT_LABELS = {
  [STATUT_CANDIDAT.JUNIOR]: 'Junior',
  [STATUT_CANDIDAT.INTERMEDIATE]: 'Intermediaire',
  [STATUT_CANDIDAT.SENIOR]: 'Senior',
  [STATUT_CANDIDAT.EXPERT]: 'Expert'
};

const VALID_STATUTS_CANDIDAT = Object.values(STATUT_CANDIDAT);

// =============================================================================
// NIVEAUX D'URGENCE BESOIN
// =============================================================================
const NIVEAU_URGENCE = {
  LOW: 0,
  MEDIUM: 1,
  URGENT: 2
};

const NIVEAU_URGENCE_LABELS = {
  [NIVEAU_URGENCE.LOW]: 'Faible',
  [NIVEAU_URGENCE.MEDIUM]: 'Moyen',
  [NIVEAU_URGENCE.URGENT]: 'Urgent'
};

const VALID_NIVEAUX = Object.values(NIVEAU_URGENCE);

// =============================================================================
// STATUTS BESOIN
// =============================================================================
const STATUT_BESOIN = {
  CLOSED: 0,
  OPEN: 1
};

const STATUT_BESOIN_LABELS = {
  [STATUT_BESOIN.CLOSED]: 'Cloture',
  [STATUT_BESOIN.OPEN]: 'Ouvert'
};

const VALID_STATUTS_BESOIN = Object.values(STATUT_BESOIN);

// =============================================================================
// CONFIGURATION SECURITE
// =============================================================================
const SECURITY_CONFIG = {
  BCRYPT_ROUNDS: 10,
  PASSWORD_MIN_LENGTH: 8
};

// =============================================================================
// CONFIGURATION GROQ AI
// =============================================================================
const GROQ_CONFIG = {
  MODEL: 'llama-3.3-70b-versatile',
  TEMPERATURE: 0.2,
  MAX_TOKENS: 500
};

// =============================================================================
// CONFIGURATION BASE DE DONNEES
// =============================================================================
const DB_CONFIG = {
  EXCLUDED_COLUMNS: ['id', 'created_at', 'updated_at']
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Obtient le label d'un profil candidat
 * @param {number} profil - Code du profil
 * @returns {string} Label du profil
 */
function getProfilLabel(profil) {
  return PROFIL_LABELS[profil] || 'Autre';
}

/**
 * Obtient le label d'un statut candidat
 * @param {number} statut - Code du statut
 * @returns {string} Label du statut
 */
function getStatutCandidatLabel(statut) {
  return STATUT_CANDIDAT_LABELS[statut] || 'Non specifie';
}

/**
 * Obtient le label d'un niveau d'urgence
 * @param {number} niveau - Code du niveau
 * @returns {string} Label du niveau
 */
function getNiveauLabel(niveau) {
  return NIVEAU_URGENCE_LABELS[niveau] || 'Inconnu';
}

/**
 * Obtient le label d'un statut besoin
 * @param {number} statut - Code du statut
 * @returns {string} Label du statut
 */
function getStatutBesoinLabel(statut) {
  return STATUT_BESOIN_LABELS[statut] || 'Inconnu';
}

/**
 * Valide si un profil est valide
 * @param {number} profil - Code du profil
 * @returns {boolean}
 */
function isValidProfil(profil) {
  return VALID_PROFILS.includes(profil);
}

/**
 * Valide si un statut candidat est valide
 * @param {number} statut - Code du statut
 * @returns {boolean}
 */
function isValidStatutCandidat(statut) {
  return VALID_STATUTS_CANDIDAT.includes(statut);
}

/**
 * Valide si un niveau est valide
 * @param {number} niveau - Code du niveau
 * @returns {boolean}
 */
function isValidNiveau(niveau) {
  return VALID_NIVEAUX.includes(niveau);
}

/**
 * Valide si un statut besoin est valide
 * @param {number} statut - Code du statut
 * @returns {boolean}
 */
function isValidStatutBesoin(statut) {
  return VALID_STATUTS_BESOIN.includes(statut);
}

module.exports = {
  // Types
  PROFIL_TYPES,
  STATUT_CANDIDAT,
  NIVEAU_URGENCE,
  STATUT_BESOIN,

  // Labels
  PROFIL_LABELS,
  STATUT_CANDIDAT_LABELS,
  NIVEAU_URGENCE_LABELS,
  STATUT_BESOIN_LABELS,

  // Valid values arrays
  VALID_PROFILS,
  VALID_STATUTS_CANDIDAT,
  VALID_NIVEAUX,
  VALID_STATUTS_BESOIN,

  // Configuration
  SECURITY_CONFIG,
  GROQ_CONFIG,
  DB_CONFIG,

  // Helper functions
  getProfilLabel,
  getStatutCandidatLabel,
  getNiveauLabel,
  getStatutBesoinLabel,
  isValidProfil,
  isValidStatutCandidat,
  isValidNiveau,
  isValidStatutBesoin
};
