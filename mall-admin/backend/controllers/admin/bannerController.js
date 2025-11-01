const db = require('../../config/database');
const Response = require('../../utils/response');
const Logger = require('../../utils/logger');

/**
 * 轮播图管理控制器
 */
class BannerController {
  /**
   * 获取轮播图列表
   */
  static async getList(req, res) {
    try {
      const { page = 1, pageSize = 10, keyword = '' } = req.query;
      const offset = (page - 1) * pageSize;
      
      let sql = 'SELECT * FROM banner WHERE 1=1';
      let countSql = 'SELECT COUNT(*) as total FROM banner WHERE 1=1';
      const params = [];
      const countParams = [];
      
      if (keyword) {
        sql += ' AND name LIKE ?';
        countSql += ' AND name LIKE ?';
        params.push(`%${keyword}%`);
        countParams.push(`%${keyword}%`);
      }
      
      sql += ' ORDER BY sort ASC, id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), parseInt(offset));
      
      const [list] = await db.query(sql, params);
      const [[{ total }]] = await db.query(countSql, countParams);
      
      res.json(Response.page(list, total, parseInt(page), parseInt(pageSize)));
      
    } catch (error) {
      Logger.error(`获取轮播图列表失败: ${error.message}`);
      res.json(Response.error('获取轮播图列表失败'));
    }
  }
  
  /**
   * 获取轮播图详情
   */
  static async getDetail(req, res) {
    try {
      const { id } = req.params;
      
      const [banners] = await db.query('SELECT * FROM banner WHERE id = ?', [id]);
      
      if (banners.length === 0) {
        return res.json(Response.error('轮播图不存在'));
      }
      
      res.json(Response.success(banners[0]));
      
    } catch (error) {
      Logger.error(`获取轮播图详情失败: ${error.message}`);
      res.json(Response.error('获取轮播图详情失败'));
    }
  }
  
  /**
   * 保存轮播图（新增/编辑）
   */
  static async save(req, res) {
    try {
      const { id, name, image, link, link_type, sort, status } = req.body;
      
      if (id) {
        // 编辑
        await db.query(
          'UPDATE banner SET name = ?, image = ?, link = ?, link_type = ?, sort = ?, status = ? WHERE id = ?',
          [name, image, link, link_type, sort || 0, status, id]
        );
        
        Logger.info(`编辑轮播图成功: ${name} (ID: ${id})`);
        res.json(Response.success(null, '编辑成功'));
        
      } else {
        // 新增
        const [result] = await db.query(
          'INSERT INTO banner (name, image, link, link_type, sort, status) VALUES (?, ?, ?, ?, ?, ?)',
          [name, image, link, link_type, sort || 0, status]
        );
        
        Logger.info(`新增轮播图成功: ${name} (ID: ${result.insertId})`);
        res.json(Response.success({ id: result.insertId }, '新增成功'));
      }
      
    } catch (error) {
      Logger.error(`保存轮播图失败: ${error.message}`);
      res.json(Response.error('保存轮播图失败'));
    }
  }
  
  /**
   * 删除轮播图
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      await db.query('DELETE FROM banner WHERE id = ?', [id]);
      
      Logger.info(`删除轮播图成功 (ID: ${id})`);
      res.json(Response.success(null, '删除成功'));
      
    } catch (error) {
      Logger.error(`删除轮播图失败: ${error.message}`);
      res.json(Response.error('删除轮播图失败'));
    }
  }
  
  /**
   * 设置轮播图状态（上下架）
   */
  static async setStatus(req, res) {
    try {
      const { id, status } = req.body;
      
      await db.query('UPDATE banner SET status = ? WHERE id = ?', [status, id]);
      
      Logger.info(`设置轮播图状态成功 (ID: ${id}, Status: ${status})`);
      res.json(Response.success(null, '设置成功'));
      
    } catch (error) {
      Logger.error(`设置轮播图状态失败: ${error.message}`);
      res.json(Response.error('设置轮播图状态失败'));
    }
  }
}

module.exports = BannerController;
