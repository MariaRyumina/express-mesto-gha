const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

// слушаем 3000 порт
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

// создание приложения методом express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6524209929d5df110bf9df02',
  };
  next();
});

app.use('/404', (req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена' });
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
})
  .then(() => console.log('соединение с базой установлено'))
  .catch((err) => console.error(`ошибка соединения с базой ${err}`));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
