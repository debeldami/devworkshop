const ErrorResponse = require('../utils/error');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // console.log(err);

  //mongoose bad objectID error handling
  if (err.name === 'CastError') {
    const message = `Resource with the id ${err.value} not found`;
    error = new ErrorResponse(message, 400);
  }

  //mongoose duplicate key error collection:
  if (err.code === 11000) {
    if (err.keyValue.email) {
      const message = `Resource field '${JSON.stringify(err.keyValue).replace(
        /"/g,
        "'"
      )}' already exist`;
      error = new ErrorResponse(message, 400);
    } else if (err.keyValue.bootcamp && err.keyValue.user) {
      const message = `user already rated this bootcamp`;
      error = new ErrorResponse(message, 400);
    } else {
      error = new ErrorResponse(
        `Resource field '${JSON.stringify(err.keyValue).replace(
          /"/g,
          "'"
        )}' already exist`,
        400
      );
      console.log(err.keyValue);
    }
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
