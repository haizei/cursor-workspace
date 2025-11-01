const BaseModel = require('./BaseModel');

class Admin extends BaseModel {
  constructor() {
    super('admin');
  }

  /**
   * 根据用户名查找管理员
   */
  async findByUsername(username) {
    return await this.findOne({ username });
  }
}

module.exports = new Admin();
