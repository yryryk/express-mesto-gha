const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./utils/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // за 30 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/http(s)?:\/\/(www\.)?[a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z0-9]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());

app.use('*', () => {
  throw new NotFoundError('Здесь рыбы нет');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
