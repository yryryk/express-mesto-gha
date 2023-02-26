const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  req.user = {
    _id: '63fb79a9f342137f92baf6aa',
  };
  next();
});

app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
});
