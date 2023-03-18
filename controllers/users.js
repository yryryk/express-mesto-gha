const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getError } = require('../utils/errors');
const NotFoundError = require('../utils/NotFoundError');
const BadRequestError = require('../utils/BadRequestError');
const UnautorizedError = require('../utils/UnautorizedError');
const ConflictError = require('../utils/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => getError(err, next));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Этого пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => getError(err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      if (!validator.isEmail(email)) {
        throw new BadRequestError('Неправильный email');
      }
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Этот пользователь уже существует'));
      }
      return getError(err, next);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { ...req.body }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Этого пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => getError(err, next));
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Этого пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => getError(err, next));
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        '992ab2eceb0fc604c74b637713c012453bafbbf38d127957c13f46cb99b83803',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      throw new UnautorizedError('Необходима авторизация');
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Этого пользователя не существует');
      }
      res.send({ data: user });
    })
    .catch((err) => getError(err, next));
};
