const db = require('../../config/database');
const Response = require('../../utils/response');
const Logger = require('../../utils/logger');

/**
 * 商品管理控制器
 */
class GoodsController {
  /**
   * 获取商品列表
   */
  static async getList(req, res) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        keyword = '', 
        categoryId = '', 
        status = '' 
      } = req.query;
      
      const offset = (page - 1) * pageSize;
      
      let sql = `
        SELECT g.*, c.name as category_name 
        FROM goods g 
        LEFT JOIN category c ON g.category_id = c.id 
        WHERE 1=1
      `;
      let countSql = 'SELECT COUNT(*) as total FROM goods g WHERE 1=1';
      const params = [];
      const countParams = [];
      
      if (keyword) {
        sql += ' AND g.name LIKE ?';
        countSql += ' AND name LIKE ?';
        params.push(`%${keyword}%`);
        countParams.push(`%${keyword}%`);
      }
      
      if (categoryId) {
        sql += ' AND g.category_id = ?';
        countSql += ' AND category_id = ?';
        params.push(categoryId);
        countParams.push(categoryId);
      }
      
      if (status !== '') {
        sql += ' AND g.status = ?';
        countSql += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }
      
      sql += ' ORDER BY g.sort ASC, g.id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), parseInt(offset));
      
      const [list] = await db.query(sql, params);
      const [[{ total }]] = await db.query(countSql, countParams);
      
      res.json(Response.page(list, total, parseInt(page), parseInt(pageSize)));
      
    } catch (error) {
      Logger.error(`获取商品列表失败: ${error.message}`);
      res.json(Response.error('获取商品列表失败'));
    }
  }
  
  /**
   * 获取商品详情
   */
  static async getDetail(req, res) {
    try {
      const { id } = req.params;
      
      const [goods] = await db.query('SELECT * FROM goods WHERE id = ?', [id]);
      
      if (goods.length === 0) {
        return res.json(Response.error('商品不存在'));
      }
      
      // 解析图片列表
      if (goods[0].images) {
        try {
          goods[0].images = JSON.parse(goods[0].images);
        } catch (e) {
          goods[0].images = [];
        }
      }
      
      res.json(Response.success(goods[0]));
      
    } catch (error) {
      Logger.error(`获取商品详情失败: ${error.message}`);
      res.json(Response.error('获取商品详情失败'));
    }
  }
  
  /**
   * 保存商品（新增/编辑）
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
        sort,
        status,
        is_recommend,
        recommend_sort
      } = req.body;
      
      // 将图片数组转为JSON字符串
      const imagesJson = JSON.stringify(images || []);
      
      if (id) {
        // 编辑
        await db.query(
          `UPDATE goods SET 
            name = ?, main_image = ?, images = ?, price = ?, stock = ?, 
            category_id = ?, description = ?, detail = ?, sort = ?, 
            status = ?, is_recommend = ?, recommend_sort = ?
          WHERE id = ?`,
          [name, main_image, imagesJson, price, stock, category_id, description, 
           detail, sort, status, is_recommend, recommend_sort, id]
        );
        
        Logger.info(`编辑商品成功: ${name} (ID: ${id})`);
        res.json(Response.success(null, '编辑成功'));
        
      } else {
        // 新增
        const [result] = await db.query(
          `INSERT INTO goods 
            (name, main_image, images, price, stock, category_id, description, detail, 
             sort, status, is_recommend, recommend_sort) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [name, main_image, imagesJson, price, stock, category_id, description, 
           detail, sort, status, is_recommend, recommend_sort]
        );
        
        Logger.info(`新增商品成功: ${name} (ID: ${result.insertId})`);
        res.json(Response.success({ id: result.insertId }, '新增成功'));
      }
      
    } catch (error) {
      Logger.error(`保存商品失败: ${error.message}`);
      res.json(Response.error('保存商品失败'));
    }
  }
  
  /**
   * 删除商品
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      await db.query('DELETE FROM goods WHERE id = ?', [id]);
      
      Logger.info(`删除商品成功 (ID: ${id})`);
      res.json(Response.success(null, '删除成功'));
      
    } catch (error) {
      Logger.error(`删除商品失败: ${error.message}`);
      res.json(Response.error('删除商品失败'));
    }
  }
  
  /**
   * 设置商品状态（上下架）
   */
  static async setStatus(req, res) {
    try {
      const { id, status } = req.body;
      
      await db.query('UPDATE goods SET status = ? WHERE id = ?', [status, id]);
      
      Logger.info(`设置商品状态成功 (ID: ${id}, Status: ${status})`);
      res.json(Response.success(null, '设置成功'));
      
    } catch (error) {
      Logger.error(`设置商品状态失败: ${error.message}`);
      res.json(Response.error('设置商品状态失败'));
    }
  }
}

module.exports = GoodsController;
