const Card = require('../models/card');

const getCard = (req, res) => {
	Card.find({})
		.then(cards => res.send({ data: cards }))
		.catch(err => res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` }))
}

const createCard = (req, res) => {
	const { name, link } = req.body;

	Card.create({ name, link, owner: req.user._id })
		.then(card => res.send({ data: card }))
		.catch(err => {
			if (err.name === 'ValidationError') {
				return res.status(400).send({ message: `Переданы некорректные данные при создании карточки` })
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

const deleteCard = (req, res) => {
	Card.findByIdAndDelete(req.params.cardId)
		.then(data => res.send({ data }))
		.catch(err => {
			if (err.message.includes('ObjectId')) {
				return res.status(404).send({ message: `Карточка с указанным _id не найдена` })
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

const likeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{ $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
		{ new: true }
	)
		.then(data => res.send({ data }))
		.catch(err => {
			if (err.name === 'ValidationError') {
				return res.status(400).send({message: `Переданы некорректные данные для постановки лайка`})
			} else if (err.message.includes('ObjectId')) {
				return res.status(404).send({message: `Передан несуществующий _id карточки`})
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

const dislikeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{ $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
		{ new: true }
	)
		.then(data => res.send({ data }))
		.catch(err => {
			if (err.name === 'ValidationError') {
				return res.status(400).send({message: `Переданы некорректные данные для снятии лайка`})
			} else if (err.message.includes('ObjectId')) {
				return res.status(404).send({message: `Передан несуществующий _id карточки`})
			} else {
				return res.status(500).send({ message: `Ошибка по умолчанию: ${err.message}` })
			}
		})
}

module.exports = { getCard, createCard, deleteCard, likeCard, dislikeCard };