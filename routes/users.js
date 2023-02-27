const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updatetUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updatetUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
