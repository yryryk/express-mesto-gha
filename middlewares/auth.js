const jwt = require('jsonwebtoken');
const { errors } = require('../utils/errors');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(errors.UNAUTORIZED).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '992ab2eceb0fc604c74b637713c012453bafbbf38d127957c13f46cb99b83803');
  } catch (err) {
    return res.status(errors.UNAUTORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
