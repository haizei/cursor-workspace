const BaseModel = require('./BaseModel');

class Cart extends BaseModel {
  constructor() {
    super('cart');
  }

  /**
   * 获取用户购物车（带商品信息）
   */
  async getUserCart(userId) {
    const pool = require('../config/database');
    const [rows] = await pool.execute(`
      SELECT c.*, g.name as goods_name, g.main_image as goods_image, 
             g.price as goods_price, g.stock as goods_stock, g.status as goods_status
      FROM cart c
      LEFT JOIN goods g ON c.goods_id = g.id
      WHERE c.user_id = ?
      ORDER BY c.create_time DESC
    `, [userId]);

    return rows;
  }

  /**
   * 清空用户购物车
   */
  async clearUserCart(userId) {
    const sql = `DELETE FROM cart WHERE user_id = ?`;
    await this.query(sql, [userId]);
    return true;
  }
}

module.exports = new Cart();
