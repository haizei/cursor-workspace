const Cart = require('../../models/Cart');
const { success, error } = require('../../utils/response');

/**
 * 获取用户购物车
 */
async function getUserCart(req, res, next) {
  try {
    const { userId } = req.params;
    const cart = await Cart.getUserCart(userId);

    res.json(success(cart));
  } catch (err) {
    next(err);
  }
}

/**
 * 清空用户购物车
 */
async function clearCart(req, res, next) {
  try {
    const { userId } = req.params;
    await Cart.clearUserCart(userId);

    res.json(success(null, '购物车已清空'));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUserCart,
  clearCart
};
