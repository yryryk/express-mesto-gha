const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      if (validator.isEmail(email)) {
        return User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
          .then((user) => res.send({ data: user }))
          .catch((err) => getError(err, res));
      }
      return res
        .status(errors.BAD_REQUEST)
        .send({ message: 'Неправильный email' });
    })
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

module.exports.login = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(errors.UNAUTORIZED)
        .send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        res
          .status(errors.NOT_FOUND)
          .send({ message: 'Этого пользователя не существует' });
      }
      res.send({ data: user });
    })
    .catch((err) => getError(err, res));
};
