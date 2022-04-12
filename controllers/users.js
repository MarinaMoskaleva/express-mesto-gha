const User = require('../models/user');
const {ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_INTERNAL} = require('../constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные при создании пользователя."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({"_id":user._id, "name":user.name, "about":user.about, "avatar":user.avatar}))
    .catch(err => {
      if(err.name === 'CastError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({message: "Пользователь по указанному _id не найден."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    })
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные при создании пользователя."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    }
    );
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.userId, { name, about})
    .then(user => res.send({ data: user }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные при обновлении профиля."})
      }
      if(err.name === 'CastError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({message: "Пользователь по указанному _id не найден."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.userId, {avatar})
    .then(user => res.send({ data: user }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные при обновлении аватара."})
      }
      if(err.name === 'CastError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({message: "Пользователь по указанному _id не найден."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    });
};