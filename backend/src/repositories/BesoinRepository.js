const BaseRepository = require('./BaseRepository');
const Besoin = require('../models/Besoin');
const db = require('../config/database');

class BesoinRepository extends BaseRepository {
  constructor() {
    super(Besoin);
  }

  async findActive() {
    const query = 'SELECT * FROM besoins WHERE statut = 1 ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows.map(row => new Besoin(...Object.values(row)));
  }
}

module.exports = BesoinRepository;