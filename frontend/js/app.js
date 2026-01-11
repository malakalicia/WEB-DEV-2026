/**
 * SII Skills Connect - Fichier JavaScript Principal
 * Contient les données et fonctions communes
 */

// ========== DONNÉES MAROC ==========
const DATA_MAROC = {
    // Villes marocaines
    villes: [
        'Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès',
        'Agadir', 'Meknès', 'Salé', 'Tétouan', 'Oujda',
        'Kenitra', 'Mohammedia', 'El Jadida', 'Béni Mellal'
    ],
    
    // Prénoms marocains
    prenoms: {
        hommes: ['Mohamed', 'Ahmed', 'Omar', 'Youssef', 'Hassan', 'Karim', 
                 'Mehdi', 'Rachid', 'Amine', 'Hamza', 'Ismail', 'Samir'],
        femmes: ['Fatima', 'Khadija', 'Salma', 'Amina', 'Nadia', 'Laila',
                 'Zineb', 'Sanaa', 'Imane', 'Meriem', 'Hayat', 'Siham']
    },
    
    // Noms de famille marocains
    noms: ['El Alami', 'Bennani', 'Alaoui', 'Tazi', 'Fassi', 'Cherkaoui',
           'El Idrissi', 'Berrada', 'Benjelloun', 'El Amrani', 'Sqalli',
           'Bennis', 'El Guerrouj', 'Tahiri', 'Bouhali'],
    
    // Postes / Profils
    profils: [
        'Développeur Full Stack',
        'Développeur Frontend',
        'Développeur Backend',
        'Data Scientist',
        'DevOps Engineer',
        'Chef de Projet Agile',
        'Architecte Solution',
        'Designer UI/UX',
        'Business Analyst',
        'Product Owner',
        'Consultant Technique',
        'Ingénieur Cloud'
    ],
    
    // Compétences techniques
    competences: {
        frontend: ['React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS', 'Bootstrap'],
        backend: ['Node.js', 'Java', 'Python', 'PHP', '.NET', 'Spring Boot', 'Django', 'Express.js'],
        database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 'Redis', 'Elasticsearch'],
        devops: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'AWS', 'Azure', 'Terraform'],
        data: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'SQL', 'Power BI', 'Tableau'],
        design: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision'],
        autres: ['Git', 'Jira', 'Scrum', 'Agile', 'REST API', 'GraphQL', 'Microservices']
    },
    
    // Types de contrat
    typesContrat: ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance', 'Mission'],
    
    // Niveaux d'expérience
    niveauxExperience: ['Junior (0-2 ans)', 'Intermédiaire (3-5 ans)', 'Senior (6-10 ans)', 'Expert (10+ ans)'],
    
    // Statuts
    statuts: ['Disponible', 'En mission', 'En préavis', 'Non disponible'],
    
    // Départements SII
    departements: [
        'Software Engineering',
        'AI & Analytics',
        'Cloud & Infrastructure',
        'Cybersécurité',
        'Product Design',
        'Business Consulting',
        'Quality Assurance'
    ]
};

// ========== GÉNÉRATION DE DONNÉES ==========

/**
 * Génère un nom complet marocain aléatoire
 */
function genererNomComplet(genre = null) {
    const g = genre || (Math.random() > 0.5 ? 'homme' : 'femme');
    const prenomsList = g === 'homme' ? DATA_MAROC.prenoms.hommes : DATA_MAROC.prenoms.femmes;
    const prenom = prenomsList[Math.floor(Math.random() * prenomsList.length)];
    const nom = DATA_MAROC.noms[Math.floor(Math.random() * DATA_MAROC.noms.length)];
    return `${prenom} ${nom}`;
}

/**
 * Génère des compétences aléatoires selon le profil
 */
function genererCompetences(profil, nombre = 4) {
    let pool = [];
    
    if (profil.includes('Frontend') || profil.includes('Full Stack')) {
        pool = [...DATA_MAROC.competences.frontend];
    } else if (profil.includes('Backend') || profil.includes('Full Stack')) {
        pool = [...DATA_MAROC.competences.backend];
    } else if (profil.includes('Data')) {
        pool = [...DATA_MAROC.competences.data];
    } else if (profil.includes('DevOps')) {
        pool = [...DATA_MAROC.competences.devops];
    } else if (profil.includes('Designer') || profil.includes('UI/UX')) {
        pool = [...DATA_MAROC.competences.design];
    } else {
        pool = [
            ...DATA_MAROC.competences.frontend,
            ...DATA_MAROC.competences.backend,
            ...DATA_MAROC.competences.autres
        ];
    }
    
    // Mélanger et prendre 'nombre' compétences
    return pool.sort(() => 0.5 - Math.random()).slice(0, nombre);
}

/**
 * Génère un candidat aléatoire
 */
function genererCandidat(id) {
    const profil = DATA_MAROC.profils[Math.floor(Math.random() * DATA_MAROC.profils.length)];
    const competences = genererCompetences(profil);
    const experience = Math.floor(Math.random() * 15);
    const ville = DATA_MAROC.villes[Math.floor(Math.random() * DATA_MAROC.villes.length)];
    const statut = DATA_MAROC.statuts[Math.floor(Math.random() * DATA_MAROC.statuts.length)];
    
    return {
        id: `C${String(id).padStart(3, '0')}`,
        nom: genererNomComplet(),
        profil: profil,
        competences: competences,
        experience: experience,
        ville: ville,
        statut: statut,
        disponibilite: statut === 'Disponible' ? 'Immédiate' : `${Math.floor(Math.random() * 3) + 1} mois`,
        email: null, // Sera généré si besoin
        telephone: null,
        avatar: `https://i.pravatar.cc/150?img=${id % 70}` // Placeholder avatar
    };
}

/**
 * Génère un besoin aléatoire
 */
function genererBesoin(id) {
    const profil = DATA_MAROC.profils[Math.floor(Math.random() * DATA_MAROC.profils.length)];
    const competences = genererCompetences(profil);
    const ville = DATA_MAROC.villes[Math.floor(Math.random() * DATA_MAROC.villes.length)];
    const departement = DATA_MAROC.departements[Math.floor(Math.random() * DATA_MAROC.departements.length)];
    const typeContrat = DATA_MAROC.typesContrat[Math.floor(Math.random() * DATA_MAROC.typesContrat.length)];
    const urgence = ['Urgent', 'Moyen', 'Faible'][Math.floor(Math.random() * 3)];
    const statutBesoin = ['Ouvert', 'En cours', 'Clôturé'][Math.floor(Math.random() * 3)];
    
    return {
        id: `B${String(id).padStart(3, '0')}`,
        poste: profil,
        competences: competences,
        nombreProfils: Math.floor(Math.random() * 5) + 1,
        ville: ville,
        departement: departement,
        typeContrat: typeContrat,
        urgence: urgence,
        statut: statutBesoin,
        dateCreation: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Dernier mois
        description: `Nous recherchons un(e) ${profil} pour rejoindre notre équipe ${departement} à ${ville}.`
    };
}

// ========== FONCTIONS UTILITAIRES ==========

/**
 * Formate une date en français
 */
function formaterDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
}

/**
 * Calcule le pourcentage de matching entre un candidat et un besoin
 */
function calculerMatchingPourcentage(candidat, besoin) {
    if (!candidat || !besoin) return 0;
    
    const competencesCandidatSet = new Set(candidat.competences.map(c => c.toLowerCase()));
    const competencesBesoinSet = new Set(besoin.competences.map(c => c.toLowerCase()));
    
    let matches = 0;
    competencesBesoinSet.forEach(comp => {
        if (competencesCandidatSet.has(comp)) matches++;
    });
    
    const pourcentage = Math.round((matches / competencesBesoinSet.size) * 100);
    return pourcentage;
}

/**
 * Affiche une notification toast
 */
function afficherNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.position = 'fixed';
    toast.style.top = '80px';
    toast.style.right = '20px';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '8px';
    toast.style.color = 'white';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '10000';
    toast.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
    toast.style.animation = 'slideIn 0.3s ease';
    
    if (type === 'success') {
        toast.style.background = '#1DD75B';
    } else if (type === 'error') {
        toast.style.background = '#DE3B40';
    } else if (type === 'warning') {
        toast.style.background = '#F59E0B';
    } else {
        toast.style.background = '#636AE8';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Gère le menu actif du header
 */
function activerMenuHeader(pageName) {
    document.querySelectorAll('.header-menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.textContent.toLowerCase().includes(pageName)) {
            item.classList.add('active');
        }
    });
}

/**
 * Génère les initiales pour l'avatar
 */
function genererInitiales(nom) {
    const parts = nom.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nom.substring(0, 2).toUpperCase();
}

/**
 * Filtre un tableau selon une recherche
 */
function filtrerParRecherche(tableau, recherche, champs) {
    if (!recherche) return tableau;
    
    const termeLower = recherche.toLowerCase();
    return tableau.filter(item => {
        return champs.some(champ => {
            const valeur = item[champ];
            if (Array.isArray(valeur)) {
                return valeur.some(v => v.toLowerCase().includes(termeLower));
            }
            return String(valeur).toLowerCase().includes(termeLower);
        });
    });
}

/**
 * Trie un tableau selon un champ et un ordre
 */
function trierTableau(tableau, champ, ordre = 'asc') {
    return [...tableau].sort((a, b) => {
        const valA = a[champ];
        const valB = b[champ];
        
        if (typeof valA === 'string') {
            return ordre === 'asc' 
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }
        
        return ordre === 'asc' 
            ? valA - valB
            : valB - valA;
    });
}

/**
 * Gère la pagination d'un tableau
 */
function paginer(tableau, page, parPage = 10) {
    const debut = (page - 1) * parPage;
    const fin = debut + parPage;
    return {
        items: tableau.slice(debut, fin),
        pageActuelle: page,
        totalPages: Math.ceil(tableau.length / parPage),
        total: tableau.length
    };
}

// ========== GESTION DU STORAGE ==========

/**
 * Sauvegarde des données dans localStorage
 */
function sauvegarderDonnees(cle, donnees) {
    try {
        localStorage.setItem(cle, JSON.stringify(donnees));
        return true;
    } catch (e) {
        console.error('Erreur sauvegarde:', e);
        return false;
    }
}

/**
 * Récupération des données depuis localStorage
 */
function chargerDonnees(cle, defaut = null) {
    try {
        const data = localStorage.getItem(cle);
        return data ? JSON.parse(data) : defaut;
    } catch (e) {
        console.error('Erreur chargement:', e);
        return defaut;
    }
}

/**
 * Initialise les données de base si nécessaire
 */
function initialiserDonneesBase() {
    // Générer des candidats si pas existants
    if (!chargerDonnees('candidats')) {
        const candidats = [];
        for (let i = 1; i <= 50; i++) {
            candidats.push(genererCandidat(i));
        }
        sauvegarderDonnees('candidats', candidats);
    }
    
    // Générer des besoins si pas existants
    if (!chargerDonnees('besoins')) {
        const besoins = [];
        for (let i = 1; i <= 30; i++) {
            besoins.push(genererBesoin(i));
        }
        sauvegarderDonnees('besoins', besoins);
    }
}

// ========== ANIMATIONS CSS ==========
const styles = document.createElement('style');
styles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(styles);

// ========== INITIALISATION ==========
// Initialiser les données au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiserDonneesBase);
} else {
    initialiserDonneesBase();
}

// Export pour utilisation dans d'autres fichiers
window.SII = {
    DATA_MAROC,
    genererNomComplet,
    genererCompetences,
    genererCandidat,
    genererBesoin,
    formaterDate,
    calculerMatchingPourcentage,
    afficherNotification,
    activerMenuHeader,
    genererInitiales,
    filtrerParRecherche,
    trierTableau,
    paginer,
    sauvegarderDonnees,
    chargerDonnees,
    initialiserDonneesBase
};
