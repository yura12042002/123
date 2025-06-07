module.exports = (req, res, next) => {
  const { telegram, firstName, lastName, age, email, password } = req.body;

  if (!telegram || !firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, error: "Заполните все обязательные поля" });
  }

  if (typeof age !== "undefined" && (age < 5 || age > 100)) {
    return res.status(400).json({ success: false, error: "Недопустимый возраст" });
  }

  // Email примитивная проверка
  if (!email.includes("@")) {
    return res.status(400).json({ success: false, error: "Некорректный email" });
  }

  next();
};
