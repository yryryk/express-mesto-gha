const Card = require('../models/card');
const { getError } = require('../utils/errors');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => getError(err, res, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => getError(err, res, next));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Этой карточки не существует');
      }
      if (String(req.user._id) !== String(card.owner)) {
        throw new ForbiddenError('Невозможно удалить');
      }
      card.remove()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => getError(err, res, next));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Этой карточки не существует');
      }
      res.send({ data: card });
    })
    .catch((err) => getError(err, res, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Этой карточки не существует');
      }
      res.send({ data: card });
    })
    .catch((err) => getError(err, res, next));
};
