const BaseModel = require('./BaseModel');

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get columns() {
    return ['id', 'email', 'password', 'created_at', 'updated_at'];
  }

  constructor(id, email, password) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;