const db = require('../../config/database');
const Response = require('../../utils/response');

class BannerController {
  /**
   * 获取轮播图列表
   */
  static async list(req, res) {
    try {
      const { page = 1, pageSize = 10, keyword, status } = req.query;
      const offset = (page - 1) * pageSize;
      
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
      
      // 查询总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM banner ${whereClause}`,
        params
      );
      const total = countResult[0].total;
      
      // 查询列表
      const [banners] = await db.query(
        `SELECT * FROM banner
         ${whereClause}
         ORDER BY sort ASC, id DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(pageSize), offset]
      );
      
      return Response.page(res, banners, total, page, pageSize);
      
    } catch (error) {
      console.error('获取轮播图列表错误:', error);
      return Response.error(res, '获取列表失败', 500);
    }
  }
  
  /**
   * 获取轮播图详情
   */
  static async detail(req, res) {
    try {
      const { id } = req.params;
      
      const [banners] = await db.query(
        'SELECT * FROM banner WHERE id = ?',
        [id]
      );
      
      if (banners.length === 0) {
        return Response.error(res, '轮播图不存在', 404);
      }
      
      return Response.success(res, banners[0]);
      
    } catch (error) {
      console.error('获取轮播图详情错误:', error);
      return Response.error(res, '获取详情失败', 500);
    }
  }
  
  /**
   * 新增/编辑轮播图
   */
  static async save(req, res) {
    try {
      const {
        id,
        name,
        image,
        link,
        link_type = 1,
        sort = 0,
        status = 1
      } = req.body;
      
      if (!image) {
        return Response.error(res, '轮播图图片不能为空', 400);
      }
      
      if (id) {
        // 更新轮播图
        await db.query(
          `UPDATE banner SET 
           name = ?, image = ?, link = ?, link_type = ?, sort = ?, status = ?
           WHERE id = ?`,
          [name, image, link, link_type, sort, status, id]
        );
        
        return Response.success(res, { id }, '更新成功');
      } else {
        // 新增轮播图
        const [result] = await db.query(
          `INSERT INTO banner (name, image, link, link_type, sort, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [name, image, link, link_type, sort, status]
        );
        
        return Response.success(res, { id: result.insertId }, '新增成功');
      }
      
    } catch (error) {
      console.error('保存轮播图错误:', error);
      return Response.error(res, '保存失败', 500);
    }
  }
  
  /**
   * 删除轮播图
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      await db.query('DELETE FROM banner WHERE id = ?', [id]);
      
      return Response.success(res, null, '删除成功');
      
    } catch (error) {
      console.error('删除轮播图错误:', error);
      return Response.error(res, '删除失败', 500);
    }
  }
  
  /**
   * 设置轮播图状态
   */
  static async setStatus(req, res) {
    try {
      const { id, status } = req.body;
      
      await db.query('UPDATE banner SET status = ? WHERE id = ?', [status, id]);
      
      return Response.success(res, null, '状态更新成功');
      
    } catch (error) {
      console.error('更新轮播图状态错误:', error);
      return Response.error(res, '状态更新失败', 500);
    }
  }
}

module.exports = BannerController;
