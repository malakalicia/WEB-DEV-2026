const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const authController = new AuthController();

// POST /api/users/login
router.post('/login', (req, res) => authController.login(req, res));

// POST /api/users/register (optionnel, pour les tests)
router.post('/register', (req, res) => authController.register(req, res));

module.exports = router;