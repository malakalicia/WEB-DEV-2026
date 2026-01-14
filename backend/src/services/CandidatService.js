const CandidatRepository = require('../repositories/CandidatRepository');
const BesoinRepository = require('../repositories/BesoinRepository');
const nodemailer = require('nodemailer');

class CandidatService {
  constructor() {
    this.candidatRepository = new CandidatRepository();
    this.besoinRepository = new BesoinRepository();
    
    // Configurer nodemailer si les variables existent
    if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      });
    } else {
      this.transporter = null;
      console.log('⚠️  Gmail non configuré - emails seront simulés');
    }
  }

  async getAllCandidats() {
    return await this.candidatRepository.findAll();
  }

  async getCandidatById(id) {
    return await this.candidatRepository.findById(id);
  }

  async createCandidat(candidatData) {
    const validProfil = [0, 1, 2, 3, 4].includes(candidatData.profil) ? candidatData.profil : 0;
    const validStatut = [0, 1, 2, 3].includes(candidatData.statut) ? candidatData.statut : 0;

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
      throw new Error('Candidat non trouvé');
    }

    return await this.candidatRepository.update(id, candidatData);
  }

  async deleteCandidat(id) {
    const deleted = await this.candidatRepository.delete(id);
    
    if (!deleted) {
      throw new Error('Candidat non trouvé');
    }

    return { success: true, message: 'Candidat supprimé avec succès' };
  }

  async getCandidatsByBesoin(besoinId) {
    console.log('🚀 APPEL API GROQ - Modèle: llama-3.3-70b-versatile');
    
    // Récupérer le besoin
    const besoin = await this.besoinRepository.findById(besoinId);
    if (!besoin) {
      throw new Error('Besoin non trouvé');
    }

    // Récupérer tous les candidats
    const candidats = await this.candidatRepository.findAll();

    // Si pas de candidats, retourner null
    if (candidats.length === 0) {
      return null;
    }

    try {
      // Essayer l'API Groq
      const meilleurCandidat = await this.trouverMeilleurCandidatGroq(besoin, candidats);
      console.log('✅ GROQ utilisé avec succès');
      return meilleurCandidat;
    } catch (error) {
      console.log('❌ GROQ échoué, basculement simulation:', error.message);
      // Fallback à la simulation
      return this.trouverMeilleurCandidatSimulation(besoin, candidats);
    }
  }

  async trouverMeilleurCandidatGroq(besoin, candidats) {
    // Vérifier si la clé Groq existe
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'ta_clé_groq_ici') {
      throw new Error('API Groq non configurée');
    }

    const { Groq } = require('groq-sdk');
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Préparer les données
    const besoinInfo = `
    BESOIN:
    - Poste: ${besoin.poste}
    - Compétences requises: ${Array.isArray(besoin.competences) ? besoin.competences.join(', ') : besoin.competences}
    - Niveau d'urgence: ${besoin.niveau === 2 ? 'Urgent' : besoin.niveau === 1 ? 'Moyen' : 'Faible'}
    `;

    const candidatsInfo = candidats.map(c => `
    CANDIDAT ${c.id}:
    - Nom: ${c.name}
    - Profil: ${this.getProfilLabel(c.profil)}
    - Niveau: ${this.getStatutLabel(c.statut)}
    - Expérience: ${c.experience} ans
    - Points forts: ${c.commentaire || 'Non spécifié'}
    `).join('\n');

    const prompt = `
    ${besoinInfo}
    
    ${candidatsInfo}
    
    TÂCHE: Sélectionne le MEILLEUR SEUL candidat (le plus compatible) pour ce besoin.
    
    RÉPONSE UNIQUEMENT EN FORMAT JSON:
    {
      "id": <id_du_candidat>,
      "pourcentage": <nombre_entre_0_et_100>,
      "raison": "<explication courte (max 15 mots)>"
    }
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Tu es un expert en recrutement. Réponds UNIQUEMENT en JSON valide."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    
    // NETTOYER les backticks markdown si présents
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```')) {
      // Supprimer ```json et ``` autour du JSON
      cleanedResponse = cleanedResponse
        .replace(/^```(json)?\s*/i, '')  // Début avec ``` ou ```json
        .replace(/\s*```$/, '');         // Fin avec ```
    }
    
    // Parser la réponse
    let result;
    try {
      result = JSON.parse(cleanedResponse);
    } catch (error) {
      throw new Error('Réponse Groq invalide: ' + response);
    }

    // Trouver le candidat correspondant
    const candidat = candidats.find(c => c.id === result.id);
    if (!candidat) {
      throw new Error('Candidat ID non trouvé');
    }

    return {
      ...candidat.toJSON(),
      percent: result.pourcentage,
      raison: result.raison
    };
  }

  getProfilLabel(profil) {
    const labels = {
      0: 'Développeur',
      1: 'Data Scientist',
      2: 'DevOps',
      3: 'Chef de Projet',
      4: 'Designer'
    };
    return labels[profil] || 'Autre';
  }

  getStatutLabel(statut) {
    const labels = {
      0: 'Junior',
      1: 'Intermédiaire',
      2: 'Senior',
      3: 'Expert'
    };
    return labels[statut] || 'Non spécifié';
  }

  trouverMeilleurCandidatSimulation(besoin, candidats) {
    // Simulation simple: prendre le candidat avec le plus d'expérience
    const candidatTrie = candidats
      .map(c => ({
        ...c.toJSON(),
        percent: Math.floor(Math.random() * 20) + 70, // 70-90%
        raison: "Simulation basée sur l'expérience"
      }))
      .sort((a, b) => b.experience - a.experience);

    return candidatTrie[0] || null;
  }

  async sendInterviewEmail(candidatId) {
    const candidat = await this.candidatRepository.findById(candidatId);
    
    if (!candidat) {
      throw new Error('Candidat non trouvé');
    }

    // Si Gmail est configuré, envoyer un vrai email
    if (this.transporter && process.env.GMAIL_USER) {
      try {
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: candidat.email,
          subject: 'Invitation à un entretien',
          html: `
            <h2>Invitation à un entretien</h2>
            <p>Bonjour ${candidat.name},</p>
            <p>Nous sommes intéressés par votre profil et souhaiterions vous rencontrer.</p>
            <p><strong>Détails :</strong></p>
            <ul>
              <li>Proposition : ${candidat.proposition}</li>
              <li>Profil : ${this.getProfilLabel(candidat.profil)}</li>
              <li>Statut : ${this.getStatutLabel(candidat.statut)}</li>
              <li>Expérience : ${candidat.experience} ans</li>
            </ul>
            <p>Nous vous contacterons bientôt pour fixer une date.</p>
            <br>
            <p>Cordialement,<br>L'équipe de recrutement</p>
          `
        };

        await this.transporter.sendMail(mailOptions);
        
        return {
          success: true,
          message: `Email d'entretien envoyé à ${candidat.email}`,
          candidat: candidat.toJSON(),
          realEmail: true
        };
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        // Fallback à la simulation
        return {
          success: true,
          message: `Email d'entretien (simulé) envoyé à ${candidat.email}`,
          candidat: candidat.toJSON(),
          realEmail: false,
          error: emailError.message
        };
      }
    } else {
      // Simulation si Gmail non configuré
      return {
        success: true,
        message: `Email d'entretien (simulé) envoyé à ${candidat.email}`,
        candidat: candidat.toJSON(),
        realEmail: false
      };
    }
  }
}

module.exports = CandidatService;