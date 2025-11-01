const BaseModel = require('./BaseModel');

class Category extends BaseModel {
  constructor() {
    super('category');
  }

  /**
   * 获取树形结构分类
   */
  async getTree() {
    const allCategories = await this.findAll({ status: 1 }, { orderBy: 'sort ASC, id ASC' });
    const tree = [];
    const map = {};

    // 创建映射
    allCategories.forEach(cat => {
      map[cat.id] = { ...cat, children: [] };
    });

    // 构建树形结构
    allCategories.forEach(cat => {
      if (cat.parent_id === 0) {
        tree.push(map[cat.id]);
      } else {
        if (map[cat.parent_id]) {
          map[cat.parent_id].children.push(map[cat.id]);
        }
      }
    });

    return tree;
  }
}

module.exports = new Category();
