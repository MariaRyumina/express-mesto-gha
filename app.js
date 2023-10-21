const express = require('express');
const mongoose = require('mongoose').default;
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');

// слушаем 3000 порт
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

// создание приложения методом express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  console.log(err);
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });

  next();
});

// подключаемся к серверу mongo
async function init() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
  });
  console.log('соединение с базой установлено');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

init();
