const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  upgradeUserInfo,
  upgradeUserAvatar,
} = require('../controllers/users');

router.get('/:userId', getUserById);
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', upgradeUserInfo);
router.patch('/me/avatar', upgradeUserAvatar);

module.exports = router;
