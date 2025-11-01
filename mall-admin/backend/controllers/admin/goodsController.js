const db = require('../../config/database');
const Response = require('../../utils/response');

class GoodsController {
  /**
   * 获取商品列表
   */
  static async list(req, res) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        keyword, 
        categoryId, 
        status 
      } = req.query;
      const offset = (page - 1) * pageSize;
      
      let whereClause = 'WHERE 1=1';
      let params = [];
      
      if (keyword) {
        whereClause += ' AND g.name LIKE ?';
        params.push(`%${keyword}%`);
      }
      
      if (categoryId) {
        whereClause += ' AND g.category_id = ?';
        params.push(categoryId);
      }
      
      if (status !== undefined && status !== '') {
        whereClause += ' AND g.status = ?';
        params.push(status);
      }
      
      // 查询总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM goods g ${whereClause}`,
        params
      );
      const total = countResult[0].total;
      
      // 查询列表
      const [goods] = await db.query(
        `SELECT g.*, c.name as category_name
         FROM goods g
         LEFT JOIN category c ON g.category_id = c.id
         ${whereClause}
         ORDER BY g.sort ASC, g.id DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(pageSize), offset]
      );
      
      // 解析图片JSON
      goods.forEach(item => {
        if (item.images) {
          try {
            item.images = JSON.parse(item.images);
          } catch (e) {
            item.images = [];
          }
        } else {
          item.images = [];
        }
      });
      
      return Response.page(res, goods, total, page, pageSize);
      
    } catch (error) {
      console.error('获取商品列表错误:', error);
      return Response.error(res, '获取列表失败', 500);
    }
  }
  
  /**
   * 获取商品详情
   */
  static async detail(req, res) {
    try {
      const { id } = req.params;
      
      const [goods] = await db.query(
        `SELECT g.*, c.name as category_name
         FROM goods g
         LEFT JOIN category c ON g.category_id = c.id
         WHERE g.id = ?`,
        [id]
      );
      
      if (goods.length === 0) {
        return Response.error(res, '商品不存在', 404);
      }
      
      const item = goods[0];
      
      // 解析图片JSON
      if (item.images) {
        try {
          item.images = JSON.parse(item.images);
        } catch (e) {
          item.images = [];
        }
      } else {
        item.images = [];
      }
      
      return Response.success(res, item);
      
    } catch (error) {
      console.error('获取商品详情错误:', error);
      return Response.error(res, '获取详情失败', 500);
    }
  }
  
  /**
   * 新增/编辑商品
   */
  static async save(req, res) {
    try {
      const {
        id,
        name,
        main_image,
        images,
        price,
        stock,
        category_id,
        description,
        detail,
        sort = 0,
        status = 1,
        is_recommend = 0,
        recommend_sort = 0
      } = req.body;
      
      // 验证必填字段
      if (!name || !price || !category_id) {
        return Response.error(res, '商品名称、价格和分类不能为空', 400);
      }
      
      // 处理图片数组
      const imagesJson = Array.isArray(images) ? JSON.stringify(images) : '[]';
      
      if (id) {
        // 更新商品
        await db.query(
          `UPDATE goods SET 
           name = ?, main_image = ?, images = ?, price = ?, stock = ?,
           category_id = ?, description = ?, detail = ?, sort = ?,
           status = ?, is_recommend = ?, recommend_sort = ?
           WHERE id = ?`,
          [name, main_image, imagesJson, price, stock, category_id, 
           description, detail, sort, status, is_recommend, recommend_sort, id]
        );
        
        return Response.success(res, { id }, '更新成功');
      } else {
        // 新增商品
        const [result] = await db.query(
          `INSERT INTO goods 
           (name, main_image, images, price, stock, category_id, 
            description, detail, sort, status, is_recommend, recommend_sort)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [name, main_image, imagesJson, price, stock, category_id,
           description, detail, sort, status, is_recommend, recommend_sort]
        );
        
        return Response.success(res, { id: result.insertId }, '新增成功');
      }
      
    } catch (error) {
      console.error('保存商品错误:', error);
      return Response.error(res, '保存失败', 500);
    }
  }
  
  /**
   * 删除商品
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      await db.query('DELETE FROM goods WHERE id = ?', [id]);
      
      return Response.success(res, null, '删除成功');
      
    } catch (error) {
      console.error('删除商品错误:', error);
      return Response.error(res, '删除失败', 500);
    }
  }
  
  /**
   * 批量删除商品
   */
  static async batchDelete(req, res) {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return Response.error(res, '请选择要删除的商品', 400);
      }
      
      const placeholders = ids.map(() => '?').join(',');
      await db.query(`DELETE FROM goods WHERE id IN (${placeholders})`, ids);
      
      return Response.success(res, null, '批量删除成功');
      
    } catch (error) {
      console.error('批量删除商品错误:', error);
      return Response.error(res, '批量删除失败', 500);
    }
  }
  
  /**
   * 设置商品状态
   */
  static async setStatus(req, res) {
    try {
      const { id, status } = req.body;
      
      await db.query('UPDATE goods SET status = ? WHERE id = ?', [status, id]);
      
      return Response.success(res, null, '状态更新成功');
      
    } catch (error) {
      console.error('更新商品状态错误:', error);
      return Response.error(res, '状态更新失败', 500);
    }
  }
  
  /**
   * 批量上下架
   */
  static async batchSetStatus(req, res) {
    try {
      const { ids, status } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return Response.error(res, '请选择要操作的商品', 400);
      }
      
      const placeholders = ids.map(() => '?').join(',');
      await db.query(
        `UPDATE goods SET status = ? WHERE id IN (${placeholders})`,
        [status, ...ids]
      );
      
      return Response.success(res, null, '批量操作成功');
      
    } catch (error) {
      console.error('批量设置状态错误:', error);
      return Response.error(res, '批量操作失败', 500);
    }
  }
}

module.exports = GoodsController;
