const express = require('express');
const router = express.Router();
const AddressController = require('../../controllers/admin/addressController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/list', AddressController.list);
router.get('/detail/:id', AddressController.detail);
router.post('/save', AddressController.save);
router.delete('/delete/:id', AddressController.delete);

module.exports = router;
