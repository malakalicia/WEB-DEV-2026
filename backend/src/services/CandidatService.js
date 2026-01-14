const CandidatRepository = require('../repositories/CandidatRepository');
const BesoinRepository = require('../repositories/BesoinRepository');
const nodemailer = require('nodemailer');
const {
  VALID_PROFILS,
  VALID_STATUTS_CANDIDAT,
  PROFIL_TYPES,
  STATUT_CANDIDAT,
  GROQ_CONFIG,
  getProfilLabel,
  getStatutCandidatLabel,
  getNiveauLabel
} = require('../constants');

// Constantes pour le pourcentage de simulation
const SIMULATION_CONFIG = {
  MIN_PERCENT: 70,
  MAX_PERCENT: 90
};

class CandidatService {
  constructor(
    candidatRepository = new CandidatRepository(),
    besoinRepository = new BesoinRepository()
  ) {
    this.candidatRepository = candidatRepository;
    this.besoinRepository = besoinRepository;
    this.transporter = this.initializeEmailTransporter();
  }

  /**
   * Initialise le transporteur email
   * @returns {object|null} Transporter nodemailer ou null
   */
  initializeEmailTransporter() {
    if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      });
    }
    console.log('[INFO] Gmail non configure - emails seront simules');
    return null;
  }

  async getAllCandidats() {
    return await this.candidatRepository.findAll();
  }

  async getCandidatById(id) {
    return await this.candidatRepository.findById(id);
  }

  async createCandidat(candidatData) {
    const validProfil = VALID_PROFILS.includes(candidatData.profil)
      ? candidatData.profil
      : PROFIL_TYPES.DEVELOPER;
    const validStatut = VALID_STATUTS_CANDIDAT.includes(candidatData.statut)
      ? candidatData.statut
      : STATUT_CANDIDAT.JUNIOR;

    const candidat = await this.candidatRepository.create({
      proposition: candidatData.proposition,
      name: candidatData.name,
      profil: validProfil,
      statut: validStatut,
      experience: candidatData.experience || 0,
      commentaire: candidatData.commentaire || '',
      email: candidatData.email
    });

    return candidat;
  }

  async updateCandidat(id, candidatData) {
    const existingCandidat = await this.candidatRepository.findById(id);

    if (!existingCandidat) {
      throw new Error('Candidat non trouve');
    }

    return await this.candidatRepository.update(id, candidatData);
  }

  async deleteCandidat(id) {
    const deleted = await this.candidatRepository.delete(id);

    if (!deleted) {
      throw new Error('Candidat non trouve');
    }

    return { success: true, message: 'Candidat supprime avec succes' };
  }

  async getCandidatsByBesoin(besoinId) {
    console.log(`[INFO] Recherche candidat pour besoin ${besoinId} - Modele: ${GROQ_CONFIG.MODEL}`);

    const besoin = await this.besoinRepository.findById(besoinId);
    if (!besoin) {
      throw new Error('Besoin non trouve');
    }

    const candidats = await this.candidatRepository.findAll();

    if (candidats.length === 0) {
      return null;
    }

    try {
      const meilleurCandidat = await this.trouverMeilleurCandidatGroq(besoin, candidats);
      console.log('[INFO] GROQ utilise avec succes');
      return meilleurCandidat;
    } catch (error) {
      console.log('[WARN] GROQ echec, basculement simulation:', error.message);
      return this.trouverMeilleurCandidatSimulation(besoin, candidats);
    }
  }

  /**
   * Trouve le meilleur candidat en utilisant l'API Groq
   */
  async trouverMeilleurCandidatGroq(besoin, candidats) {
    if (!this.isGroqConfigured()) {
      throw new Error('API Groq non configuree');
    }

    const { Groq } = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = this.buildGroqPrompt(besoin, candidats);
    const completion = await this.callGroqApi(groq, prompt);
    const result = this.parseGroqResponse(completion);

    return this.findCandidatFromResult(candidats, result);
  }

  /**
   * Verifie si Groq est configure
   */
  isGroqConfigured() {
    return process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'ta_cle_groq_ici';
  }

  /**
   * Construit le prompt pour Groq
   */
  buildGroqPrompt(besoin, candidats) {
    const besoinInfo = `
    BESOIN:
    - Poste: ${besoin.poste}
    - Competences requises: ${Array.isArray(besoin.competences) ? besoin.competences.join(', ') : besoin.competences}
    - Niveau d'urgence: ${getNiveauLabel(besoin.niveau)}
    `;

    const candidatsInfo = candidats.map(c => `
    CANDIDAT ${c.id}:
    - Nom: ${c.name}
    - Profil: ${getProfilLabel(c.profil)}
    - Niveau: ${getStatutCandidatLabel(c.statut)}
    - Experience: ${c.experience} ans
    - Points forts: ${c.commentaire || 'Non specifie'}
    `).join('\n');

    return `
    ${besoinInfo}

    ${candidatsInfo}

    TACHE: Selectionne le MEILLEUR SEUL candidat (le plus compatible) pour ce besoin.

    REPONSE UNIQUEMENT EN FORMAT JSON:
    {
      "id": <id_du_candidat>,
      "pourcentage": <nombre_entre_0_et_100>,
      "raison": "<explication courte (max 15 mots)>"
    }
    `;
  }

  /**
   * Appelle l'API Groq
   */
  async callGroqApi(groq, prompt) {
    return await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Tu es un expert en recrutement. Reponds UNIQUEMENT en JSON valide."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_CONFIG.MODEL,
      temperature: GROQ_CONFIG.TEMPERATURE,
      max_tokens: GROQ_CONFIG.MAX_TOKENS
    });
  }

  /**
   * Parse la reponse Groq
   */
  parseGroqResponse(completion) {
    const response = completion.choices[0]?.message?.content;

    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```(json)?\s*/i, '')
        .replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(cleanedResponse);
    } catch (error) {
      throw new Error('Reponse Groq invalide: ' + response);
    }
  }

  /**
   * Trouve le candidat depuis le resultat Groq
   */
  findCandidatFromResult(candidats, result) {
    const candidat = candidats.find(c => c.id === result.id);
    if (!candidat) {
      throw new Error('Candidat ID non trouve');
    }

    return {
      ...candidat.toJSON(),
      percent: result.pourcentage,
      raison: result.raison
    };
  }

  /**
   * Simulation de matching quand Groq n'est pas disponible
   */
  trouverMeilleurCandidatSimulation(besoin, candidats) {
    const candidatTrie = candidats
      .map(c => ({
        ...c.toJSON(),
        percent: Math.floor(Math.random() * (SIMULATION_CONFIG.MAX_PERCENT - SIMULATION_CONFIG.MIN_PERCENT + 1)) + SIMULATION_CONFIG.MIN_PERCENT,
        raison: "Simulation basee sur l'experience"
      }))
      .sort((a, b) => b.experience - a.experience);

    return candidatTrie[0] || null;
  }

  async sendInterviewEmail(candidatId) {
    const candidat = await this.candidatRepository.findById(candidatId);

    if (!candidat) {
      throw new Error('Candidat non trouve');
    }

    if (this.transporter && process.env.GMAIL_USER) {
      return await this.sendRealEmail(candidat);
    }

    return this.simulateEmail(candidat);
  }

  /**
   * Envoie un vrai email
   */
  async sendRealEmail(candidat) {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: candidat.email,
        subject: 'Invitation a un entretien',
        html: this.buildEmailTemplate(candidat)
      };

      await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        message: `Email d'entretien envoye a ${candidat.email}`,
        candidat: candidat.toJSON(),
        realEmail: true
      };
    } catch (emailError) {
      console.error('[ERROR] Erreur envoi email:', emailError.message);
      return {
        success: true,
        message: `Email d'entretien (simule) envoye a ${candidat.email}`,
        candidat: candidat.toJSON(),
        realEmail: false,
        error: emailError.message
      };
    }
  }

  /**
   * Simule l'envoi d'email
   */
  simulateEmail(candidat) {
    return {
      success: true,
      message: `Email d'entretien (simule) envoye a ${candidat.email}`,
      candidat: candidat.toJSON(),
      realEmail: false
    };
  }

  /**
   * Construit le template HTML de l'email
   */
  buildEmailTemplate(candidat) {
    return `
      <h2>Invitation a un entretien</h2>
      <p>Bonjour ${candidat.name},</p>
      <p>Nous sommes interesses par votre profil et souhaiterions vous rencontrer.</p>
      <p><strong>Details :</strong></p>
      <ul>
        <li>Proposition : ${candidat.proposition}</li>
        <li>Profil : ${getProfilLabel(candidat.profil)}</li>
        <li>Statut : ${getStatutCandidatLabel(candidat.statut)}</li>
        <li>Experience : ${candidat.experience} ans</li>
      </ul>
      <p>Nous vous contacterons bientot pour fixer une date.</p>
      <br>
      <p>Cordialement,<br>L'equipe de recrutement</p>
    `;
  }
}

module.exports = CandidatService;
