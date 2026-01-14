const express = require('express');
const router = express.Router();
const BesoinController = require('../controllers/BesoinController');
const authenticateToken = require('../middleware/auth');

const besoinController = new BesoinController();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// GET /api/besoins/get
router.get('/get', (req, res) => besoinController.getAll(req, res));

// GET /api/besoins/:id
router.get('/:id', (req, res) => besoinController.getById(req, res));

// POST /api/besoins/add
router.post('/add', (req, res) => besoinController.create(req, res));

// PUT /api/besoins/update/:id
router.put('/update/:id', (req, res) => besoinController.update(req, res));

// DELETE /api/besoins/delete/:id
router.delete('/delete/:id', (req, res) => besoinController.delete(req, res));

module.exports = router;