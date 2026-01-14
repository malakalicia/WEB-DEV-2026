const express = require('express');
const router = express.Router();
const CandidatController = require('../controllers/CandidatController');
const authenticateToken = require('../middleware/auth');

const candidatController = new CandidatController();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// GET /api/candidats/get
router.get('/get', (req, res) => candidatController.getAll(req, res));

// GET /api/candidats/:id
router.get('/:id', (req, res) => candidatController.getById(req, res));

// POST /api/candidats/add
router.post('/add', (req, res) => candidatController.create(req, res));

// PUT /api/candidats/update/:id
router.put('/update/:id', (req, res) => candidatController.update(req, res));

// DELETE /api/candidats/delete/:id
router.delete('/delete/:id', (req, res) => candidatController.delete(req, res));

// GET /api/candidats/par_besoin/:id_besoin (Recrutement intelligent)
router.get('/par_besoin/:id_besoin', (req, res) => candidatController.getByBesoin(req, res));

// POST /api/candidats/send_mail/:id_candidat
router.post('/send_mail/:id_candidat', (req, res) => candidatController.sendInterviewEmail(req, res));

module.exports = router;