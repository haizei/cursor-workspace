/**
 * 统一响应格式
 */
class Response {
  /**
   * 成功响应
   * @param {*} data 返回数据
   * @param {string} message 提示信息
   * @param {number} code 状态码
   */
  static success(data = null, message = '操作成功', code = 200) {
    return {
      code,
      message,
      data,
      success: true,
      timestamp: Date.now()
    };
  }

  /**
   * 失败响应
   * @param {string} message 错误信息
   * @param {number} code 错误码
   * @param {*} data 附加数据
   */
  static error(message = '操作失败', code = 400, data = null) {
    return {
      code,
      message,
      data,
      success: false,
      timestamp: Date.now()
    };
  }

  /**
   * 分页响应
   * @param {Array} list 数据列表
   * @param {number} total 总数
   * @param {number} page 当前页
   * @param {number} pageSize 每页条数
   */
  static page(list = [], total = 0, page = 1, pageSize = 10) {
    return this.success({
      list,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(total / pageSize)
    }, '查询成功');
  }
}

module.exports = Response;
