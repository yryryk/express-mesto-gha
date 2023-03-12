const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
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
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
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

// function findUserByCredentials(email, password) {
//   return this.findOne({ email })
//     .orFail(() => Promise.reject(new Error('Пользователь не найден')))
//     .then((user) => bcrypt.compare(password, user.password)
//       .then((equal) => {
//         if (equal) {
//           return user;
//         }
//         return Promise.reject(new Error('Пользователь не найден'));
//       }));
// }

// userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
