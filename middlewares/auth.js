const jwt = require('jsonwebtoken');
const UnautorizedError = require('../utils/UnautorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    try {
      payload = jwt.verify(token, '992ab2eceb0fc604c74b637713c012453bafbbf38d127957c13f46cb99b83803');
    } catch (err) {
      throw new UnautorizedError('Необходима авторизация');
    }
  } catch (err) {
    next(err);
  }

  req.user = payload;

  next();
};
