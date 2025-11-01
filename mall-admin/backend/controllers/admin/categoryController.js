const db = require('../../config/database');
const Response = require('../../utils/response');
const Logger = require('../../utils/logger');

/**
 * 分类管理控制器
 */
class CategoryController {
  /**
   * 获取分类列表
   */
  static async getList(req, res) {
    try {
      const { page = 1, pageSize = 10, keyword = '' } = req.query;
      const offset = (page - 1) * pageSize;
      
      let sql = `
        SELECT c.*, 
        (SELECT COUNT(*) FROM goods WHERE category_id = c.id) as goods_count
        FROM category c WHERE 1=1
      `;
      let countSql = 'SELECT COUNT(*) as total FROM category WHERE 1=1';
      const params = [];
      const countParams = [];
      
      if (keyword) {
        sql += ' AND c.name LIKE ?';
        countSql += ' AND name LIKE ?';
        params.push(`%${keyword}%`);
        countParams.push(`%${keyword}%`);
      }
      
      sql += ' ORDER BY c.sort ASC, c.id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), parseInt(offset));
      
      const [list] = await db.query(sql, params);
      const [[{ total }]] = await db.query(countSql, countParams);
      
      res.json(Response.page(list, total, parseInt(page), parseInt(pageSize)));
      
    } catch (error) {
      Logger.error(`获取分类列表失败: ${error.message}`);
      res.json(Response.error('获取分类列表失败'));
    }
  }
  
  /**
   * 获取所有分类（不分页）
   */
  static async getAll(req, res) {
    try {
      const [list] = await db.query(
        'SELECT id, name, image, parent_id, sort, status FROM category WHERE status = 1 ORDER BY sort ASC'
      );
      
      res.json(Response.success(list));
      
    } catch (error) {
      Logger.error(`获取所有分类失败: ${error.message}`);
      res.json(Response.error('获取所有分类失败'));
    }
  }
  
  /**
   * 获取分类详情
   */
  static async getDetail(req, res) {
    try {
      const { id } = req.params;
      
      const [categories] = await db.query('SELECT * FROM category WHERE id = ?', [id]);
      
      if (categories.length === 0) {
        return res.json(Response.error('分类不存在'));
      }
      
      res.json(Response.success(categories[0]));
      
    } catch (error) {
      Logger.error(`获取分类详情失败: ${error.message}`);
      res.json(Response.error('获取分类详情失败'));
    }
  }
  
  /**
   * 保存分类（新增/编辑）
   */
  static async save(req, res) {
    try {
      const { id, name, image, parent_id, sort, status } = req.body;
      
      if (id) {
        // 编辑
        await db.query(
          'UPDATE category SET name = ?, image = ?, parent_id = ?, sort = ?, status = ? WHERE id = ?',
          [name, image, parent_id || 0, sort || 0, status, id]
        );
        
        Logger.info(`编辑分类成功: ${name} (ID: ${id})`);
        res.json(Response.success(null, '编辑成功'));
        
      } else {
        // 新增
        const [result] = await db.query(
          'INSERT INTO category (name, image, parent_id, sort, status) VALUES (?, ?, ?, ?, ?)',
          [name, image, parent_id || 0, sort || 0, status]
        );
        
        Logger.info(`新增分类成功: ${name} (ID: ${result.insertId})`);
        res.json(Response.success({ id: result.insertId }, '新增成功'));
      }
      
    } catch (error) {
      Logger.error(`保存分类失败: ${error.message}`);
      res.json(Response.error('保存分类失败'));
    }
  }
  
  /**
   * 删除分类
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // 检查是否有商品使用此分类
      const [[{ count }]] = await db.query(
        'SELECT COUNT(*) as count FROM goods WHERE category_id = ?',
        [id]
      );
      
      if (count > 0) {
        return res.json(Response.error('该分类下有商品，无法删除'));
      }
      
      await db.query('DELETE FROM category WHERE id = ?', [id]);
      
      Logger.info(`删除分类成功 (ID: ${id})`);
      res.json(Response.success(null, '删除成功'));
      
    } catch (error) {
      Logger.error(`删除分类失败: ${error.message}`);
      res.json(Response.error('删除分类失败'));
    }
  }
}

module.exports = CategoryController;
