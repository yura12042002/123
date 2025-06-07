module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Внутренняя ошибка сервера",
    details: err.message,
  });
};
