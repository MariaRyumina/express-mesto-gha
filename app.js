const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

//слушаем 3000 порт
const {
	PORT = 3000,
	MONGO_URL='mongodb://localhost:27017/mestodb'
} = process.env; //хранит все переменные окружения, которые есть в системе

//создание приложения методом express
const app = express();

app.use(bodyParser.json()); //для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); //для приёма веб-страниц внутри POST-запроса (при false, в свойства body могут попасть только строки и массивы)

app.use((req, res, next) => {
	req.user = {
		_id: '6524209929d5df110bf9df02'
	};

	next();
});

app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
	useNewUrlParser: true
})
	.then(() => console.log('соединение с базой установлено'))
	.catch(err => console.error(`ошибка соединения с базой ${err}`));

app.listen(PORT, () => {
	// Если всё работает, консоль покажет, какой порт приложение слушает
	console.log(`App listening on port ${PORT}`)
})
