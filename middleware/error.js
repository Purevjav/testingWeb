const errorHandler = (err, req, res, next) => {
  console.log(err.stack.cyan.underline);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
    code: 324,
  });
};

module.exports = errorHandler;