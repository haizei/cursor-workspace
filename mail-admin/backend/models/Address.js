const BaseModel = require('./BaseModel');

class Address extends BaseModel {
  constructor() {
    super('address');
  }

  /**
   * 获取用户地址列表
   */
  async getUserAddresses(userId) {
    return await this.findAll(
      { user_id: userId },
      { orderBy: 'is_default DESC, create_time DESC' }
    );
  }
}

module.exports = new Address();
