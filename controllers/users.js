const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { SEKRET_KEY } = require('../constants');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const BadAuthError = require('../errors/bad-auth-err');
const ExistEmailError = require('../errors/exist-email-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequestError('Передан некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Поля email и password обязательны.');
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, password: hash, email,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(ExistEmailError('Передан уже зарегестрированный email.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'CastError') {
        next(NotFoundError('Передан некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'CastError') {
        next(NotFoundError('Передан некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SEKRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(BadAuthError('Неправильные почта или пароль.'));
    });
};

module.exports.getCurrentUsers = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(NotFoundError('Передан некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
};
