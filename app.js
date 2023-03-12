const express = require('express');
const mongoose = require('mongoose');
const { errors, errorMessages } = require('./utils/errors');
const { createUser, login } = require('./controllers/users');


const { PORT = 3000 } = process.env;
const { USER_ID = '63fb79a9f342137f92baf6aa' } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: USER_ID,
  };
  next();
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(errors.NOT_FOUND).send({ message: 'Здесь рыбы нет' }));
app.use((req, res) => {
  res
    .status(errors.INTERNAL_SERVER_ERROR)
    .send({ message: errorMessages.DEFAULT_MESSAGE });
});

app.listen(PORT);
