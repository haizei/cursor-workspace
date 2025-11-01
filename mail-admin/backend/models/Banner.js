const BaseModel = require('./BaseModel');

class Banner extends BaseModel {
  constructor() {
    super('banner');
  }

  /**
   * 获取启用的轮播图列表
   */
  async getActiveList() {
    return await this.findAll(
      { status: 1 },
      { orderBy: 'sort ASC, id DESC' }
    );
  }
}

module.exports = new Banner();
