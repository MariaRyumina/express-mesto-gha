const express = require('express');
const mongoose = require('mongoose').default;
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const httpCode = require('./httpCode');
const auth = require('./middlewares/auth');

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/*', (req, res, next) => {
  res.status(httpCode.ERROR_NOT_FOUND).send({ message: 'Страница не найдена' });

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
