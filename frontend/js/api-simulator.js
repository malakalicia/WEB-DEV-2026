/**
 * SmartHR - API Simulator
 * Simulates API calls while waiting for backend implementation
 *
 * @version 1.0.0
 * @author SmartHR Team
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    TOKEN_KEY: 'smarthr_token',
    DATA_KEY: 'smarthr_simulated_data',
    SIMULATION_DELAY: 300,
    USE_SIMULATION: true
};

const PASSWORD_RULES = {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// ============================================================================
// LABELS & CONSTANTS
// ============================================================================
const LABELS = {
    profils: ['Developpeur', 'Data Scientist', 'DevOps', 'Chef de Projet', 'Designer'],
    statutsCandidats: ['Junior', 'Intermediaire', 'Senior', 'Expert'],
    niveauxUrgence: ['Faible', 'Moyen', 'Urgent'],
    statutsBesoins: ['Ouvert', 'Cloture']
};

// ============================================================================
// SIMULATED DATA STORE
// ============================================================================
const DataStore = {
    data: {
        users: [
            { id: 1, email: 'admin@smarthr.ma', password: 'Admin@123' },
            { id: 2, email: 'user@smarthr.ma', password: 'User@123' }
        ],
        besoins: [
            { id: 1, poste: 'Developpeur Full Stack', competences: ['React', 'Node.js', 'MongoDB'], niveau: 2, statut: 0 },
            { id: 2, poste: 'Data Scientist', competences: ['Python', 'TensorFlow', 'SQL'], niveau: 1, statut: 0 },
            { id: 3, poste: 'DevOps Engineer', competences: ['Docker', 'Kubernetes', 'AWS'], niveau: 0, statut: 1 },
            { id: 4, poste: 'Chef de Projet', competences: ['Agile', 'Scrum', 'Jira'], niveau: 1, statut: 0 },
            { id: 5, poste: 'Designer UI/UX', competences: ['Figma', 'Adobe XD', 'Sketch'], niveau: 2, statut: 0 }
        ],
        candidats: [
            { id: 1, proposition: 'Mission A', name: 'Mohamed El Alami', profil: 0, statut: 1, experience: 5, commentaire: 'Excellent profil', email: 'mohamed@email.com' },
            { id: 2, proposition: 'Mission B', name: 'Fatima Bennani', profil: 1, statut: 2, experience: 3, commentaire: 'Bonne communication', email: 'fatima@email.com' },
            { id: 3, proposition: 'Mission A', name: 'Ahmed Tazi', profil: 0, statut: 0, experience: 7, commentaire: 'Senior experimente', email: 'ahmed@email.com' },
            { id: 4, proposition: 'Mission C', name: 'Khadija Alaoui', profil: 2, statut: 1, experience: 2, commentaire: 'Junior motivee', email: 'khadija@email.com' },
            { id: 5, proposition: 'Mission B', name: 'Youssef Fassi', profil: 3, statut: 3, experience: 10, commentaire: 'Expert technique', email: 'youssef@email.com' }
        ],
        nextBesoinId: 6,
        nextCandidatId: 6
    },

    load() {
        const saved = localStorage.getItem(CONFIG.DATA_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(this.data, parsed);
            } catch (error) {
                console.error('Error loading data from localStorage:', error);
            }
        }
    },

    save() {
        try {
            localStorage.setItem(CONFIG.DATA_KEY, JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    },

    getBesoins() {
        return [...this.data.besoins];
    },

    getCandidats() {
        return [...this.data.candidats];
    },

    findUserByCredentials(email, password) {
        return this.data.users.find(u => u.email === email && u.password === password);
    },

    findBesoinById(id) {
        return this.data.besoins.find(b => b.id === parseInt(id));
    },

    findCandidatById(id) {
        return this.data.candidats.find(c => c.id === parseInt(id));
    },

    addBesoin(besoin) {
        const newBesoin = {
            id: this.data.nextBesoinId++,
            ...besoin
        };
        this.data.besoins.unshift(newBesoin);
        this.save();
        return { ...newBesoin };
    },

    updateBesoin(besoin) {
        const index = this.data.besoins.findIndex(b => b.id === besoin.id);
        if (index === -1) return null;

        this.data.besoins[index] = { ...besoin };
        this.save();
        return { ...besoin };
    },

    deleteBesoin(id) {
        const index = this.data.besoins.findIndex(b => b.id === id);
        if (index === -1) return false;

        this.data.besoins.splice(index, 1);
        this.save();
        return true;
    },

    addCandidat(candidat) {
        const newCandidat = {
            id: this.data.nextCandidatId++,
            ...candidat
        };
        this.data.candidats.unshift(newCandidat);
        this.save();
        return { ...newCandidat };
    },

    updateCandidat(candidat) {
        const index = this.data.candidats.findIndex(c => c.id === candidat.id);
        if (index === -1) return null;

        this.data.candidats[index] = { ...candidat };
        this.save();
        return { ...candidat };
    },

    deleteCandidat(id) {
        const index = this.data.candidats.findIndex(c => c.id === id);
        if (index === -1) return false;

        this.data.candidats.splice(index, 1);
        this.save();
        return true;
    }
};

// Initialize data store
DataStore.load();

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================
const Validator = {
    /**
     * Validates password against security rules
     * @param {string} password - Password to validate
     * @returns {object} - { isValid: boolean, errors: string[] }
     */
    validatePassword(password) {
        const errors = [];

        if (!password || password.length < PASSWORD_RULES.MIN_LENGTH) {
            errors.push(`Le mot de passe doit contenir au moins ${PASSWORD_RULES.MIN_LENGTH} caracteres`);
        }

        if (PASSWORD_RULES.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
            errors.push('Le mot de passe doit contenir au moins une majuscule');
        }

        if (PASSWORD_RULES.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
            errors.push('Le mot de passe doit contenir au moins une minuscule');
        }

        if (PASSWORD_RULES.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
            errors.push('Le mot de passe doit contenir au moins un chiffre');
        }

        if (PASSWORD_RULES.REQUIRE_SPECIAL) {
            const specialRegex = new RegExp(`[${PASSWORD_RULES.SPECIAL_CHARS.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
            if (!specialRegex.test(password)) {
                errors.push('Le mot de passe doit contenir au moins un caractere special (!@#$%^&*...)');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Validates email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Escapes HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string}
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ============================================================================
// TOKEN UTILITIES
// ============================================================================
const TokenManager = {
    generate(userId) {
        return `smarthr_token_${userId}_${Date.now()}`;
    },

    isValid(token) {
        return token && token.startsWith('smarthr_token_');
    },

    get() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    set(token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
    },

    remove() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
    }
};

// ============================================================================
// API SIMULATOR
// ============================================================================
const API = {
    async simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, CONFIG.SIMULATION_DELAY));
    },

    createErrorResponse() {
        return { result: false };
    },

    // -------------------------------------------------------------------------
    // Authentication
    // -------------------------------------------------------------------------

    /**
     * POST /api/users/login
     * @param {string} mail - User email
     * @param {string} pass - User password
     * @returns {Promise<{login: boolean, token: string}>}
     */
    async login(mail, pass) {
        await this.simulateDelay();

        const user = DataStore.findUserByCredentials(mail, pass);

        if (user) {
            return {
                login: true,
                token: TokenManager.generate(user.id)
            };
        }

        return { login: false, token: '' };
    },

    // -------------------------------------------------------------------------
    // Besoins CRUD
    // -------------------------------------------------------------------------

    /**
     * GET /api/besoins/get
     */
    async getBesoins(token) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        return { besoins: DataStore.getBesoins() };
    },

    /**
     * POST /api/besoins/add
     */
    async addBesoin(token, besoin) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        return DataStore.addBesoin({
            poste: besoin.poste,
            competences: besoin.competences || [],
            niveau: besoin.niveau,
            statut: besoin.statut
        });
    },

    /**
     * PUT /api/besoins/update
     */
    async updateBesoin(token, besoin) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        const result = DataStore.updateBesoin(besoin);
        return result || this.createErrorResponse();
    },

    /**
     * DELETE /api/besoins/delete/:id
     */
    async deleteBesoin(token, id) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        return { result: DataStore.deleteBesoin(id) };
    },

    // -------------------------------------------------------------------------
    // Candidats CRUD
    // -------------------------------------------------------------------------

    /**
     * GET /api/candidats/get
     */
    async getCandidats(token) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        return { candidats: DataStore.getCandidats() };
    },

    /**
     * POST /api/candidats/add
     */
    async addCandidat(token, candidat) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        return DataStore.addCandidat({
            proposition: candidat.proposition,
            name: candidat.name,
            profil: candidat.profil,
            statut: candidat.statut,
            experience: candidat.experience,
            commentaire: candidat.commentaire,
            email: candidat.email
        });
    },

    /**
     * PUT /api/candidats/update
     */
    async updateCandidat(token, candidat) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        const result = DataStore.updateCandidat(candidat);
        return result || this.createErrorResponse();
    },

    /**
     * DELETE /api/candidats/delete/:id
     */
    async deleteCandidat(token, id) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        return { result: DataStore.deleteCandidat(id) };
    },

    // -------------------------------------------------------------------------
    // Recrutement Intelligent
    // -------------------------------------------------------------------------

    /**
     * GET /api/candidats/par_besoin/:id_besoin
     */
    async getCandidatParBesoin(token, idBesoin) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        const besoin = DataStore.findBesoinById(idBesoin);
        if (!besoin) {
            return this.createErrorResponse();
        }

        const candidats = DataStore.getCandidats().map(candidat => {
            const percent = this.calculateMatchPercentage(candidat, besoin);
            return { ...candidat, percent };
        });

        candidats.sort((a, b) => b.percent - a.percent);

        return candidats[0] || this.createErrorResponse();
    },

    /**
     * POST /api/candidats/send_mail/:id_candidat
     */
    async sendMail(token, idCandidat) {
        await this.simulateDelay();

        if (!TokenManager.isValid(token)) {
            return this.createErrorResponse();
        }

        const candidat = DataStore.findCandidatById(idCandidat);
        if (!candidat) {
            return this.createErrorResponse();
        }

        console.log(`[SIMULATION] Email sent to ${candidat.email} for interview proposal`);

        return {
            result: true,
            message: `Email envoye a ${candidat.email}`
        };
    },

    /**
     * Calculate match percentage between candidate and job requirement
     */
    calculateMatchPercentage(candidat, besoin) {
        let percent = Math.floor(Math.random() * 40) + 60;

        if (candidat.profil === besoin.niveau % LABELS.profils.length) {
            percent = Math.min(100, percent + 10);
        }

        if (candidat.experience >= 5) {
            percent = Math.min(100, percent + 5);
        }

        return percent;
    }
};

// ============================================================================
// HTTP CLIENT (for real backend integration)
// ============================================================================
const HTTP = {
    async request(endpoint, options = {}) {
        const token = TokenManager.get();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });
            return await response.json();
        } catch (error) {
            console.error('HTTP Error:', error);
            throw error;
        }
    },

    getToken: () => TokenManager.get(),
    setToken: (token) => TokenManager.set(token),
    removeToken: () => TokenManager.remove(),

    // API Methods
    async login(mail, pass) {
        if (CONFIG.USE_SIMULATION) {
            return API.login(mail, pass);
        }
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ Mail: mail, pass: pass })
        });
    },

    async getBesoins() {
        if (CONFIG.USE_SIMULATION) {
            return API.getBesoins(TokenManager.get());
        }
        return this.request('/besoins/get');
    },

    async addBesoin(besoin) {
        if (CONFIG.USE_SIMULATION) {
            return API.addBesoin(TokenManager.get(), besoin);
        }
        return this.request('/besoins/add', {
            method: 'POST',
            body: JSON.stringify(besoin)
        });
    },

    async updateBesoin(besoin) {
        if (CONFIG.USE_SIMULATION) {
            return API.updateBesoin(TokenManager.get(), besoin);
        }
        return this.request('/besoins/update', {
            method: 'PUT',
            body: JSON.stringify(besoin)
        });
    },

    async deleteBesoin(id) {
        if (CONFIG.USE_SIMULATION) {
            return API.deleteBesoin(TokenManager.get(), id);
        }
        return this.request(`/besoins/delete/${id}`, { method: 'DELETE' });
    },

    async getCandidats() {
        if (CONFIG.USE_SIMULATION) {
            return API.getCandidats(TokenManager.get());
        }
        return this.request('/candidats/get');
    },

    async addCandidat(candidat) {
        if (CONFIG.USE_SIMULATION) {
            return API.addCandidat(TokenManager.get(), candidat);
        }
        return this.request('/candidats/add', {
            method: 'POST',
            body: JSON.stringify(candidat)
        });
    },

    async updateCandidat(candidat) {
        if (CONFIG.USE_SIMULATION) {
            return API.updateCandidat(TokenManager.get(), candidat);
        }
        return this.request('/candidats/update', {
            method: 'PUT',
            body: JSON.stringify(candidat)
        });
    },

    async deleteCandidat(id) {
        if (CONFIG.USE_SIMULATION) {
            return API.deleteCandidat(TokenManager.get(), id);
        }
        return this.request(`/candidats/delete/${id}`, { method: 'DELETE' });
    },

    async getCandidatParBesoin(idBesoin) {
        if (CONFIG.USE_SIMULATION) {
            return API.getCandidatParBesoin(TokenManager.get(), idBesoin);
        }
        return this.request(`/candidats/par_besoin/${idBesoin}`);
    },

    async sendMail(idCandidat) {
        if (CONFIG.USE_SIMULATION) {
            return API.sendMail(TokenManager.get(), idCandidat);
        }
        return this.request(`/candidats/send_mail/${idCandidat}`, { method: 'POST' });
    }
};

// ============================================================================
// AUTH HELPER
// ============================================================================
const Auth = {
    isLoggedIn() {
        return TokenManager.isValid(TokenManager.get());
    },

    logout() {
        TokenManager.remove();
        this.redirectToLogin();
    },

    checkAuth() {
        if (!this.isLoggedIn()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    },

    redirectToLogin() {
        const currentPath = window.location.pathname;
        const loginPath = currentPath.includes('/pages/') ? '../index.html' : 'index.html';
        window.location.href = loginPath;
    }
};

// ============================================================================
// EXPORTS
// ============================================================================
window.CONFIG = CONFIG;
window.LABELS = LABELS;
window.PASSWORD_RULES = PASSWORD_RULES;
window.Validator = Validator;
window.TokenManager = TokenManager;
window.DataStore = DataStore;
window.API = API;
window.HTTP = HTTP;
window.Auth = Auth;
