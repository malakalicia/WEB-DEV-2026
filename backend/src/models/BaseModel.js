class BaseModel {
  constructor() {
    if (new.target === BaseModel) {
      throw new Error('BaseModel cannot be instantiated directly');
    }
  }

  static get tableName() {
    throw new Error('tableName getter must be implemented');
  }

  static get columns() {
    throw new Error('columns getter must be implemented');
  }
}

module.exports = BaseModel;