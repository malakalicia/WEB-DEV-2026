# SmartHR - Plateforme Intelligente de Recrutement

## Informations du Projet

| Information | Details |
|-------------|---------|
| **Module** | Developpement Web |
| **Annee universitaire** | 2025-2026 |
| **Theme** | Entreprise - Gestion des Ressources Humaines |

---

## Equipe de Developpement

| Nom | Email | Role |
|-----|-------|------|
| **Sanae Soujaa** | sanae.soujaa@gmail.com | 
| **Malak Malk** | malak.malk@gmail.com |
| **Safae Elhamdaoui** | safae.elhamdaoui@gmail.com | 
| **Mohamed Houssam Lazrek** | houssam.lazrek@gmail.com | 
| **Nizar Es-samy** | nizar.essamy@gmail.com | 
---

## Table des Matieres

1. [Description du Projet](#1-description-du-projet)
2. [Architecture et Technologies](#2-architecture-et-technologies)
3. [Structure du Projet](#3-structure-du-projet)
4. [Build System (npm)](#4-build-system-npm)
5. [Installation et Configuration](#5-installation-et-configuration)
6. [Base de Donnees](#6-base-de-donnees)
7. [API REST](#7-api-rest)
8. [Modelisation UML](#8-modelisation-uml)
9. [Tests](#9-tests)
10. [Processus de Correction de Bugs](#10-processus-de-correction-de-bugs)
11. [Principes de Conception](#11-principes-de-conception)

---

## 1. Description du Projet

**SmartHR** est une plateforme web de gestion de recrutement intelligente qui permet aux professionnels RH de:

- Gerer les besoins en recrutement (CRUD complet)
- Gerer les profils des candidats (CRUD complet)
- Effectuer un matching intelligent candidat/besoin grace a l'IA (Groq API)
- Envoyer des invitations d'entretien par email
- Visualiser des tableaux de bord RH

### Fonctionnalites principales

| Fonctionnalite | Description |
|----------------|-------------|
| **Authentification** | Systeme JWT securise avec validation des mots de passe |
| **Gestion des Besoins** | Creation, modification, suppression des offres d'emploi |
| **Gestion des Candidats** | Suivi complet des profils candidats |
| **Recrutement Intelligent** | Matching IA entre candidats et besoins |
| **Notifications Email** | Envoi automatique d'invitations d'entretien |

---

## 2. Architecture et Technologies

### Architecture MVC

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│              (HTML5 / CSS3 / JavaScript)                     │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────▼───────────────────────────────────┐
│                     CONTROLLERS                              │
│     AuthController | CandidatController | BesoinController   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      SERVICES                                │
│      AuthService | CandidatService | BesoinService           │
│                    (Business Logic + Groq AI)                │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    REPOSITORIES                              │
│   UserRepository | CandidatRepository | BesoinRepository     │
│                  (Data Access Layer)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     PostgreSQL                               │
│              (Base de donnees relationnelle)                 │
└─────────────────────────────────────────────────────────────┘
```

### Stack Technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Backend** | Node.js + Express.js | ^18.0.0 / ^5.2.1 |
| **Base de donnees** | PostgreSQL | 15+ |
| **Authentification** | JWT + bcryptjs | ^9.0.3 / ^3.0.3 |
| **IA** | Groq SDK | ^0.37.0 |
| **Email** | Nodemailer | ^7.0.12 |
| **Frontend** | HTML5 / CSS3 / JavaScript | ES6+ |
| **Tests** | Jest + Supertest | ^30.2.0 / ^7.2.2 |

---

## 3. Structure du Projet

```
WEB-DEV-2026/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Point d'entree Express
│   │   ├── config/
│   │   │   ├── database.js        # Configuration PostgreSQL
│   │   │   └── email.js           # Configuration Nodemailer
│   │   ├── models/
│   │   │   ├── BaseModel.js       # Classe abstraite
│   │   │   ├── User.js
│   │   │   ├── Candidat.js
│   │   │   └── Besoin.js
│   │   ├── repositories/
│   │   │   ├── BaseRepository.js  # CRUD generique
│   │   │   ├── UserRepository.js
│   │   │   ├── CandidatRepository.js
│   │   │   └── BesoinRepository.js
│   │   ├── services/
│   │   │   ├── AuthService.js     # Authentification JWT
│   │   │   ├── CandidatService.js # Matching IA Groq
│   │   │   └── BesoinService.js
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   ├── CandidatController.js
│   │   │   └── BesoinController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── candidats.js
│   │   │   └── besoins.js
│   │   └── middleware/
│   │       └── auth.js            # Middleware JWT
│   ├── tests/unit/                # Tests unitaires Jest
│   ├── sql/
│   │   ├── schema.sql             # Schema de la BDD
│   │   └── seed.sql               # Donnees de test
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── index.html                 # Page de connexion
│   ├── css/style.css              # Styles CSS
│   ├── js/
│   │   ├── app.js                 # Donnees et fonctions communes
│   │   └── api-simulator.js       # Client API HTTP
│   ├── pages/
│   │   ├── besoins.html           # Gestion des besoins
│   │   ├── candidats.html         # Gestion des candidats
│   │   ├── pilotage-rh.html       # Dashboard RH
│   │   ├── recrutement-intelligent.html  # Matching IA
│   │   └── ...
│   ├── tests/
│   └── package.json
│
├── UML Modeling/
│   ├── Class Diagram/
│   │   └── class-diagram.puml
│   ├── Sequence Diagrams/
│   │   ├── sequence-login.puml
│   │   └── sequence-ia.puml
│   └── Use Case Diagram/
│       ├── auth.puml
│       ├── besoins.puml
│       └── candidats.puml
│
└── README.md
```

---

## 4. Build System (npm)

> **Note**: Ce projet utilise **npm** comme build system, equivalent a Maven/Gradle pour les projets Java.
> npm avec `package.json` gere les dependances, les scripts de build, les tests et le deploiement.

### Comparaison Maven/Gradle vs npm

| Maven/Gradle | npm (Node.js) | Description |
|--------------|---------------|-------------|
| `pom.xml` / `build.gradle` | `package.json` | Fichier de configuration |
| `mvn install` | `npm install` | Installation des dependances |
| `mvn test` | `npm test` | Execution des tests |
| `mvn package` | `npm run build` | Build du projet |
| `mvn clean` | `npm run clean` | Nettoyage |
| `mvn deploy` | `npm run deploy` | Deploiement |

### Scripts Disponibles

```bash
# Installation
npm install              # Installe toutes les dependances
npm run clean            # Supprime node_modules et coverage

# Developpement
npm run dev              # Demarre le serveur avec hot-reload (nodemon)
npm start                # Demarre le serveur en production

# Tests
npm test                 # Execute tous les tests
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Tests avec rapport de couverture

# Build
npm run validate         # Valide le projet (tests)
npm run build            # Build complet (validation + build)
npm run build:prod       # Build pour production

# Base de donnees
npm run db:init          # Initialise la BDD (schema + seed)
npm run db:schema        # Execute uniquement le schema
npm run db:seed          # Execute uniquement le seed

# CI/CD
npm run ci               # Pipeline complete (clean + install + build)
npm run deploy           # Deploiement
```

### Cycle de Build

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CLEAN     │ -> │   INSTALL   │ -> │  VALIDATE   │ -> │   BUILD     │
│             │    │             │    │             │    │             │
│ npm clean   │    │ npm install │    │ npm test    │    │ npm build   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                      ┌─────────────┐           │
                                      │   DEPLOY    │ <─────────┘
                                      │             │
                                      │ npm deploy  │
                                      └─────────────┘
```

---

## 5. Installation et Configuration

### Prerequis

- Node.js >= 18.0.0
- PostgreSQL >= 15
- npm >= 9.0.0

### Installation du Backend

```bash
# 1. Cloner le repository
git clone https://github.com/votre-repo/WEB-DEV-2026.git
cd WEB-DEV-2026

# 2. Installer les dependances backend
cd backend
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Editer .env avec vos parametres

# 4. Creer la base de donnees
psql -U postgres -f sql/schema.sql
psql -U postgres -d recrutement_db -f sql/seed.sql

# 5. Demarrer le serveur
npm run dev
```

### Configuration .env

```env
# Base de donnees
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recrutement_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# Serveur
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=votre_cle_secrete_32_caracteres_minimum
JWT_EXPIRES_IN=7d

# Groq API (optionnel)
GROQ_API_KEY=votre_cle_groq

# Email (optionnel)
GMAIL_USER=votre_email@gmail.com
GMAIL_PASSWORD=votre_app_password
```

### Demarrage du Frontend

Le frontend est statique, ouvrez simplement `frontend/index.html` dans un navigateur ou utilisez un serveur local:

```bash
cd frontend
npx serve .
```

---

## 6. Base de Donnees

### Schema de la Base de Donnees

Le systeme utilise PostgreSQL avec 3 tables principales:

#### Diagramme Entite-Relation

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      users       │       │     besoins      │       │    candidats     │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ PK id            │       │ PK id            │       │ PK id            │
│    email         │       │    poste         │       │    proposition   │
│    password      │       │    competences   │       │    name          │
│    created_at    │       │    niveau        │       │    profil        │
│    updated_at    │       │    statut        │       │    statut        │
└──────────────────┘       │    created_at    │       │    experience    │
                           │    updated_at    │       │    commentaire   │
                           └──────────────────┘       │    email         │
                                                      │    created_at    │
                                                      │    updated_at    │
                                                      └──────────────────┘
```

### Description des Tables

#### Table `users`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| email | VARCHAR(255) | UNIQUE NOT NULL | Adresse email de connexion |
| password | VARCHAR(255) | NOT NULL | Mot de passe hashe (bcrypt) |
| created_at | TIMESTAMP | DEFAULT NOW() | Date de creation |
| updated_at | TIMESTAMP | DEFAULT NOW() | Date de modification |

#### Table `besoins`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| poste | VARCHAR(255) | NOT NULL | Intitule du poste |
| competences | JSONB | DEFAULT '[]' | Liste des competences requises |
| niveau | INTEGER | CHECK (0-2) | 0=Faible, 1=Moyen, 2=Urgent |
| statut | INTEGER | CHECK (0-1) | 0=Cloture, 1=Ouvert |
| created_at | TIMESTAMP | DEFAULT NOW() | Date de creation |
| updated_at | TIMESTAMP | DEFAULT NOW() | Date de modification |

#### Table `candidats`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| proposition | VARCHAR(255) | NOT NULL | Reference de la proposition |
| name | VARCHAR(255) | NOT NULL | Nom complet du candidat |
| profil | INTEGER | CHECK (0-4) | 0=Dev, 1=Designer, 2=Chef projet, 3=Analyste, 4=Architecte |
| statut | INTEGER | CHECK (0-3) | 0=Junior, 1=Intermediaire, 2=Senior, 3=Expert |
| experience | INTEGER | DEFAULT 0 | Annees d'experience |
| commentaire | TEXT | NULL | Notes sur le candidat |
| email | VARCHAR(255) | NOT NULL | Email du candidat |
| created_at | TIMESTAMP | DEFAULT NOW() | Date de creation |
| updated_at | TIMESTAMP | DEFAULT NOW() | Date de modification |

### Index et Triggers

```sql
-- Index pour les performances
CREATE INDEX idx_besoins_statut ON besoins(statut);
CREATE INDEX idx_candidats_profil ON candidats(profil);
CREATE INDEX idx_candidats_statut ON candidats(statut);

-- Trigger pour mise a jour automatique de updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 7. API REST

### Endpoints d'Authentification

| Methode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/users/login` | Connexion utilisateur | Non |
| POST | `/api/users/register` | Inscription utilisateur | Non |

### Endpoints Besoins

| Methode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/besoins/get` | Liste tous les besoins | JWT |
| GET | `/api/besoins/:id` | Detail d'un besoin | JWT |
| POST | `/api/besoins/add` | Creer un besoin | JWT |
| PUT | `/api/besoins/update/:id` | Modifier un besoin | JWT |
| DELETE | `/api/besoins/delete/:id` | Supprimer un besoin | JWT |

### Endpoints Candidats

| Methode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/candidats/get` | Liste tous les candidats | JWT |
| GET | `/api/candidats/:id` | Detail d'un candidat | JWT |
| POST | `/api/candidats/add` | Creer un candidat | JWT |
| PUT | `/api/candidats/update/:id` | Modifier un candidat | JWT |
| DELETE | `/api/candidats/delete/:id` | Supprimer un candidat | JWT |
| GET | `/api/candidats/par_besoin/:id` | Matching IA candidat/besoin | JWT |
| POST | `/api/candidats/send_mail/:id` | Envoyer invitation entretien | JWT |

### Exemple de Requete

```bash
# Connexion
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@smarthr.ma", "password": "Admin@123"}'

# Reponse
{
  "login": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "admin@smarthr.ma" }
}
```

---

## 8. Modelisation UML

### Diagrammes disponibles

| Type | Fichier | Description |
|------|---------|-------------|
| **Class Diagram** | `UML Modeling/Class Diagram/class-diagram.puml` | Architecture des classes |
| **Use Case - Auth** | `UML Modeling/Use Case Diagram/auth.puml` | Cas d'utilisation authentification |
| **Use Case - Besoins** | `UML Modeling/Use Case Diagram/besoins.puml` | Cas d'utilisation besoins |
| **Use Case - Candidats** | `UML Modeling/Use Case Diagram/candidats.puml` | Cas d'utilisation candidats |
| **Sequence - Login** | `UML Modeling/Sequence Diagrams/sequence-login.puml` | Sequence de connexion |
| **Sequence - IA** | `UML Modeling/Sequence Diagrams/sequence-ia.puml` | Sequence matching IA |

### Visualisation

Pour visualiser les diagrammes PlantUML:

```bash
# Option 1: Extension VS Code "PlantUML"
# Option 2: PlantUML Server en ligne
# https://www.plantuml.com/plantuml/uml/
```

---

## 9. Tests

### Execution des Tests

```bash
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test
```

### Couverture des Tests

| Module | Fichier de test | Couverture |
|--------|-----------------|------------|
| AuthService | `AuthService.test.js` | Authentification, validation |
| AuthController | `AuthController.test.js` | Routes login/register |
| CandidatService | `CandidatService.test.js` | CRUD candidats |
| CandidatController | `CandidatController.test.js` | Routes candidats |
| BesoinService | `BesoinService.test.js` | CRUD besoins |
| BesoinController | `BesoinController.test.js` | Routes besoins |
| BaseRepository | `BaseRepository.test.js` | Operations CRUD |
| API Simulator | `api-simulator.test.js` | Client HTTP frontend |

---

## 10. Processus de Correction de Bugs

### Workflow de Gestion des Bugs

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DETECTION  │ -> │   RAPPORT   │ -> │  ANALYSE    │ -> │ CORRECTION  │
│             │    │             │    │             │    │             │
│ - Tests     │    │ - GitHub    │    │ - Priorite  │    │ - Fix code  │
│ - Users     │    │   Issues    │    │ - Impact    │    │ - Tests     │
│ - Logs      │    │ - Template  │    │ - Assignation│   │ - Review    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                   ┌─────────────┐    ┌─────────────┐           │
                   │  DEPLOIEMENT│ <- │ VALIDATION  │ <─────────┘
                   │             │    │             │
                   │ - Merge     │    │ - QA Tests  │
                   │ - Release   │    │ - Approval  │
                   └─────────────┘    └─────────────┘
```

### Template de Rapport de Bug (GitHub Issues)

```markdown
## Description du Bug
[Description claire et concise du probleme]

## Etapes pour Reproduire
1. Aller sur '...'
2. Cliquer sur '...'
3. Observer l'erreur

## Comportement Attendu
[Ce qui devrait se passer]

## Comportement Actuel
[Ce qui se passe reellement]

## Captures d'ecran
[Si applicable]

## Environnement
- OS: [ex: Windows 11, macOS 14]
- Navigateur: [ex: Chrome 120]
- Version Node.js: [ex: 18.19.0]

## Logs/Erreurs
```
[Coller les logs pertinents]
```

## Priorite
- [ ] Critique (bloquant)
- [ ] Haute (fonctionnalite majeure)
- [ ] Moyenne (fonctionnalite mineure)
- [ ] Basse (amelioration)
```

### Niveaux de Priorite

| Priorite | Description | Delai de resolution |
|----------|-------------|---------------------|
| **Critique** | Application inutilisable, perte de donnees | Immediat |
| **Haute** | Fonctionnalite majeure non fonctionnelle | 24-48h |
| **Moyenne** | Bug mineur, contournement possible | 1 semaine |
| **Basse** | Amelioration, probleme cosmetique | Backlog |

### Bonnes Pratiques

1. **Un bug = Une issue** - Ne pas regrouper plusieurs bugs
2. **Reproductibilite** - Toujours fournir les etapes de reproduction
3. **Branches dediees** - Creer une branche `fix/nom-du-bug`
4. **Tests de regression** - Ajouter un test pour chaque bug corrige
5. **Code review** - Toute correction doit etre revue avant merge

---

## 11. Principes de Conception

### Principes SOLID Appliques

| Principe | Application dans le projet |
|----------|---------------------------|
| **S** - Single Responsibility | Chaque classe a une seule responsabilite (Controller, Service, Repository) |
| **O** - Open/Closed | BaseRepository extensible sans modification |
| **L** - Liskov Substitution | Les classes filles (User, Candidat, Besoin) substituables a BaseModel |
| **I** - Interface Segregation | Interfaces specifiques par domaine (Auth, Candidat, Besoin) |
| **D** - Dependency Inversion | Services dependent des abstractions (Repository) |

### Clean Code

- **Nommage explicite** : Variables et fonctions auto-documentees
- **Fonctions courtes** : Chaque fonction fait une seule chose
- **DRY** : Pas de duplication de code (BaseRepository, BaseModel)
- **Commentaires** : Uniquement quand necessaire (JSDoc pour API)

---

## Licence

Ce projet est developpe dans le cadre academique - ENSIAS 2025-2026.

---

*Derniere mise a jour: Janvier 2026*
