const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const NotFoundError = require('../errors/not-found-err');

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUsers,
} = require('../controllers/users');

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required,
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.get('/', getUsers);
router.get('/me', getCurrentUsers);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers;
    }),
  }),
}), updateUserAvatar);

router.use('/', (req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

module.exports = router;
