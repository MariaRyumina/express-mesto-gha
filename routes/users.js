const router = require('express').Router();

const {
  getUsers,
  getUserById,
  upgradeUserInfo,
  upgradeUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', upgradeUserInfo);
router.patch('/me/avatar', upgradeUserAvatar);

module.exports = router;
