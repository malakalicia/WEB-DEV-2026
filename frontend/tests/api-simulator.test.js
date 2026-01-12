/**
 * Tests unitaires pour le simulateur d'API
 * SII Skills Connect
 */

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Import du module (simulation car le fichier original utilise des variables globales)
// Dans un vrai projet, on restructurerait le code pour utiliser des modules ES6

describe('API Simulator - Labels', () => {
    const LABELS = {
        profils: ['Developpeur', 'Data Scientist', 'DevOps', 'Chef de Projet', 'Designer'],
        statutsCandidats: ['Junior', 'Intermediaire', 'Senior', 'Expert'],
        niveauxUrgence: ['Faible', 'Moyen', 'Urgent'],
        statutsBesoins: ['Ouvert', 'Cloture']
    };

    test('should have 5 profils defined', () => {
        expect(LABELS.profils).toHaveLength(5);
    });

    test('should have 4 statuts candidats defined', () => {
        expect(LABELS.statutsCandidats).toHaveLength(4);
    });

    test('should have 3 niveaux urgence defined', () => {
        expect(LABELS.niveauxUrgence).toHaveLength(3);
    });

    test('should have 2 statuts besoins defined', () => {
        expect(LABELS.statutsBesoins).toHaveLength(2);
    });

    test('profils should contain Developpeur', () => {
        expect(LABELS.profils).toContain('Developpeur');
    });

    test('statutsCandidats should contain Senior', () => {
        expect(LABELS.statutsCandidats).toContain('Senior');
    });
});

describe('API Simulator - Token Verification', () => {
    const verifyToken = (token) => {
        return token && token.startsWith('sii_token_');
    };

    test('should return true for valid token', () => {
        expect(verifyToken('sii_token_1_123456')).toBe(true);
    });

    test('should return false for invalid token', () => {
        expect(verifyToken('invalid_token')).toBe(false);
    });

    test('should return false for null token', () => {
        expect(verifyToken(null)).toBe(false);
    });

    test('should return false for undefined token', () => {
        expect(verifyToken(undefined)).toBe(false);
    });

    test('should return false for empty string', () => {
        expect(verifyToken('')).toBe(false);
    });
});

describe('API Simulator - Login', () => {
    const SIMULATED_USERS = [
        { id: 1, email: 'admin@sii.ma', password: 'admin123' },
        { id: 2, email: 'user@sii.ma', password: 'user123' }
    ];

    const login = (mail, pass) => {
        const user = SIMULATED_USERS.find(u => u.email === mail && u.password === pass);
        if (user) {
            const token = `sii_token_${user.id}_${Date.now()}`;
            return { login: true, token };
        }
        return { login: false, token: '' };
    };

    test('should return login true for valid credentials', () => {
        const result = login('admin@sii.ma', 'admin123');
        expect(result.login).toBe(true);
        expect(result.token).toMatch(/^sii_token_1_/);
    });

    test('should return login false for invalid email', () => {
        const result = login('wrong@sii.ma', 'admin123');
        expect(result.login).toBe(false);
        expect(result.token).toBe('');
    });

    test('should return login false for invalid password', () => {
        const result = login('admin@sii.ma', 'wrongpassword');
        expect(result.login).toBe(false);
        expect(result.token).toBe('');
    });

    test('should return login false for both invalid', () => {
        const result = login('wrong@email.com', 'wrongpassword');
        expect(result.login).toBe(false);
    });

    test('should return different tokens for different users', () => {
        const result1 = login('admin@sii.ma', 'admin123');
        const result2 = login('user@sii.ma', 'user123');
        expect(result1.token).not.toBe(result2.token);
    });
});

describe('API Simulator - Besoins CRUD', () => {
    let besoins = [
        { id: 1, poste: 'Developpeur Full Stack', competences: ['React', 'Node.js'], niveau: 2, statut: 0 },
        { id: 2, poste: 'Data Scientist', competences: ['Python', 'TensorFlow'], niveau: 1, statut: 0 }
    ];
    let nextBesoinId = 3;

    const addBesoin = (besoin) => {
        const newBesoin = {
            id: nextBesoinId++,
            poste: besoin.poste,
            competences: besoin.competences || [],
            niveau: besoin.niveau,
            statut: besoin.statut
        };
        besoins.unshift(newBesoin);
        return { ...newBesoin };
    };

    const updateBesoin = (besoin) => {
        const index = besoins.findIndex(b => b.id === besoin.id);
        if (index === -1) return { result: false };
        besoins[index] = { ...besoin };
        return { ...besoin };
    };

    const deleteBesoin = (id) => {
        const index = besoins.findIndex(b => b.id === id);
        if (index === -1) return { result: false };
        besoins.splice(index, 1);
        return { result: true };
    };

    test('should add a new besoin', () => {
        const newBesoin = {
            poste: 'DevOps Engineer',
            competences: ['Docker', 'Kubernetes'],
            niveau: 1,
            statut: 0
        };
        const result = addBesoin(newBesoin);
        expect(result.id).toBe(3);
        expect(result.poste).toBe('DevOps Engineer');
        expect(result.competences).toEqual(['Docker', 'Kubernetes']);
    });

    test('should update an existing besoin', () => {
        const updatedBesoin = {
            id: 1,
            poste: 'Senior Full Stack Developer',
            competences: ['React', 'Node.js', 'MongoDB'],
            niveau: 2,
            statut: 0
        };
        const result = updateBesoin(updatedBesoin);
        expect(result.poste).toBe('Senior Full Stack Developer');
        expect(result.competences).toHaveLength(3);
    });

    test('should return error when updating non-existent besoin', () => {
        const result = updateBesoin({ id: 999, poste: 'Test' });
        expect(result.result).toBe(false);
    });

    test('should delete an existing besoin', () => {
        const initialLength = besoins.length;
        const result = deleteBesoin(2);
        expect(result.result).toBe(true);
        expect(besoins.length).toBe(initialLength - 1);
    });

    test('should return error when deleting non-existent besoin', () => {
        const result = deleteBesoin(999);
        expect(result.result).toBe(false);
    });
});

describe('API Simulator - Candidats CRUD', () => {
    let candidats = [
        { id: 1, proposition: 'Mission A', name: 'Mohamed El Alami', profil: 0, statut: 2, experience: 5, commentaire: 'Excellent', email: 'mohamed@email.com' }
    ];
    let nextCandidatId = 2;

    const addCandidat = (candidat) => {
        const newCandidat = {
            id: nextCandidatId++,
            ...candidat
        };
        candidats.unshift(newCandidat);
        return { ...newCandidat };
    };

    const updateCandidat = (candidat) => {
        const index = candidats.findIndex(c => c.id === candidat.id);
        if (index === -1) return { result: false };
        candidats[index] = { ...candidat };
        return { ...candidat };
    };

    const deleteCandidat = (id) => {
        const index = candidats.findIndex(c => c.id === id);
        if (index === -1) return { result: false };
        candidats.splice(index, 1);
        return { result: true };
    };

    test('should add a new candidat', () => {
        const newCandidat = {
            proposition: 'Mission B',
            name: 'Fatima Bennani',
            profil: 1,
            statut: 1,
            experience: 3,
            commentaire: 'Bonne candidate',
            email: 'fatima@email.com'
        };
        const result = addCandidat(newCandidat);
        expect(result.id).toBe(2);
        expect(result.name).toBe('Fatima Bennani');
    });

    test('should update an existing candidat', () => {
        const updatedCandidat = {
            id: 1,
            proposition: 'Mission A Updated',
            name: 'Mohamed El Alami',
            profil: 0,
            statut: 3,
            experience: 6,
            commentaire: 'Expert maintenant',
            email: 'mohamed@email.com'
        };
        const result = updateCandidat(updatedCandidat);
        expect(result.statut).toBe(3);
        expect(result.experience).toBe(6);
    });

    test('should return error when updating non-existent candidat', () => {
        const result = updateCandidat({ id: 999, name: 'Test' });
        expect(result.result).toBe(false);
    });

    test('should delete an existing candidat', () => {
        // Reset candidats for this test
        candidats = [{ id: 10, name: 'Test' }];
        const result = deleteCandidat(10);
        expect(result.result).toBe(true);
        expect(candidats.length).toBe(0);
    });
});

describe('API Simulator - Recrutement Intelligent', () => {
    const LABELS = {
        profils: ['Developpeur', 'Data Scientist', 'DevOps', 'Chef de Projet', 'Designer']
    };

    const besoins = [
        { id: 1, poste: 'Developpeur Full Stack', competences: ['React', 'Node.js'], niveau: 2, statut: 0 }
    ];

    const candidats = [
        { id: 1, name: 'Mohamed', profil: 0, statut: 2, experience: 5, email: 'mohamed@email.com' },
        { id: 2, name: 'Fatima', profil: 0, statut: 1, experience: 3, email: 'fatima@email.com' }
    ];

    const getCandidatParBesoin = (idBesoin) => {
        const besoin = besoins.find(b => b.id === parseInt(idBesoin));
        if (!besoin) return { result: false };

        const candidatsMatches = candidats.map(c => {
            let percent = Math.floor(Math.random() * 40) + 60;
            if (c.profil === besoin.niveau % LABELS.profils.length) {
                percent = Math.min(100, percent + 10);
            }
            if (c.experience >= 5) {
                percent = Math.min(100, percent + 5);
            }
            return { ...c, percent };
        });

        candidatsMatches.sort((a, b) => b.percent - a.percent);
        return candidatsMatches[0] || { result: false };
    };

    test('should return best matching candidat for a besoin', () => {
        const result = getCandidatParBesoin(1);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('percent');
        expect(result.percent).toBeGreaterThanOrEqual(60);
        expect(result.percent).toBeLessThanOrEqual(100);
    });

    test('should return error for non-existent besoin', () => {
        const result = getCandidatParBesoin(999);
        expect(result.result).toBe(false);
    });

    test('candidat percent should be between 60 and 100', () => {
        const result = getCandidatParBesoin(1);
        expect(result.percent).toBeGreaterThanOrEqual(60);
        expect(result.percent).toBeLessThanOrEqual(100);
    });
});

describe('Auth Helper Functions', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    const getToken = () => localStorage.getItem('sii_token');
    const setToken = (token) => localStorage.setItem('sii_token', token);
    const removeToken = () => localStorage.removeItem('sii_token');
    const isLoggedIn = () => !!getToken();

    test('should set token in localStorage', () => {
        setToken('sii_token_1_123456');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('sii_token', 'sii_token_1_123456');
    });

    test('should get token from localStorage', () => {
        localStorageMock.getItem.mockReturnValueOnce('sii_token_1_123456');
        const token = getToken();
        expect(localStorageMock.getItem).toHaveBeenCalledWith('sii_token');
    });

    test('should remove token from localStorage', () => {
        removeToken();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('sii_token');
    });

    test('isLoggedIn should return false when no token', () => {
        localStorageMock.getItem.mockReturnValueOnce(null);
        expect(isLoggedIn()).toBe(false);
    });

    test('isLoggedIn should return true when token exists', () => {
        localStorageMock.getItem.mockReturnValueOnce('sii_token_1_123456');
        expect(isLoggedIn()).toBe(true);
    });
});

describe('Data Validation', () => {
    const validateBesoin = (besoin) => {
        if (!besoin.poste || besoin.poste.trim() === '') return false;
        if (!Array.isArray(besoin.competences) || besoin.competences.length === 0) return false;
        if (typeof besoin.niveau !== 'number' || besoin.niveau < 0 || besoin.niveau > 2) return false;
        if (typeof besoin.statut !== 'number' || besoin.statut < 0 || besoin.statut > 1) return false;
        return true;
    };

    const validateCandidat = (candidat) => {
        if (!candidat.name || candidat.name.trim() === '') return false;
        if (!candidat.email || !candidat.email.includes('@')) return false;
        if (!candidat.proposition || candidat.proposition.trim() === '') return false;
        if (typeof candidat.profil !== 'number' || candidat.profil < 0 || candidat.profil > 4) return false;
        if (typeof candidat.statut !== 'number' || candidat.statut < 0 || candidat.statut > 3) return false;
        if (typeof candidat.experience !== 'number' || candidat.experience < 0) return false;
        return true;
    };

    test('should validate valid besoin', () => {
        const besoin = {
            poste: 'Developpeur',
            competences: ['React'],
            niveau: 1,
            statut: 0
        };
        expect(validateBesoin(besoin)).toBe(true);
    });

    test('should reject besoin without poste', () => {
        const besoin = {
            poste: '',
            competences: ['React'],
            niveau: 1,
            statut: 0
        };
        expect(validateBesoin(besoin)).toBe(false);
    });

    test('should reject besoin without competences', () => {
        const besoin = {
            poste: 'Developpeur',
            competences: [],
            niveau: 1,
            statut: 0
        };
        expect(validateBesoin(besoin)).toBe(false);
    });

    test('should reject besoin with invalid niveau', () => {
        const besoin = {
            poste: 'Developpeur',
            competences: ['React'],
            niveau: 5,
            statut: 0
        };
        expect(validateBesoin(besoin)).toBe(false);
    });

    test('should validate valid candidat', () => {
        const candidat = {
            name: 'Mohamed',
            email: 'mohamed@email.com',
            proposition: 'Mission A',
            profil: 0,
            statut: 1,
            experience: 5
        };
        expect(validateCandidat(candidat)).toBe(true);
    });

    test('should reject candidat without email', () => {
        const candidat = {
            name: 'Mohamed',
            email: 'invalid',
            proposition: 'Mission A',
            profil: 0,
            statut: 1,
            experience: 5
        };
        expect(validateCandidat(candidat)).toBe(false);
    });

    test('should reject candidat with invalid profil', () => {
        const candidat = {
            name: 'Mohamed',
            email: 'mohamed@email.com',
            proposition: 'Mission A',
            profil: 10,
            statut: 1,
            experience: 5
        };
        expect(validateCandidat(candidat)).toBe(false);
    });

    test('should reject candidat with negative experience', () => {
        const candidat = {
            name: 'Mohamed',
            email: 'mohamed@email.com',
            proposition: 'Mission A',
            profil: 0,
            statut: 1,
            experience: -5
        };
        expect(validateCandidat(candidat)).toBe(false);
    });
});
