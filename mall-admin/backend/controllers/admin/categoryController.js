const db = require('../../config/database');
const Response = require('../../utils/response');

class CategoryController {
  /**
   * 获取分类列表
   */
  static async list(req, res) {
    try {
      const { page, pageSize, keyword, status } = req.query;
      
      let whereClause = 'WHERE 1=1';
      let params = [];
      
      if (keyword) {
        whereClause += ' AND name LIKE ?';
        params.push(`%${keyword}%`);
      }
      
      if (status !== undefined && status !== '') {
        whereClause += ' AND status = ?';
        params.push(status);
      }
      
      // 如果有分页参数
      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        
        // 查询总数
        const [countResult] = await db.query(
          `SELECT COUNT(*) as total FROM category ${whereClause}`,
          params
        );
        const total = countResult[0].total;
        
        // 查询列表
        const [categories] = await db.query(
          `SELECT c.*, 
           (SELECT COUNT(*) FROM goods WHERE category_id = c.id) as goods_count
           FROM category c
           ${whereClause}
           ORDER BY c.sort ASC, c.id DESC
           LIMIT ? OFFSET ?`,
          [...params, parseInt(pageSize), offset]
        );
        
        return Response.page(res, categories, total, page, pageSize);
      } else {
        // 不分页，返回所有
        const [categories] = await db.query(
          `SELECT c.*, 
           (SELECT COUNT(*) FROM goods WHERE category_id = c.id) as goods_count
           FROM category c
           ${whereClause}
           ORDER BY c.sort ASC, c.id DESC`,
          params
        );
        
        return Response.success(res, categories);
      }
      
    } catch (error) {
      console.error('获取分类列表错误:', error);
      return Response.error(res, '获取列表失败', 500);
    }
  }
  
  /**
   * 获取分类详情
   */
  static async detail(req, res) {
    try {
      const { id } = req.params;
      
      const [categories] = await db.query(
        'SELECT * FROM category WHERE id = ?',
        [id]
      );
      
      if (categories.length === 0) {
        return Response.error(res, '分类不存在', 404);
      }
      
      return Response.success(res, categories[0]);
      
    } catch (error) {
      console.error('获取分类详情错误:', error);
      return Response.error(res, '获取详情失败', 500);
    }
  }
  
  /**
   * 新增/编辑分类
   */
  static async save(req, res) {
    try {
      const {
        id,
        name,
        image,
        parent_id = 0,
        sort = 0,
        status = 1
      } = req.body;
      
      if (!name) {
        return Response.error(res, '分类名称不能为空', 400);
      }
      
      if (id) {
        // 更新分类
        await db.query(
          `UPDATE category SET 
           name = ?, image = ?, parent_id = ?, sort = ?, status = ?
           WHERE id = ?`,
          [name, image, parent_id, sort, status, id]
        );
        
        return Response.success(res, { id }, '更新成功');
      } else {
        // 新增分类
        const [result] = await db.query(
          `INSERT INTO category (name, image, parent_id, sort, status)
           VALUES (?, ?, ?, ?, ?)`,
          [name, image, parent_id, sort, status]
        );
        
        return Response.success(res, { id: result.insertId }, '新增成功');
      }
      
    } catch (error) {
      console.error('保存分类错误:', error);
      return Response.error(res, '保存失败', 500);
    }
  }
  
  /**
   * 删除分类
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // 检查是否有商品使用该分类
      const [goods] = await db.query(
        'SELECT COUNT(*) as count FROM goods WHERE category_id = ?',
        [id]
      );
      
      if (goods[0].count > 0) {
        return Response.error(res, '该分类下有商品，无法删除', 400);
      }
      
      // 检查是否有子分类
      const [children] = await db.query(
        'SELECT COUNT(*) as count FROM category WHERE parent_id = ?',
        [id]
      );
      
      if (children[0].count > 0) {
        return Response.error(res, '该分类下有子分类，无法删除', 400);
      }
      
      await db.query('DELETE FROM category WHERE id = ?', [id]);
      
      return Response.success(res, null, '删除成功');
      
    } catch (error) {
      console.error('删除分类错误:', error);
      return Response.error(res, '删除失败', 500);
    }
  }
}

module.exports = CategoryController;
