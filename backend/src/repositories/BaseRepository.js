const db = require('../config/database');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    const query = `SELECT * FROM ${this.model.tableName} ORDER BY created_at DESC`;
    const result = await db.query(query);
    return result.rows.map(row => new this.model(...Object.values(row)));
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.model.tableName} WHERE id = $1`;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) return null;
    return new this.model(...Object.values(result.rows[0]));
  }

  async create(data) {
    const columns = this.model.columns.filter(col => col !== 'id' && col !== 'created_at' && col !== 'updated_at');
    const values = columns.map(col => {
      // Convertir les tableaux en JSON pour PostgreSQL
      if (Array.isArray(data[col])) {
        return JSON.stringify(data[col]);
      }
      return data[col];
    });
    
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    
    const query = `
      INSERT INTO ${this.model.tableName} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return new this.model(...Object.values(result.rows[0]));
  }

  async update(id, data) {
    const columns = this.model.columns.filter(col => 
      col !== 'id' && col !== 'created_at' && col !== 'updated_at'
    );
    
    const setClause = columns
      .map((col, i) => `${col} = $${i + 2}`)
      .join(', ');
    
    const values = columns.map(col => {
      // Convertir les tableaux en JSON pour PostgreSQL
      if (Array.isArray(data[col])) {
        return JSON.stringify(data[col]);
      }
      return data[col];
    });
    
    values.unshift(id);
    
    const query = `
      UPDATE ${this.model.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    if (result.rows.length === 0) return null;
    return new this.model(...Object.values(result.rows[0]));
  }

  async delete(id) {
    const query = `DELETE FROM ${this.model.tableName} WHERE id = $1 RETURNING id`;
    const result = await db.query(query, [id]);
    return result.rows.length > 0;
  }
}

module.exports = BaseRepository;