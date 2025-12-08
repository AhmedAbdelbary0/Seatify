class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  console.log('💥 Error: ', err.message);

  // Fall back for unexpected errors
  if (!err.statusCode) err.statusCode = 500;

  res.status(err.statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Somthing went wrong',
  });
};

module.exports = { AppError, errorHandler };
