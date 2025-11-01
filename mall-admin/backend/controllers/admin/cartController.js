const db = require('../../config/database');
const Response = require('../../utils/response');

class CartController {
  /**
   * 获取用户购物车
   */
  static async userCart(req, res) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return Response.error(res, '用户ID不能为空', 400);
      }
      
      const [carts] = await db.query(
        `SELECT c.*, g.name as goods_name, g.main_image, g.price, g.stock
         FROM cart c
         LEFT JOIN goods g ON c.goods_id = g.id
         WHERE c.user_id = ?
         ORDER BY c.create_time DESC`,
        [userId]
      );
      
      return Response.success(res, carts);
      
    } catch (error) {
      console.error('获取购物车错误:', error);
      return Response.error(res, '获取购物车失败', 500);
    }
  }
  
  /**
   * 清空用户购物车
   */
  static async clear(req, res) {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return Response.error(res, '用户ID不能为空', 400);
      }
      
      await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
      
      return Response.success(res, null, '购物车已清空');
      
    } catch (error) {
      console.error('清空购物车错误:', error);
      return Response.error(res, '清空失败', 500);
    }
  }
}

module.exports = CartController;
