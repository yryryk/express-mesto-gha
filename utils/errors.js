const mongoose = require('mongoose');

const errors = {
  BAD_REQUEST: 400,
  UNAUTORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const errorMessages = {
  VALIDATOR_MESSAGE: 'Вы ещё можете всё исправить!',
  CAST_MESSAGE: 'А был ли мальчик?',
  DEFAULT_MESSAGE: 'Шеф, всё пропало...',
};

const getError = (err, res, next) => {
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    return res
      .status(errors.BAD_REQUEST)
      .send({ message: errorMessages.VALIDATOR_MESSAGE });
  }
  return next(err);
};
module.exports = { errors, errorMessages, getError };
