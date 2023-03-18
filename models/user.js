const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v) {
          return /http(s)?:\/\/(www\.)?[a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z0-9]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(v);
        },
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email }).select('+password')
          .then((user) => {
            if (!user) {
              return Promise.reject(new Error('Пользователь не найден'));
            }
            return bcrypt.compare(password, user.password)
              .then((equal) => {
                if (equal) {
                  return user;
                }
                return Promise.reject(new Error('Пользователь не найден'));
              });
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
