/**
 * SII Skills Connect - Serveur Backend
 * @description Serveur Express simple avec API REST
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Charger les données
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

function loadData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur chargement données:', error);
        return { candidats: [], besoins: [], recommandations: [], users: [] };
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde données:', error);
        return false;
    }
}

// ========== ROUTES AUTH ==========

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email et mot de passe requis' 
        });
    }
    
    // Authentification simple (accepte tout pour démo)
    const user = {
        id: 1,
        email: email,
        nom: 'Utilisateur Test',
        role: 'admin',
        token: `token_${Date.now()}`
    };
    
    res.json({ 
        success: true, 
        data: user,
        message: 'Connexion réussie' 
    });
});

// ========== ROUTES CANDIDATS ==========

app.get('/api/candidats', (req, res) => {
    const data = loadData();
    const { search, statut, ville, page = 1, limit = 10 } = req.query;
    
    let candidats = data.candidats;
    
    // Filtres
    if (search) {
        const terme = search.toLowerCase();
        candidats = candidats.filter(c => 
            c.nom.toLowerCase().includes(terme) ||
            c.profil.toLowerCase().includes(terme) ||
            c.competences.some(comp => comp.toLowerCase().includes(terme))
        );
    }
    
    if (statut) {
        candidats = candidats.filter(c => c.statut === statut);
    }
    
    if (ville) {
        candidats = candidats.filter(c => c.ville === ville);
    }
    
    // Pagination
    const total = candidats.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const results = candidats.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: results,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});

app.get('/api/candidats/:id', (req, res) => {
    const data = loadData();
    const candidat = data.candidats.find(c => c.id === req.params.id);
    
    if (!candidat) {
        return res.status(404).json({ 
            success: false, 
            message: 'Candidat non trouvé' 
        });
    }
    
    res.json({ success: true, data: candidat });
});

app.post('/api/candidats', (req, res) => {
    const data = loadData();
    const newCandidat = {
        id: `C${String(data.candidats.length + 1).padStart(3, '0')}`,
        ...req.body,
        dateCreation: new Date().toISOString()
    };
    
    data.candidats.push(newCandidat);
    
    if (saveData(data)) {
        res.status(201).json({ 
            success: true, 
            data: newCandidat,
            message: 'Candidat créé avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la création' 
        });
    }
});

app.put('/api/candidats/:id', (req, res) => {
    const data = loadData();
    const index = data.candidats.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Candidat non trouvé' 
        });
    }
    
    data.candidats[index] = {
        ...data.candidats[index],
        ...req.body,
        dateModification: new Date().toISOString()
    };
    
    if (saveData(data)) {
        res.json({ 
            success: true, 
            data: data.candidats[index],
            message: 'Candidat modifié avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la modification' 
        });
    }
});

app.delete('/api/candidats/:id', (req, res) => {
    const data = loadData();
    const index = data.candidats.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Candidat non trouvé' 
        });
    }
    
    data.candidats.splice(index, 1);
    
    if (saveData(data)) {
        res.json({ 
            success: true, 
            message: 'Candidat supprimé avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la suppression' 
        });
    }
});

// ========== ROUTES BESOINS ==========

app.get('/api/besoins', (req, res) => {
    const data = loadData();
    const { search, statut, ville, page = 1, limit = 10 } = req.query;
    
    let besoins = data.besoins;
    
    if (search) {
        const terme = search.toLowerCase();
        besoins = besoins.filter(b => 
            b.poste.toLowerCase().includes(terme) ||
            b.competences.some(comp => comp.toLowerCase().includes(terme))
        );
    }
    
    if (statut) {
        besoins = besoins.filter(b => b.statut === statut);
    }
    
    if (ville) {
        besoins = besoins.filter(b => b.ville === ville);
    }
    
    const total = besoins.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const results = besoins.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: results,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
});

app.get('/api/besoins/:id', (req, res) => {
    const data = loadData();
    const besoin = data.besoins.find(b => b.id === req.params.id);
    
    if (!besoin) {
        return res.status(404).json({ 
            success: false, 
            message: 'Besoin non trouvé' 
        });
    }
    
    res.json({ success: true, data: besoin });
});

app.post('/api/besoins', (req, res) => {
    const data = loadData();
    const newBesoin = {
        id: `B${String(data.besoins.length + 1).padStart(3, '0')}`,
        ...req.body,
        dateCreation: new Date().toISOString()
    };
    
    data.besoins.push(newBesoin);
    
    if (saveData(data)) {
        res.status(201).json({ 
            success: true, 
            data: newBesoin,
            message: 'Besoin créé avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la création' 
        });
    }
});

app.put('/api/besoins/:id', (req, res) => {
    const data = loadData();
    const index = data.besoins.findIndex(b => b.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Besoin non trouvé' 
        });
    }
    
    data.besoins[index] = {
        ...data.besoins[index],
        ...req.body,
        dateModification: new Date().toISOString()
    };
    
    if (saveData(data)) {
        res.json({ 
            success: true, 
            data: data.besoins[index],
            message: 'Besoin modifié avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la modification' 
        });
    }
});

app.delete('/api/besoins/:id', (req, res) => {
    const data = loadData();
    const index = data.besoins.findIndex(b => b.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Besoin non trouvé' 
        });
    }
    
    data.besoins.splice(index, 1);
    
    if (saveData(data)) {
        res.json({ 
            success: true, 
            message: 'Besoin supprimé avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la suppression' 
        });
    }
});

// ========== ROUTES MATCHING ==========

app.post('/api/matching/:besoinId', (req, res) => {
    const data = loadData();
    const besoin = data.besoins.find(b => b.id === req.params.besoinId);
    
    if (!besoin) {
        return res.status(404).json({ 
            success: false, 
            message: 'Besoin non trouvé' 
        });
    }
    
    // Algorithme de matching simple
    const candidatsDisponibles = data.candidats.filter(c => c.statut === 'Disponible');
    
    const matchings = candidatsDisponibles.map(candidat => {
        const compCandidatSet = new Set(candidat.competences.map(c => c.toLowerCase()));
        const compBesoinSet = new Set(besoin.competences.map(c => c.toLowerCase()));
        
        let matches = 0;
        compBesoinSet.forEach(comp => {
            if (compCandidatSet.has(comp)) matches++;
        });
        
        const score = Math.round((matches / compBesoinSet.size) * 100);
        
        return {
            candidat,
            besoin,
            score
        };
    }).filter(m => m.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    res.json({ 
        success: true, 
        data: matchings 
    });
});

// ========== ROUTES RECOMMANDATIONS ==========

app.get('/api/recommandations', (req, res) => {
    const data = loadData();
    res.json({ 
        success: true, 
        data: data.recommandations 
    });
});

app.post('/api/recommandations', (req, res) => {
    const data = loadData();
    const newRecommandation = {
        id: `R${String(data.recommandations.length + 1).padStart(3, '0')}`,
        ...req.body,
        dateAjout: new Date().toISOString(),
        statut: 'En attente'
    };
    
    data.recommandations.push(newRecommandation);
    
    if (saveData(data)) {
        res.status(201).json({ 
            success: true, 
            data: newRecommandation,
            message: 'Recommandation ajoutée avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'ajout' 
        });
    }
});

app.delete('/api/recommandations/:id', (req, res) => {
    const data = loadData();
    const index = data.recommandations.findIndex(r => r.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Recommandation non trouvée' 
        });
    }
    
    data.recommandations.splice(index, 1);
    
    if (saveData(data)) {
        res.json({ 
            success: true, 
            message: 'Recommandation supprimée avec succès' 
        });
    } else {
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la suppression' 
        });
    }
});

// Route 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route non trouvée' 
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║   SII Skills Connect - Backend Server        ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
    console.log('');
    console.log('Routes disponibles:');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/candidats');
    console.log('  POST   /api/candidats');
    console.log('  GET    /api/besoins');
    console.log('  POST   /api/besoins');
    console.log('  POST   /api/matching/:besoinId');
    console.log('  GET    /api/recommandations');
    console.log('');
    console.log('Appuyez sur Ctrl+C pour arrêter');
    console.log('════════════════════════════════════════════════');
});
