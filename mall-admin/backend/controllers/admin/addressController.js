const db = require('../../config/database');
const Response = require('../../utils/response');

class AddressController {
  /**
   * 获取收货地址列表
   */
  static async list(req, res) {
    try {
      const { page = 1, pageSize = 10, userId, keyword } = req.query;
      const offset = (page - 1) * pageSize;
      
      let whereClause = 'WHERE 1=1';
      let params = [];
      
      if (userId) {
        whereClause += ' AND a.user_id = ?';
        params.push(userId);
      }
      
      if (keyword) {
        whereClause += ' AND (a.receiver_name LIKE ? OR a.receiver_phone LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
      
      // 查询总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM address a ${whereClause}`,
        params
      );
      const total = countResult[0].total;
      
      // 查询列表
      const [addresses] = await db.query(
        `SELECT a.*, u.nickname as user_nickname
         FROM address a
         LEFT JOIN user u ON a.user_id = u.id
         ${whereClause}
         ORDER BY a.is_default DESC, a.id DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(pageSize), offset]
      );
      
      return Response.page(res, addresses, total, page, pageSize);
      
    } catch (error) {
      console.error('获取地址列表错误:', error);
      return Response.error(res, '获取列表失败', 500);
    }
  }
  
  /**
   * 获取地址详情
   */
  static async detail(req, res) {
    try {
      const { id } = req.params;
      
      const [addresses] = await db.query(
        'SELECT * FROM address WHERE id = ?',
        [id]
      );
      
      if (addresses.length === 0) {
        return Response.error(res, '地址不存在', 404);
      }
      
      return Response.success(res, addresses[0]);
      
    } catch (error) {
      console.error('获取地址详情错误:', error);
      return Response.error(res, '获取详情失败', 500);
    }
  }
  
  /**
   * 新增/编辑地址
   */
  static async save(req, res) {
    try {
      const {
        id,
        user_id,
        receiver_name,
        receiver_phone,
        province,
        city,
        district,
        detail,
        postal_code,
        is_default = 0
      } = req.body;
      
      if (!user_id || !receiver_name || !receiver_phone || !detail) {
        return Response.error(res, '必填字段不能为空', 400);
      }
      
      // 如果设置为默认地址，先取消该用户其他默认地址
      if (is_default == 1) {
        await db.query(
          'UPDATE address SET is_default = 0 WHERE user_id = ?',
          [user_id]
        );
      }
      
      if (id) {
        // 更新地址
        await db.query(
          `UPDATE address SET 
           receiver_name = ?, receiver_phone = ?, province = ?, city = ?,
           district = ?, detail = ?, postal_code = ?, is_default = ?
           WHERE id = ?`,
          [receiver_name, receiver_phone, province, city, district, detail, postal_code, is_default, id]
        );
        
        return Response.success(res, { id }, '更新成功');
      } else {
        // 新增地址
        const [result] = await db.query(
          `INSERT INTO address 
           (user_id, receiver_name, receiver_phone, province, city, district, detail, postal_code, is_default)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [user_id, receiver_name, receiver_phone, province, city, district, detail, postal_code, is_default]
        );
        
        return Response.success(res, { id: result.insertId }, '新增成功');
      }
      
    } catch (error) {
      console.error('保存地址错误:', error);
      return Response.error(res, '保存失败', 500);
    }
  }
  
  /**
   * 删除地址
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      await db.query('DELETE FROM address WHERE id = ?', [id]);
      
      return Response.success(res, null, '删除成功');
      
    } catch (error) {
      console.error('删除地址错误:', error);
      return Response.error(res, '删除失败', 500);
    }
  }
}

module.exports = AddressController;
