/**
 * 统一响应格式
 */

class Response {
  /**
   * 成功响应
   */
  static success(res, data = null, message = '操作成功') {
    return res.json({
      code: 200,
      message,
      data
    });
  }

  /**
   * 失败响应
   */
  static error(res, message = '操作失败', code = 400, data = null) {
    return res.status(code >= 500 ? 500 : 200).json({
      code,
      message,
      data
    });
  }

  /**
   * 分页响应
   */
  static page(res, data, total, page = 1, pageSize = 10) {
    return res.json({
      code: 200,
      message: '查询成功',
      data: {
        list: data,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    });
  }

  /**
   * 未授权
   */
  static unauthorized(res, message = '未授权，请先登录') {
    return res.status(401).json({
      code: 401,
      message,
      data: null
    });
  }

  /**
   * 禁止访问
   */
  static forbidden(res, message = '无权限访问') {
    return res.status(403).json({
      code: 403,
      message,
      data: null
    });
  }
}

module.exports = Response;
