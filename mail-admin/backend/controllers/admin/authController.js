const Admin = require('../models/Admin');
const { comparePassword, hashPassword } = require('../utils/crypto');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');

/**
 * 管理员登录
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json(error('用户名和密码不能为空', 400));
    }

    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    if (admin.status === 0) {
      return res.status(403).json(error('账号已被禁用', 403));
    }

    // 如果密码是明文admin，直接比较（用于初始化）
    // 生产环境应该使用加密密码
    let passwordValid = false;
    if (admin.password === password) {
      // 首次登录，将密码加密
      const hashedPassword = await hashPassword(password);
      await Admin.update(admin.id, { password: hashedPassword });
      passwordValid = true;
    } else {
      // 尝试使用bcrypt验证
      passwordValid = await comparePassword(password, admin.password);
    }

    if (!passwordValid) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    // 更新最后登录时间和IP
    await Admin.update(admin.id, {
      last_login_time: new Date(),
      last_login_ip: req.ip || req.connection.remoteAddress
    });

    // 生成Token
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname
    });

    res.json(success({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        avatar: admin.avatar
      }
    }, '登录成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 获取当前管理员信息
 */
async function getCurrentAdmin(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json(error('管理员不存在', 404));
    }

    res.json(success({
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname,
      avatar: admin.avatar,
      permissions: admin.permissions ? JSON.parse(admin.permissions) : []
    }));
  } catch (err) {
    next(err);
  }
}

/**
 * 修改密码
 */
async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json(error('旧密码和新密码不能为空', 400));
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json(error('管理员不存在', 404));
    }

    // 验证旧密码
    let passwordValid = false;
    if (admin.password === oldPassword) {
      passwordValid = true;
    } else {
      passwordValid = await comparePassword(oldPassword, admin.password);
    }

    if (!passwordValid) {
      return res.status(401).json(error('旧密码错误', 401));
    }

    // 加密新密码
    const hashedPassword = await hashPassword(newPassword);
    await Admin.update(admin.id, { password: hashedPassword });

    res.json(success(null, '密码修改成功'));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getCurrentAdmin,
  changePassword
};
