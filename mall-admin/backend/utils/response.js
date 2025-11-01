/**
 * 统一响应格式工具
 */

class Response {
  /**
   * 成功响应
   * @param {*} data - 响应数据
   * @param {string} message - 响应消息
   */
  static success(data = null, message = '操作成功') {
    return {
      code: 200,
      success: true,
      message,
      data,
      timestamp: Date.now()
    };
  }

  /**
   * 失败响应
   * @param {string} message - 错误消息
   * @param {number} code - 错误码
   */
  static error(message = '操作失败', code = 400) {
    return {
      code,
      success: false,
      message,
      data: null,
      timestamp: Date.now()
    };
  }

  /**
   * 分页响应
   * @param {Array} list - 数据列表
   * @param {number} total - 总数
   * @param {number} page - 当前页
   * @param {number} pageSize - 每页大小
   */
  static page(list, total, page, pageSize) {
    return {
      code: 200,
      success: true,
      message: '查询成功',
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      timestamp: Date.now()
    };
  }
}

module.exports = Response;
