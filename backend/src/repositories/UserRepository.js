const BaseRepository = require('./BaseRepository');
const User = require('../models/User');
const db = require('../config/database');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) return null;
    return new User(...Object.values(result.rows[0]));
  }
}

module.exports = UserRepository;