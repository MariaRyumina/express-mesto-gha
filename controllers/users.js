const User = require('../models/user');

const getUsers = (req, res) => {
	User.find({})
		.then(users => res.send({ data: users }))
		.catch(err => res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` }))
}

const getUserById = (req, res) => {
	User.findById(req.params.userId)
		.then(user => res.send(user))
		.catch(err => {
			if (err.message.includes('ObjectId')) {
				return res.status(404).send({ message: `Пользователь по указанному _id не найден` })
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

const createUser = (req, res) => {
	const { name, about, avatar } = req.body; // получим из объекта запроса имя, описание и аватар пользователя

	User.create({ name, about, avatar })
		.then(user => res.send({ data: user })) // вернём записанные в базу данные
		.catch(err => {
			if (err.name === 'ValidationError') {
				return res.status(400).send({ message: `Переданы некорректные данные при создании пользователя` })
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

const upgradeUserInfo = (req, res) => {
	const { name, about } = req.body;

	User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
		.then(data => res.send({ data }))
		.catch(err => {
			console.log(err)
			if (err.name === 'ValidationError') {
				return res.status(400).send({ message: `Переданы некорректные данные при обновлении профиля` })
			} else if (err.message.includes('ObjectId')) {
				return res.status(404).send({ message: `Пользователь с указанным _id не найден` })
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

const upgradeUserAvatar = (req, res) => {
	const { avatar } = req.body;

	User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
		.then( avatar => res.send({ avatar }))
		.catch(err => {
			if (err.name === 'ValidationError') {
				return res.status(400).send({message: `Переданы некорректные данные при обновлении аватара`})
			} else if (err.message.includes('ObjectId')) {
				return res.status(404).send({message: `Пользователь с указанным _id не найден`})
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

module.exports = { getUsers, getUserById, createUser, upgradeUserInfo, upgradeUserAvatar };
