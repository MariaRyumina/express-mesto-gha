const User = require('../models/user');

const STATUS_CREATED = 201;
const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Пользователь с некорректным id' });
        return;
      } if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const upgradeUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (data) {
        res.send(data);
        return;
      }
      res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const upgradeUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (data) {
        res.send({ avatar });
        return;
      }
      res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  upgradeUserInfo,
  upgradeUserAvatar,
};
