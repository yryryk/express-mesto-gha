const errors = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const errorMessages = {
  VALIDATOR_MESSAGE: 'Вы ещё можете всё исправить!',
  CAST_MESSAGE: 'А был ли мальчик?',
  DEFAULT_MESSAGE: 'Шеф, всё пропало...',
};

const getError = (err, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res
      .status(errors.BAD_REQUEST)
      .send({ message: errorMessages.VALIDATOR_MESSAGE });
  }
  if (!err.name === 'InternalServerError') {
    return next(err);
  }
  return res
    .status(errors.INTERNAL_SERVER_ERROR)
    .send({ message: errorMessages.DEFAULT_MESSAGE });
};

module.exports = { errors, errorMessages, getError };
