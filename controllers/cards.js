const Card = require('../models/card');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL,
  ERROR_CODE_BAD_AUTH,
} = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      res.status(ERROR_CODE_INTERNAL).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  if (req.user._id !== req.params.owner) {
    res.status(ERROR_CODE_BAD_AUTH).send({ message: 'Попытка удалить чужую карточку.' });
  } else {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        } else {
          res.send({ card });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки.' });
        } else {
          res.status(ERROR_CODE_INTERNAL).send({ message: 'Ошибка по умолчанию.' });
        }
      });
  }
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(ERROR_CODE_INTERNAL).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        res.status(ERROR_CODE_INTERNAL).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        res.status(ERROR_CODE_INTERNAL).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};
