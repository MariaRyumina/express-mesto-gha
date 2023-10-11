const User = require('../models/user');

const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` }));
};

const getUserById = (req, res) => {
  if (req.params.userId !== req.user._id) {
    res.status(ERROR_VALIDATION).send({ message: 'Пользователь с некорректным id' });
    return;
  }

  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message.includes('ObjectId')) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const upgradeUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } if (err.message.includes('ObjectId')) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const upgradeUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(() => res.send({ avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } if (err.message.includes('ObjectId')) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
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
