/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mydb', {
// useNewUrlParser: true,
// useCreateIndex: true,
//   useFindAndModify: false
});
app.listen(PORT, () => {
});
