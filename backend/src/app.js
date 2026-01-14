const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const besoinRoutes = require('./routes/besoins');
const candidatRoutes = require('./routes/candidats');

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    // API Routes
    this.app.use('/api/users', authRoutes);
    this.app.use('/api/besoins', besoinRoutes);
    this.app.use('/api/candidats', candidatRoutes);

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Route non trouvée',
        path: req.originalUrl
      });
    });
  }

  initializeErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error('Erreur:', err.stack);
      
      res.status(err.status || 500).json({
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Serveur backend démarré sur le port ${this.port}`);
      console.log(`📁 Environnement: ${process.env.NODE_ENV}`);
      console.log(`🔗 URL: http://localhost:${this.port}`);
    });
  }
}

// Démarrer l'application
const server = new App();
server.start();

module.exports = server.app;