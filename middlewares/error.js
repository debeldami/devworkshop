const ErrorResponse = require('../utils/error');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // console.log(err);

  //mongoose bad objectID error handling
  if (err.name === 'CastError') {
    const message = `Bootcamp with the id ${err.value} not found`;
    error = new ErrorResponse(message, 400);
  }

  //mongoose duplicate key error collection:
  if (err.code === 11000) {
    const message = `Bootcamp field '${JSON.stringify(err.keyValue).replace(
      /"/g,
      "'"
    )}' already exist`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  console.log(err.name);

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'server error' });
};

module.exports = errorHandler;
