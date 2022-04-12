const Card = require('../models/card');
const {ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_INTERNAL} = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ cards }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные при создании карточки."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: "Пост удален." }))
    .catch(err => {
      if(err.name === 'CastError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({message: "Карточка с указанным _id не найдена."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ card }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные при создании карточки."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    });
};

module.exports.likeCard = (req, res) => {
  console.log(req.params.cardId, req.user._id);
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
  )
  .then(card => res.send({ card }))
  .catch(
    err => {
      if(err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные для постановки/снятия лайка."})
      }
      if(err.name === 'CastError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({message: "Передан несуществующий _id карточки."})
      }
      res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
    }
  );
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
  )
  .then(card => res.send({ card }))
  .catch(err => {
    if(err.name === 'ValidationError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({message: "Переданы некорректные данные для постановки/снятия лайка."})
    }
    if(err.name === 'CastError') {
      return res.status(ERROR_CODE_NOT_FOUND).send({message: "Передан несуществующий _id карточки."})
    }
    res.status(ERROR_CODE_INTERNAL).send({ message: "Ошибка по умолчанию." })
  });
}
