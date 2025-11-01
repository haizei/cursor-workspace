const { validationResult } = require('express-validator');
const Response = require('../utils/response');

/**
 * 验证中间件
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join('; ');
    return Response.error(res, errorMessages, 400);
  }
  
  next();
};

module.exports = validate;
