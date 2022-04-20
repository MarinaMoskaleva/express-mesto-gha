const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUsers,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getCurrentUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
