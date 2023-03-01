const errors = {
  VALIDATOR_ERROR_CODE: 400,
  CAST_ERROR_CODE: 404,
  DEFAULT_ERROR_CODE: 500,
};

const errorMessages = {
  VALIDATOR_MESSAGE: 'Вы ещё можете всё исправить!',
  CAST_MESSAGE: 'А был ли мальчик?',
  DEFAULT_MESSAGE: 'Шеф, всё пропало...',
};

const getError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res
      .status(errors.VALIDATOR_ERROR_CODE)
      .send({ message: errorMessages.VALIDATOR_MESSAGE });
  }
  if (err.name === 'CastError') {
    return res
      .status(errors.CAST_ERROR_CODE)
      .send({ message: errorMessages.CAST_MESSAGE });
  }
  return res
    .status(errors.DEFAULT_ERROR_CODE)
    .send({ message: errorMessages.DEFAULT_MESSAGE });
};

module.exports = getError;
