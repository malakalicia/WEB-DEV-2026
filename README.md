# SII Skills Connect - Application Full-Stack

Application professionnelle de gestion RH et recrutement.

## 🚀 Démarrage Rapide

### Backend

```bash
cd backend
npm install
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Frontend

Ouvrir `frontend/index.html` dans votre navigateur.

## 📋 Fonctionnalités

- ✅ API REST complète
- ✅ CRUD Candidats et Besoins
- ✅ Matching intelligent par IA
- ✅ Données persistantes (JSON)
- ✅ Frontend SPA moderne
- ✅ Données réalistes Maroc

## 🛠️ Technologies

**Backend:**
- Node.js + Express
- CORS
- JSON comme base de données

**Frontend:**
- HTML5, CSS3, JavaScript ES6+
- Vanilla JS (pas de framework)
- Fetch API

## 📝 Routes API

```
POST   /api/auth/login
GET    /api/candidats
POST   /api/candidats
PUT    /api/candidats/:id
DELETE /api/candidats/:id
GET    /api/besoins
POST   /api/besoins
POST   /api/matching/:besoinId
GET    /api/recommandations
```

## 🎯 Architecture

```
sii-fullstack-app/
├── backend/          # API Node.js
│   ├── server.js
│   ├── data/
│   │   └── db.json
│   └── package.json
└── frontend/         # SPA
    ├── index.html
    ├── css/
    ├── js/
    └── pages/
```

## 📄 License

MIT © 2025 SII Maroc
