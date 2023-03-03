const Card = require('../models/card');
const { errors, getError } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => getError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => getError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Этой карточки не существует' });
      }
      return res.send({ data: card });
    })
    .catch((err) => getError(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Этой карточки не существует' });
      }
      return res.send({ data: card });
    })
    .catch((err) => getError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Этой карточки не существует' });
      }
      return res.send({ data: card });
    })
    .catch((err) => getError(err, res));
};
