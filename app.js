const express = require('express');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./utils/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError('Здесь рыбы нет');
});

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
