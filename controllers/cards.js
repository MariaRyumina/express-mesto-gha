const Card = require('../models/card');
const httpCode = require('../httpCode');

const getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpCode.ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => Error('NotFound'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        res.status(httpCode.ERROR_FORBIDDEN).send({ message: 'Нельзя удалять карточки других пользователей!' });
        return;
      }
      Card.findByIdAndDelete(card._id)
        .then(() => res.status(httpCode.OK_REQUEST).send({ message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(httpCode.ERROR_VALIDATION).send({ message: 'Удаление карточки с некорректным id' });
        return;
      } if (err.message === 'NotFound') {
        res.status(httpCode.ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      return res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => Error('NotFound'))
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(httpCode.ERROR_VALIDATION).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      } if (err.message === 'NotFound') {
        res.status(httpCode.ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => Error('NotFound'))
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(httpCode.ERROR_VALIDATION).send({ message: 'Переданы некорректные данные для снятии лайка' });
        return;
      } if (err.message === 'NotFound') {
        res.status(httpCode.ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
