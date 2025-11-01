const pool = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * 执行SQL查询
   */
  async query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  /**
   * 查找所有记录
   */
  async findAll(conditions = {}, options = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];
    const whereConditions = [];

    if (Object.keys(conditions).length > 0) {
      Object.keys(conditions).forEach(key => {
        whereConditions.push(`${key} = ?`);
        params.push(conditions[key]);
      });
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    }

    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }
    }

    return await this.query(sql, params);
  }

  /**
   * 查找单条记录
   */
  async findOne(conditions) {
    const results = await this.findAll(conditions, { limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * 根据ID查找
   */
  async findById(id) {
    return await this.findOne({ id });
  }

  /**
   * 创建记录
   */
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.execute(sql, values);
    
    return await this.findById(result.insertId);
  }

  /**
   * 更新记录
   */
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    await pool.execute(sql, [...values, id]);
    
    return await this.findById(id);
  }

  /**
   * 删除记录
   */
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await pool.execute(sql, [id]);
    return true;
  }

  /**
   * 统计数量
   */
  async count(conditions = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];
    const whereConditions = [];

    if (Object.keys(conditions).length > 0) {
      Object.keys(conditions).forEach(key => {
        whereConditions.push(`${key} = ?`);
        params.push(conditions[key]);
      });
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    const [result] = await this.query(sql, params);
    return result.count;
  }
}

module.exports = BaseModel;
