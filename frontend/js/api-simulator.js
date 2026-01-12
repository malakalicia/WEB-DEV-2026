/**
 * SII Skills Connect - Simulateur d'API
 * Simule les appels API en attendant le backend
 */

// ========== DONNÉES SIMULÉES ==========
const SIMULATED_DATA = {
    users: [
        { id: 1, email: 'admin@sii.ma', password: 'admin123' },
        { id: 2, email: 'user@sii.ma', password: 'user123' }
    ],
    besoins: [
        { id: 1, poste: 'Développeur Full Stack', competences: ['React', 'Node.js', 'MongoDB'], niveau: 2, statut: 0 },
        { id: 2, poste: 'Data Scientist', competences: ['Python', 'TensorFlow', 'SQL'], niveau: 1, statut: 0 },
        { id: 3, poste: 'DevOps Engineer', competences: ['Docker', 'Kubernetes', 'AWS'], niveau: 0, statut: 1 },
        { id: 4, poste: 'Chef de Projet', competences: ['Agile', 'Scrum', 'Jira'], niveau: 1, statut: 0 },
        { id: 5, poste: 'Designer UI/UX', competences: ['Figma', 'Adobe XD', 'Sketch'], niveau: 2, statut: 0 }
    ],
    candidats: [
        { id: 1, proposition: 'Mission A', name: 'Mohamed El Alami', profil: 0, statut: 1, experience: 5, commentaire: 'Excellent profil', email: 'mohamed@email.com' },
        { id: 2, proposition: 'Mission B', name: 'Fatima Bennani', profil: 1, statut: 2, experience: 3, commentaire: 'Bonne communication', email: 'fatima@email.com' },
        { id: 3, proposition: 'Mission A', name: 'Ahmed Tazi', profil: 0, statut: 0, experience: 7, commentaire: 'Senior expérimenté', email: 'ahmed@email.com' },
        { id: 4, proposition: 'Mission C', name: 'Khadija Alaoui', profil: 2, statut: 1, experience: 2, commentaire: 'Junior motivée', email: 'khadija@email.com' },
        { id: 5, proposition: 'Mission B', name: 'Youssef Fassi', profil: 3, statut: 3, experience: 10, commentaire: 'Expert technique', email: 'youssef@email.com' }
    ],
    nextBesoinId: 6,
    nextCandidatId: 6
};

// Charger les données depuis localStorage si existantes
function loadSimulatedData() {
    const saved = localStorage.getItem('sii_simulated_data');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(SIMULATED_DATA, parsed);
    }
}

// Sauvegarder les données dans localStorage
function saveSimulatedData() {
    localStorage.setItem('sii_simulated_data', JSON.stringify(SIMULATED_DATA));
}

// Initialiser
loadSimulatedData();

// ========== LABELS ==========
const LABELS = {
    profils: ['Développeur', 'Data Scientist', 'DevOps', 'Chef de Projet', 'Designer'],
    statutsCandidats: ['Junior', 'Intermédiaire', 'Senior', 'Expert'],
    niveauxUrgence: ['Faible', 'Moyen', 'Urgent'],
    statutsBesoins: ['Ouvert', 'Clôturé']
};

// ========== SIMULATEUR API ==========
const API = {
    // Délai de simulation (ms)
    delay: 300,

    // Simuler un délai réseau
    async simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, this.delay));
    },

    // Vérifier le token
    verifyToken(token) {
        return token && token.startsWith('sii_token_');
    },

    // ========== AUTH ==========
    async login(mail, pass) {
        await this.simulateDelay();

        const user = SIMULATED_DATA.users.find(u => u.email === mail && u.password === pass);

        if (user) {
            const token = `sii_token_${user.id}_${Date.now()}`;
            return { login: true, token };
        }

        return { login: false, token: '' };
    },

    // ========== BESOINS ==========
    async getBesoins(token) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        return { besoins: [...SIMULATED_DATA.besoins] };
    },

    async addBesoin(token, besoin) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const newBesoin = {
            id: SIMULATED_DATA.nextBesoinId++,
            poste: besoin.poste,
            competences: besoin.competences || [],
            niveau: besoin.niveau,
            statut: besoin.statut
        };

        SIMULATED_DATA.besoins.unshift(newBesoin);
        saveSimulatedData();

        return { ...newBesoin };
    },

    async updateBesoin(token, besoin) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const index = SIMULATED_DATA.besoins.findIndex(b => b.id === besoin.id);
        if (index === -1) {
            return { result: false };
        }

        SIMULATED_DATA.besoins[index] = { ...besoin };
        saveSimulatedData();

        return { ...besoin };
    },

    async deleteBesoin(token, id) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const index = SIMULATED_DATA.besoins.findIndex(b => b.id === id);
        if (index === -1) {
            return { result: false };
        }

        SIMULATED_DATA.besoins.splice(index, 1);
        saveSimulatedData();

        return { result: true };
    },

    // ========== CANDIDATS ==========
    async getCandidats(token) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        return { candidats: [...SIMULATED_DATA.candidats] };
    },

    async addCandidat(token, candidat) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const newCandidat = {
            id: SIMULATED_DATA.nextCandidatId++,
            proposition: candidat.proposition,
            name: candidat.name,
            profil: candidat.profil,
            statut: candidat.statut,
            experience: candidat.experience,
            commentaire: candidat.commentaire,
            email: candidat.email
        };

        SIMULATED_DATA.candidats.unshift(newCandidat);
        saveSimulatedData();

        return { ...newCandidat };
    },

    async updateCandidat(token, candidat) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const index = SIMULATED_DATA.candidats.findIndex(c => c.id === candidat.id);
        if (index === -1) {
            return { result: false };
        }

        SIMULATED_DATA.candidats[index] = { ...candidat };
        saveSimulatedData();

        return { ...candidat };
    },

    async deleteCandidat(token, id) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const index = SIMULATED_DATA.candidats.findIndex(c => c.id === id);
        if (index === -1) {
            return { result: false };
        }

        SIMULATED_DATA.candidats.splice(index, 1);
        saveSimulatedData();

        return { result: true };
    },

    // ========== RECRUTEMENT INTELLIGENT ==========
    async getCandidatParBesoin(token, idBesoin) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const besoin = SIMULATED_DATA.besoins.find(b => b.id === parseInt(idBesoin));
        if (!besoin) {
            return { result: false };
        }

        // Simuler un algorithme de matching
        const candidats = SIMULATED_DATA.candidats.map(c => {
            // Calculer un pourcentage de compatibilité basé sur le profil et l'expérience
            let percent = Math.floor(Math.random() * 40) + 60; // Entre 60 et 100

            // Bonus si même catégorie de profil
            if (c.profil === besoin.niveau % LABELS.profils.length) {
                percent = Math.min(100, percent + 10);
            }

            // Bonus basé sur l'expérience
            if (c.experience >= 5) {
                percent = Math.min(100, percent + 5);
            }

            return { ...c, percent };
        });

        // Trier par pourcentage décroissant et retourner le meilleur
        candidats.sort((a, b) => b.percent - a.percent);

        return candidats[0] || { result: false };
    },

    async sendMail(token, idCandidat) {
        await this.simulateDelay();

        if (!this.verifyToken(token)) {
            return { result: false };
        }

        const candidat = SIMULATED_DATA.candidats.find(c => c.id === parseInt(idCandidat));
        if (!candidat) {
            return { result: false };
        }

        // Simuler l'envoi de mail
        console.log(`[SIMULATION] Mail envoyé à ${candidat.email} pour proposer un entretien`);

        return { result: true, message: `Email envoyé à ${candidat.email}` };
    }
};

// ========== HELPERS HTTP (pour le vrai backend plus tard) ==========
const HTTP = {
    baseURL: 'http://localhost:3000/api',
    useSimulation: true, // Mettre à false pour utiliser le vrai backend

    getToken() {
        return localStorage.getItem('sii_token');
    },

    setToken(token) {
        localStorage.setItem('sii_token', token);
    },

    removeToken() {
        localStorage.removeItem('sii_token');
    },

    async request(endpoint, options = {}) {
        const token = this.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers
            });

            return await response.json();
        } catch (error) {
            console.error('HTTP Error:', error);
            throw error;
        }
    },

    // ========== API METHODS ==========
    async login(mail, pass) {
        if (this.useSimulation) {
            return API.login(mail, pass);
        }
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ Mail: mail, pass })
        });
    },

    async getBesoins() {
        if (this.useSimulation) {
            return API.getBesoins(this.getToken());
        }
        return this.request('/besoins/get');
    },

    async addBesoin(besoin) {
        if (this.useSimulation) {
            return API.addBesoin(this.getToken(), besoin);
        }
        return this.request('/besoins/add', {
            method: 'POST',
            body: JSON.stringify(besoin)
        });
    },

    async updateBesoin(besoin) {
        if (this.useSimulation) {
            return API.updateBesoin(this.getToken(), besoin);
        }
        return this.request('/besoins/update', {
            method: 'PUT',
            body: JSON.stringify(besoin)
        });
    },

    async deleteBesoin(id) {
        if (this.useSimulation) {
            return API.deleteBesoin(this.getToken(), id);
        }
        return this.request(`/besoins/delete/${id}`, {
            method: 'DELETE'
        });
    },

    async getCandidats() {
        if (this.useSimulation) {
            return API.getCandidats(this.getToken());
        }
        return this.request('/candidats/get');
    },

    async addCandidat(candidat) {
        if (this.useSimulation) {
            return API.addCandidat(this.getToken(), candidat);
        }
        return this.request('/candidats/add', {
            method: 'POST',
            body: JSON.stringify(candidat)
        });
    },

    async updateCandidat(candidat) {
        if (this.useSimulation) {
            return API.updateCandidat(this.getToken(), candidat);
        }
        return this.request('/candidats/update', {
            method: 'PUT',
            body: JSON.stringify(candidat)
        });
    },

    async deleteCandidat(id) {
        if (this.useSimulation) {
            return API.deleteCandidat(this.getToken(), id);
        }
        return this.request(`/candidats/delete/${id}`, {
            method: 'DELETE'
        });
    },

    async getCandidatParBesoin(idBesoin) {
        if (this.useSimulation) {
            return API.getCandidatParBesoin(this.getToken(), idBesoin);
        }
        return this.request(`/candidats/par_besoin/${idBesoin}`);
    },

    async sendMail(idCandidat) {
        if (this.useSimulation) {
            return API.sendMail(this.getToken(), idCandidat);
        }
        return this.request(`/candidats/send_mail/${idCandidat}`, {
            method: 'POST'
        });
    }
};

// ========== AUTH HELPERS ==========
const Auth = {
    isLoggedIn() {
        return !!HTTP.getToken();
    },

    logout() {
        HTTP.removeToken();
        window.location.href = 'index.html';
    },

    checkAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};

// Export global
window.HTTP = HTTP;
window.Auth = Auth;
window.LABELS = LABELS;
window.API = API;
