const User = require('../models/user');
const { errors, getError } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => getError(err, res));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Этого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => getError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => getError(err, res));
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { ...req.body }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Этого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => getError(err, res));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(errors.NOT_FOUND)
          .send({ message: 'Этого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => getError(err, res));
};
