const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const httpCode = require('../httpCode');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` }));
};

const getCurrentUser = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch((err) => {
      res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(httpCode.ERROR_VALIDATION).send({ message: 'Пользователь с некорректным id' });
        return;
      } if (err.message === 'NotFound') {
        res.status(httpCode.ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(httpCode.STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpCode.ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
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
      res.status(httpCode.ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(httpCode.ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
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
      res.status(httpCode.ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(httpCode.ERROR_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(httpCode.ERROR_SERVER).send({ message: `Ошибка по умолчанию: ${err.message}` });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
        null,
      );

      res.send({ token });
    })
    .catch(() => res.status(httpCode.ERROR_UNAUTHORIZED).send({ message: 'Требуется авторизация' }));
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  upgradeUserInfo,
  upgradeUserAvatar,
  login,
};
