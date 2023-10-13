const express = require('express');
const mongoose = require('mongoose').default;
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

// слушаем 3000 порт
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

// создание приложения методом express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6524209929d5df110bf9df03',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('/*', (req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена' });

  next();
});

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
})
  .then(() => console.log('соединение с базой установлено'))
  .catch((err) => console.error(`ошибка соединения с базой ${err}`));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
